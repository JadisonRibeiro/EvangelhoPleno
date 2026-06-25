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
      {/* Luz única e discreta — sem excesso de brilho */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 size-136 -translate-x-1/2 -translate-y-1/3 rounded-full bg-white/6 blur-3xl" />
      </div>

      {/* Cartão de vidro sóbrio */}
      <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-white/4 p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo-branca.png"
            alt="Evangelho Pleno"
            width={180}
            height={72}
            priority
            className="h-11 w-auto"
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
            className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-8 text-center text-[11px] tracking-wide text-white/40">
          Evangelho Pleno · Gestão da Igreja
        </p>
      </div>
    </main>
  );
}
