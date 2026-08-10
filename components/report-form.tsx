"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationPicker } from "@/components/location-picker";
import { createReport } from "@/app/reportes/actions";

type PetOption = { id: string; name: string };

// datetime-local trabaja en hora local del navegador; el hidden manda el
// instante real en ISO/UTC para que el servidor no dependa de su zona
// horaria (Vercel corre en UTC, el usuario está en CDMX).
function toLocalInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ReportForm({
  pets,
  defaultPetId,
}: {
  pets: PetOption[];
  defaultPetId?: string;
}) {
  const [state, formAction, pending] = useActionState(createReport, {
    error: null,
  });
  const [lastSeenLocal, setLastSeenLocal] = useState("");

  // Default "ahora": se fija en el cliente para no ensuciar la hidratación
  // con un new Date() distinto entre servidor y navegador.
  useEffect(() => {
    setLastSeenLocal(toLocalInputValue(new Date()));
  }, []);

  const preselected =
    defaultPetId && pets.some((p) => p.id === defaultPetId)
      ? defaultPetId
      : pets[0]?.id;

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="petId">¿Qué mascota se perdió?</Label>
        <Select name="petId" defaultValue={preselected} required>
          <SelectTrigger id="petId" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pets.map((pet) => (
              <SelectItem key={pet.id} value={pet.id}>
                {pet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>¿Dónde fue vista por última vez?</Label>
        <LocationPicker />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastSeenLocal">¿Cuándo la viste por última vez?</Label>
        <Input
          id="lastSeenLocal"
          type="datetime-local"
          value={lastSeenLocal}
          max={toLocalInputValue(new Date())}
          onChange={(e) => setLastSeenLocal(e.target.value)}
          required
        />
        <input
          type="hidden"
          name="lastSeenAt"
          value={lastSeenLocal ? new Date(lastSeenLocal).toISOString() : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Señas o detalles útiles (opcional)</Label>
        <Textarea
          id="notes"
          name="notes"
          maxLength={1000}
          rows={3}
          placeholder="Traía collar rojo, es miedosa con extraños…"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reward">Recompensa en MXN (opcional)</Label>
        <Input id="reward" name="reward" type="number" min={0} step="0.01" />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} variant="destructive" className="w-full">
        {pending ? "Publicando reporte…" : "Reportar como perdida"}
      </Button>
    </form>
  );
}
