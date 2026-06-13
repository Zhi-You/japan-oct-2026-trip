import type { AirportProcess, FlightSegment, FoodStop, Place } from '../types/itinerary';
import type { CardSchedule, DurationRange, TimeSlot, TimelineCard } from '../types/board';
import { formatDuration, TIME_SLOTS } from '../types/board';

export function parseDurationString(raw: string): DurationRange {
  const normalized = raw.trim().toLowerCase();
  const rangeMatch = normalized.match(
    /(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)\s*(hrs?|mins?|hours?|minutes?)?/,
  );
  const singleMatch = normalized.match(/^(\d+(?:\.\d+)?)\s*(hrs?|mins?|hours?|minutes?)?$/);

  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    const unitToken = rangeMatch[3] ?? 'hrs';
    const unit = unitToken.startsWith('min') ? 'mins' : 'hrs';
    return { min, max, unit };
  }

  if (singleMatch) {
    const value = parseFloat(singleMatch[1]);
    const unitToken = singleMatch[2] ?? 'hrs';
    const unit = unitToken.startsWith('min') ? 'mins' : 'hrs';
    return { min: value, max: value, unit };
  }

  return { min: 1, max: 1, unit: 'hrs' };
}

export function inferTimeSlot(raw: string): TimeSlot {
  const lower = raw.toLowerCase();
  if (lower.includes('late morning')) return 'Late Morning';
  if (lower.includes('late afternoon')) return 'Late Afternoon';
  if (lower.includes('early morning') || lower.includes('morning') || lower.includes('sunrise'))
    return 'Morning';
  if (lower.includes('noon') || lower.includes('midday')) return 'Noon';
  if (lower.includes('afternoon')) return 'Afternoon';
  if (lower.includes('evening') || lower.includes('sunset') || lower.includes('golden'))
    return 'Evening';
  if (lower.includes('night') || lower.includes('after dark')) return 'Night';
  return 'Morning';
}

export function inferTimeSlotFromClock(time: string): TimeSlot {
  const hour = parseInt(time.split(':')[0] ?? '12', 10);
  if (hour < 6) return 'Night';
  if (hour < 10) return 'Morning';
  if (hour < 12) return 'Late Morning';
  if (hour < 14) return 'Noon';
  if (hour < 17) return 'Afternoon';
  if (hour < 20) return 'Evening';
  return 'Night';
}

export function parseFlightDuration(raw: string): DurationRange {
  const match = raw.trim().match(/(\d+)\s*h(?:ours?|rs?)?(?:\s*(\d+)\s*m(?:ins?|inutes?)?)?/i);
  if (match) {
    const totalMins = parseInt(match[1], 10) * 60 + (match[2] ? parseInt(match[2], 10) : 0);
    return { min: totalMins, max: totalMins, unit: 'mins' };
  }
  return parseDurationString(raw);
}

export function defaultScheduleForAirportProcess(process: AirportProcess): CardSchedule {
  return {
    timeSlot: inferTimeSlotFromClock(process.time),
    duration: { min: process.durationMinutes, max: process.durationMinutes, unit: 'mins' },
  };
}

export function defaultScheduleForFlight(flight: FlightSegment): CardSchedule {
  return {
    timeSlot: inferTimeSlotFromClock(flight.arrival.time),
    duration: parseFlightDuration(flight.duration),
  };
}

export function defaultScheduleForPlace(place: Place): CardSchedule {
  return {
    timeSlot: inferTimeSlot(place.timeSlot),
    duration: parseDurationString(place.duration),
  };
}

export function defaultScheduleForPokemonCenter(openTime: string): CardSchedule {
  const hour = parseInt(openTime.split(':')[0] ?? '10', 10);
  let timeSlot: TimeSlot = 'Morning';
  if (hour >= 12 && hour < 14) timeSlot = 'Noon';
  else if (hour >= 14 && hour < 17) timeSlot = 'Afternoon';
  else if (hour >= 17 && hour < 20) timeSlot = 'Evening';
  else if (hour >= 20) timeSlot = 'Night';

  return {
    timeSlot,
    duration: { min: 30, max: 60, unit: 'mins' },
  };
}

/** Activity schedule — places, Pokemon Center, custom activities only. */
export function getEffectiveSchedule(card: TimelineCard): CardSchedule {
  if (card.schedule && card.kind !== 'meal' && card.kind !== 'custom-meal') {
    return card.schedule;
  }

  if (card.kind === 'place' && card.place) return defaultScheduleForPlace(card.place);
  if (card.kind === 'pokemon-center' && card.pokemonCenter) {
    return defaultScheduleForPokemonCenter(card.pokemonCenter.openTime);
  }
  if (card.kind === 'custom-activity' && card.customActivity) {
    return {
      timeSlot: card.customActivity.timeSlot,
      duration: card.customActivity.duration,
    };
  }
  if (card.kind === 'airport-process' && card.airportProcess) {
    return defaultScheduleForAirportProcess(card.airportProcess);
  }
  if (card.kind === 'flight' && card.flight) {
    return defaultScheduleForFlight(card.flight);
  }

  return { timeSlot: 'Morning', duration: { min: 1, max: 1, unit: 'hrs' } };
}

export function formatMealType(meal: FoodStop['meal'] | 'breakfast' | 'lunch' | 'dinner'): string {
  return meal.charAt(0).toUpperCase() + meal.slice(1);
}

export function getMealTypeLabel(card: TimelineCard): string | null {
  if (card.kind === 'meal' && card.meal) return formatMealType(card.meal.meal);
  if (card.kind === 'custom-meal' && card.customMeal) return formatMealType(card.customMeal.meal);
  return null;
}

export function isMealCard(card: TimelineCard): boolean {
  return card.kind === 'meal' || card.kind === 'custom-meal';
}

export function isActivityScheduleCard(card: TimelineCard): boolean {
  return card.kind === 'place' || card.kind === 'pokemon-center';
}

export function getCardTimeLabel(card: TimelineCard): string {
  const mealLabel = getMealTypeLabel(card);
  if (mealLabel) return mealLabel;
  if (card.kind === 'flight' && card.flight) {
    return `${card.flight.departure.time} → ${card.flight.arrival.time}`;
  }
  if (card.kind === 'airport-process' && card.airportProcess) {
    return card.airportProcess.time;
  }
  return getEffectiveSchedule(card).timeSlot;
}

export function getCardDurationLabel(card: TimelineCard): string {
  if (isMealCard(card)) return '';
  if (card.kind === 'flight' && card.flight) return card.flight.duration;
  return formatDuration(getEffectiveSchedule(card).duration);
}

export function formatScheduleTime(schedule: CardSchedule): string {
  return schedule.timeSlot;
}

export function formatScheduleDuration(schedule: CardSchedule): string {
  return formatDuration(schedule.duration);
}

export { TIME_SLOTS };
