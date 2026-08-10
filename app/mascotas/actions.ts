"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type PetActionState = { error: string | null };

const SPECIES_VALUES = ["dog", "cat", "rabbit", "bird", "reptile", "rodent", "other"] as const;

const petSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio.").max(80),
  species: z.enum(SPECIES_VALUES),
  breed: z.string().trim().max(80).optional().or(z.literal("")),
  color: z.string().trim().min(1, "El color es obligatorio.").max(80),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
});

async function uploadPhotos(
  supabase: SupabaseClient<Database>,
  ownerId: string,
  files: FormDataEntryValue[]
): Promise<string[]> {
  const urls: string[] = [];
  for (const entry of files) {
    if (!(entry instanceof File) || entry.size === 0) continue;
    const path = `${ownerId}/${crypto.randomUUID()}-${entry.name}`;
    const { error } = await supabase.storage.from("pet-photos").upload(path, entry);
    if (error) throw new Error("No se pudo subir una de las fotos.");
    const { data } = supabase.storage.from("pet-photos").getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

export async function createPet(
  prevState: PetActionState,
  formData: FormData
): Promise<PetActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const parsed = petSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  let photoUrls: string[];
  try {
    photoUrls = await uploadPhotos(supabase, user.id, formData.getAll("photos"));
  } catch {
    return { error: "No se pudieron subir las fotos. Intenta de nuevo." };
  }

  const { error } = await supabase.from("pets").insert({
    owner_id: user.id,
    name: parsed.data.name,
    species: parsed.data.species,
    breed: parsed.data.breed || null,
    color: parsed.data.color,
    description: parsed.data.description || null,
    photo_urls: photoUrls,
  });

  if (error) return { error: "No se pudo guardar la mascota. Intenta de nuevo." };

  revalidatePath("/mascotas");
  redirect("/mascotas");
}

export async function updatePet(
  petId: string,
  prevState: PetActionState,
  formData: FormData
): Promise<PetActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const parsed = petSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { data: existingPet } = await supabase
    .from("pets")
    .select("photo_urls")
    .eq("id", petId)
    .single();

  let newPhotoUrls: string[];
  try {
    newPhotoUrls = await uploadPhotos(supabase, user.id, formData.getAll("photos"));
  } catch {
    return { error: "No se pudieron subir las fotos. Intenta de nuevo." };
  }

  const { error } = await supabase
    .from("pets")
    .update({
      name: parsed.data.name,
      species: parsed.data.species,
      breed: parsed.data.breed || null,
      color: parsed.data.color,
      description: parsed.data.description || null,
      photo_urls: [...(existingPet?.photo_urls ?? []), ...newPhotoUrls],
    })
    .eq("id", petId);

  if (error) return { error: "No se pudo actualizar la mascota. Intenta de nuevo." };

  revalidatePath("/mascotas");
  redirect("/mascotas");
}

export async function deletePet(petId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("pets").delete().eq("id", petId);
  if (error) throw new Error("No se pudo borrar la mascota.");
  revalidatePath("/mascotas");
  redirect("/mascotas");
}
