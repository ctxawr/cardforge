/* Card.tsx — Luminous Forge v1.8 — VMAX full-bleed, art visible everywhere */
/* ctxAWR: Modeled after real VMAX cards (see Voltamother sample). Art fills entire card.
   Attacks are thin translucent strips overlaid on art — NO heavy black panel.
   Name/HP top bar is minimal. Bottom info is compact translucent rows. */
import { motion } from 'motion/react';
import type { CardData } from '../types/card';

interface VmaxCardProps {
  card: CardData;
  compact?: boolean;
  showOverlays?: boolean;
  className?: string;
}

const TYPE_COLORS: Record<CardData['type'], { gradient: string; bg: string; accent: string; glow: string; energy: string }> = {
  Fire:     { gradient: 'from-red-600 to-orange-500',     bg: 'bg-red-600',     accent: '#ef4444', glow: 'shadow-red-500/40',    energy: 'bg-gradient-to-br from-red-500 to-orange-400' },
  Water:    { gradient: 'from-blue-600 to-cyan-400',      bg: 'bg-blue-600',    accent: '#3b82f6', glow: 'shadow-blue-500/40',   energy: 'bg-gradient-to-br from-blue-500 to-cyan-400' },
  Grass:    { gradient: 'from-green-600 to-emerald-400',  bg: 'bg-green-600',   accent: '#22c55e', glow: 'shadow-green-500/40',  energy: 'bg-gradient-to-br from-green-500 to-emerald-400' },
  Electric: { gradient: 'from-yellow-500 to-amber-400',   bg: 'bg-yellow-500',  accent: '#eab308', glow: 'shadow-yellow-500/40', energy: 'bg-gradient-to-br from-yellow-400 to-amber-300' },
  Psychic:  { gradient: 'from-purple-600 to-fuchsia-400', bg: 'bg-purple-600',  accent: '#a855f7', glow: 'shadow-purple-500/40', energy: 'bg-gradient-to-br from-purple-500 to-fuchsia-400' },
  Normal:   { gradient: 'from-gray-600 to-slate-400',     bg: 'bg-gray-600',    accent: '#6b7280', glow: 'shadow-gray-500/40',   energy: 'bg-gradient-to-br from-gray-400 to-slate-300' },
};

const TYPE_EMOJI: Record<CardData['type'], string> = {
  Fire: '\uD83D\uDD25', Water: '\uD83D\uDCA7', Grass: '\uD83C\uDF3F',
  Electric: '\u26A1', Psychic: '\uD83D\uDD2E', Normal: '\u2B50',
};

const RARITY_BORDERS: Record<CardData['rarity'], string> = {
  'common': 'from-gray-400 via-gray-300 to-gray-400',
  'uncommon': 'from-emerald-400 via-teal-300 to-emerald-400',
  'rare': 'from-amber-400 via-yellow-300 to-amber-400',
  'ultra-rare': '',
};

function EnergyOrb({ type, size = 'sm' }: { type: CardData['type']; size?: 'sm' | 'md' }) {
  const theme = TYPE_COLORS[type] || TYPE_COLORS.Normal;
  const dim = size === 'md' ? 'w-4 h-4 text-[8px]' : 'w-3 h-3 text-[6px]';
  return (
    <span className={`${dim} ${theme.energy} rounded-full inline-flex items-center justify-center text-white font-black shrink-0 shadow-sm`}>
      {TYPE_EMOJI[type]}
    </span>
  );
}

