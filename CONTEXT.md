# De Vuelta — Contexto del Proyecto

> Este documento es la fuente de verdad del proyecto. Se actualiza al final de cada fase.
> Todo prompt a Claude Code debe empezar con: "Lee CONTEXT.md antes de proceder."

---

## 1. Qué es

App hiperlocal para reunir mascotas perdidas con sus dueños y coordinar rescate de animales callejeros, combinando IA de reconocimiento de fotos, mapa en tiempo real, comunidad por colonia y red de veterinarias y refugios aliados.

**Nombre de la app:** De Vuelta
**Pitch en una frase:** Convierte tu colonia en una red de búsqueda activa cuando una mascota se pierde.

**Repositorio:** `unicostudios-mx/de-vuelta`
**Organización:** Unico Studios

---

## 2. Problema y usuarios

**Problema central:** Cuando una mascota se pierde, las primeras 24 horas son críticas y la mayoría sigue dentro de un radio de 1-2 km. La información de búsqueda está fragmentada (WhatsApp, Facebook, postes con cinta) y los vecinos que sí quieren ayudar no se enteran a tiempo.

**Usuario principal:** Dueños de mascotas que las pierden.

**Usuarios secundarios:**
- Vecinos y transeúntes que ven animales perdidos o callejeros
- Rescatistas y refugios verificados
- Veterinarias aliadas

---

## 3. Zona piloto

**Alcaldía Benito Juárez, Ciudad de México.**

- ~385,000 habitantes
- ~26 km²
- Colonias con comunidad activa: Del Valle, Narvarte, Nápoles, Portales, Mixcoac, Acacias, Letrán Valle
- Densidad alta de mascotas
- **Restricción técnica invariante:** la app valida que toda coordenada (mascota, reporte, avistamiento) caiga dentro del polígono oficial de Benito Juárez. Fuera de la alcaldía se rechaza.

---

## 4. Diferenciadores

1. **IA de reconocimiento de fotos** — comparar avistamientos con mascotas perdidas (Claude API visión)
2. **Geolocalización en tiempo real** — mapa con pins, calor de avistamientos, radio de búsqueda
3. **Comunidad por colonia** — feed local segmentado, héroes vecinos, casos resueltos
4. **Red de aliados** — veterinarias y refugios verificados con vitrina de adopción

**Diferenciador narrativo único:** "Historia continua del animal" — un perfil que evoluciona de avistamiento → rescate → adopción → nuevo hogar, con notificaciones a todos los que ayudaron en el camino.

---

## 5. Stack técnico (MVP = PWA)

**Decisión:** PWA como MVP. Migración a React Native con Expo se evalúa post-piloto si hay tracción.

**Frontend / App:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (componentes)
- next-pwa o Serwist (configuración PWA)

**Backend / Datos:**
- Supabase (Auth, PostgreSQL con PostGIS, Storage, Realtime)

**Mapas:**
- Mapbox GL JS
- Turf.js (cálculos geoespaciales en cliente, opcional)

**Notificaciones push:**
- OneSignal (preferido, tier gratis hasta 10k usuarios)
- Fallback: Web Push API nativa

**IA / Visión (Fase 6):**
- Anthropic Claude API (modelo con visión para matching de fotos)

**Pagos (Fase 8):**
- MercadoPago

**Deploy:**
- Vercel (hosting Next.js)
- GitHub (versión, repositorio en `unicostudios-mx/de-vuelta`)

---

## 6. Modelo de sostenibilidad

- **Gratis** para reportar pérdidas y avistamientos. No se monetiza el dolor del usuario.
- **Donaciones puntuales** activadas en momentos clave: caso resuelto, perfil de animal en adopción, feed.
- **Patrocinios** de veterinarias y marcas pet locales con perfil destacado en la app.

---

## 7. Plan macro (fases)

