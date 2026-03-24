/* Footer.tsx — Luminous Forge v1.1 */
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="max-w-screen-2xl mx-auto px-6 py-12 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="text-xl font-black tracking-tighter text-primary uppercase">
        CardForge
      </div>

      <div className="flex gap-8 text-sm font-bold text-outline uppercase tracking-widest">
        <Link to="#" className="hover:text-primary transition-colors">Terms</Link>
        <Link to="#" className="hover:text-primary transition-colors">Privacy</Link>
        <Link to="#" className="hover:text-primary transition-colors">Support</Link>
      </div>

      <div className="text-xs text-outline-variant font-medium italic">
        © 2025 CardForge — Luminous Forge Digital Artifacts. All Rights Reserved.
      </div>
    </footer>
  );
}
