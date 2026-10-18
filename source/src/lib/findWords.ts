/**
 * U3 · SEARCH IN THE WORDS PEOPLE TYPE · 18 Oct 2026 (D-255).
 *
 * The audit of 18 Oct found the crop search finding nothing for "gandum", "aaloo", "wheet" or
 * "cotten", and the menu search finding nothing for "yuria" or "pottash". The menu already had the
 * crop names in Roman Urdu and Urdu (CROP_WORDS, moved here unchanged from MenuPanel so both boxes
 * share them); the crop box never used them, products had none, and neither box forgave a slip.
 *
 * Two things here:
 *   1. the local words: crops (as before, plus kanak and kapaas) and, new, products, in Roman
 *      spelling only. No new Urdu script is added (Tahir checks every Urdu word; the crop words
 *      below were already in the site).
 *   2. forgiving matching, used ONLY when nothing matches exactly: a whole word 1 letter off for
 *      words of 4 to 6 letters, 2 off for longer ones ("wheet" = "wheat", "aaloo" = "aloo",
 *      "pottash" = "potash", "cotten" = "cotton"); 2 letters swapped count as 1 ("whaet"). The
 *      first letter must be right, so "banna" is banana and never ganna, and "catton" is cotton and
 *      never ratoon. Closer slips rank first.
 *   Review of 18 Oct: an earlier cut squashed doubled letters and forgave the start of a word, and
 *   sent "banna", "gava" and "catton" to Ratoon Sugarcane. Both are gone. "sulphur" was taken off
 *   Vital Urea: Green Sulfur is the sulphur product. "dap" finds the phosphates: Tahir's ruling,
 *   18 Oct (none of them is DAP).
 */

export const CROP_WORDS: Record<string, string> = {
  wheat: 'gandum gundum kanak گندم', maize: 'makai makki مکئی', 'rice-basmati': 'chawal chawel dhan dhaan basmati چاول دھان', 'rice-hybrid': 'chawal chawel dhan dhaan چاول دھان',
  cotton: 'kapas kapaas phutti کپاس پھٹی', sugarcane: 'ganna kamad گنا کماد', 'sugarcane-ratoon': 'ganna kamad mudhi مونڈھی گنا کماد', canola: 'sarson raya سرسوں کینولا',
  sesame: 'til تل', soybean: 'soyabean سویابین', sunflower: 'surajmukhi سورج مکھی', chickpea: 'chana channa چنا', lentil: 'masoor مسور',
  'mungbean-mash': 'moong mung mash مونگ ماش', potato: 'aloo alu آلو', tomato: 'tamatar ٹماٹر', chili: 'mirch mirchi مرچ', garlic: 'lehsan lahsan لہسن',
  watermelon: 'tarbooz تربوز', turmeric: 'haldi ہلدی', onion: 'piaz pyaz پیاز', 'banana-year1': 'kela کیلا', 'banana-year2': 'kela کیلا',
  citrus: 'kinnow kinno malta کینو مالٹا', 'date-palm': 'khajoor khajur کھجور', mango: 'aam آم', strawberry: 'اسٹرابیری', guava: 'amrood amrud امرود',
}

/** Words a farmer or dealer types for a product, by its catalogue category, then by its own slug. */
const CAT_WORDS: Record<string, string> = {
  N: 'nitrogen urea yuria',
  P: 'phosphate phosphorus fasfate fosfate dap',
  K: 'potash potassium pottash potaash potas',
  NPK: 'npk',
  MICRO: 'micronutrients micro',
  SEC: 'secondary',
  BIO: 'organic biological',
}
const SLUG_WORDS: Record<string, string> = {
  'vital-urea': 'urea yuria yoria yooria',
  'v-zinc': 'zinc zink jist', 'v-transform': 'zinc zink jist',
  'v-boron': 'boron bohron', 'vl-micro-mix': 'zinc boron iron manganese copper',
  'cala-mag-v': 'calcium magnesium', 'v-mag-essential': 'magnesium',
  'green-sulfur': 'sulfur sulphur gandhak',
  'humi-grow': 'humic humik acid', 'humi-grow-plus': 'humic humik acid',
  'v-compost': 'compost', tornado: 'seaweed amino', sop: 'sulphate sulfate potash',
}
export function productWords(slug: string, cat: string): string {
  return `${CAT_WORDS[cat] ?? ''} ${SLUG_WORDS[slug] ?? ''}`.trim()
}

/** Damerau distance (a swap of 2 neighbours is 1), stopping early past max. */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    let low = Infinity
    for (let j = 1; j <= b.length; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
      if (d[i][j] < low) low = d[i][j]
    }
    if (low > max) return max + 1
  }
  return d[a.length][b.length]
}

/** True when every typed word is in the text as typed. */
export function exactMatch(hay: string, query: string): boolean {
  const h = hay.toLowerCase(), words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return words.length > 0 && words.every(w => h.includes(w))
}

/**
 * How many letters off a typed query is from a text, when it does not match exactly: the total over
 * its words, each against its closest whole word in the text. -1 when any word is too far off.
 * Only words of 4 or more plain letters are forgiven; the first letter must match.
 */
export function slipCost(hay: string, query: string): number {
  const h = hay.toLowerCase(), words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return -1
  const tokens = h.split(/[^\p{L}\p{N}]+/u).filter(Boolean)
  let total = 0
  for (const w of words) {
    if (h.includes(w)) continue
    if (!/^[a-z]+$/.test(w) || w.length < 4) return -1
    const max = w.length >= 7 ? 2 : 1
    let best = max + 1
    for (const t of tokens) if (t[0] === w[0] && t.length >= 4) best = Math.min(best, distance(w, t, max))
    if (best > max) return -1
    total += best
  }
  return total
}
