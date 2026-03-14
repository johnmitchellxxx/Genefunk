import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatModifier } from '@/lib/rules';
import { D20Die } from '@/components/D20Die';

export type DieType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

type D20Roll = {
  id: string;
  name: string;
  d20: number;
  modifier: number;
  total: number;
  isCritSuccess: boolean;
  isCritFail: boolean;
};

type CustomRollDie = {
  sides: DieType;
  values: number[];
};

type CustomRoll = {
  id: string;
  name: string;
  dice: CustomRollDie[];
  modifier: number;
  total: number;
};

type Phase = 'tumble' | 'result' | 'done';

interface DiceContextType {
  rollDice: (name: string, modifier: number) => void;
  rollCustom: (dice: { sides: DieType; count: number }[], modifier: number, name: string) => void;
}

const DiceContext = createContext<DiceContextType | undefined>(undefined);

export function useDice() {
  const context = useContext(DiceContext);
  if (!context) throw new Error("useDice must be used within a DiceProvider");
  return context;
}

function SpinningDie({ sides }: { sides: DieType }) {
  const [display, setDisplay] = useState(1);
  useEffect(() => {
    const iv = setInterval(() => setDisplay(Math.floor(Math.random() * sides) + 1), 55);
    return () => clearInterval(iv);
  }, [sides]);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-[10px] text-primary font-mono uppercase tracking-widest">D{sides}</div>
      <div className="w-12 h-12 border-2 border-primary bg-primary/10 flex items-center justify-center font-mono text-xl font-black text-primary clip-edges">
        {display}
      </div>
    </div>
  );
}

