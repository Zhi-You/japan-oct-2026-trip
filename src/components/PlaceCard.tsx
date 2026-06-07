import { useTranslation } from 'react-i18next';
import type { Place } from '../types/itinerary';
import { TicketBadge } from './Badges';

interface PlaceCardProps {
  place: Place;
  index: number;
}

export function PlaceCard({ place, index }: PlaceCardProps) {
  const { t } = useTranslation();

  return (
    <article
      className="animate-fade-up rounded-xl border border-washi-dark bg-white p-5 shadow-sm"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="font-serif text-lg font-semibold text-ink">{place.name}</h4>
          <p className="text-xs text-ink-light/60">
            {place.area} · {place.category}
          </p>
        </div>
        <div className="text-right text-xs text-ink-light/70">
          <p className="font-medium text-indigo">{place.timeSlot}</p>
          <p>{place.duration}</p>
        </div>
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
