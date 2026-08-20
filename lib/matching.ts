import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

// Comparación de fotos con Claude vision. Igual que las notificaciones, es
// amplificación: si falla, el avistamiento ya está guardado y el dueño
// puede revisarlo a mano.

const MatchResult = z.object({
  score: z
    .number()
    .min(0)
    .max(1)
    .describe("Probabilidad de que sean el mismo animal, de 0 a 1"),
  reasoning: z
    .string()
    .describe("Una frase corta en español explicando la decisión"),
});

const SPECIES_ES: Record<string, string> = {
  dog: "perro",
  cat: "gato",
  rabbit: "conejo",
  bird: "ave",
  reptile: "reptil",
  rodent: "roedor",
  other: "otro",
};

export type PetDescription = {
  name: string;
  species?: string | null;
  breed?: string | null;
  color?: string | null;
  description?: string | null;
};

export type MatchScore = { score: number; reasoning: string };

/**
 * Compara la foto de un avistamiento contra la foto de la mascota perdida.
 * Devuelve null si no se pudo evaluar — nunca lanza.
 */
export async function scorePetMatch(args: {
  sightingPhotoUrl: string;
  petPhotoUrl: string;
  pet: PetDescription;
}): Promise<MatchScore | null> {
  try {
    const client = new Anthropic();

    const señas = [
      SPECIES_ES[args.pet.species ?? ""] ?? args.pet.species,
      args.pet.breed,
      args.pet.color,
      args.pet.description,
    ]
      .filter(Boolean)
      .join(" · ");

    const response = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 2000,
      output_config: { format: zodOutputFormat(MatchResult) },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Primera imagen: foto de referencia de una mascota perdida.\n" +
                `Datos del dueño — nombre: ${args.pet.name}` +
                (señas ? `; señas: ${señas}` : ""),
            },
            {
              type: "image",
              source: { type: "url", url: args.petPhotoUrl },
            },
            {
              type: "text",
              text: "Segunda imagen: foto tomada por un vecino que cree haber visto a esta mascota.",
            },
            {
              type: "image",
              source: { type: "url", url: args.sightingPhotoUrl },
            },
            {
              type: "text",
              text:
                "¿Son el mismo animal individual? Fíjate en marcas y manchas " +
                "particulares, proporciones, color y textura del pelaje, forma " +
                "de orejas y hocico — no solo en que sean de la misma raza.\n\n" +
                "Sé conservador: un score alto equivocado manda a un dueño " +
                "angustiado a perseguir a la mascota de alguien más, lo que " +
                "cuesta más que quedarse corto. Si la foto del vecino está " +
                "borrosa, lejana o muestra solo parte del animal, refléjalo con " +
                "un score intermedio en vez de adivinar.",
            },
          ],
        },
      ],
    });

    return response.parsed_output ?? null;
  } catch (err) {
    console.error("[match] no se pudo evaluar la coincidencia", err);
    return null;
  }
}
