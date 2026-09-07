import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { ProductGrid } from '../components/ProductGrid';
import {
  FilterPanel,
  countActiveFilters,
  emptyFilters,
  type Filters,
} from '../components/FilterPanel';
import { products, productOrder } from '../data/products';
import type { SortKey } from '../types';
import { cx } from '../lib/format';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
];

const isSortKey = (value: string | null): value is SortKey =>
  SORT_OPTIONS.some((o) => o.value === value);

export function Shop() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Deep links from the navbar search, footer and home page category tiles.
  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');

    const sortParam = searchParams.get('sort');
    setSort(isSortKey(sortParam) ? sortParam : 'featured');

    const category = searchParams.get('category');
    setFilters((prev) => ({
      ...emptyFilters(),
      // keep any brand/size/price the shopper already set
      brands: prev.brands,
      sizes: prev.sizes,
      price: prev.price,
      categories: category ? [category] : [],
    }));
    // `searchParams` is a stable object per navigation, so this runs once per URL.
  }, [searchParams]);

  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFiltersOpen]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = products.filter((p) => {
      if (q && !`${p.name} ${p.brand} ${p.category} ${p.colorway ?? ''}`.toLowerCase().includes(q))
        return false;
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (filters.sizes.length && !filters.sizes.some((s) => p.sizes.includes(s))) return false;
      if (p.price < filters.price[0] || p.price > filters.price[1]) return false;
      return true;
    });

    const byOrder = (a: { id: string }, b: { id: string }) =>
      (productOrder.get(a.id) ?? 0) - (productOrder.get(b.id) ?? 0);

    switch (sort) {
      case 'price-asc':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'newest':
        return [...filtered].sort(
          (a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) || byOrder(a, b),
        );
      case 'featured':
      default:
        return [...filtered].sort(
          (a, b) =>
            Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)) || byOrder(a, b),
        );
    }
  }, [query, filters, sort]);

  const clearAll = () => {
    setFilters(emptyFilters());
    setQuery('');
  };

  const activeCount = countActiveFilters(filters);

  return (
    <PageTransition>
      {/* Page header */}
      <section className="border-b border-ink-200 bg-ink-50 py-10 dark:border-ink-800 dark:bg-ink-900 lg:py-14">
        <div className="container-nexus">
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-nexus-text dark:text-nexus">
            The full run
          </span>
          <h1 className="mt-2 text-5xl sm:text-6xl">Shop All</h1>
          <p className="mt-3 max-w-lg text-sm text-ink-600 dark:text-ink-400">
            {products.length} silhouettes in rotation. Filter it down until you find
            the one.
          </p>
        </div>
      </section>

      <div className="container-nexus py-8 lg:py-12">
        {/* Toolbar */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, brand or colourway…"
              aria-label="Search sneakers"
              className="field pl-11"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-400 transition-colors duration-200 hover:text-nexus-text dark:hover:text-nexus"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="btn-outline flex-1 py-3 text-xs sm:flex-none lg:hidden"
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeCount > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-nexus px-1.5 text-[11px] font-bold text-black">
                  {activeCount}
                </span>
              )}
            </button>

            <div className="relative flex-1 sm:flex-none">
              <label htmlFor="sort" className="sr-only">
                Sort products
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="field cursor-pointer appearance-none pr-9 sm:w-[210px]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">
                ▾
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <FilterPanel filters={filters} onChange={setFilters} onClear={clearAll} />
            </div>
          </aside>

          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
              {visible.length} {visible.length === 1 ? 'result' : 'results'}
              {query && (
                <>
                  {' '}
                  for “<span className="text-nexus-text dark:text-nexus">{query}</span>”
                </>
              )}
            </p>
            <ProductGrid
              products={visible}
              columns="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
              onClearFilters={clearAll}
            />
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div
            className="fixed inset-0 z-[60] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className={cx(
                'absolute left-0 top-0 flex h-full w-[88%] max-w-sm flex-col',
                'border-r border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-950',
              )}
            >
              <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4 dark:border-ink-800">
                <h2 className="font-display text-xl tracking-tightest">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Close filters"
                  className="rounded-full p-2 text-ink-600 transition-colors duration-200 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 pb-4">
                <FilterPanel filters={filters} onChange={setFilters} onClear={clearAll} />
              </div>
              <div className="border-t border-ink-200 p-4 dark:border-ink-800">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="btn-primary w-full"
                >
                  Show {visible.length} {visible.length === 1 ? 'result' : 'results'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
