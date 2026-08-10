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
