import type { Metadata, Viewport } from "next";
import "./globals.css";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
