import { useTranslation } from 'react-i18next';
import type { Place } from '../types/itinerary';
import type { CardSchedule } from '../types/board';
import { TicketBadge } from './Badges';
import { ScheduleDisplay } from './board/ScheduleEditor';

interface PlaceCardProps {
  place: Place;
  index: number;
  schedule: CardSchedule;
}

export function PlaceCard({ place, index, schedule }: PlaceCardProps) {
  const { t } = useTranslation();

  return (
    <article
      className="animate-fade-up rounded-xl border border-washi-dark bg-white p-4 shadow-sm sm:p-5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="font-serif text-lg font-semibold text-ink">{place.name}</h4>
          <p className="text-xs text-ink-light/60">
            {place.area} · {place.category}
          </p>
        </div>
        <ScheduleDisplay schedule={schedule} className="sm:text-right" />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-light">{place.summary}</p>

      {place.ticket && <TicketBadge type={place.ticket.type} detail={place.ticket.detail} />}

      {place.photoNote && (
        <div className="mt-3 rounded-lg bg-sakura/30 px-3 py-2 text-xs text-ink-light">
          <span className="font-semibold text-vermillion">📷 {t('labels.photoNote')}:</span>{' '}
          {place.photoNote}
        </div>
      )}

      {place.paceNote && (
        <div className="mt-2 rounded-lg bg-gold/10 px-3 py-2 text-xs text-ink-light">
          <span className="font-semibold text-gold">⚡ {t('labels.paceNote')}:</span>{' '}
          {place.paceNote}
        </div>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo">
            {t('labels.highlights')}
          </p>
          <ul className="mt-1.5 space-y-1">
            {place.highlights.map((h, i) => (
              <li key={i} className="flex gap-2 text-xs text-ink-light">
                <span className="text-vermillion">•</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo">
            {t('labels.tips')}
          </p>
          <ul className="mt-1.5 space-y-1">
            {place.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-xs text-ink-light">
                <span className="text-gold">✦</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
