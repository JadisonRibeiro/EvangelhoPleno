"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DISCIPULADO, isTipo, type TipoDiscipulado } from "@/lib/discipulado";
import { turmaSchema, type TurmaInput } from "@/lib/validations/turma";

export type DiscResult = { error: string } | undefined;

const ouNulo = (v?: string) => (v && v.trim() !== "" ? v : null);

export async function criarTurma(
  tipo: TipoDiscipulado,
  values: TurmaInput,
): Promise<DiscResult> {
  if (!isTipo(tipo)) return { error: "Tipo inválido." };
  const parsed = turmaSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos." };
  const d = parsed.data;
  const cfg = DISCIPULADO[tipo];

  const row: Record<string, unknown> = {
    start_date: d.start_date,
    end_date: ouNulo(d.end_date),
    total_lessons: d.total_lessons,
    is_open: d.is_open,
  };
  if (cfg.temEncontro) row.encontro_reference = ouNulo(d.encontro_reference);

  const supabase = await createClient();
  const { error } = await supabase.from(cfg.classesTable).insert(row);
  if (error) return { error: error.message };

  revalidatePath(`/discipulado/${tipo}`);
  redirect(`/discipulado/${tipo}`);
}

export async function matricularAluno(
  tipo: TipoDiscipulado,
  classId: string,
  profileId: string,
): Promise<DiscResult> {
  if (!isTipo(tipo)) return { error: "Tipo inválido." };
  if (!profileId) return { error: "Selecione um membro." };
  const supabase = await createClient();
  const { error } = await supabase
    .from(DISCIPULADO[tipo].attendeesTable)
    .insert({ class_id: classId, profile_id: profileId });
  if (error) {
    if (error.code === "23505") return { error: "Membro já matriculado." };
    return { error: error.message };
  }
  revalidatePath(`/discipulado/${tipo}/${classId}`);
}

export async function atualizarAluno(
  tipo: TipoDiscipulado,
  classId: string,
  profileId: string,
  lessons: number,
  completed: boolean,
): Promise<DiscResult> {
  if (!isTipo(tipo)) return { error: "Tipo inválido." };
  const supabase = await createClient();
  const { error } = await supabase
    .from(DISCIPULADO[tipo].attendeesTable)
    .update({
      lessons_completed: lessons,
      completed,
      completed_at: completed ? new Date().toISOString().slice(0, 10) : null,
    })
    .eq("class_id", classId)
    .eq("profile_id", profileId);
  if (error) return { error: error.message };
  revalidatePath(`/discipulado/${tipo}/${classId}`);
}

export async function removerAluno(
  tipo: TipoDiscipulado,
  classId: string,
  profileId: string,
): Promise<DiscResult> {
  if (!isTipo(tipo)) return { error: "Tipo inválido." };
  const supabase = await createClient();
  const { error } = await supabase
    .from(DISCIPULADO[tipo].attendeesTable)
    .delete()
    .eq("class_id", classId)
    .eq("profile_id", profileId);
  if (error) return { error: error.message };
  revalidatePath(`/discipulado/${tipo}/${classId}`);
}
