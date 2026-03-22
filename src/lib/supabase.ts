import { createClient } from '@supabase/supabase-js';

const viteEnv =
  typeof import.meta !== 'undefined'
    ? (import.meta as ImportMeta & {
        env?: Record<string, string | undefined>;
      }).env
    : undefined;

const supabaseUrl =
  viteEnv?.VITE_SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.VITE_SUPABASE_URL ??
  '';
const supabaseAnonKey =
  viteEnv?.VITE_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY ??
  '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Variables d'environnement Supabase manquantes. Vérifiez VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY ou NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'x-application-name': 'portfolio',
    },
  },
});
