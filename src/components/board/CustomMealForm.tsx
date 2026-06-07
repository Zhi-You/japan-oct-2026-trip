import type { CustomMeal } from '../../types/board';
import { MEAL_TYPES } from '../../types/board';

interface CustomMealEditorProps {
  data: CustomMeal;
  onChange: (data: CustomMeal) => void;
}

export function CustomMealEditor({ data, onChange }: CustomMealEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-ink-light">Name *</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Restaurant or dish"
          className="mt-1 w-full rounded-md border border-washi-dark px-3 py-1.5 text-sm outline-none focus:border-vermillion"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-ink-light">Location (optional)</label>
          <input
            type="text"
            value={data.location ?? ''}
            onChange={(e) => onChange({ ...data, location: e.target.value })}
            placeholder="Area"
            className="mt-1 w-full rounded-md border border-washi-dark px-3 py-1.5 text-sm outline-none focus:border-vermillion"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-light">Price</label>
          <input
            type="text"
            value={data.price}
            onChange={(e) => onChange({ ...data, price: e.target.value })}
            placeholder="e.g. ¥1,000–2,000"
            className="mt-1 w-full rounded-md border border-washi-dark px-3 py-1.5 text-sm outline-none focus:border-vermillion"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-ink-light">Meal type</label>
        <select
          value={data.meal}
          onChange={(e) =>
            onChange({ ...data, meal: e.target.value as CustomMeal['meal'] })
          }
          className="mt-1 w-full rounded-md border border-washi-dark px-3 py-1.5 text-sm outline-none focus:border-vermillion"
        >
          {MEAL_TYPES.map((m) => (
            <option key={m} value={m}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-ink-light">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Notes, what to order..."
          rows={3}
          className="mt-1 w-full resize-none rounded-md border border-washi-dark px-3 py-1.5 text-sm outline-none focus:border-vermillion"
        />
      </div>
    </div>
  );
}

export function CustomMealDisplay({ data }: { data: CustomMeal }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-ink">{data.name || 'Untitled meal'}</p>
        <span className="shrink-0 rounded bg-washi px-2 py-0.5 text-xs capitalize text-ink-light">
          {data.meal}
        </span>
      </div>
      <p className="mt-1 text-xs text-ink-light/70">
        {[data.location, data.price].filter(Boolean).join(' · ')}
      </p>
      {data.description && (
        <p className="mt-2 text-xs leading-relaxed text-ink-light">{data.description}</p>
      )}
      <span className="mt-2 inline-block rounded bg-vermillion/10 px-2 py-0.5 text-xs text-vermillion">
        Custom meal
      </span>
    </div>
  );
}
