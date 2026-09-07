import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../store/useStore';
import { ProductImage } from './ProductImage';
import { cx, formatPrice } from '../lib/format';

interface Props {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: Props) {
  const wishlisted = useStore((s) => s.wishlist.includes(product.id));
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const addToCart = useStore((s) => s.addToCart);

  /** Quick Add drops the smallest listed size straight into the cart. */
  const quickAdd = () => addToCart(product.id, product.sizes[0], 1);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
        delay: Math.min(index * 0.035, 0.3),
      }}
      className="group relative flex flex-col"
    >
      {/* Image panel */}
      <div className="relative aspect-[4/3] overflow-hidden border border-ink-200 bg-ink-50 dark:border-ink-800 dark:bg-ink-900">
        <div className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-[1.06]">
          <ProductImage product={product} />
        </div>

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-nexus px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
              New
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-ink-950 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white dark:bg-white dark:text-ink-950">
              Drop
            </span>
          )}
        </div>

        {/* Wishlist toggle */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wishlisted}
          className={cx(
            'absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-all duration-200 hover:scale-110',
            wishlisted
              ? 'bg-nexus text-black'
              : 'bg-white/85 text-ink-700 hover:text-nexus-text dark:bg-ink-950/70 dark:text-ink-200 dark:hover:text-nexus',
          )}
        >
          <Heart size={17} fill={wishlisted ? 'currentColor' : 'none'} strokeWidth={2.2} />
        </button>

        {/* Quick add — slides up on hover, always reachable on touch/keyboard */}
        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-full p-3 opacity-0 transition-all duration-250 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 max-md:translate-y-0 max-md:opacity-100">
          <button
            type="button"
            onClick={quickAdd}
            className="btn-primary w-full py-2.5 text-xs"
          >
            <Plus size={15} strokeWidth={3} /> Quick Add
          </button>
        </div>

        {/* Stretched link — keeps the whole panel clickable without nesting
            interactive elements inside an <a>. */}
        <Link
          to={`/product/${product.id}`}
          className="absolute inset-0 z-10"
          aria-label={`View ${product.brand} ${product.name}`}
        >
          <span className="sr-only">View {product.name}</span>
        </Link>
      </div>

      {/* Meta */}
      <div className="flex flex-1 flex-col pt-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-nexus-text dark:text-nexus">
          {product.brand}
        </span>
        <Link
          to={`/product/${product.id}`}
          className="mt-1 font-display text-lg leading-tight tracking-tightest transition-colors duration-200 hover:text-nexus-text dark:hover:text-nexus"
        >
          {product.name}
        </Link>
        {product.colorway && (
          <span className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
            {product.colorway}
          </span>
        )}
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <span className="font-bold tabular-nums">{formatPrice(product.price)}</span>
          <span className="text-[11px] uppercase tracking-widest text-ink-400 dark:text-ink-500">
            {product.category}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
