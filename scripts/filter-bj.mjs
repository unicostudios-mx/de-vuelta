import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../data/benito-juarez.geojson');
const URL = 'https://raw.githubusercontent.com/PhantomInsights/mexico-geojson/main/2023/states/Ciudad%20de%20M%C3%A9xico.json';

console.log('Downloading CDMX GeoJSON...');

https.get(URL, (res) => {
  if (res.statusCode !== 200) {
    console.error(`HTTP ${res.statusCode}`);
    process.exit(1);
  }

  const chunks = [];
  res.on('data', (chunk) => chunks.push(chunk));
  res.on('end', () => {
    const raw = Buffer.concat(chunks).toString('utf8');
    const geojson = JSON.parse(raw);

    const bj = geojson.features.find(
      (f) => f.properties.CVEGEO === '09014'
    );

    if (!bj) {
      console.error('Feature 09014 (Benito Juárez) not found in source file.');
      process.exit(1);
    }

    const output = {
      type: 'FeatureCollection',
      features: [bj],
    };

    fs.writeFileSync(OUT, JSON.stringify(output, null, 2), 'utf8');
    console.log(`Saved: ${OUT}`);
    console.log(`Feature: ${bj.properties.NOMGEO} (${bj.properties.CVEGEO})`);
    console.log(`Coordinates: ${bj.geometry.coordinates[0].length} points`);
  });
}).on('error', (err) => {
  console.error('Network error:', err.message);
  console.error('');
  console.error('Run this manually in your terminal:');
  console.error(`  node scripts/filter-bj.mjs`);
  process.exit(1);
});
