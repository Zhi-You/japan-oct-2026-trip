import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import itinerary from '../src/data/itinerary.zh.ts';
import board from '../public/custom-board.json';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'exports');

const NOTE_ZH: Record<string, string> = {
  'Pick up Suica/Pasmo at the airport for seamless transit':
    '在机场领取 Suica/Pasmo，方便乘车',
  'Optional - alr chosen ichiran': '可选 — 已选定一兰',
  'Combini for breakfast': '便利店当早餐',
  optional: '可选',
  'or somewhere nearby. Can be OTOT since this is a last min addition by AI':
    '或附近其他店。这是最后加的，可自行决定。',
  'OPTIONAL if tired or if it is already 2pm+ after lunch, since we need to enter shibuya sky around 4-430pm.\nOtherwise just shop around shibuya!':
    '若疲惫或午餐后已过下午2点则可选（需约16:00–16:30进涩谷SKY）。否则就在涩谷逛街！',
  'Unagi! Might be preferred by bobbimenz': '鳗鱼！Bobbimenz 可能更喜欢',
  'Pack rain jacket': '带雨衣',
  'Optional (if chosen Soba then no need this)': '可选（若已选荞麦面则不必）',
};

const URGENCY: Record<string, string> = {
  critical: '立刻预订',
  high: '尽快预订',
  medium: '建议预订',
};

const TICKET: Record<string, string> = {
  advance_required: '必须提前预订',
  advance_recommended: '建议提前预订',
  walk_in: '可现场',
  lottery: '抽签 / 限量',
  free: '免费入场',
};

const INTENSITY: Record<string, string> = {
  light: '轻松',
  moderate: '适中',
  full: '满日',
};

const MEAL: Record<string, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '小吃',
};

