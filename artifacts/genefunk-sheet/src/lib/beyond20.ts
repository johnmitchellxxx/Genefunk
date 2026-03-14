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

interface B20RollOptions {
  characterName?: string;
  rollType?: number;    // RollType enum
  whisper?: number;     // WhisperType enum
  description?: string;
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
    description,
  } = options;

  const request: Record<string, unknown> = {
    action: 'roll',
    type: 'custom',
    name,
    roll: rollExpr,
    modifier: rollExpr,
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
