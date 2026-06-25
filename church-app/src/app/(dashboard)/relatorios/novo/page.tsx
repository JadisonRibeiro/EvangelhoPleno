import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { RelatorioForm, type Celula } from "../_components/relatorio-form";

export default async function NovoRelatorioPage() {
  const supabase = await createClient();
  const { data: celulas } = await supabase
    .from("cells")
    .select("id, name")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Novo relatório de célula"
        backHref="/relatorios"
        breadcrumb={[
          { label: "Início", href: "/dashboard" },
          { label: "Relatórios", href: "/relatorios" },
          { label: "Novo" },
        ]}
      />
      <RelatorioForm celulas={(celulas as Celula[]) ?? []} />
    </div>
  );
}
