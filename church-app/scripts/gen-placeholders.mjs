// Gera imagens placeholder (SVG) monocromáticas e elegantes para os cards
// de módulos e ministérios. Substitua depois pelos arquivos oficiais mantendo
// o mesmo nome. Estilo: gradiente escuro + motivo em linha (watermark) + label.
//
// Uso: node scripts/gen-placeholders.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "images");

// Ícones em linha desenhados manualmente (viewBox 0 0 100 100, centralizados).
const ICONS = {
  users: `
    <circle cx="38" cy="40" r="12"/>
    <path d="M18 78c0-12 9-20 20-20s20 8 20 20"/>
    <circle cx="66" cy="44" r="9"/>
    <path d="M62 60c11 0 20 7 20 18"/>`,
  home: `
    <path d="M20 50 50 24 80 50"/>
    <path d="M28 46v30h44V46"/>
    <path d="M44 76V58h12v18"/>`,
  pin: `
    <path d="M50 82C36 66 28 56 28 44a22 22 0 0 1 44 0c0 12-8 22-22 38Z"/>
    <circle cx="50" cy="44" r="9"/>`,
  chart: `
    <path d="M24 22v56h56"/>
    <rect x="36" y="52" width="9" height="20"/>
    <rect x="52" y="40" width="9" height="32"/>
    <rect x="68" y="30" width="9" height="42"/>`,
  heart: `
    <path d="M50 78C28 62 20 52 20 40a16 16 0 0 1 30-8 16 16 0 0 1 30 8c0 12-8 22-30 38Z"/>`,
  book: `
    <path d="M50 30C42 24 30 24 22 26v46c8-2 20-2 28 4 8-6 20-6 28-4V26c-8-2-20-2-28 4Z"/>
    <path d="M50 30v50"/>`,
  link: `
    <rect x="24" y="38" width="30" height="24" rx="12"/>
    <rect x="46" y="38" width="30" height="24" rx="12"/>`,
  hands: `
    <path d="M22 66c8-14 20-20 28-20s20 6 28 20"/>
    <path d="M30 74c6-10 14-14 20-14s14 4 20 14"/>
    <circle cx="50" cy="34" r="7"/>`,
  flame: `
    <path d="M50 20c10 14 20 20 20 34a20 20 0 0 1-40 0c0-8 4-12 8-16 2 6 6 8 6 8 0-10-2-16 6-26Z"/>`,
  star: `
    <path d="M50 20 60 42l24 3-18 17 5 24-21-12-21 12 5-24-18-17 24-3Z"/>`,
  smile: `
    <circle cx="50" cy="50" r="28"/>
    <circle cx="41" cy="44" r="2.5" fill="currentColor" stroke="none"/>
    <circle cx="59" cy="44" r="2.5" fill="currentColor" stroke="none"/>
    <path d="M38 58c3 5 8 8 12 8s9-3 12-8"/>`,
};

function svg(icon, label) {
  const paths = ICONS[icon] ?? ICONS.home;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1b2027"/>
      <stop offset="0.55" stop-color="#12161c"/>
      <stop offset="1" stop-color="#0b0e13"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.28" cy="0.22" r="0.9">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.10"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.02"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="34" height="34" patternUnits="userSpaceOnUse">
      <path d="M34 0H0V34" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect width="1200" height="800" fill="url(#grid)"/>
  <rect width="1200" height="800" fill="url(#glow)"/>

  <!-- motivo (watermark) -->
  <g transform="translate(600 380) scale(5.4) translate(-50 -50)"
     fill="none" stroke="#ffffff" stroke-opacity="0.14"
     stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
     color="#ffffff">
    ${paths}
  </g>

  <!-- rótulo -->
  <g transform="translate(64 690)">
    <rect x="0" y="-30" width="40" height="3" rx="1.5" fill="#ffffff" fill-opacity="0.5"/>
    <text x="0" y="8" font-family="Inter, Segoe UI, system-ui, sans-serif"
          font-size="34" font-weight="600" letter-spacing="0.14em"
          fill="#ffffff" fill-opacity="0.86">${label.toUpperCase()}</text>
  </g>
</svg>
`;
}

const MODULES = [
  ["modules/membros", "users", "Membros"],
  ["modules/celulas", "home", "Células"],
  ["modules/mapa", "pin", "Mapa de Células"],
  ["modules/relatorios", "chart", "Relatório de Células"],
  ["modules/ministerios", "heart", "Ministérios"],
  ["modules/abrigo", "home", "Abrigo"],
  ["modules/escola", "book", "Escola de Discípulos"],
];

const MINISTERIOS = [
  ["ministerios/amar", "heart", "Amar"],
  ["ministerios/consolidar", "link", "Consolidar"],
  ["ministerios/acolher", "hands", "Acolher"],
  ["ministerios/fgy", "flame", "FGY · Jovens"],
  ["ministerios/fgt", "star", "FGT · Adolescentes"],
  ["ministerios/kids", "smile", "Kids"],
];

let n = 0;
for (const [path, icon, label] of [...MODULES, ...MINISTERIOS]) {
  const file = join(OUT, `${path}.svg`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, svg(icon, label));
  n++;
}
console.log(`Gerados ${n} placeholders em public/images/`);
