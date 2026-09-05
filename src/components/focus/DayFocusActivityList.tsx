import { useTranslation } from 'react-i18next';
import type { TimelineCard } from '../../types/board';
import type { CollapsedActivityItem } from '../../utils/mapLocations';
import { TimelineCardContent } from '../board/TimelineCardContent';

interface DayFocusActivityListProps {
  items: CollapsedActivityItem[];
  cards: TimelineCard[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function DayFocusActivityList({
  items,
  cards,
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
      {items.map((item, index) => {
        const selected = selectedId === item.id;
        const card = cards.find((c) => c.id === item.id);
        const mealLabel = item.mealType ? t(`forms.${item.mealType}`) : null;

        return (
          <li key={item.id}>
            <div
              className={`overflow-hidden rounded-xl border transition ${
                selected
                  ? 'border-gold bg-gold/10 shadow-sm'
                  : 'border-washi-dark bg-surface hover:border-indigo/30 hover:bg-washi/50'
              } ${!item.hasCoordinates && !selected ? 'opacity-80' : ''}`}
            >
              <button
                type="button"
                onClick={() => onSelect(selected ? null : item.id)}
                className="flex w-full items-start gap-3 px-3 py-3 text-left"
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
                  <p className="mt-0.5 text-xs">
                    {item.isMeal && mealLabel ? (
                      <span className="font-semibold text-vermillion">{mealLabel}</span>
                    ) : (
                      <span className="capitalize text-indigo">{item.timeLabel}</span>
                    )}
                    {!item.isMeal && item.durationLabel ? (
                      <>
                        <span className="text-ink-light/50"> · </span>
                        <span className="text-indigo">{item.durationLabel}</span>
                      </>
                    ) : null}
                  </p>
                  {item.note && (
                    <p className="mt-1.5 whitespace-pre-line rounded-md bg-gold/10 px-2 py-1.5 text-xs leading-relaxed text-ink-light">
                      {item.note}
                    </p>
                  )}
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

              {selected && card && (
                <div className="border-t border-gold/20 bg-surface/80 px-3 py-3">
                  <TimelineCardContent card={card} index={index} mode="view" bare />
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
