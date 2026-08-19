# Troubleshooting — lecciones aprendidas en este proyecto

Fricciones reales que ya nos costaron tiempo diagnosticar en "De Vuelta".
Revisa esto antes de perder tiempo redescubriéndolo.

## Supabase

### "Legacy API keys are disabled" (401) al hacer signUp/signIn

Aunque el dashboard (Settings → API Keys → pestaña "Legacy anon,
service_role API keys") muestre los valores del `anon` y `service_role`,
el proyecto puede tener esas llaves **deshabilitadas a nivel de proyecto**
por default — Supabase empuja hacia el sistema nuevo de Publishable/Secret
keys y los proyectos nuevos arrancan así. El código de este proyecto está
armado alrededor de las llaves legacy (son los nombres que espera
`lib/env.ts`), así que si `signInWithPassword` / `signUp` truena con 401
"Legacy API keys are disabled":

Ve a esa misma página → botón **"Re-enable JWT-based API keys"** → escribe
`re-enable` para confirmar. No rota ni invalida ningún valor existente, solo
vuelve a permitir su uso.

### El toggle "Confirm email" no vive donde parece

No está dentro del modal de configuración del provider "Email"
(Authentication → Sign In/Providers → click en la fila "Email" → ahí solo
hay opciones de contraseña/OTP). Vive un nivel arriba, en la sección
**"User Signups"** de la misma página `auth/providers` (scroll hacia abajo,
antes de la lista de "Auth Providers"). Recuerda darle "Save changes"
después de tocar el toggle.

### `supabase gen types typescript --linked > archivo.ts` ensucia el archivo

El CLI manda mensajes informativos ("Initialising login role...", "A new
version of Supabase CLI is available...") a stdout, no a stderr, y con `>`
se cuelan al inicio y/o final del archivo generado — rompen la sintaxis TS
en la primera línea. Después de regenerar tipos, revisa (y borra si hace
falta) la primera y última línea del archivo antes de asumir que compiló.

## Dependencias

### `@supabase/ssr` viejo + `@supabase/supabase-js` nuevo = todo tipa como `never`

Si `supabase.from("tabla").select()...` empieza a tipar como `never` en vez
del `Row` real de `types/database.ts` (los typechecks fallan en cascada por
todo el código que toca la base de datos), es un desfase entre las
versiones de `@supabase/ssr` y `@supabase/supabase-js` — sus genéricos de
`SupabaseClient` dejaron de coincidir entre versiones. Pasó con
`@supabase/ssr@0.5.x` + `@supabase/supabase-js@2.110.x`.

Fix: `npm install @supabase/ssr@latest`. Mantenerlo al día junto con
`@supabase/supabase-js`; no fijar `@supabase/ssr` a una versión vieja en
`package.json`.

### El componente `form` de shadcn/ui rompe el install

`npx shadcn add form` trae `react-hook-form` + `@hookform/resolvers`, que
exige `zod@^3` vía `@typeschema/zod` — choca con `zod@4`, que ya usa
`@serwist/build` de forma transitiva (Serwist es dependencia de Fase 1, no
se puede quitar). El patrón de este proyecto para formularios es Server
Actions nativas + `useActionState` de React 19, no react-hook-form, así que
la solución es simple: no instalar el componente `form` de shadcn. Usar
`<form action={miServerAction}>` con los componentes sueltos (`input`,
`label`, `select`, `textarea`, etc.) — ver `components/pet-form.tsx` como
ejemplo del patrón ya usado.

## Vercel

### Variables `NEXT_PUBLIC_*` marcadas "Sensitive" rompen el build en producción

Las env vars marcadas "Sensitive" en Vercel solo se descifran en runtime —
**no están disponibles durante el paso de build**. Next.js necesita inyectar
las `NEXT_PUBLIC_*` en build time para que lleguen al bundle del cliente y
del Edge Middleware; si están marcadas Sensitive se compilan como
`undefined`, y en producción el middleware truena con "Missing environment
variable" aunque la variable exista y tenga el valor correcto.

Además, una vez marcada Sensitive **no se puede des-marcar editando la
variable** (el toggle se ve como que cambió, pero el guardado lo ignora) —
hay que borrarla y volver a crearla con el toggle apagado desde el
principio.

Dejar `SUPABASE_SERVICE_ROLE_KEY` como Sensitive sí es correcto y seguro:
solo se lee en runtime del lado servidor (`serverEnv.supabaseServiceRoleKey`
en `lib/env.ts`), nunca se inyecta en un bundle que llega al navegador.

### El nombre de proyecto de Vercel debe ser kebab-case

Si la carpeta local tiene espacios/mayúsculas (ej. "De Vuelta"),
`vercel link` truena con un error de nombre inválido. Pasar
`--project de-vuelta` explícito (el nombre del `package.json`).

### Traer env vars a local sin exponer secretos en la conversación

`vercel env pull .env.local --environment=production --yes` — es el flujo
estándar para desarrollo local. No hace falta pedirle al usuario que
copie/pegue llaves a mano, ni leer tú mismo el contenido del archivo
resultante (evita `cat .env.local` o similar; si necesitas confirmar que
algo se cargó bien, verifica indirectamente — p. ej. corriendo la app y
viendo si el error de "falta la variable" desaparece — en vez de imprimir
el archivo).

### Las variables "Sensitive" NO bajan con `vercel env pull`

Por diseño, Vercel no permite volver a leer una variable Sensitive: `vercel
env pull` la escribe **vacía** en `.env.local`. Afecta a
`SUPABASE_SERVICE_ROLE_KEY` y `ONESIGNAL_REST_API_KEY`. Consecuencias:
- Si algo local truena con "supabaseKey is required" o un 401 de OneSignal
  y las variables "existen" en `.env.local`, revisa si están vacías
  (`grep '^VAR=' .env.local | cut -d= -f2- | wc -c`) antes de sospechar de
  la llave en sí.
- Después de cada `vercel env pull`, hay que re-poner a mano los valores
  Sensitive en `.env.local` (pedirlos al usuario o recuperarlos de su
  fuente original). Los no-Sensitive sí bajan bien.

## OneSignal

### El "Key ID" de la tabla NO es la API key

En Keys & IDs, la tabla de API Keys muestra un **Key ID** (identificador
público corto, ej. 25 chars). La llave real (`os_v2_app_...`, ~113 chars)
solo se muestra UNA vez al crearla o rotarla. Si solo tienes el Key ID:
menú ⋮ de la fila → **Rotate** → copiar el token nuevo en ese momento
(invalida el anterior).

### Push: la configuración correcta (y cómo NO romperla)

Estado al 2026-08-18. La configuración actual **sí logró suscribir** un
dispositivo con token real (registro `Subscribed` en el dashboard, 19:00 h).
Lo que quedó pendiente es solo re-conceder el permiso en el Chrome de
Nicolás y ver llegar una notificación.

**La configuración que funciona** (no cambiarla a ciegas):
- `public/OneSignalSDKWorker.js` — en la raíz, con el nombre exacto que
  OneSignal exige. Carga **primero** el bundle del CDN de OneSignal y
  **después** `/sw.js` (Serwist). Un solo worker en scope `/` hace push y
  offline.
- `next.config.ts` — Serwist con `register: false`; quien registra el
  worker es `components/sw-register.tsx`.
- `components/push-init.tsx` — el `init` NO pasa `serviceWorkerPath` ni
  `serviceWorkerParam`: el SDK los ignora y sigue siempre la config del
  dashboard (verificable en `https://api.onesignal.com/sync/{appId}/web`,
  que reporta `customizationEnabled:false` y `OneSignalSDKWorker.js`).

**El error que costó horas — no repetirlo**: al depurar, se llamó
`optOut()` / `pushManager.unsubscribe()` / borrado de IndexedDB para
"empezar de cero". Eso **destruye la suscripción buena** y deja el
dispositivo como `Subscriber Opted Out`; todas las mediciones posteriores
reflejan ese daño, no el problema original. Antes de concluir que algo
falla, mirar **Audience → Subscriptions** en el dashboard: distingue
`Subscribed` de `No Push Token` y de `Subscriber Opted Out`, y trae la
hora exacta de cada cambio.

**Límite conocido**: el prompt nativo de permisos de Chrome no se puede
clickear por automatización (vive fuera del DOM). Si el permiso quedó en
`default`, alguien tiene que aceptarlo a mano — ojo con el ícono de
campana 🔕 que Chrome usa para silenciarlo.

Ya verificado y sin necesidad de re-investigar: API key y App ID válidos,
los envíos salen con 200 desde producción al crear reporte y avistamiento,
el worker queda `activated`, y `external_id` se liga bien al uuid de
Supabase.



### Validar la REST API key: usa el endpoint correcto

`GET /apps/{id}` devuelve 401 aunque la llave del app sea válida — ese
endpoint pide la llave de ORGANIZACIÓN. Para validar la del app usa el
endpoint de envío: `POST https://api.onesignal.com/notifications` con
header `Authorization: Key <os_v2_...>`; un 200 con "All included players
are not subscribed" significa que la llave funciona (solo no hay
suscriptores todavía).
