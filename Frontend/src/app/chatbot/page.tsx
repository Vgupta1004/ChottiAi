// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import ReactMarkdown from 'react-markdown';

// // TypeScript declarations for Web Speech API
// // (if not already present)
// declare global {
//   interface Window {
//     SpeechRecognition: any;
//     webkitSpeechRecognition: any;
//   }
// }

// // Utility: Minimal language detection for Indian languages and English
// function detectLang(text: string): string {
//   if (/\p{Script=Devanagari}/u.test(text)) return 'hi-IN';
//   if (/\p{Script=Tamil}/u.test(text)) return 'ta-IN';
//   if (/\p{Script=Bengali}/u.test(text)) return 'bn-IN';
//   if (/\p{Script=Telugu}/u.test(text)) return 'te-IN';
//   if (/\p{Script=Kannada}/u.test(text)) return 'kn-IN';
//   if (/\p{Script=Malayalam}/u.test(text)) return 'ml-IN';
//   if (/\p{Script=Gujarati}/u.test(text)) return 'gu-IN';
//   if (/\p{Script=Gurmukhi}/u.test(text)) return 'pa-IN';
//   if (/\p{Script=Oriya}/u.test(text)) return 'or-IN';
//   if (/^[\x00-\x7F\s]+$/.test(text)) return 'en-IN';
//   return 'en-IN';
// }

// export default function ChatbotPage() {

//   // const backendUrl = "https://chottiai-backend.onrender.com";
//   // const backendUrl = "https://chottiai-production.up.railway.app";
//   const backendUrl = process.env.NEXT_PUBLIC_RAILWAY_BACKEND_URL || "http://localhost:8000";
  

//   const [messages, setMessages] = useState([
//     { from: "bot", text: "Hi! I am ChottiAI. How can I help you today?", image: undefined as string[] | undefined },
//   ]);
//   const [input, setInput] = useState("");
//   const [isListening, setIsListening] = useState(false);
//   const [transcript, setTranscript] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [ttsStatus, setTtsStatus] = useState<'idle' | 'playing' | 'paused'>("idle");
//   const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
//   const [selectedVoice, setSelectedVoice] = useState<string>("");
//   const recognitionRef = useRef<any>(null);
//   const chatRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();
//   const [preferredLang, setPreferredLang] = useState<string>('en-IN');
//   // Remove useSearchParams and URL lang logic

//   // Speech-to-Text (Voice Input) states
//   const [voiceLanguage, setVoiceLanguage] = useState('en-IN');
//   const [isSupported, setIsSupported] = useState(true);
//   const [recognition, setRecognition] = useState<any>(null);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   const voiceLanguages = [
//     { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
//     { code: 'hi-IN', name: 'Hindi (India)', flag: '🇮🇳' },
//     { code: 'ta-IN', name: 'Tamil (India)', flag: '🇮🇳' },
//     { code: 'bn-IN', name: 'Bengali (India)', flag: '🇮🇳' },
//     { code: 'te-IN', name: 'Telugu (India)', flag: '🇮🇳' },
//     { code: 'mr-IN', name: 'Marathi (India)', flag: '🇮🇳' },
//     { code: 'gu-IN', name: 'Gujarati (India)', flag: '🇮🇳' },
//     { code: 'kn-IN', name: 'Kannada (India)', flag: '🇮🇳' },
//     { code: 'ml-IN', name: 'Malayalam (India)', flag: '🇮🇳' },
//     { code: 'pa-IN', name: 'Punjabi (India)', flag: '🇮🇳' }
//   ];

//   // Function to get selected language name from code
//   const getSelectedLanguageName = (langCode: string): string => {
//     const selectedLang = voiceLanguages.find(lang => lang.code === langCode);
//     return selectedLang ? selectedLang.name : 'English (India)';
//   };

