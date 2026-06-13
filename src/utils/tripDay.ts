import type { DayPlan } from '../types/itinerary';

const TRIP_START = new Date(2026, 9, 1); // 1 Oct 2026 (local)
const TRIP_END = new Date(2026, 9, 8); // 8 Oct 2026

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Pick the day tab that matches today's calendar date during the trip, otherwise day 1. */
export function getDefaultDayId(days: DayPlan[], referenceDate = new Date()): string {
  const today = startOfDay(referenceDate);
  const start = startOfDay(TRIP_START);
  const end = startOfDay(TRIP_END);

  if (today < start) return days[0]?.id ?? 'day-1';
  if (today > end) return days[days.length - 1]?.id ?? 'day-8';

  const dayIndex = Math.round((today.getTime() - start.getTime()) / 86_400_000);
  const id = `day-${dayIndex + 1}`;
  return days.some((d) => d.id === id) ? id : days[0]?.id ?? 'day-1';
}

export function findDayPlan(days: DayPlan[], dayId: string): DayPlan | undefined {
  return days.find((d) => d.id === dayId);
}

export function isValidDayId(days: DayPlan[], dayId: string | undefined): dayId is string {
  return Boolean(dayId && days.some((d) => d.id === dayId));
}
