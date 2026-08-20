"use client";

import { Button } from "@/components/ui/button";

/**
 * La mitad "manual" del matching: la IA sugiere, el dueño decide. Se
 * muestra mientras el avistamiento no haya sido revisado.
 */
export function MatchReview({
  confirmAction,
  rejectAction,
}: {
  confirmAction: () => Promise<void>;
  rejectAction: () => Promise<void>;
}) {
  return (
    <div className="mt-3 flex gap-2">
      <form action={confirmAction}>
        <Button type="submit" size="sm" className="bg-success text-white hover:bg-success/90">
          Sí es mi mascota
        </Button>
      </form>
      <form action={rejectAction}>
        <Button type="submit" size="sm" variant="outline">
          No es
        </Button>
      </form>
    </div>
  );
}
