import { v2 as cloudinary } from "cloudinary";
import { env } from "@/server/config/env";

// Thin wrapper around the Cloudinary SDK for image hosting. Uploaded image bytes
// are validated by the caller, then stored on Cloudinary; only the resulting
// secure URL and public id are persisted in our database.

let configured = false;

function ensureConfigured() {
  if (configured) {
    return;
  }

  const { cloudName, apiKey, apiSecret } = env.cloudinary;
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  configured = true;
}

export type UploadedImage = {
  url: string;
  publicId: string;
};

/**
 * Upload image bytes to Cloudinary under the given folder. Returns the secure
 * URL and public id to persist. The buffer is sent as a base64 data URI so no
 * temp file or stream plumbing is needed.
 */
export async function uploadImage(buffer: Buffer, mimeType: string, folder: string): Promise<UploadedImage> {
  ensureConfigured();

  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
    overwrite: true,
    invalidate: true,
  });

  return { url: result.secure_url, publicId: result.public_id };
}

/** Remove an image from Cloudinary by its public id. Safe to call best-effort. */
export async function deleteImage(publicId: string): Promise<void> {
  ensureConfigured();
  await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true });
}
