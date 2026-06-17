import type { QueryResultRow } from "pg";
import { query } from "@/server/db/pool";
import { findUserById, toAuthUser } from "@/server/auth/auth.repository";
import type { AuthUser } from "@/types/auth.types";
import type { DeliveryDefaults } from "@/types/profile.types";

// --- Profile details ------------------------------------------------------

/** True if another user (not `userId`) already uses this email. */
export async function emailTakenByAnotherUser(email: string, userId: string): Promise<boolean> {
  const result = await query<{ exists: boolean }>(
    "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1 AND id <> $2) AS exists",
    [email, userId],
  );
  return Boolean(result.rows[0]?.exists);
}

/** Update name/email, then return the refreshed auth user (with avatar info). */
export async function updateUserProfile(
  userId: string,
  input: { firstName: string; lastName: string; email: string },
): Promise<AuthUser | null> {
  const result = await query(
    `UPDATE users
     SET first_name = $2, last_name = $3, email = $4, updated_at = NOW()
     WHERE id = $1`,
    [userId, input.firstName, input.lastName, input.email],
  );

  if ((result.rowCount ?? 0) === 0) {
    return null;
  }

  const row = await findUserById(userId);
  return row ? toAuthUser(row) : null;
}

// --- Password -------------------------------------------------------------

export async function getUserPasswordHash(userId: string): Promise<string | null> {
  const result = await query<{ password_hash: string }>(
    "SELECT password_hash FROM users WHERE id = $1 AND is_active = TRUE LIMIT 1",
    [userId],
  );
  return result.rows[0]?.password_hash ?? null;
}

export async function updateUserPassword(userId: string, passwordHash: string): Promise<void> {
  await query("UPDATE users SET password_hash = $2, updated_at = NOW() WHERE id = $1", [userId, passwordHash]);
}

// --- Avatar ---------------------------------------------------------------

/** Insert or replace the user's avatar; returns the new updated_at timestamp. */
export async function upsertAvatar(
  userId: string,
  input: { mimeType: string; byteSize: number; data: Buffer },
): Promise<string> {
  const result = await query<{ updated_at: Date }>(
    `INSERT INTO user_avatars (user_id, mime_type, byte_size, data, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (user_id)
     DO UPDATE SET mime_type = EXCLUDED.mime_type, byte_size = EXCLUDED.byte_size,
       data = EXCLUDED.data, updated_at = NOW()
     RETURNING updated_at`,
    [userId, input.mimeType, input.byteSize, input.data],
  );

  return result.rows[0].updated_at.toISOString();
}

export async function getAvatar(userId: string): Promise<{ mimeType: string; data: Buffer; updatedAt: Date } | null> {
  const result = await query<{ mime_type: string; data: Buffer; updated_at: Date }>(
    "SELECT mime_type, data, updated_at FROM user_avatars WHERE user_id = $1 LIMIT 1",
    [userId],
  );

  const row = result.rows[0];
  return row ? { mimeType: row.mime_type, data: row.data, updatedAt: row.updated_at } : null;
}

export async function deleteAvatar(userId: string): Promise<boolean> {
  const result = await query("DELETE FROM user_avatars WHERE user_id = $1", [userId]);
  return (result.rowCount ?? 0) > 0;
}

// --- Delivery defaults ----------------------------------------------------

type DeliveryDefaultsRow = QueryResultRow & {
  default_phone: string | null;
  default_address: string | null;
  default_city: string | null;
  default_postal_code: string | null;
  default_instructions: string | null;
};

function toDeliveryDefaults(row: DeliveryDefaultsRow): DeliveryDefaults {
  return {
    phone: row.default_phone,
    address: row.default_address,
    city: row.default_city,
    postalCode: row.default_postal_code,
    instructions: row.default_instructions,
  };
}

const EMPTY_DELIVERY_DEFAULTS: DeliveryDefaults = {
  phone: null,
  address: null,
  city: null,
  postalCode: null,
  instructions: null,
};

export async function getDeliveryDefaults(userId: string): Promise<DeliveryDefaults> {
  const result = await query<DeliveryDefaultsRow>(
    `SELECT default_phone, default_address, default_city, default_postal_code, default_instructions
     FROM users WHERE id = $1 LIMIT 1`,
    [userId],
  );

  return result.rows[0] ? toDeliveryDefaults(result.rows[0]) : EMPTY_DELIVERY_DEFAULTS;
}

export async function updateDeliveryDefaults(
  userId: string,
  input: DeliveryDefaults,
): Promise<DeliveryDefaults | null> {
  const result = await query<DeliveryDefaultsRow>(
    `UPDATE users SET
       default_phone = $2, default_address = $3, default_city = $4,
       default_postal_code = $5, default_instructions = $6, updated_at = NOW()
     WHERE id = $1
     RETURNING default_phone, default_address, default_city, default_postal_code, default_instructions`,
    [userId, input.phone, input.address, input.city, input.postalCode, input.instructions],
  );

  return result.rows[0] ? toDeliveryDefaults(result.rows[0]) : null;
}
