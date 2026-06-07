import { useTranslation } from 'react-i18next';
import type { CollapsedActivityItem } from '../../utils/mapLocations';

interface CollapsedActivityListProps {
  items: CollapsedActivityItem[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
}

export function CollapsedActivityList({
  items,
  activeId,
  onSelect,
}: CollapsedActivityListProps) {
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-ink-light/60">{t('map.noActivities')}</p>
    );
  }

  return (
    <ol className="space-y-1">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onSelect?.(item.id)}
            className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition ${
              activeId === item.id
                ? 'border-indigo bg-indigo/5'
                : 'border-washi-dark bg-white hover:border-indigo/30 hover:bg-washi/50'
            } ${!item.hasCoordinates ? 'opacity-70' : ''}`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                item.hasCoordinates ? 'bg-vermillion' : 'bg-ink-light/40'
              }`}
            >
              {item.order}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{item.title}</p>
              <p className="truncate text-xs text-ink-light/70">{item.locationLabel}</p>
              <p className="mt-0.5 text-xs font-medium capitalize text-indigo">
                {item.timeLabel}
              </p>
              {!item.hasCoordinates && (
                <p className="mt-0.5 text-[10px] text-gold">{t('map.noCoordinates')}</p>
              )}
            </div>
          </button>
        </li>
      ))}
    </ol>
  );
}