export function DiceProvider({ children }: { children: ReactNode }) {
  const [d20Roll, setD20Roll] = useState<D20Roll | null>(null);
  const [d20Phase, setD20Phase] = useState<Phase>('done');
  const [customRoll, setCustomRoll] = useState<CustomRoll | null>(null);
  const [customPhase, setCustomPhase] = useState<Phase>('done');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const dismissD20 = useCallback(() => {
    clearTimers();
    setD20Phase('done');
    const t = setTimeout(() => setD20Roll(null), 300);
    timersRef.current = [t];
  }, [clearTimers]);

  const dismissCustom = useCallback(() => {
    clearTimers();
    setCustomPhase('done');
    const t = setTimeout(() => setCustomRoll(null), 300);
    timersRef.current = [t];
  }, [clearTimers]);

  const rollDice = useCallback((name: string, modifier: number) => {
    clearTimers();
    setCustomPhase('done');
    setCustomRoll(null);

    const d20 = Math.floor(Math.random() * 20) + 1;
    const roll: D20Roll = {
      id: Math.random().toString(36).substr(2, 9),
      name, d20, modifier,
      total: d20 + modifier,
      isCritSuccess: d20 === 20,
      isCritFail: d20 === 1,
    };

    setD20Roll(roll);
    setD20Phase('tumble');
    const t1 = setTimeout(() => setD20Phase('result'), 1200);
    const t2 = setTimeout(() => dismissD20(), 5200);
    timersRef.current = [t1, t2];
  }, [clearTimers, dismissD20]);

  const rollCustom = useCallback((dice: { sides: DieType; count: number }[], modifier: number, name: string) => {
    clearTimers();
    setD20Phase('done');
    setD20Roll(null);

    const rolledDice: CustomRollDie[] = dice
      .filter(d => d.count > 0)
      .map(d => ({
        sides: d.sides,
        values: Array.from({ length: d.count }, () => Math.floor(Math.random() * d.sides) + 1),
      }));

    const diceTotal = rolledDice.reduce((sum, d) => sum + d.values.reduce((s, v) => s + v, 0), 0);

    const roll: CustomRoll = {
      id: Math.random().toString(36).substr(2, 9),
      name, dice: rolledDice, modifier,
      total: diceTotal + modifier,
    };

    setCustomRoll(roll);
    setCustomPhase('tumble');
    const t1 = setTimeout(() => setCustomPhase('result'), 1000);
    const t2 = setTimeout(() => dismissCustom(), 5500);
    timersRef.current = [t1, t2];
  }, [clearTimers, dismissCustom]);

  return (
    <DiceContext.Provider value={{ rollDice, rollCustom }}>
      {children}

      {/* D20 Roll Overlay */}
      <AnimatePresence>
        {d20Roll && d20Phase !== 'done' && (
          <motion.div
            key={d20Roll.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center cursor-pointer"
            onClick={dismissD20}
          >
            <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
            <div className="relative flex flex-col items-center z-10">
              <D20Die
                value={d20Roll.d20}
                isCritSuccess={d20Roll.isCritSuccess}
                isCritFail={d20Roll.isCritFail}
                phase={d20Phase === 'tumble' ? 'tumble' : 'result'}
              />
              <AnimatePresence>
                {d20Phase === 'result' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="mt-6"
                  >
                    <div className="bg-card border-2 border-primary p-6 clip-edges shadow-2xl flex flex-col items-center min-w-[200px] relative">
                      <div className="text-primary text-sm font-mono tracking-widest uppercase mb-2">{d20Roll.name}</div>
                      <div className="flex items-center gap-4 text-4xl font-mono mb-2">
                        <span className={d20Roll.isCritSuccess ? "text-secondary font-bold" : d20Roll.isCritFail ? "text-destructive font-bold" : "text-foreground"}>
                          {d20Roll.d20}
                        </span>
                        <span className="text-muted-foreground text-xl">{formatModifier(d20Roll.modifier)}</span>
                      </div>
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent my-2" />
                      <div className="text-3xl font-bold text-primary">{d20Roll.total}</div>
                      {d20Roll.isCritSuccess && <div className="absolute -top-3 bg-secondary text-secondary-foreground px-3 py-0.5 text-xs font-bold tracking-widest uppercase clip-edges">Critical Success</div>}
                      {d20Roll.isCritFail && <div className="absolute -top-3 bg-destructive text-destructive-foreground px-3 py-0.5 text-xs font-bold tracking-widest uppercase clip-edges">Critical Failure</div>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Dice Roll Overlay */}
      <AnimatePresence>
        {customRoll && customPhase !== 'done' && (
          <motion.div
            key={customRoll.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex items-center justify-center cursor-pointer"
            onClick={dismissCustom}
          >
            <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              {/* Tumble phase: spinning dice */}
              <AnimatePresence mode="wait">
                {customPhase === 'tumble' && (
                  <motion.div
                    key="tumble"
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-wrap justify-center gap-4 max-w-xs"
                  >
                    {customRoll.dice.flatMap(d =>
                      d.values.map((_, i) => <SpinningDie key={`${d.sides}-${i}`} sides={d.sides} />)
                    )}
                  </motion.div>
                )}

                {/* Result phase: final values */}
                {customPhase === 'result' && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-card border-2 border-primary p-6 clip-edges shadow-2xl flex flex-col items-center min-w-[220px] relative">
                      <div className="text-primary text-sm font-mono tracking-widest uppercase mb-4">{customRoll.name}</div>

                      <div className="flex flex-wrap justify-center gap-3 mb-4">
                        {customRoll.dice.map(group => (
                          <div key={group.sides} className="flex flex-col items-center gap-1">
                            <div className="text-[9px] text-primary font-mono uppercase tracking-widest">D{group.sides}</div>
                            <div className="flex gap-1.5 flex-wrap justify-center">
                              {group.values.map((val, i) => (
                                <div
                                  key={i}
                                  className={`w-10 h-10 border-2 flex items-center justify-center font-mono font-black text-sm clip-edges ${
                                    val === group.sides ? 'border-secondary bg-secondary/20 text-secondary' :
                                    val === 1 ? 'border-destructive bg-destructive/20 text-destructive' :
                                    'border-border bg-card/80 text-foreground'
                                  }`}
                                >
                                  {val}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {customRoll.modifier !== 0 && (
                        <div className="text-muted-foreground text-sm font-mono mb-2">{formatModifier(customRoll.modifier)}</div>
                      )}

                      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent my-2" />
                      <div className="text-3xl font-bold text-primary">{customRoll.total}</div>
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
