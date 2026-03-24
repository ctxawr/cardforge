/* frames.ts — CardForge frame template manifest v1.0 */
/* ctxAWR: 58 AI-generated card frames, processed magenta→transparent, 500×670px */

export interface FrameTemplate {
  id: string;
  label: string;
  style: 'classic' | 'nature' | 'shadow' | 'holo' | 'gold' | 'forge';
  src: string;       // path under /public/frames/
  thumbnail: string; // same file — rendered small in picker
}

export interface FrameStyle {
  id: string;
  label: string;
  icon: string;  // emoji for quick UI indicator
  color: string; // Tailwind text color for active state
  bg: string;    // Tailwind bg for picker chip
  frames: FrameTemplate[];
}

// ── Generate frame arrays ──────────────────────────────────────────────────

function makeFrames(
  style: FrameTemplate['style'],
  count: number,
  labels: string[]
): FrameTemplate[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${style}_${String(i + 1).padStart(2, '0')}`,
    label: labels[i] ?? `${style.charAt(0).toUpperCase() + style.slice(1)} ${i + 1}`,
    style,
    src: `/frames/frame_${style}_${String(i + 1).padStart(2, '0')}.png`,
    thumbnail: `/frames/frame_${style}_${String(i + 1).padStart(2, '0')}.png`,
  }));
}

// ── Classic (10 frames) ────────────────────────────────────────────────────
const classicFrames = makeFrames('classic', 10, [
  'Silver Standard', 'Pewter Clean', 'Ember Fire', 'Ember Dark',
  'Ember Alt', 'Tide Water', 'Tide Deep', 'Tide Wave',
  'Classic VIII', 'Classic X',
]);

// ── Nature (14 frames) ────────────────────────────────────────────────────
const natureFrames = makeFrames('nature', 14, [
  'Canopy Forest', 'Canopy Vine', 'Arc Electric', 'Arc Circuit',
  'Arc Shock', 'Canopy Bark', 'Canopy Moss', 'Canopy Root',
  'Arc Gold', 'Canopy Fern', 'Nature XI', 'Nature XII',
  'Nature XIII', 'Nature XIV',
]);

// ── Shadow (13 frames) ────────────────────────────────────────────────────
const shadowFrames = makeFrames('shadow', 13, [
  'Abyss Void', 'Abyss Crystal', 'Revenant Ghost', 'Revenant Rune',
  'Cinder Dark', 'Abyss Deep', 'Revenant Alt', 'Cinder Ash',
  'Abyss Rift', 'Shadow X', 'Shadow XI', 'Shadow XII',
  'Shadow XIII',
]);

// ── Holo (13 frames) ──────────────────────────────────────────────────────
const holoFrames = makeFrames('holo', 13, [
  'Prism Rainbow', 'Prism Spectrum', 'Nebula Galaxy', 'Nebula Cosmic',
  'Quartz Crystal', 'Prism Alt', 'Nebula Deep', 'Quartz Ice',
  'Holo IX', 'Holo X', 'Holo XI', 'Holo XII',
  'Holo XIII',
]);

// ── Gold (6 frames) ───────────────────────────────────────────────────────
const goldFrames = makeFrames('gold', 6, [
  'Royal Gold', 'Royal Baroque', 'Relic Bronze', 'Relic Ancient',
  'Relic Worn', 'Gold VI',
]);

// ── Forge (2 frames) ──────────────────────────────────────────────────────
const forgeFrames = makeFrames('forge', 2, [
  'Rose Gold Deco', 'Forge Platinum',
]);

// ── Style groups ──────────────────────────────────────────────────────────

export const FRAME_STYLES: FrameStyle[] = [
  {
    id: 'classic',
    label: 'Classic',
    icon: '⚔️',
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    frames: classicFrames,
  },
  {
    id: 'nature',
    label: 'Nature',
    icon: '🌿',
    color: 'text-green-700',
    bg: 'bg-green-50',
    frames: natureFrames,
  },
  {
    id: 'shadow',
    label: 'Shadow',
    icon: '💀',
    color: 'text-purple-900',
    bg: 'bg-purple-50',
    frames: shadowFrames,
  },
  {
    id: 'holo',
    label: 'Holo',
    icon: '✨',
    color: 'text-primary',
    bg: 'bg-primary/10',
    frames: holoFrames,
  },
  {
    id: 'gold',
    label: 'Gold',
    icon: '👑',
    color: 'text-yellow-700',
    bg: 'bg-yellow-50',
    frames: goldFrames,
  },
  {
    id: 'forge',
    label: 'Forge',
    icon: '🔥',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    frames: forgeFrames,
  },
];

// ── Flat lookup helpers ───────────────────────────────────────────────────

export const ALL_FRAMES: FrameTemplate[] = FRAME_STYLES.flatMap(s => s.frames);

export function getFrame(id: string): FrameTemplate | undefined {
  return ALL_FRAMES.find(f => f.id === id);
}

export const DEFAULT_FRAME_ID = 'classic_01';
