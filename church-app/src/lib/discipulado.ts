// Configuração compartilhada entre Abrigo e Escola de Discípulo,
// que têm a mesma estrutura (turmas + alunos) com tabelas distintas.

export type TipoDiscipulado = "abrigo" | "escola";

export const DISCIPULADO = {
  abrigo: {
    label: "Abrigo",
    classesTable: "abrigo_classes",
    attendeesTable: "abrigo_attendees",
    totalDefault: 10,
    temEncontro: false,
  },
  escola: {
    label: "Escola de Discípulo",
    classesTable: "escola_classes",
    attendeesTable: "escola_attendees",
    totalDefault: 15,
    temEncontro: true,
  },
} as const;

export function isTipo(v: string): v is TipoDiscipulado {
  return v === "abrigo" || v === "escola";
}
