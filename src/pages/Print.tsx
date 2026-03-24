/* Print.tsx — Luminous Forge v1.1 */
/* ctxAWR: azure-pulse → luminous-forge, "Azure Pulse" copy → "Luminous Forge", blue-200 → primary-container, shadow-blue → shadow-primary */
import {
  Printer,
  Filter,
  ArrowUpDown,
  X,
  CheckCircle2,
  Plus,
  FileText,
  Maximize2,
  Sparkles,
  Scissors,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';

const selectedCards = [
  { id: 1, name: 'Void Sovereign', rarity: 'Ultra Rare', pos: 'A1', image: 'https://picsum.photos/seed/dragon/800/1000', main: true },
  { id: 2, name: 'Neon Vanguard', rarity: 'Rare', stats: 'Attack: 4500 | HP: 3200', image: 'https://picsum.photos/seed/vanguard/600/800' },
  { id: 3, name: 'Titan Core', rarity: 'Epic', stats: 'Attack: 8900 | HP: 12000', image: 'https://picsum.photos/seed/titan/600/800' },
  { id: 4, name: 'Void Spire', rarity: 'Rare', stats: 'Support | Mana Cost: 4', image: 'https://picsum.photos/seed/spire/600/800' },
  { id: 5, name: 'Logic Gate', rarity: 'Common', stats: 'Trap | Instant Effect', image: 'https://picsum.photos/seed/logic/600/800' },
];

export default function Print() {
  return (
    <div className="py-12 pb-32">
      <header className="relative mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Ready for Production</span>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-on-surface mb-6">Print Station</h1>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-lg">
              Transform your digital masterpieces into physical artifacts. Our precision printing layout ensures every detail of your Luminous Forge collection is preserved.
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-full p-2 pr-8 shadow-lg flex items-center gap-4 border border-outline-variant/20">
            <div className="w-16 h-16 rounded-full luminous-forge flex items-center justify-center text-white font-black text-xl">5/8</div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Sheet Capacity</p>
              <p className="font-bold text-on-surface">Cards Selected</p>
            </div>
          </div>
        </div>
      </header>

      <section className="mb-12 flex flex-wrap items-center justify-between gap-6 p-6 bg-surface-container-low rounded-4xl">
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-full bg-surface-container-lowest text-on-surface font-semibold text-sm shadow-sm flex items-center gap-2 hover:bg-surface-container transition-all border border-outline-variant/20">
            <Filter className="w-4 h-4 text-primary" />
            All Types
          </button>
          <button className="px-6 py-3 rounded-full bg-surface-container-lowest text-on-surface font-semibold text-sm shadow-sm flex items-center gap-2 hover:bg-surface-container transition-all border border-outline-variant/20">
            <ArrowUpDown className="w-4 h-4 text-primary" />
            Newest First
          </button>
        </div>
        <button className="luminous-forge text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 shadow-xl shadow-primary/25 hover:scale-105 transition-transform">
          <Printer className="w-6 h-6" />
          Generate Print Sheet
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
        {selectedCards.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.02 }}
            className={`${card.main ? 'lg:col-span-2 lg:row-span-2' : ''} relative group overflow-hidden rounded-5xl bg-surface-container-lowest shadow-xl transition-all`}
          >
            <div className={`${card.main ? 'aspect-[4/5]' : 'aspect-[3/4] p-4'} relative`}>
              <img
                src={card.image}
                alt={card.name}
                className={`w-full h-full object-cover ${card.main ? '' : 'rounded-3xl'}`}
                referrerPolicy="no-referrer"
              />
              {card.main && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>}

              <div className="absolute top-6 right-6">
                <span className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  {card.rarity}
                </span>
              </div>

              {card.main ? (
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-4xl font-black text-white mb-2 tracking-tighter">{card.name}</h3>
                  <p className="text-primary-container font-medium">Sheet Position: {card.pos}</p>
                </div>
              ) : (
                <div className="absolute top-8 left-8">
                  <CheckCircle2 className="w-8 h-8 text-primary fill-white" />
                </div>
              )}
            </div>

            {!card.main && (
              <div className="px-6 pb-6">
                <h4 className="font-bold text-xl mb-1">{card.name}</h4>
                <p className="text-on-surface-variant text-sm font-bold uppercase tracking-tighter">{card.stats}</p>
              </div>
            )}

            <button className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-error transition-colors">
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        ))}

        <div className="bg-surface-container-high rounded-5xl border-4 border-dashed border-outline-variant/30 flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:bg-surface-container transition-colors">
          <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <p className="font-bold text-on-surface">Add Card</p>
          <p className="text-on-surface-variant text-sm">3 slots remaining</p>
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-[3rem] p-12 relative overflow-hidden shadow-sm border border-outline-variant/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/8 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3">
            <h2 className="text-4xl font-extrabold tracking-tight mb-6">Parent's Guide to Printing</h2>
            <p className="text-on-surface-variant mb-8 leading-relaxed">
              We've designed CardForge to be as high-quality on paper as it is on screen. Here's how to get the best results for your child's collection.
            </p>
            <div className="bg-surface-container-low p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span className="font-bold">Eco-Safe Standards</span>
              </div>
              <p className="text-sm text-on-surface-variant">Our layouts are optimized to minimize ink waste while maintaining vibrant Luminous Forge colors.</p>
            </div>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Paper Weight', desc: 'Use 250gsm – 300gsm cardstock for that authentic trading card "snap" and durability.', icon: FileText },
              { title: 'Standard Sizing', desc: 'Each card prints at exactly 63.5 × 88.9 mm — the official TCG standard, fitting all protector sleeves.', icon: Maximize2 },
              { title: 'Finish Options', desc: 'A semi-gloss or satin finish best captures the glow effects of Luminous Forge purple.', icon: Sparkles },
              { title: 'Cutting Guides', desc: 'Our PDFs include subtle 0.5pt crop marks to ensure straight, professional cuts every time.', icon: Scissors },
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
