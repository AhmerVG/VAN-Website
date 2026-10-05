// NOTE (8 Sep 2026): Fusion Potash's analysisPct here is NO LONGER the calculator's row. The
// calculator carries only K 50 / S 1.5 for that product; Tahir gave the full QC Lab composition
// directly — K2O 50, N 2, B 1, S 1.5, Mg 1 — and that is what is used below, because the QC Lab
// sheet is the higher authority. The calculator file itself still needs updating to match.
// Sourced 1:1 from F:\VAN Web APP\Fertilizer Calculator-Wheat-Potato.xlsx (extracted 8 Sep 2026) —
// the only two crops with a real, VAN-verified per-acre quantity + unit-price table. Do not extend this
// pattern to other crops by guessing prices; every number here traces back to that spreadsheet.
// NOTE: unit prices are as entered in that sheet — whether they are list, dealer or internal cost is an
// open question (flagged to Tahir 8 Sep). PKR totals are therefore not shown in the live UI yet.
export type CostRow = { product: string; slug: string | null; analysisPct: Record<string, number>; packKg: number; qtyPerAcre: number; unitPricePkr: number }

export const WHEAT_COST_PLAN: CostRow[] = [
  { product: "Vital Urea", slug: "vital-urea", analysisPct: {"N": 32, "S": 13}, packKg: 25, qtyPerAcre: 0.5, unitPricePkr: 6500 },
  { product: "Urea", slug: null, analysisPct: {"N": 46}, packKg: 50, qtyPerAcre: 2, unitPricePkr: 4895 },
  { product: "Green Phosphate", slug: "green-phosphate", analysisPct: {"N": 6, "P": 32}, packKg: 50, qtyPerAcre: 1, unitPricePkr: 16800 },
  { product: "Vital Potash", slug: "vital-potash", analysisPct: {"N": 11, "K": 44}, packKg: 20, qtyPerAcre: 0.5, unitPricePkr: 10500 },
  { product: "Fusion Potash", slug: "fusion-potash", analysisPct: {"N": 2, "K": 50, "S": 1.5, "B": 1, "Mg": 1}, packKg: 25, qtyPerAcre: 0.5, unitPricePkr: 11500 },
  { product: "VL-Potash", slug: "vl-potash-liquid", analysisPct: {"K": 30}, packKg: 1, qtyPerAcre: 2, unitPricePkr: 1250 },
  { product: "VL-Micromix", slug: "vl-micro-mix", analysisPct: {"Zn": 5, "Fe": 2, "Mn": 2, "Cu": 1}, packKg: 1, qtyPerAcre: 1, unitPricePkr: 1250 },
  { product: "VL-Boron", slug: "v-boron", analysisPct: {"B": 5}, packKg: 1, qtyPerAcre: 1, unitPricePkr: 1490 },
  { product: "V-Transform", slug: "v-transform", analysisPct: {"Zn": 21}, packKg: 3, qtyPerAcre: 1, unitPricePkr: 1975 },
  { product: "V-Mag Essential", slug: "v-mag-essential", analysisPct: {"Mg": 8.5, "B": 1}, packKg: 5, qtyPerAcre: 1, unitPricePkr: 1350 },
  { product: "Green Sulfur", slug: "green-sulfur", analysisPct: {"S": 70}, packKg: 1, qtyPerAcre: 2, unitPricePkr: 950 },
  { product: "Humi Grow", slug: "humi-grow", analysisPct: {"K": 7, "HA": 40}, packKg: 8, qtyPerAcre: 1, unitPricePkr: 2750 },
  { product: "Humi Grow Plus", slug: "humi-grow-plus", analysisPct: {"K": 3.5, "HA": 10}, packKg: 4, qtyPerAcre: 1, unitPricePkr: 1240 },
  { product: "Tornado", slug: "tornado", analysisPct: {"AA": 10}, packKg: 0.5, qtyPerAcre: 1, unitPricePkr: 795 },
]

