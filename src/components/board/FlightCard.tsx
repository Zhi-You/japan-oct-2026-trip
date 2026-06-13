import { useTranslation } from 'react-i18next';
import type { AirportProcess, FlightSegment } from '../../types/itinerary';
import type { CardSchedule } from '../../types/board';
import { formatDuration } from '../../types/board';

function EndpointBlock({
  code,
  time,
  dateLabel,
  airportName,
  terminal,
  align,
}: {
  code: string;
  time: string;
  dateLabel?: string;
  airportName: string;
  terminal?: string;
  align: 'left' | 'right';
}) {
  return (
    <div className={align === 'right' ? 'text-right' : 'text-left'}>
      <p className="font-serif text-2xl font-bold tabular-nums text-ink">{code}</p>
      <p className="mt-1 font-serif text-xl font-semibold tabular-nums text-ink">{time}</p>
      {dateLabel && <p className="text-xs text-ink-light/70">{dateLabel}</p>}
      <p className="mt-1 text-xs text-ink-light/80">
        {airportName}
        {terminal ? ` · ${terminal}` : ''}
      </p>
    </div>
  );
}

export function FlightSegmentCard({ flight }: { flight: FlightSegment }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
            ✈ {t('labels.flight')}
          </p>
          <p className="mt-1 font-serif text-lg font-semibold text-ink">
            {flight.airline} · {flight.flightNumber}
          </p>
          {flight.aircraft && (
            <p className="text-xs text-ink-light/70">{flight.aircraft}</p>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800">
          {flight.duration}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <EndpointBlock
          align="left"
          code={flight.departure.airportCode}
          time={flight.departure.time}
          dateLabel={flight.departure.dateLabel}
          airportName={flight.departure.airportName}
          terminal={flight.departure.terminal}
        />

        <div className="flex min-w-[3rem] flex-1 flex-col items-center gap-1 px-2">
          <span className="text-lg text-sky-400">✈</span>
          <div className="h-px w-full border-t border-dashed border-sky-300" />
        </div>

        <EndpointBlock
          align="right"
          code={flight.arrival.airportCode}
          time={flight.arrival.time}
          dateLabel={flight.arrival.dateLabel}
          airportName={flight.arrival.airportName}
          terminal={flight.arrival.terminal}
        />
      </div>
    </div>
  );
}

export function AirportProcessCard({
  process,
  schedule,
}: {
  process: AirportProcess;
  schedule: CardSchedule;
}) {
  const { t } = useTranslation();
  const label =
    process.type === 'departure' ? t('labels.airportDeparture') : t('labels.airportTouchdown');

  return (
    <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
            {process.type === 'departure' ? '🛫' : '🛬'} {label}
          </p>
          <p className="mt-1 font-serif text-lg font-semibold text-ink">
            {process.airportName}
            {process.terminal ? ` · ${process.terminal}` : ''}
          </p>
          <p className="text-xs text-ink-light/70">
            {process.airportCode} · {process.time}
          </p>
        </div>
        <span className="shrink-0 rounded bg-white px-2 py-1 text-xs font-medium text-ink-light">
          {formatDuration(schedule.duration)}
        </span>
      </div>
    </div>
  );
}
