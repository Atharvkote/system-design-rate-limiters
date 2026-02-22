/**
 * @file utils/timeUtils.js
 * @description Time formatting utilities for the simulator.
 */

/**
 * Formats a timestamp to HH:mm:ss.SSS
 * @param {number} [timestamp=Date.now()]
 * @returns {string}
 */
export function formatTime(timestamp = Date.now()) {
  const d = new Date(timestamp);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  const ms = String(d.getMilliseconds()).padStart(3, '0');
  return `${h}:${m}:${s}.${ms}`;
}

/**
 * Formats duration in milliseconds to human-readable string.
 * @param {number} ms
 * @returns {string}
 */
export function formatDuration(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}m`;
}
