import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { env } from "@/server/config/env";

let pool: Pool | undefined;

function getPool() {
  if (!pool) {
    const database = env.database;

    pool =
      "url" in database
        ? new Pool({
            connectionString: database.url,
            // Managed Postgres (Neon, etc.) requires TLS. rejectUnauthorized is
            // false because the provider's cert chain isn't pinned here.
            ssl: { rejectUnauthorized: false },
            // Small per-instance cap: on serverless many instances run at once
            // behind Neon's pooler, so a large max would exhaust connections.
            max: 5,
            idleTimeoutMillis: 30_000,
            connectionTimeoutMillis: 10_000,
          })
        : new Pool({
            host: database.host,
            port: database.port,
            database: database.name,
            user: database.user,
            password: database.password,
            max: 10,
            idleTimeoutMillis: 30_000,
            connectionTimeoutMillis: 5_000,
            ssl: database.ssl ? { rejectUnauthorized: false } : undefined,
          });
  }

  return pool;
}

export async function query<T extends QueryResultRow>(text: string, values: unknown[] = []) {
  return getPool().query<T>(text, values);
}

export async function transaction<T>(callback: (client: PoolClient) => Promise<T>) {
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
