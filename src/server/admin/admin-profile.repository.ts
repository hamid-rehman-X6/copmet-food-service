import { query } from "@/server/db/pool";

type Row = {
  display_name: string | null;
  avatar_url: string | null;
  avatar_public_id: string | null;
};

export type AdminProfileRow = {
  displayName: string | null;
  avatarUrl: string | null;
  avatarPublicId: string | null;
};

function toRow(row: Row): AdminProfileRow {
  return { displayName: row.display_name, avatarUrl: row.avatar_url, avatarPublicId: row.avatar_public_id };
}

export async function getAdminProfileRow(): Promise<AdminProfileRow | null> {
  const result = await query<Row>(
    "SELECT display_name, avatar_url, avatar_public_id FROM admin_profile WHERE id = 1 LIMIT 1",
  );
  return result.rows[0] ? toRow(result.rows[0]) : null;
}

export async function updateAdminDisplayName(name: string): Promise<void> {
  await query(
    `INSERT INTO admin_profile (id, display_name, updated_at)
     VALUES (1, $1, NOW())
     ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name, updated_at = NOW()`,
    [name],
  );
}

export async function updateAdminAvatar(input: { url: string; publicId: string }): Promise<void> {
  await query(
    `INSERT INTO admin_profile (id, avatar_url, avatar_public_id, updated_at)
     VALUES (1, $1, $2, NOW())
     ON CONFLICT (id) DO UPDATE SET avatar_url = EXCLUDED.avatar_url,
       avatar_public_id = EXCLUDED.avatar_public_id, updated_at = NOW()`,
    [input.url, input.publicId],
  );
}

/** Clear the avatar columns. The caller reads the old public id first (for cleanup). */
export async function clearAdminAvatar(): Promise<void> {
  await query("UPDATE admin_profile SET avatar_url = NULL, avatar_public_id = NULL, updated_at = NOW() WHERE id = 1");
}
