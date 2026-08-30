import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  applyTheme,
  loadTheme,
  saveLocale,
  saveTheme,
  type AppLocale,
  type AppTheme,
} from '../utils/userPrefs';

interface PrefsContextValue {
  locale: AppLocale;
  theme: AppTheme;
  toggleLocale: () => void;
  toggleTheme: () => void;
}

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState<AppTheme>(() => {
    const initial = loadTheme();
    applyTheme(initial);
    return initial;
  });

  const locale: AppLocale = i18n.language.startsWith('zh') ? 'zh' : 'en';

  const value = useMemo<PrefsContextValue>(
    () => ({
      locale,
      theme,
      toggleLocale: () => {
        const next: AppLocale = locale === 'en' ? 'zh' : 'en';
        saveLocale(next);
        void i18n.changeLanguage(next);
        document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
      },
      toggleTheme: () => {
        setTheme((prev) => {
          const next: AppTheme = prev === 'light' ? 'dark' : 'light';
          saveTheme(next);
          applyTheme(next);
          return next;
        });
      },
    }),
    [i18n, locale, theme],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): PrefsContextValue {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used within PrefsProvider');
  return ctx;
}
