import { MapContainer, TileLayer, Marker } from "react-leaflet";

export function MapView({ userLocation, nearbyUsers }) {
  return (
    <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={15}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      <Marker position={[userLocation.lat, userLocation.lng]} />
      
      {nearbyUsers.map((u) => (
        <Marker key={u.userId} position={[u.latitude, u.longitude]} />
      ))}
    </MapContainer>
  );
}
