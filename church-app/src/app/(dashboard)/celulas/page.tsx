import Link from "next/link";
import { Plus, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
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

export default async function CelulasPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cells")
    .select(
      `id, name, neighborhood, is_active, leader_name, cell_type, rede,
       leader:profiles!cells_leader_id_fkey(full_name)`,
    )
    .order("name");

  const celulas = (data as CelulaRow[] | null) ?? [];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Células"
        description={`${celulas.length} ${celulas.length === 1 ? "célula cadastrada" : "células cadastradas"}`}
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

      {error && (
        <p className="text-sm text-destructive">
          Erro ao carregar células: {error.message}
        </p>
      )}

      {!error && celulas.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Nenhuma célula cadastrada ainda.
          </CardContent>
        </Card>
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
                  <Badge variant={c.is_active ? "default" : "outline"}>
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

          {/* Desktop: tabela densa */}
          <div className="hidden overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 md:block">
            <Table>
              <TableHeader className="bg-muted/50">
              <TableRow>
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
                    <Badge variant={c.is_active ? "default" : "outline"}>
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
