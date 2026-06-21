"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  membroMinisterioSchema,
  type MembroMinisterioInput,
} from "@/lib/validations/ministerio";
import {
  adicionarMembroMinisterio,
  removerMembroMinisterio,
} from "../actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Pessoa = { id: string; full_name: string };

export type MembroAtual = {
  id: string;
  profile_id: string;
  is_couple_pair: boolean;
  membro: { full_name: string } | null;
  parceiro: { full_name: string } | null;
};

export function MembrosMinisterio({
  ministerioId,
  membros,
  pessoas,
}: {
  ministerioId: string;
  membros: MembroAtual[];
  pessoas: Pessoa[];
}) {
  const [isPending, startTransition] = useTransition();
  const [removendo, setRemovendo] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<MembroMinisterioInput>({
    resolver: zodResolver(membroMinisterioSchema),
    defaultValues: {
      profile_id: "",
      is_couple_pair: false,
      couple_partner_id: "",
    },
  });

  const emCasal = watch("is_couple_pair");

  function onSubmit(values: MembroMinisterioInput) {
    startTransition(async () => {
      const result = await adicionarMembroMinisterio(ministerioId, values);
      if (result?.error) toast.error(result.error);
      else {
        toast.success("Membro adicionado.");
        reset();
      }
    });
  }

  function remover(rowId: string) {
    setRemovendo(rowId);
    startTransition(async () => {
      const result = await removerMembroMinisterio(rowId, ministerioId);
      if (result?.error) toast.error(result.error);
      setRemovendo(null);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-lg font-medium">
          Membros ({membros.length})
        </h2>
        {membros.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum membro neste ministério ainda.
          </p>
        ) : (
          <ul className="divide-y rounded-md border">
            {membros.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between px-4 py-2"
              >
                <div className="flex items-center gap-2">
                  <span>{m.membro?.full_name ?? "—"}</span>
                  {m.is_couple_pair && (
                    <Badge variant="secondary">
                      Casal{m.parceiro ? ` · ${m.parceiro.full_name}` : ""}
                    </Badge>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remover(m.id)}
                  disabled={isPending && removendo === m.id}
                >
                  Remover
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-md border p-4"
      >
        <h3 className="text-sm font-medium">Adicionar membro</h3>

        <div className="space-y-2">
          <Label>Membro</Label>
          <Controller
            control={control}
            name="profile_id"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {pessoas.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.profile_id && (
            <p className="text-sm text-destructive">
              {errors.profile_id.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between rounded-md border p-3">
          <Label htmlFor="is_couple_pair">Serve em casal?</Label>
          <Controller
            control={control}
            name="is_couple_pair"
            render={({ field }) => (
              <Switch
                id="is_couple_pair"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        {emCasal && (
          <div className="space-y-2">
            <Label>Parceiro(a) do casal</Label>
            <Controller
              control={control}
              name="couple_partner_id"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {pessoas.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.couple_partner_id && (
              <p className="text-sm text-destructive">
                {errors.couple_partner_id.message}
              </p>
            )}
          </div>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Adicionando..." : "Adicionar"}
        </Button>
      </form>
    </div>
  );
}
