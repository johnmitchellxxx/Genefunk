import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatModifier } from '@/lib/rules';
import { D20Die } from '@/components/D20Die';

type Roll = {
  id: string;
  name: string;
  d20: number;
  modifier: number;
  total: number;
  isCritSuccess: boolean;
  isCritFail: boolean;
};

type Phase = 'tumble' | 'result' | 'done';

interface DiceContextType {
  rollDice: (name: string, modifier: number) => void;
}

const DiceContext = createContext<DiceContextType | undefined>(undefined);

export function useDice() {
  const context = useContext(DiceContext);
  if (!context) throw new Error("useDice must be used within a DiceProvider");
  return context;
}

export function DiceProvider({ children }: { children: ReactNode }) {
  const [currentRoll, setCurrentRoll] = useState<Roll | null>(null);
  const [phase, setPhase] = useState<Phase>('done');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const activeRollIdRef = useRef<string | null>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const dismiss = useCallback(() => {
    clearTimers();
    const rollId = activeRollIdRef.current;
    setPhase('done');
    const t = setTimeout(() => {
      setCurrentRoll(prev => prev?.id === rollId ? null : prev);
    }, 300);
    timersRef.current = [t];
  }, [clearTimers]);

  const rollDice = useCallback((name: string, modifier: number) => {
    clearTimers();

    const d20 = Math.floor(Math.random() * 20) + 1;
    const roll: Roll = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      d20,
      modifier,
      total: d20 + modifier,
      isCritSuccess: d20 === 20,
      isCritFail: d20 === 1,
    };

    activeRollIdRef.current = roll.id;
    setCurrentRoll(roll);
    setPhase('tumble');

    const t1 = setTimeout(() => setPhase('result'), 1200);
    const t2 = setTimeout(() => dismiss(), 5200);
    timersRef.current = [t1, t2];
  }, [clearTimers, dismiss]);

  return (
    <DiceContext.Provider value={{ rollDice }}>
      {children}
      <AnimatePresence>
        {currentRoll && phase !== 'done' && (
          <motion.div
            key={currentRoll.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={dismiss}
            style={{ cursor: 'pointer' }}
          >
            <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />

            <div className="relative flex flex-col items-center z-10">
              <D20Die
                value={currentRoll.d20}
                isCritSuccess={currentRoll.isCritSuccess}
                isCritFail={currentRoll.isCritFail}
                phase={phase === 'tumble' ? 'tumble' : 'result'}
              />

              <AnimatePresence>
                {phase === 'result' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="mt-6"
                  >
                    <div className="bg-card border-2 border-primary p-6 clip-edges neon-border shadow-2xl flex flex-col items-center justify-center min-w-[200px] relative">
                      <div className="text-primary text-sm font-mono tracking-widest uppercase mb-2">
                        {currentRoll.name}
                      </div>

                      <div className="flex items-center justify-center gap-4 text-4xl font-mono mb-2">
                        <span className={currentRoll.isCritSuccess ? "text-secondary font-bold" : currentRoll.isCritFail ? "text-destructive font-bold" : "text-foreground"}>
                          {currentRoll.d20}
                        </span>
                        <span className="text-muted-foreground text-xl">
                          {formatModifier(currentRoll.modifier)}
                        </span>
                      </div>

                      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent my-2" />

                      <div className="text-3xl font-bold text-primary font-sans">
                        {currentRoll.total}
                      </div>

                      {currentRoll.isCritSuccess && (
                        <div className="absolute -top-3 bg-secondary text-secondary-foreground px-3 py-0.5 text-xs font-bold tracking-widest uppercase clip-edges">
                          Critical Success
                        </div>
                      )}
                      {currentRoll.isCritFail && (
                        <div className="absolute -top-3 bg-destructive text-destructive-foreground px-3 py-0.5 text-xs font-bold tracking-widest uppercase clip-edges">
                          Critical Failure
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DiceContext.Provider>
  );
}
