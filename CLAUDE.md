# CLAUDE.md — App Igreja

Leia primeiro: [church-app-spec.md](church-app-spec.md) (especificação técnica completa do projeto)

## Stack (instalado)
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (config CSS-first em `globals.css`, sem `tailwind.config.js`) + shadcn/ui
- Supabase (PostgreSQL + Auth + RLS) via `@supabase/ssr`
- React Hook Form + Zod + Zustand

> A spec original cita Next.js 14; adotamos a versão mais recente (16) e Tailwind v4
> por recomendação do `create-next-app@latest`. App único com `src/` (não monorepo).

## Estrutura
- `src/app/(auth)/` — login, recuperar-senha
- `src/app/(dashboard)/` — dashboard, membros, celulas, ministerios, escalas, amar
- `src/lib/supabase/` — clients (browser/server) e tipos gerados
- `src/lib/validations/` — schemas Zod · `src/lib/algorithms/` — escalas
- `src/stores/` — estado Zustand
- `supabase/migrations/` + `supabase/seed.sql`

## Convenções
- Português para commits, comentários e nomes de variáveis de domínio
- Clean Code, componentes pequenos e reutilizáveis
- Sempre validar com Zod antes de enviar ao Supabase
- `cookies()` é assíncrono no Next 16 — use `await` nos helpers de servidor
