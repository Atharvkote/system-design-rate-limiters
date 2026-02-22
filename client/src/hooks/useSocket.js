/**
 * @file hooks/useSocket.js
 * @description Hook for Socket.IO connection and rate limit event subscription.
 */

import { useEffect, useRef } from 'react';
import { connectSocket, disconnectSocket, subscribeToRateLimitEvents } from '../services/socketService.js';
import { useSimulatorStore } from '../store/simulatorStore.js';
import { formatTime } from '../utils/timeUtils.js';

/**
 * Connects to Socket.IO and subscribes to rate limit events.
 * Updates the Zustand store on events.
 *
 * @param {string} [socketUrl] - Server URL (default: current origin or localhost:5000)
 */
export function useSocket(socketUrl) {
  const cleanupRef = useRef(null);
  const setSocketConnected = useSimulatorStore((s) => s.setSocketConnected);
  const addEvent = useSimulatorStore((s) => s.addEvent);
  const updateLimiterStatus = useSimulatorStore((s) => s.updateLimiterStatus);

  useEffect(() => {
    const url = socketUrl || (typeof window !== 'undefined' ? window.location.origin.replace(/:\d+$/, ':5000') : 'http://localhost:5000');

    const socket = connectSocket(url, {
      onConnect: () => {
        setSocketConnected(true);
        addEvent({ type: 'info', message: `[${formatTime()}] Socket connected`, timestamp: Date.now() });
      },
      onError: (err) => {
        setSocketConnected(false);
        addEvent({ type: 'error', message: `[${formatTime()}] Socket error: ${err?.message}`, timestamp: Date.now() });
      },
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
      addEvent({ type: 'info', message: `[${formatTime()}] Socket disconnected`, timestamp: Date.now() });
    });

    cleanupRef.current = subscribeToRateLimitEvents(socket, {
      onRateLimitEvent: (data) => {
        const action = data?.action || 'unknown';
        const msg = `[${formatTime()}] Rate limit: ${action} - remaining: ${data?.remaining ?? '?'}`;
        addEvent({ type: action === 'block' ? 'blocked' : 'info', message: msg, timestamp: Date.now() });
        if (typeof data?.remaining === 'number') {
          updateLimiterStatus(data.remaining, data?.msBeforeNext ? Date.now() + data.msBeforeNext : null);
        }
      },
      onBlocked: (data) => {
        addEvent({ type: 'blocked', message: `[${formatTime()}] Request blocked (socket)`, timestamp: Date.now() });
        if (data?.remaining != null) updateLimiterStatus(data.remaining, data?.resetTime);
      },
      onAllowed: (data) => {
        addEvent({ type: 'allowed', message: `[${formatTime()}] Request allowed (socket)`, timestamp: Date.now() });
        if (data?.remaining != null) updateLimiterStatus(data.remaining, data?.resetTime);
      },
      onStatus: (data) => {
        if (data?.remaining != null) updateLimiterStatus(data.remaining, data?.resetTime);
      },
    });

    return () => {
      cleanupRef.current?.();
      disconnectSocket();
      setSocketConnected(false);
    };
  }, [socketUrl, setSocketConnected, addEvent, updateLimiterStatus]);
}
