import { useTranslation } from 'react-i18next';

const NAV_ITEMS = [
  { href: '#overview', key: 'overview' as const },
  { href: '#itinerary', key: 'itinerary' as const },
  { href: '#bookings', key: 'bookings' as const },
  { href: '#pokemon', key: 'pokemon' as const },
  { href: '#food', key: 'food' as const },
  { href: '#tips', key: 'tips' as const },
];

export function MobileBottomNav() {
  const { t } = useTranslation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-washi-dark/80 bg-washi/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Section navigation"
    >
      <div className="flex gap-1 overflow-x-auto px-2 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex min-h-11 shrink-0 items-center rounded-lg px-3 py-2 text-xs font-medium text-ink-light transition active:bg-vermillion/10 active:text-vermillion"
          >
            {t(`nav.${item.key}`)}
          </a>
        ))}
      </div>
    </nav>
  );
}
