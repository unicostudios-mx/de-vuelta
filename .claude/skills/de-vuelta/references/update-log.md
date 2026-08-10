# Update log

Registro cronológico del estado del proyecto entre sesiones. Agrega una
entrada nueva (con fecha) cuando cierres algo importante o dejes algo a
medias — no reescribas entradas viejas, solo agrega. Si una fase completa
se cierra, refleja eso también en `CONTEXT.md` (fuente de verdad oficial).

## 2026-07-29

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
  - **Pendiente al cierre de esta sesión**: terminar de probar el flujo
    end-to-end en el navegador (login → crear mascota con foto → editar →
    borrar) y verificar aislamiento de RLS entre dos cuentas distintas
    (crear una segunda cuenta de prueba y confirmar que no ve las mascotas
    de la primera). Ver `troubleshooting.md` por los dos bloqueos de
    Supabase que se resolvieron en el camino (llaves legacy deshabilitadas,
    ubicación real del toggle "Confirm email" — se desactivó para
    simplificar las pruebas locales, decidir si se reactiva antes de
    lanzar el piloto).
