import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({ center, nearby = [] }: { center: {lat:number,lng:number}, nearby: any[] }) {
  return (
    <MapContainer center={[center.lat, center.lng]} zoom={15} style={{ height: "70vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[center.lat, center.lng]} />
      {nearby.map(u => <Marker key={u.userId} position={[u.latitude, u.longitude]} />)}
    </MapContainer>
  );
}
