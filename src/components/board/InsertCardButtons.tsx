import { useTranslation } from 'react-i18next';

interface InsertCardButtonsProps {
  onInsertActivity: () => void;
  onInsertMeal: () => void;
  compact?: boolean;
}

export function InsertCardButtons({
  onInsertActivity,
  onInsertMeal,
  compact = false,
}: InsertCardButtonsProps) {
  const { t } = useTranslation();

  if (compact) {
    return (
      <div className="flex items-center justify-center gap-2 py-1">
        <button
          type="button"
          onClick={onInsertActivity}
          className="rounded-full border border-dashed border-indigo/40 px-3 py-1 text-xs text-indigo transition hover:border-indigo hover:bg-indigo/5"
        >
          + {t('board.addActivity')}
        </button>
        <button
          type="button"
          onClick={onInsertMeal}
          className="rounded-full border border-dashed border-vermillion/40 px-3 py-1 text-xs text-vermillion transition hover:border-vermillion hover:bg-vermillion/5"
        >
          + {t('board.addMeal')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onInsertActivity}
        className="rounded-lg border border-indigo/30 bg-indigo/5 px-4 py-2 text-sm font-medium text-indigo transition hover:bg-indigo/10"
      >
        + {t('board.addActivity')}
      </button>
      <button
        type="button"
        onClick={onInsertMeal}
        className="rounded-lg border border-vermillion/30 bg-vermillion/5 px-4 py-2 text-sm font-medium text-vermillion transition hover:bg-vermillion/10"
      >
        + {t('board.addMeal')}
      </button>
    </div>
  );
}
