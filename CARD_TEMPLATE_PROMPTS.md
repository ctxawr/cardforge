# CardForge — Card Template Image Generation Prompts
# v1.0 — 2026-03-24

---

## Official Trading Card Specifications

### Physical Dimensions
| Property         | Value                         |
|-----------------|-------------------------------|
| Width            | 63.5 mm / 2.5 in              |
| Height           | 88.9 mm / 3.5 in              |
| Aspect ratio     | **5 : 7** (width : height)    |
| Corner radius    | 3–4 mm                        |
| Border thickness | 2–3 mm typical                |

### Canonical Pixel Dimensions for Generation
| Use case              | Pixels            | Note                           |
|----------------------|-------------------|--------------------------------|
| High-res master      | **744 × 1040**    | ~300 DPI for physical print    |
| Web / preview        | **500 × 700**     | Exact 5:7 ratio                |
| Thumbnail            | **250 × 350**     | 5:7 ratio, half-web            |

**Always generate at 744 × 1040 px (5:7 aspect ratio, portrait orientation).**

### Card Layout Zones (top → bottom, % of height)
```
┌──────────────────────────────┐  0%
│  [NAME BANNER]               │  0–11%   (type icon top-right)
├──────────────────────────────┤  11%
│                              │
│       [ ART WINDOW ]         │  11–54%  (41% of height — TRANSPARENT in PNGs)
│                              │
├──────────────────────────────┤  54%
│  [ELEMENT / HP BAR]          │  54–62%
├──────────────────────────────┤  62%
│  [ABILITIES / ATTACK AREA]   │  62–82%
├──────────────────────────────┤  82%
│  [WEAKNESS / RESISTANCE]     │  82–90%
├──────────────────────────────┤  90%
│  [SET / RARITY / LEGAL]      │  90–100%
└──────────────────────────────┘  100%
```

### Implementation Note
Templates are generated as **PNG with transparent art window**.
Rendering stack in React:
1. Bottom: AI-generated card art (full-bleed, CSS `object-fit: cover`)
2. Middle: frame template PNG (transparent center window, opaque border/UI)
3. Top: CSS text overlay (name, HP, stats, rarity)

---

## BASE PROMPT TEMPLATE (include in every prompt)

```
Trading card frame template, 5:7 portrait aspect ratio (744x1040 pixels),
in the style of premium collectible card games. The center art window
(approx 41% of card height, starting ~11% from top) is filled with solid
magenta (#FF00FF) as a transparent placeholder — DO NOT render artwork there.
Rounded corners (3mm radius). No card text — decorative frame elements only.
Highly detailed, vector-sharp borders, professional TCG print quality.
White or transparent background outside card edges.
```

---

## FRAME STYLE 1: CLASSIC

> Clean, traditional TCG framing. Inspired by first-gen Pokemon aesthetics —
> structured layout, element type clearly communicated through color and iconography.
> Illustration-style border details, matte finish.

---

### CLASSIC-A: Ember (Fire Type)

**Primary palette:** Crimson #C62828, Amber #FF6F00, Warm ivory #FFF8E1
**Accent:** Gold foil trim

```
Trading card frame template, 5:7 portrait aspect ratio (744x1040 pixels),
in the style of premium collectible card games. The center art window
(approx 41% of card height, starting 11% from top) is filled with solid
magenta (#FF00FF) as a transparent placeholder. Rounded corners 3mm.
No card text. Decorative frame elements only.

STYLE: Classic fire-type TCG frame. Name banner at top with warm crimson
(#C62828) background and burnished gold (#FFD700) border trim. Flame motifs
etched into the corners — subtle bas-relief style, not cartoonish. Border
uses a layered double-line design: outer edge deep charcoal, inner edge
amber (#FF6F00). Bottom stats panel: ivory (#FFF8E1) with light ember texture.
Faint smoke wisps trail along left/right edges. Corner ornaments: stylized
fire rune symbols. Overall: premium, matte-finish, collector quality.
Illustration-sharp detail. Dark red/amber/gold palette throughout.
```

---

### CLASSIC-B: Tide (Water Type)

**Primary palette:** Deep teal #006064, Ocean blue #0277BD, Pearl white #E0F7FA
**Accent:** Silver shimmer trim

