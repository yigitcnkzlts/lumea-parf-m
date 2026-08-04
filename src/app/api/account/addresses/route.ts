import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured, missingSupabaseMessage } from "@/lib/supabase/env";

export async function GET() {
  try {
    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({ error: missingSupabaseMessage() }, { status: 503 });
    }
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return NextResponse.json({ addresses: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Hata";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

const addressSchema = z.object({
  label: z.string().trim().min(1).max(40).default("Ev"),
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(10).max(20),
  city: z.string().trim().min(2).max(80),
  district: z.string().trim().min(2).max(80),
  addressLine: z.string().trim().min(5).max(500),
  isDefault: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({ error: missingSupabaseMessage() }, { status: 503 });
    }
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });

    const parsed = addressSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Geçersiz adres." }, { status: 400 });

    const admin = createAdminClient();
    if (parsed.data.isDefault) {
      await admin.from("addresses").update({ is_default: false }).eq("user_id", user.id);
    }

    const { data, error } = await admin
      .from("addresses")
      .insert({
        user_id: user.id,
        label: parsed.data.label,
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
        city: parsed.data.city,
        district: parsed.data.district,
        address_line: parsed.data.addressLine,
        is_default: parsed.data.isDefault ?? false,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ address: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Adres eklenemedi.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

const patchSchema = z.object({
  id: z.string().uuid(),
  label: z.string().trim().min(1).max(40).optional(),
  fullName: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().min(10).max(20).optional(),
  city: z.string().trim().min(2).max(80).optional(),
  district: z.string().trim().min(2).max(80).optional(),
  addressLine: z.string().trim().min(5).max(500).optional(),
  isDefault: z.boolean().optional(),
  delete: z.boolean().optional(),
});

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });

    const parsed = patchSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

    const admin = createAdminClient();
    if (parsed.data.delete) {
      const { error } = await admin.from("addresses").delete().eq("id", parsed.data.id).eq("user_id", user.id);
      if (error) throw new Error(error.message);
      return NextResponse.json({ ok: true });
    }

    if (parsed.data.isDefault) {
      await admin.from("addresses").update({ is_default: false }).eq("user_id", user.id);
    }

    const update: Record<string, unknown> = {};
    if (parsed.data.label !== undefined) update.label = parsed.data.label;
    if (parsed.data.fullName !== undefined) update.full_name = parsed.data.fullName;
    if (parsed.data.phone !== undefined) update.phone = parsed.data.phone;
    if (parsed.data.city !== undefined) update.city = parsed.data.city;
    if (parsed.data.district !== undefined) update.district = parsed.data.district;
    if (parsed.data.addressLine !== undefined) update.address_line = parsed.data.addressLine;
    if (parsed.data.isDefault !== undefined) update.is_default = parsed.data.isDefault;

    const { data, error } = await admin
      .from("addresses")
      .update(update)
      .eq("id", parsed.data.id)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ address: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Güncelleme başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
