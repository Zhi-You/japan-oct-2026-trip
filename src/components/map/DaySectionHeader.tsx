import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { DayPlan } from '../../types/itinerary';
import { getDayNumber } from '../../utils/tripDay';
import { IntensityBadge } from '../Badges';

interface DaySectionHeaderProps {
  day: DayPlan;
  mapOpen: boolean;
  onToggleMap: () => void;
  extraBadge?: ReactNode;
}

export function DaySectionHeader({
  day,
  mapOpen,
  onToggleMap,
  extraBadge,
}: DaySectionHeaderProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="rounded-lg bg-banner px-3 py-1 font-serif text-sm font-bold text-banner-fg">
          {day.date}
        </div>
        <span className="font-serif text-sm font-semibold text-ink">
          {t('labels.dayN', { n: getDayNumber(day) })}
        </span>
        <span className="text-sm text-ink-light/60">{day.weekday}</span>
        <IntensityBadge intensity={day.intensity} />
        {extraBadge}
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-serif text-xl font-bold text-ink sm:text-2xl">{day.title}</h3>
          <p className="mt-1 text-sm text-indigo">{day.theme}</p>
          <p className="mt-1 text-xs text-ink-light/60">
            📍 {day.area}
            {day.weatherNote && ` · ${day.weatherNote}`}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleMap}
          className={`w-full shrink-0 rounded-lg border px-4 py-3 text-sm font-medium transition sm:w-auto sm:py-2 ${
            mapOpen
              ? 'border-indigo bg-indigo text-white shadow-sm'
              : 'border-washi-dark bg-surface text-ink-light hover:border-indigo hover:text-indigo'
          }`}
        >
          {mapOpen ? t('map.hideMap') : t('map.showMap')}
        </button>
      </div>
    </>
  );
}

export function DaySectionFooter({ day }: { day: DayPlan }) {
  const { t } = useTranslation();

  return (
    <>
      {day.transport.length > 0 && (
        <div className="mt-6 rounded-lg bg-ink/5 p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase text-ink-light">
            🚃 {t('labels.transport')}
          </p>
          <ul className="mt-2 space-y-1">
            {day.transport.map((tr, i) => (
              <li key={i} className="text-xs text-ink-light">
                {tr}
              </li>
            ))}
          </ul>
        </div>
      )}

      {day.dayTips.length > 0 && (
        <div className="mt-4 border-t border-washi-dark pt-4">
          <p className="text-xs font-semibold text-gold">{t('labels.dayTips')}</p>
          <ul className="mt-2 space-y-1">
            {day.dayTips.map((tip, i) => (
              <li key={i} className="text-xs leading-relaxed text-ink-light">
                → {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
