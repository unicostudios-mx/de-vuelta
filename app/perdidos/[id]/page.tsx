import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LocationPicker } from "@/components/location-picker";

const dateFmt = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "full",
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

export default async function PerdidoDetallePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ aviso?: string }>;
}) {
  const { id } = await params;
  const { aviso } = await searchParams;
  const supabase = await createClient();

  const [{ data: report }, { data: { user } }] = await Promise.all([
    supabase.from("active_reports_public").select("*").eq("id", id).single(),
    supabase.auth.getUser(),
  ]);

  // Solo reportes activos viven en la view — resueltos/inexistentes → 404.
  if (!report) notFound();

  const sightingHref = `/perdidos/${id}/avistamiento`;

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      {aviso === "ok" && (
        <p className="mb-6 rounded-md bg-accent px-4 py-3 text-sm text-accent-foreground">
          Aviso enviado. El dueño ya puede ver tu reporte. Gracias por ayudar. 🐾
        </p>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{report.pet_name}</h1>
        <span className="rounded-full bg-destructive px-2.5 py-0.5 text-xs font-semibold text-white">
          Perdido
        </span>
      </div>

      {report.photo_urls?.[0] && (
        <Image
          src={report.photo_urls[0]}
          alt={report.pet_name ?? ""}
          width={640}
          height={360}
          className="mb-6 aspect-video w-full rounded-md object-cover"
        />
      )}

      <dl className="mb-6 space-y-3 text-sm">
        <div>
          <dt className="font-medium text-foreground">Señas</dt>
          <dd className="text-muted-foreground">
            {[
              SPECIES_LABELS[report.species ?? ""] ?? report.species,
              report.breed,
              report.color,
            ]
              .filter(Boolean)
              .join(" · ")}
          </dd>
        </div>
        {report.last_seen_at && (
          <div>
            <dt className="font-medium text-foreground">Última vez vista</dt>
            <dd className="text-muted-foreground">
              {dateFmt.format(new Date(report.last_seen_at))}
            </dd>
          </div>
        )}
        {report.notes && (
          <div>
            <dt className="font-medium text-foreground">Detalles del dueño</dt>
            <dd className="text-muted-foreground">{report.notes}</dd>
          </div>
        )}
        {report.reward_amount != null && (
          <div>
            <dt className="font-medium text-foreground">Recompensa</dt>
            <dd className="text-muted-foreground">{mxn.format(report.reward_amount)}</dd>
          </div>
        )}
      </dl>

      {report.approx_lat != null && report.approx_lng != null && (
        <div className="mb-2">
          <LocationPicker
            readOnly
            initial={{ lat: report.approx_lat, lng: report.approx_lng }}
          />
        </div>
      )}
      <p className="mb-6 text-xs text-muted-foreground">
        Ubicación aproximada (~300 m) por privacidad del dueño.
      </p>

      <Button asChild className="w-full">
        <Link href={user ? sightingHref : `/login?next=${encodeURIComponent(sightingHref)}`}>
          La vi — avisar al dueño
        </Link>
      </Button>
    </main>
  );
}
