/* ImageCropper.tsx — Luminous Forge v1.4 */
/* ctxAWR: Crop uploaded photo to select subject, 5:7 aspect ratio for TCG cards */
import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { Crop, ZoomIn, ZoomOut, RotateCw, Check, X } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = reject;
    image.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height
  );

  return canvas.toDataURL('image/png');
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = useCallback((_: unknown, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    const croppedDataUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedDataUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Crop className="w-4 h-4 text-primary" />
        <span className="text-sm font-black text-on-surface-variant uppercase tracking-widest">Crop Your Subject</span>
      </div>

      <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ height: '400px' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={5 / 7}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropChange}
          cropShape="rect"
          showGrid
          style={{
            containerStyle: { borderRadius: '1rem' },
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-3 bg-surface-container-low rounded-xl p-3">
          <ZoomOut className="w-4 h-4 text-outline shrink-0" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="flex-1 h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary"
          />
          <ZoomIn className="w-4 h-4 text-outline shrink-0" />
        </div>
        <button
          onClick={() => setRotation(r => (r + 90) % 360)}
          className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all"
          title="Rotate 90°"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 bg-surface-container-high text-on-surface py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all"
        >
          <X className="w-4 h-4" /> Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="flex-1 luminous-forge text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
        >
          <Check className="w-4 h-4" /> Confirm Crop
        </button>
      </div>
    </div>
  );
}
