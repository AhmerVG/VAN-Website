/**
 * VAN LAB — ONE PAGE, ONE TELLING. D-166, 25 Sep 2026.
 *
 * Tahir, 25 Sep 2026, on the live /lab page: critical review, correct it, resolve the problems.
 *
 * What was wrong: the new /lab page (Lab.tsx) had the four old lab pages (LAB_SECTIONS in
 * rebuilt.ts) appended underneath it and never merged. So the blind chain was told twice (a drawn
 * diagram, then a 7-row table), booking four times (4 steps, the form, "No account, no login" and
 * the closing panel), the audiences twice (4 cards, then "3 different worries, one protocol"), the
 * report contents twice and the accreditation scope note twice. The numbers 01 to 04 started halfway
 * down the page. On a phone the diagram showed 2½ of 7 steps and two tables hid their key column
 * behind "swipe sideways".
 *
 * Every sentence below is carried across from LAB_SECTIONS or Lab.tsx as it stood at v54. Where two
 * sentences said the same thing, one is kept and the other is named in D-166 with the reason.
 * Revert: v54 source zip, src/pages/Lab.tsx and src/data/rebuilt.ts LAB_SECTIONS.
 */

export type ChainKey = 'you' | 'name' | 'code' | 'split'

export type ChainStep = { n: string; t: string; s: string; k: ChainKey; detail?: string }

/** The drawn chain (was BlindChain.tsx STEPS) with the long table text (was LAB_SECTIONS 01) inside each step. */
export const CHAIN: ChainStep[] = [
  { n: '01', t: 'Your parcel', s: 'You send it, with your name on it.', k: 'you' },
  { n: '02', t: 'Sample Reception', s: 'Separate address. Knows who you are. Never sees your result.', k: 'name',
    detail: 'Somebody has to open the parcel; no arrangement removes that, and a laboratory claiming otherwise is describing something that cannot happen. So the parcel is not opened at the laboratory. Sample Reception is a separate place with its own address, independent of the laboratory both physically and organisationally. The people there know who you are. They will never see your result.' },
  { n: '03', t: 'A code is issued', s: 'By the system, not a person. It encodes nothing about you.', k: 'code',
    detail: 'Reception enters your details and the system generates a laboratory code. The system, not a person, because an assigned code can carry meaning and meaning leaks. The code encodes nothing about you: no initials, no district, no segment, no priority marker. Your form, the outer packaging, the courier documents and every brand marking stay at the desk.' },
  { n: '04', t: 'Split 3 ways', s: '2 portions forward, 1 retained untouched.', k: 'split',
    detail: '2 portions go forward for analysis. One is retained, untouched, for 24 months, so a complete independent re-test is possible if you ever dispute the result. All 3 carry the code and nothing else.' },
  { n: '05', t: '2 analysts', s: 'Working independently. Neither sees the other’s number.', k: 'code',
    detail: 'VAN does not report on a single analysis. 2 different analysts each receive a portion and each runs the test, and neither sees the other’s result before both are submitted. If the two compared results first, their agreement would prove nothing.' },
  { n: '06', t: 'Compared, then signed', s: 'Against a documented criterion. The QC Manager signs a code.', k: 'code',
    detail: 'The two results are compared against a documented acceptance criterion. Where they agree, the result is reported. Where they do not, the QC Manager decides whether a third analysis is run or which result stands. The Assistant QC Manager reviews the work; the QC Manager signs the report digitally. He signs against a code and does not know whose sample he is approving, which is precisely what makes the signature worth having.' },
  { n: '07', t: 'The report finds you', s: 'The system reconnects the code to you at release, and logs it.', k: 'you',
    detail: 'Only at release does the code reconnect to you, and the system does it, not a person. The report reaches you and nobody in the laboratory learns who it went to.' },
]

/** Was KnowsMatrix ROLES. Same 6 rows, same values. */
export const ROLES: [string, boolean, boolean, boolean][] = [
  ['Sample Reception (separate address)', true, false, false],
  ['Analyst A', false, true, false],
  ['Analyst B', false, true, false],
  // D-168, Tahir 25 Sep 2026: the Assistant QC Manager reviews only. He does not handle the sample.
  ['Assistant QC Manager', false, false, true],
  ['QC Manager (signs)', false, false, true],
  ['Coordination / invoicing', true, false, false],
]

