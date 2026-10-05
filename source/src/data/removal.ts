/**
 * NUTRIENT REMOVAL — what a crop takes OUT of the field, per tonne of what is harvested.
 * Added 9 September 2026.
 *
 * The site argues, on its own knowledge pages, that Pakistan's soils are being mined: more is taken
 * out each season than is put back, and the deficit shows up in the 770,160-sample survey this site
 * publishes. That argument has always been national and abstract. These coefficients make it a
 * number about one field.
 *
 * WHERE THESE COME FROM — and they are not VAN's, which matters.
 *
 * Every figure below is from the IPNI nutrient uptake and removal tables (Table 4.1 total uptake,
 * Table 4.5 removal), metric edition dated 01/15, now hosted by Plant Nutrition Canada:
 *   https://plantnutrition.ca/wp-content/uploads/2022/12/Metric-4_1-4_5-0115.pdf
 * IPNI was dissolved in 2019 and its calculator is gone; these tables are the surviving artefact and
 * they are what most other published removal figures descend from. Each row was read off that PDF.
 *
 * They are a North-America-anchored compilation. IPNI's own footnote says so plainly: "Reported
 * nutrient removal coefficients may vary regionally depending on growing conditions. Use locally
 * available data whenever possible." THERE IS NO PAKISTANI EQUIVALENT ON THE PUBLIC RECORD. NFDC's
 * Fertilizer Review carries supply, offtake and price and no removal table; the volume that would
 * hold one — Fertilizers and Their Use in Pakistan, 3rd edition — is not downloadable. If VAN or
 * SFRI has Pakistani coefficients they should replace every row in this file, and the page says so.
 *
 * UNITS, AND THE TWO ERRORS THIS FILE EXISTS TO AVOID.
 *
 *   1. P is P₂O₅ and K is K₂O throughout — oxides, as IPNI publishes them and as the bags are
 *      labelled. Reading an oxide figure as elemental is a 2.29× error on phosphorus and 1.20× on
 *      potassium. Nothing here converts and nothing should.
 *   2. REMOVAL IS NOT UPTAKE. Removal is what physically leaves the field at harvest; uptake is
 *      what the whole plant accumulated, most of which is still standing in the residue. For rice
 *      the two differ by roughly seven times on potassium (3.6 kg/t leaves in the grain; ~24 is
 *      taken up). Both are given, separately, and never added.
 *
 * THE RESIDUE IS THE WHOLE STORY IN PUNJAB, and it is kept as its own row. Wheat straw is not left
 * on the field here — it is bhusa, it is fodder, it is sold — so on most Punjab farms the residue
 * leaves too, and the residue is where the potassium is. A grain-only figure describes a field whose
 * straw was ploughed back, which is not most of them.
 */

export type RemovalRow = {
  /** Crop slug on this site, or null where the row is a residue rather than a crop. */
  crop: string
  label: string
  /** What one tonne of this is measured as — the basis must never be assumed. */
  basis: string
  /** kg of nutrient per tonne, P as P₂O₅ and K as K₂O. */
  N: number
  P: number
  K: number
  S?: number
  kind: 'removal' | 'uptake'
  /**
   * The residue, expressed PER TONNE OF GRAIN — IPNI publishes these rows itself, which is the
   * whole reason this site can offer a straw figure at all. A straw:grain ratio is the parameter
   * that would otherwise have to be invented here, and inventing it is exactly what this project
   * does not do. IPNI did it, in the source, and the row is used as published.
   *
   * Only three of this site's crops have such a row (wheat, maize, sunflower). Rice straw and
   * potato haulm are published per tonne of THE RESIDUE and IPNI gives no per-tonne-of-grain
   * version, so those crops get no residue line rather than a derived one.
   */
  residue?: { label: string; basis: string; N: number; P: number; K: number; S?: number }
  source: string
  region: string
  /** IPNI's own row label, verbatim, so the figure can be found in the PDF. */
  verbatim: string
}

const IPNI = 'IPNI nutrient removal tables (metric, 01/15), hosted by Plant Nutrition Canada'

