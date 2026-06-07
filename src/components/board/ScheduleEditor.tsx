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
        className="w-16 rounded border border-washi-dark px-2 py-1 text-sm"
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
        className="w-16 rounded border border-washi-dark px-2 py-1 text-sm"
      />
      <select
        value={duration.unit}
        onChange={(e) => onChange({ ...duration, unit: e.target.value as DurationUnit })}
        className="rounded border border-washi-dark px-2 py-1 text-sm"
      >
        <option value="hrs">hrs</option>
        <option value="mins">mins</option>
      </select>
      <span className="text-xs text-ink-light/60">{formatDuration(duration)}</span>
    </div>
  );
}

export function ScheduleEditor({ schedule, onChange, compact = false }: ScheduleEditorProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-indigo/15 bg-indigo/5 px-3 py-2">
        <select
          value={schedule.timeSlot}
          onChange={(e) =>
            onChange({ ...schedule, timeSlot: e.target.value as TimeSlot })
          }
          className="rounded border border-washi-dark bg-white px-2 py-1 text-xs"
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
        <label className="text-xs font-medium text-ink-light">When</label>
        <select
          value={schedule.timeSlot}
          onChange={(e) =>
            onChange({ ...schedule, timeSlot: e.target.value as TimeSlot })
          }
          className="mt-1 w-full rounded-md border border-washi-dark px-3 py-1.5 text-sm outline-none focus:border-indigo"
        >
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-ink-light">Duration</label>
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
