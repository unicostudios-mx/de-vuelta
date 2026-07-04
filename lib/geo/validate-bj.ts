import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import type { Feature, FeatureCollection, Polygon } from "geojson";
// Generado por scripts/prepare-geo.mjs (postinstall) desde data/benito-juarez.geojson.
// Si este import falla, corre: npm install
import bjData from "./bj-polygon.json";

// Polígono oficial de la Alcaldía Benito Juárez (CVEGEO 09014, 464 puntos).
// Fuente: CONABIO 2023 — ver data/SOURCE.md
const bjPolygon = (bjData as FeatureCollection).features[0] as Feature<Polygon>;

/**
 * Valida que una coordenada esté dentro de la Alcaldía Benito Juárez.
 * Toda ubicación creada por la app (reportes, avistamientos, partners)
 * debe pasar por aquí antes de escribirse en la base de datos.
 */
export function isInBenitoJuarez(lat: number, lng: number): boolean {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
  // GeoJSON usa orden [lng, lat]
  return booleanPointInPolygon(point([lng, lat]), bjPolygon);
}

/** Polígono BJ listo para renderizar como capa en Mapbox. */
export function getBenitoJuarezPolygon(): Feature<Polygon> {
  return bjPolygon;
}
