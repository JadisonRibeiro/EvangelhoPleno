import { Users, Church, HeartHandshake } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { ROLE_LABELS, type Role } from "@/lib/types";
import { MODULES, MINISTERIOS } from "@/lib/nav";
import { Logo } from "@/components/logo";
import { ModuleCard } from "@/components/module-card";
import { SectionTitle } from "@/components/section-title";
import { AcoesTela } from "../_components/acoes-tela";

const NOME_IGREJA = "Evangelho Pleno";

function saudacao(hora: number) {
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

function dataPorExtenso() {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: perfil }, totalMembros, totalCelulas] = await Promise.all([
    user
      ? supabase
          .from("profiles")
          .select("full_name, role")
          .eq("user_id", user.id)
          .single()
      : Promise.resolve({ data: null }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("cells").select("*", { count: "exact", head: true }),
  ]);

  const role = (perfil?.role as Role) ?? "member";
  const primeiroNome = (perfil?.full_name ?? "").split(" ")[0];

  const stats = [
    { label: "Membros", value: totalMembros.count ?? 0, icon: Users },
    { label: "Células", value: totalCelulas.count ?? 0, icon: Church },
    { label: "Ministérios", value: MINISTERIOS.length, icon: HeartHandshake },
  ];

  return (
    <div className="space-y-8 p-4 py-6 sm:p-6 sm:py-8">
      {/* Header da igreja — identidade em destaque */}
      <section className="relative overflow-hidden rounded-3xl border bg-card ring-1 ring-foreground/5">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/[0.06] via-transparent to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-brand/10 blur-3xl" />

        {/* Ação de sair (a Home é a própria página inicial) */}
        <div className="absolute right-4 top-4 z-10">
          <AcoesTela inicio={false} />
        </div>

        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-5">
            <Logo imgClassName="h-14 sm:h-20" />
            <div>
              <p className="text-sm text-muted-foreground">
                {saudacao(new Date().getHours())}
                {primeiroNome ? `, ${primeiroNome}` : ""} · {ROLE_LABELS[role]}
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                Bem-vindo à {NOME_IGREJA}
              </h1>
              <p className="mt-1 text-sm capitalize text-muted-foreground">
                {dataPorExtenso()}
              </p>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:w-[26rem]">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border bg-background/60 p-4 backdrop-blur-sm"
              >
                <s.icon className="size-4 text-muted-foreground" />
                <p
                  className="mt-3 text-2xl font-semibold leading-none tracking-tight sm:text-3xl"
                  data-tabular
                >
                  {s.value}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Launcher de módulos */}
      <section className="space-y-4">
        <SectionTitle hint={`${MODULES.length} módulos`}>Módulos</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {MODULES.map((m) => (
            <ModuleCard
              key={m.href}
              href={m.href}
              label={m.label}
              description={m.description}
              image={m.image}
              icon={m.icon}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
