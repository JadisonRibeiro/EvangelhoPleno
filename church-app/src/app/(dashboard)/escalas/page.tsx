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
        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
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
      )}
    </div>
  );
}
