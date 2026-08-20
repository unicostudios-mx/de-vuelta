-- ============================================================
-- 0007 — Índices para el rate limiting de avistamientos (Fase 6, hardening)
-- ============================================================
-- Solo índices: ninguna tabla, columna ni policy cambia.
--
-- El límite por vecino cuenta cuántos avistamientos mandó en la última
-- hora, y esa cuenta corre en el camino crítico de su Server Action —
-- antes de subir la foto, para que un abusador tampoco nos llene el
-- Storage. Sin índice es un seq scan sobre toda la tabla `sightings`.
create index if not exists sightings_spotter_created_idx
  on public.sightings (spotter_id, created_at desc);

-- El límite de análisis de IA por vecino cruza `sightings` con `matches`
-- por `sighting_id`. La constraint unique (report_id, sighting_id) ya
-- existente no sirve para ese lado del join: `sighting_id` no es su
-- prefijo.
create index if not exists matches_sighting_idx
  on public.matches (sighting_id);
