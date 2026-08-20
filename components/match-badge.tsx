import { cn } from "@/lib/utils";

export type MatchState = {
  confidence: number | null;
  confirmed: boolean;
  confirmedAt: string | null;
  /** Si el avistamiento traía foto. Sin ella no hay nada que comparar;
   *  con ella, un score nulo significa que el análisis falló — decir
   *  "sin foto" ahí sería mentir justo encima de la foto. */
  hasPhoto: boolean;
};

/**
 * Score de coincidencia como porcentaje. El color comunica qué tan
 * accionable es, sin pretender certeza: la IA orienta, el dueño decide.
 */
export function MatchBadge({ match }: { match: MatchState }) {
  const revisado = match.confirmedAt !== null;

  if (revisado) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white",
          match.confirmed ? "bg-success" : "bg-muted-foreground"
        )}
      >
        {match.confirmed ? "✓ Confirmado" : "Descartado"}
      </span>
    );
  }

  if (match.confidence === null) {
    return (
      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        {match.hasPhoto ? "No se pudo comparar" : "Sin foto para comparar"}
      </span>
    );
  }

  const pct = Math.round(match.confidence * 100);
  const tono =
    match.confidence >= 0.7
      ? "bg-success text-white"
      : match.confidence >= 0.4
        ? "bg-accent text-accent-foreground"
        : "bg-secondary text-muted-foreground";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tono
      )}
      title="Estimación de la IA comparando las fotos"
    >
      {pct}% de coincidencia
    </span>
  );
}
