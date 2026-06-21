import { z } from "zod";

export const roleEnum = z.enum([
  "admin",
  "pastor",
  "cell_leader",
  "ministry_leader",
  "member",
]);

// Campos de texto opcionais aceitam string vazia (a action converte para null).
const opcional = z.string().optional().or(z.literal(""));

export const membroSchema = z.object({
  full_name: z.string().min(3, "Nome obrigatório"),
  phone: opcional,
  city: opcional,
  birth_date: opcional,
  cell_id: z.string().uuid().optional().or(z.literal("")),
  role: roleEnum,

  is_baptized: z.boolean(),
  baptism_date: opcional,
  completed_abrigo: z.boolean(),
  abrigo_completed_at: opcional,
  completed_escola_discipulo: z.boolean(),
  escola_completed_at: opcional,
  did_encontro_com_deus: z.boolean(),
  encontro_date: opcional,
});

export type MembroInput = z.infer<typeof membroSchema>;