export const REMOVAL: RemovalRow[] = [
  {
    crop: 'wheat', label: 'Wheat', basis: 'tonne of grain',
    N: 19, P: 8.0, K: 4.8, S: 1.7, kind: 'removal',
    residue: { label: 'Wheat straw (bhusa)', basis: 'tonne of grain', N: 12, P: 2.7, K: 20, S: 2.3 },
    source: IPNI, region: 'North America', verbatim: 'Wheat (winter) grain / Wheat straw',
  },
  {
    crop: 'maize', label: 'Maize', basis: 'tonne of grain',
    N: 12, P: 6.3, K: 4.5, S: 1.4, kind: 'removal',
    residue: { label: 'Maize stover', basis: 'tonne of grain', N: 8.0, P: 2.9, K: 20, S: 1.3 },
    source: IPNI, region: 'North America', verbatim: 'Corn grain / Corn stover per t of grain',
  },
  {
    crop: 'rice-basmati', label: 'Rice (basmati)', basis: 'tonne of paddy',
    N: 13, P: 6.7, K: 3.6, kind: 'removal',
    source: IPNI, region: 'North America', verbatim: 'Rice grain',
  },
  {
    crop: 'rice-hybrid', label: 'Rice (hybrid)', basis: 'tonne of paddy',
    N: 13, P: 6.7, K: 3.6, kind: 'removal',
    source: IPNI, region: 'North America', verbatim: 'Rice grain',
  },
  {
    crop: 'sugarcane', label: 'Sugarcane', basis: 'tonne of cane',
    N: 1.0, P: 0.65, K: 1.8, kind: 'removal',
    source: IPNI, region: 'North America compilation', verbatim: 'Sugarcane',
  },
  {
    crop: 'sugarcane-ratoon', label: 'Sugarcane (ratoon)', basis: 'tonne of cane',
    N: 1.0, P: 0.65, K: 1.8, kind: 'removal',
    source: IPNI, region: 'North America compilation', verbatim: 'Sugarcane',
  },
  {
    crop: 'potato', label: 'Potato', basis: 'tonne of fresh tubers',
    N: 3.0, P: 1.5, K: 6.5, S: 0.3, kind: 'removal',
    source: IPNI, region: 'North America', verbatim: 'Potato tuber',
  },
  {
    crop: 'canola', label: 'Canola', basis: 'tonne of seed',
    N: 32, P: 16, K: 8.0, S: 5.0, kind: 'removal',
    source: IPNI, region: 'North America', verbatim: 'Canola grain',
  },
  {
    crop: 'sunflower', label: 'Sunflower', basis: 'tonne of seed',
    N: 27, P: 9.7, K: 9.0, S: 2.5, kind: 'removal',
    residue: { label: 'Sunflower stover', basis: 'tonne of grain', N: 28, P: 2.4, K: 41, S: 6.0 },
    source: IPNI, region: 'North America', verbatim: 'Sunflower grain / Sunflower stover per t of grain',
  },
  {
    crop: 'tomato', label: 'Tomato', basis: 'tonne of fresh fruit',
    N: 1.3, P: 0.46, K: 2.9, kind: 'removal',
    source: IPNI, region: 'North America', verbatim: 'Tomatoes',
  },
]

/**
 * Crops deliberately left without a removal figure, and why. This list is published, because on a
 * site that refuses to invent agronomy a visible gap is worth more than a plausible number.
 */
