import { useEffect, useState } from 'react'
import { STATIONS } from '@/data/climate'
import { WHEAT } from '@/data/site'
import { CROP_PLANS, type PlanRow } from '@/data/catalogue'
import { cropBySlug, parseSowing, inWindow, MONTHS_LONG } from '@/lib/season'

/**
 * THE SOWING DATE — block 01 of the crop page, added 9 Sep 2026.
 *
 * One question at the top of the crop page, and it orders everything below it. This is the answer to
 * the crowding problem Tahir named: a crop page carries four tools (the programme, the shopping
 * list, the soil adjustment, the discipline simulator) and a farmer should not have to choose
 * between them. He answers one question he certainly knows — when did you sow — and the page works
 * out which of them is live for him today.
 *
 * TWO RULES THIS FILE ENFORCES, both of them his standing rules applied to a new tool:
 *
 * 1. IT IMPROVES THE PAGE, IT NEVER GATES IT. Skip it, refuse it, or arrive from a search engine and
 *    the page is exactly the page it was before — every rate, every quantity, every method still
 *    there, in the same order. Nothing is behind this input.
 *
 * 2. A STAGE IS ONLY EVER CLAIMED WHERE VAN HAS PUBLISHED ONE. Wheat has a real stage table on
 *    van.com.pk — five stages with days-after-sowing ranges — so wheat gets a stage. The other 27
 *    programmes have stage NAMES but no published durations, and wheat's durations are wheat's:
 *    telling a cotton grower he is in "grand growth" on day 46 because wheat is would be inventing
 *    agronomy, which is the one thing this project does not do. So those crops get what is real —
 *    days since sowing, and whether that date sits inside VAN's own published sowing window — and
 *    the page says why the stage line is absent.
 *
 * The stage model below is DERIVED from the published table rather than retyped, so it cannot drift
 * away from what the page itself prints two blocks further down.
 */

/* ── What the farmer answered ─────────────────────────────────────────────────────────────────── */

export type Sowing =
  | { kind: 'date'; iso: string }
  | { kind: 'not-sown' }
  | { kind: 'unknown' }

const KEY = (crop: string) => `van.sown.${crop}`
const listeners = new Set<() => void>()

function read(crop: string): Sowing | null {
  try {
    const raw = localStorage.getItem(KEY(crop))
    if (!raw) return null
    if (raw === 'not-sown' || raw === 'unknown') return { kind: raw }
    return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? { kind: 'date', iso: raw } : null
  } catch { return null }
}

export function setSowing(crop: string, v: Sowing | null) {
  try {
    if (v === null) localStorage.removeItem(KEY(crop))
    else localStorage.setItem(KEY(crop), v.kind === 'date' ? v.iso : v.kind)
  } catch { /* private mode or blocked storage. The answer still works for this render */ }
  for (const fn of listeners) fn()
}

/**
 * Deliberately starts at `null` on first render and reads storage in an effect, rather than reading
 * storage in a lazy initialiser. The site ships as pre-rendered HTML: an initialiser that read
 * storage would make the first client render disagree with the HTML that was built, and the
 * pre-rendered page would flicker. Starting empty means the built HTML and the first render are the
 * same page, and a remembered date arrives a frame later.
 */
export function useSowing(crop: string): [Sowing | null, (v: Sowing | null) => void] {
  const [v, setV] = useState<Sowing | null>(null)
  useEffect(() => {
    const sync = () => setV(read(crop))
    sync()
    listeners.add(sync)
    return () => { listeners.delete(sync) }
  }, [crop])
  return [v, (next: Sowing | null) => { setSowing(crop, next); setV(next) }]
}

/* ── Dates ────────────────────────────────────────────────────────────────────────────────────── */

