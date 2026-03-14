import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatModifier } from '@/lib/rules';
import { D20Die } from '@/components/D20Die';
import { AnimatedDie } from '@/components/AnimatedDie';
import { sendRollToBeyond20, isBeyond20Available, onBeyond20Change } from '@/lib/beyond20';

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
  beyond20Active: boolean;
  setCharacterName: (name: string) => void;
}

const DiceContext = createContext<DiceContextType | undefined>(undefined);

export function useDice() {
  const context = useContext(DiceContext);
  if (!context) throw new Error("useDice must be used within a DiceProvider");
  return context;
}

export function DiceProvider({ children }: { children: ReactNode }) {
  const [d20Roll, setD20Roll] = useState<D20Roll | null>(null);
  const [d20Phase, setD20Phase] = useState<Phase>('done');
  const [customRoll, setCustomRoll] = useState<CustomRoll | null>(null);
  const [customPhase, setCustomPhase] = useState<Phase>('done');
  const [beyond20Active, setBeyond20Active] = useState(isBeyond20Available());
  const [characterName, setCharacterName] = useState('GeneFunk Character');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => onBeyond20Change(setBeyond20Active), []);

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

    const expr = modifier !== 0
      ? `1d20${modifier >= 0 ? '+' : ''}${modifier}`
      : '1d20';
    sendRollToBeyond20(name, expr, { characterName });

    const t1 = setTimeout(() => setD20Phase('result'), 1200);
    const t2 = setTimeout(() => dismissD20(), 30000);
    timersRef.current = [t1, t2];
  }, [clearTimers, dismissD20, characterName]);

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

    const expr = dice
      .filter(d => d.count > 0)
      .map(d => `${d.count}d${d.sides}`)
      .join('+') + (modifier !== 0 ? `${modifier >= 0 ? '+' : ''}${modifier}` : '');
    sendRollToBeyond20(name, expr, { characterName });

    setCustomRoll(roll);
    setCustomPhase('tumble');
    const t1 = setTimeout(() => setCustomPhase('result'), 1000);
    const t2 = setTimeout(() => dismissCustom(), 30000);
    timersRef.current = [t1, t2];
  }, [clearTimers, dismissCustom, characterName]);

  // Flatten the rolled dice into individual entries with an index for direction variance
  const flatDice = customRoll
    ? customRoll.dice.flatMap(group => group.values.map(val => ({ sides: group.sides, value: val })))
    : [];

  return (
    <DiceContext.Provider value={{ rollDice, rollCustom, beyond20Active, setCharacterName }}>
      {children}

      {/* ── D20 Roll Overlay ── */}
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
                      {d20Roll.isCritSuccess && (
                        <div className="absolute -top-3 bg-secondary text-secondary-foreground px-3 py-0.5 text-xs font-bold tracking-widest uppercase clip-edges">
                          Critical Success
                        </div>
                      )}
                      {d20Roll.isCritFail && (
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

      {/* ── Custom Dice Roll Overlay ── */}
      <AnimatePresence>
        {customRoll && customPhase !== 'done' && (
          <motion.div
            key={customRoll.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center cursor-pointer gap-6"
            onClick={dismissCustom}
          >
            <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />

            {/* Dice shapes — one per individual die rolled */}
            <div className="relative z-10 flex flex-wrap justify-center gap-4 max-w-sm">
              {flatDice.map((die, i) => (
                <AnimatedDie
                  key={i}
                  sides={die.sides}
                  value={die.value}
                  phase={customPhase === 'tumble' ? 'tumble' : 'result'}
                  index={i}
                />
              ))}
            </div>

            {/* Result card — appears after tumble */}
            <div className="relative z-10">
              <AnimatePresence>
                {customPhase === 'result' && (
                  <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                  >
                    <div className="bg-card border-2 border-primary p-5 clip-edges shadow-2xl flex flex-col items-center min-w-[180px]">
                      <div className="text-primary text-xs font-mono tracking-widest uppercase mb-3">{customRoll.name}</div>
                      {customRoll.modifier !== 0 && (
                        <div className="text-muted-foreground text-sm font-mono mb-1">{formatModifier(customRoll.modifier)}</div>
                      )}
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-3" />
                      <div className="text-4xl font-bold text-primary font-mono">{customRoll.total}</div>
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
