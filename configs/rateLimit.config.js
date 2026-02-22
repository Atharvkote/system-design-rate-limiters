/**
 * @file configs/rateLimit.config.js
 * @description Limit profiles for HTTP routes. All windows are per user (or apiKey/ip fallback).
 */

export const LIMIT_READ = {
  prefix: "rl_read",
  points: 100,
  duration: 60,
};

export const LIMIT_WRITE = {
  prefix: "rl_write",
  points: 30,
  duration: 60,
};

export const LIMIT_AUTH = {
  prefix: "rl_auth",
  points: 5,
  duration: 15 * 60,
  blockDuration: 15 * 60,
};

export const LIMIT_UPLOAD = {
  prefix: "rl_upload",
  points: 10,
  duration: 60 * 60,
};

export const LIMIT_HEAVY = {
  prefix: "rl_heavy",
  points: 2,
  duration: 5 * 60,
};

export const LIMIT_PUBLIC = {
  prefix: "rl_public",
  points: 300,
  duration: 60,
};
