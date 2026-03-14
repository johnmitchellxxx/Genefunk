import React, { useState, useMemo } from 'react';
import { CyberButton, CyberCard } from '@/components/CyberUI';
import { GENOMES, CLASSES, BACKGROUNDS, POINT_BUY_COSTS, POINT_BUY_TOTAL, ASI_LEVELS } from '@/lib/rulebookData';
import type { GenomeData, ClassData, BackgroundData, AbilityKey, SenseKey } from '@/lib/rulebookData';
import { ABILITIES, SKILLS, SENSES, getModifier, formatModifier } from '@/lib/rules';
import { ChevronLeft, ChevronRight, Check, X, Dna, Swords, BookOpen, Brain, ListChecks, ClipboardCheck } from 'lucide-react';

interface WizardState {
  name: string;
  genome: GenomeData | null;
  characterClass: ClassData | null;
  background: BackgroundData | null;
  abilityScores: Record<AbilityKey, number>;
  usePointBuy: boolean;
  skillPicks: string[];
}

const INITIAL_SCORES: Record<AbilityKey, number> = {
  strength: 10, dexterity: 10, constitution: 10,
  intelligence: 10, wisdom: 10, charisma: 10,
};

const STEPS = [
  { label: 'Genome', icon: Dna },
  { label: 'Class', icon: Swords },
  { label: 'Background', icon: BookOpen },
  { label: 'Abilities', icon: Brain },
  { label: 'Skills', icon: ListChecks },
  { label: 'Review', icon: ClipboardCheck },
];

interface CharacterWizardProps {
  onClose: () => void;
  onComplete: (data: Record<string, unknown>) => void;
  isPending: boolean;
}

