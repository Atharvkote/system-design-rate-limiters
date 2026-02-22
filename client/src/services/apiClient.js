/**
 * @file services/apiClient.js
 * @description Axios-based API client for simulator requests with structured response handling.
 */

import axios from 'axios';

const DEFAULT_TIMEOUT = 10000;

/**
 * @typedef {Object} RequestResult
 * @property {boolean} success - Request succeeded (2xx)
 * @property {boolean} blocked - Request was rate limited (429)
 * @property {boolean} failed - Request failed (network, timeout, other error)
 * @property {number} responseTime - Response time in ms
 * @property {number} [statusCode] - HTTP status code
 * @property {Error} [error] - Error if failed
 */

/**
 * Creates an Axios instance for simulator requests.
 * @param {Object} options
 * @param {string} [options.baseURL]
 * @param {number} [options.timeout=10000]
 * @param {Record<string, string>} [options.headers]
 * @returns {import('axios').AxiosInstance}
 */
export function createApiClient({ baseURL = '', timeout = DEFAULT_TIMEOUT, headers = {} } = {}) {
  return axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    validateStatus: () => true, // Never throw on status
  });
}

/**
 * Executes a single request and returns a structured result.
 * @param {import('axios').AxiosInstance} client
 * @param {string} url - Full URL or path
 * @param {string} method - HTTP method
 * @param {*} [payload]
 * @returns {Promise<RequestResult>}
 */
export async function executeRequest(client, url, method = 'GET', payload = undefined) {
  const start = performance.now();
  try {
    const config = { method, url };
    if (payload !== undefined && ['POST', 'PUT', 'PATCH'].includes(method)) {
      config.data = payload;
    }
    const response = await client.request(config);
    const responseTime = performance.now() - start;
    const statusCode = response?.status ?? 0;

    const blocked = statusCode === 429;
    const success = statusCode >= 200 && statusCode < 300;

    return {
      success,
      blocked,
      failed: !success && !blocked,
      responseTime,
      statusCode,
    };
  } catch (error) {
    const responseTime = performance.now() - start;
    const is429 = error?.response?.status === 429;

    return {
      success: false,
      blocked: is429,
      failed: !is429,
      responseTime,
      statusCode: error?.response?.status,
      error,
    };
  }
}
