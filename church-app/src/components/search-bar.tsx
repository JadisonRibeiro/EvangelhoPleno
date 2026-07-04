"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

/**
 * Barra de busca com pesquisa instantânea (debounce) sincronizada à URL.
 * Mostra ícone, placeholder amigável, indicador de carregamento e botão
 * para limpar. Reseta a paginação a cada nova busca.
 */
export function SearchBar({
  placeholder = "Pesquisar...",
  param = "q",
  className,
}: {
  placeholder?: string;
  param?: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [valor, setValor] = useState(sp.get(param) ?? "");
  const primeiraRenderizacao = useRef(true);

  useEffect(() => {
    // Não dispara navegação no primeiro render (evita loop com o valor inicial).
    if (primeiraRenderizacao.current) {
      primeiraRenderizacao.current = false;
      return;
    }
    const t = setTimeout(() => {
      const next = new URLSearchParams(sp.toString());
      const atual = sp.get(param) ?? "";
      if (valor.trim() === atual) return;
      if (valor.trim()) next.set(param, valor.trim());
      else next.delete(param);
      next.delete("page");
      const qs = next.toString();
      startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 pl-9 pr-9"
      />
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : valor ? (
          <button
            type="button"
            aria-label="Limpar busca"
            onClick={() => setValor("")}
            className="flex size-5 items-center justify-center rounded-full transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </span>
    </div>
  );
}
