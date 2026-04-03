/* Gallery.tsx — Luminous Forge v1.7 — delete confirmation */
/* ctxAWR: Added inline delete confirmation — prevents accidental card deletion (critical for kids) */
import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Download, Pencil, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loadCards, deleteCard } from '../hooks/useCardStorage';
import { exportCardToPng } from '../hooks/useCardExport';
import VmaxCard from '../components/Card';
import type { CardData } from '../types/card';

export default function Gallery() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadCards().then(c => {
      setCards(c.sort((a, b) => b.createdAt - a.createdAt));
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    await deleteCard(id);
    setCards(prev => prev.filter(c => c.id !== id));
    setConfirmDeleteId(null);
  };

  const handleExport = (card: CardData) => {
    exportCardToPng(card);
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
          {cards.map((card) => (
            <div key={card.id} className="space-y-3">
              <div id={`card-${card.id}`}>
                <VmaxCard card={card} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/studio?edit=${card.id}`)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-on-surface-variant hover:text-primary py-2 rounded-xl bg-surface-container-low hover:bg-primary/10 transition-all"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => handleExport(card)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-on-surface-variant hover:text-primary py-2 rounded-xl bg-surface-container-low hover:bg-primary/10 transition-all"
                >
                  <Download className="w-3 h-3" /> Export
                </button>
                {confirmDeleteId === card.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="flex items-center justify-center gap-1 text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-xl transition-all"
                    >
                      <AlertTriangle className="w-3 h-3" /> Delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-xs font-bold text-on-surface-variant hover:text-on-surface px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(card.id)}
                    className="flex items-center justify-center gap-1 text-xs font-bold text-on-surface-variant hover:text-error px-4 py-2 rounded-xl bg-surface-container-low hover:bg-error/10 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </main>
      )}
    </div>
  );
}
