import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ROLE_LABELS, type Role } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { Pagination } from "@/components/pagination";
import { SearchBar } from "@/components/search-bar";
import { FilterBar, FilterSelect } from "@/components/filter-bar";
import { ExcluirMembro } from "./_components/excluir-membro";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PAGE_SIZE = 20;

type MembroRow = {
  id: string;
  full_name: string;
  neighborhood: string | null;
  role: Role;
  is_active: boolean;
  is_baptized: boolean;
  completed_abrigo: boolean;
  completed_escola_discipulo: boolean;
  did_encontro_com_deus: boolean;
  cell: { name: string } | null;
};

function JornadaBadges({ m }: { m: MembroRow }) {
  const etapas = [
    { ok: m.is_baptized, label: "Batismo" },
    { ok: m.completed_abrigo, label: "Abrigo" },
    { ok: m.completed_escola_discipulo, label: "Escola" },
    { ok: m.did_encontro_com_deus, label: "Encontro" },
  ].filter((e) => e.ok);

  if (etapas.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {etapas.map((e) => (
        <Badge key={e.label} variant="secondary">
          {e.label}
        </Badge>
      ))}
    </div>
  );
}

export default async function MembrosPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    cell?: string;
    bairro?: string;
    status?: string;
  }>;
}) {
  const { page: pageStr, q, cell, bairro, status } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select(
      "id, full_name, neighborhood, role, is_active, is_baptized, completed_abrigo, completed_escola_discipulo, did_encontro_com_deus, cell:cells!profiles_cell_id_fkey(name)",
      { count: "exact" },
    );
  if (q) query = query.ilike("full_name", `%${q}%`);
  if (cell) query = query.eq("cell_id", cell);
  if (bairro) query = query.eq("neighborhood", bairro);
  if (status === "ativo") query = query.eq("is_active", true);
  if (status === "inativo") query = query.eq("is_active", false);

  const { data, count, error } = await query
    .order("full_name")
    .range(from, to);

  const [{ data: celulasData }, { data: bairrosData }] = await Promise.all([
    supabase.from("cells").select("id, name").order("name"),
    supabase.from("profiles").select("neighborhood").not("neighborhood", "is", null),
  ]);

  const membros = (data as MembroRow[] | null) ?? [];
  const celulas = (celulasData as { id: string; name: string }[] | null) ?? [];
  const bairros = [
    ...new Set(
      ((bairrosData as { neighborhood: string | null }[] | null) ?? [])
        .map((b) => b.neighborhood)
        .filter((b): b is string => !!b),
    ),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const makeHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cell) params.set("cell", cell);
    if (bairro) params.set("bairro", bairro);
    if (status) params.set("status", status);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/membros?${qs}` : "/membros";
  };

  const btn = buttonVariants({ variant: "outline", size: "sm" });
  const temFiltro = Boolean(q || cell || bairro || status);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Membros"
        description={`${total} ${total === 1 ? "membro" : "membros"}`}
        backHref="/dashboard"
        breadcrumb={[{ label: "Início", href: "/dashboard" }, { label: "Membros" }]}
      >
        <Link href="/membros/novo" className={buttonVariants()}>
          <Plus className="size-4" /> Novo membro
        </Link>
      </PageHeader>

      <FilterBar>
        <SearchBar
          param="q"
          placeholder="Pesquisar membro por nome..."
          className="w-full sm:min-w-64 sm:flex-1"
        />
        <FilterSelect
          label="Célula"
          param="cell"
          allLabel="Todas as células"
          options={celulas.map((c) => ({ value: c.id, label: c.name }))}
        />
        <FilterSelect
          label="Bairro"
          param="bairro"
          allLabel="Todos os bairros"
          options={bairros.map((b) => ({ value: b, label: b }))}
        />
        <FilterSelect
          label="Status"
          param="status"
          allLabel="Todos"
          options={[
            { value: "ativo", label: "Ativo" },
            { value: "inativo", label: "Inativo" },
          ]}
        />
      </FilterBar>

      {error && (
        <p className="text-sm text-destructive">
          Erro ao carregar membros: {error.message}
        </p>
      )}

      {!error && membros.length === 0 ? (
        <EmptyState
          icon={Users}
          title={temFiltro ? "Nenhum membro encontrado" : "Nenhum membro cadastrado"}
          description={
            temFiltro
              ? "Tente ajustar a busca ou os filtros."
              : "Cadastre o primeiro membro para começar."
          }
          action={
            !temFiltro && (
              <Link href="/membros/novo" className={buttonVariants({ size: "sm" })}>
                <Plus className="size-4" /> Novo membro
              </Link>
            )
          }
        />
      ) : (
        <>
          {/* Mobile: cards em coluna única (sensação de app nativo) */}
          <ul className="space-y-3 md:hidden">
            {membros.map((m) => (
              <li
                key={m.id}
                className="rounded-2xl border bg-card p-4 ring-1 ring-foreground/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{m.full_name}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {ROLE_LABELS[m.role]}
                      {m.cell?.name ? ` · ${m.cell.name}` : ""}
                    </p>
                  </div>
                  <Badge variant={m.is_active ? "success" : "outline"}>
                    {m.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <div className="mt-3">
                  <JornadaBadges m={m} />
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/membros/${m.id}/editar`}
                    className={`${btn} flex-1`}
                  >
                    Editar
                  </Link>
                  <ExcluirMembro id={m.id} nome={m.full_name} />
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop: tabela densa com header fixo */}
          <div className="hidden max-h-[70vh] overflow-auto rounded-xl bg-card ring-1 ring-foreground/10 md:block">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm [&_th]:border-b">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Nome</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead>Célula</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Jornada</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membros.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.full_name}</TableCell>
                    <TableCell>{m.neighborhood ?? "—"}</TableCell>
                    <TableCell>{m.cell?.name ?? "—"}</TableCell>
                    <TableCell>{ROLE_LABELS[m.role]}</TableCell>
                    <TableCell>
                      <JornadaBadges m={m} />
                    </TableCell>
                    <TableCell>
                      <Badge variant={m.is_active ? "success" : "outline"}>
                        {m.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Link href={`/membros/${m.id}/editar`} className={btn}>
                          Editar
                        </Link>
                        <ExcluirMembro id={m.id} nome={m.full_name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <span className="text-sm text-muted-foreground">
              Página {page} de {totalPages} · {total} no total
            </span>
            <Pagination page={page} totalPages={totalPages} makeHref={makeHref} />
          </div>
        </>
      )}
    </div>
  );
}
