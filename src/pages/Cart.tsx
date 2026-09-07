import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CreditCard,
  Lock,
  PackageCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { ProductImage } from '../components/ProductImage';
import { QuantitySelector } from '../components/QuantitySelector';
import {
  useStore,
  selectSubtotal,
  shippingFor,
  FREE_SHIPPING_THRESHOLD,
} from '../store/useStore';
import { resolveCart } from '../lib/cart';
import { cx, formatPrice } from '../lib/format';

type Step = 'bag' | 'shipping' | 'payment' | 'done';

const STEPS: { key: Step; label: string }[] = [
  { key: 'bag', label: 'Bag' },
  { key: 'shipping', label: 'Shipping' },
  { key: 'payment', label: 'Payment' },
  { key: 'done', label: 'Done' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface ShippingForm {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

interface PaymentForm {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

type Errors<T> = Partial<Record<keyof T, string>>;

const digitsOnly = (value: string) => value.replace(/\D/g, '');

/** 4242424242424242 → 4242 4242 4242 4242 */
const formatCardNumber = (value: string) =>
  digitsOnly(value).slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (value: string) => {
  const d = digitsOnly(value).slice(0, 4);
  return d.length <= 2 ? d : `${d.slice(0, 2)}/${d.slice(2)}`;
};

/* -------------------------------------------------------------------------- */

function Field({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  autoComplete,
  inputMode,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'email';
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cx('field', error && 'field-error')}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="flex items-start gap-1.5 overflow-hidden pt-1.5 text-xs font-medium text-nexus-text dark:text-nexus-300"
          >
            <AlertCircle size={13} className="mt-px shrink-0" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function Cart() {
  const cart = useStore((s) => s.cart);
  const subtotal = useStore(selectSubtotal);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const clearCart = useStore((s) => s.clearCart);

  const [step, setStep] = useState<Step>('bag');
  const [placing, setPlacing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);

  const [shipping, setShipping] = useState<ShippingForm>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: '',
  });
  const [shippingErrors, setShippingErrors] = useState<Errors<ShippingForm>>({});

  const [payment, setPayment] = useState<PaymentForm>({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });
  const [paymentErrors, setPaymentErrors] = useState<Errors<PaymentForm>>({});

  const lines = resolveCart(cart);
  const shippingCost = shippingFor(subtotal);
  const total = subtotal + shippingCost;

  const setShippingField = (key: keyof ShippingForm) => (value: string) => {
    setShipping((prev) => ({ ...prev, [key]: value }));
    setShippingErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const setPaymentField = (key: keyof PaymentForm) => (value: string) => {
    setPayment((prev) => ({ ...prev, [key]: value }));
    setPaymentErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateShipping = () => {
    const next: Errors<ShippingForm> = {};
    if (shipping.fullName.trim().length < 2)
      next.fullName = 'Tell us who the parcel is for.';
    if (!EMAIL_RE.test(shipping.email.trim()))
      next.email = "That email doesn't look right — we send the receipt there.";
    if (shipping.address.trim().length < 5)
      next.address = 'Add a street address so the courier can find you.';
    if (shipping.city.trim().length < 2) next.city = 'City is required.';
    if (shipping.zip.trim().length < 3) next.zip = 'Add a valid postal / ZIP code.';
    if (shipping.country.trim().length < 2) next.country = 'Country is required.';
    setShippingErrors(next);
    return Object.keys(next).length === 0;
  };

  const validatePayment = () => {
    const next: Errors<PaymentForm> = {};
    if (payment.cardName.trim().length < 2)
      next.cardName = 'Enter the name printed on the card.';
    if (digitsOnly(payment.cardNumber).length !== 16)
      next.cardNumber = 'Enter a valid 16-digit card number.';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiry))
      next.expiry = 'Use MM/YY, e.g. 09/29.';
    if (!/^\d{3,4}$/.test(payment.cvc)) next.cvc = 'CVC is 3 or 4 digits.';
    setPaymentErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeOrder = () => {
    if (!validatePayment()) return;
    setPlacing(true);
    // Simulated payment round-trip — nothing leaves the browser.
    window.setTimeout(() => {
      setOrderNumber(`NX-${Math.floor(100000 + Math.random() * 900000)}`);
      setOrderTotal(total);
      clearCart();
      setPlacing(false);
      setStep('done');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1100);
  };

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  /* ------------------------------------------------------ ORDER CONFIRMATION */
  if (step === 'done') {
    return (
      <PageTransition>
        <div className="container-nexus flex flex-col items-center py-20 text-center lg:py-28">
          <motion.span
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 20 }}
            className="mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-nexus text-black"
          >
            <PackageCheck size={38} strokeWidth={2.2} />
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-5xl sm:text-6xl"
          >
            Order Confirmed
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.3 }}
            className="mt-4 max-w-md text-sm text-ink-600 dark:text-ink-300 sm:text-base"
          >
            Thanks{shipping.fullName ? `, ${shipping.fullName.split(' ')[0]}` : ''} — your
            pair is locked in. A confirmation is on its way to{' '}
            <span className="font-semibold text-ink-900 dark:text-ink-50">
              {shipping.email || 'your inbox'}
            </span>
            .
          </motion.p>

          <div className="surface mt-10 w-full max-w-md p-6 text-left">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-600 dark:text-ink-400">Order number</dt>
                <dd className="font-display tracking-widest text-nexus-text dark:text-nexus">
                  {orderNumber}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-600 dark:text-ink-400">Total paid</dt>
                <dd className="font-bold tabular-nums">{formatPrice(orderTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-600 dark:text-ink-400">Estimated delivery</dt>
                <dd className="font-bold">3–5 business days</dd>
              </div>
              <div className="flex justify-between border-t border-ink-200 pt-3 dark:border-ink-800">
                <dt className="text-ink-600 dark:text-ink-400">Shipping to</dt>
                <dd className="max-w-[60%] text-right font-semibold">
                  {shipping.address || '—'}
                  {shipping.city ? `, ${shipping.city}` : ''}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn-primary">
              Keep shopping
            </Link>
            <Link to="/" className="btn-outline">
              Back home
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  /* ------------------------------------------------------------- EMPTY BAG */
  if (lines.length === 0) {
    return (
      <PageTransition>
        <div className="container-nexus py-20 lg:py-28">
          <div className="surface mx-auto flex max-w-xl flex-col items-center px-6 py-20 text-center">
            <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500">
              <ShoppingBag size={28} />
            </span>
            <h1 className="mb-2 text-4xl">Your bag is empty</h1>
            <p className="mb-7 max-w-sm text-sm text-ink-600 dark:text-ink-400">
              Add a pair and it'll show up here, ready to check out.
            </p>
            <Link to="/shop" className="btn-primary">
              Shop the drop
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  /* ------------------------------------------------------------- CHECKOUT */
  return (
    <PageTransition>
      <section className="border-b border-ink-200 bg-ink-50 py-10 dark:border-ink-800 dark:bg-ink-900">
        <div className="container-nexus">
          <h1 className="text-5xl sm:text-6xl">Checkout</h1>

          {/* Stepper */}
          <ol className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
            {STEPS.slice(0, 3).map((s, i) => {
              const state =
                i < currentStepIndex ? 'done' : i === currentStepIndex ? 'current' : 'todo';
              return (
                <li key={s.key} className="flex items-center gap-3">
                  <span
                    className={cx(
                      'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200',
                      state === 'done' && 'bg-nexus text-black',
                      state === 'current' &&
                        'bg-ink-950 text-white dark:bg-white dark:text-ink-950',
                      state === 'todo' &&
                        'border-2 border-ink-300 text-ink-400 dark:border-ink-700 dark:text-ink-500',
                    )}
                  >
                    {state === 'done' ? <Check size={14} strokeWidth={3} /> : i + 1}
                  </span>
                  <span
                    className={cx(
                      'text-xs font-bold uppercase tracking-widest',
                      state === 'todo'
                        ? 'text-ink-400 dark:text-ink-500'
                        : 'text-ink-900 dark:text-ink-100',
                    )}
                  >
                    {s.label}
                  </span>
                  {i < 2 && (
                    <span className="hidden h-px w-10 bg-ink-300 dark:bg-ink-700 sm:block" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <div className="container-nexus grid gap-10 py-10 lg:grid-cols-[1fr_360px] lg:py-14">
        {/* ------------------------------------------------------------ MAIN */}
        <div>
          <AnimatePresence mode="wait" initial={false}>
            {/* ---- STEP 1: BAG ---- */}
            {step === 'bag' && (
              <motion.div
                key="bag"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="mb-5 text-2xl">
                  Your bag ({lines.reduce((n, l) => n + l.quantity, 0)})
                </h2>
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li
                        key={line.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -40, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                        className="surface flex flex-col gap-4 overflow-hidden p-4 sm:flex-row sm:items-center"
                      >
                        <Link
                          to={`/product/${line.product.id}`}
                          className="aspect-[4/3] w-full shrink-0 overflow-hidden border border-ink-200 dark:border-ink-800 sm:h-24 sm:w-32"
                        >
                          <ProductImage product={line.product} size="sm" />
                        </Link>

                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-nexus-text dark:text-nexus">
                            {line.product.brand}
                          </span>
                          <Link
                            to={`/product/${line.product.id}`}
                            className="mt-0.5 block font-display text-lg tracking-tightest transition-colors duration-200 hover:text-nexus-text dark:hover:text-nexus"
                          >
                            {line.product.name}
                          </Link>
                          <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
                            US {line.size}
                            {line.product.colorway ? ` · ${line.product.colorway}` : ''}
                          </p>
                          <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
                            {formatPrice(line.product.price)} each
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                          <QuantitySelector
                            size="sm"
                            value={line.quantity}
                            onChange={(q) => updateQuantity(line.id, q)}
                          />
                          <div className="flex items-center gap-3">
                            <span className="font-bold tabular-nums">
                              {formatPrice(line.lineTotal)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(line.id)}
                              aria-label={`Remove ${line.product.name} size ${line.size}`}
                              className="rounded p-1.5 text-ink-400 transition-colors duration-200 hover:text-nexus-text dark:hover:text-nexus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link to="/shop" className="btn-ghost text-xs">
                    <ArrowLeft size={15} /> Continue shopping
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ---- STEP 2: SHIPPING ---- */}
            {step === 'shipping' && (
              <motion.form
                key="shipping"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  if (validateShipping()) setStep('payment');
                }}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="mb-1 flex items-center gap-2 text-2xl">
                  <Truck size={22} className="text-nexus-text dark:text-nexus" /> Shipping
                  details
                </h2>
                <p className="mb-6 text-sm text-ink-600 dark:text-ink-400">
                  Enter where you'd like your order delivered.
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    id="fullName"
                    label="Full name"
                    value={shipping.fullName}
                    onChange={setShippingField('fullName')}
                    error={shippingErrors.fullName}
                    placeholder="Alex Rivera"
                    autoComplete="name"
                  />
                  <Field
                    id="email"
                    label="Email"
                    type="email"
                    inputMode="email"
                    value={shipping.email}
                    onChange={setShippingField('email')}
                    error={shippingErrors.email}
                    placeholder="you@email.com"
                    autoComplete="email"
                  />
                  <Field
                    id="address"
                    label="Street address"
                    value={shipping.address}
                    onChange={setShippingField('address')}
                    error={shippingErrors.address}
                    placeholder="221 Warehouse Row, Unit 4"
                    autoComplete="street-address"
                    className="sm:col-span-2"
                  />
                  <Field
                    id="city"
                    label="City"
                    value={shipping.city}
                    onChange={setShippingField('city')}
                    error={shippingErrors.city}
                    placeholder="Brooklyn"
                    autoComplete="address-level2"
                  />
                  <Field
                    id="zip"
                    label="ZIP / Postal code"
                    value={shipping.zip}
                    onChange={setShippingField('zip')}
                    error={shippingErrors.zip}
                    placeholder="11217"
                    autoComplete="postal-code"
                  />
                  <Field
                    id="country"
                    label="Country"
                    value={shipping.country}
                    onChange={setShippingField('country')}
                    error={shippingErrors.country}
                    placeholder="United States"
                    autoComplete="country-name"
                    className="sm:col-span-2"
                  />
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button type="submit" className="btn-primary">
                    Continue to payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('bag')}
                    className="btn-outline"
                  >
                    <ArrowLeft size={15} /> Back to bag
                  </button>
                </div>
              </motion.form>
            )}

            {/* ---- STEP 3: PAYMENT ---- */}
            {step === 'payment' && (
              <motion.form
                key="payment"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  placeOrder();
                }}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="mb-1 flex items-center gap-2 text-2xl">
                  <CreditCard size={22} className="text-nexus-text dark:text-nexus" /> Payment
                </h2>
                <p className="mb-6 flex items-center gap-1.5 text-sm text-ink-600 dark:text-ink-400">
                  <Lock size={13} /> Your payment details are encrypted and secure.
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    id="cardName"
                    label="Name on card"
                    value={payment.cardName}
                    onChange={setPaymentField('cardName')}
                    error={paymentErrors.cardName}
                    placeholder="Alex Rivera"
                    autoComplete="cc-name"
                    className="sm:col-span-2"
                  />
                  <Field
                    id="cardNumber"
                    label="Card number"
                    inputMode="numeric"
                    value={payment.cardNumber}
                    onChange={(v) => setPaymentField('cardNumber')(formatCardNumber(v))}
                    error={paymentErrors.cardNumber}
                    placeholder="1234 5678 9012 3456"
                    autoComplete="cc-number"
                    className="sm:col-span-2"
                  />
                  <Field
                    id="expiry"
                    label="Expiry"
                    inputMode="numeric"
                    value={payment.expiry}
                    onChange={(v) => setPaymentField('expiry')(formatExpiry(v))}
                    error={paymentErrors.expiry}
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                  />
                  <Field
                    id="cvc"
                    label="CVC"
                    inputMode="numeric"
                    value={payment.cvc}
                    onChange={(v) => setPaymentField('cvc')(digitsOnly(v).slice(0, 4))}
                    error={paymentErrors.cvc}
                    placeholder="123"
                    autoComplete="cc-csc"
                  />
                </div>

                <div className="surface mt-6 flex items-start gap-3 border-l-4 border-l-nexus p-4 text-sm">
                  <Lock size={16} className="mt-0.5 shrink-0 text-nexus-text dark:text-nexus" />
                  <p className="text-ink-600 dark:text-ink-300">
                    All transactions are secured with industry-standard encryption. We
                    never store your full card details.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button type="submit" disabled={placing} className="btn-primary">
                    {placing ? 'Processing…' : `Pay ${formatPrice(total)}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    disabled={placing}
                    className="btn-outline"
                  >
                    <ArrowLeft size={15} /> Back to shipping
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* --------------------------------------------------- ORDER SUMMARY */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="surface p-6">
            <h2 className="mb-5 text-xl">Order summary</h2>

            <ul className="mb-5 space-y-3 border-b border-ink-200 pb-5 text-sm dark:border-ink-800">
              {lines.map((line) => (
                <li key={line.id} className="flex justify-between gap-3">
                  <span className="min-w-0 text-ink-600 dark:text-ink-400">
                    <span className="block truncate">{line.product.name}</span>
                    <span className="text-xs">
                      US {line.size} × {line.quantity}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">
                    {formatPrice(line.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-600 dark:text-ink-400">Subtotal</dt>
                <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-600 dark:text-ink-400">Shipping</dt>
                <dd className="font-semibold tabular-nums">
                  {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-ink-200 pt-3 dark:border-ink-800">
                <dt className="font-display text-lg tracking-tightest">Total</dt>
                <dd className="font-display text-lg tabular-nums">{formatPrice(total)}</dd>
              </div>
            </dl>

            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="mt-4 bg-nexus/10 px-3 py-2 text-xs font-medium text-ink-700 dark:text-ink-200">
                Add{' '}
                <span className="font-bold text-nexus-text dark:text-nexus">
                  {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}
                </span>{' '}
                more to unlock free shipping.
              </p>
            )}

            {step === 'bag' && (
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="btn-primary mt-6 w-full"
              >
                Checkout
              </button>
            )}
          </div>
        </aside>
      </div>
    </PageTransition>
  );
}