| Fase | Título | Estado |
|------|--------|--------|
| 0 | Fundamentos (validación + cuentas + zona) | 🔄 En progreso — docs listos, pendiente acciones manuales |
| 1 | Arquitectura y esqueleto | ✅ Completa — desplegada en Vercel (`de-vuelta.vercel.app`) |
| 2 | Perfil de mascota | ✅ Completa — auth + CRUD + RLS real, verificada end-to-end |
| 3 | Reportar pérdida | ✅ Completa — mapa Mapbox + invariante BJ + RLS, verificada end-to-end |
| 4 | Reportar avistamiento | ✅ Completa — lado público con ubicación aproximada + flujo de vecinos, verificada end-to-end |
| 5 | Notificaciones geográficas | ✅ Completa — push OneSignal (broadcast BJ + dirigido al dueño), notificación real entregada y verificada en producción |
| 6 | Matching (manual + IA) | ✅ Completa — score de Claude vision por avistamiento + confirmar/descartar, verificada en producción |
| 7 | Capa comunitaria + adopción curada | Pendiente |
| 8 | Sostenibilidad (pagos y patrocinios) | Pendiente |
| 9 | Lanzamiento del piloto en BJ | Pendiente |
| 10 | Marketplace abierto de adopción (condicional) | Pendiente |

### Detalle de Fase 7 — Capa comunitaria + adopción curada

**7a — Comunidad y rescate:**
- Feed por colonia dentro de BJ (avistamientos, casos resueltos, animales en rescate)
- Perfil público de usuario con historial de rescates/ayudas
- Casos de rescate (animal herido o callejero) — flujo separado
- Directorio de veterinarias y refugios aliados de la alcaldía

**7b — Adopción curada (vitrina, no marketplace):**
- Sólo refugios y rescatistas verificados pueden publicar animales en adopción
- Tarjeta: foto, historia, requisitos, refugio responsable
- Sección "En adopción cerca de ti" filtrada por colonia/distancia
- Botón "Me interesa" → formulario que se envía al refugio
- Verificación de aliados manual al inicio (acta constitutiva o RFC del rescatista)

**7c — Historia continua del animal:**
- Perfil que evoluciona: avistamiento → rescate → adopción → nuevo hogar
- Usuarios que ayudaron en cualquier punto reciben actualizaciones del caso
- Timeline visible con cada hito

---

## 8. Esquema de datos (aplicado en Supabase — ver `supabase/migrations/0001` y `0002`)

- `users` — auth, perfil, ubicación de referencia
- `pets` — mascotas registradas (foto, nombre, raza, color, edad, marcas, datos médicos, dueño)
- `lost_reports` — reportes de mascotas perdidas (mascota, última ubicación, hora, descripción, estado)
- `sightings` — avistamientos (foto, geo, descripción, flag de "necesita ayuda", reporte asociado opcional)
- `matches` — sugerencias de match entre sighting y lost_report (score IA, estado)
- `notifications` — push enviadas, leídas, etc.
- `partners` — veterinarias y refugios aliados (verificados manualmente)
- `adoptable_pets` — animales en adopción publicados por partners verificados
- `animal_stories` — timeline del recorrido continuo de un animal

---

## 9. Métricas de éxito del piloto

- 100 mascotas registradas en BJ
- Al menos 1 caso de mascota perdida resuelto vía la app
- Al menos 1 adopción facilitada
- Tiempo promedio de recuperación menor que el método actual (postes + Facebook)
- 2-3 veterinarias y 1-2 refugios activos como aliados

---

## 10. Reglas para Claude Code

1. **Siempre leer este archivo antes de cualquier prompt.**
2. **No saltarse fases.** Si un prompt pide algo de Fase 5 estando en Fase 2, pedir confirmación.
3. **Validar criterios de "Listo cuando"** antes de marcar fase completa.
4. **Actualizar este CONTEXT.md** al cierre de cada fase con: cambios al esquema, decisiones técnicas tomadas, archivos clave creados.
5. **Restricción geográfica de BJ es invariante** — toda coordenada debe validarse contra el polígono.
6. **Privacidad por default** — ubicaciones exactas no se exponen públicamente, solo aproximadas en el mapa público.
7. **Idioma:** UI en español mexicano. Código y commits en inglés.
8. **Conventional commits** — usar prefijos: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.

