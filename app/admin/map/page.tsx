// app/admin/map/page.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapWithMarkers = dynamic(() => import("@/components/admin/SOSMap"), { ssr: false });

export default function AdminMapPage() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const res = await fetch("/api/sos");
      const data = await res.json();
      console.log("Fetched SOS Alerts:", data);  // Log the fetched data
      if (Array.isArray(data)) setAlerts(data);
    };
  
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15 * 60 * 1000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);
  

  return (
    <div className="p-4 bg-black">
      <h1 className="text-2xl text-amber-50 font-bold mb-4">📍 SOS Alerts Map</h1>
      <MapWithMarkers alerts={alerts} />
    </div>
  );
}
