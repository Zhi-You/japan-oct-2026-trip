import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { DayPlan } from '../types/itinerary';
import { useBoard } from '../context/BoardContext';
import {
  extractCollapsedActivities,
  extractMapPins,
  resolveCardCoordinates,
} from '../utils/mapLocations';
import { googleMapsUrlForStop } from '../utils/googleMaps';
import { findDayPlan, getDefaultDayId, isValidDayId } from '../utils/tripDay';
import { DayBoardCustomizer } from '../components/board/DayBoardCustomizer';
import { DayFocusActivityList } from '../components/focus/DayFocusActivityList';
import { DayFocusMap } from '../components/focus/DayFocusMap';
import { useGeolocation } from '../components/focus/useGeolocation';
import { PrefsToggles } from '../components/PrefsToggles';

interface DayFocusPageProps {
  days: DayPlan[];
}

type FocusMode = 'navigate' | 'edit';

export function DayFocusPage({ days }: DayFocusPageProps) {
  const { t } = useTranslation();
  const { dayId: routeDayId } = useParams();
  const navigate = useNavigate();
  const { getDayCards } = useBoard();

  const defaultDayId = getDefaultDayId(days);
  const activeDayId = isValidDayId(days, routeDayId) ? routeDayId : defaultDayId;
  const day = findDayPlan(days, activeDayId)!;
  const cards = getDayCards(activeDayId);
  const pins = useMemo(() => extractMapPins(cards), [cards]);
  const activities = useMemo(() => extractCollapsedActivities(cards), [cards]);

  const [mode, setMode] = useState<FocusMode>('navigate');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { position, status, errorMessage, startTracking } = useGeolocation(mode === 'navigate');

  const selectedPin = pins.find((p) => p.id === selectedId) ?? null;
  const selectedCard = cards.find((c) => c.id === selectedId);
  const selectedCoords =
    selectedPin?.coordinates ??
    (selectedCard ? resolveCardCoordinates(selectedCard) : null);
  const selectedActivity = activities.find((a) => a.id === selectedId);

  const googleMapsUrl =
    selectedActivity && (selectedCoords || selectedActivity.title)
      ? googleMapsUrlForStop(
          selectedCoords,
          selectedActivity.title,
          selectedActivity.locationLabel,
        )
      : null;

  const mappableCount = activities.filter((a) => a.hasCoordinates).length;

  if (!isValidDayId(days, routeDayId)) {
    return <Navigate to={`/day/${defaultDayId}`} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-washi">
      <header
        className="sticky top-0 z-50 border-b border-washi-dark bg-washi/95 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="flex items-center gap-2 px-3 py-2 sm:px-4">
          <Link
            to="/"
            className="touch-target flex shrink-0 items-center justify-center rounded-lg px-2 text-sm font-medium text-indigo"
          >
            ← {t('focus.back')}
          </Link>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate font-serif text-sm font-bold text-ink">{day.title}</p>
            <p className="text-xs text-ink-light/60">
              {day.date} · {day.weekday}
            </p>
          </div>
          <div className="flex shrink-0 rounded-lg border border-washi-dark bg-surface p-0.5">
            <button
              type="button"
              onClick={() => setMode('navigate')}
              className={`min-h-9 rounded-md px-2.5 text-xs font-medium ${
                mode === 'navigate' ? 'bg-indigo text-white' : 'text-ink-light'
              }`}
            >
              {t('focus.navigate')}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('edit');
                setSelectedId(null);
              }}
              className={`min-h-9 rounded-md px-2.5 text-xs font-medium ${
                mode === 'edit' ? 'bg-indigo text-white' : 'text-ink-light'
              }`}
            >
              {t('focus.edit')}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 pb-2">
          <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {days.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setSelectedId(null);
                navigate(`/day/${d.id}`);
              }}
              className={`shrink-0 rounded-full px-3 py-2 text-xs font-medium transition ${
                d.id === activeDayId
                  ? 'bg-banner text-banner-fg'
                  : 'border border-washi-dark bg-surface text-ink-light'
              }`}
            >
              {d.date}
            </button>
          ))}
          </div>
          <PrefsToggles compact />
        </div>
      </header>

      {mode === 'navigate' ? (
        <>
          <DayFocusMap
            pins={pins}
            selectedPinId={selectedId}
            userPosition={position}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-washi-dark bg-surface px-4 py-2 text-xs text-ink-light/70">
            <span>
              {selectedId
                ? selectedPin
                  ? t('focus.filteringOne')
                  : t('focus.filteringNoMap')
                : t('map.legend', { mapped: mappableCount, total: activities.length })}
            </span>
            {status === 'denied' && (
              <button
                type="button"
                onClick={startTracking}
                className="font-medium text-indigo underline"
              >
                {t('focus.enableLocation')}
              </button>
            )}
            {status === 'tracking' && position && (
              <span className="text-matcha">{t('focus.locationActive')}</span>
            )}
            {status === 'error' && errorMessage && (
              <span className="text-vermillion">{t('focus.locationError')}</span>
            )}
          </div>

          <div
            className="flex-1 px-4 py-4"
            style={{ paddingBottom: selectedId ? 'calc(5.5rem + env(safe-area-inset-bottom, 0px))' : '1rem' }}
          >
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo">
              {t('focus.todaysStops')}
            </h2>
            <DayFocusActivityList
              items={activities}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
            <p className="mt-4 text-[11px] leading-relaxed text-ink-light/50">
              {t('focus.tapHint')}
            </p>
          </div>

          {selectedId && googleMapsUrl && (
            <div
              className="fixed inset-x-0 bottom-0 z-50 border-t border-washi-dark bg-surface/95 p-3 backdrop-blur-md"
              style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
            >
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo px-4 py-3 text-sm font-semibold text-white shadow-lg"
              >
                🗺 {t('focus.openGoogleMaps')}
              </a>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="mt-2 w-full min-h-10 rounded-lg border border-washi-dark text-sm text-ink-light"
              >
                {t('focus.showAllStops')}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 px-3 py-4 sm:px-4">
          <p className="mb-4 text-xs text-ink-light/60">{t('board.savedHint')}</p>
          <DayBoardCustomizer day={day} embedded />
        </div>
      )}
    </div>
  );
}
