import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportStatusBadge } from "@/components/report-status-badge";

const dateFmt = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Mexico_City",
});

export default async function ReportesPage() {
  const supabase = await createClient();
  const { data: reports } = await supabase
    .from("lost_reports")
    .select("*, pets(name, photo_urls)")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Mis reportes</h1>
        <Button asChild variant="destructive">
          <Link href="/reportes/nuevo">Reportar pérdida</Link>
        </Button>
      </div>

      {!reports || reports.length === 0 ? (
        <p className="text-muted-foreground">
          No tienes reportes. Ojalá nunca necesites uno — pero si tu mascota
          se pierde,{" "}
          <Link href="/reportes/nuevo" className="text-primary underline">
            repórtala aquí
          </Link>{" "}
          cuanto antes: las primeras horas son las que más cuentan.
        </p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Link key={report.id} href={`/reportes/${report.id}`} className="block">
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {report.pets?.photo_urls?.[0] && (
                      <Image
                        src={report.pets.photo_urls[0]}
                        alt=""
                        width={48}
                        height={48}
                        className="size-12 rounded-full object-cover"
                      />
                    )}
                    <CardTitle>{report.pets?.name ?? "Mascota"}</CardTitle>
                  </div>
                  <ReportStatusBadge status={report.status} />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Última vez vista: {dateFmt.format(new Date(report.last_seen_at))}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
