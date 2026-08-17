"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { isInBenitoJuarez } from "@/lib/geo/validate-bj";
import { notifySightingToOwner } from "@/lib/notifications";

export type SightingActionState = { error: string | null };

const sightingSchema = z.object({
  lat: z.coerce.number().refine(Number.isFinite, "Marca la ubicación en el mapa."),
  lng: z.coerce.number().refine(Number.isFinite, "Marca la ubicación en el mapa."),
  spottedAt: z.coerce
    .date()
    .refine((d) => d.getTime() <= Date.now() + 60_000, "La fecha no puede ser futura."),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export async function createSighting(
  reportId: string,
  prevState: SightingActionState,
  formData: FormData
): Promise<SightingActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const raw = Object.fromEntries(formData);
  if (raw.lat === "" || raw.lng === "") {
    return { error: "Marca en el mapa dónde la viste." };
  }

  const parsed = sightingSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Invariante geográfico: la validación del cliente es UX; esta protege la DB.
  if (!isInBenitoJuarez(parsed.data.lat, parsed.data.lng)) {
    return { error: "La ubicación debe estar dentro de Benito Juárez." };
  }

  const photoUrls: string[] = [];
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const path = `${user.id}/${crypto.randomUUID()}-${photo.name}`;
    const { error: uploadError } = await supabase.storage
      .from("sighting-photos")
      .upload(path, photo);
    if (uploadError) {
      return { error: "No se pudo subir la foto. Intenta de nuevo." };
    }
    photoUrls.push(
      supabase.storage.from("sighting-photos").getPublicUrl(path).data.publicUrl
    );
  }

  const { error } = await supabase.from("sightings").insert({
    report_id: reportId,
    spotter_id: user.id,
    lat: parsed.data.lat,
    lng: parsed.data.lng,
    spotted_at: parsed.data.spottedAt.toISOString(),
    notes: parsed.data.notes || null,
    photo_urls: photoUrls,
  });

  // RLS rechaza si el reporte no existe o ya no está activo.
  if (error) {
    return {
      error: "No se pudo enviar el aviso. Puede que el reporte ya esté resuelto.",
    };
  }

  // Aviso dirigido al dueño. El vecino no puede leer lost_reports (RLS),
  // así que el reporter_id se obtiene server-side con el admin client —
  // el dato nunca llega al cliente. Nunca bloquea el flujo.
  try {
    const admin = createAdminClient();
    const { data: report } = await admin
      .from("lost_reports")
      .select("reporter_id, pets(name)")
      .eq("id", reportId)
      .single();
    if (report?.reporter_id) {
      await notifySightingToOwner({
        ownerId: report.reporter_id,
        reportId,
        petName: report.pets?.name ?? "tu mascota",
      });
    }
  } catch (err) {
    console.error("[push] no se pudo notificar al dueño", err);
  }

  revalidatePath(`/perdidos/${reportId}`);
  redirect(`/perdidos/${reportId}?aviso=ok`);
}
