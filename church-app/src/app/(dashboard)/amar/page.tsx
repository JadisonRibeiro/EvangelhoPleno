import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  STATUS_AMAR,
  STATUS_LABELS,
  ORIGEM_LABELS,
  type StatusAmar,
  type OrigemAmar,
} from "@/lib/validations/amar";
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
import { ExcluirAmar } from "./_components/excluir-amar";

type AmarRow = {
  id: string;
  full_name: string;
  phone: string | null;
  status: StatusAmar;
  conversion_source: OrigemAmar | null;
  responsavel: { full_name: string } | null;
};

const STATUS_VARIANT: Record<
  StatusAmar,
  "default" | "secondary" | "success" | "outline"
> = {
  novo: "default",
  em_contato: "secondary",
  em_celula: "success",
  inativo: "outline",
};

export default async function AmarPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filtro } = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("amar_records")
    .select(
      `id, full_name, phone, status, conversion_source,
       responsavel:profiles!amar_records_assigned_to_fkey(full_name)`,
    )
    .order("created_at", { ascending: false });

  const registros = (data as AmarRow[] | null) ?? [];

  const contagem = STATUS_AMAR.reduce(
    (acc, s) => ({ ...acc, [s]: registros.filter((r) => r.status === s).length }),
    {} as Record<StatusAmar, number>,
  );

  const filtrados =
    filtro && (STATUS_AMAR as readonly string[]).includes(filtro)
      ? registros.filter((r) => r.status === filtro)
      : registros;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Ministério Amar"
        description="Recepção e acompanhamento de novos"
        backHref="/dashboard"
        breadcrumb={[
          { label: "Início", href: "/dashboard" },
          { label: "Amar" },
        ]}
      >
        <Link href="/amar/novo" className={buttonVariants()}>
          <Plus className="size-4" /> Novo cadastro
        </Link>
      </PageHeader>

      {/* Indicadores */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STATUS_AMAR.map((s) => (
          <div
            key={s}
            className="rounded-xl bg-card p-4 ring-1 ring-foreground/10"
          >
            <p className="text-sm text-muted-foreground">{STATUS_LABELS[s]}</p>
            <p className="text-2xl font-semibold tracking-tight" data-tabular>
              {contagem[s]}
            </p>
          </div>
        ))}
      </div>

      {/* Filtro por status */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/amar"
          className={buttonVariants({
            variant: !filtro ? "default" : "outline",
            size: "sm",
          })}
        >
          Todos
        </Link>
        {STATUS_AMAR.map((s) => (
          <Link
            key={s}
            href={`/amar?status=${s}`}
            className={buttonVariants({
              variant: filtro === s ? "default" : "outline",
              size: "sm",
            })}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive">
          Erro ao carregar registros: {error.message}
        </p>
      )}

      {!error && filtrados.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Nenhum registro {filtro ? "neste status" : "ainda"}.
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile: cards em coluna única */}
          <ul className="space-y-3 md:hidden">
            {filtrados.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border bg-card p-4 ring-1 ring-foreground/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.full_name}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {r.phone ?? "Sem telefone"}
                      {r.conversion_source
                        ? ` · ${ORIGEM_LABELS[r.conversion_source]}`
                        : ""}
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANT[r.status]}>
                    {STATUS_LABELS[r.status]}
                  </Badge>
                </div>
                {r.responsavel?.full_name && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Responsável: {r.responsavel.full_name}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/amar/${r.id}/editar`}
                    className={`${buttonVariants({ variant: "outline", size: "sm" })} flex-1`}
                  >
                    Editar
                  </Link>
                  <ExcluirAmar id={r.id} nome={r.full_name} />
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
                <TableHead>Telefone</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.full_name}</TableCell>
                  <TableCell>{r.phone ?? "—"}</TableCell>
                  <TableCell>
                    {r.conversion_source
                      ? ORIGEM_LABELS[r.conversion_source]
                      : "—"}
                  </TableCell>
                  <TableCell>{r.responsavel?.full_name ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[r.status]}>
                      {STATUS_LABELS[r.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/amar/${r.id}/editar`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        Editar
                      </Link>
                      <ExcluirAmar id={r.id} nome={r.full_name} />
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
