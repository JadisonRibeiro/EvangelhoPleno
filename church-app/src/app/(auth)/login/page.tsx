"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";

import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { login } from "./actions";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [lembrar, setLembrar] = useState(true);
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
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 p-4">
      {/* Brilhos desfocados (efeito espelhado em tons de cinza) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 size-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 right-0 size-96 rounded-full bg-zinc-400/15 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 size-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" />
      </div>

      {/* Cartão de vidro */}
      <div className="relative w-full max-w-sm rounded-[28px] border border-white/15 bg-white/[0.07] p-8 shadow-2xl backdrop-blur-2xl">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo-branca.png"
            alt="Evangelho Pleno"
            width={180}
            height={72}
            priority
            className="h-12 w-auto drop-shadow"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* E-mail */}
          <div>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-white/60" />
              <input
                type="email"
                autoComplete="email"
                placeholder="E-mail"
                aria-label="E-mail"
                {...register("email")}
                className="w-full border-0 border-b border-white/25 bg-transparent py-2 pl-7 text-sm text-white outline-none transition placeholder:text-white/50 focus:border-white/70"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-300">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Senha */}
          <div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-white/60" />
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Senha"
                aria-label="Senha"
                {...register("password")}
                className="w-full border-0 border-b border-white/25 bg-transparent py-2 pl-7 text-sm text-white outline-none transition placeholder:text-white/50 focus:border-white/70"
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-300">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Lembrar / Esqueceu */}
          <div className="flex items-center justify-between text-xs text-white/70">
            <label className="flex cursor-pointer select-none items-center gap-2">
              <input
                type="checkbox"
                checked={lembrar}
                onChange={(e) => setLembrar(e.target.checked)}
                className="size-3.5 accent-white"
              />
              Lembrar de mim
            </label>
            <Link
              href="/recuperar-senha"
              className="transition hover:text-white"
            >
              Esqueceu a senha?
            </Link>
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-2xl bg-gradient-to-r from-zinc-700 via-zinc-800 to-neutral-950 py-3 text-sm font-semibold tracking-wider text-white shadow-lg ring-1 ring-white/10 transition hover:from-zinc-600 hover:via-zinc-700 hover:to-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "ENTRANDO..." : "ENTRAR"}
          </button>
        </form>

        <p className="mt-8 text-center text-[11px] tracking-wide text-white/40">
          Evangelho Pleno · Gestão da Igreja
        </p>
      </div>
    </main>
  );
}
