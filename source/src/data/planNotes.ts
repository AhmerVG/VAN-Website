/**
 * D-151: crops whose page does NOT match the printed PDF on every row, and the sentence that says so.
 * Read by the crop page lead, the shopping-list lead, the nutrient balance source note and the crops
 * index, so the exception is stated wherever the page otherwise says "every figure is the published plan".
 *
 * sugarcane (February planting): owner's ruling 5 (D-137) put Green Phosphate 2 bags at land
 * preparation, from VAN's updated calculator. The PDF (plans/Sugarcane-Feb-Nutrition-Plan.pdf) still
 * prints Humi Grow there and is being reissued. Delete the entry once the reissued PDF is uploaded.
 */
export const PLAN_UPDATED_ROWS: Record<string, string> = {
  sugarcane: 'The land preparation row follows VAN’s updated calculator: Green Phosphate, 2 bags an acre. The published PDF still prints Humi Grow there and is being reissued.',
}

export const planUpdateNote = (slug: string): string | undefined => PLAN_UPDATED_ROWS[slug]
