import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import type { MinisterioInput } from "@/lib/validations/ministerio";
import { MinisterioForm, type Lider } from "../../_components/ministerio-form";

export default async function EditarMinisterioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: ministerio }, { data: lideres }] = await Promise.all([
    supabase.from("ministries").select("*").eq("id", id).single(),
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("is_active", true)
      .order("full_name"),
  ]);

  if (!ministerio) notFound();

  const initial: Partial<MinisterioInput> = {
    name: ministerio.name,
    description: ministerio.description ?? "",
    leader_id: ministerio.leader_id ?? "",
    requires_schedule: ministerio.requires_schedule,
    is_active: ministerio.is_active,
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Editar ministério"
        description={ministerio.name}
        backHref="/ministerios"
        breadcrumb={[
          { label: "Início", href: "/dashboard" },
          { label: "Ministérios", href: "/ministerios" },
          { label: "Editar" },
        ]}
      />
      <MinisterioForm
        ministerioId={id}
        lideres={(lideres as Lider[]) ?? []}
        initial={initial}
      />
    </div>
  );
}
