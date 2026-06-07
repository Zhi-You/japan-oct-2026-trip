import type { CustomActivity, DurationRange, DurationUnit, TimeSlot } from '../../types/board';
import { TIME_SLOTS, formatDuration } from '../../types/board';

interface CustomActivityEditorProps {
  data: CustomActivity;
  onChange: (data: CustomActivity) => void;
}

function DurationEditor({
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
      <span className="text-xs text-ink-light/60">→ {formatDuration(duration)}</span>
    </div>
  );
}

export function CustomActivityEditor({ data, onChange }: CustomActivityEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-ink-light">Title *</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="Activity name"
          className="mt-1 w-full rounded-md border border-washi-dark px-3 py-1.5 text-sm outline-none focus:border-indigo"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-ink-light">Location (optional)</label>
        <input
          type="text"
          value={data.location ?? ''}
          onChange={(e) => onChange({ ...data, location: e.target.value })}
          placeholder="Area or address"
          className="mt-1 w-full rounded-md border border-washi-dark px-3 py-1.5 text-sm outline-none focus:border-indigo"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-ink-light">When</label>
        <select
          value={data.timeSlot}
          onChange={(e) => onChange({ ...data, timeSlot: e.target.value as TimeSlot })}
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
          <DurationEditor
            duration={data.duration}
            onChange={(duration) => onChange({ ...data, duration })}
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-ink-light">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="What to expect, tips..."
          rows={3}
          className="mt-1 w-full resize-none rounded-md border border-washi-dark px-3 py-1.5 text-sm outline-none focus:border-indigo"
        />
      </div>
    </div>
  );
}

export function CustomActivityDisplay({ data }: { data: CustomActivity }) {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="font-serif text-lg font-semibold text-ink">
            {data.title || 'Untitled activity'}
          </h4>
          {data.location && (
            <p className="text-xs text-ink-light/60">{data.location}</p>
          )}
        </div>
        <div className="text-right text-xs text-ink-light/70">
          <p className="font-medium text-indigo">{data.timeSlot}</p>
          <p>{formatDuration(data.duration)}</p>
        </div>
      </div>
      {data.description && (
        <p className="mt-2 text-sm leading-relaxed text-ink-light">{data.description}</p>
      )}
      <span className="mt-2 inline-block rounded bg-indigo/10 px-2 py-0.5 text-xs text-indigo">
        Custom activity
      </span>
    </div>
  );
}
