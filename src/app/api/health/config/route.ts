import { NextResponse } from "next/server";
import { isSupabaseConfigured, isSupabaseServiceConfigured } from "@/lib/supabase/env";
import { isIyzicoConfigured } from "@/lib/payments";

/** Safe status only — never returns secret values. */
export async function GET() {
  return NextResponse.json({
    supabasePublic: isSupabaseConfigured(),
    supabaseService: isSupabaseServiceConfigured(),
    iyzico: isIyzicoConfigured(),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
  });
}
