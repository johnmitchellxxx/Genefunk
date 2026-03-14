let _available = false;
let _listeners: Array<(available: boolean) => void> = [];

if (typeof document !== 'undefined') {
  document.addEventListener('Beyond20_Loaded', () => {
    _available = true;
    _listeners.forEach(fn => fn(true));
  });

  document.addEventListener('Beyond20_Disconnected', () => {
    _available = false;
    _listeners.forEach(fn => fn(false));
  });
}

export function isBeyond20Available() {
  return _available;
}

export function onBeyond20Change(fn: (available: boolean) => void) {
  _listeners.push(fn);
  return () => { _listeners = _listeners.filter(l => l !== fn); };
}

export function sendRollToBeyond20(title: string, rollExpr: string, advantage = 0) {
  if (!_available) return false;
  document.dispatchEvent(
    new CustomEvent('Beyond20_SendMessage', {
      detail: JSON.stringify({
        action: 'roll',
        request: {
          action: 'roll',
          type: 'roll',
          title,
          roll: rollExpr,
          advantage,
          previewing: false,
        },
      }),
    })
  );
  return true;
}
