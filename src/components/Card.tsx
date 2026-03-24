/* Card.tsx — Luminous Forge v1.2 — frame overlay support */
/* ctxAWR: Added frameId prop + frame PNG overlay rendering. Art shows through transparent window. */
import { motion } from 'motion/react';
import { Shield, Zap, Flame, Heart, MoreVertical } from 'lucide-react';
import * as React from 'react';
import { getFrame, DEFAULT_FRAME_ID } from '../data/frames';

export interface CardProps {
  key?: React.Key;
  id: string | number;
  name: string;
  rarity: string;
  image: string;
  level?: number;
  attack?: string | number;
  defense?: string | number;
  mana?: string | number;
  status?: string;
  color?: string;
  showStats?: boolean;
  compact?: boolean;
  frameId?: string;
}

export default function Card({
  name, rarity, image, level, attack, defense, mana,
  status, compact = false, frameId = DEFAULT_FRAME_ID
}: CardProps) {
  const frame = getFrame(frameId);
  const frameSrc = frame?.src ?? '/frames/frame_classic_01.png';

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`group relative flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-primary/15 transition-all ${compact ? 'max-w-[220px]' : ''}`}
    >
      {/* Card art area with frame overlay */}
      <div className="relative" style={{ aspectRatio: '500/670' }}>
        {/* Layer 1: card art */}
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Layer 2: frame overlay (transparent window reveals art) */}
        <img
          src={frameSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
          draggable={false}
        />
        {/* Layer 3: rarity badge */}
        <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-tighter">
          {rarity}
        </div>
      </div>

      {/* Info strip */}
      <div className={compact ? 'p-3' : 'p-5'}>
        <div className="flex justify-between items-start mb-1.5">
          <h3 className={`${compact ? 'text-sm' : 'text-lg'} font-extrabold tracking-tight text-on-surface truncate`}>
            {name}
          </h3>
          {level && <span className="text-primary font-bold text-[9px] uppercase tracking-widest shrink-0 ml-2">LVL {level}</span>}
        </div>

        {!compact && (
          <div className="flex gap-3 mb-3">
            {attack !== undefined && (
              <div className="flex flex-col">
                <span className="text-[8px] uppercase tracking-widest text-outline font-bold flex items-center gap-0.5"><Flame className="w-2 h-2"/>ATK</span>
                <span className="text-base font-black text-on-surface">{attack}</span>
              </div>
            )}
            {defense !== undefined && (
              <div className="flex flex-col">
                <span className="text-[8px] uppercase tracking-widest text-outline font-bold flex items-center gap-0.5"><Shield className="w-2 h-2"/>DEF</span>
                <span className="text-base font-black text-on-surface">{defense}</span>
              </div>
            )}
            {mana !== undefined && (
              <div className="flex flex-col">
                <span className="text-[8px] uppercase tracking-widest text-outline font-bold flex items-center gap-0.5"><Zap className="w-2 h-2"/>MANA</span>
                <span className="text-base font-black text-on-surface">{mana}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-surface-container pt-2">
          <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
            status === 'Final Build' ? 'bg-secondary/10 text-secondary' : 'bg-surface-container text-on-surface-variant'
          }`}>
            {status || rarity}
          </span>
          <div className="flex gap-1.5">
            <button className="text-outline hover:text-primary transition-colors"><Heart className="w-3.5 h-3.5"/></button>
            <button className="text-outline hover:text-primary transition-colors"><MoreVertical className="w-3.5 h-3.5"/></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
