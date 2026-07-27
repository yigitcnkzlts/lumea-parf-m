"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { CartItem, Product } from "@/types/product";
import { useAuth } from "@/context/auth-context";

interface ShopContextValue {
  cart: CartItem[];
  favorites: number[];
  cartOpen: boolean;
  favoritesOpen: boolean;
  searchOpen: boolean;
  quickProduct: Product | null;
  setCartOpen: (open: boolean) => void;
  setFavoritesOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setQuickProduct: (product: Product | null) => void;
  addToCart: (product: Product, size?: number, quantity?: number, options?: { openCart?: boolean }) => void;
  updateQuantity: (productId: number, size: number, quantity: number) => void;
  removeFromCart: (productId: number, size: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: number) => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setCart(JSON.parse(localStorage.getItem("bee-cart") ?? "[]") as CartItem[]);
        const guestFavorites = JSON.parse(localStorage.getItem("bee-favorites") ?? "[]") as number[];
        if (auth.user) {
          const userFavorites = auth.getUserFavorites();
          setFavorites(userFavorites.length ? userFavorites : guestFavorites);
        } else {
          setFavorites(guestFavorites);
        }
      } catch {
        localStorage.removeItem("bee-cart");
        localStorage.removeItem("bee-favorites");
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (auth.user) {
      const userFavorites = auth.getUserFavorites();
      setFavorites(userFavorites);
    }
  }, [auth.user, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("bee-cart", JSON.stringify(cart));
    localStorage.setItem("bee-favorites", JSON.stringify(favorites));
    if (auth.user) auth.saveUserFavorites(favorites);
  }, [cart, favorites, hydrated, auth.user]);

  const addToCart = (product: Product, size = product.sizes[1], quantity = 1, options?: { openCart?: boolean }) => {
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
    setFavoritesOpen(false);
    if (options?.openCart !== false) setCartOpen(true);
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

  const clearCart = () => setCart([]);

  const toggleFavorite = (productId: number) =>
    setFavorites((current) => {
      const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId];
      toast.success(current.includes(productId) ? "Favorilerden çıkarıldı" : "Favorilere eklendi");
      return next;
    });

  const value = useMemo(
    () => ({
      cart,
      favorites,
      cartOpen,
      favoritesOpen,
      searchOpen,
      quickProduct,
      setCartOpen,
      setFavoritesOpen,
      setSearchOpen,
      setQuickProduct,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleFavorite,
    }),
    [cart, favorites, cartOpen, favoritesOpen, searchOpen, quickProduct],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used inside ShopProvider");
  return context;
}
