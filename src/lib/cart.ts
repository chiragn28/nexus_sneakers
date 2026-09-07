import type { CartItem, Product } from '../types';
import { getProductById } from '../data/products';

export interface CartLine extends CartItem {
  product: Product;
  lineTotal: number;
}

/**
 * Joins persisted cart rows with the current catalogue. Rows whose product no
 * longer exists (e.g. an id changed in `products.ts`) are dropped rather than
 * crashing the cart.
 */
export const resolveCart = (cart: CartItem[]): CartLine[] =>
  cart.flatMap((item) => {
    const product = getProductById(item.productId);
    if (!product) return [];
    return [{ ...item, product, lineTotal: product.price * item.quantity }];
  });
