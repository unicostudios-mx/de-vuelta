"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isInBenitoJuarez } from "@/lib/geo/validate-bj";
import { notifyNewReport } from "@/lib/notifications";

export type ReportActionState = { error: string | null };

const createReportSchema = z.object({
  petId: z.string().uuid("Elige una mascota."),
  lat: z.coerce.number().refine(Number.isFinite, "Marca la ubicación en el mapa."),
  lng: z.coerce.number().refine(Number.isFinite, "Marca la ubicación en el mapa."),
  // refine (no .max(new Date())): el schema vive a nivel de módulo, así que
  // un new Date() aquí se congelaría al cargar el server. +60s de tolerancia
  // por desfase de reloj entre cliente y servidor.
  lastSeenAt: z.coerce
    .date()
    .refine((d) => d.getTime() <= Date.now() + 60_000, "La fecha no puede ser futura."),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  reward: z.coerce.number().min(0, "La recompensa no puede ser negativa").optional(),
});

export async function createReport(
  prevState: ReportActionState,
  formData: FormData
): Promise<ReportActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const raw = Object.fromEntries(formData);
  if (raw.lat === "" || raw.lng === "") {
    return { error: "Marca en el mapa dónde la viste por última vez." };
  }
  if (raw.reward === "") delete raw.reward;

  const parsed = createReportSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Invariante geográfico del proyecto: la validación del cliente es solo
  // UX — esta es la que protege la base de datos.
  if (!isInBenitoJuarez(parsed.data.lat, parsed.data.lng)) {
    return { error: "La ubicación debe estar dentro de Benito Juárez." };
  }

  const { data: created, error } = await supabase
    .from("lost_reports")
    .insert({
      pet_id: parsed.data.petId,
      reporter_id: user.id,
      last_seen_lat: parsed.data.lat,
      last_seen_lng: parsed.data.lng,
      last_seen_at: parsed.data.lastSeenAt.toISOString(),
      notes: parsed.data.notes || null,
      reward_amount: parsed.data.reward ?? null,
    })
    .select("id, pets(name, species, color)")
    .single();

  // RLS rechaza el insert si la mascota no es del usuario.
  if (error || !created) {
    return { error: "No se pudo crear el reporte. Intenta de nuevo." };
  }

  // Amplificación: broadcast a los vecinos suscritos. Nunca bloquea el flujo.
  await notifyNewReport({
    reportId: created.id,
    petName: created.pets?.name ?? "Una mascota",
    species: created.pets?.species,
    color: created.pets?.color,
  });

  revalidatePath("/reportes");
  revalidatePath("/perdidos");
  redirect("/reportes");
}

export async function resolveReport(reportId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("lost_reports")
    .update({ status: "resolved", resolved_at: new Date().toISOString() })
    .eq("id", reportId)
    .eq("status", "active");

  if (error) throw new Error("No se pudo marcar el reporte como resuelto.");

  revalidatePath("/reportes");
  revalidatePath(`/reportes/${reportId}`);
  redirect("/reportes");
}
