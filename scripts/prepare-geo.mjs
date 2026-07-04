// Copia el polígono BJ canónico a un .json importable por Next.js.
// Se ejecuta en postinstall — lib/geo/bj-polygon.json está gitignoreado.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '../data/benito-juarez.geojson');
const OUT = path.join(__dirname, '../lib/geo/bj-polygon.json');

const raw = fs.readFileSync(SRC, 'utf8');
const geojson = JSON.parse(raw); // valida que sea JSON bien formado

if (geojson.features?.[0]?.properties?.CVEGEO !== '09014') {
  console.error('prepare-geo: data/benito-juarez.geojson no contiene el feature 09014');
  process.exit(1);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, raw, 'utf8');
console.log(`prepare-geo: ${path.relative(process.cwd(), OUT)} listo`);
