export type TicketRequirement = 'advance_required' | 'advance_recommended' | 'walk_in' | 'lottery' | 'free';

export interface FoodStop {
  name: string;
  area: string;
  cuisine: string;
  priceRange: string;
  rating?: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  note?: string;
}

export interface FlightEndpoint {
  airportCode: string;
  airportName: string;
  terminal?: string;
  time: string;
  dateLabel?: string;
}

export interface FlightSegment {
  id: string;
  airline: string;
  flightNumber: string;
  aircraft?: string;
  departure: FlightEndpoint;
  arrival: FlightEndpoint;
  duration: string;
  /** Optional party / package note (e.g. which travellers). */
  note?: string;
}

export interface AirportProcess {
  id: string;
  type: 'departure' | 'touchdown';
  airportCode: string;
  airportName: string;
  terminal?: string;
  time: string;
  durationMinutes: number;
}

export type FlightTimelineItem =
  | { kind: 'flight'; flight: FlightSegment }
  | { kind: 'airport-process'; process: AirportProcess };

export interface Place {
  id: string;
  name: string;
  area: string;
  category: string;
  timeSlot: string;
  duration: string;
  summary: string;
  highlights: string[];
  tips: string[];
  ticket?: {
    type: TicketRequirement;
    detail: string;
  };
  photoNote?: string;
  paceNote?: string;
}

export interface DayPlan {
  id: string;
  date: string;
  weekday: string;
  title: string;
  theme: string;
  area: string;
  intensity: 'light' | 'moderate' | 'full';
  pokemonCenter?: {
    name: string;
    openTime: string;
    note: string;
  };
  places: Place[];
  food: FoodStop[];
  /** Flights and airport processes — rendered as timeline cards before other activities. */
  flightTimeline?: FlightTimelineItem[];
  /** When true, flight cards appear after places (e.g. departure day transfer first). */
  flightTimelineAfterPlaces?: boolean;
  transport: string[];
  dayTips: string[];
  weatherNote?: string;
}

export interface BookingItem {
  id: string;
  item: string;
  deadline: string;
  urgency: 'critical' | 'high' | 'medium';
  link?: string;
  notes: string;
}

export interface PokemonCenter {
  name: string;
  location: string;
  hours: string;
  nearestStation: string;
  assignedDay: string;
  tcgNote: string;
}

export interface TripMeta {
  title: string;
  subtitle: string;
  dates: string;
  travellers: string;
  baseArea: string;
  groupNote: string;
}

export interface ItineraryData {
  meta: TripMeta;
  seasonNotes: string[];
  bookingChecklist: BookingItem[];
  pokemonStrategy: string[];
  pokemonCenters: PokemonCenter[];
  tcgShops: { name: string; hours: string; location: string; note: string }[];
  days: DayPlan[];
  recommendedExtras: Place[];
  backupPlans: { scenario: string; action: string }[];
}
