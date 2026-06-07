interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        className="relative w-full max-w-md rounded-xl border border-washi-dark bg-white p-6 shadow-xl"
      >
        <h3 id="delete-modal-title" className="font-serif text-xl font-bold text-ink">
          {title}
        </h3>
        <p className="mt-2 text-sm text-ink-light">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-washi-dark px-4 py-2 text-sm font-medium text-ink-light transition hover:bg-washi"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-vermillion px-4 py-2 text-sm font-medium text-white transition hover:bg-vermillion-light"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
