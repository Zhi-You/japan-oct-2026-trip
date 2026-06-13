import type { Coordinates } from '../data/locationCoordinates';

/** Opens Google Maps navigation to coordinates (best on mobile). */
export function googleMapsDirectionsUrl(
  coordinates: Coordinates,
  travelMode: 'walking' | 'transit' | 'driving' = 'transit',
): string {
  const destination = `${coordinates.lat},${coordinates.lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=${travelMode}`;
}

/** Search by place name when coordinates are unavailable. */
export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function googleMapsUrlForStop(
  coordinates: Coordinates | null | undefined,
  title: string,
  locationLabel?: string,
): string {
  if (coordinates) return googleMapsDirectionsUrl(coordinates);
  const query = locationLabel && locationLabel !== '—' ? `${title}, ${locationLabel}, Tokyo` : `${title}, Tokyo`;
  return googleMapsSearchUrl(query);
}
