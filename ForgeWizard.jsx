/**
 * ForgeWizard.jsx v3.0
 * CardForge — 3-step AI trading card wizard
 *
 * Design system: Luminous Forge (vibrant_light) from Stitch project 6986830875527672919
 * Theme: LIGHT mode — white/lavender surfaces, electric purple primary (#7d12ff)
 * Icons: Material Symbols Outlined (no emojis per design rules)
 * Font:  Plus Jakarta Sans
 * Motion: Standard Deceleration cubic-bezier(0.4, 0, 0.2, 1)
 *
 * Design rules enforced:
 *   - No solid borders for sectioning — tonal shifts only
 *   - No dividers inside cards
 *   - No emojis — Material Symbols only
 *   - No pure black — use on-surface (#1a1b23)
 *   - xl (1.5rem) and full rounding — no small radii
 *   - Ambient shadows only — never structural drop shadows
 */

import { useState, useRef, useCallback } from "react";

// ── Quick-action chips ─────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { icon: "fitness_center",  label: "Stronger Stats",    prompt: "Make my character significantly more powerful and increase all stats." },
  { icon: "shuffle",         label: "Different Type",    prompt: "Change the card type to something completely different and update all stats to match." },
  { icon: "auto_awesome",    label: "More Abilities",    prompt: "Give my character 2 more exciting special abilities." },
  { icon: "shield",          label: "More Defense",      prompt: "Add defensive gear and increase defense stats significantly." },
  { icon: "bolt",            label: "Speed Boost",       prompt: "Make the character super fast and add speed-related abilities." },
  { icon: "wizard_hat",      label: "Go Magical",        prompt: "Transform into a magical spellcaster variant with arcane powers." },
];

// ── Card frame styles ──────────────────────────────────────────────────────
const FRAMES = [
  { id: "classic", label: "Classic" },
  { id: "shadow",  label: "Shadow"  },
  { id: "holo",    label: "Holo"    },
  { id: "gold",    label: "Gold"    },
];

// ── Reusable: Material Symbol icon ────────────────────────────────────────
function Icon({ name, className = "", filled = false, size = 24 }) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
        fontSize: size,
        lineHeight: 1,
      }}
    >
      {name}
    </span>
  );
}

