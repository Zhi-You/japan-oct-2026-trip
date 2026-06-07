import type { TimelineCard } from '../types/board';
import { formatDuration } from '../types/board';
import type { DayPlan } from '../types/itinerary';
import {
  PLACE_COORDINATES,
  POKEMON_CENTER_COORDINATES,
  resolveAreaCoordinates,
  resolveVenueCoordinates,
  type Coordinates,
} from '../data/locationCoordinates';

export interface MapPin {
  id: string;
  order: number;
  title: string;
  locationLabel: string;
  timeLabel: string;
  coordinates: Coordinates;
}

function resolveCustomLocation(location?: string): Coordinates | null {
  if (!location?.trim()) return null;
  return resolveAreaCoordinates(location);
}

function resolveCardCoordinates(card: TimelineCard): Coordinates | null {
  if (card.kind === 'place' && card.place) {
    return PLACE_COORDINATES[card.place.id] ?? resolveAreaCoordinates(card.place.area);
  }

  if (card.kind === 'meal' && card.meal) {
    return (
      resolveVenueCoordinates(card.meal.name) ?? resolveAreaCoordinates(card.meal.area)
    );
  }

  if (card.kind === 'custom-activity' && card.customActivity) {
    return resolveCustomLocation(card.customActivity.location);
  }

  if (card.kind === 'custom-meal' && card.customMeal) {
    return (
      resolveVenueCoordinates(card.customMeal.name) ??
      resolveCustomLocation(card.customMeal.location)
    );
  }

  return null;
}

function getCardTimeLabel(card: TimelineCard): string {
  if (card.kind === 'place' && card.place) return card.place.timeSlot;
  if (card.kind === 'meal' && card.meal) return card.meal.meal;
  if (card.kind === 'custom-activity' && card.customActivity)
    return card.customActivity.timeSlot;
  if (card.kind === 'custom-meal' && card.customMeal) return card.customMeal.meal;
  return '—';
}

function getCardLocationLabel(card: TimelineCard): string {
  if (card.kind === 'place' && card.place) return card.place.area;
  if (card.kind === 'meal' && card.meal) return card.meal.area;
  if (card.kind === 'custom-activity' && card.customActivity)
    return card.customActivity.location?.trim() || '—';
  if (card.kind === 'custom-meal' && card.customMeal)
    return card.customMeal.location?.trim() || '—';
  return '—';
}

function getCardTitle(card: TimelineCard): string {
  if (card.kind === 'place' && card.place) return card.place.name;
  if (card.kind === 'meal' && card.meal) return card.meal.name;
  if (card.kind === 'custom-activity' && card.customActivity)
    return card.customActivity.title || 'Untitled activity';
  if (card.kind === 'custom-meal' && card.customMeal)
    return card.customMeal.name || 'Untitled meal';
  return 'Activity';
}

export function extractMapPins(cards: TimelineCard[]): MapPin[] {
  const pins: MapPin[] = [];

  cards.forEach((card, index) => {
    const coordinates = resolveCardCoordinates(card);
    if (!coordinates) return;

    pins.push({
      id: card.id,
      order: index + 1,
      title: getCardTitle(card),
      locationLabel: getCardLocationLabel(card),
      timeLabel: getCardTimeLabel(card),
      coordinates,
    });
  });

  return pins;
}

export interface CollapsedActivityItem {
  id: string;
  order: number;
  title: string;
  locationLabel: string;
  timeLabel: string;
  hasCoordinates: boolean;
}

export function extractCollapsedActivities(cards: TimelineCard[]): CollapsedActivityItem[] {
  return cards.map((card, index) => ({
    id: card.id,
    order: index + 1,
    title: getCardTitle(card),
    locationLabel: getCardLocationLabel(card),
    timeLabel: getCardTimeLabel(card),
    hasCoordinates: resolveCardCoordinates(card) !== null,
  }));
}

/** Optional Pokemon Center pin from day metadata. */
export function extractPokemonCenterPin(day: DayPlan): MapPin | null {
  if (!day.pokemonCenter) return null;
  const coordinates = POKEMON_CENTER_COORDINATES[day.pokemonCenter.name];
  if (!coordinates) return null;

  return {
    id: `${day.id}-pokemon-center`,
    order: 0,
    title: day.pokemonCenter.name,
    locationLabel: day.pokemonCenter.name,
    timeLabel: day.pokemonCenter.openTime,
    coordinates,
  };
}

export function getCardDurationLabel(card: TimelineCard): string | null {
  if (card.kind === 'place' && card.place) return card.place.duration;
  if (card.kind === 'custom-activity' && card.customActivity)
    return formatDuration(card.customActivity.duration);
  return null;
}
