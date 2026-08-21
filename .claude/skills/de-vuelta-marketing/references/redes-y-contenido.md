# Redes y contenido comunitario

Templates para el uso diario/semanal: mantener presencia en redes y grupos
vecinales mientras la app tiene tracción orgánica. Todo en tono "feed
comunitario" (ver tabla de voz en `SKILL.md`) salvo que se indique lo
contrario.

## Colonias de referencia (usar nombres reales, nunca "tu zona")

Del Valle, Narvarte, Nápoles, Portales, Mixcoac, Acacias, Letrán Valle — son
las colonias con comunidad activa identificadas en `CONTEXT.md`. Mencionar
la colonia específica en un post ancla el mensaje como hiperlocal, que es el
diferenciador central del producto — un post que hable de "la colonia" en
genérico se siente igual que cualquier app nacional.

## Formatos por canal

**Instagram / Facebook (post público, feed comunitario o cuenta de la app)**
- 1-3 líneas, tono cálido, siempre con colonia específica cuando aplique.
- Cierre casi siempre es un llamado a la acción de comunidad ("¿la viste?",
  "comparte con tu grupo de la colonia"), no de descarga de app en frío.
- Hashtags: solo los que ya tienen tracción real en la zona
  (`#BenitoJuarez`, `#DelValle`, `#MascotasPerdidasCDMX`) — no inventes
  hashtags de campaña sin volumen.

**Grupos de WhatsApp vecinales / Facebook groups de colonia**
- Más directo que redes propias, cero relleno — la gente en estos grupos ya
  está prestando atención a temas de la colonia, no hace falta "vender" el
  formato.
- Siempre con foto si el caso la tiene (mayor tasa de respuesta real).
- Nunca reenvíes ubicación exacta ni datos de contacto del dueño en el
  mensaje del grupo — el link a la app ya resuelve el contacto seguro.

## Ejemplos por situación

**Nuevo reporte de pérdida (dueño acaba de reportar)**
> Perdida en [colonia]: [nombre], [raza/color]. Última vez vista en [zona
> aproximada, NO dirección exacta] hace [tiempo]. Si la ves, repórtalo aquí
> → [link]. Cada minuto cuenta.

**Avistamiento nuevo (vecino reportó "la vi")**
> Alguien vio a [nombre] hace [tiempo] cerca de [zona aproximada]. Si vives
> por ahí, échale un ojo — el dueño ya está en camino.

**Caso resuelto**
> [Nombre] ya está en casa. [N] vecinos ayudaron a encontrarla en [tiempo
> total]. Esto es lo que pasa cuando una colonia se organiza.

**Feature o hito de producto** (usar solo si ya está desplegado — ver regla
de "no prometas lo que el producto no hace hoy" en `SKILL.md`)
> Ejemplo real ya verificado en producción: el matching por foto con IA
> (Fase 6) — copy tipo "ahora, cuando alguien reporta un avistamiento con
> foto, comparamos automáticamente si coincide con tu mascota perdida.
> Menos tiempo revisando avistamientos que no son los tuyos."

## Qué NO publicar nunca

- Ubicación exacta de una mascota perdida o de dónde vive el dueño (usar
  siempre zona aproximada — la misma regla que ya aplica la app en
  `active_reports_public`).
- Nombre completo, teléfono o cualquier dato de contacto directo de un
  dueño o vecino sin su consentimiento explícito para ese post en
  particular.
- Cifras de impacto que no vengan de datos reales verificados en Supabase o
  confirmados por el usuario — mejor "cientos de mascotas" cualitativo que
  un número inventado con apariencia de métrica real.
- Cualquier promesa de cobertura fuera de Benito Juárez.
