# Design System — Evangelho Pleno

Revisão de UX/UI elevando o sistema a um padrão **ERP corporativo premium**
(referências: Linear, Vercel, Stripe, Notion). Nenhuma regra de negócio foi
alterada — apenas a camada visual e de experiência.

## Princípios
- Visual limpo, minimalista e neutro; cor usada com parcimônia.
- Base neutra (branco/cinza/preto) + **acento índigo discreto** (`--brand`).
- Hierarquia clara, espaçamentos consistentes, legibilidade prioritária.
- Suporte completo a **tema claro e escuro**.

## Tokens (`globals.css`)
- **Paleta**: base neutra (shadcn) + `--brand` índigo para destaques (nav ativa,
  ícones de KPI, foco, gráficos).
- **Gráficos**: `--chart-1..5` repaginados (índigo, azul, esmeralda, âmbar, violeta) discretos.
- **Tipografia**: Geist Sans, títulos com `tracking-tight`, números **tabulares**
  em métricas e tabelas (`font-variant-numeric: tabular-nums`).
- **Raio**: `--radius` 0.625rem; cards em `rounded-xl`.
- **Detalhes premium**: scrollbar fina, transição suave ao trocar de tema,
  `-webkit-font-smoothing`.

## Tema claro/escuro
- `next-themes` via `ThemeProvider` (`attribute="class"`, default claro, segue o sistema).
- Alternância pelo `ThemeToggle` (header e login).
- **Logo automática**: `logo-preta.png` (claro) / `logo-branca.png` (escuro), troca por CSS.

## Estrutura / Shell
- **Sidebar** (`AppSidebar`) colapsável (ícones) + sheet no mobile: logo, navegação
  agrupada (Principal / Gestão / Pastoral) com ícones lucide e estado ativo, e
  rodapé com avatar do usuário, papel e logout.
- **Header** (`AppHeader`): gatilho da sidebar + alternância de tema, fixo com blur.

## Componentes reutilizáveis
- `PageHeader` — título + descrição + ações (padroniza o topo de toda tela).
- `StatCard` — KPI executivo com ícone, valor e legenda.
- `Logo` — troca por tema.
- `ListSkeleton` — loading state moderno (usado nos `loading.tsx`).

## Padrões aplicados
- **Listagens**: tabela em container `rounded-xl` com `ring`, **cabeçalho destacado**
  (`bg-muted/50`), empty-states em card, botões de ação com ícone.
- **Formulários**: agrupados em **card** (`rounded-xl` + ring), espaçamento consistente,
  validações amigáveis (mensagens em vermelho discreto), toggles e seções claras.
- **Dashboard**: cards executivos com ícones, funil da jornada com barras de progresso,
  alerta de células sem relatório — distribuição por papel.
- **Skeleton loaders**: `loading.tsx` nas principais rotas de listagem.
- **Responsividade**: paddings `p-4 sm:p-6`, grids adaptativos, sidebar mobile.
- **Microinterações**: hover states, transições suaves, foco com anel da marca.

## Arquivos principais adicionados
- `components/`: `theme-provider`, `theme-toggle`, `logo`, `page-header`,
  `stat-card`, `list-skeleton`.
- `app/(dashboard)/_components/`: `app-sidebar`, `app-header`.
- `components/ui/`: sidebar, dropdown-menu, avatar, skeleton, tooltip, separator, sheet.
- `public/`: `logo-preta.png`, `logo-branca.png`.
