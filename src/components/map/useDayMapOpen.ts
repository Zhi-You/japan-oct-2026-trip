import { useCallback, useState } from 'react';

export function useDayMapOpen() {
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({});

  const isOpen = useCallback((dayId: string) => openDays[dayId] ?? false, [openDays]);

  const toggle = useCallback((dayId: string) => {
    setOpenDays((prev) => ({ ...prev, [dayId]: !prev[dayId] }));
  }, []);

  return { isOpen, toggle };
}
