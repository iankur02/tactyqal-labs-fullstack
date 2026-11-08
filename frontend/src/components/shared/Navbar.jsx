import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV_LINKS, BRAND } from '@/constants/content';
import Container from '@/components/ui/Container';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled ? 'bg-white/90 backdrop-blur border-b border-brand-950/10' : 'bg-transparent'
      }`}
    >
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-brand-950">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-950 text-white">
            <span className="font-display text-lg leading-none">T</span>
          </span>
          {BRAND.name}
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-600'
                    : 'text-brand-950/70 hover:bg-brand-950/5 hover:text-brand-950'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/#contact" className="btn-primary !px-5 !py-2.5 text-sm">
            Get in touch <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-brand-950/15 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-brand-950/10 bg-white md:hidden"
            aria-label="Mobile"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-brand-950/80 hover:bg-brand-950/5"
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/#contact" className="btn-primary mt-2 w-full">
                Get in touch <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}