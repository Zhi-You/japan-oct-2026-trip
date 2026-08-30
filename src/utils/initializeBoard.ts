import type { DayPlan } from '../types/itinerary';
import type { BoardState, DayBoard, TimelineCard } from '../types/board';
import { createFlightTimelineCard, getDefaultFlightCardIds, mergeFlightTimelineCards } from './flightBoard';

function createPokemonCenterCard(day: DayPlan): TimelineCard | null {
  if (!day.pokemonCenter) return null;
  const id = `${day.id}-pokemon-center`;
  return {
    id,
    kind: 'pokemon-center',
    pokemonCenter: day.pokemonCenter,
  };
}

function findPokemonCenterInsertIndex(day: DayPlan, dayBoard: DayBoard): number {
  const flightIds = getDefaultFlightCardIds(day);
  for (let i = flightIds.length - 1; i >= 0; i -= 1) {
    const idx = dayBoard.cardIds.indexOf(flightIds[i]!);
    if (idx >= 0) return idx + 1;
  }

  const firstPlaceId = day.places[0]?.id;
  if (firstPlaceId) {
    const placeIdx = dayBoard.cardIds.indexOf(firstPlaceId);
    if (placeIdx >= 0) return placeIdx;
  }

  return 0;
}

/** Ensure Pokemon Center card matches itinerary; strip invalid meal schedules. */
export function repairDayBoard(day: DayPlan, dayBoard: DayBoard): void {
  const pcId = `${day.id}-pokemon-center`;

  if (day.pokemonCenter) {
    dayBoard.cards[pcId] = createPokemonCenterCard(day)!;

    if (!dayBoard.cardIds.includes(pcId)) {
      const insertIndex = findPokemonCenterInsertIndex(day, dayBoard);
      dayBoard.cardIds.splice(insertIndex, 0, pcId);
    }
  } else if (dayBoard.cards[pcId] || dayBoard.cardIds.includes(pcId)) {
    const { [pcId]: _removed, ...cards } = dayBoard.cards;
    const { [pcId]: _note, ...notes } = dayBoard.notes;
    dayBoard.cards = cards;
    dayBoard.notes = notes;
    dayBoard.cardIds = dayBoard.cardIds.filter((id) => id !== pcId);
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
      if (place.id === 'narita-hotel-transfer') continue;
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

  const eveningTransfer = day.places.find((place) => place.id === 'narita-hotel-transfer');
  if (eveningTransfer) {
    pushCard({ id: eveningTransfer.id, kind: 'place', place: eveningTransfer });
  }

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

    defaultDay.cardIds = savedCardIds.length > 0 ? savedCardIds : defaultDay.cardIds;
    defaultDay.cards = { ...defaultDay.cards, ...savedDay.cards };
    defaultDay.notes = savedDay.notes ?? {};

    for (const place of day.places) {
      const existing = defaultDay.cards[place.id];
      defaultDay.cards[place.id] = existing
        ? { ...existing, kind: 'place', place }
        : { id: place.id, kind: 'place', place };
      if (!defaultDay.cardIds.includes(place.id)) {
        defaultDay.cardIds.push(place.id);
      }
    }

    day.food.forEach((meal, index) => {
      const id = `${day.id}-meal-${index}`;
      const existing = defaultDay.cards[id];
      defaultDay.cards[id] = existing
        ? { ...existing, kind: 'meal', meal }
        : { id, kind: 'meal', meal };
      if (!defaultDay.cardIds.includes(id)) {
        defaultDay.cardIds.push(id);
      }
    });

    for (const item of day.flightTimeline ?? []) {
      const card = createFlightTimelineCard(item);
      const existing = defaultDay.cards[card.id];
      defaultDay.cards[card.id] = existing ? { ...existing, ...card } : card;
    }

    const pcCard = createPokemonCenterCard(day);
    if (pcCard) {
      const existing = defaultDay.cards[pcCard.id];
      defaultDay.cards[pcCard.id] = existing ? { ...existing, ...pcCard } : pcCard;
    }

    mergeFlightTimelineCards(day, defaultDay);
  }

  return repairBoardState(merged, defaultDays);
}
