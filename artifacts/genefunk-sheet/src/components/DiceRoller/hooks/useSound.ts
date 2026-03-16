import { useRef, useCallback } from 'react';
import { startDiceRoll, playDiceSettle } from '../utils/audioSynth';

export interface UseSoundReturn {
  startRolling: (dicePool: number[]) => void;
  stopRolling: () => void;
  playSettle: (isMaxValue: boolean, dicePool: number[]) => void;
}

export function useSound(): UseSoundReturn {
  const stopRollRef = useRef<(() => void) | null>(null);

  const startRolling = useCallback((dicePool: number[]) => {
    if (stopRollRef.current) {
      stopRollRef.current();
    }
    stopRollRef.current = startDiceRoll(dicePool);
  }, []);

  const stopRolling = useCallback(() => {
    if (stopRollRef.current) {
      stopRollRef.current();
      stopRollRef.current = null;
    }
  }, []);

  const playSettle = useCallback((isMaxValue: boolean, dicePool: number[]) => {
    stopRollRef.current?.();
    stopRollRef.current = null;
    playDiceSettle(dicePool, isMaxValue);
  }, []);

  return { startRolling, stopRolling, playSettle };
}
