import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { DayPlan } from '../types/itinerary';
import type {
  BoardState,
  CardNote,
  CardSchedule,
  CustomActivity,
  CustomMeal,
  TimelineCard,
} from '../types/board';
import {
  createEmptyCustomActivity,
  createEmptyCustomMeal,
} from '../types/board';
import { downloadBoardState, loadBoardState, loadBundledBoardState, saveBoardState } from '../utils/boardStorage';
import { runBoardMigrations } from '../utils/boardMigrations';
import { generateCardId } from '../utils/ids';
import {
  initializeBoardState,
  mergeBoardWithDefaults,
  repairBoardState,
} from '../utils/initializeBoard';

type InsertPosition = { dayId: string; index: number };

interface BoardContextValue {
  board: BoardState;
  getDayCards: (dayId: string) => TimelineCard[];
  reorderCards: (dayId: string, activeId: string, overId: string) => void;
  insertCustomActivity: (position: InsertPosition) => string;
  insertCustomMeal: (position: InsertPosition) => string;
  updateCustomActivity: (dayId: string, cardId: string, data: CustomActivity) => void;
  updateCustomMeal: (dayId: string, cardId: string, data: CustomMeal) => void;
  updateCardSchedule: (dayId: string, cardId: string, schedule: CardSchedule) => void;
  deleteCard: (dayId: string, cardId: string) => void;
  setCardNote: (dayId: string, cardId: string, text: string) => void;
  toggleCardNote: (dayId: string, cardId: string) => void;
  getCardNote: (dayId: string, cardId: string) => CardNote | undefined;
  resetBoard: () => void;
  exportBoard: () => void;
  importBoard: (state: BoardState) => void;
}

const BoardContext = createContext<BoardContextValue | null>(null);

interface BoardProviderProps {
  days: DayPlan[];
  children: ReactNode;
}

