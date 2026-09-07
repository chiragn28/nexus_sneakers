import { AnimatePresence, motion } from 'framer-motion';
import { SearchX } from 'lucide-react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { cx } from '../lib/format';

interface Props {
  products: Product[];
  /** Tailwind grid-cols classes — override for narrower rails. */
  columns?: string;
  onClearFilters?: () => void;
  emptyTitle?: string;
  emptyBody?: string;
}

export function ProductGrid({
  products,
  columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  onClearFilters,
  emptyTitle = 'No sneakers match those filters',
  emptyBody = 'Try widening the price range, clearing a size, or searching for something else.',
}: Props) {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="surface flex flex-col items-center justify-center px-6 py-20 text-center"
      >
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400">
          <SearchX size={26} />
        </span>
        <h3 className="mb-2 text-2xl">{emptyTitle}</h3>
        <p className="max-w-sm text-sm text-ink-600 dark:text-ink-400">{emptyBody}</p>
        {onClearFilters && (
          <button type="button" onClick={onClearFilters} className="btn-primary mt-6">
            Clear all filters
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div layout className={cx('grid gap-x-6 gap-y-10', columns)}>
      <AnimatePresence mode="popLayout">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
