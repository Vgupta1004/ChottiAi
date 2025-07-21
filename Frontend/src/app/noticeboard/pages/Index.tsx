import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Plus, Megaphone, Users, TrendingUp } from "lucide-react";
import { NoticeCard } from "../components/NoticeCard";
import { FilterBar } from "../components/FilterBar";
import { noticeService } from "../services/noticeService";
import { Notice } from "../types/notice";

const Index = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedCity, setSelectedCity] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

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
            Bazaar Noticeboard
          </h1>
          <p className="text-lg text-black max-w-2xl mx-auto" style={{ color: '#000', opacity: 1 }}>
            Connect with fellow artisans • Share needs & offers • Build community
          </p>
        </div>

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
          <Link href="/noticeboard/post">
            <Button className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 flex items-center text-white font-semibold shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Post Notice
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
                <p className="text-sm text-black" style={{ color: '#000', opacity: 1 }}>Active Notices</p>
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
                <p className="text-sm text-black" style={{ color: '#000', opacity: 1 }}>Regions Active</p>
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
                <p className="text-sm text-black" style={{ color: '#000', opacity: 1 }}>Always Open</p>
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
                  <NoticeCard key={notice.id} notice={notice} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="h-24 w-24 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                  <Megaphone className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No notices found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {selectedRegion === "All Regions"
                    ? "Be the first to post a notice to the bazaar!"
                    : `No notices found for ${selectedRegion}. Try selecting a different region.`}
                </p>
                <Link href="/noticeboard/post">
                  <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Post the First Notice
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-black" style={{ color: '#000', opacity: 1 }}>
            Built for rural artisans • Connecting communities through craft
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;