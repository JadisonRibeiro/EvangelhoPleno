import { z } from "zod";

export const DIAS = [
  "domingo",
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
] as const;

export const DIAS_LABELS: Record<(typeof DIAS)[number], string> = {
  domingo: "Domingo",
  segunda: "Segunda",
  terca: "Terça",
  quarta: "Quarta",
  quinta: "Quinta",
  sexta: "Sexta",
  sabado: "Sábado",
};

// Cor da rede (rede de multiplicação) — conforme cadastro da igreja
export const REDES = ["Amarela", "Preta"] as const;

// Tipo de célula
export const TIPOS_CELULA = [
  "Feminina",
  "Masculina",
  "Feminina Jovem",
  "Masculina Jovem",
  "Infantil",
  "Geral",
] as const;

const opcional = z.string().optional().or(z.literal(""));

export const celulaSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  leader_name: opcional,
  cell_type: opcional,
  rede: opcional,
  // vínculos opcionais no sistema
  leader_id: z.string().uuid().optional().or(z.literal("")),
  co_leader_id: z.string().uuid().optional().or(z.literal("")),
  // reunião
  meeting_day: z.enum(DIAS).optional().or(z.literal("")),
  meeting_time: opcional,
  // localização
  city: opcional,
  neighborhood: opcional,
  address: opcional,
  latitude: opcional,
  longitude: opcional,
  photo_url: opcional,
  is_active: z.boolean(),
});

export type CelulaInput = z.infer<typeof celulaSchema>;
