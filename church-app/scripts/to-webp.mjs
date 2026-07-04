// Converte PNG/JPG de public/images para WebP (bem mais leve), preservando a
// proporção. Redimensiona para no máx. 1400px de largura (suficiente p/ os
// cards, inclusive em telas retina). Uso: node scripts/to-webp.mjs [pasta]

import { readdirSync, statSync } from "node:fs";
import { join, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const alvo = process.argv[2]
  ? join(process.cwd(), process.argv[2])
  : join(__dirname, "..", "public", "images", "modules");

const MAX_W = 1400;
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

const arquivos = readdirSync(alvo).filter((f) =>
  /\.(png|jpe?g)$/i.test(f),
);

if (arquivos.length === 0) {
  console.log(`Nenhum PNG/JPG em ${alvo}`);
  process.exit(0);
}

for (const f of arquivos) {
  const entrada = join(alvo, f);
  const saida = join(alvo, `${basename(f, extname(f))}.webp`);
  const antes = statSync(entrada).size;

  const img = sharp(entrada);
  const meta = await img.metadata();
  if (meta.width && meta.width > MAX_W) img.resize({ width: MAX_W });

  await img.webp({ quality: 82, effort: 5 }).toFile(saida);
  const depois = statSync(saida).size;
  console.log(
    `${f} → ${basename(saida)}  ${kb(antes)} → ${kb(depois)}  (-${(
      100 -
      (depois / antes) * 100
    ).toFixed(0)}%)`,
  );
}
console.log("\nOK. Confira as imagens .webp em", alvo);
