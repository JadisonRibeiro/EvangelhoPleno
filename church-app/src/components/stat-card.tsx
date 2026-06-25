import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Card de indicador executivo (KPI) com ícone, valor e legenda.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  hint?: string;
}) {
  return (
    <Card className="gap-0">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          {Icon && (
            <Icon className="size-4 shrink-0 text-muted-foreground/70" />
          )}
        </div>
        <p
          className="text-[1.75rem] font-semibold leading-none tracking-tight"
          data-tabular
        >
          {value}
        </p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}
