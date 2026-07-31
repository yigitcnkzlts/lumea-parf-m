export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  return { url, anonKey };
}

export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabasePublicEnv();
  return Boolean(
    url &&
      anonKey &&
      !url.includes("YOUR_PROJECT_REF") &&
      !anonKey.includes("YOUR_SUPABASE_ANON_KEY"),
  );
}

export function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
}

export function isSupabaseServiceConfigured() {
  const key = getSupabaseServiceRoleKey();
  return isSupabaseConfigured() && Boolean(key) && !key.includes("YOUR_SUPABASE_SERVICE_ROLE_KEY");
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000").replace(/\/$/, "");
}

export function missingSupabaseMessage() {
  return "Supabase yapılandırması eksik. NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY ve sunucu tarafında SUPABASE_SERVICE_ROLE_KEY değerlerini .env.local dosyasına ekleyin.";
}
