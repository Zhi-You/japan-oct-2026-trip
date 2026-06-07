import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DayPlan } from '../types/itinerary';
import { useBoard } from '../context/BoardContext';
import { DayBoardCustomizer } from './board/DayBoardCustomizer';
import { DayTimeline } from './DayTimeline';

interface ItinerarySectionProps {
  days: DayPlan[];
}

type ViewMode = 'view' | 'customize';

export function ItinerarySection({ days }: ItinerarySectionProps) {
  const { t } = useTranslation();
  const { resetBoard } = useBoard();
  const [mode, setMode] = useState<ViewMode>('view');
  const activeDays = days;

  return (
    <section id="itinerary" className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-bold text-ink">{t('nav.itinerary')}</h2>
            <p className="mt-2 text-ink-light/70">
              {mode === 'view'
                ? t('board.viewSubtitle')
                : t('board.customizeSubtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {mode === 'customize' && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(t('board.resetConfirm'))) resetBoard();
                }}
                className="rounded-lg border border-washi-dark px-3 py-2 text-xs text-ink-light transition hover:border-vermillion hover:text-vermillion"
              >
                {t('board.reset')}
              </button>
            )}
            <div className="flex rounded-lg border border-washi-dark bg-washi p-1">
              <button
                type="button"
                onClick={() => setMode('view')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  mode === 'view'
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-ink-light hover:text-ink'
                }`}
              >
                {t('board.viewMode')}
              </button>
              <button
                type="button"
                onClick={() => setMode('customize')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  mode === 'customize'
                    ? 'bg-indigo text-white shadow-sm'
                    : 'text-ink-light hover:text-ink'
                }`}
              >
                {t('board.customizeMode')}
              </button>
            </div>
          </div>
        </div>

        <div className="relative mt-12">
          {mode === 'view' ? (
            <DayTimeline days={days} />
          ) : (
            <div className="space-y-12">
              {activeDays.map((day) => (
                <DayBoardCustomizer key={day.id} day={day} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
