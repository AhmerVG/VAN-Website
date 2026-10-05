import type { CropWaterModel } from '@/lib/water'

/**
 * FAO-56 CROP PARAMETERS — Table 11 (stage lengths) and Table 12 (crop coefficients).
 * Added 9 September 2026. Every figure was read off FAO's own published tables:
 *   https://www.fao.org/4/x0490e/x0490e0b.htm
 *
 * A crop is here ONLY IF FAO PRINTS BOTH PIECES for it. That is a harder test than it sounds, and
 * it is why this list has six crops rather than twenty-eight:
 *
 *   Table 12 leaves Kc_ini as a DASH for several crops — spring wheat, maize, potato, dry onion
 *   among them — because for those the initial coefficient depends on how often the soil surface is
 *   wetted, and FAO expects it to be read off a figure with the irrigation interval and the
 *   reference ET in hand. It is not a number FAO publishes, so it is not a number to be assumed.
 *
 *   Table 11 has no row at all for canola or chickpea, and its wheat rows for our region sit under
 *   "Barley/Oats/Wheat", which pairs with Table 12's SPRING wheat entry — the dashed one. Pakistani
 *   wheat is a 120-day November crop, not an overwintering dormant one, so borrowing winter wheat's
 *   printed 0.7 would be pairing a stage table with the wrong coefficient row.
 *
 * SO WHEAT — the crop that matters most here — HAS NO COMPLETE FAO MODEL, and the page says so
 * rather than filling the gap. What it can still show for wheat is real: reference evapotranspiration
 * and normal rainfall across the season, both computed, and FAO's printed Kc_mid of 1.15 as what the
 * crop draws at peak. The missing piece is named, along with what would close it.
 *
 * REGIONS ARE PRINTED, ALWAYS. Cotton's row names Pakistan outright. Rice's is "Tropics", tomato's
 * "Arid Region", sunflower's "Medit.; California". A farmer is entitled to know which.
 */

export const CROP_WATER: CropWaterModel[] = [
  {
    crop: 'cotton', label: 'Cotton',
    lengths: [30, 50, 60, 55],
    kc: { ini: 0.35, mid: 1.175, end: 0.60 },
    table11: 'Cotton · 30 / 50 / 60 / 55 = 195 days · planted Mar–May',
    table12: 'Cotton · Kc ini 0.35 · Kc mid 1.15–1.20 · Kc end 0.70–0.50',
    region: 'Egypt; Pakistan; California. The only row in FAO’s table that names Pakistan',
  },
  {
    crop: 'rice-basmati', label: 'Rice (basmati)',
    lengths: [30, 30, 60, 30],
    kc: { ini: 1.05, mid: 1.20, end: 0.75 },
    table11: 'Rice · 30 / 30 / 60 / 30 = 150 days · planted Dec; May',
    table12: 'Rice · Kc ini 1.05 · Kc mid 1.20 · Kc end 0.90–0.60',
    region: 'Tropics; Mediterranean',
  },
  {
    crop: 'rice-hybrid', label: 'Rice (hybrid)',
    lengths: [30, 30, 60, 30],
    kc: { ini: 1.05, mid: 1.20, end: 0.75 },
    table11: 'Rice · 30 / 30 / 60 / 30 = 150 days · planted Dec; May',
    table12: 'Rice · Kc ini 1.05 · Kc mid 1.20 · Kc end 0.90–0.60',
    region: 'Tropics; Mediterranean',
  },
  {
    crop: 'sugarcane', label: 'Sugarcane (plant crop)',
    lengths: [35, 60, 190, 120],
    kc: { ini: 0.40, mid: 1.25, end: 0.75 },
    table11: 'Sugarcane, virgin · 35 / 60 / 190 / 120 = 405 days',
    table12: 'Sugar Cane · Kc ini 0.40 · Kc mid 1.25 · Kc end 0.75',
    region: 'Low Latitudes. Punjab is subtropical, not low-latitude, so this row is the nearest FAO offers rather than a match',
  },
  {
    crop: 'sugarcane-ratoon', label: 'Sugarcane (ratoon)',
    lengths: [25, 70, 135, 50],
    kc: { ini: 0.40, mid: 1.25, end: 0.75 },
    table11: 'Sugarcane, ratoon · 25 / 70 / 135 / 50 = 280 days',
    table12: 'Sugar Cane · Kc ini 0.40 · Kc mid 1.25 · Kc end 0.75',
    region: 'Low Latitudes. See the note on the plant crop',
  },
  {
    crop: 'tomato', label: 'Tomato',
    lengths: [30, 40, 40, 25],
    kc: { ini: 0.60, mid: 1.15, end: 0.80 },
    table11: 'Tomato · 30 / 40 / 40 / 25 = 135 days · planted January',
    table12: 'Tomato · Kc ini 0.6 · Kc mid 1.15 · Kc end 0.70–0.90',
    region: 'Arid Region',
  },
  {
    crop: 'sunflower', label: 'Sunflower',
    lengths: [25, 35, 45, 25],
    kc: { ini: 0.35, mid: 1.075, end: 0.35 },
    table11: 'Sunflower · 25 / 35 / 45 / 25 = 130 days · planted April/May',
    table12: 'Sunflower · Kc ini 0.35 · Kc mid 1.0–1.15 · Kc end 0.35',
    region: 'Mediterranean; California',
  },
]

