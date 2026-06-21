import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
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
    leader_id: celula.leader_id ?? "",
    co_leader_id: celula.co_leader_id ?? "",
    meeting_day: (celula.meeting_day ?? "") as CelulaInput["meeting_day"],
    meeting_time: celula.meeting_time ? celula.meeting_time.slice(0, 5) : "",
    address: celula.address ?? "",
    neighborhood: celula.neighborhood ?? "",
    is_active: celula.is_active,
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Editar célula</h1>
        <Link href="/celulas" className={buttonVariants({ variant: "outline" })}>
          Voltar
        </Link>
      </div>
      <CelulaForm
        celulaId={id}
        lideres={(lideres as Lider[]) ?? []}
        initial={initial}
      />
    </div>
  );
}
