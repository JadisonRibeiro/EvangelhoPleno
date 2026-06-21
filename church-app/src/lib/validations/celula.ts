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

const opcional = z.string().optional().or(z.literal(""));

export const celulaSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  leader_id: z.string().uuid().optional().or(z.literal("")),
  co_leader_id: z.string().uuid().optional().or(z.literal("")),
  meeting_day: z.enum(DIAS).optional().or(z.literal("")),
  meeting_time: opcional,
  address: opcional,
  neighborhood: opcional,
  is_active: z.boolean(),
});

export type CelulaInput = z.infer<typeof celulaSchema>;