export function waterModelFor(crop: string): CropWaterModel | undefined {
  return CROP_WATER.find(c => c.crop === crop)
}

/**
 * Why a crop has no complete model. Printed on that crop's page instead of a number — the gap is
 * FAO's, not this site's, and saying which piece is missing is more use than a plausible figure.
 */
export const WATER_GAPS: Record<string, string> = {
  wheat: 'FAO tabulates the stage lengths for a November wheat crop in this region (15 / 25 / 50 / 30 = 120 days, Central India) but leaves the initial crop coefficient as a dash for spring-type wheat, because it depends on how often the soil surface is wetted. Punjab wheat is sown in November and harvested in April, not an overwintering dormant crop, so the printed winter-wheat coefficient belongs to a different crop cycle and is not borrowed here. FAO does print the mid-season coefficient: 1.15.',
  maize: 'FAO tabulates the stage lengths (20 / 35 / 40 / 30 = 125 days for an October crop in dry, cool India) but leaves the initial crop coefficient as a dash. FAO does print the mid-season coefficient: 1.20.',
  potato: 'FAO tabulates the stage lengths for a January or November crop in a semi-arid climate (25 / 30 / 30–45 / 30) but leaves the initial crop coefficient as a dash. FAO does print the mid-season coefficient: 1.15.',
  onion: 'FAO tabulates the stage lengths for an arid-region crop (20 / 35 / 110 / 45 = 210 days) but leaves the initial crop coefficient as a dash. FAO does print the mid-season coefficient: 1.05.',
  canola: 'FAO prints crop coefficients for rapeseed and canola (Kc ini 0.35, mid 1.0–1.15, end 0.35) but Table 11 carries no stage lengths for it at all, so there is no season to spread them over.',
  chickpea: 'FAO prints crop coefficients for chick pea (Kc ini 0.4, mid 1.00, end 0.35) but Table 11 carries no chickpea row, so there is no season to spread them over.',
  lentil: 'FAO tabulates the stage lengths for an October–November lentil crop in an arid region (25 / 35 / 70 / 40 = 170 days) but leaves the initial crop coefficient as a dash. FAO does print the mid-season coefficient: 1.10.',
}
/** The mid-season coefficient FAO does print, for crops with no complete model. */
export const KC_MID_ONLY: Record<string, number> = { wheat: 1.15, maize: 1.20, potato: 1.15, onion: 1.05, canola: 1.075, chickpea: 1.00, lentil: 1.10 }

export const WATER_SOURCE = {
  paper: 'FAO Irrigation and Drainage Paper 56. Crop evapotranspiration',
  url: 'https://www.fao.org/4/x0490e/x0490e0b.htm',
  tables: 'Table 11 (lengths of crop development stages) and Table 12 (single crop coefficients)',
  kcCaption: 'Single (time-averaged) crop coefficients, Kc, and mean maximum plant heights for non stressed, well-managed crops in subhumid climates (RHmin ≈ 45%, u2 ≈ 2 m/s) for use with the FAO Penman-Monteith ETo.',
} as const
