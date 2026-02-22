/**
 * @file store/simulatorStore.js
 * @description Zustand store for simulator state and actions.
 */

import { create } from 'zustand';

const MAX_EVENTS = 500;
const MAX_CHART_POINTS = 120;

/**
 * @typedef {Object} LogEvent
 * @property {string} id
 * @property {string} type - 'allowed' | 'blocked' | 'failed' | 'info' | 'error'
 * @property {string} message
 * @property {number} timestamp
 */

/**
 * @typedef {Object} ChartDataPoint
 * @property {number} time
 * @property {string} label
 * @property {number} allowed
 * @property {number} blocked
 * @property {number} failed
 */

/**
 * @typedef {Object} SimulatorState
 * @property {boolean} isRunning
 * @property {number} totalRequests
 * @property {number} requestsSent
 * @property {number} requestsSuccess
 * @property {number} requestsBlocked
 * @property {number} requestsFailed
 * @property {number} requestsRemaining
 * @property {number} avgResponseTime
 * @property {number} currentRps
 * @property {number} remainingTokens
 * @property {number|null} resetTime
 * @property {boolean} socketConnected
 * @property {LogEvent[]} eventsLog
 * @property {ChartDataPoint[]} chartData
 */

/**
 * @typedef {Object} SimulatorActions
 * @property {() => void} startSimulation
 * @property {() => void} stopSimulation
 * @property {(event: Omit<LogEvent, 'id'>) => void} addEvent
 * @property {(stats: Partial<SimulatorState>) => void} updateStats
 * @property {(remaining: number, resetTime?: number) => void} updateLimiterStatus
 * @property {(connected: boolean) => void} setSocketConnected
 * @property {() => void} resetSimulation
 */

/** @type {import('zustand').StoreApi<SimulatorState & SimulatorActions>} */
export const useSimulatorStore = create((set, get) => ({
  isRunning: false,
  totalRequests: 100,
  requestsSent: 0,
  requestsSuccess: 0,
  requestsBlocked: 0,
  requestsFailed: 0,
  requestsRemaining: 0,
  avgResponseTime: 0,
  currentRps: 0,
  remainingTokens: 0,
  resetTime: null,
  socketConnected: false,
  eventsLog: [],
  chartData: [],

  startSimulation: () => set({ isRunning: true }),
  stopSimulation: () => set({ isRunning: false }),

  addEvent: (event) =>
    set((state) => {
      const newEvent = {
        ...event,
        id: `${event.timestamp}-${Math.random().toString(36).slice(2, 9)}`,
      };
      const eventsLog = [newEvent, ...state.eventsLog].slice(0, MAX_EVENTS);
      return { eventsLog };
    }),

  updateStats: (stats) =>
    set((state) => {
      // Map engine stats (totalSent/totalSuccess/...) into store fields
      const mapped = { ...stats };

      if (typeof stats.totalSent === 'number') {
        mapped.requestsSent = stats.totalSent;
      }
      if (typeof stats.totalSuccess === 'number') {
        mapped.requestsSuccess = stats.totalSuccess;
      }
      if (typeof stats.totalBlocked === 'number') {
        mapped.requestsBlocked = stats.totalBlocked;
      }
      if (typeof stats.totalFailed === 'number') {
        mapped.requestsFailed = stats.totalFailed;
      }

      const next = { ...state, ...mapped };
      const now = Date.now();
      const lastPoint = state.chartData[state.chartData.length - 1];
      const bucket = Math.floor(now / 1000) * 1000;

      let chartData = state.chartData;
      if (!lastPoint || lastPoint.time !== bucket) {
        chartData = [
          ...state.chartData,
          {
            time: bucket,
            label: new Date(bucket).toLocaleTimeString(),
            allowed: next.requestsSuccess,
            blocked: next.requestsBlocked,
            failed: next.requestsFailed,
          },
        ].slice(-MAX_CHART_POINTS);
      } else {
        chartData = chartData.slice();
        const last = chartData[chartData.length - 1];
        last.allowed = next.requestsSuccess;
        last.blocked = next.requestsBlocked;
        last.failed = next.requestsFailed;
      }

      return {
        ...next,
        chartData,
        requestsRemaining: Math.max(0, (next.totalRequests || 0) - next.requestsSent),
      };
    }),

  updateLimiterStatus: (remaining, resetTime) =>
    set({ remainingTokens: remaining, resetTime: resetTime ?? null }),

  setSocketConnected: (connected) => set({ socketConnected: connected }),

  resetSimulation: () =>
    set({
      isRunning: false,
      requestsSent: 0,
      requestsSuccess: 0,
      requestsBlocked: 0,
      requestsFailed: 0,
      requestsRemaining: 0,
      avgResponseTime: 0,
      currentRps: 0,
      eventsLog: [],
      chartData: [],
    }),
}));
