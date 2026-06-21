import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { RelatorioForm, type Celula } from "../_components/relatorio-form";

export default async function NovoRelatorioPage() {
  const supabase = await createClient();
  const { data: celulas } = await supabase
    .from("cells")
    .select("id, name")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Novo relatório de célula</h1>
        <Link href="/relatorios" className={buttonVariants({ variant: "outline" })}>
          Voltar
        </Link>
      </div>
      <RelatorioForm celulas={(celulas as Celula[]) ?? []} />
    </div>
  );
}
