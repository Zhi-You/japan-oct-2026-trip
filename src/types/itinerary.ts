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
