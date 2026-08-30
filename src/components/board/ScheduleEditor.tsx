import { useTranslation } from 'react-i18next';
import type { CardSchedule, DurationRange, DurationUnit, TimeSlot } from '../../types/board';
import { TIME_SLOTS, formatDuration } from '../../types/board';

interface ScheduleEditorProps {
  schedule: CardSchedule;
  onChange: (schedule: CardSchedule) => void;
  compact?: boolean;
}

function DurationFields({
  duration,
  onChange,
}: {
  duration: DurationRange;
  onChange: (d: DurationRange) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="number"
        min={0}
        max={24}
        value={duration.min}
        onChange={(e) =>
          onChange({ ...duration, min: Math.max(0, Number(e.target.value) || 0) })
        }
        className="w-16 rounded border border-washi-dark bg-surface px-2 py-2 text-sm text-ink sm:py-1"
      />
      <span className="text-xs text-ink-light">–</span>
      <input
        type="number"
        min={0}
        max={24}
        value={duration.max}
        onChange={(e) =>
          onChange({
            ...duration,
            max: Math.max(duration.min, Number(e.target.value) || 0),
          })
        }
        className="w-16 rounded border border-washi-dark bg-surface px-2 py-2 text-sm text-ink sm:py-1"
      />
      <select
        value={duration.unit}
        onChange={(e) => onChange({ ...duration, unit: e.target.value as DurationUnit })}
        className="rounded border border-washi-dark bg-surface px-2 py-2 text-sm text-ink sm:py-1"
      >
        <option value="hrs">{t('forms.hrs')}</option>
        <option value="mins">{t('forms.mins')}</option>
      </select>
      <span className="text-xs text-ink-light/60">{formatDuration(duration)}</span>
    </div>
  );
}

export function ScheduleEditor({ schedule, onChange, compact = false }: ScheduleEditorProps) {
  const { t } = useTranslation();

  if (compact) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-indigo/15 bg-indigo/5 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center">
        <select
          value={schedule.timeSlot}
          onChange={(e) =>
            onChange({ ...schedule, timeSlot: e.target.value as TimeSlot })
          }
          className="min-h-11 w-full rounded border border-washi-dark bg-surface px-3 py-2 text-sm text-ink sm:w-auto sm:py-1 sm:text-xs"
        >
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        <DurationFields
          duration={schedule.duration}
          onChange={(duration) => onChange({ ...schedule, duration })}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className="text-xs font-medium text-ink-light">{t('forms.when')}</label>
        <select
          value={schedule.timeSlot}
          onChange={(e) =>
            onChange({ ...schedule, timeSlot: e.target.value as TimeSlot })
          }
          className="mt-1 w-full rounded-md border border-washi-dark bg-surface px-3 py-1.5 text-sm text-ink outline-none focus:border-indigo"
        >
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-ink-light">{t('forms.duration')}</label>
        <div className="mt-1">
          <DurationFields
            duration={schedule.duration}
            onChange={(duration) => onChange({ ...schedule, duration })}
          />
        </div>
      </div>
    </div>
  );
}

export function ScheduleDisplay({
  schedule,
  className = '',
}: {
  schedule: CardSchedule;
  className?: string;
}) {
  return (
    <div className={`text-right text-xs text-ink-light/70 ${className}`}>
      <p className="font-medium text-indigo">{schedule.timeSlot}</p>
      <p>{formatDuration(schedule.duration)}</p>
    </div>
  );
}
