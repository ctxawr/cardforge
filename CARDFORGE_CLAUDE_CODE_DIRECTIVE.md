# CardForge — Claude Code Directive
# Node: node01-windows | Role: claude_code_windows | 2026-03-24

You are **claude_code_windows** on **node01-windows**.
Orchestrator: **infrastructure_P0** on ctxos (192.168.1.36).
Execute all steps sequentially and autonomously.
Report completion to P0 via `send_coord_message` when done.

---

## CONTEXT

CardForge is a React 19 + TypeScript + Vite 6 + Tailwind CSS v4 TCG card creator.
Design system: Luminous Forge (primary `#7d12ff`, surface `#fbf8ff`, Plus Jakarta Sans).
Repo: `https://github.com/ctxawr/cardforge`
Local clone target: `C:\Users\blitz\Projects\cardforge`

The full source has been committed locally by the cowork_windows panel.
Your job is to: push the commit, verify the build, and implement the P1 features.

---

## STEP 1 — PUSH TO GITHUB

From PowerShell in `C:\Users\blitz\Projects\cardforge` (or wherever you clone it):

```powershell
# If the repo isn't cloned yet, get it from the local source first:
# (cowork_windows has the committed source — copy it or use the backup below)

cd C:\Users\blitz\Projects\cardforge
git remote set-url origin https://github.com/ctxawr/cardforge.git
git push -u origin main
```

If the remote already has content:
```powershell
git push -u origin main --force
```

---

## STEP 2 — VERIFY BUILD

```powershell
cd C:\Users\blitz\Projects\cardforge
npm install
npx tsc --noEmit        # Must show 0 errors
npm run build           # Must complete successfully
npm run dev             # Dev server at http://localhost:3000
```

Expected: Vite builds 2094+ modules, 0 TypeScript errors.

---

## STEP 3 — IMPLEMENT P1 FEATURES (priority order)

### P1-A: Card Persistence (IndexedDB)

File: `src/hooks/useCardStorage.ts` (create new)

```typescript
// v1.0 — ctxAWR: IndexedDB persistence for saved cards; avoids 5MB localStorage limit
// Purpose: Save/load/delete CardData objects across sessions
// Context: Cards have large base64 image fields; IndexedDB handles binary data natively

import { openDB } from 'idb';
import type { CardData } from '../types/card';

const DB_NAME = 'cardforge';
const STORE = 'cards';
const VERSION = 1;

async function getDB() {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    },
  });
}

export async function saveCard(card: CardData): Promise<void> {
  const db = await getDB();
  await db.put(STORE, card);
}

export async function loadCards(): Promise<CardData[]> {
  const db = await getDB();
  return db.getAll(STORE);
}

export async function deleteCard(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE, id);
}
```

Install dependency: `npm install idb`

File: `src/types/card.ts` (create new)

```typescript
// v1.0 — ctxAWR: Shared CardData type used across Studio, Gallery, Decks
export interface CardData {
  id: string;           // nanoid — e.g. "v3k2p9x"
  name: string;
  hp: number;
  type: string;         // Fire | Water | Grass | Electric | Psychic | Normal
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare';
  frameId: string;      // e.g. "classic_01"
  imageDataUrl: string; // base64 data URL of uploaded art
  description: string;
  attack1: { name: string; damage: number; description: string };
  attack2?: { name: string; damage: number; description: string };
  createdAt: number;    // Date.now()
}
```

Wire up in `Studio.tsx`: on "Save Card" button click, call `saveCard(cardData)` with a `nanoid()` id.
Install: `npm install nanoid`

---

### P1-B: Export to PNG

File: `src/hooks/useCardExport.ts` (create new)

```typescript
// v1.0 — ctxAWR: html2canvas capture of .card-preview element at 744x1040px
// Purpose: Export card at print resolution (300dpi equivalent for 63.5x88.9mm)
// Fix rationale: taintedCanvasError if art is local blob URL — use allowTaint:true

import html2canvas from 'html2canvas';

export async function exportCardToPng(elementId: string, cardName: string): Promise<void> {
  const el = document.getElementById(elementId);
  if (!el) throw new Error('Card preview element not found');

  const canvas = await html2canvas(el, {
    width: 744,
    height: 1040,
    scale: 744 / el.offsetWidth,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
  });

  const link = document.createElement('a');
  link.download = `${cardName.replace(/\s+/g, '_')}_card.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
```

Install: `npm install html2canvas`
Add `id="card-preview"` to the card preview `<div>` in `Studio.tsx`.
Add "Export PNG" button in Studio step 3 that calls `exportCardToPng('card-preview', cardName)`.

---

### P1-C: Text Overlay Editor

In `Card.tsx`, add editable overlay fields at the correct card zones:
- Card name: top band (y ≈ 2–10% of card height) — 18px bold Plus Jakarta Sans
- HP: top-right corner — 14px, color matches rarity
- Type icon + label: below name, left-aligned
- Description / flavor text: lower band (y ≈ 60–78%) — 10px, italic, 3-line max
- Attack 1 & 2: middle band (y ≈ 54–68%) — 12px

Use `contentEditable` divs with `onBlur` to bubble changes up via props or a callback.
All text layers stay at z-index 20, positioned absolutely using percentage-based `top/left`.

---

### P1-D: Gallery Wiring

In `Gallery.tsx`:
- On mount, call `loadCards()` from `useCardStorage` and render saved cards
- Each card tile: show `Card` component at 60% scale + card name + delete button
- Delete button calls `deleteCard(id)` then refreshes list

---

## STEP 4 — HOLO FOIL EFFECT (P4 polish, low effort)

In `Card.tsx`, add a conditional overlay div for holo frames (frameId starts with `holo_`):

```tsx
// v1.2 — ctxAWR: Holo foil shimmer via CSS conic-gradient + color-dodge blend
{isHolo && (
  <div
    className="absolute inset-0 z-15 pointer-events-none opacity-30 mix-blend-color-dodge"
    style={{
      background: 'conic-gradient(from var(--holo-angle, 0deg), #ff006620, #ffff0020, #00ff0020, #00ffff20, #0000ff20, #ff006620)',
      animation: 'holo-rotate 4s linear infinite',
    }}
    aria-hidden
  />
)}
```

Add to `src/index.css`:
```css
@keyframes holo-rotate {
  to { --holo-angle: 360deg; }
}
@property --holo-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
```

---

## STEP 5 — REPORT TO P0

Once all steps complete, send:

```
POST http://192.168.1.36:5557/sse
→ send_coord_message
  from: claude_code_windows
  to: infrastructure_P0
  message: "CardForge v1.3 complete. Pushed to ctxawr/cardforge main.
            P1-A card persistence (IndexedDB+idb), P1-B PNG export (html2canvas),
            P1-C text overlay editor, P1-D gallery wiring all implemented.
            Holo foil CSS animation added. Build: 0 TS errors. Dev: localhost:3000."
```

---

## CODING STANDARDS (enforce on every file touched)

- Tailwind v4 only — no `tailwind.config.js`, no hardcoded hex colors in JSX
- All colors via CSS custom properties: `bg-primary`, `text-on-surface`, etc.
- ctxAWR comment on every new function: purpose, fix rationale, LLM context
- Version bump in file header comment on every edit (`// v1.3`)
- TypeScript strict — no `any`, explicit return types on all exported functions
- Components max 200 lines — extract sub-components when exceeded
- No Azure Pulse / blue references anywhere — Luminous Forge only
