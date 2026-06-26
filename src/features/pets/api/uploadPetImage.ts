import imageCompression from 'browser-image-compression';
import { supabase } from '@/lib/supabase';
import { STORAGE_BUCKET, IMAGE } from '@/constants/config';

/**
 * Compress an image client-side and upload it to Supabase Storage.
 * Returns the public URL. Throws on failure.
 */
export async function uploadPetImage(file: File): Promise<string> {
  // Automatic: downscale to 1200px max edge, convert to WebP, compress to ~300 KB
  // at 80% quality. Large inputs are processed, never rejected.
  const compressed = await imageCompression(file, {
    maxSizeMB: IMAGE.maxSizeMB,
    maxWidthOrHeight: IMAGE.maxWidthOrHeight,
    initialQuality: IMAGE.quality,
    useWebWorker: true,
    fileType: 'image/webp',
  });

  const year = new Date().getFullYear();
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const path = `pets/${year}/${id}.webp`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, compressed, {
    contentType: 'image/webp',
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
