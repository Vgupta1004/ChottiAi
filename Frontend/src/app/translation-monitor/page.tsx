"use client";
import React, { useState, useEffect } from 'react';

export default function TranslationMonitor() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // This would be better with WebSockets, but for now we'll use polling
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/translated-messages');
        if (response.ok) {
          setIsConnected(true);
        }
      } catch (error) {
        setIsConnected(false);
        console.error('Connection check failed:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const testAPI = async () => {
    try {
      const response = await fetch('/api/translated-messages');
      const data = await response.json();
      console.log('API Test Response:', data);
      
      setLogs(prev => [...prev, {
        type: 'API_TEST',
        timestamp: new Date().toISOString(),
        data: data
      }]);
    } catch (error) {
      console.error('API test failed:', error);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Translation Monitor</h1>
          <p className="text-gray-600 mb-4">
            This page monitors translated messages from the chatbot at{' '}
            <code className="bg-gray-200 px-2 py-1 rounded">http://localhost:3000/chatbot</code>
          </p>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                API Status: {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <button
              onClick={testAPI}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Test API
            </button>
            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Clear Logs
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Translation Logs ({logs.length})
          </h2>
          
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg mb-2">No translations received yet</p>
              <p className="text-sm">
                Go to{' '}
                <a 
                  href="/chatbot" 
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  /chatbot
                </a>
                {' '}and send a message to see translations here
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {logs.slice().reverse().map((log, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {log.type || 'TRANSLATION'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <pre className="text-sm bg-gray-50 p-3 rounded overflow-x-auto">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">How to Test</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Start your development server: <code className="bg-blue-100 px-2 py-1 rounded">npm run dev</code></li>
            <li>Open the chatbot page: <code className="bg-blue-100 px-2 py-1 rounded">http://localhost:3000/chatbot</code></li>
            <li>Type a message in any language (French, Spanish, Hindi, etc.)</li>
            <li>Watch this monitor page to see the JSON translation output</li>
            <li>Check your browser console (F12) for detailed logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
