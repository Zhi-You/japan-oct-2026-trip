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

  const noteButtonClass = `flex h-11 w-11 items-center justify-center rounded-lg border text-sm transition ${
    note?.isOpen
      ? 'border-indigo bg-indigo/10 text-indigo'
      : hasText
        ? 'border-gold bg-gold/10 text-gold'
        : 'border-washi-dark bg-washi text-ink-light/50 hover:border-indigo/40 hover:text-indigo'
  }`;

  const textarea = (
    <textarea
      value={note?.text ?? ''}
      onChange={(e) => setCardNote(dayId, cardId, e.target.value)}
      placeholder={t('board.notes.placeholder')}
      rows={4}
      className="mt-2 w-full resize-none rounded-md border border-washi-dark bg-washi/50 px-3 py-2 text-sm text-ink outline-none focus:border-indigo focus:ring-1 focus:ring-indigo/30"
    />
  );

  return (
    <div className="relative flex shrink-0 flex-col items-center">
      <button
        type="button"
        onClick={() => toggleCardNote(dayId, cardId)}
        title={t('board.notes.toggle')}
        className={noteButtonClass}
        aria-expanded={note?.isOpen ?? false}
        aria-label={t('board.notes.toggle')}
      >
        📝
      </button>

      {note?.isOpen && (
        <>
          <div
            className="fixed inset-0 z-[55] bg-ink/40 md:hidden"
            onClick={() => toggleCardNote(dayId, cardId)}
            aria-hidden
          />
          <div
            className="fixed inset-x-0 bottom-0 z-[60] rounded-t-2xl border border-washi-dark bg-white p-4 shadow-2xl md:hidden"
            style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-washi-dark" />
            <label className="text-xs font-semibold uppercase tracking-wide text-indigo">
              {t('board.notes.label')}
            </label>
            {textarea}
            <button
              type="button"
              onClick={() => toggleCardNote(dayId, cardId)}
              className="mt-3 w-full rounded-lg bg-indigo py-3 text-sm font-medium text-white"
            >
              Done
            </button>
          </div>

          <div className="absolute right-0 top-full z-20 mt-2 hidden w-64 rounded-lg border border-washi-dark bg-white p-3 shadow-lg md:block">
            <label className="text-xs font-semibold uppercase tracking-wide text-indigo">
              {t('board.notes.label')}
            </label>
            {textarea}
          </div>
        </>
      )}
    </div>
  );
}
