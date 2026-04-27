import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as turf from '@turf/turf';
import type { FeatureCollection, Polygon } from 'geojson';

const __dirname = dirname(fileURLToPath(import.meta.url));
const geojsonPath = join(__dirname, '../data/benito-juarez.geojson');

const fc = JSON.parse(readFileSync(geojsonPath, 'utf8')) as FeatureCollection<Polygon>;
const polygon = fc.features[0];

function isInsideBJ(lat: number, lng: number): boolean {
  const point = turf.point([lng, lat]);
  return turf.booleanPointInPolygon(point, polygon);
}

const tests = [
  { name: 'Del Valle',  lat: 19.3899, lng: -99.1707, expected: true  },
  { name: 'Narvarte',   lat: 19.3935, lng: -99.1567, expected: true  },
  { name: 'Coyoacán',   lat: 19.3467, lng: -99.1618, expected: false },
];

let allPassed = true;

for (const t of tests) {
  const result = isInsideBJ(t.lat, t.lng);
  const pass = result === t.expected;
  const icon = pass ? '✅' : '❌';
  console.log(`${icon} ${t.name.padEnd(12)} lat=${t.lat}, lng=${t.lng} → ${result} (expected ${t.expected})`);
  if (!pass) allPassed = false;
}

console.log('');
console.log(allPassed ? '✅ All tests passed.' : '❌ Some tests failed.');
process.exit(allPassed ? 0 : 1);
