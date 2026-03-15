import { useRef, useCallback } from 'react';
import { startTumbleSound, playThud, playChime } from '../utils/audioSynth';

export interface UseSoundReturn {
  startRolling: () => void;
  stopRolling: () => void;
  playSettle: (isMaxValue: boolean) => void;
}

export function useSound(): UseSoundReturn {
  const stopTumbleRef = useRef<(() => void) | null>(null);

  const startRolling = useCallback(() => {
    if (stopTumbleRef.current) {
      stopTumbleRef.current();
    }
    stopTumbleRef.current = startTumbleSound();
  }, []);

  const stopRolling = useCallback(() => {
    if (stopTumbleRef.current) {
      stopTumbleRef.current();
      stopTumbleRef.current = null;
    }
  }, []);

  const playSettle = useCallback((isMaxValue: boolean) => {
    playThud();
    if (isMaxValue) {
      setTimeout(playChime, 120);
    }
  }, []);

  return { startRolling, stopRolling, playSettle };
}
