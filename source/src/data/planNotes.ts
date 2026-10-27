// D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction
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
  // D-318, 26 Oct 2026: removed. The sugarcane (February) PDF was regenerated on 25 Oct (D-312) from the site's data and
  // already prints Green Phosphate, 2 bags, at land preparation. Was: 'At land preparation, use Green Phosphate, 2 bags an acre. The PDF plan still shows Humi Grow for this step.'
  // D-317: was "The land preparation row follows VAN’s updated calculator: Green Phosphate, 2 bags an acre. The published PDF still prints Humi Grow there and is being reissued."
}

export const planUpdateNote = (slug: string): string | undefined => PLAN_UPDATED_ROWS[slug]
