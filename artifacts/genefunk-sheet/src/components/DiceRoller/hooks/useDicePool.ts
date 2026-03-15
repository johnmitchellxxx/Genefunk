import { useState, useCallback } from 'react';
import type { DieType } from '../types';

export interface DicePool {
  counts: Record<DieType, number>;
  increment: (dieType: DieType) => void;
  decrement: (dieType: DieType) => void;
  clear: () => void;
  loadDice: (dice: { sides: DieType; count: number }[]) => void;
  totalDice: number;
  expanded: DieType[];
}

const DIE_TYPES: DieType[] = [4, 6, 8, 10, 12, 20, 100];

function makeEmptyCounts(): Record<DieType, number> {
  return Object.fromEntries(DIE_TYPES.map(d => [d, 0])) as Record<DieType, number>;
}

export function useDicePool(): DicePool {
  const [counts, setCounts] = useState<Record<DieType, number>>(makeEmptyCounts);

  const increment = useCallback((dieType: DieType) => {
    setCounts(prev => ({ ...prev, [dieType]: Math.min(prev[dieType] + 1, 9) }));
  }, []);

  const decrement = useCallback((dieType: DieType) => {
    setCounts(prev => ({ ...prev, [dieType]: Math.max(prev[dieType] - 1, 0) }));
  }, []);

  const clear = useCallback(() => {
    setCounts(makeEmptyCounts());
  }, []);

  const loadDice = useCallback((dice: { sides: DieType; count: number }[]) => {
    const next = makeEmptyCounts();
    for (const { sides, count } of dice) {
      next[sides] = Math.min((next[sides] ?? 0) + count, 9);
    }
    setCounts(next);
  }, []);

  const expanded: DieType[] = DIE_TYPES.flatMap(d => Array(counts[d]).fill(d) as DieType[]);
  const totalDice = expanded.length;

  return { counts, increment, decrement, clear, loadDice, totalDice, expanded };
}

export { DIE_TYPES };