export const POTATO_COST_PLAN: CostRow[] = [
  { product: "Vital Urea", slug: "vital-urea", analysisPct: {"N": 32, "S": 13}, packKg: 25, qtyPerAcre: 2, unitPricePkr: 6500 },
  { product: "Urea", slug: null, analysisPct: {"N": 46}, packKg: 50, qtyPerAcre: 2, unitPricePkr: 4895 },
  { product: "V. Ammonium Phosphate (V-Phosphate)", slug: "v-phosphate", analysisPct: {"N": 10, "P": 44}, packKg: 10, qtyPerAcre: 1.5, unitPricePkr: 7100 },
  { product: "CAN", slug: null, analysisPct: {"N": 26}, packKg: 50, qtyPerAcre: 2, unitPricePkr: 4395 },
  { product: "Green Phosphate", slug: "green-phosphate", analysisPct: {"N": 6, "P": 32}, packKg: 50, qtyPerAcre: 2, unitPricePkr: 16800 },
  { product: "Vital Potash", slug: "vital-potash", analysisPct: {"N": 11, "K": 44}, packKg: 20, qtyPerAcre: 2, unitPricePkr: 10500 },
  { product: "Fusion Potash", slug: "fusion-potash", analysisPct: {"N": 2, "K": 50, "S": 1.5, "B": 1, "Mg": 1}, packKg: 25, qtyPerAcre: 1, unitPricePkr: 11500 },
  { product: "VL-NPK (8:8:6)", slug: "vl-npk", analysisPct: {"N": 8, "P": 8, "K": 6}, packKg: 1, qtyPerAcre: 5, unitPricePkr: 1250 },
  { product: "VL-Boron", slug: "v-boron", analysisPct: {"B": 5}, packKg: 1, qtyPerAcre: 1, unitPricePkr: 1490 },
  { product: "V-Zinc 10%", slug: "v-zinc", analysisPct: {"Zn": 10}, packKg: 3, qtyPerAcre: 2, unitPricePkr: 1375 },
  { product: "Cala-Mag V", slug: "cala-mag-v", analysisPct: {"N": 10, "Ca": 6, "Mg": 4, "B": 1}, packKg: 1, qtyPerAcre: 8, unitPricePkr: 990 },
  { product: "V-Mag Essential", slug: "v-mag-essential", analysisPct: {"Mg": 8.5, "B": 1}, packKg: 5, qtyPerAcre: 2, unitPricePkr: 1350 },
  { product: "Green Sulfur", slug: "green-sulfur", analysisPct: {"S": 70}, packKg: 1, qtyPerAcre: 10, unitPricePkr: 950 },
  { product: "Humi Grow", slug: "humi-grow", analysisPct: {"K": 7, "HA": 40}, packKg: 8, qtyPerAcre: 1, unitPricePkr: 2750 },
  { product: "Humi Grow Plus", slug: "humi-grow-plus", analysisPct: {"K": 3.5, "HA": 10}, packKg: 4, qtyPerAcre: 2, unitPricePkr: 1240 },
]

/**
 * The full master product table from the same calculator, 8 Sep 2026 — every product with its
 * registered analysis and pack size. The two crop plans above only carry the products those crops
 * use; this is the whole line, and it is what the unit converter and the comparison table read.
 *
 * `slug` is null for commodity materials VAN does not brand (urea, DAP, MOP, SOP-as-traded, and the
 * CAN/SSP/TSP lines) — they appear in plans but have no VAN product page.
 * Prices are deliberately not carried here: whether the sheet's figures are delivered farmer prices
 * is still unconfirmed, so nothing on the public site can show them yet.
 * Fusion Potash uses the QC Lab composition, per the note at the top of this file.
 */
export type MasterProduct = { product: string; slug: string | null; analysisPct: Record<string, number>; packKg: number; packUnit?: PackUnit }

