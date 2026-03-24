/* Studio.tsx — Luminous Forge v1.4 — VMAX card creator with crop + AI transform */
/* ctxAWR: New 3-step flow: Upload+Crop → AI Transform+Attributes → VMAX Preview+Save */
import {
  CloudUpload, ArrowLeft, Download, Sparkles, Wand2, Loader2, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { useState, useRef, useCallback } from 'react';
import { nanoid } from 'nanoid';
import ImageCropper from '../components/ImageCropper';
import VmaxCard from '../components/Card';
import { saveCard } from '../hooks/useCardStorage';
import { exportCardToPng } from '../hooks/useCardExport';
import {
  generateCardStats,
  transformCardImage,
  isGeminiAvailable,
} from '../hooks/useGeminiAI';
import type { CardData } from '../types/card';

const CARD_TYPES: CardData['type'][] = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Normal'];
const RARITIES: CardData['rarity'][] = ['common', 'uncommon', 'rare', 'ultra-rare'];

export default function Studio() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardPreviewRef = useRef<HTMLDivElement>(null);

  // Image states: raw upload → cropped → AI-transformed
  const [rawImage, setRawImage] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState('');
  const [transformedImage, setTransformedImage] = useState('');

  // AI states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiError, setAiError] = useState('');

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

  // The final card image — prefer AI transformed, fall back to cropped, then raw
  const finalImage = transformedImage || croppedImage || rawImage;

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setRawImage(e.target.result);
        setShowCropper(true);
        setCroppedImage('');
        setTransformedImage('');
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

  const handleCropComplete = (croppedDataUrl: string) => {
    setCroppedImage(croppedDataUrl);
    setShowCropper(false);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    if (!croppedImage) {
      setRawImage('');
    }
  };

  // AI Transform: converts cropped photo → stylized art + auto-fills stats
  const handleAITransform = async () => {
    const sourceImage = croppedImage || rawImage;
    if (!sourceImage || aiLoading) return;
    setAiLoading(true);
    setAiError('');
    try {
      const result = await transformCardImage(sourceImage, aiPrompt || undefined);
      setTransformedImage(result.imageDataUrl);
      setCardData({
        name: result.stats.name,
        hp: result.stats.hp,
        type: result.stats.type,
        rarity: result.stats.rarity,
        description: result.stats.description,
        attack1: result.stats.attack1,
        attack2: result.stats.attack2,
      });
    } catch (err) {
      console.error('AI transform failed:', err);
      setAiError(err instanceof Error ? err.message : 'Transform failed. Try a different photo.');
    } finally {
      setAiLoading(false);
    }
  };

  // Text-only AI stat generation (fallback if no image transform)
  const handleAIStats = async () => {
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
        frameId: 'vmax',
        imageDataUrl: finalImage,
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

  // Build a CardData object for live preview
  const previewCard: CardData = {
    id: 'preview',
    name: cardData.name,
    hp: cardData.hp,
    type: cardData.type,
    rarity: cardData.rarity,
    frameId: 'vmax',
    imageDataUrl: finalImage,
    description: cardData.description,
    attack1: cardData.attack1,
    attack2: cardData.attack2.name ? cardData.attack2 : undefined,
    createdAt: 0,
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
              <div className="h-px flex-1 bg-surface-container-high" />
              {/* Step indicators */}
              <div className="flex gap-1.5">
                {[1, 2, 3].map(s => (
                  <div key={s} className={`w-2 h-2 rounded-full transition-all ${s === step ? 'bg-primary w-6' : s < step ? 'bg-primary/50' : 'bg-surface-container-high'}`} />
                ))}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
              {step === 1 && <>Upload & <span className="text-primary">Crop</span></>}
              {step === 2 && <>Transform & <span className="text-secondary">Infuse</span></>}
              {step === 3 && <>Preview & <span className="text-tertiary">Save</span></>}
            </h1>
            <p className="text-on-surface-variant text-lg max-w-xl">
              {step === 1 && "Upload a photo and crop to select the subject for your card."}
              {step === 2 && "AI transforms your photo into stylized card art and auto-fills attributes."}
              {step === 3 && "Review your VMAX card and save it to your collection."}
            </p>
          </header>

          <AnimatePresence mode="wait">

            {/* Step 1: Upload + Crop */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">

                {showCropper && rawImage ? (
                  <ImageCropper
                    imageSrc={rawImage}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                  />
                ) : (
                  <>
                    <div
                      className="relative group"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <div className="absolute -inset-1 luminous-forge opacity-10 rounded-3xl blur-xl group-hover:opacity-20 transition duration-1000" />
                      <div
                        className="relative bg-surface-container-lowest border-4 border-dashed border-primary/20 rounded-3xl p-10 md:p-16 text-center transition-all hover:border-primary/40 cursor-pointer flex flex-col items-center justify-center space-y-5"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {croppedImage ? (
                          <div className="space-y-3">
                            <img src={croppedImage} alt="Cropped" className="max-h-48 rounded-xl object-contain mx-auto" />
                            <p className="text-sm font-bold text-primary">Cropped & ready!</p>
                          </div>
                        ) : (
                          <div className="w-16 h-16 luminous-forge rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/30">
                            <CloudUpload className="w-8 h-8" />
                          </div>
                        )}
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-on-surface">
                            {croppedImage ? 'Click or drop to upload a new photo' : 'Drag and drop a photo'}
                          </h3>
                          <p className="text-on-surface-variant text-sm font-medium">Upload a photo of yourself, a pet, or anything fun!</p>
                        </div>
                        <button className="luminous-forge text-white font-bold px-7 py-2.5 rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/25 text-sm">
                          Browse Photos
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

                    {croppedImage && (
                      <button
                        onClick={() => setShowCropper(true)}
                        className="w-full bg-surface-container-low text-on-surface py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all"
                      >
                        <ImageIcon className="w-4 h-4" /> Re-crop Photo
                      </button>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* Step 2: AI Transform + Attributes */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">

                {/* AI Image Transform */}
                {isGeminiAvailable() && (croppedImage || rawImage) && (
                  <div className="bg-primary-container/30 rounded-3xl p-6 border border-primary/10 space-y-4">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <Wand2 className="w-4 h-4" /> AI Art Transformation
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      Transform your photo into stylized card art! Optionally describe what creature to merge with.
                    </p>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={e => setAiPrompt(e.target.value)}
                        placeholder="e.g. 'a fire dragon' or 'an ice wolf' (optional)"
                        className="flex-1 bg-surface-container-lowest border-2 border-transparent focus:border-primary/30 rounded-2xl py-3 px-4 font-medium text-on-surface outline-none transition-all text-sm"
                        onKeyDown={e => e.key === 'Enter' && handleAITransform()}
                      />
                      <button
                        onClick={handleAITransform}
                        disabled={aiLoading}
                        className="luminous-forge text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/25 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                      >
                        {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {aiLoading ? 'Transforming...' : 'Transform'}
                      </button>
                    </div>
                    {aiError && (
                      <p className="text-error text-sm font-medium">{aiError}</p>
                    )}
                    {transformedImage && (
                      <div className="flex items-center gap-2 text-sm text-primary font-bold">
                        <Sparkles className="w-4 h-4" /> Art transformed! Attributes auto-filled below.
                      </div>
                    )}
                  </div>
                )}

                {/* Stats-only AI generation (when no image uploaded or as alternative) */}
                {isGeminiAvailable() && !croppedImage && !rawImage && (
                  <div className="bg-primary-container/30 rounded-3xl p-6 border border-primary/10 space-y-4">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <Wand2 className="w-4 h-4" /> AI Card Generator
                    </h3>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={e => setAiPrompt(e.target.value)}
                        placeholder="Describe your creature..."
                        className="flex-1 bg-surface-container-lowest border-2 border-transparent focus:border-primary/30 rounded-2xl py-3 px-4 font-medium text-on-surface outline-none transition-all text-sm"
                        onKeyDown={e => e.key === 'Enter' && handleAIStats()}
                      />
                      <button
                        onClick={handleAIStats}
                        disabled={aiLoading || !aiPrompt.trim()}
                        className="luminous-forge text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/25 hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
                      >
                        {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Generate
                      </button>
                    </div>
                  </div>
                )}

                {/* Manual attribute fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest">Card Name</label>
                    <input type="text" value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})}
                      className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-2xl py-3 px-4 font-bold text-on-surface outline-none transition-all"
                      placeholder="Enter name..." />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest">Type</label>
                    <select value={cardData.type} onChange={e => setCardData({...cardData, type: e.target.value as CardData['type']})}
                      className="w-full bg-surface-container-low border-2 border-transparent focus:border-secondary/30 rounded-2xl py-3 px-4 font-bold text-on-surface outline-none transition-all appearance-none">
                      {CARD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest">Rarity</label>
                    <select value={cardData.rarity} onChange={e => setCardData({...cardData, rarity: e.target.value as CardData['rarity']})}
                      className="w-full bg-surface-container-low border-2 border-transparent focus:border-secondary/30 rounded-2xl py-3 px-4 font-bold text-on-surface outline-none transition-all appearance-none capitalize">
                      {RARITIES.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest">HP: {cardData.hp}</label>
                    <input type="range" min="30" max="300" step="10" value={cardData.hp}
                      onChange={e => setCardData({...cardData, hp: parseInt(e.target.value)})}
                      className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary mt-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest">Description</label>
                  <textarea value={cardData.description} onChange={e => setCardData({...cardData, description: e.target.value})}
                    className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-2xl py-3 px-4 font-bold text-on-surface outline-none transition-all resize-none h-20"
                    placeholder="Flavor text for your card..." />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-surface-container-low p-5 rounded-2xl space-y-3">
                    <span className="text-xs font-black text-on-surface uppercase">Attack 1</span>
                    <input type="text" value={cardData.attack1.name} onChange={e => setCardData({...cardData, attack1: {...cardData.attack1, name: e.target.value}})}
                      className="w-full bg-surface-container-lowest rounded-xl py-2 px-3 text-sm font-bold text-on-surface outline-none" placeholder="Attack name" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-outline shrink-0">DMG: {cardData.attack1.damage}</span>
                      <input type="range" min="10" max="200" step="10" value={cardData.attack1.damage}
                        onChange={e => setCardData({...cardData, attack1: {...cardData.attack1, damage: parseInt(e.target.value)}})}
                        className="flex-1 h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary" />
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-5 rounded-2xl space-y-3">
                    <span className="text-xs font-black text-on-surface uppercase">Attack 2 (opt.)</span>
                    <input type="text" value={cardData.attack2.name} onChange={e => setCardData({...cardData, attack2: {...cardData.attack2, name: e.target.value}})}
                      className="w-full bg-surface-container-lowest rounded-xl py-2 px-3 text-sm font-bold text-on-surface outline-none" placeholder="Attack name" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-outline shrink-0">DMG: {cardData.attack2.damage}</span>
                      <input type="range" min="10" max="200" step="10" value={cardData.attack2.damage}
                        onChange={e => setCardData({...cardData, attack2: {...cardData.attack2, damage: parseInt(e.target.value)}})}
                        className="flex-1 h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Preview + Save */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-surface-container-low rounded-3xl p-6 space-y-4">
                  <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-widest">Card Summary</h3>
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
              disabled={saving || (step === 1 && !rawImage && !croppedImage)}
              className="luminous-forge text-white px-10 py-4 rounded-full font-extrabold tracking-wide uppercase text-sm shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {step === 1 && 'Next: Transform'}
              {step === 2 && 'Next: Preview'}
              {step === 3 && (saving ? 'Saving...' : 'Save to Collection')}
            </button>
          </div>
        </section>

        {/* Live Preview — VMAX Card */}
        <aside className="w-full lg:w-[380px] sticky top-28 space-y-5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black uppercase tracking-widest text-on-surface-variant">Live Preview</h2>
            <span className="flex items-center gap-1 text-primary font-bold text-xs uppercase tracking-tighter">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Real-time
            </span>
          </div>

          <div ref={cardPreviewRef} className="relative">
            <div className="absolute -inset-4 luminous-forge opacity-5 rounded-3xl blur-3xl" />
            <VmaxCard card={previewCard} />
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
        </aside>

      </div>
    </div>
  );
}
