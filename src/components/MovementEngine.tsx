import { useEffect, useRef, useState } from "react";
import { movePoint } from "../services/MovementEngine";

interface MovementEngineProps {
  speed: number;
  heading: number;
  onPositionChange?: (pos: { latitude: number; longitude: number }) => void;
}

const MovementEngine: React.FC<MovementEngineProps> = ({
  speed,
  heading,
}) => {
  const [position, setPosition] = useState({
    latitude: 42.8746, // Старт: Бишкек (можешь изменить)
    longitude: 74.5698,
  });

  const lastUpdateTime = useRef<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const deltaSeconds =
        (now.getTime() - lastUpdateTime.current.getTime()) / 1000;
      lastUpdateTime.current = now;

      setPosition((prev) => {
        const newPos = movePoint(
          prev.latitude,
          prev.longitude,
          speed,
          heading,
          deltaSeconds
        );

        // 🔊 Передаём координаты в MapView (как событие для подписчиков)
        window.dispatchEvent(
          new CustomEvent("locationUpdated", { detail: newPos })
        );

        return newPos;
      });
    }, 1000); // каждый 1 сек

    return () => clearInterval(interval);
  }, [speed, heading]);

  return (
    <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd" }}>
      <p>📍 Latitude: {position.latitude.toFixed(6)}</p>
      <p>📍 Longitude: {position.longitude.toFixed(6)}</p>
    </div>
  );
};

export default MovementEngine;
