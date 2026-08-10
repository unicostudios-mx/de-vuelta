import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SPECIES_LABELS: Record<string, string> = {
  dog: "Perro",
  cat: "Gato",
  rabbit: "Conejo",
  bird: "Ave",
  reptile: "Reptil",
  rodent: "Roedor",
  other: "Otro",
};

export default async function MascotasPage() {
  const supabase = await createClient();
  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Mis mascotas</h1>
        <Button asChild>
          <Link href="/mascotas/nueva">Agregar mascota</Link>
        </Button>
      </div>

      {!pets || pets.length === 0 ? (
        <p className="text-muted-foreground">
          Todavía no registras ninguna mascota.{" "}
          <Link href="/mascotas/nueva" className="text-primary underline">
            Agrega la primera
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {pets.map((pet) => (
            <Card
              key={pet.id}
              className="h-full overflow-hidden transition-shadow hover:shadow-md"
            >
              <Link href={`/mascotas/${pet.id}/editar`}>
                {pet.photo_urls[0] && (
                  <div className="relative aspect-square w-full">
                    <Image
                      src={pet.photo_urls[0]}
                      alt={pet.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{pet.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {SPECIES_LABELS[pet.species] ?? pet.species}
                    {pet.breed ? ` · ${pet.breed}` : ""}
                  </p>
                </CardContent>
              </Link>
              <CardContent className="pt-0">
                <Link
                  href={`/reportes/nuevo?pet=${pet.id}`}
                  className="text-sm font-medium text-destructive hover:underline"
                >
                  Reportar pérdida
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
