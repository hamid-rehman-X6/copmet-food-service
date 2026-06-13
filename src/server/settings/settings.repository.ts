import type { QueryResultRow } from "pg";
import { query } from "@/server/db/pool";
import type { PublicSettings } from "@/types/settings.types";

// Raw row shape from the singleton app_settings table. NUMERIC columns are
// returned as strings by `pg`, so they are converted to numbers on mapping.
type SettingsRow = QueryResultRow & {
  currency_code: string;
  currency_locale: string;
  delivery_fee: string;
  free_delivery_threshold: string;
};

function toPublicSettings(row: SettingsRow): PublicSettings {
  return {
    currencyCode: row.currency_code,
    currencyLocale: row.currency_locale,
    deliveryFee: Number(row.delivery_fee),
    freeDeliveryThreshold: Number(row.free_delivery_threshold),
  };
}

/** Read the single settings row. */
export async function getSettingsRow(): Promise<PublicSettings> {
  const result = await query<SettingsRow>(
    `SELECT currency_code, currency_locale, delivery_fee, free_delivery_threshold
     FROM app_settings
     WHERE id = 1
     LIMIT 1`,
  );

  return toPublicSettings(result.rows[0]);
}

/** Update store settings. Only the provided fields are changed. */
export async function updateSettingsRow(input: Partial<PublicSettings>): Promise<PublicSettings> {
  const result = await query<SettingsRow>(
    `UPDATE app_settings SET
       currency_code = COALESCE($1, currency_code),
       currency_locale = COALESCE($2, currency_locale),
       delivery_fee = COALESCE($3, delivery_fee),
       free_delivery_threshold = COALESCE($4, free_delivery_threshold),
       updated_at = NOW()
     WHERE id = 1
     RETURNING currency_code, currency_locale, delivery_fee, free_delivery_threshold`,
    [
      input.currencyCode ?? null,
      input.currencyLocale ?? null,
      input.deliveryFee ?? null,
      input.freeDeliveryThreshold ?? null,
    ],
  );

  return toPublicSettings(result.rows[0]);
}
