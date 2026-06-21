-- =====================================================================
-- 0006_amar_policies.sql
-- Policies de RLS para amar_records (recepção de novos convertidos).
-- Leitura e cadastro liberados a autenticados (equipe AMAR);
-- edição por admin/pastor ou pelo responsável (assigned_to);
-- exclusão só admin/pastor.
-- =====================================================================

drop policy if exists "read_amar" on amar_records;
create policy "read_amar" on amar_records
  for select using ((select auth.uid()) is not null);

drop policy if exists "insert_amar" on amar_records;
create policy "insert_amar" on amar_records
  for insert with check ((select auth.uid()) is not null);

drop policy if exists "update_amar" on amar_records;
create policy "update_amar" on amar_records
  for update using (
    get_my_role() in ('admin', 'pastor') or assigned_to = my_profile_id()
  )
  with check (
    get_my_role() in ('admin', 'pastor') or assigned_to = my_profile_id()
  );

drop policy if exists "delete_amar" on amar_records;
create policy "delete_amar" on amar_records
  for delete using (get_my_role() in ('admin', 'pastor'));
