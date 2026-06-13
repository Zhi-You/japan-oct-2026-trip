import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TimelineCard } from '../../types/board';
import type { DayPlan } from '../../types/itinerary';
import { extractCollapsedActivities, extractMapPins } from '../../utils/mapLocations';
import { CollapsedActivityList } from './CollapsedActivityList';
import { DayMap } from './DayMap';

interface DayMapPanelProps {
  day: DayPlan;
  cards: TimelineCard[];
}

export function DayMapPanel({ day: _day, cards }: DayMapPanelProps) {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string | null>(null);

  const pins = useMemo(() => extractMapPins(cards), [cards]);
  const collapsedItems = useMemo(() => extractCollapsedActivities(cards), [cards]);
  const mappableCount = collapsedItems.filter((i) => i.hasCoordinates).length;

  return (
    <div className="mt-6">
      <p className="mb-3 text-xs text-ink-light/70">
        {t('map.legend', { mapped: mappableCount, total: collapsedItems.length })}
      </p>

      <div className="grid gap-4 lg:grid-cols-[minmax(240px,320px)_1fr]">
        <div className="order-2 rounded-xl border border-washi-dark bg-washi/30 p-3 lg:order-1 lg:max-h-[480px] lg:overflow-y-auto">
          <h4 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-indigo">
            {t('map.activityOrder')}
          </h4>
          <CollapsedActivityList
            items={collapsedItems}
            activeId={activeId}
            onSelect={setActiveId}
          />
        </div>

        <div className="order-1 lg:order-2">
          <DayMap pins={pins} />
        </div>
      </div>

      <p className="mt-2 text-[11px] text-ink-light/50">{t('map.routeNote')}</p>
    </div>
  );
}
