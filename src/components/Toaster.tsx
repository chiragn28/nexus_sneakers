import { AnimatePresence, motion } from 'framer-motion';
import { Check, Info, X } from 'lucide-react';
import { useStore } from '../store/useStore';

const ICONS = {
  success: Check,
  info: Info,
  error: X,
} as const;

export function Toaster() {
  const toasts = useStore((s) => s.toasts);
  const dismissToast = useStore((s) => s.dismissToast);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.variant];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 480, damping: 34 }}
              className="pointer-events-auto flex w-full max-w-sm items-center gap-3 border-l-4 border-nexus bg-ink-950 px-4 py-3 text-sm text-white shadow-xl dark:bg-white dark:text-ink-950"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-nexus text-black">
                <Icon size={14} strokeWidth={3} />
              </span>
              <p className="flex-1 font-medium leading-snug">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="shrink-0 rounded p-1 opacity-60 transition-opacity duration-200 hover:opacity-100"
              >
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