```
Trading card frame template, 5:7 portrait aspect ratio (744x1040 pixels),
in the style of premium collectible card games. The center art window
(approx 41% of card height, starting 11% from top) is filled with solid
magenta (#FF00FF) as a transparent placeholder. Rounded corners 3mm.
No card text. Decorative frame elements only.

STYLE: Classic water-type TCG frame. Name banner: deep ocean teal (#006064)
with silver wave-line trim. Border design: layered concentric frames with
pearl iridescence — outer edge midnight navy, inner edge seafoam white.
Corner ornaments: stylized wave curl motifs, nautical compass rose elements.
Bottom stats panel: cool pearl (#E0F7FA) with subtle ripple watermark pattern.
Left/right edges: vertical wave reliefs, like carved driftwood. Faint
bioluminescent dots scattered in the frame gutters. Palette: deep teal,
ocean blue, silver, pearl. Matte finish with metallic silver accents.
Classic, structured, collector-quality TCG frame.
```

---

### CLASSIC-C: Canopy (Nature/Grass Type)

**Primary palette:** Forest green #2E7D32, Sage #81C784, Bark brown #5D4037
**Accent:** Copper foil

```
Trading card frame template, 5:7 portrait aspect ratio (744x1040 pixels),
in the style of premium collectible card games. The center art window
(approx 41% of card height, starting 11% from top) is filled with solid
magenta (#FF00FF) as a transparent placeholder. Rounded corners 3mm.
No card text. Decorative frame elements only.

STYLE: Classic nature/grass-type TCG frame. Name banner: rich forest green
(#2E7D32) with copper vine-scroll trim. Border: organic double-frame with
woven branch texture — outer edge dark bark brown (#5D4037), inner edge
leafy sage (#81C784). Corner ornaments: curling fern fronds and acorn
medallions. Bottom stats panel: warm parchment with moss-stain watermark.
Thin copper leaf-chain separates stats sections. Frame gutter: vertical
carved wood grain texture. Atmosphere: ancient forest, druidic runes barely
visible in darker areas. Palette: deep green, sage, brown, copper.
Illustration-sharp, premium matte finish.
```

---

### CLASSIC-D: Arc (Electric/Lightning Type)

**Primary palette:** Electric yellow #F9A825, Deep navy #0D1B2A, White #FFFFFF
**Accent:** Chrome silver

```
Trading card frame template, 5:7 portrait aspect ratio (744x1040 pixels),
in the style of premium collectible card games. The center art window
(approx 41% of card height, starting 11% from top) is filled with solid
magenta (#FF00FF) as a transparent placeholder. Rounded corners 3mm.
No card text. Decorative frame elements only.

STYLE: Classic electric-type TCG frame. Name banner: deep navy (#0D1B2A)
with electric yellow (#F9A825) lightning-bolt border trim. Border: precision
geometric double-frame — outer edge chrome silver, inner edge bright yellow.
Corner ornaments: stylized lightning rune medallions, circuit-trace micro
patterns. Bottom stats panel: dark navy with yellow circuit-line grid overlay.
Frame gutter: vertical static-discharge texture, subtle spark arcs. Thin
chrome separator bars between zones. Palette: electric yellow, deep navy,
chrome, white. Sharp, high-contrast, premium collector finish. No blurriness.
```

---

## FRAME STYLE 2: SHADOW

> Dark, atmospheric framing. High contrast, dramatic. Suited for legendary,
> rare, and antagonist-type cards. Deep blacks, purple-tinted shadows,
> ominous embellishments.

---

### SHADOW-A: Abyss (Void / Dark Type)

**Primary palette:** Near-black #0A0A0F, Deep violet #1A0030, Pale lavender #BBA7CC
**Accent:** Dim silver

```
Trading card frame template, 5:7 portrait aspect ratio (744x1040 pixels),
in the style of premium collectible card games. The center art window
(approx 41% of card height, starting 11% from top) is filled with solid
magenta (#FF00FF) as a transparent placeholder. Rounded corners 3mm.
No card text. Decorative frame elements only.

STYLE: Shadow/void-type dark TCG frame. Overwhelmingly dark palette.
Name banner: near-black (#0A0A0F) with deep violet (#1A0030) glow rim.
Border: thick shadowed double-frame, outer edge pure black with subtle
emboss, inner edge dim lavender (#BBA7CC). Corner ornaments: fractured
obsidian shards, cracked void-crystal spires. Cracks in the border
glow faintly violet at their centers. Bottom stats panel: very dark
purple-black with faint hex-rune pattern barely visible. Frame gutter:
falling shadow-smoke effect, wisps rising upward from bottom corners.
Atmosphere: dimensional rift, cosmic void. Palette: near-black, deep
violet, dim lavender, muted silver. Dramatic, oppressive, premium dark finish.
```

