/* Studio.tsx — Luminous Forge v1.6 — AI-powered card creator */
/* ctxAWR: Iterative flow: Upload+Crop → Analyze+Edit prompt+Generate art (loop) → Preview+Save
   Photo is reference only — AI generates stylized character art preserving subject likeness.
   User can view/edit the full generation prompt and re-generate with feedback. */
import {
  CloudUpload, ArrowLeft, Download, Sparkles, Wand2, Loader2,
  Image as ImageIcon, Eye, Zap, RefreshCw, ChevronDown, ChevronUp, Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as React from 'react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';
import ImageCropper from '../components/ImageCropper';
import VmaxCard from '../components/Card';
import { saveCard, loadCard } from '../hooks/useCardStorage';
import { exportCardToPng } from '../hooks/useCardExport';
import {
  analyzeReferenceImage,
  generateCardArt,
  buildArtPrompt,
  isGeminiAvailable,
  type GeneratedStats,
} from '../hooks/useGeminiAI';
import type { CardData } from '../types/card';

const CARD_TYPES: CardData['type'][] = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Normal'];
const RARITIES: CardData['rarity'][] = ['common', 'uncommon', 'rare', 'ultra-rare'];

const CREATURE_SUGGESTIONS = {
  'Mythical': [
    { label: 'Dragon', emoji: '\uD83D\uDC09' },
    { label: 'Phoenix', emoji: '\uD83D\uDD25' },
    { label: 'Unicorn', emoji: '\uD83E\uDD84' },
    { label: 'Griffin', emoji: '\uD83E\uDD85' },
    { label: 'Pegasus', emoji: '\uD83E\uDEBD' },
    { label: 'Fairy', emoji: '\uD83E\uDDDA' },
    { label: 'Mermaid', emoji: '\uD83E\uDDDC' },
    { label: 'Werewolf', emoji: '\uD83D\uDC3A' },
  ],
  'Animals': [
    { label: 'Wolf', emoji: '\uD83D\uDC3A' },
    { label: 'Tiger', emoji: '\uD83D\uDC2F' },
    { label: 'Eagle', emoji: '\uD83E\uDD85' },
    { label: 'Shark', emoji: '\uD83E\uDD88' },
    { label: 'Bear', emoji: '\uD83D\uDC3B' },
    { label: 'Fox', emoji: '\uD83E\uDD8A' },
    { label: 'Snake', emoji: '\uD83D\uDC0D' },
    { label: 'Owl', emoji: '\uD83E\uDD89' },
  ],
  'Elemental': [
    { label: 'Ice Golem', emoji: '\u2744\uFE0F' },
    { label: 'Thunder Spirit', emoji: '\u26A1' },
    { label: 'Fire Elemental', emoji: '\uD83D\uDD25' },
    { label: 'Water Serpent', emoji: '\uD83C\uDF0A' },
    { label: 'Shadow Wraith', emoji: '\uD83D\uDC7B' },
    { label: 'Crystal Guardian', emoji: '\uD83D\uDC8E' },
    { label: 'Storm Hawk', emoji: '\uD83C\uDF29\uFE0F' },
    { label: 'Vine Titan', emoji: '\uD83C\uDF3F' },
  ],
};

const ART_STYLES = [
  { id: 'anime', label: 'Anime', desc: 'vibrant anime/cartoon style with cel shading and dynamic energy lines' },
  { id: 'watercolor', label: 'Watercolor', desc: 'soft watercolor painting with flowing colors and artistic brushstrokes' },
  { id: 'comic', label: 'Comic Book', desc: 'bold comic book style with thick outlines, halftone dots, and dramatic lighting' },
  { id: 'pixel', label: 'Pixel Art', desc: 'retro pixel art style with chunky pixels, limited palette, and nostalgic game feel' },
  { id: 'chibi', label: 'Chibi', desc: 'adorable chibi/super-deformed style with oversized head, tiny body, and cute expressions' },
  { id: 'oil', label: 'Oil Painting', desc: 'classical oil painting style with rich textures, dramatic lighting, and fine detail' },
  { id: 'neon', label: 'Neon Glow', desc: 'neon-lit cyberpunk style with glowing edges, dark background, and vibrant light trails' },
  { id: '3d', label: '3D Render', desc: 'polished 3D render style like a Pixar movie, with smooth shading and cinematic lighting' },
];

type WizardStep = 'upload' | 'transform' | 'preview';

export default function Studio() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [step, setStep] = useState<WizardStep>('upload');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardPreviewRef = useRef<HTMLDivElement>(null);

  // Reference image states (never shown on card)
  const [rawImage, setRawImage] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState('');

  // AI-generated card art (this goes on the card)
  const [generatedArt, setGeneratedArt] = useState('');

  // AI state
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [creatureOverride, setCreatureOverride] = useState('');
  const [artPrompt, setArtPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [genCount, setGenCount] = useState(0);
  const [artStyle, setArtStyle] = useState('anime');

  // Card stats (auto-filled by AI analysis, editable by user)
  const [cardData, setCardData] = useState({
    name: '',
    hp: 100,
    type: 'Normal' as CardData['type'],
    rarity: 'common' as CardData['rarity'],
    description: '',
    attack1: { name: '', damage: 30, description: '' },
    attack2: { name: '', damage: 60, description: '' },
  });
  const [analysisResult, setAnalysisResult] = useState<GeneratedStats | null>(null);

  // Load existing card for editing
  useEffect(() => {
    if (!editId) return;
    loadCard(editId).then(card => {
      if (!card) return;
      setCardData({
        name: card.name,
        hp: card.hp,
        type: card.type,
        rarity: card.rarity,
        description: card.description,
        attack1: card.attack1,
        attack2: card.attack2 ?? { name: '', damage: 60, description: '' },
      });
      if (card.imageDataUrl) {
        setGeneratedArt(card.imageDataUrl);
        setStep('transform');
      }
    });
  }, [editId]);

  const stepIndex = step === 'upload' ? 1 : step === 'transform' ? 2 : 3;
  const referenceImage = croppedImage || rawImage;

  // The card uses ONLY generated art, never the photo
  const cardImage = generatedArt;

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setRawImage(e.target.result);
        setShowCropper(true);
        setCroppedImage('');
        setGeneratedArt('');
        setAnalysisResult(null);
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
    if (!croppedImage) setRawImage('');
  };

  // Step 1→2: Analyze the reference photo, auto-fill stats, build initial prompt
  const handleAnalyze = async () => {
    if (!referenceImage || analyzing) return;
    setAnalyzing(true);
    setAiError('');
    try {
      const stats = await analyzeReferenceImage(referenceImage);
      setAnalysisResult(stats);
      setCardData({
        name: stats.name,
        hp: stats.hp,
        type: stats.type,
        rarity: stats.rarity,
        description: stats.description,
        attack1: stats.attack1,
        attack2: stats.attack2,
      });
      setCreatureOverride(stats.suggestedCreature);
      const selectedStyle = ART_STYLES.find(s => s.id === artStyle)?.desc;
      setArtPrompt(buildArtPrompt(stats, stats.suggestedCreature, selectedStyle));
      setStep('transform');
    } catch (err) {
      console.error('Analysis failed:', err);
      setAiError(err instanceof Error ? err.message : 'Analysis failed. Try a different photo.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Rebuild prompt when creature/style changes
  const rebuildPrompt = (overrideCreature?: string, overrideStyleId?: string) => {
    const stats = analysisResult ?? {
      ...cardData,
      subjectDescription: '',
      suggestedCreature: creatureOverride || 'mystical creature',
    };
    const creature = overrideCreature ?? creatureOverride;
    const styleId = overrideStyleId ?? artStyle;
    const styleDesc = ART_STYLES.find(s => s.id === styleId)?.desc;
    setArtPrompt(buildArtPrompt(stats, creature || undefined, styleDesc));
  };

  // Generate stylized character art from reference using the editable prompt
  const handleGenerateArt = async () => {
    if (!referenceImage || generating) return;
    setGenerating(true);
    setAiError('');
    try {
      const styleDesc = ART_STYLES.find(s => s.id === artStyle)?.desc;
      const prompt = artPrompt || buildArtPrompt(
        analysisResult ?? { ...cardData, subjectDescription: '', suggestedCreature: creatureOverride || 'mystical creature' },
        creatureOverride || undefined,
        styleDesc,
      );
      const artDataUrl = await generateCardArt(referenceImage, prompt);
      setGeneratedArt(artDataUrl);
      setGenCount(c => c + 1);
    } catch (err) {
      console.error('Art generation failed:', err);
      setAiError(err instanceof Error ? err.message : 'Art generation failed. Try again or use a different photo.');
    } finally {
      setGenerating(false);
    }
  };

  // Auto-analyze + generate when moving to step 2
  const goToTransform = async () => {
    if (!referenceImage) return;
    if (!analysisResult) {
      await handleAnalyze();
    } else {
      setStep('transform');
    }
  };

  const handleSave = async () => {
    if (saving || !cardImage) return;
    setSaving(true);
    try {
      const card: CardData = {
        id: editId || nanoid(10),
        name: cardData.name || 'Unnamed Card',
        hp: cardData.hp,
        type: cardData.type,
        rarity: cardData.rarity,
        frameId: 'vmax',
        imageDataUrl: cardImage,
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

  const previewCard: CardData = {
    id: 'preview',
    name: cardData.name || 'Card Name',
    hp: cardData.hp,
    type: cardData.type,
    rarity: cardData.rarity,
    frameId: 'vmax',
    imageDataUrl: cardImage,
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
                Step 0{stepIndex}
              </span>
              <div className="h-px flex-1 bg-surface-container-high" />
              <div className="flex gap-1.5">
                {[1, 2, 3].map(s => (
                  <div key={s} className={`w-2 h-2 rounded-full transition-all ${s === stepIndex ? 'bg-primary w-6' : s < stepIndex ? 'bg-primary/50' : 'bg-surface-container-high'}`} />
                ))}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
              {step === 'upload' && <>Upload <span className="text-primary">Reference</span></>}
              {step === 'transform' && <>Transform & <span className="text-secondary">Infuse</span></>}
              {step === 'preview' && <>Preview & <span className="text-tertiary">Save</span></>}
            </h1>
            <p className="text-on-surface-variant text-lg max-w-xl">
              {step === 'upload' && "Upload a photo as a reference. AI will create a stylized character based on it."}
              {step === 'transform' && "AI analyzed your photo and suggested stats. Generate your character art below!"}
              {step === 'preview' && "Your card is ready! Review and save it to your collection."}
            </p>
          </header>

          <AnimatePresence mode="wait">

            {/* Step 1: Upload + Crop */}
            {step === 'upload' && (
              <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">

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
                            <img src={croppedImage} alt="Reference" className="max-h-48 rounded-xl object-contain mx-auto" />
                            <p className="text-sm font-bold text-primary">Reference photo ready!</p>
                          </div>
                        ) : (
                          <div className="w-16 h-16 luminous-forge rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/30">
                            <CloudUpload className="w-8 h-8" />
                          </div>
                        )}
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-on-surface">
                            {croppedImage ? 'Upload a different photo' : 'Upload a reference photo'}
                          </h3>
                          <p className="text-on-surface-variant text-sm font-medium">
                            A photo of yourself, a pet, toy, or anything fun! AI will create card art from it.
                          </p>
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

                    {aiError && (
                      <p className="text-error text-sm font-medium text-center">{aiError}</p>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* Step 2: Transform — creature picker, style picker, type, stats, art generation */}
            {step === 'transform' && (
              <motion.div key="transform" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">

                {/* AI analysis summary */}
                {analysisResult && (
                  <div className="bg-primary-container/20 rounded-2xl p-4 border border-primary/10 space-y-1.5">
                    <h3 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <Eye className="w-3.5 h-3.5" /> AI Analysis
                    </h3>
                    <p className="text-sm text-on-surface-variant">{analysisResult.subjectDescription}</p>
                    <p className="text-sm font-bold text-on-surface">
                      Suggested fusion: <span className="text-primary">{analysisResult.suggestedCreature}</span>
                    </p>
                  </div>
                )}

                {/* Creature Picker — tappable chips by category */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Choose Your Creature</h3>
                  {Object.entries(CREATURE_SUGGESTIONS).map(([category, creatures]) => (
                    <div key={category} className="space-y-1.5">
                      <span className="text-[10px] font-bold text-outline uppercase tracking-widest">{category}</span>
                      <div className="flex flex-wrap gap-2">
                        {creatures.map(c => (
                          <button
                            key={c.label}
                            onClick={() => { setCreatureOverride(c.label); rebuildPrompt(c.label); }}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border-2 ${
                              creatureOverride.toLowerCase() === c.label.toLowerCase()
                                ? 'bg-primary text-white border-primary shadow-md shadow-primary/25 scale-105'
                                : 'bg-surface-container-low text-on-surface border-transparent hover:border-primary/30 hover:bg-primary/5'
                            }`}
                          >
                            <span className="mr-1">{c.emoji}</span> {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {/* Custom creature input */}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={creatureOverride}
                      onChange={e => setCreatureOverride(e.target.value)}
                      placeholder="Or type your own creature..."
                      className="flex-1 bg-surface-container-lowest border-2 border-transparent focus:border-primary/30 rounded-xl py-2 px-3 font-medium text-on-surface outline-none transition-all text-sm"
                      onKeyDown={e => { if (e.key === 'Enter') { rebuildPrompt(); handleGenerateArt(); } }}
                    />
                  </div>
                </div>

                {/* Art Style Picker */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Art Style</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ART_STYLES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => { setArtStyle(s.id); rebuildPrompt(undefined, s.id); }}
                        className={`px-3 py-2.5 rounded-2xl text-xs font-bold transition-all border-2 text-center ${
                          artStyle === s.id
                            ? 'luminous-forge text-white border-primary shadow-lg shadow-primary/25 scale-105'
                            : 'bg-surface-container-low text-on-surface border-transparent hover:border-primary/20 hover:bg-primary/5'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Type — tappable chips */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Card Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {CARD_TYPES.map(t => {
                      const typeEmoji: Record<string, string> = {
                        Fire: '\uD83D\uDD25', Water: '\uD83D\uDCA7', Grass: '\uD83C\uDF3F',
                        Electric: '\u26A1', Psychic: '\uD83D\uDD2E', Normal: '\u2B50',
                      };
                      return (
                        <button
                          key={t}
                          onClick={() => { setCardData(d => ({ ...d, type: t })); rebuildPrompt(); }}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-2 ${
                            cardData.type === t
                              ? 'bg-primary text-white border-primary shadow-md shadow-primary/25 scale-105'
                              : 'bg-surface-container-low text-on-surface border-transparent hover:border-primary/30 hover:bg-primary/5'
                          }`}
                        >
                          <span className="mr-1">{typeEmoji[t]}</span> {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rarity — tappable chips */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Rarity</h3>
                  <div className="flex flex-wrap gap-2">
                    {RARITIES.map(r => {
                      const rarityColors: Record<string, string> = {
                        'common': 'bg-gray-500', 'uncommon': 'bg-emerald-500',
                        'rare': 'bg-amber-500', 'ultra-rare': 'vmax-holo',
                      };
                      return (
                        <button
                          key={r}
                          onClick={() => setCardData(d => ({ ...d, rarity: r }))}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-2 capitalize ${
                            cardData.rarity === r
                              ? `${rarityColors[r]} text-white border-transparent shadow-md scale-105`
                              : 'bg-surface-container-low text-on-surface border-transparent hover:border-primary/30 hover:bg-primary/5'
                          }`}
                        >
                          {r === 'ultra-rare' ? 'VMAX' : r}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Generate button — prominent */}
                {isGeminiAvailable() && (
                  <div className="bg-primary-container/30 rounded-3xl p-5 border border-primary/10 space-y-4">
                    <button
                      onClick={() => { rebuildPrompt(); handleGenerateArt(); }}
                      disabled={generating}
                      className="w-full luminous-forge text-white py-4 rounded-2xl font-extrabold text-sm shadow-xl shadow-primary/25 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                      {generating ? 'Creating your character...' : generatedArt ? `Regenerate Art (${genCount} generated)` : 'Generate Character Art'}
                    </button>

                    {generatedArt && (
                      <p className="text-xs text-center text-on-surface-variant">
                        Try different creatures, styles, or types above then hit Regenerate!
                      </p>
                    )}

                    {/* Expandable full prompt editor */}
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowPrompt(!showPrompt)}
                        className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        {showPrompt ? 'Hide' : 'Advanced:'} Full Prompt
                        {showPrompt ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                      {showPrompt && (
                        <div className="space-y-2">
                          <textarea
                            value={artPrompt}
                            onChange={e => setArtPrompt(e.target.value)}
                            className="w-full bg-surface-container-lowest border-2 border-primary/10 focus:border-primary/30 rounded-2xl py-3 px-4 font-mono text-xs text-on-surface outline-none transition-all resize-y h-48"
                            placeholder="AI prompt for image generation..."
                          />
                          <div className="flex gap-3">
                            <button onClick={() => rebuildPrompt()}
                              className="text-xs font-bold text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors">
                              <RefreshCw className="w-3 h-3" /> Reset Prompt
                            </button>
                            <button onClick={handleGenerateArt} disabled={generating}
                              className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors disabled:opacity-50">
                              <Sparkles className="w-3 h-3" /> Generate with Edited Prompt
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {aiError && (
                      <p className="text-error text-sm font-medium">{aiError}</p>
                    )}
                  </div>
                )}

                {/* Card name, HP, description, attacks — editable fields */}
                <div className="space-y-5">
                  <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Card Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-on-surface-variant">Card Name</label>
                      <input type="text" value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})}
                        className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-xl py-2.5 px-3 font-bold text-on-surface outline-none transition-all text-sm"
                        placeholder="Enter name..." />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-on-surface-variant">HP: {cardData.hp}</label>
                      <input type="range" min="30" max="300" step="10" value={cardData.hp}
                        onChange={e => setCardData({...cardData, hp: parseInt(e.target.value)})}
                        className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary mt-2" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-on-surface-variant">Description</label>
                    <textarea value={cardData.description} onChange={e => setCardData({...cardData, description: e.target.value})}
                      className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-xl py-2.5 px-3 font-bold text-on-surface outline-none transition-all resize-none h-16 text-sm"
                      placeholder="Flavor text for your card..." />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-surface-container-low p-4 rounded-2xl space-y-2">
                      <span className="text-xs font-black text-on-surface uppercase">Attack 1</span>
                      <input type="text" value={cardData.attack1.name} onChange={e => setCardData({...cardData, attack1: {...cardData.attack1, name: e.target.value}})}
                        className="w-full bg-surface-container-lowest rounded-xl py-2 px-3 text-sm font-bold text-on-surface outline-none" placeholder="Attack name" />
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-outline shrink-0">DMG: {cardData.attack1.damage}</span>
                        <input type="range" min="10" max="200" step="10" value={cardData.attack1.damage}
                          onChange={e => setCardData({...cardData, attack1: {...cardData.attack1, damage: parseInt(e.target.value)}})}
                          className="flex-1 h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary" />
                      </div>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-2xl space-y-2">
                      <span className="text-xs font-black text-on-surface uppercase">Attack 2 (opt.)</span>
                      <input type="text" value={cardData.attack2.name} onChange={e => setCardData({...cardData, attack2: {...cardData.attack2, name: e.target.value}})}
                        className="w-full bg-surface-container-lowest rounded-xl py-2 px-3 text-sm font-bold text-on-surface outline-none" placeholder="Attack name" />
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-outline shrink-0">DMG: {cardData.attack2.damage}</span>
                        <input type="range" min="10" max="200" step="10" value={cardData.attack2.damage}
                          onChange={e => setCardData({...cardData, attack2: {...cardData.attack2, damage: parseInt(e.target.value)}})}
                          className="flex-1 h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Preview + Save */}
            {step === 'preview' && (
              <motion.div key="preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">

                {!cardImage && (
                  <div className="bg-error/10 rounded-2xl p-5 border border-error/20 text-center">
                    <p className="text-error font-bold">No character art generated yet!</p>
                    <p className="text-sm text-on-surface-variant mt-1">Go back and generate art before saving.</p>
                  </div>
                )}

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
                    disabled={!cardImage}
                    className="flex-1 bg-surface-container-high text-on-surface py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all disabled:opacity-50"
                  >
                    <Download className="w-5 h-5" /> Export PNG
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-surface-container-high">
            <button onClick={() => {
              if (step === 'upload') navigate(-1);
              else if (step === 'transform') setStep('upload');
              else setStep('transform');
            }}
              className="flex items-center gap-2 text-on-surface-variant font-bold hover:text-on-surface transition-colors">
              <ArrowLeft className="w-5 h-5"/>
              {step === 'upload' ? 'Back' : 'Previous Step'}
            </button>
            <button
              onClick={() => {
                if (step === 'upload') goToTransform();
                else if (step === 'transform') setStep('preview');
                else handleSave();
              }}
              disabled={
                saving ||
                (step === 'upload' && (!referenceImage || analyzing)) ||
                (step === 'preview' && !cardImage)
              }
              className="luminous-forge text-white px-10 py-4 rounded-full font-extrabold tracking-wide uppercase text-sm shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {step === 'upload' && (analyzing ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : 'Next: Transform')}
              {step === 'transform' && 'Next: Preview'}
              {step === 'preview' && (saving ? 'Saving...' : editId ? 'Update Card' : 'Save to Collection')}
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
            {!cardImage && (
              <div className="absolute inset-0 flex items-center justify-center z-30">
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 text-center">
                  <Wand2 className="w-8 h-8 text-white mx-auto mb-2" />
                  <p className="text-white text-sm font-bold">Art will appear here</p>
                  <p className="text-white/60 text-xs">after AI generation</p>
                </div>
              </div>
            )}
          </div>

          {/* Reference thumbnail (small, labeled clearly) */}
          {referenceImage && (
            <div className="bg-surface-container-low rounded-2xl p-3 flex items-center gap-3">
              <img src={referenceImage} alt="Reference" className="w-12 h-12 rounded-lg object-cover border border-outline-variant/20" />
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Reference Photo</p>
                <p className="text-xs text-on-surface-variant">Used as inspiration only — not on the card</p>
              </div>
            </div>
          )}

          {/* Stats strip */}
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
