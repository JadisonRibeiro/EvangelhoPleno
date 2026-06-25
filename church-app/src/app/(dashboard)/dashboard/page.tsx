import { createClient } from "@/lib/supabase/server";
import { ROLE_LABELS, type Role } from "@/lib/types";
import { MODULES } from "@/lib/nav";
import { ModuleCard } from "@/components/module-card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: perfil } = user
    ? await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("user_id", user.id)
        .single()
    : { data: null };

  const role = (perfil?.role as Role) ?? "member";
  const primeiroNome = (perfil?.full_name ?? "").split(" ")[0];

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] flex-col justify-center gap-8 p-4 py-8 sm:min-h-[calc(100svh-4rem)] sm:p-6 sm:py-10">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Olá{primeiroNome ? `, ${primeiroNome}` : ""}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {ROLE_LABELS[role]} · Evangelho Pleno
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {MODULES.map((m) => (
          <ModuleCard key={m.href} href={m.href} label={m.label} icon={m.icon} />
        ))}
      </div>
    </div>
  );
}
