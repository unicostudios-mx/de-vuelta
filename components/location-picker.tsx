"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { publicEnv } from "@/lib/env";
import { isInBenitoJuarez, getBenitoJuarezPolygon } from "@/lib/geo/validate-bj";

// Centro aproximado de la Alcaldía Benito Juárez.
const BJ_CENTER: [number, number] = [-99.163, 19.372];

type Coords = { lat: number; lng: number };

/**
 * Mapa para elegir una ubicación dentro de Benito Juárez.
 * Reutilizable: Fase 3 lo usa para "última vez vista"; Fase 4 lo usará
 * para avistamientos. Expone la coordenada elegida como inputs hidden
 * lat/lng para que el <form> padre la mande a la Server Action.
 * La validación aquí es UX inmediata; el invariante real se re-valida
 * server-side en la action.
 */
export function LocationPicker({
  initial,
  readOnly = false,
  markers = [],
}: {
  initial?: Coords;
  readOnly?: boolean;
  /** Pins secundarios (teal), p. ej. avistamientos sobre el pin original. */
  markers?: Coords[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [coords, setCoords] = useState<Coords | null>(initial ?? null);
  const [outsideWarning, setOutsideWarning] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    mapboxgl.accessToken = publicEnv.mapboxToken;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initial ? [initial.lng, initial.lat] : BJ_CENTER,
      zoom: initial ? 15 : 12.5,
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

    const placeMarker = (lngLat: mapboxgl.LngLat) => {
      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker({ color: "#DC2626" })
          .setLngLat(lngLat)
          .addTo(map);
      } else {
        markerRef.current.setLngLat(lngLat);
      }
    };

    if (initial) placeMarker(new mapboxgl.LngLat(initial.lng, initial.lat));

    const extraMarkers = markers.map((m) =>
      new mapboxgl.Marker({ color: "#0F766E" })
        .setLngLat([m.lng, m.lat])
        .addTo(map)
    );

    if (!readOnly) {
      map.on("click", (e) => {
        const { lat, lng } = e.lngLat;
        if (!isInBenitoJuarez(lat, lng)) {
          setOutsideWarning(true);
          return;
        }
        setOutsideWarning(false);
        placeMarker(e.lngLat);
        setCoords({ lat, lng });
      });
    }

    return () => {
      extraMarkers.forEach((m) => m.remove());
      markerRef.current = null;
      map.remove();
    };
    // El mapa se monta una sola vez; initial/readOnly no cambian en vivo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="h-72 w-full rounded-md border border-border"
        aria-label="Mapa de Benito Juárez"
      />
      {!readOnly && (
        <>
          <p className="text-sm text-muted-foreground">
            {coords
              ? "Ubicación marcada. Puedes ajustarla con otro clic."
              : "Toca el mapa donde la viste por última vez."}
          </p>
          {outsideWarning && (
            <p className="text-sm text-destructive">
              La ubicación debe estar dentro de Benito Juárez.
            </p>
          )}
          <input type="hidden" name="lat" value={coords?.lat ?? ""} />
          <input type="hidden" name="lng" value={coords?.lng ?? ""} />
        </>
      )}
    </div>
  );
}
