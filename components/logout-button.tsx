"use client";

import OneSignal from "react-onesignal";
import { Button } from "@/components/ui/button";

// Desliga la suscripción push del usuario (best-effort) antes de cerrar
// la sesión de Supabase — evita que un dispositivo compartido siga
// recibiendo pushes dirigidos al usuario anterior.
export function LogoutButton() {
  return (
    <form
      action="/logout"
      method="post"
      onSubmit={() => {
        try {
          void OneSignal.logout();
        } catch {
          // Sin SDK inicializado (p. ej. permiso denegado) no hay nada que desligar.
        }
      }}
    >
      <Button type="submit" variant="ghost" size="sm">
        Salir
      </Button>
    </form>
  );
}
