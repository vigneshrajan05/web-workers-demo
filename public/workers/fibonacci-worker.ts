/**
 * Web Worker for CPU-intensive Fibonacci calculations
 * This worker demonstrates how to offload heavy computations from the main thread
 * to prevent UI blocking and maintain responsive user interface.
 */

import { cpuIntensiveComputation } from '../../src/utils/heavy-computation';

self.onmessage = function (event) {
  const n = event.data;
  const result = cpuIntensiveComputation(n);
  postMessage(result);
};