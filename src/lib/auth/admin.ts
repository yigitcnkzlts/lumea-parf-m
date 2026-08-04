import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasValidAdminGateCookie } from "@/lib/auth/admin-gate";

export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

/**
 * Admin API access:
 * 1) Panel şifre cookie (ADMIN_PANEL_PASSWORD) — tercih edilen
 * 2) Fallback: Supabase profiles.role = admin
 */
export async function requireAdmin() {
  if (await hasValidAdminGateCookie()) {
    return {
      user: { id: "panel-gate", email: "panel@bee.local" },
      profile: { id: "panel-gate", role: "admin", email: "panel@bee.local", full_name: "Bee Panel" },
      via: "password" as const,
    };
  }

  const user = await requireUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, role, email, full_name")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "admin") return null;
  return { user, profile, via: "supabase" as const };
}
