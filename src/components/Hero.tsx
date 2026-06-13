import { useTranslation } from 'react-i18next';
import type { ItineraryData } from '../types/itinerary';

interface HeroProps {
  meta: ItineraryData['meta'];
}

export function Hero({ meta }: HeroProps) {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-ink text-washi">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-vermillion blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-indigo blur-3xl" />
      </div>

      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px',
      }} />

      <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-28">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-washi/20 bg-washi/10 px-4 py-1.5 text-sm backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-vermillion animate-pulse" />
          {t('hero.badge')}
        </div>

        <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-6xl">
          {meta.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-washi/80 md:text-xl">{meta.subtitle}</p>
        <p className="mt-2 font-serif text-2xl text-gold-light md:text-3xl">{meta.dates}</p>

        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
          <a
            href="#itinerary"
            className="min-h-11 rounded-lg bg-vermillion px-6 py-3 text-center font-medium text-white shadow-lg transition hover:bg-vermillion-light"
          >
            {t('hero.cta')}
          </a>
          <a
            href="#bookings"
            className="min-h-11 rounded-lg border border-washi/30 px-6 py-3 text-center font-medium text-washi transition hover:bg-washi/10"
          >
            {t('hero.ctaBookings')}
          </a>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-transparent via-vermillion to-transparent" />
    </section>
  );
}
