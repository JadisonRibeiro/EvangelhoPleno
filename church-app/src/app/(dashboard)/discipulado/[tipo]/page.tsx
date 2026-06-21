import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DISCIPULADO, isTipo } from "@/lib/discipulado";
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

type TurmaRow = {
  id: string;
  start_date: string;
  end_date: string | null;
  is_open: boolean;
  total_lessons: number;
  alunos: { count: number }[];
};

function dataLabel(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR");
}

export default async function TurmasPage({
  params,
}: {
  params: Promise<{ tipo: string }>;
}) {
  const { tipo } = await params;
  if (!isTipo(tipo)) notFound();
  const cfg = DISCIPULADO[tipo];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(cfg.classesTable)
    .select(`id, start_date, end_date, is_open, total_lessons, alunos:${cfg.attendeesTable}(count)`)
    .order("start_date", { ascending: false });

  const turmas = (data as TurmaRow[] | null) ?? [];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{cfg.label}</h1>
          <p className="text-sm text-muted-foreground">
            {turmas.length} {turmas.length === 1 ? "turma" : "turmas"}
          </p>
        </div>
        <Link href={`/discipulado/${tipo}/nova`} className={buttonVariants()}>
          Nova turma
        </Link>
      </div>

      {error && (
        <p className="text-sm text-destructive">Erro: {error.message}</p>
      )}

      {!error && turmas.length === 0 ? (
        <div className="rounded-md border border-dashed p-10 text-center text-muted-foreground">
          Nenhuma turma criada ainda.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Início</TableHead>
                <TableHead>Término</TableHead>
                <TableHead>Lições</TableHead>
                <TableHead>Alunos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {turmas.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">
                    {dataLabel(t.start_date)}
                  </TableCell>
                  <TableCell>{t.end_date ? dataLabel(t.end_date) : "—"}</TableCell>
                  <TableCell>{t.total_lessons}</TableCell>
                  <TableCell>{t.alunos?.[0]?.count ?? 0}</TableCell>
                  <TableCell>
                    <Badge variant={t.is_open ? "default" : "outline"}>
                      {t.is_open ? "Aberta" : "Fechada"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/discipulado/${tipo}/${t.id}`}
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      Abrir
                    </Link>
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
