import { createClient } from "@supabase/supabase-js";
import {
  getSupabasePublicEnv,
  getSupabaseServiceRoleKey,
  isSupabaseServiceConfigured,
  missingSupabaseMessage,
} from "@/lib/supabase/env";

/** Server-only Supabase client with service role. Never import from client components. */
export function createAdminClient() {
  if (!isSupabaseServiceConfigured()) {
    throw new Error(missingSupabaseMessage());
  }
  const { url } = getSupabasePublicEnv();
  return createClient(url, getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
