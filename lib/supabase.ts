import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-key"
);

export type Reservation = {
  id?: number;
  full_name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  special_requests?: string | null;
  status?: string;
  tables_reserved?: number;
  created_at?: string;
};
