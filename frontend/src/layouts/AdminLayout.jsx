import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, FileText, FolderTree, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/ui/Spinner';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/posts', label: 'Posts', icon: FileText },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
];

export default function AdminLayout() {
  const { user, signOut, isLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" label="Loading workspace…" />
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-brand-950/10 bg-white px-4 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-brand-950/15"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-brand-950">Tactyqal Admin</span>
        <button
          onClick={handleLogout}
          className="grid h-10 w-10 place-items-center rounded-lg border border-brand-950/15"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-brand-950/10 bg-white lg:flex lg:flex-col">
          <div className="flex h-16 items-center gap-2 border-b border-brand-950/10 px-5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-950 text-white">
              <span className="font-display text-base leading-none">T</span>
            </span>
            <span className="text-sm font-semibold text-brand-950">Tactyqal Admin</span>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-600'
                      : 'text-brand-950/70 hover:bg-brand-950/5 hover:text-brand-950'
                  }`
                }
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </NavLink>
            ))}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-950/60 hover:bg-brand-950/5 hover:text-brand-950"
            >
              <ExternalLink className="h-4 w-4" /> View site
            </a>
          </nav>

          <div className="border-t border-brand-950/10 p-3">
            <div className="mb-2 rounded-xl bg-surface-50 px-3 py-2.5">
              <p className="text-xs text-brand-950/50">Signed in as</p>
              <p className="mt-0.5 text-sm font-semibold text-brand-950">{user?.name}</p>
              <p className="text-[11px] uppercase tracking-wider text-brand-500">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-brand-950/70 hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
              <div className="absolute inset-0 bg-brand-950/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="relative flex h-full w-64 flex-col bg-white shadow-lift"
              >
                <div className="flex h-14 items-center justify-between border-b border-brand-950/10 px-4">
                  <span className="text-sm font-semibold text-brand-950">Menu</span>
                  <button onClick={() => setOpen(false)} aria-label="Close menu">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="flex-1 space-y-1 p-3">
                  {NAV.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                          isActive ? 'bg-brand-500/10 text-brand-600' : 'text-brand-950/70'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" /> {item.label}
                    </NavLink>
                  ))}
                </nav>
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}