"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  construirUnidades,
  gerarEscalaMensal,
  datasDoMesPorDiaSemana,
  type EntradaEscala,
} from "@/lib/algorithms/escala";

export type PreviaEscala = {
  datas: string[];
  entradas: EntradaEscala[];
  totalUnidades: number;
};

type MembroRaw = {
  profile_id: string;
  is_couple_pair: boolean;
  couple_partner_id: string | null;
  membro: { full_name: string } | null;
  parceiro: { full_name: string } | null;
};

export async function gerarPreviaEscala(input: {
  ministryId: string;
  year: number;
  month: number;
  weekday: number;
  minPorData: number;
}): Promise<{ data?: PreviaEscala; error?: string }> {
  if (!input.ministryId) return { error: "Selecione um ministério." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ministry_members")
    .select(
      `profile_id, is_couple_pair, couple_partner_id,
       membro:profiles!ministry_members_profile_id_fkey(full_name),
       parceiro:profiles!ministry_members_couple_partner_id_fkey(full_name)`,
    )
    .eq("ministry_id", input.ministryId)
    .eq("is_active", true);

  if (error) return { error: error.message };

  const unidades = construirUnidades(
    (data as unknown as MembroRaw[]).map((m) => ({
      profile_id: m.profile_id,
      full_name: m.membro?.full_name ?? "—",
      is_couple_pair: m.is_couple_pair,
      couple_partner_id: m.couple_partner_id,
      partner_name: m.parceiro?.full_name ?? null,
    })),
  );

  if (unidades.length === 0) {
    return { error: "Este ministério não tem membros ativos para escalar." };
  }

  const datas = datasDoMesPorDiaSemana(input.year, input.month, input.weekday);
  if (datas.length === 0) {
    return { error: "Nenhuma data encontrada para esse dia da semana no mês." };
  }

  const entradas = gerarEscalaMensal(unidades, datas, input.minPorData);
  return { data: { datas, entradas, totalUnidades: unidades.length } };
}

export async function salvarEscala(input: {
  ministryId: string;
  year: number;
  month: number;
  notes?: string;
  entradas: EntradaEscala[];
}): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient();

  const { data: sched, error: e1 } = await supabase
    .from("schedules")
    .insert({
      ministry_id: input.ministryId,
      month: input.month,
      year: input.year,
      notes: input.notes?.trim() ? input.notes.trim() : null,
    })
    .select("id")
    .single();

  if (e1) {
    if (e1.code === "23505") {
      return { error: "Já existe uma escala para esse ministério neste mês/ano." };
    }
    return { error: e1.message };
  }

  const rows = input.entradas.flatMap((ent) =>
    ent.unidades.map((u) => ({
      schedule_id: sched.id as string,
      date: ent.date,
      profile_id: u.profileIds[0],
      couple_partner_id: u.isCouple ? u.profileIds[1] : null,
    })),
  );

  if (rows.length > 0) {
    const { error: e2 } = await supabase.from("schedule_entries").insert(rows);
    if (e2) return { error: e2.message };
  }

  revalidatePath("/escalas");
  return { id: sched.id as string };
}
