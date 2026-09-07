import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Send, Github } from 'lucide-react';
import { NewsletterForm } from './NewsletterForm';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All Sneakers', to: '/shop' },
      { label: 'New Arrivals', to: '/shop?sort=newest' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Cart', to: '/cart' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Careers', to: '/about' },
      { label: 'Press', to: '/about' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Shipping', to: '/contact' },
      { label: 'Returns', to: '/contact' },
      { label: 'Size Guide', to: '/contact' },
      { label: 'FAQ', to: '/contact' },
    ],
  },
];

const SOCIALS = [
  { label: 'Instagram', Icon: Instagram },
  { label: 'Twitter', Icon: Twitter },
  { label: 'YouTube', Icon: Youtube },
  { label: 'GitHub', Icon: Github },
  { label: 'Telegram', Icon: Send },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-ink-50 dark:border-ink-800 dark:bg-ink-900">
      <div className="container-nexus py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* Brand + newsletter */}
          <div className="max-w-sm">
            <Link to="/" className="mb-4 inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center bg-nexus text-black">
                <span className="font-display text-lg leading-none">N</span>
              </span>
              <span className="font-display text-2xl tracking-tightest">
                NEXUS<span className="text-nexus-text dark:text-nexus">.</span>
              </span>
            </Link>
            <p className="mb-5 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
              Curated drops, rare colourways and everyday heat. Built for people who
              measure distance in blocks, not miles.
            </p>
            <NewsletterForm compact />
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 font-display text-sm tracking-[0.2em] text-ink-900 dark:text-ink-100">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-ink-600 transition-colors duration-200 hover:text-nexus-text dark:text-ink-400 dark:hover:text-nexus"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-ink-200 pt-8 dark:border-ink-800 sm:flex-row">
          <p className="text-xs uppercase tracking-widest text-ink-500 dark:text-ink-400">
            © {new Date().getFullYear()} Nexus Sneakers — Demo store, no real orders.
          </p>
          <div className="flex items-center gap-1">
            {SOCIALS.map(({ label, Icon }) => (
              <a
                key={label}
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label={label}
                className="rounded-full p-2.5 text-ink-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-nexus hover:text-black dark:text-ink-400"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
