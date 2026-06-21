"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  celulaSchema,
  type CelulaInput,
  DIAS,
  DIAS_LABELS,
} from "@/lib/validations/celula";
import { criarCelula, atualizarCelula } from "../actions";
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

export type Lider = { id: string; full_name: string };

const NENHUM = "none";

export function CelulaForm({
  lideres,
  celulaId,
  initial,
}: {
  lideres: Lider[];
  celulaId?: string;
  initial?: Partial<CelulaInput>;
}) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CelulaInput>({
    resolver: zodResolver(celulaSchema),
    defaultValues: {
      name: initial?.name ?? "",
      leader_id: initial?.leader_id ?? "",
      co_leader_id: initial?.co_leader_id ?? "",
      meeting_day: initial?.meeting_day ?? "",
      meeting_time: initial?.meeting_time ?? "",
      address: initial?.address ?? "",
      neighborhood: initial?.neighborhood ?? "",
      is_active: initial?.is_active ?? true,
    },
  });

  function onSubmit(values: CelulaInput) {
    startTransition(async () => {
      const result = celulaId
        ? await atualizarCelula(celulaId, values)
        : await criarCelula(values);
      if (result?.error) toast.error(result.error);
    });
  }

  function SelectLider({
    name,
    label,
  }: {
    name: "leader_id" | "co_leader_id";
    label: string;
  }) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <Controller
          control={control}
          name={name}
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
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl space-y-6 rounded-xl bg-card p-6 ring-1 ring-foreground/10"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nome da célula *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectLider name="leader_id" label="Líder" />
        <SelectLider name="co_leader_id" label="Co-líder" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Dia da reunião</Label>
          <Controller
            control={control}
            name="meeting_day"
            render={({ field }) => (
              <Select
                value={field.value || NENHUM}
                onValueChange={(v) => field.onChange(v === NENHUM ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NENHUM}>Sem dia</SelectItem>
                  {DIAS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {DIAS_LABELS[d]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meeting_time">Horário</Label>
          <Input id="meeting_time" type="time" {...register("meeting_time")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input id="neighborhood" {...register("neighborhood")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Endereço</Label>
          <Input id="address" {...register("address")} />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-md border p-3">
        <Label htmlFor="is_active">Célula ativa</Label>
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

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : celulaId ? "Salvar alterações" : "Criar célula"}
        </Button>
      </div>
    </form>
  );
}
