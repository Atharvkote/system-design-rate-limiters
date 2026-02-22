import { RateLimiterRedis } from "rate-limiter-flexible";
import { getRateLimitKey } from "../utils/rateLimitKey.js";
import logger from "../utils/logger.js";

export function createUserLimiter(redisClient, config) {
  const { prefix, points, duration, blockDuration } = config;

  let limiter = null;
  if (redisClient) {
    try {
      limiter = new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: prefix,
        points,
        duration,
        ...(blockDuration != null && { blockDuration }),
      });
    } catch (err) {
      logger.warn(`User rate limiter (${prefix}) init failed:`, err.message);
    }
  }

  return (req, res, next) => {
    if (!limiter) {
      return next();
    }
    const key = getRateLimitKey(req);
    limiter
      .consume(key)
      .then(() => next())
      .catch((rej) => {
        if (rej?.remaining === 0 || rej?.msBeforeNext != null) {
          logger.warn(`Rate limit exceeded [${prefix}] key=${key}`);
          res.status(429).json({
            success: false,
            message: "Too many requests",
            retryAfter: rej?.msBeforeNext ? Math.ceil(rej.msBeforeNext / 1000) : 60,
          });
          return;
        }
        next();
      });
  };
}
