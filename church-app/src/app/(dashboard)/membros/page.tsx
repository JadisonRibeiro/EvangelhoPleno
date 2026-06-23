import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ROLE_LABELS, type Role } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { ExcluirMembro } from "./_components/excluir-membro";
import { MembrosFiltros, type CelulaOpt } from "./_components/membros-filtros";
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
  searchParams: Promise<{ page?: string; q?: string; cell?: string }>;
}) {
  const { page: pageStr, q, cell } = await searchParams;
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

  const { data, count, error } = await query
    .order("full_name")
    .range(from, to);

  const { data: celulasData } = await supabase
    .from("cells")
    .select("id, name")
    .order("name");

  const membros = (data as MembroRow[] | null) ?? [];
  const celulas = (celulasData as CelulaOpt[] | null) ?? [];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const hrefPagina = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cell) params.set("cell", cell);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/membros?${qs}` : "/membros";
  };

  const btn = buttonVariants({ variant: "outline", size: "sm" });
  const btnOff = `${btn} pointer-events-none opacity-50`;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Membros"
        description={`${total} ${total === 1 ? "membro" : "membros"}`}
      >
        <Link href="/membros/novo" className={buttonVariants()}>
          <Plus className="size-4" /> Novo membro
        </Link>
      </PageHeader>

      <MembrosFiltros celulas={celulas} />

      {error && (
        <p className="text-sm text-destructive">
          Erro ao carregar membros: {error.message}
        </p>
      )}

      {!error && membros.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Nenhum membro encontrado.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
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
                      <Badge variant={m.is_active ? "default" : "outline"}>
                        {m.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/membros/${m.id}/editar`}
                          className={btn}
                        >
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

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
              {page > 1 ? (
                <Link href={hrefPagina(page - 1)} className={btn}>
                  Anterior
                </Link>
              ) : (
                <span className={btnOff}>Anterior</span>
              )}
              {page < totalPages ? (
                <Link href={hrefPagina(page + 1)} className={btn}>
                  Próxima
                </Link>
              ) : (
                <span className={btnOff}>Próxima</span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