/** Midnight local, so a date typed today is day 0 and not day −1 in the evening. */
function atMidnight(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()) }
export function parseIso(iso: string): Date | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return isNaN(d.getTime()) ? null : d
}
export function todayIso(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
export function daysAfterSowing(iso: string, now = new Date()): number | null {
  const s = parseIso(iso)
  if (!s) return null
  return Math.round((atMidnight(now).getTime() - atMidnight(s).getTime()) / 86400000)
}
export function addDays(iso: string, days: number): string | null {
  const s = parseIso(iso)
  if (!s) return null
  const d = new Date(s.getFullYear(), s.getMonth(), s.getDate() + days)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
export function prettyDate(iso: string): string {
  const d = parseIso(iso)
  return d ? `${d.getDate()} ${MONTHS_LONG[d.getMonth()].slice(0, 3)} ${d.getFullYear()}` : iso
}

/* ── The published sowing window ──────────────────────────────────────────────────────────────── */

/**
 * VAN publishes a sowing window per crop, as months ("Oct–Nov sowing"). A month is all the precision
 * there is, so this reports the month verdict and nothing finer: in the window, or how many whole
 * months outside it. It never converts a month boundary into a day count, because that number would
 * look measured and would not be.
 */
export type WindowCheck = { inWindow: boolean; label: string; monthsOut: number; direction: 'early' | 'late' | null }

export function windowCheck(cropSlugKey: string, iso: string): WindowCheck | null {
  const crop = cropBySlug(cropSlugKey)
  const d = parseIso(iso)
  if (!crop || !d) return null
  const windows = parseSowing(crop.sowing)
  if (!windows.length) return null
  const m = d.getMonth()
  const label = windows.map(w => w.start === w.end ? MONTHS_LONG[w.start] : `${MONTHS_LONG[w.start]}–${MONTHS_LONG[w.end]}`).join(' or ')
  if (windows.some(w => inWindow(w, m))) return { inWindow: true, label, monthsOut: 0, direction: null }
  // Nearest edge, measured around the 12-month circle so December and January are one month apart.
  let best = 12, dir: 'early' | 'late' = 'late'
  for (const w of windows) {
    const before = ((w.start - m) + 12) % 12   // months until the window opens
    const after = ((m - w.end) + 12) % 12      // months since it closed
    if (before < best) { best = before; dir = 'early' }
    if (after < best) { best = after; dir = 'late' }
  }
  return { inWindow: false, label, monthsOut: best, direction: dir }
}

/* ── The stage model ──────────────────────────────────────────────────────────────────────────── */

export type StageSpan = {
  stage: string
  from: number
  to: number | null
  events: string
  /** Position in the PUBLISHED table, 1-based. Land Preparation is stage 1 there even though it has
   *  no days-after-sowing, so numbering from the growth stages alone would have the page telling a
   *  farmer he is in "stage 3 of 4" while the table two blocks below numbers the same stage 4 of 5. */
  published: number
  publishedTotal: number
}

/**
 * Wheat's five stages, read out of the table this same page prints ("GDD, days after sowing, and the
 * calendar for 3 sowing dates"). Derived, not retyped: correct the published table and this
 * moves with it. Land Preparation carries "Before sowing" and is not a span in days, so it is not in
 * the model — a field being prepared has no days-after-sowing.
 */
function spansFromPublished(rows: { stage: string; das: string; events: string }[]): StageSpan[] {
  const out: StageSpan[] = []
  rows.forEach((r, i) => {
    const m = r.das.match(/^(\d+)\s*[–-]\s*(\d+)(\+)?$/)
    if (!m) return                         // "Before sowing". A management stage, not a growth stage
    out.push({ stage: r.stage, from: Number(m[1]), to: /\+/.test(r.das) ? null : Number(m[2]), events: r.events, published: i + 1, publishedTotal: rows.length })
  })
  // The published ranges share their endpoints (0–10, 10–25, 25–50): day 10 appears twice. Read the
  // upper bound as the day the NEXT stage opens, so a day belongs to exactly one stage.
  return out.map((s, i) => ({ ...s, to: i === out.length - 1 ? null : out[i + 1].from }))
}

export const STAGE_MODEL: Record<string, StageSpan[]> = {
  wheat: spansFromPublished(WHEAT.gdd),
}

export function hasStageModel(cropSlugKey: string) { return STAGE_MODEL[cropSlugKey] !== undefined }

export type StageNow = {
  stage: string
  /** 1-based position in the published table, so it reads the same as the table further down. */
  index: number
  total: number
  das: number
  dayInStage: number
  events: string
  /** Days-after-sowing on which the next stage opens, and its name. Null once the last stage is open. */
  nextAt: number | null
  next: string | null
  /** The season has run past the last published stage — the crop is at or past maturity. */
  past: boolean
}

/**
 * D-177, 26 Sep 2026 · Tahir: "Fix it from the site's own degree-day column." The published table put
 * grain formation at 50 to 120 days after sowing and called day 120 maturity. The same table's degree-day
 * column (base 10 °C; 150, 450, 900, 1,400) fits real Punjab wheat, the days column did not. For wheat the
 * stage now comes from degree days accumulated from the grower's own sowing date on the Lahore 1991-2020
 * normals (PMD via NOAA, data/climate.ts), daily values interpolated between mid-month normals, daily
 * degree days = midpoint of max and min less 10. A normal year, not this season's weather.
 * Revert: drop the sowIso argument at the caller.
 */
const WHEAT_GDD = [0, 150, 450, 900, 1400]
function lerpMonthly(arr: number[], d: Date): number {
  const y = d.getFullYear()
  const anchors: [number, number][] = []
  for (const yy of [y - 1, y, y + 1]) for (let m = 0; m < 12; m++) anchors.push([Date.UTC(yy, m, 15), arr[m]])
  const t = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
  for (let i = 0; i < anchors.length - 1; i++) {
    const [a, va] = anchors[i], [b, vb] = anchors[i + 1]
    if (t >= a && t < b) return va + (vb - va) * (t - a) / (b - a)
  }
  return arr[d.getMonth()]
}
/** Days after sowing at which wheat reaches each degree-day boundary, for this sowing date. */
export function wheatStageDays(sowIso: string): number[] | null {
  const d0 = parseIso(sowIso)
  if (!d0) return null
  const st = STATIONS.LAHORE
  const out: number[] = [0]
  let acc = 0, day = 0
  const d = new Date(d0)
  while (out.length < WHEAT_GDD.length && day < 400) {
    acc += Math.max(0, (lerpMonthly(st.tmax, d) + lerpMonthly(st.tmin, d)) / 2 - 10)
    day++
    d.setDate(d.getDate() + 1)
    if (acc >= WHEAT_GDD[out.length]) out.push(day)
  }
  return out.length === WHEAT_GDD.length ? out : null
}

export function stageNow(cropSlugKey: string, das: number, sowIso?: string): StageNow | null {
  if (cropSlugKey === 'wheat' && sowIso) {
    const days = wheatStageDays(sowIso)
    const base = STAGE_MODEL.wheat
    if (days && base.length === 4) {
      const model = base.map((s, i) => ({ ...s, from: days[i], to: i < 3 ? days[i + 1] : null }))
      const last = model[3]
      if (das >= days[4]) return { stage: last.stage, index: last.published, total: last.publishedTotal, das, dayInStage: das - last.from, events: last.events, nextAt: null, next: null, past: true }
      for (let i = 0; i < model.length; i++) {
        const s = model[i], end = s.to ?? Infinity
        if (das >= s.from && das < end) return { stage: s.stage, index: s.published, total: s.publishedTotal, das, dayInStage: das - s.from, events: s.events, nextAt: model[i + 1]?.from ?? null, next: model[i + 1]?.stage ?? null, past: false }
      }
    }
  }
  const model = STAGE_MODEL[cropSlugKey]
  if (!model || das < 0) return null
  const last = model[model.length - 1]
  // The published table ends "50–120 DAS"; the `+` marks the open end of the GDD column, not of the
  // calendar. Past 120 days the crop is at or past maturity and the page says so rather than holding
  // it in "grain formation" for ever.
  const lastPublishedEnd = 120
  if (das > lastPublishedEnd) {
    return { stage: last.stage, index: last.published, total: last.publishedTotal, das, dayInStage: das - last.from, events: last.events, nextAt: null, next: null, past: true }
  }
  for (let i = 0; i < model.length; i++) {
    const s = model[i]
    const end = s.to ?? Infinity
    if (das >= s.from && das < end) {
      return { stage: s.stage, index: s.published, total: s.publishedTotal, das, dayInStage: das - s.from, events: s.events, nextAt: model[i + 1]?.from ?? null, next: model[i + 1]?.stage ?? null, past: false }
    }
  }
  return null
}

/** The rows of the published plan that belong to a stage — what is actually due, not a reminder. */
export function rowsDue(cropSlugKey: string, stage: string): PlanRow[] {
  const cp = CROP_PLANS[cropSlugKey]
  if (!cp) return []
  return cp.plan.filter(r => r.stage.toLowerCase() === stage.toLowerCase())
}
