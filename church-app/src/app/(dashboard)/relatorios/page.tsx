import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

type RelatorioRow = {
  id: string;
  meeting_date: string;
  total_members: number;
  total_visitors: number;
  had_conversions: boolean;
  cell: { name: string } | null;
  conversoes: { count: number }[];
};

function dataLabel(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR");
}

export default async function RelatoriosPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cell_reports")
    .select(
      `id, meeting_date, total_members, total_visitors, had_conversions,
       cell:cells!cell_reports_cell_id_fkey(name),
       conversoes:cell_report_conversions(count)`,
    )
    .order("meeting_date", { ascending: false });

  const relatorios = (data as RelatorioRow[] | null) ?? [];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Relatórios de Célula"
        description={`${relatorios.length} ${relatorios.length === 1 ? "relatório" : "relatórios"}`}
      >
        <Link href="/relatorios/novo" className={buttonVariants()}>
          <Plus className="size-4" /> Novo relatório
        </Link>
      </PageHeader>

      {error && (
        <p className="text-sm text-destructive">
          Erro ao carregar relatórios: {error.message}
        </p>
      )}

      {!error && relatorios.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Nenhum relatório registrado ainda.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Célula</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Membros</TableHead>
                <TableHead>Visitantes</TableHead>
                <TableHead>Conversões</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatorios.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">
                    {r.cell?.name ?? "—"}
                  </TableCell>
                  <TableCell>{dataLabel(r.meeting_date)}</TableCell>
                  <TableCell>{r.total_members}</TableCell>
                  <TableCell>{r.total_visitors}</TableCell>
                  <TableCell>
                    {r.conversoes?.[0]?.count ? (
                      <Badge variant="secondary">
                        {r.conversoes[0].count}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/relatorios/${r.id}`}
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
