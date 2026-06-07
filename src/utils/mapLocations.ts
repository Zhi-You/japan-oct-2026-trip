import type { TimelineCard } from '../types/board';
import { getCardDurationLabel, getCardTimeLabel } from './cardSchedule';
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
  isPokemonCenter?: boolean;
}

function resolveCustomLocation(location?: string): Coordinates | null {
  if (!location?.trim()) return null;
  return resolveAreaCoordinates(location);
}

function resolveCardCoordinates(card: TimelineCard): Coordinates | null {
  if (card.kind === 'pokemon-center' && card.pokemonCenter) {
    return POKEMON_CENTER_COORDINATES[card.pokemonCenter.name] ?? null;
  }

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

function getCardLocationLabel(card: TimelineCard): string {
  if (card.kind === 'pokemon-center' && card.pokemonCenter) {
    return card.pokemonCenter.name
      .replace(/^Pokemon Center /i, '')
      .replace(/^Pokemon Store /i, '');
  }
  if (card.kind === 'place' && card.place) return card.place.area;
  if (card.kind === 'meal' && card.meal) return card.meal.area;
  if (card.kind === 'custom-activity' && card.customActivity)
    return card.customActivity.location?.trim() || '—';
  if (card.kind === 'custom-meal' && card.customMeal)
    return card.customMeal.location?.trim() || '—';
  return '—';
}

function getCardTitle(card: TimelineCard): string {
  if (card.kind === 'pokemon-center' && card.pokemonCenter) return card.pokemonCenter.name;
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
      isPokemonCenter: card.kind === 'pokemon-center',
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
  durationLabel: string;
  isMeal?: boolean;
  isPokemonCenter?: boolean;
  hasCoordinates: boolean;
}

export function extractCollapsedActivities(cards: TimelineCard[]): CollapsedActivityItem[] {
  return cards.map((card, index) => {
    const durationLabel = getCardDurationLabel(card);
    return {
      id: card.id,
      order: index + 1,
      title: getCardTitle(card),
      locationLabel: getCardLocationLabel(card),
      timeLabel: getCardTimeLabel(card),
      durationLabel,
      isMeal: card.kind === 'meal' || card.kind === 'custom-meal',
      isPokemonCenter: card.kind === 'pokemon-center',
      hasCoordinates: resolveCardCoordinates(card) !== null,
    };
  });
}

export { getCardTitle, getCardTimeLabel, getCardDurationLabel };
