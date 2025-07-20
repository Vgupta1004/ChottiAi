"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Inter, Playfair_Display } from "next/font/google";
import { FiMic, FiMessageCircle, FiUser } from 'react-icons/fi';
import { TbLamp } from 'react-icons/tb';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

const LANGUAGES = [
  { code: "ta-IN", label: "தமிழ் (Tamil)", short: "Tamil" },
  { code: "en-IN", label: "English", short: "English" },
  { code: "hi-IN", label: "हिन्दी (Hindi)", short: "Hindi" },
  { code: "bn-IN", label: "বাংলা (Bengali)", short: "Bengali" },
];

const LABELS: Record<string, { welcome: string; start: string; prompt: string }> = {
  "ta-IN": {
    welcome: "சொட்டிAI-க்கு வரவேற்கிறோம்",
    start: "சொட்டிAI உடன் உரையாடலைத் தொடங்குங்கள்",
    prompt: "🎙️ உங்கள் விருப்பமான மொழியைச் சொல்லுங்கள்: தமிழ், ஆங்கிலம், ஹிந்தி, பெங்காலி.",
  },
  "en-IN": {
    welcome: "Welcome to ChottiAI – Your AI Saathi for Cultural Commerce",
    start: "Start Chat with ChottiAI",
    prompt: "🎙️ Start by saying your preferred language",
  },
  "hi-IN": {
    welcome: "ChottiAI में आपका स्वागत है",
    start: "ChottiAI के साथ चैट शुरू करें",
    prompt: "🎙️ अपनी पसंदीदा भाषा बोलें: तमिल, अंग्रेज़ी, हिंदी, बंगाली.",
  },
  "bn-IN": {
    welcome: "ChottiAI-তে স্বাগতম",
    start: "ChottiAI-এর সাথে চ্যাট শুরু করুন",
    prompt: "🎙️ আপনার পছন্দের ভাষা বলুন: তামিল, ইংরেজি, হিন্দি, বাংলা.",
  },
};

function getLabels(lang: string | null) {
  return LABELS[lang || "en-IN"];
}

const Logo = () => (
  <div className={`flex items-center gap-2 text-2xl font-bold ${playfair.variable} font-serif`}>
    {/* Rural artisan icon: basket */}
    <span className="inline-block align-middle">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="16" cy="24" rx="12" ry="5" fill="#a78bfa" />
        <path d="M8 24c0-6 4-12 8-12s8 6 8 12" stroke="#7c3aed" strokeWidth="2" fill="none" />
        <path d="M12 24c0-4 2-8 4-8s4 4 4 8" stroke="#7c3aed" strokeWidth="2" fill="none" />
        <circle cx="16" cy="12" r="2" fill="#7c3aed" />
      </svg>
    </span>
    <span>ChottiAI</span>
  </div>
);

const NavLinks = () => (
  <nav className="flex gap-6 text-base font-semibold items-center">
    <Link href="/" className="px-2 py-1 rounded hover:underline hover:text-[#3B82F6] transition-colors duration-200">ChottiAI</Link>
    <Link href="/shopping" className="px-2 py-1 rounded hover:underline hover:text-[#3B82F6] transition-colors duration-200">Shopping Zone</Link>
    <button className="px-2 py-1 rounded bg-transparent border-none hover:underline hover:text-[#3B82F6] transition-colors duration-200">Skills</button>
    <Link href="/noticeboard" className="px-2 py-1 rounded hover:underline hover:text-[#3B82F6] transition-colors duration-200">Bazaar Noticeboard</Link>
    <button className="px-2 py-1 rounded bg-transparent border-none hover:underline hover:text-[#3B82F6] transition-colors duration-200">About</button>
  </nav>
);

const UserAvatar = () => (
  <button className="w-10 h-10 rounded-full bg-[#3B82F6] border-2 border-[#E5E7EB] flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]">
    <FiUser className="text-white text-lg" />
  </button>
);

const Header = () => (
  <header className="w-full flex items-center justify-between px-8 py-4 bg-[#1F2937] border-b border-[#E5E7EB] sticky top-0 z-20 text-white shadow-md animate-fade-slide-down">
    <Logo />
    <NavLinks />
    <UserAvatar />
  </header>
);

const SuggestionCard = ({ title, description, image }: { title: string; description: string; image: string }) => (
  <div className="bg-[#FAF8F5] shadow-sm border border-[#E7E5E4] rounded-xl p-6 flex items-center gap-4 transition-all duration-500">
    <div className="flex-1">
      <h3 className={`text-xl font-semibold ${playfair.variable} font-serif text-[#374151] mb-2`}>{title}</h3>
      <p className={`text-base ${inter.variable} font-sans text-[#4B4B4B]`}>{description}</p>
    </div>
    <div className="w-20 h-20 rounded-lg border-2 border-[#D7A98C] overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
  </div>
);

