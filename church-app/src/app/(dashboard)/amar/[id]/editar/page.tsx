import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import type { AmarInput } from "@/lib/validations/amar";
import { AmarForm, type Pessoa } from "../../_components/amar-form";

export default async function EditarAmarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: registro }, { data: pessoas }] = await Promise.all([
    supabase.from("amar_records").select("*").eq("id", id).single(),
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("is_active", true)
      .order("full_name"),
  ]);

  if (!registro) notFound();

  const initial: Partial<AmarInput> = {
    full_name: registro.full_name,
    phone: registro.phone ?? "",
    email: registro.email ?? "",
    birth_date: registro.birth_date ?? "",
    was_invited: registro.was_invited,
    invited_by_name: registro.invited_by_name ?? "",
    conversion_source: (registro.conversion_source ??
      "") as AmarInput["conversion_source"],
    conversion_date: registro.conversion_date ?? "",
    service_date: registro.service_date ?? "",
    has_been_in_cell: registro.has_been_in_cell,
    cell_interest: registro.cell_interest,
    preferred_neighborhood: registro.preferred_neighborhood ?? "",
    prayer_requests: registro.prayer_requests ?? "",
    assigned_to: registro.assigned_to ?? "",
    status: registro.status,
    notes: registro.notes ?? "",
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Editar cadastro — AMAR</h1>
        <Link href="/amar" className={buttonVariants({ variant: "outline" })}>
          Voltar
        </Link>
      </div>
      <AmarForm
        amarId={id}
        pessoas={(pessoas as Pessoa[]) ?? []}
        initial={initial}
      />
    </div>
  );
}
