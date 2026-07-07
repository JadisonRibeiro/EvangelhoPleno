"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Lock, Check } from "lucide-react";

import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { login } from "./actions";
import { FundoPremium } from "./_components/fundo-premium";
import { CampoLogin } from "./_components/campo-login";
import { BotaoPremium } from "./_components/botao-premium";
import { TelaBoasVindas } from "./_components/tela-boas-vindas";

/**
 * Tela de login premium — monocromática (preto/branco/cinzas), com a logo
 * como protagonista, cartão glassmorphism e animações de entrada em
 * sequência. Após autenticar, exibe a tela de boas-vindas em tela cheia
 * e navega automaticamente para a Home.
 */
export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [lembrar, setLembrar] = useState(true);
  const [bemVindo, setBemVindo] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginInput) {
    startTransition(async () => {
      const result = await login(values);
      if ("error" in result) toast.error(result.error);
      else setBemVindo(true);
    });
  }

  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-black p-4">
      <FundoPremium />

      {/* Cartão de vidro */}
      <div className="anim-entrada-suave relative w-full max-w-sm rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_60px_-16px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-8">
        {/* Reflexo superior do vidro */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />

        {/* Logo — protagonista, com brilho e entrada em zoom */}
        <div className="anim-entrada-zoom relative mx-auto mb-10 mt-4 w-fit">
          <div className="anim-brilho absolute inset-0 -z-10 scale-150 rounded-full bg-white/20 blur-2xl" />
          <Image
            src="/logo-branca.png"
            alt="Evangelho Pleno"
            width={260}
            height={104}
            priority
            className="h-16 w-auto drop-shadow-[0_2px_20px_rgba(255,255,255,0.28)] sm:h-20"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Campos aparecendo em sequência */}
          <div className="anim-entrada-suave [animation-delay:150ms]">
            <CampoLogin
              id="email"
              tipo="email"
              icone={Mail}
              placeholder="E-mail"
              autoComplete="email"
              registro={register("email")}
              erro={errors.email?.message}
            />
          </div>

          <div className="anim-entrada-suave [animation-delay:250ms]">
            <CampoLogin
              id="password"
              senha
              icone={Lock}
              placeholder="Senha"
              autoComplete="current-password"
              registro={register("password")}
              erro={errors.password?.message}
            />
          </div>

          {/* Lembrar-me / Esqueceu sua senha? */}
          <div className="anim-entrada-suave flex items-center justify-between text-sm text-[#6E6E6E] [animation-delay:350ms]">
            <label className="flex cursor-pointer select-none items-center gap-2.5 transition-colors duration-200 hover:text-white">
              <span className="relative flex size-5 items-center justify-center">
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={(e) => setLembrar(e.target.checked)}
                  className="peer size-5 cursor-pointer appearance-none rounded-md border border-white/25 bg-white/6 transition-all duration-200 checked:border-white checked:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                />
                <Check
                  className="pointer-events-none absolute size-3.5 text-black opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
                  strokeWidth={3}
                />
              </span>
              Lembrar-me
            </label>
            <Link
              href="/recuperar-senha"
              className="rounded-sm transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          {/* Botão Entrar */}
          <div className="anim-entrada-suave pt-1 [animation-delay:450ms]">
            <BotaoPremium type="submit" disabled={isPending}>
              {isPending ? "Entrando..." : "Entrar"}
            </BotaoPremium>
          </div>
        </form>
      </div>

      {/* Transição pós-login: boas-vindas em tela cheia → Home */}
      {bemVindo && <TelaBoasVindas />}
    </main>
  );
}
