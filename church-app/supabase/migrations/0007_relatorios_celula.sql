-- =====================================================================
-- 0007_relatorios_celula.sql
-- RLS de cell_report_conversions (herdada do relatório-pai) e trigger
-- que cria automaticamente um registro no AMAR a cada conversão
-- (spec 6.2: conversões viram novos acompanhamentos).
-- =====================================================================

create index if not exists cell_report_conversions_report_id_idx
  on cell_report_conversions(report_id);

-- Acesso às conversões = acesso ao relatório (célula) ao qual pertencem
drop policy if exists "manage_cell_report_conversions" on cell_report_conversions;
create policy "manage_cell_report_conversions" on cell_report_conversions
  for all using (
    exists (
      select 1 from cell_reports r
      where r.id = cell_report_conversions.report_id
        and (
          get_my_role() in ('admin', 'pastor')
          or (get_my_role() = 'cell_leader' and is_my_cell(r.cell_id))
        )
    )
  )
  with check (
    exists (
      select 1 from cell_reports r
      where r.id = cell_report_conversions.report_id
        and (
          get_my_role() in ('admin', 'pastor')
          or (get_my_role() = 'cell_leader' and is_my_cell(r.cell_id))
        )
    )
  );

-- Trigger: cada conversão registrada cria um novo no AMAR (origem célula)
create or replace function public.criar_amar_de_conversao()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.amar_records (full_name, phone, conversion_source, status)
  values (new.person_name, new.person_phone, 'celula', 'novo');
  return new;
end;
$$;

drop trigger if exists trg_conversao_para_amar on cell_report_conversions;
create trigger trg_conversao_para_amar
  after insert on cell_report_conversions
  for each row execute function public.criar_amar_de_conversao();