export const MASTER_PRODUCTS: MasterProduct[] = [
  { product: "Vital Urea", slug: "vital-urea", analysisPct: { N: 32, S: 13 }, packKg: 25 },
  { product: "V. Ammonium Phosphate (V-Phosphate)", slug: "v-phosphate", analysisPct: { N: 10, P: 44 }, packKg: 10 },
  { product: "Green Phosphate", slug: "green-phosphate", analysisPct: { N: 6, P: 32 }, packKg: 50 },
  { product: "Fusion Phosphate", slug: "fusion-phosphate", analysisPct: { P: 46 }, packKg: 50 },
  { product: "Vital Potash", slug: "vital-potash", analysisPct: { N: 11, K: 44 }, packKg: 20 },
  { product: "Fusion Potash", slug: "fusion-potash", analysisPct: { N: 2, K: 50, S: 1.5, B: 1, Mg: 1 }, packKg: 25 },
  { product: "V-Potash Plus", slug: "v-potash-plus", analysisPct: { N: 10, K: 40 }, packKg: 10 },
  { product: "VL-Potash", slug: "vl-potash-liquid", analysisPct: { K: 30 }, packKg: 1, packUnit: 'L' },
  { product: "Green Sulfur", slug: "green-sulfur", analysisPct: { S: 70 }, packKg: 20 },
  { product: "Humi Grow", slug: "humi-grow", analysisPct: { K: 7, HA: 40 }, packKg: 8 },
  { product: "Humi Grow Plus", slug: "humi-grow-plus", analysisPct: { K: 3.5, HA: 10 }, packKg: 4, packUnit: 'L' },
  { product: "V-Transform", slug: "v-transform", analysisPct: { Zn: 21 }, packKg: 3 },
  { product: "V-Zinc 10%", slug: "v-zinc", analysisPct: { Zn: 10 }, packKg: 3, packUnit: 'L' },
  { product: "VL-Boron", slug: "v-boron", analysisPct: { B: 5 }, packKg: 1, packUnit: 'L' },
  { product: "VL-Micromix", slug: "vl-micro-mix", analysisPct: { Zn: 5, Fe: 2, Mn: 2, Cu: 1 }, packKg: 1, packUnit: 'L' },
  { product: "VL-NPK (8:8:6)", slug: "vl-npk", analysisPct: { N: 8, P: 8, K: 6 }, packKg: 1, packUnit: 'L' },
  { product: "V-Mag Essential", slug: "v-mag-essential", analysisPct: { Mg: 8.5, B: 1 }, packKg: 5 },
  { product: "Cala-Mag V", slug: "cala-mag-v", analysisPct: { N: 10, Ca: 6, Mg: 4, B: 1 }, packKg: 1, packUnit: 'L' },
  { product: "V-Germinator Pro", slug: "v-germinator-pro", analysisPct: { N: 4.5, P: 27, K: 2, Mg: 0.5, S: 2, Fe: 0.5 }, packKg: 8 /* D-215: Fe, not Zn (Tahir 27 Sep 2026) */, packUnit: 'L' },
  // D-215, Tahir 27 Sep 2026: V-Compost is 1 grade, 20 kg, organic matter 25% + N 5% (the 8 Sep 2-record reading is withdrawn).
  { product: "V-Compost", slug: "v-compost", analysisPct: { N: 5, OM: 25 }, packKg: 20 },
  { product: "Tornado", slug: "tornado", analysisPct: { AA: 10 }, packKg: 0.5, packUnit: 'L' },
  { product: "Crop Force (15:15:15)", slug: "crop-force", analysisPct: { N: 15, P: 15, K: 15 }, packKg: 1 },
  { product: "Crop Force (12:12:18)", slug: "crop-force", analysisPct: { N: 12, P: 12, K: 18 }, packKg: 10 },
  { product: "SOP", slug: "sop", analysisPct: { K: 50 }, packKg: 25 },
  // Commodity materials — in the plans, no VAN product page.
  { product: "Urea", slug: null, analysisPct: { N: 46 }, packKg: 50 },
  { product: "DAP", slug: null, analysisPct: { N: 18, P: 46 }, packKg: 50 },
  { product: "MOP", slug: null, analysisPct: { K: 60 }, packKg: 50 },
  { product: "SSP", slug: null, analysisPct: { P: 18 }, packKg: 50 },
  { product: "TSP", slug: null, analysisPct: { P: 46 }, packKg: 50 },
  { product: "Ammonium Sulphate", slug: null, analysisPct: { N: 21, S: 24 }, packKg: 50 },
  { product: "Ammonium Phosphate", slug: null, analysisPct: { N: 12, P: 44 }, packKg: 10 },
  // D-191, Tahir 26 Sep 2026: no competitor brand names anywhere on the site. Generic CAN and NP 22-20,
  // with the generic analysis the team calculators already use for CAN. The branded record’s trace
  // figures (K 0.09, Ca 10, S 0.4) went with the name. Revert: the v60 zip.
  { product: "CAN", slug: null, analysisPct: { N: 26 }, packKg: 50 },
  { product: "NP 22-20", slug: null, analysisPct: { N: 22, P: 20 }, packKg: 50 },
]

