import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Relatórios de Célula</h1>
          <p className="text-sm text-muted-foreground">
            {relatorios.length}{" "}
            {relatorios.length === 1 ? "relatório" : "relatórios"}
          </p>
        </div>
        <Link href="/relatorios/novo" className={buttonVariants()}>
          Novo relatório
        </Link>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          Erro ao carregar relatórios: {error.message}
        </p>
      )}

      {!error && relatorios.length === 0 ? (
        <div className="rounded-md border border-dashed p-10 text-center text-muted-foreground">
          Nenhum relatório registrado ainda.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
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
