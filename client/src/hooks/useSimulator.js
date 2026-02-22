/**
 * @file hooks/useSimulator.js
 * @description Hook for simulator control and state binding.
 */

import { useCallback } from 'react';
import { startSimulation as engineStart, stopSimulation as engineStop } from '../services/simulatorEngine.js';
import { useSimulatorStore } from '../store/simulatorStore.js';
import { formatTime } from '../utils/timeUtils.js';

/**
 * @typedef {Object} SimulatorConfig
 * @property {string} targetUrl
 * @property {string} [method]
 * @property {number} [requestsPerSecond]
 * @property {number} [totalRequests]
 * @property {number} [concurrency]
 * @property {Record<string, string>} [headers]
 * @property {*} [payload]
 * @property {'constant'|'burst'|'spike'} [mode]
 */

/**
 * Provides simulator control and binds engine to store.
 */
export function useSimulator() {
  const store = useSimulatorStore.getState();
  const isRunning = useSimulatorStore((s) => s.isRunning);
  const totalRequests = useSimulatorStore((s) => s.totalRequests);

  const startSimulation = useCallback((config) => {
    const {
      targetUrl,
      method = 'GET',
      requestsPerSecond = 10,
      totalRequests: total = 100,
      concurrency = 5,
      headers = {},
      payload,
      mode = 'constant',
    } = config;

    useSimulatorStore.getState().startSimulation();
    useSimulatorStore.getState().updateStats({ totalRequests: total });

    engineStart(
      {
        targetUrl,
        method,
        requestsPerSecond,
        totalRequests: total,
        concurrency,
        headers,
        payload,
        mode,
      },
      {
        onRequestComplete: () => {},
        onEvent: (ev) => {
          const typeMap = { info: 'info', blocked: 'blocked', failed: 'failed', error: 'error' };
          useSimulatorStore.getState().addEvent({
            type: typeMap[ev.type] || 'info',
            message: ev.message,
            timestamp: ev.timestamp,
          });
        },
        onStatsUpdate: (stats) => {
          useSimulatorStore.getState().updateStats(stats);
        },
      }
    );
  }, []);

  const stopSimulation = useCallback(() => {
    engineStop();
    useSimulatorStore.getState().stopSimulation();
  }, []);

  const resetSimulation = useCallback(() => {
    engineStop();
    useSimulatorStore.getState().resetSimulation();
  }, []);

  return {
    isRunning,
    totalRequests,
    startSimulation,
    stopSimulation,
    resetSimulation,
  };
}
