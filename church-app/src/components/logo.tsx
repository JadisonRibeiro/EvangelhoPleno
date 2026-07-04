import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Logo da igreja com troca automática por tema:
 * tema claro → logo preta · tema escuro → logo branca.
 * Usa CSS (dark:) para evitar flash/hidratação.
 */
export function Logo({
  className,
  imgClassName = "h-7",
}: {
  className?: string;
  imgClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/logo-preta.png"
        alt="Evangelho Pleno"
        width={120}
        height={48}
        priority
        className={cn("w-auto dark:hidden", imgClassName)}
      />
      <Image
        src="/logo-branca.png"
        alt="Evangelho Pleno"
        width={120}
        height={48}
        priority
        className={cn("hidden w-auto dark:block", imgClassName)}
      />
    </span>
  );
}
