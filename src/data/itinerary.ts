import type { ItineraryData } from '../types/itinerary';
import itineraryEn from './itinerary.en';
import itineraryZh from './itinerary.zh';

export function getItinerary(locale = 'en'): ItineraryData {
  return locale.startsWith('zh') ? itineraryZh : itineraryEn;
}