//   // Load available voices for TTS
//   useEffect(() => {
//     if (typeof window !== 'undefined' && window.speechSynthesis) {
//       const loadVoices = () => {
//         const allVoices = window.speechSynthesis.getVoices();
//         setVoices(allVoices);
//         // Auto-select best matching voice for current language
//         if (allVoices.length) {
//           const bestVoice = allVoices.find(v => v.lang === preferredLang) ||
//             allVoices.find(v => v.lang && v.lang.startsWith(preferredLang.split('-')[0]));
//           if (bestVoice) {
//             setSelectedVoice(bestVoice.voiceURI);
//           } else {
//             setSelectedVoice(allVoices[0].voiceURI);
//           }
//         }
//       };
//       loadVoices();
//       window.speechSynthesis.onvoiceschanged = loadVoices;
//     }
//   }, [preferredLang]);

//   // When language or voices change, auto-select best matching voice
//   useEffect(() => {
//     if (voices.length) {
//       const bestVoice = voices.find(v => v.lang === preferredLang) ||
//         voices.find(v => v.lang && v.lang.startsWith(preferredLang.split('-')[0]));
//       if (bestVoice) {
//         setSelectedVoice(bestVoice.voiceURI);
//       } else {
//         setSelectedVoice(voices[0].voiceURI);
//       }
//     }
//   }, [preferredLang, voices.length]);

//   // Scroll to bottom on new message
//   useEffect(() => {
//     if (chatRef.current) {
//       chatRef.current.scrollTop = chatRef.current.scrollHeight;
//     }
//   }, [messages]);

//   // TTS for bot responses
//   useEffect(() => {
//     if (messages.length > 0 && messages[messages.length - 1].from === "bot") {
//       const lastMsg = messages[messages.length - 1].text;
//       const lang = detectLang(lastMsg);
//       setPreferredLang(lang); // Adapt to bot's language if needed
//       const synth = window.speechSynthesis;
//       const utter = new window.SpeechSynthesisUtterance(lastMsg);
//       utter.lang = lang;
//       const match = voices.find(v => v.lang === lang) || voices.find(v => v.lang && v.lang.startsWith(lang.split('-')[0]));
//       if (match) utter.voice = match;
//       synth.cancel();
//       setTtsStatus("playing");
//       utter.onend = () => setTtsStatus("idle");
//       utter.onerror = () => setTtsStatus("idle");
//       synth.speak(utter);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [messages, voices]);

//   // Initialize Web Speech API
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (SpeechRecognition) {
//         const recognitionInstance = new SpeechRecognition();
//         recognitionInstance.continuous = true;
//         recognitionInstance.interimResults = true;
//         recognitionInstance.lang = voiceLanguage;
//         let accumulatedTranscript = '';
//         recognitionInstance.onstart = () => {
//           setIsListening(true);
//           setErrorMsg(null);
//         };
//         recognitionInstance.onresult = (event: any) => {
//           let interimTranscript = '';
//           for (let i = event.resultIndex; i < event.results.length; i++) {
//             const result = event.results[i];
//             if (result.isFinal) {
//               accumulatedTranscript += result[0].transcript + ' ';
//             } else {
//               interimTranscript += result[0].transcript;
//             }
//           }
//           setTranscript((accumulatedTranscript + interimTranscript).trim());
//         };
//         recognitionInstance.onerror = (event: any) => {
//           setErrorMsg('Speech recognition error: ' + event.error);
//           setIsListening(false);
//         };
//         recognitionInstance.onend = () => {
//           setIsListening(false);
//         };
//         setRecognition(recognitionInstance);
//       } else {
//         setIsSupported(false);
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [voiceLanguage]);

//   // When transcript updates, set it as the value of the input box
//   useEffect(() => {
//     if (transcript) {
//       setInput(transcript);
//     }
//   }, [transcript]);

//   // Voice input functions
//   const startListening = () => {
//     if (recognition) {
//       setTranscript('');
//       setErrorMsg(null);
//       setIsListening(true);
//       recognition.start();
//     }
//   };

//   const stopListening = () => {
//     if (recognition) {
//       setIsListening(false);
//       recognition.stop();
//     }
//   };

//   const clearTranscript = () => {
//     setTranscript('');
//   };

//   const copyTranscript = () => {
//     if (transcript) {
//       navigator.clipboard.writeText(transcript);
//     }
//   };

//   // Add pauseListening function
//   const pauseListening = () => {
//     if (recognitionRef.current && recognitionRef.current.pause) {
//       recognitionRef.current.pause();
//     }
//   };

  
// const handleSend = async (msg?: string) => {
//     const textToSend = (msg !== undefined ? msg : input).trim();
//     if (!textToSend) return;

