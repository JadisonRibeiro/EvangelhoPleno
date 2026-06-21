import Link from "next/link";
import { notFound } from "next/navigation";
import { DISCIPULADO, isTipo } from "@/lib/discipulado";
import { buttonVariants } from "@/components/ui/button";
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
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Nova turma — {cfg.label}</h1>
        <Link
          href={`/discipulado/${tipo}`}
          className={buttonVariants({ variant: "outline" })}
        >
          Voltar
        </Link>
      </div>
      <TurmaForm
        tipo={tipo}
        temEncontro={cfg.temEncontro}
        totalDefault={cfg.totalDefault}
      />
    </div>
  );
}
