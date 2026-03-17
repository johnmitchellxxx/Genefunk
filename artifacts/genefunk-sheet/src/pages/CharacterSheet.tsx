import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useRoute } from 'wouter';
import { useAppCharacter, useAppUpdateCharacter, useAppDeleteCharacter, useAppRulebookBackgrounds, useAppRulebookGenomes, useAppRulebookClasses, useAppRulebookCadres, useAppAuth } from '@/hooks/use-api';
import { useDice, type DieType } from '@/hooks/use-dice';
import { CyberCard, EditableField, EditableSelect, CyberButton, CyberBadge } from '@/components/CyberUI';
import { StatBox } from '@/components/StatBox';
import { SkillList } from '@/components/SkillList';
import { ABILITIES, SENSES, getModifier, formatModifier, getProficiencyBonus, getAttackBonus } from '@/lib/rules';
import { UPGRADES, ARMOR, DRUGS, GEAR, POISONS, HACKS_BY_CLASS, CLASSES, GENOMES, BACKGROUNDS, type UpgradeData, type ArmorData, type HackData } from '@/lib/rulebook';
import { Activity, Shield, Heart, Zap, Crosshair, ChevronLeft, ChevronRight, GripVertical, Trash2, X, Eye, ArrowUp, Camera } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { WeaponPicker } from '@/components/WeaponPicker';
import { DiceRoller } from '@/components/DiceRoller';
import type { AutoRoll } from '@/components/DiceRoller';
import { LevelUpPanel } from '@/components/LevelUpPanel';
import type { WeaponRef } from '@/lib/rulebook';
import type {
  Character,
  AttackEntry,
  HackEntry,
  EquipmentEntry,
  FeatureEntry,
  GeneModEntry,
  CyberneticEntry,
  CharacterHackSlots,
  CharacterSenses,
} from '@workspace/api-client-react';

type MiniTab = 'actions' | 'hacks' | 'inventory' | 'genemods' | 'cybernetics' | 'features' | 'bio';

type UpdateFn = <K extends keyof Character>(field: K, value: Character[K]) => void;

