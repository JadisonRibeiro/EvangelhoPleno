import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

/**
 * Card de módulo da Home — plano, sóbrio e elegante.
 * Layout horizontal (ícone · texto · chevron) que funciona igualmente bem
 * em coluna única no mobile e em grid no desktop. Sem vidro, sem gradiente.
 */
export function ModuleCard({
  href,
  label,
  description,
  icon: Icon,
  count,
}: {
  href: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  count?: number | string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3.5 rounded-2xl border bg-card p-4 ring-1 ring-transparent transition-colors duration-200 hover:border-foreground/15 hover:bg-accent/40"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
        <Icon className="size-5" strokeWidth={1.8} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{label}</p>
          {count != null && (
            <span
              className="text-xs font-medium text-muted-foreground"
              data-tabular
            >
              {count}
            </span>
          )}
        </div>
        {description && (
          <p className="truncate text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
    </Link>
  );
}
