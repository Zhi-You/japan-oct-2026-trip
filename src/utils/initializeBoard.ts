import type { DayPlan } from '../types/itinerary';
import type { BoardState, DayBoard, TimelineCard } from '../types/board';

function createPokemonCenterCard(day: DayPlan): TimelineCard | null {
  if (!day.pokemonCenter) return null;
  const id = `${day.id}-pokemon-center`;
  return {
    id,
    kind: 'pokemon-center',
    pokemonCenter: day.pokemonCenter,
  };
}

/** Ensure Pokemon Center card exists and stays first; strip invalid meal schedules. */
export function repairDayBoard(day: DayPlan, dayBoard: DayBoard): void {
  if (day.pokemonCenter) {
    const pcId = `${day.id}-pokemon-center`;
    if (!dayBoard.cards[pcId]) {
      dayBoard.cards[pcId] = createPokemonCenterCard(day)!;
    }
    dayBoard.cardIds = dayBoard.cardIds.filter((id) => id !== pcId);
    dayBoard.cardIds.unshift(pcId);
  }

  for (const id of Object.keys(dayBoard.cards)) {
    const card = dayBoard.cards[id];
    if (!card) continue;
    if (card.kind === 'meal' || card.kind === 'custom-meal') {
      if (card.schedule) {
        const { schedule: _removed, ...rest } = card;
        dayBoard.cards[id] = rest as TimelineCard;
      }
    }
  }
}

export function repairBoardState(state: BoardState, days: DayPlan[]): BoardState {
  const next: BoardState = {
    version: state.version,
    days: {},
  };

  for (const day of days) {
    const dayBoard = state.days[day.id] ?? initializeDayBoard(day);
    next.days[day.id] = {
      ...dayBoard,
      cardIds: [...dayBoard.cardIds],
      cards: { ...dayBoard.cards },
      notes: { ...dayBoard.notes },
    };
    repairDayBoard(day, next.days[day.id]);
  }

  return next;
}

export function initializeDayBoard(day: DayPlan): DayBoard {
  const cards: Record<string, TimelineCard> = {};
  const cardIds: string[] = [];

  const pcCard = createPokemonCenterCard(day);
  if (pcCard) {
    cards[pcCard.id] = pcCard;
    cardIds.push(pcCard.id);
  }

  for (const place of day.places) {
    cards[place.id] = { id: place.id, kind: 'place', place };
    cardIds.push(place.id);
  }

  day.food.forEach((meal, index) => {
    const id = `${day.id}-meal-${index}`;
    cards[id] = { id, kind: 'meal', meal };
    cardIds.push(id);
  });

  return { dayId: day.id, cardIds, cards, notes: {} };
}

export function initializeBoardState(days: DayPlan[]): BoardState {
  const boardDays: Record<string, DayBoard> = {};
  for (const day of days) {
    boardDays[day.id] = initializeDayBoard(day);
  }
  return { version: 1, days: boardDays };
}

export function mergeBoardWithDefaults(
  saved: BoardState,
  defaultDays: DayPlan[],
): BoardState {
  const merged = initializeBoardState(defaultDays);

  for (const day of defaultDays) {
    const savedDay = saved.days[day.id];
    if (!savedDay) continue;

    const defaultDay = merged.days[day.id];
    const savedCardIds = savedDay.cardIds.filter((id) => savedDay.cards[id]);
    const defaultPlaceIds = new Set(day.places.map((p) => p.id));

    defaultDay.cardIds = savedCardIds.length > 0 ? savedCardIds : defaultDay.cardIds;
    defaultDay.cards = { ...defaultDay.cards, ...savedDay.cards };
    defaultDay.notes = savedDay.notes ?? {};

    for (const placeId of defaultPlaceIds) {
      if (!defaultDay.cards[placeId] && day.places.find((p) => p.id === placeId)) {
        const place = day.places.find((p) => p.id === placeId)!;
        defaultDay.cards[placeId] = { id: placeId, kind: 'place', place };
        if (!defaultDay.cardIds.includes(placeId)) {
          defaultDay.cardIds.push(placeId);
        }
      }
    }

    day.food.forEach((meal, index) => {
      const id = `${day.id}-meal-${index}`;
      if (!defaultDay.cards[id]) {
        defaultDay.cards[id] = { id, kind: 'meal', meal };
        if (!defaultDay.cardIds.includes(id)) {
          defaultDay.cardIds.push(id);
        }
      }
    });
  }

  return repairBoardState(merged, defaultDays);
}
