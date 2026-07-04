"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Container dos filtros — organiza busca e selects lado a lado, com quebra
 * responsiva. Cada filtro traz seu rótulo acima (nunca selects "soltos").
 */
export function FilterBar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border bg-card/50 p-3 sm:flex-row sm:flex-wrap sm:items-end",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Campo de filtro com rótulo acima do controle. */
export function FilterField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="px-0.5 text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

export type FilterOption = { value: string; label: string };

/**
 * Select de filtro sincronizado à URL — SEMPRE exibe nomes amigáveis,
 * nunca IDs. O valor "todos" limpa o parâmetro.
 */
export function FilterSelect({
  label,
  param,
  options,
  allLabel = "Todos",
  placeholder,
  className,
}: {
  label: string;
  param: string;
  options: FilterOption[];
  allLabel?: string;
  placeholder?: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const ALL = "__all__";
  const atual = sp.get(param) ?? ALL;

  function aoMudar(v: string | null) {
    const next = new URLSearchParams(sp.toString());
    if (!v || v === ALL) next.delete(param);
    else next.set(param, v);
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <FilterField label={label} className={className}>
      <Select value={atual} onValueChange={aoMudar}>
        <SelectTrigger className="h-10 sm:w-56">
          <SelectValue placeholder={placeholder ?? allLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{allLabel}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterField>
  );
}
