import type { SoilBand } from '@/data/soilThresholds'

/**
 * THE URDU LABEL SET FOR THE SOIL ATLAS FARMER SCREENS (Teesra Khata), 18 Oct 2026.
 *
 * Words ruled by Tahir Abbas on 18 Oct 2026, used as ruled:
 *   band words   Critical بہت کم · Weak کم · Average درمیانہ · Moderate ٹھیک · Healthy پوری
 *                (Healthy was کافی; changed to پوری, since کافی can also mean "quite a lot")
 *   pH words     below 7 تیزابی (Acidic) · 7 نیوٹرل (Neutral) · above 7 اساسی (Alkaline). Not "namkiyat":
 *                that word is kept for the EC row so high pH is never read as saline land.
 *   EC label     حل پذیر نمکیات کی مقدار, the number only, no band word
 *   kallar       may be used for salty ground (EC) only, never for high pH
 *   pick         چنیں for picking a district, tehsil or area; never لگائیں or چھوئیں (19 Oct 2026)
 *   door line    اس بار گندم، مٹی کے حساب سے
 *   share button واٹس ایپ پر بھیجیں
 *   plan button  اپنی مٹی کے حساب سے گندم کا پلان دیکھیں
 *   plan line    مٹی کے جائزے سے یہ پلان بنا ہے (Tahir's own wording)
 *   the ask      اپنے علاقے کا تیسرا کھاتہ دیکھیں
 *   lens 02      اپنے علاقے کا کھاتہ دیکھیں
 * Every other Urdu line here is a DRAFT for Tahir's check, listed in the handoff of 18 Oct 2026.
 * As everywhere on the site, Urdu sits beside the English, never instead of it, and product names,
 * numbers and units stay in Latin script as printed on the bag.
 */

export const BAND_UR: Record<SoilBand, string> = {
  critical: 'بہت کم', weak: 'کم', average: 'درمیانہ', moderate: 'ٹھیک', healthy: 'پوری',
}

/** pH word by value, as ruled. Exactly 7 is neutral; the survey has 1 square at exactly 7. */
export function phWord(v: number | null | undefined): { ur: string; en: string } | null {
  if (v == null) return null
  if (v < 7) return { ur: 'تیزابی', en: 'Acidic' }
  if (v === 7) return { ur: 'نیوٹرل', en: 'Neutral' }
  return { ur: 'اساسی', en: 'Alkaline' }
}

export type KhataKey = 'p' | 'k' | 'zn' | 'om' | 'b' | 'ph' | 'ec'

export const READING_UR: Record<KhataKey | 's', { ur: string; en: string; unit: string }> = {
  p: { ur: 'فاسفورس', en: 'Phosphorus', unit: 'ppm' },
  k: { ur: 'پوٹاش', en: 'Potash', unit: 'ppm' },
  zn: { ur: 'زنک', en: 'Zinc', unit: 'ppm' },
  om: { ur: 'نامیاتی مادہ', en: 'Organic matter', unit: '%' },
  b: { ur: 'بوران', en: 'Boron', unit: 'ppm' },
  ph: { ur: 'pH', en: 'pH', unit: '' },
  ec: { ur: 'حل پذیر نمکیات کی مقدار', en: 'Soluble salts (EC)', unit: 'dS/m' },
  s: { ur: 'سلفر', en: 'Sulfur', unit: '' },
}

