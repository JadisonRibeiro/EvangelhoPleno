import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { AmarForm, type Pessoa } from "../_components/amar-form";

export default async function NovoAmarPage() {
  const supabase = await createClient();
  const { data: pessoas } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("is_active", true)
    .order("full_name");

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Novo cadastro — AMAR</h1>
        <Link href="/amar" className={buttonVariants({ variant: "outline" })}>
          Voltar
        </Link>
      </div>
      <AmarForm pessoas={(pessoas as Pessoa[]) ?? []} />
    </div>
  );
}
