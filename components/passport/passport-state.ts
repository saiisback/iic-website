export const PASSPORT_SPREAD_COUNT = 3;

export type PassportState = {
  isOpen: boolean;
  spread: number;
};

export type PassportAction =
  | { type: "open" }
  | { type: "next" }
  | { type: "previous" }
  | { type: "close" };

export const initialPassportState: PassportState = {
  isOpen: false,
  spread: 0,
};

export function passportReducer(
  state: PassportState,
  action: PassportAction,
): PassportState {
  if (action.type === "close") {
    return initialPassportState;
  }

  if (action.type === "open") {
    return { isOpen: true, spread: 0 };
  }

  if (action.type === "next") {
    return {
      isOpen: true,
      spread: Math.min(state.spread + 1, PASSPORT_SPREAD_COUNT - 1),
    };
  }

  if (state.spread === 0) {
    return initialPassportState;
  }

  return { isOpen: true, spread: state.spread - 1 };
}

export function passportActionForKey(key: string): PassportAction | null {
  if (key === "ArrowRight") return { type: "next" };
  if (key === "ArrowLeft") return { type: "previous" };
  if (key === "Escape") return { type: "close" };
  return null;
}
