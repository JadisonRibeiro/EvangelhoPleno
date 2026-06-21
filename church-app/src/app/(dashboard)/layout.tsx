import { createClient } from "@/lib/supabase/server";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { AppHeader } from "./_components/app-header";
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
    <SidebarProvider>
      <AppSidebar nome={nome} role={role} />
      <SidebarInset>
        <AppHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
