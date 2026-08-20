"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { isInBenitoJuarez } from "@/lib/geo/validate-bj";
import { notifySightingToOwner } from "@/lib/notifications";
import { scorePetMatch } from "@/lib/matching";
import { puedeMandarAviso, puedeAnalizarFoto } from "@/lib/rate-limit";

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

  // Antes de subir nada: quien pasa el techo horario no nos llena el
  // Storage ni dispara pushes en serie al dueño.
  if (!(await puedeMandarAviso(supabase, user.id))) {
    return {
      error:
        "Recibimos muchos avisos tuyos en la última hora. Espera un poco antes de mandar otro.",
    };
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

  const { data: sighting, error } = await supabase
    .from("sightings")
    .insert({
      report_id: reportId,
      spotter_id: user.id,
      lat: parsed.data.lat,
      lng: parsed.data.lng,
      spotted_at: parsed.data.spottedAt.toISOString(),
      notes: parsed.data.notes || null,
      photo_urls: photoUrls,
    })
    .select("id")
    .single();

  // RLS rechaza si el reporte no existe o ya no está activo.
  if (error || !sighting) {
    return {
      error: "No se pudo enviar el aviso. Puede que el reporte ya esté resuelto.",
    };
  }

  // Todo lo que sigue corre DESPUÉS de responderle al vecino: el push y el
  // análisis de la foto suman ~25s, y hacerlo esperar mirando un spinner en
  // plena urgencia lo llevaría a creer que falló y reenviar. Su avistamiento
  // ya está guardado; el resto es amplificación.
  // Los datos del reporte se leen con el admin client porque el vecino no
  // puede leer lost_reports (RLS) — nunca llegan al cliente.
  after(async () => {
    try {
      const admin = createAdminClient();
      const { data: report } = await admin
        .from("lost_reports")
        .select("reporter_id, pets(name, species, breed, color, description, photo_urls)")
        .eq("id", reportId)
        .single();

      if (report?.reporter_id) {
        await notifySightingToOwner({
          ownerId: report.reporter_id,
          reportId,
          petName: report.pets?.name ?? "tu mascota",
        });
      }

      // Fila de match siempre, con o sin score: es lo que habilita la
      // revisión manual del dueño aunque el vecino no haya subido foto.
      const { data: match } = await admin
        .from("matches")
        .insert({ report_id: reportId, sighting_id: sighting.id })
        .select("id")
        .single();

      const petPhotoUrl = report?.pets?.photo_urls?.[0];
      if (match && petPhotoUrl && photoUrls[0]) {
        // Saltarse el análisis degrada el lujo, no la función: el aviso ya
        // está guardado y el dueño lo revisa a mano.
        if (!(await puedeAnalizarFoto(admin, { spotterId: user.id, reportId }))) {
          console.warn("[match] análisis omitido por límite de uso", { reportId });
          return;
        }
        const result = await scorePetMatch({
          sightingPhotoUrl: photoUrls[0],
          petPhotoUrl,
          pet: {
            name: report.pets!.name,
            species: report.pets!.species,
            breed: report.pets!.breed,
            color: report.pets!.color,
            description: report.pets!.description,
          },
        });
        if (result) {
          await admin
            .from("matches")
            .update({ confidence: result.score })
            .eq("id", match.id);
          console.log("[match] score", result.score, "—", result.reasoning);
        }
      }
    } catch (err) {
      console.error("[sighting] post-procesamiento falló", err);
    }
  });

  revalidatePath(`/perdidos/${reportId}`);
  redirect(`/perdidos/${reportId}?aviso=ok`);
}
