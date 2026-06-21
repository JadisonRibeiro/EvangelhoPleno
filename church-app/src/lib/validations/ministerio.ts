import { z } from "zod";

const opcional = z.string().optional().or(z.literal(""));

export const ministerioSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  description: opcional,
  leader_id: z.string().uuid().optional().or(z.literal("")),
  requires_schedule: z.boolean(),
  is_active: z.boolean(),
});

export type MinisterioInput = z.infer<typeof ministerioSchema>;

export const membroMinisterioSchema = z
  .object({
    profile_id: z.string().uuid("Selecione um membro"),
    is_couple_pair: z.boolean(),
    couple_partner_id: z.string().uuid().optional().or(z.literal("")),
  })
  .refine(
    (d) => !d.is_couple_pair || (d.couple_partner_id && d.couple_partner_id !== ""),
    { message: "Selecione o parceiro do casal", path: ["couple_partner_id"] },
  );

export type MembroMinisterioInput = z.infer<typeof membroMinisterioSchema>;
