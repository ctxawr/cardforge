// v2.0 — ctxAWR: Canvas-based card export at TCG print resolution
// Draws card art + text overlays directly on canvas. Replaces html2canvas which
// failed silently on backdrop-blur, drop-shadow, and motion.div transforms.
import type { CardData } from '../types/card';

const CARD_W = 744;
const CARD_H = 1040;
const BORDER_R = 24;

const TYPE_HEX: Record<CardData['type'], string> = {
  Fire: '#ef4444', Water: '#3b82f6', Grass: '#22c55e',
  Electric: '#eab308', Psychic: '#a855f7', Normal: '#6b7280',
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawEnergyOrb(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
  grad.addColorStop(0, color + 'ff');
  grad.addColorStop(1, color + 'aa');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();
}

export async function exportCardToPng(card: CardData): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d')!;

  const accent = TYPE_HEX[card.type] || TYPE_HEX.Normal;

  // Clip to rounded rect
  roundRect(ctx, 0, 0, CARD_W, CARD_H, BORDER_R);
  ctx.clip();

  // Draw card art full-bleed
  if (card.imageDataUrl) {
    try {
      const img = await loadImage(card.imageDataUrl);
      const scale = Math.max(CARD_W / img.width, CARD_H / img.height);
      const sw = img.width * scale;
      const sh = img.height * scale;
      ctx.drawImage(img, (CARD_W - sw) / 2, (CARD_H - sh) / 2, sw, sh);
    } catch {
      ctx.fillStyle = '#1a1b23';
      ctx.fillRect(0, 0, CARD_W, CARD_H);
    }
  } else {
    ctx.fillStyle = '#1a1b23';
    ctx.fillRect(0, 0, CARD_W, CARD_H);
  }

  // ── TOP: Name + HP ──
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  roundRect(ctx, 16, 16, CARD_W - 32, 56, 12);
  ctx.fill();

  ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  const nameText = card.name || 'Card Name';
  const maxNameW = CARD_W - 200;
  ctx.fillText(nameText, 30, 44, maxNameW);

  if (card.rarity === 'ultra-rare') {
    const nameW = Math.min(ctx.measureText(nameText).width, maxNameW);
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = accent;
    ctx.fillText('VMAX', 36 + nameW, 44);
  }

  // HP + energy orb
  ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = accent;
  ctx.textAlign = 'right';
  ctx.fillText(String(card.hp), CARD_W - 54, 42);

  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.textAlign = 'right';
  ctx.fillText('HP', CARD_W - 54 - ctx.measureText(String(card.hp)).width - 4, 42);
  ctx.textAlign = 'left';

  drawEnergyOrb(ctx, CARD_W - 34, 44, 14, accent);

  // Sub-badges: type + rarity
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  // Type badge
  roundRect(ctx, 20, 78, 60, 18, 9);
  ctx.fillStyle = accent;
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'middle';
  ctx.fillText(card.type.toUpperCase(), 28, 87);

  // Rarity badge
  if (card.rarity !== 'ultra-rare') {
    const rarityText = card.rarity.toUpperCase();
    const rw = ctx.measureText(rarityText).width + 16;
    roundRect(ctx, CARD_W - 20 - rw, 78, rw, 18, 9);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText(rarityText, CARD_W - 12 - rw, 87);
  }

  // ── BOTTOM: Attack strips ──
  let yPos = CARD_H;

  // Footer bar (weakness/resistance/retreat)
  yPos -= 30;
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, yPos, CARD_W, 30);
  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText('weakness', 20, yPos + 16);
  drawEnergyOrb(ctx, 85, yPos + 15, 7, TYPE_HEX[card.type === 'Electric' ? 'Grass' : card.type === 'Fire' ? 'Water' : 'Normal']);
  ctx.fillText('resistance', 120, yPos + 16);
  ctx.fillText('retreat', CARD_W - 90, yPos + 16);
  drawEnergyOrb(ctx, CARD_W - 40, yPos + 15, 7, TYPE_HEX.Normal);
  drawEnergyOrb(ctx, CARD_W - 22, yPos + 15, 7, TYPE_HEX.Normal);

  // Flavor text / VMAX rule
  if (card.description || card.rarity === 'ultra-rare') {
    yPos -= 28;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, yPos, CARD_W, 28);
    ctx.font = 'italic 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    const desc = card.description || 'VMAX rule: When this Pokemon VMAX is Knocked Out, your opponent takes 3 Prize cards.';
    ctx.fillText(desc, 20, yPos + 16, CARD_W - 140);

    // Rarity label
    ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = accent;
    ctx.textAlign = 'right';
    ctx.fillText(card.rarity === 'ultra-rare' ? 'RAINBOW RARE' : card.rarity.toUpperCase(), CARD_W - 20, yPos + 16);
    ctx.textAlign = 'left';
  }

  // Attack 2
  if (card.attack2?.name) {
    const a2h = card.attack2.description ? 58 : 40;
    yPos -= a2h + 6;
    roundRect(ctx, 16, yPos, CARD_W - 32, a2h, 12);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fill();

    // Energy orbs
    drawEnergyOrb(ctx, 36, yPos + 20, 8, accent);
    drawEnergyOrb(ctx, 56, yPos + 20, 8, accent);
    drawEnergyOrb(ctx, 76, yPos + 20, 8, accent);

    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(card.attack2.name, 94, yPos + 24, CARD_W - 200);

    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(String(card.attack2.damage), CARD_W - 36, yPos + 24);
    ctx.textAlign = 'left';

    if (card.attack2.description) {
      ctx.font = '11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText(card.attack2.description, 36, yPos + a2h - 10, CARD_W - 80);
    }
  }

  // Attack 1
  if (card.attack1?.name) {
    const a1h = card.attack1.description ? 58 : 40;
    yPos -= a1h + 6;
    roundRect(ctx, 16, yPos, CARD_W - 32, a1h, 12);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fill();

    drawEnergyOrb(ctx, 36, yPos + 20, 8, accent);
    drawEnergyOrb(ctx, 56, yPos + 20, 8, accent);

    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(card.attack1.name, 76, yPos + 24, CARD_W - 180);

    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(String(card.attack1.damage) + '+', CARD_W - 36, yPos + 24);
    ctx.textAlign = 'left';

    if (card.attack1.description) {
      ctx.font = '11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText(card.attack1.description, 36, yPos + a1h - 10, CARD_W - 80);
    }
  }

  // Rarity border
  ctx.save();
  roundRect(ctx, 0, 0, CARD_W, CARD_H, BORDER_R);
  ctx.strokeStyle = accent + '80';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();

  // Download
  const link = document.createElement('a');
  link.download = `${(card.name || 'card').replace(/\s+/g, '_')}_card.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/* Export a print sheet of multiple cards (2x4 grid) */
export async function exportPrintSheet(cards: CardData[]): Promise<void> {
  const cols = 2;
  const rows = 4;
  const gap = 12;
  const margin = 24;
  const sheetW = margin * 2 + cols * CARD_W + (cols - 1) * gap;
  const sheetH = margin * 2 + rows * CARD_H + (rows - 1) * gap;

  const canvas = document.createElement('canvas');
  canvas.width = sheetW;
  canvas.height = sheetH;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, sheetW, sheetH);

  // Draw cut guides
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([4, 4]);

  for (let r = 0; r <= rows; r++) {
    const y = margin + r * (CARD_H + gap) - gap / 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(sheetW, y);
    ctx.stroke();
  }
  for (let c = 0; c <= cols; c++) {
    const x = margin + c * (CARD_W + gap) - gap / 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, sheetH);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Render each card to its own canvas, then draw onto the sheet
  for (let i = 0; i < Math.min(cards.length, cols * rows); i++) {
    const card = cards[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = margin + col * (CARD_W + gap);
    const y = margin + row * (CARD_H + gap);

    // Create a temp canvas for this card
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = CARD_W;
    cardCanvas.height = CARD_H;
    const cardCtx = cardCanvas.getContext('2d')!;

    // Draw art
    if (card.imageDataUrl) {
      try {
        const img = await loadImage(card.imageDataUrl);
        const scale = Math.max(CARD_W / img.width, CARD_H / img.height);
        const sw = img.width * scale;
        const sh = img.height * scale;
        cardCtx.drawImage(img, (CARD_W - sw) / 2, (CARD_H - sh) / 2, sw, sh);
      } catch {
        cardCtx.fillStyle = '#1a1b23';
        cardCtx.fillRect(0, 0, CARD_W, CARD_H);
      }
    } else {
      cardCtx.fillStyle = '#1a1b23';
      cardCtx.fillRect(0, 0, CARD_W, CARD_H);
    }

    // Draw border
    roundRect(cardCtx, 0, 0, CARD_W, CARD_H, BORDER_R);
    cardCtx.strokeStyle = (TYPE_HEX[card.type] || '#6b7280') + '80';
    cardCtx.lineWidth = 4;
    cardCtx.stroke();

    ctx.drawImage(cardCanvas, x, y);
  }

  const link = document.createElement('a');
  link.download = 'cardforge_print_sheet.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
