import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';
import type { TimelineCard } from '../../types/board';
import { useBoard } from '../../context/BoardContext';
import { CardNotesPanel } from './CardNotesPanel';
import { TimelineCardContent, getCardTitle } from './TimelineCardContent';

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
  const { updateCustomActivity, updateCustomMeal } = useBoard();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div className="flex gap-2 md:gap-3">
        <button
          type="button"
          className="mt-4 flex h-10 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg border border-washi-dark bg-washi text-ink-light/50 active:cursor-grabbing hover:border-indigo/40 hover:text-indigo"
          aria-label={t('board.dragHandle')}
          {...attributes}
          {...listeners}
        >
          ⠿
        </button>

        <div className="min-w-0 flex-1">
          <TimelineCardContent
            card={card}
            index={index}
            mode="edit"
            onUpdateActivity={(data) => updateCustomActivity(dayId, card.id, data)}
            onUpdateMeal={(data) => updateCustomMeal(dayId, card.id, data)}
          />
        </div>

        <div className="relative shrink-0">
          <div className="flex flex-col items-center gap-2 pt-4">
            <CardNotesPanel dayId={dayId} cardId={card.id} />
            <button
              type="button"
              onClick={() => onDelete(card)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-washi-dark text-ink-light/40 transition hover:border-vermillion hover:bg-vermillion/10 hover:text-vermillion md:h-10 md:w-10"
              aria-label={t('board.deleteCard', { title: getCardTitle(card) })}
              title={t('board.delete')}
            >
              🗑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
