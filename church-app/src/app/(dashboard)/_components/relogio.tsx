"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

/** Primeira letra maiúscula ("segunda-feira..." → "Segunda-feira..."). */
function capitalizar(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatar(agora: Date) {
  return {
    // Desktop/tablet: "Segunda-feira, 6 de julho de 2026"
    dataCompleta: capitalizar(
      agora.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    ),
    // Celular: "Seg., 6 de jul. de 2026" — nunca corta na largura da tela
    dataCurta: capitalizar(
      agora.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    ),
    hora: agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
}

/**
 * Data por extenso + relógio ao vivo com segundos (atualiza a cada 1s).
 * `suppressHydrationWarning` porque o horário do servidor pode divergir
 * do horário do cliente na primeira renderização.
 */
export function Relogio() {
  const [agora, setAgora] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setAgora(new Date()), 1_000);
    return () => clearInterval(timer);
  }, []);

  const { dataCompleta, dataCurta, hora } = formatar(agora);

  return (
    <p
      className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground sm:text-sm"
      suppressHydrationWarning
    >
      <Clock className="size-3.5 shrink-0" />
      <span className="sm:hidden">{dataCurta}</span>
      <span className="hidden sm:inline">{dataCompleta}</span>
      <span className="text-muted-foreground/50">·</span>
      <span className="font-medium text-foreground" data-tabular>
        {hora}
      </span>
    </p>
  );
}