export const ROLES_NOTE = 'Segregation of duties is enforced by documented procedure, and reconnecting your code to your report at release is done by the system and logged, not performed by a person.'

export const CHAIN_WHY = 'Why this matters to you specifically: they cannot have gone easy on a VAN bag, because they did not know it was a VAN bag. Your supplier’s stock is tested exactly the way VAN’s own product is tested. Same desk, same coding, same 2 analysts. This is chain of custody, documented: the language your buyer, your bank and your customs broker already work in.'

/**
 * The price list (was LAB_SECTIONS 02). Tahir 11 Sep 2026: one list, accreditation as a small mark.
 * Prices, days and marks unchanged. D-166 adds group headings only, which is how the old comment
 * said the list was meant to read ("the big three, then secondary and micronutrients, then the
 * physical and chemical checks") but the rows had no headings to show it.
 */
export type PriceRow = { test: string; note?: string; pkr: string; days: string; acc: boolean }
export const PRICE_GROUPS: { h: string; rows: PriceRow[] }[] = [
  { h: 'Nitrogen, phosphorus and potassium', rows: [
    { test: 'Nitrogen', pkr: '1,000', days: '3', acc: true },
    { test: 'Nitrate nitrogen', pkr: '500', days: '3', acc: false },
    { test: 'Phosphate', pkr: '1,500', days: '3', acc: true },
    { test: 'Potassium', pkr: '1,000', days: '3', acc: true },
  ] },
  { h: 'Sulfur, secondary nutrients and sodium', rows: [
    { test: 'Elemental sulfur', note: 'Gravimetry and HPLC. Measures S₈ itself, not sulfate', pkr: '4,000', days: '3', acc: true },
    { test: 'Sulfate', pkr: '500', days: '3', acc: false },
    { test: 'Calcium', pkr: '1,000', days: '3', acc: false },
    { test: 'Magnesium', pkr: '1,500', days: '3', acc: false },
    { test: 'Sodium', pkr: '500', days: '3', acc: false },
  ] },
  { h: 'Micronutrients', rows: [
    { test: 'Boron', pkr: '1,000', days: '3', acc: true },
    { test: 'Zinc by titration', pkr: '500', days: '3', acc: false },
    { test: 'Zinc by kit', pkr: '2,000', days: '3', acc: false },
    { test: 'Iron', pkr: '1,000', days: '3', acc: false },
    { test: 'Copper', pkr: '1,000', days: '3', acc: false },
    { test: 'Manganese', pkr: '1,500', days: '3', acc: false },
  ] },
  { h: 'Organic content', rows: [
    { test: 'Humic acid', note: 'The determination itself runs 36 hours', pkr: '2,000', days: '4', acc: true },
    { test: 'Amino acid', pkr: '1,500', days: '3', acc: false },
  ] },
  { h: 'Physical and chemical checks', rows: [
    { test: 'pH', pkr: '500', days: '3', acc: true },
    { test: 'Conductivity', pkr: '500', days: '3', acc: true },
    { test: 'Cation exchange capacity', pkr: '500', days: '3', acc: false },
    { test: 'Moisture by Karl Fischer', pkr: '2,000', days: '3', acc: false },
  ] },
]

// D-168: sales tax included (his ruling). Soil: VAN Lab tests soil, and until the soil list is
// published the price is given at booking (his choice, 25 Sep), so "nothing is on request" is scoped
// to this list rather than left as a claim the soil line would break.
export const PRICE_LEAD = '21 fertilizer tests. Nothing on this list is “on request”, and nothing is quoted after we learn who is asking. Prices in PKR, sales tax included, effective 15 August 2026.'
export const SOIL_NOTE = 'VAN Lab also tests soil. The soil tests are not on this list yet, so the price is given when you book.'
/** D-168: the Days column is the laboratory's own time for that test. Booking to report is 3 to 5 working days. */
export const DAYS_NOTE = 'Days in the laboratory are the laboratory’s own working time for that test, not the time from booking to report (see Book a test).'
export const PRICE_NOTE = 'All 21 are performed by the same laboratory, under the same blind chain, by the same 2 analysts. The 8 marked Accredited sit inside VAN Lab’s PNAC accreditation, LAB 336, ISO/IEC 17025:2017. The other 13 are outside the granted scope, and are marked so you are never in any doubt which is which.'

