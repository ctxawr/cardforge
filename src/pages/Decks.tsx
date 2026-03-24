/* Decks.tsx — Luminous Forge v1.1 */
/* ctxAWR: azure-pulse → luminous-forge, shadow-blue → shadow-primary, deck colors → purple tokens */
import { Layers, PlusCircle, LayoutGrid, Trash2, Edit3, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import Card from '../components/Card';

const initialDecks = [
  {
    id: 1,
    name: 'Void Stalkers',
    count: 40,
    archetype: 'Void',
    color: 'luminous-forge',
    cards: [
      { id: 101, name: 'Void Weaver', rarity: 'Rare', image: 'https://picsum.photos/seed/crystal/400/600' },
      { id: 102, name: 'Shadow Ronin', rarity: 'Ultra Rare', image: 'https://picsum.photos/seed/ronin/400/600' },
      { id: 103, name: 'Mana Surge', rarity: 'Common', image: 'https://picsum.photos/seed/surge/400/600' },
    ]
  },
  {
    id: 2,
    name: 'Celestial Guard',
    count: 42,
    archetype: 'Celestial',
    color: 'bg-secondary',
    cards: [
      { id: 201, name: 'Aether Wyrm', rarity: 'Legendary', image: 'https://picsum.photos/seed/wyrm/400/600' },
      { id: 202, name: 'Solar Flare', rarity: 'Rare', image: 'https://picsum.photos/seed/sun/400/600' },
    ]
  },
];

export default function Decks() {
  const [decks, setDecks] = useState(initialDecks);
  const [view, setView] = useState<'list' | 'builder'>('list');
  const [activeDeck, setActiveDeck] = useState<typeof initialDecks[0] | null>(null);

  const openBuilder = (deck: typeof initialDecks[0]) => {
    setActiveDeck(deck);
    setView('builder');
  };

  return (
    <div className="py-12 space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-tertiary font-bold tracking-widest text-xs uppercase mb-2">Strategy Hub</p>
          <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-4">
            {view === 'list' ? 'My Decks' : `Editing: ${activeDeck?.name}`}
          </h1>
          <p className="text-on-surface-variant max-w-lg text-lg leading-relaxed">
            {view === 'list'
              ? "Assemble your ultimate team of digital artifacts. Strategize, combine, and dominate the arena."
              : "Fine-tune your strategy by adding or removing artifacts from your vault."}
          </p>
        </div>
        {view === 'list' ? (
          <button className="luminous-forge text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
            <PlusCircle className="w-5 h-5" />
            <span>CREATE NEW DECK</span>
          </button>
        ) : (
          <button
            onClick={() => setView('list')}
            className="bg-surface-container-high text-on-surface px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-surface-container-highest transition-all"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            <span>SAVE & EXIT</span>
          </button>
        )}
      </header>

      {view === 'list' ? (
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {decks.map((deck) => (
            <motion.div
              key={deck.id}
              whileHover={{ y: -8 }}
              className="group bg-surface-container-lowest rounded-4xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all border border-outline-variant/20"
            >
              <div className={`h-32 ${deck.color} relative overflow-hidden p-8 flex items-end`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <h3 className="text-2xl font-black text-white relative z-10">{deck.name}</h3>
                <div className="absolute top-6 right-6 bg-black/20 backdrop-blur-md rounded-full px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                  {deck.archetype}
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {deck.cards.map((card) => (
                      <div key={card.id} className="w-12 h-16 rounded-lg overflow-hidden border-2 border-surface-container-lowest shadow-md transform hover:z-10 hover:scale-110 transition-all">
                        <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-12 h-16 rounded-lg bg-surface-container-high border-2 border-surface-container-lowest shadow-md flex items-center justify-center text-on-surface-variant font-bold text-xs">
                      +{deck.count - deck.cards.length}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-black text-outline uppercase tracking-widest">Total Cards</span>
                    <span className="text-2xl font-black text-on-surface">{deck.count}</span>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-surface-container">
                  <button
                    onClick={() => openBuilder(deck)}
                    className="flex-1 bg-surface-container-low text-on-surface py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Deck
                  </button>
                  <button className="w-12 h-12 bg-surface-container-low text-on-surface rounded-xl flex items-center justify-center hover:bg-error/10 hover:text-error transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          <button className="bg-surface-container-low border-4 border-dashed border-outline-variant/30 rounded-4xl flex flex-col items-center justify-center p-12 text-center group hover:bg-surface-container-lowest hover:border-primary/30 transition-all min-h-[320px]">
            <div className="w-16 h-16 rounded-full bg-surface-container-lowest flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <PlusCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-on-surface">New Deck</h3>
            <p className="text-sm text-on-surface-variant">Start from scratch</p>
          </button>
        </main>
      ) : (
        <main className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-on-surface">Deck Contents</h2>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-surface-container-lowest shadow-sm text-primary border border-outline-variant/20"><LayoutGrid className="w-5 h-5" /></button>
                <button className="p-2 rounded-lg bg-surface-container-low text-outline"><Layers className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeDeck?.cards.map((card) => (
                <Card
                  key={card.id}
                  id={card.id}
                  name={card.name}
                  rarity={card.rarity}
                  image={card.image}
                  compact
                />
              ))}
              <button className="aspect-[3/4] rounded-2xl border-4 border-dashed border-outline-variant/30 flex flex-col items-center justify-center p-6 text-center group hover:bg-surface-container-lowest hover:border-primary/30 transition-all">
                <PlusCircle className="w-8 h-8 text-primary mb-2" />
                <span className="text-xs font-bold text-on-surface">Add Card</span>
              </button>
            </div>
          </div>
          <aside className="space-y-6">
            <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/20 space-y-6">
              <h3 className="text-lg font-black uppercase tracking-widest text-on-surface-variant">Deck Stats</h3>
              <div className="space-y-4">
                {[
                  { label: 'Average Mana', value: '4.2' },
                  { label: 'Win Rate', value: '68%' },
                  { label: 'Rarity Score', value: '842' },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-sm text-outline font-medium">{stat.label}</span>
                    <span className="font-bold text-on-surface">{stat.value}</span>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-surface-container">
                <h4 className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-4">Archetype Split</h4>
                <div className="flex h-2 rounded-full overflow-hidden">
                  <div className="w-[60%] bg-primary"></div>
                  <div className="w-[25%] bg-secondary"></div>
                  <div className="w-[15%] bg-tertiary"></div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Void (60%)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span>Celestial (25%)</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full luminous-forge text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
              TEST IN SIMULATOR
            </button>
          </aside>
        </main>
      )}
    </div>
  );
}