---

## 11. Decisiones tomadas

- 2026-04-26: Stack confirmado como PWA (Next.js + Supabase + Mapbox + OneSignal)
- 2026-04-26: Zona piloto confirmada como Alcaldía Benito Juárez
- 2026-04-26: Adopción se integra en Fase 7 como vitrina curada (solo refugios verificados)
- 2026-04-26: Modelo de monetización: donaciones + patrocinios, nunca paywall
- 2026-04-26: Repositorio creado en organización Unico Studios (`unicostudios-mx/vecino-peludo`)
- 2026-04-26: Migración a React Native con Expo queda diferida a evaluación post-piloto
- 2026-04-28: **Nombre definitivo confirmado: "De Vuelta"** (reemplaza "Vecino Peludo" como working title)
- 2026-04-28: Polígono de BJ obtenido de PhantomInsights/mexico-geojson (CONABIO 2023), CVEGEO 09014, 464 puntos — ver `data/SOURCE.md`
- 2026-04-28: Paleta de color v1 definida: Primario Teal `#0F766E` · Urgencia Red `#DC2626` · Éxito Green `#16A34A` (todos WCAG AA)
- 2026-04-28: Tono de voz híbrido: cálido/comunitario en feed, urgente/funcional en flujo de pérdida activa
- 2026-04-28: Primer aliado objetivo: Protectora Nacional de Animales (PNA), Portales — única en BJ con veterinaria + adopción activa
- 2026-07-04: Schema v1 aplicado en Supabase (9 tablas, PostGIS, RLS deny-all, CHECK lat/lng); `gen_random_uuid()` en vez de `uuid-ossp` (en Supabase la extensión vive en el schema `extensions` y rompe defaults sin prefijo)
- 2026-07-04: `sightings.report_id` nullable + columna `needs_help` — habilita el flujo de animal callejero sin reporte previo (migración 0002)
- 2026-07-04: FKs a `users` con `ON DELETE SET NULL` en reportes/avistamientos/matches/historias — el contenido comunitario sobrevive si el usuario borra su cuenta
- 2026-07-08: Build de producción con webpack (`next build` sin `--turbopack`): Serwist inyecta el service worker vía plugin de webpack que Turbopack no ejecuta; `dev` sigue en Turbopack
- 2026-07-08: Iconos PWA solo SVG (decisión de Fase 1); PNGs para apple-touch-icon pendientes
- 2026-07-08: shadcn/ui configurado a mano (`components.json`, `lib/utils.ts`, tokens en `globals.css`) — el CLI no alcanza ui.shadcn.com desde el entorno remoto; `npx shadcn add <componente>` debe correrse en máquina local
- 2026-07-08: `mapbox-gl` v3 sin `@types/mapbox-gl` (v3 trae sus propios types; el de DefinitelyTyped es stub deprecado)
- 2026-07-08: El polígono BJ se importa vía `lib/geo/bj-polygon.json`, generado por `scripts/prepare-geo.mjs` en `postinstall` desde el `.geojson` canónico (Next.js solo importa `.json` nativamente)
- 2026-07-26: Repo de GitHub renombrado a `unicostudios-mx/de-vuelta` (antes `vecino-peludo`); Vercel conectado al repo nuevo, proyecto `unicostudios-mxs-projects/de-vuelta`, producción en `de-vuelta.vercel.app`
- 2026-07-26: En Vercel, las env vars `NEXT_PUBLIC_*` NO deben marcarse "Sensitive" (no se inyectan en build time y el middleware truena); solo `SUPABASE_SERVICE_ROLE_KEY` va Sensitive
- 2026-08-09: Auth de Fase 2 = email + contraseña (no magic link): el flujo de emergencia no puede depender de la latencia del correo
- 2026-08-09: Migración 0003 aplicada — RLS real en `users`/`pets` (scoped al dueño), trigger `handle_new_user` que sincroniza `auth.users` → `public.users`, bucket Storage `pet-photos` (lectura pública, escritura solo del dueño en su carpeta `{owner_id}/...`)
- 2026-08-09: Llaves legacy (anon/service_role) re-habilitadas en Supabase — el proyecto las traía deshabilitadas por default y el código las usa; "Confirm email" APAGADO durante desarrollo, **reactivar antes del piloto (Fase 9)**
- 2026-08-09: Formularios con Server Actions + `useActionState` (React 19), NO react-hook-form: el componente `form` de shadcn arrastra un conflicto de peer deps `zod@3` vs `zod@4` (requerido por Serwist)
- 2026-08-09: Fase 2 verificada end-to-end contra Supabase real (signup → CRUD con foto → aislamiento RLS entre cuentas) y pusheada a `main`
- 2026-08-09: Fase 3 = solo el lado del dueño (crear/listar/resolver sus reportes); la visibilidad pública con ubicación aproximada se diseña en Fase 4 junto con avistamientos, que es donde se necesita
- 2026-08-09: Migración 0004 — RLS de `lost_reports` scoped al dueño, insert exige que el pet le pertenezca (exists sobre `pets`), **sin policy de delete**: los reportes se resuelven, no se borran (historial para Fase 7)
- 2026-08-09: `LocationPicker` (`components/location-picker.tsx`) reutilizable para Fase 4: mapa Mapbox con capa del polígono BJ, pin validado client-side + re-validación server-side en la action (el invariante real vive en el servidor)
- 2026-08-09: Gotcha zod: nunca `.max(new Date())` en schemas a nivel de módulo — se congela al cargar el server; usar `.refine((d) => d.getTime() <= Date.now() + 60_000)` (encontrado en pruebas, ya corregido)
- 2026-08-09: `datetime-local` se convierte a ISO/UTC en el cliente (hidden input) — el navegador conoce la zona del usuario, el servidor de Vercel corre en UTC
- 2026-08-09: Deuda menor: rutas con mapa pesan ~620-650 kB First Load por `mapbox-gl`; candidato a `next/dynamic` cuando duela
- 2026-08-12: Fase 4 — avistamientos requieren cuenta (control de spam; Fases 5/7 necesitan identidad); flujo de callejeros (`needs_help` sin reporte) diferido a Fase 7
- 2026-08-12: Privacidad geo pública = snap determinístico a cuadrícula de 0.003° (~300 m) en la view `active_reports_public` — snap y no jitter porque el jitter se puede promediar entre lecturas para recuperar el punto real
- 2026-08-12: `active_reports_public` (migración 0005) es LA única superficie pública de datos: view con permisos de owner que atraviesa el RLS deny-all exponiendo solo columnas seguras de reportes activos; grant a `anon`+`authenticated`
- 2026-08-12: Patrón para policies que referencian tablas ajenas: las subqueries de una policy corren con el RLS del usuario consultante → función `security definer` (`is_active_report`) para que el vecino pueda validar "reporte existe y está activo" sin poder leer `lost_reports`
- 2026-08-12: Flujo `?next=` en auth (middleware + hidden input en login/signup, validado contra open-redirect: solo paths `/...` y nunca `//...`) — un vecino sin cuenta que da "La vi" aterriza de vuelta en el formulario tras registrarse
- 2026-08-16: Fase 5 — push OneSignal: broadcast a todo BJ suscrito al crear reporte (a escala del piloto, la alcaldía completa ES el radio útil; el radio real llega con masa de usuarios) + push dirigido al dueño al llegar avistamiento (`external_id` = id de Supabase, fijado con `OneSignal.login`)
- 2026-08-16: SW de OneSignal en scope propio `/push/onesignal/` para convivir con el de Serwist (scope `/`); SDK inicializado solo con sesión, detrás de una promesa global (el doble-mount de React en dev corría `login()` antes de terminar el `init`)
- 2026-08-16: Todos los envíos push son fire-and-forget (try/catch + log): la notificación jamás bloquea la creación de reportes/avistamientos
- 2026-08-16: Primera vez que se usa `createAdminClient()`: leer `reporter_id` server-side para el push dirigido (el vecino no puede leer `lost_reports` por RLS y el dato nunca llega al cliente)
- 2026-08-16: Sin filas en la tabla `notifications` todavía (historial in-app diferido a la capa comunitaria); tabla queda deny-all
- 2026-08-19: Fase 6 — la IA compara la foto del avistamiento SOLO contra la mascota declarada por el vecino (1 llamada por avistamiento); el cross-match contra todos los reportes se difiere hasta que haya volumen
- 2026-08-19: Confirmar un match NO resuelve el reporte — "la vieron" no es "ya está en casa"; el dueño cierra el reporte a mano
- 2026-08-19: Migración 0006 sin columnas nuevas: los 3 estados de revisión se derivan de lo existente (`confirmed_at IS NULL` = pendiente; `confirmed` distingue confirmado de descartado)
- 2026-08-19: `matches` sin policy de insert/delete — las filas las escribe el servidor con service role; si el usuario pudiera insertar, se fabricaría su propio score
- 2026-08-19: Modelo `claude-opus-5` para el matching: distinguir *este* perro de *otro igualito* es donde la precisión importa. **Costo real medido: ~$0.01 por avistamiento con foto** (~1,400 tokens in / ~100 out), la mitad de lo estimado
- 2026-08-19: Los scores son privados del dueño; exponerlos en `/perdidos` le diría al vecino qué tan "creíble" luce su aviso
- 2026-08-19: El post-procesamiento del avistamiento (push + fila de match + visión) corre en `after()` de `next/server`, no antes de responder. Medido en producción: bloqueando eran **27 s** de spinner para el vecino; con `after()`, **4.7 s**. En una urgencia, 27 s se leen como "falló" y el vecino reenvía — avistamiento duplicado y segundo push al dueño
- 2026-08-16: Gotcha Vercel: las env vars "Sensitive" NO bajan con `vercel env pull` (llegan vacías a `.env.local` por diseño) — afecta `SUPABASE_SERVICE_ROLE_KEY` y `ONESIGNAL_REST_API_KEY` en desarrollo local; en prod se inyectan bien en runtime