// ── Step progress indicator ────────────────────────────────────────────────
function StepBar({ current }) {
  const steps = ["Upload", "Forge", "Art"];
  return (
    <div className="flex items-center gap-3 mb-10">
      {steps.map((label, i) => {
        const n = i + 1;
        const done   = current > n;
        const active = current === n;
        return (
          <div key={n} className="flex items-center gap-3">
            {i > 0 && (
              <div className={`h-px w-8 transition-colors duration-300 ${done ? "bg-primary" : "bg-outline-variant"}`} />
            )}
            <div className="flex items-center gap-2">
              <div className={`
                w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                transition-all duration-300 ease-standard
                ${done   ? "bg-primary text-on-primary shadow-glow-sm"
                : active ? "bg-primary text-on-primary shadow-glow-sm ring-4 ring-primary/20"
                         : "bg-surface-container-highest text-on-surface-variant"}
              `}>
                {done ? <Icon name="check" size={18} /> : n}
              </div>
              <span className={`text-sm font-semibold hidden sm:block ${active ? "text-primary" : "text-on-surface-variant"}`}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Live card preview (right column) ──────────────────────────────────────
function CardPreview({ card, frameId, photoUrl }) {
  const frameRing = {
    classic: "ring-1 ring-outline-variant/20",
    shadow:  "ring-1 ring-outline-variant/20 shadow-[inset_0_0_40px_rgba(0,0,0,0.15)]",
    holo:    "ring-2 ring-primary/40 shadow-glow",
    gold:    "ring-2 ring-[#F59E0B]/60 shadow-[0_0_20px_rgba(245,158,11,0.3)]",
  }[frameId] || "ring-1 ring-outline-variant/20";

  return (
    <div className={`
      relative aspect-[2.5/3.5] w-full max-w-xs mx-auto
      bg-surface-container-lowest rounded-2xl shadow-card p-5
      flex flex-col gap-4 ${frameRing}
      transition-all duration-500 ease-standard
    `}>
      {/* Card header — name + HP */}
      <div className="flex justify-between items-center">
        {card?.name
          ? <span className="text-lg font-extrabold tracking-tight text-on-surface leading-tight">{card.name}</span>
          : <div className="h-6 w-36 bg-surface-container-low rounded-lg animate-pulse" />
        }
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-outline uppercase tracking-widest">HP</span>
          {card?.stats?.HP
            ? <span className="text-sm font-black text-primary">{card.stats.HP}</span>
            : <div className="h-6 w-10 bg-surface-container-low rounded-lg animate-pulse" />
          }
        </div>
      </div>

      {/* Art area */}
      <div className="relative flex-grow rounded-xl bg-surface-container-low overflow-hidden flex items-center justify-center">
        {photoUrl
          ? <img src={photoUrl} alt="Card art" className="w-full h-full object-cover" />
          : (
            <div className="flex flex-col items-center gap-2 text-outline-variant">
              <Icon name="image" size={48} />
              <span className="text-xs font-medium">No Image Selected</span>
            </div>
          )
        }
        {/* Holographic overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
      </div>

      {/* Stats + type */}
      {card ? (
        <div className="space-y-3 pt-1">
          {card.type && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-primary/30" />
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{card.type}</span>
            </div>
          )}
          {card.stats && (
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(card.stats).filter(([k]) => k !== "HP").map(([k, v]) => (
                <span key={k} className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant
                  bg-surface-container-high px-2 py-0.5 rounded-full">
                  {k} {v}
                </span>
              ))}
            </div>
          )}
          {card.special_moves?.length > 0 && (
            <div className="space-y-2">
              {card.special_moves.slice(0, 2).map((move, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-bold text-on-surface">{move}</div>
                    <div className="h-2 w-28 bg-surface-container-low rounded-sm mt-1" />
                  </div>
                  <span className="text-xs font-black text-primary ml-2">20</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2">
            <div className="h-3 h-3 rounded-full bg-primary/20" />
            <div className="h-3 w-20 bg-surface-container-low rounded-md" />
          </div>
          <div className="space-y-2.5">
            {[1, 2].map(n => (
              <div key={n} className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <div className="h-4 w-28 bg-surface-container-high rounded-md" />
                  <div className="h-2.5 w-40 bg-surface-container-low rounded-sm" />
                </div>
                <div className="h-5 w-9 bg-surface-container-high rounded-md" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rarity / footer */}
      <div className="mt-auto flex justify-between items-center pt-1">
        <div className="flex gap-1">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-1.5 w-6 bg-surface-container-low rounded-full" />
          ))}
        </div>
        <Icon name="stars" className={card ? "text-primary" : "text-primary/30"} size={16} filled={!!card} />
      </div>
    </div>
  );
}

// ── Step 1: Upload ─────────────────────────────────────────────────────────
function StepUpload({ onNext }) {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file?.type.startsWith("image/")) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Begin Your Legend</h1>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Upload a photo to start your forging journey. High-quality portraits work best for legendary results.
        </p>
      </div>

      {preview ? (
        <div className="space-y-4">
          <img src={preview} alt="Preview" className="w-full max-h-72 object-cover rounded-2xl shadow-card" />
          <button
            className="w-full py-3 rounded-full text-sm font-semibold text-on-surface-variant
              bg-surface-container-low hover:bg-surface-container transition-colors duration-200"
            onClick={() => { setPhoto(null); setPreview(null); }}
          >
            Choose a different photo
          </button>
        </div>
      ) : (
        <>
          {/* Dashed SVG upload zone */}
          <div
            className={`
              min-h-[360px] flex flex-col items-center justify-center p-12 cursor-pointer
              rounded-3xl transition-colors duration-200 group
              ${dragging ? "bg-surface-container-low" : "bg-surface-container-low/50 hover:bg-surface-container-low"}
            `}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='%23CCC3D8' stroke-width='2' stroke-dasharray='12%2c 12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
            }}
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6
              group-hover:scale-110 transition-transform duration-300 ease-standard">
              <Icon name="cloud_upload" className="text-primary" size={40} filled />
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold text-on-surface">Drag and drop your photo</h3>
              <p className="text-sm text-on-surface-variant">PNG, JPG or WEBP · Max 10MB</p>
              <button
                className="mt-2 px-8 py-3 bg-primary text-on-primary font-bold rounded-full
                  shadow-glow-sm hover:shadow-glow hover:bg-primary-container
                  active:scale-95 transition-all duration-200 ease-standard"
                onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }}
              >
                Choose File
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => handleFile(e.target.files[0])} />
          </div>

          {/* Sample reference photos */}
          <div className="grid grid-cols-3 gap-3">
            {["Portrait girl", "Portrait boy", ""].map((alt, i) => (
              alt ? (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-surface-container-low">
                  <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                    <Icon name="person" className="text-outline-variant" size={40} />
                  </div>
                </div>
              ) : (
                <div key={i} className="aspect-square rounded-xl bg-surface-container-low flex items-center justify-center">
                  <span className="text-xs font-bold text-outline-variant text-center px-3
                    hover:text-primary transition-colors cursor-pointer">
                    See Examples
                  </span>
                </div>
              )
            ))}
          </div>
        </>
      )}

      <button
        disabled={!photo}
        onClick={() => onNext(photo, preview)}
        className={`
          w-full py-4 rounded-full font-bold text-base flex items-center justify-center gap-2
          transition-all duration-200 ease-standard
          ${photo
            ? "bg-primary text-on-primary shadow-glow-sm hover:shadow-glow hover:bg-primary-container active:scale-95"
            : "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
          }
        `}
      >
        <Icon name="bolt" filled className={photo ? "text-on-primary" : "text-on-surface-variant"} />
        Forge My Card
      </button>
    </div>
  );
}

// ── Step 2: Forge ──────────────────────────────────────────────────────────
function StepForge({ photo, onNext }) {
  const [card, setCard] = useState(null);
  const [cardId, setCardId] = useState(null);
  const [frame, setFrame] = useState("classic");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial forge on mount
  useState(() => {
    (async () => {
      try {
        const form = new FormData();
        form.append("photo", photo);
        const res = await fetch("/api/cards/forge", { method: "POST", body: form });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setCard(data.card_data);
        setCardId(data.id);
      } catch (e) {
        setError(`Forge failed: ${e.message}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refine = async (prompt) => {
    if (!prompt.trim() || !cardId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cards/${cardId}/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setCard(data.card_data);
      setInput("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Forge Your Card</h1>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          {loading && !card ? "AI is analysing your photo…" : "Customise with quick actions or your own words."}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-error-container/40 text-on-error-container">
          <Icon name="error_outline" size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {loading && !card ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 rounded-full border-3 border-surface-container-high border-t-primary animate-spin" />
          <span className="text-sm text-on-surface-variant font-medium">Analysing your photo…</span>
        </div>
      ) : (
        <>
          {/* Frame selector */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Card Frame</p>
            <div className="flex gap-2">
              {FRAMES.map(f => (
                <button key={f.id}
                  onClick={() => setFrame(f.id)}
                  className={`
                    flex-1 py-2.5 rounded-full text-sm font-semibold
                    transition-all duration-200 ease-standard
                    ${frame === f.id
                      ? "bg-primary text-on-primary shadow-glow-sm"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"}
                  `}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick action chips */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  onClick={() => refine(a.prompt)}
                  disabled={loading}
                  className="
                    flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold text-left
                    bg-surface-container-low text-on-surface
                    hover:bg-primary/10 hover:text-primary
                    active:scale-95 transition-all duration-200 ease-standard
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <Icon name={a.icon} size={18} className="text-primary shrink-0" />
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Free-text input */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Or describe what you want</p>
            <div className="relative">
              <textarea
                className="
                  w-full bg-surface-container-low rounded-2xl px-4 pt-3 pb-12 text-sm
                  text-on-surface placeholder:text-outline resize-none outline-none
                  border-b-2 border-transparent
                  focus:border-primary focus:bg-surface-container-lowest
                  transition-all duration-200 ease-standard
                "
                rows={2}
                placeholder="e.g. Give me fire powers and a dragon companion!"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); refine(input); }
                }}
              />
              <button
                onClick={() => refine(input)}
                disabled={!input.trim() || loading}
                className="
                  absolute bottom-3 right-3 px-4 py-1.5 rounded-full
                  text-xs font-bold text-on-primary bg-primary
                  hover:bg-primary-container active:scale-95
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-200 ease-standard
                "
              >
                <Icon name="send" size={14} className="text-on-primary" />
              </button>
            </div>
          </div>

          <button
            onClick={() => onNext(card, cardId, frame)}
            disabled={!card}
            className="
              w-full py-4 rounded-full font-bold text-base flex items-center justify-center gap-2
              bg-primary text-on-primary shadow-glow-sm
              hover:shadow-glow hover:bg-primary-container active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200 ease-standard
            "
          >
            <Icon name="palette" className="text-on-primary" filled />
            Generate Art
          </button>
        </>
      )}
    </div>
  );
}

// ── Step 3: Art ────────────────────────────────────────────────────────────
function StepArt({ card, cardId, frame, photoUrl }) {
  const [artUrl, setArtUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cards/${cardId}/generate-art`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frame_style: frame }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setArtUrl(data.art_url);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Generate Your Art</h1>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          AI will paint a unique illustration for {card?.name || "your card"}.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-error-container/40 text-on-error-container">
          <Icon name="error_outline" size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {artUrl ? (
        <div className="space-y-5">
          <img src={artUrl} alt="Final card art" className="w-full rounded-2xl shadow-card" />
          <button
            onClick={() => {
              const a = document.createElement("a");
              a.href = artUrl;
              a.download = `${card?.name || "card"}.png`;
              a.click();
            }}
            className="w-full py-4 rounded-full font-bold text-base flex items-center justify-center gap-2
              bg-primary text-on-primary shadow-glow-sm hover:shadow-glow
              hover:bg-primary-container active:scale-95 transition-all duration-200 ease-standard"
          >
            <Icon name="download" className="text-on-primary" />
            Download My Card
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 rounded-full font-semibold text-sm text-on-surface-variant
              bg-surface-container-low hover:bg-surface-container transition-colors duration-200"
          >
            Forge Another Card
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="aspect-[3/4] rounded-2xl bg-surface-container-low flex flex-col items-center justify-center gap-4">
            {loading
              ? <div className="w-10 h-10 rounded-full border-3 border-surface-container-high border-t-primary animate-spin" />
              : <Icon name="palette" className="text-outline-variant" size={64} />
            }
            {!loading && (
              <span className="text-sm text-on-surface-variant font-medium text-center px-8">
                Your card art will appear here
              </span>
            )}
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-4 rounded-full font-bold text-base flex items-center justify-center gap-2
              bg-primary text-on-primary shadow-glow-sm hover:shadow-glow
              hover:bg-primary-container active:scale-95
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-all duration-200 ease-standard"
          >
            <Icon name="auto_awesome" className="text-on-primary" filled />
            {loading ? "Painting your card…" : "Generate Art"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Root component ─────────────────────────────────────────────────────────
export default function ForgeWizard() {
  const [step, setStep]       = useState(1);
  const [photo, setPhoto]     = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [card, setCard]       = useState(null);
  const [cardId, setCardId]   = useState(null);
  const [frame, setFrame]     = useState("classic");

  const handleUploaded = (file, url) => {
    setPhoto(file);
    setPhotoUrl(url);
    setStep(2);
  };

  const handleForged = (forgedCard, forgedCardId, chosenFrame) => {
    setCard(forgedCard);
    setCardId(forgedCardId);
    setFrame(chosenFrame);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans flex flex-col">

      {/* Glass nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 shadow-sm shadow-violet-900/5"
        style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)" }}>
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-xl mx-auto">
          <div className="text-2xl font-black text-primary tracking-tighter">CardForge</div>
          <div className="hidden md:flex items-center gap-8">
            {["Home", "Studio", "Gallery", "Decks", "Print"].map(link => (
              <a key={link}
                href="#"
                className={`text-sm font-medium transition-colors duration-200
                  ${link === "Studio"
                    ? "text-primary font-bold border-b-2 border-primary pb-1"
                    : "text-slate-500 hover:text-primary"}`}
              >
                {link}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:bg-primary/10 rounded-full transition-colors">
              <Icon name="notifications" size={22} />
            </button>
            <button className="p-2 text-slate-500 hover:bg-primary/10 rounded-full transition-colors">
              <Icon name="settings" size={22} />
            </button>
            <div className="w-9 h-9 rounded-full bg-surface-container-high overflow-hidden ring-1 ring-outline-variant/20">
              <div className="w-full h-full flex items-center justify-center">
                <Icon name="person" className="text-outline" size={20} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content — split grid */}
      <main className="flex-grow pt-24 pb-16 px-6 max-w-screen-xl mx-auto w-full
        grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Left column — wizard */}
        <div className="lg:col-span-7">
          <StepBar current={step} />
          {step === 1 && <StepUpload onNext={handleUploaded} />}
          {step === 2 && <StepForge photo={photo} onNext={handleForged} />}
          {step === 3 && <StepArt card={card} cardId={cardId} frame={frame} photoUrl={photoUrl} />}
        </div>

        {/* Right column — sticky live preview */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="sticky top-28 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Live Preview
              </span>
              <span className="text-xs font-medium text-outline">v3.0</span>
            </div>

            <CardPreview card={card} frameId={frame} photoUrl={photoUrl} />

            <div className="bg-primary/5 p-4 rounded-2xl">
              <p className="text-sm text-primary leading-relaxed text-center font-medium">
                Your changes reflect here in real-time as you build your legend.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-100 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center
          w-full px-8 py-12 max-w-screen-xl mx-auto">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <div className="text-lg font-bold text-slate-900 mb-1">CardForge</div>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
              © 2026 CardForge Digital Curator. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {["Parental Guide", "Privacy Policy", "Terms of Service", "Help Center"].map(link => (
              <a key={link} href="#"
                className="text-xs font-medium uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