---

### SHADOW-B: Revenant (Ghost / Spirit Type)

**Primary palette:** Slate #1C1C28, Spectral teal #00695C, Bone white #F5F5F0
**Accent:** Ghostly pale green glow

```
Trading card frame template, 5:7 portrait aspect ratio (744x1040 pixels),
in the style of premium collectible card games. The center art window
(approx 41% of card height, starting 11% from top) is filled with solid
magenta (#FF00FF) as a transparent placeholder. Rounded corners 3mm.
No card text. Decorative frame elements only.

STYLE: Shadow/ghost-type TCG frame. Haunted, ethereal atmosphere.
Name banner: deep slate (#1C1C28) with semi-transparent ghostly tendrils
curling along the top edge. Border: translucent-looking layered frame —
outer edge dark charcoal with faint ectoplasm drip texture, inner edge
bone white (#F5F5F0). Spectral teal (#00695C) micro-glow traces the
inner border seam. Corner ornaments: phantom skull medallions with empty
eye sockets that glow faint green. Bottom stats panel: stone-gray with
scratched rune engravings. Frame gutter: faint floating orb particles.
Wisps of ectoplasm curl at mid-frame sides. Atmosphere: haunted manor,
liminal space. Palette: dark slate, spectral teal, bone, pale green.
```

---

### SHADOW-C: Cinder (Dark Fire / Inferno Type)

**Primary palette:** Ash black #1A1005, Blood orange #BF360C, Molten gold #FF8F00
**Accent:** Ember glow

```
Trading card frame template, 5:7 portrait aspect ratio (744x1040 pixels),
in the style of premium collectible card games. The center art window
(approx 41% of card height, starting 11% from top) is filled with solid
magenta (#FF00FF) as a transparent placeholder. Rounded corners 3mm.
No card text. Decorative frame elements only.

STYLE: Shadow dark-fire TCG frame. Smoldering, post-apocalyptic aesthetic.
Name banner: ash black (#1A1005) with cracked-magma rim — glowing cracks
seep blood orange (#BF360C) light. Border: heavily textured charred-wood
and iron double-frame. Outer edge: blackened scorched iron with heat
warping. Inner edge: dim ember-orange glow tracing. Corner ornaments:
melted dragon-claw grips clutching the card corners. Dripping ember
beads at bottom corners. Bottom stats panel: dark ash with ember-vein
cracks. Frame gutter: rising heat-shimmer lines, glowing cinders floating
upward. Palette: ash black, blood orange, molten gold, burnt umber.
Intense, dramatic, collector-quality dark finish.
```

---

## FRAME STYLE 3: HOLO

> Holographic / prismatic shimmer frames. Iridescent, light-reactive feeling.
> Rainbow prismatic effects, diffraction patterns, gemstone aesthetics.
> The "chase card" premium tier.

---

### HOLO-A: Prism (Rainbow Holographic)

**Primary palette:** Pure white base with rainbow prismatic overlay
**Accent:** All spectral colors

```
Trading card frame template, 5:7 portrait aspect ratio (744x1040 pixels),
in the style of premium collectible card games. The center art window
(approx 41% of card height, starting 11% from top) is filled with solid
magenta (#FF00FF) as a transparent placeholder. Rounded corners 3mm.
No card text. Decorative frame elements only.

STYLE: Holographic prism TCG frame — the iconic "holo rare" look.
White/silver base frame with full prismatic rainbow diffraction overlay
across all border surfaces. Name banner: silver metallic with rainbow
prismatic sheen. Border: multi-layer metallic frame with interference
colors — visible spectral bands (red→violet) sweeping diagonally across
frame surfaces like a diffraction grating. Corner ornaments: prism crystal
pyramids refracting light into spectral fans. Bottom stats panel: matte
silver with light holographic dot-matrix pattern. Frame gutter: fine
rainbow line-scan pattern (like CD surface). Atmosphere: ultra-premium,
light-reactive, collectible. Flat lighting on the design itself —
the rainbow comes from the surface texture, not from a light source.
Palette: silver, white, all spectral colors simultaneously.
```

---

### HOLO-B: Nebula (Galaxy / Cosmic)

**Primary palette:** Deep space #050510, Nebula purple #6A0DAD, Stardust silver
**Accent:** Gold star-point sparkles

