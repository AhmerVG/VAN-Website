/**
 * URDU — first pass, 9 September 2026. READ THIS BEFORE CHANGING ANYTHING HERE.
 *
 * Two of the four audits named Urdu as the site's largest content gap, and they were right: a site
 * written for Pakistani growers had no Pakistani-language surface at all beyond two words on the One
 * Tank page.
 *
 * WHAT THIS IS, AND WHAT IT DELIBERATELY IS NOT
 *
 * It is a LABEL layer, not a translation of the site. Crop names, growth stages, nutrient bands,
 * application methods, soil-test parameters and the interface's own verbs — the words a grower needs
 * in order to use the plan — are given in Urdu beside the English. The argument, the evidence, the
 * source notes and the product pages stay in English.
 *
 * That boundary is a decision, not laziness. Translating agronomy prose is where a translation stops
 * being a convenience and starts being advice, and advice in a language nobody at VAN has reviewed
 * is advice nobody at VAN has given. Labels are nouns with settled Urdu equivalents; a paragraph
 * about phosphorus fixation in calcareous soil is not.
 *
 * NOTHING IS EVER REPLACED. Urdu is shown IN ADDITION to the English, never instead of it. Product
 * names, analyses, rates, pack sizes and every number stay exactly as they are printed on the bag and
 * in the registration, in Latin script, in both modes. A farmer comparing the screen to the sack must
 * see the same thing on both.
 *
 * WHAT IS UNTRANSLATED IS SHOWN UNTRANSLATED. A string with no entry here renders in English alone.
 * There is no fallback that guesses, no transliteration, and no partial rendering of a compound
 * instruction — a method written as "Fertigation — repeat 15 days after flowering" is either matched
 * exactly or left in English, because half-translating an instruction is worse than not translating
 * it. `untranslated()` lists everything currently unmatched so the gap can be seen rather than
 * assumed.
 *
 * STATUS: THIS IS A FIRST PASS AND HAS NOT BEEN REVIEWED BY A NATIVE URDU-SPEAKING AGRONOMIST.
 * Every string is written up in "Urdu strings for review — 9 Sep 2026.md" for exactly that. Until
 * that review is done the interface says so, in Urdu, on the panel that switches it on, and gives a
 * WhatsApp line to report a wrong word. Publishing an unreviewed translation silently would be the
 * same mistake as publishing an unreviewed yield model.
 */

/* D-313, 24 to 25 Oct 2026: every line below was checked by Tahir Abbas line by line (review page "VAN Urdu Review",
 * then "VAN Site Open Questions"); his corrections are applied wherever the same word appears. */
export const UR_CROP: Record<string, string> = {
  'Wheat': 'گندم',
  'Maize (Corn)': 'مکئی',
  'Basmati Rice': 'باسمتی چاول',
  'Hybrid Rice': 'ہائبرڈ چاول',
  'Cotton': 'کپاس',
  'Sugarcane, February planting': 'گنا، فروری کاشت',
  'Ratoon Sugarcane': 'مونڈھی گنا',
  'Canola': 'کینولا',
  'Sesame': 'تل',
  'Soybean': 'سویابین',
  'Sunflower': 'سورج مکھی',
  'Chickpea': 'چنا',
  'Lentil': 'مسور',
  'Mungbean & Mash': 'مونگ اور ماش',
  'Potato': 'آلو',
  'Tomato': 'ٹماٹر',
  'Chili': 'مرچ',
  'Garlic': 'لہسن',
  'Watermelon': 'تربوز',
  'Turmeric': 'ہلدی',
  'Onion': 'پیاز',
  'Banana, 1st year': 'کیلا، پہلا سال',
  'Banana, 2nd year': 'کیلا، دوسرا سال',
  'Citrus, 5 years and over': 'کینو کے پودے، پانچ سال اور اس سے زیادہ',
  'Date Palm': 'کھجور',
  'Mango': 'آم',
  'Strawberry': 'اسٹرابیری',
  'Guava': 'امرود',
}

