---
name: de-vuelta
description: >
  Contexto operativo y lecciones aprendidas del proyecto "De Vuelta" (PWA
  hiperlocal para reunir mascotas perdidas con sus dueños en la Alcaldía
  Benito Juárez, CDMX — Next.js 15 + Supabase/PostGIS + Mapbox + Serwist).
  Úsalo SIEMPRE que trabajes dentro de este repositorio, sin importar la
  tarea puntual: escribir código nuevo, arreglar un bug, planear la
  siguiente fase, tocar Supabase (auth, RLS, migraciones, storage), o hacer
  deploy en Vercel. Consúltalo especialmente antes de correr una migración,
  tocar variables de entorno en Vercel, o si te topas con un error de
  Supabase (llaves legacy deshabilitadas, tipos de TypeScript rotos tras
  regenerar `database.ts`) o del build (`next build`, componentes shadcn,
  versiones de `@supabase/ssr`). `CONTEXT.md` y `CLAUDE.md` en la raíz del
  repo son la fuente de verdad del proyecto; este skill guarda lo que ya
  aprendimos a la mala para no perder tiempo repitiéndolo.
---

# De Vuelta — contexto de proyecto

## Antes que nada

1. Lee `CONTEXT.md` (fuente de verdad: qué es el proyecto, fases, esquema de
   datos, decisiones tomadas) y `CLAUDE.md` (guía operativa: comandos,
   arquitectura, reglas) en la raíz del repo. Se auto-cargan como
   instrucciones de proyecto, pero si ha pasado tiempo desde la última
   sesión, vuelve a leerlos — se actualizan al cerrar cada fase.
2. Lee [`references/update-log.md`](references/update-log.md) — el estado
   más reciente de en qué fase vamos y qué quedó pendiente o a medias la
   última vez que se trabajó aquí.
3. Antes de escribir código nuevo que toque Supabase, Vercel o shadcn,
   revisa [`references/troubleshooting.md`](references/troubleshooting.md)
   — son fricciones reales que ya costaron tiempo resolver en este mismo
   proyecto (desfases de versiones, configuración no obvia de dashboards).
   Evita repetirlas desde cero.

## Reglas no negociables

El detalle completo vive en `CLAUDE.md`; el resumen que más se olvida:

- **Invariante geográfico**: toda coordenada (mascota, reporte, avistamiento)
  se valida con `isInBenitoJuarez()` (`lib/geo/validate-bj.ts`) antes de
  escribir en la base de datos. Fuera de Benito Juárez se rechaza.
- **Migraciones inmutables**: nunca editar una migración ya aplicada — crear
  la siguiente numerada en `supabase/migrations/`. Mostrar el SQL completo
  al usuario y esperar su confirmación antes de correr `supabase db push`
  contra el proyecto real.
- **No saltarse fases** del plan macro (`CONTEXT.md` sección "Plan macro")
  sin confirmación explícita del usuario.
- **Idioma**: UI en español mexicano; código, commits (`feat:`, `fix:`,
  `chore:`...) y nombres de archivo en inglés.
- **Build**: `npm run build` usa webpack porque Serwist lo requiere — nunca
  agregar `--turbopack` ahí. `npm run dev` sí usa Turbopack.
- **Env vars**: nunca `process.env.X!` directo en código nuevo — todo pasa
  por `lib/env.ts` (`publicEnv` / `serverEnv`), que falla con un mensaje
  claro si falta la variable en vez de fallar en silencio.

## Mapa del repo

| Qué | Dónde |
|---|---|
| Acceso validado a env vars | `lib/env.ts` |
| Clientes Supabase | `lib/supabase/client.ts` (browser), `server.ts` (SSR + `createAdminClient()` con service role), `middleware.ts` (refresh de sesión + protección de rutas) |
| Validación geográfica BJ | `lib/geo/validate-bj.ts`; polígono generado en `lib/geo/bj-polygon.json` por `scripts/prepare-geo.mjs` en `postinstall` desde `data/benito-juarez.geojson` (canónico, no tocar) |
| Migraciones SQL | `supabase/migrations/000N_*.sql` |
| Tipos de la base de datos | `types/database.ts` — regenerar con `supabase gen types typescript --linked > types/database.ts` después de cada migración (ver troubleshooting: el CLI ensucia el archivo) |
| Auth + CRUD de mascotas (Fase 2) | `app/(auth)/` (login, signup, actions), `app/auth/confirm/` (verificación de email), `app/logout/`, `app/mascotas/` (lista, crear, editar/borrar) |
| Componentes shadcn/ui | `components/ui/` — agregar con `npx shadcn add <componente>` (funciona en local; no lo intentes en el entorno remoto de Claude, ahí la red lo bloquea) |
| Formularios/acciones compartidas | `components/pet-form.tsx`, `components/delete-pet-button.tsx`, `app/mascotas/actions.ts` |

## Estado actual

Ver [`references/update-log.md`](references/update-log.md) para el detalle
más reciente — no lo dupliques aquí, se desactualiza rápido. Resumen de
altísimo nivel: Fase 1 (arquitectura + PWA) completa y desplegada en
Vercel. Fase 2 (perfil de mascota: auth + CRUD + RLS real) en progreso.

## Al cerrar una sesión de trabajo

Si aprendiste algo que otra sesión futura en este repo necesita saber (un
gotcha nuevo de Supabase/Vercel/dependencias, en qué quedó una fase a
medias, un bloqueo pendiente), agrégalo a `references/update-log.md` con la
fecha. Si cerraste una fase completa, actualiza también `CONTEXT.md` — es
regla del proyecto (`CLAUDE.md` regla 7).
