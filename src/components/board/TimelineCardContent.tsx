import { useTranslation } from 'react-i18next';
import type { TimelineCard } from '../../types/board';
import { getEffectiveSchedule } from '../../utils/cardSchedule';
import { PlaceCard } from '../PlaceCard';
import { AirportProcessCard, FlightSegmentCard } from './FlightCard';
import { ScheduleDisplay } from './ScheduleEditor';
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
        <div>
          <p className="font-semibold text-ink">{meal.name}</p>
          <p className="mt-1 text-xs text-ink-light/70">
            {meal.area} · {meal.cuisine} · {meal.priceRange}
            {meal.rating && ` · ${meal.rating}`}
          </p>
        </div>
        <span className="shrink-0 rounded bg-washi px-2 py-0.5 text-xs capitalize text-ink-light">
          {meal.meal}
        </span>
      </div>
      {meal.note && (
        <p className="mt-2 text-xs leading-relaxed text-ink-light">{meal.note}</p>
      )}
    </div>
  );
}

function PokemonCenterCardView({
  data,
  schedule,
}: {
  data: NonNullable<TimelineCard['pokemonCenter']>;
  schedule: ReturnType<typeof getEffectiveSchedule>;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-3">
      <span className="text-2xl">⚡</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo">
              {t('labels.pokemonCenter')}
            </p>
            <p className="font-serif text-lg font-semibold text-ink">{data.name}</p>
          </div>
          <ScheduleDisplay schedule={schedule} />
        </div>
        <p className="mt-2 text-xs text-ink-light">
          {t('labels.opensAt')} {data.openTime} — {data.note}
        </p>
      </div>
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
  const schedule = getEffectiveSchedule(card);

  if (card.kind === 'flight' && card.flight) {
    return <FlightSegmentCard flight={card.flight} />;
  }

  if (card.kind === 'airport-process' && card.airportProcess) {
    return (
      <AirportProcessCard process={card.airportProcess} schedule={schedule} />
    );
  }

  if (card.kind === 'pokemon-center' && card.pokemonCenter) {
    return (
      <div className="rounded-xl border border-indigo/20 bg-indigo/5 p-5 shadow-sm">
        <PokemonCenterCardView data={card.pokemonCenter} schedule={schedule} />
      </div>
    );
  }

  if (card.kind === 'place' && card.place) {
    return <PlaceCard place={card.place} index={index} schedule={schedule} />;
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
  if (card.kind === 'flight' && card.flight) {
    return `${card.flight.airline} ${card.flight.flightNumber}`;
  }
  if (card.kind === 'airport-process' && card.airportProcess) {
    return card.airportProcess.type === 'departure' ? 'Airport departure' : 'Airport touchdown';
  }
  if (card.kind === 'pokemon-center' && card.pokemonCenter) return card.pokemonCenter.name;
  if (card.kind === 'place' && card.place) return card.place.name;
  if (card.kind === 'meal' && card.meal) return card.meal.name;
  if (card.kind === 'custom-activity' && card.customActivity)
    return card.customActivity.title || 'Untitled activity';
  if (card.kind === 'custom-meal' && card.customMeal)
    return card.customMeal.name || 'Untitled meal';
  return 'Card';
}

/** Only activities use the When / duration editor — not meals. */
export function cardSupportsScheduleEdit(card: TimelineCard): boolean {
  return card.kind === 'place' || card.kind === 'pokemon-center';
}