```
Trading card frame template, 5:7 portrait aspect ratio (744x1040 pixels),
in the style of premium collectible card games. The center art window
(approx 41% of card height, starting 11% from top) is filled with solid
magenta (#FF00FF) as a transparent placeholder. Rounded corners 3mm.
No card text. Decorative frame elements only.

STYLE: Holographic galaxy/nebula TCG frame. Cosmic, deep-space aesthetic.
Name banner: deep space black with nebula-purple aurora gradient. Border:
dark galactic frame with embedded star-field texture — micro white dots
(stars) distributed across border surfaces. Subtle nebula clouds of purple
and magenta swirl in the gutter areas. Corner ornaments: four-pointed
gold starburst medallions. Inner border edge: thin gold line with aurora
teal-violet shimmer. Bottom stats panel: dark space with constellation
dot-connect lines barely visible. Holographic foil sections: scattered
2×2mm square foil "windows" that would catch light if printed. Palette:
deep space black, nebula purple, magenta, stardust silver, gold. Premium
cosmic feel — the "Ultra Rare" of holographic frames.
```

---

### HOLO-C: Quartz (Crystal / Gemstone)

**Primary palette:** Ice white #F8FBFF, Crystal blue #B3E5FC, Facet silver
**Accent:** Prismatic gem facets

```
Trading card frame template, 5:7 portrait aspect ratio (744x1040 pixels),
in the style of premium collectible card games. The center art window
(approx 41% of card height, starting 11% from top) is filled with solid
magenta (#FF00FF) as a transparent placeholder. Rounded corners 3mm.
No card text. Decorative frame elements only.

STYLE: Holographic crystal/quartz TCG frame. Geometric, gem-facet aesthetic.
Name banner: ice white (#F8FBFF) with silver and light-blue prismatic
crystal edge. Border: designed to look like the card is framed inside
a quartz crystal — faceted surfaces visible in all frame areas, creating
diamond-cut geometric patterns. Each facet catches light differently
(shown via subtle gradient per facet). Corner ornaments: large crystal
cluster formations growing inward from corners. Inner edge: razor-sharp
crystal facet line. Bottom stats panel: frosted crystal with hexagonal
lattice watermark. Gutter: vertical crystal column ridges. Palette:
ice white, pale crystal blue, silver, soft prismatic rainbow in facets.
Clean, geometric, ultra-premium crystalline finish.
```

---

## FRAME STYLE 4: GOLD

> Premium metallic / luxury frames. Trophy-tier cards. Exudes rarity,
> exclusivity, achievement. Gold leaf, rose gold, ancient/archaeological aesthetics.

---

### GOLD-A: Royal (Classic Gold Leaf)

**Primary palette:** Rich gold #C6932A, Deep maroon #880E4F, Cream #FFF9C4
**Accent:** Embossed gold relief

```
Trading card frame template, 5:7 portrait aspect ratio (744x1040 pixels),
in the style of premium collectible card games. The center art window
(approx 41% of card height, starting 11% from top) is filled with solid
magenta (#FF00FF) as a transparent placeholder. Rounded corners 3mm.
No card text. Decorative frame elements only.

STYLE: Royal gold leaf TCG frame. Baroque, monarchy aesthetic — the
"legendary" tier. Name banner: deep maroon (#880E4F) with burnished gold
relief scrollwork border. Frame: heavy triple-border — outermost edge:
raised gold bead-and-reel molding. Middle: maroon recessed panel.
Inner: polished gold leaf flat panel. Corner ornaments: ornate fleur-de-lis
medallions in 24k gold finish with maroon enamel fill. Heraldic shield
motif at top-center of name banner. Bottom stats panel: cream (#FFF9C4)
with gold filigree dividers. Frame gutter: acanthus leaf scroll relief
pattern. Tiny gold rosette rivets at border intersections. Overall:
museum-quality, like a medieval illuminated manuscript frame.
Palette: burnished gold, deep maroon, ivory cream. Maximum luxury.
```

---

### GOLD-B: Forge (Rose Gold / Modern Luxury)

**Primary palette:** Rose gold #B76E79, Champagne #F7E7CE, Slate #2C3E50
**Accent:** Platinum highlights

