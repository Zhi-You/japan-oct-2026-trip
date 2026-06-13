import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
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
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { InsertCardButtons } from './InsertCardButtons';
import { SortableTimelineCard } from './SortableTimelineCard';
import { getCardTitle } from './TimelineCardContent';
import { DayMapPanel } from '../map/DayMapPanel';
import { DaySectionFooter, DaySectionHeader } from '../map/DaySectionHeader';

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
  const [mapOpen, setMapOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<TimelineCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
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
    <div className="rounded-2xl border-2 border-dashed border-indigo/20 bg-white p-4 sm:p-6 md:p-8">
      <DaySectionHeader
        day={day}
        mapOpen={mapOpen}
        onToggleMap={() => setMapOpen((v) => !v)}
        extraBadge={
          <span className="rounded-full bg-indigo/10 px-2.5 py-0.5 text-xs font-medium text-indigo">
            {t('board.customizeMode')}
          </span>
        }
      />

      {mapOpen ? (
        <DayMapPanel day={day} cards={cards} />
      ) : (
        <>
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
        </>
      )}

      <DaySectionFooter day={day} />

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
