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
    <Card className="transition-shadow hover:shadow-sm">
      <CardContent className="flex items-start gap-4">
        {Icon && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Icon className="size-5" />
          </div>
        )}
        <div className="min-w-0 space-y-0.5">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight" data-tabular>
            {value}
          </p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
