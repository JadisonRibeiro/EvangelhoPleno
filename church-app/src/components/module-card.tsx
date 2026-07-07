import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Botão de módulo/ministério — apenas a imagem ilustrativa, sem borda,
 * fundo ou sombra (a arte já traz a própria moldura). Mantém somente a
 * elevação sutil no hover e o anel de foco para navegação por teclado.
 */
export function ModuleCard({
  href,
  label,
  image,
  className,
}: {
  href: string;
  label: string;
  image?: string;
  className?: string;
  /** Aceitos por compatibilidade, mas não exibidos. */
  icon?: LucideIcon;
  description?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "block self-start rounded-2xl transition-transform duration-300 ease-out",
        "hover:-translate-y-1 active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={label}
          loading="lazy"
          className="block h-auto w-full"
        />
      ) : (
        <span className="flex aspect-4/3 items-center justify-center rounded-2xl bg-secondary text-sm text-muted-foreground">
          {label}
        </span>
      )}
    </Link>
  );
}
