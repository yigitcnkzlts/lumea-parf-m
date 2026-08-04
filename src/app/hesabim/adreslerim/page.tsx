import type { Metadata } from "next";
import { AddressBook } from "@/components/account/address-book";

export const metadata: Metadata = {
  title: "Adres Defteri",
};

export default function AddressesPage() {
  return (
    <main className="section-shell !py-16">
      <p className="text-[10px] tracking-[.28em] text-[#956f42]">HESABIM</p>
      <h1 className="mt-3 font-serif text-5xl">Adres defteri</h1>
      <p className="mt-3 text-sm text-neutral-600">Teslimat adreslerinizi kaydedin; ödemede hızlı seçin.</p>
      <div className="mt-10">
        <AddressBook />
      </div>
    </main>
  );
}
