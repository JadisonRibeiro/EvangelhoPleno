"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  gerarPreviaEscala,
  salvarEscala,
  type PreviaEscala,
} from "../actions";
import { MESES, DIAS_SEMANA } from "@/lib/algorithms/escala";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Ministerio = { id: string; name: string };

function dataLabel(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    weekday: "short",
  });
}

export function GerarEscala({ ministerios }: { ministerios: Ministerio[] }) {
  const router = useRouter();
  const agora = new Date();
  const [isPending, startTransition] = useTransition();

  const [ministryId, setMinistryId] = useState("");
  const [year, setYear] = useState(agora.getFullYear());
  const [month, setMonth] = useState(agora.getMonth() + 1);
  const [weekday, setWeekday] = useState(0); // domingo
  const [minPorData, setMinPorData] = useState(2);
  const [notes, setNotes] = useState("");
  const [previa, setPrevia] = useState<PreviaEscala | null>(null);

  function gerar() {
    if (!ministryId) {
      toast.error("Selecione um ministério.");
      return;
    }
    startTransition(async () => {
      const res = await gerarPreviaEscala({
        ministryId,
        year,
        month,
        weekday,
        minPorData,
      });
      if (res.error) {
        toast.error(res.error);
        setPrevia(null);
      } else {
        setPrevia(res.data ?? null);
      }
    });
  }

  function salvar() {
    if (!previa) return;
    startTransition(async () => {
      const res = await salvarEscala({
        ministryId,
        year,
        month,
        notes,
        entradas: previa.entradas,
      });
      if (res.error) toast.error(res.error);
      else {
        toast.success("Escala salva!");
        router.push("/escalas");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid max-w-3xl gap-4 rounded-md border p-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label>Ministério</Label>
          <Select value={ministryId} onValueChange={(v) => setMinistryId(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {ministerios.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Mês</Label>
          <Select
            value={String(month)}
            onValueChange={(v) => setMonth(Number(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MESES.map((nome, i) => (
                <SelectItem key={i} value={String(i + 1)}>
                  {nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Ano</Label>
          <Input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Dia da semana do culto/serviço</Label>
          <Select
            value={String(weekday)}
            onValueChange={(v) => setWeekday(Number(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIAS_SEMANA.map((nome, i) => (
                <SelectItem key={i} value={String(i)}>
                  {nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="min">Pessoas por data (mín.)</Label>
          <Input
            id="min"
            type="number"
            min={1}
            value={minPorData}
            onChange={(e) => setMinPorData(Math.max(1, Number(e.target.value)))}
          />
        </div>

        <div className="sm:col-span-2">
          <Button type="button" onClick={gerar} disabled={isPending}>
            {isPending && !previa ? "Gerando..." : "Gerar prévia"}
          </Button>
        </div>
      </div>

      {previa && (
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">
              Prévia — {previa.entradas.length} datas · {previa.totalUnidades}{" "}
              unidades
            </h2>
          </div>

          {previa.entradas.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma data gerada.
            </p>
          ) : (
            <ul className="divide-y rounded-md border">
              {previa.entradas.map((ent) => (
                <li key={ent.date} className="px-4 py-3">
                  <p className="mb-2 text-sm font-medium capitalize">
                    {dataLabel(ent.date)}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {ent.unidades.length === 0 ? (
                      <span className="text-xs text-muted-foreground">
                        sem escala
                      </span>
                    ) : (
                      ent.unidades.map((u) => (
                        <Badge
                          key={u.key}
                          variant={u.isCouple ? "secondary" : "outline"}
                        >
                          {u.label}
                        </Badge>
                      ))
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" onClick={salvar} disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar escala"}
            </Button>
            <Button type="button" variant="outline" onClick={gerar} disabled={isPending}>
              Gerar novamente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
