import { useState, useCallback } from "react";
import Map, { Marker } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";

export default function MapPicker({ value, onChange }) {
  const [marker, setMarker] = useState(value);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleClick = useCallback(
    (event) => {
      const { lng, lat } = event.lngLat;
      const pos = { lat, lng };
      setMarker(pos);
      onChange(pos);
    },
    [onChange]
  );

  const searchAddress = async (query) => {
    setSearch(query);
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      setSuggestions(data.slice(0, 5));
    } catch (e) {
      console.error("Geocoding error:", e);
    }
  };

  const handleSuggestionClick = (s) => {
    const pos = { lat: parseFloat(s.lat), lng: parseFloat(s.lon) };
    setMarker(pos);
    onChange(pos);
    setSuggestions([]);
    setSearch(s.display_name);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setMarker(coords);
        onChange(coords);
      },
      (err) => {
        console.error("Geolocation error:", err);
      }
    );
  };

  return (
    <div className="space-y-2">
      {/* Search bar */}
      <div className="relative">
        <input
          value={search}
          onChange={(e) => searchAddress(e.target.value)}
          placeholder="Search address..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        {suggestions.length > 0 && (
          <div className="absolute left-0 right-0 bg-white border rounded-lg mt-1 shadow-lg z-20 max-h-40 overflow-y-auto text-sm">
            {suggestions.map((s) => (
              <button
                type="button"
                key={s.place_id}
                onClick={() => handleSuggestionClick(s)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {s.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Use My Location */}
      <button
        type="button"
        onClick={useMyLocation}
        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Use My Location
      </button>

      <Map
        mapLib={maplibregl}
        initialViewState={{
          latitude: value?.lat || 47.6062,
          longitude: value?.lng || -122.3321,
          zoom: 11,
        }}
        style={{
          width: "100%",
          height: "350px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
        mapStyle="https://tiles.stadiamaps.com/styles/alidade_smooth.json"
        onClick={handleClick}
        attributionControl={false} // hide default control
        onLoad={({ target: map }) => {
          // add compact attribution in a safe corner
          map.addControl(
            new maplibregl.AttributionControl({ compact: true }),
            "bottom-left"
          );
        }}
      >
        {marker && (
          <Marker longitude={marker.lng} latitude={marker.lat} anchor="bottom">
            <div className="text-2xl drop-shadow">📍</div>
          </Marker>
        )}
      </Map>
    </div>
  );
}
