# Igreja App — Especificação Técnica Completa

> Documento de referência para desenvolvimento com Claude Code  
> Stack: Next.js + Supabase + Tailwind CSS + React Native (Expo)

---

## 1. Visão Geral

Aplicativo de gestão completa para igreja baseada em células, com foco em:
- Acompanhamento da jornada espiritual do membro
- Gestão de células e relatórios semanais
- Controle de ministérios e geração de escalas mensais
- Recepção de novos convertidos (Ministério AMAR)

**Usuários:** máx. 150 (TI, Pastores, Líderes de Célula, Líderes de Ministério)  
**Plataformas:** Web (PWA) + App mobile (Expo/React Native)

---

## 2. Stack Técnica

| Camada | Tecnologia |
|---|---|
| Frontend Web | Next.js 14 (App Router) |
| Mobile | Expo (React Native) — compartilha lógica com web |
| UI | Tailwind CSS + shadcn/ui |
| Backend / DB | Supabase (PostgreSQL + Auth + RLS + Storage) |
| Auth | Supabase Auth (email/password) |
| State Management | Zustand ou React Query (TanStack Query) |
| Formulários | React Hook Form + Zod |
| Escalas | Algoritmo customizado (TypeScript) |

---

## 3. Estrutura de Pastas (Monorepo)

```
church-app/
├── apps/
│   ├── web/                    # Next.js
│   │   ├── app/
│   │   │   ├── (auth)/         # login, recuperar senha
│   │   │   ├── (dashboard)/    # área autenticada
│   │   │   │   ├── membros/
│   │   │   │   ├── celulas/
│   │   │   │   ├── ministerios/
│   │   │   │   ├── escalas/
│   │   │   │   ├── amar/
│   │   │   │   └── dashboard/
│   │   └── components/
│   └── mobile/                 # Expo
│       └── app/
│           └── (tabs)/
├── packages/
│   ├── supabase/               # client, types gerados
│   ├── ui/                     # componentes compartilhados
│   └── lib/                    # utils, validações, algoritmos
└── supabase/
    ├── migrations/
    └── seed.sql
```

---

## 4. Banco de Dados — Supabase (PostgreSQL)

### 4.1 Tabela: `profiles` (membros)

```sql
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  phone text,
  city text,
  birth_date date,
  photo_url text,

  -- jornada espiritual
  cell_id uuid references cells(id),
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

-- Índices
create index on profiles(cell_id);
create index on profiles(role);
```

### 4.2 Tabela: `cells` (células)

```sql
create table cells (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  leader_id uuid references profiles(id),
  co_leader_id uuid references profiles(id),
  meeting_day text, -- 'segunda', 'terça', etc.
  meeting_time time,
  address text,
  neighborhood text,
  is_active boolean default true,
  created_at timestamptz default now()
);
```

### 4.3 Tabela: `cell_reports` (relatórios semanais)

```sql
create table cell_reports (
  id uuid primary key default gen_random_uuid(),
  cell_id uuid not null references cells(id),
  reported_by uuid not null references profiles(id),
  meeting_date date not null,
  total_members int default 0,
  total_visitors int default 0,

  -- conversões
  had_conversions boolean default false,

  created_at timestamptz default now()
);

-- Tabela separada para dados de cada convertido no relatório
create table cell_report_conversions (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references cell_reports(id) on delete cascade,
  person_name text not null,
  person_phone text,
  created_at timestamptz default now()
);
```

### 4.4 Tabela: `ministries` (ministérios)

```sql
create table ministries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  leader_id uuid references profiles(id),
  requires_schedule boolean default false, -- se gera escala mensal
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Membros de ministério (um membro pode estar em múltiplos)
create table ministry_members (
  id uuid primary key default gen_random_uuid(),
  ministry_id uuid not null references ministries(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  is_couple_pair boolean default false, -- serve em casal?
  couple_partner_id uuid references profiles(id), -- parceiro do casal
  joined_at date default current_date,
  is_active boolean default true,
  unique(ministry_id, profile_id)
);
```

