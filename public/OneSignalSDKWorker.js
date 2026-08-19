// Worker de OneSignal, en la ruta exacta que exige su configuración (el
// dashboard manda sobre serviceWorkerPath/serviceWorkerParam del init;
// verificable en https://api.onesignal.com/sync/{appId}/web).
//
// OJO — Fase 5 sin cerrar: tener este archivo arregla el 404 que había
// antes, pero el SDK sigue sin crear la suscripción push (token null,
// optIn() nunca resuelve). Se comprobó que NO es un conflicto con el
// worker de Serwist: el problema persiste incluso con este worker solo.
// Ver troubleshooting.md → sección "ABIERTO".
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
