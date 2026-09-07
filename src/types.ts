/**
 * Colourway + silhouette spec used to render a product's artwork when no photo
 * has been supplied. Every colour is a plain CSS colour string.
 */
export interface SneakerArtSpec {
  /** Ankle height — 'high' adds a full collar, 'mid' a shorter one. */
  cut: 'low' | 'mid' | 'high';
  base: string;
  /** Toe cap + heel counter panels. */
  overlay: string;
  swoosh: string;
  midsole: string;
  outsole: string;
  laces: string;
  /** Ankle collar (ignored on low cuts). */
  collar: string;
  /** Tongue tag, heel tab, and the air unit when `air` is set. */
  accent: string;
  /** Renders a visible Air unit in the midsole. */
  air?: boolean;
  /** Used for the artwork's accessible label. */
  label: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  sizes: number[];
  colorway?: string;
  description: string;
  /** Photo URL. Leave as an empty string to render `art` instead. */
  image: string;
  /** Vector artwork spec — the fallback whenever `image` is empty. */
  art: SneakerArtSpec;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  /** Composite key — the same sneaker in two sizes is two distinct lines. */
  id: string;
  productId: string;
  size: number;
  quantity: number;
}

export type Theme = 'light' | 'dark';

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc';

export interface Toast {
  id: number;
  message: string;
  variant: 'success' | 'info' | 'error';
}
