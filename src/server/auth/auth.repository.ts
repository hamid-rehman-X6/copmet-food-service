import type { PoolClient, QueryResultRow } from "pg";
import { query } from "@/server/db/pool";
import type { AuthUser, UserRole } from "@/types/auth.types";

type UserRow = QueryResultRow & {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
};

export type RefreshSessionRow = QueryResultRow & {
  id: string;
  family_id: string;
  user_id: string;
  token_hash: string;
  remember_me: boolean;
  expires_at: Date;
  revoked_at: Date | null;
};

type Executor = PoolClient | undefined;

async function execute<T extends QueryResultRow>(executor: Executor, text: string, values: unknown[] = []) {
  return executor ? executor.query<T>(text, values) : query<T>(text, values);
}

export function toAuthUser(row: UserRow): AuthUser {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at.toISOString(),
  };
}

export async function findUserByEmail(email: string, executor?: PoolClient) {
  const result = await execute<UserRow>(
    executor,
    `SELECT id, first_name, last_name, email, password_hash, role, is_active, created_at
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email],
  );

  return result.rows[0] ?? null;
}

export async function findUserById(id: string, executor?: PoolClient) {
  const result = await execute<UserRow>(
    executor,
    `SELECT id, first_name, last_name, email, password_hash, role, is_active, created_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function createUser(
  input: { firstName: string; lastName: string; email: string; passwordHash: string },
  executor?: PoolClient,
) {
  const result = await execute<UserRow>(
    executor,
    `INSERT INTO users (first_name, last_name, email, password_hash, terms_accepted_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, first_name, last_name, email, password_hash, role, is_active, created_at`,
    [input.firstName, input.lastName, input.email, input.passwordHash],
  );

  return result.rows[0];
}

export async function markUserLogin(userId: string, executor?: PoolClient) {
  await execute(executor, "UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1", [userId]);
}

export async function createRefreshSession(
  input: {
    id: string;
    familyId: string;
    userId: string;
    tokenHash: string;
    rememberMe: boolean;
    expiresAt: Date;
    userAgent: string | null;
    ipAddress: string | null;
  },
  executor?: PoolClient,
) {
  await execute(
    executor,
    `INSERT INTO refresh_sessions (id, family_id, user_id, token_hash, remember_me, expires_at, user_agent, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [input.id, input.familyId, input.userId, input.tokenHash, input.rememberMe, input.expiresAt, input.userAgent, input.ipAddress],
  );
}

export async function findRefreshSession(id: string, executor?: PoolClient, lock = false) {
  const result = await execute<RefreshSessionRow>(
    executor,
    `SELECT id, family_id, user_id, token_hash, remember_me, expires_at, revoked_at
     FROM refresh_sessions
     WHERE id = $1
     LIMIT 1
     ${lock ? "FOR UPDATE" : ""}`,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function revokeRefreshSession(id: string, replacedBy?: string, executor?: PoolClient) {
  await execute(
    executor,
    `UPDATE refresh_sessions
     SET revoked_at = COALESCE(revoked_at, NOW()), replaced_by = COALESCE(replaced_by, $2)
     WHERE id = $1`,
    [id, replacedBy ?? null],
  );
}

export async function revokeRefreshFamily(familyId: string, executor?: PoolClient) {
  await execute(
    executor,
    "UPDATE refresh_sessions SET revoked_at = COALESCE(revoked_at, NOW()) WHERE family_id = $1",
    [familyId],
  );
}
