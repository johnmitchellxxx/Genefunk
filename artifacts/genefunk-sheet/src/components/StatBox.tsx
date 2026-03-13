import React from 'react';
import { useDice } from '@/hooks/use-dice';
import { getModifier, formatModifier } from '@/lib/rules';
import { EditableField } from './CyberUI';

interface StatBoxProps {
  label: string;
  score: number;
  onUpdate: (score: number) => void;
}

export function StatBox({ label, score, onUpdate }: StatBoxProps) {
  const { rollDice } = useDice();
  const modifier = getModifier(score);

  return (
    <div className="bg-card border border-border flex flex-col items-center justify-center relative group hover:border-primary transition-colors clip-edges px-3 py-2.5 min-w-[80px]">
      <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono">{label}</div>
      <div 
        className="text-2xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors leading-tight mt-0.5"
        onClick={() => rollDice(`${label} Check`, modifier)}
      >
        {formatModifier(modifier)}
      </div>
      <div className="bg-background/50 border-t border-border px-2 mt-1">
        <EditableField 
          type="number"
          value={score} 
          onSave={(v) => onUpdate(v as number)}
          className="text-center font-mono text-sm w-10"
        />
      </div>
    </div>
  );
}
