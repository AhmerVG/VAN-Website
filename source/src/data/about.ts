/**
 * ABOUT PAGE COPY — D-173, 25 Sep 2026 (replaces D-170's copy).
 *
 * Tahir, 25 Sep, on the D-170 page once it was live: hero empty and weak; looks like a template; footer;
 * wording; the year-by-year story was weak, badly designed and "suppressed in the middle of the page";
 * "we need to rethink and reimagine, don't rush". His answers the same day:
 *   · Hero: split, words left, drawing right.
 *   · The year-by-year timeline comes OFF the About page.
 *   · VAN works B2B. No reference to farmers on VAN's About page: farmer reach belongs to Vital Green.
 *   · The biological laboratory is 2026 (not 2016). Pakistan Patent 144684, for Vital Urea, is 2026.
 * Earlier the same day (D-170): Bilal Ahmed Khan is Chief Regulatory Officer; do not say where the research
 * farm is; the evidence is 1 line and a link; 20 of 23 brands hold the 22 licences, the other 3 need no
 * licence or a conformance report.
 * Every fact below is from ABOUT in site.ts, the Vital Urea page, or those answers.
 */

export const ABOUT_HERO = {
  eyebrow: 'About VAN',
  lead: 'Trials have run on that ground every season since. VAN formulates, manufactures, registers and tests what it sells on one plant site in Lahore.',
  facts: [
    ['2010', 'company incorporated'],
    ['23', 'registered brands'],
    ['14', 'companies VAN makes for'],
    ['About 50,000 t', 'made a year'],
  ] as [string, string][],
}

/** Who VAN makes for. VAN is B2B (Tahir, 25 Sep). */
export const B2B = {
  eyebrow: 'What VAN does',
  h2: 'Most of what VAN makes carries another company’s name',
  // D-175, Tahir 26 Sep 2026: own brands go "through a dealer network, distributors, VAN own centers as well a direct farmer technical service team". No farmer numbers (his rule).
  p: 'VAN is mainly a business-to-business manufacturer. It makes crop nutrition for national and multinational companies under their own brands. VAN’s own registered brands reach the market through a dealer network, distributors, VAN’s own Vital Agri Centers, and a technical service team that works directly with farmers.',
}

/** How a product is made, in order. Registration has its own band below, with the licences. */
export const MADE_STEPS: { n: string; t: string; d: string; href: string; link: string }[] = [
  // D-174: no link; the page it pointed to (soil and sustainability) is not about the research farm.
  // D-175, Tahir 26 Sep 2026: VAN has several farms (one at the plant site); trials run on "VAN's research farms".
  { n: '1', t: 'Trial', d: 'A formulation is tried on VAN’s research farms first, and checked against 17 years of trial data.', href: '', link: '' },
  { n: '2', t: 'Make', // D-175, Tahir 26 Sep 2026: "water soluble, compounded line too, drop biological".
    d: 'It is made at the plant, on granular, coated, liquid, water-soluble and compounded lines. Batch sizes, coating, chelation, solubility and packs are on the plant page.', href: '#/partner/manufacturing', link: 'The plant' },
  { n: '3', t: 'Test', d: 'Every lot is tested in VAN’s laboratory before it ships.', href: '#/lab', link: 'VAN Lab' },
]

/** Licences, accreditation and patent: the 3 things a buying company checks. */
export const HOLDS: { v: string; t: string; d: string }[] = [
  { v: '22', t: 'PSQCA licences', d: 'Held by 20 of the 23 brands, against 8 Pakistan Standards. The other 3 either need no licence or carry a conformance report instead.' },
  { v: 'LAB 336', t: 'PNAC accreditation', d: 'VAN’s QC laboratory, accredited to ISO/IEC 17025:2017 since 2024. The certificate for any batch is available on request.' },
  { v: '144684', t: 'Pakistan Patent', d: 'For Vital Urea, VAN’s sulfur-coated urea. Granted in 2026.' },   // D-175: "granted" (Tahir 26 Sep)
]

export const ORIGIN = {
  h2: 'Why VAN started',
  p1: 'Before VAN, crop nutrition was sold by the bag, not by what the crop needs at each stage: 1 bag of this, 3 bags of that. A cotton grower on light soil and a rice grower on heavy alkaline soil in the next district got the same advice. VAN’s founder saw this in the fields.',
  p2: 'In 2007 VAN’s founder made humic acid in Pakistan from Pakistani leonardite, an oxidised lignite. Until then humic acid was imported, and as far as VAN knows nobody had made it here before. More products were tried and tested on land VAN came to own, which became VAN’s first research farm in 2009.',
  // D-174: the 2011 to 2026 years paragraph is gone: it was the dropped timeline written as prose. 2024 and 2026 live in HOLDS.
  evidenceH: 'Why it still matters',
  // D-174: his ruling was 1 line. The 31% yield figure and the balance-and-timing argument are on the linked page.
  evidence: 'Between 1999-2000 and 2023-24 Pakistan put 68% more nutrient on each acre, while each kilogram of nutrient returned 22% less wheat.',
  evidenceLink: 'The full figures and sources',
}

export const WHO_NOTE = 'Email them directly, or call +92 42 35762215 and ask for them by name.'
export const WHO_LAB = 'For a sample or a test, contact Sample Reception on the VAN Lab page.'
