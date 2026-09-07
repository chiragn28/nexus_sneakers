import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, Trash2, X } from 'lucide-react';
import {
  useStore,
  selectSubtotal,
  shippingFor,
  FREE_SHIPPING_THRESHOLD,
} from '../store/useStore';
import { resolveCart } from '../lib/cart';
import { formatPrice } from '../lib/format';
import { ProductImage } from './ProductImage';
import { QuantitySelector } from './QuantitySelector';

export function CartDrawer() {
  const open = useStore((s) => s.cartOpen);
  const closeCart = useStore((s) => s.closeCart);
  const cart = useStore((s) => s.cart);
  const subtotal = useStore(selectSubtotal);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);

  const lines = resolveCart(cart);
  const shipping = shippingFor(subtotal);

  // Escape to close + scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, closeCart]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping cart">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-ink-200 bg-white shadow-2xl dark:border-ink-800 dark:bg-ink-950"
          >
            <header className="flex items-center justify-between border-b border-ink-200 px-5 py-4 dark:border-ink-800">
              <h2 className="flex items-center gap-2 font-display text-xl tracking-tightest">
                <ShoppingBag size={20} className="text-nexus-text dark:text-nexus" />
                Your Bag
                <span className="text-ink-400 dark:text-ink-500">
                  ({lines.reduce((n, l) => n + l.quantity, 0)})
                </span>
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="rounded-full p-2 text-ink-600 transition-colors duration-200 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
              >
                <X size={20} />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-900 dark:text-ink-500">
                  <ShoppingBag size={28} />
                </span>
                <h3 className="mb-2 text-2xl">Your bag is empty</h3>
                <p className="mb-6 text-sm text-ink-600 dark:text-ink-400">
                  Nothing in here yet. Go find something worth lacing up.
                </p>
                <Link to="/shop" onClick={closeCart} className="btn-primary">
                  Shop the drop
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="space-y-4">
                    <AnimatePresence initial={false}>
                      {lines.map((line) => (
                        <motion.li
                          key={line.id}
                          layout
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                          className="flex gap-4 overflow-hidden border-b border-ink-100 pb-4 dark:border-ink-800"
                        >
                          <Link
                            to={`/product/${line.product.id}`}
                            onClick={closeCart}
                            className="h-20 w-24 shrink-0 overflow-hidden border border-ink-200 dark:border-ink-800"
                          >
                            <ProductImage product={line.product} size="sm" />
                          </Link>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-nexus-text dark:text-nexus">
                                  {line.product.brand}
                                </p>
                                <Link
                                  to={`/product/${line.product.id}`}
                                  onClick={closeCart}
                                  className="block truncate text-sm font-bold hover:underline"
                                >
                                  {line.product.name}
                                </Link>
                                <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
                                  US {line.size}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFromCart(line.id)}
                                aria-label={`Remove ${line.product.name} size ${line.size}`}
                                className="shrink-0 rounded p-1.5 text-ink-400 transition-colors duration-200 hover:text-nexus-text dark:hover:text-nexus"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            <div className="mt-2 flex items-center justify-between gap-2">
                              <QuantitySelector
                                size="sm"
                                value={line.quantity}
                                onChange={(q) => updateQuantity(line.id, q)}
                                min={1}
                              />
                              <span className="text-sm font-bold tabular-nums">
                                {formatPrice(line.lineTotal)}
                              </span>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                <footer className="border-t border-ink-200 px-5 py-5 dark:border-ink-800">
                  {subtotal < FREE_SHIPPING_THRESHOLD && (
                    <p className="mb-3 bg-nexus/10 px-3 py-2 text-xs font-medium text-ink-700 dark:text-ink-200">
                      Spend{' '}
                      <span className="font-bold text-nexus-text dark:text-nexus">
                        {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}
                      </span>{' '}
                      more for free shipping.
                    </p>
                  )}
                  <dl className="mb-4 space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-ink-600 dark:text-ink-400">Subtotal</dt>
                      <dd className="font-bold tabular-nums">{formatPrice(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-600 dark:text-ink-400">Shipping</dt>
                      <dd className="font-bold tabular-nums">
                        {shipping === 0 ? 'Free' : formatPrice(shipping)}
                      </dd>
                    </div>
                    <div className="flex justify-between border-t border-ink-200 pt-2 text-base dark:border-ink-800">
                      <dt className="font-bold uppercase tracking-widest">Total</dt>
                      <dd className="font-bold tabular-nums">
                        {formatPrice(subtotal + shipping)}
                      </dd>
                    </div>
                  </dl>
                  <Link to="/cart" onClick={closeCart} className="btn-primary w-full">
                    Checkout
                  </Link>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="btn-ghost mt-1 w-full text-xs"
                  >
                    Continue shopping
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
