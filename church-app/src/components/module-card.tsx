import Link from "next/link";
import type { LucideIcon } from "lucide-react";

/**
 * Tile de módulo da Home (launcher).
 * Layout vertical, sóbrio e elegante: ícone centralizado + rótulo.
 * Pensado para preencher um grid distribuído na tela inteira.
 */
export function ModuleCard({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="group flex aspect-4/3 flex-col items-center justify-center gap-3 rounded-2xl border bg-card p-4 text-center transition-colors duration-200 hover:border-foreground/15 hover:bg-accent/40 sm:aspect-square"
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-foreground transition-colors duration-200 group-hover:bg-brand group-hover:text-brand-foreground">
        <Icon className="size-6" strokeWidth={1.8} />
      </span>
      <span className="text-sm font-medium leading-tight">{label}</span>
    </Link>
  );
}
