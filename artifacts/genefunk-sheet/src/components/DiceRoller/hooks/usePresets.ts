import { useState, useEffect, useCallback } from 'react';
import type { DieConfig, Preset } from '../types';
import { DEFAULT_CONFIG, DEFAULT_PRESETS } from '../types';

const LS_KEY = 'genefunk_dice_prefs';

interface PersistedPrefs {
  config: DieConfig;
  presets: Preset[];
}

function loadFromLocalStorage(): PersistedPrefs | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as PersistedPrefs) : null;
  } catch {
    return null;
  }
}

function saveToLocalStorage(prefs: PersistedPrefs): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(prefs));
  } catch { }
}

async function fetchServerPrefs(userId: string): Promise<PersistedPrefs | null> {
  try {
    const res = await fetch(`/api/dice-prefs?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) return null;
    return (await res.json()) as PersistedPrefs;
  } catch {
    return null;
  }
}

async function saveServerPrefs(userId: string, prefs: PersistedPrefs): Promise<void> {
  try {
    await fetch('/api/dice-prefs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId, ...prefs }),
    });
  } catch { }
}

export interface UsePresetsReturn {
  config: DieConfig;
  setConfig: (config: DieConfig) => void;
  presets: Preset[];
  savePreset: (slot: number, name: string) => void;
  loadPreset: (slot: number) => void;
  renamePreset: (slot: number, name: string) => void;
  isSaving: boolean;
}

export function usePresets(userId?: string): UsePresetsReturn {
  const [config, setConfigState] = useState<DieConfig>(DEFAULT_CONFIG);
  const [presets, setPresets] = useState<Preset[]>(DEFAULT_PRESETS);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      let prefs: PersistedPrefs | null = null;
      if (userId) {
        prefs = await fetchServerPrefs(userId);
      }
      if (!prefs) {
        prefs = loadFromLocalStorage();
      }
      if (prefs) {
        setConfigState({ ...DEFAULT_CONFIG, ...prefs.config });
        setPresets(prefs.presets.map(p => ({ ...p, config: { ...DEFAULT_CONFIG, ...p.config } })));
      }
    }
    load();
  }, [userId]);

  const persist = useCallback(async (next: PersistedPrefs) => {
    saveToLocalStorage(next);
    if (userId) {
      setIsSaving(true);
      await saveServerPrefs(userId, next);
      setIsSaving(false);
    }
  }, [userId]);

  const setConfig = useCallback((newConfig: DieConfig) => {
    setConfigState(newConfig);
    persist({ config: newConfig, presets });
  }, [persist, presets]);

  const savePreset = useCallback((slot: number, name: string) => {
    setPresets(prev => {
      const next = [...prev];
      next[slot] = { name, config };
      persist({ config, presets: next });
      return next;
    });
  }, [config, persist]);

  const loadPreset = useCallback((slot: number) => {
    const preset = presets[slot];
    if (preset) setConfig(preset.config);
  }, [presets, setConfig]);

  const renamePreset = useCallback((slot: number, name: string) => {
    setPresets(prev => {
      const next = [...prev];
      next[slot] = { ...next[slot], name };
      persist({ config, presets: next });
      return next;
    });
  }, [config, persist]);

  return { config, setConfig, presets, savePreset, loadPreset, renamePreset, isSaving };
}
