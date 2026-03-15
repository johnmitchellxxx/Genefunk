import { useState } from 'react';
import type { DieConfig, InteriorObject, Preset } from '../types';
import { INTERIOR_OBJECT_EMOJI } from '../utils/diceGeometry';

interface CustomizePanelProps {
  config: DieConfig;
  onChange: (config: DieConfig) => void;
  presets: Preset[];
  onSavePreset: (slot: number, name: string) => void;
  onLoadPreset: (slot: number) => void;
  isSaving: boolean;
  onClose: () => void;
}

const FONT_OPTIONS = [
  { value: 'serif', label: 'Serif' },
  { value: 'sans-serif', label: 'Sans-serif' },
  { value: 'monospace', label: 'Mono' },
  { value: 'cursive', label: 'Cursive' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: "'Cinzel', serif", label: 'Cinzel' },
];

const INTERIOR_OBJECTS: InteriorObject[] = [
  'skull', 'unicorn', 'star', 'gem', 'flame', 'dragon', 'moon', 'lightning', 'rose', 'eye',
];

function Slider({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="text-foreground/70 tabular-nums font-mono">{value.toFixed(2)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-primary h-1.5 rounded cursor-pointer"
      />
    </label>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-20 shrink-0 font-mono">{label}</span>
      <div className="flex items-center gap-2 flex-1">
        <input
          type="color" value={value}
          onChange={e => onChange(e.target.value)}
          className="w-8 h-7 cursor-pointer border-0 bg-transparent"
        />
        <input
          type="text" value={value}
          onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) onChange(e.target.value); }}
          className="flex-1 bg-background text-foreground text-xs font-mono px-2 py-1 border border-border focus:border-primary outline-none"
          maxLength={7}
        />
      </div>
    </label>
  );
}

export function CustomizePanel({
  config, onChange, presets, onSavePreset, onLoadPreset, isSaving, onClose,
}: CustomizePanelProps) {
  const [editingPresetSlot, setEditingPresetSlot] = useState<number | null>(null);
  const [presetNameInput, setPresetNameInput] = useState('');

  function update<K extends keyof DieConfig>(key: K, value: DieConfig[K]) {
    onChange({ ...config, [key]: value });
  }

  function handleSavePreset(slot: number) {
    setEditingPresetSlot(slot);
    setPresetNameInput(presets[slot]?.name ?? `Preset ${slot + 1}`);
  }

  function confirmSavePreset() {
    if (editingPresetSlot !== null) {
      onSavePreset(editingPresetSlot, presetNameInput || `Preset ${editingPresetSlot + 1}`);
      setEditingPresetSlot(null);
    }
  }

  return (
    <div
      className="absolute right-3 top-3 bottom-3 z-20 w-72 flex flex-col"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="bg-card/95 backdrop-blur-md border border-primary/30 flex flex-col h-full overflow-hidden shadow-2xl shadow-primary/10"
        style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-sm font-bold text-primary font-mono tracking-widest uppercase">Customize</h2>
          <div className="flex items-center gap-2">
            {isSaving && <span className="text-xs text-muted-foreground animate-pulse font-mono">Saving…</span>}
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-5">
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 font-mono">Die Appearance</h3>
            <div className="flex flex-col gap-3">
              <ColorInput label="Color" value={config.color} onChange={v => update('color', v)} />
              <Slider label="Die Size" value={config.scale ?? 1} min={0.5} max={2} step={0.05} onChange={v => update('scale', v)} />
              <Slider label="Transparency" value={config.opacity} min={0.2} max={1} step={0.01} onChange={v => update('opacity', v)} />
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 font-mono">Face Text</h3>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground font-mono">Font Family</span>
                <select
                  value={config.fontFamily}
                  onChange={e => update('fontFamily', e.target.value)}
                  className="bg-background text-foreground text-xs font-mono px-2 py-1.5 border border-border focus:border-primary outline-none"
                >
                  {FONT_OPTIONS.map(f => (
                    <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
                  ))}
                </select>
              </label>
              <Slider label="Font Size" value={config.fontSize} min={0.5} max={2} step={0.05} onChange={v => update('fontSize', v)} />
              <ColorInput label="Font Color" value={config.fontColor} onChange={v => update('fontColor', v)} />
              <div className="flex gap-2">
                <button
                  onClick={() => update('bold', !config.bold)}
                  className={`flex-1 py-1.5 text-xs font-mono font-bold transition-all border ${config.bold ? 'bg-primary/20 text-primary border-primary/60' : 'bg-background text-muted-foreground border-border hover:border-primary/40'}`}
                >
                  Bold
                </button>
                <button
                  onClick={() => update('italic', !config.italic)}
                  className={`flex-1 py-1.5 text-xs font-mono italic transition-all border ${config.italic ? 'bg-primary/20 text-primary border-primary/60' : 'bg-background text-muted-foreground border-border hover:border-primary/40'}`}
                >
                  Italic
                </button>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 font-mono">Interior Object</h3>
            <div className="grid grid-cols-5 gap-1.5">
              <button
                onClick={() => update('interiorObject', null)}
                className={`aspect-square text-lg flex items-center justify-center transition-all border ${config.interiorObject === null ? 'bg-primary/20 border-primary/60 ring-1 ring-primary/40' : 'bg-background border-border hover:border-primary/40'}`}
                title="None"
              >
                <span className="text-muted-foreground text-xs">–</span>
              </button>
              {INTERIOR_OBJECTS.map(obj => (
                <button
                  key={obj}
                  onClick={() => update('interiorObject', obj)}
                  className={`aspect-square text-lg flex items-center justify-center transition-all border ${config.interiorObject === obj ? 'bg-primary/20 border-primary/60 ring-1 ring-primary/40 scale-110' : 'bg-background border-border hover:border-primary/40 hover:scale-105'}`}
                  title={obj}
                >
                  {INTERIOR_OBJECT_EMOJI[obj]}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 font-mono">Presets</h3>
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map(slot => {
                const preset = presets[slot];
                const isEditing = editingPresetSlot === slot;
                return (
                  <div key={slot} className="flex items-center gap-2">
                    {isEditing ? (
                      <input
                        autoFocus
                        type="text"
                        value={presetNameInput}
                        onChange={e => setPresetNameInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') confirmSavePreset(); if (e.key === 'Escape') setEditingPresetSlot(null); }}
                        className="flex-1 bg-background text-foreground text-xs font-mono px-2 py-1.5 border border-primary outline-none"
                        placeholder="Preset name…"
                      />
                    ) : (
                      <span className="flex-1 text-xs text-foreground/70 font-mono truncate px-1">
                        {preset?.name ?? <span className="text-muted-foreground italic">Empty slot {slot + 1}</span>}
                      </span>
                    )}
                    {isEditing ? (
                      <>
                        <button onClick={confirmSavePreset} className="text-xs bg-primary/20 text-primary border border-primary/60 px-2 py-1 hover:bg-primary/30 transition-colors font-mono">Save</button>
                        <button onClick={() => setEditingPresetSlot(null)} className="text-xs text-muted-foreground hover:text-foreground px-1 transition-colors">✕</button>
                      </>
                    ) : (
                      <>
                        {preset && (
                          <button
                            onClick={() => onLoadPreset(slot)}
                            className="text-xs text-primary hover:text-primary/80 px-1 transition-colors font-mono"
                          >
                            Load
                          </button>
                        )}
                        <button
                          onClick={() => handleSavePreset(slot)}
                          className="text-xs text-foreground/50 hover:text-foreground px-1 transition-colors font-mono"
                        >
                          {preset ? 'Overwrite' : 'Save here'}
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
