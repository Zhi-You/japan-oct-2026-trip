# Tokyo Autumn Journey — Trip Itinerary Website

Interactive itinerary for a 4-person Tokyo trip (1–8 October 2026).

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The static site is output to `dist/` — deploy to Netlify, Vercel, GitHub Pages, or any static host.

## Customizable planner

The **Itinerary** section has a **View / Customize** toggle:

- **Drag & drop** — reorder activity and meal cards within each day (⠿ handle)
- **Insert cards** — add custom activities or meals between any cards (or at top/bottom)
- **Custom activity fields** — title, location, when (Morning → Night enum), duration range (min–max in hrs/mins), description
- **Custom meal fields** — name, location, price, meal type (breakfast/lunch/dinner), description
- **Per-card notes** — click 📝 on the right column to expand a collapsible comment (saved per card)
- **Delete** — remove any card with a confirmation dialog

Changes persist in `localStorage` automatically. Use **Reset timeline** in Customize mode to restore the original itinerary.


```
src/
  i18n/
    index.ts              # i18next setup — add locales here
    locales/en/common.json # UI labels (nav, buttons)
  data/
    itinerary.en.ts       # Full itinerary content (English)
  types/
    itinerary.ts          # Shared TypeScript types
  components/             # UI components
```

### Adding languages later

1. Copy `src/data/itinerary.en.ts` → `itinerary.ja.ts` (translate content)
2. Add `src/i18n/locales/ja/common.json`
3. Register in `src/i18n/index.ts`
4. Update `getItinerary()` in `itinerary.en.ts` to switch on locale

## Key booking deadlines

| Item | Action by |
|------|-----------|
| Shibuya Sky (5 Oct sunset) | **7 Sep 2026, 00:00 JST** |
| Nikko tour (6 Oct) | 2–4 weeks before |
| Fuji highway bus (2 Oct) | 1–2 weeks before |
| Tokyo National Museum | Anytime online |

## External tools

- [Mt Fuji visibility forecast](https://isfujivisible.com/)
- [Shibuya Sky tickets](https://www.shibuya-scramble-square.com/sky/)
- [Pokemon Center Staff Voice (lotteries)](https://voice.pokemon.co.jp/stv/)
