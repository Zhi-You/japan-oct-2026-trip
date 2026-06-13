import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';
import type { TimelineCard } from '../../types/board';
import { useBoard } from '../../context/BoardContext';
import { getEffectiveSchedule } from '../../utils/cardSchedule';
import { CardNotesPanel } from './CardNotesPanel';
import { ScheduleEditor } from './ScheduleEditor';
import {
  TimelineCardContent,
  cardSupportsScheduleEdit,
  getCardTitle,
} from './TimelineCardContent';

interface SortableTimelineCardProps {
  card: TimelineCard;
  dayId: string;
  index: number;
  onDelete: (card: TimelineCard) => void;
}

export function SortableTimelineCard({
  card,
  dayId,
  index,
  onDelete,
}: SortableTimelineCardProps) {
  const { t } = useTranslation();
  const { updateCustomActivity, updateCustomMeal, updateCardSchedule } = useBoard();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const schedule = getEffectiveSchedule(card);
  const showScheduleEditor = cardSupportsScheduleEdit(card);

  const deleteButton = (
    <button
      type="button"
      onClick={() => onDelete(card)}
      className="flex h-11 w-11 items-center justify-center rounded-lg border border-washi-dark text-ink-light/40 transition hover:border-vermillion hover:bg-vermillion/10 hover:text-vermillion"
      aria-label={t('board.deleteCard', { title: getCardTitle(card) })}
      title={t('board.delete')}
    >
      🗑
    </button>
  );

  return (
    <div ref={setNodeRef} style={style} className="relative rounded-xl border border-washi-dark/60 bg-white p-3 sm:border-0 sm:bg-transparent sm:p-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
        <div className="flex items-center gap-2 sm:block">
          <button
            type="button"
            className="drag-handle touch-target flex h-11 w-11 shrink-0 cursor-grab items-center justify-center rounded-lg border border-washi-dark bg-washi text-lg text-ink-light/50 active:cursor-grabbing hover:border-indigo/40 hover:text-indigo sm:mt-4"
            aria-label={t('board.dragHandle')}
            {...attributes}
            {...listeners}
          >
            ⠿
          </button>
          <div className="ml-auto flex items-center gap-2 sm:hidden">
            <CardNotesPanel dayId={dayId} cardId={card.id} />
            {deleteButton}
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          {showScheduleEditor && (
            <ScheduleEditor
              compact
              schedule={card.schedule ?? schedule}
              onChange={(next) => updateCardSchedule(dayId, card.id, next)}
            />
          )}
          <TimelineCardContent
            card={card}
            index={index}
            mode="edit"
            onUpdateActivity={(data) => updateCustomActivity(dayId, card.id, data)}
            onUpdateMeal={(data) => updateCustomMeal(dayId, card.id, data)}
          />
        </div>

        <div className="relative hidden shrink-0 sm:block">
          <div className="flex flex-col items-center gap-2 pt-4">
            <CardNotesPanel dayId={dayId} cardId={card.id} />
            {deleteButton}
          </div>
        </div>
      </div>
    </div>
  );
}
