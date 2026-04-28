-- ============================================================
-- De Vuelta — Correcciones al schema v0001
-- Versión: 0002
-- Ejecutar con: supabase db push  (NO ejecutar manualmente)
-- ============================================================

-- ============================================================
-- CRÍTICO: sightings.report_id → nullable
--
-- Dos flujos válidos:
--   Flujo A: report_id IS NOT NULL → avistamiento asociado a un lost_report existente
--   Flujo B: report_id IS NULL     → animal callejero/sin dueño conocido; needs_help=true
--            indica que el vecino solicita intervención aunque no exista reporte previo
-- ============================================================
alter table public.sightings
  alter column report_id drop not null;

alter table public.sightings
  add column needs_help boolean not null default false;

-- ============================================================
-- PREGUNTA a: sightings.spotter_id → nullable + ON DELETE SET NULL
-- Preserva el avistamiento (foto, coordenadas, contexto) si el usuario se elimina
-- ============================================================
alter table public.sightings
  alter column spotter_id drop not null;

alter table public.sightings
  drop constraint sightings_spotter_id_fkey,
  add constraint sightings_spotter_id_fkey
    foreign key (spotter_id) references public.users(id) on delete set null;

-- ============================================================
-- MEJORA 1: Especies más explícitas en pets y adoptable_pets
-- ============================================================
alter table public.pets
  drop constraint pets_species_check,
  add constraint pets_species_check
    check (species in ('dog', 'cat', 'rabbit', 'bird', 'reptile', 'rodent', 'other'));

alter table public.adoptable_pets
  drop constraint adoptable_pets_species_check,
  add constraint adoptable_pets_species_check
    check (species in ('dog', 'cat', 'rabbit', 'bird', 'reptile', 'rodent', 'other'));

-- ============================================================
-- MEJORA 2: lost_reports.reporter_id → nullable + ON DELETE SET NULL
-- Preserva el reporte (y toda su cadena de sightings/matches) si el dueño
-- elimina su cuenta; reporter_id queda NULL pero el caso sigue activo
-- ============================================================
alter table public.lost_reports
  alter column reporter_id drop not null;

alter table public.lost_reports
  drop constraint lost_reports_reporter_id_fkey,
  add constraint lost_reports_reporter_id_fkey
    foreign key (reporter_id) references public.users(id) on delete set null;

-- ============================================================
-- MEJORA 3: Índice en pets.owner_id
-- Optimiza "dame todas las mascotas de este dueño"
-- ============================================================
create index on public.pets (owner_id);

-- ============================================================
-- MEJORA 4: Índice único parcial en partners.user_id
-- Un usuario solo puede tener un perfil de partner; NULL queda excluido
-- del índice (múltiples partners sin usuario vinculado son válidos)
-- ============================================================
create unique index partners_user_id_unique
  on public.partners (user_id)
  where user_id is not null;

-- ============================================================
-- MEJORA 5: Índice en notifications por usuario + fecha descendente
-- Optimiza "últimas N notificaciones de este usuario" (orden más frecuente)
-- ============================================================
create index on public.notifications (user_id, created_at desc);

-- ============================================================
-- PREGUNTA b: matches.confirmed_by → ON DELETE SET NULL
-- Si el usuario que confirmó el match se elimina, el match sigue siendo
-- válido; solo pierde la referencia a quién lo confirmó
-- ============================================================
alter table public.matches
  drop constraint matches_confirmed_by_fkey,
  add constraint matches_confirmed_by_fkey
    foreign key (confirmed_by) references public.users(id) on delete set null;

-- ============================================================
-- PREGUNTA c: animal_stories.author_id → nullable + ON DELETE SET NULL
-- La historia de reencuentro tiene valor comunitario independiente de
-- si el autor sigue activo en la plataforma
-- ============================================================
alter table public.animal_stories
  alter column author_id drop not null;

alter table public.animal_stories
  drop constraint animal_stories_author_id_fkey,
  add constraint animal_stories_author_id_fkey
    foreign key (author_id) references public.users(id) on delete set null;
