-- ============================================================
-- De Vuelta — RLS de matches (Fase 6)
-- Versión: 0006
-- Ejecutar con: supabase db push  (NO ejecutar manualmente)
-- ============================================================

-- Los tres estados de revisión se representan con las columnas que ya
-- existen (regla de migraciones inmutables — no se agregan columnas):
--   pendiente  → confirmed_at IS NULL
--   confirmado → confirmed = true,  confirmed_at puesto
--   descartado → confirmed = false, confirmed_at puesto

-- Solo el dueño del reporte ve los scores de sus avistamientos. El vecino
-- que reportó NO los ve: saber qué tan "creíble" luce su aviso no le
-- corresponde y podría invitar a inflarlo.
create policy "matches_select_report_owner"
  on public.matches for select
  to authenticated
  using (
    exists (
      select 1 from public.lost_reports lr
      where lr.id = report_id
        and lr.reporter_id = auth.uid()
    )
  );

-- Confirmar o descartar. with check repite la condición para que el update
-- no pueda reasignar la fila al reporte de otra persona.
create policy "matches_update_report_owner"
  on public.matches for update
  to authenticated
  using (
    exists (
      select 1 from public.lost_reports lr
      where lr.id = report_id
        and lr.reporter_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.lost_reports lr
      where lr.id = report_id
        and lr.reporter_id = auth.uid()
    )
  );

-- Sin insert ni delete a propósito: las filas las crea el servidor con el
-- service role al llegar el avistamiento. Si un usuario pudiera insertar,
-- podría fabricarse una coincidencia con el score que quisiera.
