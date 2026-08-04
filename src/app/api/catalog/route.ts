import { NextResponse } from "next/server";
import { getCatalogProducts } from "@/lib/catalog/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getCatalogProducts();
    return NextResponse.json({ products });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Katalog alınamadı.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
