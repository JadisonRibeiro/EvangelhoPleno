-- =====================================================================
-- 0003_membros_desacoplar.sql
-- Desacopla `profiles` (a pessoa/membro) de `auth.users` (o login).
-- Agora um membro existe sem precisar de login; quem acessa o app tem
-- profiles.user_id preenchido. Reescreve helpers e policies de acordo,
-- e adiciona as policies de escrita que faltavam.
-- =====================================================================

-- 1) Estrutura: id passa a ser independente; user_id liga ao login (opcional)
alter table profiles drop constraint if exists profiles_id_fkey;
alter table profiles alter column id set default gen_random_uuid();
alter table profiles add column if not exists user_id uuid references auth.users(id) on delete set null;

-- user_id único (vários NULL são permitidos: membros sem login)
create unique index if not exists profiles_user_id_key on profiles(user_id);

-- Backfill: perfis criados no esquema antigo tinham id = auth.users.id
update profiles set user_id = id where user_id is null;

-- 2) Helper: id do perfil do usuário logado
create or replace function public.my_profile_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select id from public.profiles where user_id = (select auth.uid());
$$;

-- get_my_role agora resolve pelo user_id
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where user_id = (select auth.uid());
$$;

-- is_my_cell / is_my_ministry comparam com o id do PERFIL, não com auth.uid()
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
      and (leader_id = public.my_profile_id() or co_leader_id = public.my_profile_id())
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
    where id = ministry_uuid and leader_id = public.my_profile_id()
  );
$$;

revoke execute on function public.my_profile_id() from public, anon;
grant execute on function public.my_profile_id() to authenticated;

-- 3) Recriar policies de SELECT de profiles usando user_id
drop policy if exists "see_own_profile" on profiles;
create policy "see_own_profile" on profiles
  for select using (user_id = (select auth.uid()));

drop policy if exists "cell_leader_see_cell_members" on profiles;
create policy "cell_leader_see_cell_members" on profiles
  for select using (
    get_my_role() = 'cell_leader'
    and (user_id = (select auth.uid()) or is_my_cell(cell_id))
  );

drop policy if exists "ministry_leader_see_ministry_members" on profiles;
create policy "ministry_leader_see_ministry_members" on profiles
  for select using (
    get_my_role() = 'ministry_leader'
    and (
      user_id = (select auth.uid())
      or exists (
        select 1 from ministry_members mm
        join ministries m on m.id = mm.ministry_id
        where mm.profile_id = profiles.id
          and m.leader_id = my_profile_id()
      )
    )
  );

-- 4) Policies de ESCRITA em profiles: admin/pastor gerenciam membros
drop policy if exists "admin_insert_profiles" on profiles;
create policy "admin_insert_profiles" on profiles
  for insert with check (get_my_role() in ('admin', 'pastor'));

drop policy if exists "admin_update_profiles" on profiles;
create policy "admin_update_profiles" on profiles
  for update using (get_my_role() in ('admin', 'pastor'))
  with check (get_my_role() in ('admin', 'pastor'));

drop policy if exists "admin_delete_profiles" on profiles;
create policy "admin_delete_profiles" on profiles
  for delete using (get_my_role() in ('admin', 'pastor'));

-- 5) Cells: usuários autenticados leem (para selects); admin/pastor gerenciam
drop policy if exists "auth_read_cells" on cells;
create policy "auth_read_cells" on cells
  for select using ((select auth.uid()) is not null);

drop policy if exists "admin_manage_cells" on cells;
create policy "admin_manage_cells" on cells
  for all using (get_my_role() in ('admin', 'pastor'))
  with check (get_my_role() in ('admin', 'pastor'));
