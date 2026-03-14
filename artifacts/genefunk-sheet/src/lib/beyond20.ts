// Beyond20 DOM API integration
// Docs: https://beyond20.here-for-more.info/api

let _available = false;
let _listeners: Array<(available: boolean) => void> = [];

// RollType enum from Beyond20 API
export const RollType = {
  Normal: 0,
  Twice: 1,
  Query: 2,
  Advantage: 3,
  Disadvantage: 4,
} as const;

// WhisperType enum from Beyond20 API
export const WhisperType = {
  Public: 0,
  Whisper: 1,
  Query: 2,
  HideInfo: 3,
} as const;

if (typeof document !== 'undefined') {
  // Beyond20_Loaded fires when the extension activates on this domain
  document.addEventListener('Beyond20_Loaded', (evt: Event) => {
    const e = evt as CustomEvent;
    const _settings = e.detail?.[0]; // settings object (unused for now)
    void _settings;
    _available = true;
    _listeners.forEach(fn => fn(true));
  });

  // Beyond20_NewSettings fires when settings change (also reliable sign it's active)
  document.addEventListener('Beyond20_NewSettings', () => {
    if (!_available) {
      _available = true;
      _listeners.forEach(fn => fn(true));
    }
  });
}

export function isBeyond20Available() {
  return _available;
}

export function onBeyond20Change(fn: (available: boolean) => void) {
  _listeners.push(fn);
  return () => { _listeners = _listeners.filter(l => l !== fn); };
}

/** A single labeled bonus component, e.g. { value: 4, label: 'DEX' } */
export interface RollPart {
  value: number;
  label: string;
}

interface B20RollOptions {
  characterName?: string;
  rollType?: number;    // RollType enum
  whisper?: number;     // WhisperType enum
  description?: string;
  /** Override the Beyond20 request `type` field. Use 'initiative' to add to Roll20's tracker. */
  rollKind?: 'custom' | 'initiative' | 'ability-check' | 'saving-throw' | 'attack' | 'damage' | 'spell-card';
  /** Numeric modifier for initiative / ability rolls (Beyond20 expects a number, not the full expr) */
  numericModifier?: number;
  /**
   * Labeled breakdown of the modifier.  When provided the roll expression is built as
   * `1d20+4[DEX]+4[Init bonus]` so Roll20 displays each component inline.
   * Parts are also auto-formatted into the description field so the breakdown
   * appears below the roll in Roll20 chat.
   */
  parts?: RollPart[];
}

/** Build a Roll20-compatible labeled dice expression from an array of parts.
 *  e.g. [{value:4,label:'DEX'},{value:4,label:'bonus'}] → '+4[DEX]+4[bonus]'
 */
function buildPartsExpr(parts: RollPart[]): string {
  return parts
    .filter(p => p.value !== 0)
    .map(p => `${p.value >= 0 ? '+' : ''}${p.value}[${p.label}]`)
    .join('');
}

/**
 * Send a roll request to Beyond20 using the official DOM API.
 * detail must be an array [request] — NOT a JSON string.
 */
export function sendRollToBeyond20(
  name: string,
  rollExpr: string,
  options: B20RollOptions = {},
) {
  if (!_available) return false;

  const {
    characterName = 'GeneFunk Character',
    rollType = RollType.Normal,
    whisper = WhisperType.Public,
    rollKind = 'custom',
    numericModifier,
    parts,
  } = options;

  // If labeled parts are provided, build a labeled roll expression so Roll20
  // shows each component (e.g. "1d20 + 4[DEX] + 4[Init bonus]")
  const finalRoll = parts && parts.length > 0
    ? `1d20${buildPartsExpr(parts)}`
    : rollExpr;

  // Auto-build description from parts when none is explicitly provided
  const description = options.description
    ?? (parts && parts.length > 0
      ? parts.filter(p => p.value !== 0).map(p => `${p.value >= 0 ? '+' : ''}${p.value} ${p.label}`).join('  ')
      : undefined);

  const request: Record<string, unknown> = {
    action: 'roll',
    type: rollKind,
    name,
    roll: finalRoll,
    // Beyond20 uses 'modifier' as the numeric bonus for initiative/ability checks
    modifier: numericModifier !== undefined ? String(numericModifier) : rollExpr,
    advantage: rollType,
    whisper,
    character: {
      name: characterName,
      type: 'Character',
      url: window.location.href,
    },
  };

  if (description) request.description = description;

  // Correct Beyond20 DOM event format: detail is an ARRAY [request]
  document.dispatchEvent(
    new CustomEvent('Beyond20_SendMessage', { detail: [request] })
  );

  return true;
}
