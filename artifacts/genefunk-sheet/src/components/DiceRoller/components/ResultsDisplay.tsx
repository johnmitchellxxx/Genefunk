import { useEffect, useState } from 'react';
import type { RollResult } from '../types';

interface ResultsDisplayProps {
  results: RollResult[];
  onDismiss: () => void;
}

export function ResultsDisplay({ results, onDismiss }: ResultsDisplayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (results.length === 0) { setVisible(false); return; }
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, [results]);

  if (results.length === 0) return null;

  const total = results.reduce((s, r) => s + r.result, 0);
  const isMaxAll = results.every(r => r.result === r.dieType);

  return (
    <div
      className={`
        absolute inset-0 z-30 flex items-end justify-center pb-28 pointer-events-none
        transition-all duration-300
        ${visible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div
        onClick={(e) => { e.stopPropagation(); onDismiss(); }}
        style={{
          pointerEvents: visible ? 'auto' : 'none',
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
        }}
        className={`
          relative bg-card/95 backdrop-blur-md border px-8 py-6 shadow-2xl cursor-pointer
          transition-all duration-300
          ${visible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'}
          ${isMaxAll ? 'border-yellow-400/60 shadow-yellow-400/20' : 'border-primary/40 shadow-primary/10'}
        `}
      >
        {isMaxAll && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-black px-3 py-0.5 tracking-wide uppercase font-mono">
            Natural Max!
          </div>
        )}

        <div className="flex gap-4 flex-wrap justify-center mb-4">
          {results.map((r, i) => {
            const isMax = r.result === r.dieType;
            return (
              <div
                key={i}
                className={`flex flex-col items-center gap-0.5 ${isMax ? 'text-yellow-300' : 'text-foreground'}`}
              >
                <span
                  className={`
                    text-3xl font-black tabular-nums font-mono
                    ${isMax
                      ? 'drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]'
                      : 'drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]'}
                  `}
                >
                  {r.result}
                </span>
                <span className="text-xs text-muted-foreground font-mono">d{r.dieType}</span>
              </div>
            );
          })}
        </div>

        {results.length > 1 && (
          <div className="text-center border-t border-border pt-3">
            <span className="text-xs text-muted-foreground uppercase tracking-widest mr-2 font-mono">Total</span>
            <span className="text-2xl font-black text-primary drop-shadow-[0_0_10px_rgba(0,229,255,0.5)] font-mono">
              {total}
            </span>
          </div>
        )}

        <p className="text-center text-muted-foreground text-xs mt-3 font-mono">Click dice or here to dismiss</p>
      </div>
    </div>
  );
}
