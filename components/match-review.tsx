"use client";

import { Button } from "@/components/ui/button";

/**
 * La mitad "manual" del matching: la IA sugiere, el dueño decide. Se
 * muestra mientras el avistamiento no haya sido revisado.
 */
export function MatchReview({
  confirmAction,
  rejectAction,
  reviewed = false,
}: {
  confirmAction: () => Promise<void>;
  rejectAction: () => Promise<void>;
  /** Ya revisado: los botones siguen visibles para poder corregir. Un dueño
   *  angustiado que le atina al botón equivocado no debería quedarse sin
   *  salida, y RLS permite el cambio de todas formas. */
  reviewed?: boolean;
}) {
  return (
    <div className="mt-3 flex items-center gap-2">
      {reviewed && (
        <span className="text-xs text-muted-foreground">¿Te equivocaste?</span>
      )}
      <form action={confirmAction}>
        <Button
          type="submit"
          size="sm"
          variant={reviewed ? "outline" : "default"}
          className={reviewed ? undefined : "bg-success text-white hover:bg-success/90"}
        >
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
