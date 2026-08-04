"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { products as staticProducts } from "@/data/products";
import type { Product } from "@/types/product";

const CatalogContext = createContext<Product[]>(staticProducts);

export function CatalogProvider({
  children,
  initialProducts,
}: {
  children: ReactNode;
  initialProducts?: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts?.length ? initialProducts : staticProducts);

  useEffect(() => {
    let active = true;
    void fetch("/api/catalog")
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        if (active && Array.isArray(data.products) && data.products.length) {
          setProducts(data.products);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return <CatalogContext.Provider value={products}>{children}</CatalogContext.Provider>;
}

export function useCatalogProducts() {
  return useContext(CatalogContext);
}
