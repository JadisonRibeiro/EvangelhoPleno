"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CelulaOpt = { id: string; name: string };

export function MembrosFiltros({ celulas }: { celulas: CelulaOpt[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");

  function navegar(updates: Record<string, string | null>) {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    next.delete("page"); // volta para a primeira página ao filtrar
    const qs = next.toString();
    router.push(qs ? `/membros?${qs}` : "/membros");
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navegar({ q: q.trim() || null });
        }}
        className="flex flex-1 gap-2"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome..."
            className="pl-8"
          />
        </div>
        <Button type="submit" variant="secondary">
          Buscar
        </Button>
      </form>

      <Select
        value={sp.get("cell") ?? "all"}
        onValueChange={(v) => navegar({ cell: v === "all" ? null : v })}
      >
        <SelectTrigger className="sm:w-56">
          <SelectValue placeholder="Todas as células" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as células</SelectItem>
          {celulas.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
