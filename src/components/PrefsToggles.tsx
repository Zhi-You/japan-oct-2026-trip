import { useTranslation } from 'react-i18next';
import { usePrefs } from '../context/PrefsContext';

export function PrefsToggles({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const { locale, theme, toggleLocale, toggleTheme } = usePrefs();

  const buttonClass = compact
    ? 'min-h-9 rounded-md border border-washi-dark bg-surface px-2.5 text-xs font-medium text-ink-light'
    : 'min-h-9 rounded-md border border-washi-dark bg-surface px-3 text-xs font-medium text-ink-light';

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        onClick={toggleLocale}
        className={buttonClass}
        aria-label={t('prefs.language')}
        title={t('prefs.language')}
      >
        {locale === 'zh' ? '中文' : 'EN'}
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        className={buttonClass}
        aria-label={t('prefs.theme')}
        title={theme === 'dark' ? t('prefs.light') : t('prefs.dark')}
      >
        {theme === 'dark' ? t('prefs.light') : t('prefs.dark')}
      </button>
    </div>
  );
}
