# Resumen de cierre — Fase 0: Fundamentos
**De Vuelta · 2026-04-28**

---

## Entregables completados ✅

| Entregable | Archivo | Notas |
|---|---|---|
| ✅ Polígono geográfico de Benito Juárez | `data/benito-juarez.geojson` | 464 puntos, CVEGEO 09014, fuente CONABIO 2023 vía PhantomInsights |
| ✅ Script de descarga reproducible | `scripts/filter-bj.mjs` | Descarga + filtra desde GitHub en un solo comando |
| ✅ Script de validación lat/lng | `scripts/validate-polygon.ts` | Usa @turf/turf, 3/3 pruebas pasan (Del Valle ✓, Narvarte ✓, Coyoacán ✗) |
| ✅ Documentación de fuente | `data/SOURCE.md` | Fuente, fecha, licencia, proceso de extracción |
| ✅ Guion de entrevistas | `docs/validation-plan.md` | 10 preguntas en 3 bloques, logística, señales de validación/invalidación |
| ✅ Mapeo de aliados | `docs/partners-prospects.md` | 5 veterinarias + 3 refugios con contacto verificado, template de aproximación |
| ✅ Identidad inicial | `docs/brand.md` | Nombre confirmado: "De Vuelta", paleta WCAG AA, tono híbrido, manifiesto |
| ✅ Checklist de cuentas | `docs/accounts-checklist.md` | 9 servicios con orden, datos sensibles y template de .env |

---

## Decisiones que requieren tu input

| Decisión | Contexto | Urgencia |
|---|---|---|
| **Disponibilidad de dominios** | `devuelta.mx`, `devuelta.app` — verificar en NIC.mx y Google Domains antes de comprometerte con el nombre públicamente | Alta — antes de cualquier comunicación externa |
| **¿Cuál cuenta crear primero?** | Supabase o Mapbox — ambas son bloqueantes para Fase 1; cualquiera puede ir primero | Alta — necesaria para iniciar Fase 1 |
| **Veterinaria para primer contacto** | Recomiendo PNA (Portales) por ser la única en BJ con vet + adopción. ¿Confirmas que sea el primer acercamiento? | Media — antes de Fase 7 |
| **¿Proceder con entrevistas antes de Fase 1?** | Se puede iniciar Fase 1 técnica en paralelo con las entrevistas. O esperar validación primero. Ambas rutas son válidas. | Media — decisión de proceso |

---

## Acciones manuales pendientes para ti

### Inmediatas (antes de Fase 1)

- [ ] Verificar disponibilidad de `devuelta.mx` y `devuelta.app` en:
  - https://www.nic.mx/buscar/?dominio=devuelta
  - https://domains.google.com/registrar/search?searchTerm=devuelta.app
- [ ] Crear cuenta en **Supabase** → guardar `SUPABASE_URL` y `ANON_KEY` en gestor de contraseñas
- [ ] Crear cuenta en **Vercel** → conectar repositorio `unicostudios-mx/vecino-peludo`
- [ ] Crear cuenta en **Mapbox** → guardar `MAPBOX_TOKEN`
- [ ] Crear archivo `.env.local` en la raíz con las variables vacías del template en `docs/accounts-checklist.md`

### Corto plazo (antes de Fase 3-4)

- [ ] Realizar 5-10 entrevistas siguiendo el guion de `docs/validation-plan.md`
  - Foco inicial: Parque Hundido, Parque de los Venados, grupos FB de Del Valle/Narvarte
  - Registrar resultados en un doc aparte (no en este repo — datos de personas)
- [ ] Contactar PNA (Portales) como primer aliado: `pnamexico.com`
- [ ] Crear cuenta en **OneSignal** (puede esperar a Fase 4)

### Más adelante

- [ ] MercadoPago sandbox (Fase 7-8) — tener RFC y CLABE listos
- [ ] Anthropic API con fondos iniciales ($20-30 USD, Fase 6)

---

## Bloqueos para iniciar Fase 1

| Bloqueo | Descripción | Cómo desbloquearlo |
|---|---|---|
| **Sin credenciales de Supabase** | No se puede crear el esquema de DB ni Auth sin el proyecto creado | Crear cuenta en supabase.com (~15 min) |
| **Sin token de Mapbox** | El mapa base no carga sin token válido | Crear cuenta en mapbox.com (~20 min) |
| **Sin `.env.local`** | El proyecto Next.js no arranca sin variables de entorno | Llenar el template de `docs/accounts-checklist.md` |

> **Nota:** La Fase 1 técnica puede iniciarse en paralelo con las entrevistas. No es necesario esperar los resultados de validación para arrancar la arquitectura — pero sí para tomar decisiones de flujo (Fase 3+).

---

## Estimación de tiempo para completar lo manual

| Tarea | Tiempo estimado |
|---|---|
| Verificar dominios | 10 min |
| Crear Supabase + Vercel + Mapbox | 45-60 min en total |
| Primera ronda de 5 entrevistas | 2-3 semanas (agendado + ejecutado) |
| Primer contacto con PNA | 1 semana (respuesta variable) |
| **Total para desbloquear Fase 1** | **~1 hora de setup técnico** |
| **Total para validación completa** | **2-4 semanas** |

---

## Estado de la fase

**Fase 0: 🔄 En progreso — documentos listos, pendiente acciones manuales**

El cierre definitivo de la fase (y el movimiento a "✅ Completa") ocurre cuando:
- [ ] Al menos 5 entrevistas realizadas con señales de validación confirmadas
- [ ] Las 3 cuentas bloqueantes creadas (Supabase, Vercel, Mapbox)
- [ ] Dominio reservado
