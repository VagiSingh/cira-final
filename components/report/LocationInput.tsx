"use client";
import { useState } from "react";
import { FiMapPin } from "react-icons/fi";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function LocationInput({ value, onChange }: LocationInputProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onChange(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsGettingLocation(false);
        }
      );
    } else {
      setIsGettingLocation(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-300">
        Location
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter location or use current"
          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-blue-500 transition-colors"
          title="Use current location"
        >
          {isGettingLocation ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
          ) : (
            <FiMapPin className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}