/* Navbar.tsx — Luminous Forge v1.1 */
/* ctxAWR: Replaced azure-pulse/blue references with luminous-forge/purple tokens */
import {
  Home as HomeIcon,
  Sparkles,
  LayoutGrid,
  Layers,
  Printer,
  Search,
  Bell,
  UserCircle,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex bg-surface-container rounded-full px-4 py-2 items-center gap-2">
            <Search className="text-outline w-4 h-4" />
            <input
              type="text"
              placeholder="Search the vault..."
              className="bg-transparent border-none focus:ring-0 text-sm w-48 font-medium placeholder:text-outline"
            />
          </div>

          <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/8">
            <Bell className="w-5 h-5" />
          </button>

          <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/8">
            <UserCircle className="w-6 h-6" />
          </button>

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
