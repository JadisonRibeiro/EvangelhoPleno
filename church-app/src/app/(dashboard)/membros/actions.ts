"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { membroSchema, type MembroInput } from "@/lib/validations/membro";

export type MembroResult = { error: string } | undefined;

// Converte string vazia em null para colunas opcionais.
const ouNulo = (v?: string) => (v && v.trim() !== "" ? v : null);

function toRow(d: MembroInput) {
  return {
    full_name: d.full_name,
    phone: ouNulo(d.phone),
    birth_date: ouNulo(d.birth_date),
    address: ouNulo(d.address),
    neighborhood: ouNulo(d.neighborhood),
    city: ouNulo(d.city),
    cell_id: ouNulo(d.cell_id),
    role: d.role,
    is_baptized: d.is_baptized,
    baptism_date: d.is_baptized ? ouNulo(d.baptism_date) : null,
    completed_abrigo: d.completed_abrigo,
    abrigo_completed_at: d.completed_abrigo ? ouNulo(d.abrigo_completed_at) : null,
    completed_escola_discipulo: d.completed_escola_discipulo,
    escola_completed_at: d.completed_escola_discipulo
      ? ouNulo(d.escola_completed_at)
      : null,
    did_encontro_com_deus: d.did_encontro_com_deus,
    encontro_date: d.did_encontro_com_deus ? ouNulo(d.encontro_date) : null,
  };
}

export async function criarMembro(values: MembroInput): Promise<MembroResult> {
  const parsed = membroSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos." };

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").insert(toRow(parsed.data));
  if (error) return { error: error.message };

  revalidatePath("/membros");
  redirect("/membros");
}

export async function atualizarMembro(
  id: string,
  values: MembroInput,
): Promise<MembroResult> {
  const parsed = membroSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update(toRow(parsed.data))
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/membros");
  redirect("/membros");
}

export async function excluirMembro(id: string): Promise<MembroResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) {
    return { error: "Não foi possível excluir (pode liderar uma célula/ministério)." };
  }
  revalidatePath("/membros");
}
