import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { ProductImage } from '../components/ProductImage';
import { getProductById } from '../data/products';
import { useStore } from '../store/useStore';
import { formatPrice } from '../lib/format';

export function Wishlist() {
  const wishlist = useStore((s) => s.wishlist);
  const removeFromWishlist = useStore((s) => s.removeFromWishlist);
  const addToCart = useStore((s) => s.addToCart);
  const openCart = useStore((s) => s.openCart);

  const saved = wishlist.flatMap((id) => {
    const product = getProductById(id);
    return product ? [product] : [];
  });

  const moveToCart = (productId: string, size: number) => {
    addToCart(productId, size, 1);
    removeFromWishlist(productId);
    openCart();
  };

  return (
    <PageTransition>
      <section className="border-b border-ink-200 bg-ink-50 py-10 dark:border-ink-800 dark:bg-ink-900 lg:py-14">
        <div className="container-nexus">
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-nexus-text dark:text-nexus">
            Saved for later
          </span>
          <h1 className="mt-2 text-5xl sm:text-6xl">Wishlist</h1>
          <p className="mt-3 text-sm text-ink-600 dark:text-ink-400">
            {saved.length} {saved.length === 1 ? 'pair' : 'pairs'} on your radar.
          </p>
        </div>
      </section>

      <div className="container-nexus py-10 lg:py-14">
        {saved.length === 0 ? (
          <div className="surface flex flex-col items-center justify-center px-6 py-24 text-center">
            <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500">
              <Heart size={28} />
            </span>
            <h2 className="mb-2 text-3xl">Nothing saved yet</h2>
            <p className="mb-7 max-w-sm text-sm text-ink-600 dark:text-ink-400">
              Tap the heart on any sneaker to keep it here while you decide.
            </p>
            <Link to="/shop" className="btn-primary">
              Browse sneakers
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            <AnimatePresence initial={false}>
              {saved.map((product) => (
                <motion.li
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  className="surface flex flex-col gap-5 overflow-hidden p-4 sm:flex-row sm:items-center"
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="aspect-[4/3] w-full shrink-0 overflow-hidden border border-ink-200 dark:border-ink-800 sm:h-28 sm:w-40"
                  >
                    <ProductImage product={product} size="sm" />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-nexus-text dark:text-nexus">
                      {product.brand}
                    </span>
                    <Link
                      to={`/product/${product.id}`}
                      className="mt-1 block font-display text-xl tracking-tightest transition-colors duration-200 hover:text-nexus-text dark:hover:text-nexus"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
                      {product.category}
                      {product.colorway ? ` · ${product.colorway}` : ''} · US{' '}
                      {product.sizes[0]}–{product.sizes[product.sizes.length - 1]}
                    </p>
                    <p className="mt-2 font-bold tabular-nums">{formatPrice(product.price)}</p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:w-52">
                    <button
                      type="button"
                      onClick={() => moveToCart(product.id, product.sizes[0])}
                      className="btn-primary py-2.5 text-xs"
                    >
                      <ShoppingBag size={15} strokeWidth={2.5} /> Move to cart
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      className="btn-outline py-2.5 text-xs"
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                    <p className="text-center text-[10px] uppercase tracking-widest text-ink-400 dark:text-ink-500">
                      Adds US {product.sizes[0]} — change it in the cart
                    </p>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </PageTransition>
  );
}