export const KHATA_UR = {
  name: 'تیسرا کھاتہ',
  doorLine: 'اس بار گندم، مٹی کے حساب سے',
  ask: 'اپنے علاقے کا تیسرا کھاتہ دیکھیں',
  lens02: 'اپنے علاقے کا کھاتہ دیکھیں',
  setDistrict: 'اپنا ضلع چنیں',
  straightToMap: 'سیدھا نقشہ دیکھیں',
  yourDistrict: 'آپ کا ضلع؟',
  orTapMap: 'یا نقشے پر اپنا علاقہ چنیں',
  districtKhata: (name: string) => `${name} کا کھاتہ`,
  tehsilKhata: (name: string) => `${name} تحصیل کا کھاتہ`,
  setTehsil: 'اپنی تحصیل چنیں',
  seeArea: 'اپنا علاقہ دیکھیں',
  yourArea: 'آپ کا علاقہ',
  makeCard: 'میری مٹی کا کھاتہ بنائیں',
  myKhata: 'میری مٹی کا کھاتہ',
  share: 'واٹس ایپ پر بھیجیں',
  saveImage: 'تصویر محفوظ کریں',
  planButton: 'اپنی مٹی کے حساب سے گندم کا پلان دیکھیں',
  planTitle: 'اپنی مٹی کے حساب سے گندم کا پلان',
  planLine: 'مٹی کے جائزے سے یہ پلان بنا ہے',
  // D-313 (Tahir's Urdu review, 24 to 25 Oct 2026): the bundle is the minimum every farmer needs, before the soil adds more
  bundle: 'گندم کا بنیادی بنڈل، فی ایکڑ',
  notTested: 'اس سروے میں ٹیسٹ ہی نہیں ہوا',
  survey: 'یہ پنجاب حکومت کا سروے ہے، تقریباً 2016 سے 2018 کا۔ یہ آپ کے علاقے کا حساب ہے، آپ کے کھیت کا نہیں۔',
  averageNotField: 'ضلع کی اوسط آپ کے کھیت کی ریڈنگ نہیں۔',
  fewSamples: (n: number) => `اس علاقے میں نمونے کم ہیں: ${n}`,
  rangeLine: (district: string, reading: string, lo: string, hi: string) => `${district} کے علاقوں میں ${reading}: ${lo} سے ${hi} تک`,
  ownTest: 'اپنے کھیت کی مٹی کے ٹیسٹ کے لیے VAN Lab سے رابطہ کریں',
  fold: 'پورے صوبے کا اٹلس دیکھیں',
  open: 'اپنے علاقے کا تیسرا کھاتہ (مٹی) کھولیں',
  back: 'واپس',
  border: 'یہ علاقہ ضلع کی سرحد پر ہے: اس کے زیادہ نمونے ساتھ والے ضلع کی تحصیل کے ہیں۔',
  noReading: 'ریڈنگ نہیں ہے',
  // was 'اس سیزن کا VAN گندم بنڈل: ہر کسان کے لیے ایک ہی۔' (Tahir: misleading; the soil adds to it)
  bundleNote: 'یہ ہر کسان کے لیے کم از کم گندم بنڈل ہے؛ مٹی کی ریڈنگ کے حساب سے اس میں اضافہ ہوتا ہے۔',
  calcTitle: 'کیلکولیٹر میں آپ کا پورا پلان',
  calcExplain: 'یہ VAN کا تجویز کردہ گندم پلان ہے۔ آپ کے ضلع کی مٹی کے حساب سے اس میں یہ تبدیلیاں آتی ہیں؛ مقدار کیلکولیٹر بتاتا ہے۔',
  calcDistrict: 'کیلکولیٹر آپ کا ضلع پڑھتا ہے، آپ کی زمین نہیں۔',
  /** D-313, Tahir's words 24 Oct 2026: the line over the calculator's product changes */
  changesLead: 'مٹی کی ریڈنگ میں غذائی اجزا کے حساب سے پروڈکٹس میں تبدیلی آتی ہے:',   // پروڈکٹ, as the site spells it elsewhere
  /** D-313, Tahir's words 24 Oct 2026, for the urea swap (was: عام یوریا کی جگہ Vital Urea: pH کی وجہ سے، نائٹروجن اتنی ہی رہتی ہے۔) */
  vitalUreaPh: 'زیادہ pH والی زمین میں Vital Urea (سلفر کوٹڈ) بہتر ہے۔',
  /** D-313, Tahir 24 Oct 2026: kallar, without gypsum (was: ... پہلے پانی، نکاس اور جپسم۔) */
  kallar: 'کلر (حل پذیر نمکیات 4 یا زیادہ): پہلے مشورہ، بوری نہیں۔',
  /** D-313, Tahir 24 Oct 2026 */
  pShort: 'آپ کی زمین میں فاسفورس کم ہے: بنڈل میں Green Phosphate 50 کلو (1 بوری) تک۔',
}

