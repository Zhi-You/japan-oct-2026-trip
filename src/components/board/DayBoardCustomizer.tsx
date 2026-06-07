import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DayPlan } from '../../types/itinerary';
import type { TimelineCard } from '../../types/board';
import { useBoard } from '../../context/BoardContext';
import { IntensityBadge } from '../Badges';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { InsertCardButtons } from './InsertCardButtons';
import { SortableTimelineCard } from './SortableTimelineCard';
import { getCardTitle } from './TimelineCardContent';

interface DayBoardCustomizerProps {
  day: DayPlan;
}

export function DayBoardCustomizer({ day }: DayBoardCustomizerProps) {
  const { t } = useTranslation();
  const {
    getDayCards,
    reorderCards,
    insertCustomActivity,
    insertCustomMeal,
    deleteCard,
  } = useBoard();

  const cards = getDayCards(day.id);
  const cardIds = cards.map((c) => c.id);

  const [pendingDelete, setPendingDelete] = useState<TimelineCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderCards(day.id, String(active.id), String(over.id));
    }
  };

  const handleInsertAt = (index: number, type: 'activity' | 'meal') => {
    const position = { dayId: day.id, index };
    if (type === 'activity') insertCustomActivity(position);
    else insertCustomMeal(position);
  };

  const confirmDelete = () => {
    if (pendingDelete) {
      deleteCard(day.id, pendingDelete.id);
      setPendingDelete(null);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-dashed border-indigo/20 bg-white p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-lg bg-ink px-3 py-1 font-serif text-sm font-bold text-washi">
          {day.date}
        </div>
        <span className="text-sm text-ink-light/60">{day.weekday}</span>
        <IntensityBadge intensity={day.intensity} />
        <span className="rounded-full bg-indigo/10 px-2.5 py-0.5 text-xs font-medium text-indigo">
          {t('board.customizeMode')}
        </span>
      </div>

      <h3 className="mt-3 font-serif text-2xl font-bold text-ink">{day.title}</h3>
      <p className="mt-1 text-sm text-indigo">{day.theme}</p>

      <div className="mt-6">
        <InsertCardButtons
          onInsertActivity={() => handleInsertAt(0, 'activity')}
          onInsertMeal={() => handleInsertAt(0, 'meal')}
        />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          <div className="mt-4 space-y-2">
            {cards.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink-light/60">
                {t('board.emptyDay')}
              </p>
            ) : (
              cards.map((card, index) => (
                <div key={card.id}>
                  <SortableTimelineCard
                    card={card}
                    dayId={day.id}
                    index={index}
                    onDelete={setPendingDelete}
                  />
                  <InsertCardButtons
                    compact
                    onInsertActivity={() => handleInsertAt(index + 1, 'activity')}
                    onInsertMeal={() => handleInsertAt(index + 1, 'meal')}
                  />
                </div>
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>

      {cards.length > 0 && (
        <div className="mt-4 border-t border-washi-dark pt-4">
          <InsertCardButtons
            onInsertActivity={() => handleInsertAt(cards.length, 'activity')}
            onInsertMeal={() => handleInsertAt(cards.length, 'meal')}
          />
        </div>
      )}

      {day.pokemonCenter && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-indigo/20 bg-indigo/5 p-4">
          <span className="text-2xl">⚡</span>
          <div>
            <p className="text-xs font-semibold uppercase text-indigo">
              {t('labels.pokemonCenter')}
            </p>
            <p className="font-medium text-ink">{day.pokemonCenter.name}</p>
            <p className="text-xs text-ink-light">
              {t('labels.opensAt')} {day.pokemonCenter.openTime} — {day.pokemonCenter.note}
            </p>
          </div>
        </div>
      )}

      {day.transport.length > 0 && (
        <div className="mt-4 rounded-lg bg-ink/5 p-4">
          <p className="text-xs font-semibold uppercase text-ink-light">
            🚃 {t('labels.transport')}
          </p>
          <ul className="mt-2 space-y-1">
            {day.transport.map((tr, i) => (
              <li key={i} className="text-xs text-ink-light">
                {tr}
              </li>
            ))}
          </ul>
        </div>
      )}

      {day.dayTips.length > 0 && (
        <div className="mt-4 border-t border-washi-dark pt-4">
          <p className="text-xs font-semibold text-gold">{t('labels.dayTips')}</p>
          <ul className="mt-2 space-y-1">
            {day.dayTips.map((tip, i) => (
              <li key={i} className="text-xs text-ink-light">
                → {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={pendingDelete !== null}
        title={t('board.deleteConfirmTitle')}
        message={t('board.deleteConfirmMessage', {
          title: pendingDelete ? getCardTitle(pendingDelete) : '',
        })}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
