import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { DayPlan } from '../../types/itinerary';
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
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-lg bg-ink px-3 py-1 font-serif text-sm font-bold text-washi">
          {day.date}
        </div>
        <span className="text-sm text-ink-light/60">{day.weekday}</span>
        <IntensityBadge intensity={day.intensity} />
        {extraBadge}
      </div>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-2xl font-bold text-ink">{day.title}</h3>
          <p className="mt-1 text-sm text-indigo">{day.theme}</p>
          <p className="mt-1 text-xs text-ink-light/60">
            📍 {day.area}
            {day.weatherNote && ` · ${day.weatherNote}`}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleMap}
          className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition ${
            mapOpen
              ? 'border-indigo bg-indigo text-white shadow-sm'
              : 'border-washi-dark bg-white text-ink-light hover:border-indigo hover:text-indigo'
          }`}
        >
          {mapOpen ? t('map.hideMap') : t('map.showMap')}
        </button>
      </div>
    </>
  );
}

export function DaySectionFooter({
  day,
  showPokemon = true,
}: {
  day: DayPlan;
  showPokemon?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <>
      {showPokemon && day.pokemonCenter && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-indigo/20 bg-indigo/5 p-4">
          <span className="text-2xl">⚡</span>
          <div>
            <p className="text-xs font-semibold uppercase text-indigo">
              {t('labels.pokemonCenter')}
            </p>
            <p className="font-medium text-ink">{day.pokemonCenter.name}</p>
            <p className="text-xs text-ink-light">
              {t('labels.opensAt')} {day.pokemonCenter.openTime} — {day.pokemonCenter.note}
            </p>
          </div>
        </div>
      )}

      {day.transport.length > 0 && (
        <div className="mt-6 rounded-lg bg-ink/5 p-4">
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
              <li key={i} className="text-xs text-ink-light">
                → {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
