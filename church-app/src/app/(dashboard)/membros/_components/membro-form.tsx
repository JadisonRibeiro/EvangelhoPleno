"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { membroSchema, type MembroInput } from "@/lib/validations/membro";
import { ROLE_LABELS, type Cell, type Role } from "@/lib/types";
import { criarMembro, atualizarMembro } from "../actions";
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

const SEM_CELULA = "none";

export function MembroForm({
  cells,
  membroId,
  initial,
}: {
  cells: Cell[];
  membroId?: string;
  initial?: Partial<MembroInput>;
}) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<MembroInput>({
    resolver: zodResolver(membroSchema),
    defaultValues: {
      full_name: initial?.full_name ?? "",
      phone: initial?.phone ?? "",
      city: initial?.city ?? "",
      address: initial?.address ?? "",
      neighborhood: initial?.neighborhood ?? "",
      birth_date: initial?.birth_date ?? "",
      cell_id: initial?.cell_id ?? "",
      role: initial?.role ?? "member",
      is_baptized: initial?.is_baptized ?? false,
      baptism_date: initial?.baptism_date ?? "",
      completed_abrigo: initial?.completed_abrigo ?? false,
      abrigo_completed_at: initial?.abrigo_completed_at ?? "",
      completed_escola_discipulo: initial?.completed_escola_discipulo ?? false,
      escola_completed_at: initial?.escola_completed_at ?? "",
      did_encontro_com_deus: initial?.did_encontro_com_deus ?? false,
      encontro_date: initial?.encontro_date ?? "",
    },
  });

  function onSubmit(values: MembroInput) {
    startTransition(async () => {
      const result = membroId
        ? await atualizarMembro(membroId, values)
        : await criarMembro(values);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  // Bloco reutilizável: toggle + campo de data condicional
  function EtapaJornada({
    toggleName,
    dateName,
    label,
  }: {
    toggleName: keyof MembroInput;
    dateName: keyof MembroInput;
    label: string;
  }) {
    const ativo = watch(toggleName);
    return (
      <div className="space-y-2 rounded-md border p-3">
        <div className="flex items-center justify-between">
          <Label htmlFor={String(toggleName)}>{label}</Label>
          <Controller
            control={control}
            name={toggleName}
            render={({ field }) => (
              <Switch
                id={String(toggleName)}
                checked={Boolean(field.value)}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
        {ativo && (
          <div className="space-y-1">
            <Label htmlFor={String(dateName)} className="text-xs text-muted-foreground">
              Data
            </Label>
            <Input id={String(dateName)} type="date" {...register(dateName)} />
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl space-y-6 rounded-xl bg-card p-6 ring-1 ring-foreground/10"
    >
      <div className="space-y-2">
        <Label htmlFor="full_name">Nome completo *</Label>
        <Input id="full_name" {...register("full_name")} />
        {errors.full_name && (
          <p className="text-sm text-destructive">{errors.full_name.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone / WhatsApp</Label>
          <Input id="phone" {...register("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" {...register("city")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="address">Endereço</Label>
          <Input id="address" {...register("address")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input id="neighborhood" {...register("neighborhood")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="birth_date">Data de nascimento</Label>
          <Input id="birth_date" type="date" {...register("birth_date")} />
        </div>
        <div className="space-y-2">
          <Label>Célula</Label>
          <Controller
            control={control}
            name="cell_id"
            render={({ field }) => (
              <Select
                value={field.value || SEM_CELULA}
                onValueChange={(v) => field.onChange(v === SEM_CELULA ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SEM_CELULA}>Sem célula</SelectItem>
                  {cells.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Papel</Label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                  <SelectItem key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm font-medium">Jornada espiritual</legend>
        <EtapaJornada
          toggleName="is_baptized"
          dateName="baptism_date"
          label="É batizado?"
        />
        <EtapaJornada
          toggleName="completed_abrigo"
          dateName="abrigo_completed_at"
          label="Já fez o Abrigo?"
        />
        <EtapaJornada
          toggleName="completed_escola_discipulo"
          dateName="escola_completed_at"
          label="Já fez Escola de Discípulo?"
        />
        <EtapaJornada
          toggleName="did_encontro_com_deus"
          dateName="encontro_date"
          label="Já fez Encontro com Deus?"
        />
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Salvando..."
            : membroId
              ? "Salvar alterações"
              : "Salvar membro"}
        </Button>
      </div>
    </form>
  );
}
