/* FramePicker.tsx — Card frame selection UI v1.0 */
/* ctxAWR: tabbed style groups + scrollable frame thumbnails with live selection */
import { useState } from 'react';
import { FRAME_STYLES, type FrameTemplate } from '../data/frames';

interface Props {
  selectedId: string;
  onSelect: (frame: FrameTemplate) => void;
}

export default function FramePicker({ selectedId, onSelect }: Props) {
  const [activeStyle, setActiveStyle] = useState(FRAME_STYLES[0].id);
  const styleGroup = FRAME_STYLES.find(s => s.id === activeStyle) ?? FRAME_STYLES[0];

  return (
    <div className="space-y-4">
      {/* Style tabs */}
      <div className="flex flex-wrap gap-2">
        {FRAME_STYLES.map(style => (
          <button
            key={style.id}
            onClick={() => setActiveStyle(style.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeStyle === style.id
                ? `luminous-forge text-white shadow-md shadow-primary/25`
                : `bg-surface-container text-on-surface-variant hover:bg-surface-container-high`
            }`}
          >
            <span>{style.icon}</span>
            <span>{style.label}</span>
            <span className="opacity-60">({style.frames.length})</span>
          </button>
        ))}
      </div>

      {/* Frame grid */}
      <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
        {styleGroup.frames.map(frame => (
          <button
            key={frame.id}
            onClick={() => onSelect(frame)}
            className={`relative group rounded-xl overflow-hidden transition-all border-2 ${
              selectedId === frame.id
                ? 'border-primary shadow-md shadow-primary/30 scale-105'
                : 'border-transparent hover:border-outline-variant hover:scale-102'
            }`}
            title={frame.label}
          >
            <img
              src={frame.thumbnail}
              alt={frame.label}
              className="w-full aspect-[500/670] object-cover bg-surface-container"
            />
            {selectedId === frame.id && (
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-[8px] font-bold text-center truncate">{frame.label}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
