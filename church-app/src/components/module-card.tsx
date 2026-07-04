import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Card de módulo/ministério — apenas a imagem ilustrativa, no seu tamanho
 * real (sem corte). Sem ícone, título ou zoom; mantém apenas a elevação
 * suave no hover. A identidade de cada botão vem da própria imagem.
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
        "group relative block self-start overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 shadow-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:ring-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
        <div className="flex aspect-4/3 items-center justify-center bg-secondary text-sm text-muted-foreground">
          {label}
        </div>
      )}
    </Link>
  );
}
