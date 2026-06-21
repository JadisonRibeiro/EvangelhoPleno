import { z } from "zod";

export const turmaSchema = z.object({
  start_date: z.string().min(1, "Informe a data de início"),
  end_date: z.string().optional().or(z.literal("")),
  total_lessons: z.number().int().min(1, "Mínimo 1 lição"),
  is_open: z.boolean(),
  encontro_reference: z.string().optional().or(z.literal("")),
});

export type TurmaInput = z.infer<typeof turmaSchema>;