### 4.5 Tabela: `schedules` (escalas mensais)

```sql
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
  couple_partner_id uuid references profiles(id), -- se serve junto ao casal
  role_in_service text, -- ex: 'vocal', 'bateria', 'recepção'
  confirmed boolean default null -- null=aguardando, true=confirmado, false=recusou
);
```

### 4.6 Tabela: `amar_records` (ministério de acolhimento)

```sql
create table amar_records (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  birth_date date,

  -- informações de contato
  was_invited boolean default false,
  invited_by_name text,
  invited_by_profile_id uuid references profiles(id),

  -- jornada inicial
  has_been_in_cell boolean default false,
  cell_interest boolean default false, -- tem interesse em entrar em célula?
  preferred_neighborhood text,
  prayer_requests text,

  -- conversão (de onde veio)
  conversion_source text check (conversion_source in ('culto', 'celula', 'evento', 'outro')),
  conversion_date date,
  service_date date, -- data do culto/evento

  -- acompanhamento
  assigned_to uuid references profiles(id), -- responsável pelo acompanhamento
  status text default 'novo' check (status in ('novo', 'em_contato', 'em_celula', 'inativo')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 4.7 Tabela: `abrigo_classes` e `escola_classes`

```sql
-- Turmas do Abrigo
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

-- Turmas da Escola de Discípulo
create table escola_classes (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date date,
  is_open boolean default true, -- abertura após Encontro com Deus
  encontro_reference date, -- data do Encontro que abriu a turma
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
```

---

## 5. Row Level Security (RLS) — Regras de Acesso

```sql
-- Habilitar RLS em todas as tabelas
alter table profiles enable row level security;
alter table cells enable row level security;
alter table cell_reports enable row level security;
alter table ministries enable row level security;
alter table ministry_members enable row level security;
alter table schedules enable row level security;
alter table amar_records enable row level security;

-- Helper function: pega o role do usuário logado
create or replace function get_my_role()
returns text as $$
  select role from profiles where id = auth.uid();
$$ language sql security definer;

-- Helper: verifica se o usuário é líder de uma célula
create or replace function is_my_cell(cell_uuid uuid)
returns boolean as $$
  select exists (
    select 1 from cells
    where id = cell_uuid
    and (leader_id = auth.uid() or co_leader_id = auth.uid())
  );
$$ language sql security definer;

-- Helper: verifica se é líder de um ministério
create or replace function is_my_ministry(ministry_uuid uuid)
returns boolean as $$
  select exists (
    select 1 from ministries
    where id = ministry_uuid and leader_id = auth.uid()
  );
$$ language sql security definer;

-- POLICIES: profiles
-- Admin/Pastor vê todos
create policy "admin_see_all_profiles" on profiles
  for select using (get_my_role() in ('admin', 'pastor'));

-- Líder de célula vê membros da sua célula
create policy "cell_leader_see_cell_members" on profiles
  for select using (
    get_my_role() = 'cell_leader'
    and (id = auth.uid() or is_my_cell(cell_id))
  );

-- Líder de ministério vê membros do seu ministério
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

-- Cada usuário vê o próprio perfil
create policy "see_own_profile" on profiles
  for select using (id = auth.uid());

-- cell_reports: líder só acessa relatórios da sua célula
create policy "cell_leader_reports" on cell_reports
  for all using (
    get_my_role() in ('admin', 'pastor')
    or (get_my_role() = 'cell_leader' and is_my_cell(cell_id))
  );

-- schedules: líder só acessa escalas do seu ministério
create policy "ministry_leader_schedules" on schedules
  for all using (
    get_my_role() in ('admin', 'pastor')
    or is_my_ministry(ministry_id)
  );
```

---

## 6. Módulos do Sistema

### 6.1 Cadastro de Membros

**Campos do formulário:**
- Nome completo (obrigatório)
- Cidade
- Telefone / WhatsApp
- Data de nascimento
- Foto (upload)
- Célula (select com células ativas)
- É batizado? (toggle) → se sim: data do batismo
- Já fez o Abrigo? (toggle) → se sim: data de conclusão
- Já fez Escola de Discípulo? (toggle) → se sim: data
- Já fez Encontro com Deus? (toggle) → se sim: data

**Validações (Zod):**
```typescript
const memberSchema = z.object({
  full_name: z.string().min(3, 'Nome obrigatório'),
  phone: z.string().optional(),
  city: z.string().optional(),
  birth_date: z.string().optional(),
  cell_id: z.string().uuid().optional(),
  is_baptized: z.boolean().default(false),
  baptism_date: z.string().optional(),
  completed_abrigo: z.boolean().default(false),
  abrigo_completed_at: z.string().optional(),
  completed_escola_discipulo: z.boolean().default(false),
  escola_completed_at: z.string().optional(),
  did_encontro_com_deus: z.boolean().default(false),
  encontro_date: z.string().optional(),
});
```

---

### 6.2 Relatório Semanal de Célula

Formulário preenchido pelo líder após cada reunião:

```
1. Data da célula (date picker)
2. Total de membros presentes (number)
3. Total de visitantes (number)
4. Alguém aceitou Jesus? (toggle Sim/Não)

[Se SIM → abre seção dinâmica:]
  Para cada convertido:
  - Nome completo
  - Telefone / WhatsApp
  [+ Botão "Adicionar outro"]
```

**Lógica:** ao salvar um relatório com conversões, os dados são salvos em `cell_report_conversions` E automaticamente criados como registros em `amar_records` com `conversion_source = 'culto'`.

---

### 6.3 Gerador de Escalas Mensais

**Algoritmo (TypeScript):**

```typescript
interface ScheduleEntry {
  date: Date;
  members: MinistryMember[];
}

interface MinistryMember {
  profile_id: string;
  couple_partner_id?: string;
  is_couple_pair: boolean;
}

function generateMonthlySchedule(
  ministry_id: string,
  month: number,
  year: number,
  members: MinistryMember[],
  service_dates: Date[], // datas dos cultos/serviços no mês
  min_per_service: number = 2
): ScheduleEntry[] {
  // 1. Separar casais de membros individuais
  const couples = members.filter(m => m.is_couple_pair && m.couple_partner_id);
  const individuals = members.filter(m => !m.is_couple_pair);

  // 2. Distribuição balanceada: cada membro serve ~2x por mês
  // 3. Casais sempre escalados juntos na mesma data
  // 4. Verificar conflitos (evitar mesma pessoa em datas consecutivas)
  // 5. Retornar array de { date, members[] } balanceado
}
```

**UI do gerador:**
1. Selecionar ministério
2. Selecionar mês/ano
3. Preview da escala gerada (tabela visual)
4. Opção de arrastar/trocar datas manualmente
5. Botão "Publicar escala" → notifica membros (WhatsApp link ou notificação)
6. Exportar como PDF ou imagem

---

### 6.4 Ministério AMAR — Recepção de Novos

Formulário de cadastro (preenchido durante/após culto):

```
- Nome completo (obrigatório)
- Telefone
- Data de nascimento
- Foi convidado? → se sim: nome de quem convidou
- Origem: Culto / Célula / Evento / Outro
- Data que aceitou Jesus
- Já participou de alguma célula antes? (toggle)
- Tem interesse em entrar em uma célula? (toggle)
- Bairro de preferência (para indicar célula)
- Pedidos de oração (textarea)
- Responsável pelo acompanhamento (select de membros do AMAR)
```

**Dashboard AMAR:**
- Lista de novos com status (Novo / Em contato / Em célula / Inativo)
- Filtros por status, período, responsável
- Cards com indicadores: total novos no mês, em acompanhamento, integrados

---

### 6.5 Dashboard Principal (por role)

**Admin / Pastor:**
- Total de membros ativos
- Crescimento de membros (últimos 6 meses)
- Total de células e relatórios da semana
- Convertidos no mês (cultos + células)
- Membros por etapa da jornada (gráfico funil)
- Alertas: células sem relatório na semana

**Líder de Célula:**
- Dados da sua célula
- Histórico de relatórios
- Membros da célula e status espiritual
- Atalho para novo relatório

**Líder de Ministério:**
- Membros do ministério
- Escala do mês atual
- Botão gerar escala do próximo mês

---

## 7. Design System

### Paleta de Cores

```css
:root {
  /* Primária — Roxo elegante (fé, espiritualidade) */
  --primary: #4F46E5;
  --primary-light: #EEF2FF;
  --primary-dark: #3730A3;

  /* Acento — Dourado suave (graça, nobreza) */
  --accent: #D97706;
  --accent-light: #FEF3C7;

  /* Sucesso */
  --success: #059669;
  --success-light: #ECFDF5;

  /* Neutros */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-900: #111827;
}
```

### Tipografia
- **Display / Headings:** Inter (700)
- **Body:** Inter (400/500)
- **Mono (dados):** JetBrains Mono

### Componentes-chave
- `<JourneyBadge>` — badge visual da etapa espiritual (Visitante → Membro → Líder)
- `<CellCard>` — card de célula com status do relatório semanal
- `<ScheduleGrid>` — grade visual da escala mensal
- `<StatsCard>` — card de indicador com variação percentual
- `<ConversionForm>` — formulário inline para adicionar conversões

---

## 8. Fluxo de Autenticação

```
1. Login (email + senha)
2. Supabase Auth retorna session
3. Buscar perfil em `profiles` → obter role
4. Redirecionar para dashboard baseado no role:
   - admin/pastor → /dashboard (visão completa)
   - cell_leader → /celulas/minha-celula
   - ministry_leader → /ministerios/meu-ministerio
5. Middleware Next.js protege todas as rotas autenticadas
6. RLS no Supabase garante segurança mesmo em chamadas diretas
```

---

## 9. Ordem de Desenvolvimento Recomendada

### Fase 1 — Base (semana 1-2)
1. Setup Supabase: criar todas as tabelas + RLS
2. Setup Next.js com Tailwind + shadcn
3. Autenticação (login, logout, guards)
4. Layout base com navegação por role

### Fase 2 — Core (semana 3-4)
5. Cadastro e listagem de membros
6. Gestão de células (CRUD)
7. Relatório semanal de célula

### Fase 3 — Ministérios (semana 5-6)
8. Cadastro de ministérios e membros
9. Gerador de escalas mensais
10. Ministério AMAR (formulário + dashboard)

### Fase 4 — Dashboards e polish (semana 7-8)
11. Dashboard por role com indicadores
12. Módulo de Abrigo e Escola de Discípulo
13. PWA (manifest, service worker)
14. Testes e refinamento

---

## 10. Comandos para Claude Code

Ao abrir o Claude Code, use estes prompts em sequência:

```
"Crie o projeto Next.js 14 com App Router, Tailwind CSS, shadcn/ui e configure a integração com Supabase seguindo a estrutura de pastas definida nesta spec"

"Crie todas as migrations do Supabase para as tabelas: profiles, cells, cell_reports, cell_report_conversions, ministries, ministry_members, schedules, schedule_entries, amar_records, abrigo_classes, abrigo_attendees, escola_classes, escola_attendees"

"Implemente o RLS completo conforme as regras definidas na spec, com as helper functions get_my_role(), is_my_cell() e is_my_ministry()"

"Crie o sistema de autenticação com Supabase Auth, incluindo middleware Next.js para proteger rotas e redirecionamento por role"

"Implemente o módulo de cadastro de membros com React Hook Form + Zod, seguindo todos os campos definidos"

"Crie o formulário de relatório semanal de célula com seção dinâmica de conversões"

"Implemente o algoritmo de geração de escalas mensais em TypeScript, respeitando casais que servem juntos e distribuição balanceada"
```

---

## 11. Variáveis de Ambiente

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_aqui
```

---

## 12. Tipos TypeScript (gerados pelo Supabase)

Rode após criar as tabelas:

```bash
npx supabase gen types typescript --project-id SEU_PROJECT_ID > packages/supabase/types.ts
```

Isso gera todos os tipos automaticamente a partir do schema do banco.