//     // Add user message to the chat UI immediately
//     setMessages(msgs => [...msgs, { from: "user", text: textToSend, image: undefined }]);
//     setInput("");
//     setTranscript("");

//     // --- Backend Communication Logic ---
//     try {
//         // Add a "Thinking..." message from the bot
//         setMessages(msgs => [...msgs, { from: "bot", text: "Thinking...", image: undefined }]);

//         // 1. Translate user's input to English (if not already English)
//         let englishInput = textToSend;
//         const selectedLangCode = voiceLanguage; // e.g., 'hi-IN'
//         const isEnglish = selectedLangCode.startsWith('en');

//         if (!isEnglish) {
//             const translationResponse = await fetch('/api/language', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ text: textToSend }),
//             });
//             const translationData = await translationResponse.json();
//             englishInput = translationData.translatedText;
//             console.log('Translated to English:', englishInput);
//         }

//         // 2. Send the English text to your Python Backend
//         const backendUrl = 'http://127.0.0.1:8000/process-query/';
        
//         // Get the simple language name (e.g., "hindi") for the backend
//         const languageName = getSelectedLanguageName(selectedLangCode).split(' ')[0].toLowerCase();

//         const backendResponse = await fetch(backendUrl, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 raw_input: englishInput,
//                 target_language: isEnglish ? "" : languageName, // Send language name if not English
//             }),
//         });

//         if (!backendResponse.ok) {
//             throw new Error(`Backend error: ${backendResponse.statusText}`);
//         }

//         const finalResult = await backendResponse.json();
//         console.log('Final response from Python backend:', finalResult);

//         // Remove the "Thinking..." message
//         setMessages(msgs => msgs.filter(m => m.text !== "Thinking..."));
        
//         // Add the final bot response to the chat
//         setMessages(msgs => [
//             ...msgs,
//             { 
//                 from: "bot", 
//                 text: finalResult.text_response, 
//                 // Display the first image if it exists
//                 image: finalResult.generated_images,
//             },
//         ]);

