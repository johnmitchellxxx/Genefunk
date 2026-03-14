import React, { useState } from 'react';
import { useDice, type DieType } from '@/hooks/use-dice';
import { RotateCcw, Dices, ExternalLink } from 'lucide-react';

const DIE_TYPES: DieType[] = [4, 6, 8, 10, 12, 20, 100];

const emptyCount = (): Record<DieType, number> =>
  Object.fromEntries(DIE_TYPES.map(d => [d, 0])) as Record<DieType, number>;

interface DiceRollerProps {
  onClose?: () => void;
}

export function DiceRoller({ onClose }: DiceRollerProps) {
  const { rollCustom, beyond20Active } = useDice();
  const [counts, setCounts] = useState<Record<DieType, number>>(emptyCount);

  const totalDice = Object.values(counts).reduce((a, b) => a + b, 0);

  const increment = (die: DieType) => {
    setCounts(prev => ({ ...prev, [die]: Math.min(prev[die] + 1, 20) }));
  };

  const handleClear = () => setCounts(emptyCount());

  const handleRoll = () => {
    if (totalDice === 0) return;
    const dice = DIE_TYPES.filter(d => counts[d] > 0).map(d => ({ sides: d, count: counts[d] }));
    rollCustom(dice, 0, 'Custom Roll');
    onClose?.();
    setCounts(emptyCount());
  };

  const mainDice = DIE_TYPES.filter(d => d !== 100);

  return (
    <div className="flex flex-col gap-3">
      {/* 2-column die grid */}
      <div className="grid grid-cols-2 gap-2">
        {mainDice.map(die => (
          <button
            key={die}
            onClick={() => increment(die)}
            className={`relative h-20 flex flex-col items-center justify-center transition-all duration-150 border-2 clip-edges select-none active:scale-95 ${
              counts[die] > 0
                ? 'border-primary bg-primary/20 shadow-[0_0_16px_rgba(0,255,255,0.35)] text-primary'
                : 'border-white/25 bg-white/5 hover:border-primary/70 hover:bg-primary/10 text-white/70 hover:text-white'
            }`}
            title={`Add a D${die}`}
          >
            <span className="font-mono font-black text-lg tracking-widest">D{die}</span>
            {counts[die] > 0 ? (
              <span className="absolute top-1 right-2 font-mono font-black text-2xl text-primary leading-none drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
                {counts[die]}
              </span>
            ) : (
              <span className="text-[10px] font-mono text-white/30 tracking-widest mt-0.5">click to add</span>
            )}
          </button>
        ))}
      </div>

      {/* D100 full-width */}
      <button
        onClick={() => increment(100)}
        className={`relative h-14 w-full flex items-center justify-center gap-3 transition-all duration-150 border-2 clip-edges select-none active:scale-95 ${
          counts[100] > 0
            ? 'border-primary bg-primary/20 shadow-[0_0_16px_rgba(0,255,255,0.35)] text-primary'
            : 'border-white/25 bg-white/5 hover:border-primary/70 hover:bg-primary/10 text-white/70 hover:text-white'
        }`}
        title="Add a D100"
      >
        <span className="font-mono font-black text-lg tracking-widest">D100</span>
        {counts[100] > 0 ? (
          <span className="font-mono font-black text-2xl text-primary drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
            ×{counts[100]}
          </span>
        ) : (
          <span className="text-[10px] font-mono text-white/30 tracking-widest">click to add</span>
        )}
      </button>

      {/* Summary line */}
      {totalDice > 0 && (
        <div className="text-center font-mono text-sm font-bold text-primary tracking-widest py-1">
          {DIE_TYPES.filter(d => counts[d] > 0)
            .map(d => `${counts[d]}d${d}`)
            .join(' + ')}
        </div>
      )}

      {/* Beyond20 status hint */}
      <div className={`text-[10px] font-mono px-2 py-1.5 rounded flex items-center gap-1.5 ${
        beyond20Active
          ? 'text-green-400 bg-green-500/10 border border-green-500/30'
          : 'text-muted-foreground/50 bg-white/3 border border-white/10'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${beyond20Active ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`} />
        {beyond20Active
          ? 'Beyond20 connected — rolls go to Roll20'
          : <span>Beyond20 not detected — <a href="https://beyond20.here-for-more.info" target="_blank" rel="noreferrer" className="underline hover:text-muted-foreground/80 inline-flex items-center gap-0.5">install & enable on this domain <ExternalLink className="w-2.5 h-2.5" /></a></span>
        }
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleRoll}
          disabled={totalDice === 0}
          className={`flex-1 flex items-center justify-center gap-2 py-3 font-mono text-sm font-black tracking-widest uppercase border-2 clip-edges transition-all ${
            totalDice > 0
              ? 'border-primary bg-primary/25 text-primary hover:bg-primary/40 shadow-[0_0_14px_rgba(0,255,255,0.25)] active:scale-95 cursor-pointer'
              : 'border-white/15 bg-white/5 text-white/25 cursor-not-allowed'
          }`}
        >
          <Dices className="w-4 h-4" />
          Roll
        </button>
        <button
          onClick={handleClear}
          className="flex items-center justify-center gap-1.5 px-4 py-3 font-mono text-sm font-bold tracking-widest uppercase border-2 border-white/25 bg-white/5 hover:border-white/50 hover:text-white text-white/50 clip-edges transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>
    </div>
  );
}
