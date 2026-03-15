import { useEffect, useState } from 'react';
import type { RollResult, DieType } from '../types';

interface ResultsDisplayProps {
  results: RollResult[];
  label?: string;
  modifier?: number;
  onDismiss: () => void;
}

function buildPoolString(results: RollResult[]): string {
  const counts: Partial<Record<DieType, number>> = {};
  results.forEach(r => { counts[r.dieType] = (counts[r.dieType] ?? 0) + 1; });
  return Object.entries(counts)
    .map(([sides, n]) => `${n}d${sides}`)
    .join('+');
}

export function ResultsDisplay({ results, label, modifier = 0, onDismiss }: ResultsDisplayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (results.length === 0) { setVisible(false); return; }
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, [results]);

  if (results.length === 0) return null;

  const rawTotal = results.reduce((s, r) => s + r.result, 0);
  const finalTotal = rawTotal + modifier;
  const isMaxAll = results.every(r => r.result === r.dieType);
  const poolStr = buildPoolString(results);

  const parts = results.map(r => String(r.result));
  // Don't prefix positive modifiers with '+' — join('+') already adds the separator.
  // Negative modifiers carry their own '-' sign; replace '+-' with '−' for readability.
  if (modifier !== 0) parts.push(String(modifier));
  const formula = parts.join('+').replace('+-', '−');

  return (
    <div
      className={`
        absolute bottom-0 left-0 right-0 z-30 flex justify-center pb-4 pointer-events-none
        transition-all duration-300
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}
      `}
    >
      <div
        onClick={e => { e.stopPropagation(); onDismiss(); }}
        className={`
          mx-4 w-full max-w-sm rounded-2xl cursor-pointer
          bg-zinc-900/95 backdrop-blur-md border shadow-2xl
          transition-all duration-300
          ${isMaxAll ? 'border-yellow-400/50 shadow-yellow-400/20' : 'border-white/10 shadow-black/40'}
        `}
        style={{ pointerEvents: visible ? 'auto' : 'none' }}
      >
        {isMaxAll && (
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-[10px] font-black px-3 py-0.5 rounded-full tracking-wide uppercase font-mono whitespace-nowrap">
            Natural Max!
          </div>
        )}

        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1 min-w-0">
            {label && (
              <div className="text-[9px] font-mono tracking-widest uppercase text-primary/80 mb-0.5">
                {label}
              </div>
            )}
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-white font-mono font-bold text-base leading-none">
                {formula}
              </span>
              <span className="text-zinc-400 font-mono text-base leading-none">=</span>
              <span
                className={`text-2xl font-black font-mono leading-none tabular-nums
                  ${isMaxAll
                    ? 'text-yellow-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]'
                    : 'text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]'}
                `}
              >
                {finalTotal}
              </span>
            </div>
            <div className="text-[9px] text-zinc-500 font-mono mt-0.5 truncate">
              {poolStr}{modifier !== 0 ? ` ${modifier > 0 ? `+${modifier}` : modifier}` : ''}
            </div>
          </div>

          <div className="text-zinc-600 text-[9px] font-mono text-right shrink-0 leading-snug">
            tap to<br />dismiss
          </div>
        </div>
      </div>
    </div>
  );
}
