import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { AmarForm, type Pessoa } from "../_components/amar-form";

export default async function NovoAmarPage() {
  const supabase = await createClient();
  const { data: pessoas } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("is_active", true)
    .order("full_name");

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Novo cadastro"
        description="Ministério AMAR"
        backHref="/amar"
        breadcrumb={[
          { label: "Início", href: "/dashboard" },
          { label: "AMAR", href: "/amar" },
          { label: "Novo" },
        ]}
      />
      <AmarForm pessoas={(pessoas as Pessoa[]) ?? []} />
    </div>
  );
}