## 12. Archivos clave creados en Fase 0

- `data/benito-juarez.geojson` — polígono oficial BJ (464 puntos, CVEGEO 09014)
- `data/SOURCE.md` — documentación de fuente y licencia del polígono
- `scripts/filter-bj.mjs` — script de descarga y extracción del polígono
- `scripts/validate-polygon.ts` — función de validación lat/lng contra polígono BJ
- `docs/validation-plan.md` — guion de entrevistas para validación del problema
- `docs/partners-prospects.md` — mapeo de 5 veterinarias y 3 refugios en BJ
- `docs/brand.md` — identidad v1: nombre, tono, paleta, manifiesto
- `docs/accounts-checklist.md` — servicios a crear con orden, datos sensibles y template .env
- `docs/phase-0-summary.md` — resumen de cierre, bloqueos y acciones pendientes

## 13. Archivos clave creados en Fase 1

**Migraciones (aplicadas contra Supabase el 2026-07-04):**
- `supabase/migrations/0001_initial_schema.sql` — 9 tablas, PostGIS, RLS deny-all, triggers `updated_at`
- `supabase/migrations/0002_schema_fixes.sql` — sightings sin reporte, ON DELETE SET NULL, especies ampliadas, índices

**Infraestructura de la app:**
- `lib/supabase/client.ts` / `server.ts` / `middleware.ts` — clientes @supabase/ssr (browser, SSR + admin, refresh de sesión)
- `middleware.ts` — middleware raíz de Next.js (sesiones Supabase)
- `types/database.ts` — tipos de las 9 tablas + enums (regenerar: `supabase gen types typescript --linked`)
- `lib/env.ts` — acceso validado a variables de entorno (publicEnv / serverEnv)
- `lib/geo/validate-bj.ts` — `isInBenitoJuarez(lat, lng)` y `getBenitoJuarezPolygon()`
- `scripts/prepare-geo.mjs` — genera `lib/geo/bj-polygon.json` en postinstall
- `lib/utils.ts` + `components.json` — base shadcn/ui (componentes se agregan con CLI local)

