-- Move avatar storage from in-database bytes to Cloudinary-hosted URLs.
--
-- Avatars are now uploaded to Cloudinary; we persist only the secure URL and the
-- public id (needed to delete/replace the asset). Existing binary avatars can't
-- be migrated automatically, so clear the table first — users can re-upload.

DELETE FROM user_avatars;

ALTER TABLE user_avatars
  DROP COLUMN IF EXISTS mime_type,
  DROP COLUMN IF EXISTS byte_size,
  DROP COLUMN IF EXISTS data,
  ADD COLUMN image_url TEXT NOT NULL,
  ADD COLUMN public_id TEXT NOT NULL;

COMMENT ON TABLE user_avatars IS 'One Cloudinary-hosted avatar per user (image_url + public_id).';
