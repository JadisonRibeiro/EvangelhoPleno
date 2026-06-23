"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { CelulaGeo } from "./mapa-types";

function corDaCelula(rede: string | null, ativa: boolean) {
  if (!ativa) return "#9ca3af";
  if (rede === "Preta") return "#111827";
  if (rede === "Amarela") return "#f59e0b";
  return "#6366f1";
}

function icone(rede: string | null, ativa: boolean) {
  const cor = corDaCelula(rede, ativa);
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${cor};border:2px solid #fff;box-shadow:0 0 0 1.5px rgba(0,0,0,.25)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
  });
}

export default function MapaInner({
  celulas,
  center,
}: {
  celulas: CelulaGeo[];
  center: [number, number];
}) {
  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom
      className="h-[70vh] w-full rounded-xl ring-1 ring-foreground/10"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {celulas.map((c) => (
        <Marker
          key={c.id}
          position={[c.latitude, c.longitude]}
          icon={icone(c.rede, c.is_active)}
        >
          <Popup>
            <div style={{ minWidth: 160, lineHeight: 1.5 }}>
              <strong style={{ fontSize: 14 }}>{c.name}</strong>
              {!c.is_active && (
                <div style={{ color: "#dc2626" }}>Desativada</div>
              )}
              {c.leader_name && <div>Líder: {c.leader_name}</div>}
              {c.cell_type && <div>Tipo: {c.cell_type}</div>}
              {c.rede && <div>Rede: {c.rede}</div>}
              {c.neighborhood && <div>Bairro: {c.neighborhood}</div>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
