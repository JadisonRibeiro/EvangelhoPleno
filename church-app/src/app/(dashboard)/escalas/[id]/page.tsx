import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MESES } from "@/lib/algorithms/escala";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type EntradaRaw = {
  date: string;
  profile: { full_name: string } | null;
  parceiro: { full_name: string } | null;
};

type EscalaInfo = {
  month: number;
  year: number;
  notes: string | null;
  ministry: { name: string } | null;
};

function dataLabel(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    weekday: "long",
  });
}

export default async function EscalaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: escalaData }, { data: entradas }] = await Promise.all([
    supabase
      .from("schedules")
      .select(
        `id, month, year, notes,
         ministry:ministries!schedules_ministry_id_fkey(name)`,
      )
      .eq("id", id)
      .single(),
    supabase
      .from("schedule_entries")
      .select(
        `date,
         profile:profiles!schedule_entries_profile_id_fkey(full_name),
         parceiro:profiles!schedule_entries_couple_partner_id_fkey(full_name)`,
      )
      .eq("schedule_id", id)
      .order("date"),
  ]);

  if (!escalaData) notFound();
  const escala = escalaData as unknown as EscalaInfo;

  // agrupa entradas por data
  const porData = new Map<string, EntradaRaw[]>();
  for (const e of (entradas as EntradaRaw[] | null) ?? []) {
    const lista = porData.get(e.date) ?? [];
    lista.push(e);
    porData.set(e.date, lista);
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{escala.ministry?.name}</h1>
          <p className="text-sm text-muted-foreground">
            Escala de {MESES[escala.month - 1]} / {escala.year}
          </p>
        </div>
        <Link href="/escalas" className={buttonVariants({ variant: "outline" })}>
          Voltar
        </Link>
      </div>

      {escala.notes && (
        <p className="mb-4 max-w-2xl rounded-md border bg-muted/30 p-3 text-sm">
          {escala.notes}
        </p>
      )}

      <ul className="max-w-2xl divide-y rounded-md border">
        {[...porData.entries()].map(([date, lista]) => (
          <li key={date} className="px-4 py-3">
            <p className="mb-2 text-sm font-medium capitalize">
              {dataLabel(date)}
            </p>
            <div className="flex flex-wrap gap-1">
              {lista.map((e, idx) => (
                <Badge key={idx} variant={e.parceiro ? "secondary" : "outline"}>
                  {e.profile?.full_name ?? "—"}
                  {e.parceiro ? ` & ${e.parceiro.full_name}` : ""}
                </Badge>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
