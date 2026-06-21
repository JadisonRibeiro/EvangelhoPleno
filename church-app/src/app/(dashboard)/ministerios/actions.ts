"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ministerioSchema,
  type MinisterioInput,
  membroMinisterioSchema,
  type MembroMinisterioInput,
} from "@/lib/validations/ministerio";

export type ActionResult = { error: string } | undefined;

const ouNulo = (v?: string) => (v && v.trim() !== "" ? v : null);

function toRow(d: MinisterioInput) {
  return {
    name: d.name,
    description: ouNulo(d.description),
    leader_id: ouNulo(d.leader_id),
    requires_schedule: d.requires_schedule,
    is_active: d.is_active,
  };
}

export async function criarMinisterio(
  values: MinisterioInput,
): Promise<ActionResult> {
  const parsed = ministerioSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos." };

  const supabase = await createClient();
  const { error } = await supabase.from("ministries").insert(toRow(parsed.data));
  if (error) return { error: error.message };

  revalidatePath("/ministerios");
  redirect("/ministerios");
}

export async function atualizarMinisterio(
  id: string,
  values: MinisterioInput,
): Promise<ActionResult> {
  const parsed = ministerioSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("ministries")
    .update(toRow(parsed.data))
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/ministerios");
  redirect("/ministerios");
}

export async function excluirMinisterio(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("ministries").delete().eq("id", id);
  if (error) return { error: "Não foi possível excluir o ministério." };
  revalidatePath("/ministerios");
}

export async function adicionarMembroMinisterio(
  ministryId: string,
  values: MembroMinisterioInput,
): Promise<ActionResult> {
  const parsed = membroMinisterioSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos." };
  const d = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("ministry_members").insert({
    ministry_id: ministryId,
    profile_id: d.profile_id,
    is_couple_pair: d.is_couple_pair,
    couple_partner_id: d.is_couple_pair ? ouNulo(d.couple_partner_id) : null,
  });
  if (error) {
    if (error.code === "23505") {
      return { error: "Esse membro já está no ministério." };
    }
    return { error: error.message };
  }

  revalidatePath(`/ministerios/${ministryId}`);
}

export async function removerMembroMinisterio(
  rowId: string,
  ministryId: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("ministry_members")
    .delete()
    .eq("id", rowId);
  if (error) return { error: error.message };
  revalidatePath(`/ministerios/${ministryId}`);
}
