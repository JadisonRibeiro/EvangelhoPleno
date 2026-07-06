import {
  Users,
  Church,
  MapPin,
  ClipboardList,
  BookOpen,
  Tent,
  Heart,
  Link2,
  HandHeart,
  Flame,
  Sparkles,
  Baby,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  /** Descrição curta exibida em cards/menus. */
  description?: string;
  icon: LucideIcon;
  /** Imagem ilustrativa (placeholder) exibida nos cards da Home. */
  image?: string;
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
    image: "/images/modules/membros.webp",
  },
  {
    href: "/celulas",
    label: "Células",
    description: "Grupos e lideranças",
    icon: Church,
    image: "/images/modules/celulas.webp",
  },
  {
    href: "/celulas/mapa",
    label: "Mapa de Células",
    description: "Distribuição geográfica",
    icon: MapPin,
    image: "/images/modules/mapa.webp",
  },
  {
    href: "/relatorios",
    label: "Relatório de Células",
    description: "Encontros semanais",
    icon: ClipboardList,
    image: "/images/modules/relatorios.webp",
  },
  {
    href: "/discipulado/abrigo",
    label: "Abrigo",
    description: "Primeiros passos na fé",
    icon: Tent,
    image: "/images/modules/abrigo.webp",
  },
  {
    href: "/discipulado/escola",
    label: "Escola de Discípulos",
    description: "Formação e discipulado",
    icon: BookOpen,
    image: "/images/modules/escola.webp",
  },
];

/**
 * Ministérios da igreja — abertos diretamente pelos botões da Home
 * (não existe mais tela intermediária de Ministérios).
 * "Amar" já possui fluxo completo; os demais abrem uma tela de apresentação
 * ("em breve") até que cada gestão seja definida.
 */
export const MINISTERIOS: NavItem[] = [
  {
    href: "/amar",
    label: "Amar",
    description: "Acolhimento de novos convertidos",
    icon: Heart,
    image: "/images/ministerios/amar.svg",
  },
  {
    href: "/ministerios/consolidar",
    label: "Consolidar",
    description: "Firmar os novos na fé",
    icon: Link2,
    image: "/images/ministerios/consolidar.svg",
  },
  {
    href: "/ministerios/acolher",
    label: "Acolher",
    description: "Recepção e hospitalidade",
    icon: HandHeart,
    image: "/images/ministerios/acolher.svg",
  },
  {
    href: "/ministerios/fgy",
    label: "FGY",
    description: "Ministério de Jovens",
    icon: Flame,
    image: "/images/ministerios/fgy.webp",
  },
  {
    href: "/ministerios/fgt",
    label: "FGT",
    description: "Ministério de Adolescentes",
    icon: Sparkles,
    image: "/images/ministerios/fgt.webp",
  },
  {
    href: "/ministerios/kids",
    label: "Kids",
    description: "Ministério infantil",
    icon: Baby,
    image: "/images/ministerios/kids.svg",
  },
];

/** Destinos primários da barra inferior no mobile (máx. 4 + Início). */
export const PRIMARY: NavItem[] = [
  { href: "/dashboard", label: "Início", icon: LayoutGrid },
  MODULES[0], // Membros
  MODULES[1], // Células
  MODULES[3], // Relatórios
];
