import Link from "next/link";
import type { LucideIcon } from "lucide-react";

/** Botão grande de navegação em estilo vidro/espelhado (launcher de app). */
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
      className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-white/50 bg-white/55 p-5 shadow-lg ring-1 ring-black/5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:bg-white/75 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/5 dark:hover:bg-white/[0.1] sm:p-6"
    >
      {/* brilho superior (efeito espelhado) */}
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/20" />
      <div className="flex size-14 items-center justify-center rounded-2xl bg-brand/15 text-brand transition-colors duration-200 group-hover:bg-brand group-hover:text-brand-foreground sm:size-16">
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