```
Trading card frame template, 5:7 portrait aspect ratio (744x1040 pixels),
in the style of premium collectible card games. The center art window
(approx 41% of card height, starting 11% from top) is filled with solid
magenta (#FF00FF) as a transparent placeholder. Rounded corners 3mm.
No card text. Decorative frame elements only.

STYLE: Modern luxury rose gold TCG frame. Contemporary, premium-minimalist.
Name banner: dark slate (#2C3E50) with rose gold (#B76E79) geometric line
trim — clean Art Deco-inspired linework. Border: precision double-frame —
outer edge polished platinum, inner edge brushed rose gold. Minimal
ornamentation — rose gold acts as the visual element, not heavy decoration.
Corner ornaments: geometric rose gold diamond shapes with platinum star
insets. Bottom stats panel: champagne (#F7E7CE) with fine rose gold
grid lines. Frame gutter: brushed horizontal lines texture (like brushed
rose gold metal). Thin platinum separator lines between zones.
Modern, clean, aspirational. Palette: rose gold, platinum, champagne,
dark slate. Premium feel without baroque excess.
```

---

### GOLD-C: Relic (Ancient / Archaeological)

**Primary palette:** Aged bronze #8D6E63, Verdigris #4E6B55, Parchment #F5DEB3
**Accent:** Worn gilt edges

```
Trading card frame template, 5:7 portrait aspect ratio (744x1040 pixels),
in the style of premium collectible card games. The center art window
(approx 41% of card height, starting 11% from top) is filled with solid
magenta (#FF00FF) as a transparent placeholder. Rounded corners 3mm.
No card text. Decorative frame elements only.

STYLE: Ancient relic / archaeological TCG frame. Like a card unearthed
from a lost civilization — aged bronze, verdigris patina, worn hieroglyphs.
Name banner: aged bronze (#8D6E63) with verdigris (#4E6B55) patina
accumulation in recessed areas. Border: thick cast-bronze frame with
relief carvings — hieroglyph symbols, stylized eyes, ankh motifs, scarab
beetles. Patina (green-blue oxidation) visible in all recessed areas.
Worn gilt along raised edges. Corner ornaments: sphinx-head profile
reliefs. Bottom stats panel: aged parchment (#F5DEB3) with papyrus fiber
texture and faded cartouche watermarks. Frame gutter: continuous
hieroglyph band carved in relief. Cracks and wear marks appropriate to
an ancient artifact. Palette: aged bronze, verdigris, worn gold, parchment.
Atmosphere: museum artifact, cursed relic, ancient power.
```

---

## GENERATION PARAMETERS

### Recommended Settings for All Templates
| Parameter        | Value                                    |
|-----------------|------------------------------------------|
| Dimensions       | 744 × 1040 px                           |
| Aspect ratio     | 5:7 (portrait)                          |
| Format           | PNG with transparency                   |
| Output           | 3–4 variations per prompt (seed variety)|
| Art window fill  | Solid magenta #FF00FF (chroma key)      |
| Style guidance   | "vector-sharp edges, no blur, no JPEG artifacts" |
| Negative prompt  | "blurry, low quality, text, words, numbers, faces, characters, anime, photorealistic characters, watermark" |

### Seedream / BytePlus Prompt Tips
- Append: `--ar 5:7 --style raw --q 2`
- Use `--no text, anime, characters, blur` negative prompt
- Seed lock for consistency between variants of same style

### Midjourney / FLUX Tips  
- `--ar 5:7 --style raw --q 2`
- Parameter: `--no text characters watermark blur`

---

## SUMMARY: 13 Templates Total

| Style   | Variant     | Theme                    | Key Colors             |
|---------|-------------|--------------------------|------------------------|
| Classic | Ember       | Fire                     | Crimson, amber, gold   |
| Classic | Tide        | Water                    | Teal, navy, silver     |
| Classic | Canopy      | Nature                   | Forest, sage, copper   |
| Classic | Arc         | Electric                 | Yellow, navy, chrome   |
| Shadow  | Abyss       | Void/Dark                | Near-black, violet     |
| Shadow  | Revenant    | Ghost/Spirit             | Slate, spectral teal   |
| Shadow  | Cinder      | Dark Fire                | Ash, blood orange      |
| Holo    | Prism       | Rainbow holographic      | Silver + all spectral  |
| Holo    | Nebula      | Galaxy/Cosmic            | Space black, purple    |
| Holo    | Quartz      | Crystal/Gem              | Ice white, silver      |
| Gold    | Royal       | Classic gold leaf        | Gold, maroon, cream    |
| Gold    | Forge       | Modern rose gold         | Rose gold, platinum    |
| Gold    | Relic       | Ancient/Archaeological   | Bronze, verdigris      |

