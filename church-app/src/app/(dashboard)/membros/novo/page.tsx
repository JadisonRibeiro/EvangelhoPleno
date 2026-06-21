import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Cell } from "@/lib/types";
import { MembroForm } from "../_components/membro-form";
import { buttonVariants } from "@/components/ui/button";

export default async function NovoMembroPage() {
  const supabase = await createClient();
  const { data: cells } = await supabase
    .from("cells")
    .select("id, name, is_active")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Novo membro</h1>
        <Link href="/membros" className={buttonVariants({ variant: "outline" })}>
          Voltar
        </Link>
      </div>
      <MembroForm cells={(cells as Cell[]) ?? []} />
    </div>
  );
}
