import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LocationPicker } from "@/components/location-picker";
import { ReportStatusBadge } from "@/components/report-status-badge";
import { ResolveReportButton } from "@/components/resolve-report-button";
import { resolveReport } from "@/app/reportes/actions";

const dateFmt = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "America/Mexico_City",
});

const mxn = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

export default async function ReporteDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  // RLS: solo el dueño del reporte lo puede ver — ajeno o inexistente → 404.
  const { data: report } = await supabase
    .from("lost_reports")
    .select("*, pets(name, species, breed, color, photo_urls)")
    .eq("id", id)
    .single();

  if (!report) notFound();

  // RLS: como dueño del reporte, ve todos los avistamientos asociados.
  const { data: sightings } = await supabase
    .from("sightings")
    .select("*")
    .eq("report_id", id)
    .order("spotted_at", { ascending: false });

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {report.pets?.name ?? "Mascota"}
        </h1>
        <ReportStatusBadge status={report.status} />
      </div>

      {report.pets?.photo_urls?.[0] && (
        <Image
          src={report.pets.photo_urls[0]}
          alt={report.pets.name}
          width={640}
          height={360}
          className="mb-6 aspect-video w-full rounded-md object-cover"
        />
      )}

      <dl className="mb-6 space-y-3 text-sm">
        {report.pets && (
          <div>
            <dt className="font-medium text-foreground">Señas</dt>
            <dd className="text-muted-foreground">
              {[report.pets.breed, report.pets.color].filter(Boolean).join(" · ")}
            </dd>
          </div>
        )}
        <div>
          <dt className="font-medium text-foreground">Última vez vista</dt>
          <dd className="text-muted-foreground">
            {dateFmt.format(new Date(report.last_seen_at))}
          </dd>
        </div>
        {report.notes && (
          <div>
            <dt className="font-medium text-foreground">Detalles</dt>
            <dd className="text-muted-foreground">{report.notes}</dd>
          </div>
        )}
        {report.reward_amount != null && (
          <div>
            <dt className="font-medium text-foreground">Recompensa</dt>
            <dd className="text-muted-foreground">{mxn.format(report.reward_amount)}</dd>
          </div>
        )}
        {report.resolved_at && (
          <div>
            <dt className="font-medium text-foreground">Resuelto el</dt>
            <dd className="text-muted-foreground">
              {dateFmt.format(new Date(report.resolved_at))}
            </dd>
          </div>
        )}
      </dl>

      <div className="mb-2">
        <LocationPicker
          readOnly
          initial={{ lat: report.last_seen_lat, lng: report.last_seen_lng }}
          markers={(sightings ?? []).map((s) => ({ lat: s.lat, lng: s.lng }))}
        />
      </div>
      {sightings && sightings.length > 0 && (
        <p className="mb-6 text-xs text-muted-foreground">
          Pin rojo: donde la viste tú. Pins verdes: avistamientos de vecinos.
        </p>
      )}

      <section className="mb-6">
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Avistamientos de vecinos
        </h2>
        {!sightings || sightings.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todavía no hay avistamientos. Comparte el reporte con tus vecinos
            — entre más ojos, más rápido vuelve.
          </p>
        ) : (
          <ul className="space-y-4">
            {sightings.map((s) => (
              <li key={s.id} className="rounded-md border border-border p-4">
                <p className="text-sm font-medium text-foreground">
                  {dateFmt.format(new Date(s.spotted_at))}
                </p>
                {s.notes && (
                  <p className="mt-1 text-sm text-muted-foreground">{s.notes}</p>
                )}
                {s.photo_urls[0] && (
                  <Image
                    src={s.photo_urls[0]}
                    alt="Foto del avistamiento"
                    width={320}
                    height={180}
                    className="mt-2 rounded-md object-cover"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {report.status === "active" && (
        <ResolveReportButton action={resolveReport.bind(null, report.id)} />
      )}
    </main>
  );
}
