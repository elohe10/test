// ─────────────────────────────────────────────────────────────
// Supabase client — shared across the app
// Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
// to your .env.local file before using this.
// ─────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
