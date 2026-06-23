import Link from "next/link";
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
  ClipboardCheck,
  Plus,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ROLE_LABELS, type Role } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { LauncherTile } from "@/components/launcher-tile";

function isoDiasAtras(dias: number) {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d.toISOString().slice(0, 10);
}

function inicioDoMes() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

type PerfilJornada = {
  id: string;
  is_active: boolean;
  is_baptized: boolean;
  completed_abrigo: boolean;
  completed_escola_discipulo: boolean;
  did_encontro_com_deus: boolean;
};

async function VisaoAdmin() {
  const supabase = await createClient();
  const seteDias = isoDiasAtras(7);
  const mesInicio = inicioDoMes();

  const [
    { data: perfis },
    { data: celulas },
    { data: relatoriosSemana },
    { count: convertidosMes },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, is_active, is_baptized, completed_abrigo, completed_escola_discipulo, did_encontro_com_deus",
      ),
    supabase.from("cells").select("id, name").eq("is_active", true),
    supabase.from("cell_reports").select("cell_id").gte("meeting_date", seteDias),
    supabase
      .from("amar_records")
      .select("*", { count: "exact", head: true })
      .gte("created_at", mesInicio),
  ]);

  const membros = (perfis as PerfilJornada[] | null) ?? [];
  const ativos = membros.filter((m) => m.is_active);
  const cels = (celulas as { id: string; name: string }[] | null) ?? [];
  const reportadas = new Set(
    ((relatoriosSemana as { cell_id: string }[] | null) ?? []).map(
      (r) => r.cell_id,
    ),
  );
  const semRelatorio = cels.filter((c) => !reportadas.has(c.id));

  const total = ativos.length || 1;
  const jornada = [
    { label: "Batizados", n: ativos.filter((m) => m.is_baptized).length },
    { label: "Abrigo", n: ativos.filter((m) => m.completed_abrigo).length },
    {
      label: "Escola de Discípulo",
      n: ativos.filter((m) => m.completed_escola_discipulo).length,
    },
    {
      label: "Encontro com Deus",
      n: ativos.filter((m) => m.did_encontro_com_deus).length,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Membros ativos" value={ativos.length} icon={Users} />
        <StatCard label="Células ativas" value={cels.length} icon={Church} />
        <StatCard
          label="Relatórios (7 dias)"
          value={reportadas.size}
          icon={ClipboardCheck}
        />
        <StatCard
          label="Novos no mês"
          value={convertidosMes ?? 0}
          icon={Heart}
          hint="Ministério AMAR"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Jornada espiritual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {jornada.map((j) => {
              const pct = Math.round((j.n / total) * 100);
              return (
                <div key={j.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{j.label}</span>
                    <span className="font-medium" data-tabular>
                      {j.n}
                      <span className="text-muted-foreground">
                        {" "}
                        / {ativos.length}
                      </span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              Células sem relatório na semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            {semRelatorio.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Todas as células ativas reportaram nos últimos 7 dias. 🎉
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {semRelatorio.slice(0, 30).map((c) => (
                  <Badge key={c.id} variant="outline">
                    {c.name}
                  </Badge>
                ))}
                {semRelatorio.length > 30 && (
                  <Badge variant="secondary">
                    +{semRelatorio.length - 30}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

async function VisaoLiderCelula({ perfilId }: { perfilId: string }) {
  const supabase = await createClient();
  const { data: celulas } = await supabase
    .from("cells")
    .select("id, name")
    .or(`leader_id.eq.${perfilId},co_leader_id.eq.${perfilId}`);

  const cels = (celulas as { id: string; name: string }[] | null) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Minhas células</CardTitle>
        <CardAction>
          <Link
            href="/relatorios/novo"
            className={buttonVariants({ size: "sm" })}
          >
            <Plus className="size-4" /> Novo relatório
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {cels.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Você ainda não lidera nenhuma célula.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {cels.map((c) => (
              <Link
                key={c.id}
                href="/membros"
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <span className="font-medium">{c.name}</span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

async function VisaoLiderMinisterio({ perfilId }: { perfilId: string }) {
  const supabase = await createClient();
  const { data: ministerios } = await supabase
    .from("ministries")
    .select("id, name")
    .eq("leader_id", perfilId);

  const mins = (ministerios as { id: string; name: string }[] | null) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Meus ministérios</CardTitle>
      </CardHeader>
      <CardContent>
        {mins.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Você ainda não lidera nenhum ministério.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {mins.map((m) => (
              <Link
                key={m.id}
                href={`/ministerios/${m.id}`}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <span className="font-medium">{m.name}</span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

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
        .select("id, full_name, role")
        .eq("user_id", user!.id)
        .single(),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("cells")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
    ]);

  const role = (perfil?.role as Role) ?? "member";
  const nome = perfil?.full_name ?? "";
  const perfilId = perfil?.id as string | undefined;
  const primeiroNome = nome.split(" ")[0];

  const contagens: Record<string, number | undefined> = {
    membros: membrosCount ?? undefined,
    celulas: celulasCount ?? undefined,
  };

  return (
    <div className="space-y-8 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Olá{primeiroNome ? `, ${primeiroNome}` : ""} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {ROLE_LABELS[role]} · Bem-vindo ao Evangelho Pleno
        </p>
      </div>

      {/* Acesso rápido — navegação principal */}
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

      {(role === "admin" || role === "pastor") && (
        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight">Resumo</h2>
          <VisaoAdmin />
        </section>
      )}
      {role === "cell_leader" && perfilId && (
        <VisaoLiderCelula perfilId={perfilId} />
      )}
      {role === "ministry_leader" && perfilId && (
        <VisaoLiderMinisterio perfilId={perfilId} />
      )}
    </div>
  );
}
