import { useEffect, useMemo } from 'react';
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { GeoPosition } from './useGeolocation';
import type { MapPin } from '../../utils/mapLocations';
import { useCoarsePointer } from '../map/useCoarsePointer';

interface DayFocusMapProps {
  pins: MapPin[];
  selectedPinId: string | null;
  userPosition: GeoPosition | null;
  className?: string;
}

function FitFocusBounds({
  pinPositions,
  userPosition,
}: {
  pinPositions: [number, number][];
  userPosition: GeoPosition | null;
}) {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = [...pinPositions];
    if (userPosition) points.push([userPosition.lat, userPosition.lng]);
    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView(points[0], 15);
      return;
    }

    map.fitBounds(L.latLngBounds(points), { padding: [56, 56], maxZoom: 16 });
  }, [map, pinPositions, userPosition]);

  return null;
}

function createPinIcon(order: number, isPokemon: boolean, selected: boolean): L.DivIcon {
  const bg = selected ? '#b8860b' : isPokemon ? '#283593' : '#c62828';
  const size = selected ? 40 : 32;
  const label = isPokemon ? '⚡' : String(order);
  return L.divIcon({
    className: 'day-map-marker',
    html: `<div class="day-map-marker-pin" style="background:${bg};width:${size}px;height:${size}px;font-size:${selected ? 15 : 13}px">${label}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

const userIcon = L.divIcon({
  className: 'day-map-marker',
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#2563eb;border:3px solid #fff;box-shadow:0 0 0 2px rgba(37,99,235,0.45)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export function DayFocusMap({
  pins,
  selectedPinId,
  userPosition,
  className = '',
}: DayFocusMapProps) {
  const coarsePointer = useCoarsePointer();

  const visiblePins = useMemo(
    () => (selectedPinId ? pins.filter((p) => p.id === selectedPinId) : pins),
    [pins, selectedPinId],
  );

  const pinPositions: [number, number][] = visiblePins.map((p) => [
    p.coordinates.lat,
    p.coordinates.lng,
  ]);

  const routePositions = !selectedPinId && pinPositions.length > 1 ? pinPositions : [];

  const guideLine =
    selectedPinId && userPosition && visiblePins[0]
      ? ([
          [userPosition.lat, userPosition.lng],
          [visiblePins[0].coordinates.lat, visiblePins[0].coordinates.lng],
        ] as [number, number][])
      : null;

  const defaultCenter: [number, number] =
    pinPositions[0] ?? (userPosition ? [userPosition.lat, userPosition.lng] : [35.6762, 139.6503]);

  return (
    <div className={`day-map-container overflow-hidden border-b border-washi-dark ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={14}
        scrollWheelZoom={!coarsePointer}
        className="h-[52vh] min-h-[300px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitFocusBounds pinPositions={pinPositions} userPosition={userPosition} />

        {routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            pathOptions={{ color: '#283593', weight: 3, opacity: 0.55, dashArray: '8 8' }}
          />
        )}

        {guideLine && (
          <Polyline
            positions={guideLine}
            pathOptions={{ color: '#2563eb', weight: 4, opacity: 0.75 }}
          />
        )}

        {userPosition && (
          <>
            <Circle
              center={[userPosition.lat, userPosition.lng]}
              radius={Math.max(userPosition.accuracy, 25)}
              pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.12, weight: 1 }}
            />
            <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>
          </>
        )}

        {visiblePins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.coordinates.lat, pin.coordinates.lng]}
            icon={createPinIcon(pin.order, Boolean(pin.isPokemonCenter), pin.id === selectedPinId)}
          >
            <Popup>
              <div className="text-sm">
                {pin.order > 0 && (
                  <span className="font-bold text-vermillion">#{pin.order} </span>
                )}
                <strong>{pin.title}</strong>
                <br />
                <span className="text-ink-light">{pin.locationLabel}</span>
                <br />
                <span className="text-indigo">{pin.timeLabel}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
