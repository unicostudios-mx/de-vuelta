import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PetForm } from "@/components/pet-form";
import { DeletePetButton } from "@/components/delete-pet-button";
import { updatePet, deletePet } from "@/app/mascotas/actions";

export default async function EditarMascotaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  // RLS ya restringe esto a mascotas del usuario autenticado — si no es
  // suya (o no existe), la query no regresa nada.
  const { data: pet } = await supabase.from("pets").select("*").eq("id", id).single();

  if (!pet) notFound();

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-8 text-2xl font-bold text-foreground">Editar {pet.name}</h1>
      <PetForm action={updatePet.bind(null, pet.id)} pet={pet} submitLabel="Guardar cambios" />

      <div className="mt-6">
        <DeletePetButton action={deletePet.bind(null, pet.id)} />
      </div>
    </main>
  );
}
