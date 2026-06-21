"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { turmaSchema, type TurmaInput } from "@/lib/validations/turma";
import type { TipoDiscipulado } from "@/lib/discipulado";
import { criarTurma } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function TurmaForm({
  tipo,
  temEncontro,
  totalDefault,
}: {
  tipo: TipoDiscipulado;
  temEncontro: boolean;
  totalDefault: number;
}) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TurmaInput>({
    resolver: zodResolver(turmaSchema),
    defaultValues: {
      start_date: "",
      end_date: "",
      total_lessons: totalDefault,
      is_open: true,
      encontro_reference: "",
    },
  });

  function onSubmit(values: TurmaInput) {
    startTransition(async () => {
      const result = await criarTurma(tipo, values);
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl space-y-6 rounded-xl bg-card p-6 ring-1 ring-foreground/10"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start_date">Início *</Label>
          <Input id="start_date" type="date" {...register("start_date")} />
          {errors.start_date && (
            <p className="text-sm text-destructive">
              {errors.start_date.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">Término (previsto)</Label>
          <Input id="end_date" type="date" {...register("end_date")} />
        </div>
      </div>

      {temEncontro && (
        <div className="space-y-2">
          <Label htmlFor="encontro_reference">
            Encontro com Deus de referência
          </Label>
          <Input
            id="encontro_reference"
            type="date"
            {...register("encontro_reference")}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="total_lessons">Total de lições</Label>
        <Input
          id="total_lessons"
          type="number"
          min={1}
          {...register("total_lessons", { valueAsNumber: true })}
        />
        {errors.total_lessons && (
          <p className="text-sm text-destructive">
            {errors.total_lessons.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between rounded-md border p-3">
        <Label htmlFor="is_open">Turma aberta (aceita matrículas)</Label>
        <Controller
          control={control}
          name="is_open"
          render={({ field }) => (
            <Switch
              id="is_open"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Criar turma"}
      </Button>
    </form>
  );
}
