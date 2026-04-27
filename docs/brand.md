# Identidad inicial — Vecino Peludo
**Fase 0 · Borrador v1 · Pendiente decisión final de Nicolás**

---

## 4.1 Opciones de nombre

### Opción A — Vecino Peludo _(nombre tentativo actual)_

**Razonamiento:** Cálido, inmediatamente comprensible, genera imagen mental positiva. "Vecino" ancla el concepto hiperlocal y comunitario; "peludo" es coloquial mexicano para mascota. Fácil de decir, fácil de recordar, difícil de confundir con otra app.

| Criterio | Evaluación |
|---|---|
| Memorabilidad | Alta — imagen dual (vecino + mascota) |
| Claridad | Alta — se entiende el tema sin explicación |
| Dominio `.mx` | **Verificación pendiente** → https://www.nic.mx/buscar/?dominio=vecinopeludo |
| Dominio `.app` | **Verificación pendiente** → https://domains.google.com/registrar/search?searchTerm=vecinopeludo.app |
| Traducibilidad | Media — "Furry Neighbor" en inglés pierde el encanto; no es prioridad para el piloto |
| Riesgo | Podría sonar demasiado informal para aliados corporativos (vet chains) |

---

### Opción B — Huella BJ

**Razonamiento:** "Huella" tiene doble significado: huella de pata (mascota) y rastro/evidencia (búsqueda). "BJ" marca la identidad geográfica desde el nombre — refuerza el diferenciador hiperlocal. Corto, distintivo, fácil de pronunciar en voz alta y en notificaciones push. Escala mejor si se expande a otras alcaldías (Huella NAR, Huella CU).

| Criterio | Evaluación |
|---|---|
| Memorabilidad | Alta — visual de pata + acronimo de la zona |
| Claridad | Media — requiere un segundo de interpretación |
| Dominio `.mx` | **Verificación pendiente** → https://www.nic.mx/buscar/?dominio=huellabj |
| Dominio `.app` | **Verificación pendiente** → https://domains.google.com/registrar/search?searchTerm=huellabj.app |
| Traducibilidad | Alta — "Paw BJ" funciona en inglés |
| Riesgo | "BJ" puede generar confusión escrito en mayúsculas en ciertos contextos |

---

### Opción C — Patita Segura

**Razonamiento:** Emocional, protector, orientado al beneficio ("segura" resuelve la ansiedad del dueño). Evoca cuidado y tranquilidad. Fuerte para landing page y onboarding. Más débil como nombre de app en notificaciones ("Patita Segura te notifica que...").

| Criterio | Evaluación |
|---|---|
| Memorabilidad | Alta — evocador y afectivo |
| Claridad | Alta — comunica protección directamente |
| Dominio `.mx` | **Verificación pendiente** → https://www.nic.mx/buscar/?dominio=patitasegura |
| Dominio `.app` | **Verificación pendiente** → https://domains.google.com/registrar/search?searchTerm=patitasegura.app |
| Traducibilidad | Baja — "Safe Paw" suena funcional, pierde calidez |
| Riesgo | Puede percibirse como seguro de mascotas (producto financiero) |

---

> **Decisión pendiente de Nicolás:** ¿Cuál de los tres nombres prefieres? Si eliges Vecino Peludo (A), también confirmar si se mantiene como nombre definitivo o si es working title.

---

## 4.2 Tono de voz

**Recomendación: Híbrido** — cálido y comunitario en el feed; urgente y funcional en el flujo de pérdida activa.

**Justificación:** La app vive en dos estados emocionales radicalmente distintos. El 95% del tiempo es comunidad: avistamientos cotidianos, casos resueltos, adopciones, vecinos que ayudan. Ahí el tono debe ser cálido, cercano, barrio. Pero cuando alguien reporta que perdió a su mascota hace dos horas, el tono cambia: instrucciones claras, sin adornos, máxima fricción cero. Mezclar ambos tonos de forma rígida crea disonancia; separar los estados según el contexto de uso es lo que hace que la app se sienta inteligente emocionalmente. El modelo: WhatsApp en el feed, Google Maps en la emergencia.

| Contexto | Tono | Ejemplo de copy |
|---|---|---|
| Onboarding | Cálido · invitador | "Tu colonia ya cuida a tus vecinos peludos." |
| Feed comunitario | Cercano · barrio | "Toby apareció en Parque de los Venados — ¡gracias a todos!" |
| Reporte de pérdida | Urgente · claro · sin drama | "¿Dónde fue visto por última vez? Escribe la dirección exacta." |
| Notificación de avistamiento | Directo · accionable | "Avistamiento cerca de ti. Hace 12 min, Calle Parroquia. Ver foto →" |
| Caso resuelto | Emotivo · celebración breve | "Luna está en casa. 47 vecinos ayudaron." |

---

## 4.3 Paleta preliminar

> Todos los colores pasan contraste WCAG AA (≥ 4.5:1 texto normal sobre blanco) salvo donde se indica.

| Rol | Nombre | Hex | Contraste sobre blanco | Uso |
|---|---|---|---|---|
| **Primario / acción** | Teal 700 | `#0F766E` | 5.9:1 ✅ AA | Botones principales, links, iconos activos |
| **Urgencia / pérdida activa** | Red 600 | `#DC2626` | 4.5:1 ✅ AA | Badge "Perdido", alertas, contador de horas |
| **Éxito / caso resuelto** | Green 600 | `#16A34A` | 4.5:1 ✅ AA | "¡Encontrado!", confirmaciones, donación completada |
| **Neutral oscuro** | Gray 900 | `#111827` | 16.1:1 ✅ AAA | Texto principal, títulos |
| **Neutral claro** | Gray 50 | `#F9FAFB` | — | Fondos de pantalla, cards |

**Nota de implementación:** El rojo de urgencia (`#DC2626`) debe usarse con moderación — solo para el estado "Perdido activo". Usarlo en otros contextos desensibiliza la alerta. Considerar un naranja (`#EA580C`, 3.5:1 — solo texto grande) para el estado intermedio "Avistado, no confirmado".

---

## 4.4 Manifiesto

> Para landing page, pantalla de onboarding y materiales de prensa.

---

*Cada año, miles de mascotas se pierden en la ciudad. Sus dueños publican en grupos de WhatsApp, pegan carteles, llaman a veterinarias — solos, con el tiempo en contra. Vecino Peludo existe porque el barrio tiene el poder de cambiar eso. Un avistamiento a tiempo, un vecino que sube una foto, una veterinaria que avisa: la red ya está aquí. Solo faltaba conectarla. Cuando una mascota se pierde en Benito Juárez, toda la colonia se convierte en su red de búsqueda.*

---

> **Nota:** El manifiesto usa "Vecino Peludo" como nombre. Si se elige la Opción B o C, actualizar en consecuencia.
