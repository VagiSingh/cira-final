"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ fix: use require to get string paths for icons
const markerIcon = require("leaflet/dist/images/marker-icon.png");
const markerIcon2x = require("leaflet/dist/images/marker-icon-2x.png");
const markerShadow = require("leaflet/dist/images/marker-shadow.png");

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function SOSMap({ alerts }: { alerts: any[] }) {
  const defaultCenter = alerts.length
    ? [alerts[0].latitude, alerts[0].longitude]
    : [28.45082919222777, 77.58421356881148]; // fallback center (India)

  return (
    
    <MapContainer
      center={defaultCenter as [number, number]}
      zoom={15}
      style={{ height: "80vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {alerts.map((alert, index) => {
  const offsetLat = alert.latitude + (index * 0.00001);
  const offsetLng = alert.longitude + (index * 0.00001);

  return (
    <Marker key={alert.id} position={[offsetLat, offsetLng]}>
      <Popup>
        🚨 <strong>{alert.user?.name || "Unknown User"}</strong><br />
        📍 {alert.location}<br />
        🕒 {new Date(alert.createdAt).toLocaleString()}
      </Popup>
    </Marker>
  );
})}


    </MapContainer>
  );
}
