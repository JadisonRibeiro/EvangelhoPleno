import { z } from "zod";

export const STATUS_AMAR = ["novo", "em_contato", "em_celula", "inativo"] as const;
export type StatusAmar = (typeof STATUS_AMAR)[number];

export const STATUS_LABELS: Record<StatusAmar, string> = {
  novo: "Novo",
  em_contato: "Em contato",
  em_celula: "Em célula",
  inativo: "Inativo",
};

export const ORIGENS = ["culto", "celula", "evento", "outro"] as const;
export type OrigemAmar = (typeof ORIGENS)[number];

export const ORIGEM_LABELS: Record<OrigemAmar, string> = {
  culto: "Culto",
  celula: "Célula",
  evento: "Evento",
  outro: "Outro",
};

const opcional = z.string().optional().or(z.literal(""));

export const amarSchema = z.object({
  full_name: z.string().min(3, "Nome obrigatório"),
  phone: opcional,
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  birth_date: opcional,

  was_invited: z.boolean(),
  invited_by_name: opcional,

  conversion_source: z.enum(ORIGENS).optional().or(z.literal("")),
  conversion_date: opcional,
  service_date: opcional,

  has_been_in_cell: z.boolean(),
  cell_interest: z.boolean(),
  preferred_neighborhood: opcional,
  prayer_requests: opcional,

  assigned_to: z.string().uuid().optional().or(z.literal("")),
  status: z.enum(STATUS_AMAR),
  notes: opcional,
});

export type AmarInput = z.infer<typeof amarSchema>;
