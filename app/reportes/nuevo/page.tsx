import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ReportForm } from "@/components/report-form";

export default async function NuevoReportePage({
  searchParams,
}: {
  searchParams: Promise<{ pet?: string }>;
}) {
  const { pet } = await searchParams;
  const supabase = await createClient();
  const { data: pets } = await supabase
    .from("pets")
    .select("id, name")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Reportar pérdida</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Entre más precisa la información, más fácil es que un vecino la reconozca.
      </p>

      {!pets || pets.length === 0 ? (
        <p className="text-muted-foreground">
          Primero necesitas registrar a tu mascota.{" "}
          <Link href="/mascotas/nueva" className="text-primary underline">
            Regístrala aquí
          </Link>{" "}
          y luego vuelve para crear el reporte.
        </p>
      ) : (
        <ReportForm pets={pets} defaultPetId={pet} />
      )}
    </main>
  );
}
