import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "De Vuelta",
  description:
    "Red hiperlocal para reunir mascotas perdidas con sus dueños en la Alcaldía Benito Juárez, CDMX.",
  applicationName: "De Vuelta",
  keywords: ["mascotas perdidas", "Benito Juárez", "CDMX", "rescate animal"],
  authors: [{ name: "Unico Studios" }],
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
