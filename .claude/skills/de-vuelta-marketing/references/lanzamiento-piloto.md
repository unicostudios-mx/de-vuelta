# Campaña de lanzamiento del piloto (Fase 9)

Fase 9 todavía está "Pendiente" en `CONTEXT.md` al momento de escribir esto
— antes de producir campaña real de lanzamiento, confirma que sigue siendo
la siguiente fase o si el plan cambió. Fase 7 (comunidad + adopción) va
antes.

## Métricas objetivo del piloto (de `CONTEXT.md` §9)

- 100 mascotas registradas en BJ
- Al menos 1 caso de mascota perdida resuelto vía la app
- Al menos 1 adopción facilitada
- Tiempo promedio de recuperación menor que el método actual (postes +
  Facebook)
- 2-3 veterinarias y 1-2 refugios activos como aliados

Cualquier pieza de campaña que hable de "éxito" del piloto debe apuntar a
una de estas métricas, no a vanity metrics genéricas (descargas, likes).

## Bloqueador a verificar antes de lanzar campaña real

`CLAUDE.md` marca el SMTP propio como bloqueador del piloto: con el SMTP
integrado de Supabase el registro está topado a **2 correos/hora**. Una
campaña de lanzamiento que meta tráfico real a `/signup` antes de resolver
esto satura el registro en minutos. Pregúntale al usuario si ese bloqueador
ya se resolvió antes de proponer fecha o volumen de campaña.

## Flyers físicos para postear en la colonia

El problema que resuelve la app (`CONTEXT.md` §2) es justo que hoy la
búsqueda vive en "WhatsApp, Facebook, postes con cinta" — el flyer físico
no compite con ese canal, lo complementa: sigue siendo el primer lugar
donde un vecino sin la app se entera. El flyer debe llevar a la app, no
reemplazar la información básica que ya funciona en un poste.

Estructura recomendada:
1. Foto grande de la mascota (o del logo/manifiesto si es un flyer de
   lanzamiento general, no de un caso específico).
2. Una sola frase de gancho — usar o adaptar el manifiesto de
   `docs/brand.md` §4.4, nunca el párrafo completo en un flyer.
3. QR + link corto a `de-vuelta.vercel.app` (o dominio propio si ya existe).
4. Mención explícita "Benito Juárez" — refuerza que es hiperlocal, no una
   app genérica más.

Usa el MCP de Canva disponible en este entorno para generar el diseño real
con la paleta de marca (`#0F766E` primario, `#DC2626` solo si el flyer es
de un caso "Perdido" activo, nunca decorativo).

## Mensajes para grupos vecinales de lanzamiento

Diferente de un post de caso individual (eso va en
`references/redes-y-contenido.md`) — este es el mensaje que presenta la app
por primera vez a un grupo que no la conoce. Debe:
- Explicar el problema en una línea (fragmentación de la búsqueda hoy).
- Dejar claro que es gratis y hecho para BJ específicamente, no una app
  genérica de mascotas.
- Pedir una acción concreta y barata: "actívala antes de que la necesites"
  — el valor de la app depende de tener vecinos ya suscritos *antes* de que
  ocurra una pérdida (el push geográfico de Fase 5 solo sirve si ya hay
  gente suscrita en la zona).

## Secuencia de lanzamiento sugerida

Sigue el mismo orden de oleadas de aliados ya definido en
`docs/partners-prospects.md` §"Orden de aproximación recomendado" — el
lanzamiento de usuarios debe ir después de tener al menos un aliado activo
(PNA, Portales) para que el directorio y la vitrina de adopción no se vean
vacíos el día uno.

1. Aliados de la primera oleada confirmados y activos en la app.
2. Soft launch en 1-2 colonias ancla (Del Valle, Portales) vía grupos
   vecinales + flyers — no las 7 colonias de golpe.
3. Push a redes propias y prensa local solo después de tener el primer
   caso resuelto real que contar (más creíble que "acabamos de lanzar").
