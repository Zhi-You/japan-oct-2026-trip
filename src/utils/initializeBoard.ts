import type { DayPlan } from '../types/itinerary';
import type { BoardState, DayBoard, TimelineCard } from '../types/board';
import { createFlightTimelineCard, mergeFlightTimelineCards } from './flightBoard';

function createPokemonCenterCard(day: DayPlan): TimelineCard | null {
  if (!day.pokemonCenter) return null;
  const id = `${day.id}-pokemon-center`;
  return {
    id,
    kind: 'pokemon-center',
    pokemonCenter: day.pokemonCenter,
  };
}

/** Ensure Pokemon Center card exists; strip invalid meal schedules. */
export function repairDayBoard(day: DayPlan, dayBoard: DayBoard): void {
  if (day.pokemonCenter) {
    const pcId = `${day.id}-pokemon-center`;
    if (!dayBoard.cards[pcId]) {
      dayBoard.cards[pcId] = createPokemonCenterCard(day)!;
      if (!dayBoard.cardIds.includes(pcId)) {
        dayBoard.cardIds.push(pcId);
      }
    }
  }

  mergeFlightTimelineCards(day, dayBoard);

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

  const flightCards = (day.flightTimeline ?? []).map((item) => createFlightTimelineCard(item));

  const pushCard = (card: TimelineCard) => {
    cards[card.id] = card;
    cardIds.push(card.id);
  };

  const addFlightCards = () => {
    for (const card of flightCards) pushCard(card);
  };

  const addPlaceCards = () => {
    for (const place of day.places) {
      pushCard({ id: place.id, kind: 'place', place });
    }
  };

  const pcCard = createPokemonCenterCard(day);

  if (day.flightTimelineAfterPlaces) {
    addPlaceCards();
    addFlightCards();
  } else {
    addFlightCards();
    if (pcCard) pushCard(pcCard);
    addPlaceCards();
  }

  day.food.forEach((meal, index) => {
    const id = `${day.id}-meal-${index}`;
    pushCard({ id, kind: 'meal', meal });
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

    mergeFlightTimelineCards(day, defaultDay);
  }

  return repairBoardState(merged, defaultDays);
}
