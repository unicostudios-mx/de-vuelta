-- ============================================================
-- De Vuelta — Migración inicial del schema
-- Versión: 0001
-- Ejecutar con: supabase db push  (NO ejecutar manualmente)
-- ============================================================

-- Extensiones
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- ============================================================
-- TABLA: users
-- Extiende auth.users de Supabase con datos del perfil
-- ============================================================
create table public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text        not null,
  phone         text,
  avatar_url    text,
  neighborhood  text,                          -- colonia dentro de BJ
  is_partner    boolean     not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.users enable row level security;

-- Deny-all (sin políticas explícitas de acceso todavía)
-- Las políticas se añadirán en migraciones posteriores cuando
-- se implemente la autenticación (Fase 2).

-- ============================================================
-- TABLA: pets
-- Mascota registrada por un dueño
-- ============================================================
create table public.pets (
  id          uuid        primary key default uuid_generate_v4(),
  owner_id    uuid        not null references public.users(id) on delete cascade,
  name        text        not null,
  species     text        not null check (species in ('dog', 'cat', 'other')),
  breed       text,
  color       text        not null,
  description text,
  photo_urls  text[]      not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.pets enable row level security;

-- ============================================================
-- TABLA: lost_reports
-- Reporte de mascota perdida, con ubicación georreferenciada
-- ============================================================
create table public.lost_reports (
  id              uuid        primary key default uuid_generate_v4(),
  pet_id          uuid        not null references public.pets(id) on delete cascade,
  reporter_id     uuid        not null references public.users(id),
  status          text        not null default 'active'
                    check (status in ('active', 'resolved', 'expired')),
  -- Última ubicación conocida
  last_seen_lat   numeric(9,6) not null
                    check (last_seen_lat  between -90  and 90),
  last_seen_lng   numeric(9,6) not null
                    check (last_seen_lng  between -180 and 180),
  last_seen_at    timestamptz not null,
  last_seen_loc   geography(Point, 4326)
                    generated always as (
                      st_point(last_seen_lng::double precision,
                               last_seen_lat::double precision)::geography
                    ) stored,
  notes           text,
  reward_amount   numeric(10,2) check (reward_amount >= 0),
  resolved_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index on public.lost_reports using gist (last_seen_loc);
create index on public.lost_reports (status);

alter table public.lost_reports enable row level security;

-- ============================================================
-- TABLA: sightings
-- Avistamiento reportado por un vecino
-- ============================================================
create table public.sightings (
  id              uuid        primary key default uuid_generate_v4(),
  report_id       uuid        not null references public.lost_reports(id) on delete cascade,
  spotter_id      uuid        not null references public.users(id),
  lat             numeric(9,6) not null
                    check (lat between -90  and 90),
  lng             numeric(9,6) not null
                    check (lng between -180 and 180),
  location        geography(Point, 4326)
                    generated always as (
                      st_point(lng::double precision,
                               lat::double precision)::geography
                    ) stored,
  spotted_at      timestamptz not null,
  photo_urls      text[]      not null default '{}',
  notes           text,
  created_at      timestamptz not null default now()
);

create index on public.sightings using gist (location);
create index on public.sightings (report_id);

alter table public.sightings enable row level security;

-- ============================================================
-- TABLA: matches
-- Coincidencia confirmada entre avistamiento y reporte
-- ============================================================
create table public.matches (
  id          uuid        primary key default uuid_generate_v4(),
  report_id   uuid        not null references public.lost_reports(id) on delete cascade,
  sighting_id uuid        not null references public.sightings(id) on delete cascade,
  confidence  numeric(4,3)  check (confidence between 0 and 1),  -- score IA (Fase 6)
  confirmed   boolean     not null default false,
  confirmed_by uuid       references public.users(id),
  confirmed_at timestamptz,
  created_at  timestamptz not null default now(),
  unique (report_id, sighting_id)
);

alter table public.matches enable row level security;

-- ============================================================
-- TABLA: notifications
-- Notificaciones push/in-app enviadas a usuarios
-- ============================================================
create table public.notifications (
  id          uuid        primary key default uuid_generate_v4(),
  user_id     uuid        not null references public.users(id) on delete cascade,
  type        text        not null
                check (type in ('new_sighting', 'match_found', 'report_nearby',
                                'report_resolved', 'partner_alert')),
  payload     jsonb       not null default '{}',
  read        boolean     not null default false,
  sent_at     timestamptz,
  created_at  timestamptz not null default now()
);

create index on public.notifications (user_id, read);

alter table public.notifications enable row level security;

-- ============================================================
-- TABLA: partners
-- Veterinarias y refugios aliados
-- ============================================================
create table public.partners (
  id          uuid        primary key default uuid_generate_v4(),
  user_id     uuid        references public.users(id) on delete set null,
  name        text        not null,
  type        text        not null check (type in ('vet', 'shelter', 'rescue')),
  address     text        not null,
  lat         numeric(9,6) not null
                check (lat between -90  and 90),
  lng         numeric(9,6) not null
                check (lng between -180 and 180),
  location    geography(Point, 4326)
                generated always as (
                  st_point(lng::double precision,
                           lat::double precision)::geography
                ) stored,
  phone       text,
  website     text,
  active      boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index on public.partners using gist (location);

alter table public.partners enable row level security;

-- ============================================================
-- TABLA: adoptable_pets
-- Mascotas en adopción publicadas por partners (Fase 4)
-- ============================================================
create table public.adoptable_pets (
  id          uuid        primary key default uuid_generate_v4(),
  partner_id  uuid        not null references public.partners(id) on delete cascade,
  name        text        not null,
  species     text        not null check (species in ('dog', 'cat', 'other')),
  breed       text,
  age_months  integer     check (age_months >= 0),
  description text,
  photo_urls  text[]      not null default '{}',
  available   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.adoptable_pets enable row level security;

-- ============================================================
-- TABLA: animal_stories
-- Historias de reencuentro para comunidad (Fase 7)
-- ============================================================
create table public.animal_stories (
  id          uuid        primary key default uuid_generate_v4(),
  report_id   uuid        references public.lost_reports(id) on delete set null,
  author_id   uuid        not null references public.users(id),
  title       text        not null,
  body        text        not null,
  photo_urls  text[]      not null default '{}',
  published   boolean     not null default false,
  published_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.animal_stories enable row level security;

-- ============================================================
-- Trigger: actualizar updated_at automáticamente
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create trigger trg_pets_updated_at
  before update on public.pets
  for each row execute function public.set_updated_at();

create trigger trg_lost_reports_updated_at
  before update on public.lost_reports
  for each row execute function public.set_updated_at();

create trigger trg_partners_updated_at
  before update on public.partners
  for each row execute function public.set_updated_at();

create trigger trg_adoptable_pets_updated_at
  before update on public.adoptable_pets
  for each row execute function public.set_updated_at();

create trigger trg_animal_stories_updated_at
  before update on public.animal_stories
  for each row execute function public.set_updated_at();
