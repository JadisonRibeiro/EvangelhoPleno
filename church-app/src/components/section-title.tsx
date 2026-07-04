import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Título de seção — pequena etiqueta hierárquica para dividir blocos de
 * conteúdo dentro de uma página (ex.: "Ministérios", "Indicadores").
 */
export function SectionTitle({
  children,
  hint,
  className,
}: {
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-3", className)}>
      <h2 className="text-sm font-semibold tracking-tight text-foreground">
        {children}
      </h2>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}
