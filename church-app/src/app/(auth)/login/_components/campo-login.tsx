"use client";

import { useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/lib/utils";

/**
 * Campo de formulário premium (glassmorphism): ícone à esquerda, cantos
 * totalmente arredondados, sombra suave e foco elegante. Quando `senha`,
 * exibe o botão de mostrar/ocultar. A fonte de 16px (`text-base`) evita o
 * zoom automático ao focar em dispositivos iOS.
 */
export function CampoLogin({
  id,
  icone: Icone,
  registro,
  erro,
  senha = false,
  tipo = "text",
  placeholder,
  autoComplete,
}: {
  id: string;
  icone: LucideIcon;
  registro: UseFormRegisterReturn;
  erro?: string;
  senha?: boolean;
  tipo?: string;
  placeholder: string;
  autoComplete?: string;
}) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="space-y-1.5">
      <div className="group relative">
        <Icone
          className="pointer-events-none absolute left-4 top-1/2 size-[1.1rem] -translate-y-1/2 text-[#6E6E6E] transition-colors duration-300 group-focus-within:text-white"
          strokeWidth={1.8}
        />
        <input
          id={id}
          type={senha ? (visivel ? "text" : "password") : tipo}
          placeholder={placeholder}
          aria-label={placeholder}
          autoComplete={autoComplete}
          aria-invalid={erro ? true : undefined}
          className={cn(
            "h-13 w-full rounded-full border border-white/10 bg-white/6 text-base text-white outline-none backdrop-blur-xl",
            "pl-11.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.35)]",
            "transition-all duration-300 placeholder:text-[#6E6E6E]",
            "hover:border-white/20 hover:bg-white/9",
            "focus:border-white/35 focus:bg-white/10 focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_0_4px_rgba(255,255,255,0.07)]",
            erro && "border-white/45",
            senha ? "pr-12" : "pr-5",
          )}
          {...registro}
        />
        {senha && (
          <button
            type="button"
            onClick={() => setVisivel((v) => !v)}
            aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={visivel}
            className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-[#6E6E6E] transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            {visivel ? (
              <EyeOff className="size-[1.1rem]" strokeWidth={1.8} />
            ) : (
              <Eye className="size-[1.1rem]" strokeWidth={1.8} />
            )}
          </button>
        )}
      </div>
      {erro && (
        <p role="alert" className="pl-4 text-xs text-white/75">
          {erro}
        </p>
      )}
    </div>
  );
}
