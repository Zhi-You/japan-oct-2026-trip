import { useRef, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { DayPlan } from '../types/itinerary';
import { useBoard } from '../context/BoardContext';
import { parseImportedBoardState } from '../utils/boardStorage';
import { DayBoardCustomizer } from './board/DayBoardCustomizer';
import { DayTimeline } from './DayTimeline';

interface ItinerarySectionProps {
  days: DayPlan[];
}

type ViewMode = 'view' | 'customize';

export function ItinerarySection({ days }: ItinerarySectionProps) {
  const { t } = useTranslation();
  const { resetBoard, exportBoard, importBoard } = useBoard();
  const [mode, setMode] = useState<ViewMode>('view');
  const [savedHint, setSavedHint] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const activeDays = days;

  const switchToView = () => {
    setMode('view');
    setSavedHint(true);
    window.setTimeout(() => setSavedHint(false), 3000);
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const text = await file.text();
    const state = parseImportedBoardState(text);
    if (!state) {
      window.alert(t('board.importInvalid'));
      return;
    }

    if (!window.confirm(t('board.importConfirm'))) return;
    importBoard(state);
    setSavedHint(true);
    window.setTimeout(() => setSavedHint(false), 3000);
  };

  return (
    <section id="itinerary" className="bg-surface py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">{t('nav.itinerary')}</h2>
            <p className="mt-2 text-ink-light/70">
              {mode === 'view'
                ? savedHint
                  ? t('board.savedHint')
                  : t('board.viewSubtitle')
                : t('board.customizeSubtitle')}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            {mode === 'customize' && (
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={exportBoard}
                  className="min-h-11 rounded-lg border border-washi-dark px-3 py-2.5 text-xs text-ink-light transition hover:border-indigo hover:text-indigo"
                >
                  {t('board.export')}
                </button>
                <button
                  type="button"
                  onClick={() => importInputRef.current?.click()}
                  className="min-h-11 rounded-lg border border-washi-dark px-3 py-2.5 text-xs text-ink-light transition hover:border-indigo hover:text-indigo"
                >
                  {t('board.import')}
                </button>
                <input
                  ref={importInputRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={handleImportFile}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(t('board.resetConfirm'))) resetBoard();
                  }}
                  className="col-span-2 min-h-11 rounded-lg border border-washi-dark px-3 py-2.5 text-xs text-ink-light transition hover:border-vermillion hover:text-vermillion sm:col-span-1"
                >
                  {t('board.reset')}
                </button>
              </div>
            )}
            <div className="flex rounded-lg border border-washi-dark bg-washi p-1">
              <button
                type="button"
                onClick={switchToView}
                className={`min-h-11 flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition sm:flex-none sm:py-2 ${
                  mode === 'view'
                    ? 'bg-surface text-ink shadow-sm'
                    : 'text-ink-light hover:text-ink'
                }`}
              >
                {t('board.viewMode')}
              </button>
              <button
                type="button"
                onClick={() => setMode('customize')}
                className={`min-h-11 flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition sm:flex-none sm:py-2 ${
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

        {mode === 'customize' && (
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-ink-light/60">
            {t('board.persistenceNote')}
          </p>
        )}

        <div className="relative mt-8 sm:mt-12">
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
