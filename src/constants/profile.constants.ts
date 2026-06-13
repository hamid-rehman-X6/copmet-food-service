// Avatar upload constraints shared by the browser (pre-validation + accept
// attribute) and the server (authoritative validation). Keeping them in one
// place ensures both sides enforce exactly the same rules.

export const MAX_AVATAR_BYTES = 3 * 1024 * 1024; // 3 MB

// Allowed image MIME types mapped to their accepted file extensions.
export const ALLOWED_AVATAR_TYPES: Record<string, string[]> = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
};

export const ALLOWED_AVATAR_MIME_TYPES = Object.keys(ALLOWED_AVATAR_TYPES);

// Value for an <input type="file"> accept attribute.
export const AVATAR_ACCEPT_ATTRIBUTE = [
  ...ALLOWED_AVATAR_MIME_TYPES,
  ...Object.values(ALLOWED_AVATAR_TYPES).flat(),
].join(",");

export const MAX_AVATAR_MB = MAX_AVATAR_BYTES / (1024 * 1024);
