import { useTranslation } from 'react-i18next';
import type { ItineraryData } from '../types/itinerary';

interface TripOverviewProps {
  meta: ItineraryData['meta'];
  seasonNotes: string[];
}

export function TripOverview({ meta, seasonNotes }: TripOverviewProps) {
  const { t } = useTranslation();

  const stats = [
    { label: t('overview.dates'), value: meta.dates },
    { label: t('overview.travellers'), value: meta.travellers },
    { label: t('overview.base'), value: meta.baseArea },
  ];

  return (
    <section id="overview" className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">{t('overview.title')}</h2>
      <p className="mt-3 max-w-3xl text-ink-light/80">{meta.groupNote}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-washi-dark bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium uppercase tracking-wider text-ink-light/60">
              {stat.label}
            </p>
            <p className="mt-1 font-serif text-lg font-semibold text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-indigo/20 bg-indigo/5 p-6">
        <h3 className="flex items-center gap-2 font-serif text-xl font-semibold text-indigo">
          <span className="text-vermillion">🍂</span>
          {t('labels.season')}
        </h3>
        <ul className="mt-4 space-y-2">
          {seasonNotes.map((note, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-light">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-vermillion" />
              {note}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-matcha/30 bg-matcha/5 p-5">
        <p className="text-sm font-medium text-matcha">{t('overview.transport')}</p>
        <p className="mt-1 text-sm text-ink-light">
          JR Yamanote Line, Tokyo Metro, Keisei &amp; highway buses. Suica/Pasmo IC cards for all
          trains and most buses. No rental car needed — every day is public-transit optimised from
          Ueno.
        </p>
      </div>
    </section>
  );
}
