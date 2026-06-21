-- =====================================================================
-- 0008_discipulado.sql
-- Policies para Abrigo e Escola de Discípulo (turmas + alunos) e triggers
-- que sincronizam a conclusão com a jornada espiritual do perfil.
-- Leitura por autenticados; gestão por admin/pastor.
-- =====================================================================

-- helper para criar par de policies (read + manage) — feito manualmente abaixo

-- ---- Abrigo ----
drop policy if exists "read_abrigo_classes" on abrigo_classes;
create policy "read_abrigo_classes" on abrigo_classes
  for select using ((select auth.uid()) is not null);
drop policy if exists "manage_abrigo_classes" on abrigo_classes;
create policy "manage_abrigo_classes" on abrigo_classes
  for all using (get_my_role() in ('admin', 'pastor'))
  with check (get_my_role() in ('admin', 'pastor'));

drop policy if exists "read_abrigo_attendees" on abrigo_attendees;
create policy "read_abrigo_attendees" on abrigo_attendees
  for select using ((select auth.uid()) is not null);
drop policy if exists "manage_abrigo_attendees" on abrigo_attendees;
create policy "manage_abrigo_attendees" on abrigo_attendees
  for all using (get_my_role() in ('admin', 'pastor'))
  with check (get_my_role() in ('admin', 'pastor'));

-- ---- Escola de Discípulo ----
drop policy if exists "read_escola_classes" on escola_classes;
create policy "read_escola_classes" on escola_classes
  for select using ((select auth.uid()) is not null);
drop policy if exists "manage_escola_classes" on escola_classes;
create policy "manage_escola_classes" on escola_classes
  for all using (get_my_role() in ('admin', 'pastor'))
  with check (get_my_role() in ('admin', 'pastor'));

drop policy if exists "read_escola_attendees" on escola_attendees;
create policy "read_escola_attendees" on escola_attendees
  for select using ((select auth.uid()) is not null);
drop policy if exists "manage_escola_attendees" on escola_attendees;
create policy "manage_escola_attendees" on escola_attendees
  for all using (get_my_role() in ('admin', 'pastor'))
  with check (get_my_role() in ('admin', 'pastor'));

-- ---- Triggers: conclusão sincroniza a jornada no perfil ----
create or replace function public.sync_abrigo_conclusao()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.completed then
    update public.profiles
      set completed_abrigo = true,
          abrigo_completed_at = coalesce(new.completed_at, current_date)
      where id = new.profile_id;
  end if;
  return new;
end; $$;

drop trigger if exists trg_abrigo_conclusao on abrigo_attendees;
create trigger trg_abrigo_conclusao
  after insert or update on abrigo_attendees
  for each row execute function public.sync_abrigo_conclusao();

create or replace function public.sync_escola_conclusao()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.completed then
    update public.profiles
      set completed_escola_discipulo = true,
          escola_completed_at = coalesce(new.completed_at, current_date)
      where id = new.profile_id;
  end if;
  return new;
end; $$;

drop trigger if exists trg_escola_conclusao on escola_attendees;
create trigger trg_escola_conclusao
  after insert or update on escola_attendees
  for each row execute function public.sync_escola_conclusao();
