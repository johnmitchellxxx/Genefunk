import React, { useState, useRef } from 'react';
import { useDice } from '@/hooks/use-dice';
import { getModifier, formatModifier } from '@/lib/rules';

interface StatBoxProps {
  label: string;
  score: number;
  onUpdate: (score: number) => void;
}

export function StatBox({ label, score, onUpdate }: StatBoxProps) {
  const { rollDice } = useDice();
  const modifier = getModifier(score);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const clamp = (n: number) => Math.max(1, Math.min(30, n));

  const startEdit = () => {
    setDraft(String(score));
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commitEdit = () => {
    const parsed = parseInt(draft, 10);
    if (!isNaN(parsed)) onUpdate(clamp(parsed));
    setEditing(false);
  };

  return (
    <div className="bg-card border border-border flex flex-col items-center justify-center relative group hover:border-primary transition-colors clip-edges px-3 py-2.5 min-w-[80px]">
      <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono">{label}</div>

      <div
        className="text-2xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors leading-tight mt-0.5"
        onClick={() => rollDice(`${label} Check`, modifier)}
        title={`${label} modifier: ${formatModifier(modifier)} (score ${score})\nClick to roll 1d20 ${formatModifier(modifier)}`}
      >
        {formatModifier(modifier)}
      </div>

      <div className="flex items-center gap-1 mt-1">
        <button
          className="w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors font-mono text-base leading-none select-none"
          onClick={() => onUpdate(clamp(score - 1))}
          title="Decrease"
          tabIndex={-1}
        >
          −
        </button>

        {editing ? (
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => {
              if (e.key === 'Enter') { commitEdit(); }
              if (e.key === 'Escape') { setEditing(false); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setDraft(String(clamp(parseInt(draft || String(score), 10) + 1))); }
              if (e.key === 'ArrowDown') { e.preventDefault(); setDraft(String(clamp(parseInt(draft || String(score), 10) - 1))); }
            }}
            className="w-8 text-center font-mono text-sm bg-transparent border-b border-primary outline-none text-foreground"
          />
        ) : (
          <span
            className="w-8 text-center font-mono text-sm text-muted-foreground cursor-text hover:text-foreground transition-colors"
            onClick={startEdit}
            title="Click to type a value"
          >
            {score}
          </span>
        )}

        <button
          className="w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors font-mono text-base leading-none select-none"
          onClick={() => onUpdate(clamp(score + 1))}
          title="Increase"
          tabIndex={-1}
        >
          +
        </button>
      </div>
    </div>
  );
}
