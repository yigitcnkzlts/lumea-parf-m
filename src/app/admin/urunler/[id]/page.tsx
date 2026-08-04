import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Ürün düzenle",
};

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId) || productId < 1) {
    return (
      <div>
        <p className="font-serif text-3xl">Geçersiz ürün</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[10px] tracking-[.28em] text-[#956f42]">DÜZENLE</p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">Ürünü güncelle</h1>
      <p className="mt-3 text-sm text-neutral-600">#{productId}</p>
      <div className="mt-8">
        <ProductForm mode="edit" productId={productId} />
      </div>
    </div>
  );
}
