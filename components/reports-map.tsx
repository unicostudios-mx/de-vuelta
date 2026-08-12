"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { publicEnv } from "@/lib/env";
import { getBenitoJuarezPolygon } from "@/lib/geo/validate-bj";

const BJ_CENTER: [number, number] = [-99.163, 19.372];

export type ReportPin = {
  id: string;
  lat: number;
  lng: number;
  label: string; // nombre de la mascota
  sublabel?: string; // p. ej. "Vista el 9 ago"
};

/**
 * Mapa público de reportes activos: polígono BJ + un pin por reporte con
 * popup que enlaza al detalle. Solo display — para elegir ubicación está
 * LocationPicker. Los pins llegan ya aproximados desde la view pública;
 * este componente nunca ve coordenadas exactas.
 */
export function ReportsMap({ pins }: { pins: ReportPin[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    mapboxgl.accessToken = publicEnv.mapboxToken;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: BJ_CENTER,
      zoom: 12.5,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      map.addSource("bj-boundary", {
        type: "geojson",
        data: getBenitoJuarezPolygon(),
      });
      map.addLayer({
        id: "bj-fill",
        type: "fill",
        source: "bj-boundary",
        paint: { "fill-color": "#0F766E", "fill-opacity": 0.06 },
      });
      map.addLayer({
        id: "bj-line",
        type: "line",
        source: "bj-boundary",
        paint: { "line-color": "#0F766E", "line-width": 2 },
      });
    });

    const markers = pins.map((pin) => {
      const popup = new mapboxgl.Popup({ offset: 24 }).setHTML(
        `<div style="font-family:inherit">
           <strong>${escapeHtml(pin.label)}</strong>
           ${pin.sublabel ? `<br/><span style="color:#6b7280">${escapeHtml(pin.sublabel)}</span>` : ""}
           <br/><a href="/perdidos/${pin.id}" style="color:#0F766E;text-decoration:underline">Ver reporte</a>
         </div>`
      );
      return new mapboxgl.Marker({ color: "#DC2626" })
        .setLngLat([pin.lng, pin.lat])
        .setPopup(popup)
        .addTo(map);
    });

    return () => {
      markers.forEach((m) => m.remove());
      map.remove();
    };
    // Los pins vienen de un Server Component; no cambian en vivo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-96 w-full rounded-md border border-border"
      aria-label="Mapa de mascotas perdidas en Benito Juárez"
    />
  );
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
