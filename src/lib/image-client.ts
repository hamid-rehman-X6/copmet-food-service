import { ALLOWED_AVATAR_MIME_TYPES, MAX_AVATAR_BYTES, MAX_AVATAR_MB } from "@/constants/profile.constants";

// Client-side avatar pre-validation. Mirrors the server rules for instant
// feedback, and additionally tries to decode the file so obviously corrupted
// images are caught before upload. The server remains the source of truth.
// Returns an error message, or null when the file is acceptable.
export async function validateAvatarFile(file: File): Promise<string | null> {
  if (!ALLOWED_AVATAR_MIME_TYPES.includes(file.type)) {
    return "Unsupported format. Please choose a PNG, JPEG, or WebP image.";
  }

  if (file.size === 0) {
    return "This file is empty.";
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return `The image is too large. Maximum size is ${MAX_AVATAR_MB} MB.`;
  }

  // Decoding verifies the bytes form a real, non-corrupted image.
  try {
    const bitmap = await createImageBitmap(file);
    bitmap.close();
  } catch {
    return "This image appears to be corrupted or unreadable.";
  }

  return null;
}
