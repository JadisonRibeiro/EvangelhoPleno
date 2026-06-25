import { createClient } from "@/lib/supabase/server";
import type { Cell } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { MembroForm } from "../_components/membro-form";

export default async function NovoMembroPage() {
  const supabase = await createClient();
  const { data: cells } = await supabase
    .from("cells")
    .select("id, name, is_active")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Novo membro"
        backHref="/membros"
        breadcrumb={[
          { label: "Início", href: "/dashboard" },
          { label: "Membros", href: "/membros" },
          { label: "Novo" },
        ]}
      />
      <MembroForm cells={(cells as Cell[]) ?? []} />
    </div>
  );
}
