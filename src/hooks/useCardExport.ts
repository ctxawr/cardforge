// v1.0 — ctxAWR: html2canvas capture of card preview element at print resolution
// Purpose: Export card at 744x1040px (300dpi equivalent for 63.5x88.9mm TCG standard)
import html2canvas from 'html2canvas';

export async function exportCardToPng(element: HTMLElement, cardName: string): Promise<void> {
  const canvas = await html2canvas(element, {
    width: 744,
    height: 1040,
    scale: 744 / element.offsetWidth,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
  });

  const link = document.createElement('a');
  link.download = `${cardName.replace(/\s+/g, '_')}_card.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