export function CharacterWizard({ onClose, onComplete, isPending }: CharacterWizardProps) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>({
    name: '',
    genome: null,
    characterClass: null,
    background: null,
    abilityScores: { ...INITIAL_SCORES },
    usePointBuy: true,
    skillPicks: [],
  });

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0: return !!state.genome;
      case 1: return !!state.characterClass;
      case 2: return !!state.background;
      case 3: {
        if (state.usePointBuy) {
          const spent = Object.values(state.abilityScores).reduce((s, v) => s + (POINT_BUY_COSTS[v] ?? 0), 0);
          return spent <= POINT_BUY_TOTAL;
        }
        return true;
      }
      case 4: {
        const needed = getRequiredSkillPicks();
        return state.skillPicks.length === needed;
      }
      case 5: return state.name.trim().length > 0;
      default: return false;
    }
  }, [step, state]);

  function getRequiredSkillPicks(): number {
    return state.characterClass?.numSkillChoices ?? 0;
  }

  function getAllowedSkills(): string[] {
    const mandatory = state.characterClass?.mandatorySkills ?? [];
    return (state.characterClass?.skillChoices ?? []).filter(s => !mandatory.includes(s));
  }

  function getMandatoryClassSkills(): string[] {
    return state.characterClass?.mandatorySkills ?? [];
  }

  function getBackgroundSkills(): string[] {
    return state.background?.skillProficiencies ?? [];
  }

  function handleNext() {
    if (step < 5) setStep(step + 1);
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleDeploy() {
    if (!state.genome || !state.characterClass || !state.background || !state.name.trim()) return;

    const genome = state.genome;
    const cls = state.characterClass;
    const bg = state.background;

    const finalScores = { ...state.abilityScores };
    for (const [key, bonus] of Object.entries(genome.abilityBonuses)) {
      finalScores[key as AbilityKey] = (finalScores[key as AbilityKey] || 10) + bonus;
    }

    const conMod = getModifier(finalScores.constitution);
    const hp = cls.hitDie + conMod;

    const mandatoryClassSkills = cls.mandatorySkills ?? [];
    const allSkillProfs = [...new Set([...bg.skillProficiencies, ...mandatoryClassSkills, ...state.skillPicks])];

    const features = [
      ...genome.traits.map(t => ({ id: crypto.randomUUID(), name: t.name, source: genome.name, description: t.description })),
      ...(cls.featuresByLevel[1] || []).map(f => ({ id: crypto.randomUUID(), name: f.name, source: cls.name, description: f.description })),
      { id: crypto.randomUUID(), name: bg.featureName, source: bg.name, description: bg.featureDescription },
    ];

    const senses: Record<SenseKey, boolean> = {
      acuteOlfaction: false, darkvision: false, macrovision: false,
      microvision: false, penetration: false, spectrum: false,
    };
    for (const [key, val] of Object.entries(genome.senses)) {
      if (val) senses[key as SenseKey] = true;
    }

    const profParts: string[] = [];
    if (bg.toolProficiencies) profParts.push(bg.toolProficiencies);

    onComplete({
      name: state.name.trim(),
      genome: genome.name,
      class: cls.name,
      background: bg.name,
      level: 1,
      strength: finalScores.strength,
      dexterity: finalScores.dexterity,
      constitution: finalScores.constitution,
      intelligence: finalScores.intelligence,
      wisdom: finalScores.wisdom,
      charisma: finalScores.charisma,
      maxHitPoints: Math.max(1, hp),
      currentHitPoints: Math.max(1, hp),
      hitDice: `1d${cls.hitDie}`,
      speed: genome.speed,
      initiative: 0,
      armorClass: 10 + getModifier(finalScores.dexterity),
      savingThrowProficiencies: cls.savingThrows,
      skillProficiencies: allSkillProfs,
      armorProficiencies: cls.armorProficiencies,
      weaponProficiencies: cls.weaponProficiencies,
      toolProficiencies: profParts.join(', ') || null,
      languages: bg.languages || null,
      features,
      senses,
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/98 backdrop-blur-sm flex flex-col overflow-hidden">
      {/* Header: title row + step progress bar */}
      <div className="border-b border-border bg-card/50 shrink-0">
        {/* Title row */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-muted-foreground hover:text-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-xl font-bold text-foreground tracking-widest uppercase font-mono">New Operative</h1>
          </div>
          <span className="text-xs text-muted-foreground font-mono">Step {step + 1} / {STEPS.length}</span>
        </div>
        {/* Step indicators — scrollable row on mobile */}
        <div className="flex overflow-x-auto px-4 pb-3 gap-1 scrollbar-none">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all shrink-0 ${
                  i === step ? 'text-primary bg-primary/10 border border-primary' :
                  i < step ? 'text-accent' : 'text-muted-foreground/50'
                } clip-edges`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.label}</span>
                {i < step && <Check className="w-3 h-3 text-accent" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {step === 0 && <GenomeStep state={state} setState={setState} />}
          {step === 1 && <ClassStep state={state} setState={setState} />}
          {step === 2 && <BackgroundStep state={state} setState={setState} />}
          {step === 3 && <AbilityStep state={state} setState={setState} />}
          {step === 4 && (
            <SkillStep
              state={state}
              setState={setState}
              allowedSkills={getAllowedSkills()}
              backgroundSkills={getBackgroundSkills()}
              mandatoryClassSkills={getMandatoryClassSkills()}
              requiredPicks={getRequiredSkillPicks()}
            />
          )}
          {step === 5 && <ReviewStep state={state} setState={setState} />}
        </div>
      </div>

      <div className="border-t border-border bg-card/50 px-6 py-4 flex items-center justify-between shrink-0">
        <CyberButton variant="ghost" onClick={handleBack} disabled={step === 0}>
          <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
        </CyberButton>
        {step < 5 ? (
          <CyberButton onClick={handleNext} disabled={!canAdvance}>
            Next <ChevronRight className="w-4 h-4 inline ml-1" />
          </CyberButton>
        ) : (
          <CyberButton onClick={handleDeploy} disabled={!canAdvance || isPending}>
            {isPending ? 'Deploying...' : 'Deploy Operative'}
          </CyberButton>
        )}
      </div>
    </div>
  );
}

interface StepProps {
  state: WizardState;
  setState: React.Dispatch<React.SetStateAction<WizardState>>;
}

function GenomeStep({ state, setState }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary tracking-widest uppercase font-mono mb-2">Select Genome</h2>
        <p className="text-muted-foreground text-sm">Choose your operative's genetic template. This determines ability bonuses, senses, and unique traits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {GENOMES.map(g => (
          <div
            key={g.name}
            onClick={() => setState(s => ({ ...s, genome: g }))}
            className={`p-4 border cursor-pointer transition-all clip-edges ${
              state.genome?.name === g.name
                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                : 'border-border bg-card/50 hover:border-primary/50'
            }`}
          >
            <div className="font-bold text-foreground font-mono tracking-wider">{g.name}</div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{g.description}</p>
          </div>
        ))}
      </div>

      {state.genome && (
        <CyberCard className="space-y-4">
          <h3 className="text-lg font-bold text-primary font-mono tracking-widest">{state.genome.name}</h3>
          <p className="text-sm text-muted-foreground">{state.genome.description}</p>

          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-mono">Ability Bonuses</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(state.genome.abilityBonuses).map(([key, val]) => (
                <span key={key} className="bg-primary/10 text-primary px-2 py-1 text-xs font-mono clip-edges">
                  {ABILITIES.find(a => a.key === key)?.label || key.toUpperCase()} +{val}
                </span>
              ))}
            </div>
          </div>

          {Object.keys(state.genome.senses).length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-mono">Senses</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(state.genome.senses).filter(([, v]) => v).map(([key]) => (
                  <span key={key} className="bg-accent/10 text-accent px-2 py-1 text-xs font-mono clip-edges">
                    {SENSES.find(s => s.key === key)?.label || key}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-mono">Traits</div>
            <div className="space-y-2">
              {state.genome.traits.map(t => (
                <div key={t.name} className="border-l-2 border-primary/50 pl-3">
                  <div className="text-sm font-bold text-foreground">{t.name}</div>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        </CyberCard>
      )}
    </div>
  );
}

function ClassStep({ state, setState }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary tracking-widest uppercase font-mono mb-2">Select Class</h2>
        <p className="text-muted-foreground text-sm">Choose your operative's combat specialization. This determines hit points, proficiencies, and features.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CLASSES.map(c => (
          <div
            key={c.name}
            onClick={() => setState(s => ({ ...s, characterClass: c, skillPicks: [] }))}
            className={`p-4 border cursor-pointer transition-all clip-edges ${
              state.characterClass?.name === c.name
                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                : 'border-border bg-card/50 hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="font-bold text-foreground font-mono tracking-wider">{c.name}</div>
              <span className="text-xs text-accent font-mono">d{c.hitDie}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{c.armorProficiencies} | {c.weaponProficiencies}</p>
          </div>
        ))}
      </div>

      {state.characterClass && (
        <CyberCard className="space-y-4">
          <h3 className="text-lg font-bold text-primary font-mono tracking-widest">{state.characterClass.name}</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-mono">Hit Die</div>
              <span className="text-foreground font-bold">d{state.characterClass.hitDie}</span>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-mono">Saving Throws</div>
              <span className="text-foreground">
                {state.characterClass.savingThrows.map(s => ABILITIES.find(a => a.key === s)?.label).join(', ')}
              </span>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-mono">Armor</div>
              <span className="text-foreground text-xs">{state.characterClass.armorProficiencies}</span>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-mono">Weapons</div>
              <span className="text-foreground text-xs">{state.characterClass.weaponProficiencies}</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-mono">Level 1 Features</div>
            <div className="space-y-2">
              {(state.characterClass.featuresByLevel[1] || []).map(f => (
                <div key={f.name} className="border-l-2 border-primary/50 pl-3">
                  <div className="text-sm font-bold text-foreground">{f.name}</div>
                  <p className="text-xs text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </CyberCard>
      )}
    </div>
  );
}

function BackgroundStep({ state, setState }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary tracking-widest uppercase font-mono mb-2">Select Background</h2>
        <p className="text-muted-foreground text-sm">Choose your operative's background. This grants skill proficiencies and a unique feature.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {BACKGROUNDS.map(b => (
          <div
            key={b.name}
            onClick={() => setState(s => ({ ...s, background: b, skillPicks: [] }))}
            className={`p-4 border cursor-pointer transition-all clip-edges ${
              state.background?.name === b.name
                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                : 'border-border bg-card/50 hover:border-primary/50'
            }`}
          >
            <div className="font-bold text-foreground font-mono tracking-wider">{b.name}</div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{b.description}</p>
            <div className="flex gap-1 mt-2">
              {b.skillProficiencies.map(sk => (
                <span key={sk} className="bg-accent/10 text-accent px-1.5 py-0.5 text-[10px] font-mono clip-edges">
                  {SKILLS.find(s => s.key === sk)?.label || sk}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {state.background && (
        <CyberCard className="space-y-4">
          <h3 className="text-lg font-bold text-primary font-mono tracking-widest">{state.background.name}</h3>
          <p className="text-sm text-muted-foreground">{state.background.description}</p>

          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-mono">Skill Proficiencies</div>
            <div className="flex flex-wrap gap-2">
              {state.background.skillProficiencies.map(sk => (
                <span key={sk} className="bg-accent/10 text-accent px-2 py-1 text-xs font-mono clip-edges">
                  {SKILLS.find(s => s.key === sk)?.label || sk}
                </span>
              ))}
            </div>
          </div>

          <div className="border-l-2 border-primary/50 pl-3">
            <div className="text-sm font-bold text-foreground">{state.background.featureName}</div>
            <p className="text-xs text-muted-foreground">{state.background.featureDescription}</p>
          </div>

          {state.background.toolProficiencies && (
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-mono">Tool Proficiencies</div>
              <span className="text-sm text-foreground">{state.background.toolProficiencies}</span>
            </div>
          )}
        </CyberCard>
      )}
    </div>
  );
}

function AbilityStep({ state, setState }: StepProps) {
  const pointsSpent = Object.values(state.abilityScores).reduce((s, v) => s + (POINT_BUY_COSTS[v] ?? 0), 0);
  const pointsRemaining = POINT_BUY_TOTAL - pointsSpent;

  function setScore(key: AbilityKey, value: number) {
    setState(s => ({
      ...s,
      abilityScores: { ...s.abilityScores, [key]: value },
    }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary tracking-widest uppercase font-mono mb-2">Ability Scores</h2>
        <p className="text-muted-foreground text-sm">
          {state.usePointBuy
            ? `Distribute ${POINT_BUY_TOTAL} points across your abilities. Genome bonuses are shown separately.`
            : 'Manually enter your ability scores. Genome bonuses are shown separately.'}
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setState(s => ({ ...s, usePointBuy: true, abilityScores: { ...INITIAL_SCORES } }))}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border clip-edges transition-all ${
            state.usePointBuy ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'
          }`}
        >
          Point Buy
        </button>
        <button
          onClick={() => setState(s => ({ ...s, usePointBuy: false }))}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border clip-edges transition-all ${
            !state.usePointBuy ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'
          }`}
        >
          Manual Entry
        </button>
      </div>

      {state.usePointBuy && (
        <div className={`text-center p-3 border clip-edges font-mono text-sm ${
          pointsRemaining < 0 ? 'border-destructive bg-destructive/10 text-destructive' :
          pointsRemaining === 0 ? 'border-accent bg-accent/10 text-accent' :
          'border-border bg-card/50 text-foreground'
        }`}>
          Points Remaining: <span className="font-bold text-lg">{pointsRemaining}</span> / {POINT_BUY_TOTAL}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {ABILITIES.map(ab => {
          const base = state.abilityScores[ab.key as AbilityKey];
          const bonus = state.genome?.abilityBonuses[ab.key as AbilityKey] || 0;
          const total = base + bonus;
          const mod = getModifier(total);

          return (
            <CyberCard key={ab.key} className="text-center space-y-2 !p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono">{ab.label}</div>

              {state.usePointBuy ? (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => base > 8 && setScore(ab.key as AbilityKey, base - 1)}
                    disabled={base <= 8}
                    className="w-7 h-7 border border-border text-muted-foreground hover:text-primary hover:border-primary disabled:opacity-30 transition-colors flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-foreground w-8 text-center">{base}</span>
                  <button
                    onClick={() => base < 15 && setScore(ab.key as AbilityKey, base + 1)}
                    disabled={base >= 15}
                    className="w-7 h-7 border border-border text-muted-foreground hover:text-primary hover:border-primary disabled:opacity-30 transition-colors flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              ) : (
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={base}
                  onChange={e => setScore(ab.key as AbilityKey, Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  className="w-16 mx-auto bg-background border-b-2 border-border focus:border-primary text-2xl font-bold text-foreground text-center outline-none font-mono"
                />
              )}

              {bonus > 0 && (
                <div className="text-xs text-accent font-mono">+{bonus} ({state.genome?.name})</div>
              )}

              <div className="text-sm font-mono">
                <span className="text-muted-foreground">Total: </span>
                <span className="text-primary font-bold">{total}</span>
                <span className="text-muted-foreground"> ({formatModifier(mod)})</span>
              </div>

              {state.usePointBuy && (
                <div className="text-[10px] text-muted-foreground/60 font-mono">
                  Cost: {POINT_BUY_COSTS[base] ?? '?'} pts
                </div>
              )}
            </CyberCard>
          );
        })}
      </div>
    </div>
  );
}

interface SkillStepProps extends StepProps {
  allowedSkills: string[];
  backgroundSkills: string[];
  mandatoryClassSkills: string[];
  requiredPicks: number;
}

function SkillStep({ state, setState, allowedSkills, backgroundSkills, mandatoryClassSkills, requiredPicks }: SkillStepProps) {
  const remaining = requiredPicks - state.skillPicks.length;

  function toggleSkill(key: string) {
    if (backgroundSkills.includes(key) || mandatoryClassSkills.includes(key)) return;
    setState(s => {
      const picks = s.skillPicks.includes(key)
        ? s.skillPicks.filter(k => k !== key)
        : s.skillPicks.length < requiredPicks
          ? [...s.skillPicks, key]
          : s.skillPicks;
      return { ...s, skillPicks: picks };
    });
  }

  const autoSkills = [...new Set([...backgroundSkills, ...mandatoryClassSkills])];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary tracking-widest uppercase font-mono mb-2">Skill Proficiencies</h2>
        <p className="text-muted-foreground text-sm">
          Choose {requiredPicks} skill{requiredPicks !== 1 ? 's' : ''} from your class list. Background and mandatory class skills are pre-selected.
        </p>
      </div>

      <div className={`text-center p-3 border clip-edges font-mono text-sm ${
        remaining === 0 ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-card/50 text-foreground'
      }`}>
        Picks Remaining: <span className="font-bold text-lg">{remaining}</span> / {requiredPicks}
      </div>

      <div className="space-y-1">
        <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-2">Automatic Skills</div>
        {autoSkills.map(sk => {
          const skill = SKILLS.find(s => s.key === sk);
          const isMandatoryClass = mandatoryClassSkills.includes(sk);
          return (
            <div key={sk} className="flex items-center gap-3 p-2 bg-accent/5 border border-accent/20 clip-edges">
              <div className="w-4 h-4 rounded bg-accent border-accent flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-accent font-mono">{skill?.label || sk}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {isMandatoryClass ? 'Class (mandatory)' : 'Background'} · {ABILITIES.find(a => a.key === skill?.ability)?.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="space-y-1">
        <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-2">Class Skills (Choose {requiredPicks})</div>
        {allowedSkills
          .filter(sk => !autoSkills.includes(sk))
          .map(sk => {
            const skill = SKILLS.find(s => s.key === sk);
            const isSelected = state.skillPicks.includes(sk);
            return (
              <div
                key={sk}
                onClick={() => toggleSkill(sk)}
                className={`flex items-center gap-3 p-2 border cursor-pointer transition-all clip-edges ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card/30 hover:border-primary/50'
                }`}
              >
                <div className={`w-4 h-4 rounded border-2 transition-colors ${
                  isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/40'
                } flex items-center justify-center`}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm font-mono ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {skill?.label || sk}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {ABILITIES.find(a => a.key === skill?.ability)?.label}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function ReviewStep({ state, setState }: StepProps) {
  const genome = state.genome!;
  const cls = state.characterClass!;
  const bg = state.background!;

  const finalScores = { ...state.abilityScores };
  for (const [key, bonus] of Object.entries(genome.abilityBonuses)) {
    finalScores[key as AbilityKey] = (finalScores[key as AbilityKey] || 10) + bonus;
  }

  const conMod = getModifier(finalScores.constitution);
  const hp = Math.max(1, cls.hitDie + conMod);
  const mandatoryClassSkills = cls.mandatorySkills ?? [];
  const allSkills = [...new Set([...bg.skillProficiencies, ...mandatoryClassSkills, ...state.skillPicks])];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary tracking-widest uppercase font-mono mb-2">Review & Deploy</h2>
        <p className="text-muted-foreground text-sm">Review your operative's configuration before deployment.</p>
      </div>

      <CyberCard className={`!p-4 ${!state.name.trim() ? 'border-primary/60 shadow-[0_0_12px_hsl(var(--primary)/0.3)]' : 'border-accent/60'}`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Operative Designation</div>
          {!state.name.trim() && <div className="text-xs text-primary font-mono animate-pulse">← required to deploy</div>}
        </div>
        <input
          type="text"
          value={state.name}
          onChange={e => setState(s => ({ ...s, name: e.target.value }))}
          placeholder="Enter operative name..."
          className="w-full bg-background/50 border-b-2 border-border focus:border-primary px-3 py-2 text-foreground font-mono text-xl outline-none transition-colors"
          autoFocus
        />
      </CyberCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CyberCard className="!p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-1">Genome</div>
          <div className="text-lg font-bold text-primary font-mono">{genome.name}</div>
        </CyberCard>
        <CyberCard className="!p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-1">Class</div>
          <div className="text-lg font-bold text-primary font-mono">{cls.name}</div>
        </CyberCard>
        <CyberCard className="!p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-1">Background</div>
          <div className="text-lg font-bold text-primary font-mono">{bg.name}</div>
        </CyberCard>
      </div>

      <CyberCard className="!p-4">
        <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-3">Ability Scores (with bonuses)</div>
        <div className="grid grid-cols-6 gap-3">
          {ABILITIES.map(ab => {
            const total = finalScores[ab.key as AbilityKey];
            return (
              <div key={ab.key} className="text-center">
                <div className="text-[10px] text-muted-foreground font-mono">{ab.label}</div>
                <div className="text-xl font-bold text-foreground">{total}</div>
                <div className="text-xs text-primary font-mono">{formatModifier(getModifier(total))}</div>
              </div>
            );
          })}
        </div>
      </CyberCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <CyberCard className="!p-3 text-center">
          <div className="text-[10px] text-muted-foreground font-mono uppercase">HP</div>
          <div className="text-xl font-bold text-foreground">{hp}</div>
        </CyberCard>
        <CyberCard className="!p-3 text-center">
          <div className="text-[10px] text-muted-foreground font-mono uppercase">Hit Die</div>
          <div className="text-xl font-bold text-foreground">d{cls.hitDie}</div>
        </CyberCard>
        <CyberCard className="!p-3 text-center">
          <div className="text-[10px] text-muted-foreground font-mono uppercase">Speed</div>
          <div className="text-xl font-bold text-foreground">{genome.speed}</div>
        </CyberCard>
        <CyberCard className="!p-3 text-center">
          <div className="text-[10px] text-muted-foreground font-mono uppercase">AC</div>
          <div className="text-xl font-bold text-foreground">{10 + getModifier(finalScores.dexterity)}</div>
        </CyberCard>
      </div>

      <CyberCard className="!p-4">
        <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-2">Skill Proficiencies</div>
        <div className="flex flex-wrap gap-2">
          {allSkills.map(sk => (
            <span key={sk} className="bg-primary/10 text-primary px-2 py-1 text-xs font-mono clip-edges">
              {SKILLS.find(s => s.key === sk)?.label || sk}
            </span>
          ))}
        </div>
      </CyberCard>

      <CyberCard className="!p-4">
        <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-2">Features</div>
        <div className="space-y-2">
          {genome.traits.map(t => (
            <div key={t.name} className="border-l-2 border-accent/50 pl-3">
              <div className="text-sm font-bold text-foreground">{t.name} <span className="text-xs text-muted-foreground font-normal">({genome.name})</span></div>
            </div>
          ))}
          {(cls.featuresByLevel[1] || []).map(f => (
            <div key={f.name} className="border-l-2 border-primary/50 pl-3">
              <div className="text-sm font-bold text-foreground">{f.name} <span className="text-xs text-muted-foreground font-normal">({cls.name})</span></div>
            </div>
          ))}
          <div className="border-l-2 border-secondary/50 pl-3">
            <div className="text-sm font-bold text-foreground">{bg.featureName} <span className="text-xs text-muted-foreground font-normal">({bg.name})</span></div>
          </div>
        </div>
      </CyberCard>
    </div>
  );
}
