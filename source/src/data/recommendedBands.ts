import type { TeamCalcBand } from './teamCalculators'

/**
 * THE "AGAINST THE GENERAL RECOMMENDED DOSE" TABLE ON EACH CROP CALCULATOR, D-320, 27 Oct 2026.
 *
 * Tahir, 27 Oct 2026 (multiple choice): keep today's figures on the crops already live ("Keep today's figures"), and show
 * no table for the 4 crops added that day ("No table for these 4": sugarcane February planting, hybrid rice, tomato,
 * strawberry). These are the figures the site printed up to D-319, read from the team's 24 Sep workbook. The V2 workbook's
 * SFRI Guide 2021 bands are imported into teamCalculators.ts for the engine report only and are not printed.
 * A crop not listed here shows no table. D-322, 27 Oct 2026: sunflower, mung and mash, and watermelon, taken live the same
 * day, are treated like the 4 and show none.
 */
export const RECOMMENDED_BANDS: Record<string, TeamCalcBand[]> = {
  'sugarcane-ratoon': [{"label": "Less fertile", "N": 150, "P": 90, "K": 65}, {"label": "Average Fertile", "N": 134, "P": 74, "K": 65}, {"label": "Very Fertile", "N": 113, "P": 60, "K": 49}],
  'cotton': [{"label": "Less fertile", "N": 119, "P": 69, "K": 50}, {"label": "Average Fertile", "N": 92, "P": 58, "K": 37}, {"label": "Very Fertile", "N": 75, "P": 46, "K": 25}],
  'maize': [{"label": "Less fertile", "N": 119, "P": 69, "K": 50}, {"label": "Average Fertile", "N": 92, "P": 58, "K": 37}, {"label": "Very Fertile", "N": 75, "P": 46, "K": 25}],
  'rice-basmati': [{"label": "Recommended", "N": 55, "P": 35, "K": 25}],
  'canola': [{"label": "Recommended", "N": 35, "P": 30, "K": 12}],
  'sesame': [{"label": "Recommended", "N": 34, "P": 23, "K": 12}],
  'chickpea': [{"label": "Recommended", "N": 13, "P": 34, "K": 12}],
  'lentil': [{"label": "Recommended", "N": 13, "P": 23, "K": 12}],
  'chili': [{"label": "Recommended", "N": 58, "P": 23, "K": 25}],
  'garlic': [{"label": "Recommended", "N": 64, "P": 46, "K": 25}],
  'citrus': [{"label": "Recommended", "N": 45, "P": 25, "K": 15}],
}
