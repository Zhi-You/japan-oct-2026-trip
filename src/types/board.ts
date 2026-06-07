import type { FoodStop, Place } from './itinerary';

export type TimeSlot =
  | 'Morning'
  | 'Late Morning'
  | 'Noon'
  | 'Afternoon'
  | 'Late Afternoon'
  | 'Evening'
  | 'Night';

export type DurationUnit = 'hrs' | 'mins';

export interface DurationRange {
  min: number;
  max: number;
  unit: DurationUnit;
}

export interface CardSchedule {
  timeSlot: TimeSlot;
  duration: DurationRange;
}

export interface CustomActivity {
  title: string;
  location?: string;
  description: string;
  timeSlot: TimeSlot;
  duration: DurationRange;
}

export interface CustomMeal {
  name: string;
  location?: string;
  price: string;
  description: string;
  meal: 'breakfast' | 'lunch' | 'dinner';
}

export type CardKind = 'place' | 'meal' | 'custom-activity' | 'custom-meal' | 'pokemon-center';

export interface TimelineCard {
  id: string;
  kind: CardKind;
  place?: Place;
  meal?: FoodStop;
  customActivity?: CustomActivity;
  customMeal?: CustomMeal;
  pokemonCenter?: {
    name: string;
    openTime: string;
    note: string;
  };
  /** Overrides default time/duration for place and pokemon-center cards only. */
  schedule?: CardSchedule;
}

export interface CardNote {
  text: string;
  isOpen: boolean;
}

export interface DayBoard {
  dayId: string;
  cardIds: string[];
  cards: Record<string, TimelineCard>;
  notes: Record<string, CardNote>;
}

export interface BoardState {
  version: 1;
  days: Record<string, DayBoard>;
}

export const TIME_SLOTS: TimeSlot[] = [
  'Morning',
  'Late Morning',
  'Noon',
  'Afternoon',
  'Late Afternoon',
  'Evening',
  'Night',
];

export const MEAL_TYPES: CustomMeal['meal'][] = ['breakfast', 'lunch', 'dinner'];

export function formatDuration(d: DurationRange): string {
  const suffix = d.unit === 'hrs' ? 'hr' : 'min';
  const plural = d.unit === 'hrs' ? 'hrs' : 'mins';
  const label = d.max === 1 ? suffix : plural;
  if (d.min === d.max) return `${d.min} ${label}`;
  return `${d.min}–${d.max} ${label}`;
}

export function createEmptyCustomActivity(): CustomActivity {
  return {
    title: '',
    location: '',
    description: '',
    timeSlot: 'Morning',
    duration: { min: 1, max: 2, unit: 'hrs' },
  };
}

export function createEmptyCustomMeal(): CustomMeal {
  return {
    name: '',
    location: '',
    price: '',
    description: '',
    meal: 'lunch',
  };
}
