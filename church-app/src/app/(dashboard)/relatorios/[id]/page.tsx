import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";

type RelatorioInfo = {
  meeting_date: string;
  total_members: number;
  total_visitors: number;
  had_conversions: boolean;
  cell: { name: string } | null;
  autor: { full_name: string } | null;
};

type Conversao = {
  person_name: string;
  person_phone: string | null;
};

function dataLabel(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR");
}

export default async function RelatorioDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: relData }, { data: convs }] = await Promise.all([
    supabase
      .from("cell_reports")
      .select(
        `meeting_date, total_members, total_visitors, had_conversions,
         cell:cells!cell_reports_cell_id_fkey(name),
         autor:profiles!cell_reports_reported_by_fkey(full_name)`,
      )
      .eq("id", id)
      .single(),
    supabase
      .from("cell_report_conversions")
      .select("person_name, person_phone")
      .eq("report_id", id),
  ]);

  if (!relData) notFound();
  const rel = relData as unknown as RelatorioInfo;
  const conversoes = (convs as Conversao[] | null) ?? [];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title={rel.cell?.name ?? "Célula"}
        description={`Reunião de ${dataLabel(rel.meeting_date)}${
          rel.autor ? ` · por ${rel.autor.full_name}` : ""
        }`}
        backHref="/relatorios"
        breadcrumb={[
          { label: "Início", href: "/dashboard" },
          { label: "Relatórios", href: "/relatorios" },
          { label: "Detalhe" },
        ]}
      />

      <div className="grid max-w-md gap-3 sm:grid-cols-2">
        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">Membros presentes</p>
          <p className="text-2xl font-semibold">{rel.total_members}</p>
        </div>
        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">Visitantes</p>
          <p className="text-2xl font-semibold">{rel.total_visitors}</p>
        </div>
      </div>

      <h2 className="mb-2 text-lg font-medium">
        Conversões ({conversoes.length})
      </h2>
      {conversoes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma conversão neste relatório.
        </p>
      ) : (
        <ul className="max-w-md divide-y rounded-md border">
          {conversoes.map((c, i) => (
            <li key={i} className="flex justify-between px-4 py-2">
              <span>{c.person_name}</span>
              <span className="text-muted-foreground">
                {c.person_phone ?? "—"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
