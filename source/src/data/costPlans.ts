import { WHEAT_COST_PLAN, POTATO_COST_PLAN, type CostRow } from './pricing'
import { TEAM_CALCULATORS } from './teamCalculators'

/**
 * EVERY CROP WITH A LIVE CALCULATOR, IN ONE PLACE. D-144, 25 Sep 2026, owner's ruling 1.
 *
 * D-102 named two places a new crop is added when its calculator lands: `COST_PLANS` in planRange.ts
 * and `PLANS` in the nutrition creator. Both now read this registry, so a crop gains the creator, the
 * cost panel, the D-77 range check and its place at the front of the crop lists in one move.
 *
 * Wheat and potato keep their reviewed cost plans (Fertilizer Calculator-Wheat-Potato.xlsx, identical
 * in the 24 Sep workbook). The other crops come from the team's 24 Sep workbook through
 * tools/import-team-calculator.py, which reads it with openpyxl, takes every analysis and pack from
 * the site, never reads a price, and skips any crop that fails a check. Its report is
 * tools/team-calculator-import-report.txt.
 *
 * Revert: set this to `{ wheat: WHEAT_COST_PLAN, potato: POTATO_COST_PLAN }` and the site is exactly
 * as it was before D-144, apart from the crop-list order, which reads `LIVE_CALC_CROPS`.
 */
/**
 * D-151: team calculators imported but NOT live, each waiting on an answer from VAN's team. The crop
 * falls back to its published plan, exactly like a crop with no calculator (no creator, no "Live
 * calculator" tag, no place at the front of the lists).
 *   citrus: the sheet's V-Mag Essential is 0.16 bag (2 x 400 g foliar); the published plan has 1 bag
 *           plus the 2 x 400 g, so the sheet looks partial. Waiting for the team's answer.
 * Revert: remove the slug from this list.
 */
export const TEAM_CALC_WAITING: Record<string, string> = {
  citrus: "V-Mag Essential 0.16 bag on the team sheet against 1.16 in the published plan; the sheet looks to carry only the 2 x 400 g foliar part. Waiting for the team's answer.",
}

export const COST_PLANS: Record<string, CostRow[]> = {
  wheat: WHEAT_COST_PLAN,
  potato: POTATO_COST_PLAN,
  ...Object.fromEntries(Object.entries(TEAM_CALCULATORS).filter(([slug]) => !(slug in TEAM_CALC_WAITING)).map(([slug, c]) => [slug, c.rows as CostRow[]])),
}

/** Crop slugs with a live calculator, wheat and potato first, then the team's in import order. */
export const LIVE_CALC_CROPS: string[] = Object.keys(COST_PLANS)

export const hasCalculator = (cropSlug: string): boolean => cropSlug in COST_PLANS

/** Where each crop's calculator came from, for the page's own source line. */
export const calculatorSource = (cropSlug: string): 'wheat-potato' | 'team' | null =>
  cropSlug === 'wheat' || cropSlug === 'potato' ? 'wheat-potato' : cropSlug in TEAM_CALCULATORS ? 'team' : null

/**
 * Put the crops with a live calculator first, in LIVE_CALC_CROPS order, and keep every other crop in
 * the order it already had. Used by the crops index, the home crop picker and the menu search.
 */
export function liveFirst<T>(items: T[], slugOf: (t: T) => string): T[] {
  const rank = (t: T) => { const i = LIVE_CALC_CROPS.indexOf(slugOf(t)); return i < 0 ? Infinity : i }
  return items.map((t, i) => ({ t, i })).sort((a, b) => (rank(a.t) - rank(b.t)) || (a.i - b.i)).map(x => x.t)
}
