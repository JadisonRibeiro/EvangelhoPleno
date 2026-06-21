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
import { ExcluirMinisterio } from "./_components/excluir-ministerio";

type MinisterioRow = {
  id: string;
  name: string;
  requires_schedule: boolean;
  is_active: boolean;
  leader: { full_name: string } | null;
};

export default async function MinisteriosPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ministries")
    .select(
      `id, name, requires_schedule, is_active,
       leader:profiles!ministries_leader_id_fkey(full_name)`,
    )
    .order("name");

  const ministerios = (data as MinisterioRow[] | null) ?? [];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Ministérios"
        description={`${ministerios.length} ${ministerios.length === 1 ? "ministério cadastrado" : "ministérios cadastrados"}`}
      >
        <Link href="/ministerios/novo" className={buttonVariants()}>
          <Plus className="size-4" /> Novo ministério
        </Link>
      </PageHeader>

      {error && (
        <p className="text-sm text-destructive">
          Erro ao carregar ministérios: {error.message}
        </p>
      )}

      {!error && ministerios.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Nenhum ministério cadastrado ainda.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Líder</TableHead>
                <TableHead>Escala</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ministerios.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.leader?.full_name ?? "—"}</TableCell>
                  <TableCell>
                    {m.requires_schedule ? (
                      <Badge variant="secondary">Gera escala</Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={m.is_active ? "default" : "outline"}>
                      {m.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/ministerios/${m.id}`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        Membros
                      </Link>
                      <Link
                        href={`/ministerios/${m.id}/editar`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        Editar
                      </Link>
                      <ExcluirMinisterio id={m.id} nome={m.name} />
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
