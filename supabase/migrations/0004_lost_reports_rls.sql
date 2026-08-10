-- ============================================================
-- De Vuelta — RLS para reportes de pérdida (Fase 3)
-- Versión: 0004
-- Ejecutar con: supabase db push  (NO ejecutar manualmente)
-- ============================================================

-- Fase 3 es solo el lado del dueño: crear, ver y gestionar SUS reportes.
-- La visibilidad pública (vecinos, con ubicación aproximada) se diseña en
-- Fase 4 junto con los avistamientos — ahí se agregará la policy de
-- lectura pública correspondiente.

-- El dueño solo puede reportar como perdida una mascota SUYA: además de
-- fijar reporter_id a su propio uid, el pet_id debe pertenecerle. RLS de
-- pets no aplica dentro de esta subquery de policy (corre como el rol de
-- la tabla), así que el exists es la verificación real de propiedad.
create policy "lost_reports_insert_own_pet"
  on public.lost_reports for insert
  to authenticated
  with check (
    reporter_id = auth.uid()
    and exists (
      select 1 from public.pets
      where pets.id = pet_id
        and pets.owner_id = auth.uid()
    )
  );

create policy "lost_reports_select_own"
  on public.lost_reports for select
  to authenticated
  using (reporter_id = auth.uid());

-- update: marcar resuelto / editar notas. with check impide reasignar
-- el reporte a otro usuario.
create policy "lost_reports_update_own"
  on public.lost_reports for update
  to authenticated
  using (reporter_id = auth.uid())
  with check (reporter_id = auth.uid());

-- Sin policy de delete a propósito: un reporte se resuelve o expira, no
-- se borra — el historial alimenta la "historia continua del animal"
-- (Fase 7).
