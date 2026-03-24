/* Decks.tsx — Luminous Forge v1.3 */
/* ctxAWR: Data-driven decks from IndexedDB, removed all hardcoded placeholder data */
import { Layers, PlusCircle, Trash2, Edit3, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadCards } from '../hooks/useCardStorage';
import { getFrame } from '../data/frames';
import type { CardData } from '../types/card';

// v1.3 — ctxAWR: Deck stored in localStorage as JSON (IndexedDB reserved for cards)
interface Deck {
  id: string;
  name: string;
  cardIds: string[];
}

const DECKS_KEY = 'cardforge_decks';

function loadDecks(): Deck[] {
  try {
    return JSON.parse(localStorage.getItem(DECKS_KEY) ?? '[]');
  } catch { return []; }
}

function saveDecks(decks: Deck[]): void {
  localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
}

export default function Decks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [allCards, setAllCards] = useState<CardData[]>([]);
  const [view, setView] = useState<'list' | 'builder'>('list');
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);

  useEffect(() => {
    setDecks(loadDecks());
    loadCards().then(setAllCards);
  }, []);

  const cardMap = new Map(allCards.map(c => [c.id, c]));

  const createDeck = () => {
    const deck: Deck = { id: crypto.randomUUID(), name: `Deck ${decks.length + 1}`, cardIds: [] };
    const updated = [...decks, deck];
    setDecks(updated);
    saveDecks(updated);
    setActiveDeck(deck);
    setView('builder');
  };

  const deleteDeck = (id: string) => {
    const updated = decks.filter(d => d.id !== id);
    setDecks(updated);
    saveDecks(updated);
  };

  const openBuilder = (deck: Deck) => {
    setActiveDeck(deck);
    setView('builder');
  };

  const toggleCardInDeck = (cardId: string) => {
    if (!activeDeck) return;
    const has = activeDeck.cardIds.includes(cardId);
    const updated = has
      ? { ...activeDeck, cardIds: activeDeck.cardIds.filter(id => id !== cardId) }
      : { ...activeDeck, cardIds: [...activeDeck.cardIds, cardId] };
    setActiveDeck(updated);
    const allUpdated = decks.map(d => d.id === updated.id ? updated : d);
    setDecks(allUpdated);
    saveDecks(allUpdated);
  };

  const exitBuilder = () => {
    setView('list');
    setActiveDeck(null);
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
              ? 'Organize your cards into decks for play and trading.'
              : 'Tap cards below to add or remove them from this deck.'}
          </p>
        </div>
        {view === 'list' ? (
          <button
            onClick={createDeck}
            className="luminous-forge text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
          >
            <PlusCircle className="w-5 h-5" />
            <span>CREATE NEW DECK</span>
          </button>
        ) : (
          <button
            onClick={exitBuilder}
            className="bg-surface-container-high text-on-surface px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-surface-container-highest transition-all"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            <span>SAVE & EXIT</span>
          </button>
        )}
      </header>

      {view === 'list' ? (
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {decks.map((deck) => {
            const deckCards = deck.cardIds.map(id => cardMap.get(id)).filter(Boolean) as CardData[];
            return (
              <motion.div
                key={deck.id}
                whileHover={{ y: -8 }}
                className="group bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all border border-outline-variant/20"
              >
                <div className="h-32 luminous-forge relative overflow-hidden p-8 flex items-end">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  <h3 className="text-2xl font-black text-white relative z-10">{deck.name}</h3>
                  <div className="absolute top-6 right-6 bg-black/20 backdrop-blur-md rounded-full px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                    {deckCards.length} card{deckCards.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  {deckCards.length > 0 ? (
                    <div className="flex -space-x-3">
                      {deckCards.slice(0, 4).map((card) => {
                        const frame = getFrame(card.frameId);
                        return (
                          <div key={card.id} className="w-12 h-16 rounded-lg overflow-hidden border-2 border-surface-container-lowest shadow-md relative">
                            {card.imageDataUrl ? (
                              <img src={card.imageDataUrl} alt={card.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-surface-container-high" />
                            )}
                            <img src={frame?.src ?? '/frames/frame_classic_01.png'} alt="" className="absolute inset-0 w-full h-full object-cover z-10" />
                          </div>
                        );
                      })}
                      {deckCards.length > 4 && (
                        <div className="w-12 h-16 rounded-lg bg-surface-container-high border-2 border-surface-container-lowest shadow-md flex items-center justify-center text-on-surface-variant font-bold text-xs">
                          +{deckCards.length - 4}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-on-surface-variant">No cards added yet. Tap Edit to add cards.</p>
                  )}
                  <div className="flex gap-3 pt-4 border-t border-surface-container">
                    <button
                      onClick={() => openBuilder(deck)}
                      className="flex-1 bg-surface-container-low text-on-surface py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Deck
                    </button>
                    <button
                      onClick={() => deleteDeck(deck.id)}
                      className="w-12 h-12 bg-surface-container-low text-on-surface rounded-xl flex items-center justify-center hover:bg-error/10 hover:text-error transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {decks.length === 0 && (
            <div className="md:col-span-2 text-center py-16">
              <Layers className="w-12 h-12 text-outline/30 mx-auto mb-4" />
              <p className="text-on-surface-variant font-medium text-lg mb-2">No decks yet</p>
              <p className="text-on-surface-variant text-sm mb-6">Create a deck to organize your cards for play.</p>
              <button
                onClick={createDeck}
                className="luminous-forge text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-3 shadow-lg shadow-primary/25"
              >
                <PlusCircle className="w-5 h-5" /> Create Your First Deck
              </button>
            </div>
          )}

          <button
            onClick={createDeck}
            className="bg-surface-container-low border-4 border-dashed border-outline-variant/30 rounded-3xl flex flex-col items-center justify-center p-12 text-center group hover:bg-surface-container-lowest hover:border-primary/30 transition-all min-h-[320px]"
          >
            <div className="w-16 h-16 rounded-full bg-surface-container-lowest flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <PlusCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-on-surface">New Deck</h3>
            <p className="text-sm text-on-surface-variant">Start from scratch</p>
          </button>
        </main>
      ) : (
        <main className="space-y-8">
          <h2 className="text-2xl font-bold text-on-surface">
            Tap a card to {activeDeck ? 'add or remove it' : 'select it'}
          </h2>
          {allCards.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-on-surface-variant font-medium mb-4">You don't have any cards yet.</p>
              <Link to="/studio" className="luminous-forge text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-3 shadow-lg shadow-primary/25">
                <PlusCircle className="w-5 h-5" /> Create Cards First
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
              {allCards.map((card) => {
                const inDeck = activeDeck?.cardIds.includes(card.id) ?? false;
                const frame = getFrame(card.frameId);
                return (
                  <button
                    key={card.id}
                    onClick={() => toggleCardInDeck(card.id)}
                    className={`relative rounded-2xl overflow-hidden shadow-md transition-all text-left ${
                      inDeck ? 'ring-3 ring-primary shadow-primary/20 scale-[1.02]' : 'hover:shadow-lg'
                    }`}
                  >
                    <div className="relative" style={{ aspectRatio: '500/670' }}>
                      {card.imageDataUrl ? (
                        <img src={card.imageDataUrl} alt={card.name} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-surface-container-high" />
                      )}
                      <img src={frame?.src ?? '/frames/frame_classic_01.png'} alt="" className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none" />
                      {inDeck && (
                        <div className="absolute inset-0 z-20 bg-primary/20 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-surface-container-lowest">
                      <h3 className="text-sm font-extrabold tracking-tight text-on-surface truncate">{card.name}</h3>
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase">{card.type}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
