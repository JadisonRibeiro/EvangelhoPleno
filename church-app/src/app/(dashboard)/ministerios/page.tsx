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
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ministérios</h1>
          <p className="text-sm text-muted-foreground">
            {ministerios.length}{" "}
            {ministerios.length === 1
              ? "ministério cadastrado"
              : "ministérios cadastrados"}
          </p>
        </div>
        <Link href="/ministerios/novo" className={buttonVariants()}>
          Novo ministério
        </Link>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          Erro ao carregar ministérios: {error.message}
        </p>
      )}

      {!error && ministerios.length === 0 ? (
        <div className="rounded-md border border-dashed p-10 text-center text-muted-foreground">
          Nenhum ministério cadastrado ainda.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
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
