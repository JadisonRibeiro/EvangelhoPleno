"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { relatorioSchema, type RelatorioInput } from "@/lib/validations/relatorio";

export type RelatorioResult = { error: string } | undefined;

const ouNulo = (v?: string) => (v && v.trim() !== "" ? v : null);

export async function criarRelatorio(
  values: RelatorioInput,
): Promise<RelatorioResult> {
  const parsed = relatorioSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos." };
  const d = parsed.data;

  const supabase = await createClient();

  // Identifica o perfil de quem está reportando (reported_by é obrigatório)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada." };

  const { data: perfil } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!perfil) return { error: "Seu usuário não tem um perfil vinculado." };

  // Cria o relatório
  const { data: rel, error: e1 } = await supabase
    .from("cell_reports")
    .insert({
      cell_id: d.cell_id,
      reported_by: perfil.id,
      meeting_date: d.meeting_date,
      total_members: d.total_members,
      total_visitors: d.total_visitors,
      had_conversions: d.had_conversions,
    })
    .select("id")
    .single();
  if (e1) return { error: e1.message };

  // Conversões → cell_report_conversions (trigger cria o AMAR automaticamente)
  if (d.had_conversions && d.conversions.length > 0) {
    const rows = d.conversions.map((c) => ({
      report_id: rel.id as string,
      person_name: c.person_name,
      person_phone: ouNulo(c.person_phone),
    }));
    const { error: e2 } = await supabase
      .from("cell_report_conversions")
      .insert(rows);
    if (e2) return { error: e2.message };
  }

  revalidatePath("/relatorios");
  redirect("/relatorios");
}
