/* Gallery.tsx — Luminous Forge v1.3 — wired to IndexedDB saved cards */
/* ctxAWR: Replaced hardcoded data with loadCards(), added delete, export per card */
import { useState, useEffect } from 'react';
import { PlusCircle, ArrowUpDown, Trash2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { loadCards, deleteCard } from '../hooks/useCardStorage';
import { exportCardToPng } from '../hooks/useCardExport';
import { getFrame } from '../data/frames';
import type { CardData } from '../types/card';

export default function Gallery() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards().then(c => {
      setCards(c.sort((a, b) => b.createdAt - a.createdAt));
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    await deleteCard(id);
    setCards(prev => prev.filter(c => c.id !== id));
  };

  const handleExport = (card: CardData) => {
    const el = document.getElementById(`card-${card.id}`);
    if (el) exportCardToPng(el, card.name);
  };

  return (
    <div className="space-y-12 py-12">
      <header>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-primary font-bold tracking-widest text-xs uppercase mb-2">Your Collection</p>
            <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-4">Card Gallery</h1>
            <p className="text-on-surface-variant max-w-lg text-lg leading-relaxed">
              {cards.length > 0
                ? `You have ${cards.length} card${cards.length === 1 ? '' : 's'} in your collection.`
                : 'Your collection is empty. Head to the Studio to create your first card!'}
            </p>
          </div>
          <Link to="/studio" className="luminous-forge text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 shadow-lg shadow-primary/25 active:scale-95 transition-all">
            <PlusCircle className="w-5 h-5" />
            <span>NEW CARD</span>
          </Link>
        </div>
      </header>

      {loading ? (
        <div className="text-center py-20 text-on-surface-variant font-bold">Loading collection...</div>
      ) : cards.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-on-surface-variant font-medium text-lg mb-6">No cards yet!</p>
          <Link to="/studio" className="luminous-forge text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-primary/25 inline-flex items-center gap-3">
            <PlusCircle className="w-5 h-5" /> Create Your First Card
          </Link>
        </div>
      ) : (
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {cards.map((card) => {
            const frame = getFrame(card.frameId);
            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-primary/15 transition-all"
              >
                {/* Card art with frame overlay */}
                <div id={`card-${card.id}`} className="relative" style={{ aspectRatio: '500/670' }}>
                  {card.imageDataUrl ? (
                    <img src={card.imageDataUrl} alt={card.name}
                      className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-surface-container" />
                  )}
                  <img
                    src={frame?.src ?? '/frames/frame_classic_01.png'}
                    alt="" aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
                  />
                  <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-tighter">
                    {card.rarity}
                  </div>
                  <div className="absolute top-0 left-0 right-0 z-20 p-2 flex justify-between items-start">
                    <span className="text-white font-black text-xs drop-shadow-lg truncate max-w-[65%]">{card.name}</span>
                    <span className="text-white font-bold text-[10px] drop-shadow-lg">{card.hp} HP</span>
                  </div>
                </div>

                {/* Info strip */}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-extrabold tracking-tight text-on-surface truncate">{card.name}</h3>
                    <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase shrink-0 ml-2">{card.type}</span>
                  </div>

                  {card.attack1.name && (
                    <div className="text-xs text-on-surface-variant">
                      <span className="font-bold">{card.attack1.name}</span> ({card.attack1.damage} dmg)
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-surface-container">
                    <button
                      onClick={() => handleExport(card)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-on-surface-variant hover:text-primary py-1.5 rounded-lg bg-surface-container-low hover:bg-primary/10 transition-all"
                    >
                      <Download className="w-3 h-3" /> Export
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="flex items-center justify-center gap-1 text-xs font-bold text-on-surface-variant hover:text-error px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-error/10 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </main>
      )}
    </div>
  );
}
