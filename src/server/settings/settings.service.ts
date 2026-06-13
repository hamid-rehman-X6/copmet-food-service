import { getSettingsRow, updateSettingsRow } from "@/server/settings/settings.repository";
import type { PublicSettings } from "@/types/settings.types";

// Settings change rarely but are read on nearly every page render (for currency
// formatting). A short in-process TTL cache keeps reads fast without a DB hit on
// every request, while still picking up admin edits within a few seconds. The
// cache is also invalidated immediately when an admin saves changes.
const CACHE_TTL_MS = 30_000;

let cachedSettings: PublicSettings | null = null;
let cachedAt = 0;

/** Get store settings, served from the in-process cache when fresh. */
export async function getSettings(): Promise<PublicSettings> {
  const now = Date.now();

  if (cachedSettings && now - cachedAt < CACHE_TTL_MS) {
    return cachedSettings;
  }

  cachedSettings = await getSettingsRow();
  cachedAt = now;
  return cachedSettings;
}

/** Update store settings and refresh the cache with the new values. */
export async function updateSettings(input: Partial<PublicSettings>): Promise<PublicSettings> {
  cachedSettings = await updateSettingsRow(input);
  cachedAt = Date.now();
  return cachedSettings;
}
