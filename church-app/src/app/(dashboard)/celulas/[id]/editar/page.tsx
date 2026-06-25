import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import type { CelulaInput } from "@/lib/validations/celula";
import { CelulaForm, type Lider } from "../../_components/celula-form";

export default async function EditarCelulaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: celula }, { data: lideres }] = await Promise.all([
    supabase.from("cells").select("*").eq("id", id).single(),
    supabase.from("profiles").select("id, full_name").eq("is_active", true).order("full_name"),
  ]);

  if (!celula) notFound();

  const initial: Partial<CelulaInput> = {
    name: celula.name,
    leader_name: celula.leader_name ?? "",
    cell_type: celula.cell_type ?? "",
    rede: celula.rede ?? "",
    leader_id: celula.leader_id ?? "",
    co_leader_id: celula.co_leader_id ?? "",
    meeting_day: (celula.meeting_day ?? "") as CelulaInput["meeting_day"],
    meeting_time: celula.meeting_time ? celula.meeting_time.slice(0, 5) : "",
    city: celula.city ?? "",
    neighborhood: celula.neighborhood ?? "",
    address: celula.address ?? "",
    latitude: celula.latitude != null ? String(celula.latitude) : "",
    longitude: celula.longitude != null ? String(celula.longitude) : "",
    photo_url: celula.photo_url ?? "",
    is_active: celula.is_active,
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Editar célula"
        description={celula.name}
        backHref="/celulas"
        breadcrumb={[
          { label: "Início", href: "/dashboard" },
          { label: "Células", href: "/celulas" },
          { label: "Editar" },
        ]}
      />
      <CelulaForm
        celulaId={id}
        lideres={(lideres as Lider[]) ?? []}
        initial={initial}
      />
    </div>
  );
}
