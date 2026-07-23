"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { CartItem, Product } from "@/types/product";

interface ShopContextValue {
  cart: CartItem[];
  favorites: number[];
  cartOpen: boolean;
  searchOpen: boolean;
  quickProduct: Product | null;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setQuickProduct: (product: Product | null) => void;
  addToCart: (product: Product, size?: number, quantity?: number) => void;
  updateQuantity: (productId: number, size: number, quantity: number) => void;
  removeFromCart: (productId: number, size: number) => void;
  toggleFavorite: (productId: number) => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setCart(JSON.parse(localStorage.getItem("lumea-cart") ?? "[]") as CartItem[]);
        setFavorites(JSON.parse(localStorage.getItem("lumea-favorites") ?? "[]") as number[]);
      } catch {
        localStorage.removeItem("lumea-cart");
        localStorage.removeItem("lumea-favorites");
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("lumea-cart", JSON.stringify(cart));
    localStorage.setItem("lumea-favorites", JSON.stringify(favorites));
  }, [cart, favorites, hydrated]);

  const addToCart = (product: Product, size = product.sizes[1], quantity = 1) => {
    setCart((current) => {
      const found = current.find((item) => item.product.id === product.id && item.size === size);
      if (found) {
        return current.map((item) =>
          item === found ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [...current, { product, size, quantity }];
    });
    setQuickProduct(null);
    setCartOpen(true);
    toast.success(`${product.name} sepete eklendi`);
  };

  const updateQuantity = (productId: number, size: number, quantity: number) => {
    if (quantity < 1) return;
    setCart((current) =>
      current.map((item) =>
        item.product.id === productId && item.size === size ? { ...item, quantity } : item,
      ),
    );
  };

  const removeFromCart = (productId: number, size: number) =>
    setCart((current) => current.filter((item) => item.product.id !== productId || item.size !== size));

  const toggleFavorite = (productId: number) =>
    setFavorites((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
    );

  const value = useMemo(
    () => ({
      cart,
      favorites,
      cartOpen,
      searchOpen,
      quickProduct,
      setCartOpen,
      setSearchOpen,
      setQuickProduct,
      addToCart,
      updateQuantity,
      removeFromCart,
      toggleFavorite,
    }),
    [cart, favorites, cartOpen, searchOpen, quickProduct],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used inside ShopProvider");
  return context;
}
