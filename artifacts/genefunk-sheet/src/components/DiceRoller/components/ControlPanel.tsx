import type { ReactElement } from 'react';
import type { DieType } from '../types';
import { DIE_TYPES } from '../hooks/useDicePool';

interface ControlPanelProps {
  counts: Record<DieType, number>;
  onIncrement: (d: DieType) => void;
  onDecrement: (d: DieType) => void;
  onRoll: () => void;
  onClear: () => void;
  onCustomize: () => void;
  totalDice: number;
  rolling: boolean;
}

const DIE_LABELS: Record<DieType, string> = {
  4: 'd4', 6: 'd6', 8: 'd8', 10: 'd10', 12: 'd12', 20: 'd20', 100: 'd%',
};

const DIE_PATHS: Record<DieType, ReactElement> = {
  4: <polygon points="12,2 22,20 2,20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
  6: <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />,
  8: <polygon points="12,2 22,12 12,22 2,12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
  10: (
    <>
      <polygon points="12,2 20,8 17,20 7,20 4,8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="12" y1="2" x2="12" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </>
  ),
  12: <polygon points="12,2 19,6 22,13 17,20 7,20 2,13 5,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
  20: (
    <>
      <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points="12,2 22,8 12,12" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" strokeLinejoin="round" />
    </>
  ),
  100: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="12" y="15.5" textAnchor="middle" fontSize="7" fill="currentColor" fontWeight="bold">%</text>
    </>
  ),
};

export function ControlPanel({
  counts, onIncrement, onDecrement, onRoll, onClear, onCustomize, totalDice, rolling,
}: ControlPanelProps) {
  return (
    <div
      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="bg-card/95 backdrop-blur-md border border-primary/30 p-3 flex flex-col gap-2 shadow-xl shadow-primary/10"
        style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
      >
        {DIE_TYPES.map(dieType => {
          const count = counts[dieType];
          const active = count > 0;
          return (
            <div key={dieType} className="flex items-center gap-1">
              <button
                onClick={() => onIncrement(dieType)}
                onContextMenu={e => { e.preventDefault(); onDecrement(dieType); }}
                title={`${DIE_LABELS[dieType]} — left click to add, right click to remove`}
                className={`
                  relative w-11 h-11 flex items-center justify-center transition-all duration-150
                  ${active
                    ? 'bg-primary/20 text-primary shadow-lg shadow-primary/30 scale-105 border border-primary/60'
                    : 'bg-background/60 text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border'}
                `}
                style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  {DIE_PATHS[dieType]}
                </svg>
                {active && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-background text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {count}
                  </span>
                )}
              </button>
              <span className="text-muted-foreground text-[10px] font-mono w-5">{DIE_LABELS[dieType]}</span>
            </div>
          );
        })}

        <div className="border-t border-border my-1" />

        <button
          onClick={onRoll}
          disabled={totalDice === 0 || rolling}
          className={`
            w-full py-2 font-mono font-bold text-sm tracking-widest uppercase transition-all duration-150
            ${totalDice > 0 && !rolling
              ? 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary/60 shadow-[0_0_12px_rgba(0,229,255,0.2)] active:scale-95'
              : 'bg-background/40 text-muted-foreground border border-border cursor-not-allowed'}
          `}
          style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
        >
          {rolling ? '…' : `Roll${totalDice > 0 ? ` (${totalDice})` : ''}`}
        </button>

        <button
          onClick={onClear}
          disabled={totalDice === 0 && !rolling}
          className="w-full py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-border/30 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Clear
        </button>

        <button
          onClick={onCustomize}
          className="w-full py-1.5 text-xs font-mono text-primary/70 hover:text-primary hover:bg-primary/10 transition-all duration-150 flex items-center justify-center gap-1"
        >
          <span>✦</span> Customize
        </button>
      </div>
    </div>
  );
}
