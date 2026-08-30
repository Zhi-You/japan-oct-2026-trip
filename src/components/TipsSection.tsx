import { useTranslation } from 'react-i18next';
import type { ItineraryData } from '../types/itinerary';

interface TipsSectionProps {
  backupPlans: ItineraryData['backupPlans'];
  extras: ItineraryData['recommendedExtras'];
}

export function TipsSection({ backupPlans, extras }: TipsSectionProps) {
  const { t } = useTranslation();

  return (
    <section id="tips" className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">{t('tips.title')}</h2>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="font-serif text-xl font-semibold text-vermillion">🔄 {t('tips.contingencies')}</h3>
          <div className="mt-4 space-y-3">
            {backupPlans.map((bp, i) => (
              <div key={i} className="rounded-lg border border-washi-dark bg-surface p-4">
                <p className="text-sm font-semibold text-ink">{bp.scenario}</p>
                <p className="mt-1 text-sm text-ink-light">{bp.action}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-serif text-xl font-semibold text-indigo">✨ {t('tips.addons')}</h3>
          <p className="mt-1 text-xs text-ink-light/60">{t('tips.addonsNote')}</p>
          <div className="mt-4 space-y-3">
            {extras.map((place) => (
              <div key={place.id} className="rounded-lg border border-washi-dark bg-surface p-4">
                <p className="font-semibold text-ink">{place.name}</p>
                <p className="text-xs text-ink-light/60">
                  {place.area} · {place.duration}
                </p>
                <p className="mt-2 text-sm text-ink-light">{place.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
