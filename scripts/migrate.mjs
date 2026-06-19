import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";
import pg from "pg";

const { Client } = pg;

dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config({ path: path.join(process.cwd(), ".env") });

// Prefer DATABASE_URL (e.g. the Neon connection string) when present; otherwise
// require the discrete DB_* vars used for local development.
const connectionString = process.env.DATABASE_URL?.trim();

if (!connectionString) {
  const requiredEnv = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"];

  for (const key of requiredEnv) {
    if (!process.env[key]) {
      throw new Error(`${key} is required to run migrations (or set DATABASE_URL).`);
    }
  }
}

const client = connectionString
  ? new Client({ connectionString, ssl: { rejectUnauthorized: false } })
  : new Client({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl:
        process.env.DB_SSL === "true"
          ? { rejectUnauthorized: false }
          : undefined,
    });

const migrationsDirectory = path.join(process.cwd(), "database", "migrations");

await client.connect();

try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const files = (await readdir(migrationsDirectory))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const applied = await client.query(
      "SELECT 1 FROM schema_migrations WHERE name = $1",
      [file],
    );

    if (applied.rowCount) {
      console.log(`Skipping ${file}`);
      continue;
    }

    const sql = await readFile(path.join(migrationsDirectory, file), "utf8");

    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [
        file,
      ]);
      await client.query("COMMIT");
      console.log(`Applied ${file}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }
} finally {
  await client.end();
}