export function BoardProvider({ days, children }: BoardProviderProps) {
  const defaultBoard = useMemo(() => initializeBoardState(days), [days]);

  const [board, setBoard] = useState<BoardState>(() => {
    const saved = loadBoardState();
    const migrated = saved ? runBoardMigrations(saved) : null;
    const base = migrated ? mergeBoardWithDefaults(migrated, days) : defaultBoard;
    return repairBoardState(base, days);
  });

  useEffect(() => {
    saveBoardState(board);
  }, [board]);

  const skipLocaleMerge = useRef(true);
  useEffect(() => {
    if (skipLocaleMerge.current) {
      skipLocaleMerge.current = false;
      return;
    }
    setBoard((prev) => repairBoardState(mergeBoardWithDefaults(prev, days), days));
  }, [days]);

  useEffect(() => {
    if (loadBoardState()) return;

    let cancelled = false;
    loadBundledBoardState().then((bundled) => {
      if (cancelled || !bundled) return;
      setBoard(repairBoardState(mergeBoardWithDefaults(runBoardMigrations(bundled), days), days));
    });

    return () => {
      cancelled = true;
    };
  }, [days]);

  const getDayCards = useCallback(
    (dayId: string): TimelineCard[] => {
      const dayBoard = board.days[dayId];
      if (!dayBoard) return [];
      return dayBoard.cardIds.map((id) => dayBoard.cards[id]).filter(Boolean);
    },
    [board],
  );

  const reorderCards = useCallback((dayId: string, activeId: string, overId: string) => {
    setBoard((prev) => {
      const dayBoard = prev.days[dayId];
      if (!dayBoard) return prev;

      const oldIndex = dayBoard.cardIds.indexOf(activeId);
      const newIndex = dayBoard.cardIds.indexOf(overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;

      const cardIds = [...dayBoard.cardIds];
      const [removed] = cardIds.splice(oldIndex, 1);
      cardIds.splice(newIndex, 0, removed);

      return {
        ...prev,
        days: {
          ...prev.days,
          [dayId]: { ...dayBoard, cardIds },
        },
      };
    });
  }, []);

  const insertCard = useCallback(
    (position: InsertPosition, card: TimelineCard) => {
      setBoard((prev) => {
        const dayBoard = prev.days[position.dayId];
        if (!dayBoard) return prev;

        const cardIds = [...dayBoard.cardIds];
        cardIds.splice(position.index, 0, card.id);

        return {
          ...prev,
          days: {
            ...prev.days,
            [position.dayId]: {
              ...dayBoard,
              cardIds,
              cards: { ...dayBoard.cards, [card.id]: card },
            },
          },
        };
      });
      return card.id;
    },
    [],
  );

  const insertCustomActivity = useCallback(
    (position: InsertPosition) => {
      const id = generateCardId('activity');
      const card: TimelineCard = {
        id,
        kind: 'custom-activity',
        customActivity: createEmptyCustomActivity(),
      };
      return insertCard(position, card);
    },
    [insertCard],
  );

  const insertCustomMeal = useCallback(
    (position: InsertPosition) => {
      const id = generateCardId('meal');
      const card: TimelineCard = {
        id,
        kind: 'custom-meal',
        customMeal: createEmptyCustomMeal(),
      };
      return insertCard(position, card);
    },
    [insertCard],
  );

  const updateCustomActivity = useCallback(
    (dayId: string, cardId: string, data: CustomActivity) => {
      setBoard((prev) => {
        const dayBoard = prev.days[dayId];
        const card = dayBoard?.cards[cardId];
        if (!card || card.kind !== 'custom-activity') return prev;

        return {
          ...prev,
          days: {
            ...prev.days,
            [dayId]: {
              ...dayBoard,
              cards: {
                ...dayBoard.cards,
                [cardId]: { ...card, customActivity: data },
              },
            },
          },
        };
      });
    },
    [],
  );

  const updateCustomMeal = useCallback(
    (dayId: string, cardId: string, data: CustomMeal) => {
      setBoard((prev) => {
        const dayBoard = prev.days[dayId];
        const card = dayBoard?.cards[cardId];
        if (!card || card.kind !== 'custom-meal') return prev;

        return {
          ...prev,
          days: {
            ...prev.days,
            [dayId]: {
              ...dayBoard,
              cards: {
                ...dayBoard.cards,
                [cardId]: { ...card, customMeal: data },
              },
            },
          },
        };
      });
    },
    [],
  );

  const updateCardSchedule = useCallback(
    (dayId: string, cardId: string, schedule: CardSchedule) => {
      setBoard((prev) => {
        const dayBoard = prev.days[dayId];
        const card = dayBoard?.cards[cardId];
        if (!card) return prev;

        return {
          ...prev,
          days: {
            ...prev.days,
            [dayId]: {
              ...dayBoard,
              cards: {
                ...dayBoard.cards,
                [cardId]: { ...card, schedule },
              },
            },
          },
        };
      });
    },
    [],
  );

  const deleteCard = useCallback((dayId: string, cardId: string) => {
    setBoard((prev) => {
      const dayBoard = prev.days[dayId];
      if (!dayBoard) return prev;

      const { [cardId]: _removed, ...cards } = dayBoard.cards;
      const { [cardId]: _note, ...notes } = dayBoard.notes;

      return {
        ...prev,
        days: {
          ...prev.days,
          [dayId]: {
            ...dayBoard,
            cardIds: dayBoard.cardIds.filter((id) => id !== cardId),
            cards,
            notes,
          },
        },
      };
    });
  }, []);

  const setCardNote = useCallback((dayId: string, cardId: string, text: string) => {
    setBoard((prev) => {
      const dayBoard = prev.days[dayId];
      if (!dayBoard) return prev;

      const existing = dayBoard.notes[cardId];
      return {
        ...prev,
        days: {
          ...prev.days,
          [dayId]: {
            ...dayBoard,
            notes: {
              ...dayBoard.notes,
              [cardId]: { text, isOpen: existing?.isOpen ?? false },
            },
          },
        },
      };
    });
  }, []);

  const toggleCardNote = useCallback((dayId: string, cardId: string) => {
    setBoard((prev) => {
      const dayBoard = prev.days[dayId];
      if (!dayBoard) return prev;

      const existing = dayBoard.notes[cardId] ?? { text: '', isOpen: false };
      return {
        ...prev,
        days: {
          ...prev.days,
          [dayId]: {
            ...dayBoard,
            notes: {
              ...dayBoard.notes,
              [cardId]: { ...existing, isOpen: !existing.isOpen },
            },
          },
        },
      };
    });
  }, []);

  const getCardNote = useCallback(
    (dayId: string, cardId: string): CardNote | undefined => {
      return board.days[dayId]?.notes[cardId];
    },
    [board],
  );

  const resetBoard = useCallback(() => {
    setBoard(repairBoardState(initializeBoardState(days), days));
  }, [days]);

  const exportBoard = useCallback(() => {
    downloadBoardState(board);
  }, [board]);

  const importBoard = useCallback(
    (state: BoardState) => {
      const merged = mergeBoardWithDefaults(runBoardMigrations(state), days);
      setBoard(repairBoardState(merged, days));
    },
    [days],
  );

  const value: BoardContextValue = {
    board,
    getDayCards,
    reorderCards,
    insertCustomActivity,
    insertCustomMeal,
    updateCustomActivity,
    updateCustomMeal,
    updateCardSchedule,
    deleteCard,
    setCardNote,
    toggleCardNote,
    getCardNote,
    resetBoard,
    exportBoard,
    importBoard,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export function useBoard(): BoardContextValue {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoard must be used within BoardProvider');
  return ctx;
}
