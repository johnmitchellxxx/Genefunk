import React, { useState, useMemo, useEffect } from 'react';
import { CyberButton, CyberCard } from '@/components/CyberUI';
import { CLASSES } from '@/lib/rulebookData';
import type { AbilityKey } from '@/lib/rulebookData';
import { ABILITIES, getModifier } from '@/lib/rules';
import { X, ArrowUp, Check } from 'lucide-react';
import type { Character, FeatureEntry } from '@workspace/api-client-react';

const MAX_LEVEL = 20;

interface LevelUpPanelProps {
  character: Character;
  onConfirm: (data: Record<string, unknown>) => void;
  onClose: () => void;
  isPending: boolean;
}

function hasASIFeature(features: { name: string; description: string }[]): boolean {
  return features.some(f => /ability score improvement/i.test(f.name));
}

export function LevelUpPanel({ character, onClose, onConfirm, isPending }: LevelUpPanelProps) {
  const nextLevel = character.level + 1;
  const classData = CLASSES.find(c => c.name === character.class);
  const newFeatures = classData?.featuresByLevel[nextLevel] || [];
  const isASILevel = hasASIFeature(newFeatures);

  const [asiMode, setAsiMode] = useState<'plus2' | 'plus1plus1'>('plus2');
  const [asiPrimary, setAsiPrimary] = useState<AbilityKey>('strength');
  const [asiSecondary, setAsiSecondary] = useState<AbilityKey>('dexterity');

  useEffect(() => {
    if (asiPrimary === asiSecondary) {
      const other = ABILITIES.find(a => (a.key as AbilityKey) !== asiPrimary);
      if (other) setAsiSecondary(other.key as AbilityKey);
    }
  }, [asiPrimary, asiSecondary]);

  const hitDieSize = classData?.hitDie || 8;

  const avgHpGain = useMemo(() => {
    const conMod = getModifier(character.constitution);
    return Math.max(1, Math.floor(hitDieSize / 2) + 1 + conMod);
  }, [character.constitution, hitDieSize]);

  const atMaxLevel = character.level >= MAX_LEVEL;

  function handleConfirm() {
    if (atMaxLevel) return;

    const nonASIFeatures = newFeatures.filter(f => !/ability score improvement/i.test(f.name));
    const featureEntries: FeatureEntry[] = nonASIFeatures.map(f => ({
      id: crypto.randomUUID(),
      name: f.name,
      source: character.class || 'Class',
      description: f.description,
    }));

    if (isASILevel) {
      featureEntries.push({
        id: crypto.randomUUID(),
        name: 'Ability Score Improvement',
        source: character.class || 'Class',
        description: asiMode === 'plus2'
          ? `+2 ${ABILITIES.find(a => a.key === asiPrimary)?.label}`
          : `+1 ${ABILITIES.find(a => a.key === asiPrimary)?.label}, +1 ${ABILITIES.find(a => a.key === asiSecondary)?.label}`,
      });
    }

    const updates: Record<string, unknown> = {
      level: nextLevel,
      features: [...(character.features || []), ...featureEntries],
      maxHitPoints: character.maxHitPoints + avgHpGain,
      currentHitPoints: character.currentHitPoints + avgHpGain,
      hitDice: `${nextLevel}d${hitDieSize}`,
    };

    if (isASILevel) {
      if (asiMode === 'plus2') {
        updates[asiPrimary] = (character[asiPrimary as keyof Character] as number) + 2;
      } else {
        updates[asiPrimary] = (character[asiPrimary as keyof Character] as number) + 1;
        if (asiSecondary !== asiPrimary) {
          updates[asiSecondary] = (character[asiSecondary as keyof Character] as number) + 1;
        }
      }
    }

    onConfirm(updates);
  }

  if (atMaxLevel) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-end">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-lg h-full bg-background border-l border-border overflow-y-auto">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground tracking-widest uppercase font-mono">Max Level</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <CyberCard className="!p-6 text-center">
              <div className="text-lg text-muted-foreground font-mono">
                This operative has reached maximum level ({MAX_LEVEL}).
              </div>
            </CyberCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg h-full bg-background border-l border-border overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ArrowUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground tracking-widest uppercase font-mono">
              Level Up to {nextLevel}
            </h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <CyberCard className="!p-4 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-1">Level</div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-bold text-muted-foreground">{character.level}</span>
              <ArrowUp className="w-6 h-6 text-primary" />
              <span className="text-3xl font-bold text-primary">{nextLevel}</span>
            </div>
          </CyberCard>

          <CyberCard className="!p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-1">Hit Points</div>
            <div className="text-sm text-foreground">
              +{avgHpGain} HP (avg d{hitDieSize} + CON mod)
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-mono">
              {character.maxHitPoints} → {character.maxHitPoints + avgHpGain}
            </div>
          </CyberCard>

          <CyberCard className="!p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-1">Hit Dice</div>
            <div className="text-sm text-foreground font-mono">
              {character.hitDice || `${character.level}d${hitDieSize}`} → {nextLevel}d{hitDieSize}
            </div>
          </CyberCard>

          {newFeatures.filter(f => !/ability score improvement/i.test(f.name)).length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-3">New Features</div>
              <div className="space-y-3">
                {newFeatures.filter(f => !/ability score improvement/i.test(f.name)).map(f => (
                  <CyberCard key={f.name} className="!p-4 border-primary/30">
                    <div className="text-sm font-bold text-primary font-mono">{f.name}</div>
                    <p className="text-xs text-muted-foreground mt-1">{f.description}</p>
                  </CyberCard>
                ))}
              </div>
            </div>
          )}

          {newFeatures.filter(f => !/ability score improvement/i.test(f.name)).length === 0 && !isASILevel && (
            <CyberCard className="!p-4 text-center">
              <div className="text-sm text-muted-foreground">No new class features at this level.</div>
            </CyberCard>
          )}

          {isASILevel && (
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-3">Ability Score Improvement</div>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setAsiMode('plus2')}
                  className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border clip-edges transition-all ${
                    asiMode === 'plus2' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                  }`}
                >
                  +2 to One
                </button>
                <button
                  onClick={() => setAsiMode('plus1plus1')}
                  className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border clip-edges transition-all ${
                    asiMode === 'plus1plus1' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                  }`}
                >
                  +1 to Two
                </button>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground font-mono uppercase">
                  {asiMode === 'plus2' ? 'Increase by +2' : 'First +1'}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {ABILITIES.map(ab => {
                    const score = character[ab.key as keyof Character] as number;
                    return (
                      <button
                        key={ab.key}
                        onClick={() => setAsiPrimary(ab.key as AbilityKey)}
                        className={`p-2 border text-center clip-edges transition-all ${
                          asiPrimary === ab.key
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        <div className="text-xs font-mono">{ab.label}</div>
                        <div className="text-sm font-bold">{score} → {score + (asiMode === 'plus2' ? 2 : 1)}</div>
                      </button>
                    );
                  })}
                </div>

                {asiMode === 'plus1plus1' && (
                  <>
                    <div className="text-xs text-muted-foreground font-mono uppercase mt-3">Second +1</div>
                    <div className="grid grid-cols-3 gap-2">
                      {ABILITIES.filter(ab => ab.key !== asiPrimary).map(ab => {
                        const score = character[ab.key as keyof Character] as number;
                        return (
                          <button
                            key={ab.key}
                            onClick={() => setAsiSecondary(ab.key as AbilityKey)}
                            className={`p-2 border text-center clip-edges transition-all ${
                              asiSecondary === ab.key
                                ? 'border-accent bg-accent/10 text-accent'
                                : 'border-border text-muted-foreground hover:border-accent/50'
                            }`}
                          >
                            <div className="text-xs font-mono">{ab.label}</div>
                            <div className="text-sm font-bold">{score} → {score + 1}</div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <CyberButton onClick={handleConfirm} disabled={isPending} className="w-full">
              {isPending ? 'Applying...' : (
                <>
                  <Check className="w-4 h-4 inline mr-2" />
                  Confirm Level Up
                </>
              )}
            </CyberButton>
          </div>
        </div>
      </div>
    </div>
  );
}
