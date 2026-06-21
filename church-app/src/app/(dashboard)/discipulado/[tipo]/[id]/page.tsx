import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DISCIPULADO, isTipo } from "@/lib/discipulado";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlunosTurma,
  type Aluno,
  type Pessoa,
} from "../../_components/alunos-turma";

type TurmaInfo = {
  start_date: string;
  end_date: string | null;
  is_open: boolean;
  total_lessons: number;
};

function dataLabel(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR");
}

export default async function TurmaDetalhePage({
  params,
}: {
  params: Promise<{ tipo: string; id: string }>;
}) {
  const { tipo, id } = await params;
  if (!isTipo(tipo)) notFound();
  const cfg = DISCIPULADO[tipo];
  const supabase = await createClient();

  const [{ data: turmaData }, { data: alunosData }, { data: pessoasData }] =
    await Promise.all([
      supabase
        .from(cfg.classesTable)
        .select("start_date, end_date, is_open, total_lessons")
        .eq("id", id)
        .single(),
      supabase
        .from(cfg.attendeesTable)
        .select(
          `profile_id, lessons_completed, completed,
           membro:profiles!${cfg.attendeesTable}_profile_id_fkey(full_name)`,
        )
        .eq("class_id", id),
      supabase
        .from("profiles")
        .select("id, full_name")
        .eq("is_active", true)
        .order("full_name"),
    ]);

  if (!turmaData) notFound();
  const turma = turmaData as TurmaInfo;
  const alunos = (alunosData as Aluno[] | null) ?? [];
  const pessoas = (pessoasData as Pessoa[] | null) ?? [];

  const matriculados = new Set(alunos.map((a) => a.profile_id));
  const disponiveis = pessoas.filter((p) => !matriculados.has(p.id));

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">
              {cfg.label} — {dataLabel(turma.start_date)}
            </h1>
            <Badge variant={turma.is_open ? "default" : "outline"}>
              {turma.is_open ? "Aberta" : "Fechada"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {turma.total_lessons} lições
            {turma.end_date ? ` · término ${dataLabel(turma.end_date)}` : ""}
          </p>
        </div>
        <Link
          href={`/discipulado/${tipo}`}
          className={buttonVariants({ variant: "outline" })}
        >
          Voltar
        </Link>
      </div>

      <div className="max-w-2xl">
        <AlunosTurma
          tipo={tipo}
          classId={id}
          totalLessons={turma.total_lessons}
          alunos={alunos}
          disponiveis={disponiveis}
        />
      </div>
    </div>
  );
}
