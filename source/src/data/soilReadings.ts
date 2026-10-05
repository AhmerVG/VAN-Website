import type { AnalyteKey } from '@/lib/soil'

/**
 * THE "READING IT" PANEL, ONE PER MAP READING — D-243, 1 Oct 2026.
 *
 * Tahir: "the side text panel should be a label specific panel, not a generic panel, it should tell the
 * story and state of nutrients and how it is linked to productivity, or whatever is relevant for people
 * to decode what is shown in the map."
 *
 * NOTHING NEW IS CLAIMED HERE. Every sentence is either a survey figure (filled in by the panel from
 * SOIL and SOIL_MEDIANS, never typed here) or copy the site already publishes, carried across word for
 * word or trimmed:
 *   crop    : nutrients.ts `job` / `short` (P, K, Zn, B); rebuilt.ts soil-and-sustainability paras (pH, OM)
 *   ground  : soilLens.ts SOIL_MECHANISMS and SOIL_RELATIONS; nutrients.ts `partners`; rebuilt.ts;
 *             soilProductMap.ts SOIL_ADVISORIES (EC)
 * The headline is the finding with its number in it (his say-the-point rule); `share` names which
 * Punjab working-threshold share it reads, and `headline` writes it.
 */
export type SoilReading = {
  key: AnalyteKey
  name: string
  /** Province share field on BandStats, and the words after the percentage. */
  share?: { field: 'p_lt15' | 'k_lt180' | 'zn_lt10' | 'b_lt05' | 'ph_gt75' | 'om_lt086' | 'ec_gt4'; words: string }
  /** Headline when there is no share (calcium carbonate): built from the median. */
  medianHeadline?: (median: string) => string
  extra?: string
  crop: string
  /** The heading over `ground`, worded for the reading. */
  groundLabel: string
  ground: string
  /** Skip the 'half read below the median' sentence when the headline already says it. */
  noMedianLine?: boolean
}

export const SOIL_READINGS: SoilReading[] = [
  {
    key: 'p', name: 'Phosphorus',
    share: { field: 'p_lt15', words: 'of samples are below 15 ppm, the adequate level' },
    crop: 'Phosphorus carries energy inside the plant and builds the root. It decides how fast a seedling puts down roots, how many tillers wheat makes, and how well the crop sets and fills. Most of the damage is done in the first weeks and cannot be undone later.',
    groundLabel: 'What Punjab’s ground does to it',
    ground: 'Calcareous soil binds phosphate with free calcium and takes most of it back before the root arrives.',
  },
  {
    key: 'k', name: 'Potash',
    share: { field: 'k_lt180', words: 'of samples are below 180 ppm of potash' },
    crop: 'Potash runs the plant’s plumbing: it moves sugar from the leaf to the grain, tuber or fruit. It is the nutrient of quality, weight and stress. Short of it, stems are weak, the crop lodges and grain is light.',
    groundLabel: 'Why Punjab runs short',
    ground: 'Pakistan applies 83 kg of nitrogen for every 1 kg of potash, so the crop draws potash from the soil’s own reserve. Sandy loam holds the least.',
  },
  {
    key: 'zn', name: 'Zinc',
    share: { field: 'zn_lt10', words: 'of samples are below 1.0 ppm of zinc' },
    crop: 'Zinc makes the growth hormone that lengthens the stem and the enzymes that build protein. It decides plant height, leaf size and, in rice and wheat, grain set.',
    groundLabel: 'What Punjab’s ground does to it',
    ground: 'In Punjab’s alkaline, high-pH soils, zinc is chemically fixed, making it unavailable to roots even when total soil zinc is adequate. Across the survey, average zinc falls as pH rises, 1.45 to 1.20 ppm. Piling on phosphate makes a zinc shortage worse.',
  },
  {
    key: 'b', name: 'Boron',
    share: { field: 'b_lt05', words: 'of samples are below 0.5 ppm of boron' },
    crop: 'Boron builds the cell wall with calcium and carries sugar to the flower. It decides pollination, seed set and fruit set. A cotton boll, a sunflower head or a rice panicle that sets badly is often a boron story.',
    groundLabel: 'Why it is dosed carefully',
    ground: 'The gap between enough boron and too much boron is narrow, which is why VAN puts it on the potash granule as a coating rather than as a loose dose.',
  },
  {
    key: 'ph', name: 'pH',
    share: { field: 'ph_gt75', words: 'of samples are above pH 7.5' },
    extra: 'Only 979 of 770,160 samples read below neutral.',
    crop: 'pH is not a nutrient. It decides how much of several nutrients the root can actually take. Phosphorus applied to high-pH soil turns with calcium into forms the root cannot reach. Zinc, iron and manganese get less soluble as pH rises.',
    groundLabel: 'What it does to urea',
    ground: 'Above pH 8, surface urea leaves as ammonia before the crop can use it.',
  },
  {
    key: 'om', name: 'Organic matter',
    share: { field: 'om_lt086', words: 'of samples are below 0.86% organic matter' },
    crop: 'Organic matter holds nutrients against leaching, buffers pH, feeds soil biology and improves structure and water retention. At under 1% there is very little of that buffering left.',
    groundLabel: 'Why Punjab runs short',
    ground: 'Summers above 45 °C speed up decomposition, and crop residue is generally burned or fed to livestock rather than returned, so the soil’s carbon is used up faster than it is put back.',
  },
  {
    key: 'caco3', name: 'Calcium carbonate',
    medianHeadline: m => `Half of Punjab’s samples carry ${m} or more calcium carbonate.`,
    crop: 'Calcium carbonate is free lime in the soil. It is why the pH is high, and the high pH is why phosphate, zinc and iron are locked away from the root.',
    groundLabel: 'How it rises as the soil turns alkaline',
    noMedianLine: true,
    ground: 'Across the survey, average carbonate rises with every pH band: 3.41, 4.86, 6.91, 7.41%.',
  },
  {
    key: 'ec', name: 'Salinity (EC)',
    share: { field: 'ec_gt4', words: 'of samples are saline, above 4 dS/m' },
    crop: 'On saline ground this is a salinity problem before it is a nutrition problem. Adding fertilizer adds salt to ground that already has too much of it.',
    groundLabel: 'What a saline field needs first',
    ground: 'A gypsum requirement worked out against its own analysis, and enough water to leach the salt below the root zone, with drainage to take it away.',
  },
]