/** Growth stages, exactly as the plans name them. Date-palm age bands included. */
export const UR_STAGE: Record<string, string> = {
  'Land Preparation': 'زمین کی تیاری',
  'Land Preparation/Transplantation': 'زمین کی تیاری / پنیری کی منتقلی',
  'Land Preparation/Transplanting': 'زمین کی تیاری / پنیری کی منتقلی',
  'Germination': 'اُگاؤ',
  'Establishment': 'جڑ پکڑنا',
  'Early Growth': 'ابتدائی بڑھوتری',
  'Early Growth (20 DOT)': 'ابتدائی بڑھوتری (پنیری لگانے کے 20 دن بعد)',
  'Grand Growth': 'بھرپور بڑھوتری',
  'Grand Growth (40 DOT)': 'بھرپور بڑھوتری (پنیری لگانے کے 40 دن بعد)',
  'Maturity': 'پکنے کا مرحلہ',
  'Maturity (50 DOT)': 'پکنے کا مرحلہ (پنیری لگانے کے 50 دن بعد)',
  'Boll Formation & Maturity': 'ٹینڈے بننا اور پکنے کا مرحلہ',
  'Grain Formation & Maturity': 'دانہ بننا اور پکنے کا مرحلہ',
  'Fruiting and Picking Phase': 'پھل اور چنائی کا مرحلہ',
  'After Picking': 'چنائی کے بعد',
  'September': 'ستمبر',
  'October, flowering starts': 'اکتوبر، پھول آنا شروع',
  'November, fruiting': 'نومبر، پھل بننا',
  'December': 'دسمبر',
  'January': 'جنوری',
  'February, picking': 'فروری، چنائی',   // D-314: Tahir 25 Oct 2026, guava is picked, not cut; was 'February. Harvest' / 'February, harvest': 'فروری، کٹائی'
  'Year 1–2 · newly planted': 'سال 1 سے 2 · نئے لگائے ہوئے پودے',
  'Year 3–4 · establishing': 'سال 3 سے 4 · جڑ پکڑتے ہوئے پودے',
  'Year 5–6 · first bearing': 'سال 5 سے 6 · پہلا پھل',
  'Year 7–8 · building yield': 'سال 7 سے 8 · بڑھتی ہوئی پیداوار',
  'Year 9+ · mature bearing': 'سال 9 سے زیادہ · بھرپور پھل',
}

/** Nutrient bands as the plan tables head them. */
export const UR_BAND: Record<string, string> = {
  'Nitrogen': 'نائٹروجن',
  'Phosphorus': 'فاسفورس',
  'Potash': 'پوٹاش',
  'Secondary Nutrient': 'ثانوی غذائی اجزا',
  'Micronutrients': 'خورد غذائی اجزا (مائیکرو نیوٹرینٹس)',
  'Soil Amendment': 'زمینی اصلاح کار',
  'Foliar': 'پتوں پر سپرے',
}

/**
 * Only the methods that are a single, settled instruction. The compound ones — "Fertigation — repeat
 * 15 days after flowering" — are deliberately absent: an instruction half in Urdu and half in English
 * is worse than one in English.
 */
export const UR_METHOD: Record<string, string> = {
  'Broadcasting': 'چھٹا',
  'Drill at sowing; broadcast if no drill': 'بجائی پر ڈرل سے؛ ڈرل نہ ہو تو چھٹا',
  'Placement': 'قطار کے ساتھ ڈالنا',
  'Side dressing': 'سائیڈ ڈریسنگ',
  'Fertigation': 'بذریعہ آبپاشی',
  'Spray': 'سپرے',
  'Foliar': 'پتوں پر سپرے',
}

