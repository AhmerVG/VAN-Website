// D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction
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
  { n: '02', t: 'Sample Reception', s: 'Your parcel is opened at Sample Reception, not at the laboratory.', k: 'name',
    detail: 'Sample Reception works from a separate building, at its own address, and is independent of the laboratory both physically and organisationally. Its staff know who you are, but they never see your result.' },
  { n: '03', t: 'A code is issued', s: 'The system generates a laboratory code that carries no information about you.', k: 'code',
    detail: 'Sample Reception enters your details, and the system, not a person, generates the code. The code contains no initials, no district, no customer segment and no priority marker. Your form, the outer packaging, the courier documents and every brand marking stay at Sample Reception.' },
  { n: '04', t: 'Split 3 ways', s: '2 portions go for analysis, and 1 is kept untouched.', k: 'split',
    detail: 'The sample is divided into 3 portions. Of these, 2 go to the laboratory for analysis, and the third is kept untouched for 24 months, so that the whole test can be repeated independently if you dispute the result. Each portion is labelled with the code and nothing else.' },
  { n: '05', t: '2 analysts', s: 'They work independently, and neither sees the other’s result.', k: 'code',
    detail: 'We do not report a result from a single analysis. Each of 2 different analysts receives a portion and runs the test, and neither sees the other’s result until both results are submitted. If the analysts compared results first, their agreement would prove nothing.' },
  { n: '06', t: 'Compared, then signed', s: 'The 2 results are compared with each other, and the QC Manager signs a report that shows only the code.', k: 'code',
    detail: 'The 2 results are compared with each other, and a documented acceptance criterion decides whether they agree. Where they agree, the result is reported. Where they do not, the QC Manager decides whether a third analysis is run or which result stands. The Assistant QC Manager reviews the work, and the QC Manager signs the report digitally. The report he signs carries only the laboratory code, so he does not know whose sample he is approving.' },
  { n: '07', t: 'The report is sent to you', s: 'At release, the system links the code back to you and logs the link.', k: 'you',
    detail: 'The code is linked back to your name only when the report is released. The analysts never learn who sent the sample. Only Sample Reception and Coordination / invoicing hold the name; Sample Reception forwards the report to you as a protected PDF without opening it.' },   // Tahir 10 Nov 2026 (R3-2): 2 roles hold the name; was '... ; only Sample Reception, which sends the report, holds the name.'   // Tahir 10 Nov 2026: was '... nobody in the laboratory learns who received it.' (conflicted with CO-N14: the laboratory sends the report)
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

export const ROLES_NOTE = 'A documented procedure keeps these duties separate.'

export const CHAIN_WHY = 'The analysts cannot treat a VAN sample more leniently than any other sample, because they do not know which samples are VAN’s. Your supplier’s stock is tested in exactly the same way as our own products, with the same reception desk, the same coding and the same 2 analysts. This procedure is a documented chain of custody, and it produces the kind of record your buyer, your bank and your customs broker expect.'

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
    { test: 'Elemental sulfur', note: 'By gravimetry and high-performance liquid chromatography (HPLC). Measures elemental sulfur (S₈) itself, not sulfate.', pkr: '4,000', days: '3', acc: true },
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
    { test: 'Humic acid', note: 'The determination alone takes 36 hours.', pkr: '2,000', days: '4', acc: true },
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
export const PRICE_LEAD = 'We publish the price of each of our 21 fertiliser tests. No fertiliser test on this list is priced “on request”, and no price is set after we learn who is asking. Prices are in rupees (Rs), include sales tax and apply from 15 August 2026.'
export const SOIL_NOTE = 'We also test soil. Soil tests are not yet on the published list, so we quote the price of a soil test when you book it.'
/** D-168: the Days column is the laboratory's own time for that test. Booking to report is 3 to 5 working days. */
export const DAYS_NOTE = '“Days in the laboratory” is the laboratory’s own working time for each test. It is not the time from booking to report, which is given under Book a test.'
export const PRICE_NOTE = 'All 21 tests are run in the same laboratory, through the same blind chain, by the same 2 analysts. The 8 tests marked Accredited are within the scope of VAN Lab’s PNAC accreditation (LAB 336, ISO/IEC 17025:2017). The other 13 are outside that scope.'

/**
 * Booking, in the order it happens. The 4 steps (was SampleSteps) now carry the facts that only the
 * "What to know before booking" table had (retained portion, sealed bottle, clock from booking,
 * the extraction protocol) and the one fact only the "What the report gives you" cards had (who
 * reviews and signs). Those two blocks are gone; nothing they said is.
 */
