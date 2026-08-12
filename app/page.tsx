import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-primary mb-6">
        De Vuelta
      </h1>

      <p className="max-w-prose text-base leading-relaxed text-foreground mb-8">
        Cada año, miles de mascotas se pierden en la ciudad. Sus dueños publican
        en grupos de WhatsApp, pegan carteles, llaman a veterinarias — solos,
        con el tiempo en contra. De Vuelta existe porque el barrio tiene el
        poder de cambiar eso. Un avistamiento a tiempo, un vecino que sube una
        foto, una veterinaria que avisa: la red ya está aquí. Solo faltaba
        conectarla. Cuando una mascota se pierde en Benito Juárez, toda la
        colonia trabaja para traerla de vuelta.
      </p>

      <Button asChild size="lg" className="mb-6">
        <Link href="/perdidos">Ver mascotas perdidas en Benito Juárez</Link>
      </Button>

      <p className="text-sm text-muted-foreground">
        Piloto en Alcaldía Benito Juárez, CDMX
      </p>
    </main>
  );
}
