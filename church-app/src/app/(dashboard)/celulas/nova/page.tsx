import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { CelulaForm, type Lider } from "../_components/celula-form";

export default async function NovaCelulaPage() {
  const supabase = await createClient();
  const { data: lideres } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("is_active", true)
    .order("full_name");

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Nova célula</h1>
        <Link href="/celulas" className={buttonVariants({ variant: "outline" })}>
          Voltar
        </Link>
      </div>
      <CelulaForm lideres={(lideres as Lider[]) ?? []} />
    </div>
  );
}
