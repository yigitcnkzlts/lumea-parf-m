"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { TURKEY_CITIES } from "@/data/cities";

interface Address {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  city: string;
  district: string;
  address_line: string;
  is_default: boolean;
}

export function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    label: "Ev",
    fullName: "",
    phone: "",
    city: "Tekirdağ",
    district: "Süleymanpaşa",
    addressLine: "",
    isDefault: true,
  });

  const load = () =>
    fetch("/api/account/addresses")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Yetkisiz");
        setAddresses(data.addresses ?? []);
      })
      .catch((err: Error) => setError(err.message));

  useEffect(() => {
    void load();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Adres kaydedildi");
      setForm((f) => ({ ...f, addressLine: "", fullName: "", phone: "" }));
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hata");
    } finally {
      setBusy(false);
    }
  };

  if (error) {
    return (
      <div className="border border-black/10 bg-white/60 p-8">
        <p className="font-serif text-3xl">Adres defteri</p>
        <p className="mt-3 text-sm text-neutral-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_.9fr]">
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <p className="border border-black/10 bg-white/50 p-8 text-sm text-neutral-600">Henüz kayıtlı adres yok.</p>
        ) : (
          addresses.map((address) => (
            <article key={address.id} className="border border-black/10 bg-white/50 p-5 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] tracking-[.18em] text-[#956f42]">
                    {address.label}
                    {address.is_default ? " · VARSAYILAN" : ""}
                  </p>
                  <p className="mt-2 font-medium">{address.full_name}</p>
                  <p className="text-neutral-600">{address.phone}</p>
                  <p className="mt-2 text-neutral-600">{address.address_line}</p>
                  <p className="text-neutral-600">
                    {address.district} / {address.city}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-[10px] tracking-wider underline"
                  onClick={async () => {
                    const res = await fetch("/api/account/addresses", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: address.id, delete: true }),
                    });
                    const data = await res.json();
                    if (!res.ok) toast.error(data.error);
                    else {
                      toast.success("Silindi");
                      await load();
                    }
                  }}
                >
                  SİL
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4 border border-black/10 bg-white/50 p-6">
        <p className="text-[10px] tracking-[.28em] text-[#956f42]">YENİ ADRES</p>
        <label className="block text-[10px] tracking-widest text-neutral-500">
          ETİKET
          <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm" />
        </label>
        <label className="block text-[10px] tracking-widest text-neutral-500">
          AD SOYAD
          <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm" />
        </label>
        <label className="block text-[10px] tracking-widest text-neutral-500">
          TELEFON
          <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm" />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-[10px] tracking-widest text-neutral-500">
            İL
            <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm">
              {TURKEY_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[10px] tracking-widest text-neutral-500">
            İLÇE
            <input required value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm" />
          </label>
        </div>
        <label className="block text-[10px] tracking-widest text-neutral-500">
          ADRES
          <textarea required rows={3} value={form.addressLine} onChange={(e) => setForm({ ...form, addressLine: e.target.value })} className="mt-2 w-full border border-black/15 px-4 py-3 text-sm" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
          Varsayılan adres
        </label>
        <button disabled={busy} className="btn-dark w-full">
          {busy ? "KAYDEDİLİYOR..." : "ADRESİ KAYDET"}
        </button>
      </form>
    </div>
  );
}
