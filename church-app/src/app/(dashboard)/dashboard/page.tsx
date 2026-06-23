import {
  Users,
  Church,
  MapPin,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  CalendarDays,
  ClipboardList,
  Heart,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ROLE_LABELS, type Role } from "@/lib/types";
import { LauncherTile } from "@/components/launcher-tile";

const ATALHOS = [
  { href: "/membros", label: "Membros", icon: Users, key: "membros" },
  { href: "/celulas", label: "Células", icon: Church, key: "celulas" },
  { href: "/celulas/mapa", label: "Mapa de Células", icon: MapPin },
  { href: "/discipulado/abrigo", label: "Abrigo", icon: BookOpen },
  {
    href: "/discipulado/escola",
    label: "Escola de Discípulo",
    icon: GraduationCap,
  },
  { href: "/ministerios", label: "Ministérios", icon: HeartHandshake },
  { href: "/escalas", label: "Escalas", icon: CalendarDays },
  { href: "/relatorios", label: "Relatórios", icon: ClipboardList },
  { href: "/amar", label: "AMAR", icon: Heart },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: perfil }, { count: membrosCount }, { count: celulasCount }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, role")
        .eq("user_id", user!.id)
        .single(),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("cells")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
    ]);

  const role = (perfil?.role as Role) ?? "member";
  const primeiroNome = (perfil?.full_name ?? "").split(" ")[0];

  const contagens: Record<string, number | undefined> = {
    membros: membrosCount ?? undefined,
    celulas: celulasCount ?? undefined,
  };

  return (
    <div className="relative min-h-full overflow-hidden p-4 sm:p-6">
      {/* Fundo desfocado para o efeito espelhado dos tiles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-16 size-96 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute right-0 top-1/4 size-96 rounded-full bg-indigo-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 size-80 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Olá{primeiroNome ? `, ${primeiroNome}` : ""} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ROLE_LABELS[role]} · Bem-vindo ao Evangelho Pleno
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {ATALHOS.map((a) => (
            <LauncherTile
              key={a.href}
              href={a.href}
              label={a.label}
              icon={a.icon}
              count={a.key ? contagens[a.key] : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
