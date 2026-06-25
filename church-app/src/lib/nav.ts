import {
  Users,
  Church,
  MapPin,
  ClipboardList,
  HeartHandshake,
  CalendarDays,
  GraduationCap,
  Heart,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  /** Descrição curta exibida em cards/menus. */
  description?: string;
  icon: LucideIcon;
};

/**
 * Fonte única de navegação dos módulos.
 * Reaproveitada pela topbar (menu), pela barra inferior (mobile) e pelo
 * grid da Home — evitando listas duplicadas e divergentes.
 */
export const MODULES: NavItem[] = [
  {
    href: "/membros",
    label: "Membros",
    description: "Cadastro e jornada espiritual",
    icon: Users,
  },
  {
    href: "/celulas",
    label: "Células",
    description: "Grupos e lideranças",
    icon: Church,
  },
  {
    href: "/celulas/mapa",
    label: "Mapa de Células",
    description: "Distribuição geográfica",
    icon: MapPin,
  },
  {
    href: "/relatorios",
    label: "Relatórios",
    description: "Encontros semanais",
    icon: ClipboardList,
  },
  {
    href: "/ministerios",
    label: "Ministérios",
    description: "Equipes e serviço",
    icon: HeartHandshake,
  },
  {
    href: "/escalas",
    label: "Escalas",
    description: "Organização mensal",
    icon: CalendarDays,
  },
  {
    href: "/discipulado",
    label: "Discipulado",
    description: "Abrigo e Escola",
    icon: GraduationCap,
  },
  {
    href: "/amar",
    label: "AMAR",
    description: "Acolhimento de novos",
    icon: Heart,
  },
];

/** Destinos primários da barra inferior no mobile (máx. 4 + Início). */
export const PRIMARY: NavItem[] = [
  { href: "/dashboard", label: "Início", icon: LayoutGrid },
  MODULES[0], // Membros
  MODULES[1], // Células
  MODULES[3], // Relatórios
];

/** Rótulo da seção atual a partir do pathname (para breadcrumb da topbar). */
export function secaoAtual(pathname: string): NavItem | null {
  if (pathname === "/dashboard") return null;
  // Casa o prefixo mais específico primeiro (ex.: /celulas/mapa antes de /celulas)
  const ordenado = [...MODULES].sort((a, b) => b.href.length - a.href.length);
  return ordenado.find((m) => pathname.startsWith(m.href)) ?? null;
}
