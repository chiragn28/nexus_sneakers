import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { ProductImage } from '../components/ProductImage';
import { ProductGrid } from '../components/ProductGrid';
import { SizeSelector } from '../components/SizeSelector';
import { QuantitySelector } from '../components/QuantitySelector';
import { getProductById, products } from '../data/products';
import { useStore } from '../store/useStore';
import { cx, formatPrice } from '../lib/format';
import { NotFound } from './NotFound';

const DETAILS = [
  { Icon: Truck, label: 'Free shipping over $200' },
  { Icon: ShieldCheck, label: 'Authenticity guaranteed' },
  { Icon: RefreshCw, label: '30-day returns on unworn pairs' },
];

export function ProductDetail() {
  const { id = '' } = useParams();
  const product = getProductById(id);

  const [size, setSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(false);

  const addToCart = useStore((s) => s.addToCart);
  const openCart = useStore((s) => s.openCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const pushToast = useStore((s) => s.pushToast);
  const wishlisted = useStore((s) => s.wishlist.includes(id));

  // Reset the picker when navigating between products.
  useEffect(() => {
    setSize(null);
    setQuantity(1);
    setSizeError(false);
    setSpecsOpen(false);
  }, [id]);

  const related = useMemo(() => {
    if (!product) return [];
    const sameCategory = products.filter(
      (p) => p.id !== product.id && p.category === product.category,
    );
    const fillers = products.filter(
      (p) => p.id !== product.id && p.category !== product.category,
    );
    return [...sameCategory, ...fillers].slice(0, 4);
  }, [product]);

  if (!product) return <NotFound />;

  const handleAddToCart = () => {
    if (size === null) {
      setSizeError(true);
      pushToast('Pick a size first', 'error');
      window.setTimeout(() => setSizeError(false), 900);
      return;
    }
    addToCart(product.id, size, quantity);
    openCart();
  };

  return (
    <PageTransition>
      <div className="container-nexus py-6 lg:py-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-xs">
          <Link
            to="/"
            className="text-ink-500 transition-colors duration-200 hover:text-nexus-text dark:text-ink-400 dark:hover:text-nexus"
          >
            Home
          </Link>
          <ChevronRight size={13} className="text-ink-400" />
          <Link
            to="/shop"
            className="text-ink-500 transition-colors duration-200 hover:text-nexus-text dark:text-ink-400 dark:hover:text-nexus"
          >
            Shop
          </Link>
          <ChevronRight size={13} className="text-ink-400" />
          <Link
            to={`/shop?category=${encodeURIComponent(product.category)}`}
            className="text-ink-500 transition-colors duration-200 hover:text-nexus-text dark:text-ink-400 dark:hover:text-nexus"
          >
            {product.category}
          </Link>
          <ChevronRight size={13} className="text-ink-400" />
          <span className="font-semibold text-ink-900 dark:text-ink-100">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/3] overflow-hidden border-2 border-ink-950 dark:border-ink-100"
            >
              <ProductImage product={product} size="lg" />
              {product.isNew && (
                <span className="absolute left-4 top-4 bg-nexus px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-black">
                  New
                </span>
              )}
            </motion.div>

            {/* Thumbnail rail — all placeholders until real photography lands. */}
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cx(
                    'aspect-square overflow-hidden border-2 transition-colors duration-200',
                    i === 0
                      ? 'border-nexus'
                      : 'border-ink-200 hover:border-ink-400 dark:border-ink-800 dark:hover:border-ink-600',
                  )}
                >
                  <ProductImage product={product} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Buy box */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-nexus-text dark:text-nexus">
              {product.brand}
            </span>
            <h1 className="mt-2 text-4xl sm:text-5xl">{product.name}</h1>
            {product.colorway && (
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">{product.colorway}</p>
            )}

            <p className="mt-5 font-display text-3xl tracking-tightest tabular-nums">
              {formatPrice(product.price)}
            </p>

            <p className="mt-5 max-w-prose text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              {product.description}
            </p>

            {/* Size */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <span className="label mb-0">
                  Size (US){' '}
                  {size !== null && (
                    <span className="text-nexus-text dark:text-nexus">— {size} selected</span>
                  )}
                </span>
                <Link
                  to="/contact"
                  className="text-xs font-bold uppercase tracking-widest text-ink-500 underline-offset-4 hover:underline dark:text-ink-400"
                >
                  Size guide
                </Link>
              </div>
              <SizeSelector
                sizes={product.sizes}
                value={size}
                onChange={(next) => {
                  setSize(next);
                  setSizeError(false);
                }}
                invalid={sizeError}
              />
              {sizeError && (
                <p role="alert" className="mt-2 text-xs font-semibold text-nexus-text dark:text-nexus">
                  Choose a size before adding to the bag.
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <span className="label">Quantity</span>
              <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={10} />
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <motion.button
                type="button"
                onClick={handleAddToCart}
                whileTap={{ scale: 0.98 }}
                className="btn-primary flex-1 py-4"
              >
                <ShoppingBag size={18} strokeWidth={2.5} /> Add to cart
              </motion.button>
              <motion.button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                whileTap={{ scale: 0.98 }}
                aria-pressed={wishlisted}
                className={cx(
                  'btn py-4 sm:w-52',
                  wishlisted
                    ? 'border-2 border-nexus bg-nexus/10 text-nexus-text dark:text-nexus'
                    : 'btn-outline',
                )}
              >
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} strokeWidth={2.2} />
                {wishlisted ? 'Saved' : 'Wishlist'}
              </motion.button>
            </div>

            {/* Perks */}
            <ul className="mt-8 space-y-2.5 border-t border-ink-200 pt-6 dark:border-ink-800">
              {DETAILS.map(({ Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 text-sm text-ink-600 dark:text-ink-300"
                >
                  <Icon size={16} className="shrink-0 text-nexus-text dark:text-nexus" />
                  {label}
                </li>
              ))}
            </ul>

            {/* Specs accordion */}
            <div className="mt-6 border-t border-ink-200 pt-4 dark:border-ink-800">
              <button
                type="button"
                onClick={() => setSpecsOpen((v) => !v)}
                aria-expanded={specsOpen}
                className="flex w-full items-center justify-between py-2 text-left"
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  Specs & materials
                </span>
                {specsOpen ? <Minus size={16} /> : <Plus size={16} />}
              </button>
              <motion.div
                initial={false}
                animate={{ height: specsOpen ? 'auto' : 0, opacity: specsOpen ? 1 : 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <dl className="grid grid-cols-2 gap-y-3 pb-2 pt-3 text-sm">
                  {[
                    ['Brand', product.brand],
                    ['Category', product.category],
                    ['Colourway', product.colorway ?? '—'],
                    ['Style code', product.id.toUpperCase()],
                    ['Sizes', `US ${product.sizes[0]}–${product.sizes[product.sizes.length - 1]}`],
                  ].map(([term, value]) => (
                    <div key={term}>
                      <dt className="text-xs uppercase tracking-widest text-ink-500 dark:text-ink-400">
                        {term}
                      </dt>
                      <dd className="font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Related */}
        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-3xl sm:text-4xl">You might also like</h2>
            <Link
              to="/shop"
              className="text-xs font-bold uppercase tracking-widest text-ink-600 underline-offset-4 transition-colors duration-200 hover:text-nexus-text hover:underline dark:text-ink-300 dark:hover:text-nexus"
            >
              View all
            </Link>
          </div>
          <ProductGrid products={related} />
        </section>
      </div>
    </PageTransition>
  );
}
