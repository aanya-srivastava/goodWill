import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Hospital {
  id: number;
  name: string;
  address: string;
  distance: string;
  hours: string;
  lat: number;
  lng: number;
}

interface HospitalMapProps {
  hospitals: Hospital[];
  userLocation: {
    lat: number;
    lng: number;
  } | null;
}

// Fix missing marker icons in React + Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export const HospitalMap = ({
  hospitals,
  userLocation,
}: HospitalMapProps) => {
  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [hospitals[0].lat, hospitals[0].lng];

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border shadow-md">
      <MapContainer
        center={center as [number, number]}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Your Current Location</Popup>
          </Marker>
        )}

        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={[hospital.lat, hospital.lng]}
          >
            <Popup>
              <strong>{hospital.name}</strong>
              <br />
              {hospital.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};