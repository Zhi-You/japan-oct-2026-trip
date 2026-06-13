import { useTranslation } from 'react-i18next';
import type { DayPlan } from '../types/itinerary';
import type { FoodStop } from '../types/itinerary';
import { useBoard } from '../context/BoardContext';

interface FoodMapProps {
  days: DayPlan[];
}

export function FoodMap({ days }: FoodMapProps) {
  const { t } = useTranslation();
  const { getDayCards } = useBoard();

  const allFood: (FoodStop & { day: string; dayTitle: string; isCustom?: boolean })[] = [];

  for (const day of days) {
    const cards = getDayCards(day.id);
    for (const card of cards) {
      if (card.kind === 'meal' && card.meal) {
        allFood.push({ ...card.meal, day: day.date, dayTitle: day.title });
      }
      if (card.kind === 'custom-meal' && card.customMeal) {
        allFood.push({
          name: card.customMeal.name || 'Untitled meal',
          area: card.customMeal.location ?? '—',
          cuisine: 'Custom',
          priceRange: card.customMeal.price || '—',
          meal: card.customMeal.meal,
          note: card.customMeal.description,
          day: day.date,
          dayTitle: day.title,
          isCustom: true,
        });
      }
    }
  }

  const byArea = allFood.reduce<Record<string, typeof allFood>>((acc, item) => {
    const area = item.area;
    if (!acc[area]) acc[area] = [];
    acc[area].push(item);
    return acc;
  }, {});

  return (
    <section id="food" className="washi-pattern py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">🍜 {t('nav.food')}</h2>
        <p className="mt-2 text-ink-light/70">
          Meals from your itinerary timeline — updates when you reorder or add custom meals
        </p>

        {allFood.length === 0 ? (
          <p className="mt-8 text-center text-sm text-ink-light/60">{t('board.noMeals')}</p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {Object.entries(byArea).map(([area, items]) => (
              <div
                key={area}
                className="rounded-xl border border-washi-dark bg-white p-5 shadow-sm"
              >
                <h3 className="font-serif text-lg font-semibold text-vermillion">{area}</h3>
                <ul className="mt-3 space-y-3">
                  {items.map((item, i) => (
                    <li key={i} className="border-b border-washi pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between gap-2">
                        <p className="font-medium text-ink">
                          {item.name}
                          {item.isCustom && (
                            <span className="ml-2 text-xs text-vermillion">(custom)</span>
                          )}
                        </p>
                        {item.rating && (
                          <span className="shrink-0 text-xs text-gold">{item.rating}</span>
                        )}
                      </div>
                      <p className="text-xs text-ink-light/60">
                        {item.cuisine} · {item.priceRange} · {item.meal}
                      </p>
                      <p className="mt-1 text-xs text-indigo">
                        Scheduled: {item.day} ({item.dayTitle})
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
