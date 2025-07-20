"use client";
import React, { useState, useEffect } from 'react';

export default function TranslationDisplay() {
  const [translations, setTranslations] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);

  // Function to add new translation (this would be called from the chatbot)
  const addTranslation = (region: string, translatedText: string) => {
    const newTranslation = {
      id: Date.now(),
      region,
      translatedText,
      timestamp: new Date().toLocaleTimeString()
    };
    setTranslations(prev => [newTranslation, ...prev.slice(0, 9)]); // Keep last 10
  };

  // Simulate receiving translations (for demo)
  const simulateTranslation = () => {
    const samples = [
      { region: "French", translatedText: "Hello, how are you?" },
      { region: "Spanish", translatedText: "Good morning, what's your name?" },
      { region: "Hindi", translatedText: "Thank you very much" },
      { region: "German", translatedText: "Where is the train station?" },
      { region: "Japanese", translatedText: "Nice to meet you" }
    ];
    
    const sample = samples[Math.floor(Math.random() * samples.length)];
    addTranslation(sample.region, sample.translatedText);
  };

  useEffect(() => {
    // Listen for messages from the chatbot page
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'TRANSLATION') {
        addTranslation(event.data.region, event.data.translatedText);
        setIsLive(true);
        setTimeout(() => setIsLive(false), 2000);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              🌍 Translation Display
            </h1>
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-600">
                {isLive ? 'Live Translation' : 'Waiting for messages...'}
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">
            This shows the <strong>region</strong> and <strong>translated text</strong> from chatbot messages.
            Go to <code className="bg-gray-100 px-2 py-1 rounded">/chatbot</code> and type in any language to see translations appear here.
          </p>

          <button
            onClick={simulateTranslation}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-6"
          >
            🎮 Simulate Translation (Demo)
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📝 Translation History ({translations.length})
          </h2>

          {translations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🔄</div>
              <p className="text-lg mb-2">No translations yet</p>
              <p className="text-sm">
                Open <a href="/chatbot" className="text-blue-600 hover:underline" target="_blank">/chatbot</a> and send a message in any language
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {translations.map((translation) => (
                <div
                  key={translation.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {translation.region}
                        </span>
                        <span className="text-xs text-gray-500">{translation.timestamp}</span>
                      </div>
                      <p className="text-gray-900 font-medium">
                        "{translation.translatedText}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            📍 Where to Find Translated Text:
          </h3>
          <div className="space-y-3 text-yellow-700">
            <div className="flex items-start gap-2">
              <span className="font-semibold">1. Browser Console:</span>
              <span>Press F12 → Console tab while using the chatbot</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold">2. Server Terminal:</span>
              <span>Check your terminal where the server is running</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold">3. This Page:</span>
              <span>Real-time display of translations (when connected)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold">4. Network Tab:</span>
              <span>F12 → Network → Look for "/api/translated-messages" requests</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            📊 JSON Format Being Sent:
          </h3>
          <pre className="bg-green-100 p-4 rounded-lg text-sm text-green-800 overflow-x-auto">
{`{
  "region": "French",
  "translatedText": "Hello, how are you?"
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
