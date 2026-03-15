export type DieType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

export type InteriorObject =
  | 'skull'
  | 'unicorn'
  | 'star'
  | 'gem'
  | 'flame'
  | 'dragon'
  | 'moon'
  | 'lightning'
  | 'rose'
  | 'eye';

export interface DieConfig {
  color: string;
  opacity: number;
  scale: number;
  fontFamily: string;
  fontColor: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  interiorObject: InteriorObject | null;
}

export interface Preset {
  name: string;
  config: DieConfig;
}

export interface RollResult {
  dieType: DieType;
  result: number;
}

export interface AutoRoll {
  dice: { sides: DieType; count: number }[];
  modifier: number;
  label: string;
  onComplete?: (total: number, rawResults: RollResult[]) => void;
}

export interface DiceRollerProps {
  onResult?: (rolls: RollResult[], label: string, modifier: number) => void;
  onClose?: () => void;
  userId?: string;
  autoRoll?: AutoRoll | null;
  quickMode?: boolean;
}

export interface DicePoolEntry {
  dieType: DieType;
  count: number;
}

export const DEFAULT_CONFIG: DieConfig = {
  color: '#8b5cf6',
  opacity: 1.0,
  scale: 1.0,
  fontFamily: 'serif',
  fontColor: '#ffffff',
  fontSize: 1,
  bold: true,
  italic: false,
  interiorObject: null,
};

export const DEFAULT_PRESETS: Preset[] = [
  { name: 'Death Dice', config: { ...DEFAULT_CONFIG, color: '#1a1a2e', fontColor: '#ff0055', interiorObject: 'skull' } },
  { name: 'Happiness Dice', config: { ...DEFAULT_CONFIG, color: '#ffd700', fontColor: '#ffffff', interiorObject: 'star' } },
  { name: 'War Dice', config: { ...DEFAULT_CONFIG, color: '#8b0000', fontColor: '#ff8c00', interiorObject: 'flame' } },
];
