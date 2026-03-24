---
schema_version: 1
scope: directory
node: node01-windows
project: CardForge
panel_role: claude_code_windows
---

# CardForge — Claude Code Implementation Guide

> **For:** `claude_code_windows` on `node01-windows`
> **Orchestrator:** `infrastructure_P0` on ctxos (192.168.1.36)
> **Repo:** `https://github.com/ctxawr/cardforge`
> **Status:** Active development — Luminous Forge v1.2

---

## Project Overview

CardForge is a TCG (Trading Card Game) card creator — React 19 + TypeScript + Vite 6 + Tailwind CSS v4.
Users upload artwork, select a frame overlay from 58 AI-generated templates across 6 style groups, add card metadata, preview in real-time, and export/print at official TCG dimensions.

**Design system:** Luminous Forge — light mode, primary `#7d12ff` (electric purple), Plus Jakarta Sans typeface.

---

## Tech Stack

| Layer | Package | Version |
|-------|---------|---------|
| UI framework | React | 19 |
| Language | TypeScript | 5.x |
| Build tool | Vite | 6.4 |
| Styling | Tailwind CSS v4 | 4.x |
| Animation | motion/react | latest |
| Icons | lucide-react | latest |
| Routing | react-router-dom | 7 |

**Tailwind v4 pattern** — no `tailwind.config.js`. All tokens in `@theme {}` inside `src/index.css`.
Custom utilities use `@utility name { ... }` syntax, not `plugin()`.

---

## Directory Structure

```
CardForge/
├── public/
│   └── frames/                    # 58 processed frame PNGs (500×670px, transparent art window)
│       ├── frame_classic_01-10.png
│       ├── frame_nature_01-14.png
│       ├── frame_shadow_01-13.png
│       ├── frame_holo_01-13.png
│       ├── frame_gold_01-06.png
│       └── frame_forge_01-02.png
├── src/
│   ├── components/
│   │   ├── Card.tsx               # v1.2 — 3-layer render: art | frame PNG | rarity badge
│   │   ├── FramePicker.tsx        # Tabbed style browser + thumbnail grid
│   │   ├── Navbar.tsx             # glass-nav utility, purple hover states
│   │   └── Footer.tsx
│   ├── data/
│   │   └── frames.ts              # Full manifest: 58 frames, 6 FrameStyle groups
│   ├── pages/
│   │   ├── Home.tsx               # Landing — Luminous Forge hero
│   │   ├── Studio.tsx             # v1.2 — card creator wizard with live preview
│   │   ├── Gallery.tsx            # Card collection browser
│   │   ├── Decks.tsx              # Deck management
│   │   └── Print.tsx              # Print prep (63.5×88.9mm / 744×1040px @ 300dpi)
│   ├── index.css                  # v1.2 — Tailwind v4 @theme tokens, @utility classes
│   └── main.tsx
├── index.html                     # Plus Jakarta Sans + Material Symbols via <link>
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Key Design Tokens (src/index.css)

```css
@theme {
  --color-primary: #7d12ff;
  --color-secondary: #7c4dff;
  --color-surface: #fbf8ff;
  --color-on-surface: #1a1b23;
  --color-primary-container: #eedeff;
}

