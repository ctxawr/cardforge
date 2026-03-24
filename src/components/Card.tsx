/* Card.tsx — Luminous Forge v1.6 — VMAX full-bleed card with integrated graphics */
/* ctxAWR: Graphically integrated text — type-colored bars, styled attack panels, damage badges.
   Not just white text overlay — proper card-game typography with energy-themed accents. */
import { motion } from 'motion/react';
import type { CardData } from '../types/card';

interface VmaxCardProps {
  card: CardData;
  compact?: boolean;
  showOverlays?: boolean;
  className?: string;
}

const TYPE_COLORS: Record<CardData['type'], { gradient: string; bg: string; accent: string; glow: string }> = {
  Fire:     { gradient: 'from-red-600 to-orange-500',     bg: 'bg-red-600/90',     accent: '#ef4444', glow: 'shadow-red-500/40' },
  Water:    { gradient: 'from-blue-600 to-cyan-400',      bg: 'bg-blue-600/90',    accent: '#3b82f6', glow: 'shadow-blue-500/40' },
  Grass:    { gradient: 'from-green-600 to-emerald-400',  bg: 'bg-green-600/90',   accent: '#22c55e', glow: 'shadow-green-500/40' },
  Electric: { gradient: 'from-yellow-500 to-amber-400',   bg: 'bg-yellow-500/90',  accent: '#eab308', glow: 'shadow-yellow-500/40' },
  Psychic:  { gradient: 'from-purple-600 to-fuchsia-400', bg: 'bg-purple-600/90',  accent: '#a855f7', glow: 'shadow-purple-500/40' },
  Normal:   { gradient: 'from-gray-600 to-slate-400',     bg: 'bg-gray-600/90',    accent: '#6b7280', glow: 'shadow-gray-500/40' },
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
  const typeTheme = TYPE_COLORS[card.type] || TYPE_COLORS.Normal;

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
            {/* Top name bar — type-colored gradient strip */}
            <div className="absolute top-0 left-0 right-0 z-20">
              <div className={`bg-gradient-to-r ${typeTheme.gradient} px-3 py-2 flex justify-between items-center`}>
                <p className={`text-white font-black ${compact ? 'text-[10px]' : 'text-sm'} tracking-tight truncate drop-shadow-md max-w-[65%]`}>
                  {card.name || 'Card Name'}
                </p>
                <div className="flex items-center gap-1">
                  <span className={`text-white font-black ${compact ? 'text-[10px]' : 'text-lg'} drop-shadow-md`}>{card.hp}</span>
                  <span className="text-white/80 text-[8px] font-bold">HP</span>
                </div>
              </div>
              {/* Sub-bar: type + rarity badges */}
              <div className="flex justify-between px-2 -mt-0.5">
                <span className={`${typeTheme.bg} text-white text-[7px] font-black px-2 py-0.5 rounded-b-md uppercase tracking-widest shadow-md ${typeTheme.glow}`}>
                  {card.type}
                </span>
                <span className={`${isUltraRare ? 'vmax-holo' : 'bg-black/70'} text-white text-[7px] font-black px-2 py-0.5 rounded-b-md uppercase tracking-widest`}>
                  {card.rarity === 'ultra-rare' ? 'VMAX' : card.rarity}
                </span>
              </div>
            </div>

            {/* Bottom panel: attacks + description — styled card-game info area */}
            {!compact && (
              <div className="absolute bottom-0 left-0 right-0 z-20">
                {/* Gradient fade into info panel */}
                <div className="h-8 bg-gradient-to-t from-black/95 to-transparent" />
                <div className="bg-black/90 backdrop-blur-sm px-3 pb-3 space-y-1.5">
                  {/* Attack 1 */}
                  {card.attack1?.name && (
                    <div className="flex items-center gap-2">
                      <div className={`w-1 h-5 rounded-full bg-gradient-to-b ${typeTheme.gradient} shrink-0`} />
                      <span className="text-white text-[11px] font-bold flex-1 truncate">{card.attack1.name}</span>
                      <span className={`bg-gradient-to-r ${typeTheme.gradient} text-white text-[10px] font-black px-2 py-0.5 rounded-md min-w-[36px] text-center shadow-sm ${typeTheme.glow}`}>
                        {card.attack1.damage}
                      </span>
                    </div>
                  )}
                  {/* Attack 2 */}
                  {card.attack2?.name && (
                    <div className="flex items-center gap-2">
                      <div className={`w-1 h-5 rounded-full bg-gradient-to-b ${typeTheme.gradient} shrink-0`} />
                      <span className="text-white text-[11px] font-bold flex-1 truncate">{card.attack2.name}</span>
                      <span className={`bg-gradient-to-r ${typeTheme.gradient} text-white text-[10px] font-black px-2 py-0.5 rounded-md min-w-[36px] text-center shadow-sm ${typeTheme.glow}`}>
                        {card.attack2.damage}
                      </span>
                    </div>
                  )}
                  {/* Description / flavor text */}
                  {card.description && (
                    <div className="border-t border-white/10 pt-1.5 mt-1">
                      <p className="text-white/50 text-[8px] italic line-clamp-2 leading-relaxed">{card.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Compact: just name strip at bottom */}
            {compact && (
              <div className="absolute bottom-0 left-0 right-0 z-20">
                <div className={`bg-gradient-to-r ${typeTheme.gradient} px-2 py-1.5`}>
                  <p className="text-white text-[9px] font-bold truncate drop-shadow-sm">{card.name}</p>
                </div>
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

export type { VmaxCardProps as CardProps };
