// Único service worker de la app.
//
// Fase 5: OneSignal maneja el service worker por completo. Convivir con el
// worker de Serwist (offline de la PWA) rompía la suscripción push — el SDK
// registraba el worker pero nunca le adjuntaba el token, así que ningún
// navegador quedaba suscrito. Se priorizó el push: es el mecanismo que
// resuelve el problema central del producto (que los vecinos se enteren a
// tiempo), mientras que el caché offline aporta poco en una app de datos
// vivos y hasta puede mostrar reportes ya resueltos.
//
// Para reactivar el offline: volver a poner `disable` en next.config.ts y
// resolver el conflicto de workers (ver troubleshooting.md).
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// Handler mínimo de fetch: Chrome lo pide para considerar la PWA
// instalable. Deja pasar todo a la red sin cachear nada.
self.addEventListener("fetch", () => {});
