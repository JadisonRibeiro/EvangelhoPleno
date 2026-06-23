import { createClient } from "@/lib/supabase/server";
import { AppTopbar } from "./_components/app-topbar";
import { type Role } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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

  const nome = perfil?.full_name ?? "Usuário";
  const role = (perfil?.role as Role) ?? "member";

  return (
    <div className="flex min-h-screen flex-col">
      <AppTopbar nome={nome} role={role} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
