// D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction
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
  eyebrow: 'About Vital Agri Nutrients (VAN)',
  lead: 'Trials have run on that ground every season since. VAN formulates, manufactures, registers and tests what it sells on 1 plant site in Lahore.',
  facts: [
    ['2010', 'company incorporated'],
    ['23', 'registered brands'],
    ['14', 'companies we make products for'],
    ['About 50,000 t', 'annual capacity'],   // Tahir 7 Nov 2026 (CO-19): was 'made a year'
  ] as [string, string][],
}

/** Who VAN makes for. VAN is B2B (Tahir, 25 Sep). */
export const B2B = {
  eyebrow: 'What we do',
  h2: 'Most of what we make is sold under other companies’ brands',
  // D-175, Tahir 26 Sep 2026: own brands go "through a dealer network, distributors, VAN own centers as well a direct farmer technical service team". No farmer numbers (his rule).
  p: 'We are mainly a business-to-business manufacturer. National and multinational companies sell the crop nutrition products we make for them under their own brands. Our own registered brands reach the market through dealers, distributors, our own Vital Agri Centers and an agronomy team that works directly with farmers.',   // Tahir 7 Nov 2026 (CO-29): 1 name, "agronomy team"
}

/** How a product is made, in order. Registration has its own band below, with the licences. */
export const MADE_STEPS: { n: string; t: string; d: string; href: string; link: string }[] = [
  // D-174: no link; the page it pointed to (soil and sustainability) is not about the research farm.
  // D-175, Tahir 26 Sep 2026: VAN has several farms (one at the plant site); trials run on "VAN's research farms".
  { n: '1', t: 'Trial', d: 'We first test a formulation in trials on our research farms, and we compare its results with the results of our earlier trials, which cover 17 years.', href: '', link: '' },
  { n: '2', t: 'Make', // D-175, Tahir 26 Sep 2026: "water soluble, compounded line too, drop biological".
    d: 'We make it at the plant on granular, coated, liquid, water-soluble and compounded lines. Batch sizes, coating, chelation, solubility and pack sizes are described on the plant page.', href: '#/partner/manufacturing', link: 'The plant' },
  { n: '3', t: 'Test', d: 'Our laboratory tests every production batch before it ships.', href: '#/lab', link: 'VAN Lab' },
]

/** Licences, accreditation and patent: the 3 things a buying company checks. */
export const HOLDS: { v: string; t: string; d: string }[] = [
  { v: '34', t: 'PSQCA licences', d: 'Of our 34 licences, 22 cover 20 of our 23 brands. These 22 licences are issued against 8 different Pakistan Standards. Our other 3 brands either need no licence or have a conformance report instead. The remaining 12 licences cover products that are ready for partner companies to launch.' },   // D-257
  { v: 'LAB 336', t: 'PNAC accreditation', d: 'Our quality control laboratory has been accredited to ISO/IEC 17025:2017 since 2024. Anyone can open the lab report for a batch on our website by typing its batch number, or ask us for a copy.' },
  { v: '144684', t: 'Pakistan Patent', d: 'Granted in 2026 for Vital Urea, our sulfur coated urea.' },   // D-175: "granted" (Tahir 26 Sep)
]

export const ORIGIN = {
  h2: 'Why we started',
  // L2 fix 9 Nov 2026 (settled CO-60): was "Before VAN was founded".
  p1: 'Before VAN was incorporated in 2010, fertiliser in Pakistan was sold and recommended by the number of bags, for example 1 bag of one product and 3 bags of another, and not according to what the crop needed at each stage. A cotton grower on light soil and a rice grower on heavy alkaline soil in a neighbouring district were given the same advice. Our founder saw this happen in the fields.',
  // Tahir 10 Nov 2026 (CO-N17): the research farm was acquired in 2008; the plant land next to it came later.
  // Was: 'After making humic acid in 2007, our founder developed further products and tested them on land that the company later acquired. In 2009 that land became our first research farm.'
  // L1 fix 10 Nov 2026 (M1): 'the research farm' had no earlier mention and the voice moved from 'our' to 'VAN ... its'. Facts unchanged: acquired 2008, first research farm (site.ts timeline 2009; profile deck slide 3 'Acquired in 2008'). 'Our founder' / 'The founders' left for Tahir.
  p2: 'After making humic acid in 2007, our founder developed further products and tested them in the field. In 2008, the founders acquired the farm that became our first research farm. We later bought the land next to it to build our plant.',
  // D-174: the 2011 to 2026 years paragraph is gone: it was the dropped timeline written as prose. 2024 and 2026 live in HOLDS.
  evidenceH: 'Fertiliser use and wheat yield in Pakistan, 1999-2000 to 2023-24',
  // D-174: his ruling was 1 line. The 31% yield figure and the balance-and-timing argument are on the linked page.
  // Tahir 7 Nov 2026 (CO-23): the period named once as fiscal years (July to June).
  evidence: 'Between fiscal years 1999-2000 and 2023-24 (July to June), the fertiliser nutrient applied per acre of arable land in Pakistan rose by 68%. Over the same years, the wheat yield obtained for each kg of fertiliser nutrient fell by 22%. For this figure we divided wheat yield per acre by the fertiliser nutrient applied per acre of arable land, which covers all crops, not only wheat. We calculated both changes from published figures. Sources: World Bank indicator AG.CON.FERT.ZS (fertiliser per hectare of arable land); Pakistan Economic Survey (wheat yield).',   // L1 editor fix 7 Nov 2026 (company-a M1): the measure spelled out. L2 fix 9 Nov 2026 (company W11): sources named.
  evidenceLink: 'The full figures and sources',
}

export const WHO_NOTE = 'Email them directly, or call +92 42 35762215 and ask for them by name.'
export const WHO_LAB = 'For a sample or a test, contact Sample Reception on the VAN Lab page.'
