import { Users, Church, HeartHandshake } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { ROLE_LABELS, type Role } from "@/lib/types";
import { MODULES, MINISTERIOS } from "@/lib/nav";
import { Logo } from "@/components/logo";
import { ModuleCard } from "@/components/module-card";
import { AcoesTela } from "../_components/acoes-tela";
import { Relogio } from "../_components/relogio";
import { RedesSociais } from "../_components/redes-sociais";

function saudacao(hora: number) {
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: perfil }, totalMembros, celulasAtivas] = await Promise.all([
    user
      ? supabase
          .from("profiles")
          .select("full_name, role")
          .eq("user_id", user.id)
          .single()
      : Promise.resolve({ data: null }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("cells")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  const role = (perfil?.role as Role) ?? "member";
  const primeiroNome = (perfil?.full_name ?? "").split(" ")[0];

  const stats = [
    {
      label: "Membros",
      value: (totalMembros.count ?? 0).toLocaleString("pt-BR"),
      icon: Users,
    },
    {
      label: "Células ativas",
      value: (celulasAtivas.count ?? 0).toLocaleString("pt-BR"),
      icon: Church,
    },
    {
      label: "Ministérios",
      value: MINISTERIOS.length.toLocaleString("pt-BR"),
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="space-y-8 p-4 py-6 sm:p-6 sm:py-8">
      {/* Faixa superior — fina e executiva: relógio em cima, identidade e
          indicadores embaixo. Acabamento metálico em cinza/branco. */}
      <section className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-[#2E2E2E]/70 via-card to-card ring-1 ring-foreground/5">
        {/* Reflexos: linha de luz no topo + brilho difuso à direita */}
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />
        <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-white/6 blur-3xl" />

        {/* Linha 1 — data e hora à esquerda; redes sociais e sair à direita */}
        <div className="relative flex items-center justify-between gap-3 border-b border-white/6 px-4 py-2 sm:px-6">
          <Relogio />
          <div className="flex shrink-0 items-center gap-2">
            <RedesSociais />
            <div className="h-5 w-px bg-white/10" />
            <AcoesTela inicio={false} />
          </div>
        </div>

        {/* Linha 2 — logo + saudação | indicadores */}
        <div className="relative flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Logo imgClassName="h-10 sm:h-12" />
            <div className="hidden h-9 w-px shrink-0 bg-white/10 sm:block" />
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
                {saudacao(new Date().getHours())}
                {primeiroNome ? `, ${primeiroNome}` : ""}!
              </h1>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {ROLE_LABELS[role]}
              </p>
            </div>
          </div>

          {/* Indicadores em linha — conteúdo centralizado, fundo cinza */}
          <div className="grid shrink-0 grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10 bg-[#2E2E2E]/80">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex min-w-0 flex-col items-center justify-center px-4 py-2.5 text-center sm:px-5"
              >
                <p className="flex items-center justify-center gap-1.5 truncate text-[11px] text-muted-foreground">
                  <s.icon className="size-3.5 shrink-0" />
                  {s.label}
                </p>
                <p
                  className="mt-1 text-lg font-semibold leading-none tracking-tight sm:text-xl"
                  data-tabular
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Botões de módulos e ministérios — grade única, sem títulos */}
      <section>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">
          {[...MODULES, ...MINISTERIOS].map((m) => (
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
