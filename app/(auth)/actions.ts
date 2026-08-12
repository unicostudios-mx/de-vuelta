"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = { error: string | null; message?: string };

// Solo paths internos ("/x..."): evita open-redirects vía ?next=https://...
// ("//host" también es externo para los navegadores, por eso se excluye).
function safeNext(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  return value.startsWith("/") && !value.startsWith("//") ? value : null;
}

const signInSchema = z.object({
  email: z.string().trim().email("Correo inválido."),
  password: z.string().min(1, "Escribe tu contraseña."),
});

export async function signIn(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: "Correo o contraseña incorrectos." };
  }

  redirect(safeNext(formData.get("next")) ?? "/mascotas");
}

const signUpSchema = z.object({
  displayName: z.string().trim().min(2, "Escribe tu nombre.").max(80),
  email: z.string().trim().email("Correo inválido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export async function signUp(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { display_name: parsed.data.displayName } },
  });

  if (error) {
    console.error("[signUp]", error.status, error.message);
    return {
      error:
        error.message === "User already registered"
          ? "Ya existe una cuenta con ese correo."
          : "No se pudo crear la cuenta. Intenta de nuevo.",
    };
  }

  if (data.session) {
    redirect(safeNext(formData.get("next")) ?? "/mascotas");
  }

  return {
    error: null,
    message: "Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.",
  };
}
