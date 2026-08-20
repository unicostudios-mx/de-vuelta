# Update log

Registro cronológico del estado del proyecto entre sesiones. Agrega una
entrada nueva (con fecha) cuando cierres algo importante o dejes algo a
medias — no reescribas entradas viejas, solo agrega. Si una fase completa
se cierra, refleja eso también en `CONTEXT.md` (fuente de verdad oficial).

## 2026-07-26 → 2026-08-09 (sesión larga: deploy + Fase 2)

- **Fase 1 cerrada y desplegada.** Proyecto conectado a Vercel
  (`unicostudios-mxs-projects/de-vuelta`), producción sirviendo en
  `de-vuelta.vercel.app`. `/manifest.json` y `/sw.js` verificados en
  producción, sin errores en logs de runtime.
- **Nota de repo**: el repo de GitHub fue renombrado de
  `unicostudios-mx/vecino-peludo` a `unicostudios-mx/de-vuelta` (mismo
  repo). `CLAUDE.md` todavía menciona el nombre viejo — el remote local
  puede seguir apuntando a `vecino-peludo` por ahora (GitHub redirige).
- **Fase 2 en progreso** (perfil de mascota: auth + CRUD + RLS real):
  - Migración `0003_pet_profile_rls.sql` aplicada: trigger
    `handle_new_user` (crea fila en `public.users` al hacer signup),
    políticas RLS reales en `users`/`pets` (cada quien ve/edita solo lo
    suyo), bucket de Storage `pet-photos` (lectura pública, escritura solo
    del dueño en su carpeta).
  - Auth por email + contraseña (decisión: no magic link, para no depender
    de latencia de correo en el flujo de emergencia). Páginas
    `login`/`signup`, ruta `auth/confirm` para el link de confirmación,
    `logout` como route handler. Middleware protege `/mascotas` y redirige
    sesiones ya autenticadas fuera de `login`/`signup`.
  - CRUD de mascotas completo con subida real de fotos a Storage
    (`app/mascotas/`), usando shadcn/ui (`button input label textarea
    select card avatar` — sin el componente `form`, ver troubleshooting.md).
  - `npm run build` y `npm run lint` pasan limpio.
  - Flujo end-to-end verificado contra el proyecto real de Supabase:
    signup → auto-login → crear/editar/borrar mascota → foto sube a Storage
    y se sirve pública → aislamiento de RLS confirmado entre dos cuentas
    distintas. Commiteado y pusheado a `main` (`49bed38`).

### ⚠️ Pendiente crítico antes de invitar usuarios reales (Fase 9)
- **"Confirm email" está APAGADO** en Supabase (Authentication → Sign
  In/Providers → sección "User Signups"). Se desactivó a propósito para
  poder probar el flujo de signup sin depender de un inbox real mientras
  seguimos construyendo. Mientras esté apagado, cualquiera puede
  registrarse con un correo inventado sin verificarlo — aceptable en
  desarrollo, **no aceptable para el piloto real**. Reactivarlo es un
  toggle de un click (ver troubleshooting.md por dónde vive) — hacerlo como
  parte del checklist de lanzamiento de Fase 9, no antes, porque mientras
  seguimos desarrollando features conviene poder crear cuentas de prueba
  sin fricción.
- ~~**Cuentas y mascotas de prueba**~~ — RESUELTO 2026-08-09: las 3 cuentas
  de prueba se borraron desde el dashboard (cascade limpió `users`/`pets`);
  tabla `pets` verificada en 0 registros.
- **Fase 2 cerrada formalmente el 2026-08-09**: CONTEXT.md y CLAUDE.md
  actualizados (fases, decisiones, archivos clave, repo renombrado).
  Siguiente: Fase 3 (reportar pérdida).

## 2026-08-09 (continuación: Fase 3 completa)

- **Fase 3 construida y verificada end-to-end** en la misma sesión:
  migración 0004 (RLS de `lost_reports`), `LocationPicker` con Mapbox +
  polígono BJ, rutas `/reportes` (lista/nuevo/detalle/resolver), CTA
  "Reportar pérdida" en cards de mascotas, `/reportes` protegido en
  middleware.
- **Verificaciones que pasaron**: crear reporte (Del Valle) → badge
  Perdido; bypass del cliente con coordenadas de Coyoacán → rechazado
  server-side por `isInBenitoJuarez()`; detalle + resolver → badge
  Resuelto; cuenta B no ve reportes de A (lista vacía + 404 por URL
  directa); insert con `pet_id` ajeno (inyectando option en el select de
  Radix) → rechazado por la policy de propiedad; `validate-polygon`,
  build y lint limpios. Datos de prueba (f3a/f3b) borrados al final.
