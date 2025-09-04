import { createClient } from "@supabase/supabase-js";

export function createServerSupabase() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
	return createClient(url, key);
}

