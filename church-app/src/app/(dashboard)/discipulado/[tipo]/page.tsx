import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DISCIPULADO, isTipo } from "@/lib/discipulado";
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
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title={cfg.label}
        description={`${turmas.length} ${turmas.length === 1 ? "turma" : "turmas"}`}
        backHref="/discipulado"
        breadcrumb={[
          { label: "Início", href: "/dashboard" },
          { label: "Discipulado", href: "/discipulado" },
          { label: cfg.label },
        ]}
      >
        <Link href={`/discipulado/${tipo}/nova`} className={buttonVariants()}>
          <Plus className="size-4" /> Nova turma
        </Link>
      </PageHeader>

      {error && (
        <p className="text-sm text-destructive">Erro: {error.message}</p>
      )}

      {!error && turmas.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Nenhuma turma criada ainda.
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile: cards em coluna única */}
          <ul className="space-y-3 md:hidden">
            {turmas.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/discipulado/${tipo}/${t.id}`}
                  className="block rounded-2xl border bg-card p-4 ring-1 ring-foreground/5 transition-colors hover:bg-accent/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        Início {dataLabel(t.start_date)}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {t.total_lessons} lições · {t.alunos?.[0]?.count ?? 0}{" "}
                        alunos
                      </p>
                    </div>
                    <Badge variant={t.is_open ? "default" : "outline"}>
                      {t.is_open ? "Aberta" : "Fechada"}
                    </Badge>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop: tabela densa */}
          <div className="hidden overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 md:block">
            <Table>
              <TableHeader className="bg-muted/50">
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
        </>
      )}
    </div>
  );
}
