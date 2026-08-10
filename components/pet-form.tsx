"use client";

import Image from "next/image";
import { useActionState } from "react";
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
import type { PetActionState } from "@/app/mascotas/actions";
import type { Database } from "@/types/database";

type Pet = Database["public"]["Tables"]["pets"]["Row"];

const SPECIES_OPTIONS = [
  { value: "dog", label: "Perro" },
  { value: "cat", label: "Gato" },
  { value: "rabbit", label: "Conejo" },
  { value: "bird", label: "Ave" },
  { value: "reptile", label: "Reptil" },
  { value: "rodent", label: "Roedor" },
  { value: "other", label: "Otro" },
];

export function PetForm({
  action,
  pet,
  submitLabel,
}: {
  action: (prevState: PetActionState, formData: FormData) => Promise<PetActionState>;
  pet?: Pet;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" defaultValue={pet?.name} required maxLength={80} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="species">Especie</Label>
        <Select name="species" defaultValue={pet?.species ?? "dog"} required>
          <SelectTrigger id="species" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SPECIES_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="breed">Raza (opcional)</Label>
        <Input id="breed" name="breed" defaultValue={pet?.breed ?? ""} maxLength={80} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <Input id="color" name="color" defaultValue={pet?.color} required maxLength={80} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={pet?.description ?? ""}
          maxLength={1000}
          rows={4}
        />
      </div>

      {pet && pet.photo_urls.length > 0 && (
        <div className="space-y-2">
          <Label>Fotos actuales</Label>
          <div className="flex flex-wrap gap-2">
            {pet.photo_urls.map((url) => (
              <Image
                key={url}
                src={url}
                alt=""
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="photos">
          {pet ? "Agregar más fotos (opcional)" : "Fotos (opcional)"}
        </Label>
        <Input id="photos" name="photos" type="file" accept="image/*" multiple />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Guardando…" : submitLabel}
      </Button>
    </form>
  );
}
