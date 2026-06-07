import { useTranslation } from 'react-i18next';
import type { TimelineCard } from '../../types/board';
import { PlaceCard } from '../PlaceCard';
import { CustomActivityDisplay, CustomActivityEditor } from './CustomActivityForm';
import { CustomMealDisplay, CustomMealEditor } from './CustomMealForm';

interface TimelineCardContentProps {
  card: TimelineCard;
  index: number;
  mode: 'view' | 'edit';
  onUpdateActivity?: (data: NonNullable<TimelineCard['customActivity']>) => void;
  onUpdateMeal?: (data: NonNullable<TimelineCard['customMeal']>) => void;
}

function MealCardView({ meal }: { meal: NonNullable<TimelineCard['meal']> }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-ink">{meal.name}</p>
        <span className="shrink-0 rounded bg-washi px-2 py-0.5 text-xs capitalize text-ink-light">
          {meal.meal}
        </span>
      </div>
      <p className="mt-1 text-xs text-ink-light/70">
        {meal.area} · {meal.cuisine} · {meal.priceRange}
        {meal.rating && ` · ${meal.rating}`}
      </p>
      {meal.note && (
        <p className="mt-2 text-xs leading-relaxed text-ink-light">{meal.note}</p>
      )}
    </div>
  );
}

export function TimelineCardContent({
  card,
  index,
  mode,
  onUpdateActivity,
  onUpdateMeal,
}: TimelineCardContentProps) {
  const { t } = useTranslation();

  if (card.kind === 'place' && card.place) {
    return <PlaceCard place={card.place} index={index} />;
  }

  if (card.kind === 'meal' && card.meal) {
    return (
      <div className="rounded-xl border border-washi-dark bg-white p-5 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase text-vermillion">
          🍜 {t('labels.food')}
        </p>
        <MealCardView meal={card.meal} />
      </div>
    );
  }

  if (card.kind === 'custom-activity' && card.customActivity) {
    return (
      <div className="rounded-xl border border-indigo/20 bg-white p-5 shadow-sm">
        {mode === 'edit' && onUpdateActivity ? (
          <CustomActivityEditor data={card.customActivity} onChange={onUpdateActivity} />
        ) : (
          <CustomActivityDisplay data={card.customActivity} />
        )}
      </div>
    );
  }

  if (card.kind === 'custom-meal' && card.customMeal) {
    return (
      <div className="rounded-xl border border-vermillion/20 bg-white p-5 shadow-sm">
        {mode === 'edit' && onUpdateMeal ? (
          <CustomMealEditor data={card.customMeal} onChange={onUpdateMeal} />
        ) : (
          <CustomMealDisplay data={card.customMeal} />
        )}
      </div>
    );
  }

  return null;
}

export function getCardTitle(card: TimelineCard): string {
  if (card.kind === 'place' && card.place) return card.place.name;
  if (card.kind === 'meal' && card.meal) return card.meal.name;
  if (card.kind === 'custom-activity' && card.customActivity)
    return card.customActivity.title || 'Untitled activity';
  if (card.kind === 'custom-meal' && card.customMeal)
    return card.customMeal.name || 'Untitled meal';
  return 'Card';
}
