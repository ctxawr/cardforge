/* Studio.tsx — Luminous Forge v1.2 — frame picker integrated */
/* ctxAWR: Added FramePicker in step 1, frameId state wired to live preview */
import {
  CloudUpload, Maximize, Monitor, Info, ArrowLeft,
  Zap, Shield, Flame, Sparkles, Type, Palette, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import FramePicker from '../components/FramePicker';
import { getFrame, DEFAULT_FRAME_ID } from '../data/frames';

export default function Studio() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [frameId, setFrameId] = useState(DEFAULT_FRAME_ID);
  const [cardData, setCardData] = useState({
    name: 'Void Weaver',
    archetype: 'Celestial Archetype',
    rarity: 'Rare',
    attack: 85,
    shield: 42,
    mana: 12,
    image: 'https://picsum.photos/seed/crystal/600/800'
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const frame = getFrame(frameId);

  return (
    <div className="py-12 lg:py-16">
      <div className="flex flex-col lg:flex-row gap-12 items-start">

        {/* ── Main wizard ── */}
        <section className="flex-1 w-full space-y-10">
          <header className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Step 0{step}
              </span>
              <div className="h-px flex-1 bg-surface-container-high"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
              {step === 1 && <>Forge Your <span className="text-primary">Masterpiece</span></>}
              {step === 2 && <>Infuse <span className="text-secondary">Attributes</span></>}
              {step === 3 && <>Finalize <span className="text-tertiary">Artifact</span></>}
            </h1>
            <p className="text-on-surface-variant text-lg max-w-xl">
              {step === 1 && "Upload artwork and choose your card frame. The frame shapes your card's entire identity."}
              {step === 2 && "Define the power levels and mystical properties of your artifact. Balance is key to a legendary creation."}
              {step === 3 && "Review your creation before it's permanently inscribed into the Ethereal Vault."}
            </p>
          </header>

          <AnimatePresence mode="wait">

            {/* Step 1: Upload + Frame */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="relative group">
                  <div className="absolute -inset-1 luminous-forge opacity-10 rounded-3xl blur-xl group-hover:opacity-20 transition duration-1000"></div>
                  <div className="relative bg-surface-container-lowest border-4 border-dashed border-primary/20 rounded-5xl p-10 md:p-16 text-center transition-all hover:border-primary/40 cursor-pointer flex flex-col items-center justify-center space-y-5">
                    <div className="w-16 h-16 luminous-forge rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/30">
                      <CloudUpload className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-on-surface">Drag and drop artwork</h3>
                      <p className="text-on-surface-variant text-sm font-medium">PNG, JPG, or SVG up to 50MB — 5:7 portrait recommended</p>
                    </div>
                    <button className="luminous-forge text-white font-bold px-7 py-2.5 rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/25 text-sm">
                      Browse Files
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-surface-container-low p-5 rounded-2xl flex items-center gap-4">
                    <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm shrink-0">
                      <Maximize className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-sm">Optimal Ratio</h4>
                      <p className="text-on-surface-variant text-xs">5:7 portrait — TCG standard 63.5 × 88.9 mm</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-5 rounded-2xl flex items-center gap-4">
                    <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm shrink-0">
                      <Monitor className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-sm">Ultra Detail</h4>
                      <p className="text-on-surface-variant text-xs">300 DPI master — 744 × 1040 px</p>
                    </div>
                  </div>
                </div>

                {/* Frame Picker */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-widest">Choose Frame</h3>
                    {frame && (
                      <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {frame.label}
                      </span>
                    )}
                  </div>
                  <div className="bg-surface-container-low rounded-3xl p-5">
                    <FramePicker selectedId={frameId} onSelect={f => setFrameId(f.id)} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Attributes */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-black text-on-surface-variant uppercase tracking-widest">Artifact Name</label>
                    <div className="relative">
                      <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                      <input type="text" value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})}
                        className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pl-12 pr-4 font-bold text-on-surface outline-none transition-all"
                        placeholder="Enter name..." />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-black text-on-surface-variant uppercase tracking-widest">Archetype</label>
                    <div className="relative">
                      <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                      <select value={cardData.archetype} onChange={e => setCardData({...cardData, archetype: e.target.value})}
                        className="w-full bg-surface-container-low border-2 border-transparent focus:border-secondary/30 rounded-2xl py-4 pl-12 pr-4 font-bold text-on-surface outline-none transition-all appearance-none">
                        <option>Celestial Archetype</option>
                        <option>Void Archetype</option>
                        <option>Elemental Archetype</option>
                        <option>Mechanical Archetype</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <label className="block text-sm font-black text-on-surface-variant uppercase tracking-widest">Core Statistics</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {[
                      { label: 'Attack', key: 'attack', icon: Flame, color: 'text-primary', bg: 'bg-primary/10' },
                      { label: 'Shield', key: 'shield', icon: Shield, color: 'text-secondary', bg: 'bg-secondary/10' },
                      { label: 'Mana',   key: 'mana',   icon: Zap,    color: 'text-tertiary', bg: 'bg-tertiary/10' },
                    ].map(stat => (
                      <div key={stat.key} className="bg-surface-container-low p-6 rounded-3xl space-y-4">
                        <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}><stat.icon className="w-5 h-5"/></div>
                          <span className="text-2xl font-black text-on-surface">{(cardData as any)[stat.key]}</span>
                        </div>
                        <input type="range" min="0" max="100" value={(cardData as any)[stat.key]}
                          onChange={e => setCardData({...cardData, [stat.key]: parseInt(e.target.value)})}
                          className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary" />
                        <span className="block text-[10px] font-black text-outline uppercase tracking-tighter">{stat.label} Power</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Finalize */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="bg-surface-container-low rounded-4xl p-8 space-y-5">
                  <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6"/>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">Artwork Infused</h4>
                      <p className="text-xs text-on-surface-variant">Resolution: 744 × 1040 px (5:7 print-ready)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6"/>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">Frame: {frame?.label ?? 'Classic'}</h4>
                      <p className="text-xs text-on-surface-variant">Style: {frame?.style ?? 'classic'} — ready for overlay rendering</p>
                    </div>
                  </div>
                  <div className="pt-5 border-t border-surface-container-high">
                    <h4 className="text-sm font-black text-on-surface-variant uppercase tracking-widest mb-4">Summary</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-sm"><span className="text-outline font-medium">Name:</span><span className="ml-2 font-bold text-on-surface">{cardData.name}</span></div>
                      <div className="text-sm"><span className="text-outline font-medium">Rarity:</span><span className="ml-2 font-bold text-primary">{cardData.rarity}</span></div>
                      <div className="text-sm"><span className="text-outline font-medium">Archetype:</span><span className="ml-2 font-bold text-on-surface">{cardData.archetype}</span></div>
                      <div className="text-sm"><span className="text-outline font-medium">Total Power:</span><span className="ml-2 font-bold text-on-surface">{cardData.attack + cardData.shield + cardData.mana}</span></div>
                    </div>
                  </div>
                </div>
                <div className="bg-tertiary-container/30 p-6 rounded-3xl border border-tertiary/10">
                  <p className="text-sm text-on-tertiary-container font-medium leading-relaxed">
                    By finalizing, you agree to inscribe this artifact into the Ethereal Vault. This action is permanent and will consume 1 Forge Token.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-surface-container-high">
            <button onClick={step === 1 ? () => navigate(-1) : prevStep}
              className="flex items-center gap-2 text-on-surface-variant font-bold hover:text-on-surface transition-colors">
              <ArrowLeft className="w-5 h-5"/>
              {step === 1 ? 'Back' : 'Previous Step'}
            </button>
            <button onClick={step === 3 ? () => navigate('/gallery') : nextStep}
              className="luminous-forge text-white px-10 py-4 rounded-full font-extrabold tracking-wide uppercase text-sm shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all">
              {step === 1 && 'Next: Statistics'}
              {step === 2 && 'Next: Finalize'}
              {step === 3 && 'Inscribe Artifact'}
            </button>
          </div>
        </section>

        {/* ── Live Preview ── */}
        <aside className="w-full lg:w-[380px] sticky top-28 space-y-5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black uppercase tracking-widest text-on-surface-variant">Live Preview</h2>
            <span className="flex items-center gap-1 text-primary font-bold text-xs uppercase tracking-tighter">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Real-time
            </span>
          </div>

          {/* Card with frame overlay */}
          <div className="relative">
            <div className="absolute -inset-4 luminous-forge opacity-5 rounded-5xl blur-3xl"></div>
            <div className="relative shadow-2xl shadow-primary/10 rounded-2xl overflow-hidden" style={{ aspectRatio: '500/670' }}>
              <img src={cardData.image} alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer" />
              <img src={frame?.src ?? '/frames/frame_classic_01.png'} alt=""
                aria-hidden className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white font-black text-lg tracking-tight truncate">{cardData.name}</p>
                <p className="text-white/70 text-xs font-bold uppercase tracking-wider">{cardData.archetype}</p>
              </div>
              <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-tighter">
                {cardData.rarity}
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Attack', value: cardData.attack },
              { label: 'Shield', value: cardData.shield },
              { label: 'Mana',   value: cardData.mana },
            ].map(stat => (
              <div key={stat.label} className="bg-surface-container-low rounded-xl p-3 text-center">
                <span className="block text-[9px] font-black text-on-surface-variant uppercase tracking-tighter">{stat.label}</span>
                <span className="text-xl font-bold text-on-surface">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="bg-surface-container-low rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-sm text-on-surface flex items-center gap-2">
              <Info className="w-4 h-4 text-primary"/>Studio Guide
            </h4>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              {step === 1 && "Pick a frame — it overlays your artwork to create the final card look. Change it anytime before inscribing."}
              {step === 2 && "Higher mana costs typically allow for more powerful attack and shield combinations. Experiment to find your balance."}
              {step === 3 && "Once inscribed, your artifact is available in your Gallery and can be added to any Deck."}
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
