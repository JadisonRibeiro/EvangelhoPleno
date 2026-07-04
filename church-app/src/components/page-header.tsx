import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AcoesTela } from "@/app/(dashboard)/_components/acoes-tela";

export type Crumb = { label: string; href?: string };

/**
 * Cabeçalho padronizado de página.
 * Garante a regra de navegação do app: toda tela interna tem
 * voltar + breadcrumb + título, com hierarquia e espaçamento consistentes.
 *
 * - `backHref`: mostra o botão voltar (← ) à esquerda do título.
 * - `breadcrumb`: trilha de navegação acima do título.
 * - `children`: ações à direita (ex.: botão "Novo").
 */
export function PageHeader({
  title,
  description,
  backHref,
  breadcrumb,
  children,
}: {
  title: string;
  description?: string;
  backHref?: string;
  breadcrumb?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <div className="space-y-4">
      {/* Utilitário de tela: trilha + ações fixas (Início / Sair) */}
      <div className="flex items-center justify-between gap-2">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav
            aria-label="Trilha de navegação"
            className="flex min-w-0 flex-wrap items-center gap-1 text-xs text-muted-foreground"
          >
            {breadcrumb.map((c, i) => {
              const ultimo = i === breadcrumb.length - 1;
              return (
                <span key={`${c.label}-${i}`} className="flex items-center gap-1">
                  {i > 0 && (
                    <ChevronRight className="size-3.5 text-muted-foreground/50" />
                  )}
                  {c.href && !ultimo ? (
                    <Link
                      href={c.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span className={cn(ultimo && "text-foreground")}>
                      {c.label}
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
        ) : (
          <span />
        )}
        <AcoesTela />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          {backHref && (
            <Link
              href={backHref}
              aria-label="Voltar"
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "mt-0.5 size-9 shrink-0 rounded-full",
              )}
            >
              <ChevronLeft className="size-4" />
            </Link>
          )}
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {children && (
          <div className="flex flex-wrap items-center gap-2">{children}</div>
        )}
      </div>
    </div>
  );
}
