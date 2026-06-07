import type { BoardState } from '../types/board';

const STORAGE_KEY = 'tokyo-itinerary-board-v1';

export function loadBoardState(): BoardState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BoardState;
    if (parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveBoardState(state: BoardState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearBoardState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
