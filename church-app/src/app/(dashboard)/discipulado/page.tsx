import Link from "next/link";
import { GraduationCap, BookOpen, ArrowRight } from "lucide-react";
import { DISCIPULADO } from "@/lib/discipulado";
import { PageHeader } from "@/components/page-header";

const ICONES = { abrigo: BookOpen, escola: GraduationCap } as const;

export default function DiscipuladoPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Discipulado"
        description="Gestão de turmas do Abrigo e da Escola de Discípulo"
      />
      <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
        {(["abrigo", "escola"] as const).map((tipo) => {
          const Icon = ICONES[tipo];
          return (
            <Link
              key={tipo}
              href={`/discipulado/${tipo}`}
              className="group flex items-start gap-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10 transition-colors hover:bg-muted/50"
            >
              <div className="flex size-11 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Icon className="size-5" />
              </div>
              <div className="flex-1">
                <h2 className="font-medium">{DISCIPULADO[tipo].label}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {DISCIPULADO[tipo].totalDefault} lições · turmas e alunos
                </p>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
