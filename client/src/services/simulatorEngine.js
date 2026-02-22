/**
 * @file services/simulatorEngine.js
 * @description High-performance request engine for rate limiter simulation.
 * Uses batching and async scheduling to avoid browser freezing.
 */

import { createApiClient, executeRequest } from './apiClient.js';
import { computeBatchSchedule } from '../utils/requestBatcher.js';
import { formatTime } from '../utils/timeUtils.js';

/** @typedef {'constant' | 'burst' | 'spike'} SimulationMode */

/**
 * @typedef {Object} SimulatorConfig
 * @property {string} targetUrl
 * @property {string} [method='GET']
 * @property {number} [requestsPerSecond=10]
 * @property {number} [totalRequests=100]
 * @property {number} [concurrency=5]
 * @property {Record<string, string>} [headers]
 * @property {*} [payload]
 * @property {SimulationMode} [mode='constant']
 */

/**
 * @typedef {Object} SimulatorCallbacks
 * @property {(result: import('./apiClient.js').RequestResult, index: number) => void} [onRequestComplete]
 * @property {(event: { type: string; message: string; timestamp: number }) => void} [onEvent]
 * @property {(stats: SimulatorStats) => void} [onStatsUpdate]
 */

/**
 * @typedef {Object} SimulatorStats
 * @property {number} totalSent
 * @property {number} totalSuccess
 * @property {number} totalBlocked
 * @property {number} totalFailed
 * @property {number} avgResponseTime
 * @property {number} currentRps
 * @property {number} elapsedMs
 */

/** @type {ReturnType<typeof setInterval> | null} */
let intervalId = null;
/** @type {AbortController | null} */
let abortController = null;

/**
 * Starts the simulation.
 * @param {SimulatorConfig} config
 * @param {SimulatorCallbacks} callbacks
 * @returns {Promise<void>}
 */
export async function startSimulation(config, callbacks) {
  stopSimulation();

  const {
    targetUrl,
    method = 'GET',
    requestsPerSecond = 10,
    totalRequests = 100,
    concurrency = 5,
    headers = {},
    payload,
    mode = 'constant',
  } = config;

  const { onRequestComplete, onEvent, onStatsUpdate } = callbacks;

  if (!targetUrl?.trim()) {
    onEvent?.({ type: 'error', message: 'Target URL is required', timestamp: Date.now() });
    return;
  }

  abortController = new AbortController();
  const shouldStop = () => abortController?.signal.aborted ?? true;

  const client = createApiClient({
    baseURL: '',
    timeout: 8000,
    headers,
  });

  const stats = {
    totalSent: 0,
    totalSuccess: 0,
    totalBlocked: 0,
    totalFailed: 0,
    responseTimes: [],
    startTime: Date.now(),
    lastSecondCount: 0,
    lastSecondTime: Date.now(),
  };

  const emitEvent = (type, message) => {
    const ev = { type, message, timestamp: Date.now() };
    onEvent?.(ev);
  };

  emitEvent('info', `Starting simulation: ${method} ${targetUrl}`);
  emitEvent('info', `Mode: ${mode}, RPS: ${requestsPerSecond}, Total: ${totalRequests}, Concurrency: ${concurrency}`);

  let effectiveRps = requestsPerSecond;
  let effectiveConcurrency = concurrency;
  if (mode === 'burst') {
    effectiveRps = Math.min(200, requestsPerSecond * 2);
    effectiveConcurrency = Math.min(50, concurrency * 2);
  } else if (mode === 'spike') {
    effectiveRps = Math.min(200, Math.floor(requestsPerSecond * 1.5));
  }

  const { batchSize, intervalMs, batches } = computeBatchSchedule(
    effectiveRps,
    totalRequests,
    effectiveConcurrency
  );

  let batchIndex = 0;
  const runBatch = async () => {
    if (shouldStop() || stats.totalSent >= totalRequests) {
      return;
    }

    const toSend = Math.min(batchSize, totalRequests - stats.totalSent);
    const requests = Array.from({ length: toSend }, (_, i) => stats.totalSent + i);

    for (const idx of requests) {
      if (shouldStop()) break;
      stats.totalSent++;

      const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000';
      const url = targetUrl.startsWith('http') ? targetUrl : (targetUrl.startsWith('/') ? `${base}${targetUrl}` : `${base}/${targetUrl}`);

      try {
        const result = await executeRequest(client, url, method, payload);
        stats.responseTimes.push(result.responseTime);

        if (result.success) {
          stats.totalSuccess++;
          onRequestComplete?.(result, idx);
        } else if (result.blocked) {
          stats.totalBlocked++;
          emitEvent('blocked', `[${formatTime()}] Request blocked (429)`);
          onRequestComplete?.(result, idx);
        } else {
          stats.totalFailed++;
          emitEvent('failed', `[${formatTime()}] Request failed (${result.statusCode || 'network error'})`);
          onRequestComplete?.(result, idx);
        }
      } catch (err) {
        stats.totalFailed++;
        emitEvent('failed', `[${formatTime()}] Request error: ${err?.message || 'Unknown'}`);
        onRequestComplete?.({ success: false, blocked: false, failed: true, responseTime: 0, error: err }, idx);
      }
    }

    batchIndex++;
    const elapsedMs = Date.now() - stats.startTime;
    const recentCount = stats.totalSent - stats.lastSecondCount;
    const recentElapsed = (Date.now() - stats.lastSecondTime) / 1000;
    const currentRps = recentElapsed > 0 ? recentCount / recentElapsed : 0;

    if (batchIndex % 4 === 0) {
      stats.lastSecondCount = stats.totalSent;
      stats.lastSecondTime = Date.now();
    }

    const avgResponseTime = stats.responseTimes.length > 0
      ? stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length
      : 0;

    onStatsUpdate?.({
      totalSent: stats.totalSent,
      totalSuccess: stats.totalSuccess,
      totalBlocked: stats.totalBlocked,
      totalFailed: stats.totalFailed,
      avgResponseTime,
      currentRps,
      elapsedMs,
    });

    if (stats.totalSent >= totalRequests) {
      emitEvent('info', `Simulation complete. Sent: ${stats.totalSent}, Allowed: ${stats.totalSuccess}, Blocked: ${stats.totalBlocked}, Failed: ${stats.totalFailed}`);
      stopSimulation();
    }
  };

  const scheduleBatch = () => {
    if (shouldStop() || stats.totalSent >= totalRequests) {
      return;
    }
    runBatch();
  };

  intervalId = setInterval(scheduleBatch, intervalMs);
  runBatch();
}

/**
 * Stops the simulation.
 */
export function stopSimulation() {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

/**
 * Returns whether the simulation is currently running.
 * @returns {boolean}
 */
export function isSimulationRunning() {
  return intervalId != null && !abortController?.signal.aborted;
}
