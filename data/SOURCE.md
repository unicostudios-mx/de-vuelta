# Fuente del polígono — Alcaldía Benito Juárez

## Archivo: `benito-juarez.geojson`

| Campo | Valor |
|---|---|
| **Fuente primaria** | PhantomInsights/mexico-geojson (GitHub) |
| **URL de descarga** | https://raw.githubusercontent.com/PhantomInsights/mexico-geojson/main/2023/states/Ciudad%20de%20M%C3%A9xico.json |
| **Fecha de descarga** | 2026-04-27 |
| **Año del dato** | 2023 |
| **Origen del shapefile** | CONABIO (Comisión Nacional para el Conocimiento y Uso de la Biodiversidad) |
| **Código geoestadístico** | CVEGEO: 09014 (09 = CDMX, 014 = Benito Juárez) |
| **Licencia** | Datos públicos derivados de CONABIO/INEGI — uso libre con atribución |

## Proceso de extracción

El archivo original contiene los 16 alcaldías de CDMX como features individuales.
Se filtró el feature donde `properties.CVEGEO === "09014"` y se guardó como
FeatureCollection de un solo elemento en `data/benito-juarez.geojson`.

## Fuente alternativa verificada

Portal de Datos Abiertos CDMX:
- Dataset: https://datos.cdmx.gob.mx/dataset/alcaldias
- Recurso shapefile: resource ID `8648431b-4f34-4f1a-a4b1-19142f944300`
- Nota: el portal devuelve 403 desde entornos de CI/CD; usar la fuente GitHub arriba.

## Verificación de coordenadas

- Punto Del Valle (19.3899, -99.1707): dentro ✓
- Punto Narvarte (19.3935, -99.1567): dentro ✓
- Punto Coyoacán (19.3467, -99.1618): fuera ✓