/** Soil-test parameters, as a soil report names them. */
export const UR_SOIL: Record<string, string> = {
  P2O: 'فاسفورس',
  K2O: 'پوٹاش',
  Zn: 'زنک',
  B: 'بوران',
  Fe: 'آئرن',
  Cu: 'کاپر',
  Mn: 'مینگنیز',
  OM: 'نامیاتی مادہ',
  pH: 'pH',
  EC: 'حل پذیر نمکیات (EC)',
}

/** The interface's own words — the verbs and units a farmer acts on. */
export const UR_UI: Record<string, string> = {
  // D-184, 26 Sep 2026: the 4 doors on the home page. Reviewed 27 Sep 2026 (D-211): masculine first person, as the rest of the UI layer.
  'I grow': 'میں اگاتا ہوں',
  'I sell': 'میں بیچتا ہوں',
  // D-313 (Tahir's Urdu review, 24 Oct 2026): "No need to translate these parts" for these 2 doors; they show English only
  // (were 'میرے نام سے بنا' and 'میں کچھ الگ کرنا چاہتا ہوں').
  acres: 'ایکڑ',
  perAcre: 'فی ایکڑ',
  bag: 'بوری',
  pack: 'پیک',
  stage: 'مرحلہ',
  product: 'پروڈکٹ',
  rate: 'مقدار',
  method: 'طریقہ',
  yourList: 'آپ کی فہرست',
  cropPlans: 'فصلوں کے پلان',
  shoppingList: 'خریداری کی فہرست',
  sendWhatsApp: 'واٹس ایپ پر بھیجیں',
  downloadPdf: 'پی ڈی ایف ڈاؤن لوڈ کریں',
  soilTest: 'مٹی کا ٹیسٹ',
  district: 'ضلع',
  sowing: 'بجائی',
  price: 'قیمت',
  perPlant: 'فی پودا',
  language: 'اردو',
  // Block 01/02 of the crop page — the sowing question and "where your crop is now" (9 Sep 2026).
  whenSown: 'آپ نے بجائی کب کی؟',
  sowingDate: 'بجائی کی تاریخ',
  notSownYet: 'ابھی بجائی نہیں کی',
  dontRemember: 'یاد نہیں',
  cropNow: 'آپ کی فصل اس وقت کس مرحلے میں ہے؟',
  daysAfterSowing: 'بجائی کے بعد دن',
  dueNow: 'اس مرحلے میں کیا ڈالنا ہے؟',
  nextStage: 'اگلا مرحلہ',
}

/** English label -> Urdu, for whichever table it belongs to. Unmatched returns undefined. */
export function ur(kind: 'crop' | 'stage' | 'band' | 'method' | 'soil' | 'ui', key: string): string | undefined {
  const table = { crop: UR_CROP, stage: UR_STAGE, band: UR_BAND, method: UR_METHOD, soil: UR_SOIL, ui: UR_UI }[kind]
  return table[key]
}

/**
 * What has no Urdu yet, so the gap is visible rather than assumed. Used by the review document and
 * the engine test — if a plan gains a new stage or method, this is what says so.
 */
export function untranslated(kind: 'crop' | 'stage' | 'band' | 'method', keys: string[]): string[] {
  return keys.filter(k => !ur(kind, k))
}

/** Shown, in Urdu, wherever the Urdu layer is switched on. It is not a disclaimer in small print. */
// D-313 (Tahir's Urdu review, 24 Oct 2026): the review is done, so the notice no longer says the Urdu is unreviewed
// (was 'یہ اردو ترجمہ ابتدائی ہے اور ابھی ماہرِ زراعت سے نظرثانی نہیں کرائی گئی۔ اگر کوئی لفظ غلط لگے تو براہِ کرم واٹس ایپ پر بتائیں۔').
export const UR_REVIEW_NOTICE = 'اگر کوئی لفظ غلط لگے تو براہِ کرم واٹس ایپ پر بتائیں۔'
export const UR_REVIEW_NOTICE_EN = 'Product names, analyses, rates and pack sizes are never translated. They stay exactly as printed on the bag. If a word is wrong, tell us on WhatsApp and it gets fixed.'