export const BOOK_STEPS: [string, string][] = [
  // D-168: "Bring it to the laboratory" and "hand it to your VAN dealer" are gone (his rulings: the
  // laboratory never receives from the public; no dealer route). Sample Reception's address is given.
  ['Send 500 g', 'Send 500 g by weight, whether the product is solid or liquid: a solid in a sealed pack, a liquid in a sealed bottle. That is enough for 2 independent analyses and the portion we keep in case you dispute the result. Bring it by hand or send it by courier to Sample Reception, whose address is given below.'],
  ['Get a reference number', 'Sample Reception logs the sample and gives you a reference number. Anyone with a reference number can ask where a sample is. No account is needed, and you do not have to be a regular customer. Send the reference number on WhatsApp and Sample Reception will tell you the same day where your sample is.'],
  // D-168, Tahir 25 Sep 2026: 3 to 5 working days from booking. The per-test days are laboratory time.
  // L2 fix 9 Nov 2026 (settled CO-85): was "after your booking is confirmed".
  ['3 to 5 working days', 'Your report is ready 3 to 5 working days after Sample Reception confirms your booking, including the time your sample takes to reach us. Within that time, the laboratory’s own work takes 3 working days for most tests and 4 for humic acid. The price list gives the days for each test.'],
  ['The result, with its method', 'The report gives the measured value for each parameter you asked for and the method used to measure it. A value can only be read correctly alongside its method. This matters most for humic acid, where the extraction protocol determines the number. Sample Reception forwards the report, unopened, as a protected PDF on WhatsApp and by email; reports are issued in digital form only. If anything in the report needs explaining, our agronomy team explains it: write to partner@van.com.pk.'],   // Tahir 10 Nov 2026 (R3-2): was 'Sample Reception sends the report as a PDF on WhatsApp and by email; ...'   // Tahir 10 Nov 2026: contact for the agronomy team is partner@van.com.pk (his answer).   // L1 fix 10 Nov 2026 (M2): 'The laboratory sends' -> 'Sample Reception sends', to agree with blind chain step 07 (LAB-1).   // Tahir 10 Nov 2026 (CO-N14): the laboratory sends the report, and the agronomy team explains it. Was 'The report is sent as a PDF ... If anything needs explaining, call Sample Reception and quote your reference number.'
]

export const BOOK_INTRO = 'If you book first, Sample Reception knows that your sample is coming and codes it as soon as it arrives, so the sample is not left waiting.'
/** D-168, Tahir 25 Sep 2026: bank transfer only, no cash; sales tax included. */
export const PAYING = 'Payment is by bank transfer only; we do not accept cash. Every price includes sales tax, and nothing is charged until you have agreed the price.'

/** The audiences (was LAB.who + LAB_SECTIONS 04), one card each instead of two passes. */
export const WHO: { h: string; s: string; body?: string }[] = [
  { h: 'Farmers', s: 'We test fertiliser you have already bought, to find out whether it is counterfeit or of poor quality.' },
  { h: 'Distributors', s: 'We test incoming stock of any brand you carry, not only our own products.',
    body: 'The farmer buys from you, so if the stock is not what your supplier says it is, the farmer holds you responsible, not the supplier. A laboratory that tested only its own company’s products would be of no use for checking the goods you receive.' },
  { h: 'Importers', s: 'We test consignments, with a published turnaround time and a certificate from an accredited laboratory.',
    body: 'A consignment held at a port costs money for every day it waits. You need a turnaround time you can plan around and a certificate your buyer will accept. We report 3 to 5 working days after Sample Reception confirms your booking, including the time your sample takes to reach us. 8 of our 21 tests are within the scope of our PNAC accreditation (LAB 336, ISO/IEC 17025:2017). These 8 are marked Accredited on the price list and on the report. The other 13 are not.' },   // L2 fix 9 Nov 2026 (company W5, settled CO-15 and CO-85)
  // D-168, Tahir 25 Sep 2026: umpire and referee analysis removed entirely ("we should remove ourselves
  // from this"). A laboratory stays as an ordinary customer. Revert: the v55 source zip.
  { h: 'Other laboratories', s: 'We handle a sample from another laboratory like any other sample, with the same price list and the same blind chain.' },
]

// D-168, Tahir 25 Sep 2026: monthly and volume subscription plans with a customer lab record portal.
// D-189, Tahir 26 Sep 2026: the month came off ("October 2026" was 5 days away with nothing built). Revert: put it back.
// Tahir 10 Nov 2026 (CO-N11): still planned; they start in January 2027.
// L1 fix 10 Nov 2026 (m7): 'are planning' clashed with the firm start date; 'volume subscription plans' unstacked. 'These plans start in January 2027' kept as ruled (CO-N11).
export const VOLUME_NOTE = 'For distributors and importers who send samples regularly, we will offer monthly subscription plans and plans based on the number of samples, with a customer portal that keeps all your laboratory records in 1 place. These plans start in January 2027. Tell us roughly how many samples you expect to send in a season, and we will discuss it with you.'
