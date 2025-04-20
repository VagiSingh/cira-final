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
      // Fetch the user's current location
      const userLocation = await getCurrentLocation();

      // Get the user ID (assuming it's available in the session or context)
      const userId = 'userId';  // Replace this with actual user ID from session or context

      // Send the SOS location to the backend (admin)
      const success = await sendSOSLocation(userLocation, userId);

      // Show success or failure message based on the result
      if (success) {
        setMessage("Location sent to admin.");
      } else {
        setMessage("Failed to send location to admin. Please try again.");
      }
    } catch (err) {
      console.error("Error sending SOS:", err);
      setMessage("Failed to fetch your location. Please enable location services.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch the user's current location using geolocation
  const getCurrentLocation = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);
          },
          (error) => {
            reject("Unable to retrieve your location.");
          }
        );
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    });
  };

  // Function to send the SOS alert to the backend (to /api/sos)
  const sendSOSLocation = async (location: string, userId: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location,
          userId,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return true;
      } else {
        console.error("Error response from server:", data);
        return false;
      }
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
          className={`mt-2 text-sm font-medium ${message.includes("Failed") ? "text-red-500" : "text-green-500"}`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