@utility luminous-forge {
  background: linear-gradient(135deg, #7d12ff 0%, #7c4dff 100%);
}
@utility glass-nav {
  background: rgba(251, 248, 255, 0.85);
  backdrop-filter: blur(20px);
}
```

---

## Frame Overlay Architecture

Cards use a **3-layer CSS stack**:

```
Layer 0 (z-0):  <img> — card artwork, full-bleed object-cover
Layer 1 (z-10): <img> — frame PNG (500×670px, art window = transparent alpha)
Layer 2 (z-20): CSS  — rarity badge, text overlays
```

Frame images were AI-generated with a magenta (`#FF00FF`) art window placeholder,
then processed with Python/Pillow: magenta → RGBA transparent (60px tolerance), resized to 500×670px.

**Card aspect ratio:** `style={{ aspectRatio: '500/670' }}` — matches the processed frames.

---

## Frame Data

`src/data/frames.ts` exports:
- `FRAME_STYLES: FrameStyle[]` — 6 style groups with metadata
- `ALL_FRAMES: FrameTemplate[]` — flat array of all 58 frames
- `getFrame(id: string)` — lookup by ID
- `DEFAULT_FRAME_ID = 'classic_01'`

Frame IDs follow the pattern: `{style}_{nn}` e.g. `classic_01`, `nature_07`, `forge_02`.
Frame src paths: `/frames/frame_{id}.png`.

---

## Development

```bash
# Install dependencies
npm install

# Start dev server (port 3000, all interfaces)
npm run dev

# Type check
npx tsc --noEmit

# Production build (delete /dist first if it exists)
npm run build
```

Dev server: `http://localhost:3000`

---

## Pending Features & Work Queue

These are the open tasks — claim via `/work claim <id>` from ctxos:

### P1 — Core Functionality

- [ ] **Card persistence** — LocalStorage or IndexedDB save/load for created cards
- [ ] **Export to PNG/PDF** — `html2canvas` or `dom-to-image` capture of the 3-layer card at print resolution (744×1040)
- [ ] **Text overlay editor** — editable card name, HP, type, description, attacks directly on the card preview
- [ ] **Drag-to-reorder** in Gallery and Deck views

### P2 — Frame & Art Pipeline

- [ ] **Remaining 36 frame assets** — 58 total allocated; verify all 58 are present in `public/frames/`
- [ ] **Frame thumbnail generation** — auto-generate 100×134px thumbnails for FramePicker grid
- [ ] **Custom art upload validation** — enforce min 500×670px, warn on low resolution
- [ ] **Background images integration** — `C:\Users\blitz\Documents\Claude\Projects\CardForge\backgrounds\` has additional art assets to incorporate

### P3 — Backend / Auth

- [ ] **User accounts** — OAuth via Google (credentials in `.env`: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)
- [ ] **Card database** — persist cards to ctxos PostgreSQL (`192.168.1.36:5432`, user: `derek`)
  - Table: `cards(id, user_id, name, hp, type, rarity, frame_id, image_url, metadata jsonb, created_at)`
  - Table: `decks(id, user_id, name, cards jsonb, created_at)`
- [ ] **SECRET_KEY + ANTHROPIC_API_KEY** — add to `.env` (do not commit)
- [ ] **AI card generation** — use Anthropic API to generate card art and suggest card stats from a text prompt

### P4 — Polish

- [ ] **Mobile responsive** — Studio page needs responsive layout for < 768px
- [ ] **Print page** — wire up actual print/export flow (currently placeholder UI)
- [ ] **Deck builder** — drag cards from Gallery into Deck slots, 60-card validation
- [ ] **Holo foil effect** — CSS `conic-gradient` + `mix-blend-mode: color-dodge` on frame layer for holo frames

---

## Environment Variables

Create `.env` in project root (never commit):

```env
VITE_ANTHROPIC_API_KEY=your_key_here
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_GOOGLE_CLIENT_SECRET=your_client_secret
VITE_SECRET_KEY=your_secret_key
VITE_DB_URL=postgresql://derek:password@192.168.1.36:5432/cardforge
```

---

## ctxos Integration

```
MCP SSE:     http://192.168.1.36:5557/sse
RAG API:     http://192.168.1.36:5558
BARS:        http://192.168.1.36:5555
Admin:       http://192.168.1.36:5581  (header: X-API-Key: ctxawr-admin)
PostgreSQL:  192.168.1.36:5432  (user: derek, pgpass configured)
Qdrant:      http://192.168.1.36:6333
```

Report task completion via:
```
POST http://192.168.1.36:5557/sse → send_coord_message
```

---

## Coding Standards

- Tailwind v4 utilities only — no `tailwind.config.js`, no `theme.extend`
- All new color usage via CSS custom properties: `bg-primary`, `text-on-surface`, etc.
- No `azure`, `blue-500`, or Azure Pulse references anywhere — Luminous Forge only
- ctxAWR comments on all new functions: purpose, fix rationale, context for other LLMs
- Version bump in file header comment on every edit (e.g. `// v1.3`)
- Keep components under 200 lines — extract to sub-components when exceeded
- TypeScript strict mode — no `any`, explicit return types on all exported functions
