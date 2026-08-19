import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// OneSignal comparte ESTE service worker en vez de registrar el suyo: dos
// workers no pueden controlar el mismo scope ("/"), y Serwist ya lo posee
// para el offline de la PWA. Es la vía documentada por OneSignal para
// sitios con service worker propio.
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
