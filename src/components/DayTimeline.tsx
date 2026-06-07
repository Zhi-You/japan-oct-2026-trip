import { useTranslation } from 'react-i18next';
import type { DayPlan } from '../types/itinerary';
import { useBoard } from '../context/BoardContext';
import { IntensityBadge } from './Badges';
import { CardNotesPanel } from './board/CardNotesPanel';
import { TimelineCardContent } from './board/TimelineCardContent';

interface DayTimelineProps {
  days: DayPlan[];
}

export function DayTimeline({ days }: DayTimelineProps) {
  const { t } = useTranslation();
  const { getDayCards } = useBoard();
  const activeDays = days.filter((d) => {
    const cards = getDayCards(d.id);
    return cards.length > 0 || d.transport.length > 0 || d.dayTips.length > 0;
  });

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 hidden h-full w-0.5 bg-gradient-to-b from-vermillion via-indigo to-gold md:left-8 md:block" />

      <div className="space-y-12">
        {activeDays.map((day) => {
          const cards = getDayCards(day.id);

          return (
            <div key={day.id} className="relative md:pl-20">
              <div className="absolute left-2.5 top-6 hidden h-4 w-4 rounded-full border-4 border-white bg-vermillion shadow md:left-6.5 md:block" />

              <div className="rounded-2xl border border-washi-dark bg-washi/50 p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-lg bg-ink px-3 py-1 font-serif text-sm font-bold text-washi">
                    {day.date}
                  </div>
                  <span className="text-sm text-ink-light/60">{day.weekday}</span>
                  <IntensityBadge intensity={day.intensity} />
                </div>

                <h3 className="mt-3 font-serif text-2xl font-bold text-ink">{day.title}</h3>
                <p className="mt-1 text-sm text-indigo">{day.theme}</p>
                <p className="mt-1 text-xs text-ink-light/60">
                  📍 {day.area}
                  {day.weatherNote && ` · ${day.weatherNote}`}
                </p>

                {day.pokemonCenter && (
                  <div className="mt-4 flex items-start gap-3 rounded-lg border border-indigo/20 bg-indigo/5 p-4">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <p className="text-xs font-semibold uppercase text-indigo">
                        {t('labels.pokemonCenter')}
                      </p>
                      <p className="font-medium text-ink">{day.pokemonCenter.name}</p>
                      <p className="text-xs text-ink-light">
                        {t('labels.opensAt')} {day.pokemonCenter.openTime} —{' '}
                        {day.pokemonCenter.note}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  {cards.map((card, i) => (
                    <div key={card.id} className="relative flex gap-2 md:gap-3">
                      <div className="min-w-0 flex-1">
                        <TimelineCardContent card={card} index={i} mode="view" />
                      </div>
                      <div className="relative shrink-0 pt-2">
                        <CardNotesPanel dayId={day.id} cardId={card.id} />
                      </div>
                    </div>
                  ))}
                </div>

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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
