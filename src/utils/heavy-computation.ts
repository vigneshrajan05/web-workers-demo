// Simulate a heavy computation by performing a series of calculations
export function cpuIntensiveComputation(n: number): number {
    if (n <= 1) return n;
    return cpuIntensiveComputation(n - 1) + cpuIntensiveComputation(n - 2);
}

/**
 * @param worker Web Worker instance to perform computation
 * @param onComplete Callback function to execute when computation is complete
 * 
 * This function sends a message to the worker to start the computation and sets up a listener for the result.
 * It is designed to be used with a Web Worker to prevent blocking the main thread during heavy computations.
 * The worker will perform the computation and call the provided callback function when done.
 */
export function performComputation(worker: Worker, onComplete: () => void) {
  worker.postMessage(45); 
  worker.onmessage = function () {
    onComplete();
  };
}