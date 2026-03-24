// v1.0 — ctxAWR: Gemini AI integration for card stat/description generation
// Purpose: Generate card name, stats, description from a text prompt using Gemini API
// Context: Uses @google/genai SDK, API key injected via GEMINI_API_KEY env var at build time
import { GoogleGenAI } from '@google/genai';
import type { CardData } from '../types/card';

const CARD_TYPES = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Normal'] as const;
const RARITIES = ['common', 'uncommon', 'rare', 'ultra-rare'] as const;

interface GeneratedCard {
  name: string;
  hp: number;
  type: CardData['type'];
  rarity: CardData['rarity'];
  description: string;
  attack1: { name: string; damage: number; description: string };
  attack2: { name: string; damage: number; description: string };
}

function getApiKey(): string | null {
  try {
    return (process.env.GEMINI_API_KEY as string) || null;
  } catch {
    return null;
  }
}

export function isGeminiAvailable(): boolean {
  return !!getApiKey();
}

export async function generateCardStats(prompt: string): Promise<GeneratedCard> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Gemini API key not configured');

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `You are a Pokemon/TCG card designer for kids. Given the following creature description, generate card stats as JSON.

Description: ${prompt}

Respond with ONLY valid JSON matching this schema (no markdown fences):
{
  "name": "string (creative creature name, kid-friendly, max 20 chars)",
  "hp": number (30-300, in increments of 10),
  "type": "Fire" | "Water" | "Grass" | "Electric" | "Psychic" | "Normal",
  "rarity": "common" | "uncommon" | "rare" | "ultra-rare",
  "description": "string (flavor text, 1-2 sentences, fun and kid-friendly)",
  "attack1": { "name": "string", "damage": number (10-120), "description": "string (short effect text)" },
  "attack2": { "name": "string", "damage": number (20-200), "description": "string (short effect text)" }
}`,
  });

  const text = response.text?.trim() ?? '';
  const cleaned = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  const parsed = JSON.parse(cleaned);

  return {
    name: String(parsed.name ?? 'Mystery Creature').slice(0, 20),
    hp: Math.max(30, Math.min(300, Number(parsed.hp) || 100)),
    type: CARD_TYPES.includes(parsed.type) ? parsed.type : 'Normal',
    rarity: RARITIES.includes(parsed.rarity) ? parsed.rarity : 'common',
    description: String(parsed.description ?? '').slice(0, 200),
    attack1: {
      name: String(parsed.attack1?.name ?? 'Strike').slice(0, 20),
      damage: Math.max(10, Math.min(200, Number(parsed.attack1?.damage) || 30)),
      description: String(parsed.attack1?.description ?? '').slice(0, 100),
    },
    attack2: {
      name: String(parsed.attack2?.name ?? 'Power Move').slice(0, 20),
      damage: Math.max(10, Math.min(200, Number(parsed.attack2?.damage) || 60)),
      description: String(parsed.attack2?.description ?? '').slice(0, 100),
    },
  };
}
