function required(key: keyof ImportMetaEnv, value: string | undefined): string {
  if (!value || value.includes('YOUR_PROJECT') || value === 'your-anon-public-key') {
    throw new Error(
      `Missing or placeholder env var ${key}. Copy .env.example to .env.local and set real Supabase values.`,
    );
  }
  return value;
}

export const env = {
  supabaseUrl: required('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
  supabaseAnonKey: required('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY),
  storageBucket: import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'pet-images',
};
