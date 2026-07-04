// Acceso centralizado y validado a variables de entorno.
// Getters lazy: el error salta en el primer uso, no al importar,
// para no romper `next build` en páginas que no las necesitan.

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}. ` +
        `Revisa .env.local (template en .env.example).`
    );
  }
  return value;
}

function serverOnly(name: string, value: string | undefined): string {
  if (typeof window !== "undefined") {
    throw new Error(`${name} is server-only and must never reach the browser.`);
  }
  return required(name, value);
}

// Seguras para cliente y servidor (Next.js las inserta en build —
// deben referenciarse con el nombre literal completo).
export const publicEnv = {
  get supabaseUrl() {
    return required(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL
    );
  },
  get supabaseAnonKey() {
    return required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  },
  get mapboxToken() {
    return required(
      "NEXT_PUBLIC_MAPBOX_TOKEN",
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    );
  },
};

// Solo servidor — lanzan si se evalúan en el browser.
export const serverEnv = {
  get supabaseServiceRoleKey() {
    return serverOnly(
      "SUPABASE_SERVICE_ROLE_KEY",
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  },
};
