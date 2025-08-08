import { useEffect, useRef, useState } from 'react';
import type { AnalysisResult } from './types/Customer';
import { analyzeCustomerData } from './utils/validation';
import FileUpload from './components/FileUpload';
import SummaryStats from './components/SummaryStats';
import CustomerTable from './components/CustomerTable';
import { performComputation } from './utils/heavy-computation';

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);


  // Interactive elements to demonstrate UI freezing
  const [counter, setCounter] = useState(0);
  const [clickCounter, setClickCounter] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    // Initialize the Web Worker
    workerRef.current = new Worker(new URL('../public/workers/fibonacci-worker.ts', import.meta.url), { type: 'module' });

    // setInterval to update the counter every second
    const interval = setInterval(() => {
      setCounter(prev => prev + 1);
    }, 1000);

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      clearInterval(interval);
    };
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        throw new Error('JSON file must contain an array of customer records');
      }

      const result = analyzeCustomerData(data);
      if (workerRef.current) {
        performComputation(workerRef.current, () => {
          setAnalysisResult(result);
          setIsLoading(false);
        });
      } else {
        throw new Error('Worker not initialized');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Credit Risk Analyzer using Web Workers
          </h1>
          <p className="text-lg text-gray-600">
            Upload a JSON file containing customer records to analyze the data
          </p>
        </div>

        {/* Interactive Demo Section */}
        <div className={`bg-white rounded-lg shadow-md p-6 mb-8 transition-all duration-300`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timer */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Live Timer</h3>
              <p className="text-2xl font-bold text-blue-700">{counter}</p>
            </div>

            {/* Click Counter */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">Click Counter</h3>
              <p className="text-2xl font-bold text-green-700 mb-2">{clickCounter}</p>
              <button
                onClick={() => setClickCounter(prev => prev + 1)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Count++
              </button>
            </div>

            {/* Text Input */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-2">Text Input</h3>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type something..."
                className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="mt-2 text-sm text-purple-700">You typed: {inputValue}</p>
            </div>

            {/* Toggle Button */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium text-orange-900 mb-2">Toggle Button</h3>
              <button
                onClick={() => setIsToggled(!isToggled)}
                className={`px-4 py-2 rounded transition-colors ${isToggled
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-200 text-orange-800 hover:bg-orange-300'
                  }`}
              >
                {isToggled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {analysisResult && (
          <>
            <SummaryStats result={analysisResult} />
            <CustomerTable customers={analysisResult.customers} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
