// src/components/NavigationMap.tsx
import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import arrowIcon from "../assets/arrow.svg";

type Props = {
  pos: { lat: number; lng: number };
  heading: number;
  pathHistory: { lat: number; lng: number }[];
};

export default function NavigationMap({ pos, heading, pathHistory }: Props) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const arrowElRef = useRef<HTMLImageElement | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style:
        "https://api.maptiler.com/maps/streets/style.json?key=",
      center: [pos.lng, pos.lat],
      zoom: 16,
      pitch: 60,
      bearing: heading,
      interactive: true,
    });

    mapRef.current = map;

    // Создаем элемент стрелки
    const img = document.createElement("img");
    img.src = new URL(arrowIcon, import.meta.url).href;
    img.alt = "arrow";
    img.style.width = "42px";
    img.style.height = "42px";
    img.style.pointerEvents = "none";
    img.style.display = "block";
    arrowElRef.current = img;

    // Добавляем маркер после загрузки карты
    const onLoad = () => {
      if (mapRef.current && !markerRef.current) {
        markerRef.current = new maplibregl.Marker({
          element: arrowElRef.current!,
          rotationAlignment: "map",
          pitchAlignment: "map",
        })
          .setLngLat([pos.lng, pos.lat])
          .setRotation(heading)
          .addTo(mapRef.current);
      }
    };

    map.on("load", onLoad);

    return () => {
      map.off("load", onLoad);
      markerRef.current?.remove();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      arrowElRef.current = null;
    };
  }, []);

  // 🔄 Обновление позиции и поворота стрелки
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    markerRef.current.setLngLat([pos.lng, pos.lat]);
    markerRef.current.setRotation(heading);

    mapRef.current.easeTo({
      center: [pos.lng, pos.lat],
      bearing: heading,
      pitch: 60,
      duration: 800,
    });
  }, [pos, heading]);

  // 📍 История пути
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const sourceId = "path-history-source";

    if (map.getLayer("path-history-layer")) {
      map.removeLayer("path-history-layer");
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    if (pathHistory && pathHistory.length > 1) {
      const geojson: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: pathHistory.map((p) => [p.lng, p.lat]),
            },
          },
        ],
      };

      map.addSource(sourceId, {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "path-history-layer",
        type: "line",
        source: sourceId,
        paint: {
          "line-color": "#007AFF",
          "line-width": 4,
        },
      });
    }
  }, [pathHistory]);

  return <div ref={containerRef} style={{ width: "100%", height: "90vh" }} />;
}
