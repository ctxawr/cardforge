/* Home.tsx — Luminous Forge v1.4 — VMAX cards */
/* ctxAWR: Updated recent cards to use VmaxCard component */
import { useState, useEffect } from 'react';
import {
  Sparkles,
  Hand,
  PlusCircle,
  ArrowRight,
  LayoutGrid,
  Layers,
  Printer,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loadCards } from '../hooks/useCardStorage';
import VmaxCard from '../components/Card';
import type { CardData } from '../types/card';

export default function Home() {
  const { user } = useAuth();
  const [cards, setCards] = useState<CardData[]>([]);

  useEffect(() => {
    loadCards().then(c => setCards(c.sort((a, b) => b.createdAt - a.createdAt)));
  }, []);

  const firstName = user?.name?.split(' ')[0] ?? 'Card Maker';
  const recentCards = cards.slice(0, 5);

  return (
    <div className="space-y-16 py-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl p-12 luminous-forge text-white shadow-2xl shadow-primary/20">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-white fill-white" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] opacity-80">
              {cards.length > 0 ? `${cards.length} card${cards.length === 1 ? '' : 's'} in your collection` : 'Welcome to CardForge'}
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter mb-4 leading-none flex items-center gap-4">
            Hey {firstName} <Hand className="w-12 h-12" />
          </h1>
          <p className="text-xl opacity-90 font-medium max-w-md mb-8">
            {cards.length > 0
              ? 'Ready to forge something legendary today?'
              : 'Create your first custom trading card. Upload art, choose a frame, and bring your creature to life!'}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/studio" className="bg-white text-primary px-8 py-4 rounded-full font-bold text-sm tracking-wide shadow-xl hover:scale-105 transition-transform">
              CREATE A CARD
            </Link>
            {cards.length > 0 && (
              <Link to="/gallery" className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-white/30 transition-all">
                VIEW GALLERY
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Create a Card */}
        <Link to="/studio" className="md:col-span-2 group relative overflow-hidden bg-surface-container-lowest rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all flex flex-col justify-between min-h-[320px] border border-outline-variant/20">
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl luminous-forge flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/25">
              <PlusCircle className="w-8 h-8 fill-white/20" />
            </div>
            <h3 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Create a Card</h3>
            <p className="text-on-surface-variant font-medium max-w-[240px]">Upload artwork, pick a frame, and design your own trading card.</p>
          </div>
          <div className="relative z-10">
            <span className="text-primary font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
              LAUNCH STUDIO <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* My Gallery */}
        <Link to="/gallery" className="group bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between hover:bg-primary-container/40 transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-secondary mb-6 shadow-sm">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-on-surface mb-2">My Gallery</h3>
            <p className="text-on-surface-variant text-sm font-medium">
              {cards.length > 0 ? `Browse your ${cards.length} saved card${cards.length === 1 ? '' : 's'}.` : 'Your saved cards will appear here.'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
            <ArrowRight className="w-5 h-5 -rotate-45" />
          </div>
        </Link>

        {/* Build a Deck */}
        <Link to="/decks" className="group bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between hover:bg-secondary-container/40 transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-tertiary mb-6 shadow-sm">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-on-surface mb-2">Build a Deck</h3>
            <p className="text-on-surface-variant text-sm font-medium">Organize your cards into decks for play.</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
            <ArrowRight className="w-5 h-5 -rotate-45" />
          </div>
        </Link>

        {/* Print Cards */}
        <Link to="/print" className="md:col-span-2 group bg-surface-container-highest rounded-3xl p-8 flex flex-col justify-between hover:shadow-lg transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary mb-6 shadow-sm">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-on-surface mb-2">Print Cards</h3>
            <p className="text-on-surface-variant text-sm font-medium">Export your cards as a print-ready sheet at official TCG dimensions (63.5 x 88.9 mm).</p>
          </div>
          <span className="text-primary font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all mt-6">
            PRINT STATION <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        {/* Quick Stats */}
        {cards.length > 0 && (
          <div className="md:col-span-2 bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/20">
            <h4 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">Collection Stats</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-surface-container-low rounded-2xl">
                <div className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Total Cards</div>
                <div className="text-2xl font-black text-on-surface">{cards.length}</div>
              </div>
              <div className="p-4 bg-surface-container-low rounded-2xl">
                <div className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Rare+</div>
                <div className="text-2xl font-black text-on-surface">
                  {cards.filter(c => c.rarity === 'rare' || c.rarity === 'ultra-rare').length}
                </div>
              </div>
              <div className="p-4 bg-surface-container-low rounded-2xl">
                <div className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Types Used</div>
                <div className="text-2xl font-black text-on-surface">
                  {new Set(cards.map(c => c.type)).size}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Recent Creations */}
      {recentCards.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Recent Creations</h2>
              <p className="text-on-surface-variant font-medium">Your latest cards from the Studio.</p>
            </div>
            <Link to="/gallery" className="bg-surface-container-high text-on-surface px-6 py-3 rounded-full font-bold text-sm hover:bg-surface-container-highest transition-all">
              VIEW ALL
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {recentCards.map((card) => (
              <div key={card.id}>
                <VmaxCard card={card} compact />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
