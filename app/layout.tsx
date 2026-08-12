import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "De Vuelta",
  description:
    "Red hiperlocal para reunir mascotas perdidas con sus dueños en la Alcaldía Benito Juárez, CDMX.",
  applicationName: "De Vuelta",
  keywords: ["mascotas perdidas", "Benito Juárez", "CDMX", "rescate animal"],
  authors: [{ name: "Unico Studios" }],
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
    // iOS no soporta SVG en apple-touch-icon; se sirve el mismo SVG como
    // mejor esfuerzo hasta generar PNGs (decisión: solo SVG en Fase 1).
    apple: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "De Vuelta",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F766E",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="es-MX">
      <body>
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <Link href="/" className="font-bold text-primary">
            De Vuelta
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/perdidos" className="text-foreground hover:text-primary">
              Perdidos
            </Link>
            {user ? (
              <>
                <Link href="/mascotas" className="text-foreground hover:text-primary">
                  Mis mascotas
                </Link>
                <Link href="/reportes" className="text-foreground hover:text-primary">
                  Reportes
                </Link>
                <form action="/logout" method="post">
                  <Button type="submit" variant="ghost" size="sm">
                    Salir
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-foreground hover:text-primary">
                  Iniciar sesión
                </Link>
                <Link href="/signup" className="text-foreground hover:text-primary">
                  Registrarme
                </Link>
              </>
            )}
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
