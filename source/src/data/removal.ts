// D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction
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
    residue: { label: 'Wheat straw (bhoosa)', basis: 'tonne of grain', N: 12, P: 2.7, K: 20, S: 2.3 },
    source: IPNI, region: 'North America', verbatim: 'Wheat (winter) grain / Wheat straw',
  },
  {
    crop: 'maize', label: 'Maize', basis: 'tonne of grain',
    N: 12, P: 6.3, K: 4.5, S: 1.4, kind: 'removal',
    residue: { label: 'Maize stalks (stover)', basis: 'tonne of grain', N: 8.0, P: 2.9, K: 20, S: 1.3 },
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
    residue: { label: 'Sunflower stalks (stover)', basis: 'tonne of grain', N: 28, P: 2.4, K: 41, S: 6.0 },
    source: IPNI, region: 'North America', verbatim: 'Sunflower grain / Sunflower stover per t of grain',
  },
  {
    crop: 'tomato', label: 'Tomato', basis: 'tonne of fresh fruit',
    N: 1.3, P: 0.46, K: 2.9, kind: 'removal',
    source: IPNI, region: 'North America', verbatim: 'Tomatoes',
  },
]

// L1 7 Nov 2026 (crops-a 21, 22): the ruled term "taken out in the harvested crop" replaces "removal" in these notes, IPNI is
// written out at first use, and "maunds per acre" replaces "maunds an acre". No figure or source is changed.
const BANANA_GAP = 'The figures found for the nutrients taken out in harvested banana are either per whole bunch, from intensive cultivation in (A Territory Excluded per Passport Directive), or per hectare at stated yields, from India. Neither gives a figure per tonne of fruit that can be compared with this plan.'

/**
 * Crops deliberately left without a removal figure, and why. This list is published, because on a
 * site that refuses to invent agronomy a visible gap is worth more than a plausible number.
 */
export const REMOVAL_GAPS: { crop: string; why: string }[] = [
  {
    crop: 'cotton',
    why: 'IPNI (the International Plant Nutrition Institute) gives the nutrients taken out in cotton per tonne of lint: 64 kg N, 28 kg P₂O₅, 38 kg K₂O. Pakistani growers measure their yield as phutti (seed cotton), and lint is about 1/3 of the weight of phutti. Applying the per-tonne-of-lint figures to a phutti yield would therefore give a figure about 3 times too high. No such figure per tonne of seed cotton was found in any source.',
  },
  // Tahir 10 Nov 2026 (CR-N16): the chickpea uptake figures are per tonne of grain.
  { crop: 'chickpea', why: 'IPNI (the International Plant Nutrition Institute) gives only the total uptake of chickpea, from India: 46 kg of nitrogen (N), 8.4 kg of P₂O₅ and 50 kg of K₂O per tonne of grain. It does not give the amount taken out in the harvested crop, which is a different measure.' },
  { crop: 'onion', why: 'No reliable figure for the nutrients taken out in the harvested crop was found. The only source with figures for onion gave identical figures for tomato, chili and potato, so they were not treated as reliable.' },
  { crop: 'garlic', why: 'No reliable figure for the nutrients taken out in the harvested crop was found in any source.' },
  { crop: 'chili', why: 'The only per-tonne figures found are for greenhouse sweet pepper yielding about 600 to 760 maunds per acre. That is a different crop at a different yield, so the figures are not used here.' },
  { crop: 'turmeric', why: 'No published figure was found for the nutrients taken out in the harvested crop.' },
  { crop: 'watermelon', why: 'No published figure was found for the nutrients taken out in the harvested crop.' },
  { crop: 'sesame', why: 'No published figure was found for the nutrients taken out in the harvested crop.' },
  { crop: 'soybean', why: 'No published figure for the nutrients taken out in the harvested crop was found that matches this plan.' },
  { crop: 'lentil', why: 'No published figure was found for the nutrients taken out in the harvested crop.' },
  { crop: 'mungbean-mash', why: 'No published figure was found for the nutrients taken out in the harvested crop.' },
  { crop: 'banana-year1', why: BANANA_GAP },
  { crop: 'banana-year2', why: BANANA_GAP },
  { crop: 'citrus', why: 'Per-tonne figures for the nutrients taken out in harvested orange, tangerine, lemon and grapefruit come from 1 commercial source in (A Territory Excluded per Passport Directive), not from an independent compilation, so they are not used here.' },
  { crop: 'mango', why: 'A peer-reviewed Mexican study gives per-tonne figures for the nutrients taken out in the harvested fruit of 3 cultivars, but the main doses of the mango plan are set per plant, not per acre, so the 2 cannot be compared without the number of trees and the yield per acre.' },
  { crop: 'date-palm', why: 'No published figure was found for the nutrients taken out in the harvested crop. The plan is also set by orchard age, so comparing the nutrients applied with the nutrients taken out would need the orchard’s age and tree count.' },
  { crop: 'guava', why: 'No published figure was found for the nutrients taken out in the harvested crop.' },
  { crop: 'strawberry', why: 'No published figure was found for the nutrients taken out in the harvested crop.' },
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
