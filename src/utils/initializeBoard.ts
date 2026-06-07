import type { DayPlan } from '../types/itinerary';
import type { BoardState, DayBoard, TimelineCard } from '../types/board';

export function initializeDayBoard(day: DayPlan): DayBoard {
  const cards: Record<string, TimelineCard> = {};
  const cardIds: string[] = [];

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
          defaultDay.cardIds.unshift(placeId);
        }
      }
    }
  }

  return merged;
}