**PWA:**
- `app/sw.ts` — service worker Serwist
- `public/manifest.json` — manifest es-MX, standalone, theme #0F766E
- `public/icons/icon.svg` + `icon-maskable.svg` — iconos SVG (huella / teal)

**Deploy (cerrado el 2026-07-26):**
- Vercel conectado a `unicostudios-mx/de-vuelta`, env vars configuradas, producción en `de-vuelta.vercel.app`

## 14. Archivos clave creados en Fase 2

**Migración (aplicada contra Supabase el 2026-08-09):**
- `supabase/migrations/0003_pet_profile_rls.sql` — trigger `handle_new_user`, políticas RLS de `users`/`pets`, bucket `pet-photos` + políticas de `storage.objects`

**Auth:**
- `app/(auth)/login/page.tsx` / `signup/page.tsx` / `actions.ts` — formularios cliente (`useActionState`) + Server Actions `signIn`/`signUp` con validación zod
- `app/auth/confirm/route.ts` — verificación del link de confirmación (`verifyOtp`)
- `app/logout/route.ts` — signOut vía POST
- `lib/supabase/middleware.ts` — extendido: protege `/mascotas`, redirige sesiones activas fuera de `/login`/`/signup`

**CRUD de mascotas:**
- `app/mascotas/page.tsx` (lista) / `nueva/page.tsx` / `[id]/editar/page.tsx`
- `app/mascotas/actions.ts` — `createPet`/`updatePet`/`deletePet` con subida de fotos a Storage (`{owner_id}/{uuid}-{nombre}`)
- `components/pet-form.tsx` / `delete-pet-button.tsx`
- `components/ui/` — shadcn: button, input, label, textarea, select, card, avatar (sin `form`, ver decisión 2026-08-09)

