import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // DESACTIVADO en Fase 5: el worker de Serwist y el de OneSignal no pueden
  // compartir el scope "/", y su convivencia impedía que el SDK suscribiera
  // navegadores (suscripción sin token push → nadie recibía nada). Se
  // priorizó el push sobre el caché offline; ver public/OneSignalSDKWorker.js
  // y troubleshooting.md. Para revivir el offline: quitar este `true` y
  // resolver el conflicto de workers.
  disable: true,
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ypmlsydglregsuzbgric.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default withSerwist(nextConfig);
