import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { CelulaForm, type Lider } from "../_components/celula-form";

export default async function NovaCelulaPage() {
  const supabase = await createClient();
  const { data: lideres } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("is_active", true)
    .order("full_name");

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Nova célula"
        backHref="/celulas"
        breadcrumb={[
          { label: "Início", href: "/dashboard" },
          { label: "Células", href: "/celulas" },
          { label: "Nova" },
        ]}
      />
      <CelulaForm lideres={(lideres as Lider[]) ?? []} />
    </div>
  );
}
