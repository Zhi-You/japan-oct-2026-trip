import { useTranslation } from 'react-i18next';
import { MobileBottomNav } from './MobileBottomNav';

export function Header() {
  const { t } = useTranslation();

  const links = [
    { href: '#overview', label: t('nav.overview') },
    { href: '#itinerary', label: t('nav.itinerary') },
    { href: '#bookings', label: t('nav.bookings') },
    { href: '#pokemon', label: t('nav.pokemon') },
    { href: '#food', label: t('nav.food') },
    { href: '#tips', label: t('nav.tips') },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b border-washi-dark/50 bg-washi/95 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#" className="font-serif text-lg font-bold text-ink">
            東京<span className="text-vermillion">·</span>2026
          </a>
          <nav className="hidden gap-1 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-ink-light transition hover:bg-vermillion/10 hover:text-vermillion"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <MobileBottomNav />
    </>
  );
}

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-washi-dark bg-ink py-10 text-washi/70 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] md:pb-10">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <p className="font-serif text-lg text-washi">{t('footer.built')}</p>
        <p className="mt-2 text-sm">{t('footer.note')}</p>
        <div className="mt-6 h-px bg-gradient-to-r from-transparent via-vermillion/50 to-transparent" />
        <p className="mt-4 text-xs text-washi/40">
          Locale: EN · Architecture ready for JA / ZH translations
        </p>
      </div>
    </footer>
  );
}
