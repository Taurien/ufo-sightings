import { useState, useRef } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// import mapboxgl from "mapbox-gl";

interface MapboxMapProps {
  token: string;
  initialLongitude?: number;
  initialLatitude?: number;
  initialZoom?: number;
}

export default function MapboxMap({
  token,
  initialLongitude = -74.006,
  initialLatitude = 40.7128,
  initialZoom = 12,
}: MapboxMapProps) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const [showPopup, setShowPopup] = useState(true);

  return (
    <Map
      mapboxAccessToken={token}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      style={{ width: "100%", height: "100vh" }}
      initialViewState={{
        longitude: initialLongitude,
        latitude: initialLatitude,
        zoom: initialZoom,
      }}
    >
      <NavigationControl />

      <Marker longitude={initialLongitude} latitude={initialLatitude}>
        <div
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: "red",
            borderRadius: "50%",
            border: "2px solid white",
          }}
        />
      </Marker>

      {showPopup && (
        <Popup
          longitude={initialLongitude}
          latitude={initialLatitude}
          anchor="bottom"
          onClose={() => setShowPopup(false)}
        >
          <div>New York City</div>
        </Popup>
      )}
    </Map>
  );
}
