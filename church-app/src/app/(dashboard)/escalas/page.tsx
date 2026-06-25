import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { MESES } from "@/lib/algorithms/escala";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type EscalaRow = {
  id: string;
  month: number;
  year: number;
  ministry: { name: string } | null;
  entradas: { count: number }[];
};

export default async function EscalasPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schedules")
    .select(
      `id, month, year,
       ministry:ministries!schedules_ministry_id_fkey(name),
       entradas:schedule_entries(count)`,
    )
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  const escalas = (data as EscalaRow[] | null) ?? [];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Escalas"
        description={`${escalas.length} ${escalas.length === 1 ? "escala gerada" : "escalas geradas"}`}
        breadcrumb={[{ label: "Início", href: "/dashboard" }, { label: "Escalas" }]}
      >
        <Link href="/escalas/gerar" className={buttonVariants()}>
          <Plus className="size-4" /> Gerar escala
        </Link>
      </PageHeader>

      {error && (
        <p className="text-sm text-destructive">
          Erro ao carregar escalas: {error.message}
        </p>
      )}

      {!error && escalas.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Nenhuma escala gerada ainda.
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile: cards em coluna única */}
          <ul className="space-y-3 md:hidden">
            {escalas.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/escalas/${e.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border bg-card p-4 ring-1 ring-foreground/5 transition-colors hover:bg-accent/40"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {e.ministry?.name ?? "—"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {MESES[e.month - 1]} / {e.year} ·{" "}
                      {e.entradas?.[0]?.count ?? 0} escalações
                    </p>
                  </div>
                  <span className="text-xs font-medium text-brand">Ver</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop: tabela densa */}
          <div className="hidden overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 md:block">
            <Table>
              <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Ministério</TableHead>
                <TableHead>Mês/Ano</TableHead>
                <TableHead>Escalações</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escalas.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">
                    {e.ministry?.name ?? "—"}
                  </TableCell>
                  <TableCell>
                    {MESES[e.month - 1]} / {e.year}
                  </TableCell>
                  <TableCell>{e.entradas?.[0]?.count ?? 0}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/escalas/${e.id}`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      Ver
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </>
      )}
    </div>
  );
}
