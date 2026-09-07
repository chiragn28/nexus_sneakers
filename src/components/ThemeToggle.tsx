import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cx } from '../lib/format';

interface Props {
  className?: string;
}

export function ThemeToggle({ className }: Props) {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const isDark = theme === 'dark';

  const handleClick = () => {
    // Cross-fade every surface at once instead of snapping. The class is removed
    // straight after so it never fights Framer Motion transforms.
    const root = document.documentElement;
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 320);
    toggleTheme();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={cx(
        'relative flex h-9 w-16 items-center rounded-full border-2 px-1 transition-colors duration-200',
        'border-ink-300 bg-ink-100 hover:border-nexus',
        'dark:border-ink-700 dark:bg-ink-800 dark:hover:border-nexus',
        className,
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 620, damping: 34 }}
        className={cx(
          'flex h-6 w-6 items-center justify-center rounded-full bg-nexus text-black',
          isDark ? 'ml-auto' : 'mr-auto',
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18 }}
            className="flex"
          >
            {isDark ? <Moon size={14} strokeWidth={2.5} /> : <Sun size={14} strokeWidth={2.5} />}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  );
}
