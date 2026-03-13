import React, { useState } from 'react';
import { CyberButton } from '@/components/CyberUI';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, RotateCcw } from 'lucide-react';

const DIE_TYPES = [4, 6, 8, 10, 12, 20, 100] as const;
type DieType = typeof DIE_TYPES[number];

type DieResult = {
  die: DieType;
  value: number;
};

type RollResult = {
  id: string;
  results: DieResult[];
  total: number;
};

function rollDie(sides: DieType): number {
  return Math.floor(Math.random() * sides) + 1;
}

function rollCustomDice(counts: Record<DieType, number>): RollResult {
  const results: DieResult[] = [];
  for (const die of DIE_TYPES) {
    const count = counts[die] || 0;
    for (let i = 0; i < count; i++) {
      results.push({ die, value: rollDie(die) });
    }
  }
  return {
    id: Math.random().toString(36).substr(2, 9),
    results,
    total: results.reduce((sum, r) => sum + r.value, 0),
  };
}

export function DiceRoller() {
  const [counts, setCounts] = useState<Record<DieType, number>>(
    () => Object.fromEntries(DIE_TYPES.map(d => [d, 0])) as Record<DieType, number>
  );
  const [rollResult, setRollResult] = useState<RollResult | null>(null);

  const totalDice = Object.values(counts).reduce((a, b) => a + b, 0);

  const increment = (die: DieType) => {
    setCounts(prev => ({ ...prev, [die]: Math.min(prev[die] + 1, 20) }));
  };

  const decrement = (die: DieType) => {
    setCounts(prev => ({ ...prev, [die]: Math.max(prev[die] - 1, 0) }));
  };

  const handleRoll = () => {
    if (totalDice === 0) return;
    const result = rollCustomDice(counts);
    setRollResult(result);
  };

  const handleClear = () => {
    setRollResult(null);
    setCounts(Object.fromEntries(DIE_TYPES.map(d => [d, 0])) as Record<DieType, number>);
  };

  const resultsByDie = rollResult
    ? DIE_TYPES.reduce((acc, die) => {
        const dieResults = rollResult.results.filter(r => r.die === die);
        if (dieResults.length > 0) acc.push({ die, values: dieResults.map(r => r.value) });
        return acc;
      }, [] as { die: DieType; values: number[] }[])
    : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {DIE_TYPES.map(die => (
          <div
            key={die}
            className={`flex items-center justify-between bg-background/50 border px-3 py-2 clip-edges transition-colors ${
              counts[die] > 0 ? 'border-primary' : 'border-border'
            }`}
          >
            <span className={`font-mono text-sm font-bold tracking-wider ${counts[die] > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
              D{die}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => decrement(die)}
                disabled={counts[die] === 0}
                className="w-6 h-6 flex items-center justify-center text-sm font-bold bg-destructive/20 text-destructive rounded hover:bg-destructive hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                −
              </button>
              <span className="w-5 text-center font-mono text-sm font-bold text-foreground">
                {counts[die]}
              </span>
              <button
                onClick={() => increment(die)}
                className="w-6 h-6 flex items-center justify-center text-sm font-bold bg-primary/20 text-primary rounded hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <CyberButton
          onClick={handleRoll}
          disabled={totalDice === 0}
          className={`flex-1 flex items-center justify-center gap-2 ${totalDice === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <Dices className="w-4 h-4" />
          Roll {totalDice > 0 ? `${totalDice} ${totalDice === 1 ? 'die' : 'dice'}` : ''}
        </CyberButton>
        <CyberButton
          variant="ghost"
          onClick={handleClear}
          className="flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear
        </CyberButton>
      </div>

      <AnimatePresence mode="wait">
        {rollResult && (
          <motion.div
            key={rollResult.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-background/60 border border-primary/40 clip-edges p-4 space-y-3"
          >
            {resultsByDie.map(group => (
              <div key={group.die}>
                <div className="text-xs text-primary uppercase tracking-widest font-mono font-bold mb-1">
                  D{group.die}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.values.map((val, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center justify-center w-9 h-9 font-mono text-sm font-bold clip-edges border ${
                        val === group.die
                          ? 'bg-secondary/20 border-secondary text-secondary'
                          : val === 1
                          ? 'bg-destructive/20 border-destructive text-destructive'
                          : 'bg-card border-border text-foreground'
                      }`}
                    >
                      {val}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Total</span>
              <span className="text-3xl font-bold text-primary font-mono">
                {rollResult.total}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
