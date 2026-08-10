"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/app/(auth)/actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, { error: null });

  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-sm flex-col justify-center px-6 py-10">
      <h1 className="mb-8 text-2xl font-bold text-foreground">Inicia sesión</h1>
      <form action={formAction} className="space-y-5">
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
            autoComplete="current-password"
          />
        </div>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Entrando…" : "Entrar"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link href="/signup" className="text-primary underline">
          Regístrate
        </Link>
      </p>
    </main>
  );
}
