import { useTranslation } from 'react-i18next';
import type { TicketRequirement } from '../types/itinerary';

const ticketStyles: Record<TicketRequirement, string> = {
  advance_required: 'bg-vermillion/10 text-vermillion border-vermillion/30',
  advance_recommended: 'bg-gold/10 text-gold border-gold/30',
  walk_in: 'bg-matcha/10 text-matcha border-matcha/30',
  lottery: 'bg-indigo/10 text-indigo border-indigo/30',
  free: 'bg-ink/5 text-ink-light border-ink/10',
};

interface TicketBadgeProps {
  type: TicketRequirement;
  detail?: string;
}

export function TicketBadge({ type, detail }: TicketBadgeProps) {
  const { t } = useTranslation();
  const labels: Record<TicketRequirement, string> = {
    advance_required: t('labels.ticketAdvanceRequired'),
    advance_recommended: t('labels.ticketAdvanceRecommended'),
    walk_in: t('labels.ticketWalkIn'),
    lottery: t('labels.ticketLottery'),
    free: t('labels.ticketFree'),
  };

  return (
    <div className="mt-3">
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${ticketStyles[type]}`}
      >
        🎫 {labels[type]}
      </span>
      {detail && <p className="mt-1.5 text-xs text-ink-light/70">{detail}</p>}
    </div>
  );
}

interface IntensityBadgeProps {
  intensity: 'light' | 'moderate' | 'full';
}

export function IntensityBadge({ intensity }: IntensityBadgeProps) {
  const { t } = useTranslation();
  const map = {
    light: { label: t('labels.intensityLight'), color: 'bg-matcha/15 text-matcha' },
    moderate: { label: t('labels.intensityModerate'), color: 'bg-gold/15 text-gold' },
    full: { label: t('labels.intensityFull'), color: 'bg-vermillion/15 text-vermillion' },
  };
  const { label, color } = map[intensity];

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {t('labels.intensity')}: {label}
    </span>
  );
}

interface UrgencyBadgeProps {
  urgency: 'critical' | 'high' | 'medium';
}

export function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  const { t } = useTranslation();
  const map = {
    critical: { label: t('labels.urgencyCritical'), color: 'bg-vermillion text-white' },
    high: { label: t('labels.urgencyHigh'), color: 'bg-gold text-white' },
    medium: { label: t('labels.urgencyMedium'), color: 'bg-indigo/80 text-white' },
  };
  const { label, color } = map[urgency];

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${color}`}>
      {label}
    </span>
  );
}
