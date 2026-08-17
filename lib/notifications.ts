import "server-only";

import { serverEnv } from "@/lib/env";

// Envíos push vía OneSignal. Todo aquí es fire-and-forget: una falla de
// notificación jamás debe tumbar la creación de un reporte o avistamiento
// (el flujo crítico es la base de datos, el push es amplificación).

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const SITE_URL = "https://de-vuelta.vercel.app";

type PushPayload = {
  headings: string;
  contents: string;
  url: string;
  target:
    | { included_segments: string[] }
    | { include_aliases: { external_id: string[] }; target_channel: "push" };
};

async function sendPush(payload: PushPayload): Promise<void> {
  try {
    const res = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        Authorization: `Key ${serverEnv.onesignalRestApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        headings: { en: payload.headings, es: payload.headings },
        contents: { en: payload.contents, es: payload.contents },
        url: payload.url,
        ...payload.target,
      }),
    });
    const body = await res.json();
    if (!res.ok || body.errors) {
      console.error("[push] OneSignal respondió", res.status, body);
    } else {
      console.log("[push] enviado", body.id || "(sin destinatarios aún)");
    }
  } catch (err) {
    console.error("[push] fallo de red hacia OneSignal", err);
  }
}

/** Broadcast a todo BJ suscrito cuando se publica un reporte nuevo. */
export async function notifyNewReport(args: {
  reportId: string;
  petName: string;
  species?: string | null;
  color?: string | null;
}): Promise<void> {
  const señas = [args.species, args.color].filter(Boolean).join(", ");
  await sendPush({
    headings: "🔴 Mascota perdida cerca de ti",
    contents: `${args.petName}${señas ? ` (${señas})` : ""} se perdió en Benito Juárez. Si la ves, avisa.`,
    url: `${SITE_URL}/perdidos/${args.reportId}`,
    target: { included_segments: ["Total Subscriptions"] },
  });
}

/** Aviso dirigido al dueño del reporte cuando llega un avistamiento. */
export async function notifySightingToOwner(args: {
  ownerId: string;
  reportId: string;
  petName: string;
}): Promise<void> {
  await sendPush({
    headings: `👀 Alguien vio a ${args.petName}`,
    contents: "Un vecino reportó un avistamiento. Ve la ubicación exacta ahora.",
    url: `${SITE_URL}/reportes/${args.reportId}`,
    target: {
      include_aliases: { external_id: [args.ownerId] },
      target_channel: "push",
    },
  });
}
