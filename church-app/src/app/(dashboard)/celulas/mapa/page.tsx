import Link from "next/link";
import { List } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { MapaCelulas } from "../_components/mapa-celulas";
import type { CelulaGeo } from "../_components/mapa-types";

type Row = Omit<CelulaGeo, "latitude" | "longitude"> & {
  latitude: number | string;
  longitude: number | string;
};

const LEGENDA = [
  { cor: "#f59e0b", label: "Rede Amarela" },
  { cor: "#111827", label: "Rede Preta" },
  { cor: "#9ca3af", label: "Desativada" },
];

export default async function MapaCelulasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cells")
    .select(
      "id, name, rede, cell_type, neighborhood, leader_name, latitude, longitude, is_active",
    )
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  const celulas: CelulaGeo[] = ((data as Row[] | null) ?? [])
    .map((c) => ({
      ...c,
      latitude: Number(c.latitude),
      longitude: Number(c.longitude),
    }))
    .filter((c) => !Number.isNaN(c.latitude) && !Number.isNaN(c.longitude));

  const center: [number, number] = celulas.length
    ? [
        celulas.reduce((a, c) => a + c.latitude, 0) / celulas.length,
        celulas.reduce((a, c) => a + c.longitude, 0) / celulas.length,
      ]
    : [-2.994, -47.352]; // Paragominas - PA

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <PageHeader
        title="Mapa de células"
        description={`${celulas.length} células com localização`}
      >
        <Link href="/celulas" className={buttonVariants({ variant: "outline" })}>
          <List className="size-4" /> Ver lista
        </Link>
      </PageHeader>

      <MapaCelulas celulas={celulas} center={center} />

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {LEGENDA.map((l) => (
          <span key={l.label} className="inline-flex items-center gap-1.5">
            <span
              className="size-3 rounded-full"
              style={{ backgroundColor: l.cor }}
            />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
