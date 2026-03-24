/* Gallery.tsx — Luminous Forge v1.1 */
/* ctxAWR: azure-pulse → luminous-forge, shadow-blue → shadow-primary */
import {
  PlusCircle,
  ArrowUpDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

const galleryCards = [
  { id: 1, name: 'Neon Phoenix', rarity: 'Ultra Rare', level: 99, attack: '2,450', defense: '1,820', mana: 12, status: 'Final Build', image: 'https://picsum.photos/seed/phoenix/600/800' },
  { id: 2, name: 'Chrome Sentinel', rarity: 'Common', level: 12, attack: '450', defense: '1,200', mana: 4, status: 'Generated', image: 'https://picsum.photos/seed/sentinel/600/800' },
  { id: 3, name: 'Void Crystal', rarity: 'Epic', level: 45, attack: '0', defense: '4,500', mana: 8, status: 'Final Build', image: 'https://picsum.photos/seed/crystal2/600/800' },
  { id: 4, name: 'World Sync', rarity: 'Rare', level: 32, attack: '1,100', defense: '1,100', mana: 6, status: 'Draft', image: 'https://picsum.photos/seed/world/600/800' },
  { id: 5, name: 'Aether Wyrm', rarity: 'Legendary', level: 75, attack: '3,200', defense: '2,100', mana: 15, status: 'Final Build', image: 'https://picsum.photos/seed/wyrm/600/800' },
  { id: 6, name: 'Solar Flare', rarity: 'Rare', level: 28, attack: '1,800', defense: '400', mana: 5, status: 'Generated', image: 'https://picsum.photos/seed/sun/600/800' },
  { id: 7, name: 'Deep Sea Titan', rarity: 'Epic', level: 52, attack: '2,100', defense: '3,800', mana: 10, status: 'Final Build', image: 'https://picsum.photos/seed/sea/600/800' },
  { id: 8, name: 'Lunar Assassin', rarity: 'Ultra Rare', level: 64, attack: '2,900', defense: '900', mana: 9, status: 'Draft', image: 'https://picsum.photos/seed/moon/600/800' },
];

export default function Gallery() {
  return (
    <div className="space-y-12 py-12">
      <header>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-primary font-bold tracking-widest text-xs uppercase mb-2">Vault Explorer</p>
            <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-4">Digital Gallery</h1>
            <p className="text-on-surface-variant max-w-lg text-lg leading-relaxed">
              Browse and manage your meticulously crafted artifacts. Every card is a testament to digital mastery and ethereal design.
            </p>
          </div>
          <Link to="/studio" className="luminous-forge text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 shadow-lg shadow-primary/25 active:scale-95 transition-all">
            <PlusCircle className="w-5 h-5" />
            <span>NEW CARD</span>
          </Link>
        </div>
      </header>

      <section className="bg-surface-container-low/40 px-4 py-6 rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            {['All', 'Generated', 'Draft', 'Final'].map((filter, i) => (
              <button
                key={filter}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                  i === 0
                    ? 'luminous-forge text-white shadow-md shadow-primary/25'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span>128 Total Cards</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span>12 Ultra Rare</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              <span>Recent First</span>
            </div>
          </div>
        </div>
      </section>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {galleryCards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            name={card.name}
            rarity={card.rarity}
            image={card.image}
            level={card.level}
            attack={card.attack}
            defense={card.defense}
            mana={card.mana}
            status={card.status}
          />
        ))}
      </main>
    </div>
  );
}
