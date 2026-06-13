import type { BoardState } from '../types/board';

const STORAGE_KEY = 'tokyo-itinerary-board-v1';
export const BOARD_EXPORT_FILENAME = 'tokyo-itinerary-board.json';
export const BUNDLED_BOARD_PATH = `${import.meta.env.BASE_URL}custom-board.json`;

export function isValidBoardState(value: unknown): value is BoardState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as BoardState;
  return candidate.version === 1 && typeof candidate.days === 'object' && candidate.days !== null;
}

export function loadBoardState(): BoardState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidBoardState(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function loadBundledBoardState(): Promise<BoardState | null> {
  try {
    const response = await fetch(BUNDLED_BOARD_PATH);
    if (!response.ok) return null;
    const parsed = (await response.json()) as unknown;
    if (!isValidBoardState(parsed)) return null;
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

export function parseImportedBoardState(raw: string): BoardState | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidBoardState(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function downloadBoardState(state: BoardState, filename = BOARD_EXPORT_FILENAME): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
