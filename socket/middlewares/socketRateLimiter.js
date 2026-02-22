import { RateLimiterRedis } from "rate-limiter-flexible";
import logger from "../../utils/logger.js";

export const SOCKET_EVENT_LIMITS = {
  "chat:message": { points: 20, duration: 10 },
  "chat:typing": { points: 60, duration: 60 },
  "notifications:pull": { points: 5, duration: 60 },
};

export function createSocketRateLimiters(redisClient, eventLimits = SOCKET_EVENT_LIMITS) {
  const limiters = new Map();
  if (!redisClient) return limiters;

  for (const [event, { points, duration }] of Object.entries(eventLimits)) {
    try {
      const limiter = new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: `socket:${event}`,
        points,
        duration,
      });
      limiters.set(event, limiter);
    } catch (err) {
      logger.warn(`Socket rate limiter for ${event} init failed:`, err.message);
    }
  }
  return limiters;
}


export function getSocketRateLimitKey(socket) {
  return socket.user?.id ?? socket.id;
}

export function checkSocketRateLimit(limiters, socket, eventName, onExceed, next) {
  const limiter = limiters.get(eventName);
  if (!limiter) {
    next();
    return;
  }
  const key = getSocketRateLimitKey(socket);
  limiter
    .consume(key)
    .then(() => next())
    .catch((rej) => {
      if (rej?.remaining === 0 || rej?.msBeforeNext != null) {
        logger.warn(`Socket rate limit exceeded event=${eventName} identity=${key}`);
        onExceed();
        return;
      }
      next();
    });
}
