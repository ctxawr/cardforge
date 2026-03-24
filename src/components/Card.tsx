/* Card.tsx — Luminous Forge v1.4 — VMAX full-bleed card */
/* ctxAWR: Full-bleed art fills entire card, holographic CSS border, text overlays on art. Replaces frame-window approach. */
import { motion } from 'motion/react';
import type { CardData } from '../types/card';

interface VmaxCardProps {
  card: CardData;
  compact?: boolean;
  showOverlays?: boolean;
  className?: string;
}

const TYPE_COLORS: Record<CardData['type'], string> = {
  Fire: 'from-red-600/80 to-orange-500/60',
  Water: 'from-blue-600/80 to-cyan-400/60',
  Grass: 'from-green-600/80 to-emerald-400/60',
  Electric: 'from-yellow-500/80 to-amber-400/60',
  Psychic: 'from-purple-600/80 to-fuchsia-400/60',
  Normal: 'from-gray-600/80 to-slate-400/60',
};

const RARITY_BORDERS: Record<CardData['rarity'], string> = {
  'common': 'from-gray-400 via-gray-300 to-gray-400',
  'uncommon': 'from-emerald-400 via-teal-300 to-emerald-400',
  'rare': 'from-amber-400 via-yellow-300 to-amber-400',
  'ultra-rare': '',
};

export default function VmaxCard({ card, compact = false, showOverlays = true, className = '' }: VmaxCardProps) {
  const isUltraRare = card.rarity === 'ultra-rare';
  const borderGradient = isUltraRare ? '' : RARITY_BORDERS[card.rarity];
  const typeGradient = TYPE_COLORS[card.type] || TYPE_COLORS.Normal;

  return (
    <motion.div
      whileHover={compact ? undefined : { y: -8 }}
      className={`group relative ${className}`}
    >
      {/* Holographic border — animated for ultra-rare, static gradient for others */}
      <div className={`absolute -inset-[3px] rounded-[1.25rem] ${isUltraRare ? 'vmax-holo' : `bg-gradient-to-br ${borderGradient}`} opacity-80 group-hover:opacity-100 transition-opacity`} />

      {/* Card body */}
      <div className="relative rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '500/700' }}>
        {/* Full-bleed art */}
        {card.imageDataUrl ? (
          <img
            src={card.imageDataUrl}
            alt={card.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-surface-container" />
        )}

        {showOverlays && (
          <>
            {/* Top bar: name + HP */}
            <div className="absolute top-0 left-0 right-0 z-20 p-3 flex justify-between items-start">
              <div className="bg-black/50 backdrop-blur-md rounded-full px-3 py-1 max-w-[70%]">
                <p className={`text-white font-black ${compact ? 'text-xs' : 'text-sm'} tracking-tight truncate`}>
                  {card.name || 'Card Name'}
                </p>
              </div>
              <div className="bg-black/50 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1">
                <span className={`text-white font-black ${compact ? 'text-xs' : 'text-sm'}`}>{card.hp}</span>
                <span className="text-white/70 text-[9px] font-bold">HP</span>
              </div>
            </div>

            {/* Rarity badge */}
            <div className={`absolute top-12 right-3 z-20 ${isUltraRare ? 'vmax-holo text-white' : 'bg-black/50 backdrop-blur-md text-white'} text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest`}>
              {card.rarity === 'ultra-rare' ? 'VMAX' : card.rarity}
            </div>

            {/* Type badge */}
            <div className={`absolute top-12 left-3 z-20 bg-gradient-to-r ${typeGradient} backdrop-blur-md text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest`}>
              {card.type}
            </div>

            {/* Bottom overlay: attacks + description */}
            {!compact && (
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 pb-3 px-3 space-y-1.5">
                {card.attack1?.name && (
                  <div className="flex justify-between items-center">
                    <span className="text-white text-xs font-bold">{card.attack1.name}</span>
                    <span className="text-white/90 text-xs font-black">{card.attack1.damage}</span>
                  </div>
                )}
                {card.attack2?.name && (
                  <div className="flex justify-between items-center">
                    <span className="text-white text-xs font-bold">{card.attack2.name}</span>
                    <span className="text-white/90 text-xs font-black">{card.attack2.damage}</span>
                  </div>
                )}
                {card.description && (
                  <p className="text-white/60 text-[9px] italic line-clamp-2 pt-1">{card.description}</p>
                )}
              </div>
            )}

            {/* Compact: just name strip at bottom */}
            {compact && (
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-white text-[10px] font-bold truncate">{card.name}</p>
              </div>
            )}
          </>
        )}

        {/* Holographic sheen overlay for ultra-rare */}
        {isUltraRare && (
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/10 via-transparent to-white/5 mix-blend-overlay pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
}

/* Export for backward compat — pages that import CardProps */
export type { VmaxCardProps as CardProps };
