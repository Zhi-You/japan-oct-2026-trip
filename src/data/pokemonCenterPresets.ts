/** Shared card for the two centres ~10 min apart near Tokyo Station / Nihombashi. */
export const TOKYO_STATION_AREA_PC_NAME =
  'Pokemon Center Tokyo Station & Tokyo DX';

export function tokyoStationAreaPokemonCenter(note: string) {
  return {
    name: TOKYO_STATION_AREA_PC_NAME,
    openTime: '10:00',
    note,
  };
}