- **Bug encontrado y corregido durante las pruebas**: el schema zod usaba
  `.max(new Date())` a nivel de módulo — el `new Date()` se congela cuando
  el server carga el módulo y todo envío posterior parecía "fecha futura".
  Fix: `.refine((d) => d.getTime() <= Date.now() + 60_000)`. Documentado
  en CONTEXT.md como decisión/gotcha.
- **Limitación del entorno**: el panel de navegador de esta sesión no
  compone el canvas de Mapbox (viewport 0x0), así que el mapa se verificó
  por evidencia indirecta: canvas inicializado, token válido contra la
  styles API (200), cero errores de consola, y el flujo completo vía
  inputs. **Pendiente al retomar: un vistazo visual humano al mapa** (que
  el polígono y el pin se vean bien) — 2 minutos en `npm run dev`.
- **Deuda menor anotada**: rutas con mapa ~620-650 kB First Load por
  `mapbox-gl`; candidato a `next/dynamic` si duele. Estado `expired` de
  reportes sin implementar (requiere job programado, fase futura).
- Siguiente: Fase 4 (avistamientos + lado público con ubicación
  aproximada — el diseño de privacidad de coordenadas se hace ahí).

## 2026-08-12 — Fase 4 completa

- **Construido**: migración 0005 (view pública `active_reports_public`
  con snap a ~300 m, función `is_active_report` security definer, RLS de
  `sightings`, bucket `sighting-photos`), rutas públicas `/perdidos` +
  detalle + formulario de avistamiento (protegido), sección
  "Avistamientos de vecinos" en el detalle del dueño, flujo `?next=` en
  auth (login/signup como Server Components + client forms), link
  "Perdidos" en header y CTA en home.
- **Verificado end-to-end contra Supabase real**: reporte de A visible
  públicamente sin sesión con coordenada anclada a cuadrícula (19.3899 →
  19.389; -99.1707 → -99.171); view expone SOLO columnas seguras;
  `lost_reports` directo con anon = 0 filas; insert anónimo de sighting
  = 401; vecino nuevo B: "La vi" → signup con next → aterriza en el form
  → avistamiento con foto OK; dueño A ve el avistamiento (lista + pin);
  reporte resuelto desaparece de /perdidos al instante (404) y un insert
  autenticado vía REST sobre él da 403 (RLS/is_active_report).
- **Patrón clave aprendido**: subqueries dentro de policies corren con el
  RLS del usuario consultante — para validar contra tablas que el usuario
  no puede leer, usar función `security definer` (documentado en
  CONTEXT.md).
- **Pendiente visual humano** (igual que Fase 3): el panel de navegador
  de la sesión no compone el canvas de Mapbox — dar un vistazo a
  `/perdidos` (mapa multi-pin con popups) y al detalle del dueño (pin
  rojo + pins verdes) en `npm run dev`.
- Siguiente: **Fase 5 (notificaciones geográficas)** — necesita cuenta
  OneSignal y sus env vars (`NEXT_PUBLIC_ONESIGNAL_APP_ID`,
  `ONESIGNAL_REST_API_KEY`); acción manual de Nicolás antes de arrancar.

## 2026-08-16 — Fase 5 completa (push OneSignal)

- **Credenciales**: Nicolás pegó al inicio el "Key ID" de OneSignal
  creyendo que era la API key (ver troubleshooting.md); se resolvió
  rotando la llave "De Vuelta" desde su Chrome y pegándola directo a
  Vercel vía portapapeles. Validada con 200 contra `POST /notifications`.
  También se configuró la plataforma **Web** en el dashboard de OneSignal
  (venía sin configurar → error "App not configured for web push"): site
  De Vuelta / `https://de-vuelta.vercel.app`.
- **Construido**: `lib/notifications.ts` (broadcast + dirigido),
  `push-init.tsx` (SDK solo con sesión, SW en scope `/push/onesignal/`,
  `login(userId)` para external_id), `logout-button.tsx`
  (`OneSignal.logout()` best-effort), integración en `createReport` y
  `createSighting` (este último con `createAdminClient` para leer
  `reporter_id` — primera vez que se usa el admin client).
- **Bug encontrado en pruebas**: el doble-mount de React en dev hacía
  correr `OneSignal.login()` antes de que terminara el `init` → se guarda
  la promesa del init en un global y se espera.
