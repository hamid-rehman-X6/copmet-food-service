import type { QueryResultRow } from "pg";
import { query } from "@/server/db/pool";
import type { AdminWhatsappNumber } from "@/types/admin.types";

type Row = QueryResultRow & {
  id: string;
  label: string | null;
  phone: string;
  is_active: boolean;
  created_at: Date;
};

function toWhatsappNumber(row: Row): AdminWhatsappNumber {
  return {
    id: row.id,
    label: row.label,
    phone: row.phone,
    isActive: row.is_active,
    createdAt: row.created_at.toISOString(),
  };
}

const SELECT = "SELECT id, label, phone, is_active, created_at FROM admin_whatsapp_numbers";

export async function listWhatsappNumbers(): Promise<AdminWhatsappNumber[]> {
  const result = await query<Row>(`${SELECT} ORDER BY created_at ASC`);
  return result.rows.map(toWhatsappNumber);
}

/** Active numbers only, used by order placement to build the hand-off links. */
export async function listActiveWhatsappNumbers(): Promise<AdminWhatsappNumber[]> {
  const result = await query<Row>(`${SELECT} WHERE is_active ORDER BY created_at ASC`);
  return result.rows.map(toWhatsappNumber);
}

export async function createWhatsappNumber(input: {
  label: string | null;
  phone: string;
  isActive: boolean;
}): Promise<AdminWhatsappNumber> {
  const result = await query<Row>(
    `INSERT INTO admin_whatsapp_numbers (label, phone, is_active)
     VALUES ($1, $2, $3)
     RETURNING id, label, phone, is_active, created_at`,
    [input.label, input.phone, input.isActive],
  );

  return toWhatsappNumber(result.rows[0]);
}

export async function updateWhatsappNumber(
  id: string,
  input: { label?: string | null; phone?: string; isActive?: boolean },
): Promise<AdminWhatsappNumber | null> {
  const result = await query<Row>(
    `UPDATE admin_whatsapp_numbers SET
       label = COALESCE($2, label),
       phone = COALESCE($3, phone),
       is_active = COALESCE($4, is_active),
       updated_at = NOW()
     WHERE id = $1
     RETURNING id, label, phone, is_active, created_at`,
    [id, input.label ?? null, input.phone ?? null, input.isActive ?? null],
  );

  return result.rows[0] ? toWhatsappNumber(result.rows[0]) : null;
}

export async function deleteWhatsappNumber(id: string): Promise<boolean> {
  const result = await query("DELETE FROM admin_whatsapp_numbers WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}
