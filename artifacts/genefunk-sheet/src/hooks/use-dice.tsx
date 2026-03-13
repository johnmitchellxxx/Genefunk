import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatModifier } from '@/lib/rules';

type Roll = {
  id: string;
  name: string;
  d20: number;
  modifier: number;
  total: number;
  isCritSuccess: boolean;
  isCritFail: boolean;
};

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

  const rollDice = (name: string, modifier: number) => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    setCurrentRoll({
      id: Math.random().toString(36).substr(2, 9),
      name,
      d20,
      modifier,
      total: d20 + modifier,
      isCritSuccess: d20 === 20,
      isCritFail: d20 === 1
    });

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setCurrentRoll(prev => prev?.id === currentRoll?.id ? null : prev);
    }, 4000);
  };

  return (
    <DiceContext.Provider value={{ rollDice }}>
      {children}
      <AnimatePresence>
        {currentRoll && (
          <motion.div
            key={currentRoll.id}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="bg-card border-2 border-primary p-6 clip-edges neon-border shadow-2xl flex flex-col items-center justify-center min-w-[200px]">
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
    </DiceContext.Provider>
  );
}
