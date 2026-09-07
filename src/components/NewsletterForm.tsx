import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';
import { cx } from '../lib/format';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Props {
  compact?: boolean;
}

/** Simulated newsletter signup — no backend, resolves after a short delay. */
export function NewsletterForm({ compact = false }: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('We need an email address to send the drops to.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("That doesn't look like a valid email — check for typos.");
      return;
    }
    setError(null);
    setStatus('sending');
    window.setTimeout(() => {
      setStatus('done');
      setEmail('');
    }, 700);
  };

  return (
    <div className={compact ? '' : 'mx-auto w-full max-w-xl'}>
      <AnimatePresence mode="wait" initial={false}>
        {status === 'done' ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className={cx(
              'flex items-center gap-3 border-2 border-nexus bg-nexus/10 px-4 py-3',
              compact ? 'text-sm' : 'text-base',
            )}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-nexus text-black">
              <Check size={14} strokeWidth={3} />
            </span>
            <p className="font-semibold text-ink-900 dark:text-ink-50">
              You're on the list. Watch your inbox for the next drop.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor={compact ? 'nl-email-footer' : 'nl-email'} className="sr-only">
                Email address
              </label>
              <input
                id={compact ? 'nl-email-footer' : 'nl-email'}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="you@email.com"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'nl-error' : undefined}
                className={cx('field', error && 'field-error', !compact && 'sm:text-base')}
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className={cx('btn-primary shrink-0', compact && 'px-5 py-3 text-xs')}
              >
                {status === 'sending' ? 'Joining…' : 'Join'}
                {status !== 'sending' && <ArrowRight size={16} strokeWidth={2.5} />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  id="nl-error"
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-1.5 overflow-hidden pt-2 text-xs font-medium text-nexus-text dark:text-nexus-300"
                >
                  <AlertCircle size={13} /> {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
