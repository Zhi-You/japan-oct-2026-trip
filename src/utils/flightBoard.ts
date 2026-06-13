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

  const missingIds = flightIds.filter((id) => !dayBoard.cardIds.includes(id));
  if (missingIds.length === 0) return;

  if (day.flightTimelineAfterPlaces) {
    const lastPlaceId = day.places.at(-1)?.id;
    const lastPlaceIndex = lastPlaceId ? dayBoard.cardIds.indexOf(lastPlaceId) : -1;
    const insertIndex = lastPlaceIndex >= 0 ? lastPlaceIndex + 1 : dayBoard.cardIds.length;
    dayBoard.cardIds = insertMissingIds(dayBoard.cardIds, missingIds, insertIndex);
    return;
  }

  dayBoard.cardIds = insertMissingIds(dayBoard.cardIds, missingIds, 0);
}