- **Verificado**: broadcast dispara con 200 desde `createReport` (cero
  suscriptores aún, esperado). El dirigido al dueño no es verificable en
  local (SUPABASE_SERVICE_ROLE_KEY vacía en `.env.local` — gotcha de
  Sensitive vars, documentado); se verifica en producción.
- **Prueba humana pendiente (Nicolás, ~3 min)**: en su Chrome, entrar a
  producción con una cuenta, aceptar el prompt de notificaciones, crear
  un reporte desde otra cuenta y confirmar que llega el push con
  deep-link. Ídem avistamiento → push al dueño.
- Siguiente: **Fase 6 (matching manual + IA)** — necesita
  `ANTHROPIC_API_KEY`.

## 2026-08-18 — Fase 5 queda ABIERTA (push no llega a nadie)

Se intentó cerrar la prueba real de punta a punta en el Chrome de
Nicolás. Se avanzó bastante pero **quedó sin resolver**: ningún navegador
logra suscribirse, así que las notificaciones no se entregan.

- **Bug real encontrado y corregido en el camino**: el SDK ignora
  `serviceWorkerPath`/`serviceWorkerParam` del `init` y siempre sigue la
  config del dashboard (`customizationEnabled:false`,
  `/OneSignalSDKWorker.js`, scope `/`) — verificable en
  `https://api.onesignal.com/sync/{appId}/web`. Por eso el worker daba
  404 y nunca hubo token. Se agregó `public/OneSignalSDKWorker.js` y se
  desactivó el auto-registro de Serwist (`register:false` +
  `components/sw-register.tsx`).
- **Config manual hecha en OneSignal**: plataforma Web configurada (site
  De Vuelta, `https://de-vuelta.vercel.app`). OJO: el toggle "Customize
  service worker paths" NO persiste al guardar — se revierte solo.
- **Lo que sigue roto**: `PushSubscription.token` siempre null;
  `optIn()`/`requestPermission()` devuelven promesas que nunca resuelven.
  Ver troubleshooting.md → sección "ABIERTO" para todo lo ya descartado
  (API key, envíos, permiso, worker activo, subscribe manual funcionando)
  y las dos salidas posibles.
- **Decisión pendiente de Nicolás**: sacrificar el offline de la PWA para
  que OneSignal registre su worker solo, o seguir investigando el
  conflicto con Serwist.

### CORRECCIÓN al cierre — la configuración sí funcionaba

Revisando **Audience → Subscriptions** en el dashboard apareció un registro
`Subscribed` con token real a las 19:00 del 2026-08-18 (todos los demás
dicen `No Push Token`). O sea: el push **sí quedó funcionando** con la
configuración del worker combinado. Lo que lo rompió después fueron las
"limpiezas" de depuración (`optOut`, `unsubscribe`, borrar IndexedDB), que
dejaron el dispositivo como `Subscriber Opted Out` — y todo lo medido
después reflejaba ese daño autoinfligido, no el bug.

Se restauró esa configuración (commit `cc49559`): worker único
`OneSignalSDKWorker.js` (CDN de OneSignal + `/sw.js`), Serwist con
`register:false`. **Conserva push Y offline** — no hacía falta sacrificar
ninguno de los dos, así que la disyuntiva que se le planteó a Nicolás
estaba mal fundada.

**Fase 5 CERRADA y verificada** (mismo día, tras conceder el permiso):
- `PushSubscription.token = SI`, `optedIn = true`.
- Envío directo a la suscripción: entregado (`successful: 1, failed: 0`).
- **Flujo real**: crear un reporte desde otra cuenta disparó el broadcast
  (`[push] enviado f86be648…` en logs de producción) y se entregó con el
  copy correcto y deep-link al reporte público.
- Bug de copy encontrado en esa prueba y corregido: la especie salía en
  crudo de la DB ("dog" en vez de "perro") — `lib/notifications.ts` ahora
  la traduce, igual que el resto de la app.
- Cuentas de prueba borradas; `/perdidos` limpio.

Detalle de la configuración en troubleshooting.md → "Push: la
configuración correcta (y cómo NO romperla)".

### Historial de la depuración (contexto, ya superado)

- Nicolás eligió sacrificar el offline. **Se ejecutó y NO funcionó**: con
  Serwist desactivado y OneSignal como único worker, la suscripción siguió
  sin crearse. Queda descartado que Serwist fuera la causa. **Se revirtió**
  para no perder el offline a cambio de nada (commit `d006a8a`).
- Nueva hipótesis y escenario ya preparado: el permiso se había concedido
  mientras el worker daba 404. Nicolás reseteó el permiso del sitio; se
  limpió el estado del SDK y se volvió a iniciar sesión. **Faltó solo
  aceptar el prompt nativo de Chrome** — no es automatizable. Ver
  troubleshooting.md → "Cómo retomar".