//     } catch (e) {
//         console.error('Error in handleSend:', e);
//         // Remove the "Thinking..." message
//         setMessages(msgs => msgs.filter(m => m.text !== "Thinking..."));
//         // Show an error message in the chat
//         setMessages(msgs => [...msgs, { from: "bot", text: "Sorry, I couldn't connect to the AI assistant.", image: undefined }]);
//     }
// };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-[#f5f7fa] font-sans" style={{ fontFamily: `'Inter', 'Segoe UI', 'Noto Sans', Arial, sans-serif` }}>
//       <div className="relative w-full max-w-2xl min-h-[80vh] flex flex-col bg-white rounded-xl shadow-2xl border border-[#e3e8ee] overflow-hidden">
//         {/* Header */}
//         <header className="flex items-center gap-3 px-6 py-4 bg-white border-b border-[#e3e8ee]">
//           <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] shadow">
//             <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <ellipse cx="16" cy="24" rx="12" ry="5" fill="#a78bfa" />
//               <path d="M8 24c0-6 4-12 8-12s8 6 8 12" stroke="#7c3aed" strokeWidth="2" fill="none" />
//               <path d="M12 24c0-4 2-8 4-8s4 4 4 8" stroke="#7c3aed" strokeWidth="2" fill="none" />
//               <circle cx="16" cy="12" r="2" fill="#7c3aed" />
//             </svg>
//           </span>
//           <span className="text-2xl font-bold text-[#223046] tracking-tight">Chotti AI</span>
//         </header>
//         {/* Chat window */}
//         <div
//           ref={chatRef}
//           className="flex-1 overflow-y-auto px-4 py-8 md:px-8 max-w-full w-full bg-white"
//           style={{scrollBehavior: "smooth"}}
//         >
//           {messages.map((msg, i) => (
//             <div
//               key={i}
//               className={`flex mb-5 ${msg.from === "user" ? "justify-end" : "justify-start"}`}
//             >
//               <div
//     className={`max-w-[75%] px-5 py-4 rounded-xl shadow text-base font-medium break-words border ${
//         msg.from === "user"
//             ? "bg-gradient-to-br from-[#4f8cff] to-[#38bdf8] text-white border-transparent rounded-br-xl shadow-md"
//             : "bg-[#f3f6fa] text-[#223046] border border-[#e3e8ee] rounded-bl-xl shadow"
//     }`}
//     style={{ fontFamily: `'Inter', 'Segoe UI', 'Noto Sans', Arial, sans-serif` }}
// >
//                 <div className="prose max-w-full break-words text-[#223046]">
//     <ReactMarkdown>{msg.text}</ReactMarkdown>
// </div>
//                 {/* Render image if present */}
//                 {msg.image && msg.image.length > 0 && (
//                 <div className="mt-3 grid grid-cols-2 gap-2">
//                   {msg.image.map((imgUrl, index) => (
//                     <img
//                       key={index}
//                       src={`${backendUrl}${imgUrl}`}
//                       alt={`Generated content ${index + 1}`}
//                       className="w-full h-auto rounded-lg border shadow"
//                     />
//                   ))}
//                 </div>
//             )}
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* Input bar */}
//         <form
//           className="bg-white flex items-center gap-2 px-4 py-3 border-t border-[#e3e8ee] max-w-full w-full rounded-b-xl shadow"
//           onSubmit={e => { e.preventDefault(); handleSend(); }}
//         >
//           {/* Language dropdown for STT */}
//           <select
//             value={voiceLanguage}
//             onChange={e => {
//               setVoiceLanguage(e.target.value);
//               console.log('🎯 Language dropdown changed to:', e.target.value);
//               const selectedLang = voiceLanguages.find(lang => lang.code === e.target.value);
//               console.log('🎯 Selected language name:', selectedLang?.name);
//             }}
//             className="rounded-lg border border-[#4f8cff] px-3 py-2 bg-white text-[#223046] font-sans focus:ring-2 focus:ring-[#4f8cff] focus:border-[#4f8cff] transition text-sm shadow-sm"
//             style={{ minWidth: 120, fontFamily: `'Inter', 'Segoe UI', 'Noto Sans', Arial, sans-serif` }}
//             aria-label="Select speech recognition language"
//           >
//             {voiceLanguages.map((lang) => (
//               <option key={lang.code} value={lang.code} className="text-[#223046] bg-white">
//                 {lang.flag} {lang.name}
//               </option>
//             ))}
//           </select>
//           {/* Text input */}
//           <input
//             className="flex-1 px-4 py-3 rounded-full border border-[#e3e8ee] focus:outline-none focus:ring-2 focus:ring-[#4f8cff] text-[#223046] bg-[#f9fafb] shadow text-lg font-sans placeholder-[#b0b8c9]"
//             value={input}
//             onChange={e => setInput(e.target.value)}
//             placeholder="Type your message..."
//             disabled={isListening}
//             style={{ fontFamily: `'Inter', 'Segoe UI', 'Noto Sans', Arial, sans-serif` }}
//           />
//           {/* Mic button */}
//           <button
//             type="button"
//             className={`px-4 py-3 rounded-full bg-gradient-to-br from-[#4f8cff] to-[#38bdf8] text-white font-bold shadow-lg text-xl transition hover:scale-105 hover:shadow-blue-200/60 active:scale-95 border border-[#4f8cff] ml-2 flex items-center gap-2 ${isListening ? "animate-pulse" : ""}`}
//             onClick={isListening ? stopListening : startListening}
//             aria-label={isListening ? "Stop listening" : "Start voice input"}
//             style={{ boxShadow: '0 2px 8px 0 #4f8cff22' }}
//           >
//             {/* Mic SVG */}
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
//               <rect x="9" y="3" width="6" height="12" rx="3" fill="#f9fafb" stroke="#223046" />
//               <path d="M5 11v1a7 7 0 0014 0v-1" stroke="#38bdf8" strokeWidth={2} />
//               <path d="M12 19v2" stroke="#223046" strokeWidth={2} strokeLinecap="round" />
//               <path d="M8 21h8" stroke="#38bdf8" strokeWidth={2} strokeLinecap="round" />
//             </svg>
//           </button>
//           {/* Pause button, only visible when listening */}
//           {isListening && (
//             <button
//               type="button"
//               className="px-4 py-3 rounded-full bg-gradient-to-br from-[#4f8cff] to-[#38bdf8] text-white font-bold shadow-lg text-xl transition hover:scale-105 hover:shadow-blue-200/60 active:scale-95 border border-[#4f8cff] ml-2 flex items-center gap-2"
//               onClick={pauseListening}
//               aria-label="Pause listening"
//               disabled={!(recognitionRef.current && recognitionRef.current.pause)}
//               title={recognitionRef.current && recognitionRef.current.pause ? "Pause" : "Pause not supported in this browser"}
//               style={{ boxShadow: '0 2px 8px 0 #4f8cff22' }}
//             >
//               {/* Pause SVG */}
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
//                 <rect x="6" y="4" width="4" height="16" rx="2" fill="#f9fafb" stroke="#223046" />
//                 <rect x="14" y="4" width="4" height="16" rx="2" fill="#f9fafb" stroke="#223046" />
//               </svg>
//             </button>
//           )}
//           {/* Send button */}
//           <button
//             type="submit"
//             className="px-4 py-3 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#4f8cff] text-white font-bold shadow-lg text-xl transition hover:scale-105 hover:shadow-blue-200/60 active:scale-95 border border-[#4f8cff] ml-2"
//             disabled={isListening || !input.trim()}
//             aria-label="Send message"
//             style={{ boxShadow: '0 2px 8px 0 #4f8cff22' }}
//           >
//             {/* Send SVG */}
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
//               <path d="M4 20l16-8-16-8v6l10 2-10 2v6z" fill="#f9fafb" stroke="#223046" />
//             </svg>
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// } 

