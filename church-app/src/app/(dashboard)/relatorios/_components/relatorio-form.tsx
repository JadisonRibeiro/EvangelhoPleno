"use client";

import { useTransition } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  relatorioSchema,
  type RelatorioInput,
} from "@/lib/validations/relatorio";
import { criarRelatorio } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Celula = { id: string; name: string };

export function RelatorioForm({ celulas }: { celulas: Celula[] }) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RelatorioInput>({
    resolver: zodResolver(relatorioSchema),
    defaultValues: {
      cell_id: "",
      meeting_date: "",
      total_members: 0,
      total_visitors: 0,
      had_conversions: false,
      conversions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "conversions",
  });

  const teveConversoes = watch("had_conversions");

  function onSubmit(values: RelatorioInput) {
    startTransition(async () => {
      const result = await criarRelatorio(values);
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl space-y-6 rounded-xl bg-card p-6 ring-1 ring-foreground/10"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Célula *</Label>
          <Controller
            control={control}
            name="cell_id"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {celulas.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.cell_id && (
            <p className="text-sm text-destructive">{errors.cell_id.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="meeting_date">Data da reunião *</Label>
          <Input id="meeting_date" type="date" {...register("meeting_date")} />
          {errors.meeting_date && (
            <p className="text-sm text-destructive">
              {errors.meeting_date.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="total_members">Membros presentes</Label>
          <Input
            id="total_members"
            type="number"
            min={0}
            {...register("total_members", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="total_visitors">Visitantes</Label>
          <Input
            id="total_visitors"
            type="number"
            min={0}
            {...register("total_visitors", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="space-y-3 rounded-md border p-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="had_conversions">Alguém aceitou Jesus?</Label>
            <p className="text-xs text-muted-foreground">
              Cada convertido vira automaticamente um acompanhamento no AMAR.
            </p>
          </div>
          <Controller
            control={control}
            name="had_conversions"
            render={({ field }) => (
              <Switch
                id="had_conversions"
                checked={field.value}
                onCheckedChange={(v) => {
                  field.onChange(v);
                  if (v && fields.length === 0) {
                    append({ person_name: "", person_phone: "" });
                  }
                }}
              />
            )}
          />
        </div>

        {teveConversoes && (
          <div className="space-y-3">
            {fields.map((f, i) => (
              <div key={f.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <Input
                  placeholder="Nome completo"
                  {...register(`conversions.${i}.person_name`)}
                />
                <Input
                  placeholder="Telefone"
                  {...register(`conversions.${i}.person_phone`)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(i)}
                >
                  Remover
                </Button>
              </div>
            ))}
            {errors.conversions && (
              <p className="text-sm text-destructive">
                {errors.conversions.message}
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ person_name: "", person_phone: "" })}
            >
              + Adicionar convertido
            </Button>
          </div>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Salvar relatório"}
      </Button>
    </form>
  );
}
