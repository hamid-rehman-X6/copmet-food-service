import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { env } from "@/server/config/env";

let pool: Pool | undefined;

function getPool() {
  if (!pool) {
    const database = env.database;

    pool = new Pool({
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
