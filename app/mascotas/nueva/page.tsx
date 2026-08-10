import { PetForm } from "@/components/pet-form";
import { createPet } from "@/app/mascotas/actions";

export default function NuevaMascotaPage() {
  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-8 text-2xl font-bold text-foreground">Agregar mascota</h1>
      <PetForm action={createPet} submitLabel="Guardar mascota" />
    </main>
  );
}
