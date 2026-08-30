import { useTranslation } from 'react-i18next';
import type { CollapsedActivityItem } from '../../utils/mapLocations';

interface DayFocusActivityListProps {
  items: CollapsedActivityItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function DayFocusActivityList({
  items,
  selectedId,
  onSelect,
}: DayFocusActivityListProps) {
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink-light/60">{t('map.noActivities')}</p>
    );
  }

  return (
    <ol className="space-y-2">
      {items.map((item) => {
        const selected = selectedId === item.id;
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(selected ? null : item.id)}
              className={`flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition ${
                selected
                  ? 'border-gold bg-gold/10 shadow-sm'
                  : 'border-washi-dark bg-surface hover:border-indigo/30 hover:bg-washi/50'
              } ${!item.hasCoordinates ? 'opacity-80' : ''}`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                  item.isPokemonCenter
                    ? 'bg-indigo'
                    : item.hasCoordinates
                      ? selected
                        ? 'bg-gold'
                        : 'bg-vermillion'
                      : 'bg-ink-light/40'
                }`}
              >
                {item.isPokemonCenter ? '⚡' : item.order}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{item.title}</p>
                <p className="text-xs text-ink-light/70">{item.locationLabel}</p>
                <p className="mt-0.5 text-xs capitalize text-indigo">
                  {item.timeLabel}
                  {!item.isMeal && item.durationLabel ? (
                    <>
                      <span className="text-ink-light/50"> · </span>
                      {item.durationLabel}
                    </>
                  ) : null}
                </p>
                {!item.hasCoordinates && (
                  <p className="mt-1 text-[11px] text-gold">{t('map.noCoordinates')}</p>
                )}
              </div>
              {selected && (
                <span className="shrink-0 rounded-full bg-gold/20 px-2 py-1 text-[10px] font-semibold uppercase text-gold">
                  {t('focus.onMap')}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
