import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoard } from '../../context/BoardContext';

interface RestorePublishedButtonProps {
  className?: string;
  onRestored?: () => void;
}

export function RestorePublishedButton({ className, onRestored }: RestorePublishedButtonProps) {
  const { t } = useTranslation();
  const { restoreBundledBoard } = useBoard();
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (!window.confirm(t('board.restorePublishedConfirm'))) return;
    setBusy(true);
    const ok = await restoreBundledBoard();
    setBusy(false);
    if (!ok) {
      window.alert(t('board.restorePublishedMissing'));
      return;
    }
    onRestored?.();
  };

  return (
    <button type="button" disabled={busy} onClick={() => void handleClick()} className={className}>
      {t('board.restorePublished')}
    </button>
  );
}
