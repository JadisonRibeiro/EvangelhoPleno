import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MESES } from "@/lib/algorithms/escala";
import { buttonVariants } from "@/components/ui/button";
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
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Escalas</h1>
          <p className="text-sm text-muted-foreground">
            {escalas.length}{" "}
            {escalas.length === 1 ? "escala gerada" : "escalas geradas"}
          </p>
        </div>
        <Link href="/escalas/gerar" className={buttonVariants()}>
          Gerar escala
        </Link>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          Erro ao carregar escalas: {error.message}
        </p>
      )}

      {!error && escalas.length === 0 ? (
        <div className="rounded-md border border-dashed p-10 text-center text-muted-foreground">
          Nenhuma escala gerada ainda.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
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
