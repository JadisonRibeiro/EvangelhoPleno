import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Logo da igreja com troca automática por tema:
 * tema claro → logo preta · tema escuro → logo branca.
 * Usa CSS (dark:) para evitar flash/hidratação.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/logo-preta.png"
        alt="Evangelho Pleno"
        width={120}
        height={48}
        priority
        className="h-7 w-auto dark:hidden"
      />
      <Image
        src="/logo-branca.png"
        alt="Evangelho Pleno"
        width={120}
        height={48}
        priority
        className="hidden h-7 w-auto dark:block"
      />
    </span>
  );
}