// test


// page.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from 'react-markdown';

// TypeScript declarations for Web Speech API
// (if not already present)
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Utility: Minimal language detection for Indian languages and English
function detectLang(text: string): string {
  if (/\p{Script=Devanagari}/u.test(text)) return 'hi-IN';
  if (/\p{Script=Tamil}/u.test(text)) return 'ta-IN';
  if (/\p{Script=Bengali}/u.test(text)) return 'bn-IN';
  if (/\p{Script=Telugu}/u.test(text)) return 'te-IN';
  if (/\p{Script=Kannada}/u.test(text)) return 'kn-IN';
  if (/\p{Script=Malayalam}/u.test(text)) return 'ml-IN';
  if (/\p{Script=Gujarati}/u.test(text)) return 'gu-IN';
  if (/\p{Script=Gurmukhi}/u.test(text)) return 'pa-IN';
  if (/\p{Script=Oriya}/u.test(text)) return 'or-IN';
  if (/^[\x00-\x7F\s]+$/.test(text)) return 'en-IN';
  return 'en-IN';
}

export default function ChatbotPage() {

  // *** MODIFICATION START ***
  // Use process.env.NEXT_PUBLIC_API_BASE_URL to access the environment variable
  // Provide a fallback for local development if the variable isn't set,
  // though it's better to set it in .env.local for clarity.
  const backendUrl = process.env.NEXT_PUBLIC_RAILWAY_BACKEND_URL || "http://localhost:8000";
  // *** MODIFICATION END ***

  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I am ChottiAI. How can I help you today?", image: undefined as string[] | undefined },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ttsStatus, setTtsStatus] = useState<'idle' | 'playing' | 'paused'>("idle");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const recognitionRef = useRef<any>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [preferredLang, setPreferredLang] = useState<string>('en-IN');
  // Remove useSearchParams and URL lang logic

  // Speech-to-Text (Voice Input) states
  const [voiceLanguage, setVoiceLanguage] = useState('en-IN');
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const voiceLanguages = [
    { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
    { code: 'hi-IN', name: 'Hindi (India)', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'Tamil (India)', flag: '🇮🇳' },
    { code: 'bn-IN', name: 'Bengali (India)', flag: '🇮🇳' },
    { code: 'te-IN', name: 'Telugu (India)', flag: '🇮🇳' },
    { code: 'mr-IN', name: 'Marathi (India)', flag: '🇮🇳' },
    { code: 'gu-IN', name: 'Gujarati (India)', flag: '🇮🇳' },
    { code: 'kn-IN', name: 'Kannada (India)', flag: '🇮🇳' },
    { code: 'ml-IN', name: 'Malayalam (India)', flag: '🇮🇳' },
    { code: 'pa-IN', name: 'Punjabi (India)', flag: '🇮🇳' }
  ];

  // Function to get selected language name from code
  const getSelectedLanguageName = (langCode: string): string => {
    const selectedLang = voiceLanguages.find(lang => lang.code === langCode);
    return selectedLang ? selectedLang.name : 'English (India)';
  };

  // Load available voices for TTS
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        const allVoices = window.speechSynthesis.getVoices();
        setVoices(allVoices);
        // Auto-select best matching voice for current language
        if (allVoices.length) {
          const bestVoice = allVoices.find(v => v.lang === preferredLang) ||
            allVoices.find(v => v.lang && v.lang.startsWith(preferredLang.split('-')[0]));
          if (bestVoice) {
            setSelectedVoice(bestVoice.voiceURI);
          } else {
            setSelectedVoice(allVoices[0].voiceURI);
          }
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [preferredLang]);

  // When language or voices change, auto-select best matching voice
  useEffect(() => {
    if (voices.length) {
      const bestVoice = voices.find(v => v.lang === preferredLang) ||
        voices.find(v => v.lang && v.lang.startsWith(preferredLang.split('-')[0]));
      if (bestVoice) {
        setSelectedVoice(bestVoice.voiceURI);
      } else {
        setSelectedVoice(voices[0].voiceURI);
      }
    }
  }, [preferredLang, voices.length]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // TTS for bot responses
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].from === "bot") {
      const lastMsg = messages[messages.length - 1].text;
      const lang = detectLang(lastMsg);
      setPreferredLang(lang); // Adapt to bot's language if needed
      const synth = window.speechSynthesis;
      const utter = new window.SpeechSynthesisUtterance(lastMsg);
      utter.lang = lang;
      const match = voices.find(v => v.lang === lang) || voices.find(v => v.lang && v.lang.startsWith(lang.split('-')[0]));
      if (match) utter.voice = match;
      synth.cancel();
      setTtsStatus("playing");
      utter.onend = () => setTtsStatus("idle");
      utter.onerror = () => setTtsStatus("idle");
      synth.speak(utter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, voices]);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = voiceLanguage;
        let accumulatedTranscript = '';
        recognitionInstance.onstart = () => {
          setIsListening(true);
          setErrorMsg(null);
        };
        recognitionInstance.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              accumulatedTranscript += result[0].transcript + ' ';
            } else {
              interimTranscript += result[0].transcript;
            }
          }
          setTranscript((accumulatedTranscript + interimTranscript).trim());
        };
        recognitionInstance.onerror = (event: any) => {
          setErrorMsg('Speech recognition error: ' + event.error);
          setIsListening(false);
        };
        recognitionInstance.onend = () => {
          setIsListening(false);
        };
        setRecognition(recognitionInstance);
      } else {
        setIsSupported(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceLanguage]);

  // When transcript updates, set it as the value of the input box
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Voice input functions
  const startListening = () => {
    if (recognition) {
      setTranscript('');
      setErrorMsg(null);
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    }
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  const copyTranscript = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
    }
  };

  // Add pauseListening function
  const pauseListening = () => {
    if (recognitionRef.current && recognitionRef.current.pause) {
      recognitionRef.current.pause();
    }
  };

  const handleSend = async (msg?: string) => {
    const textToSend = (msg !== undefined ? msg : input).trim();
    if (!textToSend) return;

    // Add user message to the chat UI immediately
    setMessages(msgs => [...msgs, { from: "user", text: textToSend, image: undefined }]);
    setInput("");
    setTranscript("");

    // --- Backend Communication Logic ---
    try {
      // Add a "Thinking..." message from the bot
      setMessages(msgs => [...msgs, { from: "bot", text: "Thinking...", image: undefined }]);

      // 1. Translate user's input to English (if not already English)
      let englishInput = textToSend;
      const selectedLangCode = voiceLanguage; // e.g., 'hi-IN'
      const isEnglish = selectedLangCode.startsWith('en');

      if (!isEnglish) {
        // This is calling a local Next.js API route. This is fine.
        const translationResponse = await fetch('/api/language', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToSend }),
        });
        const translationData = await translationResponse.json();
        englishInput = translationData.translatedText;
        console.log('Translated to English:', englishInput);
      }

      // 2. Send the English text to your Python Backend
      // *** MODIFICATION START ***
      // Use the backendUrl variable defined at the top
      const backendApiEndpoint = `${backendUrl}/process-query/`;
      // *** MODIFICATION END ***
      
      // Get the simple language name (e.g., "hindi") for the backend
      const languageName = getSelectedLanguageName(selectedLangCode).split(' ')[0].toLowerCase();

      // *** MODIFICATION START ***
      const backendResponse = await fetch(backendApiEndpoint, {
      // *** MODIFICATION END ***
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_input: englishInput,
          target_language: isEnglish ? "" : languageName, // Send language name if not English
        }),
      });

      if (!backendResponse.ok) {
        throw new Error(`Backend error: ${backendResponse.statusText}`);
      }

      const finalResult = await backendResponse.json();
      console.log('Final response from Python backend:', finalResult);

      // Remove the "Thinking..." message
      setMessages(msgs => msgs.filter(m => m.text !== "Thinking..."));
      
      // Add the final bot response to the chat
      setMessages(msgs => [
        ...msgs,
        { 
          from: "bot", 
          text: finalResult.text_response, 
          // Display the first image if it exists
          image: finalResult.generated_images,
        },
      ]);

    } catch (e) {
      console.error('Error in handleSend:', e);
      // Remove the "Thinking..." message
      setMessages(msgs => msgs.filter(m => m.text !== "Thinking..."));
      // Show an error message in the chat
      setMessages(msgs => [...msgs, { from: "bot", text: "Sorry, I couldn't connect to the AI assistant.", image: undefined }]);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f5f7fa] font-sans" style={{ fontFamily: `'Inter', 'Segoe UI', 'Noto Sans', Arial, sans-serif` }}>
      <div className="relative w-full max-w-2xl min-h-[80vh] flex flex-col bg-white rounded-xl shadow-2xl border border-[#e3e8ee] overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-3 px-6 py-4 bg-white border-b border-[#e3e8ee]">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] shadow">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="16" cy="24" rx="12" ry="5" fill="#a78bfa" />
              <path d="M8 24c0-6 4-12 8-12s8 6 8 12" stroke="#7c3aed" strokeWidth="2" fill="none" />
              <path d="M12 24c0-4 2-8 4-8s4 4 4 8" stroke="#7c3aed" strokeWidth="2" fill="none" />
              <circle cx="16" cy="12" r="2" fill="#7c3aed" />
            </svg>
          </span>
          <span className="text-2xl font-bold text-[#223046] tracking-tight">Chotti AI</span>
        </header>
        {/* Chat window */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto px-4 py-8 md:px-8 max-w-full w-full bg-white"
          style={{scrollBehavior: "smooth"}}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex mb-5 ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
    className={`max-w-[75%] px-5 py-4 rounded-xl shadow text-base font-medium break-words border ${
        msg.from === "user"
            ? "bg-gradient-to-br from-[#4f8cff] to-[#38bdf8] text-white border-transparent rounded-br-xl shadow-md"
            : "bg-[#f3f6fa] text-[#223046] border border-[#e3e8ee] rounded-bl-xl shadow"
    }`}
    style={{ fontFamily: `'Inter', 'Segoe UI', 'Noto Sans', Arial, sans-serif` }}
>
          <div className="prose max-w-full break-words text-[#223046]">
    <ReactMarkdown>{msg.text}</ReactMarkdown>
</div>
                {/* Render image if present */}
                {msg.image && msg.image.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {msg.image.map((imgUrl, index) => (
                    <img
                      key={index}
                      src={`${backendUrl}${imgUrl}`}
                      alt={`Generated content ${index + 1}`}
                      className="w-full h-auto rounded-lg border shadow"
                    />
                  ))}
                </div>
            )}
              </div>
            </div>
          ))}
        </div>
        {/* Input bar */}
        <form
          className="bg-white flex items-center gap-2 px-4 py-3 border-t border-[#e3e8ee] max-w-full w-full rounded-b-xl shadow"
          onSubmit={e => { e.preventDefault(); handleSend(); }}
        >
          {/* Language dropdown for STT */}
          <select
            value={voiceLanguage}
            onChange={e => {
              setVoiceLanguage(e.target.value);
              console.log('🎯 Language dropdown changed to:', e.target.value);
              const selectedLang = voiceLanguages.find(lang => lang.code === e.target.value);
              console.log('🎯 Selected language name:', selectedLang?.name);
            }}
            className="rounded-lg border border-[#4f8cff] px-3 py-2 bg-white text-[#223046] font-sans focus:ring-2 focus:ring-[#4f8cff] focus:border-[#4f8cff] transition text-sm shadow-sm"
            style={{ minWidth: 120, fontFamily: `'Inter', 'Segoe UI', 'Noto Sans', Arial, sans-serif` }}
            aria-label="Select speech recognition language"
          >
            {voiceLanguages.map((lang) => (
              <option key={lang.code} value={lang.code} className="text-[#223046] bg-white">
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          {/* Text input */}
          <input
            className="flex-1 px-4 py-3 rounded-full border border-[#e3e8ee] focus:outline-none focus:ring-2 focus:ring-[#4f8cff] text-[#223046] bg-[#f9fafb] shadow text-lg font-sans placeholder-[#b0b8c9]"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isListening}
            style={{ fontFamily: `'Inter', 'Segoe UI', 'Noto Sans', Arial, sans-serif` }}
          />
          {/* Mic button */}
          <button
            type="button"
            className={`px-4 py-3 rounded-full bg-gradient-to-br from-[#4f8cff] to-[#38bdf8] text-white font-bold shadow-lg text-xl transition hover:scale-105 hover:shadow-blue-200/60 active:scale-95 border border-[#4f8cff] ml-2 flex items-center gap-2 ${isListening ? "animate-pulse" : ""}`}
            onClick={isListening ? stopListening : startListening}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
            style={{ boxShadow: '0 2px 8px 0 #4f8cff22' }}
          >
            {/* Mic SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <rect x="9" y="3" width="6" height="12" rx="3" fill="#f9fafb" stroke="#223046" />
              <path d="M5 11v1a7 7 0 0014 0v-1" stroke="#38bdf8" strokeWidth={2} />
              <path d="M12 19v2" stroke="#223046" strokeWidth={2} strokeLinecap="round" />
              <path d="M8 21h8" stroke="#38bdf8" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </button>
          {/* Pause button, only visible when listening */}
          {isListening && (
            <button
              type="button"
              className="px-4 py-3 rounded-full bg-gradient-to-br from-[#4f8cff] to-[#38bdf8] text-white font-bold shadow-lg text-xl transition hover:scale-105 hover:shadow-blue-200/60 active:scale-95 border border-[#4f8cff] ml-2 flex items-center gap-2"
              onClick={pauseListening}
              aria-label="Pause listening"
              disabled={!(recognitionRef.current && recognitionRef.current.pause)}
              title={recognitionRef.current && recognitionRef.current.pause ? "Pause" : "Pause not supported in this browser"}
              style={{ boxShadow: '0 2px 8px 0 #4f8cff22' }}
            >
              {/* Pause SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <rect x="6" y="4" width="4" height="16" rx="2" fill="#f9fafb" stroke="#223046" />
                <rect x="14" y="4" width="4" height="16" rx="2" fill="#f9fafb" stroke="#223046" />
              </svg>
            </button>
          )}
          {/* Send button */}
          <button
            type="submit"
            className="px-4 py-3 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#4f8cff] text-white font-bold shadow-lg text-xl transition hover:scale-105 hover:shadow-blue-200/60 active:scale-95 border border-[#4f8cff] ml-2"
            disabled={isListening || !input.trim()}
            aria-label="Send message"
            style={{ boxShadow: '0 2px 8px 0 #4f8cff22' }}
          >
            {/* Send SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path d="M4 20l16-8-16-8v6l10 2-10 2v6z" fill="#f9fafb" stroke="#223046" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}