import { useTranslation } from 'react-i18next';
import type { BookingItem } from '../types/itinerary';
import { UrgencyBadge } from './Badges';

interface BookingChecklistProps {
  items: BookingItem[];
}

export function BookingChecklist({ items }: BookingChecklistProps) {
  const { t } = useTranslation();

  return (
    <section id="bookings" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="font-serif text-3xl font-bold text-ink">{t('nav.bookings')}</h2>
      <p className="mt-2 text-ink-light/70">
        Critical reservations — missing these can derail the trip
      </p>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-washi-dark bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-wrap items-center gap-3">
              <UrgencyBadge urgency={item.urgency} />
              <h3 className="font-serif text-lg font-semibold text-ink">{item.item}</h3>
            </div>

            <p className="mt-3 text-sm font-medium text-vermillion">
              ⏰ {t('labels.deadline')}: {item.deadline}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-light">{item.notes}</p>

            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo hover:underline"
              >
                Book online →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
