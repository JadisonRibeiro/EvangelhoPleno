"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Botão premium com profundidade, leve brilho e efeito ripple ao clicar.
 * A onda é criada no ponto exato do toque e removida ao fim da animação.
 */
export function BotaoPremium({
  className,
  children,
  onPointerDown,
  ...props
}: React.ComponentProps<"button">) {
  const ref = useRef<HTMLButtonElement>(null);

  function criarOnda(evento: React.PointerEvent<HTMLButtonElement>) {
    const botao = ref.current;
    if (botao && !props.disabled) {
      const area = botao.getBoundingClientRect();
      const tamanho = Math.max(area.width, area.height);
      const onda = document.createElement("span");
      onda.className = "ripple-login";
      onda.style.width = onda.style.height = `${tamanho}px`;
      onda.style.left = `${evento.clientX - area.left - tamanho / 2}px`;
      onda.style.top = `${evento.clientY - area.top - tamanho / 2}px`;
      onda.addEventListener("animationend", () => onda.remove());
      botao.appendChild(onda);
    }
    onPointerDown?.(evento);
  }

  return (
    <button
      ref={ref}
      onPointerDown={criarOnda}
      className={cn(
        "relative h-13 w-full overflow-hidden rounded-full bg-white text-base font-semibold text-black",
        "shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_10px_30px_-8px_rgba(255,255,255,0.25),0_6px_16px_rgba(0,0,0,0.4)]",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_14px_36px_-8px_rgba(255,255,255,0.35),0_8px_20px_rgba(0,0,0,0.45)]",
        "active:translate-y-0 active:scale-[0.985]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        "disabled:pointer-events-none disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
