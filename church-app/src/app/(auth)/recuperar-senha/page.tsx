"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const schema = z.object({ email: z.string().email("E-mail inválido") });
type Input2 = z.infer<typeof schema>;

export default function RecuperarSenhaPage() {
  const [isPending, startTransition] = useTransition();
  const [enviado, setEnviado] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input2>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: Input2) {
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        { redirectTo: `${window.location.origin}/atualizar-senha` },
      );
      if (error) toast.error("Não foi possível enviar. Tente novamente.");
      else setEnviado(true);
    });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <Logo className="[&_img]:h-10" />
        <Card className="w-full">
          {enviado ? (
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                <MailCheck className="size-6" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Verifique seu e-mail</p>
                <p className="text-sm text-muted-foreground">
                  Se houver uma conta com esse e-mail, enviamos um link para
                  redefinir a senha.
                </p>
              </div>
              <Link
                href="/login"
                className="text-sm text-brand hover:underline"
              >
                Voltar ao login
              </Link>
            </CardContent>
          ) : (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Recuperar senha</CardTitle>
                <CardDescription>
                  Informe seu e-mail e enviaremos um link de redefinição.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending}
                  >
                    {isPending ? "Enviando..." : "Enviar link"}
                  </Button>
                  <Link
                    href="/login"
                    className="block text-center text-sm text-muted-foreground hover:underline"
                  >
                    Voltar ao login
                  </Link>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </main>
  );
}
