import { env } from '@/lib/env';

export const STORAGE_BUCKET = env.storageBucket;

export const IMAGE = {
  /** Target output size after compression (MB) — ~300 KB. */
  maxSizeMB: 0.3,
  /** Longest edge after downscale (px). */
  maxWidthOrHeight: 1200,
  /** Compression quality (0–1) — 80%. */
  quality: 0.8,
  /** Accepted input types. Large files are optimized automatically, never rejected. */
  accept: 'image/jpeg,image/png,image/webp,image/heic',
};

export const PETS_QUERY_KEY = 'pets';
