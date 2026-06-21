// Tipos de domínio (espelham o schema do Supabase).
// Quando configurarmos a CLI, podem ser substituídos por tipos gerados.

export type Role =
  | "admin"
  | "pastor"
  | "cell_leader"
  | "ministry_leader"
  | "member";

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  city: string | null;
  birth_date: string | null;
  photo_url: string | null;
  cell_id: string | null;
  is_baptized: boolean;
  baptism_date: string | null;
  completed_abrigo: boolean;
  abrigo_completed_at: string | null;
  completed_escola_discipulo: boolean;
  escola_completed_at: string | null;
  did_encontro_com_deus: boolean;
  encontro_date: string | null;
  role: Role;
  is_active: boolean;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Cell {
  id: string;
  name: string;
  is_active: boolean;
}

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrador",
  pastor: "Pastor",
  cell_leader: "Líder de Célula",
  ministry_leader: "Líder de Ministério",
  member: "Membro",
};
