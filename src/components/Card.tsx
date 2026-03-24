/* Card.tsx — Luminous Forge v1.7 — VMAX card with integrated TCG-style graphics */
/* ctxAWR: Modeled after real VMAX Electric cards — energy orbs, large damage circles,
   attack descriptions, divider lines, weakness/resistance bar. Full graphical integration. */
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

/* Energy orb — small type-colored circle like TCG energy symbols */
function EnergyOrb({ type, size = 'sm' }: { type: CardData['type']; size?: 'sm' | 'md' }) {
  const theme = TYPE_COLORS[type] || TYPE_COLORS.Normal;
  const dim = size === 'md' ? 'w-4 h-4 text-[8px]' : 'w-3 h-3 text-[6px]';
  return (
    <span className={`${dim} ${theme.energy} rounded-full inline-flex items-center justify-center text-white font-black shrink-0 shadow-sm`}>
      {TYPE_EMOJI[type]}
    </span>
  );
}

/* Damage circle — large type-colored circle with damage number */
function DamageCircle({ damage, type }: { damage: number; type: CardData['type'] }) {
  const theme = TYPE_COLORS[type] || TYPE_COLORS.Normal;
  return (
    <div className={`w-8 h-8 ${theme.energy} rounded-full flex items-center justify-center shrink-0 shadow-md ${theme.glow}`}>
      <span className="text-white font-black text-[11px] drop-shadow-sm">{damage}</span>
    </div>
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
            {/* ── TOP BAR: Name + HP (VMAX style) ── */}
            <div className="absolute top-0 left-0 right-0 z-20">
              <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 flex justify-between items-center border-b-2" style={{ borderColor: typeTheme.accent }}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <EnergyOrb type={card.type} size="md" />
                  <p className={`text-white font-black ${compact ? 'text-[10px]' : 'text-[13px]'} tracking-tight truncate drop-shadow-md`}>
                    {card.name || 'Card Name'}
                  </p>
                  {isUltraRare && (
                    <span className="vmax-holo text-[7px] font-black px-1.5 py-0.5 rounded text-white uppercase tracking-wider shrink-0">VMAX</span>
                  )}
                </div>
                <div className="flex items-baseline gap-0.5 shrink-0">
                  <span className={`font-black ${compact ? 'text-[11px]' : 'text-xl'} drop-shadow-md`} style={{ color: typeTheme.accent }}>{card.hp}</span>
                  <span className="text-white/60 text-[7px] font-bold">HP</span>
                </div>
              </div>
              {/* Sub-badges */}
              {!compact && (
                <div className="flex justify-between px-2 mt-0.5">
                  <span className={`${typeTheme.bg} text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm`}>
                    {card.type}
                  </span>
                  {!isUltraRare && (
                    <span className="bg-black/60 text-white/80 text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest capitalize">
                      {card.rarity}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* ── BOTTOM PANEL: Attacks, description, weakness bar (VMAX TCG layout) ── */}
            {!compact && (
              <div className="absolute bottom-0 left-0 right-0 z-20">
                {/* Gradient fade */}
                <div className="h-12 bg-gradient-to-t from-black/95 via-black/70 to-transparent" />

                {/* Info panel */}
                <div className="bg-black/90 backdrop-blur-sm">
                  {/* Attacks */}
                  <div className="px-3 pt-1 pb-1.5 space-y-1">
                    {/* Attack 1 */}
                    {card.attack1?.name && (
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <EnergyOrb type={card.type} />
                          <EnergyOrb type={card.type} />
                          <span className="text-white text-[11px] font-extrabold flex-1 truncate tracking-tight">{card.attack1.name}</span>
                          <DamageCircle damage={card.attack1.damage} type={card.type} />
                        </div>
                        {card.attack1.description && (
                          <p className="text-white/40 text-[7px] leading-tight pl-[26px]">{card.attack1.description}</p>
                        )}
                      </div>
                    )}

                    {/* Divider between attacks */}
                    {card.attack1?.name && card.attack2?.name && (
                      <div className="flex items-center gap-2 py-0.5">
                        <div className="flex-1 h-px bg-white/10" />
                        <EnergyOrb type={card.type} />
                        <div className="flex-1 h-px bg-white/10" />
                      </div>
                    )}

                    {/* Attack 2 */}
                    {card.attack2?.name && (
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <EnergyOrb type={card.type} />
                          <EnergyOrb type={card.type} />
                          <EnergyOrb type={card.type} />
                          <span className="text-white text-[11px] font-extrabold flex-1 truncate tracking-tight">{card.attack2.name}</span>
                          <DamageCircle damage={card.attack2.damage} type={card.type} />
                        </div>
                        {card.attack2.description && (
                          <p className="text-white/40 text-[7px] leading-tight pl-[35px]">{card.attack2.description}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Flavor text */}
                  {card.description && (
                    <div className="px-3 pb-1.5">
                      <p className="text-white/30 text-[7px] italic line-clamp-2 leading-relaxed border-t border-white/5 pt-1">{card.description}</p>
                    </div>
                  )}

                  {/* Weakness / Resistance / Retreat bar — VMAX style footer */}
                  <div className="flex items-center justify-between px-3 py-1 border-t-2" style={{ borderColor: typeTheme.accent + '40' }}>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-white/30 text-[6px] font-bold uppercase">Weakness</span>
                        <span className="bg-red-600/80 text-white text-[6px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">2x</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-white/30 text-[6px] font-bold uppercase">Resist</span>
                        <span className="bg-green-600/60 text-white text-[6px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">-30</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-white/30 text-[6px] font-bold uppercase">Retreat</span>
                      <EnergyOrb type="Normal" />
                      <EnergyOrb type="Normal" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Compact: type-colored name strip */}
            {compact && (
              <div className="absolute bottom-0 left-0 right-0 z-20">
                <div className="bg-black/80 backdrop-blur-sm px-2 py-1.5 border-t" style={{ borderColor: typeTheme.accent + '60' }}>
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
