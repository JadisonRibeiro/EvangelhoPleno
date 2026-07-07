"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function formatar(agora: Date) {
  const data = agora.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return {
    // Apenas a primeira letra maiúscula ("Segunda-feira, 6 de julho de 2026")
    data: data.charAt(0).toUpperCase() + data.slice(1),
    hora: agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

/**
 * Data por extenso + relógio ao vivo (atualiza a cada 15s).
 * `suppressHydrationWarning` porque o horário do servidor pode divergir
 * em segundos do horário do cliente na primeira renderização.
 */
export function Relogio() {
  const [agora, setAgora] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setAgora(new Date()), 15_000);
    return () => clearInterval(timer);
  }, []);

  const { data, hora } = formatar(agora);

  return (
    <p
      className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground sm:text-sm"
      suppressHydrationWarning
    >
      <Clock className="size-3.5 shrink-0" />
      <span className="truncate">{data}</span>
      <span className="text-muted-foreground/50">·</span>
      <span className="font-medium text-foreground" data-tabular>
        {hora}
      </span>
    </p>
  );
}
