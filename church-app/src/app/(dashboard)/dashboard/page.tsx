import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ROLE_LABELS, type Role } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

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
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Membros ativos" value={ativos.length} />
        <StatCard label="Células ativas" value={cels.length} />
        <StatCard
          label="Relatórios (7 dias)"
          value={reportadas.size}
        />
        <StatCard label="Novos no mês (AMAR)" value={convertidosMes ?? 0} />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-medium">Jornada espiritual</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {jornada.map((j) => (
            <div key={j.label} className="rounded-md border p-4">
              <p className="text-sm text-muted-foreground">{j.label}</p>
              <p className="text-xl font-semibold">
                {j.n}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  / {ativos.length}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">
          Células sem relatório na semana
        </h2>
        {semRelatorio.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todas as células ativas reportaram nos últimos 7 dias. 🎉
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {semRelatorio.map((c) => (
              <Badge key={c.id} variant="outline">
                {c.name}
              </Badge>
            ))}
          </div>
        )}
      </section>
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
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Minhas células</h2>
        <Link href="/relatorios/novo" className={buttonVariants({ size: "sm" })}>
          Novo relatório
        </Link>
      </div>
      {cels.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Você ainda não lidera nenhuma célula.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {cels.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-md border p-4"
            >
              <span className="font-medium">{c.name}</span>
              <Link
                href="/membros"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Membros
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
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
    <section className="space-y-3">
      <h2 className="text-lg font-medium">Meus ministérios</h2>
      {mins.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Você ainda não lidera nenhum ministério.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {mins.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-md border p-4"
            >
              <span className="font-medium">{m.name}</span>
              <Link
                href={`/ministerios/${m.id}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Abrir
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: perfil } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("user_id", user!.id)
    .single();

  const role = (perfil?.role as Role) ?? "member";
  const nome = perfil?.full_name ?? "";
  const perfilId = perfil?.id as string | undefined;

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">
          Olá{nome ? `, ${nome}` : ""} 👋
        </h1>
        <p className="text-sm text-muted-foreground">{ROLE_LABELS[role]}</p>
      </header>

      {(role === "admin" || role === "pastor") && <VisaoAdmin />}
      {role === "cell_leader" && perfilId && (
        <VisaoLiderCelula perfilId={perfilId} />
      )}
      {role === "ministry_leader" && perfilId && (
        <VisaoLiderMinisterio perfilId={perfilId} />
      )}
      {role === "member" && (
        <p className="text-sm text-muted-foreground">
          Bem-vindo! Use o menu acima para navegar.
        </p>
      )}
    </div>
  );
}
