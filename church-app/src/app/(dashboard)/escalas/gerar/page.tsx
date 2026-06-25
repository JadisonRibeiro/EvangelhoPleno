import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { GerarEscala, type Ministerio } from "../_components/gerar-escala";

export default async function GerarEscalaPage() {
  const supabase = await createClient();
  const { data: ministerios } = await supabase
    .from("ministries")
    .select("id, name")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Gerar escala"
        backHref="/escalas"
        breadcrumb={[
          { label: "Início", href: "/dashboard" },
          { label: "Escalas", href: "/escalas" },
          { label: "Gerar" },
        ]}
      />
      <GerarEscala ministerios={(ministerios as Ministerio[]) ?? []} />
    </div>
  );
}
