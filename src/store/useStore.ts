import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Theme, Toast } from '../types';
import { getProductById } from '../data/products';

const prefersDark = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-color-scheme: dark)').matches;

const lineId = (productId: string, size: number) => `${productId}::${size}`;

interface StoreState {
  /* ---- persisted ---- */
  theme: Theme;
  cart: CartItem[];
  wishlist: string[];

  /* ---- ephemeral (never persisted) ---- */
  cartOpen: boolean;
  toasts: Toast[];

  /* ---- theme ---- */
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;

  /* ---- cart ---- */
  addToCart: (productId: string, size: number, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  /* ---- wishlist ---- */
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  /* ---- toasts ---- */
  pushToast: (message: string, variant?: Toast['variant']) => void;
  dismissToast: (id: number) => void;
}

let toastId = 0;

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      theme: prefersDark() ? 'dark' : 'light',
      cart: [],
      wishlist: [],
      cartOpen: false,
      toasts: [],

      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (theme) => set({ theme }),

      addToCart: (productId, size, quantity = 1) => {
        const id = lineId(productId, size);
        const existing = get().cart.find((i) => i.id === id);
        set((s) => ({
          cart: existing
            ? s.cart.map((i) =>
                i.id === id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, 99) }
                  : i,
              )
            : [...s.cart, { id, productId, size, quantity }],
        }));
        const name = getProductById(productId)?.name ?? 'Item';
        get().pushToast(`${name} · US ${size} added to cart`, 'success');
      },

      removeFromCart: (id) =>
        set((s) => ({ cart: s.cart.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((s) => ({
          cart:
            quantity <= 0
              ? s.cart.filter((i) => i.id !== id)
              : s.cart.map((i) =>
                  i.id === id ? { ...i, quantity: Math.min(quantity, 99) } : i,
                ),
        })),

      clearCart: () => set({ cart: [] }),
      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),

      toggleWishlist: (productId) => {
        const saved = get().wishlist.includes(productId);
        set((s) => ({
          wishlist: saved
            ? s.wishlist.filter((id) => id !== productId)
            : [...s.wishlist, productId],
        }));
        const name = getProductById(productId)?.name ?? 'Item';
        get().pushToast(
          saved ? `${name} removed from wishlist` : `${name} saved to wishlist`,
          saved ? 'info' : 'success',
        );
      },

      removeFromWishlist: (productId) =>
        set((s) => ({ wishlist: s.wishlist.filter((id) => id !== productId) })),

      isWishlisted: (productId) => get().wishlist.includes(productId),

      pushToast: (message, variant = 'success') => {
        const id = ++toastId;
        set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }));
        window.setTimeout(() => get().dismissToast(id), 2600);
      },

      dismissToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'nexus-store',
      version: 1,
      // Only durable shopper state survives a refresh — not UI chrome.
      partialize: (s) => ({ theme: s.theme, cart: s.cart, wishlist: s.wishlist }),
    },
  ),
);

/* --------------------------------------------------------------------------
 * Derived selectors (plain functions so they don't create new refs in render).
 * ------------------------------------------------------------------------ */

export const selectCartCount = (s: StoreState) =>
  s.cart.reduce((n, i) => n + i.quantity, 0);

export const selectSubtotal = (s: StoreState) =>
  s.cart.reduce((sum, i) => {
    const product = getProductById(i.productId);
    return product ? sum + product.price * i.quantity : sum;
  }, 0);

/** Flat-rate shipping placeholder — free over the threshold. */
export const FREE_SHIPPING_THRESHOLD = 200;
export const SHIPPING_FLAT_RATE = 12;

export const shippingFor = (subtotal: number) =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
