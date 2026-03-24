/* Home.tsx — Luminous Forge v1.1 */
/* ctxAWR: azure-pulse → luminous-forge, shadow-blue → shadow-primary, hero gradient purple */
import {
  Sparkles,
  Hand,
  PlusCircle,
  ArrowRight,
  LayoutGrid,
  Layers,
  Printer,
  TrendingUp,
  Trophy,
  Users,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

const recentCreations = [
  { id: 1, name: 'Neon Ronin', rarity: 'Ultra Rare', color: 'text-primary', image: 'https://picsum.photos/seed/ronin/400/600', attack: 2400, defense: 1800, mana: 8 },
  { id: 2, name: 'Aether Grove', rarity: 'Legendary', color: 'text-secondary', image: 'https://picsum.photos/seed/grove/400/600', attack: 0, defense: 5000, mana: 12 },
  { id: 3, name: 'Mana Surge', rarity: 'Common', color: 'text-outline', image: 'https://picsum.photos/seed/surge/400/600', attack: 500, defense: 500, mana: 2 },
  { id: 4, name: 'Void Walker', rarity: 'Rare', color: 'text-primary', image: 'https://picsum.photos/seed/void/400/600', attack: 1800, defense: 1200, mana: 5 },
  { id: 5, name: 'Core Matrix', rarity: 'Epic', color: 'text-secondary', image: 'https://picsum.photos/seed/core/400/600', attack: 1200, defense: 2800, mana: 7 },
];

export default function Home() {
  return (
    <div className="space-y-16 py-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-5xl p-12 luminous-forge text-white shadow-2xl shadow-primary/20">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-white fill-white" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] opacity-80">Vault Status: Active</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter mb-4 leading-none flex items-center gap-4">
            Hey Alex <Hand className="w-12 h-12" />
          </h1>
          <p className="text-xl opacity-90 font-medium max-w-md mb-8">
            Your collection has grown by 12 cards this week. Ready to forge something legendary today?
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-primary px-8 py-4 rounded-full font-bold text-sm tracking-wide shadow-xl hover:scale-105 transition-transform">
              RESUME LAST PROJECT
            </button>
            <button className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-white/30 transition-all">
              VIEW ANALYTICS
            </button>
          </div>
        </div>
        {/* Decorative watermark */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 opacity-10 pointer-events-none">
          <TrendingUp className="w-full h-full" />
        </div>
      </section>

      {/* Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Create a Card */}
        <Link to="/studio" className="md:col-span-2 group relative overflow-hidden bg-surface-container-lowest rounded-4xl p-8 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all flex flex-col justify-between min-h-[320px] border border-outline-variant/20">
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl luminous-forge flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/25">
              <PlusCircle className="w-8 h-8 fill-white/20" />
            </div>
            <h3 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Create a Card</h3>
            <p className="text-on-surface-variant font-medium max-w-[240px]">Design custom artifacts with AI-assisted art generation.</p>
          </div>
          <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
            <img
              src="https://picsum.photos/seed/abstract/600/800"
              alt="Abstract"
              className="w-full h-full object-cover rounded-tl-5xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10">
            <span className="text-primary font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
              LAUNCH STUDIO <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* My Gallery */}
        <Link to="/gallery" className="group bg-surface-container-low rounded-4xl p-8 flex flex-col justify-between hover:bg-primary-container/40 transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-secondary mb-6 shadow-sm">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-on-surface mb-2">My Gallery</h3>
            <p className="text-on-surface-variant text-sm font-medium">Browse your 1,240 stored artifacts.</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
            <ArrowRight className="w-5 h-5 -rotate-45" />
          </div>
        </Link>

        {/* Build a Deck */}
        <Link to="/decks" className="group bg-surface-container-low rounded-4xl p-8 flex flex-col justify-between hover:bg-secondary-container/40 transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-tertiary mb-6 shadow-sm">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-on-surface mb-2">Build a Deck</h3>
            <p className="text-on-surface-variant text-sm font-medium">Strategize and assemble your winning team.</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
            <ArrowRight className="w-5 h-5 -rotate-45" />
          </div>
        </Link>

        {/* Print Cards */}
        <Link to="/print" className="group relative overflow-hidden bg-surface-container-highest rounded-4xl p-8 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary mb-6 shadow-sm">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-on-surface mb-2">Print Cards</h3>
            <p className="text-on-surface-variant text-sm font-medium">Premium holographic finishes delivered to your door.</p>
          </div>
          <div className="mt-8">
            <div className="bg-surface-container-lowest/60 backdrop-blur rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-outline mb-2">
                <span>Last Order</span>
                <span>Delivered</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-12 bg-surface-container-high rounded animate-pulse"></div>
                <div className="text-xs font-bold">Shadow Dragon Set</div>
              </div>
            </div>
            <button className="w-full bg-on-surface text-white py-3 rounded-xl font-bold text-xs tracking-widest">ORDER NEW PRINTS</button>
          </div>
        </Link>

        {/* Market Insights */}
        <div className="md:col-span-3 bg-surface-container-lowest rounded-4xl p-8 shadow-sm border border-outline-variant/20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 w-full">
            <h4 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">Market Insights</h4>
            <h3 className="text-3xl font-extrabold tracking-tight mb-4">Vault Value Trends</h3>
            <div className="flex items-end gap-1 h-24 mb-4">
              {[40, 60, 85, 70, 100, 90, 95].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t-lg ${i < 2 ? 'bg-surface-container-high' : i < 5 ? 'bg-primary' : 'bg-secondary'}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-on-surface">+14.2% Growth</span>
              <span className="text-xs text-outline font-medium">Last 30 Days</span>
            </div>
          </div>
          <div className="w-px h-32 bg-outline-variant/20 hidden md:block"></div>
          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            {[
              { label: 'Rarity Score', value: '854', icon: Zap },
              { label: 'Active Trades', value: '3', icon: Users },
              { label: 'Top Ranking', value: '#12', icon: Trophy },
              { label: 'Achievements', value: '42', icon: Zap },
            ].map((stat) => (
              <div key={stat.label} className="p-4 bg-surface-container-low rounded-2xl">
                <div className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">{stat.label}</div>
                <div className="text-2xl font-black text-on-surface">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Creations */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Recent Creations</h2>
            <p className="text-on-surface-variant font-medium">Your latest masterpieces from the Studio.</p>
          </div>
          <Link to="/gallery" className="bg-surface-container-high text-on-surface px-6 py-3 rounded-full font-bold text-sm hover:bg-surface-container-highest transition-all">
            VIEW ALL
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {recentCreations.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              name={card.name}
              rarity={card.rarity}
              image={card.image}
              attack={card.attack}
              defense={card.defense}
              mana={card.mana}
              compact
            />
          ))}
        </div>
      </section>
    </div>
  );
}
