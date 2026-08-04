"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export function ImageDropzone({
  onUploaded,
  purpose = "product",
  label = "Görsel yükle (sürükle-bırak)",
}: {
  onUploaded: (url: string) => void;
  purpose?: "product" | "review";
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      setBusy(true);
      try {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "x-upload-purpose": purpose },
          body,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Yükleme başarısız");
        onUploaded(data.url);
        toast.success("Görsel yüklendi");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Hata");
      } finally {
        setBusy(false);
      }
    },
    [onUploaded, purpose],
  );

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) void upload(file);
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-4 py-8 text-center text-xs transition ${
        dragging ? "border-[#956f42] bg-[#f7f1e6]" : "border-black/20 bg-white/40"
      }`}
    >
      <Upload size={18} className="text-[#956f42]" />
      <span className="tracking-[.14em]">{busy ? "YÜKLENİYOR..." : label}</span>
      <span className="text-[10px] text-neutral-500">JPG / PNG / WEBP · max 4 MB</span>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = "";
        }}
      />
    </label>
  );
}

export function ImageUrlList({
  urls,
  onChange,
}: {
  urls: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {urls.map((src) => (
          <div key={src} className="relative h-24 w-20 overflow-hidden border border-black/10 bg-[#eee8dc]">
            <Image src={src} alt="" fill className="object-cover" sizes="80px" unoptimized={src.includes("supabase")} />
            <button
              type="button"
              className="absolute inset-x-0 bottom-0 bg-black/70 py-1 text-[9px] tracking-wider text-white"
              onClick={() => onChange(urls.filter((u) => u !== src))}
            >
              SİL
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
