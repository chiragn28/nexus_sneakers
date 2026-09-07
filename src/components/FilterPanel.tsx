import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { allSizes, brands, categories, priceBounds } from '../data/products';
import { cx, formatPrice } from '../lib/format';

export interface Filters {
  brands: string[];
  categories: string[];
  sizes: number[];
  price: [number, number];
}

export const emptyFilters = (): Filters => ({
  brands: [],
  categories: [],
  sizes: [],
  price: [priceBounds.min, priceBounds.max],
});

export const countActiveFilters = (f: Filters) =>
  f.brands.length +
  f.categories.length +
  f.sizes.length +
  (f.price[0] !== priceBounds.min || f.price[1] !== priceBounds.max ? 1 : 0);

/** Toggles a value in/out of an array without mutating it. */
const toggle = <T,>(list: T[], value: T): T[] =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink-200 py-4 dark:border-ink-800">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-ink-900 dark:text-ink-100">
          {title}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-ink-500 dark:text-ink-400" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 py-1.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cx(
          'flex h-[18px] w-[18px] shrink-0 items-center justify-center border-2 transition-all duration-200',
          checked
            ? 'border-nexus bg-nexus'
            : 'border-ink-300 group-hover:border-ink-500 dark:border-ink-600 dark:group-hover:border-ink-400',
        )}
      >
        {checked && (
          <svg viewBox="0 0 14 14" className="h-3 w-3 text-black" aria-hidden="true">
            <path
              d="M2 7.5 5.5 11 12 3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span
        className={cx(
          'text-sm transition-colors duration-200',
          checked
            ? 'font-semibold text-ink-950 dark:text-white'
            : 'text-ink-600 group-hover:text-ink-900 dark:text-ink-400 dark:group-hover:text-ink-100',
        )}
      >
        {label}
      </span>
    </label>
  );
}

interface Props {
  filters: Filters;
  onChange: (next: Filters) => void;
  onClear: () => void;
}

export function FilterPanel({ filters, onChange, onClear }: Props) {
  const active = countActiveFilters(filters);
  const [minPrice, maxPrice] = filters.price;

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <h2 className="font-display text-lg tracking-tightest">
          Filters
          {active > 0 && (
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-nexus px-1.5 align-middle text-[11px] font-bold text-black">
              {active}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={onClear}
          disabled={active === 0}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink-500 transition-colors duration-200 hover:text-nexus-text disabled:opacity-35 dark:text-ink-400 dark:hover:text-nexus"
        >
          <RotateCcw size={13} /> Clear all
        </button>
      </div>

      <Section title="Brand">
        <div className="space-y-0.5">
          {brands.map((brand) => (
            <Checkbox
              key={brand}
              label={brand}
              checked={filters.brands.includes(brand)}
              onChange={() => onChange({ ...filters, brands: toggle(filters.brands, brand) })}
            />
          ))}
        </div>
      </Section>

      <Section title="Category">
        <div className="space-y-0.5">
          {categories.map((category) => (
            <Checkbox
              key={category}
              label={category}
              checked={filters.categories.includes(category)}
              onChange={() =>
                onChange({ ...filters, categories: toggle(filters.categories, category) })
              }
            />
          ))}
        </div>
      </Section>

      <Section title="Price">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm font-bold tabular-nums">
            <span>{formatPrice(minPrice)}</span>
            <span className="text-ink-400 dark:text-ink-500">—</span>
            <span>{formatPrice(maxPrice)}</span>
          </div>
          <div className="space-y-3">
            <div>
              <label htmlFor="price-min" className="label">
                Min
              </label>
              <input
                id="price-min"
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                step={5}
                value={minPrice}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  onChange({ ...filters, price: [Math.min(next, maxPrice), maxPrice] });
                }}
                className="w-full accent-nexus"
              />
            </div>
            <div>
              <label htmlFor="price-max" className="label">
                Max
              </label>
              <input
                id="price-max"
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                step={5}
                value={maxPrice}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  onChange({ ...filters, price: [minPrice, Math.max(next, minPrice)] });
                }}
                className="w-full accent-nexus"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Size (US)">
        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => {
            const on = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => onChange({ ...filters, sizes: toggle(filters.sizes, size) })}
                aria-pressed={on}
                className={cx(
                  'min-w-[44px] border-2 px-2 py-2 text-sm font-bold transition-colors duration-200',
                  on
                    ? 'border-nexus bg-nexus text-black'
                    : 'border-ink-200 text-ink-700 hover:border-ink-950 dark:border-ink-700 dark:text-ink-200 dark:hover:border-white',
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
