import { errors } from "@/server/api/errors";
import { ALLOWED_AVATAR_MIME_TYPES, MAX_AVATAR_BYTES, MAX_AVATAR_MB } from "@/constants/profile.constants";

// Authoritative, dependency-free image validation for avatar uploads.
//
// The browser can be bypassed, so the server independently verifies that an
// upload is a genuine, non-truncated PNG/JPEG/WebP by inspecting the binary
// signature (magic bytes) AND the trailing markers. This rejects files with a
// spoofed extension/MIME type and catches the most common form of corruption:
// a truncated file whose header is intact but whose end marker is missing.

type DetectedType = { mimeType: string };

function startsWith(buffer: Buffer, signature: number[], offset = 0) {
  if (buffer.length < offset + signature.length) {
    return false;
  }

  return signature.every((byte, index) => buffer[offset + index] === byte);
}

// PNG: 8-byte signature ... ends with the IEND chunk + CRC.
function isValidPng(buffer: Buffer) {
  const header = startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  // "IEND" (49 45 4e 44) appears just before the final 4-byte CRC.
  const tail = buffer.subarray(-8);
  const hasIend = startsWith(tail, [0x49, 0x45, 0x4e, 0x44]);
  return header && hasIend;
}

// JPEG: starts with SOI (FF D8 FF) and ends with EOI (FF D9).
function isValidJpeg(buffer: Buffer) {
  const header = startsWith(buffer, [0xff, 0xd8, 0xff]);
  const end = buffer.length >= 2 && buffer[buffer.length - 2] === 0xff && buffer[buffer.length - 1] === 0xd9;
  return header && end;
}

// WebP: RIFF container ("RIFF" .... "WEBP") whose declared chunk size matches
// the actual byte length, which detects truncation.
function isValidWebp(buffer: Buffer) {
  if (buffer.length < 12) {
    return false;
  }

  const hasRiff = startsWith(buffer, [0x52, 0x49, 0x46, 0x46]);
  const hasWebp = startsWith(buffer, [0x57, 0x45, 0x42, 0x50], 8);
  // Bytes 4-7 hold the file size minus 8, little-endian.
  const declaredSize = buffer.readUInt32LE(4);
  const sizeMatches = declaredSize === buffer.length - 8;
  return hasRiff && hasWebp && sizeMatches;
}

/**
 * Validate avatar image bytes. Throws an AppError (400) when the file is empty,
 * too large, or not a well-formed PNG/JPEG/WebP. Returns the detected MIME type
 * derived from the signature — never the (spoofable) client-declared type.
 */
export function validateAvatarImage(buffer: Buffer): DetectedType {
  if (buffer.length === 0) {
    throw errors.badRequest("The uploaded image is empty.");
  }

  if (buffer.length > MAX_AVATAR_BYTES) {
    throw errors.badRequest(`The image is too large. Maximum size is ${MAX_AVATAR_MB} MB.`);
  }

  let mimeType: string | null = null;

  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47])) {
    if (!isValidPng(buffer)) {
      throw errors.badRequest("The PNG image appears to be corrupted or incomplete.");
    }
    mimeType = "image/png";
  } else if (startsWith(buffer, [0xff, 0xd8, 0xff])) {
    if (!isValidJpeg(buffer)) {
      throw errors.badRequest("The JPEG image appears to be corrupted or incomplete.");
    }
    mimeType = "image/jpeg";
  } else if (startsWith(buffer, [0x52, 0x49, 0x46, 0x46])) {
    if (!isValidWebp(buffer)) {
      throw errors.badRequest("The WebP image appears to be corrupted or incomplete.");
    }
    mimeType = "image/webp";
  }

  if (!mimeType || !ALLOWED_AVATAR_MIME_TYPES.includes(mimeType)) {
    throw errors.badRequest("Unsupported image type. Upload a PNG, JPEG, or WebP file.");
  }

  return { mimeType };
}
