/* useGeminiAI.ts — Luminous Forge v1.4 */
/* ctxAWR: Gemini AI for card stat generation + image transformation (photo → stylized art) */
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

/* v1.4 — ctxAWR: Generate card stats from text prompt */
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

/* v1.4 — ctxAWR: Transform photo into stylized card art via Gemini image generation
   Takes a cropped photo (base64), merges subject with a creature/animal in anime/cartoon style.
   Returns: { imageDataUrl, stats } — both the transformed art and auto-generated card stats */
export interface TransformResult {
  imageDataUrl: string;
  stats: GeneratedCard;
}

export async function transformCardImage(
  imageDataUrl: string,
  userPrompt?: string
): Promise<TransformResult> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Gemini API key not configured');

  const ai = new GoogleGenAI({ apiKey });

  const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
  const mimeType = imageDataUrl.match(/^data:(image\/\w+);/)?.[1] ?? 'image/png';

  const promptText = userPrompt?.trim()
    ? `Transform this photo into a stylized anime/cartoon trading card illustration. The subject should be merged with or transformed into: ${userPrompt}. Make it vibrant, kid-friendly, and epic — like a Pokemon VMAX card. Full body, dynamic pose, colorful energy effects around them. The background should be dramatic with magical/elemental energy.`
    : `Transform this photo into a stylized anime/cartoon trading card illustration. Merge the subject with a cool mystical creature or animal — choose something that matches their vibe. Make it vibrant, kid-friendly, and epic — like a Pokemon VMAX card. Full body, dynamic pose, colorful energy effects around them. The background should be dramatic with magical/elemental energy.`;

  const imageResponse = await ai.models.generateContent({
    model: 'gemini-2.0-flash-preview-image-generation',
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: promptText },
        ],
      },
    ],
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  let transformedImageDataUrl = '';
  let descriptionText = '';

  if (imageResponse.candidates?.[0]?.content?.parts) {
    for (const part of imageResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        const outMime = part.inlineData.mimeType ?? 'image/png';
        transformedImageDataUrl = `data:${outMime};base64,${part.inlineData.data}`;
      }
      if (part.text) {
        descriptionText = part.text;
      }
    }
  }

  if (!transformedImageDataUrl) {
    throw new Error('Image generation did not return an image. Try a different photo or prompt.');
  }

  const stats = await generateCardStats(
    descriptionText || userPrompt || 'a mystical creature with magical powers'
  );

  return { imageDataUrl: transformedImageDataUrl, stats };
}
