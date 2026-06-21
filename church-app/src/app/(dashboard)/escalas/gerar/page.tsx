import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { GerarEscala, type Ministerio } from "../_components/gerar-escala";

export default async function GerarEscalaPage() {
  const supabase = await createClient();
  const { data: ministerios } = await supabase
    .from("ministries")
    .select("id, name")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Gerar escala</h1>
        <Link href="/escalas" className={buttonVariants({ variant: "outline" })}>
          Voltar
        </Link>
      </div>
      <GerarEscala ministerios={(ministerios as Ministerio[]) ?? []} />
    </div>
  );
}
