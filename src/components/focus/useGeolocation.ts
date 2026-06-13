import { useCallback, useEffect, useState } from 'react';

export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy: number;
}

type GeoStatus = 'idle' | 'tracking' | 'denied' | 'unavailable' | 'error';

export function useGeolocation(active: boolean) {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [status, setStatus] = useState<GeoStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('unavailable');
      return;
    }

    setStatus('tracking');
    setErrorMessage(null);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setStatus('tracking');
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setStatus('denied');
        else if (err.code === err.POSITION_UNAVAILABLE) setStatus('unavailable');
        else setStatus('error');
        setErrorMessage(err.message);
      },
      { enableHighAccuracy: true, maximumAge: 15_000, timeout: 20_000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (!active) return;
    return startTracking();
  }, [active, startTracking]);

  return { position, status, errorMessage, startTracking };
}
