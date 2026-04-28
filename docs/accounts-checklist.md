# Checklist de cuentas a crear — De Vuelta
**Fase 0 · Pendiente de acción manual por Nicolás**

> Crear en el orden indicado. Los servicios bloqueantes para Fase 1 van primero.
> No compartir credenciales en el repo — usar un gestor de contraseñas (1Password, Bitwarden).

---

## Tabla de servicios

| Servicio | URL de registro | Plan MVP | Por qué | Bloqueante para fase | Requiere tarjeta | Tiempo estimado de setup |
|---|---|---|---|---|---|---|
| **GitHub** | github.com/unicostudios-mx | Organización ya creada ✅ | Control de versiones, CI/CD | — | No | ✅ Listo |
| **Supabase** | supabase.com | Free (500 MB DB, 1 GB storage, 50k MAU) | Auth + PostgreSQL + PostGIS + Realtime + Storage todo en uno | **Fase 1** | No (free) | 15 min |
| **Vercel** | vercel.com | Hobby (gratis) | Deploy automático desde GitHub, preview por PR, dominio `.vercel.app` incluido | **Fase 1** | No (hobby) | 10 min |
| **Mapbox** | mapbox.com | Free (50k loads/mes) | Mapas interactivos, geocodificación, estilos personalizados | **Fase 1** | No (free tier) | 20 min |
| **Anthropic API** | console.anthropic.com | Pay-as-you-go (sin plan mensual fijo) | IA de visión para matching de fotos — Claude API | **Fase 6** | Sí — tarjeta de crédito | 10 min + agregar fondos |
| **OneSignal** | onesignal.com | Free (hasta 10k suscriptores push) | Notificaciones push web/PWA por geolocalización sin backend propio | **Fase 5** | No (free) | 30 min |
| **MercadoPago** | mercadopago.com.mx | Sandbox primero → producción en Fase 8 | Pasarela de pagos MX (donaciones + patrocinios) | **Fase 8** | No para sandbox; sí para producción | 1-3 días hábiles |
| **Apple Developer** | developer.apple.com | $99 USD/año | App Store (post-piloto, si se migra a React Native) | Post-piloto | Sí | 1-2 días (verificación Apple) |
| **Google Play Console** | play.google.com/console | $25 USD pago único | Play Store (post-piloto, si se migra a React Native) | Post-piloto | Sí | 1 día |

---

## Orden de creación recomendado

```
Ahora (Fase 0):
  1. Supabase    ← necesitas el project URL y anon key para Fase 1
  2. Vercel      ← conectar al repo de GitHub desde el inicio
  3. Mapbox      ← necesitas el access token para el mapa base

Antes de Fase 5:
  4. OneSignal   ← configurar Web Push antes de implementar notificaciones

Antes de Fase 6:
  5. Anthropic API ← agregar fondos iniciales (~$20 USD para pruebas)

Antes de Fase 8:
  6. MercadoPago sandbox → luego producción

Post-piloto (evaluar tracción primero):
  7. Apple Developer
  8. Google Play Console
```

---

## Datos sensibles a tener a la mano

| Servicio | Datos que necesitarás |
|---|---|
| **Supabase** | Email del proyecto, contraseña segura, nombre de la organización |
| **Mapbox** | Nombre de cuenta, email |
| **OneSignal** | Email, nombre de la app, URL del sitio en producción |
| **Anthropic API** | Tarjeta de crédito internacional, límite mensual sugerido: **$30 USD** para pruebas de Fase 6 |
| **MercadoPago (sandbox)** | Email de MercadoPago existente o nuevo, RFC de la persona física/moral que recibirá pagos reales en producción |
| **MercadoPago (producción)** | RFC, CLABE interbancaria, identificación oficial, comprobante de domicilio fiscal |
| **Apple Developer** | Apple ID, tarjeta de crédito, DUNS Number si se registra como empresa (gratis, tramitar con DUNS Request Service) |
| **Vercel** | Conectar con GitHub — requiere permisos de la organización `unicostudios-mx` |

---

## Variables de entorno que generarán estas cuentas

Todas irán en `.env.local` (ignorado por `.gitignore`) y en Vercel Dashboard → Settings → Environment Variables.

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # Solo en servidor, nunca exponer al cliente

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=

# OneSignal
NEXT_PUBLIC_ONESIGNAL_APP_ID=
ONESIGNAL_REST_API_KEY=           # Solo en servidor

# Anthropic
ANTHROPIC_API_KEY=                # Solo en servidor

# MercadoPago
MP_ACCESS_TOKEN=                  # Sandbox primero
MP_PUBLIC_KEY=
```

> Crear un archivo `.env.example` con estas variables vacías y commitearlo al repo como referencia para el equipo.

---

## Checklist de progreso

- [ ] Supabase — cuenta y proyecto creado
- [ ] Vercel — cuenta creada y repo conectado
- [ ] Mapbox — cuenta creada y token generado
- [ ] OneSignal — cuenta creada (puede esperar hasta Fase 4-5)
- [ ] Anthropic API — cuenta creada con fondos iniciales (puede esperar hasta Fase 6)
- [ ] MercadoPago — cuenta sandbox activa (puede esperar hasta Fase 7-8)
- [ ] `.env.example` commiteado al repo con variables vacías
