import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Plus, Megaphone, Users, TrendingUp } from "lucide-react";
import { NoticeCard } from "../components/NoticeCard";
import { FilterBar } from "../components/FilterBar";
import { noticeService } from "../services/noticeService";
import { Notice } from "../types/notice";
import BackToHomeButton from "../../components/BackToHomeButton";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "ta", label: "Tamil" },
];

const translations: { [key: string]: { [key: string]: string } } = {
  en: {
    bazaarNoticeboard: "Bazaar Noticeboard",
    connect: "Connect with fellow artisans • Share needs & offers • Build community",
    postNotice: "Post Notice",
    activeNotices: "Active Notices",
    regionsActive: "Regions Active",
    alwaysOpen: "Always Open",
    noNotices: "No notices found",
    beFirst: "Be the first to post a notice to the bazaar!",
    postFirst: "Post the First Notice",
    builtFor: "Built for rural artisans • Connecting communities through craft"
  },
  hi: {
    bazaarNoticeboard: "बाज़ार नोटिसबोर्ड",
    connect: "सहकर्मी कारीगरों से जुड़ें • ज़रूरतें और ऑफ़र साझा करें • समुदाय बनाएं",
    postNotice: "नोटिस पोस्ट करें",
    activeNotices: "सक्रिय नोटिस",
    regionsActive: "सक्रिय क्षेत्र",
    alwaysOpen: "हमेशा खुला",
    noNotices: "कोई नोटिस नहीं मिला",
    beFirst: "बाज़ार में नोटिस पोस्ट करने वाले पहले बनें!",
    postFirst: "पहला नोटिस पोस्ट करें",
    builtFor: "ग्रामीण कारीगरों के लिए • शिल्प के माध्यम से समुदायों को जोड़ना"
  },
  ta: {
    bazaarNoticeboard: "பஜார் அறிவிப்பு பலகை",
    connect: "கலைஞர்களுடன் இணைக • தேவைகள் மற்றும் சலுகைகளை பகிர்க • சமூகத்தை உருவாக்குக",
    postNotice: "அறிவிப்பு இடுக",
    activeNotices: "செயலில் உள்ள அறிவிப்புகள்",
    regionsActive: "செயலில் உள்ள பகுதிகள்",
    alwaysOpen: "எப்போதும் திறந்திருக்கும்",
    noNotices: "அறிவிப்புகள் இல்லை",
    beFirst: "பஜாரில் அறிவிப்பு இடும் முதல் நபராக இருங்கள்!",
    postFirst: "முதல் அறிவிப்பை இடுக",
    builtFor: "மக்கள் கலைஞர்களுக்காக • கைவினை மூலம் சமூகங்களை இணைக்கும்"
  }
};

const Index = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedCity, setSelectedCity] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState("en");

  const regions = noticeService.getRegions();

  // Extract unique cities from all notices
  const allCities = Array.from(
    new Set(noticeService.getAllNotices().map((n) => n.city))
  ).sort();

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      let filtered = noticeService.getAllNotices(selectedRegion);
      if (selectedCity !== "all") {
        filtered = filtered.filter((n) => n.city === selectedCity);
      }
      setNotices(filtered);
      setIsLoading(false);
    }, 300);
  }, [selectedRegion, selectedCity]);

  return (
    <div className="noticeboard-root min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-400 to-yellow-300 flex items-center justify-center shadow-lg">
              <Megaphone className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 bg-clip-text text-transparent" style={{ color: '#000', opacity: 1 }}>
            {translations[language].bazaarNoticeboard}
          </h1>
          <p className="text-lg text-black max-w-2xl mx-auto" style={{ color: '#000', opacity: 1 }}>
            {translations[language].connect}
          </p>
        </div>
        {/* Language Dropdown */}
        <div className="flex justify-center mb-6">
          <label htmlFor="lang-select" className="mr-2 font-semibold">Language:</label>
          <select
            id="lang-select"
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="border border-orange-400 rounded px-3 py-1 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>
        <BackToHomeButton />

        {/* Filter Bar */}
        <FilterBar
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          regions={regions}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          cities={allCities}
        />

        {/* Post Notice button below filter bar */}
        <div className="flex justify-end mb-6 mt-2">
          <Link href={{ pathname: "/noticeboard/post", query: { lang: language } }}>
            <Button className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 flex items-center text-white font-semibold shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              {translations[language].postNotice}
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-black" style={{ color: '#000', opacity: 1 }}>{notices.length}</p>
                <p className="text-sm text-black" style={{ color: '#000', opacity: 1 }}>{translations[language].activeNotices}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-black" style={{ color: '#000', opacity: 1 }}>{regions.length - 1}</p>
                <p className="text-sm text-black" style={{ color: '#000', opacity: 1 }}>{translations[language].regionsActive}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Megaphone className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-black" style={{ color: '#000', opacity: 1 }}>24/7</p>
                <p className="text-sm text-black" style={{ color: '#000', opacity: 1 }}>{translations[language].alwaysOpen}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notices Grid */}
        {!isLoading && (
          <>
            {notices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notices.map((notice) => (
                  <NoticeCard key={notice.id} notice={notice} language={language} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="h-24 w-24 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                  <Megaphone className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {translations[language].noNotices}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {selectedRegion === "All Regions"
                    ? translations[language].beFirst
                    : `No notices found for ${selectedRegion}. Try selecting a different region.`}
                </p>
                <Link href={{ pathname: "/noticeboard/post", query: { lang: language } }}>
                  <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    <Plus className="h-4 w-4 mr-2" />
                    {translations[language].postFirst}
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-black" style={{ color: '#000', opacity: 1 }}>
            {translations[language].builtFor}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;