- Estado del código: todo commiteado y en producción. El envío funciona;
  falta que un navegador quede suscrito.

## 2026-08-19 — Fase 6 completa (matching con IA)

Trabajo hecho de forma autónoma mientras Nicolás dormía, con permisos
elevados y la migración 0006 ya mostrada y autorizada ("ok, continua").

- **Construido**: migración 0006 (RLS de `matches`), `lib/matching.ts`
  (Claude vision con structured output de zod), disparo automático en
  `createSighting`, `confirmMatch`/`rejectMatch`, badges y botones de
  revisión, orden de avistamientos por score.
- **Verificado en producción con fotos reales** (fixtures de placedog.net
  subidas a Storage; el navegador las descarga por fetch, así que los bytes
  nunca pasaron por el chat):
  - misma perra, distinto encuadre → **0.97** ("parece la misma foto con
    distinto encuadre" — el razonamiento fue correcto, no solo el número)
  - perro claramente distinto → **0.02** (identificó edad, tamaño y color
    como discrepancias)
  - sin foto → sin score, con revisión manual disponible
  - confirmar / descartar persisten y **el reporte sigue activo**
  - negativos RLS: el vecino no lee (0 filas), no altera (0 filas
    afectadas) ni inserta (403)
- **Costo real medido**: 2 análisis = 2,827 tokens in / 204 out; crédito
  bajó de $13.05 a $13.03 → **~$0.01 por avistamiento con foto**, la mitad
  de lo estimado. Con el crédito actual alcanzan ~1,300 análisis.
- **Limitación honesta de la prueba**: el caso positivo usó la misma foto
  reencuadrada, no dos fotografías distintas del mismo animal. Es un test
  más fácil que la realidad — la precisión con fotos genuinamente
  diferentes (otra luz, otro ángulo, animal en movimiento) solo se sabrá
  en campo durante el piloto.
- Datos de prueba eliminados, incluidos los objetos de Storage.
- De paso: `CONTEXT.md` todavía decía "Vecino Peludo" y el repo viejo en el
  encabezado; corregido.

### Revisión propia y endurecimiento de la Fase 6

Corrí `/code-review high` contra mi propio trabajo antes de darlo por
cerrado. Encontró cinco defectos reales, todos corregidos y redesplegados:

1. La llamada de visión corría dentro de la Server Action del vecino, con
   los defaults del SDK (10 min de timeout, 2 reintentos).
2. El badge decía "No se pudo comparar" tanto cuando la IA fallaba como
   cuando el vecino no había subido foto — dos situaciones distintas para
   el dueño.
3. Revisar un avistamiento era irreversible: un dueño angustiado que le
   atina al botón equivocado se quedaba sin salida.
4. El `update()` de la revisión no pedía `.select()`, así que un update
   bloqueado por RLS respondía "ok" con cero filas y el dueño creía que se
   había guardado.
5. `new Anthropic()` leía `process.env` directo, saltándose `lib/env.ts`.

**Latencia — medida, no estimada.** Con las correcciones puestas, cronometré
el flujo real en producción: **27 segundos** entre que el vecino da enviar y
ve la confirmación. En una urgencia eso se lee como "falló", y la reacción
natural es reenviar — avistamiento duplicado y segundo push al dueño. El
avistamiento ya está guardado antes de todo eso, así que nada de eso
necesita bloquear la respuesta: el push, la fila de match y el análisis se
movieron a `after()` de `next/server`.

**Reverificado en producción**: respuesta al vecino en **4.7 s** (lo que
queda es la subida de la foto, que sí tiene que ser síncrona porque la fila
del avistamiento necesita la URL). El score siguió llegando después — un
avistamiento con foto de otro perro quedó en 0.02 cuando el vecino ya tenía
su confirmación en pantalla.

Datos de prueba de esta segunda ronda eliminados también (cuentas, filas y
objetos de Storage; producción quedó en 0 en las 5 tablas).

### Riesgo abierto que vale la pena nombrar

No hay rate limiting sobre las llamadas a la API de Anthropic. Hoy cada
avistamiento con foto dispara un análisis (~$0.01) y cualquiera con cuenta
puede mandar avistamientos. A escala de piloto no es un problema, pero
antes de abrir al público conviene un límite por usuario o por reporte —
si no, un usuario malicioso puede drenar el crédito subiendo fotos en
serie. Lo dejo señalado, no resuelto: es una decisión de producto (¿cuántos
avistamientos por hora son legítimos?) más que técnica.
