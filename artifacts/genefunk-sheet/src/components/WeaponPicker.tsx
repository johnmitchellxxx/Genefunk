import React, { useState, useMemo, useRef, useEffect } from 'react';
import { GENEFUNK_WEAPONS, WEAPON_CATEGORIES, type WeaponRef } from '@/lib/weaponData';
import { X, Search, Crosshair, Swords, Flame, Zap, ChevronDown, ChevronRight } from 'lucide-react';

interface WeaponPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (weapon: WeaponRef | null) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Simple Melee': <Swords className="w-3 h-3" />,
  'Martial Melee': <Swords className="w-3 h-3" />,
  'Premium Simple Melee': <Swords className="w-3 h-3 text-accent" />,
  'Premium Martial Melee': <Swords className="w-3 h-3 text-accent" />,
  'Simple Ranged': <Crosshair className="w-3 h-3" />,
  'Martial Ranged': <Crosshair className="w-3 h-3" />,
  'Premium Simple Ranged': <Crosshair className="w-3 h-3 text-accent" />,
  'Premium Martial Ranged': <Crosshair className="w-3 h-3 text-accent" />,
  'Explosives': <Flame className="w-3 h-3 text-destructive" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  'Simple Melee': 'text-primary',
  'Martial Melee': 'text-primary',
  'Premium Simple Melee': 'text-accent',
  'Premium Martial Melee': 'text-accent',
  'Simple Ranged': 'text-secondary',
  'Martial Ranged': 'text-secondary',
  'Premium Simple Ranged': 'text-accent',
  'Premium Martial Ranged': 'text-accent',
  'Explosives': 'text-destructive',
};

export function WeaponPicker({ open, onClose, onSelect }: WeaponPickerProps) {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const searchRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSearch('');
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return GENEFUNK_WEAPONS;
    return GENEFUNK_WEAPONS.filter(w =>
      w.name.toLowerCase().includes(q) ||
      w.category.toLowerCase().includes(q) ||
      w.properties.toLowerCase().includes(q) ||
      w.damageType.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const map = new Map<string, WeaponRef[]>();
    for (const cat of WEAPON_CATEGORIES) {
      const items = filtered.filter(w => w.category === cat);
      if (items.length > 0) map.set(cat, items);
    }
    return map;
  }, [filtered]);

  const toggleCat = (cat: string) => {
    setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={modalRef}
        className="relative w-[95vw] max-w-[700px] max-h-[80vh] bg-card border border-primary/60 clip-edges-lg flex flex-col"
        style={{ boxShadow: '0 0 40px hsl(190 100% 50% / 0.15), 0 0 80px hsl(190 100% 50% / 0.05)' }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/80">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono font-bold text-primary uppercase tracking-widest">Weapon Database</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-2 border-b border-border/50 bg-background/40">
          <div className="flex items-center gap-2 bg-background/80 border border-border/60 px-3 py-1.5 clip-edges">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search weapons... (name, type, properties)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-foreground font-mono text-sm outline-none placeholder:text-muted-foreground/50"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-primary">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs text-muted-foreground font-mono">{filtered.length} weapons</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {grouped.size === 0 ? (
            <div className="p-8 text-center text-muted-foreground font-mono text-sm">
              No weapons match your search.
            </div>
          ) : (
            Array.from(grouped.entries()).map(([cat, weapons]) => (
              <div key={cat}>
                <button
                  onClick={() => toggleCat(cat)}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-left border-b border-border/30 hover:bg-white/5 transition-colors ${CATEGORY_COLORS[cat] || 'text-primary'}`}
                >
                  {collapsed[cat] ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {CATEGORY_ICONS[cat]}
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">{cat}</span>
                  <span className="text-xs text-muted-foreground ml-auto font-mono">{weapons.length}</span>
                </button>
                {!collapsed[cat] && (
                  <div>
                    {weapons.map(w => (
                      <button
                        key={w.name}
                        onClick={() => onSelect(w)}
                        className="w-full text-left px-4 py-1.5 border-b border-border/10 hover:bg-primary/10 transition-colors group flex items-start gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-foreground group-hover:text-primary transition-colors truncate">
                              {w.name}
                            </span>
                            {w.tier === 'premium' && (
                              <span className="text-xs px-1 py-0 bg-accent/20 text-accent font-mono uppercase shrink-0">★</span>
                            )}
                          </div>
                          {w.properties && (
                            <div className="text-xs text-muted-foreground/70 font-mono mt-0.5 leading-tight truncate">
                              {w.properties}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                          <span className="text-secondary font-bold w-[70px] text-right">{w.damage}</span>
                          <span className="text-muted-foreground w-[55px] text-right truncate" title={w.damageType}>
                            {w.damageType.length > 8 ? w.damageType.split('/')[0].slice(0, 5) + '…' : w.damageType}
                          </span>
                          <span className="text-primary/70 w-[65px] text-right">{w.range}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}

          <button
            onClick={() => onSelect(null)}
            className="w-full text-left px-4 py-3 border-t border-border/50 hover:bg-primary/10 transition-colors flex items-center gap-2"
          >
            <Zap className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground hover:text-primary">Custom Weapon (blank)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
