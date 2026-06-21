"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import type { TipoDiscipulado } from "@/lib/discipulado";
import { matricularAluno, atualizarAluno, removerAluno } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export type Aluno = {
  profile_id: string;
  lessons_completed: number;
  completed: boolean;
  membro: { full_name: string } | null;
};

export type Pessoa = { id: string; full_name: string };

function AlunoRow({
  tipo,
  classId,
  aluno,
  totalLessons,
}: {
  tipo: TipoDiscipulado;
  classId: string;
  aluno: Aluno;
  totalLessons: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [lessons, setLessons] = useState(aluno.lessons_completed);
  const [completed, setCompleted] = useState(aluno.completed);

  function salvar() {
    startTransition(async () => {
      const r = await atualizarAluno(tipo, classId, aluno.profile_id, lessons, completed);
      if (r?.error) toast.error(r.error);
      else toast.success("Atualizado.");
    });
  }

  function remover() {
    if (!confirm(`Remover ${aluno.membro?.full_name ?? "aluno"} da turma?`)) return;
    startTransition(async () => {
      const r = await removerAluno(tipo, classId, aluno.profile_id);
      if (r?.error) toast.error(r.error);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3">
      <span className="min-w-40 flex-1 font-medium">
        {aluno.membro?.full_name ?? "—"}
        {completed && (
          <Badge variant="secondary" className="ml-2">
            Concluído
          </Badge>
        )}
      </span>
      <div className="flex items-center gap-1">
        <Input
          type="number"
          min={0}
          max={totalLessons}
          value={lessons}
          onChange={(e) => setLessons(Number(e.target.value))}
          className="w-20"
        />
        <span className="text-sm text-muted-foreground">/ {totalLessons}</span>
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor={`c-${aluno.profile_id}`} className="text-sm">
          Concluiu
        </Label>
        <Switch
          id={`c-${aluno.profile_id}`}
          checked={completed}
          onCheckedChange={setCompleted}
        />
      </div>
      <Button type="button" size="sm" onClick={salvar} disabled={isPending}>
        Salvar
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={remover}
        disabled={isPending}
      >
        Remover
      </Button>
    </div>
  );
}

export function AlunosTurma({
  tipo,
  classId,
  totalLessons,
  alunos,
  disponiveis,
}: {
  tipo: TipoDiscipulado;
  classId: string;
  totalLessons: number;
  alunos: Aluno[];
  disponiveis: Pessoa[];
}) {
  const [isPending, startTransition] = useTransition();
  const [novo, setNovo] = useState("");

  function matricular() {
    if (!novo) {
      toast.error("Selecione um membro.");
      return;
    }
    startTransition(async () => {
      const r = await matricularAluno(tipo, classId, novo);
      if (r?.error) toast.error(r.error);
      else {
        toast.success("Matriculado.");
        setNovo("");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-lg font-medium">Alunos ({alunos.length})</h2>
        {alunos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum aluno matriculado.
          </p>
        ) : (
          <div className="divide-y rounded-md border">
            {alunos.map((a) => (
              <AlunoRow
                key={a.profile_id}
                tipo={tipo}
                classId={classId}
                aluno={a}
                totalLessons={totalLessons}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-md border p-4">
        <div className="min-w-60 flex-1 space-y-2">
          <Label>Matricular membro</Label>
          <Select value={novo} onValueChange={(v) => setNovo(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {disponiveis.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="button" onClick={matricular} disabled={isPending}>
          Matricular
        </Button>
      </div>
    </div>
  );
}
