"use client";

import { Button } from "@/components/ui/button";

export function ResolveReportButton({ action }: { action: () => Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("¿Tu mascota ya está de vuelta? El reporte se marcará como resuelto.")) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" className="w-full bg-success text-white hover:bg-success/90">
        Ya apareció — marcar como resuelto
      </Button>
    </form>
  );
}
