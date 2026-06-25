import { notFound } from "next/navigation";
import { DISCIPULADO, isTipo } from "@/lib/discipulado";
import { PageHeader } from "@/components/page-header";
import { TurmaForm } from "../../_components/turma-form";

export default async function NovaTurmaPage({
  params,
}: {
  params: Promise<{ tipo: string }>;
}) {
  const { tipo } = await params;
  if (!isTipo(tipo)) notFound();
  const cfg = DISCIPULADO[tipo];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Nova turma"
        description={cfg.label}
        backHref={`/discipulado/${tipo}`}
        breadcrumb={[
          { label: "Início", href: "/dashboard" },
          { label: "Discipulado", href: "/discipulado" },
          { label: cfg.label, href: `/discipulado/${tipo}` },
          { label: "Nova" },
        ]}
      />
      <TurmaForm
        tipo={tipo}
        temEncontro={cfg.temEncontro}
        totalDefault={cfg.totalDefault}
      />
    </div>
  );
}
