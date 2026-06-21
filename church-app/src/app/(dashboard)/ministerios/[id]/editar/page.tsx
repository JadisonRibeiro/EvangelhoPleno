import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
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
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Editar ministério</h1>
        <Link href="/ministerios" className={buttonVariants({ variant: "outline" })}>
          Voltar
        </Link>
      </div>
      <MinisterioForm
        ministerioId={id}
        lideres={(lideres as Lider[]) ?? []}
        initial={initial}
      />
    </div>
  );
}
