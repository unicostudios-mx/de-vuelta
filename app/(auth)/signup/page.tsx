"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/app/(auth)/actions";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUp, { error: null });

  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-sm flex-col justify-center px-6 py-10">
      <h1 className="mb-8 text-2xl font-bold text-foreground">Crea tu cuenta</h1>

      {state.message ? (
        <p className="text-sm text-foreground">{state.message}</p>
      ) : (
        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="displayName">Nombre</Label>
            <Input id="displayName" name="displayName" required autoComplete="name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Creando cuenta…" : "Crear cuenta"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-primary underline">
          Inicia sesión
        </Link>
      </p>
    </main>
  );
}