/**
 * FARMER PRICES — 8 Sep 2026, rewritten after Tahir confirmed every disputed line.
 *
 * Source: "VAN Farmer Price List 11-20 August 2026 — Punjab Cash", Price Sheet Retail Customers,
 * signed by the CFO. Eighteen of the calculator's unit prices match that sheet to the rupee, which
 * settled the long-open question of whether the spreadsheet held list, dealer or internal figures.
 * They are the retail farmer price, cash, Punjab.
 *
 * TAHIR'S RULING ON PLACEMENT, 8 Sep 2026 — read this before putting a price anywhere:
 *   "We are not publishing a price list. Price is built into the site but only visible when someone
 *    wants to buy or calculate a plan. We are not publishing price under a brand name. I don't want
 *    price visible while people are moving through and searching and reading the website. It should
 *    be deep somewhere, and only visible when someone reaches the stage where the price is required."
 *
 * So: NO price on a product page, NO price on the products list, NO price in any heading, and
 * nothing a search engine can index as "VAN <product> price". Price appears only inside the plan
 * tools, after a farmer has built a plan, and only when they ask for it. The reveal is a CONDITIONAL
 * RENDER rather than a hidden element, so the figures are not in the page source, not in the
 * pre-rendered static HTML, and not in the DOM until the button is pressed.
 *
 * TIER 2 IS NEVER PRICED — Tahir's ruling, 8 Sep 2026, verbatim in substance:
 *   "We are not pricing any Tier 2 formulation at all. We are only pricing VAN brands, and only the
 *    ones a farmer can call up in a nutrition plan or that are linked to soil data or a plan. Tier 2
 *    is only for partners, distributors and companies to develop — pure business to business, not B2C."
 *
 * So a price exists in this file for exactly one class of thing: a VAN farmer brand that a farmer can
 * reach through a crop plan, a nutrition plan or the soil layer. The partner formulation library —
 * N-26L, N-24L, P-44L, PK-82, Nitro Sulfur and every other neutral code — is a B2B catalogue. Those
 * codes carry no price here, no price on their pages, and no route into the costing tools. Nitro
 * Sulfur is the worked example: it is on the farmer price sheet, and it is still not priced, because
 * it is a Tier 2 code and not a farmer brand.
 *
 * `assertFarmerBrandPricingOnly()` at the bottom of this file enforces it: the build fails if a price
 * is ever added for a slug that is not a farmer brand.
 *
 * TAHIR'S CONFIRMATIONS, 8 Sep 2026 — what changed in this file because of them:
 *   1. THE WEBSITE NAME IS THE REAL NAME. Gurilla, Crop Star, V-Magnesium Sulphate, V-Liquid Potash,
 *      V-Boron Liquid and VL Micro Mix are the old sheet's names. VL-NPK, Crop Force, V-Mag
 *      Essential, VL-Potash, VL-Boron and VL-Micromix are correct. The TRADE_NAME map is gone.
 *   2. THE LIQUID LINE IS SOLD BY THE LITRE, always. Pack units are litres for every liquid, and the
 *      sheet's litre prices therefore apply directly.
 *   3. V-Ammonium Phosphate IS V-Phosphate, and it is 10-44-0 with iron. The sheet's 12.44.0 is out
 *      of date; the site is right.
 *   4. V-Compost: the 8 Sep reading of 2 forms is withdrawn. Tahir, 27 Sep 2026 (D-215): 1 grade, 20 kg,
 *      organic matter 25% + N 5%.
 *   5. V-Mag Essential is Mg 8.5 + B 1. The sheet's bare "Magnesium Sulphate" is a loose description.
 *   6. GREEN SULFUR is 950 / 4,250 / 15,750. The sheet wins; the calculator's 790 was stale, and it
 *      has been corrected in both cost plans above.
 *   7. NITRO SULFUR does not go on the site. Not added.
 *   8. VIBRANT IS HUMI GROW PLUS. Same product, and the website's name and composition are correct.
 *
 * STILL UNCONFIRMED, so still carrying no price — see NO_PRICE_REASON:
 *   - Cal-Mag V: the sheet states B 1% that the product page does not, and gives no pack size at all.
 *   - Humi Grow Plus / Vibrant: the calculator says 4 L = 1,240, the sheet says 4 L = 2,050. Two of
 *     VAN's own files disagree, exactly as they did on Green Sulfur. Awaiting the same kind of ruling.
 *   - Fusion Phosphate, SOP: not on the farmer sheet at all.
 */
