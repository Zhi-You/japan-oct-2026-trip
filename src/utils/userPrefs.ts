export type AppLocale = 'en' | 'zh';
export type AppTheme = 'light' | 'dark';

export const LOCALE_STORAGE_KEY = 'tokyo-itinerary-locale';
export const THEME_STORAGE_KEY = 'tokyo-itinerary-theme';

export function loadLocale(): AppLocale {
  try {
    return localStorage.getItem(LOCALE_STORAGE_KEY) === 'zh' ? 'zh' : 'en';
  } catch {
    return 'en';
  }
}

export function saveLocale(locale: AppLocale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore quota / private mode */
  }
}

export function loadTheme(): AppTheme {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme: AppTheme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore quota / private mode */
  }
}

export function applyTheme(theme: AppTheme): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#14141c' : '#f5f0e6');
}
