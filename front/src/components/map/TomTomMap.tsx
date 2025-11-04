// https://developer.tomtom.com/maps-sdk-web-js/documentation#Maps.Map

import { useEffect, useRef } from "react";
import * as tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

interface TomTomMapProps {
  apiKey: string;
  center?: [number, number];
  zoom?: number;
}

export default function TomTomMap({
  apiKey,
  center = [-74.006, 40.7128],
  zoom = 12,
}: TomTomMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<tt.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = tt.map({
      key: apiKey,
      container: mapContainer.current,
      center: center,
      zoom: zoom,
    });

    // Add marker
    const marker = new tt.Marker().setLngLat(center).addTo(mapRef.current);

    // Add popup
    const popup = new tt.Popup({ offset: 35 }).setHTML(`<p>New York City</p>`);

    marker.setPopup(popup);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={mapContainer} style={{ height: "500px", width: "100%" }} />;
}
