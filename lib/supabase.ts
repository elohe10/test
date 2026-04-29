// ─────────────────────────────────────────────────────────────
// Supabase client — shared across the app
// Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
// to your .env.local file before using this.
// ─────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

// Fallback values prevent the build from crashing when env vars are not set.
// At runtime, the real values from .env.local (or Vercel env vars) are used.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-key"
);

// ─────────────────────────────────────────────────────────────
// TypeScript type for a reservation row
// ─────────────────────────────────────────────────────────────
export type Reservation = {
  id?: number;
  full_name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  special_requests?: string;
  created_at?: string;
};
