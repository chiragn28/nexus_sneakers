import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, Clock, Mail, Send } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { cx } from '../lib/format';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Form {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type Errors = Partial<Record<keyof Form, string>>;

const CHANNELS = [
  { Icon: Mail, title: 'Email', body: 'hey@nexussneakers.demo', note: 'Replies within one business day' },
  { Icon: Clock, title: 'Support hours', body: 'Mon–Fri, 9am–6pm ET', note: 'Drop days run late' },
];

export function Contact() {
  const [form, setForm] = useState<Form>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const update = (key: keyof Form) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "What should we call you? Two characters minimum.";
    if (!EMAIL_RE.test(form.email.trim()))
      next.email = "We can't reply without a valid email — double-check the address.";
    if (form.subject.trim().length < 3)
      next.subject = 'Give it a short subject so we can route it to the right person.';
    if (form.message.trim().length < 15)
      next.message = `A bit more detail helps — ${Math.max(0, 15 - form.message.trim().length)} more characters.`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    // Simulated submission — there is no backend in this demo.
    window.setTimeout(() => setStatus('sent'), 900);
  };

  const reset = () => {
    setForm({ name: '', email: '', subject: '', message: '' });
    setErrors({});
    setStatus('idle');
  };

  return (
    <PageTransition>
      <section className="border-b border-ink-200 bg-ink-50 py-10 dark:border-ink-800 dark:bg-ink-900 lg:py-14">
        <div className="container-nexus">
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-nexus-text dark:text-nexus">
            Say something
          </span>
          <h1 className="mt-2 text-5xl sm:text-6xl">Contact</h1>
          <p className="mt-3 max-w-lg text-sm text-ink-600 dark:text-ink-400">
            Sizing questions, order issues, or just want to tell us what to stock next —
            it all lands in the same inbox.
          </p>
        </div>
      </section>

      <div className="container-nexus grid gap-12 py-12 lg:grid-cols-[1fr_340px] lg:py-16">
        {/* Form */}
        <div>
          <AnimatePresence mode="wait" initial={false}>
            {status === 'sent' ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.26 }}
                className="surface flex flex-col items-center px-6 py-20 text-center"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 22, delay: 0.08 }}
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-nexus text-black"
                >
                  <Check size={30} strokeWidth={3} />
                </motion.span>
                <h2 className="mb-2 text-3xl">Message sent</h2>
                <p className="mb-7 max-w-sm text-sm text-ink-600 dark:text-ink-400">
                  Thanks{form.name ? `, ${form.name.split(' ')[0]}` : ''} — we'll get back
                  to you within one business day. (Demo store: nothing was actually
                  transmitted.)
                </p>
                <button type="button" onClick={reset} className="btn-outline">
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                noValidate
                onSubmit={submit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid gap-5 sm:grid-cols-2"
              >
                {(
                  [
                    { key: 'name', label: 'Your name', placeholder: 'Alex Rivera', autoComplete: 'name' },
                    { key: 'email', label: 'Email', placeholder: 'you@email.com', type: 'email', autoComplete: 'email' },
                  ] as const
                ).map((field) => (
                  <div key={field.key}>
                    <label htmlFor={field.key} className="label">
                      {field.label}
                    </label>
                    <input
                      id={field.key}
                      type={'type' in field ? field.type : 'text'}
                      value={form[field.key]}
                      onChange={(e) => update(field.key)(e.target.value)}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      aria-invalid={Boolean(errors[field.key])}
                      aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
                      className={cx('field', errors[field.key] && 'field-error')}
                    />
                    <AnimatePresence>
                      {errors[field.key] && (
                        <motion.p
                          id={`${field.key}-error`}
                          role="alert"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18 }}
                          className="flex items-start gap-1.5 overflow-hidden pt-1.5 text-xs font-medium text-nexus-text dark:text-nexus-300"
                        >
                          <AlertCircle size={13} className="mt-px shrink-0" />
                          {errors[field.key]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label htmlFor="subject" className="label">
                    Subject
                  </label>
                  <input
                    id="subject"
                    value={form.subject}
                    onChange={(e) => update('subject')(e.target.value)}
                    placeholder="Order NX-123456 — wrong size"
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                    className={cx('field', errors.subject && 'field-error')}
                  />
                  <AnimatePresence>
                    {errors.subject && (
                      <motion.p
                        id="subject-error"
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="flex items-start gap-1.5 overflow-hidden pt-1.5 text-xs font-medium text-nexus-text dark:text-nexus-300"
                      >
                        <AlertCircle size={13} className="mt-px shrink-0" /> {errors.subject}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="message" className="label">
                      Message
                    </label>
                    <span className="mb-1.5 text-[11px] tabular-nums text-ink-400 dark:text-ink-500">
                      {form.message.trim().length}/15 min
                    </span>
                  </div>
                  <textarea
                    id="message"
                    rows={6}
                    value={form.message}
                    onChange={(e) => update('message')(e.target.value)}
                    placeholder="Tell us what's going on…"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className={cx('field resize-y', errors.message && 'field-error')}
                  />
                  <AnimatePresence>
                    {errors.message && (
                      <motion.p
                        id="message-error"
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="flex items-start gap-1.5 overflow-hidden pt-1.5 text-xs font-medium text-nexus-text dark:text-nexus-300"
                      >
                        <AlertCircle size={13} className="mt-px shrink-0" /> {errors.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="sm:col-span-2">
                  <button type="submit" disabled={status === 'sending'} className="btn-primary">
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                    {status !== 'sending' && <Send size={16} strokeWidth={2.5} />}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Channels */}
        <aside className="space-y-4">
          {CHANNELS.map(({ Icon, title, body, note }) => (
            <div key={title} className="surface flex gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-nexus text-black">
                <Icon size={18} strokeWidth={2.2} />
              </span>
              <div>
                <h2 className="text-base">{title}</h2>
                <p className="mt-1 text-sm font-semibold">{body}</p>
                <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">{note}</p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </PageTransition>
  );
}
