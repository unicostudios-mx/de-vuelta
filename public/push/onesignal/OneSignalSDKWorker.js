// Service worker de OneSignal, aislado en el scope /push/onesignal/ para
// no chocar con el service worker de Serwist que posee el scope raíz (/).
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
