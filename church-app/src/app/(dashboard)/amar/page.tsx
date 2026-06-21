import Link from "next/link";
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

const STATUS_VARIANT: Record<StatusAmar, "default" | "secondary" | "outline"> = {
  novo: "default",
  em_contato: "secondary",
  em_celula: "secondary",
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
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ministério AMAR</h1>
          <p className="text-sm text-muted-foreground">
            Recepção e acompanhamento de novos
          </p>
        </div>
        <Link href="/amar/novo" className={buttonVariants()}>
          Novo cadastro
        </Link>
      </div>

      {/* Indicadores */}
      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        {STATUS_AMAR.map((s) => (
          <div key={s} className="rounded-md border p-4">
            <p className="text-sm text-muted-foreground">{STATUS_LABELS[s]}</p>
            <p className="text-2xl font-semibold">{contagem[s]}</p>
          </div>
        ))}
      </div>

      {/* Filtro por status */}
      <div className="mb-4 flex flex-wrap gap-2">
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
        <div className="rounded-md border border-dashed p-10 text-center text-muted-foreground">
          Nenhum registro {filtro ? "neste status" : "ainda"}.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
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
      )}
    </div>
  );
}
