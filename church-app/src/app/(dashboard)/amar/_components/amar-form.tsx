"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  amarSchema,
  type AmarInput,
  STATUS_AMAR,
  STATUS_LABELS,
  ORIGENS,
  ORIGEM_LABELS,
} from "@/lib/validations/amar";
import { criarAmar, atualizarAmar } from "../actions";
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

export type Pessoa = { id: string; full_name: string };

const NENHUM = "none";

export function AmarForm({
  pessoas,
  amarId,
  initial,
}: {
  pessoas: Pessoa[];
  amarId?: string;
  initial?: Partial<AmarInput>;
}) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<AmarInput>({
    resolver: zodResolver(amarSchema),
    defaultValues: {
      full_name: initial?.full_name ?? "",
      phone: initial?.phone ?? "",
      email: initial?.email ?? "",
      birth_date: initial?.birth_date ?? "",
      was_invited: initial?.was_invited ?? false,
      invited_by_name: initial?.invited_by_name ?? "",
      conversion_source: initial?.conversion_source ?? "",
      conversion_date: initial?.conversion_date ?? "",
      service_date: initial?.service_date ?? "",
      has_been_in_cell: initial?.has_been_in_cell ?? false,
      cell_interest: initial?.cell_interest ?? false,
      preferred_neighborhood: initial?.preferred_neighborhood ?? "",
      prayer_requests: initial?.prayer_requests ?? "",
      assigned_to: initial?.assigned_to ?? "",
      status: initial?.status ?? "novo",
      notes: initial?.notes ?? "",
    },
  });

  const foiConvidado = watch("was_invited");

  function onSubmit(values: AmarInput) {
    startTransition(async () => {
      const result = amarId
        ? await atualizarAmar(amarId, values)
        : await criarAmar(values);
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
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
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="birth_date">Data de nascimento</Label>
        <Input id="birth_date" type="date" {...register("birth_date")} />
      </div>

      <div className="space-y-3 rounded-md border p-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="was_invited">Foi convidado?</Label>
          <Controller
            control={control}
            name="was_invited"
            render={({ field }) => (
              <Switch
                id="was_invited"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
        {foiConvidado && (
          <div className="space-y-2">
            <Label htmlFor="invited_by_name">Quem convidou?</Label>
            <Input id="invited_by_name" {...register("invited_by_name")} />
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Origem</Label>
          <Controller
            control={control}
            name="conversion_source"
            render={({ field }) => (
              <Select
                value={field.value || NENHUM}
                onValueChange={(v) => field.onChange(v === NENHUM ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NENHUM}>—</SelectItem>
                  {ORIGENS.map((o) => (
                    <SelectItem key={o} value={o}>
                      {ORIGEM_LABELS[o]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="conversion_date">Aceitou Jesus em</Label>
          <Input id="conversion_date" type="date" {...register("conversion_date")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="service_date">Data do culto/evento</Label>
          <Input id="service_date" type="date" {...register("service_date")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-md border p-3">
          <Label htmlFor="has_been_in_cell">Já esteve em célula?</Label>
          <Controller
            control={control}
            name="has_been_in_cell"
            render={({ field }) => (
              <Switch
                id="has_been_in_cell"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
        <div className="flex items-center justify-between rounded-md border p-3">
          <Label htmlFor="cell_interest">Tem interesse em célula?</Label>
          <Controller
            control={control}
            name="cell_interest"
            render={({ field }) => (
              <Switch
                id="cell_interest"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferred_neighborhood">Bairro de preferência</Label>
        <Input
          id="preferred_neighborhood"
          {...register("preferred_neighborhood")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prayer_requests">Pedidos de oração</Label>
        <Textarea id="prayer_requests" rows={2} {...register("prayer_requests")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Responsável pelo acompanhamento</Label>
          <Controller
            control={control}
            name="assigned_to"
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
                  {pessoas.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_AMAR.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" rows={2} {...register("notes")} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : amarId ? "Salvar alterações" : "Cadastrar"}
      </Button>
    </form>
  );
}
