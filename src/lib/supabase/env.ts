function readPublicKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    ""
  );
}

export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const publishableKey = readPublicKey();
  return { url, publishableKey, anonKey: publishableKey };
}

export function isSupabaseConfigured() {
  const { url, publishableKey } = getSupabasePublicEnv();
  return Boolean(
    url &&
      publishableKey &&
      !url.includes("YOUR_PROJECT_REF") &&
      !url.includes("BURAYA_PROJECT_REF") &&
      !publishableKey.includes("YOUR_SUPABASE") &&
      !publishableKey.includes("YOUR_PUBLISHABLE"),
  );
}

export function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
}

export function isSupabaseServiceConfigured() {
  const key = getSupabaseServiceRoleKey();
  return (
    isSupabaseConfigured() &&
    Boolean(key) &&
    !key.includes("YOUR_SUPABASE_SERVICE_ROLE_KEY") &&
    !key.startsWith("NEXT_PUBLIC_")
  );
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000").replace(/\/$/, "");
}

export function missingSupabaseMessage() {
  return "Supabase yapılandırması eksik. NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ve sunucu tarafında SUPABASE_SERVICE_ROLE_KEY değerlerini .env.local dosyasına ekleyin.";
}
