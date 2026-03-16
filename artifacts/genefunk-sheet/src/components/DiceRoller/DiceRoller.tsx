import { useState, useCallback, useEffect, useRef } from 'react';
import type { DiceRollerProps, RollResult, DieType, AutoRoll } from './types';
import { useDicePool } from './hooks/useDicePool';
import { usePresets } from './hooks/usePresets';
import { useSound } from './hooks/useSound';
import { DiceScene } from './components/DiceScene';
import { FloatingTray } from './components/FloatingTray';
import { CustomizePanel } from './components/CustomizePanel';
import { ResultsDisplay } from './components/ResultsDisplay';

export function DiceRoller({ onResult, onClose, userId, autoRoll, quickMode }: DiceRollerProps) {
  const pool = useDicePool();
  const { config, setConfig, presets, savePreset, loadPreset, isSaving } = usePresets(userId);
  const sound = useSound();

  const [rolling, setRolling] = useState(false);
  const [settled, setSettled] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [settledResults, setSettledResults] = useState<RollResult[]>([]);
  const [showScene, setShowScene] = useState(false);
  const [rollKey, setRollKey] = useState(0);
  const [rollLabel, setRollLabel] = useState('');
  const [rollModifier, setRollModifier] = useState(0);
  const pendingAutoRollRef = useRef<AutoRoll | null>(null);

  // Track current expanded pool in a ref so fireRoll doesn't need it as a dep
  const poolExpandedRef = useRef<number[]>([]);
  poolExpandedRef.current = pool.expanded as number[];

  const fireRoll = useCallback(() => {
    setSettledResults([]);
    setSettled(false);
    setShowScene(true);
    setRolling(true);
    setRollKey(k => k + 1);
    sound.startRolling(poolExpandedRef.current);
  }, [sound]);

  const handleRoll = useCallback(() => {
    if (pool.totalDice === 0 || rolling) return;
    setRollLabel('');
    setRollModifier(0);
    pendingAutoRollRef.current = null;
    fireRoll();
  }, [pool.totalDice, rolling, fireRoll]);

  useEffect(() => {
    if (!autoRoll) return;
    pendingAutoRollRef.current = autoRoll;
    setRollLabel(autoRoll.label);
    setRollModifier(autoRoll.modifier);
    pool.loadDice(autoRoll.dice);
  }, [autoRoll]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!pendingAutoRollRef.current) return;
    if (pool.totalDice === 0 || rolling) return;
    pendingAutoRollRef.current = null; // consume — prevents re-firing when rolling→false
    fireRoll();
  }, [pool.totalDice, rolling, fireRoll]);

  const handleAllSettled = useCallback((newResults: RollResult[]) => {
    setRolling(false);
    setSettled(true);
    sound.stopRolling();

    const isAnyMax = newResults.some(r => r.result === r.dieType);
    sound.playSettle(isAnyMax, newResults.map(r => r.dieType));

    setSettledResults(newResults);

    const rawTotal = newResults.reduce((s, r) => s + r.result, 0);
    const pending = pendingAutoRollRef.current;
    if (pending?.onComplete) {
      const finalTotal = rawTotal + pending.modifier;
      pending.onComplete(finalTotal, newResults);
    }

    onResult?.(newResults, rollLabel, rollModifier);
  }, [sound, onResult, rollLabel, rollModifier]);

  const handleDismissAll = useCallback(() => {
    setShowScene(false);
    setSettled(false);
    setSettledResults([]);
    pendingAutoRollRef.current = null;
    if (quickMode) onClose?.();
  }, [quickMode, onClose]);

  // In quickMode, auto-dismiss 4 s after dice settle so the result is seen but
  // the user never has to tap anything to get back to the sheet.
  useEffect(() => {
    if (!quickMode || !settled) return;
    const t = setTimeout(() => handleDismissAll(), 4000);
    return () => clearTimeout(t);
  }, [quickMode, settled, handleDismissAll]);

  // Safety net: if rolling gets stuck (physics crash / escape) for more than 7 s, force-dismiss.
  useEffect(() => {
    if (!rolling) return;
    const t = setTimeout(() => handleDismissAll(), 7000);
    return () => clearTimeout(t);
  }, [rolling, handleDismissAll]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter' && !e.repeat) handleRoll();
      if (e.key === 'Escape') {
        if (showScene) handleDismissAll();
        else if (showCustomize) setShowCustomize(false);
        else onClose?.();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleRoll, showCustomize, onClose, showScene, handleDismissAll]);

  return (
    <div
      className="absolute inset-0 z-50"
      style={{ pointerEvents: 'none', overflow: 'visible' }}
      aria-label="Dice Roller"
    >
      {showScene && (
        <DiceScene
          key={rollKey}
          pool={pool.expanded as DieType[]}
          config={config}
          rolling={rolling}
          settled={settled}
          onAllSettled={handleAllSettled}
        />
      )}

      {showScene && settled && settledResults.length > 0 && (
        <ResultsDisplay
          results={settledResults}
          label={rollLabel}
          modifier={rollModifier}
          onDismiss={handleDismissAll}
        />
      )}

      {!quickMode && (
        <>
          <FloatingTray
            counts={pool.counts}
            onIncrement={pool.increment}
            onDecrement={pool.decrement}
            onRoll={handleRoll}
            onClear={pool.clear}
            onCustomize={() => setShowCustomize(v => !v)}
            totalDice={pool.totalDice}
            rolling={rolling}
          />

          {showCustomize && (
            <CustomizePanel
              config={config}
              onChange={setConfig}
              presets={presets}
              onSavePreset={savePreset}
              onLoadPreset={loadPreset}
              isSaving={isSaving}
              onClose={() => setShowCustomize(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
