import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DISCIPULADO, isTipo } from "@/lib/discipulado";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
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
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title={`${cfg.label} — ${dataLabel(turma.start_date)}`}
        description={`${turma.total_lessons} lições${
          turma.end_date ? ` · término ${dataLabel(turma.end_date)}` : ""
        }`}
        backHref={`/discipulado/${tipo}`}
        breadcrumb={[
          { label: "Início", href: "/dashboard" },
          { label: cfg.label, href: `/discipulado/${tipo}` },
          { label: "Turma" },
        ]}
      >
        <Badge variant={turma.is_open ? "default" : "outline"}>
          {turma.is_open ? "Aberta" : "Fechada"}
        </Badge>
      </PageHeader>

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
