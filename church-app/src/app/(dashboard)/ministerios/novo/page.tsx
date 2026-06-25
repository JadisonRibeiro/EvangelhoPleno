import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { MinisterioForm, type Lider } from "../_components/ministerio-form";

export default async function NovoMinisterioPage() {
  const supabase = await createClient();
  const { data: lideres } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("is_active", true)
    .order("full_name");

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Novo ministério"
        backHref="/ministerios"
        breadcrumb={[
          { label: "Início", href: "/dashboard" },
          { label: "Ministérios", href: "/ministerios" },
          { label: "Novo" },
        ]}
      />
      <MinisterioForm lideres={(lideres as Lider[]) ?? []} />
    </div>
  );
}
