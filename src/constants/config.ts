import { env } from '@/lib/env';

export const STORAGE_BUCKET = env.storageBucket;

export const IMAGE = {
  /** Target output size after compression (MB). */
  maxSizeMB: 0.5,
  /** Longest edge after downscale (px). */
  maxWidthOrHeight: 1280,
  /** Accepted input types. */
  accept: 'image/jpeg,image/png,image/webp,image/heic',
  /** Hard reject above this raw input size (MB) before compression. */
  maxInputMB: 15,
};

export const PETS_QUERY_KEY = 'pets';
