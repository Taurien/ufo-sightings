import {
  ZoomControl,
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Ufo } from "../../models";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://raw.githubusercontent.com/Taurien/ufo-sightings/2b15f804f22103c17dd5ac0655277c010aa4a4b1/public/assets/ovni.svg",
  iconUrl:
    "https://raw.githubusercontent.com/Taurien/ufo-sightings/2b15f804f22103c17dd5ac0655277c010aa4a4b1/public/assets/ovni.svg",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  // Add size and anchor options
  // iconSize: [30, 30], // Size of the icon [width, height]
  // iconAnchor: [12, 41], // Point of icon which corresponds to marker's location
  // popupAnchor: [1, -34], // Point from which popup opens relative to iconAnchor
  // tooltipAnchor: [16, -28], // Point from which tooltip opens relative to iconAnchor
  // shadowSize: [41, 41],          // Size of the shadow
  // shadowAnchor: [12, 41],        // Point of shadow which corresponds to marker's location
});

interface LeafletMapProps {
  markers: [];

  center?: [number, number];
  zoom?: number;
}

export default function LeafletMap({
  markers,

  center = [0, -0],
  zoom = 2,
}: LeafletMapProps) {
  return (
    <div className=" h-full relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> |  <a href="https://nuforc.org">National UFO Reporting Center</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        {markers.map((m: Ufo) => (
          <Circle
            key={m.id}
            center={[m.coordinates!.latitude, m.coordinates!.longitude]}
            radius={5000}
            color="green"
          >
            <Marker
              position={[m.coordinates!.latitude, m.coordinates!.longitude]}
            >
              <Popup>
                UFO Sighting at {m.coordinates!.latitude},{" "}
                {m.coordinates!.longitude}
              </Popup>
            </Marker>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}
