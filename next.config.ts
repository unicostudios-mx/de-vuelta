import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // El service worker solo se genera en producción; en dev estorba con HMR.
  disable: process.env.NODE_ENV === "development",
  // No auto-registrar /sw.js: quien se registra es /OneSignalSDKWorker.js
  // (que importa a /sw.js), porque OneSignal exige ese nombre en el root y
  // dos workers no pueden compartir el scope "/". Ver components/sw-register.tsx.
  register: false,
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
