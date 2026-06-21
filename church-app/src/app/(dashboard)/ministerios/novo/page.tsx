import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { MinisterioForm, type Lider } from "../_components/ministerio-form";

export default async function NovoMinisterioPage() {
  const supabase = await createClient();
  const { data: lideres } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("is_active", true)
    .order("full_name");

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Novo ministério</h1>
        <Link href="/ministerios" className={buttonVariants({ variant: "outline" })}>
          Voltar
        </Link>
      </div>
      <MinisterioForm lideres={(lideres as Lider[]) ?? []} />
    </div>
  );
}
