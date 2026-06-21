-- =====================================================================
-- 0002_hardening_funcoes.sql — Endurece as funções SECURITY DEFINER
-- Resolve o aviso "function search path mutable" do Security Advisor e
-- restringe a execução das funções auxiliares a usuários autenticados.
-- =====================================================================

-- search_path fixo ('') + referências totalmente qualificadas (public.*, auth.*)
-- evita ataques via manipulação de search_path em funções SECURITY DEFINER.

create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = (select auth.uid());
$$;

create or replace function public.is_my_cell(cell_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.cells
    where id = cell_uuid
      and (leader_id = (select auth.uid()) or co_leader_id = (select auth.uid()))
  );
$$;

create or replace function public.is_my_ministry(ministry_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.ministries
    where id = ministry_uuid and leader_id = (select auth.uid())
  );
$$;

-- Restringe execução: remove de PUBLIC/anon, mantém apenas authenticated
-- (necessário porque as policies de RLS chamam essas funções como o usuário logado).
revoke execute on function public.get_my_role() from public, anon;
revoke execute on function public.is_my_cell(uuid) from public, anon;
revoke execute on function public.is_my_ministry(uuid) from public, anon;

grant execute on function public.get_my_role() to authenticated;
grant execute on function public.is_my_cell(uuid) to authenticated;
grant execute on function public.is_my_ministry(uuid) to authenticated;
