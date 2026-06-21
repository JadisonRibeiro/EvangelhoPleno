-- =====================================================================
-- 0001_init.sql — Schema inicial do App Igreja
-- Baseado em church-app-spec.md (seções 4 e 5)
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- profiles (membros)
-- cell_id referencia cells(id); a FK é adicionada após criar `cells`
-- para evitar dependência circular.
-- ---------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  phone text,
  city text,
  birth_date date,
  photo_url text,

  -- jornada espiritual
  cell_id uuid,
  is_baptized boolean default false,
  baptism_date date,
  completed_abrigo boolean default false,
  abrigo_completed_at date,
  completed_escola_discipulo boolean default false,
  escola_completed_at date,
  did_encontro_com_deus boolean default false,
  encontro_date date,

  -- role e metadados
  role text not null default 'member'
    check (role in ('admin', 'pastor', 'cell_leader', 'ministry_leader', 'member')),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index on profiles(cell_id);
create index on profiles(role);

-- ---------------------------------------------------------------------
-- cells (células)
-- ---------------------------------------------------------------------
create table cells (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  leader_id uuid references profiles(id),
  co_leader_id uuid references profiles(id),
  meeting_day text,
  meeting_time time,
  address text,
  neighborhood text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- FK adiada de profiles.cell_id -> cells.id
alter table profiles
  add constraint profiles_cell_id_fkey
  foreign key (cell_id) references cells(id);

-- ---------------------------------------------------------------------
-- cell_reports (relatórios semanais) + conversões
-- ---------------------------------------------------------------------
create table cell_reports (
  id uuid primary key default gen_random_uuid(),
  cell_id uuid not null references cells(id),
  reported_by uuid not null references profiles(id),
  meeting_date date not null,
  total_members int default 0,
  total_visitors int default 0,
  had_conversions boolean default false,
  created_at timestamptz default now()
);

create table cell_report_conversions (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references cell_reports(id) on delete cascade,
  person_name text not null,
  person_phone text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- ministries (ministérios) + membros
-- ---------------------------------------------------------------------
create table ministries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  leader_id uuid references profiles(id),
  requires_schedule boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table ministry_members (
  id uuid primary key default gen_random_uuid(),
  ministry_id uuid not null references ministries(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  is_couple_pair boolean default false,
  couple_partner_id uuid references profiles(id),
  joined_at date default current_date,
  is_active boolean default true,
  unique(ministry_id, profile_id)
);

-- ---------------------------------------------------------------------
-- schedules (escalas mensais) + entradas
-- ---------------------------------------------------------------------
create table schedules (
  id uuid primary key default gen_random_uuid(),
  ministry_id uuid not null references ministries(id),
  month int not null check (month between 1 and 12),
  year int not null,
  generated_by uuid references profiles(id),
  notes text,
  created_at timestamptz default now(),
  unique(ministry_id, month, year)
);

create table schedule_entries (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid not null references schedules(id) on delete cascade,
  date date not null,
  profile_id uuid not null references profiles(id),
  couple_partner_id uuid references profiles(id),
  role_in_service text,
  confirmed boolean default null
);

-- ---------------------------------------------------------------------
-- amar_records (ministério de acolhimento)
-- ---------------------------------------------------------------------
create table amar_records (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  birth_date date,

  was_invited boolean default false,
  invited_by_name text,
  invited_by_profile_id uuid references profiles(id),

  has_been_in_cell boolean default false,
  cell_interest boolean default false,
  preferred_neighborhood text,
  prayer_requests text,

  conversion_source text check (conversion_source in ('culto', 'celula', 'evento', 'outro')),
  conversion_date date,
  service_date date,

  assigned_to uuid references profiles(id),
  status text default 'novo' check (status in ('novo', 'em_contato', 'em_celula', 'inativo')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- Abrigo e Escola de Discípulo
-- ---------------------------------------------------------------------
create table abrigo_classes (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date date,
  is_open boolean default true,
  total_lessons int default 10,
  created_at timestamptz default now()
);

create table abrigo_attendees (
  class_id uuid references abrigo_classes(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  lessons_completed int default 0,
  completed boolean default false,
  completed_at date,
  primary key (class_id, profile_id)
);

create table escola_classes (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date date,
  is_open boolean default true,
  encontro_reference date,
  total_lessons int default 15,
  created_at timestamptz default now()
);

create table escola_attendees (
  class_id uuid references escola_classes(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  lessons_completed int default 0,
  completed boolean default false,
  completed_at date,
  primary key (class_id, profile_id)
);

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table profiles enable row level security;
alter table cells enable row level security;
alter table cell_reports enable row level security;
alter table cell_report_conversions enable row level security;
alter table ministries enable row level security;
alter table ministry_members enable row level security;
alter table schedules enable row level security;
alter table schedule_entries enable row level security;
alter table amar_records enable row level security;
alter table abrigo_classes enable row level security;
alter table abrigo_attendees enable row level security;
alter table escola_classes enable row level security;
alter table escola_attendees enable row level security;

-- Helper: role do usuário logado
create or replace function get_my_role()
returns text as $$
  select role from profiles where id = auth.uid();
$$ language sql security definer;

-- Helper: é líder/co-líder de uma célula?
create or replace function is_my_cell(cell_uuid uuid)
returns boolean as $$
  select exists (
    select 1 from cells
    where id = cell_uuid
    and (leader_id = auth.uid() or co_leader_id = auth.uid())
  );
$$ language sql security definer;

-- Helper: é líder de um ministério?
create or replace function is_my_ministry(ministry_uuid uuid)
returns boolean as $$
  select exists (
    select 1 from ministries
    where id = ministry_uuid and leader_id = auth.uid()
  );
$$ language sql security definer;

-- ---- POLICIES: profiles ----
create policy "admin_see_all_profiles" on profiles
  for select using (get_my_role() in ('admin', 'pastor'));

create policy "cell_leader_see_cell_members" on profiles
  for select using (
    get_my_role() = 'cell_leader'
    and (id = auth.uid() or is_my_cell(cell_id))
  );

create policy "ministry_leader_see_ministry_members" on profiles
  for select using (
    get_my_role() = 'ministry_leader'
    and (
      id = auth.uid()
      or exists (
        select 1 from ministry_members mm
        join ministries m on m.id = mm.ministry_id
        where mm.profile_id = profiles.id
        and m.leader_id = auth.uid()
      )
    )
  );

create policy "see_own_profile" on profiles
  for select using (id = auth.uid());

-- ---- POLICIES: cell_reports ----
create policy "cell_leader_reports" on cell_reports
  for all using (
    get_my_role() in ('admin', 'pastor')
    or (get_my_role() = 'cell_leader' and is_my_cell(cell_id))
  );

-- ---- POLICIES: schedules ----
create policy "ministry_leader_schedules" on schedules
  for all using (
    get_my_role() in ('admin', 'pastor')
    or is_my_ministry(ministry_id)
  );
