import { useEffect } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { MapPin } from '../../utils/mapLocations';
import { useCoarsePointer } from './useCoarsePointer';

interface DayMapProps {
  pins: MapPin[];
  className?: string;
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 14);
      return;
    }
    map.fitBounds(L.latLngBounds(positions), { padding: [48, 48], maxZoom: 14 });
  }, [map, positions]);

  return null;
}

function createNumberedIcon(order: number, isPokemon = false): L.DivIcon {
  const bg = isPokemon ? '#283593' : '#c62828';
  const label = isPokemon ? '⚡' : String(order);
  return L.divIcon({
    className: 'day-map-marker',
    html: `<div class="day-map-marker-pin" style="background:${bg}">${label}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  });
}

export function DayMap({ pins, className = '' }: DayMapProps) {
  const coarsePointer = useCoarsePointer();
  const plotPins = pins;
  const positions: [number, number][] = plotPins.map((p) => [
    p.coordinates.lat,
    p.coordinates.lng,
  ]);
  const routePositions = positions.length > 1 ? positions : [];

  const defaultCenter: [number, number] = positions[0] ?? [35.6762, 139.6503];
  const defaultZoom = positions.length > 0 ? 12 : 10;

  return (
    <div className={`day-map-container overflow-hidden rounded-xl border border-washi-dark ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={!coarsePointer}
        className="h-[45vh] min-h-[280px] w-full md:h-full md:min-h-[420px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds positions={positions} />

        {routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            pathOptions={{ color: '#283593', weight: 3, opacity: 0.55, dashArray: '8 8' }}
          />
        )}

        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.coordinates.lat, pin.coordinates.lng]}
            icon={createNumberedIcon(pin.order, pin.isPokemonCenter)}
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
