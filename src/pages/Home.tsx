import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Flame, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { ProductCard } from '../components/ProductCard';
import { SneakerSilhouette } from '../components/SneakerSilhouette';
import { SneakerArt } from '../components/SneakerArt';
import { NewsletterForm } from '../components/NewsletterForm';
import { products, categories } from '../data/products';

const MARQUEE = [
  'LIMITED DROPS',
  'FREE SHIPPING OVER $200',
  'AUTHENTICATED',
  'NEW HEAT WEEKLY',
  'WORLDWIDE',
];

const PERKS = [
  { Icon: Truck, title: 'Fast Dispatch', body: 'Orders leave the warehouse within 24 hours.' },
  { Icon: ShieldCheck, title: '100% Authentic', body: 'Every pair verified before it ships.' },
  { Icon: RefreshCw, title: '30-Day Returns', body: 'Unworn, boxed, no questions asked.' },
];

export function Home() {
  const railRef = useRef<HTMLDivElement>(null);
  const featured = products.filter((p) => p.isFeatured);
  const heroProduct = featured[0] ?? products[0];

  const scrollRail = (direction: -1 | 1) => {
    railRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  return (
    <PageTransition>
      {/* ---------------------------------------------------------------- HERO */}
      <section className="grain relative overflow-hidden border-b border-ink-200 bg-ink-50 dark:border-ink-800 dark:bg-ink-900">
        {/* Oversized ghost word behind the hero */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 top-1/2 hidden -translate-y-1/2 select-none font-display text-[16rem] leading-none text-ink-200/70 dark:text-ink-800/80 lg:block"
        >
          NX
        </span>

        <div className="container-nexus relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-5 inline-flex items-center gap-2 bg-nexus px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-black"
            >
              <Flame size={13} strokeWidth={3} /> Drop 04 — Live Now
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="text-[15vw] leading-[0.82] sm:text-7xl lg:text-8xl"
            >
              Step Into
              <br />
              The{' '}
              <span className="text-nexus-text dark:text-nexus">Nexus</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="mt-6 max-w-md text-base leading-relaxed text-ink-600 dark:text-ink-300 sm:text-lg"
            >
              Curated drops, rare colourways and everyday heat. Built for people who
              measure distance in blocks, not miles.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.18 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/shop" className="btn-primary">
                Shop the drop <ArrowRight size={17} strokeWidth={2.5} />
              </Link>
              <Link to="/about" className="btn-outline">
                Our story
              </Link>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.26 }}
              className="mt-12 flex gap-10"
            >
              {[
                { value: `${products.length}`, label: 'Silhouettes' },
                { value: `${categories.length}`, label: 'Categories' },
                { value: '24H', label: 'Dispatch' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-3xl tracking-tightest">{stat.value}</dt>
                  <dd className="text-[11px] uppercase tracking-[0.2em] text-ink-500 dark:text-ink-400">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="relative aspect-square border-2 border-ink-950 bg-nexus dark:border-white">
              <div className="absolute inset-0 flex items-center justify-center">
                {heroProduct && (
                  <SneakerArt
                    art={heroProduct.art}
                    uid="hero"
                    className="w-[88%] drop-shadow-2xl"
                  />
                )}
              </div>
              <span className="absolute bottom-4 left-4 max-w-[70%] text-[10px] font-bold uppercase tracking-[0.28em] text-black/75">
                {heroProduct ? `${heroProduct.name} · ${heroProduct.colorway}` : ''}
              </span>
            </div>
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 -z-10 h-full w-full border-2 border-ink-950 dark:border-white"
            />
          </motion.div>
        </div>

        {/* Marquee strip */}
        <div className="overflow-hidden border-t border-ink-200 bg-ink-950 py-3 dark:border-ink-800 dark:bg-white">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
                {MARQUEE.map((item) => (
                  <span
                    key={`${copy}-${item}`}
                    className="flex items-center gap-6 whitespace-nowrap px-6 font-display text-sm tracking-[0.2em] text-white dark:text-ink-950"
                  >
                    {item}
                    <span className="h-1.5 w-1.5 shrink-0 bg-nexus" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ FEATURED DROPS */}
      <section className="container-nexus py-16 lg:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-nexus-text dark:text-nexus">
              Hand-picked
            </span>
            <h2 className="mt-2 text-4xl sm:text-5xl">Featured Drops</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollRail(-1)}
              aria-label="Scroll featured drops left"
              className="hidden h-10 w-10 items-center justify-center border-2 border-ink-200 transition-colors duration-200 hover:border-nexus hover:bg-nexus hover:text-black dark:border-ink-700 sm:flex"
            >
              <ArrowLeft size={17} />
            </button>
            <button
              type="button"
              onClick={() => scrollRail(1)}
              aria-label="Scroll featured drops right"
              className="hidden h-10 w-10 items-center justify-center border-2 border-ink-200 transition-colors duration-200 hover:border-nexus hover:bg-nexus hover:text-black dark:border-ink-700 sm:flex"
            >
              <ArrowRight size={17} />
            </button>
            <Link
              to="/shop"
              className="ml-2 whitespace-nowrap text-xs font-bold uppercase tracking-widest text-ink-600 underline-offset-4 transition-colors duration-200 hover:text-nexus-text hover:underline dark:text-ink-300 dark:hover:text-nexus"
            >
              View all
            </Link>
          </div>
        </div>

        <div
          ref={railRef}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0"
        >
          {featured.map((product, i) => (
            <div
              key={product.id}
              className="w-[78vw] shrink-0 snap-start sm:w-[46%] lg:w-[30%] xl:w-[23%]"
            >
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- CATEGORIES */}
      <section className="border-y border-ink-200 bg-ink-50 py-16 dark:border-ink-800 dark:bg-ink-900 lg:py-20">
        <div className="container-nexus">
          <h2 className="mb-8 text-4xl sm:text-5xl">Shop By Category</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category, i) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.28, delay: i * 0.05 }}
              >
                <Link
                  to={`/shop?category=${encodeURIComponent(category)}`}
                  className="group relative flex h-40 flex-col justify-end overflow-hidden border-2 border-ink-950 bg-white p-4 transition-colors duration-200 hover:bg-nexus dark:border-ink-100 dark:bg-ink-950 dark:hover:bg-nexus"
                >
                  <SneakerSilhouette className="absolute -right-6 top-4 w-32 text-ink-200 transition-transform duration-300 group-hover:scale-110 dark:text-ink-800 group-hover:text-black/25" />
                  <span className="relative font-display text-2xl tracking-tightest transition-colors duration-200 group-hover:text-black dark:group-hover:text-black">
                    {category}
                  </span>
                  <span className="relative mt-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-ink-500 transition-colors duration-200 group-hover:text-black/70 dark:text-ink-400">
                    {products.filter((p) => p.category === category).length} styles
                    <ArrowRight size={12} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- PERKS */}
      <section className="container-nexus grid gap-8 py-16 sm:grid-cols-3">
        {PERKS.map(({ Icon, title, body }) => (
          <div key={title} className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-nexus text-black">
              <Icon size={20} strokeWidth={2.2} />
            </span>
            <div>
              <h3 className="text-lg">{title}</h3>
              <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">{body}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="slash-divider" aria-hidden="true" />

      {/* --------------------------------------------------------- NEWSLETTER */}
      <section className="grain relative overflow-hidden bg-ink-950 py-20 text-white dark:bg-ink-900">
        <div className="container-nexus relative text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-nexus">
            Never miss a drop
          </span>
          <h2 className="mx-auto mt-3 max-w-2xl text-4xl sm:text-6xl">
            Get the heat before it sells out
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-ink-300 sm:text-base">
            Early access, restock alerts and members-only colourways. One email per
            drop — no filler.
          </p>
          <div className="mt-8">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
