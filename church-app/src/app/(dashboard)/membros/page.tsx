import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ROLE_LABELS, type Role } from "@/lib/types";
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

type MembroRow = {
  id: string;
  full_name: string;
  city: string | null;
  role: Role;
  is_active: boolean;
  is_baptized: boolean;
  completed_abrigo: boolean;
  completed_escola_discipulo: boolean;
  did_encontro_com_deus: boolean;
  cells: { name: string } | null;
};

function JornadaBadges({ m }: { m: MembroRow }) {
  const etapas = [
    { ok: m.is_baptized, label: "Batismo" },
    { ok: m.completed_abrigo, label: "Abrigo" },
    { ok: m.completed_escola_discipulo, label: "Escola" },
    { ok: m.did_encontro_com_deus, label: "Encontro" },
  ].filter((e) => e.ok);

  if (etapas.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {etapas.map((e) => (
        <Badge key={e.label} variant="secondary">
          {e.label}
        </Badge>
      ))}
    </div>
  );
}

export default async function MembrosPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, city, role, is_active, is_baptized, completed_abrigo, completed_escola_discipulo, did_encontro_com_deus, cells(name)",
    )
    .order("full_name");

  const membros = (data as MembroRow[] | null) ?? [];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Membros</h1>
          <p className="text-sm text-muted-foreground">
            {membros.length}{" "}
            {membros.length === 1 ? "membro cadastrado" : "membros cadastrados"}
          </p>
        </div>
        <Link href="/membros/novo" className={buttonVariants()}>
          Novo membro
        </Link>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          Erro ao carregar membros: {error.message}
        </p>
      )}

      {!error && membros.length === 0 ? (
        <div className="rounded-md border border-dashed p-10 text-center text-muted-foreground">
          Nenhum membro cadastrado ainda.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Célula</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead>Jornada</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membros.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.full_name}</TableCell>
                  <TableCell>{m.city ?? "—"}</TableCell>
                  <TableCell>{m.cells?.name ?? "—"}</TableCell>
                  <TableCell>{ROLE_LABELS[m.role]}</TableCell>
                  <TableCell>
                    <JornadaBadges m={m} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={m.is_active ? "default" : "outline"}>
                      {m.is_active ? "Ativo" : "Inativo"}
                    </Badge>
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