/**
 * 9 Sep 2026, Tahir: "Yes they are farmer delivered price, but remove the cash/punjab from price
 * list from site."
 *
 * So the QUALIFIER comes off what a reader sees. The provenance stays in this file, above, because
 * whoever maintains this needs to know which sheet the figures came from and in what window — but a
 * farmer in Sindh reading "Punjab, cash" beside a number reasonably concludes the price is not for
 * him, and that is not what VAN means. What he sees now is what Tahir says it is: the delivered
 * farmer price.
 *
 * Revert: label 'Farmer price · Punjab · cash', note '...cash, Punjab. Delivery to your district is
 * agreed on WhatsApp.'
 */
export const FARMER_PRICE_SOURCE = {
  label: 'Farmer price, delivered',
  window: '11–20 August 2026',
  note: 'VAN’s delivered farmer price. Confirm the current figure with your dealer or on WhatsApp before you order.',
}

export type PackUnit = 'kg' | 'L'
export type PackPrice = { size: number; unit: PackUnit; pricePkr: number }

/**
 * slug -> every pack VAN sells it in, with the farmer price for that pack. A slug absent from this
 * map, or a pack size absent from its list, shows no price and gives a reason instead.
 */
export const FARMER_PRICE: Record<string, PackPrice[]> = {
  // Nitrogen
  'vital-urea': [{ size: 25, unit: 'kg', pricePkr: 6500 }],
  // Phosphorus
  'green-phosphate': [{ size: 35, unit: 'kg', pricePkr: 12000 }, { size: 50, unit: 'kg', pricePkr: 16800 }],
  'v-phosphate': [{ size: 10, unit: 'kg', pricePkr: 7100 }],
  'fusion-phosphate': [{ size: 50, unit: 'kg', pricePkr: 15000 }],
  'v-germinator-pro': [{ size: 8, unit: 'L', pricePkr: 4550 }],
  // Potash
  'vital-potash': [{ size: 5, unit: 'kg', pricePkr: 2900 }, { size: 20, unit: 'kg', pricePkr: 10500 }],
  'fusion-potash': [{ size: 25, unit: 'kg', pricePkr: 11500 }],
  'v-potash-plus': [{ size: 10, unit: 'kg', pricePkr: 5000 }],
  'sop': [{ size: 25, unit: 'kg', pricePkr: 8000 }],
  'vl-potash-liquid': [
    { size: 1, unit: 'L', pricePkr: 1250 }, { size: 3, unit: 'L', pricePkr: 3000 },
    { size: 20, unit: 'L', pricePkr: 18500 }, { size: 200, unit: 'L', pricePkr: 175000 },
  ],
  // Sulfur
  'green-sulfur': [
    { size: 1, unit: 'kg', pricePkr: 950 }, { size: 5, unit: 'kg', pricePkr: 4250 },
    { size: 20, unit: 'kg', pricePkr: 15750 },
  ],
  // Micronutrients
  'v-transform': [{ size: 3, unit: 'kg', pricePkr: 1975 }],
  'v-zinc': [
    { size: 3, unit: 'L', pricePkr: 1375 }, { size: 20, unit: 'L', pricePkr: 6450 },
    { size: 200, unit: 'L', pricePkr: 55000 },
  ],
  'v-boron': [{ size: 1, unit: 'L', pricePkr: 1490 }, { size: 20, unit: 'L', pricePkr: 22000 }],
  'vl-micro-mix': [{ size: 1, unit: 'L', pricePkr: 1250 }, { size: 20, unit: 'L', pricePkr: 17500 }],
  'v-mag-essential': [{ size: 5, unit: 'kg', pricePkr: 1350 }],
  'cala-mag-v': [{ size: 1, unit: 'L', pricePkr: 990 }],
  // Compound
  'vl-npk': [{ size: 1, unit: 'L', pricePkr: 1250 }, { size: 20, unit: 'L', pricePkr: 17500 }],
  // 10 Sep 2026, Tahir: "price for Crop Force, 10 kg, 4900". This fills the zero that stood in the
  // calculator against Crop Force 12:12:18, which is the 10 kg grade.
  // TWO THINGS WORTH HIS EYE, neither resolved here:
  //  1. The crop plans call for Crop Force in 1 kg, 5 kg and 20 kg packs — never 10 kg. So this
  //     price does not reach any plan row, and THE 5 KG PACK IS STILL UNPRICED while being the
  //     one a plan actually asks for.
  //  2. Per kilogram this reads 750 (1 kg), 490 (10 kg), 575 (20 kg) — the 10 kg is cheaper per
  //     kilo than the 20 kg. That may be correct because they are different grades (15:15:15
  //     against 12:12:18), but it is the kind of ladder that is usually a typo, so it is flagged
  //     rather than smoothed over.
  // 10 Sep 2026, Tahir, answering the per-kilo inversion flagged below: 1 kg at 750, 10 kg at 490
  // per kg, and the 20 kg at 450 per kg — so 20 kg is 9,000, NOT the 11,500 that was here. The
  // ladder now falls the way a pack ladder should: 750 -> 490 -> 450 per kilogram.
  // READ THIS IF THE 20 KG LOOKS WRONG: his words were "no mmire a 20 kg pack is 450 per kg",
  // taken as the corrected rate rather than as removing the pack. One word from him flips it.
  // THE 10 KG PACK IS DELIBERATELY IN NO CROP PLAN. Flagged to Tahir that the plans call for
  // Crop Force at 1, 5 and 20 kg and never 10; his ruling 10 Sep: "dont worry, let it stay out
  // of plan." So the price sits here for a dealer or a direct enquiry and reaches no shopping
  // list. Do not 'fix' this by adding a 10 kg row to a plan.
  // STILL OPEN: the 5 kg pack has no price, and GARLIC is the one plan that asks for it (Soil
  // Amendment, 1 pack). That single line shows "ask on WhatsApp" instead of a figure.
  'crop-force': [{ size: 1, unit: 'kg', pricePkr: 750 }, { size: 10, unit: 'kg', pricePkr: 4900 }, { size: 20, unit: 'kg', pricePkr: 9000 }],
  // Organic and bio
  'humi-grow': [{ size: 8, unit: 'kg', pricePkr: 2750 }],
  // 4 L confirmed by Tahir 8 Sep — the calculator is right here and the sheet's 2,050 is not. The
  // 8 / 20 / 200 L packs are therefore NOT carried from the sheet either; only 4 L is confirmed.
  'humi-grow-plus': [{ size: 4, unit: 'L', pricePkr: 1240 }],
  'v-compost': [{ size: 20, unit: 'kg', pricePkr: 2300 }],
  'tornado': [{ size: 0.5, unit: 'L', pricePkr: 795 }],
}

