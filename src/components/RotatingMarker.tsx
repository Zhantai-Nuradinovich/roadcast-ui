import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import arrowIcon from "../assets/arrow.svg";

type Props = {
  position: [number, number];
  heading: number;
  map: maplibregl.Map | null;
};

export default function RotatingMarker({ position, heading, map }: Props) {
  const markerRef = useRef<maplibregl.Marker | null>(null);

  // Создание маркера после полной загрузки карты
useEffect(() => {
  if (!map) return;

  map.on("load", () => {
    if (!markerRef.current) {
      const iconElement = document.createElement("img");
      iconElement.src = new URL(arrowIcon, import.meta.url).href;
      iconElement.style.width = "42px";
      iconElement.style.height = "42px";
      iconElement.style.pointerEvents = "none";
      iconElement.style.transformOrigin = "50% 50%";

      markerRef.current = new maplibregl.Marker({
        element: iconElement,
        rotationAlignment: "map",
        pitchAlignment: "map",
      })
        .setLngLat(position)
        .addTo(map);
    }
  });

}, [map]);

  // Обновление позиции и поворота
  useEffect(() => {
    if (!markerRef.current) return;
    markerRef.current.setLngLat(position);
    const el = markerRef.current.getElement() as HTMLImageElement;
    el.style.transform = `rotate(${heading}deg)`;
  }, [position, heading]);

  return null;
}
