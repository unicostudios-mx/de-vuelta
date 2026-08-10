"use client";

import { Button } from "@/components/ui/button";

export function DeletePetButton({ action }: { action: () => Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (
          !confirm(
            "¿Seguro que quieres eliminar esta mascota? Esta acción no se puede deshacer."
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="destructive" className="w-full">
        Eliminar mascota
      </Button>
    </form>
  );
}
