import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/** Monta a sequência de páginas com reticências (ex.: 1 … 4 5 6 … 20). */
function paginas(atual: number, total: number): (number | "…")[] {
  if (total <= 7)
    return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, atual, atual - 1, atual + 1]);
  const ordenadas = [...set]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const resultado: (number | "…")[] = [];
  let anterior = 0;
  for (const p of ordenadas) {
    if (p - anterior > 1) resultado.push("…");
    resultado.push(p);
    anterior = p;
  }
  return resultado;
}

/**
 * Paginação elegante — setas + números com reticências. Renderiza links
 * (server-friendly). `makeHref` gera a URL de cada página.
 */
export function Pagination({
  page,
  totalPages,
  makeHref,
  className,
}: {
  page: number;
  totalPages: number;
  makeHref: (p: number) => string;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const base =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm transition-colors";
  const inativo = cn(base, "text-muted-foreground hover:bg-muted hover:text-foreground");
  const ativo = cn(base, "bg-primary text-primary-foreground font-medium");
  const desabilitado = cn(
    buttonVariants({ variant: "outline", size: "icon-lg" }),
    "pointer-events-none opacity-40",
  );

  return (
    <nav
      aria-label="Paginação"
      className={cn("flex flex-wrap items-center justify-center gap-1", className)}
    >
      {page > 1 ? (
        <Link
          href={makeHref(page - 1)}
          aria-label="Página anterior"
          className={buttonVariants({ variant: "outline", size: "icon-lg" })}
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className={desabilitado} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
      )}

      {paginas(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span
            key={`e${i}`}
            className="px-1.5 text-sm text-muted-foreground"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={makeHref(p)}
            aria-current={p === page ? "page" : undefined}
            className={p === page ? ativo : inativo}
          >
            {p}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={makeHref(page + 1)}
          aria-label="Próxima página"
          className={buttonVariants({ variant: "outline", size: "icon-lg" })}
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={desabilitado} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
