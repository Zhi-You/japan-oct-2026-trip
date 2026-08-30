export interface Coordinates {
  lat: number;
  lng: number;
}

/** Pre-geocoded coordinates for itinerary places (no external API needed). */
export const PLACE_COORDINATES: Record<string, Coordinates> = {
  ameyoko: { lat: 35.7102, lng: 139.7745 },
  'ueno-park-lite': { lat: 35.7142, lng: 139.7748 },
  kawaguchiko: { lat: 35.5029, lng: 138.7683 },
  chureito: { lat: 35.5014, lng: 138.8014 },
  'fuji-q-area': { lat: 35.497, lng: 138.755 },
  sensoji: { lat: 35.7148, lng: 139.7967 },
  sumida: { lat: 35.7097, lng: 139.8011 },
  'skytree-exterior': { lat: 35.7101, lng: 139.8107 },
  'nezu-shrine': { lat: 35.7201, lng: 139.7626 },
  yanaka: { lat: 35.7242, lng: 139.767 },
  tnm: { lat: 35.7188, lng: 139.7765 },
  'ueno-park-full': { lat: 35.7142, lng: 139.7748 },
  meiji: { lat: 35.6764, lng: 139.6993 },
  'shibuya-crossing': { lat: 35.6595, lng: 139.7004 },
  'shibuya-sky': { lat: 35.6586, lng: 139.7023 },
  toshogu: { lat: 36.7577, lng: 139.5995 },
  'kegon-falls': { lat: 36.7377, lng: 139.503 },
  'lake-chuzenji': { lat: 36.738, lng: 139.487 },
  'imperial-east': { lat: 35.6854, lng: 139.7528 },
  'ginza-stroll': { lat: 35.6717, lng: 139.764 },
  'akihabara-tcg': { lat: 35.6984, lng: 139.7731 },
  'narita-hotel-transfer': { lat: 35.772, lng: 140.3929 },
  departure: { lat: 35.765, lng: 140.386 },
};

/** Airport coordinates for flight timeline cards. */
export const AIRPORT_COORDINATES: Record<string, Coordinates> = {
  HND: { lat: 35.5494, lng: 139.7798 },
  NRT: { lat: 35.772, lng: 140.3929 },
  SIN: { lat: 1.3644, lng: 103.9915 },
  HKG: { lat: 22.308, lng: 113.9185 },
};

/** Area / neighbourhood centres for meals and custom locations. */
export const AREA_COORDINATES: Record<string, Coordinates> = {
  Ueno: { lat: 35.7138, lng: 139.7773 },
  Asakusa: { lat: 35.7148, lng: 139.7967 },
  Oshiage: { lat: 35.7101, lng: 139.8107 },
  Nezu: { lat: 35.7201, lng: 139.7626 },
  Yanaka: { lat: 35.7242, lng: 139.767 },
  Harajuku: { lat: 35.6702, lng: 139.7026 },
  Shibuya: { lat: 35.6595, lng: 139.7004 },
  Shinjuku: { lat: 35.6896, lng: 139.7006 },
  Ikebukuro: { lat: 35.7295, lng: 139.7109 },
  Ginza: { lat: 35.6717, lng: 139.764 },
  Akihabara: { lat: 35.6984, lng: 139.7731 },
  Otemachi: { lat: 35.6854, lng: 139.7528 },
  Chiyoda: { lat: 35.6854, lng: 139.7528 },
  Nihombashi: { lat: 35.6812, lng: 139.7742 },
  Kawaguchiko: { lat: 35.5029, lng: 138.7683 },
  'Fuji Five Lakes': { lat: 35.5029, lng: 138.7683 },
  Nikko: { lat: 36.7577, lng: 139.5995 },
  Tsukiji: { lat: 35.6654, lng: 139.7707 },
  Narita: { lat: 35.772, lng: 140.3929 },
};

/** Named restaurants / venues from the saved food list. */
export const VENUE_COORDINATES: Record<string, Coordinates> = {
  'Gyukatsu Motomura Ueno': { lat: 35.7078, lng: 139.7745 },
  'Age.3 ASAKUSA': { lat: 35.7125, lng: 139.7955 },
  'Maguro-to-Shari Asakusa': { lat: 35.7128, lng: 139.7962 },
  'Ichiran Asakusa': { lat: 35.712, lng: 139.7975 },
  'Dotombori Kamukura — Asakusa ROX': { lat: 35.7115, lng: 139.7982 },
  'Spontini Cascade Harajuku': { lat: 35.6698, lng: 139.7045 },
  'Ramen Afro Beats Shinjuku': { lat: 35.6938, lng: 139.7014 },
  'Izumo Shinjuku': { lat: 35.6912, lng: 139.7048 },
  'TAMAGO-KEN Ikebukuro': { lat: 35.7298, lng: 139.7105 },
  'Age.3 GINZA': { lat: 35.6715, lng: 139.7645 },
  'Ginza Kagari — Soba': { lat: 35.6695, lng: 139.7632 },
  'Kanda Tamagoken Akihabara': { lat: 35.6975, lng: 139.7718 },
  'Uogashi Nihon-Ichi Ueno Okachimachi': { lat: 35.7076, lng: 139.7742 },
  'Sushi no Midori Shibuya': { lat: 35.6598, lng: 139.6988 },
  'Sushizanmai Tsukiji Outer Market': { lat: 35.6654, lng: 139.7707 },
  'Magurobito Asakusa': { lat: 35.7126, lng: 139.7968 },
};

/** Pokemon Center locations (optional day metadata pins). */
export const POKEMON_CENTER_COORDINATES: Record<string, Coordinates> = {
  'Pokemon Center Tokyo Station & Tokyo DX': { lat: 35.6812, lng: 139.7706 },
  'Pokemon Store Tokyo Station': { lat: 35.6812, lng: 139.7671 },
  'Pokemon Center SKYTREE TOWN': { lat: 35.7101, lng: 139.8107 },
  'Pokemon Center SHIBUYA': { lat: 35.662, lng: 139.702 },
  'Pokemon Center TOKYO DX': { lat: 35.6812, lng: 139.7742 },
};

export function resolveAreaCoordinates(label: string): Coordinates | null {
  const trimmed = label.trim();
  if (!trimmed) return null;

  const direct = AREA_COORDINATES[trimmed];
  if (direct) return direct;

  const lower = trimmed.toLowerCase();
  for (const [key, coords] of Object.entries(AREA_COORDINATES)) {
    if (lower.includes(key.toLowerCase())) return coords;
  }

  return null;
}

export function resolveVenueCoordinates(name: string): Coordinates | null {
  return VENUE_COORDINATES[name] ?? null;
}
