import Link from "next/link";
import type { LucideIcon } from "lucide-react";

/** Botão grande de navegação (estilo launcher de app). */
export function LauncherTile({
  href,
  label,
  icon: Icon,
  count,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  count?: string | number;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-5 text-center shadow-sm ring-1 ring-foreground/5 transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg sm:p-6"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-colors duration-200 group-hover:bg-brand group-hover:text-brand-foreground sm:size-16">
        <Icon className="size-7 sm:size-8" strokeWidth={1.75} />
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-medium leading-tight">{label}</p>
        {count != null && (
          <p className="text-xs text-muted-foreground" data-tabular>
            {count}
          </p>
        )}
      </div>
    </Link>
  );
}
