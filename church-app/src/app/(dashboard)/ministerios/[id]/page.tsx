import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MembrosMinisterio,
  type MembroAtual,
  type Pessoa,
} from "../_components/membros-ministerio";

export default async function MinisterioDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: ministerio }, { data: membros }, { data: pessoas }] =
    await Promise.all([
      supabase.from("ministries").select("*").eq("id", id).single(),
      supabase
        .from("ministry_members")
        .select(
          `id, profile_id, is_couple_pair,
           membro:profiles!ministry_members_profile_id_fkey(full_name),
           parceiro:profiles!ministry_members_couple_partner_id_fkey(full_name)`,
        )
        .eq("ministry_id", id),
      supabase
        .from("profiles")
        .select("id, full_name")
        .eq("is_active", true)
        .order("full_name"),
    ]);

  if (!ministerio) notFound();

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{ministerio.name}</h1>
            {ministerio.requires_schedule && (
              <Badge variant="secondary">Gera escala</Badge>
            )}
          </div>
          {ministerio.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {ministerio.description}
            </p>
          )}
        </div>
        <Link href="/ministerios" className={buttonVariants({ variant: "outline" })}>
          Voltar
        </Link>
      </div>

      <div className="max-w-2xl">
        <MembrosMinisterio
          ministerioId={id}
          membros={(membros as MembroAtual[] | null) ?? []}
          pessoas={(pessoas as Pessoa[] | null) ?? []}
        />
      </div>
    </div>
  );
}
