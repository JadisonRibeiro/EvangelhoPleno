"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export type LoginResult = { ok: true } | { error: string };

/**
 * Autentica via Supabase Auth. Revalida no servidor com Zod antes de chamar
 * o Supabase. Em caso de sucesso retorna `ok` — o cliente exibe a tela de
 * boas-vindas e navega para a Home ao fim da transição.
 */
export async function login(values: LoginInput): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "E-mail ou senha incorretos." };
  }

  return { ok: true };
}
