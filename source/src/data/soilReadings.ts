// D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction
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
    share: { field: 'p_lt15', words: 'of samples had less than 15 ppm of available phosphorus, the lowest level that Punjab’s working thresholds rate as adequate' },
    crop: 'Inside the plant, phosphorus is used to move energy, and the plant needs it to grow roots. It affects how fast a seedling puts down roots, how many tillers wheat makes, and how well the crop sets and fills its grain. A phosphorus shortage harms the crop most in its first weeks, and phosphorus applied later cannot undo that harm.',
    groundLabel: 'What happens to phosphate in Punjab’s soil',
    ground: 'Punjab’s soil is calcareous: it is rich in calcium carbonate (lime). In calcareous soil, free calcium binds most of the phosphate applied as fertiliser before the roots can take it up.',
  },
  {
    key: 'k', name: 'Potassium',
    share: { field: 'k_lt180', words: 'of samples had less than 180 ppm of available potassium, which Punjab’s working thresholds rate as low' },
    crop: 'Potassium controls the movement of water and sugar in the plant: it moves sugar from the leaf to the grain, tuber or fruit. It affects crop quality, grain weight and tolerance of stress. When potassium is short, stems are weak, the crop lodges and grain is light.',
    groundLabel: 'Why Punjab’s soil is short of potassium',
// Tahir 7 Nov 2026 (CO-20): potash as K₂O, as on the Soil Atlas card.
    ground: 'In 2023, Pakistan applied 83 kg of nitrogen for every 1 kg of potash (as K₂O). Because so little potash is applied compared with what crops remove, crops take most of their potassium from the potassium already in the soil. In the survey, sandy loam had the least available potassium.',
  },
  {
    key: 'zn', name: 'Zinc',
    share: { field: 'zn_lt10', words: 'of samples had less than 1.0 ppm of zinc, which Punjab’s working thresholds rate as low' },
    crop: 'Zinc is needed to make the growth hormone that lengthens the stem and the enzymes that build protein. It affects plant height, leaf size and, in rice and wheat, grain set.',
    groundLabel: 'What happens to zinc in Punjab’s soil',
    ground: 'In Punjab’s alkaline soils, zinc is held in chemical forms that roots cannot take up, even when the total zinc in the soil is adequate. Across the survey, mean zinc falls from 1.45 to 1.20 ppm as pH rises. A heavy phosphate dose makes a zinc shortage worse.',
  },
  {
    key: 'b', name: 'Boron',
    share: { field: 'b_lt05', words: 'of samples had less than 0.5 ppm of boron, which Punjab’s working thresholds rate as low' },
    crop: 'Boron builds the cell wall together with calcium and carries sugar to the flower. It affects pollination, seed set and fruit set. When a cotton boll, a sunflower head or a rice panicle sets badly, boron shortage is often the cause.',
    groundLabel: 'Why boron is dosed carefully',
    ground: 'The difference between enough boron and too much boron is small, which is why VAN coats boron onto its potash granules rather than relying only on a separate loose dose.',
  },
  {
    key: 'ph', name: 'pH',
    share: { field: 'ph_gt75', words: 'of samples had a pH above 7.5' },
    extra: 'Only 979 of the 770,160 samples were below neutral (pH 7).',
    crop: 'pH is not a nutrient, but it decides how much of several nutrients the root can take up. Phosphorus applied to high-pH soil combines with calcium into forms the root cannot take up. Zinc, iron and manganese become less soluble as pH rises.',
    groundLabel: 'What high pH does to urea',
    ground: 'Above pH 8, part of the nitrogen from urea left on the soil surface is lost to the air as ammonia before the crop can use it.',
  },
  {
    key: 'om', name: 'Organic matter',
    share: { field: 'om_lt086', words: 'of samples had less than 0.86% organic matter, which Punjab’s working thresholds rate as low' },
    crop: 'Organic matter holds nutrients against leaching, buffers pH, feeds soil organisms and improves soil structure and water retention. Where organic matter is below 1%, very little of that buffering remains.',
    groundLabel: 'Why Punjab’s soil is short of organic matter',
    ground: 'Summers above 45 °C speed up decomposition, and crop residue is usually burned or fed to livestock rather than returned to the soil, so the soil’s carbon is used up faster than it is put back.',
  },
  {
    key: 'caco3', name: 'Calcium carbonate',
    medianHeadline: m => `Half of Punjab’s samples contain ${m} or more calcium carbonate.`,
    crop: 'Calcium carbonate is free lime in the soil. It is the reason the pH is high, and the high pH is the reason phosphate, zinc and iron become unavailable to the root.',
    groundLabel: 'How calcium carbonate rises with pH',
    noMedianLine: true,
    ground: 'Across the survey, mean calcium carbonate rises with every pH group: 3.41% at pH 7.0–7.5, 4.86% at 7.5–8.0, 6.91% at 8.0–8.5 and 7.41% at 8.5 and above.',
  },
  {
    key: 'ec', name: 'Salinity (EC)',
    share: { field: 'ec_gt4', words: 'of samples were saline, above 4 dS/m' },
    crop: 'On saline soil, salinity has to be dealt with before nutrition. Adding fertiliser adds salt to soil that already has too much of it.',
    groundLabel: 'What a saline field needs first',
    // D-313 (Tahir, 24 to 25 Oct 2026: "Don't talk about gypsum etc"): was 'A gypsum requirement worked out against its own
    // analysis, and enough water to leach the salt below the root zone, with drainage to take it away.'
    ground: 'It needs advice worked out from an analysis of its own soil, not a bag of fertiliser.',
  },
]
