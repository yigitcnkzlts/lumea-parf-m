import { NextResponse } from "next/server";
import { requireAdmin, requireUser } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSupabasePublicEnv, isSupabaseServiceConfigured, missingSupabaseMessage } from "@/lib/supabase/env";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  try {
    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({ error: missingSupabaseMessage() }, { status: 503 });
    }

    const purpose = request.headers.get("x-upload-purpose") ?? "product";
    if (purpose === "product") {
      const admin = await requireAdmin();
      if (!admin) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
    } else {
      const user = await requireUser();
      if (!user) return NextResponse.json({ error: "Yorum fotoğrafı için giriş yapın." }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Dosya gerekli." }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: "Sadece JPG, PNG, WEBP, GIF." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Dosya en fazla 4 MB olabilir." }, { status: 400 });
    }

    const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
    const path = `${purpose}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const admin = createAdminClient();

    const { error } = await admin.storage.from("product-images").upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      return NextResponse.json(
        {
          error: `Yükleme başarısız: ${error.message}. Supabase’de 003 migration (product-images bucket) çalıştırıldı mı?`,
        },
        { status: 400 },
      );
    }

    const { url } = getSupabasePublicEnv();
    const publicUrl = `${url.replace(/\/$/, "")}/storage/v1/object/public/product-images/${path}`;
    return NextResponse.json({ url: publicUrl, path });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Yükleme hatası";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
