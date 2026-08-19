// Worker único de la app, en la ruta exacta que exige la config de
// OneSignal (su dashboard manda sobre los parámetros del init).
//
// El import del CDN de OneSignal va explícito y primero: el SDK verifica
// que el archivo del worker registrado contenga su propio importScripts
// para aceptarlo como suyo; si solo cargábamos /sw.js de forma indirecta,
// registraba el worker pero nunca creaba la suscripción push.
//
// Después carga el worker de Serwist, que da el offline de la PWA. Así un
// solo service worker controla el scope "/" y hace ambas cosas.
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
importScripts("/sw.js");
