import { useTranslation } from 'react-i18next';
import { useBoard } from '../../context/BoardContext';

interface CardNotesPanelProps {
  dayId: string;
  cardId: string;
}

export function CardNotesPanel({ dayId, cardId }: CardNotesPanelProps) {
  const { t } = useTranslation();
  const { getCardNote, setCardNote, toggleCardNote } = useBoard();
  const note = getCardNote(dayId, cardId);
  const hasText = Boolean(note?.text?.trim());

  return (
    <div className="relative flex w-10 shrink-0 flex-col items-center md:w-12">
      <button
        type="button"
        onClick={() => toggleCardNote(dayId, cardId)}
        title={t('board.notes.toggle')}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition md:h-10 md:w-10 ${
          note?.isOpen
            ? 'border-indigo bg-indigo/10 text-indigo'
            : hasText
              ? 'border-gold bg-gold/10 text-gold'
              : 'border-washi-dark bg-washi text-ink-light/50 hover:border-indigo/40 hover:text-indigo'
        }`}
        aria-expanded={note?.isOpen ?? false}
        aria-label={t('board.notes.toggle')}
      >
        📝
      </button>

      {note?.isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-lg border border-washi-dark bg-white p-3 shadow-lg md:w-64">
          <label className="text-xs font-semibold uppercase tracking-wide text-indigo">
            {t('board.notes.label')}
          </label>
          <textarea
            value={note.text}
            onChange={(e) => setCardNote(dayId, cardId, e.target.value)}
            placeholder={t('board.notes.placeholder')}
            rows={4}
            className="mt-2 w-full resize-none rounded-md border border-washi-dark bg-washi/50 px-2 py-1.5 text-xs text-ink outline-none focus:border-indigo focus:ring-1 focus:ring-indigo/30"
          />
        </div>
      )}
    </div>
  );
}
