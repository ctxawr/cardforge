/* Print.tsx — Luminous Forge v1.8 — Print sheet with export */
/* ctxAWR: Allows incomplete sheets (print 1-8 cards), duplicate cards in multiple slots,
   and always-visible Export/Print button. Uses canvas-based export. */
import { useState, useEffect } from 'react';
import {
  Printer, X, Plus, FileText, Maximize2, Sparkles,
  Scissors, ShieldCheck, PlusCircle, Download, Copy
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { loadCards } from '../hooks/useCardStorage';
import { exportPrintSheet } from '../hooks/useCardExport';
import VmaxCard from '../components/Card';
import type { CardData } from '../types/card';

const MAX_SHEET = 8;

export default function Print() {
  const [allCards, setAllCards] = useState<CardData[]>([]);
  // Slots hold card IDs — same card can appear multiple times
  const [slots, setSlots] = useState<string[]>([]);

  useEffect(() => {
    loadCards().then(c => setAllCards(c.sort((a, b) => b.createdAt - a.createdAt)));
  }, []);

  const addCard = (id: string) => {
    if (slots.length >= MAX_SHEET) return;
    setSlots(prev => [...prev, id]);
  };

  const removeSlot = (index: number) => {
    setSlots(prev => prev.filter((_, i) => i !== index));
  };

  const fillAllWith = (id: string) => {
    const remaining = MAX_SHEET - slots.length;
    if (remaining <= 0) return;
    setSlots(prev => [...prev, ...Array(remaining).fill(id)]);
  };

  const slotCards = slots.map(id => allCards.find(c => c.id === id)).filter(Boolean) as CardData[];

  const handleExport = async () => {
    if (slotCards.length === 0) return;
    await exportPrintSheet(slotCards);
  };

  return (
    <div className="py-12 pb-32">
      <header className="relative mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Ready for Production</span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface mb-4">Print Station</h1>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-lg">
              Build your print sheet — add 1 to {MAX_SHEET} cards. You can add the same card multiple times to fill a page.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-surface-container-lowest rounded-full p-2 pr-6 shadow-lg flex items-center gap-3 border border-outline-variant/20">
              <div className="w-14 h-14 rounded-full luminous-forge flex items-center justify-center text-white font-black text-lg">
                {slots.length}/{MAX_SHEET}
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Sheet</p>
                <p className="font-bold text-on-surface text-sm">Slots Used</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {allCards.length === 0 ? (
        <div className="text-center py-20">
          <Printer className="w-12 h-12 text-outline/30 mx-auto mb-4" />
          <p className="text-on-surface-variant font-medium text-lg mb-2">No cards to print</p>
          <p className="text-on-surface-variant text-sm mb-6">Create some cards in the Studio first.</p>
          <Link to="/studio" className="luminous-forge text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-3 shadow-lg shadow-primary/25">
            <PlusCircle className="w-5 h-5" /> Go to Studio
          </Link>
        </div>
      ) : (
        <>
          {/* Print sheet preview */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-on-surface">Print Sheet Preview</h2>
              {slots.length > 0 && (
                <button
                  onClick={() => setSlots([])}
                  className="text-xs font-bold text-on-surface-variant hover:text-error transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {slots.map((id, index) => {
                const card = allCards.find(c => c.id === id);
                if (!card) return null;
                return (
                  <div key={index} className="relative group">
                    <VmaxCard card={card} compact />
                    <button
                      onClick={() => removeSlot(index)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-error transition-colors z-30 opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
              {slots.length < MAX_SHEET && (
                <div className="rounded-2xl border-3 border-dashed border-outline-variant/30 flex flex-col items-center justify-center p-6 text-center" style={{ aspectRatio: '500/700' }}>
                  <Plus className="w-6 h-6 text-primary/40 mb-2" />
                  <p className="text-xs font-bold text-on-surface-variant">{MAX_SHEET - slots.length} slot{MAX_SHEET - slots.length !== 1 ? 's' : ''} left</p>
                </div>
              )}
            </div>
          </section>

          {/* Export button — always visible when there are cards */}
          {slots.length > 0 && (
            <section className="mb-10">
              <div className="flex gap-3">
                <button
                  onClick={handleExport}
                  className="flex-1 luminous-forge text-white py-4 rounded-2xl font-extrabold text-sm shadow-xl shadow-primary/25 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
                >
                  <Download className="w-5 h-5" />
                  Export Print Sheet ({slots.length} card{slots.length !== 1 ? 's' : ''})
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-surface-container-low text-on-surface px-6 py-4 rounded-2xl font-bold text-sm hover:bg-surface-container-high transition-all flex items-center gap-2"
                >
                  <Printer className="w-5 h-5" /> Print
                </button>
              </div>
            </section>
          )}

          {/* Card picker — add cards to sheet, including duplicates */}
          <section className="mb-16">
            <h2 className="text-xl font-bold text-on-surface mb-4">
              {slots.length > 0 ? 'Add More Cards' : 'Select Cards to Print'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {allCards.map((card) => (
                <div key={card.id} className="space-y-2">
                  <button
                    onClick={() => addCard(card.id)}
                    disabled={slots.length >= MAX_SHEET}
                    className={`relative rounded-xl overflow-hidden transition-all text-left w-full ${
                      slots.length >= MAX_SHEET ? 'opacity-40' : 'hover:shadow-lg hover:scale-[1.02]'
                    }`}
                  >
                    <VmaxCard card={card} compact />
                    {/* Count badge if this card is already in slots */}
                    {slots.filter(s => s === card.id).length > 0 && (
                      <div className="absolute top-2 left-2 z-30 bg-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                        {slots.filter(s => s === card.id).length}
                      </div>
                    )}
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={() => addCard(card.id)}
                      disabled={slots.length >= MAX_SHEET}
                      className="flex-1 text-[10px] font-bold text-on-surface-variant hover:text-primary py-1 rounded-lg bg-surface-container-low hover:bg-primary/10 transition-all disabled:opacity-30 flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                    <button
                      onClick={() => fillAllWith(card.id)}
                      disabled={slots.length >= MAX_SHEET}
                      className="flex-1 text-[10px] font-bold text-on-surface-variant hover:text-primary py-1 rounded-lg bg-surface-container-low hover:bg-primary/10 transition-all disabled:opacity-30 flex items-center justify-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Fill Page
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Printing guide */}
      <section className="bg-surface-container-lowest rounded-3xl p-10 relative overflow-hidden shadow-sm border border-outline-variant/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/8 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-start">
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">Printing Guide</h2>
            <p className="text-on-surface-variant mb-6 leading-relaxed text-sm">
              Get the best results when printing your cards at home or at a print shop.
            </p>
            <div className="bg-surface-container-low p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm">Kid-Safe Materials</span>
              </div>
              <p className="text-xs text-on-surface-variant">Use non-toxic inks and cardstock safe for handling by children.</p>
            </div>
          </div>
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Paper Weight', desc: '250–300gsm cardstock for authentic TCG feel.', icon: FileText },
              { title: 'Standard Sizing', desc: 'Each card: 63.5 x 88.9 mm — fits standard sleeves.', icon: Maximize2 },
              { title: 'Finish Options', desc: 'Semi-gloss or satin for vibrant colors.', icon: Sparkles },
              { title: 'Cutting Tips', desc: 'Use a paper cutter for clean straight edges.', icon: Scissors },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-0.5">{item.title}</h4>
                  <p className="text-xs text-on-surface-variant">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
