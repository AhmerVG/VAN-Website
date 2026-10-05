/**
 * D-133, 24 Sep 2026 · crop training decks (LMS PDFs), keyed by crop slug (the crop page's file name
 * without .html, as cropSlug() gives it). The file lives on the live server at
 * https://www.van.com.pk/lms/<file>.pdf, beside the product decks.
 *
 * To give another crop a deck: upload the PDF to /lms/ and add ONE line here, e.g.
 *   maize: { file: 'VAN-LMS-Crop-Maize', label: 'Maize training deck (PDF)' },
 * A crop with no entry shows no link. Both sugarcane pages share the one sugarcane deck.
 * Revert: delete this file, cropLms in lib/season.ts, and the link in pages/CropPage.tsx.
 */
export const CROP_LMS: Record<string, { file: string; label: string }> = {
  sugarcane: { file: 'VAN-LMS-Crop-Sugarcane', label: 'Sugarcane training deck (PDF)' },
  'sugarcane-ratoon': { file: 'VAN-LMS-Crop-Sugarcane', label: 'Sugarcane training deck (PDF)' },
}
