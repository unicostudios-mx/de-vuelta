# De Vuelta — Guía para Claude Code

**Lee `CONTEXT.md` antes de cualquier tarea.** Es la fuente de verdad del proyecto
(fases, decisiones, esquema). Este archivo solo cubre lo operativo.

## Qué es

PWA hiperlocal para reunir mascotas perdidas con sus dueños en la Alcaldía
Benito Juárez, CDMX. Next.js 15 + Supabase (PostGIS) + Mapbox + Serwist.
Repo: `unicostudios-mx/vecino-peludo`, rama de trabajo: `main` (push directo,
NO crear ramas `claude/` sin permiso explícito).

## Estado actual

- **Fase 0**: docs listos; pendientes manuales (entrevistas, dominio).
- **Fase 1**: ✅ completa. Schema aplicado en Supabase (migraciones 0001+0002),
  clientes SSR, PWA, validador del polígono BJ, shadcn base, mapbox-gl.
- **Siguiente**: conectar Vercel (CLI local autenticado) y arrancar Fase 2
  (perfil de mascota: auth + CRUD + políticas RLS reales).

## Comandos

```bash
npm run dev              # dev server (Turbopack)
npm run build            # build producción (webpack — Serwist lo requiere; NO usar --turbopack)
npm run lint             # ESLint
npm run validate-polygon # prueba el polígono BJ (3 casos)
supabase db push         # aplica migraciones pendientes (CLI ya linkeado al proyecto)
supabase gen types typescript --linked > types/database.ts  # regenera tipos DB
```

## Arquitectura (lo no obvio)

- `lib/geo/bj-polygon.json` es **generado** por `scripts/prepare-geo.mjs` en
  `postinstall` desde `data/benito-juarez.geojson` (canónico, no tocar). Si un
  import falla ahí: `npm install`.
- `lib/env.ts` es la única puerta a variables de entorno (`publicEnv` /
  `serverEnv`). No usar `process.env.X!` directo en código nuevo.
- Clientes Supabase: `lib/supabase/client.ts` (browser), `server.ts` (SSR +
  `createAdminClient()` con service role), `middleware.ts` (refresh de sesión,
  consumido por `middleware.ts` raíz). No meter lógica entre
  `createServerClient` y `getUser()` en el middleware.
- `types/database.ts` está escrito a mano contra el schema 0001+0002;
  regenerarlo con el CLI cuando haya cambios de schema.
- RLS está **deny-all** en las 9 tablas: ninguna query de app funcionará hasta
  escribir políticas (primera tarea de Fase 2, como migración 0003).
- shadcn/ui: base configurada (`components.json`, `lib/utils.ts`, tokens en
  `app/globals.css`). Agregar componentes con `npx shadcn add <x>` (funciona
  en local; en el entorno remoto de Claude la red lo bloquea).
- Tokens de color: `primary` = teal de marca `#0F766E`, `destructive` =
  urgencia `#DC2626`, extras `urgency`/`success`. Usar clases de token
  (`text-primary`), no hex arbitrarios.

## Reglas del proyecto

1. **Invariante geográfico**: toda coordenada se valida con
   `isInBenitoJuarez()` (`lib/geo/validate-bj.ts`) antes de escribir en DB.
2. **Migraciones inmutables**: nunca editar una migración ya aplicada; crear
   la siguiente numerada. Mostrar el SQL al usuario antes de aplicarlo.
3. **Privacidad**: ubicaciones exactas nunca se exponen públicamente.
4. UI en español mexicano; código y commits en inglés (conventional commits).
5. Nunca commitear `.env.local` ni llaves; `SUPABASE_SERVICE_ROLE_KEY` es
   solo servidor.
6. Antes de commitear: `npm run build && npm run lint` + scan de secrets.
7. Al cerrar cada fase: actualizar `CONTEXT.md` (estado, decisiones, archivos).

## Variables de entorno (.env.local — pedir al usuario, nunca inventar)

`NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` ·
`SUPABASE_SERVICE_ROLE_KEY` · `NEXT_PUBLIC_MAPBOX_TOKEN`
(futuras: OneSignal F5, Anthropic F6, MercadoPago F8 — ver `.env.example`)

## Tarea inmediata pendiente (sesión local)

Conectar Vercel con el CLI autenticado del usuario:
`vercel link --yes` → `vercel git connect` → `vercel env add` (las 4 de arriba,
production) → `vercel --prod`. Verificar que el build de Vercel corra el
postinstall del polígono y sirva `/manifest.json` y `/sw.js`.
