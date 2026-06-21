import Link from "next/link";
import { DISCIPULADO } from "@/lib/discipulado";

export default function DiscipuladoPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Discipulado</h1>
      <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
        {(["abrigo", "escola"] as const).map((tipo) => (
          <Link
            key={tipo}
            href={`/discipulado/${tipo}`}
            className="rounded-md border p-6 transition-colors hover:bg-muted"
          >
            <h2 className="text-lg font-medium">{DISCIPULADO[tipo].label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {DISCIPULADO[tipo].totalDefault} lições · gerir turmas e alunos
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
