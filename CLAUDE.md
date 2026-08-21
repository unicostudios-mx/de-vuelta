# De Vuelta — Guía para Claude Code

**Lee `CONTEXT.md` antes de cualquier tarea.** Es la fuente de verdad del proyecto
(fases, decisiones, esquema). Este archivo solo cubre lo operativo.

## Qué es

PWA hiperlocal para reunir mascotas perdidas con sus dueños en la Alcaldía
Benito Juárez, CDMX. Next.js 15 + Supabase (PostGIS) + Mapbox + Serwist.
Repo: `unicostudios-mx/de-vuelta` (renombrado; antes `vecino-peludo`), rama
de trabajo: `main` (push directo, NO crear ramas `claude/` sin permiso
explícito). Producción: `de-vuelta.vercel.app`.

## Estado actual

- **Fase 0**: docs listos; pendientes manuales (entrevistas, dominio).
- **Fase 1**: ✅ completa y desplegada en Vercel.
- **Fase 2**: ✅ completa. Auth email+contraseña, CRUD de mascotas con fotos
  en Storage, RLS real en `users`/`pets` (migración 0003), verificada
  end-to-end. OJO: "Confirm email" está apagado en Supabase durante
  desarrollo — reactivar antes del piloto.
- **Fase 3**: ✅ completa. Reportes de pérdida con mapa Mapbox
  (`LocationPicker` reutilizable), invariante BJ validado client- y
  server-side, RLS de `lost_reports` (migración 0004), verificada
  end-to-end incluyendo intentos de bypass.
- **Fase 4**: ✅ completa. Lado público (`/perdidos`, view
  `active_reports_public` con ubicación aproximada ~300 m) + flujo de
  vecinos con cuenta (`?next=` en auth), RLS de `sightings`
  (migración 0005), verificada end-to-end incluyendo negativos vía API.
- **Fase 5**: ✅ completa y verificada end-to-end. Push OneSignal:
  broadcast a BJ al crear reporte + aviso dirigido al dueño al llegar un
  avistamiento. Notificación real entregada en producción. Antes de tocar
  service workers o llamar `optOut()`, leer
  `.claude/skills/de-vuelta/references/troubleshooting.md` → "Push: la
  configuración correcta (y cómo NO romperla)".
- **Fase 6**: ✅ completa. Matching con Claude vision: cada avistamiento con
  foto recibe un score de coincidencia contra la mascota, y el dueño lo
  confirma o descarta (`lib/matching.ts`, migración 0006). Verificado en
  producción: 0.97 para la misma perra, 0.02 para un perro distinto. Costo
  real ~$0.01 por avistamiento. El push, la fila de match y el análisis
  corren en `after()` de `next/server` — fuera del camino crítico: si algo
  vuelve a bloquear la respuesta del vecino, la espera se dispara a ~27 s.
  Rate limiting en `lib/rate-limit.ts`: 20 avisos/hora por vecino rechazan
  el envío; 8 análisis/hora por vecino y 25/hora por reporte solo saltan el
  score (el aviso se guarda y el dueño revisa a mano).
- **Siguiente**: Fase 7 (capa comunitaria + adopción curada) — la fase más
  grande del plan; leer el detalle en `CONTEXT.md` sección 7 antes de
  empezar, tiene varias decisiones de producto abiertas.

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
- `types/database.ts` se **genera** con el CLI (`supabase gen types`).
  Regenerarlo tras cada migración. OJO: el CLI escupe avisos a stdout que se
  cuelan en la primera/última línea del archivo — revisarlas.
- RLS: `users`/`pets` (0003), `lost_reports` (0004), `sightings` + view
  pública (0005) y `matches` (0006) ya tienen políticas. Siguen **deny-all**
  y sin usar: `notifications`, `partners`, `adoptable_pets`, `animal_stories`
  — les toca en Fase 7.
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

Configuradas en Vercel y en uso: `NEXT_PUBLIC_SUPABASE_URL` ·
`NEXT_PUBLIC_SUPABASE_ANON_KEY` · `SUPABASE_SERVICE_ROLE_KEY` ·
`NEXT_PUBLIC_MAPBOX_TOKEN` · `NEXT_PUBLIC_ONESIGNAL_APP_ID` ·
`ONESIGNAL_REST_API_KEY` · `ANTHROPIC_API_KEY`. Futura: MercadoPago (F8).

OJO: las marcadas **Sensitive** en Vercel (`SUPABASE_SERVICE_ROLE_KEY`,
`ONESIGNAL_REST_API_KEY`, `ANTHROPIC_API_KEY`) bajan **vacías** con
`vercel env pull` — hay que reponerlas a mano en `.env.local`. Y las
`NEXT_PUBLIC_*` NO deben marcarse Sensitive (no se inyectan en el build).

## Pendientes conocidos

- **BLOQUEADOR del piloto — SMTP propio**: "Confirm email" ya está
  ENCENDIDO (2026-08-21), pero el proyecto usa el SMTP integrado de
  Supabase, limitado a **2 correos/hora** y con el campo no editable en
  plan Free. Es decir: hoy la app admite 2 registros por hora. Hace falta
  SMTP propio (Resend) + dominio antes de abrir a usuarios reales. El
  dashboard mismo lo advierte: "not meant to be used for production apps".
  Las cuentas de prueba NO se ven afectadas: se crean con la Admin API y
  `email_confirm: true`, que se salta el mailer.
- ~~Vistazo visual humano a los mapas~~: HECHO (2026-08-20) vía Claude in
  Chrome, que sí compone el canvas (el panel de navegador de Claude Code
  no). Ambos mapas correctos: `/perdidos` con pines rojos y popup
  "Ver reporte"; detalle del dueño con pin rojo + verdes y zoom ajustado a
  los pines. OJO: los tiles tardan ~4 s en pintar — una captura inmediata
  muestra el mapa en blanco y parece roto.
- **Deuda menor**: las rutas con mapa pesan ~620-650 kB First Load por
  `mapbox-gl`; candidato a `next/dynamic` si llega a molestar.
- **Sin implementar**: el estado `expired` de reportes (necesita un job
  programado).
