"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { amarSchema, type AmarInput } from "@/lib/validations/amar";

export type AmarResult = { error: string } | undefined;

const ouNulo = (v?: string) => (v && v.trim() !== "" ? v : null);

function toRow(d: AmarInput) {
  return {
    full_name: d.full_name,
    phone: ouNulo(d.phone),
    email: ouNulo(d.email),
    birth_date: ouNulo(d.birth_date),
    was_invited: d.was_invited,
    invited_by_name: d.was_invited ? ouNulo(d.invited_by_name) : null,
    conversion_source: ouNulo(d.conversion_source),
    conversion_date: ouNulo(d.conversion_date),
    service_date: ouNulo(d.service_date),
    has_been_in_cell: d.has_been_in_cell,
    cell_interest: d.cell_interest,
    preferred_neighborhood: ouNulo(d.preferred_neighborhood),
    prayer_requests: ouNulo(d.prayer_requests),
    assigned_to: ouNulo(d.assigned_to),
    status: d.status,
    notes: ouNulo(d.notes),
  };
}

export async function criarAmar(values: AmarInput): Promise<AmarResult> {
  const parsed = amarSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos." };

  const supabase = await createClient();
  const { error } = await supabase.from("amar_records").insert(toRow(parsed.data));
  if (error) return { error: error.message };

  revalidatePath("/amar");
  redirect("/amar");
}

export async function atualizarAmar(
  id: string,
  values: AmarInput,
): Promise<AmarResult> {
  const parsed = amarSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("amar_records")
    .update(toRow(parsed.data))
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/amar");
  redirect("/amar");
}

export async function excluirAmar(id: string): Promise<AmarResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("amar_records").delete().eq("id", id);
  if (error) return { error: "Não foi possível excluir o registro." };
  revalidatePath("/amar");
}
