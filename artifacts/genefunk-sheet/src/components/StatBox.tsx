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
    <div className="bg-card border border-border p-3 flex flex-col items-center justify-center relative group clip-edges hover:border-primary transition-colors">
      <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{label}</div>
      
      <div 
        className="text-4xl font-sans font-bold text-foreground cursor-pointer hover:text-primary transition-colors my-2"
        onClick={() => rollDice(`${label} Check`, modifier)}
      >
        {formatModifier(modifier)}
      </div>

      <div className="w-12 text-center bg-background/50 py-1 border-t border-border">
        <EditableField 
          type="number"
          value={score} 
          onSave={(v) => onUpdate(v as number)}
          className="text-center font-mono text-sm"
        />
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
