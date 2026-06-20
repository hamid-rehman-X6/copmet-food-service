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

/** Insert or replace the user's avatar; returns the stored Cloudinary URL. */
export async function upsertAvatar(
  userId: string,
  input: { imageUrl: string; publicId: string },
): Promise<string> {
  const result = await query<{ image_url: string }>(
    `INSERT INTO user_avatars (user_id, image_url, public_id, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (user_id)
     DO UPDATE SET image_url = EXCLUDED.image_url, public_id = EXCLUDED.public_id, updated_at = NOW()
     RETURNING image_url`,
    [userId, input.imageUrl, input.publicId],
  );

  return result.rows[0].image_url;
}

export async function getAvatar(userId: string): Promise<{ imageUrl: string; publicId: string } | null> {
  const result = await query<{ image_url: string; public_id: string }>(
    "SELECT image_url, public_id FROM user_avatars WHERE user_id = $1 LIMIT 1",
    [userId],
  );

  const row = result.rows[0];
  return row ? { imageUrl: row.image_url, publicId: row.public_id } : null;
}

/** Delete the avatar row; returns the removed public id for Cloudinary cleanup. */
export async function deleteAvatar(userId: string): Promise<string | null> {
  const result = await query<{ public_id: string }>(
    "DELETE FROM user_avatars WHERE user_id = $1 RETURNING public_id",
    [userId],
  );

  return result.rows[0]?.public_id ?? null;
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
