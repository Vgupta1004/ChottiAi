import { Select } from "./ui/select";
import { MapPin } from "lucide-react";

type Region = string;

interface FilterBarProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  regions: Region[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  cities: string[];
}

export const FilterBar = ({
  selectedRegion,
  onRegionChange,
  regions,
  selectedCity,
  onCityChange,
  cities
}: FilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 p-5 bg-gradient-to-r from-orange-50 via-yellow-50 to-white rounded-2xl shadow border border-orange-200">
      <MapPin className="h-6 w-6 text-orange-500 mr-2" />
      <span className="text-base font-bold text-orange-600">Region:</span>
      <Select
        value={selectedRegion}
        onChange={e => onRegionChange(e.target.value)}
        className="w-48 border-orange-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-black bg-orange-50 font-semibold"
      >
        {regions.map((region) => (
          <option key={region} value={region} className="text-black">
            {region}
          </option>
        ))}
      </Select>
      <span className="text-base font-bold text-orange-600 ml-4">City:</span>
      <Select
        value={selectedCity}
        onChange={e => onCityChange(e.target.value)}
        className="w-48 border-orange-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-black bg-orange-50 font-semibold"
      >
        <option key="all" value="all" className="text-black">All Cities</option>
        {cities.map((city) => (
          <option key={city} value={city} className="text-black">
            {city}
          </option>
        ))}
      </Select>
    </div>
  );
};