/** The farmer price for one pack of a product, or undefined if VAN has not confirmed that pack. */
export function priceForPack(slug: string | null | undefined, size: number): PackPrice | undefined {
  if (!slug) return undefined
  return FARMER_PRICE[slug]?.find(p => Math.abs(p.size - size) < 0.01)
}

/** Why a line carries no price. Shown instead of a figure, so a gap is never mistaken for free. */
export const NO_PRICE_REASON: Record<string, string> = {
  'np-range': 'A new range. Price on request.',
}

/** Shown when the PRODUCT is priced but the PACK in the plan is not one VAN has confirmed. */
export const NO_PACK_PRICE_REASON =
  'This pack size is still being confirmed. Ask on WhatsApp and we will quote it.'

/**
 * TIER 2 GUARD. Every slug allowed to carry a farmer price — VAN farmer brands only, each reachable
 * from a crop plan, the nutrition creator or the soil layer. A partner formulation code must never
 * appear here. Adding a price for anything outside this set throws at module load, so it cannot ship.
 */
const FARMER_BRAND_SLUGS = new Set<string>([
  'vital-urea', 'green-phosphate', 'v-phosphate', 'v-germinator-pro', 'fusion-phosphate', 'np-range',
  'vital-potash', 'fusion-potash', 'v-potash-plus', 'vl-potash-liquid', 'sop',
  'green-sulfur', 'v-transform', 'v-zinc', 'v-boron', 'vl-micro-mix', 'v-mag-essential', 'cala-mag-v',
  'vl-npk', 'crop-force', 'humi-grow', 'humi-grow-plus', 'v-compost', 'tornado',
])

function assertFarmerBrandPricingOnly() {
  const stray = Object.keys(FARMER_PRICE).filter(s => !FARMER_BRAND_SLUGS.has(s))
  if (stray.length) {
    throw new Error(
      `Tier 2 pricing guard: ${stray.join(', ')} is not a VAN farmer brand. Partner formulation codes ` +
      `are B2B only and are never priced. Remove the price, or add the slug to FARMER_BRAND_SLUGS if ` +
      `it really is a farmer brand a farmer can reach from a plan.`
    )
  }
}
assertFarmerBrandPricingOnly()

/** True only for a VAN farmer brand. Any UI that might show a price must gate on this. */
export const isFarmerBrand = (slug: string | null | undefined) => !!slug && FARMER_BRAND_SLUGS.has(slug)
