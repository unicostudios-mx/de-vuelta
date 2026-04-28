# Vecino Peludo — Contexto del Proyecto

> Este documento es la fuente de verdad del proyecto. Se actualiza al final de cada fase.
> Todo prompt a Claude Code debe empezar con: "Lee CONTEXT.md antes de proceder."

---

## 1. Qué es

App hiperlocal para reunir mascotas perdidas con sus dueños y coordinar rescate de animales callejeros, combinando IA de reconocimiento de fotos, mapa en tiempo real, comunidad por colonia y red de veterinarias y refugios aliados.

**Nombre de la app:** De Vuelta
**Pitch en una frase:** Convierte tu colonia en una red de búsqueda activa cuando una mascota se pierde.

**Repositorio:** `unicostudios-mx/vecino-peludo`
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
- GitHub (versión, repositorio en `unicostudios-mx/vecino-peludo`)

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
| 1 | Arquitectura y esqueleto | Pendiente |
| 2 | Perfil de mascota | Pendiente |
| 3 | Reportar pérdida | Pendiente |
| 4 | Reportar avistamiento | Pendiente |
| 5 | Notificaciones geográficas | Pendiente |
| 6 | Matching (manual + IA) | Pendiente |
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

## 8. Esquema de datos (preliminar — se refina en Fase 1)

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
