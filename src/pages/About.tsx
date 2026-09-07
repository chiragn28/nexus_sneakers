import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Recycle, Users } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { SneakerSilhouette } from '../components/SneakerSilhouette';
import { products, brands } from '../data/products';

const TIMELINE = [
  {
    year: '2019',
    title: 'A corner shop and one rack',
    body: 'Nexus started as a single rack in a shared studio, trading pairs with anyone who would show up on a Saturday.',
  },
  {
    year: '2021',
    title: 'The first drop',
    body: 'Twelve pairs, one afternoon, sold out before the coffee went cold. We knew the format worked.',
  },
  {
    year: '2023',
    title: 'Going wide',
    body: 'Partnerships with independent makers took the catalogue past a hundred silhouettes across five categories.',
  },
  {
    year: 'Today',
    title: 'Built for the block',
    body: 'Curated drops, verified pairs and a community that decides what lands next.',
  },
];

const VALUES = [
  {
    Icon: Compass,
    title: 'Curation over volume',
    body: 'We would rather carry twenty pairs worth owning than two thousand worth scrolling past.',
  },
  {
    Icon: Users,
    title: 'Community first',
    body: 'Drops are voted on. Restocks are requested. The rack belongs to the people wearing it.',
  },
  {
    Icon: Recycle,
    title: 'Made to last',
    body: 'Repairable construction, recycled packaging and a resale programme for pairs that need a second life.',
  },
];

export function About() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="grain relative overflow-hidden border-b border-ink-200 bg-ink-950 py-20 text-white dark:border-ink-800 dark:bg-ink-900 lg:py-28">
        <SneakerSilhouette
          className="pointer-events-none absolute -right-16 top-1/2 hidden w-[520px] -translate-y-1/2 text-white/5 lg:block"
        />
        <div className="container-nexus relative">
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-nexus">
            Our story
          </span>
          <h1 className="mt-3 max-w-3xl text-6xl leading-[0.85] sm:text-7xl lg:text-8xl">
            We sell
            <br />
            <span className="text-nexus">sneakers</span>,
            <br />
            not hype
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
            Nexus is a small crew of collectors, runners and shop rats who got tired of
            bots, resale mark-ups and stock photos that lie. So we built the store we
            wanted to buy from.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-ink-200 dark:border-ink-800">
        <div className="container-nexus grid divide-ink-200 py-12 dark:divide-ink-800 sm:grid-cols-3 sm:divide-x">
          {[
            { value: `${products.length}`, label: 'Silhouettes in rotation' },
            { value: `${brands.length}`, label: 'Independent makers' },
            { value: '48K', label: 'Pairs delivered' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="px-2 py-4 text-center sm:px-8"
            >
              <p className="font-display text-5xl tracking-tightest text-nexus-text dark:text-nexus">
                {stat.value}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-ink-500 dark:text-ink-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="container-nexus py-16 lg:py-24">
        <h2 className="mb-12 text-4xl sm:text-5xl">How we got here</h2>
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
          {TIMELINE.map((entry, i) => (
            <motion.div
              key={entry.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.3, delay: (i % 2) * 0.08 }}
              className="border-l-4 border-nexus pl-6"
            >
              <span className="font-display text-3xl tracking-tightest text-nexus-text dark:text-nexus">
                {entry.year}
              </span>
              <h3 className="mt-2 text-2xl">{entry.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
                {entry.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-ink-200 bg-ink-50 py-16 dark:border-ink-800 dark:bg-ink-900 lg:py-24">
        <div className="container-nexus">
          <h2 className="mb-12 text-4xl sm:text-5xl">What we stand on</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {VALUES.map(({ Icon, title, body }) => (
              <div key={title} className="surface p-6">
                <span className="mb-5 flex h-12 w-12 items-center justify-center bg-nexus text-black">
                  <Icon size={22} strokeWidth={2.2} />
                </span>
                <h3 className="text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-nexus py-20 text-center">
        <h2 className="mx-auto max-w-2xl text-4xl sm:text-6xl">
          Come see what's on the rack
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn-primary">
            Shop all sneakers <ArrowRight size={17} strokeWidth={2.5} />
          </Link>
          <Link to="/contact" className="btn-outline">
            Talk to us
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
