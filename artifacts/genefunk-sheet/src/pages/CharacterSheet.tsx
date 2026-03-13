import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { useAppCharacter, useAppUpdateCharacter, useAppDeleteCharacter } from '@/hooks/use-api';
import { useDice } from '@/hooks/use-dice';
import { CyberCard, CyberInput, EditableField, SectionHeader, CyberBadge, CyberButton } from '@/components/CyberUI';
import { StatBox } from '@/components/StatBox';
import { SkillList } from '@/components/SkillList';
import { ABILITIES, getModifier } from '@/lib/rules';
import { Activity, Shield, Heart, Zap, Crosshair, ChevronLeft, Trash2 } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function CharacterSheet() {
  const [, params] = useRoute('/characters/:id');
  const id = parseInt(params?.id || "0");
  const [, setLocation] = useLocation();
  
  const { data: character, isLoading } = useAppCharacter(id);
  const updateMutation = useAppUpdateCharacter();
  const deleteMutation = useAppDeleteCharacter();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'combat' | 'abilities' | 'inventory'>('overview');

  const handleUpdate = (field: string, value: any) => {
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

  return (
    <div className="min-h-screen bg-background scanlines pb-20">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border p-4 shadow-lg shadow-black/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/characters" className="text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <img src={`${import.meta.env.BASE_URL}images/avatar-placeholder.png`} className="w-12 h-12 rounded-full border border-primary" alt="Avatar" />
            <div>
              <EditableField 
                value={character.name} 
                onSave={(v) => handleUpdate('name', v)} 
                className="text-2xl font-bold text-foreground inline-block"
              />
              <div className="flex items-center gap-2 text-sm text-primary font-mono mt-1">
                Lvl <EditableField value={character.level} type="number" onSave={(v) => handleUpdate('level', v)} className="w-8 inline-block" /> 
                <EditableField value={character.class || ''} onSave={(v) => handleUpdate('class', v)} className="inline-block min-w-[80px]" />
                <span className="text-muted-foreground">|</span>
                <EditableField value={character.race || ''} onSave={(v) => handleUpdate('race', v)} className="inline-block text-muted-foreground min-w-[80px]" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {updateMutation.isPending && <Activity className="w-5 h-5 text-accent animate-spin" />}
            <CyberButton variant="destructive" className="px-3" onClick={handleDelete}><Trash2 className="w-4 h-4"/></CyberButton>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Sidebar - Core Stats */}
        <div className="lg:col-span-3 space-y-6">
          <CyberCard className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-2 border border-border bg-background/50 clip-edges">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Prof Bonus</div>
                <div className="text-xl text-primary font-bold">+{Math.ceil(character.level / 4) + 1}</div>
              </div>
              <div className="text-center p-2 border border-border bg-background/50 clip-edges">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Speed</div>
                <EditableField value={character.speed} type="number" onSave={v => handleUpdate('speed', v)} className="text-xl text-foreground font-bold mx-auto" />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {ABILITIES.map(stat => (
                <StatBox 
                  key={stat.key} 
                  label={stat.label} 
                  score={character[stat.key as keyof typeof character] as number}
                  onUpdate={(val) => handleUpdate(stat.key, val)}
                />
              ))}
            </div>
            
            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center text-sm font-mono mb-2">
                <span className="text-muted-foreground">Passive Perception</span>
                <span className="text-primary font-bold text-lg">
                  {character.passivePerception || 10 + getModifier(character.wisdom)}
                </span>
              </div>
            </div>
          </CyberCard>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Custom Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-border/50 pb-2">
            {(['overview', 'combat', 'abilities', 'inventory'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 font-mono uppercase tracking-widest text-sm font-bold transition-all clip-edges ${
                  activeTab === tab 
                    ? 'bg-primary/20 text-primary border border-primary shadow-[0_0_15px_rgba(0,255,255,0.2)]' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="min-h-[500px]">
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-6">
                <CyberCard>
                  <SectionHeader title="Skills" />
                  <SkillList character={character} onUpdate={handleUpdate} />
                </CyberCard>
                
                <div className="space-y-6">
                  <CyberCard>
                    <SectionHeader title="Saving Throws" />
                    <div className="space-y-2 font-mono text-sm">
                      {ABILITIES.map(stat => {
                        const isProf = character.savingThrowProficiencies.includes(stat.key);
                        const mod = getModifier(character[stat.key as keyof typeof character] as number);
                        const total = mod + (isProf ? Math.ceil(character.level / 4) + 1 : 0);
                        
                        return (
                          <div key={stat.key} className="flex items-center justify-between p-2 hover:bg-primary/5 rounded">
                            <div className="flex items-center gap-3">
                              <input 
                                type="checkbox" 
                                checked={isProf}
                                onChange={(e) => {
                                  const newProfs = e.target.checked 
                                    ? [...character.savingThrowProficiencies, stat.key]
                                    : character.savingThrowProficiencies.filter(k => k !== stat.key);
                                  handleUpdate('savingThrowProficiencies', newProfs);
                                }}
                                className="accent-primary w-4 h-4"
                              />
                              <span className="text-muted-foreground uppercase">{stat.label}</span>
                            </div>
                            <span className="text-primary font-bold">{total >= 0 ? `+${total}` : total}</span>
                          </div>
                        )
                      })}
                    </div>
                  </CyberCard>
                  
                  <CyberCard>
                    <SectionHeader title="Bio & Notes" />
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-primary uppercase tracking-widest">Alignment</label>
                        <EditableField value={character.alignment || ''} onSave={v => handleUpdate('alignment', v)} className="text-sm border-b border-border/50 block w-full py-1" />
                      </div>
                      <div>
                        <label className="text-xs text-primary uppercase tracking-widest">Background</label>
                        <EditableField value={character.background || ''} onSave={v => handleUpdate('background', v)} className="text-sm border-b border-border/50 block w-full py-1" />
                      </div>
                    </div>
                  </CyberCard>
                </div>
              </div>
            )}

            {activeTab === 'combat' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* HP Box */}
                  <CyberCard className="md:col-span-2 relative overflow-hidden">
                    <Heart className="absolute -right-4 -bottom-4 w-32 h-32 text-primary/5 rotate-12" />
                    <SectionHeader title="Hit Points" />
                    <div className="flex items-center justify-between gap-8 mt-6">
                      <div className="text-center flex-1">
                        <div className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Current</div>
                        <div className="flex items-center justify-center gap-4">
                          <button onClick={() => handleUpdate('currentHitPoints', Math.max(0, character.currentHitPoints - 1))} className="w-10 h-10 bg-destructive/20 text-destructive rounded clip-edges hover:bg-destructive hover:text-white transition-colors">-</button>
                          <EditableField value={character.currentHitPoints} type="number" onSave={v => handleUpdate('currentHitPoints', v)} className="text-5xl font-bold text-foreground" />
                          <button onClick={() => handleUpdate('currentHitPoints', Math.min(character.maxHitPoints, character.currentHitPoints + 1))} className="w-10 h-10 bg-primary/20 text-primary rounded clip-edges hover:bg-primary hover:text-primary-foreground transition-colors">+</button>
                        </div>
                      </div>
                      <div className="w-px h-16 bg-border" />
                      <div className="text-center flex-1">
                        <div className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Maximum</div>
                        <EditableField value={character.maxHitPoints} type="number" onSave={v => handleUpdate('maxHitPoints', v)} className="text-3xl font-bold text-muted-foreground" />
                      </div>
                    </div>
                  </CyberCard>

                  {/* Armor & Init */}
                  <CyberCard className="flex flex-col justify-center gap-6">
                    <div className="flex items-center justify-between bg-background/50 p-4 border border-border clip-edges">
                      <div className="flex items-center gap-3">
                        <Shield className="text-primary w-6 h-6" />
                        <span className="text-sm text-muted-foreground uppercase tracking-widest">Armor Class</span>
                      </div>
                      <EditableField value={character.armorClass} type="number" onSave={v => handleUpdate('armorClass', v)} className="text-2xl font-bold text-primary" />
                    </div>
                    <div className="flex items-center justify-between bg-background/50 p-4 border border-border clip-edges">
                      <div className="flex items-center gap-3">
                        <Zap className="text-accent w-6 h-6" />
                        <span className="text-sm text-muted-foreground uppercase tracking-widest">Initiative</span>
                      </div>
                      <EditableField value={character.initiative} type="number" onSave={v => handleUpdate('initiative', v)} className="text-2xl font-bold text-accent" />
                    </div>
                  </CyberCard>
                </div>

                {/* Weapons / Attacks */}
                <CyberCard>
                  <SectionHeader title="Weapons & Attacks">
                    <CyberButton variant="ghost" onClick={() => {
                      const name = prompt("Weapon Name:");
                      if(name) {
                        handleUpdate('attacks', [...character.attacks, { id: Math.random().toString(), name, attackBonus: '+0', damage: '1d6', damageType: 'Piercing', range: '5ft', notes: '' }]);
                      }
                    }}><Crosshair className="w-4 h-4 mr-2" /> Add Attack</CyberButton>
                  </SectionHeader>
                  
                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground font-mono">
                          <th className="p-2">Name</th>
                          <th className="p-2">Bonus</th>
                          <th className="p-2">Damage</th>
                          <th className="p-2">Type</th>
                          <th className="p-2">Range</th>
                          <th className="p-2"></th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-mono">
                        {character.attacks.length === 0 ? (
                          <tr><td colSpan={6} className="p-4 text-center text-muted-foreground italic">No weapons equipped</td></tr>
                        ) : character.attacks.map((atk, idx) => (
                          <tr key={atk.id} className="border-b border-border/30 hover:bg-white/5 transition-colors">
                            <td className="p-2 text-foreground font-bold">{atk.name}</td>
                            <td className="p-2 text-primary">{atk.attackBonus}</td>
                            <td className="p-2 text-secondary">{atk.damage}</td>
                            <td className="p-2">{atk.damageType}</td>
                            <td className="p-2 text-muted-foreground">{atk.range}</td>
                            <td className="p-2 text-right">
                              <button onClick={() => {
                                handleUpdate('attacks', character.attacks.filter(a => a.id !== atk.id));
                              }} className="text-destructive hover:underline text-xs">DEL</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CyberCard>
              </div>
            )}

            {activeTab === 'abilities' && (
              <div className="grid md:grid-cols-2 gap-6">
                <CyberCard>
                  <SectionHeader title="Gene Mods" />
                  <p className="text-xs text-muted-foreground font-mono mb-4">Genetic enhancements spliced into your DNA.</p>
                  <div className="space-y-4">
                    {character.geneMods.map(mod => (
                      <div key={mod.id} className="p-3 border border-border bg-background/30 clip-edges">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-primary">{mod.name}</h4>
                          <CyberBadge variant={mod.active ? 'primary' : 'outline'}>{mod.type || 'Passive'}</CyberBadge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 font-mono leading-relaxed">{mod.description}</p>
                      </div>
                    ))}
                    <CyberButton variant="ghost" className="w-full text-xs" onClick={() => {
                      const name = prompt("Gene Mod Name:");
                      if(name) {
                        handleUpdate('geneMods', [...character.geneMods, { id: Math.random().toString(), name, type: 'Passive', description: 'Describe the effect...', active: true }]);
                      }
                    }}>+ Install Splicing</CyberButton>
                  </div>
                </CyberCard>

                <CyberCard>
                  <SectionHeader title="Cybernetics" />
                  <p className="text-xs text-muted-foreground font-mono mb-4">Hardware grafted to your physiology.</p>
                  <div className="space-y-4">
                    {character.cybernetics.map(cyber => (
                      <div key={cyber.id} className="p-3 border border-border bg-background/30 clip-edges border-l-secondary">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-secondary">{cyber.name}</h4>
                          <span className="text-xs text-muted-foreground uppercase">{cyber.slot}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 font-mono leading-relaxed">{cyber.description}</p>
                      </div>
                    ))}
                    <CyberButton variant="ghost" className="w-full text-xs" onClick={() => {
                      const name = prompt("Cybernetic Implant Name:");
                      if(name) {
                        handleUpdate('cybernetics', [...character.cybernetics, { id: Math.random().toString(), name, slot: 'Neural', description: 'Describe the hardware...', active: true }]);
                      }
                    }}>+ Graft Hardware</CyberButton>
                  </div>
                </CyberCard>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <CyberCard>
                  <SectionHeader title="Credits" />
                  <div className="grid grid-cols-5 gap-4">
                    {['cp', 'sp', 'ep', 'gp', 'pp'].map((curr) => (
                      <div key={curr} className="text-center p-2 border border-border/50 rounded bg-background/50">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest">{curr}</div>
                        <EditableField 
                          value={character.currency[curr as keyof typeof character.currency]} 
                          type="number"
                          onSave={(v) => handleUpdate('currency', { ...character.currency, [curr]: v })}
                          className="text-xl font-bold font-mono text-accent" 
                        />
                      </div>
                    ))}
                  </div>
                </CyberCard>
                
                <CyberCard>
                  <SectionHeader title="Equipment" />
                  <div className="space-y-2 font-mono text-sm">
                    {character.equipment.map(eq => (
                      <div key={eq.id} className="flex items-center justify-between p-2 border-b border-border/30 hover:bg-white/5">
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground w-8 text-right">{eq.quantity}x</span>
                          <span className="text-foreground">{eq.name}</span>
                        </div>
                        <div className="text-muted-foreground">
                          {eq.weight ? `${eq.weight} lb` : '--'}
                        </div>
                      </div>
                    ))}
                    <CyberButton variant="ghost" className="w-full mt-4" onClick={() => {
                      const name = prompt("Item name:");
                      if(name) handleUpdate('equipment', [...character.equipment, { id: Math.random().toString(), name, quantity: 1, weight: 0, equipped: false, description: '' }]);
                    }}>+ Add Item</CyberButton>
                  </div>
                </CyberCard>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
