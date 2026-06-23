import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import type { MembroInput } from "@/lib/validations/membro";
import type { Cell } from "@/lib/types";
import { MembroForm } from "../../_components/membro-form";

export default async function EditarMembroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: membro }, { data: cells }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).single(),
    supabase
      .from("cells")
      .select("id, name, is_active")
      .eq("is_active", true)
      .order("name"),
  ]);

  if (!membro) notFound();

  const initial: Partial<MembroInput> = {
    full_name: membro.full_name,
    phone: membro.phone ?? "",
    city: membro.city ?? "",
    address: membro.address ?? "",
    neighborhood: membro.neighborhood ?? "",
    birth_date: membro.birth_date ?? "",
    cell_id: membro.cell_id ?? "",
    role: membro.role,
    is_baptized: membro.is_baptized,
    baptism_date: membro.baptism_date ?? "",
    completed_abrigo: membro.completed_abrigo,
    abrigo_completed_at: membro.abrigo_completed_at ?? "",
    completed_escola_discipulo: membro.completed_escola_discipulo,
    escola_completed_at: membro.escola_completed_at ?? "",
    did_encontro_com_deus: membro.did_encontro_com_deus,
    encontro_date: membro.encontro_date ?? "",
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader title="Editar membro" description={membro.full_name}>
        <Link href="/membros" className={buttonVariants({ variant: "outline" })}>
          Voltar
        </Link>
      </PageHeader>
      <MembroForm
        cells={(cells as Cell[]) ?? []}
        membroId={id}
        initial={initial}
      />
    </div>
  );
}
