/**
 * @file utils/requestBatcher.js
 * @description Batches requests for high-throughput simulation without blocking the main thread.
 * Uses micro-tasks and scheduling to avoid browser freezing.
 */

/**
 * Schedules a batch of work items to be processed with controlled concurrency.
 * Yields to the event loop between batches to prevent UI freezing.
 *
 * @param {Array<T>} items - Items to process
 * @param {number} concurrency - Max concurrent operations
 * @param {(item: T, index: number) => Promise<R>} processor - Async processor
 * @param {() => boolean} shouldStop - Returns true to abort
 * @returns {Promise<R[]>}
 * @template T, R
 */
export async function processBatched(items, concurrency, processor, shouldStop) {
  const results = [];
  let index = 0;

  async function runWorker() {
    while (index < items.length && !shouldStop()) {
      const currentIndex = index++;
      const item = items[currentIndex];
      try {
        const result = await processor(item, currentIndex);
        results[currentIndex] = result;
      } catch (err) {
        results[currentIndex] = { error: err };
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => runWorker());
  await Promise.all(workers);
  return results;
}

/**
 * Creates evenly spaced batches for a given RPS over a duration.
 * @param {number} requestsPerSecond
 * @param {number} totalRequests
 * @param {number} concurrency
 * @returns {{ batchSize: number; intervalMs: number; batches: number }}
 */
export function computeBatchSchedule(requestsPerSecond, totalRequests, concurrency) {
  const batchSize = Math.max(1, Math.min(concurrency, Math.ceil(requestsPerSecond / 4)));
  const batchesPerSecond = requestsPerSecond / batchSize;
  const intervalMs = batchesPerSecond > 0 ? 1000 / batchesPerSecond : 100;
  const batches = Math.ceil(totalRequests / batchSize);
  return { batchSize, intervalMs, batches };
}
