import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
// Prefer the newer publishable key (if provided by Supabase dashboard), fall back to the anon key.
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseKey) {
  // don't throw in dev; just warn so app can still type-check
  console.warn(
    "Supabase environment variables are not set: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

// IMPORTANT: never use the service_role key on the client. The service role key must only live on the server.
export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
