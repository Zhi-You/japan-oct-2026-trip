import type { DayPlan, FlightTimelineItem } from '../types/itinerary';
import type { TimelineCard } from '../types/board';

export function createFlightTimelineCard(item: FlightTimelineItem): TimelineCard {
  if (item.kind === 'flight') {
    return {
      id: item.flight.id,
      kind: 'flight',
      flight: item.flight,
    };
  }

  return {
    id: item.process.id,
    kind: 'airport-process',
    airportProcess: item.process,
  };
}

export function getDefaultFlightCardIds(day: DayPlan): string[] {
  return (day.flightTimeline ?? []).map((item) =>
    item.kind === 'flight' ? item.flight.id : item.process.id,
  );
}

function insertMissingIds(
  cardIds: string[],
  missingIds: string[],
  insertIndex: number,
): string[] {
  const next = [...cardIds];
  next.splice(Math.max(0, Math.min(insertIndex, next.length)), 0, ...missingIds);
  return next;
}

export function mergeFlightTimelineCards(
  day: DayPlan,
  dayBoard: { cardIds: string[]; cards: Record<string, TimelineCard> },
): void {
  const flightIds = getDefaultFlightCardIds(day);
  if (flightIds.length === 0) return;

  for (const item of day.flightTimeline ?? []) {
    const card = createFlightTimelineCard(item);
    if (!dayBoard.cards[card.id]) {
      dayBoard.cards[card.id] = card;
    }
  }

  const lastPlaceId = day.places.at(-1)?.id;
  const lastPlaceIndex = lastPlaceId ? dayBoard.cardIds.indexOf(lastPlaceId) : -1;
  let lastIndex = day.flightTimelineAfterPlaces
    ? lastPlaceIndex >= 0
      ? lastPlaceIndex
      : -1
    : -1;

  for (const id of flightIds) {
    const existing = dayBoard.cardIds.indexOf(id);
    if (existing >= 0) {
      lastIndex = existing;
      continue;
    }
    const insertIndex = lastIndex + 1;
    dayBoard.cardIds = insertMissingIds(dayBoard.cardIds, [id], insertIndex);
    lastIndex = insertIndex;
  }
}
