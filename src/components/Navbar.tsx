/* Navbar.tsx — Luminous Forge v1.3 */
/* ctxAWR: Auth-aware navbar with Google user avatar/sign-in, removed dummy bell/search */
import {
  Home as HomeIcon,
  Sparkles,
  LayoutGrid,
  Layers,
  Printer,
  LogIn,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signIn, signOut } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Studio', path: '/studio', icon: Sparkles },
    { name: 'Gallery', path: '/gallery', icon: LayoutGrid },
    { name: 'Decks', path: '/decks', icon: Layers },
    { name: 'Print', path: '/print', icon: Printer },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="glass-nav shadow-[0_8px_30px_rgba(125,18,255,0.06)] sticky top-0 z-50 border-b border-outline-variant/30">
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-black tracking-tighter text-primary uppercase">
            CardForge
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-bold tracking-tight transition-all relative py-1 ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                {user.picture && (
                  <img src={user.picture} alt="" className="w-8 h-8 rounded-full border-2 border-primary/20" referrerPolicy="no-referrer" />
                )}
                <span className="text-sm font-bold text-on-surface">{user.name.split(' ')[0]}</span>
              </div>
              <button
                onClick={signOut}
                className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/8"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={signIn}
              className="flex items-center gap-2 luminous-forge text-white px-5 py-2 rounded-full font-bold text-sm shadow-md shadow-primary/20 hover:scale-105 transition-transform"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}

          <button
            className="md:hidden text-on-surface-variant p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-surface-container-lowest border-t border-outline-variant/30 p-4 flex flex-col gap-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl font-bold ${
                  isActive(item.path) ? 'bg-primary/10 text-primary' : 'text-on-surface-variant'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
