/* Studio.tsx — Luminous Forge v1.3 — full card creator with upload, AI, save, export */
/* ctxAWR: Added actual file upload, Gemini AI generation, IndexedDB save, PNG export */
import {
  CloudUpload, Maximize, Monitor, Info, ArrowLeft, Download,
  Zap, Shield, Flame, Sparkles, Type, Palette, CheckCircle2, Wand2, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { useState, useRef, useCallback } from 'react';
import { nanoid } from 'nanoid';
import FramePicker from '../components/FramePicker';
import { getFrame, DEFAULT_FRAME_ID } from '../data/frames';
import { saveCard } from '../hooks/useCardStorage';
import { exportCardToPng } from '../hooks/useCardExport';
import { generateCardStats, isGeminiAvailable } from '../hooks/useGeminiAI';
import type { CardData } from '../types/card';

const CARD_TYPES: CardData['type'][] = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Normal'];
const RARITIES: CardData['rarity'][] = ['common', 'uncommon', 'rare', 'ultra-rare'];

export default function Studio() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [frameId, setFrameId] = useState(DEFAULT_FRAME_ID);
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardPreviewRef = useRef<HTMLDivElement>(null);

  const [cardData, setCardData] = useState({
    name: '',
    hp: 100,
    type: 'Normal' as CardData['type'],
    rarity: 'common' as CardData['rarity'],
    description: '',
    attack1: { name: '', damage: 30, description: '' },
    attack2: { name: '', damage: 60, description: '' },
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const frame = getFrame(frameId);

  // v1.3 — ctxAWR: File reader converts uploaded image to base64 data URL for persistence
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setImageDataUrl(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // v1.3 — ctxAWR: Gemini AI generates card stats from user prompt
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim() || aiLoading) return;
    setAiLoading(true);
    try {
      const generated = await generateCardStats(aiPrompt);
      setCardData({
        name: generated.name,
        hp: generated.hp,
        type: generated.type,
        rarity: generated.rarity,
        description: generated.description,
        attack1: generated.attack1,
        attack2: generated.attack2,
      });
    } catch (err) {
      console.error('AI generation failed:', err);
    } finally {
      setAiLoading(false);
    }
  };

  // v1.3 — ctxAWR: Save card to IndexedDB and navigate to gallery
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const card: CardData = {
        id: nanoid(10),
        name: cardData.name || 'Unnamed Card',
        hp: cardData.hp,
        type: cardData.type,
        rarity: cardData.rarity,
        frameId,
        imageDataUrl,
        description: cardData.description,
        attack1: cardData.attack1,
        attack2: cardData.attack2.name ? cardData.attack2 : undefined,
        createdAt: Date.now(),
      };
      await saveCard(card);
      navigate('/gallery');
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    if (!cardPreviewRef.current) return;
    await exportCardToPng(cardPreviewRef.current, cardData.name || 'card');
  };

  return (
    <div className="py-12 lg:py-16">
      <div className="flex flex-col lg:flex-row gap-12 items-start">

        {/* Main wizard */}
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
              {step === 1 && "Upload artwork and choose your card frame."}
              {step === 2 && "Define the power levels and mystical properties of your artifact."}
              {step === 3 && "Review your creation before saving it to your collection."}
            </p>
          </header>

          <AnimatePresence mode="wait">

            {/* Step 1: Upload + Frame */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div
                  className="relative group"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="absolute -inset-1 luminous-forge opacity-10 rounded-3xl blur-xl group-hover:opacity-20 transition duration-1000"></div>
                  <div
                    className="relative bg-surface-container-lowest border-4 border-dashed border-primary/20 rounded-3xl p-10 md:p-16 text-center transition-all hover:border-primary/40 cursor-pointer flex flex-col items-center justify-center space-y-5"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imageDataUrl ? (
                      <img src={imageDataUrl} alt="Uploaded" className="max-h-48 rounded-xl object-contain" />
                    ) : (
                      <div className="w-16 h-16 luminous-forge rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/30">
                        <CloudUpload className="w-8 h-8" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-on-surface">
                        {imageDataUrl ? 'Click or drop to replace' : 'Drag and drop artwork'}
                      </h3>
                      <p className="text-on-surface-variant text-sm font-medium">PNG, JPG, or SVG up to 50MB</p>
                    </div>
                    <button className="luminous-forge text-white font-bold px-7 py-2.5 rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/25 text-sm">
                      Browse Files
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-surface-container-low p-5 rounded-2xl flex items-center gap-4">
                    <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm shrink-0">
                      <Maximize className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-sm">Optimal Ratio</h4>
                      <p className="text-on-surface-variant text-xs">5:7 portrait — TCG standard 63.5 x 88.9 mm</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-5 rounded-2xl flex items-center gap-4">
                    <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm shrink-0">
                      <Monitor className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-sm">Ultra Detail</h4>
                      <p className="text-on-surface-variant text-xs">300 DPI master — 744 x 1040 px</p>
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

                {/* AI Generator */}
                {isGeminiAvailable() && (
                  <div className="bg-primary-container/30 rounded-3xl p-6 border border-primary/10 space-y-4">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <Wand2 className="w-4 h-4" /> AI Card Generator
                    </h3>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={e => setAiPrompt(e.target.value)}
                        placeholder="Describe your creature... e.g. 'a fire dragon made of crystals'"
                        className="flex-1 bg-surface-container-lowest border-2 border-transparent focus:border-primary/30 rounded-2xl py-3 px-4 font-medium text-on-surface outline-none transition-all text-sm"
                        onKeyDown={e => e.key === 'Enter' && handleAIGenerate()}
                      />
                      <button
                        onClick={handleAIGenerate}
                        disabled={aiLoading || !aiPrompt.trim()}
                        className="luminous-forge text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/25 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Generate
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-black text-on-surface-variant uppercase tracking-widest">Card Name</label>
                    <div className="relative">
                      <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                      <input type="text" value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})}
                        className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pl-12 pr-4 font-bold text-on-surface outline-none transition-all"
                        placeholder="Enter name..." />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-black text-on-surface-variant uppercase tracking-widest">Type</label>
                    <div className="relative">
                      <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                      <select value={cardData.type} onChange={e => setCardData({...cardData, type: e.target.value as CardData['type']})}
                        className="w-full bg-surface-container-low border-2 border-transparent focus:border-secondary/30 rounded-2xl py-4 pl-12 pr-4 font-bold text-on-surface outline-none transition-all appearance-none">
                        {CARD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-black text-on-surface-variant uppercase tracking-widest">Rarity</label>
                    <select value={cardData.rarity} onChange={e => setCardData({...cardData, rarity: e.target.value as CardData['rarity']})}
                      className="w-full bg-surface-container-low border-2 border-transparent focus:border-secondary/30 rounded-2xl py-4 px-4 font-bold text-on-surface outline-none transition-all appearance-none capitalize">
                      {RARITIES.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-black text-on-surface-variant uppercase tracking-widest">HP: {cardData.hp}</label>
                    <input type="range" min="30" max="300" step="10" value={cardData.hp}
                      onChange={e => setCardData({...cardData, hp: parseInt(e.target.value)})}
                      className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary mt-4" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-black text-on-surface-variant uppercase tracking-widest">Description</label>
                  <textarea value={cardData.description} onChange={e => setCardData({...cardData, description: e.target.value})}
                    className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 px-4 font-bold text-on-surface outline-none transition-all resize-none h-24"
                    placeholder="Flavor text for your card..." />
                </div>

                <div className="space-y-5">
                  <label className="block text-sm font-black text-on-surface-variant uppercase tracking-widest">Attacks</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="bg-surface-container-low p-6 rounded-3xl space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary"><Flame className="w-5 h-5"/></div>
                        <span className="text-sm font-black text-on-surface">Attack 1</span>
                      </div>
                      <input type="text" value={cardData.attack1.name} onChange={e => setCardData({...cardData, attack1: {...cardData.attack1, name: e.target.value}})}
                        className="w-full bg-surface-container-lowest rounded-xl py-2 px-3 text-sm font-bold text-on-surface outline-none" placeholder="Attack name" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-outline">DMG: {cardData.attack1.damage}</span>
                        <input type="range" min="10" max="200" step="10" value={cardData.attack1.damage}
                          onChange={e => setCardData({...cardData, attack1: {...cardData.attack1, damage: parseInt(e.target.value)}})}
                          className="flex-1 h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary" />
                      </div>
                    </div>
                    <div className="bg-surface-container-low p-6 rounded-3xl space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-secondary/10 text-secondary"><Zap className="w-5 h-5"/></div>
                        <span className="text-sm font-black text-on-surface">Attack 2 (optional)</span>
                      </div>
                      <input type="text" value={cardData.attack2.name} onChange={e => setCardData({...cardData, attack2: {...cardData.attack2, name: e.target.value}})}
                        className="w-full bg-surface-container-lowest rounded-xl py-2 px-3 text-sm font-bold text-on-surface outline-none" placeholder="Attack name" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-outline">DMG: {cardData.attack2.damage}</span>
                        <input type="range" min="10" max="200" step="10" value={cardData.attack2.damage}
                          onChange={e => setCardData({...cardData, attack2: {...cardData.attack2, damage: parseInt(e.target.value)}})}
                          className="flex-1 h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Finalize */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="bg-surface-container-low rounded-3xl p-8 space-y-5">
                  <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6"/>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">Artwork {imageDataUrl ? 'Uploaded' : 'Not uploaded'}</h4>
                      <p className="text-xs text-on-surface-variant">
                        {imageDataUrl ? 'Ready for overlay rendering' : 'A placeholder will be used'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6"/>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">Frame: {frame?.label ?? 'Classic'}</h4>
                      <p className="text-xs text-on-surface-variant">Style: {frame?.style ?? 'classic'}</p>
                    </div>
                  </div>
                  <div className="pt-5 border-t border-surface-container-high">
                    <h4 className="text-sm font-black text-on-surface-variant uppercase tracking-widest mb-4">Summary</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-sm"><span className="text-outline font-medium">Name:</span><span className="ml-2 font-bold text-on-surface">{cardData.name || 'Unnamed'}</span></div>
                      <div className="text-sm"><span className="text-outline font-medium">HP:</span><span className="ml-2 font-bold text-primary">{cardData.hp}</span></div>
                      <div className="text-sm"><span className="text-outline font-medium">Type:</span><span className="ml-2 font-bold text-on-surface">{cardData.type}</span></div>
                      <div className="text-sm"><span className="text-outline font-medium">Rarity:</span><span className="ml-2 font-bold text-on-surface capitalize">{cardData.rarity}</span></div>
                      {cardData.attack1.name && (
                        <div className="text-sm col-span-2"><span className="text-outline font-medium">Attack 1:</span><span className="ml-2 font-bold text-on-surface">{cardData.attack1.name} ({cardData.attack1.damage} dmg)</span></div>
                      )}
                      {cardData.attack2.name && (
                        <div className="text-sm col-span-2"><span className="text-outline font-medium">Attack 2:</span><span className="ml-2 font-bold text-on-surface">{cardData.attack2.name} ({cardData.attack2.damage} dmg)</span></div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleExport}
                    className="flex-1 bg-surface-container-high text-on-surface py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Export PNG
                  </button>
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
            <button
              onClick={step === 3 ? handleSave : nextStep}
              disabled={saving}
              className="luminous-forge text-white px-10 py-4 rounded-full font-extrabold tracking-wide uppercase text-sm shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {step === 1 && 'Next: Attributes'}
              {step === 2 && 'Next: Finalize'}
              {step === 3 && (saving ? 'Saving...' : 'Save to Collection')}
            </button>
          </div>
        </section>

        {/* Live Preview */}
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
            <div className="absolute -inset-4 luminous-forge opacity-5 rounded-3xl blur-3xl"></div>
            <div ref={cardPreviewRef} className="relative shadow-2xl shadow-primary/10 rounded-2xl overflow-hidden" style={{ aspectRatio: '500/670' }}>
              {imageDataUrl ? (
                <img src={imageDataUrl} alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-surface-container-high to-surface-container flex items-center justify-center">
                  <CloudUpload className="w-12 h-12 text-outline/30" />
                </div>
              )}
              <img src={frame?.src ?? '/frames/frame_classic_01.png'} alt=""
                aria-hidden className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none" />

              {/* Card text overlays */}
              <div className="absolute top-0 left-0 right-0 z-20 p-3 flex justify-between items-start">
                <p className="text-white font-black text-base tracking-tight truncate drop-shadow-lg max-w-[70%]">
                  {cardData.name || 'Card Name'}
                </p>
                <span className="text-white font-black text-sm drop-shadow-lg shrink-0">
                  {cardData.hp} HP
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 z-20 p-3 bg-gradient-to-t from-black/80 to-transparent space-y-1">
                {cardData.attack1.name && (
                  <div className="flex justify-between text-white text-xs font-bold">
                    <span>{cardData.attack1.name}</span>
                    <span>{cardData.attack1.damage}</span>
                  </div>
                )}
                {cardData.attack2.name && (
                  <div className="flex justify-between text-white text-xs font-bold">
                    <span>{cardData.attack2.name}</span>
                    <span>{cardData.attack2.damage}</span>
                  </div>
                )}
                {cardData.description && (
                  <p className="text-white/70 text-[9px] italic line-clamp-2">{cardData.description}</p>
                )}
              </div>

              <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-tighter">
                {cardData.rarity}
              </div>
            </div>
          </div>

          {/* Type + stats strip */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-surface-container-low rounded-xl p-3 text-center">
              <span className="block text-[9px] font-black text-on-surface-variant uppercase tracking-tighter">Type</span>
              <span className="text-sm font-bold text-on-surface">{cardData.type}</span>
            </div>
            <div className="bg-surface-container-low rounded-xl p-3 text-center">
              <span className="block text-[9px] font-black text-on-surface-variant uppercase tracking-tighter">HP</span>
              <span className="text-xl font-bold text-on-surface">{cardData.hp}</span>
            </div>
            <div className="bg-surface-container-low rounded-xl p-3 text-center">
              <span className="block text-[9px] font-black text-on-surface-variant uppercase tracking-tighter">Rarity</span>
              <span className="text-sm font-bold text-on-surface capitalize">{cardData.rarity}</span>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-sm text-on-surface flex items-center gap-2">
              <Info className="w-4 h-4 text-primary"/>Studio Guide
            </h4>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              {step === 1 && "Upload your artwork and pick a frame. The frame overlays your art to create the final card look."}
              {step === 2 && "Name your creature, set its type and stats. Use AI Generate to auto-fill stats from a description!"}
              {step === 3 && "Review your card and save it. You can also export it as a high-res PNG for printing."}
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
