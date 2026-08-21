import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportsMap, type ReportPin } from "@/components/reports-map";

const dateFmt = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Mexico_City",
});

const mxn = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

const SPECIES_LABELS: Record<string, string> = {
  dog: "Perro",
  cat: "Gato",
  rabbit: "Conejo",
  bird: "Ave",
  reptile: "Reptil",
  rodent: "Roedor",
  other: "Otro",
};

export default async function PerdidosPage() {
  const supabase = await createClient();
  const { data: reports } = await supabase
    .from("active_reports_public")
    .select("*")
    .order("last_seen_at", { ascending: false });

  const rows = (reports ?? []).filter(
    (r) => r.id && r.approx_lat != null && r.approx_lng != null
  );

  const pins: ReportPin[] = rows.map((r) => ({
    id: r.id!,
    lat: r.approx_lat!,
    lng: r.approx_lng!,
    label: r.pet_name ?? "Mascota",
    sublabel: r.last_seen_at
      ? `Vista: ${dateFmt.format(new Date(r.last_seen_at))}`
      : undefined,
  }));

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        Mascotas perdidas en Benito Juárez
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Las ubicaciones son aproximadas por privacidad. Si reconoces a alguna,
        entra al reporte y avisa — las primeras horas son las que más cuentan.
      </p>

      {rows.length === 0 ? (
        <p className="text-muted-foreground">
          No hay reportes activos ahora mismo. Buena señal para el barrio. 🐾
        </p>
      ) : (
        <>
          <div className="mb-8">
            <ReportsMap pins={pins} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {rows.map((r) => (
              <Link key={r.id} href={`/perdidos/${r.id}`}>
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                  {/* La caja va siempre, con foto o sin ella: en una
                      rejilla, la tarjeta sin foto se estira para igualar a
                      su vecina y el hueco se lee como imagen rota. */}
                  <div className="relative aspect-video w-full bg-muted">
                    {r.photo_urls?.[0] ? (
                      <Image
                        src={r.photo_urls[0]}
                        alt={r.pet_name ?? ""}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        Sin foto
                      </span>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {r.pet_name}
                      <span className="rounded-full bg-destructive px-2.5 py-0.5 text-xs font-semibold text-white">
                        Perdido
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      {SPECIES_LABELS[r.species ?? ""] ?? r.species}
                      {r.breed ? ` · ${r.breed}` : ""}
                      {r.color ? ` · ${r.color}` : ""}
                    </p>
                    {r.last_seen_at && (
                      <p>Vista: {dateFmt.format(new Date(r.last_seen_at))}</p>
                    )}
                    {r.reward_amount != null && (
                      <p className="font-medium text-foreground">
                        Recompensa: {mxn.format(r.reward_amount)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