/**
 * THE GPS GRID CARD'S URDU, D-278, 20 Oct 2026. All 16 lines are Tahir's: his words or approved by him as drafted, on
 * 19 Oct 2026 (GPS Grid Card, rulings 19 Oct 2026.md and the design page "GPS Grid Card Design"), line 14 approved on
 * 20 Oct 2026 (M4). Numbers fill in where the line has one. Line 16 (G3, Tahir 20 Oct 2026): the district and tehsil in
 * the Urdu already live on the Teesra Khata screens (soilTehsils.ts, still drafts until his check), the Union Council in
 * English. Line 14 is shown only on a computer (it says "computer"); on a phone with a wide location the English alone
 * names the phone. Line 10 is the soil card's own reading names and band words, above. Every other line on these
 * screens is English until Tahir gives the Urdu.
 */
export const GPS_UR = {
  /** 1, heading, Tahir's words */
  heading: 'آپ کی زمین کے قریبی علاقے کی مٹی کا ریکارڈ',   // D-313, Tahir 24 Oct 2026 (was 'آپ کی قریبی زمین کی مٹی کا ریکارڈ')
  /** 2, note, Tahir's words */
  note: 'کارڈ آپ کی زمین کے قریبی علاقے کی ریڈنگ ہے۔ آپ کی لوکیشن چیک نہیں کی جاتی۔',
  /** 3, button, Tahir's words */
  useLocation: 'اپنی لوکیشن سے ریکارڈ دیکھیں',
  /** 4, button, Tahir's words */
  clickMap: 'جگہ پر کلک کریں',
  /** 5, button */
  pastePin: 'گوگل میپس کا پن پیسٹ کریں',
  /** 6, button */
  pickDistrictTehsil: 'ضلع اور تحصیل چنیں',
  /** 17, warning when his point is outside the tehsil he picked (D-281, Tahir's pick, option 1, 20 Oct 2026; native Urdu check still to do) */
  outsideTehsil: 'یہ جگہ آپ کی چنی ہوئی تحصیل سے باہر ہے۔',
  /** 7, button */
  searchUc: 'یونین کونسل یا چک نمبر تلاش کریں',
  /** 7, the same line without "یا چک نمبر", for a tehsil with no chak numbers (D-309, 22 Oct 2026); no new word */
  searchUcNoChak: 'یونین کونسل تلاش کریں',
  /** 8, the card's top line; the numbers fill in */
  samplesWithin: (km: string, n: string) => `آپ کی زمین کے ${km} کلومیٹر کے اندر ${n} نمونے`,
  /** 9, under the slider */
  dragRadius: 'دائرہ بڑا یا چھوٹا کرنے کے لیے کھینچیں',
  /** 11, the card's bottom line */
  areaNotField: 'یہ علاقے کا حساب ہے، آپ کے کھیت کا ٹیسٹ نہیں۔',   // D-313, Tahir 24 Oct 2026: 'اپنا ٹیسٹ: VAN Lab' removed
  /** 12, button, Tahir's words (D-294, 22 Oct 2026; was: رہنمائی اور مٹی کے حساب سے کھاد کی ڈسکشن کے لیے یہ کارڈ VAN کو بھیجیں) */
  sendToVan: 'مٹی کی ڈسکشن کے لیے یہ کارڈ VAN کو بھیجیں',
  /** 13, button, Tahir's words */
  wheatPlan: 'مٹی کے کارڈ کے حساب سے گندم کا پلان بنائیں',
  /** 14, computer note; the number fills in */
  computerNote: (km: string) => `آپ کے کمپیوٹر نے جگہ تقریباً ${km} کلومیٹر کے اندر بتائی ہے۔ پن کو اپنے کھیت پر لے جائیں۔`,
  /** 14, computer button */
  thisIsMyLand: 'یہی میری زمین ہے',
  /** D-308, the top button, Tahir's words 22 Oct 2026 ("Main apni zameen per hon"); the English is "I am at my land now" */
  atMyLandNow: 'میں اپنی زمین پر ہوں',
  /** 15, the question before the location */
  atYourLand: 'کیا آپ اس وقت اپنی زمین پر موجود ہیں؟',
  /** 16, the place line; Union Council, tehsil and district fill in */
  cardFor: (uc: string, tehsil: string, district: string) => `یہ کارڈ اس زمین کا ہے: ${uc}، ${tehsil}، ${district}`,
  /** D-313, Tahir's words 24 Oct 2026 ("App ki zameen kay qareebi alaqay"), over the card's "Near your land" list */
  nearYourLand: 'آپ کی زمین کے قریبی علاقے',
}
