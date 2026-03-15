import { useState, useRef, type ReactElement } from 'react';
import type { DieType } from '../types';

interface FloatingTrayProps {
  counts: Record<DieType, number>;
  onIncrement: (d: DieType) => void;
  onDecrement: (d: DieType) => void;
  onRoll: () => void;
  onClear: () => void;
  onCustomize: () => void;
  totalDice: number;
  rolling: boolean;
}

const TRAY_ORDER: DieType[] = [4, 6, 8, 100, 10, 12, 20];

const DIE_LABELS: Record<DieType, string> = {
  4: 'D4', 6: 'D6', 8: 'D8', 10: 'D10', 12: 'D12', 20: 'D20', 100: 'D100',
};

const DIE_PATHS: Record<DieType, ReactElement> = {
  4: <polygon points="12,3 22,21 2,21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />,
  6: <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />,
  8: <polygon points="12,2 22,12 12,22 2,12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />,
  10: (
    <>
      <polygon points="12,2 20,9 17,21 7,21 4,9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="12" y1="2" x2="12" y2="21" stroke="currentColor" strokeWidth="1" opacity="0.45" />
    </>
  ),
  12: <polygon points="12,2 19.5,6.5 22,14 17,21 7,21 2,14 4.5,6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />,
  20: (
    <>
      <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <polygon points="12,2 22,8 12,11" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.45" strokeLinejoin="round" />
    </>
  ),
  100: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold" fontFamily="monospace">%</text>
    </>
  ),
};

const D20_PATH = (
  <>
    <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <polygon points="12,2 22,8 12,11" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" strokeLinejoin="round" />
  </>
);

export function FloatingTray({
  counts, onIncrement, onDecrement, onRoll, onClear, onCustomize, totalDice, rolling,
}: FloatingTrayProps) {
  const [open, setOpen] = useState(false);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onClear();
  };

  const startLongPress = (dieType: DieType) => {
    longPressRef.current = setTimeout(() => {
      onDecrement(dieType);
      longPressRef.current = null;
    }, 400);
  };

  const cancelLongPress = () => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  };

  const handleDieTap = (dieType: DieType) => {
    if (longPressRef.current !== null) return;
    onIncrement(dieType);
  };

  const handleRoll = () => {
    onRoll();
    setOpen(false);
  };

  return (
    <div
      className="fixed bottom-6 right-4 z-20 flex flex-col items-center gap-2.5"
      style={{ pointerEvents: 'auto' }}
    >
      {open && (
        <>
          {/* Die column — D4 at top, D20 nearest FAB */}
          <div className="flex flex-col items-center gap-2 animate-in slide-in-from-bottom-4 fade-in duration-200">
            {TRAY_ORDER.slice().reverse().map(dieType => {
              const count = counts[dieType];
              const active = count > 0;
              return (
                <div key={dieType} className="flex flex-col items-center gap-0.5">
                  <button
                    onPointerDown={() => startLongPress(dieType)}
                    onPointerUp={() => { cancelLongPress(); handleDieTap(dieType); }}
                    onPointerLeave={cancelLongPress}
                    onContextMenu={e => { e.preventDefault(); onDecrement(dieType); }}
                    title={`${DIE_LABELS[dieType]} — tap to add, hold to remove`}
                    className={`
                      relative w-[52px] h-[52px] rounded-full flex items-center justify-center
                      transition-all duration-150 shadow-lg
                      ${active
                        ? 'bg-zinc-700/95 text-white scale-110 shadow-xl'
                        : 'bg-zinc-900/95 text-zinc-300 hover:text-white hover:bg-zinc-800/95'}
                      border border-white/10
                    `}
                  >
                    <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]">
                      {DIE_PATHS[dieType]}
                    </svg>
                    {active && (
                      <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] font-black w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none shadow-sm">
                        {count}
                      </span>
                    )}
                  </button>
                  <span className="text-[9px] text-zinc-400 font-mono tracking-wide leading-none">
                    {DIE_LABELS[dieType]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Roll pill — only when dice are selected */}
          {totalDice > 0 && (
            <button
              onClick={handleRoll}
              disabled={rolling}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm tracking-wide
                transition-all duration-150 shadow-lg active:scale-95
                ${rolling
                  ? 'bg-primary/40 text-primary/60 cursor-not-allowed'
                  : 'bg-primary text-black hover:brightness-110 shadow-primary/40'}
              `}
            >
              {rolling ? '…' : `Roll ${totalDice}d`}
            </button>
          )}

          {/* Customize tiny link */}
          <button
            onClick={onCustomize}
            className="text-[9px] text-zinc-500 hover:text-zinc-300 font-mono tracking-widest uppercase transition-colors"
          >
            Customize
          </button>

          {/* X close button */}
          <button
            onClick={handleClose}
            className="w-[52px] h-[52px] rounded-full bg-zinc-900/95 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800/95 flex items-center justify-center shadow-lg transition-all duration-150 text-xl"
            aria-label="Close dice tray"
          >
            ✕
          </button>
        </>
      )}

      {!open && (
        <button
          onClick={handleOpen}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/40 hover:brightness-110 active:scale-95 transition-all duration-150"
          aria-label="Open dice tray"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-black">
            {D20_PATH}
          </svg>
        </button>
      )}
    </div>
  );
}
