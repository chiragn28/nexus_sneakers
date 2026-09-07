import { motion } from 'framer-motion';
import { cx } from '../lib/format';

interface Props {
  sizes: number[];
  value: number | null;
  onChange: (size: number) => void;
  /** Highlights the group when the shopper tries to add to cart without a size. */
  invalid?: boolean;
}

export function SizeSelector({ sizes, value, onChange, invalid = false }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Select a size (US)"
      className={cx('flex flex-wrap gap-2', invalid && 'animate-pulse-ring')}
    >
      {sizes.map((size) => {
        const selected = value === size;
        return (
          <motion.button
            key={size}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(size)}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.12 }}
            className={cx(
              'min-w-[54px] border-2 px-3 py-2.5 text-sm font-bold transition-colors duration-200',
              selected
                ? 'border-nexus bg-nexus text-black'
                : invalid
                  ? 'border-nexus-600 text-ink-700 hover:border-nexus dark:border-nexus-400 dark:text-ink-200'
                  : 'border-ink-200 text-ink-700 hover:border-ink-950 dark:border-ink-700 dark:text-ink-200 dark:hover:border-white',
            )}
          >
            {size}
          </motion.button>
        );
      })}
    </div>
  );
}
