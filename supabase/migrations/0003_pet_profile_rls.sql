-- ============================================================
-- De Vuelta — RLS real para perfil de mascota (Fase 2)
-- Versión: 0003
-- Ejecutar con: supabase db push  (NO ejecutar manualmente)
-- ============================================================

-- ============================================================
-- TRIGGER: crear fila en public.users al registrarse
--
-- auth.users vive fuera del schema public y no lo tocamos
-- directamente; este trigger sincroniza el perfil mínimo
-- (display_name viene de options.data en supabase.auth.signUp).
-- security definer: corre con permisos del dueño de la función,
-- así puede insertar en public.users aunque el RLS de esa tabla
-- niegue todo a la sesión del usuario recién creado.
-- ============================================================
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- RLS: public.users
-- Cada quien lee y edita solo su propia fila. Sin policy de
-- lectura pública todavía (llega en Fase 7, feed comunitario).
-- ============================================================
create policy "users_select_own"
  on public.users for select
  to authenticated
  using (auth.uid() = id);

create policy "users_update_own"
  on public.users for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================
-- RLS: public.pets
-- Cada quien gestiona solo las mascotas de las que es owner.
-- ============================================================
create policy "pets_select_own"
  on public.pets for select
  to authenticated
  using (auth.uid() = owner_id);

create policy "pets_insert_own"
  on public.pets for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "pets_update_own"
  on public.pets for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "pets_delete_own"
  on public.pets for delete
  to authenticated
  using (auth.uid() = owner_id);

-- ============================================================
-- STORAGE: bucket pet-photos
-- Público para lectura (las fotos no son sensibles); solo el
-- dueño puede subir/borrar dentro de su propia carpeta
-- ({owner_id}/{archivo}).
-- ============================================================
insert into storage.buckets (id, name, public)
values ('pet-photos', 'pet-photos', true);

create policy "pet_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'pet-photos');

create policy "pet_photos_owner_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'pet-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "pet_photos_owner_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'pet-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
