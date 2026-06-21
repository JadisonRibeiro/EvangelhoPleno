-- =====================================================================
-- 0004_ministerios_policies.sql
-- Policies de RLS para ministries e ministry_members.
-- Admin/pastor gerenciam tudo; líder de ministério gerencia os membros
-- do próprio ministério. Leitura liberada para autenticados.
-- =====================================================================

-- ministries
drop policy if exists "auth_read_ministries" on ministries;
create policy "auth_read_ministries" on ministries
  for select using ((select auth.uid()) is not null);

drop policy if exists "admin_manage_ministries" on ministries;
create policy "admin_manage_ministries" on ministries
  for all using (get_my_role() in ('admin', 'pastor'))
  with check (get_my_role() in ('admin', 'pastor'));

-- ministry_members
drop policy if exists "read_ministry_members" on ministry_members;
create policy "read_ministry_members" on ministry_members
  for select using ((select auth.uid()) is not null);

drop policy if exists "manage_ministry_members" on ministry_members;
create policy "manage_ministry_members" on ministry_members
  for all using (
    get_my_role() in ('admin', 'pastor') or is_my_ministry(ministry_id)
  )
  with check (
    get_my_role() in ('admin', 'pastor') or is_my_ministry(ministry_id)
  );