**Infra de sesión local:**
- `.claude/skills/de-vuelta/` — skill de proyecto con troubleshooting y update-log entre sesiones
- `.claude/launch.json` — config del dev server para el preview del navegador

## 15. Archivos clave creados en Fase 3

**Migración (aplicada contra Supabase el 2026-08-09):**
- `supabase/migrations/0004_lost_reports_rls.sql` — RLS de `lost_reports`: insert con verificación de propiedad del pet, select/update solo del dueño, sin delete

**Mapa:**
- `components/location-picker.tsx` — mapa Mapbox reutilizable (Fase 4 lo usará para avistamientos): polígono BJ como capa, pin validado con `isInBenitoJuarez()`, coordenada expuesta como inputs hidden

**Reportes:**
- `app/reportes/page.tsx` (lista con badges de estado) / `nuevo/page.tsx` / `[id]/page.tsx` (detalle + mini-mapa readOnly + resolver)
- `app/reportes/actions.ts` — `createReport` (zod + re-validación server-side del polígono) / `resolveReport`
- `components/report-form.tsx` (conversión datetime-local → ISO/UTC en cliente) / `report-status-badge.tsx` (rojo urgencia SOLO en "Perdido") / `resolve-report-button.tsx`

## 16. Archivos clave creados en Fase 4

**Migración (aplicada contra Supabase el 2026-08-12):**
- `supabase/migrations/0005_sightings_and_public_view.sql` — view `active_reports_public` (snap ~300 m), función `is_active_report` (security definer), RLS de `sightings` (insert solo sobre reportes activos; select para spotter y dueño del reporte), bucket `sighting-photos`

**Lado público:**
- `app/perdidos/page.tsx` — lista pública de reportes activos (mapa + cards, sin auth)
- `app/perdidos/[id]/page.tsx` — detalle público con pin aproximado y CTA "La vi" (con `?next=` si no hay sesión)
- `app/perdidos/[id]/avistamiento/page.tsx` + `components/sighting-form.tsx` — formulario del vecino (protegido)
- `app/perdidos/actions.ts` — `createSighting` (zod + invariante BJ + foto a `sighting-photos`)
- `components/reports-map.tsx` — mapa multi-marker con popups (solo display; nunca ve coordenadas exactas)

