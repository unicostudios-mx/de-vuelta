"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";
import { publicEnv } from "@/lib/env";

// Promesa global (sobrevive HMR y el doble-mount de React en dev): el SDK
// solo admite un init por página, y login() debe esperar a que termine.
declare global {
  interface Window {
    __onesignalInit?: Promise<void>;
  }
}

/**
 * Inicializa OneSignal para usuarios con sesión: reutiliza el service
 * worker de Serwist (que importa el SDK de OneSignal), muestra el
 * soft-prompt Slidedown y liga la suscripción al id de Supabase vía
 * external_id — eso habilita el push dirigido (aviso al dueño) y el
 * targeting futuro de Fase 6.
 */
export function PushInit({ userId }: { userId: string }) {
  useEffect(() => {
    const run = async () => {
      try {
        window.__onesignalInit ??= OneSignal.init({
          appId: publicEnv.onesignalAppId,
          // Apunta al service worker de Serwist, que importa el SDK de
          // OneSignal (ver app/sw.ts) — un solo worker en el scope raíz.
          serviceWorkerParam: { scope: "/" },
          serviceWorkerPath: "sw.js",
          allowLocalhostAsSecureOrigin: true,
        });
        await window.__onesignalInit;
        await OneSignal.login(userId);
        await OneSignal.Slidedown.promptPush();
      } catch (err) {
        // El push es amplificación, nunca bloquea la app.
        console.error("[push] init falló", err);
      }
    };
    void run();
  }, [userId]);

  return null;
}
