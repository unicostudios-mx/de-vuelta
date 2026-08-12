"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LocationPicker } from "@/components/location-picker";
import type { SightingActionState } from "@/app/perdidos/actions";

// Mismo patrón que report-form: datetime-local en hora local del navegador,
// hidden con el instante ISO/UTC para que el server no dependa de su zona.
function toLocalInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function SightingForm({
  action,
}: {
  action: (prevState: SightingActionState, formData: FormData) => Promise<SightingActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });
  const [spottedLocal, setSpottedLocal] = useState("");

  useEffect(() => {
    setSpottedLocal(toLocalInputValue(new Date()));
  }, []);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label>¿Dónde la viste?</Label>
        <LocationPicker />
      </div>

      <div className="space-y-2">
        <Label htmlFor="spottedLocal">¿Cuándo?</Label>
        <Input
          id="spottedLocal"
          type="datetime-local"
          value={spottedLocal}
          max={toLocalInputValue(new Date())}
          onChange={(e) => setSpottedLocal(e.target.value)}
          required
        />
        <input
          type="hidden"
          name="spottedAt"
          value={spottedLocal ? new Date(spottedLocal).toISOString() : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">Foto (opcional, ayuda mucho)</Label>
        <Input id="photo" name="photo" type="file" accept="image/*" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">¿Algo más que el dueño deba saber? (opcional)</Label>
        <Textarea
          id="notes"
          name="notes"
          maxLength={1000}
          rows={3}
          placeholder="Iba caminando hacia el parque, se veía asustado…"
        />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enviando aviso…" : "Enviar aviso al dueño"}
      </Button>
    </form>
  );
}