export default function CharacterSheet() {
  const [, params] = useRoute('/characters/:id');
  const id = parseInt(params?.id || "0");
  const [, setLocation] = useLocation();
  
  const { data: rawCharacter, isLoading } = useAppCharacter(id);
  const updateMutation = useAppUpdateCharacter();
  const deleteMutation = useAppDeleteCharacter();
  const { beyond20Active, setCharacterName } = useDice();
  const { data: authData } = useAppAuth();
  const authUserId = authData?.userId as string | undefined;

  const { data: rulebookBackgrounds } = useAppRulebookBackgrounds();
  const { data: rulebookGenomes } = useAppRulebookGenomes();
  const { data: rulebookClasses } = useAppRulebookClasses();
  const { data: rulebookCadres } = useAppRulebookCadres();
  
  const classOptions = (rulebookClasses || []).map(c => ({ value: c.name, label: c.name }));
  const backgroundOptions = (rulebookBackgrounds || []).map(b => ({ value: b.name, label: b.name }));
  const genomeOptions = (rulebookGenomes || []).map(g => ({ value: g.name, label: `${g.name} (${g.category})` }));
  const cadreOptions = (rulebookCadres || []).map(c => ({ value: c.name, label: `${c.name} (${c.affiliation})` }));

  const [miniTab, setMiniTab] = useState<MiniTab>('actions');
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [isUploadingPortrait, setIsUploadingPortrait] = useState(false);
  const portraitInputRef = useRef<HTMLInputElement>(null);
  const [quickRollOpen, setQuickRollOpen] = useState(false);
  const [quickRollData, setQuickRollData] = useState<AutoRoll | null>(null);
  const [quickRollKey, setQuickRollKey] = useState(0);

  // Stable close callback — inline arrows recreated every render reset the auto-dismiss timer
  const closeQuickRoll = useCallback(() => {
    setQuickRollOpen(false);
    setQuickRollData(null);
  }, []);

  // Watchdog: if quickRoll is open for more than 8 s with no resolution (crash / stuck physics),
  // force-close so the tray always comes back.
  useEffect(() => {
    if (!quickRollOpen) return;
    const t = setTimeout(() => { setQuickRollOpen(false); setQuickRollData(null); }, 8000);
    return () => clearTimeout(t);
  }, [quickRollOpen, quickRollKey]); // quickRollKey changes on every new roll, resetting the timer

  const openRoll = useCallback((label: string, modifier: number, onComplete?: AutoRoll['onComplete']) => {
    setQuickRollData({ dice: [{ sides: 20 as const, count: 1 }], modifier, label, onComplete });
    setQuickRollKey(k => k + 1);
    setQuickRollOpen(true);
  }, []);

  const openCustomRoll = useCallback((dice: { sides: DieType; count: number }[], modifier: number, label: string) => {
    setQuickRollData({ dice, modifier, label });
    setQuickRollKey(k => k + 1);
    setQuickRollOpen(true);
  }, []);

  useEffect(() => {
    if (rawCharacter?.name) setCharacterName(rawCharacter.name);
  }, [rawCharacter?.name, setCharacterName]);

  const handleUpdate = (field: string, value: unknown) => {
    if (!rawCharacter) return;
    updateMutation.mutate({ id, data: { [field]: value } });
  };

  const handlePortraitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPortrait(true);
    try {
      const urlRes = await fetch('/api/storage/uploads/request-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type || 'image/jpeg' }),
      });
      if (!urlRes.ok) throw new Error('Failed to get upload URL');
      const { uploadURL, objectPath } = await urlRes.json() as { uploadURL: string; objectPath: string };
      const putRes = await fetch(uploadURL, { method: 'PUT', body: file, headers: { 'Content-Type': file.type || 'image/jpeg' } });
      if (!putRes.ok) throw new Error('Upload failed');
      handleUpdate('portraitUrl', objectPath);
    } catch (err) {
      console.error('Portrait upload failed:', err);
    } finally {
      setIsUploadingPortrait(false);
      if (portraitInputRef.current) portraitInputRef.current.value = '';
    }
  };

  const handleDelete = () => {
    if (confirm("WARNING: Irreversible deletion of operative data. Proceed?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => setLocation('/characters')
      });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center scanlines"><Activity className="w-12 h-12 text-primary animate-spin" /></div>;
  }

  if (!rawCharacter) {
    return <div className="p-8 text-center text-destructive">Operative not found.</div>;
  }

  const character = {
    ...rawCharacter,
    savingThrowProficiencies: rawCharacter.savingThrowProficiencies ?? [],
    skillProficiencies: rawCharacter.skillProficiencies ?? [],
    skillExpertise: rawCharacter.skillExpertise ?? [],
    conditions: rawCharacter.conditions ?? [],
    attacks: rawCharacter.attacks ?? [],
    hacks: rawCharacter.hacks ?? [],
    equipment: rawCharacter.equipment ?? [],
    features: rawCharacter.features ?? [],
    geneMods: rawCharacter.geneMods ?? [],
    cybernetics: rawCharacter.cybernetics ?? [],
    senses: rawCharacter.senses ?? { acuteOlfaction: false, darkvision: false, macrovision: false, microvision: false, penetration: false, spectrum: false },
    hackSlots: rawCharacter.hackSlots ?? {},
    currency: rawCharacter.currency ?? { satoshi: 0 },
  };

  const profBonus = getProficiencyBonus(character.level);

  return (
    <div className="min-h-screen bg-transparent scanlines pb-24 sm:pb-4 sm:pr-10">
      {/* Header Bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border px-4 py-2 shadow-lg shadow-black/50">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/characters" className="text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <button
              onClick={() => portraitInputRef.current?.click()}
              className="relative group w-10 h-10 rounded-full border border-primary overflow-hidden flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary"
              title="Upload hero portrait"
              disabled={isUploadingPortrait}
            >
              <img
                src={character.portraitUrl ? `/api/storage${character.portraitUrl}` : `${import.meta.env.BASE_URL}images/avatar-placeholder.png`}
                className="w-full h-full object-cover"
                alt="Avatar"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {isUploadingPortrait
                  ? <Activity className="w-4 h-4 text-primary animate-spin" />
                  : <Camera className="w-4 h-4 text-primary" />
                }
              </div>
            </button>
            <input
              ref={portraitInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handlePortraitUpload}
            />
            <div className="flex items-center gap-3 flex-wrap">
              <EditableField 
                value={character.name} 
                onSave={(v) => handleUpdate('name', v)} 
                className="text-xl font-bold text-foreground inline-block"
              />
              <div className="flex items-center gap-1.5 text-xs text-primary font-mono">
                Lvl <EditableField value={character.level} type="number" onSave={(v) => handleUpdate('level', v)} className="w-6 inline-block" /> 
                <EditableSelect value={character.class || ''} onSave={(v) => handleUpdate('class', v)} options={classOptions} className="inline-block min-w-[60px]" placeholder="Class" />
                <span className="text-muted-foreground">|</span>
                <span className="text-xs text-muted-foreground uppercase">Genome:</span>
                <EditableSelect value={character.genome || ''} onSave={(v) => handleUpdate('genome', v)} options={genomeOptions} className="inline-block text-muted-foreground min-w-[60px]" placeholder="Genome" />
                <span className="text-muted-foreground">|</span>
                <span className="text-xs text-muted-foreground uppercase">Cadre:</span>
                <EditableSelect value={character.cadre || ''} onSave={(v) => handleUpdate('cadre', v)} options={cadreOptions} className="inline-block text-muted-foreground min-w-[60px]" placeholder="Cadre" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {updateMutation.isPending && <Activity className="w-4 h-4 text-accent animate-spin" />}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded border text-xs font-mono transition-colors cursor-default ${beyond20Active ? 'border-green-500/60 bg-green-500/10 text-green-400' : 'border-border/40 bg-muted/30 text-muted-foreground'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${beyond20Active ? 'bg-green-400' : 'bg-muted-foreground/40'}`} />
                  B20 {beyond20Active ? 'linked' : 'offline'}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {beyond20Active ? 'Beyond20 extension detected — rolls will be forwarded to Roll20/Foundry.' : 'Beyond20 extension not detected. Install it to forward rolls to VTT.'}
              </TooltipContent>
            </Tooltip>
            <CyberButton variant="secondary" className="px-3 py-1 text-xs" onClick={() => setLevelUpOpen(true)}>
              <ArrowUp className="w-3 h-3 inline mr-1" /> Level Up
            </CyberButton>
            <CyberButton variant="destructive" className="px-2 py-1 text-xs" onClick={handleDelete}><Trash2 className="w-3 h-3"/></CyberButton>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 pt-4 relative z-10 space-y-4">
        {/* Ability Scores Row */}
        <div className="flex gap-3 items-stretch flex-wrap">
          {ABILITIES.map(stat => (
            <StatBox 
              key={stat.key} 
              label={stat.label} 
              score={character[stat.key as keyof Character] as number}
              onUpdate={(val) => handleUpdate(stat.key, val)}
              onRoll={openRoll}
            />
          ))}
        </div>

        {/* Stats Strip */}
        <div className="flex gap-3 items-stretch flex-wrap">
          <div className="bg-card border border-border clip-edges px-4 py-2.5 flex flex-col items-center justify-center min-w-[64px]" title={`Proficiency Bonus: +${profBonus}\nAdded to attacks, saves, and skills you're proficient in\nScales with level (currently Level ${character.level})`}>
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Prof</div>
            <div className="text-lg font-bold text-primary">+{profBonus}</div>
          </div>
          <div className="bg-card border border-border clip-edges px-4 py-2.5 flex flex-col items-center justify-center min-w-[64px]" title="MOSAIC Score — your cyberware and bioware integration rating\nHigher MOSAIC unlocks more powerful gene mods and hacks">
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono">MOSAIC</div>
            <EditableField value={character.mosaicScore} type="number" onSave={v => handleUpdate('mosaicScore', v)} className="text-lg font-bold text-accent text-center" />
          </div>
          <div className="bg-card border border-border clip-edges px-4 py-2.5 flex flex-col items-center justify-center min-w-[64px]" title={`Movement Speed: ${character.speed}m per turn\nClick to edit`}>
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Speed</div>
            <EditableField value={character.speed} type="number" onSave={v => handleUpdate('speed', v)} className="text-lg font-bold text-foreground text-center" />
          </div>
          <div className="bg-card border border-border clip-edges px-4 py-2.5 flex flex-col items-center justify-center min-w-[64px]" title={character.inspiration ? 'Inspired! You have advantage on one ability check, attack, or save' : 'Not inspired — click to toggle'}>
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Insp</div>
            <div 
              className="text-lg font-bold text-accent cursor-pointer"
              onClick={() => handleUpdate('inspiration', !character.inspiration)}
            >
              {character.inspiration ? '★' : '☆'}
            </div>
          </div>
          <div className="bg-card border border-border clip-edges px-4 py-2.5 flex items-center gap-2" title={`Armor Class: ${character.armorClass}\nAttackers must roll ${character.armorClass} or higher on their to-hit roll to damage you`}>
            <Shield className="text-primary w-5 h-5" />
            <div className="text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono">AC</div>
              <EditableField value={character.armorClass} type="number" onSave={v => handleUpdate('armorClass', v)} className="text-lg font-bold text-primary text-center" />
            </div>
          </div>
          <div className="bg-card border border-border clip-edges px-4 py-2.5 flex items-center gap-2" title={`Damage Reduction: ${character.damageReduction}\nSubtract ${character.damageReduction} from each hit before it applies to your HP`}>
            <Shield className="text-secondary w-5 h-5" />
            <div className="text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Damage Reduction</div>
              <EditableField value={character.damageReduction} type="number" onSave={v => handleUpdate('damageReduction', v)} className="text-lg font-bold text-secondary text-center" />
            </div>
          </div>
          {(() => {
            const dexMod = getModifier(character.dexterity);
            const customBonus = character.initiative ?? 0;
            const totalInit = dexMod + customBonus;
            const tooltip = `Initiative = DEX ${formatModifier(dexMod)} + bonus ${formatModifier(customBonus)} = ${formatModifier(totalInit)}\nClick to roll 1d20 ${formatModifier(totalInit)}`;
            const rollName = customBonus !== 0
              ? `Initiative (${formatModifier(dexMod)} DEX + ${formatModifier(customBonus)} bonus)`
              : `Initiative (${formatModifier(dexMod)} DEX)`;
            const initParts = [
              { value: dexMod, label: 'DEX' },
              ...(customBonus !== 0 ? [{ value: customBonus, label: 'Init bonus' }] : []),
            ];
            return (
              <div className="bg-card border border-border clip-edges px-4 py-2.5 flex items-center gap-2">
                <Zap className="text-accent w-5 h-5 shrink-0" />
                <div className="text-center">
                  <button
                    onClick={() => openRoll(rollName, totalInit)}
                    title={tooltip}
                    className="text-xs text-muted-foreground uppercase tracking-widest font-mono hover:text-primary transition-colors whitespace-nowrap"
                  >
                    Init ▶
                  </button>
                  <div className="text-lg font-bold text-accent leading-none" title={tooltip}>
                    {formatModifier(totalInit)}
                  </div>
                  <div className="flex items-center justify-center gap-0.5 mt-0.5">
                    <span className="text-[9px] text-muted-foreground/50 font-mono">+</span>
                    <EditableField
                      value={customBonus}
                      type="number"
                      onSave={v => handleUpdate('initiative', v)}
                      className="text-[10px] text-muted-foreground/70 text-center w-6 font-mono"
                    />
                    <span className="text-[9px] text-muted-foreground/50 font-mono">bonus</span>
                  </div>
                </div>
              </div>
            );
          })()}
          <div className="bg-card border border-border clip-edges px-4 py-2.5 flex-1 flex items-center gap-3 min-w-[280px]">
            <Heart className="text-destructive w-4 h-4 shrink-0" />
            <div className="flex items-center gap-2">
              <button onClick={() => handleUpdate('currentHitPoints', Math.max(0, character.currentHitPoints - 1))} className="w-6 h-6 bg-destructive/20 text-destructive rounded text-sm hover:bg-destructive hover:text-white transition-colors flex items-center justify-center font-bold">-</button>
              <div className="text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono">HP</div>
                <EditableField value={character.currentHitPoints} type="number" onSave={v => handleUpdate('currentHitPoints', v)} className="text-lg font-bold text-foreground text-center" />
              </div>
              <button onClick={() => handleUpdate('currentHitPoints', Math.min(character.maxHitPoints, character.currentHitPoints + 1))} className="w-6 h-6 bg-primary/20 text-primary rounded text-sm hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center font-bold">+</button>
            </div>
            <span className="text-muted-foreground text-lg">/</span>
            <div className="text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Max</div>
              <EditableField value={character.maxHitPoints} type="number" onSave={v => handleUpdate('maxHitPoints', v)} className="text-lg font-bold text-muted-foreground text-center" />
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex flex-col items-center gap-0.5">
              <div className="text-[10px] text-yellow-400/70 uppercase tracking-widest font-mono leading-none">Temp HP</div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleUpdate('temporaryHitPoints', Math.max(0, (character.temporaryHitPoints ?? 0) - 1))}
                  className="w-5 h-5 bg-yellow-500/20 text-yellow-400 rounded text-xs hover:bg-yellow-500 hover:text-black transition-colors flex items-center justify-center font-bold leading-none"
                >−</button>
                <EditableField
                  value={character.temporaryHitPoints ?? 0}
                  type="number"
                  onSave={v => handleUpdate('temporaryHitPoints', v)}
                  className="text-base font-bold text-yellow-400 text-center w-8"
                />
                <button
                  onClick={() => handleUpdate('temporaryHitPoints', (character.temporaryHitPoints ?? 0) + 1)}
                  className="w-5 h-5 bg-yellow-500/20 text-yellow-400 rounded text-xs hover:bg-yellow-500 hover:text-black transition-colors flex items-center justify-center font-bold leading-none"
                >+</button>
              </div>
              <div className="text-[9px] text-yellow-400/40 font-mono leading-none">soaks first</div>
            </div>
          </div>
        </div>

        {/* Three-Column Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Saves + Senses + Passives + Proficiencies */}
          <div className="lg:col-span-3 space-y-4">
            <CyberCard className="p-4">
              <div className="text-sm text-primary uppercase tracking-widest font-mono font-bold mb-3 border-b border-border/50 pb-1.5">Saving Throws</div>
              <div className="space-y-1 font-mono text-sm">
                {ABILITIES.map(stat => {
                  const isProf = character.savingThrowProficiencies.includes(stat.key);
                  const mod = getModifier(character[stat.key as keyof Character] as number);
                  const total = mod + (isProf ? profBonus : 0);
                  const abbr = stat.label.substring(0, 3).toUpperCase();
                  const saveParts = [
                    { value: mod, label: abbr },
                    ...(isProf ? [{ value: profBonus, label: 'Prof' }] : []),
                  ];
                  return (
                    <div key={stat.key} className="flex items-center gap-2 py-1 hover:bg-primary/5 px-1.5 -mx-1 rounded group">
                      <div 
                        className={`w-3.5 h-3.5 rounded-full border-2 cursor-pointer transition-colors ${isProf ? 'bg-primary border-primary' : 'border-muted-foreground/40 hover:border-primary'}`}
                        onClick={() => {
                          const newProfs = isProf
                            ? character.savingThrowProficiencies.filter(k => k !== stat.key)
                            : [...character.savingThrowProficiencies, stat.key];
                          handleUpdate('savingThrowProficiencies', newProfs);
                        }}
                      />
                      <span 
                        className="w-7 font-bold text-primary cursor-pointer hover:text-secondary transition-colors text-right"
                        onClick={() => openRoll(`${stat.label} Save`, total)}
                        title={isProf
                          ? `${formatModifier(mod)} (${abbr}) + ${formatModifier(profBonus)} (Prof) = ${formatModifier(total)}\nClick to roll`
                          : `${formatModifier(mod)} (${abbr}) — not proficient\nClick to roll`}
                      >
                        {formatModifier(total)}
                      </span>
                      <span className="text-muted-foreground uppercase group-hover:text-foreground transition-colors cursor-pointer" onClick={() => openRoll(`${stat.label} Save`, total)}>
                        {stat.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CyberCard>

            <CyberCard className="p-4">
              <div className="text-sm text-primary uppercase tracking-widest font-mono font-bold mb-3 border-b border-border/50 pb-1.5 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Senses
              </div>
              <div className="space-y-1.5 font-mono text-sm">
                {SENSES.map(sense => {
                  const senses = character.senses || { acuteOlfaction: false, darkvision: false, macrovision: false, microvision: false, penetration: false, spectrum: false };
                  const isActive = senses[sense.key as keyof CharacterSenses];
                  return (
                    <div key={sense.key} className="flex items-center gap-2 py-1 hover:bg-primary/5 px-1.5 -mx-1 rounded cursor-pointer"
                      onClick={() => {
                        const newSenses = { ...senses, [sense.key]: !isActive };
                        handleUpdate('senses', newSenses);
                      }}
                    >
                      <div className={`w-3.5 h-3.5 rounded border-2 transition-colors ${isActive ? 'bg-accent border-accent' : 'border-muted-foreground/40 hover:border-accent'}`} />
                      <span className={`${isActive ? 'text-accent' : 'text-muted-foreground'} transition-colors`}>{sense.label}</span>
                    </div>
                  );
                })}
              </div>
            </CyberCard>

            <CyberCard className="p-4">
              <div className="text-sm text-primary uppercase tracking-widest font-mono font-bold mb-3 border-b border-border/50 pb-1.5">Passive Scores</div>
              <div className="space-y-1.5 font-mono text-sm">
                {[
                  { label: 'Perception', skill: 'perception', ability: 'wisdom' as const },
                  { label: 'Investigation', skill: 'investigation', ability: 'intelligence' as const },
                  { label: 'Insight', skill: 'insight', ability: 'wisdom' as const },
                ].map(p => {
                  const abilityMod = getModifier(character[p.ability]);
                  const isProf = character.skillProficiencies.includes(p.skill);
                  const isExpert = character.skillExpertise.includes(p.skill);
                  let bonus = abilityMod;
                  if (isExpert) bonus += profBonus * 2;
                  else if (isProf) bonus += profBonus;
                  return (
                    <div key={p.skill} className="flex items-center justify-between py-1">
                      <span className="text-muted-foreground">{p.label}</span>
                      <span
                        className="text-primary font-bold text-base"
                        title={`10 (base) + ${formatModifier(abilityMod)} (${p.ability.substring(0,3).toUpperCase()})${isExpert ? ` + ${formatModifier(profBonus * 2)} (Expertise)` : isProf ? ` + ${formatModifier(profBonus)} (Prof)` : ''} = ${10 + bonus}`}
                      >{10 + bonus}</span>
                    </div>
                  );
                })}
              </div>
            </CyberCard>

            <CyberCard className="p-4">
              <div className="text-sm text-primary uppercase tracking-widest font-mono font-bold mb-3 border-b border-border/50 pb-1.5">Proficiencies</div>
              <div className="space-y-2.5 text-sm font-mono">
                {([
                  { label: 'Armor', field: 'armorProficiencies' as const },
                  { label: 'Weapons', field: 'weaponProficiencies' as const },
                  { label: 'Tools', field: 'toolProficiencies' as const },
                  { label: 'Languages', field: 'languages' as const },
                ] as const).map(p => (
                  <div key={p.field}>
                    <div className="text-muted-foreground/80 uppercase text-xs tracking-widest">{p.label}</div>
                    <EditableField 
                      value={character[p.field] || 'None'} 
                      onSave={v => handleUpdate(p.field, v)} 
                      className="text-sm text-foreground/90"
                    />
                  </div>
                ))}
              </div>
            </CyberCard>
          </div>

          {/* Center Column: Skills */}
          <div className="lg:col-span-4">
            <CyberCard className="p-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-sm text-primary uppercase tracking-widest font-mono font-bold mb-3 border-b border-border/50 pb-1.5 cursor-default">Skills</div>
                </TooltipTrigger>
                <TooltipContent>Proficiency</TooltipContent>
              </Tooltip>
              <SkillList character={character} onUpdate={handleUpdate} onRoll={openRoll} />
            </CyberCard>
          </div>

          {/* Right Column: Conditions + Death Saves + Mini Tabs */}
          <div className="lg:col-span-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <CyberCard className="p-4">
                <button
                  className="w-full text-left text-sm text-primary uppercase tracking-widest font-mono font-bold mb-3 border-b border-border/50 pb-1.5 hover:text-secondary transition-colors flex items-center gap-2 group"
                  title="Roll a Death Save (d20) — 11+ success, 10 or below failure, nat 20 stabilise"
                  onClick={() => openRoll('Death Save', 0, (total) => {
                    if (total === 20) {
                      handleUpdate('currentHitPoints', 1);
                      handleUpdate('deathSaveSuccesses', 0);
                      handleUpdate('deathSaveFailures', 0);
                    } else if (total === 1) {
                      handleUpdate('deathSaveFailures', Math.min(3, (character.deathSaveFailures ?? 0) + 2));
                    } else if (total >= 11) {
                      handleUpdate('deathSaveSuccesses', Math.min(3, (character.deathSaveSuccesses ?? 0) + 1));
                    } else {
                      handleUpdate('deathSaveFailures', Math.min(3, (character.deathSaveFailures ?? 0) + 1));
                    }
                  })}
                >
                  <span>Death Saves</span>
                  <span className="text-[10px] text-muted-foreground group-hover:text-secondary font-mono normal-case tracking-normal">roll d20 →</span>
                </button>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-primary w-12">Success</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div
                          key={`s${i}`}
                          className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-colors ${
                            (character.deathSaveSuccesses ?? 0) > i
                              ? 'bg-primary border-primary'
                              : 'border-muted-foreground/40 hover:border-primary'
                          }`}
                          onClick={() => handleUpdate('deathSaveSuccesses', (character.deathSaveSuccesses ?? 0) > i ? i : i + 1)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-destructive w-12">Failure</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div
                          key={`f${i}`}
                          className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-colors ${
                            (character.deathSaveFailures ?? 0) > i
                              ? 'bg-destructive border-destructive'
                              : 'border-muted-foreground/40 hover:border-destructive'
                          }`}
                          onClick={() => handleUpdate('deathSaveFailures', (character.deathSaveFailures ?? 0) > i ? i : i + 1)}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    className="text-[10px] text-muted-foreground/50 font-mono hover:text-muted-foreground transition-colors mt-1"
                    onClick={() => { handleUpdate('deathSaveSuccesses', 0); handleUpdate('deathSaveFailures', 0); }}
                  >reset</button>
                </div>
              </CyberCard>

              <CyberCard className="p-4">
                <div className="text-sm text-primary uppercase tracking-widest font-mono font-bold mb-3 border-b border-border/50 pb-1.5">Conditions</div>
                <div className="flex flex-wrap gap-1.5">
                  {character.conditions.map((cond, i) => (
                    <span key={i} className="bg-destructive/20 text-destructive text-xs px-2 py-1 font-mono uppercase flex items-center gap-1 clip-edges">
                      {cond}
                      <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => handleUpdate('conditions', character.conditions.filter((_, j) => j !== i))} />
                    </span>
                  ))}
                  <button
                    className="text-xs text-muted-foreground hover:text-primary border border-dashed border-muted-foreground/30 hover:border-primary px-2 py-1 font-mono uppercase transition-colors"
                    onClick={() => {
                      const cond = prompt("Condition:");
                      if (cond) handleUpdate('conditions', [...character.conditions, cond]);
                    }}
                  >+ Add</button>
                </div>
              </CyberCard>
            </div>

            {/* Mini Tab Panel */}
            <CyberCard className="p-0 flex flex-col" style={{ minHeight: '420px' }}>
              <div className="flex flex-wrap border-b border-border bg-card/50">
                {([
                  { key: 'actions' as MiniTab, label: 'Actions' },
                  { key: 'hacks' as MiniTab, label: 'Hacks' },
                  { key: 'inventory' as MiniTab, label: 'Inventory' },
                  { key: 'genemods' as MiniTab, label: 'Gene Mods' },
                  { key: 'cybernetics' as MiniTab, label: 'Cybernetics' },
                  { key: 'features' as MiniTab, label: 'Features' },
                  { key: 'bio' as MiniTab, label: 'Bio' },
                ]).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setMiniTab(tab.key)}
                    className={`px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 ${
                      miniTab === tab.key
                        ? 'text-primary border-primary bg-primary/10'
                        : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {miniTab === 'actions' && <ActionsPanel character={character} onUpdate={handleUpdate} onRoll={openRoll} onCustomRoll={openCustomRoll} />}

                {miniTab === 'hacks' && <HacksPanel character={character} onUpdate={handleUpdate} />}
                {miniTab === 'inventory' && <InventoryPanel character={character} onUpdate={handleUpdate} />}
                {miniTab === 'genemods' && <GeneModsPanel character={character} onUpdate={handleUpdate} />}
                {miniTab === 'cybernetics' && <CyberneticsPanel character={character} onUpdate={handleUpdate} />}
                {miniTab === 'features' && <FeaturesPanel character={character} onUpdate={handleUpdate} />}
                {miniTab === 'bio' && <BioPanel character={character} onUpdate={handleUpdate} backgroundOptions={backgroundOptions} />}
              </div>
            </CyberCard>
          </div>
        </div>
      </div>

      {levelUpOpen && (
        <LevelUpPanel
          character={character}
          onConfirm={(data) => {
            updateMutation.mutate(
              { id, data },
              { onSuccess: () => setLevelUpOpen(false) }
            );
          }}
          onClose={() => setLevelUpOpen(false)}
          isPending={updateMutation.isPending}
        />
      )}

      {/* Tray DiceRoller — always present, transparent, floating FAB in bottom-right */}
      {!quickRollOpen && (
        <div className="fixed inset-0 z-50" style={{ '--primary': '263 89% 66%', '--primary-foreground': '0 0% 100%', pointerEvents: 'none' } as React.CSSProperties}>
          <DiceRoller
            userId={authUserId}
            onResult={(results, label, modifier) => {
              if (!beyond20Active) return;
              const groups: Record<number, number> = {};
              results.forEach(r => { groups[r.dieType] = (groups[r.dieType] || 0) + 1; });
              const diceExpr = Object.entries(groups).map(([sides, count]) => `${count}d${sides}`).join('+');
              const roll = modifier !== 0 ? `${diceExpr}${modifier >= 0 ? '+' : ''}${modifier}` : diceExpr;
              document.dispatchEvent(
                new CustomEvent('Beyond20_SendMessage', {
                  detail: [{
                    action: 'roll',
                    type: 'custom',
                    name: label || diceExpr,
                    roll,
                    modifier: String(modifier),
                    advantage: 0,
                    whisper: 0,
                    character: {
                      name: rawCharacter?.name ?? 'GeneFunk Character',
                      type: 'Character',
                      url: window.location.href,
                    },
                  }],
                })
              );
            }}
          />
        </div>
      )}

      {/* Quick Roll Overlay — stat/skill/save clicks, dice + result only */}
      {quickRollOpen && quickRollData && (
        <div className="fixed inset-0 z-[60]" style={{ '--primary': '263 89% 66%', '--primary-foreground': '0 0% 100%' } as React.CSSProperties}>
          <DiceRoller
            key={quickRollKey}
            userId={authUserId}
            autoRoll={quickRollData}
            quickMode
            onClose={closeQuickRoll}
            onResult={(results, label, modifier) => {
              if (!beyond20Active) return;
              const groups: Record<number, number> = {};
              results.forEach(r => { groups[r.dieType] = (groups[r.dieType] || 0) + 1; });
              const diceExpr = Object.entries(groups).map(([sides, count]) => `${count}d${sides}`).join('+');
              const roll = modifier !== 0 ? `${diceExpr}${modifier >= 0 ? '+' : ''}${modifier}` : diceExpr;
              document.dispatchEvent(
                new CustomEvent('Beyond20_SendMessage', {
                  detail: [{
                    action: 'roll',
                    type: 'custom',
                    name: label || diceExpr,
                    roll,
                    modifier: String(modifier),
                    advantage: 0,
                    whisper: 0,
                    character: {
                      name: rawCharacter?.name ?? 'GeneFunk Character',
                      type: 'Character',
                      url: window.location.href,
                    },
                  }],
                })
              );
            }}
          />
        </div>
      )}
    </div>
  );
}

interface PanelProps {
  character: Character;
  onUpdate: (field: string, value: unknown) => void;
  onRoll?: (label: string, modifier: number) => void;
  onCustomRoll?: (dice: { sides: DieType; count: number }[], modifier: number, label: string) => void;
}

function updateArrayEntry<T extends { id: string }>(arr: T[], id: string, patch: Partial<T>): T[] {
  return arr.map(item => item.id === id ? { ...item, ...patch } : item);
}

function parseDiceExpression(expr: string): { sides: number; count: number; modifier: number } | null {
  const m = expr.trim().match(/^(\d+)d(\d+)\s*([+-]\s*\d+)?$/i);
  if (!m) return null;
  return {
    count: parseInt(m[1]),
    sides: parseInt(m[2]),
    modifier: m[3] ? parseInt(m[3].replace(/\s+/g, '')) : 0,
  };
}

function ActionsPanel({ character, onUpdate, onRoll, onCustomRoll }: PanelProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleWeaponSelect = (weapon: WeaponRef | null) => {
    setPickerOpen(false);
    if (weapon) {
      const isFinesse = /finesse/i.test(weapon.properties);
      const entry: AttackEntry = {
        id: Math.random().toString(),
        name: weapon.name,
        damage: weapon.damage,
        damageType: weapon.damageType,
        range: weapon.range,
        notes: weapon.properties ? `${weapon.cost} | ${weapon.properties}` : weapon.cost,
        weaponType: weapon.type,
        isFinesse,
      };
      onUpdate('attacks', [...character.attacks, entry]);
    } else {
      const entry: AttackEntry = {
        id: Math.random().toString(),
        name: '',
        attackBonus: '',
        damage: '',
        damageType: '',
        range: '',
        notes: '',
      };
      onUpdate('attacks', [...character.attacks, entry]);
    }
  };

  const profBonus = getProficiencyBonus(character.level);

  const renderHitCell = (atk: AttackEntry) => {
    const strMod = getModifier(character.strength);
    const dexMod = getModifier(character.dexterity);

    // If a weapon type is set, auto-calculate from ability mod + prof bonus
    if (atk.weaponType === 'melee' || atk.weaponType === 'ranged') {
      const statLabel = atk.isFinesse
        ? (dexMod >= strMod ? 'DEX' : 'STR')
        : atk.weaponType === 'ranged' ? 'DEX' : 'STR';
      const abilityMod = statLabel === 'DEX' ? dexMod : strMod;
      const bonus = abilityMod + profBonus;
      const rollName = `${atk.name} Attack (${formatModifier(abilityMod)} ${statLabel}, ${formatModifier(profBonus)} Prof)`;
      const tooltip = `${formatModifier(abilityMod)} ${statLabel} + ${formatModifier(profBonus)} Prof = ${formatModifier(bonus)} to hit — click to roll`;
      const attackParts = [
        { value: abilityMod, label: statLabel },
        { value: profBonus, label: 'Prof' },
      ];
      return (
        <button
          className="text-primary text-sm font-mono hover:text-primary/80 hover:underline cursor-pointer"
          title={tooltip}
          onClick={() => onRoll?.(rollName, bonus)}
        >
          {formatModifier(bonus)}
        </button>
      );
    }

    // Manual bonus — click to roll, click the value to edit
    const manualBonus = atk.attackBonus ? parseInt(String(atk.attackBonus).replace(/^\+/, '')) : NaN;
    return !isNaN(manualBonus) ? (
      <button
        className="text-primary text-sm font-mono hover:text-primary/80 hover:underline cursor-pointer"
        title={`Click to roll 1d20 ${formatModifier(manualBonus)}`}
        onClick={() => onRoll?.(`${atk.name} Attack`, manualBonus)}
      >
        {atk.attackBonus}
      </button>
    ) : (
      <EditableField
        value={atk.attackBonus || ''}
        onSave={v => onUpdate('attacks', updateArrayEntry(character.attacks, atk.id, { attackBonus: String(v) }))}
        className="text-primary text-sm font-mono w-10"
      />
    );
  };

  return (
    <div>
      <WeaponPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={handleWeaponSelect} />
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-primary uppercase tracking-widest font-mono font-bold">Attacks & Actions</span>
        <CyberButton variant="ghost" className="text-xs px-2 py-1" onClick={() => setPickerOpen(true)}>
          <Crosshair className="w-3 h-3 mr-1" /> Add
        </CyberButton>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground font-mono">
              <th className="p-2">Name</th>
              <th className="p-2">Hit</th>
              <th className="p-2">Damage</th>
              <th className="p-2">Type</th>
              <th className="p-2">Range</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody className="text-sm font-sans">
            {character.attacks.length === 0 ? (
              <tr><td colSpan={6} className="p-3 text-center text-muted-foreground italic">No weapons equipped</td></tr>
            ) : character.attacks.map((atk) => (
              <tr key={atk.id} className="border-b border-border/30 hover:bg-white/5 transition-colors">
                <td className="p-2">
                  <EditableField value={atk.name} onSave={v => onUpdate('attacks', updateArrayEntry(character.attacks, atk.id, { name: String(v) }))} className="text-foreground font-semibold text-sm" />
                </td>
                <td className="p-2">
                  {renderHitCell(atk)}
                </td>
                <td className="p-2">
                  {(() => {
                    const parsed = atk.damage ? parseDiceExpression(atk.damage) : null;
                    if (parsed) {
                      return (
                        <button
                          className="text-secondary text-sm font-mono hover:text-secondary/80 hover:underline cursor-pointer"
                          title={`Click to roll ${atk.damage}`}
                          onClick={() => onCustomRoll?.([{ sides: parsed.sides as DieType, count: parsed.count }], parsed.modifier, `${atk.name} Damage`)}
                        >
                          {atk.damage}
                        </button>
                      );
                    }
                    return (
                      <EditableField value={atk.damage || ''} onSave={v => onUpdate('attacks', updateArrayEntry(character.attacks, atk.id, { damage: String(v) }))} className="text-secondary text-sm font-mono" />
                    );
                  })()}
                </td>
                <td className="p-2">
                  <EditableField value={atk.damageType || ''} onSave={v => onUpdate('attacks', updateArrayEntry(character.attacks, atk.id, { damageType: String(v) }))} className="text-foreground/80 text-sm" />
                </td>
                <td className="p-2">
                  <EditableField value={atk.range || ''} onSave={v => onUpdate('attacks', updateArrayEntry(character.attacks, atk.id, { range: String(v) }))} className="text-foreground/70 text-sm font-mono" />
                </td>
                <td className="p-2 text-right">
                  <button onClick={() => onUpdate('attacks', character.attacks.filter(a => a.id !== atk.id))} className="text-destructive hover:underline text-xs font-mono">DEL</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const HACK_TYPE_COLORS: Record<string, string> = {
  'Injection':       'text-green-400 border-green-400/40 bg-green-400/10',
  'Gadget':          'text-cyan-400 border-cyan-400/40 bg-cyan-400/10',
  'Mind':            'text-violet-400 border-violet-400/40 bg-violet-400/10',
  'Software':        'text-blue-400 border-blue-400/40 bg-blue-400/10',
  'Craft Tech':      'text-yellow-400 border-yellow-400/40 bg-yellow-400/10',
  'Craft Explosive': 'text-orange-400 border-orange-400/40 bg-orange-400/10',
  'Bot':             'text-pink-400 border-pink-400/40 bg-pink-400/10',
  'Mind / Software': 'text-purple-400 border-purple-400/40 bg-purple-400/10',
  'Mind / Bot':      'text-fuchsia-400 border-fuchsia-400/40 bg-fuchsia-400/10',
  'Craft Tech / Bot':'text-amber-400 border-amber-400/40 bg-amber-400/10',
  'Software / Mind': 'text-indigo-400 border-indigo-400/40 bg-indigo-400/10',
};

function hackTypeBadgeClass(type: string): string {
  return HACK_TYPE_COLORS[type] ?? 'text-muted-foreground border-border/40 bg-background/30';
}

function HacksPanel({ character, onUpdate }: PanelProps) {
  const slots = character.hackSlots;
  const [expandedHacks, setExpandedHacks] = useState<Set<string>>(new Set());
  const [showBrowser, setShowBrowser] = useState(false);
  const [browserLevel, setBrowserLevel] = useState<number>(0); // 0 = all
  const [hackDragIdx, setHackDragIdx] = useState<number | null>(null);
  const [hackDragOver, setHackDragOver] = useState<number | null>(null);
  const hackDragFromHandle = React.useRef(false);

  const classHacks: HackData[] = HACKS_BY_CLASS[character.class ?? ''] ?? [];
  const knownNames = new Set(character.hacks.map(h => h.name));

  function toggleExpand(id: string) {
    setExpandedHacks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function learnHack(hack: HackData) {
    const entry: HackEntry = {
      id: Math.random().toString(36).slice(2),
      name: hack.name,
      level: hack.level,
      type: hack.type,
      launchTime: hack.launchTime,
      effect: hack.description,
    };
    onUpdate('hacks', [...character.hacks, entry]);
  }

  function forgetHack(name: string) {
    onUpdate('hacks', character.hacks.filter(h => h.name !== name));
  }

  const filteredBrowserHacks = classHacks.filter(h => browserLevel === 0 || h.level === browserLevel);
  const levelGroups = [1,2,3,4,5] as const;

  return (
    <div className="space-y-3">
      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 gap-2 text-sm font-mono">
        <div className="border border-border/50 p-2.5 bg-background/30 clip-edges">
          <div className="text-xs text-muted-foreground uppercase">Hack Attack Bonus</div>
          <EditableField value={character.hackAttackBonus ?? 0} type="number" onSave={v => onUpdate('hackAttackBonus', v)} className="text-sm font-bold text-primary" />
        </div>
        <div className="border border-border/50 p-2.5 bg-background/30 clip-edges">
          <div className="text-xs text-muted-foreground uppercase">Hack Save DC</div>
          <EditableField value={character.hackSaveDC ?? 0} type="number" onSave={v => onUpdate('hackSaveDC', v)} className="text-sm font-bold text-primary" />
        </div>
      </div>

      {/* ── Hack slot tracker ── */}
      <div className="grid grid-cols-5 gap-1 text-center font-mono text-xs">
        {[1,2,3,4,5].map(lvl => {
          const key = `level${lvl}`;
          const slot = slots[key] || { total: 0, used: 0 };
          const pips = slot.total;
          return (
            <div key={lvl} className="border border-border/50 p-1.5 clip-edges bg-background/30">
              <div className="text-xs text-muted-foreground mb-0.5">Lvl {lvl}</div>
              <div className="flex flex-wrap gap-0.5 justify-center mb-1">
                {Array.from({ length: Math.max(pips, 0) }).map((_, i) => (
                  <button
                    key={i}
                    title={i < slot.used ? "Click to restore" : "Click to use"}
                    className={`w-3 h-3 rounded-sm border transition-colors ${i < slot.used ? 'bg-primary border-primary' : 'bg-background/50 border-border/60 hover:border-primary/60'}`}
                    onClick={() => {
                      const newUsed = i < slot.used ? i : i + 1;
                      const newSlots: CharacterHackSlots = { ...slots, [key]: { ...slot, used: newUsed } };
                      onUpdate('hackSlots', newSlots);
                    }}
                  />
                ))}
                {pips === 0 && <span className="text-muted-foreground/40 text-xs">—</span>}
              </div>
              <div className="flex gap-0.5 justify-center">
                <button className="text-[10px] text-muted-foreground hover:text-primary px-0.5" title="Add slot"
                  onClick={() => { const newSlots: CharacterHackSlots = { ...slots, [key]: { ...slot, total: slot.total + 1 } }; onUpdate('hackSlots', newSlots); }}>+</button>
                <button className="text-[10px] text-muted-foreground hover:text-destructive px-0.5" title="Remove slot"
                  onClick={() => { const newSlots: CharacterHackSlots = { ...slots, [key]: { ...slot, total: Math.max(0, slot.total - 1), used: Math.min(slot.used, Math.max(0, slot.total - 1)) } }; onUpdate('hackSlots', newSlots); }}>−</button>
                <button className="text-[10px] text-muted-foreground hover:text-secondary px-0.5" title="Reset used"
                  onClick={() => { const newSlots: CharacterHackSlots = { ...slots, [key]: { ...slot, used: 0 } }; onUpdate('hackSlots', newSlots); }}>↺</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Known hacks ── */}
      <div>
        <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-1.5">Known Hacks ({character.hacks.length})</div>
        {character.hacks.length === 0 ? (
          <div className="text-xs text-muted-foreground italic p-3 text-center border border-border/30 bg-background/20">
            No hacks learned yet. Use the class hack browser below.
          </div>
        ) : (
          <div className="space-y-1">
            {character.hacks.map((hack, idx) => {
              const key = `known-${hack.id}`;
              const expanded = expandedHacks.has(key);
              const isDragOver = hackDragOver === idx && hackDragIdx !== idx;
              return (
                <div
                  key={hack.id}
                  draggable
                  onDragStart={e => { if (!hackDragFromHandle.current) { e.preventDefault(); return; } setHackDragIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
                  onDragOver={e => { e.preventDefault(); setHackDragOver(idx); }}
                  onDrop={e => { e.preventDefault(); if (hackDragIdx !== null && hackDragIdx !== idx) { const next = [...character.hacks]; const [m] = next.splice(hackDragIdx, 1); next.splice(idx, 0, m); onUpdate('hacks', next); } setHackDragIdx(null); setHackDragOver(null); hackDragFromHandle.current = false; }}
                  onDragEnd={() => { setHackDragIdx(null); setHackDragOver(null); hackDragFromHandle.current = false; }}
                  className={`border border-border/40 bg-background/20 clip-edges transition-all ${isDragOver ? 'border-t-2 border-t-primary' : ''} ${hackDragIdx === idx ? 'opacity-40' : ''}`}
                >
                  <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-white/5" onClick={() => toggleExpand(key)}>
                    <GripVertical size={12} className="text-muted-foreground/30 hover:text-muted-foreground/70 cursor-grab shrink-0 transition-colors" onMouseDown={() => { hackDragFromHandle.current = true; }} onMouseUp={() => { hackDragFromHandle.current = false; }} onClick={e => e.stopPropagation()} />
                    <span className="text-primary font-mono text-xs w-5 text-center border border-primary/30 bg-primary/10">{hack.level}</span>
                    <span className="flex-1 text-sm font-semibold text-foreground truncate">{hack.name}</span>
                    {hack.type && (
                      <span className={`text-[10px] font-mono px-1 border rounded-sm ${hackTypeBadgeClass(hack.type)}`}>{hack.type}</span>
                    )}
                    {hack.launchTime && (
                      <span className="text-xs text-muted-foreground hidden sm:block">{hack.launchTime}</span>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); forgetHack(hack.name); }}
                      className="text-destructive/60 hover:text-destructive text-xs font-mono ml-1"
                      title="Forget hack"
                    >✕</button>
                    <ChevronRight size={14} className={`text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
                  </div>
                  {expanded && (
                    <div className="px-3 pb-2 pt-0 border-t border-border/20">
                      {hack.launchTime && <div className="text-xs text-muted-foreground mt-1"><span className="text-foreground/60 font-mono">Launch:</span> {hack.launchTime}</div>}
                      {hack.effect && <div className="text-xs text-foreground/80 mt-1 leading-relaxed">{hack.effect}</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Class hack browser ── */}
      {classHacks.length > 0 ? (
        <div>
          <button
            className="w-full flex items-center justify-between text-xs text-muted-foreground uppercase tracking-widest font-mono p-1.5 border border-border/30 bg-background/20 hover:bg-white/5 transition-colors"
            onClick={() => setShowBrowser(b => !b)}
          >
            <span>{character.class} Hack Library ({classHacks.length} hacks)</span>
            <span className="flex items-center gap-1">
              <ChevronRight size={14} className={`transition-transform duration-200 ${showBrowser ? 'rotate-90' : ''}`} />
              {showBrowser ? 'Hide' : 'Browse'}
            </span>
          </button>
          {showBrowser && (
            <div className="mt-1 border border-border/30 bg-background/10">
              {/* Level filter */}
              <div className="flex gap-1 p-2 border-b border-border/20">
                <span className="text-xs text-muted-foreground font-mono mr-1 self-center">Filter:</span>
                {[0,1,2,3,4,5].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setBrowserLevel(lvl)}
                    className={`text-xs font-mono px-2 py-0.5 border transition-colors ${browserLevel === lvl ? 'border-primary bg-primary/20 text-primary' : 'border-border/40 text-muted-foreground hover:border-primary/40'}`}
                  >
                    {lvl === 0 ? 'All' : `L${lvl}`}
                  </button>
                ))}
              </div>
              {/* Hack list grouped by level */}
              <div className="max-h-96 overflow-y-auto">
                {levelGroups.filter(lvl => browserLevel === 0 || browserLevel === lvl).map(lvl => {
                  const hacks = filteredBrowserHacks.filter(h => h.level === lvl);
                  if (hacks.length === 0) return null;
                  return (
                    <div key={lvl}>
                      <div className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground/60 px-2 py-1 border-b border-border/20 bg-background/30 sticky top-0">
                        Level {lvl} Hacks
                      </div>
                      {hacks.map(hack => {
                        const browseKey = `browse-${hack.name}`;
                        const expanded = expandedHacks.has(browseKey);
                        const known = knownNames.has(hack.name);
                        return (
                          <div key={hack.name} className={`border-b border-border/10 ${known ? 'opacity-60' : ''}`}>
                            <div
                              className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 cursor-pointer"
                              onClick={() => toggleExpand(browseKey)}
                            >
                              <span className={`text-[10px] font-mono px-1 border rounded-sm flex-shrink-0 ${hackTypeBadgeClass(hack.type)}`}>{hack.type}</span>
                              <span className="flex-1 text-xs text-foreground truncate">{hack.name}</span>
                              <span className="text-[10px] text-muted-foreground flex-shrink-0">{hack.launchTime}</span>
                              {known ? (
                                <span className="text-xs text-green-400 font-mono flex-shrink-0">✓</span>
                              ) : (
                                <button
                                  onClick={e => { e.stopPropagation(); learnHack(hack); }}
                                  className="text-[10px] font-mono text-primary hover:text-primary/80 border border-primary/40 px-1.5 py-0.5 hover:bg-primary/10 transition-colors flex-shrink-0"
                                  title="Learn this hack"
                                >Learn</button>
                              )}
                              <ChevronRight size={13} className={`text-muted-foreground flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
                            </div>
                            {expanded && (
                              <div className="px-3 pb-2 border-t border-border/10 bg-background/20">
                                <div className="text-[10px] text-muted-foreground mt-1 font-mono">Duration: {hack.duration}</div>
                                <div className="text-xs text-foreground/75 mt-1 leading-relaxed">{hack.description}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <CyberButton variant="ghost" className="w-full text-xs py-1" onClick={() => {
          const name = prompt("Hack Name:");
          if (name) {
            const entry: HackEntry = { id: Math.random().toString(), name, level: 1 };
            onUpdate('hacks', [...character.hacks, entry]);
          }
        }}>+ Add Hack Manually</CyberButton>
      )}
    </div>
  );
}

type ShopTab = 'armor' | 'drugs' | 'gear' | 'poisons';

function InventoryPanel({ character, onUpdate }: PanelProps) {
  const [showShop, setShowShop] = useState(false);
  const [shopTab, setShopTab] = useState<ShopTab>('armor');
  const [armorFilter, setArmorFilter] = useState<'All' | 'Light' | 'Medium' | 'Heavy'>('All');
  const [gearFilter, setGearFilter] = useState('All');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [addSelected, setAddSelected] = useState('');
  const [addCustomName, setAddCustomName] = useState('');
  const [addCustomDesc, setAddCustomDesc] = useState('');
  const [eqDragIdx, setEqDragIdx] = useState<number | null>(null);
  const [eqDragOver, setEqDragOver] = useState<number | null>(null);
  const eqDragFromHandle = React.useRef(false);

  const equippedArmorName = character.equippedArmor ?? '';
  const equippedArmor: ArmorData | undefined = ARMOR.find(a => a.name === equippedArmorName);

  const allKnownItems: { name: string; description: string; mass: number; group: string }[] = [
    ...GEAR.map(g => ({ name: g.name, description: g.effect, mass: typeof g.mass === 'number' ? g.mass : 0, group: `Gear — ${g.category}` })),
    ...DRUGS.map(d => ({ name: d.name, description: d.effect + (d.downside && d.downside !== 'None.' ? ` Downside: ${d.downside}` : ''), mass: 0, group: 'Drugs' })),
    ...POISONS.map(p => ({ name: p.name, description: `${p.type}. DC ${p.dc}. ${p.effect}`, mass: 0, group: 'Poisons' })),
    ...ARMOR.map(a => ({ name: a.name, description: `AC: ${a.acFormula} · DR ${a.dr} · ${a.conspicuous}${a.stealthDisadvantage ? ' · Stealth Disadv.' : ''}`, mass: typeof a.mass === 'number' ? a.mass : 0, group: `Armor — ${a.category}` })),
  ];

  function toggleExpanded(id: string) {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function addToInventory(name: string, mass: number | string, description?: string) {
    const weight = typeof mass === 'number' ? mass : 0;
    const entry: EquipmentEntry = { id: Math.random().toString(), name, quantity: 1, weight, equipped: false, description: description ?? '' };
    onUpdate('equipment', [...character.equipment, entry]);
  }

  function handleAddFormSubmit() {
    if (addSelected) {
      const known = allKnownItems.find(i => i.name === addSelected);
      if (known) {
        addToInventory(known.name, known.mass, known.description);
      }
    } else if (addCustomName.trim()) {
      addToInventory(addCustomName.trim(), 0, addCustomDesc.trim());
    }
    setAddSelected('');
    setAddCustomName('');
    setAddCustomDesc('');
    setShowAddForm(false);
  }

  const gearCategories = ['All', ...Array.from(new Set(GEAR.map(g => g.category)))];
  const filteredGear = gearFilter === 'All' ? GEAR : GEAR.filter(g => g.category === gearFilter);
  const filteredArmor = armorFilter === 'All' ? ARMOR : ARMOR.filter(a => a.category === armorFilter);

  return (
    <div className="space-y-3">
      {/* Currency */}
      <div className="flex items-center justify-between">
        <div className="border border-border/50 p-2 bg-background/30 clip-edges inline-block min-w-[120px]">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-mono">シ Satoshi</div>
          <EditableField
            value={character.currency.satoshi}
            type="number"
            onSave={(v) => onUpdate('currency', { satoshi: Number(v) || 0 })}
            className="text-lg font-bold text-accent text-center"
          />
        </div>
        <CyberButton variant={showShop ? 'primary' : 'ghost'} className="text-xs px-3 py-1" onClick={() => setShowShop(s => !s)}>
          {showShop ? 'Close Shop' : '◈ Shop'}
        </CyberButton>
      </div>

      {/* Equipped Armor Block */}
      <div className="border border-border/40 bg-card/20 p-2 clip-edges">
        <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-1.5">Equipped Armor</div>
        <select
          value={equippedArmorName}
          onChange={e => onUpdate('equippedArmor' as keyof Character, e.target.value as Character[keyof Character])}
          className="w-full bg-background/60 border border-border text-foreground font-mono text-xs px-2 py-1.5 rounded-none focus:outline-none focus:border-primary"
        >
          <option value="">— None / Unarmored —</option>
          {(['Light', 'Medium', 'Heavy'] as const).map(cat => (
            <optgroup key={cat} label={`── ${cat} Armor ──`}>
              {ARMOR.filter(a => a.category === cat).map(a => (
                <option key={a.name} value={a.name}>{a.name} ({a.acFormula}) DR {a.dr}</option>
              ))}
            </optgroup>
          ))}
        </select>
        {equippedArmor && (
          <div className="mt-1.5 grid grid-cols-3 gap-1 text-[10px] font-mono text-center">
            <div className="border border-primary/30 p-1 bg-primary/5">
              <div className="text-muted-foreground">AC</div>
              <div className="text-primary font-bold">{equippedArmor.acFormula}</div>
            </div>
            <div className="border border-border/30 p-1">
              <div className="text-muted-foreground">DR</div>
              <div className="text-foreground font-bold">{equippedArmor.dr}</div>
            </div>
            <div className={`border p-1 ${equippedArmor.conspicuous === 'Obvious' ? 'border-destructive/40 text-destructive' : equippedArmor.conspicuous === 'Concealable' ? 'border-yellow-500/40 text-yellow-400' : 'border-border/30 text-muted-foreground'}`}>
              <div className="opacity-70">Vis</div>
              <div className="font-bold">{equippedArmor.conspicuous}</div>
            </div>
          </div>
        )}
        {equippedArmor?.stealthDisadvantage && (
          <div className="text-[10px] text-yellow-400 font-mono mt-1">⚠ Stealth disadvantage</div>
        )}
        {equippedArmor?.strengthReq && (
          <div className="text-[10px] text-muted-foreground font-mono">Str {equippedArmor.strengthReq}+ required</div>
        )}
      </div>

      {/* Shop Panel */}
      {showShop && (
        <div className="border border-primary/30 bg-card/30 p-2 clip-edges space-y-2">
          <div className="flex gap-1">
            {(['armor', 'drugs', 'gear', 'poisons'] as ShopTab[]).map(t => (
              <button key={t} onClick={() => setShopTab(t)}
                className={`flex-1 text-[10px] font-mono uppercase tracking-widest py-1 border transition-colors ${shopTab === t ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                {t}
              </button>
            ))}
          </div>

          {shopTab === 'armor' && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {(['All', 'Light', 'Medium', 'Heavy'] as const).map(f => (
                  <button key={f} onClick={() => setArmorFilter(f)}
                    className={`text-[10px] font-mono px-2 py-0.5 border ${armorFilter === f ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}>
                    {f}
                  </button>
                ))}
              </div>
              <div className="max-h-52 overflow-y-auto space-y-0.5">
                {filteredArmor.map(a => (
                  <div key={a.name} className="flex items-center justify-between gap-1 py-1 px-1 border-b border-border/20 hover:bg-white/5">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-foreground truncate">{a.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">AC: {a.acFormula} · DR {a.dr} · {a.cost} · {a.mass}kg</div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => onUpdate('equippedArmor' as keyof Character, a.name as Character[keyof Character])}
                        className="text-[10px] text-primary border border-primary/40 px-1.5 py-0.5 font-mono hover:bg-primary/10">Equip</button>
                      <button onClick={() => addToInventory(a.name, a.mass, `AC: ${a.acFormula} · DR ${a.dr} · ${a.conspicuous}${a.stealthDisadvantage ? ' · Stealth Disadv.' : ''}`)}
                        className="text-[10px] text-accent border border-accent/40 px-1.5 py-0.5 font-mono hover:bg-accent/10">+Inv</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {shopTab === 'drugs' && (
            <div className="max-h-60 overflow-y-auto space-y-0.5">
              {DRUGS.map(d => (
                <div key={d.name} className="flex items-start justify-between gap-1 py-1.5 px-1 border-b border-border/20 hover:bg-white/5">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-foreground">{d.name} <span className="text-accent">{d.cost}</span></div>
                    <div className="text-[10px] text-muted-foreground font-mono leading-tight">{d.effect}</div>
                    {d.downside && d.downside !== 'None.' && (
                      <div className="text-[10px] text-yellow-400/80 font-mono leading-tight">{d.downside}</div>
                    )}
                  </div>
                  <button onClick={() => addToInventory(d.name, 0, d.effect + (d.downside && d.downside !== 'None.' ? ` Downside: ${d.downside}` : ''))}
                    className="text-[10px] text-accent border border-accent/40 px-1.5 py-0.5 font-mono hover:bg-accent/10 shrink-0">+</button>
                </div>
              ))}
            </div>
          )}

          {shopTab === 'gear' && (
            <div className="space-y-1">
              <select value={gearFilter} onChange={e => setGearFilter(e.target.value)}
                className="w-full bg-background border border-border text-foreground font-mono text-[10px] px-2 py-1 focus:outline-none focus:border-primary">
                {gearCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="max-h-52 overflow-y-auto space-y-0.5">
                {filteredGear.map(g => (
                  <div key={g.name} className="flex items-start justify-between gap-1 py-1.5 px-1 border-b border-border/20 hover:bg-white/5">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-foreground">{g.name} <span className="text-accent">{g.cost}</span></div>
                      <div className="text-[10px] text-muted-foreground font-mono leading-tight">{g.effect}</div>
                    </div>
                    <button onClick={() => addToInventory(g.name, g.mass, g.effect)}
                      className="text-[10px] text-accent border border-accent/40 px-1.5 py-0.5 font-mono hover:bg-accent/10 shrink-0">+</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {shopTab === 'poisons' && (
            <div className="max-h-60 overflow-y-auto space-y-0.5">
              {POISONS.map(p => (
                <div key={p.name} className="flex items-start justify-between gap-1 py-1.5 px-1 border-b border-border/20 hover:bg-white/5">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-foreground">{p.name} <span className="text-accent">{p.cost}</span> <span className="text-muted-foreground">DC {p.dc}</span></div>
                    <div className="text-[10px] text-yellow-400/80 font-mono leading-tight">{p.type}</div>
                    <div className="text-[10px] text-muted-foreground font-mono leading-tight">{p.effect}</div>
                  </div>
                  <button onClick={() => addToInventory(p.name, 0, `${p.type}. DC ${p.dc}. ${p.effect}`)}
                    className="text-[10px] text-accent border border-accent/40 px-1.5 py-0.5 font-mono hover:bg-accent/10 shrink-0">+</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Inventory List */}
      <div className="space-y-0 font-mono text-sm">
        <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-1">Inventory</div>
        {character.equipment.map((eq, idx) => {
          const isOpen = expandedItems.has(eq.id);
          const isDragOver = eqDragOver === idx && eqDragIdx !== idx;
          return (
            <div
              key={eq.id}
              draggable
              onDragStart={e => { if (!eqDragFromHandle.current) { e.preventDefault(); return; } setEqDragIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
              onDragOver={e => { e.preventDefault(); setEqDragOver(idx); }}
              onDrop={e => { e.preventDefault(); if (eqDragIdx !== null && eqDragIdx !== idx) { const next = [...character.equipment]; const [m] = next.splice(eqDragIdx, 1); next.splice(idx, 0, m); onUpdate('equipment', next); } setEqDragIdx(null); setEqDragOver(null); eqDragFromHandle.current = false; }}
              onDragEnd={() => { setEqDragIdx(null); setEqDragOver(null); eqDragFromHandle.current = false; }}
              className={`border-b border-border/20 transition-all ${isDragOver ? 'border-t-2 border-t-primary' : ''} ${eqDragIdx === idx ? 'opacity-40' : ''}`}
            >
              <div className="flex items-center justify-between py-1.5 px-1.5 hover:bg-white/5 gap-1">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <GripVertical size={12} className="text-muted-foreground/30 hover:text-muted-foreground/70 cursor-grab shrink-0 transition-colors" onMouseDown={() => { eqDragFromHandle.current = true; }} onMouseUp={() => { eqDragFromHandle.current = false; }} />
                  <button
                    onClick={() => toggleExpanded(eq.id)}
                    className="text-muted-foreground/60 hover:text-primary shrink-0 transition-colors"
                    title="Toggle description"
                  >
                    <ChevronRight size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                  </button>
                  <EditableField value={eq.quantity} type="number" onSave={v => onUpdate('equipment', updateArrayEntry(character.equipment, eq.id, { quantity: Number(v) }))} className="text-foreground/70 w-6 text-right text-sm" />
                  <span className="text-muted-foreground">×</span>
                  <EditableField value={eq.name} onSave={v => onUpdate('equipment', updateArrayEntry(character.equipment, eq.id, { name: String(v) }))} className="text-foreground text-sm" />
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <EditableField value={eq.weight || 0} type="number" onSave={v => onUpdate('equipment', updateArrayEntry(character.equipment, eq.id, { weight: Number(v) }))} className="text-foreground/70 text-sm w-6" />
                  <span className="text-muted-foreground text-xs">kg</span>
                  <button onClick={() => onUpdate('equipment', character.equipment.filter(e => e.id !== eq.id))} className="text-destructive text-xs hover:underline ml-1 font-mono">DEL</button>
                </div>
              </div>
              {isOpen && (
                <div className="px-6 pb-2">
                  <textarea
                    value={eq.description ?? ''}
                    onChange={e => onUpdate('equipment', updateArrayEntry(character.equipment, eq.id, { description: e.target.value }))}
                    placeholder="No description. Click to add notes..."
                    rows={3}
                    className="w-full bg-background/40 border border-border/40 text-foreground/80 font-mono text-[11px] px-2 py-1.5 resize-y focus:outline-none focus:border-primary/60 placeholder:text-muted-foreground/40 leading-relaxed"
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Add Item Form */}
        {showAddForm ? (
          <div className="mt-2 border border-border/40 bg-background/30 p-2 space-y-2">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Add Item</div>
            <select
              value={addSelected}
              onChange={e => {
                setAddSelected(e.target.value);
                setAddCustomName('');
                const known = allKnownItems.find(i => i.name === e.target.value);
                setAddCustomDesc(known?.description ?? '');
              }}
              className="w-full bg-background border border-border text-foreground font-mono text-[11px] px-2 py-1.5 focus:outline-none focus:border-primary"
            >
              <option value="">— Pick from rulebook, or type custom below —</option>
              {Array.from(new Set(allKnownItems.map(i => i.group))).map(group => (
                <optgroup key={group} label={group}>
                  {allKnownItems.filter(i => i.group === group).map(i => (
                    <option key={i.name} value={i.name}>{i.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            {!addSelected && (
              <input
                type="text"
                value={addCustomName}
                onChange={e => setAddCustomName(e.target.value)}
                placeholder="Custom item name..."
                className="w-full bg-background border border-border text-foreground font-mono text-[11px] px-2 py-1.5 focus:outline-none focus:border-primary placeholder:text-muted-foreground/40"
              />
            )}
            <textarea
              value={addCustomDesc}
              onChange={e => setAddCustomDesc(e.target.value)}
              placeholder="Description (auto-filled from rulebook if known)..."
              rows={2}
              className="w-full bg-background/40 border border-border/40 text-foreground/80 font-mono text-[11px] px-2 py-1.5 resize-none focus:outline-none focus:border-primary/60 placeholder:text-muted-foreground/40"
            />
            <div className="flex gap-2">
              <CyberButton variant="primary" className="text-xs py-1 flex-1" onClick={handleAddFormSubmit}>Add to Inventory</CyberButton>
              <CyberButton variant="ghost" className="text-xs py-1" onClick={() => { setShowAddForm(false); setAddSelected(''); setAddCustomName(''); setAddCustomDesc(''); }}>Cancel</CyberButton>
            </div>
          </div>
        ) : (
          <CyberButton variant="ghost" className="w-full text-xs mt-2 py-1" onClick={() => setShowAddForm(true)}>+ Add Item</CyberButton>
        )}
      </div>
    </div>
  );
}

function UpgradeSlotCounter({ character }: { character: Character }) {
  const biowareSlots = character.geneMods.filter(m => m.type !== 'Cosmetic').length;
  const cyberSlots = character.cybernetics.length;
  const total = biowareSlots + cyberSlots;
  const MAX = 8;
  const over = total > MAX;
  return (
    <div className={`flex items-center gap-2 text-xs font-mono px-2 py-1 border rounded-sm ${over ? 'border-destructive text-destructive' : 'border-border text-muted-foreground'}`}>
      <span className="uppercase tracking-widest">Upgrade Slots</span>
      <span className={`font-bold ${over ? 'text-destructive' : total >= MAX ? 'text-yellow-400' : 'text-primary'}`}>{total} / {MAX}</span>
    </div>
  );
}

function GeneModsPanel({ character, onUpdate }: PanelProps) {
  const [selectedKey, setSelectedKey] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customType, setCustomType] = useState<'Bioware' | 'Cosmetic'>('Bioware');

  const biowareOptions = UPGRADES.filter(u => u.type === 'bioware');
  const preview: UpgradeData | undefined = biowareOptions.find(u => `${u.name}|||${u.brand}` === selectedKey);

  function installBioware() {
    if (!preview) return;
    const entry: GeneModEntry = {
      id: Math.random().toString(),
      name: `${preview.name} (${preview.brand})`,
      type: preview.countsAsSlot ? 'Bioware' : 'Cosmetic',
      description: preview.effectSummary,
      active: true,
    };
    onUpdate('geneMods', [...character.geneMods, entry]);
    setSelectedKey('');
  }

  function installCustom() {
    if (!customName.trim()) return;
    const entry: GeneModEntry = {
      id: Math.random().toString(),
      name: customName.trim(),
      type: customType,
      description: customDescription.trim(),
      active: true,
    };
    onUpdate('geneMods', [...character.geneMods, entry]);
    setCustomName('');
    setCustomDescription('');
    setCustomType('Bioware');
    setCustomMode(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-primary uppercase tracking-widest font-mono font-bold">Bioware</span>
        <UpgradeSlotCounter character={character} />
      </div>

      {!customMode ? (
        <>
          {/* Catalogue picker */}
          <div className="flex gap-1">
            <select
              value={selectedKey}
              onChange={e => setSelectedKey(e.target.value)}
              className="flex-1 text-xs font-mono bg-background border border-border rounded-sm px-2 py-1.5 text-foreground focus:outline-none focus:border-primary"
            >
              <option value="">— Browse bioware catalogue —</option>
              {biowareOptions.map(u => (
                <option key={`${u.name}|||${u.brand}`} value={`${u.name}|||${u.brand}`}>
                  {u.name} [{u.brand}] {u.cost}
                </option>
              ))}
            </select>
            <CyberButton variant="primary" className="text-xs px-2 py-1" onClick={installBioware} disabled={!selectedKey}>
              Install
            </CyberButton>
          </div>
          <button
            onClick={() => { setCustomMode(true); setSelectedKey(''); }}
            className="w-full text-xs font-mono text-primary/70 hover:text-primary border border-dashed border-primary/30 hover:border-primary/60 py-1.5 rounded-sm transition-colors"
          >
            + Custom Entry
          </button>

          {/* Preview of selected upgrade */}
          {preview && (
            <div className="p-2 border border-primary/40 bg-primary/5 rounded-sm text-xs font-mono text-foreground/80 leading-relaxed">
              <div className="font-bold text-primary mb-0.5">{preview.name} <span className="text-muted-foreground">[{preview.brand}]</span> · {preview.cost}</div>
              <div>{preview.effectSummary}</div>
              {!preview.countsAsSlot && <div className="text-yellow-400 mt-1">★ Does not consume an upgrade slot.</div>}
            </div>
          )}
        </>
      ) : (
        /* Custom entry form */
        <div className="border border-primary/40 bg-primary/5 rounded-sm p-3 space-y-2">
          <div className="text-xs text-primary font-mono uppercase tracking-widest mb-1">Custom Bioware Entry</div>
          <input
            autoFocus
            type="text"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && installCustom()}
            placeholder="Name (e.g. Myofibril Weave)"
            className="w-full bg-background border border-border px-2 py-1.5 text-xs font-mono text-foreground placeholder-muted-foreground/40 focus:outline-none focus:border-primary rounded-sm"
          />
          <textarea
            value={customDescription}
            onChange={e => setCustomDescription(e.target.value)}
            placeholder="Effect / description (optional)"
            rows={2}
            className="w-full bg-background border border-border px-2 py-1.5 text-xs font-mono text-foreground placeholder-muted-foreground/40 focus:outline-none focus:border-primary rounded-sm resize-none"
          />
          <div className="flex items-center gap-2">
            <select
              value={customType}
              onChange={e => setCustomType(e.target.value as 'Bioware' | 'Cosmetic')}
              className="flex-1 text-xs font-mono bg-background border border-border rounded-sm px-2 py-1.5 text-foreground focus:outline-none focus:border-primary"
            >
              <option value="Bioware">Bioware (uses slot)</option>
              <option value="Cosmetic">Cosmetic (no slot)</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setCustomMode(false); setCustomName(''); setCustomDescription(''); }}
              className="flex-1 text-xs font-mono py-1.5 border border-border text-muted-foreground hover:text-foreground transition-colors rounded-sm"
            >
              Cancel
            </button>
            <CyberButton variant="primary" className="flex-1 text-xs py-1" onClick={installCustom} disabled={!customName.trim()}>
              Install
            </CyberButton>
          </div>
        </div>
      )}

      {/* Installed bioware */}
      {character.geneMods.map(mod => (
        <div key={mod.id} className="p-3 border border-border bg-background/30 overflow-hidden rounded-sm border-l-2 border-l-primary">
          <div className="flex justify-between items-start gap-2">
            <span className="font-bold text-primary text-sm font-mono leading-tight">{mod.name}</span>
            <div className="flex items-center gap-1 shrink-0">
              <CyberBadge variant={mod.type === 'Cosmetic' ? 'outline' : 'primary'} className="text-xs">{mod.type || 'Bioware'}</CyberBadge>
              <button onClick={() => onUpdate('geneMods', character.geneMods.filter(m => m.id !== mod.id))} className="text-destructive text-xs hover:underline ml-1 font-mono">DEL</button>
            </div>
          </div>
          <div className="text-xs text-foreground/60 mt-1 font-mono leading-relaxed">{mod.description}</div>
        </div>
      ))}

      {character.geneMods.length === 0 && (
        <div className="text-xs text-muted-foreground font-mono text-center py-3">No bioware installed.</div>
      )}
    </div>
  );
}

function CyberneticsPanel({ character, onUpdate }: PanelProps) {
  const [selectedKey, setSelectedKey] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customSlot, setCustomSlot] = useState<'Cybernetic' | 'Daemon'>('Cybernetic');

  const cyberOptions = UPGRADES.filter(u => u.type === 'cybernetic' || u.type === 'daemon');
  const preview: UpgradeData | undefined = cyberOptions.find(u => `${u.name}|||${u.brand}` === selectedKey);

  function installCybernetic() {
    if (!preview) return;
    const entry: CyberneticEntry = {
      id: Math.random().toString(),
      name: `${preview.name} (${preview.brand})`,
      slot: preview.type === 'daemon' ? 'Daemon' : 'Cybernetic',
      description: preview.effectSummary,
      active: true,
    };
    onUpdate('cybernetics', [...character.cybernetics, entry]);
    setSelectedKey('');
  }

  function installCustom() {
    if (!customName.trim()) return;
    const entry: CyberneticEntry = {
      id: Math.random().toString(),
      name: customName.trim(),
      slot: customSlot,
      description: customDescription.trim(),
      active: true,
    };
    onUpdate('cybernetics', [...character.cybernetics, entry]);
    setCustomName('');
    setCustomDescription('');
    setCustomSlot('Cybernetic');
    setCustomMode(false);
  }

  const cyberwareList = cyberOptions.filter(u => u.type === 'cybernetic');
  const daemonList = cyberOptions.filter(u => u.type === 'daemon');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-secondary uppercase tracking-widest font-mono font-bold">Cyberware & Daemon</span>
        <UpgradeSlotCounter character={character} />
      </div>

      {!customMode ? (
        <>
          {/* Catalogue picker */}
          <div className="flex gap-1">
            <select
              value={selectedKey}
              onChange={e => setSelectedKey(e.target.value)}
              className="flex-1 text-xs font-mono bg-background border border-border rounded-sm px-2 py-1.5 text-foreground focus:outline-none focus:border-secondary"
            >
              <option value="">— Browse implant catalogue —</option>
              <optgroup label="── Cybernetic Upgrades ──">
                {cyberwareList.map(u => (
                  <option key={`${u.name}|||${u.brand}`} value={`${u.name}|||${u.brand}`}>
                    {u.name} [{u.brand}] {u.cost}
                  </option>
                ))}
              </optgroup>
              <optgroup label="── Daemon Upgrades ──">
                {daemonList.map(u => (
                  <option key={`${u.name}|||${u.brand}`} value={`${u.name}|||${u.brand}`}>
                    {u.name} [{u.brand}] {u.cost}
                  </option>
                ))}
              </optgroup>
            </select>
            <CyberButton variant="secondary" className="text-xs px-2 py-1" onClick={installCybernetic} disabled={!selectedKey}>
              Graft
            </CyberButton>
          </div>
          <button
            onClick={() => { setCustomMode(true); setSelectedKey(''); }}
            className="w-full text-xs font-mono text-secondary/70 hover:text-secondary border border-dashed border-secondary/30 hover:border-secondary/60 py-1.5 rounded-sm transition-colors"
          >
            + Custom Entry
          </button>

          {/* Preview of selected upgrade */}
          {preview && (
            <div className="p-2 border border-secondary/40 bg-secondary/5 rounded-sm text-xs font-mono text-foreground/80 leading-relaxed">
              <div className="font-bold text-secondary mb-0.5">{preview.name} <span className="text-muted-foreground">[{preview.brand}]</span> · {preview.cost}</div>
              <div className="text-yellow-400/70 text-[10px] uppercase tracking-widest mb-0.5">{preview.type}</div>
              <div>{preview.effectSummary}</div>
            </div>
          )}
        </>
      ) : (
        /* Custom entry form */
        <div className="border border-secondary/40 bg-secondary/5 rounded-sm p-3 space-y-2">
          <div className="text-xs text-secondary font-mono uppercase tracking-widest mb-1">Custom Implant Entry</div>
          <input
            autoFocus
            type="text"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && installCustom()}
            placeholder="Name (e.g. Neural Lattice v2)"
            className="w-full bg-background border border-border px-2 py-1.5 text-xs font-mono text-foreground placeholder-muted-foreground/40 focus:outline-none focus:border-secondary rounded-sm"
          />
          <textarea
            value={customDescription}
            onChange={e => setCustomDescription(e.target.value)}
            placeholder="Effect / description (optional)"
            rows={2}
            className="w-full bg-background border border-border px-2 py-1.5 text-xs font-mono text-foreground placeholder-muted-foreground/40 focus:outline-none focus:border-secondary rounded-sm resize-none"
          />
          <div className="flex items-center gap-2">
            <select
              value={customSlot}
              onChange={e => setCustomSlot(e.target.value as 'Cybernetic' | 'Daemon')}
              className="flex-1 text-xs font-mono bg-background border border-border rounded-sm px-2 py-1.5 text-foreground focus:outline-none focus:border-secondary"
            >
              <option value="Cybernetic">Cybernetic (hardware)</option>
              <option value="Daemon">Daemon (software)</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setCustomMode(false); setCustomName(''); setCustomDescription(''); }}
              className="flex-1 text-xs font-mono py-1.5 border border-border text-muted-foreground hover:text-foreground transition-colors rounded-sm"
            >
              Cancel
            </button>
            <CyberButton variant="secondary" className="flex-1 text-xs py-1" onClick={installCustom} disabled={!customName.trim()}>
              Graft
            </CyberButton>
          </div>
        </div>
      )}

      {/* Installed cybernetics/daemon */}
      {character.cybernetics.map(cyber => (
        <div key={cyber.id} className="p-3 border border-border bg-background/30 overflow-hidden rounded-sm border-l-2 border-l-secondary">
          <div className="flex justify-between items-start gap-2">
            <span className="font-bold text-secondary text-sm font-mono leading-tight">{cyber.name}</span>
            <div className="flex items-center gap-1 shrink-0">
              <CyberBadge variant="secondary" className="text-xs">{cyber.slot || 'Cybernetic'}</CyberBadge>
              <button onClick={() => onUpdate('cybernetics', character.cybernetics.filter(c => c.id !== cyber.id))} className="text-destructive text-xs hover:underline ml-1 font-mono">DEL</button>
            </div>
          </div>
          <div className="text-xs text-foreground/60 mt-1 font-mono leading-relaxed">{cyber.description}</div>
        </div>
      ))}

      {character.cybernetics.length === 0 && (
        <div className="text-xs text-muted-foreground font-mono text-center py-3">No implants installed.</div>
      )}
    </div>
  );
}

const ALL_KNOWN_FEATURES: { name: string; description: string; source: string }[] = (() => {
  const out: { name: string; description: string; source: string }[] = [];
  for (const cls of CLASSES) {
    for (const feats of Object.values(cls.featuresByLevel)) {
      for (const f of feats) {
        out.push({ name: f.name, description: f.description, source: cls.name });
      }
    }
  }
  for (const genome of GENOMES) {
    for (const t of genome.traits) {
      out.push({ name: t.name, description: t.description, source: `${genome.name} Genome` });
    }
  }
  for (const bg of BACKGROUNDS) {
    out.push({ name: bg.featureName, description: bg.featureDescription, source: `${bg.name} Background` });
  }
  const seen = new Set<string>();
  return out.filter(f => { if (seen.has(f.name)) return false; seen.add(f.name); return true; });
})();

function FeaturesPanel({ character, onUpdate }: PanelProps) {
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [addSelected, setAddSelected] = useState('');
  const [addCustomName, setAddCustomName] = useState('');
  const [addCustomSource, setAddCustomSource] = useState('');
  const [addCustomDesc, setAddCustomDesc] = useState('');
  const [featDragIdx, setFeatDragIdx] = useState<number | null>(null);
  const [featDragOver, setFeatDragOver] = useState<number | null>(null);
  const featDragFromHandle = React.useRef(false);

  function toggleExpanded(id: string) {
    setExpandedFeatures(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function handleAddSubmit() {
    if (addSelected) {
      const known = ALL_KNOWN_FEATURES.find(f => f.name === addSelected);
      if (known) {
        const entry: FeatureEntry = { id: Math.random().toString(), name: known.name, source: known.source, description: known.description };
        onUpdate('features', [...character.features, entry]);
      }
    } else if (addCustomName.trim()) {
      const entry: FeatureEntry = { id: Math.random().toString(), name: addCustomName.trim(), source: addCustomSource.trim() || undefined, description: addCustomDesc.trim() };
      onUpdate('features', [...character.features, entry]);
    }
    setAddSelected('');
    setAddCustomName('');
    setAddCustomSource('');
    setAddCustomDesc('');
    setShowAddForm(false);
  }

  const groupedFeatures = ALL_KNOWN_FEATURES.reduce<Record<string, typeof ALL_KNOWN_FEATURES>>((acc, f) => {
    (acc[f.source] ??= []).push(f);
    return acc;
  }, {});

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-primary uppercase tracking-widest font-mono font-bold">Features & Traits</span>
      </div>

      {character.features.map((feat, idx) => {
        const isOpen = expandedFeatures.has(feat.id);
        const isDragOver = featDragOver === idx && featDragIdx !== idx;
        return (
          <div
            key={feat.id}
            draggable
            onDragStart={e => { if (!featDragFromHandle.current) { e.preventDefault(); return; } setFeatDragIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
            onDragOver={e => { e.preventDefault(); setFeatDragOver(idx); }}
            onDrop={e => { e.preventDefault(); if (featDragIdx !== null && featDragIdx !== idx) { const next = [...character.features]; const [m] = next.splice(featDragIdx, 1); next.splice(idx, 0, m); onUpdate('features', next); } setFeatDragIdx(null); setFeatDragOver(null); featDragFromHandle.current = false; }}
            onDragEnd={() => { setFeatDragIdx(null); setFeatDragOver(null); featDragFromHandle.current = false; }}
            className={`border border-border/50 bg-background/30 clip-edges transition-all ${isDragOver ? 'border-t-2 border-t-primary' : ''} ${featDragIdx === idx ? 'opacity-40' : ''}`}
          >
            <div className="flex items-center justify-between px-3 py-2 gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <GripVertical size={12} className="text-muted-foreground/30 hover:text-muted-foreground/70 cursor-grab shrink-0 transition-colors" onMouseDown={() => { featDragFromHandle.current = true; }} onMouseUp={() => { featDragFromHandle.current = false; }} onClick={e => e.stopPropagation()} />
                <button
                  onClick={() => toggleExpanded(feat.id)}
                  className="text-muted-foreground/60 hover:text-primary shrink-0 transition-colors"
                  title="Toggle description"
                >
                  <ChevronRight size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                <div className="flex-1 min-w-0">
                  <EditableField value={feat.name} onSave={v => onUpdate('features', updateArrayEntry(character.features, feat.id, { name: String(v) }))} className="font-bold text-primary text-sm" />
                  {feat.source && <div className="text-[10px] text-muted-foreground font-mono">{feat.source}</div>}
                </div>
              </div>
              <button onClick={() => onUpdate('features', character.features.filter(f => f.id !== feat.id))} className="text-destructive text-xs hover:underline font-mono shrink-0">DEL</button>
            </div>
            {isOpen && (
              <div className="px-3 pb-3">
                <textarea
                  value={feat.description ?? ''}
                  onChange={e => onUpdate('features', updateArrayEntry(character.features, feat.id, { description: e.target.value }))}
                  placeholder="No description. Click to add notes..."
                  rows={4}
                  className="w-full bg-background/40 border border-border/40 text-foreground/80 font-mono text-[11px] px-2 py-1.5 resize-y focus:outline-none focus:border-primary/60 placeholder:text-muted-foreground/40 leading-relaxed"
                />
                {feat.source && (
                  <div className="mt-1">
                    <input
                      type="text"
                      value={feat.source}
                      onChange={e => onUpdate('features', updateArrayEntry(character.features, feat.id, { source: e.target.value }))}
                      placeholder="Source..."
                      className="w-full bg-transparent border-0 border-b border-border/30 text-muted-foreground font-mono text-[10px] px-0 py-0.5 focus:outline-none focus:border-primary/40"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {showAddForm ? (
        <div className="mt-2 border border-border/40 bg-background/30 p-2 space-y-2">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Add Feature / Trait</div>
          <select
            value={addSelected}
            onChange={e => {
              setAddSelected(e.target.value);
              setAddCustomName('');
              const known = ALL_KNOWN_FEATURES.find(f => f.name === e.target.value);
              setAddCustomDesc(known?.description ?? '');
              setAddCustomSource(known?.source ?? '');
            }}
            className="w-full bg-background border border-border text-foreground font-mono text-[11px] px-2 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="">— Custom Feature or Trait —</option>
            {Object.entries(groupedFeatures).map(([source, feats]) => (
              <optgroup key={source} label={`── ${source} ──`}>
                {feats.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
              </optgroup>
            ))}
          </select>
          {!addSelected && (
            <div className="flex gap-2">
              <input
                type="text"
                value={addCustomName}
                onChange={e => setAddCustomName(e.target.value)}
                placeholder="Feature name..."
                className="flex-1 bg-background border border-border text-foreground font-mono text-[11px] px-2 py-1.5 focus:outline-none focus:border-primary placeholder:text-muted-foreground/40"
              />
              <input
                type="text"
                value={addCustomSource}
                onChange={e => setAddCustomSource(e.target.value)}
                placeholder="Source (class, genome...)"
                className="flex-1 bg-background border border-border text-foreground font-mono text-[11px] px-2 py-1.5 focus:outline-none focus:border-primary placeholder:text-muted-foreground/40"
              />
            </div>
          )}
          <textarea
            value={addCustomDesc}
            onChange={e => setAddCustomDesc(e.target.value)}
            placeholder="Description (auto-filled from rulebook if known)..."
            rows={3}
            className="w-full bg-background/40 border border-border/40 text-foreground/80 font-mono text-[11px] px-2 py-1.5 resize-none focus:outline-none focus:border-primary/60 placeholder:text-muted-foreground/40"
          />
          <div className="flex gap-2">
            <CyberButton variant="primary" className="text-xs py-1 flex-1" onClick={handleAddSubmit}>Add Feature</CyberButton>
            <CyberButton variant="ghost" className="text-xs py-1" onClick={() => { setShowAddForm(false); setAddSelected(''); setAddCustomName(''); setAddCustomDesc(''); setAddCustomSource(''); }}>Cancel</CyberButton>
          </div>
        </div>
      ) : (
        <CyberButton variant="ghost" className="w-full text-xs py-1 mt-1" onClick={() => setShowAddForm(true)}>+ Add Feature</CyberButton>
      )}
    </div>
  );
}

function BioPanel({ character, onUpdate, backgroundOptions }: PanelProps & { backgroundOptions: { value: string; label: string }[] }) {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-xs text-primary uppercase tracking-widest font-mono font-bold mb-1">Alignment</div>
        <EditableField
          value={character.alignment || ''}
          onSave={v => onUpdate('alignment', v)}
          className="text-sm font-mono text-foreground/90 border-b border-border/30 w-full block py-1"
        />
      </div>
      <div>
        <div className="text-xs text-primary uppercase tracking-widest font-mono font-bold mb-1">Background</div>
        <EditableSelect
          value={character.background || ''}
          onSave={v => onUpdate('background', v)}
          options={backgroundOptions}
          className="text-sm font-mono text-foreground/90 border-b border-border/30 w-full block py-1"
          placeholder="Background"
        />
      </div>
      {([
        { label: 'Backstory', field: 'backstory' as const },
        { label: 'Contract Notes', field: 'notes' as const },
      ]).map(item => (
        <div key={item.field}>
          <div className="text-xs text-primary uppercase tracking-widest font-mono font-bold mb-1">{item.label}</div>
          <EditableField
            value={character[item.field] || ''}
            onSave={v => onUpdate(item.field, v)}
            className="text-sm font-mono text-foreground/90 border-b border-border/30 w-full block py-1"
          />
        </div>
      ))}
    </div>
  );
}
