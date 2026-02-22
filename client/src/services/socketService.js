/**
 * @file services/socketService.js
 * @description Socket.IO client service for real-time rate limiter telemetry.
 */

import { io } from 'socket.io-client';

/** @type {import('socket.io-client').Socket | null} */
let socket = null;

/**
 * Connects to the Socket.IO server.
 * @param {string} url - Server URL (e.g. http://localhost:5000)
 * @param {Object} [options]
 * @param {(socket: import('socket.io-client').Socket) => void} [options.onConnect]
 * @param {(err: Error) => void} [options.onError]
 * @param {Object} [options.auth] - Auth payload for handshake
 * @returns {import('socket.io-client').Socket}
 */
export function connectSocket(url, { onConnect, onError, auth = {} } = {}) {
  if (socket?.connected) {
    return socket;
  }

  const serverUrl = url?.replace(/\/$/, '') || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');
  socket = io(serverUrl, {
    path: '/socket.io',
    transports: ['polling', 'websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
    auth,
  });

  socket.on('connect', () => {
    onConnect?.(socket);
  });

  socket.on('connect_error', (err) => {
    onError?.(err);
  });

  return socket;
}

/**
 * Disconnects the socket.
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Returns the current socket instance.
 * @returns {import('socket.io-client').Socket | null}
 */
export function getSocket() {
  return socket;
}

/**
 * Registers listeners for rate limit events.
 * Supports both user-specified and README event names.
 *
 * @param {import('socket.io-client').Socket} sock
 * @param {Object} handlers
 * @param {(data: *) => void} [handlers.onRateLimitEvent]
 * @param {(data: *) => void} [handlers.onBlocked]
 * @param {(data: *) => void} [handlers.onAllowed]
 * @param {(data: *) => void} [handlers.onStatus]
 * @returns {() => void} Cleanup function to remove listeners
 */
export function subscribeToRateLimitEvents(sock, handlers) {
  if (!sock) return () => {};

  const { onRateLimitEvent, onBlocked, onAllowed, onStatus } = handlers;

  const events = [
    ['rate-limit-event', onRateLimitEvent],
    ['rateLimit:action', onRateLimitEvent],
    ['rate-limit-blocked', onBlocked],
    ['rate-limit-allowed', onAllowed],
    ['rate-limit-status', onStatus],
  ];

  events.forEach(([event, handler]) => {
    if (handler) sock.on(event, handler);
  });

  return () => {
    events.forEach(([event, handler]) => {
      if (handler) sock.off(event);
    });
  };
}
