import Link from "next/link";
import { Plus, ClipboardList, Heart, ArrowRight } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { ROLE_LABELS, type Role } from "@/lib/types";
import { MODULES } from "@/lib/nav";
import { ModuleCard } from "@/components/module-card";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

const ACOES = [
  { href: "/membros/novo", label: "Novo membro", icon: Plus },
  { href: "/relatorios/novo", label: "Novo relatório", icon: ClipboardList },
  { href: "/amar/novo", label: "Acolher novo", icon: Heart },
];

type Recente = { id: string; full_name: string };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: perfil },
    { count: membrosCount },
    { count: celulasCount },
    { count: ministeriosCount },
    { count: amarCount },
    { data: recentesData },
  ] = await Promise.all([
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
    supabase.from("ministries").select("*", { count: "exact", head: true }),
    supabase.from("amar_records").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id, full_name")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const role = (perfil?.role as Role) ?? "member";
  const primeiroNome = (perfil?.full_name ?? "").split(" ")[0];
  const recentes = (recentesData as Recente[] | null) ?? [];

  const stats = [
    { label: "Membros", value: membrosCount ?? 0 },
    { label: "Células ativas", value: celulasCount ?? 0 },
    { label: "Ministérios", value: ministeriosCount ?? 0 },
    { label: "Acolhimentos", value: amarCount ?? 0 },
  ];

  return (
    <div className="space-y-8 p-4 py-6 sm:p-6 sm:py-8">
      {/* Saudação + ações rápidas */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Olá{primeiroNome ? `, ${primeiroNome}` : ""}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {ROLE_LABELS[role]} · Evangelho Pleno
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ACOES.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <a.icon className="size-4" /> {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      {/* Módulos + atividade recente */}
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-3 lg:col-span-2">
          <h2 className="text-sm font-medium text-muted-foreground">Módulos</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {MODULES.map((m) => (
              <ModuleCard
                key={m.href}
                href={m.href}
                label={m.label}
                description={m.description}
                icon={m.icon}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Adicionados recentemente
          </h2>
          <Card className="gap-0 py-2">
            <CardContent className="px-2">
              {recentes.length === 0 ? (
                <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                  Nenhum membro ainda.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {recentes.map((r) => (
                    <li key={r.id}>
                      <Link
                        href={`/membros/${r.id}/editar`}
                        className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                          {r.full_name
                            .split(" ")
                            .filter(Boolean)
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">
                          {r.full_name}
                        </span>
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground/40" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
