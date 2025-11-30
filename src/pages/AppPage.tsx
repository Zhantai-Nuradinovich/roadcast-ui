import React, { useEffect, useState } from "react";
import NavigationMap from "../components/NavigationMap";
import { startHubs, geoHub, dmHub } from "../api/signalrClient";
import { useInterval } from "../hooks/useInterval";
import { movePoint } from "../services/MovementEngine";
import type { LocationUpdateDto } from "../models/LocationUpdateDto";

export default function AppPage() {
  const [pos, setPos] = useState({ lat: 43.238949, lng: 76.889709 }); // пример Бишкек
  const [speed, setSpeed] = useState(40); // km/h
  const [heading, setHeading] = useState(90); // deg
  const [auto, setAuto] = useState(false);
  const [nearby, setNearby] = useState<any[]>([]);
  const [pathHistory, setPathHistory] = useState([{ lat: pos.lat, lng: pos.lng }]);

  useEffect(() => { startHubs(); }, []);

  useEffect(() => {
    geoHub.on("NearbyUsersUpdated", (users:any) => setNearby(users));
    dmHub.on("DirectMessageReceived", (msg:any) => alert("DM: " + JSON.stringify(msg)));
    return () => {
      geoHub.off("NearbyUsersUpdated");
      dmHub.off("DirectMessageReceived");
    };
  }, []);

  useInterval(() => {
    if (!auto) return;
    const next = movePoint(pos.lat, pos.lng, speed, heading, 2);
    setPos({ lat: next.latitude, lng: next.longitude });

    const dto: LocationUpdateDto = {
      latitude: next.latitude,
      longitude: next.longitude,
      speed,
      heading,
      timestamp: new Date().toISOString(),
      anonId: "anon_test"
    };

    // отправляем на хаб
    geoHub.invoke("SendLocation", dto).catch(console.error);
  }, auto ? 2000 : null);

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <div style={{ width: 320, padding: 10 }}>
        <h3>Controls</h3>
        <label>Speed km/h <input type="number" value={speed} onChange={e=>setSpeed(Number(e.target.value))} /></label><br/>
        <label>Heading deg <input type="number" value={heading} onChange={e=>setHeading(Number(e.target.value))} /></label><br/>
        <label><input type="checkbox" checked={auto} onChange={e=>setAuto(e.target.checked)} /> Auto-move</label><br/>
        <button onClick={()=>{
          const dto: LocationUpdateDto = {
            latitude: pos.lat, longitude: pos.lng, speed, heading, timestamp: new Date().toISOString(), anonId: "anon_test"
          };
          geoHub.invoke("SendLocation", dto).catch(console.error);
        }}>Send now</button>
      </div>

      <div style={{ flex: 1 }}>
        <NavigationMap
          pos={pos}
          heading={heading}
          pathHistory={pathHistory}
        />
      </div>
    </div>
  );
}
