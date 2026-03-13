import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { useAppCharacter, useAppUpdateCharacter, useAppDeleteCharacter } from '@/hooks/use-api';
import { useDice } from '@/hooks/use-dice';
import { CyberCard, EditableField, CyberButton, CyberBadge } from '@/components/CyberUI';
import { StatBox } from '@/components/StatBox';
import { SkillList } from '@/components/SkillList';
import { ABILITIES, getModifier, formatModifier, getProficiencyBonus } from '@/lib/rules';
import { Activity, Shield, Heart, Zap, Crosshair, ChevronLeft, Trash2, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import type {
  Character,
  AttackEntry,
  SpellEntry,
  EquipmentEntry,
  FeatureEntry,
  GeneModEntry,
  CyberneticEntry,
  CharacterSpellSlots,
} from '@workspace/api-client-react';

type MiniTab = 'actions' | 'spells' | 'inventory' | 'genemods' | 'cybernetics' | 'features' | 'bio';

type UpdateFn = <K extends keyof Character>(field: K, value: Character[K]) => void;

export default function CharacterSheet() {
  const [, params] = useRoute('/characters/:id');
  const id = parseInt(params?.id || "0");
  const [, setLocation] = useLocation();
  
  const { data: character, isLoading } = useAppCharacter(id);
  const updateMutation = useAppUpdateCharacter();
  const deleteMutation = useAppDeleteCharacter();
  const { rollDice } = useDice();
  
  const [miniTab, setMiniTab] = useState<MiniTab>('actions');

  const handleUpdate = (field: string, value: unknown) => {
    if (!character) return;
    updateMutation.mutate({ id, data: { [field]: value } });
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

  if (!character) {
    return <div className="p-8 text-center text-destructive">Operative not found.</div>;
  }

  const profBonus = getProficiencyBonus(character.level);

  return (
    <div className="min-h-screen bg-background scanlines pb-4">
      {/* Header Bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border px-4 py-2 shadow-lg shadow-black/50">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/characters" className="text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <img src={`${import.meta.env.BASE_URL}images/avatar-placeholder.png`} className="w-10 h-10 rounded-full border border-primary" alt="Avatar" />
            <div className="flex items-center gap-3 flex-wrap">
              <EditableField 
                value={character.name} 
                onSave={(v) => handleUpdate('name', v)} 
                className="text-xl font-bold text-foreground inline-block"
              />
              <div className="flex items-center gap-1.5 text-xs text-primary font-mono">
                Lvl <EditableField value={character.level} type="number" onSave={(v) => handleUpdate('level', v)} className="w-6 inline-block" /> 
                <EditableField value={character.class || ''} onSave={(v) => handleUpdate('class', v)} className="inline-block min-w-[60px]" />
                <span className="text-muted-foreground">|</span>
                <EditableField value={character.race || ''} onSave={(v) => handleUpdate('race', v)} className="inline-block text-muted-foreground min-w-[60px]" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {updateMutation.isPending && <Activity className="w-4 h-4 text-accent animate-spin" />}
            <CyberButton variant="destructive" className="px-2 py-1 text-xs" onClick={handleDelete}><Trash2 className="w-3 h-3"/></CyberButton>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-3 pt-3 relative z-10 space-y-3">
        {/* Ability Scores Row */}
        <div className="flex gap-2 items-stretch flex-wrap">
          {ABILITIES.map(stat => (
            <StatBox 
              key={stat.key} 
              label={stat.label} 
              score={character[stat.key as keyof Character] as number}
              onUpdate={(val) => handleUpdate(stat.key, val)}
            />
          ))}
        </div>

        {/* Stats Strip: Prof | Speed | Inspiration | AC | Init | HP — all in one row */}
        <div className="flex gap-2 items-stretch flex-wrap">
          <div className="bg-card border border-border clip-edges px-3 py-1.5 flex flex-col items-center justify-center min-w-[56px]">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Prof</div>
            <div className="text-lg font-bold text-primary">+{profBonus}</div>
          </div>
          <div className="bg-card border border-border clip-edges px-3 py-1.5 flex flex-col items-center justify-center min-w-[56px]">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Speed</div>
            <EditableField value={character.speed} type="number" onSave={v => handleUpdate('speed', v)} className="text-lg font-bold text-foreground text-center" />
          </div>
          <div className="bg-card border border-border clip-edges px-3 py-1.5 flex flex-col items-center justify-center min-w-[56px]">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Insp</div>
            <div 
              className="text-lg font-bold text-accent cursor-pointer"
              onClick={() => handleUpdate('inspiration', !character.inspiration)}
            >
              {character.inspiration ? '★' : '☆'}
            </div>
          </div>
          <div className="bg-card border border-border clip-edges px-3 py-1.5 flex items-center gap-2">
            <Shield className="text-primary w-4 h-4" />
            <div className="text-center">
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">AC</div>
              <EditableField value={character.armorClass} type="number" onSave={v => handleUpdate('armorClass', v)} className="text-lg font-bold text-primary text-center" />
            </div>
          </div>
          <div className="bg-card border border-border clip-edges px-3 py-1.5 flex items-center gap-2">
            <Zap className="text-accent w-4 h-4" />
            <div className="text-center">
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Init</div>
              <EditableField value={character.initiative} type="number" onSave={v => handleUpdate('initiative', v)} className="text-lg font-bold text-accent text-center" />
            </div>
          </div>
          <div className="bg-card border border-border clip-edges px-3 py-1.5 flex-1 flex items-center gap-3 min-w-[280px]">
            <Heart className="text-destructive w-4 h-4 shrink-0" />
            <div className="flex items-center gap-2">
              <button onClick={() => handleUpdate('currentHitPoints', Math.max(0, character.currentHitPoints - 1))} className="w-6 h-6 bg-destructive/20 text-destructive rounded text-sm hover:bg-destructive hover:text-white transition-colors flex items-center justify-center font-bold">-</button>
              <div className="text-center">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">HP</div>
                <EditableField value={character.currentHitPoints} type="number" onSave={v => handleUpdate('currentHitPoints', v)} className="text-lg font-bold text-foreground text-center" />
              </div>
              <button onClick={() => handleUpdate('currentHitPoints', Math.min(character.maxHitPoints, character.currentHitPoints + 1))} className="w-6 h-6 bg-primary/20 text-primary rounded text-sm hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center font-bold">+</button>
            </div>
            <span className="text-muted-foreground text-lg">/</span>
            <div className="text-center">
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Max</div>
              <EditableField value={character.maxHitPoints} type="number" onSave={v => handleUpdate('maxHitPoints', v)} className="text-lg font-bold text-muted-foreground text-center" />
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="text-center">
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Temp</div>
              <EditableField value={character.temporaryHitPoints} type="number" onSave={v => handleUpdate('temporaryHitPoints', v)} className="text-sm font-bold text-accent text-center w-8" />
            </div>
          </div>
        </div>

        {/* Three-Column Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Left Column: Saves + Passives + Proficiencies */}
          <div className="lg:col-span-3 space-y-3">
            <CyberCard className="p-3">
              <div className="text-xs text-primary uppercase tracking-widest font-mono font-bold mb-2 border-b border-border/50 pb-1">Saving Throws</div>
              <div className="space-y-0.5 font-mono text-xs">
                {ABILITIES.map(stat => {
                  const isProf = character.savingThrowProficiencies.includes(stat.key);
                  const mod = getModifier(character[stat.key as keyof Character] as number);
                  const total = mod + (isProf ? profBonus : 0);
                  return (
                    <div key={stat.key} className="flex items-center gap-2 py-0.5 hover:bg-primary/5 px-1 -mx-1 rounded group">
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
                        onClick={() => rollDice(`${stat.label} Save`, total)}
                      >
                        {formatModifier(total)}
                      </span>
                      <span className="text-muted-foreground uppercase group-hover:text-foreground transition-colors cursor-pointer" onClick={() => rollDice(`${stat.label} Save`, total)}>
                        {stat.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CyberCard>

            <CyberCard className="p-3">
              <div className="text-xs text-primary uppercase tracking-widest font-mono font-bold mb-2 border-b border-border/50 pb-1">Passive Scores</div>
              <div className="space-y-1 font-mono text-xs">
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
                    <div key={p.skill} className="flex items-center justify-between py-0.5">
                      <span className="text-muted-foreground">{p.label}</span>
                      <span className="text-primary font-bold text-sm">{10 + bonus}</span>
                    </div>
                  );
                })}
              </div>
            </CyberCard>

            <CyberCard className="p-3">
              <div className="text-xs text-primary uppercase tracking-widest font-mono font-bold mb-2 border-b border-border/50 pb-1">Proficiencies</div>
              <div className="space-y-2 text-xs font-mono">
                {([
                  { label: 'Armor', field: 'armorProficiencies' as const },
                  { label: 'Weapons', field: 'weaponProficiencies' as const },
                  { label: 'Tools', field: 'toolProficiencies' as const },
                  { label: 'Languages', field: 'languages' as const },
                ] as const).map(p => (
                  <div key={p.field}>
                    <div className="text-muted-foreground/70 uppercase text-[10px] tracking-widest">{p.label}</div>
                    <EditableField 
                      value={character[p.field] || 'None'} 
                      onSave={v => handleUpdate(p.field, v)} 
                      className="text-xs text-foreground/80"
                    />
                  </div>
                ))}
              </div>
            </CyberCard>
          </div>

          {/* Center Column: Skills */}
          <div className="lg:col-span-4">
            <CyberCard className="p-3">
              <div className="text-xs text-primary uppercase tracking-widest font-mono font-bold mb-2 border-b border-border/50 pb-1">Skills</div>
              <SkillList character={character} onUpdate={handleUpdate} />
            </CyberCard>
          </div>

          {/* Right Column: Conditions + Death Saves + Mini Tabs */}
          <div className="lg:col-span-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <CyberCard className="p-3">
                <div className="text-xs text-primary uppercase tracking-widest font-mono font-bold mb-2 border-b border-border/50 pb-1">Death Saves</div>
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-primary w-12">Success</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div
                          key={`s${i}`}
                          className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-colors ${
                            character.deathSaveSuccesses > i
                              ? 'bg-primary border-primary'
                              : 'border-muted-foreground/40 hover:border-primary'
                          }`}
                          onClick={() => handleUpdate('deathSaveSuccesses', character.deathSaveSuccesses > i ? i : i + 1)}
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
                            character.deathSaveFailures > i
                              ? 'bg-destructive border-destructive'
                              : 'border-muted-foreground/40 hover:border-destructive'
                          }`}
                          onClick={() => handleUpdate('deathSaveFailures', character.deathSaveFailures > i ? i : i + 1)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CyberCard>

              <CyberCard className="p-3">
                <div className="text-xs text-primary uppercase tracking-widest font-mono font-bold mb-2 border-b border-border/50 pb-1">Conditions</div>
                <div className="flex flex-wrap gap-1">
                  {character.conditions.map((cond, i) => (
                    <span key={i} className="bg-destructive/20 text-destructive text-[10px] px-1.5 py-0.5 font-mono uppercase flex items-center gap-1 clip-edges">
                      {cond}
                      <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => handleUpdate('conditions', character.conditions.filter((_, j) => j !== i))} />
                    </span>
                  ))}
                  <button
                    className="text-[10px] text-muted-foreground hover:text-primary border border-dashed border-muted-foreground/30 hover:border-primary px-1.5 py-0.5 font-mono uppercase transition-colors"
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
                  { key: 'spells' as MiniTab, label: 'Spells' },
                  { key: 'inventory' as MiniTab, label: 'Inventory' },
                  { key: 'genemods' as MiniTab, label: 'Gene Mods' },
                  { key: 'cybernetics' as MiniTab, label: 'Cybernetics' },
                  { key: 'features' as MiniTab, label: 'Features' },
                  { key: 'bio' as MiniTab, label: 'Bio' },
                ]).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setMiniTab(tab.key)}
                    className={`px-3 py-2 text-[10px] font-mono uppercase tracking-wider font-bold transition-all border-b-2 ${
                      miniTab === tab.key
                        ? 'text-primary border-primary bg-primary/10'
                        : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {miniTab === 'actions' && <ActionsPanel character={character} onUpdate={handleUpdate} />}
                {miniTab === 'spells' && <SpellsPanel character={character} onUpdate={handleUpdate} />}
                {miniTab === 'inventory' && <InventoryPanel character={character} onUpdate={handleUpdate} />}
                {miniTab === 'genemods' && <GeneModsPanel character={character} onUpdate={handleUpdate} />}
                {miniTab === 'cybernetics' && <CyberneticsPanel character={character} onUpdate={handleUpdate} />}
                {miniTab === 'features' && <FeaturesPanel character={character} onUpdate={handleUpdate} />}
                {miniTab === 'bio' && <BioPanel character={character} onUpdate={handleUpdate} />}
              </div>
            </CyberCard>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PanelProps {
  character: Character;
  onUpdate: (field: string, value: unknown) => void;
}

function updateArrayEntry<T extends { id: string }>(arr: T[], id: string, patch: Partial<T>): T[] {
  return arr.map(item => item.id === id ? { ...item, ...patch } : item);
}

function ActionsPanel({ character, onUpdate }: PanelProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-primary uppercase tracking-widest font-mono font-bold">Attacks & Actions</span>
        <CyberButton variant="ghost" className="text-[10px] px-2 py-1" onClick={() => {
          const name = prompt("Weapon Name:");
          if (name) {
            const entry: AttackEntry = { id: Math.random().toString(), name, attackBonus: '+0', damage: '1d6', damageType: 'Piercing', range: '5ft', notes: '' };
            onUpdate('attacks', [...character.attacks, entry]);
          }
        }}><Crosshair className="w-3 h-3 mr-1" /> Add</CyberButton>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
              <th className="p-1.5">Name</th>
              <th className="p-1.5">Hit</th>
              <th className="p-1.5">Damage</th>
              <th className="p-1.5">Type</th>
              <th className="p-1.5">Range</th>
              <th className="p-1.5"></th>
            </tr>
          </thead>
          <tbody className="text-xs font-mono">
            {character.attacks.length === 0 ? (
              <tr><td colSpan={6} className="p-3 text-center text-muted-foreground italic">No weapons equipped</td></tr>
            ) : character.attacks.map((atk) => (
              <tr key={atk.id} className="border-b border-border/30 hover:bg-white/5 transition-colors">
                <td className="p-1.5">
                  <EditableField value={atk.name} onSave={v => onUpdate('attacks', updateArrayEntry(character.attacks, atk.id, { name: String(v) }))} className="text-foreground font-bold text-xs" />
                </td>
                <td className="p-1.5">
                  <EditableField value={atk.attackBonus || ''} onSave={v => onUpdate('attacks', updateArrayEntry(character.attacks, atk.id, { attackBonus: String(v) }))} className="text-primary text-xs" />
                </td>
                <td className="p-1.5">
                  <EditableField value={atk.damage || ''} onSave={v => onUpdate('attacks', updateArrayEntry(character.attacks, atk.id, { damage: String(v) }))} className="text-secondary text-xs" />
                </td>
                <td className="p-1.5">
                  <EditableField value={atk.damageType || ''} onSave={v => onUpdate('attacks', updateArrayEntry(character.attacks, atk.id, { damageType: String(v) }))} className="text-muted-foreground text-xs" />
                </td>
                <td className="p-1.5">
                  <EditableField value={atk.range || ''} onSave={v => onUpdate('attacks', updateArrayEntry(character.attacks, atk.id, { range: String(v) }))} className="text-muted-foreground text-xs" />
                </td>
                <td className="p-1.5 text-right">
                  <button onClick={() => onUpdate('attacks', character.attacks.filter(a => a.id !== atk.id))} className="text-destructive hover:underline text-[10px]">DEL</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SpellsPanel({ character, onUpdate }: PanelProps) {
  const slots = character.spellSlots;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-primary uppercase tracking-widest font-mono font-bold">Spellcasting</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1 text-center font-mono text-xs">
        {[1,2,3,4,5,6,7,8,9].map(lvl => {
          const key = `level${lvl}`;
          const slot = slots[key] || { total: 0, used: 0 };
          return (
            <div key={lvl} className="border border-border/50 p-1 clip-edges bg-background/30">
              <div className="text-[10px] text-muted-foreground">Lvl {lvl}</div>
              <div className="text-sm font-bold text-primary">{slot.used}/{slot.total}</div>
              <div className="flex gap-0.5 justify-center mt-0.5">
                <button
                  className="text-[9px] text-muted-foreground hover:text-primary px-0.5"
                  onClick={() => {
                    const newSlots: CharacterSpellSlots = { ...slots, [key]: { ...slot, total: Math.max(0, slot.total + 1) } };
                    onUpdate('spellSlots', newSlots);
                  }}
                  title="Increase total slots"
                >T+</button>
                <button
                  className="text-[9px] text-muted-foreground hover:text-accent px-0.5"
                  onClick={() => {
                    const newSlots: CharacterSpellSlots = { ...slots, [key]: { ...slot, used: Math.min(slot.total, slot.used + 1) } };
                    onUpdate('spellSlots', newSlots);
                  }}
                  title="Use a slot"
                >U+</button>
                <button
                  className="text-[9px] text-muted-foreground hover:text-secondary px-0.5"
                  onClick={() => {
                    const newSlots: CharacterSpellSlots = { ...slots, [key]: { ...slot, used: 0 } };
                    onUpdate('spellSlots', newSlots);
                  }}
                  title="Reset used slots"
                >R</button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="space-y-1">
        {character.spells.map((spell) => (
          <div key={spell.id} className="flex items-center justify-between py-1 px-1 hover:bg-white/5 text-xs font-mono border-b border-border/20">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-muted-foreground text-[10px] w-4 shrink-0">L{spell.level}</span>
              <EditableField value={spell.name} onSave={v => onUpdate('spells', updateArrayEntry(character.spells, spell.id, { name: String(v) }))} className="text-foreground text-xs" />
            </div>
            <button onClick={() => onUpdate('spells', character.spells.filter(s => s.id !== spell.id))} className="text-destructive text-[10px] hover:underline ml-1 shrink-0">DEL</button>
          </div>
        ))}
        <CyberButton variant="ghost" className="w-full text-[10px] mt-2 py-1" onClick={() => {
          const name = prompt("Spell Name:");
          if (name) {
            const entry: SpellEntry = { id: Math.random().toString(), name, level: 0 };
            onUpdate('spells', [...character.spells, entry]);
          }
        }}>+ Add Spell</CyberButton>
      </div>
    </div>
  );
}

function InventoryPanel({ character, onUpdate }: PanelProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-1 text-center font-mono text-xs">
        {(['cp', 'sp', 'ep', 'gp', 'pp'] as const).map((curr) => (
          <div key={curr} className="border border-border/50 p-1.5 bg-background/30 clip-edges">
            <div className="text-[10px] text-muted-foreground uppercase">{curr}</div>
            <EditableField 
              value={character.currency[curr]} 
              type="number"
              onSave={(v) => onUpdate('currency', { ...character.currency, [curr]: v })}
              className="text-sm font-bold text-accent text-center" 
            />
          </div>
        ))}
      </div>
      <div className="space-y-0.5 font-mono text-xs">
        {character.equipment.map(eq => (
          <div key={eq.id} className="flex items-center justify-between py-1 px-1 border-b border-border/20 hover:bg-white/5 gap-1">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <EditableField value={eq.quantity} type="number" onSave={v => onUpdate('equipment', updateArrayEntry(character.equipment, eq.id, { quantity: Number(v) }))} className="text-muted-foreground w-6 text-right text-xs" />
              <span className="text-muted-foreground">x</span>
              <EditableField value={eq.name} onSave={v => onUpdate('equipment', updateArrayEntry(character.equipment, eq.id, { name: String(v) }))} className="text-foreground text-xs" />
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <EditableField value={eq.weight || 0} type="number" onSave={v => onUpdate('equipment', updateArrayEntry(character.equipment, eq.id, { weight: Number(v) }))} className="text-muted-foreground text-xs w-6" />
              <span className="text-muted-foreground text-[10px]">lb</span>
              <button onClick={() => onUpdate('equipment', character.equipment.filter(e => e.id !== eq.id))} className="text-destructive text-[10px] hover:underline ml-1">DEL</button>
            </div>
          </div>
        ))}
        <CyberButton variant="ghost" className="w-full text-[10px] mt-2 py-1" onClick={() => {
          const name = prompt("Item name:");
          if (name) {
            const entry: EquipmentEntry = { id: Math.random().toString(), name, quantity: 1, weight: 0, equipped: false };
            onUpdate('equipment', [...character.equipment, entry]);
          }
        }}>+ Add Item</CyberButton>
      </div>
    </div>
  );
}

function GeneModsPanel({ character, onUpdate }: PanelProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-primary uppercase tracking-widest font-mono font-bold">Genetic Enhancements</span>
      </div>
      {character.geneMods.map(mod => (
        <div key={mod.id} className="p-2 border border-border bg-background/30 clip-edges">
          <div className="flex justify-between items-start">
            <EditableField value={mod.name} onSave={v => onUpdate('geneMods', updateArrayEntry(character.geneMods, mod.id, { name: String(v) }))} className="font-bold text-primary text-xs" />
            <div className="flex items-center gap-1">
              <CyberBadge variant={mod.active ? 'primary' : 'outline'} className="text-[9px]">{mod.type || 'Passive'}</CyberBadge>
              <button onClick={() => onUpdate('geneMods', character.geneMods.filter(m => m.id !== mod.id))} className="text-destructive text-[10px] hover:underline ml-1">DEL</button>
            </div>
          </div>
          <EditableField value={mod.description || ''} onSave={v => onUpdate('geneMods', updateArrayEntry(character.geneMods, mod.id, { description: String(v) }))} className="text-[11px] text-muted-foreground mt-1 font-mono" />
        </div>
      ))}
      <CyberButton variant="ghost" className="w-full text-[10px] py-1" onClick={() => {
        const name = prompt("Gene Mod Name:");
        if (name) {
          const entry: GeneModEntry = { id: Math.random().toString(), name, type: 'Passive', description: 'Describe the effect...', active: true };
          onUpdate('geneMods', [...character.geneMods, entry]);
        }
      }}>+ Install Splicing</CyberButton>
    </div>
  );
}

function CyberneticsPanel({ character, onUpdate }: PanelProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-secondary uppercase tracking-widest font-mono font-bold">Hardware Implants</span>
      </div>
      {character.cybernetics.map(cyber => (
        <div key={cyber.id} className="p-2 border border-border bg-background/30 clip-edges border-l-2 border-l-secondary">
          <div className="flex justify-between items-start">
            <EditableField value={cyber.name} onSave={v => onUpdate('cybernetics', updateArrayEntry(character.cybernetics, cyber.id, { name: String(v) }))} className="font-bold text-secondary text-xs" />
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-muted-foreground uppercase font-mono">{cyber.slot}</span>
              <button onClick={() => onUpdate('cybernetics', character.cybernetics.filter(c => c.id !== cyber.id))} className="text-destructive text-[10px] hover:underline ml-1">DEL</button>
            </div>
          </div>
          <EditableField value={cyber.description || ''} onSave={v => onUpdate('cybernetics', updateArrayEntry(character.cybernetics, cyber.id, { description: String(v) }))} className="text-[11px] text-muted-foreground mt-1 font-mono" />
        </div>
      ))}
      <CyberButton variant="ghost" className="w-full text-[10px] py-1" onClick={() => {
        const name = prompt("Cybernetic Implant Name:");
        if (name) {
          const entry: CyberneticEntry = { id: Math.random().toString(), name, slot: 'Neural', description: 'Describe the hardware...', active: true };
          onUpdate('cybernetics', [...character.cybernetics, entry]);
        }
      }}>+ Graft Hardware</CyberButton>
    </div>
  );
}

function FeaturesPanel({ character, onUpdate }: PanelProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-primary uppercase tracking-widest font-mono font-bold">Features & Traits</span>
      </div>
      {character.features.map((feat) => (
        <div key={feat.id} className="p-2 border border-border bg-background/30 clip-edges">
          <div className="flex justify-between items-start">
            <EditableField value={feat.name} onSave={v => onUpdate('features', updateArrayEntry(character.features, feat.id, { name: String(v) }))} className="font-bold text-primary text-xs" />
            <button onClick={() => onUpdate('features', character.features.filter(f => f.id !== feat.id))} className="text-destructive text-[10px] hover:underline">DEL</button>
          </div>
          <EditableField value={feat.description || ''} onSave={v => onUpdate('features', updateArrayEntry(character.features, feat.id, { description: String(v) }))} className="text-[11px] text-muted-foreground mt-1 font-mono" />
        </div>
      ))}
      <CyberButton variant="ghost" className="w-full text-[10px] py-1" onClick={() => {
        const name = prompt("Feature Name:");
        if (name) {
          const entry: FeatureEntry = { id: Math.random().toString(), name, description: '' };
          onUpdate('features', [...character.features, entry]);
        }
      }}>+ Add Feature</CyberButton>
    </div>
  );
}

function BioPanel({ character, onUpdate }: PanelProps) {
  return (
    <div className="space-y-3">
      {([
        { label: 'Alignment', field: 'alignment' as const },
        { label: 'Background', field: 'background' as const },
        { label: 'Backstory', field: 'backstory' as const },
        { label: 'Notes', field: 'notes' as const },
      ]).map(item => (
        <div key={item.field}>
          <div className="text-[10px] text-primary uppercase tracking-widest font-mono font-bold mb-0.5">{item.label}</div>
          <EditableField
            value={character[item.field] || ''}
            onSave={v => onUpdate(item.field, v)}
            className="text-xs font-mono text-foreground/80 border-b border-border/30 w-full block py-0.5"
          />
        </div>
      ))}
    </div>
  );
}