export const REMOVAL_GAPS: { crop: string; why: string }[] = [
  {
    crop: 'cotton',
    why: 'IPNI publishes cotton removal PER TONNE OF LINT, 64 kg N, 28 kg P₂O₅, 38 kg K₂O. A Pakistani grower weighs phutti, seed cotton, and lint is roughly a third of it, so applying that figure to a seed-cotton yield would overstate what the crop removes about threefold. No per-tonne-of-seed-cotton removal coefficient was found in any source. Rather than derive one, the figure is left out.',
  },
  { crop: 'chickpea', why: 'IPNI gives chickpea total UPTAKE from India (46 N, 8.4 P₂O₅, 50 K₂O per tonne) but no removal row. Uptake is not removal and the two are not interchangeable, so nothing is shown.' },
  { crop: 'onion', why: 'No credible removal coefficient found. The one source giving onion also gave the identical figures for tomato, chilli and potato, which is not real data.' },
  { crop: 'garlic', why: 'No credible removal coefficient found in any source.' },
  { crop: 'chili', why: 'The only per-tonne figures found are for greenhouse sweet pepper at about 600 to 760 maunds an acre, which is a different crop at a different yield. Not transferable.' },
  { crop: 'turmeric', why: 'No removal coefficient found.' },
  { crop: 'watermelon', why: 'No removal coefficient found.' },
  { crop: 'sesame', why: 'No removal coefficient found.' },
  { crop: 'soybean', why: 'No removal coefficient found on a basis matching this programme.' },
  { crop: 'lentil', why: 'No removal coefficient found.' },
  { crop: 'mungbean-mash', why: 'No removal coefficient found.' },
  { crop: 'banana-year1', why: 'Removal figures exist for banana but on a whole-bunch basis from Israeli intensive culture and Indian per-hectare data at stated yields. Neither is a per-tonne removal coefficient this programme can be read against.' },
  { crop: 'banana-year2', why: 'As banana year 1.' },
  { crop: 'citrus', why: 'Per-tonne removal figures exist for orange, tangerine, lemon and grapefruit from one commercial source (Israeli). They are not from an independent compilation and are not used.' },
  { crop: 'mango', why: 'A peer-reviewed Mexican study gives per-tonne removal for 3 cultivars, but the mango programme is published per tree, not per acre, so there is no per-acre supply figure to set it against.' },
  { crop: 'date-palm', why: 'No removal coefficient found. The programme is also age-banded, so a season balance would need the orchard\'s age and tree count.' },
  { crop: 'guava', why: 'No removal coefficient found.' },
  { crop: 'strawberry', why: 'No removal coefficient found.' },
]

export function removalFor(crop: string): RemovalRow | undefined {
  return REMOVAL.find(r => r.crop === crop)
}
export function removalGapFor(crop: string): string | undefined {
  return REMOVAL_GAPS.find(g => g.crop === crop)?.why
}

/**
 * TOTAL UPTAKE, kept separate and never added to removal. Shown only where the difference is the
 * point — rice, where seven times more potassium is taken up than leaves in the grain.
 */
export const UPTAKE: RemovalRow[] = [
  { crop: 'wheat', label: 'Wheat', basis: 'tonne of grain', N: 32, P: 11, K: 33, kind: 'uptake', source: IPNI, region: 'USA', verbatim: 'Wheat, winter USA' },
  { crop: 'maize', label: 'Maize', basis: 'tonne of grain', N: 18, P: 9.6, K: 25, kind: 'uptake', source: IPNI, region: 'USA', verbatim: 'Corn USA' },
  { crop: 'rice-basmati', label: 'Rice', basis: 'tonne of paddy', N: 16, P: 8.4, K: 24, kind: 'uptake', source: IPNI, region: 'USA', verbatim: 'Rice USA' },
  { crop: 'rice-hybrid', label: 'Rice', basis: 'tonne of paddy', N: 16, P: 8.4, K: 24, kind: 'uptake', source: IPNI, region: 'USA', verbatim: 'Rice USA' },
  { crop: 'sugarcane', label: 'Sugarcane', basis: 'tonne of cane', N: 1.8, P: 0.36, K: 2.1, kind: 'uptake', source: IPNI, region: 'China', verbatim: 'Sugarcane China' },
  { crop: 'canola', label: 'Canola', basis: 'tonne of seed', N: 43, P: 27, K: 87, kind: 'uptake', source: IPNI, region: 'China', verbatim: 'Canola China' },
  { crop: 'sunflower', label: 'Sunflower', basis: 'tonne of seed', N: 40, P: 25, K: 35, S: 5.0, kind: 'uptake', source: IPNI, region: 'Argentina', verbatim: 'Sunflower Argentina' },
  { crop: 'tomato', label: 'Tomato', basis: 'tonne of fresh fruit', N: 2.8, P: 1.3, K: 3.8, kind: 'uptake', source: IPNI, region: 'India', verbatim: 'Tomato India' },
]
export function uptakeFor(crop: string): RemovalRow | undefined {
  return UPTAKE.find(r => r.crop === crop)
}

export const REMOVAL_SOURCE = {
  name: 'IPNI nutrient uptake and removal tables, metric edition 01/15',
  host: 'Plant Nutrition Canada',
  url: 'https://plantnutrition.ca/wp-content/uploads/2022/12/Metric-4_1-4_5-0115.pdf',
  footnote: 'Reported nutrient removal coefficients may vary regionally depending on growing conditions. Use locally available data whenever possible.',
  pakistani: false,
} as const

/** One maund is 40 kilograms. The site works in maunds because Pakistani growers do. */
export const KG_PER_MAUND = 40
