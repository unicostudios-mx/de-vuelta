"use client";

import { useEffect } from "react";

/**
 * Registra el único service worker de la app: /OneSignalSDKWorker.js, que
 * importa el worker generado por Serwist (offline de la PWA) y el SDK de
 * OneSignal (push). Se registra para todos —con o sin sesión— para que el
 * offline funcione también para visitantes anónimos de /perdidos, y para
 * que OneSignal encuentre su registro ya presente cuando el usuario
 * inicia sesión.
 */
export function SwRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/OneSignalSDKWorker.js", { scope: "/" })
      .catch((err) => console.error("[sw] registro falló", err));
  }, []);

  return null;
}
