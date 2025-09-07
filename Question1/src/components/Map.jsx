import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);
  return null;
}

export default function Map() {
  const [position, setPosition] = useState([28.6139, 77.209]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error("Geolocation error:", err)
    );
  }, []);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    const apiKey = "e08958549ccb43ca923dc5f65e4e757b";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      searchInput
    )}&key=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.results?.length) {
        const { lat, lng } = data.results[0].geometry;
        setPosition([lat, lng]);
      } else {
        alert("City not found");
      }
    } catch (error) {
      alert("Failed to fetch location data");
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "80vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>Location Marker</Popup>
        </Marker>
        <MapUpdater position={position} />
      </MapContainer>
    </div>
  );
}
