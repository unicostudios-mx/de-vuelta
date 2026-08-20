import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

const UNA_HORA_MS = 60 * 60 * 1000;

/**
 * Techo duro de avistamientos por vecino y por hora. Está puesto alto a
 * propósito: el peor caso legítimo que se me ocurre es alguien siguiendo a
 * un animal por la calle y reportando cada pocos minutos, y eso ni se
 * acerca. Pasado este número ya no es un vecino ayudando.
 */
const MAX_AVISOS_POR_HORA = 20;

/**
 * Techo de análisis de IA por vecino y por hora. Es mucho más bajo que el
 * anterior porque cada análisis cuesta dinero real (~$0.01) y porque
 * quedarse sin score no le quita nada al vecino: su aviso llega igual y el
 * dueño lo revisa a mano. Preferimos degradar el lujo antes que bloquear
 * la función.
 */
const MAX_ANALISIS_POR_HORA = 8;

/**
 * Techo de análisis por reporte y por hora. El límite por usuario no cubre
 * varias cuentas apuntándole al mismo reporte, que es como se drenaría el
 * crédito a propósito.
 */
const MAX_ANALISIS_POR_REPORTE_POR_HORA = 25;

const haceUnaHora = () => new Date(Date.now() - UNA_HORA_MS).toISOString();

/**
 * Corre en el camino crítico del vecino, antes de subir la foto — así un
 * abusador tampoco nos llena el Storage. Usa el cliente del usuario: RLS ya
 * lo limita a sus propios avistamientos, no hace falta service role.
 *
 * Si la consulta falla, deja pasar el aviso. Un error de infraestructura
 * nuestro no debería costarle a alguien que está tratando de ayudar.
 */
export async function puedeMandarAviso(
  supabase: Client,
  spotterId: string
): Promise<boolean> {
  const { count, error } = await supabase
    .from("sightings")
    .select("*", { count: "exact", head: true })
    .eq("spotter_id", spotterId)
    .gte("created_at", haceUnaHora());

  if (error || count === null) return true;
  return count < MAX_AVISOS_POR_HORA;
}

/**
 * Corre dentro de `after()`, ya fuera del camino crítico. Devuelve false
 * solo para saltarse la llamada a la IA: la fila de `matches` se crea de
 * todos modos y el dueño conserva la revisión manual.
 *
 * Aquí sí conviene el admin client: el conteo por reporte cruza reportes
 * ajenos al vecino, que RLS le esconde con razón.
 */
export async function puedeAnalizarFoto(
  admin: Client,
  args: { spotterId: string; reportId: string }
): Promise<boolean> {
  const desde = haceUnaHora();

  const [porUsuario, porReporte] = await Promise.all([
    admin
      .from("sightings")
      .select("id, matches!inner(id)", { count: "exact", head: true })
      .eq("spotter_id", args.spotterId)
      .gte("created_at", desde)
      .not("matches.confidence", "is", null),
    admin
      .from("matches")
      .select("*", { count: "exact", head: true })
      .eq("report_id", args.reportId)
      .gte("created_at", desde)
      .not("confidence", "is", null),
  ]);

  // A diferencia del límite anterior, aquí un error se resuelve en contra:
  // lo que está en juego es el crédito de la API, no el aviso del vecino.
  if (porUsuario.error || porReporte.error) return false;

  return (
    (porUsuario.count ?? 0) < MAX_ANALISIS_POR_HORA &&
    (porReporte.count ?? 0) < MAX_ANALISIS_POR_REPORTE_POR_HORA
  );
}
