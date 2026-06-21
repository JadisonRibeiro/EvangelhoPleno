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
  REDES,
  TIPOS_CELULA,
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

function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium text-muted-foreground">
        {titulo}
      </legend>
      {children}
    </fieldset>
  );
}

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
      leader_name: initial?.leader_name ?? "",
      cell_type: initial?.cell_type ?? "",
      rede: initial?.rede ?? "",
      leader_id: initial?.leader_id ?? "",
      co_leader_id: initial?.co_leader_id ?? "",
      meeting_day: initial?.meeting_day ?? "",
      meeting_time: initial?.meeting_time ?? "",
      city: initial?.city ?? "",
      neighborhood: initial?.neighborhood ?? "",
      address: initial?.address ?? "",
      latitude: initial?.latitude ?? "",
      longitude: initial?.longitude ?? "",
      photo_url: initial?.photo_url ?? "",
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

  function SelectSimples({
    name,
    placeholder,
    opcoes,
    vazioLabel = "—",
  }: {
    name: keyof CelulaInput;
    placeholder?: string;
    opcoes: readonly string[];
    vazioLabel?: string;
  }) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            value={(field.value as string) || NENHUM}
            onValueChange={(v) => field.onChange(v === NENHUM ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder ?? "Selecione"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NENHUM}>{vazioLabel}</SelectItem>
              {opcoes.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl space-y-8 rounded-xl bg-card p-6 ring-1 ring-foreground/10"
    >
      <Secao titulo="Identificação">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da célula *</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="leader_name">Líder</Label>
          <Input
            id="leader_name"
            placeholder="Nome do líder"
            {...register("leader_name")}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Tipo de célula</Label>
            <SelectSimples name="cell_type" opcoes={TIPOS_CELULA} />
          </div>
          <div className="space-y-2">
            <Label>Cor da rede</Label>
            <SelectSimples name="rede" opcoes={REDES} />
          </div>
        </div>
      </Secao>

      <Secao titulo="Reunião">
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
      </Secao>

      <Secao titulo="Localização">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" {...register("city")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input id="neighborhood" {...register("neighborhood")} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Endereço</Label>
          <Input id="address" {...register("address")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              inputMode="decimal"
              placeholder="-2.98313"
              {...register("latitude")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              inputMode="decimal"
              placeholder="-47.35047"
              {...register("longitude")}
            />
          </div>
        </div>
      </Secao>

      <Secao titulo="Vínculo no sistema (opcional)">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Líder cadastrado</Label>
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
          <div className="space-y-2">
            <Label>Co-líder cadastrado</Label>
            <Controller
              control={control}
              name="co_leader_id"
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
        </div>
      </Secao>

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

      <Button type="submit" disabled={isPending}>
        {isPending
          ? "Salvando..."
          : celulaId
            ? "Salvar alterações"
            : "Criar célula"}
      </Button>
    </form>
  );
}
