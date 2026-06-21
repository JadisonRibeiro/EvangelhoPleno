import { z } from "zod";

export const conversaoSchema = z.object({
  person_name: z.string().min(2, "Nome obrigatório"),
  person_phone: z.string().optional().or(z.literal("")),
});

export const relatorioSchema = z
  .object({
    cell_id: z.string().uuid("Selecione a célula"),
    meeting_date: z.string().min(1, "Informe a data"),
    total_members: z.number().int().min(0, "Inválido"),
    total_visitors: z.number().int().min(0, "Inválido"),
    had_conversions: z.boolean(),
    conversions: z.array(conversaoSchema),
  })
  .refine((d) => !d.had_conversions || d.conversions.length > 0, {
    message: "Adicione ao menos um convertido",
    path: ["conversions"],
  });

export type RelatorioInput = z.infer<typeof relatorioSchema>;
