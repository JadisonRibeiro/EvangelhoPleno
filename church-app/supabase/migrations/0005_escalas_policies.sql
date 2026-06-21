-- =====================================================================
-- 0005_escalas_policies.sql
-- Policies de RLS para schedule_entries (a de schedules veio na 0001).
-- Acesso herdado do ministério da escala-pai: admin/pastor ou líder do
-- ministério gerenciam as entradas.
-- =====================================================================

create index if not exists schedule_entries_schedule_id_idx
  on schedule_entries(schedule_id);

drop policy if exists "manage_schedule_entries" on schedule_entries;
create policy "manage_schedule_entries" on schedule_entries
  for all using (
    exists (
      select 1 from schedules s
      where s.id = schedule_entries.schedule_id
        and (get_my_role() in ('admin', 'pastor') or is_my_ministry(s.ministry_id))
    )
  )
  with check (
    exists (
      select 1 from schedules s
      where s.id = schedule_entries.schedule_id
        and (get_my_role() in ('admin', 'pastor') or is_my_ministry(s.ministry_id))
    )
  );
