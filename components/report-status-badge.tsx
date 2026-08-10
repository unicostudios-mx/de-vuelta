import { cn } from "@/lib/utils";

// El rojo de urgencia solo vive en el estado "Perdido" activo — usarlo en
// otros contextos desensibiliza la alerta (docs/brand.md).
const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  active: { label: "Perdido", className: "bg-destructive text-white" },
  resolved: { label: "Resuelto", className: "bg-success text-white" },
  expired: { label: "Expirado", className: "bg-muted text-muted-foreground" },
};

export function ReportStatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.expired;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        style.className
      )}
    >
      {style.label}
    </span>
  );
}
