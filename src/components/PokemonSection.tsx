import { useTranslation } from 'react-i18next';
import type { ItineraryData } from '../types/itinerary';

interface PokemonSectionProps {
  strategy: string[];
  centers: ItineraryData['pokemonCenters'];
  shops: ItineraryData['tcgShops'];
}

export function PokemonSection({ strategy, centers, shops }: PokemonSectionProps) {
  const { t } = useTranslation();

  return (
    <section id="pokemon" className="bg-indigo py-16 text-washi">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="font-serif text-3xl font-bold">⚡ {t('nav.pokemon')}</h2>
        <p className="mt-2 text-washi/70">
          Daily Pokemon Center strategy + Akihabara TCG backup shops
        </p>

        <div className="mt-8 rounded-xl border border-washi/10 bg-washi/5 p-6">
          <h3 className="font-serif text-lg font-semibold text-gold-light">Strategy</h3>
          <ul className="mt-4 space-y-2">
            {strategy.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-washi/85">
                <span className="font-bold text-vermillion-light">{i + 1}.</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <h3 className="mt-10 font-serif text-xl font-semibold">Pokemon Centers by Day</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {centers.map((pc) => (
            <div
              key={pc.name}
              className="rounded-xl border border-washi/10 bg-ink-light/50 p-5"
            >
              <p className="font-semibold text-gold-light">{pc.assignedDay}</p>
              <p className="mt-1 font-serif text-lg">{pc.name}</p>
              <p className="mt-1 text-xs text-washi/60">{pc.location}</p>
              <p className="mt-2 text-xs">
                🕐 {pc.hours} · 🚉 {pc.nearestStation}
              </p>
              <p className="mt-2 text-xs text-washi/75">{pc.tcgNote}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-10 font-serif text-xl font-semibold">Akihabara TCG Shops (Day 7)</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {shops.map((shop) => (
            <div
              key={shop.name}
              className="rounded-xl border border-vermillion/30 bg-vermillion/10 p-5"
            >
              <p className="font-semibold">{shop.name}</p>
              <p className="mt-1 text-xs text-washi/60">{shop.location}</p>
              <p className="mt-2 text-xs">🕐 {shop.hours}</p>
              <p className="mt-2 text-xs text-washi/80">{shop.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
