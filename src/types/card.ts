// v1.0 — ctxAWR: Shared CardData type used across Studio, Gallery, Decks, Print
export interface CardData {
  id: string;
  name: string;
  hp: number;
  type: 'Fire' | 'Water' | 'Grass' | 'Electric' | 'Psychic' | 'Normal';
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare';
  frameId: string;
  imageDataUrl: string;
  description: string;
  attack1: { name: string; damage: number; description: string };
  attack2?: { name: string; damage: number; description: string };
  createdAt: number;
}
