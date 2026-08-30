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
    <div className={align === 'right' ? 'text-left sm:text-right' : 'text-left'}>
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
    <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm sm:p-5">
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
          {flight.note && (
            <p className="mt-1 text-xs text-ink-light/80">{flight.note}</p>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800">
          {flight.duration}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <EndpointBlock
          align="left"
          code={flight.departure.airportCode}
          time={flight.departure.time}
          dateLabel={flight.departure.dateLabel}
          airportName={flight.departure.airportName}
          terminal={flight.departure.terminal}
        />

        <div className="flex flex-row items-center gap-2 sm:min-w-[3rem] sm:flex-1 sm:flex-col sm:gap-1 sm:px-2">
          <span className="text-lg text-sky-400 sm:order-none">✈</span>
          <div className="h-px flex-1 border-t border-dashed border-sky-300 sm:w-full" />
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
    <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 shadow-sm sm:p-5">
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