export default function Page() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [spokenText, setSpokenText] = useState<string>("");
  const recognitionRef = useRef<any>(null);
  const router = useRouter();

  // Text-to-Speech (TTS) function
  const speak = (text: string, lang: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = lang;
    // Try to pick a matching voice
    const voices = synth.getVoices();
    const match = voices.find(v => v.lang === lang);
    if (match) utter.voice = match;
    synth.cancel(); // Stop any current speech
    synth.speak(utter);
  };

  // When language is selected, speak greeting
  React.useEffect(() => {
    if (selectedLanguage) {
      const greeting = LABELS[selectedLanguage]?.welcome || LABELS['en-IN'].welcome;
      speak(greeting, selectedLanguage);
    }
  }, [selectedLanguage]);

  // When language is selected, clear spoken text
  React.useEffect(() => {
    setSpokenText("");
  }, [selectedLanguage]);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Speech-to-Text (STT) logic
  const startListening = () => {
    setError(null);
    setSpokenText("");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSpokenText(transcript);
      const match = LANGUAGES.find(l => transcript.toLowerCase().includes(l.short.toLowerCase()));
      if (match) {
        setSelectedLanguage(match.code);
      } else {
        setError("Could not recognize language. Please try again.");
      }
      setListening(false);
    };
    recognition.onerror = () => {
      setError("Speech recognition error. Please try again.");
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const labels = getLabels(selectedLanguage);

  return (
    <div className={`min-h-screen w-full flex flex-col ${inter.variable} font-sans text-[#374151] bg-[#F3F4F6]`}>
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center z-10 relative">
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6 mt-12 mb-12 transition-all duration-700 bg-white rounded-2xl shadow-lg border border-[#E5E7EB]"> 
          {/* Hero Section */}
          <div className="text-center mb-8 p-6 rounded-xl bg-[#F3F4F6] shadow-sm border border-[#E5E7EB] w-full">
            <h1 className={`text-3xl md:text-4xl font-extrabold ${playfair.variable} font-serif text-[#1F2937] mb-3 leading-tight drop-shadow-sm transition-all duration-700`}>{labels.welcome}</h1>
            <p className={`text-lg md:text-xl ${inter.variable} font-sans mb-4 italic force-dark-text`}>Where heritage meets innovation</p>
          </div>
          {/* Voice Language Selector */}
          <div className="flex flex-col items-center gap-4 mb-8 bg-[#F3F4F6] p-6 rounded-xl shadow-sm w-full border border-[#E5E7EB]">
            <p className={`text-base font-semibold ${inter.variable} font-sans mb-2 force-dark-text`}>{labels.prompt}</p>
            <button
              className="px-4 py-2 rounded-lg bg-[#3B82F6] text-white text-sm font-semibold shadow hover:bg-[#2563EB] transition-all duration-200 flex items-center gap-2"
              onClick={startListening}
              disabled={listening}
              aria-label="Start voice input"
            >
              <FiMic className="text-base" />
              {listening ? "Listening..." : "Speak Language"}
            </button>
            <select
              className="mt-2 w-56 px-4 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#374151] text-base font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all duration-200"
              value={selectedLanguage || ''}
              onChange={e => {
                setSelectedLanguage(e.target.value);
                const greeting = LABELS[e.target.value]?.welcome || LABELS['en-IN'].welcome;
                speak(greeting, e.target.value);
              }}
              aria-label="Select language"
            >
              <option value="" disabled>Select Language</option>
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
            {spokenText && (
              <div className="mt-2 px-3 py-2 rounded-lg bg-white border border-[#E5E7EB] shadow-sm text-[#374151] font-sans text-base max-w-xs text-center transition-all duration-300">
                {spokenText}
              </div>
            )}
            {error && <span className="text-[#3B82F6] mt-2 font-semibold text-sm">{error}</span>}
          </div>
          {/* Chatbot Launch Button */}
          <button
            className="px-4 py-2 rounded-lg bg-[#3B82F6] text-white text-sm font-semibold shadow hover:bg-[#2563EB] transition-all duration-200 flex items-center gap-2 mb-4"
            onClick={() => router.push('/chatbot')}
          >
            <FiMessageCircle className="text-base" /> {labels.start}
          </button>
        </div>
      </main>
      <footer className={`w-full py-5 bg-[#1F2937] text-center text-base text-white font-semibold tracking-wide border-t border-[#E5E7EB] z-10 relative ${inter.variable} font-sans`}>
        <span className="inline-block align-middle mr-2">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="16" cy="24" rx="12" ry="5" fill="#a78bfa" />
            <path d="M8 24c0-6 4-12 8-12s8 6 8 12" stroke="#7c3aed" strokeWidth="2" fill="none" />
            <path d="M12 24c0-4 2-8 4-8s4 4 4 8" stroke="#7c3aed" strokeWidth="2" fill="none" />
            <circle cx="16" cy="12" r="2" fill="#7c3aed" />
          </svg>
        </span>
        <span>ChottiAI - Empowering Rural India</span>
        <span className="inline-block align-middle ml-2">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="16" cy="24" rx="12" ry="5" fill="#a78bfa" />
            <path d="M8 24c0-6 4-12 8-12s8 6 8 12" stroke="#7c3aed" strokeWidth="2" fill="none" />
            <path d="M12 24c0-4 2-8 4-8s4 4 4 8" stroke="#7c3aed" strokeWidth="2" fill="none" />
            <circle cx="16" cy="12" r="2" fill="#7c3aed" />
          </svg>
        </span>
      </footer>
    </div>
  );
}
// TypeScript global declarations for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}
