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

Changes persist in this browser's **localStorage** automatically (same on localhost and after you deploy). Use **Export timeline** in Customize mode to back up or ship your layout.

### Deploying with your custom timeline (GitHub Pages, etc.)

1. In **Customize** mode, click **Export timeline** → saves `tokyo-itinerary-board.json`
2. Rename/copy it to `public/custom-board.json` in this repo
3. Run `npm run build` and deploy `dist/`

New visitors (or a fresh browser) load `custom-board.json` when there is no local save yet. Further edits still auto-save locally. Use **Import timeline** to restore a backup on another device.

Production builds already set `base` to `/japan-oct-2026-trip/` for GitHub project pages.

Use **Reset timeline** in Customize mode to restore the original itinerary.

## Day map

Each day has a **Show map / Hide map** button (View and Customize modes):

- Plots numbered pins for that day's timeline stops (OpenStreetMap via Leaflet — no API key)
- Dashed line shows visit order; click pins for details
- Side panel lists a **collapsed activity order** (number, title, location, time) while the map is open
- Custom cards plot when their location matches a known Tokyo area; otherwise they appear in the list with a warning
- Pokemon Center for the day appears as a ⚡ pin when configured

Pre-geocoded coordinates live in `src/data/locationCoordinates.ts` — extend this file to add new venues.


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
| Shibuya Sky (5 Oct sunset) | **21 Sep 2026, 00:00 JST** (14 days ahead) |
| Nikko tour (6 Oct) | 2–4 weeks before |
| Fuji highway bus (2 Oct) | 1–2 weeks before |
| Tokyo National Museum | Anytime online |

## External tools

- [Mt Fuji visibility forecast](https://isfujivisible.com/)
- [Shibuya Sky tickets](https://www.shibuya-scramble-square.com/sky/)
- [Pokemon Center Staff Voice (lotteries)](https://voice.pokemon.co.jp/stv/)
