import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DIAS_LABELS } from "@/lib/validations/celula";
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
import { ExcluirCelula } from "./_components/excluir-celula";

type CelulaRow = {
  id: string;
  name: string;
  meeting_day: keyof typeof DIAS_LABELS | null;
  meeting_time: string | null;
  neighborhood: string | null;
  is_active: boolean;
  leader: { full_name: string } | null;
  co_leader: { full_name: string } | null;
};

function reuniao(c: CelulaRow) {
  const dia = c.meeting_day ? DIAS_LABELS[c.meeting_day] : null;
  const hora = c.meeting_time ? c.meeting_time.slice(0, 5) : null;
  if (!dia && !hora) return "—";
  return [dia, hora].filter(Boolean).join(" • ");
}

export default async function CelulasPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cells")
    .select(
      `id, name, meeting_day, meeting_time, neighborhood, is_active,
       leader:profiles!cells_leader_id_fkey(full_name),
       co_leader:profiles!cells_co_leader_id_fkey(full_name)`,
    )
    .order("name");

  const celulas = (data as CelulaRow[] | null) ?? [];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Células"
        description={`${celulas.length} ${celulas.length === 1 ? "célula cadastrada" : "células cadastradas"}`}
      >
        <Link href="/celulas/nova" className={buttonVariants()}>
          <Plus className="size-4" /> Nova célula
        </Link>
      </PageHeader>

      {error && (
        <p className="text-sm text-destructive">
          Erro ao carregar células: {error.message}
        </p>
      )}

      {!error && celulas.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Nenhuma célula cadastrada ainda.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Líder</TableHead>
                <TableHead>Reunião</TableHead>
                <TableHead>Bairro</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {celulas.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.leader?.full_name ?? "—"}</TableCell>
                  <TableCell>{reuniao(c)}</TableCell>
                  <TableCell>{c.neighborhood ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={c.is_active ? "default" : "outline"}>
                      {c.is_active ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/celulas/${c.id}/editar`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        Editar
                      </Link>
                      <ExcluirCelula id={c.id} nome={c.name} />
                    </div>
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
