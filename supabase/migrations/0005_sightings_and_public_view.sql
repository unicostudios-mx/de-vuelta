-- ============================================================
-- De Vuelta — Avistamientos + superficie pública (Fase 4)
-- Versión: 0005
-- Ejecutar con: supabase db push  (NO ejecutar manualmente)
-- ============================================================

-- ============================================================
-- VISTA PÚBLICA: active_reports_public
--
-- La ÚNICA superficie pública de datos del proyecto. Regla de
-- privacidad: las coordenadas exactas nunca se exponen — aquí se
-- anclan a una cuadrícula de 0.003° (~333 m lat, ~315 m lng a la
-- latitud de CDMX). Snap determinístico, no jitter: el jitter se
-- puede promediar entre lecturas para recuperar el punto real.
--
-- La view corre con permisos de su dueño (postgres), por eso
-- "atraviesa" el RLS de lost_reports/pets — es intencional: expone
-- exclusivamente estas columnas de reportes activos.
-- ============================================================
create view public.active_reports_public as
select
  lr.id,
  p.name        as pet_name,
  p.species,
  p.color,
  p.breed,
  p.photo_urls,
  lr.notes,                -- señas escritas por el dueño para los vecinos
  lr.reward_amount,
  lr.last_seen_at,
  round(lr.last_seen_lat / 0.003) * 0.003 as approx_lat,
  round(lr.last_seen_lng / 0.003) * 0.003 as approx_lng,
  lr.created_at
from public.lost_reports lr
join public.pets p on p.id = lr.pet_id
where lr.status = 'active';

grant select on public.active_reports_public to anon, authenticated;

-- ============================================================
-- FUNCIÓN: is_active_report
--
-- security definer: las subqueries dentro de una policy corren con
-- el RLS del usuario que consulta, y un vecino NO puede leer
-- lost_reports ajenos — sin esto, la policy de insert de sightings
-- no podría verificar que el reporte existe y sigue activo.
-- ============================================================
create function public.is_active_report(rid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.lost_reports
    where id = rid and status = 'active'
  );
$$;

-- ============================================================
-- RLS: public.sightings
-- ============================================================

-- Solo con cuenta, solo sobre reportes activos, y el flujo de
-- callejeros (report_id null / needs_help) queda diferido a Fase 7.
create policy "sightings_insert_on_active_report"
  on public.sightings for insert
  to authenticated
  with check (
    spotter_id = auth.uid()
    and report_id is not null
    and needs_help = false
    and public.is_active_report(report_id)
  );

-- El spotter ve los suyos; el dueño del reporte ve los de SUS
-- reportes (el exists sí pasa aquí: el dueño lee sus propias filas
-- de lost_reports bajo su propio RLS). La ubicación exacta del
-- avistamiento queda visible solo para estas dos personas.
create policy "sightings_select_spotter_or_report_owner"
  on public.sightings for select
  to authenticated
  using (
    spotter_id = auth.uid()
    or exists (
      select 1 from public.lost_reports lr
      where lr.id = report_id
        and lr.reporter_id = auth.uid()
    )
  );

-- Sin update/delete: los avistamientos son inmutables.

-- ============================================================
-- STORAGE: bucket sighting-photos
-- Mismo patrón que pet-photos: lectura pública, escritura solo del
-- autor dentro de su carpeta ({uid}/...).
-- ============================================================
insert into storage.buckets (id, name, public)
values ('sighting-photos', 'sighting-photos', true);

create policy "sighting_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'sighting-photos');

create policy "sighting_photos_owner_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'sighting-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
