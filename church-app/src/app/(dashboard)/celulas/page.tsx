import Link from "next/link";
import { Plus, MapPin, Church } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { SearchBar } from "@/components/search-bar";
import { FilterBar, FilterSelect } from "@/components/filter-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExcluirCelula } from "./_components/excluir-celula";

type CelulaRow = {
  id: string;
  name: string;
  neighborhood: string | null;
  is_active: boolean;
  leader_name: string | null;
  cell_type: string | null;
  rede: string | null;
  leader: { full_name: string } | null;
};

const CORES_REDE: Record<string, string> = {
  Amarela: "bg-amber-400",
  Preta: "bg-foreground",
};

export default async function CelulasPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    rede?: string;
    bairro?: string;
    status?: string;
  }>;
}) {
  const { q, rede, bairro, status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("cells")
    .select(
      `id, name, neighborhood, is_active, leader_name, cell_type, rede,
       leader:profiles!cells_leader_id_fkey(full_name)`,
    );
  if (q) query = query.ilike("name", `%${q}%`);
  if (rede) query = query.eq("rede", rede);
  if (bairro) query = query.eq("neighborhood", bairro);
  if (status === "ativa") query = query.eq("is_active", true);
  if (status === "inativa") query = query.eq("is_active", false);

  const [{ data, error }, { data: todas }] = await Promise.all([
    query.order("name"),
    supabase.from("cells").select("rede, neighborhood"),
  ]);

  const celulas = (data as CelulaRow[] | null) ?? [];
  const linhas = (todas as { rede: string | null; neighborhood: string | null }[] | null) ?? [];
  const redes = [...new Set(linhas.map((c) => c.rede).filter((r): r is string => !!r))].sort();
  const bairros = [
    ...new Set(linhas.map((c) => c.neighborhood).filter((b): b is string => !!b)),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const temFiltro = Boolean(q || rede || bairro || status);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Células"
        description={`${celulas.length} ${celulas.length === 1 ? "célula" : "células"}`}
        backHref="/dashboard"
        breadcrumb={[{ label: "Início", href: "/dashboard" }, { label: "Células" }]}
      >
        <Link
          href="/celulas/mapa"
          className={buttonVariants({ variant: "outline" })}
        >
          <MapPin className="size-4" /> Mapa
        </Link>
        <Link href="/celulas/nova" className={buttonVariants()}>
          <Plus className="size-4" /> Nova célula
        </Link>
      </PageHeader>

      <FilterBar>
        <SearchBar
          param="q"
          placeholder="Pesquisar célula por nome..."
          className="w-full sm:min-w-64 sm:flex-1"
        />
        {redes.length > 0 && (
          <FilterSelect
            label="Rede"
            param="rede"
            allLabel="Todas as redes"
            options={redes.map((r) => ({ value: r, label: `Rede ${r}` }))}
          />
        )}
        {bairros.length > 0 && (
          <FilterSelect
            label="Bairro"
            param="bairro"
            allLabel="Todos os bairros"
            options={bairros.map((b) => ({ value: b, label: b }))}
          />
        )}
        <FilterSelect
          label="Status"
          param="status"
          allLabel="Todos"
          options={[
            { value: "ativa", label: "Ativa" },
            { value: "inativa", label: "Inativa" },
          ]}
        />
      </FilterBar>

      {error && (
        <p className="text-sm text-destructive">
          Erro ao carregar células: {error.message}
        </p>
      )}

      {!error && celulas.length === 0 ? (
        <EmptyState
          icon={Church}
          title={temFiltro ? "Nenhuma célula encontrada" : "Nenhuma célula cadastrada"}
          description={
            temFiltro
              ? "Tente ajustar a busca ou os filtros."
              : "Cadastre a primeira célula para começar."
          }
          action={
            !temFiltro && (
              <Link href="/celulas/nova" className={buttonVariants({ size: "sm" })}>
                <Plus className="size-4" /> Nova célula
              </Link>
            )
          }
        />
      ) : (
        <>
          {/* Mobile: cards em coluna única */}
          <ul className="space-y-3 md:hidden">
            {celulas.map((c) => (
              <li
                key={c.id}
                className="rounded-2xl border bg-card p-4 ring-1 ring-foreground/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.name}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {c.leader_name ?? c.leader?.full_name ?? "Sem líder"}
                      {c.neighborhood ? ` · ${c.neighborhood}` : ""}
                    </p>
                  </div>
                  <Badge variant={c.is_active ? "success" : "outline"}>
                    {c.is_active ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {c.cell_type && <span>{c.cell_type}</span>}
                  {c.rede && (
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`size-2.5 rounded-full ${CORES_REDE[c.rede] ?? "bg-muted-foreground"}`}
                      />
                      Rede {c.rede}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/celulas/${c.id}/editar`}
                    className={`${buttonVariants({ variant: "outline", size: "sm" })} flex-1`}
                  >
                    Editar
                  </Link>
                  <ExcluirCelula id={c.id} nome={c.name} />
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
                  <TableHead>Líder</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Rede</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {celulas.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>
                      {c.leader_name ?? c.leader?.full_name ?? "—"}
                    </TableCell>
                    <TableCell>{c.cell_type ?? "—"}</TableCell>
                    <TableCell>
                      {c.rede ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className={`size-2.5 rounded-full ${CORES_REDE[c.rede] ?? "bg-muted-foreground"}`}
                          />
                          {c.rede}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{c.neighborhood ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={c.is_active ? "success" : "outline"}>
                        {c.is_active ? "Ativa" : "Inativa"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/celulas/${c.id}/editar`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          Editar
                        </Link>
                        <ExcluirCelula id={c.id} nome={c.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
