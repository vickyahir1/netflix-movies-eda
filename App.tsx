
import React, { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import Loader from './components/Loader';
import type { AnalysisResult } from './types';
import { analyzeNetflixData } from './services/geminiService';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvData = e.target?.result as string;
      if (!csvData) {
        setError("Failed to read the file.");
        setIsLoading(false);
        return;
      }

      try {
        const result = await analyzeNetflixData(csvData);
        setAnalysisResult(result);
      } catch (err) {
        console.error("Analysis failed:", err);
        setError("Failed to analyze the data. The dataset might be in an unexpected format, or there was an issue with the analysis service. Please try a different file.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
        setError("Error reading file.");
        setIsLoading(false);
    }
    reader.readAsText(file);
  }, []);
  
  const handleReset = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="py-6 px-4 sm:px-8 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-pink-400 tracking-wider uppercase">
            Netflix EDA
          </h1>
          {analysisResult && (
             <button
              onClick={handleReset}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-md text-white font-semibold transition-colors duration-300"
            >
              Analyze New Data
            </button>
          )}
        </div>
      </header>

      <main className="p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {!analysisResult && !isLoading && !error && (
            <FileUpload onFileUpload={handleFileUpload} />
          )}

          {isLoading && <Loader />}

          {error && !isLoading && (
            <div className="text-center py-20 px-6">
                <div className="bg-gray-800 border border-pink-500/50 rounded-lg p-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-pink-500 mb-4">An Error Occurred</h2>
                    <p className="text-gray-300">{error}</p>
                    <button
                        onClick={handleReset}
                        className="mt-6 px-5 py-2.5 bg-pink-500 hover:bg-pink-600 rounded-md text-white font-semibold transition-colors duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
          )}

          {analysisResult && !isLoading && <Dashboard data={analysisResult} />}
        </div>
      </main>
    </div>
  );
};

export default App;
