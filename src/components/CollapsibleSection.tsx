import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface CollapsibleSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function CollapsibleSection({
  id,
  title,
  subtitle,
  children,
  className = '',
}: CollapsibleSectionProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const syncHash = () => {
      if (window.location.hash === `#${id}`) setOpen(true);
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, [id]);

  return (
    <section id={id} className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full min-h-11 items-start justify-between gap-3 text-left"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
      >
        <span className="min-w-0">
          <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-2 text-ink-light/70">{subtitle}</p>}
        </span>
        <span className="mt-1 shrink-0 rounded-lg border border-washi-dark bg-surface px-3 py-2 text-xs font-medium text-ink-light">
          {open ? t('board.hide') : t('board.show')}
        </span>
      </button>

      {open && (
        <div id={`${id}-panel`} className="mt-8">
          {children}
        </div>
      )}
    </section>
  );
}
