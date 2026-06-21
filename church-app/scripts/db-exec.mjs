// Executa um arquivo .sql no banco. Uso: DB_URL=... node scripts/db-exec.mjs <arquivo.sql>
import { readFileSync } from "node:fs";
import pg from "pg";

const url = process.env.DB_URL;
const file = process.argv[2];
if (!url || !file) {
  console.error("Falta DB_URL ou arquivo SQL.");
  process.exit(1);
}

const sql = readFileSync(file, "utf8");
const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  console.log(`OK: ${file} aplicado com sucesso.`);
} catch (err) {
  console.error("ERRO ao aplicar:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
