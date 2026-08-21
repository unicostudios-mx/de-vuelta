---
name: de-vuelta-marketing
description: >
  Contenido y estrategia de mercadotecnia del proyecto "De Vuelta" (PWA
  hiperlocal para reunir mascotas perdidas con sus dueños en la Alcaldía
  Benito Juárez, CDMX). Úsalo SIEMPRE que la tarea sea escribir o planear
  algo de cara al público o a aliados externos: posts para
  Instagram/Facebook/grupos de WhatsApp del feed comunitario, copy para la
  app o el manifiesto, flyers para postear en la colonia, la campaña de
  lanzamiento del piloto (Fase 9), mensajes de outreach a veterinarias y
  refugios, o contenido de la vitrina de adopción curada (Fase 7b) como
  tarjetas de animales e historias. Consúltalo también si el usuario
  menciona "mercadotecnia", "marketing", "redes sociales", "campaña",
  "lanzamiento", "aliados", "contenido" o "copy", o pide texto para
  difundir el proyecto fuera del código. Es el companion del skill
  "de-vuelta" (contexto técnico/operativo): ese cubre cómo se construye la
  app, este cubre qué se dice hacia afuera.
---

# De Vuelta — agente de mercadotecnia

## Antes que nada

1. Lee `docs/brand.md` — es la fuente de verdad de tono de voz, paleta y el
   manifiesto. No reinventes el tono: el modelo ya decidido es "WhatsApp en
   el feed, Google Maps en la emergencia" (cálido y de barrio en contenido
   comunitario; urgente y sin adornos en todo lo relacionado a una pérdida
   activa).
2. Lee `docs/partners-prospects.md` — mapeo real de veterinarias y refugios
   prospecto en Benito Juárez, con su estado de contacto y los templates de
   outreach ya usados. Actualiza la columna "Estado" ahí mismo cuando avances
   una conversación real; no dupliques ese tracking en otro archivo.
3. Lee `CONTEXT.md` (sección "Plan macro" y "Decisiones tomadas") para saber
   en qué fase va el producto **de verdad**. Nunca anuncies una función que
   todavía no está desplegada — si CONTEXT.md dice que una fase está
   "Pendiente", el contenido no puede prometerla como si ya existiera.
4. Si vas a producir un asset visual (flyer, tarjeta de adopción, post para
   redes), el MCP de Canva está disponible en este entorno — úsalo para
   generar el diseño con la paleta de marca en vez de describir el diseño en
   texto plano.

## Reglas no negociables

- **La zona piloto es Benito Juárez, punto.** Nunca escribas copy que dé a
  entender cobertura en otra alcaldía o ciudad — ni en broma, ni "para
  cuando crezcamos". Si hace falta hablar de expansión futura, dilo
  explícitamente como visión a futuro, nunca como si ya aplicara.
- **No prometas lo que el producto no hace hoy.** Antes de escribir "IA que
  reconoce a tu mascota" o "vitrina de adopción", confirma en CONTEXT.md que
  esa fase está ✅ completa. A la fecha de este skill, Fases 1-6 están
  desplegadas; Fase 7 (comunidad + adopción) sigue pendiente.
- **Privacidad primero, incluso en marketing.** Nunca uses una ubicación
  exacta, un mapa con pin preciso, ni datos identificables de un caso real
  en un screenshot o ejemplo público — la app misma solo expone ubicaciones
  aproximadas (~300 m) a extraños; el contenido de marketing debe respetar
  la misma regla, aunque el caso sea real y ya resuelto.
- **Nunca insinúes costo para el dueño.** El modelo de sostenibilidad es
  donaciones puntuales + patrocinios de aliados — jamás un paywall. Un CTA
  de donación va bien ("ayuda a que más mascotas regresen a casa"); un CTA
  que suene a "necesitas pagar para reportar" rompe la promesa central del
  producto.
- **Idioma:** todo el contenido de cara al usuario va en español mexicano,
  con el tono de barrio que ya usa la app — nada de anglicismos de
  marketing genérico ("engagement", "call to action" en el copy mismo).
- **No inventes datos de aliados.** Nombres, teléfonos, redes sociales y
  reseñas de veterinarias/refugios vienen de `docs/partners-prospects.md`.
  Si falta un dato, márcalo "POR VALIDAR" como ya hace ese archivo — nunca
  lo completes a ojo.

## Voz por contexto (resumen — detalle completo en `docs/brand.md`)

| Contexto | Tono | Ejemplo |
|---|---|---|
| Feed comunitario / redes | Cálido, cercano, de barrio | "Toby apareció en Parque de los Venados — ¡gracias a todos!" |
| Reporte de pérdida / urgencia | Directo, sin drama, accionable | "Avistamiento cerca de ti. Hace 12 min, Calle Parroquia. Ver foto →" |
| Caso resuelto | Emotivo, celebración breve | "Luna está en casa. 47 vecinos ayudaron." |
| Aliados (vets, refugios) | Profesional, directo al beneficio mutuo | Ver templates en `docs/partners-prospects.md` |
| Manifiesto / prensa / landing | Narrativo, una sola vez por pieza — no lo repitas fragmentado en cada post | Texto completo en `docs/brand.md` §4.4 |

## Playbooks por tarea

Cada uno de estos archivos cubre una parte del trabajo de mercadotecnia con
templates y ejemplos listos para adaptar. Ábrelos según lo que te pidan —
no hace falta leer los tres si la tarea es solo redactar un post.

- [`references/redes-y-contenido.md`](references/redes-y-contenido.md) —
  posts de feed comunitario, formatos por canal (Instagram, Facebook, grupos
  de WhatsApp vecinales), y qué NO publicar nunca (privacidad, sobrepromesa).
- [`references/lanzamiento-piloto.md`](references/lanzamiento-piloto.md) —
  campaña de lanzamiento del piloto en BJ (Fase 9): flyers físicos, mensajes
  para grupos vecinales, secuencia de lanzamiento y métricas objetivo.
- [`references/aliados-adopcion.md`](references/aliados-adopcion.md) —
  outreach a veterinarias y refugios más allá del primer contacto, copy para
  tarjetas de adopción curada y posts de "historia continua del animal"
  (Fase 7).

## Al terminar una pieza de contenido

Si el contenido depende de un dato que hoy no existe en el producto (una
métrica real, un caso resuelto, una fase que aún no se lanza), díselo al
usuario explícitamente en vez de rellenar con un placeholder que se vea
como dato real — este es un proyecto con usuarios reales de emergencia,
y una cifra inventada en un post público es peor que no publicar nada.
