/* Print.tsx — Luminous Forge v1.4 — VMAX cards */
/* ctxAWR: Updated card rendering to use VmaxCard component */
import { useState, useEffect } from 'react';
import {
  Printer,
  X,
  Plus,
  FileText,
  Maximize2,
  Sparkles,
  Scissors,
  ShieldCheck,
  PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { loadCards } from '../hooks/useCardStorage';
import VmaxCard from '../components/Card';
import type { CardData } from '../types/card';

const MAX_SHEET = 8;

export default function Print() {
  const [allCards, setAllCards] = useState<CardData[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCards().then(c => setAllCards(c.sort((a, b) => b.createdAt - a.createdAt)));
  }, []);

  const toggleCard = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_SHEET) {
        next.add(id);
      }
      return next;
    });
  };

  const selectedCards = allCards.filter(c => selectedIds.has(c.id));
  const slotsRemaining = MAX_SHEET - selectedIds.size;

  return (
    <div className="py-12 pb-32">
      <header className="relative mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Ready for Production</span>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-on-surface mb-6">Print Station</h1>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-lg">
              Select up to {MAX_SHEET} cards for your print sheet. Each card exports at official TCG dimensions (63.5 x 88.9 mm).
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-full p-2 pr-8 shadow-lg flex items-center gap-4 border border-outline-variant/20">
            <div className="w-16 h-16 rounded-full luminous-forge flex items-center justify-center text-white font-black text-xl">
              {selectedIds.size}/{MAX_SHEET}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Sheet Capacity</p>
              <p className="font-bold text-on-surface">Cards Selected</p>
            </div>
          </div>
        </div>
      </header>

      {allCards.length === 0 ? (
        <div className="text-center py-20">
          <Printer className="w-12 h-12 text-outline/30 mx-auto mb-4" />
          <p className="text-on-surface-variant font-medium text-lg mb-2">No cards to print</p>
          <p className="text-on-surface-variant text-sm mb-6">Create some cards in the Studio first, then come back to print them.</p>
          <Link to="/studio" className="luminous-forge text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-3 shadow-lg shadow-primary/25">
            <PlusCircle className="w-5 h-5" /> Go to Studio
          </Link>
        </div>
      ) : (
        <>
          {/* Selected cards preview */}
          {selectedCards.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-on-surface mb-6">Print Sheet Preview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedCards.map((card) => (
                  <div key={card.id} className="relative group">
                    <VmaxCard card={card} compact />
                    <button
                      onClick={() => toggleCard(card.id)}
                      className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-error transition-colors z-30"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {slotsRemaining > 0 && (
                  <div className="rounded-2xl border-4 border-dashed border-outline-variant/30 flex flex-col items-center justify-center p-6 text-center">
                    <Plus className="w-6 h-6 text-primary mb-2" />
                    <p className="text-sm font-bold text-on-surface">{slotsRemaining} slot{slotsRemaining !== 1 ? 's' : ''} remaining</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Card picker */}
          <section className="mb-24">
            <h2 className="text-2xl font-bold text-on-surface mb-6">
              {selectedCards.length > 0 ? 'Add More Cards' : 'Select Cards to Print'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allCards.map((card) => {
                const isSelected = selectedIds.has(card.id);
                return (
                  <button
                    key={card.id}
                    onClick={() => toggleCard(card.id)}
                    disabled={!isSelected && slotsRemaining === 0}
                    className={`relative rounded-xl overflow-hidden transition-all text-left ${
                      isSelected
                        ? 'ring-3 ring-primary shadow-primary/20'
                        : slotsRemaining === 0 ? 'opacity-40' : 'hover:shadow-lg'
                    }`}
                  >
                    <VmaxCard card={card} compact showOverlays={false} />
                    {isSelected && (
                      <div className="absolute inset-0 z-30 bg-primary/20 rounded-2xl flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* Printing guide */}
      <section className="bg-surface-container-lowest rounded-[3rem] p-12 relative overflow-hidden shadow-sm border border-outline-variant/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/8 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3">
            <h2 className="text-4xl font-extrabold tracking-tight mb-6">Printing Guide</h2>
            <p className="text-on-surface-variant mb-8 leading-relaxed">
              Get the best results when printing your cards at home or at a print shop.
            </p>
            <div className="bg-surface-container-low p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span className="font-bold">Kid-Safe Materials</span>
              </div>
              <p className="text-sm text-on-surface-variant">Use non-toxic inks and cardstock safe for handling by children.</p>
            </div>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Paper Weight', desc: 'Use 250gsm-300gsm cardstock for an authentic trading card feel and durability.', icon: FileText },
              { title: 'Standard Sizing', desc: 'Each card prints at exactly 63.5 x 88.9 mm — fits all standard protector sleeves.', icon: Maximize2 },
              { title: 'Finish Options', desc: 'A semi-gloss or satin finish works best for vibrant colors and the Luminous Forge purple.', icon: Sparkles },
              { title: 'Cutting Tips', desc: 'Use a paper cutter or craft knife with a metal ruler for clean, straight edges.', icon: Scissors },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">{item.title}</h4>
                  <p className="text-sm text-on-surface-variant">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
