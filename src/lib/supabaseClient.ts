"use client";

import { createClient } from "@supabase/supabase-js";

// Public client for client-side usage (reads and simple writes under RLS)
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

