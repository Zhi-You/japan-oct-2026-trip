import type { BoardState, DayBoard, TimelineCard } from '../types/board';

const APPLIED_KEY = 'tokyo-itinerary-migrations-v1';

function getAppliedMigrations(): Set<string> {
  try {
    const raw = localStorage.getItem(APPLIED_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function markMigrationApplied(id: string): void {
  const applied = getAppliedMigrations();
  applied.add(id);
  localStorage.setItem(APPLIED_KEY, JSON.stringify([...applied]));
}

function remapDayBoardIds(board: DayBoard, fromDay: string, toDay: string): DayBoard {
  const idMap: Record<string, string> = {};

  for (const id of Object.keys(board.cards)) {
    if (id.startsWith(`${fromDay}-`)) {
      idMap[id] = id.replace(`${fromDay}-`, `${toDay}-`);
    }
  }

  const cards: Record<string, TimelineCard> = {};
  for (const [id, card] of Object.entries(board.cards)) {
    const nextId = idMap[id] ?? id;
    cards[nextId] = nextId === card.id ? card : { ...card, id: nextId };
  }

  const notes: DayBoard['notes'] = {};
  for (const [id, note] of Object.entries(board.notes)) {
    notes[idMap[id] ?? id] = note;
  }

  return {
    dayId: toDay,
    cardIds: board.cardIds.map((id) => idMap[id] ?? id),
    cards,
    notes,
  };
}

/** Swap saved timeline data for two days (preserves custom order, notes, edits). */
function swapSavedDayBoards(state: BoardState, dayA: string, dayB: string): BoardState {
  const boardA = state.days[dayA];
  const boardB = state.days[dayB];
  if (!boardA || !boardB) return state;

  return {
    ...state,
    days: {
      ...state.days,
      [dayA]: remapDayBoardIds(boardB, dayB, dayA),
      [dayB]: remapDayBoardIds(boardA, dayA, dayB),
    },
  };
}

export function runBoardMigrations(state: BoardState): BoardState {
  const applied = getAppliedMigrations();
  let next = state;

  if (!applied.has('swap-day5-day7-2026')) {
    next = swapSavedDayBoards(next, 'day-5', 'day-7');
    markMigrationApplied('swap-day5-day7-2026');
  }

  // Re-swap after calendar fix: Shibuya Mon 5 Oct, Imperial Wed 7 Oct
  if (!applied.has('swap-day5-day7-2026-v2')) {
    next = swapSavedDayBoards(next, 'day-5', 'day-7');
    markMigrationApplied('swap-day5-day7-2026-v2');
  }

  return next;
}
