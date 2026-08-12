import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SightingForm } from "@/components/sighting-form";
import { createSighting } from "@/app/perdidos/actions";

export default async function AvistamientoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: report } = await supabase
    .from("active_reports_public")
    .select("id, pet_name")
    .eq("id", id)
    .single();

  if (!report) notFound();

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        ¿Viste a {report.pet_name}?
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Tu aviso le llega directo al dueño con la ubicación exacta que marques
        — solo él la verá.
      </p>
      <SightingForm action={createSighting.bind(null, id)} />
    </main>
  );
}
