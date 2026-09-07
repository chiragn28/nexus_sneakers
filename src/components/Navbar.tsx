import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useStore, selectCartCount } from '../store/useStore';
import { ThemeToggle } from './ThemeToggle';
import { cx } from '../lib/format';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function CountBadge({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key="badge"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 640, damping: 26 }}
          className="pointer-events-none absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-nexus px-1 text-[10px] font-bold leading-none text-black"
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const cartCount = useStore(selectCartCount);
  const wishlistCount = useStore((s) => s.wishlist.length);
  const openCart = useStore((s) => s.openCart);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu / search whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Lock body scroll behind the mobile menu.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
    setQuery('');
    setSearchOpen(false);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cx(
      'relative py-1 text-sm font-bold uppercase tracking-widest transition-colors duration-200',
      isActive
        ? 'text-nexus-text dark:text-nexus'
        : 'text-ink-600 hover:text-ink-950 dark:text-ink-300 dark:hover:text-white',
    );

  return (
    <header
      className={cx(
        'sticky top-0 z-50 w-full transition-all duration-250',
        scrolled
          ? 'border-b border-ink-200 bg-white/90 backdrop-blur-md dark:border-ink-800 dark:bg-ink-950/85'
          : 'border-b border-transparent bg-white dark:bg-ink-950',
      )}
    >
      <div className="container-nexus">
        <div
          className={cx(
            'flex items-center justify-between gap-4 transition-all duration-250',
            scrolled ? 'h-16' : 'h-20',
          )}
        >
          {/* Logo */}
          <Link to="/" className="group flex shrink-0 items-center gap-2" aria-label="Nexus Sneakers home">
            <span className="flex h-8 w-8 items-center justify-center bg-nexus text-black transition-transform duration-200 group-hover:rotate-12">
              <span className="font-display text-lg leading-none">N</span>
            </span>
            <span className="font-display text-xl tracking-tightest sm:text-2xl">
              NEXUS<span className="text-nexus-text dark:text-nexus">.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={cx(
                        'absolute -bottom-0.5 left-0 h-0.5 bg-nexus transition-all duration-200',
                        isActive ? 'w-full' : 'w-0',
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Expanding search (desktop) */}
            <form onSubmit={submitSearch} className="hidden items-center md:flex">
              <AnimatePresence initial={false}>
                {searchOpen && (
                  <motion.input
                    ref={searchRef}
                    key="search-input"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onBlur={() => !query && setSearchOpen(false)}
                    placeholder="Search sneakers…"
                    aria-label="Search sneakers"
                    className="mr-1 border-b-2 border-ink-300 bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-ink-400 focus:border-nexus dark:border-ink-700 dark:placeholder:text-ink-500"
                  />
                )}
              </AnimatePresence>
              <button
                type={searchOpen ? 'submit' : 'button'}
                onClick={() => !searchOpen && setSearchOpen(true)}
                aria-label={searchOpen ? 'Submit search' : 'Open search'}
                className="rounded-full p-2 text-ink-600 transition-colors duration-200 hover:bg-ink-100 hover:text-nexus-text dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-nexus"
              >
                <Search size={20} />
              </button>
            </form>

            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} item${wishlistCount === 1 ? '' : 's'}`}
              className="relative rounded-full p-2 text-ink-600 transition-colors duration-200 hover:bg-ink-100 hover:text-nexus-text dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-nexus"
            >
              <Heart size={20} />
              <CountBadge count={wishlistCount} />
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
              className="relative rounded-full p-2 text-ink-600 transition-colors duration-200 hover:bg-ink-100 hover:text-nexus-text dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-nexus"
            >
              <ShoppingBag size={20} />
              <CountBadge count={cartCount} />
            </button>

            <ThemeToggle className="ml-1 hidden sm:flex" />

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="ml-1 rounded-full p-2 text-ink-700 transition-colors duration-200 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800 lg:hidden"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-950 lg:hidden"
          >
            <div className="container-nexus flex flex-col gap-1 py-5">
              <form onSubmit={submitSearch} className="mb-3 flex items-center gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sneakers…"
                  aria-label="Search sneakers"
                  className="field"
                />
                <button type="submit" className="btn-primary px-4 py-3" aria-label="Search">
                  <Search size={18} />
                </button>
              </form>

              {LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.2 }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      cx(
                        'block py-3 font-display text-3xl tracking-tightest transition-colors duration-200',
                        isActive
                          ? 'text-nexus-text dark:text-nexus'
                          : 'text-ink-900 hover:text-nexus-text dark:text-ink-100 dark:hover:text-nexus',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}

              <div className="mt-4 flex items-center justify-between border-t border-ink-200 pt-4 dark:border-ink-800">
                <span className="text-xs font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
                  Appearance
                </span>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
