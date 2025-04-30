"use client";
import { useState } from "react";

// The SOS component
export default function SOS() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Handle the SOS button click
  const handleSOS = async () => {
    setIsLoading(true);
    setMessage(null); // Reset any previous messages

    try {
      const { latitude, longitude } = await getCurrentLocation();

      const success = await sendSOSLocation(latitude, longitude);

      setMessage(success ? "Location sent to admin." : "Failed to send location.");
    } catch (err) {
      console.error("Failed to fetch your location.",err)
      setMessage("Failed to fetch your location.",);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            console.error(error)
            reject("Unable to retrieve your location.");
          },
          {
            enableHighAccuracy: true,   
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    });
  };
  
  
  // Updated sendSOSLocation to send latitude and longitude
  const sendSOSLocation = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch("/api/sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude,
          longitude,
          location: `Lat: ${latitude.toFixed(3)}, Lng: ${longitude.toFixed(3)}`,
        }),
      });
  
      const data = await response.json();
      return response.ok && data.success;
    } catch (err) {
      console.error("Error while sending SOS location:", err);
      return false;
    }
  };
  

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* SOS Button */}
      <button
        onClick={handleSOS}
        className="bg-red-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-red-900 transition-colors"
        disabled={isLoading}
        title="SOS Alert"
      >
        {isLoading ? "Sending..." : "SOS"}
      </button>

      {/* Confirmation or error message */}
      {message && (
        <div
          className={`mt-2 text-sm font-medium ${
            message.includes("Failed") ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
