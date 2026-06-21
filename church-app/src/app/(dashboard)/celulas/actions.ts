"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { celulaSchema, type CelulaInput } from "@/lib/validations/celula";

export type CelulaResult = { error: string } | undefined;

const ouNulo = (v?: string) => (v && v.trim() !== "" ? v : null);

function toRow(d: CelulaInput) {
  return {
    name: d.name,
    leader_id: ouNulo(d.leader_id),
    co_leader_id: ouNulo(d.co_leader_id),
    meeting_day: ouNulo(d.meeting_day),
    meeting_time: ouNulo(d.meeting_time),
    address: ouNulo(d.address),
    neighborhood: ouNulo(d.neighborhood),
    is_active: d.is_active,
  };
}

export async function criarCelula(values: CelulaInput): Promise<CelulaResult> {
  const parsed = celulaSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos." };

  const supabase = await createClient();
  const { error } = await supabase.from("cells").insert(toRow(parsed.data));
  if (error) return { error: error.message };

  revalidatePath("/celulas");
  redirect("/celulas");
}

export async function atualizarCelula(
  id: string,
  values: CelulaInput,
): Promise<CelulaResult> {
  const parsed = celulaSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("cells")
    .update(toRow(parsed.data))
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/celulas");
  redirect("/celulas");
}

export async function excluirCelula(id: string): Promise<CelulaResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("cells").delete().eq("id", id);
  if (error) {
    return {
      error: "Não foi possível excluir — a célula pode ter membros vinculados.",
    };
  }
  revalidatePath("/celulas");
}
