/**
 * @file utils/rateLimitKey.js
 * @description Central key strategy for rate limiting. Used by HTTP and Socket.IO limiters.
 * Fallback order: userId → apiKey → ip (never IP-only).
 */

/**
 * Returns a stable rate-limit key for the request.
 * Priority: authenticated user id > x-api-key header > IP.
 * @param {import('express').Request} req - Express request
 * @returns {string} Key in form `user:{id}`, `api:{key}`, or `ip:{ip}`
 */

export function getRateLimitKey(req) {
  if (req.user?.id) {
    return `user:${req.user.id}`;
  }
  const apiKey = req.get?.("x-api-key") || req.headers?.["x-api-key"];
  if (apiKey) {
    return `api:${apiKey}`;
  }
  return `ip:${req.ip || req.socket?.remoteAddress || "unknown"}`;
}
