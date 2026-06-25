import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
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
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title={ministerio.name}
        description={ministerio.description ?? undefined}
        backHref="/ministerios"
        breadcrumb={[
          { label: "Início", href: "/dashboard" },
          { label: "Ministérios", href: "/ministerios" },
          { label: "Membros" },
        ]}
      >
        {ministerio.requires_schedule && (
          <Badge variant="secondary">Gera escala</Badge>
        )}
      </PageHeader>

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