export default function VmaxCard({ card, compact = false, showOverlays = true, className = '' }: VmaxCardProps) {
  const isUltraRare = card.rarity === 'ultra-rare';
  const borderGradient = isUltraRare ? '' : RARITY_BORDERS[card.rarity];
  const typeTheme = TYPE_COLORS[card.type] || TYPE_COLORS.Normal;

  return (
    <motion.div
      whileHover={compact ? undefined : { y: -8 }}
      className={`group relative ${className}`}
    >
      {/* Holographic border */}
      <div className={`absolute -inset-[3px] rounded-[1.25rem] ${isUltraRare ? 'vmax-holo' : `bg-gradient-to-br ${borderGradient}`} opacity-80 group-hover:opacity-100 transition-opacity`} />

      {/* Card body */}
      <div className="relative rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '500/700' }}>
        {/* Full-bleed art — fills entire card */}
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
            {/* ── TOP: Name + VMAX tag + HP ── */}
            <div className="absolute top-0 left-0 right-0 z-20 px-2.5 pt-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1 min-w-0">
                  <span className={`text-white font-black ${compact ? 'text-[10px]' : 'text-[13px]'} drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] truncate`}>
                    {card.name || 'Card Name'}
                  </span>
                  {isUltraRare && (
                    <span className="text-[8px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wide shrink-0">
                      V<span className="text-[6px]">MAX</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-white/60 text-[8px] font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">HP</span>
                  <span className={`font-black ${compact ? 'text-[12px]' : 'text-lg'} drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]`} style={{ color: typeTheme.accent }}>
                    {card.hp}
                  </span>
                  <EnergyOrb type={card.type} size="md" />
                </div>
              </div>
              {/* Sub-line: evolution text + type badge */}
              {!compact && (
                <div className="flex justify-between items-center mt-0.5">
                  <span className="text-white/50 text-[7px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    Evolves from {card.name} V
                  </span>
                  <span className={`${typeTheme.bg} text-white text-[6px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm`}>
                    {card.rarity === 'ultra-rare' ? 'Gigantamax' : card.type}
                  </span>
                </div>
              )}
            </div>

            {/* ── BOTTOM: Attacks as translucent strips over the art ── */}
            {!compact && (
              <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col">
                {/* Attack rows — translucent strips, art visible behind */}
                <div className="px-2.5 space-y-1 mb-1">
                  {/* Attack 1 */}
                  {card.attack1?.name && (
                    <div className="bg-black/30 backdrop-blur-[2px] rounded-lg px-2 py-1.5">
                      <div className="flex items-center gap-1">
                        <EnergyOrb type={card.type} />
                        <EnergyOrb type={card.type} />
                        <span className="text-white text-[11px] font-extrabold flex-1 truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ml-1">{card.attack1.name}</span>
                        <span className="text-white text-[13px] font-black drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] ml-2">{card.attack1.damage}+</span>
                      </div>
                      {card.attack1.description && (
                        <p className="text-white/60 text-[7px] mt-0.5 leading-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] pl-[22px]">{card.attack1.description}</p>
                      )}
                    </div>
                  )}

                  {/* Attack 2 */}
                  {card.attack2?.name && (
                    <div className="bg-black/30 backdrop-blur-[2px] rounded-lg px-2 py-1.5">
                      <div className="flex items-center gap-1">
                        <EnergyOrb type={card.type} />
                        <EnergyOrb type={card.type} />
                        <EnergyOrb type={card.type} />
                        <span className="text-white text-[11px] font-extrabold flex-1 truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ml-1">{card.attack2.name}</span>
                        <span className="text-white text-[13px] font-black drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] ml-2">{card.attack2.damage}</span>
                      </div>
                      {card.attack2.description && (
                        <p className="text-white/60 text-[7px] mt-0.5 leading-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] pl-[31px]">{card.attack2.description}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Weakness / Resistance / Retreat — thin bottom bar */}
                <div className="bg-black/40 backdrop-blur-[2px] flex items-center justify-between px-2.5 py-1">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      <span className="text-white/40 text-[6px] font-bold">weakness</span>
                      <EnergyOrb type={card.type === 'Electric' ? 'Grass' : card.type === 'Fire' ? 'Water' : card.type === 'Water' ? 'Electric' : card.type === 'Grass' ? 'Fire' : 'Normal'} />
                    </div>
                    <div className="flex items-center gap-0.5">
                      <span className="text-white/40 text-[6px] font-bold">resistance</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <span className="text-white/40 text-[6px] font-bold">retreat</span>
                      <EnergyOrb type="Normal" />
                      <EnergyOrb type="Normal" />
                    </div>
                  </div>
                </div>

                {/* VMAX rule + rarity footer */}
                <div className="bg-black/50 flex items-center justify-between px-2.5 py-1 rounded-b-2xl">
                  <p className="text-white/30 text-[6px] italic line-clamp-1 flex-1">
                    {card.description || (isUltraRare ? 'VMAX rule: When your Pokemon VMAX is Knocked Out, your opponent takes 3 Prize cards.' : '')}
                  </p>
                  <span className="text-[6px] font-black uppercase tracking-widest shrink-0 ml-2 drop-shadow-sm" style={{ color: typeTheme.accent }}>
                    {card.rarity === 'ultra-rare' ? 'RAINBOW RARE' : card.rarity?.toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {/* Compact: minimal name at bottom */}
            {compact && (
              <div className="absolute bottom-0 left-0 right-0 z-20">
                <div className="bg-black/30 backdrop-blur-[2px] px-2 py-1.5 rounded-b-2xl">
                  <p className="text-white text-[9px] font-bold truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{card.name}</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Holographic sheen for ultra-rare */}
        {isUltraRare && (
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/10 via-transparent to-white/5 mix-blend-overlay pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
}

export type { VmaxCardProps as CardProps };
