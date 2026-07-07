"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { FundoPremium } from "./fundo-premium";

/** Tempo em tela antes de iniciar a saída (ms). */
const DURACAO_EXIBICAO = 1400;
/** Momento em que a navegação dispara, com o conteúdo já dissolvendo (ms). */
const MOMENTO_NAVEGACAO = 1650;

/**
 * Tela de boas-vindas em tela cheia exibida após o login com sucesso.
 * Entra com fade + zoom + blur dissolvendo, permanece ~1,5s e dissolve o
 * conteúdo, navegando automaticamente para a Home — sem botões e sem
 * interação. O fundo permanece sólido até a Home montar, para o login
 * nunca reaparecer por baixo durante a transição.
 */
export function TelaBoasVindas() {
  const router = useRouter();
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    // Pré-carrega a Home enquanto a animação roda — transição sem travar.
    router.prefetch("/dashboard");
    const saida = setTimeout(() => setSaindo(true), DURACAO_EXIBICAO);
    const navegar = setTimeout(
      () => router.replace("/dashboard"),
      MOMENTO_NAVEGACAO,
    );
    return () => {
      clearTimeout(saida);
      clearTimeout(navegar);
    };
  }, [router]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
    >
      <FundoPremium />

      <div
        className={cn(
          "relative flex flex-col items-center gap-8 px-6 text-center",
          saindo ? "anim-saida-zoom" : "anim-entrada-zoom",
        )}
      >
        {/* Logo em destaque com halo pulsante */}
        <div className="relative">
          <div className="anim-brilho absolute inset-0 -z-10 scale-150 rounded-full bg-white/25 blur-3xl" />
          <Image
            src="/logo-branca.png"
            alt="Evangelho Pleno"
            width={280}
            height={112}
            priority
            className="h-20 w-auto drop-shadow-[0_2px_24px_rgba(255,255,255,0.3)] sm:h-24"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Bem-vindo!
          </h1>
          <p className="text-sm text-[#6E6E6E] sm:text-base">
            Preparando sua experiência...
          </p>
        </div>
      </div>
    </div>
  );
}
