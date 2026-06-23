"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { CelulaGeo } from "./mapa-types";

// Leaflet usa window/document — carrega só no cliente (sem SSR).
const MapaInner = dynamic(() => import("./mapa-inner"), {
  ssr: false,
  loading: () => <Skeleton className="h-[70vh] w-full rounded-xl" />,
});

export function MapaCelulas({
  celulas,
  center,
}: {
  celulas: CelulaGeo[];
  center: [number, number];
}) {
  return <MapaInner celulas={celulas} center={center} />;
}
