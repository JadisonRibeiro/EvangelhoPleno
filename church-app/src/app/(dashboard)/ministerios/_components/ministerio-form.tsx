"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  ministerioSchema,
  type MinisterioInput,
} from "@/lib/validations/ministerio";
import { criarMinisterio, atualizarMinisterio } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Lider = { id: string; full_name: string };

const NENHUM = "none";

export function MinisterioForm({
  lideres,
  ministerioId,
  initial,
}: {
  lideres: Lider[];
  ministerioId?: string;
  initial?: Partial<MinisterioInput>;
}) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MinisterioInput>({
    resolver: zodResolver(ministerioSchema),
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      leader_id: initial?.leader_id ?? "",
      requires_schedule: initial?.requires_schedule ?? false,
      is_active: initial?.is_active ?? true,
    },
  });

  function onSubmit(values: MinisterioInput) {
    startTransition(async () => {
      const result = ministerioId
        ? await atualizarMinisterio(ministerioId, values)
        : await criarMinisterio(values);
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl space-y-6 rounded-xl bg-card p-6 ring-1 ring-foreground/10"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nome do ministério *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <div className="space-y-2">
        <Label>Líder</Label>
        <Controller
          control={control}
          name="leader_id"
          render={({ field }) => (
            <Select
              value={field.value || NENHUM}
              onValueChange={(v) => field.onChange(v === NENHUM ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NENHUM}>Ninguém</SelectItem>
                {lideres.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <Label htmlFor="requires_schedule">Gera escala mensal?</Label>
          <p className="text-xs text-muted-foreground">
            Ative se este ministério monta escala de serviço.
          </p>
        </div>
        <Controller
          control={control}
          name="requires_schedule"
          render={({ field }) => (
            <Switch
              id="requires_schedule"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="flex items-center justify-between rounded-md border p-3">
        <Label htmlFor="is_active">Ministério ativo</Label>
        <Controller
          control={control}
          name="is_active"
          render={({ field }) => (
            <Switch
              id="is_active"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending
          ? "Salvando..."
          : ministerioId
            ? "Salvar alterações"
            : "Criar ministério"}
      </Button>
    </form>
  );
}
