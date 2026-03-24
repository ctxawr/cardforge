/* useGeminiAI.ts — Luminous Forge v1.5 */
/* ctxAWR: Two-step AI pipeline:
   1. Analyze reference photo → auto-prefill card stats (name, type, powers, attacks)
   2. Generate stylized character art from reference via Gemini 2.5 Flash Image (Nano Banana)
   The uploaded photo is NEVER used on the card — only as a reference for generation. */
import { GoogleGenAI } from '@google/genai';
import type { CardData } from '../types/card';

const CARD_TYPES = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Normal'] as const;
const RARITIES = ['common', 'uncommon', 'rare', 'ultra-rare'] as const;

export interface GeneratedStats {
  name: string;
  hp: number;
  type: CardData['type'];
  rarity: CardData['rarity'];
  description: string;
  attack1: { name: string; damage: number; description: string };
  attack2: { name: string; damage: number; description: string };
  subjectDescription: string;
  suggestedCreature: string;
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

function parseBase64(dataUrl: string): { mimeType: string; data: string } {
  const mimeType = dataUrl.match(/^data:(image\/\w+);/)?.[1] ?? 'image/png';
  const data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
  return { mimeType, data };
}

function sanitizeStats(parsed: Record<string, any>): GeneratedStats {
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
    subjectDescription: String(parsed.subjectDescription ?? '').slice(0, 300),
    suggestedCreature: String(parsed.suggestedCreature ?? 'mystical creature').slice(0, 50),
  };
}

/* Step 1: Analyze reference photo → extract subject, suggest card stats
   Uses gemini-2.0-flash (fast, text-only response) */
export async function analyzeReferenceImage(imageDataUrl: string): Promise<GeneratedStats> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Gemini API key not configured');

  const ai = new GoogleGenAI({ apiKey });
  const { mimeType, data } = parseBase64(imageDataUrl);

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { mimeType, data } },
          { text: `You are a Pokemon/TCG card designer for kids. Analyze this reference photo and create card stats based on the subject.

Look at who or what is in the photo. Describe the subject, then imagine them as a fun trading card character merged with a cool creature.

Respond with ONLY valid JSON (no markdown fences):
{
  "subjectDescription": "string (describe what you see in the photo — person, pet, object, etc.)",
  "suggestedCreature": "string (what animal/creature/element to merge them with — e.g. 'fire dragon', 'ice wolf', 'thunder hawk')",
  "name": "string (creative character name inspired by the subject, kid-friendly, max 20 chars)",
  "hp": number (30-300, increments of 10),
  "type": "Fire" | "Water" | "Grass" | "Electric" | "Psychic" | "Normal",
  "rarity": "common" | "uncommon" | "rare" | "ultra-rare",
  "description": "string (flavor text, 1-2 sentences, fun and kid-friendly)",
  "attack1": { "name": "string", "damage": number (10-120), "description": "string (short effect)" },
  "attack2": { "name": "string", "damage": number (20-200), "description": "string (short effect)" }
}` },
        ],
      },
    ],
  });

  const text = response.text?.trim() ?? '';
  const cleaned = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  return sanitizeStats(JSON.parse(cleaned));
}

/* Step 2: Generate stylized character art from reference photo
   Uses Gemini 2.5 Flash Image (Nano Banana) for image-to-image generation
   Falls back to gemini-2.0-flash-preview-image-generation if needed */
export async function generateCardArt(
  referenceImageDataUrl: string,
  stats: GeneratedStats,
  userCreatureOverride?: string,
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Gemini API key not configured');

  const ai = new GoogleGenAI({ apiKey });
  const { mimeType, data } = parseBase64(referenceImageDataUrl);

  const creature = userCreatureOverride?.trim() || stats.suggestedCreature;

  const prompt = `Transform this reference photo into a stylized anime/cartoon trading card illustration for a kids' card game.

IMPORTANT RULES:
- Do NOT use the photo directly — create a NEW illustrated character INSPIRED by the subject
- Merge the subject with a ${creature} — they should look like a fun hybrid character
- Style: vibrant anime/cartoon, colorful, dynamic pose, energy effects
- Background: dramatic with magical/elemental energy matching "${stats.type}" type
- Full body character, centered, facing forward or in action pose
- Kid-friendly, fun, epic — like a Pokemon VMAX card illustration
- Portrait orientation (5:7 ratio)
- High detail, vivid colors, professional card game quality

Character name: ${stats.name}
Element type: ${stats.type}`;

  const models = [
    'gemini-2.5-flash-preview-image-generation',
    'gemini-2.0-flash-preview-image-generation',
  ];

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType, data } },
              { text: prompt },
            ],
          },
        ],
        config: {
          responseModalities: ['IMAGE'],
        },
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            const outMime = part.inlineData.mimeType ?? 'image/png';
            return `data:${outMime};base64,${part.inlineData.data}`;
          }
        }
      }
    } catch (err) {
      console.warn(`Image gen with ${model} failed, trying next:`, err);
      continue;
    }
  }

  throw new Error('Image generation failed. Try a different photo or check your API key.');
}

/* Legacy: text-only stat generation (no reference image) */
export async function generateCardStats(prompt: string): Promise<GeneratedStats> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Gemini API key not configured');

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `You are a Pokemon/TCG card designer for kids. Given this description, generate card stats as JSON.

Description: ${prompt}

Respond with ONLY valid JSON (no markdown fences):
{
  "subjectDescription": "${prompt}",
  "suggestedCreature": "string (creature type)",
  "name": "string (creative creature name, kid-friendly, max 20 chars)",
  "hp": number (30-300, in increments of 10),
  "type": "Fire" | "Water" | "Grass" | "Electric" | "Psychic" | "Normal",
  "rarity": "common" | "uncommon" | "rare" | "ultra-rare",
  "description": "string (flavor text, 1-2 sentences, fun and kid-friendly)",
  "attack1": { "name": "string", "damage": number (10-120), "description": "string" },
  "attack2": { "name": "string", "damage": number (20-200), "description": "string" }
}`,
  });

  const text = response.text?.trim() ?? '';
  const cleaned = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  return sanitizeStats(JSON.parse(cleaned));
}