function esc(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function noteText(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  return NOTE_ZH[trimmed] ?? NOTE_ZH[raw] ?? trimmed;
}

function boardNote(dayId: string, cardId: string): string {
  const raw = board.days[dayId as keyof typeof board.days]?.notes?.[cardId]?.text ?? '';
  return noteText(raw);
}

function noteBox(text: string): string {
  if (!text) return '';
  return `<div class="group-note">组内备注：${esc(text)}</div>`;
}

function list(items: string[]): string {
  if (!items.length) return '';
  return `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
}

const html: string[] = [];

html.push(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>${esc(itinerary.meta.title)} · 行程手册</title>
<style>
  @page { size: A4; margin: 16mm 14mm 18mm; }
  * { box-sizing: border-box; }
  body {
    font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif;
    color: #1a1a2e;
    font-size: 11pt;
    line-height: 1.55;
    margin: 0;
  }
  h1 { font-size: 26pt; margin: 0 0 6px; }
  h2 { font-size: 16pt; border-bottom: 2px solid #c62828; padding-bottom: 4px; margin: 28px 0 12px; page-break-after: avoid; }
  h3 { font-size: 13pt; margin: 16px 0 8px; color: #283593; page-break-after: avoid; }
  h4 { font-size: 11.5pt; margin: 12px 0 4px; page-break-after: avoid; }
  .cover { text-align: center; padding: 40px 0 20px; border-bottom: 4px solid #c62828; }
  .sub { color: #555; font-size: 13pt; }
  .meta { margin-top: 18px; text-align: left; background: #f5f0e6; padding: 14px 16px; border-radius: 8px; }
  .badge { display: inline-block; background: #c62828; color: #fff; font-size: 9pt; padding: 1px 7px; border-radius: 4px; margin-right: 4px; }
  .badge.high { background: #b8860b; }
  .badge.medium { background: #283593; }
  table { width: 100%; border-collapse: collapse; font-size: 10pt; margin: 8px 0 14px; }
  th, td { border: 1px solid #d8d0c0; padding: 6px 7px; vertical-align: top; }
  th { background: #283593; color: #fff; text-align: left; }
  tr { page-break-inside: avoid; }
  .card { border: 1px solid #e8dfd0; border-radius: 8px; padding: 10px 12px; margin: 8px 0; page-break-inside: avoid; background: #fffdf8; }
  .card.meal { border-left: 4px solid #c62828; }
  .card.place { border-left: 4px solid #283593; }
  .card.flight { border-left: 4px solid #b8860b; }
  .card.pc { border-left: 4px solid #558b2f; }
  .muted { color: #666; font-size: 10pt; }
  .group-note { background: #fff3cd; border: 1px solid #e0c36a; padding: 6px 8px; margin-top: 6px; border-radius: 4px; font-size: 10pt; }
  .day { page-break-before: always; }
  .day:first-of-type { page-break-before: auto; }
  ul { margin: 4px 0 8px 18px; padding: 0; }
  a { color: #283593; word-break: break-all; }
  .toc a { text-decoration: none; }
  footer.note { font-size: 9pt; color: #777; margin-top: 24px; }
</style>
</head>
<body>
<div class="cover">
  <p class="muted">四人同行 · 仅公共交通 · 浅草为基地</p>
  <h1>${esc(itinerary.meta.title)}</h1>
  <p class="sub">${esc(itinerary.meta.subtitle)}</p>
  <p><strong>${esc(itinerary.meta.dates)}</strong> · ${esc(itinerary.meta.travellers)}</p>
  <div class="meta">
    <p><strong>住宿：</strong>${esc(itinerary.meta.baseArea)}</p>
    <p>${esc(itinerary.meta.groupNote)}</p>
    <p class="muted">交通：JR山手线、东京地铁、京成线与高速巴士。Suica/Pasmo 几乎可用于所有电车和多数巴士。不需要租车。10月7日晚转住成田机场附近。</p>
  </div>
</div>
`);

html.push(`<h2>目录</h2><ol class="toc">
<li>十月的东京</li><li>提前预订清单</li><li>分日行程（含组内备注）</li>
<li>宝可梦中心与卡牌</li><li>美食一览</li><li>备选方案与加项</li>
</ol>`);

html.push(`<h2>十月的东京</h2>${list(itinerary.seasonNotes)}`);

html.push(`<h2>提前预订清单</h2>
<p class="muted">时间均为日本时间（JST）。错过可能打乱行程。</p>
<table>
<thead><tr><th>事项</th><th>何时预订</th><th>紧急度</th><th>说明</th></tr></thead>
<tbody>`);
for (const b of itinerary.bookingChecklist) {
  html.push(`<tr>
    <td><strong>${esc(b.item)}</strong>${b.link ? `<br/><a href="${esc(b.link)}">${esc(b.link)}</a>` : ''}</td>
    <td>${esc(b.deadline)}</td>
    <td><span class="badge ${b.urgency}">${URGENCY[b.urgency] ?? b.urgency}</span></td>
    <td>${esc(b.notes)}</td>
  </tr>`);
}
html.push(`</tbody></table>`);

for (const day of itinerary.days) {
  html.push(`<section class="day">
    <h2>${esc(day.date)} ${esc(day.weekday)} · ${esc(day.title)}</h2>
    <p><strong>主题：</strong>${esc(day.theme)}　<strong>地区：</strong>${esc(day.area)}　<strong>节奏：</strong>${INTENSITY[day.intensity] ?? day.intensity}${day.weatherNote ? `　<strong>天气：</strong>${esc(day.weatherNote)}` : ''}</p>
  `);

  const flights = day.flightTimeline ?? [];
  const renderFlights = () => {
    for (const item of flights) {
      if (item.kind === 'flight') {
        const f = item.flight;
        const n = boardNote(day.id, f.id);
        html.push(`<div class="card flight">
          <h4>航班 ${esc(f.airline)} ${esc(f.flightNumber)}${f.aircraft ? ` · ${esc(f.aircraft)}` : ''}</h4>
          <p>${esc(f.departure.airportCode)} ${esc(f.departure.airportName)}${f.departure.terminal ? ` ${esc(f.departure.terminal)}` : ''} ${esc(f.departure.time)}${f.departure.dateLabel ? `（${esc(f.departure.dateLabel)}）` : ''}
          → ${esc(f.arrival.airportCode)} ${esc(f.arrival.airportName)}${f.arrival.terminal ? ` ${esc(f.arrival.terminal)}` : ''} ${esc(f.arrival.time)}${f.arrival.dateLabel ? `（${esc(f.arrival.dateLabel)}）` : ''}</p>
          <p class="muted">时长 ${esc(f.duration)}${f.note ? ` · ${esc(f.note)}` : ''}</p>
          ${noteBox(n)}
        </div>`);
      } else {
        const p = item.process;
        const n = boardNote(day.id, p.id);
        html.push(`<div class="card flight">
          <h4>${p.type === 'departure' ? '出发流程' : '落地流程'} · ${esc(p.airportCode)} ${esc(p.airportName)}</h4>
          <p>${p.terminal ? esc(p.terminal) + ' · ' : ''}${esc(p.time)} · 约 ${p.durationMinutes} 分钟</p>
          ${noteBox(n)}
        </div>`);
      }
    }
  };

  if (!day.flightTimelineAfterPlaces) renderFlights();

  if (day.pokemonCenter) {
    const n = boardNote(day.id, `${day.id}-pokemon-center`);
    html.push(`<div class="card pc">
      <h4>宝可梦中心 · ${esc(day.pokemonCenter.name)}</h4>
      <p>开门 ${esc(day.pokemonCenter.openTime)} · ${esc(day.pokemonCenter.note)}</p>
      ${noteBox(n)}
    </div>`);
  }

  day.places.forEach((place, idx) => {
    const n = boardNote(day.id, place.id);
    html.push(`<div class="card place">
      <h4>${idx + 1}. ${esc(place.name)} <span class="muted">· ${esc(place.area)} · ${esc(place.category)}</span></h4>
      <p class="muted">${esc(place.timeSlot)} · ${esc(place.duration)}</p>
      <p>${esc(place.summary)}</p>
      ${place.highlights.length ? `<p><strong>亮点</strong></p>${list(place.highlights)}` : ''}
      ${place.tips.length ? `<p><strong>提示</strong></p>${list(place.tips)}` : ''}
      ${place.ticket ? `<p><strong>门票：</strong>${TICKET[place.ticket.type] ?? place.ticket.type} — ${esc(place.ticket.detail)}</p>` : ''}
      ${place.photoNote ? `<p><strong>拍照：</strong>${esc(place.photoNote)}</p>` : ''}
      ${place.paceNote ? `<p><strong>节奏：</strong>${esc(place.paceNote)}</p>` : ''}
      ${noteBox(n)}
    </div>`);
  });

  day.food.forEach((meal, index) => {
    const n = boardNote(day.id, `${day.id}-meal-${index}`);
    html.push(`<div class="card meal">
      <h4>${MEAL[meal.meal] ?? meal.meal} · ${esc(meal.name)}</h4>
      <p class="muted">${esc(meal.area)} · ${esc(meal.cuisine)} · ${esc(meal.priceRange)}${meal.rating ? ` · ${esc(meal.rating)}` : ''}</p>
      ${meal.note ? `<p>${esc(meal.note)}</p>` : ''}
      ${noteBox(n)}
    </div>`);
  });

  if (day.id === 'day-8') {
    html.push(`<div class="card meal">
      <h4>早餐 · Hotel Breakfast</h4>
      <p class="muted">成田东横INN · 自定义 · Free</p>
      <p>酒店早餐（已加入时间线）。</p>
    </div>`);
  }

  if (day.flightTimelineAfterPlaces) renderFlights();

  if (day.transport.length) {
    html.push(`<h3>交通</h3>${list(day.transport)}`);
  }
  if (day.dayTips.length) {
    html.push(`<h3>当日备注</h3>${list(day.dayTips)}`);
  }
  html.push(`</section>`);
}

html.push(`<h2>宝可梦中心与卡牌</h2>
<h3>策略</h3>${list(itinerary.pokemonStrategy)}
<h3>分日宝可梦中心</h3>`);
for (const pc of itinerary.pokemonCenters) {
  html.push(`<div class="card pc">
    <h4>${esc(pc.name)}</h4>
    <p><strong>${esc(pc.assignedDay)}</strong></p>
    <p>${esc(pc.location)} · ${esc(pc.hours)} · ${esc(pc.nearestStation)}</p>
    <p>${esc(pc.tcgNote)}</p>
  </div>`);
}
html.push(`<h3>秋叶原卡牌店（第7天）</h3>`);
for (const shop of itinerary.tcgShops) {
  html.push(`<div class="card">
    <h4>${esc(shop.name)}</h4>
    <p class="muted">${esc(shop.location)} · ${esc(shop.hours)}</p>
    <p>${esc(shop.note)}</p>
  </div>`);
}

html.push(`<h2>美食一览</h2>
<table><thead><tr><th>日</th><th>餐</th><th>店名</th><th>地区 / 类型</th><th>价格</th></tr></thead><tbody>`);
for (const day of itinerary.days) {
  for (const meal of day.food) {
    html.push(`<tr>
      <td>${esc(day.date)} ${esc(day.title)}</td>
      <td>${MEAL[meal.meal] ?? meal.meal}</td>
      <td>${esc(meal.name)}</td>
      <td>${esc(meal.area)} · ${esc(meal.cuisine)}</td>
      <td>${esc(meal.priceRange)}</td>
    </tr>`);
  }
}
html.push(`<tr><td>10月8日 返程</td><td>早餐</td><td>Hotel Breakfast</td><td>成田东横INN</td><td>Free</td></tr>`);
html.push(`</tbody></table>`);

html.push(`<h2>备选方案</h2>`);
for (const bp of itinerary.backupPlans) {
  html.push(`<div class="card"><h4>${esc(bp.scenario)}</h4><p>${esc(bp.action)}</p></div>`);
}
html.push(`<h2>可选加项</h2><p class="muted">来自收藏清单 — 优先级较低，未排进核心日程。</p>`);
for (const place of itinerary.recommendedExtras) {
  html.push(`<div class="card place">
    <h4>${esc(place.name)} <span class="muted">· ${esc(place.area)}</span></h4>
    <p class="muted">${esc(place.timeSlot)} · ${esc(place.duration)}</p>
    <p>${esc(place.summary)}</p>
    ${list(place.tips)}
    ${place.ticket ? `<p><strong>门票：</strong>${TICKET[place.ticket.type] ?? ''} — ${esc(place.ticket.detail)}</p>` : ''}
  </div>`);
}

html.push(`<footer class="note">
  本手册由行程网站中文内容导出，并附上已发布时间线中的组内备注。互动地图、拖拽排序、语言/主题切换无法放入 PDF。现场请尽量用 Suica 与 Google 地图导航。
</footer>
</body></html>`);

mkdirSync(outDir, { recursive: true });
const htmlPath = join(outDir, 'tokyo-autumn-2026-zh.html');
writeFileSync(htmlPath, html.join('\n'), 'utf8');
console.log(htmlPath);
