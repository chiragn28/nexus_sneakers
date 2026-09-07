import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { cx } from '../lib/format';

interface Props {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  label = 'Quantity',
}: Props) {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-11 w-11';
  const text = size === 'sm' ? 'text-sm w-8' : 'text-base w-12';

  return (
    <div
      className="inline-flex items-center border-2 border-ink-200 dark:border-ink-700"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cx(
          box,
          'flex items-center justify-center text-ink-700 transition-colors duration-200 hover:bg-ink-100 disabled:opacity-30 dark:text-ink-200 dark:hover:bg-ink-800',
        )}
      >
        <Minus size={size === 'sm' ? 13 : 16} strokeWidth={2.5} />
      </button>

      <span
        aria-live="polite"
        className={cx(text, 'relative overflow-hidden text-center font-bold tabular-nums')}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="block"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cx(
          box,
          'flex items-center justify-center text-ink-700 transition-colors duration-200 hover:bg-ink-100 disabled:opacity-30 dark:text-ink-200 dark:hover:bg-ink-800',
        )}
      >
        <Plus size={size === 'sm' ? 13 : 16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