**Integraciones a lo existente:**
- `app/reportes/[id]/page.tsx` — sección "Avistamientos de vecinos" (lista + pins verdes vía prop `markers` de `LocationPicker`)
- `components/login-form.tsx` / `signup-form.tsx` — extraídos como client components; páginas de auth ahora son Server Components que leen `?next=`
- `lib/supabase/middleware.ts` — `/perdidos` público, `/perdidos/*/avistamiento` protegido, redirects con `next` validado
- `app/layout.tsx` (link público "Perdidos") y `app/page.tsx` (CTA a `/perdidos`)

## 17. Archivos clave creados en Fase 5

- `lib/notifications.ts` — `notifyNewReport` (broadcast, segmento Total Subscriptions) y `notifySightingToOwner` (por `external_id`); fire-and-forget vía REST de OneSignal
- `components/push-init.tsx` — init del SDK v16 (`react-onesignal`), SW en scope `/push/onesignal/`, Slidedown + `OneSignal.login(userId)`; montado en layout solo con sesión
- `components/logout-button.tsx` — logout client-side con `OneSignal.logout()` best-effort antes del POST a `/logout`
- `public/push/onesignal/OneSignalSDKWorker.js` — SW de OneSignal (importScripts del CDN), aislado del SW de Serwist
- `lib/env.ts` — `publicEnv.onesignalAppId` + `serverEnv.onesignalRestApiKey`
- Config manual hecha en OneSignal: plataforma Web (site `De Vuelta`, URL `de-vuelta.vercel.app`), API key "De Vuelta" (rotada 2026-08-16); Vercel: `NEXT_PUBLIC_ONESIGNAL_APP_ID` (no Sensitive) + `ONESIGNAL_REST_API_KEY` (Sensitive)

## 18. Archivos clave creados en Fase 6

**Migración (aplicada contra Supabase el 2026-08-19):**
- `supabase/migrations/0006_matches_rls.sql` — RLS de `matches`: select/update solo para el dueño del reporte; sin insert/delete (las filas las escribe el servidor)

**IA:**
- `lib/matching.ts` — `scorePetMatch()` con Claude vision (`claude-opus-5`), structured output tipado con zod (`{score, reasoning}`), imágenes pasadas por URL pública de Storage. Prompt sesgado a ser conservador. Nunca lanza: devuelve `null` si falla.

**Integración y UI:**
- `app/perdidos/actions.ts` — `createSighting` crea la fila de `matches` siempre y la puntúa cuando hay ambas fotos
- `app/reportes/actions.ts` — `confirmMatch` / `rejectMatch` (vía `reviewMatch`)
- `components/match-badge.tsx` — porcentaje con color por token; estados Confirmado / Descartado / Sin foto
- `components/match-review.tsx` — botones "Sí es mi mascota" / "No es"
- `app/reportes/[id]/page.tsx` — avistamientos ordenados por score descendente

**Verificado en producción (2026-08-19):** misma perra distinto encuadre → **0.97**; perro claramente distinto → **0.02**; sin foto → sin score con revisión manual disponible. Negativos RLS: el vecino no lee los matches (0 filas), no puede alterarlos (0 filas afectadas) ni insertarlos (403). Tras mover el post-procesamiento a `after()`, reverificado: respuesta al vecino en **4.7 s** (antes 27 s) y el score sigue llegando — un avistamiento con foto de otro perro quedó en 0.02 segundos después de que el vecino ya tenía su confirmación.

**Límite honesto de la verificación:** el caso positivo usó la misma foto original recortada, no dos fotografías genuinamente distintas del mismo animal. La precisión real con fotos de campo (otra luz, otro ángulo, el animal sucio o asustado) está sin medir y solo el piloto la va a decir.