/**
 * Booking, in the order it happens. The 4 steps (was SampleSteps) now carry the facts that only the
 * "What to know before booking" table had (retained portion, sealed bottle, clock from booking,
 * the extraction protocol) and the one fact only the "What the report gives you" cards had (who
 * reviews and signs). Those two blocks are gone; nothing they said is.
 */
export const BOOK_STEPS: [string, string][] = [
  // D-168: "Bring it to the laboratory" and "hand it to your VAN dealer" are gone (his rulings: the
  // laboratory never receives from the public; no dealer route). Sample Reception's address is given.
  ['Send 500 g', 'Solid or liquid, by weight, in a sealed pack; liquids in a sealed bottle. That is enough for 2 independent analyses plus the portion we retain in case you ever dispute the result. Bring it by hand or courier it to Sample Reception; the address is below.'],
  ['Get a reference', 'Sample Reception logs it and gives you a reference number. Anyone with a reference number can ask where a sample is, with no account, and you do not have to be a regular customer. Send it on WhatsApp and Sample Reception tells you where your sample is the same day.'],
  // D-168, Tahir 25 Sep 2026: 3 to 5 working days from booking. The per-test days are laboratory time.
  ['3 to 5 working days', 'From confirmed booking to your report. Inside that, the laboratory’s own time is 3 working days for most tests and 4 for humic acid; the price list shows each test.'],
  ['The result, with its method', 'The measured value for each parameter you asked for, and the method that produced it, because a value only means something beside its method. Particularly for humic acid, where the extraction protocol defines the number. It comes as a PDF on WhatsApp and by email; reports are digital only. If anything needs explaining, call Sample Reception with your reference number.'],
]

export const BOOK_INTRO = 'The laboratory works to a published price list and issues the same certificate to everybody. Booking first means the sample is expected, coded on arrival and not sitting on a desk.'
/** D-168, Tahir 25 Sep 2026: bank transfer only, no cash; sales tax included. */
export const PAYING = 'Pay by bank transfer only. No cash is taken. Every price includes sales tax, and nothing is charged until you have agreed the price.'

/** The audiences (was LAB.who + LAB_SECTIONS 04), one card each instead of two passes. */
export const WHO: { h: string; s: string; body?: string }[] = [
  { h: 'Farmers', s: 'Counterfeit and quality verification on fertilizer you have already purchased.' },
  { h: 'Distributors', s: 'Incoming-goods verification on anything you stock, not only VAN product.',
    body: 'You are about to sell stock on your own name. If it is not what your supplier says it is, the farmer comes back to you, not to them. A laboratory that tested only its own company’s range would be no use to you for incoming goods.' },
  { h: 'Importers', s: 'Consignment testing with a published turnaround and an accredited certificate.',
    body: 'A consignment sitting at a port costs money every day it sits. What you need is a turnaround you can plan around and a certificate your buyer will accept: 3 to 5 working days from confirmed booking, printed on this page rather than quoted case by case, and PNAC ISO/IEC 17025:2017 LAB 336 for the accredited parameters. Non-accredited tests are identified as such on the price list and on the report.' },
  // D-168, Tahir 25 Sep 2026: umpire and referee analysis removed entirely ("we should remove ourselves
  // from this"). A laboratory stays as an ordinary customer. Revert: the v55 source zip.
  { h: 'Other laboratories', s: 'A sample from another laboratory is handled like anyone else’s: the same price list and the same blind chain.' },
]

// D-168, Tahir 25 Sep 2026: monthly and volume subscription plans with a customer lab record portal.
// D-189, Tahir 26 Sep 2026: the month came off ("October 2026" was 5 days away with nothing built). Revert: put it back.
export const VOLUME_NOTE = 'Testing more than the occasional sample? Monthly and volume subscription plans for distributors and importers are planned, with a customer portal that keeps your laboratory records in one place. Tell us roughly how many samples a season and we will talk.'
