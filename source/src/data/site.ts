// D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction
// Hand-transcribed from the live site (VAN Live Site, 31 Aug 2026 — van.com.pk).
// RULE: every number and claim below exists on the live site or in its cited sources.
// Nothing may be added here that is not already published by VAN. No performance claims.

export const CONTACT = {
  company: 'Vital Agri Nutrients (Pvt) Ltd',
  short: 'VAN',
  tagline: 'Crop nutrition engineered, manufactured, registered and tested in Pakistan.',
  // D-316, 26 Oct 2026. Tahir: CropLife Pakistan, "full members, 2024"; shown on About, the company profile and the footer.
  membership: 'Full member of CropLife Pakistan since 2024',
  whatsapp: '+92 300 5003041',
  whatsappDigits: '923005003041',
  landline: '+92 42 35762215',
  landlineTel: '+924235762215',
  email: 'info@van.com.pk',
  cropEmail: 'kisan@van.com.pk',      // crop pages and the Lab page ONLY, never Home, footer or About
  // D-168, Tahir 25 Sep 2026: lab bookings go to kisan@, and the laboratory itself never appears as a
  // public contact. The public talks to Sample Reception only, by phone or WhatsApp, never to the lab
  // or an analyst. Address given by him the same day.
  sampleReception: '604 Al-Hafeez Heights, Gulberg III, Lahore',
  // Tahir 9 Sep 2026: three addresses, three audiences. info@ is the company's general line and
  // belongs in the footer and on About; kisan@ answers farmers and appears only on crop pages;
  // partner@ answers the trade and appears only in the Make With Us section. Using the general
  // address on a partner page is not a small thing — it routes a distributor's first approach to
  // the same inbox as a farmer's rate question.
  partnerEmail: 'partner@van.com.pk',
  plant: '49-Km Multan Road, Phool Nagar Bypass, Lahore',
  headOffice: '605 Al-Hafeez Heights, Gulberg III, Lahore 54660',
  site: 'www.van.com.pk',
  linkedin: 'https://pk.linkedin.com/company/vital-agri-nutrients-private-limited',
  facebook: 'https://www.facebook.com/share/1J3LtwgQw3/',
  instagram: 'https://www.instagram.com/vitalagrinutriens/',
}

export const wa = (text: string) => `https://wa.me/${CONTACT.whatsappDigits}?text=${encodeURIComponent(text)}`
export const WA = {
  dealer: wa('Hello VAN. I’d like the name of my nearest dealer. My district is:'),
  distributor: wa('Hello VAN. I’m a distributor. I’d like to ask about your range, pricing and territory availability.'),
  farmer: wa('Hello VAN. I’d like a crop nutrition plan and product rates for my field.'),
  products: wa('Hello VAN. I’d like to ask about your products'),
  // D-166, 25 Sep 2026: every WhatsApp button on /lab opened WA.products ("I’d like to ask about
  // your products"), so a sample booking arrived looking like a product enquiry. Revert: use WA.products on Lab.tsx.
  // D-168: the greeting no longer names the laboratory (his ruling: never involve the lab on the public side).
  lab: wa('Hello VAN Sample Reception. I would like to book a sample test. Product and tests:'),
  // 28 Sep 2026, Tahir's ruling: the second, product-verification form on /verify explains that
  // asking for the product stops a number read off the wrong bag from passing, so the primary
  // WhatsApp message now carries that same safeguard instead of asking for the batch number alone.
  // 5 Oct 2026: the farmer no longer picks a product; the number alone brings the lab report.
  verify: (batch: string) => wa(`Hello VAN. Please send me the lab report for batch number ${batch || '____'}`),
  // 10 Sep 2026, Tahir's ruling on the counterfeit case: a number that is not in O2S gets a plain
  // statement and a way to send the bag, never an accusation on the page. This is that route.
  reportBag: (batch: string) => wa(`Hello VAN. I checked a batch number on van.com.pk and it is not in your records. The number on the bag is ${batch || '____'}. I am attaching a photo of the bag. I bought it from:`),
  order: wa('Hello VAN. I’d like to order. Product, quantity and district:'),
  // 11 Sep 2026 · the contract-manufacturing page was opening WA.distributor, so a procurement head
  // at a multinational introduced himself as a distributor asking about retail pricing. The
  // commercial team could not tell the two apart on arrival, and neither could the message.
  partner: wa('Hello VAN. We are looking at a product under our own brand. Company, crop and market:'),
  // Every crop page used to open the same generic message, so the first reply was always "which
  // crop?", and VAN had no way of knowing which of the 28 pages earns an enquiry. The crop is now
  // in the first line, which makes the message itself the attribution.
  crop: (name: string) => wa(`Hello VAN. I’d like a nutrition plan for my ${name.toLowerCase()}. My district and acres:`),
  plantVisit: wa('Hello VAN. We would like to visit the plant. Company and the week that suits:'),
}

// Headline counts used across the site (live Home / About / Brands pages)
export const COUNTS = {
  brands: 23,
  cropPlans: 28,
  // D-257, Tahir 18 Oct 2026: 34 PSQCA licences = 22 on VAN's own brands + 12 on products licensed
  // and ready for a partner launch (in the market within 60 days). The single source for every count.
  licences: 34,
  licencesOwn: 22,
  licencesPartnerReady: 12,
  partnerReadyDays: 60,
  standards: 8,
  lab: 'LAB 336',
  labStd: 'PNAC · ISO/IEC 17025:2017',
  patent: '144684',
  patentLabel: 'Pakistan Patent',
  // distributors: removed 9 Sep 2026 — unsourced. Restore only with a number Tahir supplies.
  // D-177: farmersDirect ('10,000+') deleted. Farmer numbers are not quoted on VAN pages (D-173) and nothing reads it now.
  // D-141 (owner, 24 Sep night): about 50,000 t is actual output, not capacity. Was '~50,000 t'. Revert: restore it.
  // Tahir 7 Nov 2026 (CO-19): "Plant capacity" chosen; replaces the D-141 "actual output" wording above.
  capacity: 'about 50,000 t annual capacity',
  since: 2009,
  // D-142 (owner, 24 Sep night): the company dates from 2010, its incorporation. The research farm (2009) keeps
  // `since` on the timeline and the farm node. Revert: delete this line and use `since` in the 2 kickers.
  incorporated: 2010,
  yearsData: '17 years',
  formulations: 27,   // D-183: 25 codes plus K-50DC (Concept) and P-DRC (Feasibility), 26 Sep 2026
  platforms: 7,
  labTests: 21,
  labAccreditedTests: 8,
  punjabSoilSamples: '770,160',
  // O-1, 9 Sep 2026 (Tahir): "Vital Urea is available — open it for distributors, open it for the
  // white label partner, open it for everyone." It was the one brand held back, which also made the
  // distributor page and Vital Urea's own page contradict each other (audit item 3). All 23 now.
  // Revert: 22 here, and "exclusive": true with badge "VAN exclusive" on vital-urea in catalogue.ts.
  // Tahir 7 Nov 2026 (PR-1): 22. SOP is bought in from a supplier and is not offered under a partner's brand; the other 22 brands are made in VAN's plant.
  ownBrandOpen: 22,
}

// Live home — hero slides (verbatim)
export const HOME_SLIDES = [
  { kicker: 'What this soil does', title: 'Made for Pakistani soil.', lead: 'Most samples in the Punjab soil survey were alkaline: of the 770,160 samples, tested in about 2016 to 2018, 69.1% had a pH above 8. Each crop plan is written for alkaline, calcareous soil.', cta: [['Find your crop’s plan', '#/crops'], ['See the 23 products', '#/products']] },
  // Tahir 10 Nov 2026 (CR-N9): trial records start in 2009, on the research farms VAN now runs; was 'Since 2010'.
  { kicker: 'Since 2009', title: 'Tested on our own ground.', lead: 'The farm came first; the company was built around it. Every season since, VAN’s products have been tested on that ground before they are sold for yours.', cta: [['About VAN', '#/about'], ['All 28 crop plans', '#/crops']] },
  // Tahir 7 Nov 2026 (CR-1): the '1/4 of the yield' line is withdrawn everywhere. title is a short card on the company profile, so it takes the first 2 sentences; lead (Home card) takes all 4. Was 'In our model estimate for wheat, nutrition accounts for about 1/4 of the yield. ...'
  { kicker: 'Beta testing · wheat and potato live now', title: 'Yield depends on doing every task on time: sowing date, seed and plant population, fertiliser at the right stage, irrigation on schedule, and control of weeds, pests and disease. Crop nutrition is 1 of these tasks.', lead: 'Yield depends on doing every task on time: sowing date, seed and plant population, fertiliser at the right stage, irrigation on schedule, and control of weeds, pests and disease. Crop nutrition is 1 of these tasks. A task missed at its time can cost yield that extra work later may not recover. VAN’s farm discipline simulator shows how each task, and its timing, changes the yield. The simulator scores practices such as sowing date, irrigation and plant stand, gives an estimated yield and shows which practices cost the most yield.', cta: [['Open the simulator', '#/simulator']] },
  { kicker: 'PNAC · ISO/IEC 17025:2017', title: 'Know what’s in the bag.', lead: 'Every batch VAN makes is tested before it ships, and the lab report for the batch you bought is yours for the asking.', cta: [['Verify a bag', '#/verify'], ['VAN Lab', '#/lab']] },
]

// The three losses — live home (verbatim)
export const LOSSES = [
  // L2 fact check 9 Nov 2026 (fix report N2): "part of the nitrogen", as the nitrogen panel says. Was 'nitrogen from urea left on the soil surface is lost to the air ...'.
  { n: 1, nutrient: 'Nitrogen', kicker: 'Nitrogen · problem 1 of 3', title: 'Nitrogen lost to the air and to water', text: 'In soil with a pH above 8, part of the nitrogen from urea left on the soil surface is lost to the air as ammonia before the crop can use it. Irrigation water carries nitrate down below the roots, and that nitrogen is lost to water.', product: 'Vital Urea', slug: 'vital-urea', analysis: 'Sulfur coated urea · N 32% min · S 13% min', colour: '#2E7D4F' },
  { n: 2, nutrient: 'Phosphate', kicker: 'Phosphate · problem 2 of 3', title: 'Phosphate bound by calcium', text: 'In calcareous soil, free calcium binds most of the applied phosphate before the root reaches it.', product: 'Green Phosphate', slug: 'green-phosphate', analysis: 'P₂O₅ 32% · N 6%', colour: '#1B4A6B' },
  // Tahir 7 Nov 2026 (CO-20): potash as K₂O, nitrogen as N.
  { n: 3, nutrient: 'Potash', kicker: 'Potash · problem 3 of 3', title: 'Too little potash applied', text: 'In 2023, Pakistan applied 83 kg of nitrogen (N) for every 1 kg of potash (K₂O). With so little potash applied, crops take most of their potassium from what the soil already holds.', product: 'Vital Potash', slug: 'vital-potash', analysis: 'N 11% · K₂O 44% · boron-coated', colour: '#B97F1C' },
]

export const HOME_COPY = {
  lossesH2: '3 nutrient problems in Pakistan’s fields',
  lossesLead: 'Nitrogen is lost to the air as ammonia and lost to water as nitrate. Phosphate is bound by calcium in the soil. Too little potash is applied, so crops take potassium from what the soil already holds. We make a product for each of these 3 problems.',
  verifyH2: 'Check the lab report for your bag by its batch number',
  verifyLead: 'We test every batch before it leaves the plant. Type the batch number printed on the bag to open the approved lab report for that batch, with the values our laboratory measured. There is no charge and no sample to post.',
  beyondH2: 'Where the nutrients go after harvest.',
  beyondLead: 'The loop that brings nutrients back instead of importing them again.',
  beyondCard: 'VAN recovers potassium from crop residue ash, instead of importing it. Silicon from the same ash is still in research and development.',
  makeH2: 'Tell us the problem and we will work on it with you.',
  makeLead: 'Or bring an idea and we shape it with you. Agronomy, chemistry, regulatory and quality sit on 1 site, so a problem does not get handed between 4 companies. Most of what leaves the plant carries a partner’s brand.',
  fourServices: [
    ['Agronomy', 'What the crop needs, at which stage, 28 published crop plans'],
    ['Chemistry', 'Formulation to your brief: ratio, form, solubility, particle size'],
    ['Regulatory', 'PSQCA registration run by VAN, under your name'],
    ['Quality', 'Accredited laboratory, every batch released against a certificate'],   // Tahir 7 Nov 2026 (CO-22): was "every lot"
  ],
  orderH2: 'Order direct from the plant',
  orderLead: 'Tell us the product, the pack size, the quantity and your district. We reply with price, availability and delivery.',
  orderSteps: ['Pick the product and the pack size', 'Send the quantity and your district on WhatsApp', 'We confirm price, availability and delivery'],
  startHere: [
    ['I grow a crop', '28 programmes, per acre, stage by stage', '#/crops'],
    ['I sell to growers', 'Range, pricing and territory', 'wa:distributor'],
    ['I want my own product made', 'Formulated, registered and manufactured by VAN', '#/partner'],
  ],
}

// About page (verbatim)
export const ABOUT = {
  // O-16a, 9 Sep 2026 (Tahir): "AGAIN SUCH A STUPID STATEMENT."
  // He was right and the sentence did not even parse. "Survive one" pointed back to "a research
  // farm", so it read as every claim having to survive a research farm. The writer meant a TRIAL,
  // then tried to loop the word back for effect and broke the sentence doing it. Said plainly now,
  // in the order it happened, which is his standing instruction for the whole site.
  // Old h1, for revert: 'Started as a research farm. Every claim here still has to survive one.'
  h1: 'How a product is developed, made, tested and traced, in 6 steps',
  lead: 'Trials have run on that ground every season since. VAN formulates, manufactures, registers and tests what it sells on 1 plant site in Lahore.',
  stats: [
    ['2009', 'Research farm founded, a year before the company. Trials have run on that ground every season since.'],
    ['17 years', 'Of trial results and the Punjab soil survey of 770,160 samples, tested in about 2016 to 2018, are the data we base every formulation on.'],
    // D-175: "drop biological" (Tahir 26 Sep); the plant runs granular, coated, liquid, water-soluble and compounded lines.
    // Tahir 7 Nov 2026 (CO-19): plant capacity wording; was "We make about 50,000 tonnes of product a year".
    ['About 50,000\u00A0t', 'Our annual capacity is about 50,000 tonnes of product, made at 1 plant site on granular, coated, liquid, water-soluble and compounded lines, working in shifts.'],
    // Audit, 9 Sep 2026: 22 licences are held across 20 brands, because a brand can hold more than
    // one. D-257, 18 Oct 2026: 34 in all, the 22 plus 12 on products ready for partners.
    // L2 fix 9 Nov 2026 (company W2 / profile W3, CO-8): the regulatory page lists 20 licensed brands; was "The 22 are published product by product."
    ['34 licences', 'On 20 of the 23 VAN brands (22 licences, against 8 Pakistan Standards) and on 12 products ready for partners to launch under their own name. The regulatory page lists the licence number of each of our 20 licensed brands.'],
    ['LAB 336', 'PNAC-accredited since 2024. Every production batch tested before it ships; every certificate on request.'],   // Tahir 7 Nov 2026 (CO-22): was "Every lot"
    // D-173: VAN is B2B; the farmer reach belongs to Vital Green (Tahir 25 Sep).
    ['23 brands', 'Registered and made in Pakistan.'],
  ],
  // D-170: "same site" implied the farm and the plant share one address; Tahir 25 Sep: don't say where the farm is.
  chain: 'A formulation is tried on the research farm, made at the plant, and tested in the laboratory before it ships. Most of what VAN makes is sold under other companies’ brands, for 14 national and multinational companies.',
  originH2: 'Crop nutrition was sold by the bag, not by what the crop needs at each stage.',
  origin1: 'Before VAN existed, nutrition was sold as 1 bag of this, 3 bags of that. The same prescription for a cotton grower on light soil and a rice grower on a heavy alkaline field in the next district. VAN’s founder saw that in the fields, season after season.',
  origin2: 'In 2007, VAN’s founder produced humic acid in Pakistan from Pakistani leonardite, the oxidised lignite that humic substances are drawn from, a material until then imported and, as far as VAN knows, not made here before. What followed built the rest: more chemistries were tried, then tested on ground VAN came to own. That research farm is what the company was built on.',
  // D-177, Tahir 26 Sep 2026, his own list: "2012 largest producer of humic acid in Pakistan, within 2 years;
  // launched boron coated nitropotash 2014 [on the coated line]; 2014 started soil analysis and baseline study;
  // 2015 adopted the framework for crop-specific and soil-specific nutrition; 2017 company-operated outlets
  // roll out; 2019 launched sulfur coated urea"; "land purchased 2010, building started 2011"; VGreen is 2019
  // (was 2018 here); "more than 150 people today" and no earlier team figures. No farmer numbers (D-173).
  // Revert: the v58 source zip.
  timeline: [
    { year: '2007', title: 'Humic acid made in Pakistan', text: 'Our founder made humic acid from Pakistani leonardite, a form of oxidised lignite from which humic substances are extracted. As far as we know, no one had made humic acid in Pakistan before. Until then, humic acid was imported.' },
    { year: '2009', title: 'The first research farm', text: 'We opened our first research farm in 2009, 1 year before the company was incorporated. Trials have run on our research farms every season since then, so by 2026 they cover 17 years.' },
    { year: '2010', title: 'The company and the land', text: 'Vital Agri Nutrients (Pvt) Ltd was incorporated, and we bought the land for the plant.' },
    { year: '2011', title: 'Building the plant', text: 'Building work on the plant started, and we made our first blended fertiliser.' },
    { year: '2012', title: 'Largest humic acid producer', text: 'By 2012, within 2 years of incorporation, we had become the largest producer of humic acid in Pakistan.' },
    { year: '2014', title: 'The coating line and the soil baseline study', text: 'We added a coating line to the plant. Its first product was boron-coated nitro potash, now sold as Vital Potash. We also began analysing soil ourselves and started a soil baseline study.' },   // Tahir 10 Nov 2026 (PR-N15, applied by vitalurea2): ', now sold as Vital Potash' added
    { year: '2015', title: 'Crop-specific and soil-specific nutrition', text: 'From 2015, we based our crop plans on the needs of each crop and each type of soil.' },
    { year: '2017', title: 'Our own shops', text: 'We opened our own shops, the Vital Agri Centers.' },
    { year: '2019', title: 'Vital Urea and Vital Green', text: 'We launched Vital Urea, our sulfur coated urea. In the same year, Vital Green was founded to sell our range direct to growers.' },
    // Tahir 7 Nov 2026 (KN-11): the recovered material is called potassium. Was: title 'Potash recovered from crop residue ash', text '... first commercial batch of potash recovered ...'.
    { year: '2023', title: 'Potassium recovered from crop residue ash', text: 'We made our first commercial batch of potassium recovered from crop residue ash.' },
    { year: '2024', title: 'Laboratory accreditation', text: 'Our laboratory was accredited by the Pakistan National Accreditation Council (PNAC) to ISO/IEC 17025:2017, under accreditation number LAB 336.' },
    { year: '2026', title: 'Patent, biological laboratory and a planned NP line', text: 'Pakistan Patent 144684 was granted for Vital Urea, our sulfur coated urea. We set up our first biological laboratory. A new granulation line for NP (nitrogen and phosphorus) fertilisers is planned for the plant site. Work on it has not started.' },
    // Tahir 7 Nov 2026 (CO-19): "make" changed to capacity wording.
    { year: 'Today', title: 'Where we are in 2026', text: 'More than 150 people work at VAN. Our plant can make about 50,000 tonnes of product a year. We make products under 23 registered brands of our own and for 14 other companies. We hold 34 licences from the Pakistan Standards and Quality Control Authority (PSQCA): 22 on our own brands and 12 on products ready for partner companies to launch. We have been a full member of CropLife Pakistan since 2024.' },  // D-316: CropLife membership added
  ],
  evidenceH2: 'More nutrient went on, and less crop came back for each kilogram.',   // Tahir 9 Nov 2026: same heading as the national picture section 3; was 'More went on. Less came back.'
  evidenceLead: 'Between 1999-2000 and 2023-24 Pakistan raised the nutrient it applies per acre by 68%. Wheat yield rose by 31%. Every kilogram now returns less than it did at the turn of the century, which is an argument about balance and timing, not about applying more.',
  evidenceMethod: 'Yield per kilogram of nutrient is a yield index divided by a nutrient-per-acre index, 2000 = 100. It sets an all-crop nutrient denominator against a crop-specific yield, so it assumes the split of nutrient between crops has not shifted dramatically. It is a partial factor productivity indicator, not a nutrient balance. Read it for direction, not the exact figure.',
  // D-170: plain heading (Tahir 25 Sep: the old one and its helper line were "too poor"). Also used on Home.
  boardH2: 'Board of directors',
  board: [
    { key: 'imtiaz-anjum-chaudhary', name: 'Imtiaz Anjum Chaudhary', role: 'Chairman', line: 'With VAN since the beginning', brief: ['Imtiaz Sahib put in the seed capital when VAN was an experimental station and an argument. Before there was a product, a plant or a customer to point at.', '17 years later he is still here, and the company has stayed on that path.', 'A retired civil servant, professionally trained in tax and finance, with a career spent in tax administration, finance and administration.'] },
    { key: 'ahmed-umair', name: 'Ahmed Umair', role: 'Founder and Chief Executive Officer', line: 'Made VAN’s first product, humic acid, in 2007', brief: ['Founder and Chief Executive Officer of Vital Agri Nutrients, a co-founder of Vital Green, and the person who has led the company since it was incorporated.', 'He chose a hard part of the economy to build in, fragmented, unevenly regulated, chronically short of working capital, and built inside those constraints rather than waiting for them to ease.', 'Serves as Prime Minister’s Coordinator on Agriculture and as Chairman of the National Agri-trade and Food Safety Authority (NAFSA); also an Independent Director at the National Credit Guarantee Company Limited, a Director of PAMRA, and Adjunct Faculty at the Lahore University of Management Sciences.', 'Currently on sabbatical from the company while serving in federal government.'] },
    { key: 'faisal-dawood', name: 'Faisal Dawood', role: 'Director', line: 'Vice Chairman, Descon', brief: ['Vice Chairman of Descon, where he leads the Power and Chemicals businesses and manages the group’s diversification portfolio.', 'Sits on the boards of several Descon companies and of Descon Technical Institute, and on the Board of the National Management Foundation at LUMS.', 'BSc in Materials Science and Engineering, Cornell University; MBA, Columbia University.'] },
    { key: 'ahmed-shoaib', name: 'Dr Ahmed Shoaib', role: 'Director', line: 'Product vision & R&D philosophy', brief: ['A medical doctor, with 15 years working in the United Kingdom.', 'His part here has been larger than a board seat: he shapes the product vision and the R&D philosophy, that soil, food and human health sit on the same chain, which places crop nutrition further upstream than the fertilizer industry usually places itself.', 'That reading is why fortifying the crop through its nutrition, not only raising the tonnage it yields, shapes what VAN develops.'] },
    { key: 'ahmed-uzair', name: 'Barrister Ahmed Uzair', role: 'Director', line: 'Legal, compliance & contracting', brief: ['The legal, compliance and contracting side of VAN is his work. The agreements, boundaries and protections that let VAN manufacture under somebody else’s brand without either side being exposed, across counterparties from national buyers to multinationals.', 'Barrister of Lincoln’s Inn and a Partner at AUC | Law since 2012, where he heads the firm’s corporate practice in technology and investment law.', 'Appointed by the Government of Pakistan to advise development finance institutions on a private equity and venture capital fund; has advised the SECP on Companies Act 2017 reform, and the Government of Punjab on the Lahore Smart City project.'] },
  ],
  whoToTalk: [
    { area: 'Commercial', text: 'Supply, pricing, manufacturing under a partner company’s brand, and distribution.', name: 'Muhammad Ali', role: 'Chief Commercial Officer', email: 'muhammad.ali@van.com.pk' },
    { area: 'Research and development', text: 'Formulation work, including new formulations, trials and plant capability.', name: 'Fahim Asghar', role: 'Lead, Plant and Product', email: 'fahim@van.com.pk' },
    // D-170, Tahir 25 Sep 2026: "Bilal Ahmed Khan is Chief Regulatory Officer, he handles licensing and
    // registrations." Laboratory analysis is off his card: the public contacts Sample Reception (D-168).
    { area: 'Regulatory', text: 'Product registration and PSQCA licensing.', name: 'Bilal Ahmed Khan', role: 'Chief Regulatory Officer', email: 'bilal@van.com.pk' },
    // Tahir, 9 Sep 2026: added Irfan here at his instruction, then supplied the other three
    // addresses himself, so all four carry a direct email. His LinkedIn was removed on 11 Sep at
    // Tahir's instruction so the four cards read the same.
    { area: 'Sindh', text: 'Dealerships, supply and farmer support across Sindh, including enquiries about a new dealership in the province.', name: 'Muhammad Irfan', role: 'Regional Business Head, Sindh', email: 'irfan@van.com.pk' },
  ],
  whoToTalkNote: 'Write to them directly, or ask for the person by name on +92 42 35762215, or on WhatsApp at +92 300 5003041.',
  // O-17, 9 Sep 2026: Tahir asked "WHO SAID THIS?" of the 6. Nothing he supplied says it, no
  // decision established it, and it contradicted the 7 dealers + 2 Vital Agri Centers he ruled the
  // same day. He ruled: PULL THE FIGURE. Replaced with the crop-plan count, which is countable on
  // this site. Revert: restore ['6', 'distributors carrying VAN brands'] as the first entry.
  closing: [['28', 'crop plans published, stage by stage'], ['23', 'registered brands'], ['About 50,000 t', 'annual capacity, across shifts'], ['LAB 336', 'PNAC · ISO/IEC 17025:2017']],
}

// Knowledge › Why Pakistan must shift (verbatim figures + sources)
export const NATIONAL = {
  h1a: 'Pakistan is not short of fertilizer.',
  h1b: 'It is short of nutrition that reaches the crop.',
  lead: 'VAN’s view is that Pakistan needs to shift from applying more nitrogen to balancing the nutrients it applies and improving the form, timing and placement of fertiliser, so that more crop is produced from each kilogram of nutrient applied. In 2023, Pakistan applied more fertiliser nutrient per acre of cropland than the world average and more than the United States (FAO). VAN’s calculation from national figures shows that, between 1999-2000 and 2023-24, nutrient applied per acre of arable land rose faster than the yields of wheat, rice and cotton and the average yield of all cereals. The yield for each kilogram of nutrient applied therefore fell for each of them. VAN’s reading is that these figures do not support the view that farmers need to apply more fertiliser to raise yields. The figures cannot show the effect of fertiliser on its own, because seed, irrigation, varieties and weather also changed over these years.',
  // D-143 (ruling 12): converted to per acre, kg/ha ÷ 2.471. Was title 'Fertilizer use per hectare of cropland, 2023',
  // unit 'kg of nutrient per hectare of cropland', rows 182 / 156 / 149 / 117 / 108 and the source without the
  // second sentence. Revert: restore those.
  // Tahir 7 Nov 2026 (CO-33): the unit gives the same definition as Home and the profile (N, P₂O₅ and K₂O added together).
  usePerHa: { title: 'Fertiliser use per acre of cropland, 2023', unit: 'kg of fertiliser nutrients (N, P₂O₅ and K₂O added together) per acre of cropland', rows: [['India', 73.7], ['Pakistan', 63.1], ['United Kingdom', 60.3], ['World average', 47.3], ['United States', 43.7]] as [string, number][], source: 'Our World in Data / FAO (2025), fertilizer use per hectare of cropland. Published in kg per hectare: India 182, Pakistan 156, United Kingdom 149, world average 117, United States 108. Divided by 2.471 for kg per acre.', note: 'In 2023, the United Kingdom applied 60.3 kg of fertiliser nutrient per acre of cropland and the United States 43.6 kg, both less than Pakistan’s 63.3 kg.' },
  // L1 editor 7 Nov 2026 (whyshift m15, m6): source names which ratios are VAN's ('The ratios to 1 tonne of potash'); 'lodging' explained.
  balance: {
    title: 'Nitrogen, phosphate and potash as shares of all fertiliser nutrient applied, 2023',
    pakistan: { N: 3808775, P: 994885, K: 45735, shareN: 78.5, shareP: 20.5, shareK: 0.94, perTonneK: '83 t N · 22 t P₂O₅' },
    india: { N: 20456400, P: 8306600, K: 1878600, shareN: 66.8, shareP: 27.1, shareK: 6.13, perTonneK: '11 t N · 4 t P₂O₅' },
    source: 'FAOSTAT, Fertilizers by Nutrient, via Our World in Data (2023). The ratios to 1 tonne of potash are VAN’s calculations. Sulfur, magnesium, zinc and boron are not shown, because the national figures record very little of them being applied.',
    text: 'VAN’s calculation from FAOSTAT shows that, in 2023, Pakistan applied 83 tonnes of nitrogen for every 1 tonne of potash, which is the same as 1.2 kg of potash for every 100 kg of nitrogen. Potash supplies potassium, which in the plant helps build cell walls, move sugars and regulate water use. Of all the nutrients, potassium does the most to protect a crop against lodging (the crop falling over), heat and drought.',
  },
  productivity: {
    // D-143: per acre and maunds an acre (kg/ha ÷ 2.471; kg/ha ÷ 40 ÷ 2.471). Was from 95.4 to 160.3 'kg/ha',
    // label '...per hectare of arable land...', wheat 2491 to 3264 'kg/ha', and rows y1/y2 in kg/ha (wheat 2491, 3264;
    // rice 2050, 2714; cotton lint 641, 717; all cereals 2404, 3634). Percentages unchanged. Revert: restore those.
    nutrientChange: { label: 'Nutrient applied per acre of arable land, 1999-2000 → 2023-24', from: 38.6, to: 64.9, unit: 'kg/acre', pct: '+68%', source: 'World Bank' },
    wheatChange: { label: 'Wheat yield over the same period', from: 25.2, to: 33.0, unit: 'maunds/acre', pct: '+31%', source: 'Pakistan Economic Survey' },
    rows: [
      { crop: 'Wheat', y1: 25.2, y2: 33.0, change: '+31%', perKg: '−22%' },
      { crop: 'Rice (cleaned basis)', y1: 20.7, y2: 27.5, change: '+32%', perKg: '−21%' },
      { crop: 'Cotton (lint)', y1: 6.5, y2: 7.3, change: '+12%', perKg: '−33%' },
      { crop: 'All cereals', y1: 24.3, y2: 36.8, change: '+51%', perKg: '−10%' },
    ],
    // L1 editor 7 Nov 2026 (whyshift m4, m5): base period '1999-2000 = 100' (was '2000 = 100'); source names the calculated column (was 'The ratio is VAN’s calculation.').
    method: 'The last column is VAN’s calculation: the yield index divided by the index of nutrient applied per acre, with 1999-2000 = 100. This measure is known as partial factor productivity: crop yield for each kilogram of nutrient applied. It uses the national figure for nutrient applied to all crops, so the same nutrient index is used in every row. It does not compare the nutrient applied with the nutrient taken out in the harvested crop. It shows the direction of the change; the exact percentages should not be relied on.',
    source: 'Nutrient per hectare of arable land: World Bank AG.CON.FERT.ZS (FAO), 95.4 and 160.3 kg/ha. Yields: Pakistan Economic Survey Table 2.5 (2009-10 and 2024-25 editions); all-cereal yield World Bank AG.YLD.CREL.KG. Yields as published in kg/ha: wheat 2,491 and 3,264, rice 2,050 and 2,714, cotton lint 641 and 717, all cereals 2,404 and 3,634. Converted at 1 hectare = 2.471 acres and 40 kg = 1 maund. The change in yield per kg of nutrient (last column of the table) is VAN’s calculation.',
  },
  // D-325, 4 Nov 2026: moved from Lassaletta et al. 2014 (pk 25, us 72, taken up by the crop) to FAO's Cropland Nutrient Balance, 2023, Tahir's ruling. Revert: the line above in the D-324 commit (84a19fe).
  nitrogen: { pk: 29, us: 71, world: 55, text: 'of the nitrogen added to Pakistan’s cropland is taken out in the harvested crop. FAO estimates that, of every 100 kg of nitrogen added to Pakistan’s cropland in 2023, about 26 kg were lost to the air and about 11 kg were lost to water.', source: 'FAOSTAT, Cropland Nutrient Balance, December 2025 release (2023, FAO estimates). Shahzad et al. (2019), Nature Sustainability, ranks Pakistan lowest for nitrogen use efficiency in its comparison set.' },
  bangladesh: 'On VAN’s calculation, Bangladesh produced 68% more paddy per kilogram of nitrogen applied to rice than Pakistan.',
}

// Lab (verbatim)
export const LAB = {
  h1: 'Lab reports for every VAN batch, and tests for any fertiliser.',
  lead: 'Every batch VAN makes is tested in this laboratory before it leaves the plant, and you can see the lab report for the batch you bought. To open it, enter the batch number printed on the bag. If you have fertiliser from any other manufacturer, send us a 500 g sample and we will run the tests you choose from our published price list.',
  whyH2: 'Why VAN built a laboratory',
  why1: 'VAN Lab is set up to give the same result when the same sample is tested twice. It uses written methods and calibrated instruments, runs reference standards alongside every set of analyses, puts 2 analysts on every sample, and has the Assistant Quality Control (QC) Manager review the work and the QC Manager sign the report.',
  why2: 'We work this way so that a result does not depend on who ran the test, on which day it was run, or on what anybody hoped it would show.',
  stats: [['21', 'fertiliser tests, each with a published price'], ['3 to 5', 'working days from confirmed booking to your report'], ['2', 'independent analysts on every sample'], ['Accredited', 'by PNAC to ISO/IEC 17025:2017 (LAB 336) for 8 of our 21 fertiliser tests']],
  scopeNote: '8 of the 21 tests VAN Lab performs are covered by PNAC ISO/IEC 17025:2017 accreditation, LAB 336. The other 13 are tests the laboratory runs outside that scope.',
  report: [['The measured value', 'For every parameter you asked for, as found in the sample you sent.'], ['The method used to measure it', 'Named on the report. A measured value only means something alongside the method that produced it, particularly for humic acid, where the extraction protocol defines what gets counted.'], ['A signature', 'Reviewed by the Assistant QC Manager and signed by the QC Manager, against a sample code.']],
  who: [['Farmers', 'Counterfeit and quality verification on fertilizer you have already purchased.'], ['Distributors', 'Incoming-goods verification on anything you stock, not only VAN product.'], ['Importers', 'Consignment testing with a published turnaround and a certificate from an accredited laboratory.'], ['Laboratories', 'Reference and umpire analysis, under the same blind protocol as everything else.']],
  cost: [['PKR 500 – 4,000', 'Per test, depending on the parameter. Every price for every test is on the price list. Nothing is “on request”.'], ['3 working days', 'For most tests, counted from confirmed booking. Humic acid is 4 days, because the determination itself runs 36 hours.'], ['500 g', 'The sample we need, by weight, whether solid or liquid. Enough for 2 analyses and a retained portion.']],
  pricesEffective: 'Prices effective 15 August 2026, in PKR.',
}

/**
 * 5 Oct 2026: number in, lab report out (rulings of 3 Oct 2026); the product step is gone.
 * 10 Sep 2026: the three steps used to describe a WhatsApp round trip, because that is all the page
 * could do. They now describe the check itself and keep WhatsApp as the fallback while the plant's
 * endpoint is being wired, which is what the page actually does today.
 */
export const VERIFY = {
  h1: 'We test every batch before it leaves the plant, and you can download the lab report for the batch in your bag',
  lead: 'Type the batch number printed on the bag to download the approved lab report for that batch as a PDF. There is no charge and no sample to post.',
  steps: [
    'Find the batch number printed on the bag.',
    'Type it above. The number is checked against the plant\u2019s own records.',
    'Open the lab report. It gives the batch’s physical status, moisture, particle size, pH and chemical analysis. For each test it shows the specification, the result and the test method. Every copy shows the batch number and the date it was downloaded.',
    'If the online check is not working, send the batch number on WhatsApp to +92 300 5003041 or by email to info@van.com.pk, and we will send you the lab report on the day you contact us.',
  ],
  // L1 editor fix 7 Nov 2026 (company-a B3): Sample Reception is in a separate building, not 'at our laboratory'. company-b m15: 1 term, 'the blind chain', as on the Lab page.
  blind: 'You can also have our product tested through the blind chain, in which the analysts do not know whose product they are testing. Send 500 g of the product to Sample Reception, which works from a separate building from our laboratory, as a normal paid test, at the published price. Sample Reception receives it like every other customer’s sample and gives it a code in place of the product name. Every sample is tested by 2 analysts, and neither of them knows that it is our product.',
  note: 'Our quality control laboratory is accredited by the Pakistan National Accreditation Council (PNAC) to ISO/IEC 17025:2017, the international standard for testing laboratories, under accreditation number LAB 336, for 8 of its 21 fertiliser tests. The laboratory rejects any batch that does not meet the product’s specification.',
}

// Make With Us (partner) — verbatim
/**
 * MAKE WITH US — rewritten 10 September 2026 after a long round of questions with Tahir.
 *
 * WHO THIS PAGE IS FOR, in his words: "THIS PAGE IS NOT FOR DEALERS AND DISTRIBUTORS. THIS IS FOR
 * SYNGENTA, FMC, FFC, ENGRO, ARYSTA, UDL, RUDOLF, BAYER, AND SUCH PAKISTAN NATIONAL AND
 * MULTINATIONAL PLAYERS... DEALERS AND DISTRIBUTORS ARE INTERESTED IN BRANDS AND VAN PRODUCT. BULK
 * BUYERS, WHITE LABEL, TOLL MANUFACTURING ARE INTERESTED IN LAUNCHING THEIR BRAND, OR MAKING THEIR
 * PRODUCT LOCALLY, OR REPLACING THEIR IMPORTED PRODUCT WITH A LOCAL PRODUCT."
 *
 * So the page never offers a VAN brand to carry. He was explicit: "WE SHOULDN'T SAY OPENLY TO SELL
 * VAN BRAND ON THIS PAGE. VAN BRAND IS ON A DIFFERENT PAGE." The distributor route has left this
 * page entirely.
 *
 * TWO ROUTES, NOT THREE. "We have not to offer the trial for the product which VAN has already
 * developed and trialled and validated, so it's 2 routes." A registered VAN product made under a
 * partner's name is simply the fastest case of route two, not a route of its own.
 *
 * WHAT CAME OFF, all at his instruction on 10 Sep: the four stat tiles; the "No surprises" promise;
 * the graduation rule; "Most of what VAN manufactures leaves the plant under somebody else's brand,
 * that is not a sideline, it is the business"; and the Become a distributor panel.
 *
 * NO CLIENT NAMES. His firewall rule stands, so LCI and Kisan Fertilizer are not on the page even
 * though he named them to explain the count.
 */
export const PARTNER = {
  kicker: 'VAN works with companies that are launching a crop nutrition brand, making locally a product they now import, or manufacturing under their own name',
  h1: 'Launch it under your name.',   // D-181, Tahir 26 Sep: "Launch it under your name. only"
  lead: 'We formulate, manufacture, register and test crop nutrition products that are sold under other companies’ brand names. You market and sell the product. We take it from formulation to the finished bag; under toll manufacturing, you supply the formulation.',   // Tahir 7 Nov 2026 (CO-4, also_changes): toll formulation is the client's

  /**
   * THE PROOF LINE, and it is the strongest thing VAN can say to this reader.
   *
   * Tahir explained the mechanism and confirmed it back: every product sold under a partner\u2019s brand
   * must be registered with VAN named as the manufacturer. So each partner brand is its own
   * registration file held against VAN\u2019s plant. One client has 8 products registered this way,
   * another has 7, and across all partners the plant holds more than 100.
   */
  proof: { v: '100+', l: 'partner brands registered with VAN as the manufacturer' },

  routesH2: '2 routes in.',
  routesLead: 'Which route you take depends on 1 thing: whether the product you need already exists here.',
  /**
   * Stages carry a SHORT label for the rail and the full line for the panel. The rail has to read
   * left to right at a glance, so "Product deck and technical data" cannot be the label on a node.
   * `own` is set only where the PARTNER has work, per Tahir: "only where it is not obvious."
   */
  routes: [
    {
      key: 'develop',
      tag: 'You bring a problem we have not solved yet',
      title: 'Developed to your brief',
      // Tahir 7 Nov 2026 (CO-27): measured to the market. CO-3: the 2-month product needed no new field trial.
      time: '7 to 12 months to market',
      timeNote: 'Most products developed to a brief take 7 to 12 months from brief to market, because the field trial must run through a full crop season and that time cannot be shortened. Across our 14 partners, the fastest product went from brief to market in 2 months and the slowest in 17 months. The fastest, at 2 months, was a product that needed no new field trial.',
      text: 'You tell us the market, the crop, the target price and the constraint the product must overcome. We develop the formulation, make it at our plant, run the trials and register the product.',
      stages: [
        // D-318, Tahir 26 Oct: "Change it to the 6 stages" (was 7: Your brief, Feasibility, Formulation, Field trial,
        // Registration, Test market, Commercial launch). Every line below reuses a sentence already on the site.
        { s: 'Feasibility', t: 'Feasibility', d: 'We check whether the product can be made at our plant, at the target cost and to the required specification.' },
        { s: 'Bench', t: 'Bench', d: 'Bench work in our laboratory on ratio, form, coating, chelation, solubility, pH and compatibility.' },
        { s: 'Pilot', t: 'Pilot', d: 'Produced on the same equipment that will run the commercial lot, so what works in the pilot still works at scale.' },
        { s: 'Trials', t: 'Trials', d: 'Trials on your crop, in the districts you sell into. This stage takes a full season and cannot be shortened.' },
        { s: 'Dossier', t: 'Dossier', d: 'We select the PSQCA standard and prepare the dossier.' },
        { s: 'Registration', t: 'Registration', d: 'We file the registration under your brand, with VAN named as the manufacturer.' },
      ],
    },
    {
      key: 'library',
      tag: 'You take something we have already developed',
      title: 'From our library to your first batch',
      time: 'About 3 months',
      timeNote: 'A library formulation reaches its first commercial batch in about 3 months, registration included. No trial is needed, because the formulation has already been trialled and validated.',
      text: 'We have finished formulations that do not yet carry a brand. They are listed in our formulation library under neutral codes until a partner company chooses one and gives it a brand name.',
      stages: [
        { s: 'Pick a code', t: 'Pick a formulation', d: 'You choose a formulation from the library.', own: 'you' },   // L2 fix 9 Nov 2026 (company W6, settled CO-9): exclusivity terms stay off this page
        { s: 'Deck and data', t: 'Product deck and technical data', d: 'After an NDA is signed, we provide the full analysis, specification, method, crop fit, shelf life and compatibility data.' },   // Tahir 7 Nov 2026 (CO-5)
        { s: 'Terms', t: 'Terms agreed', d: 'The code, volume, price and lead time are agreed before anything is filed.', own: 'both' },   // L2 fix 9 Nov 2026 (company W6, settled CO-9)
        { s: 'Your brand', t: 'Your brand and your label', d: 'You supply your name, your artwork and your pack design. At this stage the formulation becomes your product.', own: 'you' },
        { s: 'Registration', t: 'Registration', d: 'We file the registration under your brand, with VAN named as the manufacturer.' },
        { s: 'Team trained', t: 'Your team trained', d: 'Our agronomists brief your sales and field staff before the first bags are sold.' },
        { s: 'Launch', t: 'Test launch, then full commercial', d: 'A limited test launch, followed by full commercial volumes.', own: 'you' },
      ],
    },
  ],

  /**
   * THE 3 PARTNERSHIP MODELS AND THE RANGE SERVICE — 26 September 2026, D-185.
   *
   * Tahir: "make sure the site clearly tell the long term partnership model VAN offer to B2B
   * clients i.e. white labelling agreements, joint product development, licensing, toll
   * manufacturing." Asked which may be named publicly, he ticked white labelling, joint product
   * development and toll manufacturing, and then ruled licensing "not offered, remove it". Detail
   * level, his choice: "Name, definition and who does what", commercial terms off. Registration
   * under toll: "depends, say so". Time to first bag under toll: not stated.
   *
   * Every figure in the table is already on this page: about 3 months for a library formulation,
   * 7 to 12 months for a brief, 2 to 17 months across 14 partners. Nothing new is claimed.
   */
  modelsH2: '3 long-term models for working with us.',
  modelsLead: 'Each product is made under 1 of these 3 models, and a partner often uses 2 of the models at the same time, for different products. Commercial terms are agreed for each project and are not published.',
  modelsHead: ['Model', 'What we provide', 'What you provide', 'Registered under', 'Time to market'],   // L1 fix 10 Nov 2026 (m5): header now matches the cells (under whose brand or name); was 'How it is registered'. Who holds the registration is still not stated (CO-N13).   // Tahir 7 Nov 2026 (CO-27): was 'Time to first bag'. Tahir 10 Nov 2026 (CO-N13): was 'Who holds the registration'.
  models: [
    ['White labelling', 'A formulation we have already developed, trialled and registered. We make, test and pack it under your brand, review the label and its claims before print, and make repeat lots to a frozen specification.', 'Your brand, your artwork, your market and the selling.', 'We file it under your brand, with VAN named as the manufacturer.', 'About 3 months to the first commercial batch, registration included.'],
    ['Joint product development', 'The 6 development stages from your brief: feasibility, bench formulation in our laboratory, a pilot on the commercial line, trials on our research farms and on your plots if you want them, the dossier and the registration.', 'The brief: the market, the crop, the target price and the constraint the product must overcome. Your own demonstration plots, if you want trials there.', 'We file it under your brand, with VAN named as the manufacturer.', 'Most briefs take 7 to 12 months from brief to market. Across our 14 partners, the fastest product went from brief to market in 2 months and the slowest in 17 months. The fastest, at 2 months, was a product that needed no new field trial.'],   // Tahir 7 Nov 2026 (CO-27, CO-3)
    ['Toll manufacturing', 'Your own formulation, made on our 5 production lines to your specification. Every batch is tested in our laboratory (LAB 336, accredited by PNAC, the Pakistan National Accreditation Council, for 8 of its 21 fertiliser tests) and released against a certificate of analysis.', 'The formulation, the specification, the brand and the market.', 'Agreed for each project: under your brand or under VAN’s name.', /* Tahir 10 Nov 2026 (CO-N13): was 'Agreed for each project. We can file it either way.' */'Depends on the formulation and its registration. Agreed before the first lot.'],
  ] as string[][],
  // Tahir 7 Nov 2026 (CO-4): toll formulation is the client's; VAN's own stay VAN's. The "We do not license..." sentence is dropped (no negative line).
  modelsNote: 'Under white labelling and joint product development, the recipe and the process stay with VAN. Under toll manufacturing, the formulation is yours, and the manufacturing process stays with VAN.',

  /** "Building portfolios": his ruling of 26 Sep was that VAN designs the range, stated as a service. */
  rangeH2: 'We design a product range for your brand.',
  rangeLead: 'If your brand has no range of its own, you do not have to choose products from a list. We design the range around the crops, the regions and the sales channel you serve, starting from products we already make, and we keep adding to it.',
  rangeSteps: [
    ['Your crops, regions and channel', 'You tell us which crops your customers grow, in which districts, and whether you sell through dealers, to estates or to corporate farms. That is all we need to design a first range.', 'you'],
    ['A launch range from products we already make', 'We propose the products needed for the first season, each with the crop stage at which it is applied and the pack it comes in, based on our published crop plans.', 'VAN'],
    ['Additions from the library', 'We propose what to add in the second and third seasons from the 27 codes in the formulation library, and say which of them would need a trial first.', 'VAN'],
    ['Each product on its own route', 'A library formulation reaches its first commercial batch in about 3 months, and a product developed to your brief usually takes 7 to 12 months from brief to market. A range is therefore built up 1 product at a time.', 'both'],
  ] as [string, string, string][],

  /** Runs alongside both routes rather than sitting as one box near the end. */
  regH2: 'The regulatory layer, run by us.',
  reg: [
    ['Registration under your brand', 'We file the PSQCA registration under your brand ourselves, using the same process through which our own products were licensed.'],
    ['Label and claim review before print', 'We check that every claim on your label can be defended if the regulator or a competitor challenges it. Label claims are the part of a launch where partners are most often challenged.'],
    ['Why our plant holds more than 100 partner registration files', 'Every product sold under a partner’s brand must be registered with VAN named as the manufacturer. So each partner brand has its own registration file, naming our plant as the place of manufacture. Our plant holds more than 100 of these files, 1 for each partner brand.'],   // L1 editor fix 7 Nov 2026 (company-b M3, m7): 1 brand, 1 product, 1 file (Tahir's mechanism in the PROOF LINE note).
  ],

  /** Naming the limits is how every other page on this site earns its reader. This one too. */
  limitsH2: 'What we do not do.',
  limits: [
    ['We do not sell the product for you', 'We do not provide a sales force or dealers, and we do not create farmer demand. You own the market and do the selling.'],
    // Tahir 7 Nov 2026 (CO-4): toll formulation is the client's, so the card names the 2 models where VAN keeps the recipe.
    ['We do not hand over our own formulations', 'Under white labelling and joint product development, you sell the product under your name, but the recipe and the process stay with VAN.'],
    ['We will not put a claim on your label that a trial does not support', 'This applies even when your marketing department wants the claim.'],
  ],
  // Tahir 10 Nov 2026 (CO-N12): reordered, per line. Was '... A single lot is up to 50 tonnes, and the line runs up to 4 lots a week to the same frozen specification, so 50 tonnes is the limit for 1 lot, not for the volume you can order.'
  minimum: 'There is no minimum order. We produce in batches of 1 tonne. For an order smaller than 1 tonne, we make a 1 tonne batch and pack your order from it. A larger order is made in lots of up to 50 tonnes, each made of 1 tonne batches. The line for each product can make up to 4 lots a week, so an order is not limited to 50 tonnes.',   // D-317, Tahir's ruling 26 Oct 2026: was "A batch runs from 1 tonne. ... There is no minimum on the order itself."   // L1 fix 10 Nov 2026 (m1): the long sentence split; 'the line for that product' -> 'The line for each product'.

  /**
   * THE PORTFOLIO, AS NUMBERS — 11 September 2026.
   *
   * Tahir, 10 Sep: "Make With Us names nothing real. Every other strong page does. So how to handle
   * this?" His own ruling: as a portfolio, in numbers. VAN does not publish client names, and that
   * firewall is not negotiable, so the portfolio has to be made real without one.
   *
   * Every figure here is already published somewhere else on this site or is a commercial term
   * Tahir ruled on 10 September. Nothing is new and nothing is a client.
   *
   * THREE SLOTS ARE DELIBERATELY EMPTY. They render nothing until a number is put in, because a
   * placeholder on a page that argues about evidence is worse than a gap:
   *   partners      — how many companies, as against how many brands
   *   oldest        — the year the longest-running partnership started
   *   launchRange   — the fastest and the slowest a product has actually gone from brief to market
   */
  // Tahir 7 Nov 2026 (CO-12): no line saying that names are withheld.
  portfolioH2: 'Our partner portfolio in numbers.',
  portfolioLead: 'The figures below describe the work we do for our partners.',
  portfolio: [
    // PF-3 (profile group, 7 Nov 2026): the 8 and the 7 (largest partners) removed.
    { v: '100+', l: 'partner brands registered with VAN as the manufacturer', note: '14 companies hold these brands. A partner usually has several brands made at our plant. Each partner brand is 1 product, with its own registration file naming our plant as the place of manufacture.' },   // L1 editor fix 7 Nov 2026 (company-b M3, m7)
    // Tahir 7 Nov 2026 (CO-1): 11 -> 10 ready, N-26L back to Validated.
    { v: '27', l: 'unbranded formulations in the library, 10 ready to carry your name', note: 'Each is held under a code, and you can sell it under your own brand under a written agreement.' },
    { v: '34', l: 'PSQCA licences', note: '22 are on our own brands, under 8 Pakistan Standards. The regulatory page lists the licence number of each of our 20 licensed brands. 12 are on products ready for partners.' },   // L2 fix 9 Nov 2026 (company W2, CO-8): was "and each is listed with its licence number on the regulatory page"
    { v: '5', l: 'production lines', note: 'The 5 lines are granular, coated, liquid, water-soluble and compounded. The analytical laboratory is on the same site, and the biological laboratory opened in 2026.' },   // D-177, Tahir 26 Sep: 5 lines, lab and farm separate. Was 8 lines under one roof.
    // Tahir 7 Nov 2026: CO-19 annual capacity; CO-16 1 tonne batch made for a small order; CO-51 working days.
    { v: 'About 50,000\u00A0t', l: 'annual capacity', note: /* Tahir 10 Nov 2026 (CO-N12): minimum order reordered, per line; was 'A single lot is up to 50 tonnes, and the line can make up to 4 lots a week to the same frozen specification, so a larger order is made as several lots.' */ 'There is no minimum order. We produce in batches of 1 tonne. For an order smaller than 1 tonne, we make a 1 tonne batch and pack your order from it. A larger order is made in lots of up to 50 tonnes, each made of 1 tonne batches. The line for each product can make up to 4 lots a week, so an order is not limited to 50 tonnes. An order of up to 10 tonnes is ready to dispatch in 3 to 5 working days, counted from the day the order is confirmed. An order of 11 to 100 tonnes takes 7 to 18 working days. An order above 100 tonnes needs a production plan, and we agree its schedule with you.' },  // Lead 10 Nov 2026 (L3-8), from the Your Brand FAQ: the above-100-tonnes sentence added; bands unchanged.   // D-318: was "3 to 5 days under 10 t, 7 to 18 days from 11 to 100 t." (Tahir, 26 Oct)   // L1 fix 10 Nov 2026 (m1): the long sentence split; 'the line for that product' -> 'The line for each product'.
  ] as { v: string; l: string; note: string }[],
  /** Filled by Tahir. Each renders only when it carries a value. */
  portfolioPending: { partners: '14', oldest: '2010', /* PF-2 (profile group, 7 Nov 2026): back to 2010. D-177 had made it 2011. */ launchRange: '2 to 17 months' },

  whoH2: 'Who already works this way',
  // Tahir 7 Nov 2026 (CO-12): no line about withheld names; Rafhan and Descon are research partners, not clients.
  who: 'We manufacture for 14 national and multinational companies. In a meeting under a non-disclosure agreement (NDA), we can give a prospective partner specific details.',
  whoTypes: ['Multinational crop-protection companies', 'National agri-input companies', 'Sugar mills and corporate farms', 'Importers replacing a bought-in product'],
  // Tahir 7 Nov 2026 (CO-12): "client names are not shown" and "the partner ... is not named" removed; Rafhan and Descon named as research partners.
  firewall: 'Formulations built to client briefs and any data belonging to a client are never used to sell to anyone else. Our research partners Rafhan Maize Products and Descon Research Farm are named, with their agreement. Rafhan Maize Products is named for the Khaliqabad field programme, on the Vital Urea page and the application systems page, and for the 2023 maize trial on the Vital Urea page. Descon Research Farm is named for the 2024 maize trial on the Vital Urea page.',
  capability: [
    ['Physical forms', 'Granular \u00b7 powder \u00b7 crystalline soluble \u00b7 liquid \u00b7 pellet \u00b7 water-dispersible granule \u00b7 coated prill. We can make the same composition in more than 1 form, so the form does not dictate the composition.'],
    ['Pack range', 'Packs range from a 1 L bottle to a 1,000 kg bulk bag and a 1,000 L IBC (intermediate bulk container). Trade packs, estate packs and contract-farming volumes are filled on the same line as retail packs.'],
    ['Registration, run by us', 'We prepare the dossier and file the PSQCA registration under your brand, with VAN named as the manufacturer.'],
    ['Quality control', 'Our laboratory is accredited by PNAC to ISO/IEC 17025:2017 (Accreditation No. LAB 336) for 8 of its 21 fertiliser tests. Every batch is tested. A batch whose results fall outside our internal limits, which are tighter than the product specification, is rejected, and its result is not averaged with the results of batches that pass.'],   // Tahir 10 Nov 2026 (CO-N20): was 'outside the working window'
  ],
}

// Pipeline & Formulation Library — 25 codes (verbatim names/analyses/status from the live page)
// D-183, 26 Sep 2026: 'Feasibility' added for the dual release phosphate; every other status unchanged.
export type FormulationStatus = 'Feasibility' | 'Concept' | 'In development' | 'Field trials' | 'Validated' | 'Available'
// Tahir 7 Nov 2026 (CO-1): Available means already licensed; N-26L moved to Validated, so 8 -> 9 and 11 -> 10.
export const PIPELINE_STAGES: [FormulationStatus, string, number][] = [['Feasibility', 'technical and cost check', 1], ['Concept', 'defined, not yet at the bench', 1], ['In development', 'bench formulation work', 3], ['Field trials', 'research farm and partner plots', 3], ['Validated', 'specification and data locked', 9], ['Available', 'ready to carry your name', 10]]
export const FAMILIES: Record<string, string> = { N: 'Nitrogen efficiency', P: 'Phosphorus', K: 'Potash', PK: 'P+K synergy', MX: 'Micros & secondaries', BIO: 'Biologicals' }
export const LIBRARY: { code: string; family: keyof typeof FAMILIES; title: string; text: string; status: FormulationStatus }[] = [
  { code: 'N-22S', family: 'N', title: 'Nitro Sulfur. N 22 · elemental S 18', text: 'Nitrogen carried with elemental sulfur rather than sulfate, so the product releases over weeks instead of all at once.', status: 'Validated' },
  { code: 'N-26L', family: 'N', title: 'Liquid nitrogen 26% with zinc and boron · 2 grades', text: 'A liquid nitrogen fertiliser for centre-pivot injection and foliar spray, carrying its nitrogen in 3 forms.', status: 'Validated' },   // Tahir 7 Nov 2026 (CO-1): was 'Available'; Validated until its licence is issued.
  { code: 'N-17L', family: 'N', title: 'VAN Liquid CAN. N 17 · Ca 7.2', text: 'Liquid calcium ammonium nitrate for fertigated horticulture, supplying nitrogen and calcium in the same solution rather than as separate products.', status: 'Available' },
  { code: 'N-15C', family: 'N', title: 'Calcium nitrate. N 15.5 · Ca 18.4', text: 'Chloride-free nitrate nitrogen with a high calcium content. Growers of high-value horticultural crops buy this class of product as an import.', status: 'Validated' },
  { code: 'P-44L', family: 'P', title: 'Liquid foliar phosphorus · P₂O₅ 44%', text: 'High-analysis foliar phosphorus with added micronutrients, formulated for Pakistan. Because it is taken up through the leaf, it avoids soil fixation entirely.', status: 'Available' },
  { code: 'NP-540', family: 'P', title: 'NP 5:40. Dual-release phosphate', text: 'A phosphate that releases in 2 stages, a fast stage and a slow stage, from a single application.', status: 'Validated' },
  { code: 'NP-838S', family: 'P', title: 'NP 8:38 + sulfur. Slow-release, fixation-resistant', text: 'Sulfur acidifies the soil immediately around the granule. Unlike NP-540, the grade does not split the phosphate supply into 2 stages; it is formulated to resist calcium phosphate fixation.', status: 'Validated' },
  { code: 'UP-44', family: 'P', title: 'Urea phosphate · 17:44:0 and 12:44:0', text: 'Nitrogen and phosphorus in 1 fully soluble salt that is acidic in solution.', status: 'Validated' },
  { code: 'KN-44', family: 'K', title: 'Potassium nitrate · 3 grades', text: 'Chloride-free potassium with nitrate nitrogen, for high-value horticulture and salt-sensitive crops.', status: 'Validated' },
  { code: 'K-45L', family: 'K', title: 'High-purity liquid foliar potash · K₂O 45%', text: 'Chloride-free potassium in a low-salt-index, neutral-pH liquid, formulated for foliar and drone application.', status: 'Validated' },
  { code: 'PK-82', family: 'PK', title: 'High P+K reproductive complex', text: 'P₂O₅ 42 · K₂O 40, a total of 82 nutrient units, for the reproductive stage, when yield and quality are set.', status: 'Available' },
  { code: 'NPK-128M', family: 'PK', title: 'NPK 12:12:18 + micronutrients', text: 'An NPK for the middle and late crop stages, with more potash than nitrogen or phosphate.', status: 'Available' },
  { code: 'NPK-19', family: 'PK', title: 'NPK 19:19:19 · 3 grades', text: 'A fully soluble balanced grade, in foliar, fertigation and drone (ULV) specifications.', status: 'Validated' },
  { code: 'NPK-10', family: 'PK', title: 'NPK 10:10:10, iron-coated · the corrective grade', text: 'It is for a crop that has received less nutrient than its crop plan called for up to its current stage, at a dose that does not overload the soil.', status: 'Available' },
  { code: 'V-Crop series', family: 'PK', title: 'Crop-specific NPK grades · 4 in development', text: 'V-Potato 10:5:35 · V-Citrus 16:6:28 · V-Rice 12:10:25 · V-Wheat 21:7:19 with zinc 1.5%.', status: 'In development' },
  { code: 'V-Stage series', family: 'PK', title: 'Stage-specific grades · 3 in trial', text: 'Vegetative 14:21:16 · Flowering Booster 8:34:14 · Fruiting Booster 12:8:32.', status: 'Field trials' },
  { code: 'MX-Z05', family: 'MX', title: 'Chelated zinc 5%', text: 'Chelated zinc that stays available at pH 8, where zinc sulfate largely precipitates.', status: 'Available' },
  { code: 'MX-ZB3', family: 'MX', title: 'Zinc 12% + boron 3%', text: 'Corrects, in a single foliar spray, the 2 deficiencies that most often limit yield where the NPK supply is already adequate.', status: 'Available' },
  { code: 'MX-F05', family: 'MX', title: 'Chelated iron', text: 'For lime-induced chlorosis in orchards on calcareous soil.', status: 'Available' },
  { code: 'BIO-H50F', family: 'BIO', title: 'K-humate 50 + fulvic 10 + potash 10', text: 'Concentrated humate for soils under 1% organic matter.', status: 'Available' },
  { code: 'BIO-H40', family: 'BIO', title: 'K-humate 40 + fulvic 10 + potash 10', text: 'The established humate concentration in the library.', status: 'Available' },
  { code: 'BIO-P01', family: 'BIO', title: 'PSB bio-fertiliser', text: 'Phosphorus-solubilising bacteria from strains isolated locally and selected for Pakistani soil pH and climate.', status: 'Field trials' },
  { code: 'BIO-P01L', family: 'BIO', title: 'Liquid PSB inoculant', text: 'The same phosphorus-solubilising bacteria in a liquid carrier, for fertigation lines and spray tanks.', status: 'In development' },
  { code: 'BIO-M01', family: 'BIO', title: 'Mycorrhizal inoculant', text: 'A mycorrhizal inoculant that extends the reach of the root system, so that the crop can take up the phosphorus released by the phosphorus-solubilising bacteria in BIO-P01.', status: 'In development' },
  { code: 'BIO-S01', family: 'BIO', title: 'Bio Dividend. Seed treatment', text: 'A biological seed treatment. Treating the seed is the lowest-cost way in the season to place nutrition exactly where the root will grow.', status: 'Field trials' },
  // D-183, Tahir 26 Sep 2026: "We have to add 2 products more, one at concept stage and one at
  // feasibility and scoping stage." Codes proposed by Claude, awaiting his approval. No figure beyond
  // the 50% potash he gave. Mechanism text is his own description, tidied; no outcome is claimed.
  { code: 'K-50DC', family: 'K', title: 'Dual coated potash · K₂O 50', text: 'A potash granule with 2 coatings, boron and silicon, so that the boron and the silicon are applied exactly where the potash is applied.', status: 'Concept' },
  { code: 'P-DRC', family: 'P', title: 'Dual release phosphate with a calcium-binding shell', text: 'An outer layer breaks down first and binds the free calcium around the granule before that calcium can fix the phosphate. The granule then supplies a fast-release phosphate fraction for the seedling, followed by a slow-release fraction for the rest of the season.', status: 'Feasibility' },
]

// Simulator (in development — the ONE thing allowed to be "coming soon"). Preview is illustrative only.
export const SIMULATOR = {
  // Tahir, 9 Sep 2026: "Say, Beta testing, 26 crops live by end of SEP, ask people provide ideas if
  // they have something to share before next upgrade." The page had been saying "coming soon" while
  // wheat and potato were already live on it, which contradicted itself.
  kicker: 'Beta testing · wheat and potato live now',
  // D-136 (owner, 24 Sep night: "nutrients is 1/4 not 1/10"; wheat weights 15+9 = 24%). Was 'VAN Yield & Discipline
  // Simulator. Nutrition is 1 of 10 things that decide yield.' and the HOME_SLIDES[2] title 'Nutrition is 1 of 10
  // things that decide yield.' Revert: restore both.
  // L1 fix 7 Nov 2026 (crops-a 7, crops-b M1): 1 name for the tool across the site, "farm discipline simulator"
  // (Tahir's own name for it, 9 Sep 2026). Was 'VAN Yield and Discipline Simulator'. The choice is open to Tahir.
  h1: 'VAN’s farm discipline simulator',
  // Tahir 7 Nov 2026 (CR-1): was 'In VAN’s model estimate for wheat, nutrition accounts for about 1/4 of the yield, and sowing, seed, water, weeds and pests account for the rest.' Simulator pages also take the watering example.
  lead: 'Yield depends on doing every task on time: sowing date, seed and plant population, fertiliser at the right stage, irrigation on schedule, and control of weeds, pests and disease. Crop nutrition is 1 of these tasks. A task missed at its time can cost yield that extra work later may not recover. VAN’s farm discipline simulator shows how each task, and its timing, changes the yield. For example, a crop that needs water every week and misses 2 waterings early in the season does not get that yield back from extra waterings later, even if the season’s total is the same. The simulator scores how a season was managed, including when the crop was sown, how it was watered and how dense the stand of plants is, and shows which practices are lowering the yield.',
  /**
   * O-10, 9 Sep 2026. Tahir: "illustrative SHOULDNT LOOK LIKE A TOY... RATHER THEN SAYING SIMPLY, WE
   * SHOULD SAY IRRIGATION, ON TIME, ALL ON TIME, ONE MISSING, DELAYED, 1 ETC, SO SHOULD CAPTURE MORE
   * VARIABLES EVEN IF ITS NOT LIVE."
   *
   * Four dials with two or three options each is a toy: a farmer reads it, sees that his season is
   * not in there, and stops believing the rest of the page. Nine now, each in the words a grower
   * actually uses about his own field, and each option is a real thing that happens rather than a
   * severity grade. No weight, coefficient or figure is attached to any of them — this preview shows
   * DIRECTION only, and the live per-crop simulators (wheat and potato) carry the real lever sets.
   *
   * Order matters: they run in the order the season runs, so reading down the list is reading
   * through a year.
   */
  dials: [
    { key: 'land', label: 'Land preparation', options: ['Levelled and ploughed in time', 'Ploughed, not levelled', 'Rushed, sown into a rough seedbed'] },
    { key: 'sowing', label: 'Sowing date', options: ['Inside the window', '10 days late', '20 days late', 'A month late'] },
    { key: 'seed', label: 'Seed and stand', options: ['Certified seed, full stand', 'Own seed, full stand', 'Thin stand, gaps in the rows', 'Thin and patchy'] },
    { key: 'basal', label: 'Basal fertiliser', options: ['Placed at sowing', 'Broadcast at sowing', 'Broadcast after sowing', 'Skipped'] },
    { key: 'irrigation', label: 'Irrigation', options: ['Every irrigation on time', '1 delayed', '1 missed', '2 missed', '2 missed and 1 late'] },
    // L1 7 Nov 2026 (crops-b m18): was 'Top-dressing nitrogen', a term the plans do not use. Key unchanged.
    { key: 'topdress', label: 'Nitrogen after sowing', options: ['Split, each on time', 'Split, 1 late', 'All at once, early', 'All at once, late'] },
    { key: 'weeds', label: 'Weeds', options: ['Cleared on time', 'Cleared late', 'Left in the crop'] },
    { key: 'micro', label: 'Zinc and boron', options: ['Applied at the right stage', 'Applied, wrong stage', 'Not applied'] },
    { key: 'harvest', label: 'Harvest', options: ['At maturity', 'A week late', '2 weeks or more late'] },
  ],
  onCourse: 'No practice is set to an option that lowers the yield.',
  previewNote: 'The preview dial shows only whether a practice is lowering the yield; it gives no yield figure. It uses a shorter list of practices than the wheat and potato simulators, which score 10 practices each.',   // L1 7 Nov 2026 (crops-b M1): was "the working simulators for wheat and potato"
  // L2 fact check 9 Nov 2026 (crops-b W4, Tahir's CO-11 of 7 Nov: "the other 26 are planned, no date"). Was 'Simulators for 26 more crops are being built.'
  betaNote: 'Simulators for the other 26 crops are planned. If the simulator leaves out a practice that lowers the yield on your own field, tell VAN before the next upgrade, and it will be added.',
  inputs: ['Crop and variety, from Pakistan’s own list of varieties rather than a generic list.', 'District and soil, from the 770,160 samples of the Punjab soil survey, taken about 2016 to 2018, and VAN’s own samples. If you have a laboratory soil report, its readings will be used instead of the district figures.','Target yield, in maunds per acre, compared with what the district can produce.', 'Sowing date, as an exact date rather than a month.', 'Irrigation: canal, tube well or both, and the schedule you can keep.', 'Seed rate and plant population (the number of plants that come up).', 'Cropping pattern: what the field grew before (rice–wheat, cotton–wheat, cane and ratoon).', 'Practices: the weed control window, nitrogen after sowing and the harvest window.'],   // L1 7 Nov 2026 (crops-b m17, m18): "will be used"; "nitrogen after sowing" was "top-dressing"
  // Tahir 9 Nov 2026 (T2): the list under "What the next version will show you" is in the future tense. Was: 'Your attainable yield on your field, with the practices you described.', 'Your discipline score, which shows ...', 'The nutrients needed, in kilograms: ...', 'The VAN brands that supply these nutrients, ...', 'How much yield each missed or late practice loses, and how to correct it.'
  outputs: ['Your attainable yield on your field, with the practices you will enter.', 'Your discipline score, which will show how well the season was managed, the practices that support your target, and the practice that loses you the most yield.', 'The nutrients the crop will need, in kilograms: N, P₂O₅, K₂O, the secondary nutrients and the micronutrients, stage by stage, after allowing for what the soil supplies.', 'The VAN brands that will supply these nutrients, with the stage, method and pack for each, from VAN’s published crop plans.', 'How much yield each missed or late practice will lose, and how to correct it.'],
  // Tahir 10 Nov 2026 (CR-N9): was 'of trial records from VAN’s research farms, starting in 2009'.
  builtOn: [['17 years', 'of trial records since 2009 from the research farms VAN now runs'], ['770,160', 'soil samples from the Punjab soil survey, taken about 2016 to 2018, combined with VAN’s own samples']],   // L1 fix 10 Nov 2026 (m8): 'starting in 2009' moved next to 'records'; 'now runs' kept (CR-N9).
}

// Application methods (crop pages, verbatim)
export const METHODS = [
  // L1 7 Nov 2026 (crops-a 6): "before or at sowing" and "the first irrigation" removed: the plans also broadcast urea and CAN on a standing crop.
  ['Broadcasting', 'In broadcasting, the fertiliser is spread evenly over the soil surface, then mixed in by tillage or washed in by irrigation. Where a plan row says “Drill at sowing; broadcast if no drill”, drill the fertiliser, and broadcast it only if no drill is available.'], // L2 fact check 9 Nov 2026 (crops-b W3): many plan rows say plain "Broadcasting" for basal granules. Was "For granular fertiliser applied at sowing, VAN’s plans say to drill it, and to broadcast it only if no drill is available."
  ['Placement', 'In placement, the fertiliser is drilled or laid in the furrow or in a narrow strip at sowing, about 5 cm beside and below the seed, so the nutrient sits where the young root will reach it rather than across the whole field. For every granular fertiliser VAN makes for use at sowing, placement is the first choice, side dressing the second and broadcasting the last.'],
  ['Side dressing', 'In side dressing, the fertiliser is applied along the rows of a standing crop after it has established, and the field is then irrigated.'],
  ['Fertigation', 'In fertigation, the fertiliser is dissolved in the irrigation water, so the dose reaches the crop with the water at the stage it is needed.'],
  ['Spray', 'In spraying, the fertiliser is dissolved and sprayed onto the leaves, for nutrients the crop can take up through its leaves.'],
]
// L1 7 Nov 2026 (crops-a 16): the plans also fertigate CAN and ammonium sulfate (catalogue rows), so both are named. Was '..., the product is ordinary urea, which is a different material.' Same change in VITAL_UREA_RULE_ORCHARD.
export const VITAL_UREA_RULE = 'Vital Urea is a coated, slow-release urea. Apply it by drilling at sowing (beside and below the seed, never touching it), by side dressing or by broadcasting. Never apply it by fertigation. Where the plan shows nitrogen applied by fertigation, the product is ordinary urea, calcium ammonium nitrate (CAN) or ammonium sulfate, not Vital Urea.'
// 6 Nov 2026: orchard plans (citrus, mango, guava, date palm) name no sowing and no drilling, so their pages use these
// texts instead of the field-crop ones above. Same methods; only the references to sowing and drilling are left out.
export const METHODS_ORCHARD = [
  ['Broadcasting', 'In broadcasting, the fertiliser is spread evenly over the soil surface, then worked into the soil or washed in by irrigation.'],
  ['Placement', 'In placement, the fertiliser is put into the soil in a furrow or a narrow strip, so the nutrient sits where the roots will reach it rather than across the whole field.'],
  ['Side dressing', 'In side dressing, the fertiliser is applied along the rows of a standing crop after it has established, and the field is then irrigated.'],
  ['Fertigation', 'In fertigation, the fertiliser is dissolved in the irrigation water, so the dose reaches the crop with the water at the stage it is needed.'],
  ['Spray', 'In spraying, the fertiliser is dissolved and sprayed onto the leaves, for nutrients the crop can take up through its leaves.'],
]
export const VITAL_UREA_RULE_ORCHARD = 'Vital Urea is a coated, slow-release urea. Apply it by side dressing or by broadcasting. Never apply it by fertigation. Where the plan shows nitrogen applied by fertigation, the product is ordinary urea, calcium ammonium nitrate (CAN) or ammonium sulfate, not Vital Urea.'

// Wheat crop page (verbatim)
export const WHEAT = {
  h1: 'Wheat: the crop plan per acre, stage by stage.',
  lead: 'VAN’s published wheat plan covers 5 stages, from land preparation to grain formation and maturity. Its products are arranged in 7 nutrient groups, and it uses VAN brands together with ordinary urea.',
  meta: ['5 stages', 'Per acre', 'Reissued Aug 2026'],
  pdf: 'plans/Wheat-Nutrition-Plan.pdf',
  // L1 10 Nov 2026 (crops 2): the plan rows now print the rate and the pack size as 1 phrase, so the example follows them. Was 'Rates are per acre. The figure after each rate is the size of 1 full bag or pack, in kg or litres. For example, “½ bag · 25 kg” means ½ of a 25 kg bag, which is 12.5 kg.'
  tableNote: 'Rates are per acre. Each rate names the size of its bag or pack, in kg or litres. For example, “½ of a 25 kg bag” is 12.5 kg.',
  gdd: [
    // Tahir 7 Nov 2026 (CR-7): was '... basal nitrogen dose (Vital Urea) are worked into it.' (the plan rows say 'Drill at sowing; broadcast if no drill').
    // Tahir 10 Nov 2026 (EN-11): Vital Urea moved out of the drilled list; it goes on at sowing or first irrigation.
    // L1 10 Nov 2026 (crops 1, Q1, Q3): the Vital Urea sentence names the method and the time, as the plan row does (EN-7, EN-11). Was 'Vital Urea goes on at sowing or at the first irrigation.'
    // Tahir 10 Nov 2026 (R3-4): broadcast added as the last choice, to match the plan row. Was '... or side-dressed at the first irrigation.'
    { stage: 'Land Preparation', gdd: 'Before sowing', das: 'Before sowing', oct20: 'Before 20 Oct', nov1: 'Before 1 Nov', nov20: 'Before 20 Nov', events: 'The soil is prepared, and the phosphate (Green Phosphate), potash (Fusion Potash) and humic acid (Humi Grow) are drilled in at sowing, or broadcast and worked in before sowing if there is no drill. The first nitrogen dose, Vital Urea, is drilled in at sowing, or side-dressed at the first irrigation; if neither is possible, it is broadcast. This stage is a field operation, not a stage of crop growth.' },
    { stage: 'Germination', gdd: '0–150', das: '0–13', oct20: '20 Oct–30 Oct', nov1: '1 Nov–13 Nov', nov20: '20 Nov–8 Dec', events: 'The seed takes up water (imbibition), the first root (radicle) appears and the shoot (coleoptile) comes through the soil. No ordinary urea is given at this stage. The first nitrogen dose, Vital Urea, is listed under Land Preparation.' },   // L1 10 Nov 2026 (crops 1, 10, Q1): Vital Urea is named once, in Land Preparation; here only a pointer. Was '... The first nitrogen is Vital Urea, given at sowing or at the first irrigation. No ordinary urea is given at this stage.'   // Tahir 10 Nov 2026 (EN-11b): the Germination urea row is removed. Was '... Apply the first dose of ordinary urea 8 to 10 days after sowing (DAS) if the soil is moist enough; otherwise wait for the first irrigation.'
    { stage: 'Early Growth', gdd: '150–450', das: '13–55', oct20: '30 Oct–27 Nov', nov1: '13 Nov–25 Dec', nov20: '8 Dec–13 Feb', events: 'The first true leaf emerges and tillers begin to form. Zinc deficiency symptoms often appear at this stage, especially on alkaline soils.' },
    // Tahir 7 Nov 2026 (CR-14): 'and micronutrient sprays' deleted; the plan has VL-Micromix at Early Growth only.
    { stage: 'Grand Growth', gdd: '450–900', das: '55–132', oct20: '27 Nov–22 Feb', nov1: '25 Dec–12 Mar', nov20: '13 Feb–29 Mar', events: 'Tiller formation and leaf growth reach their maximum. This is the period of highest nutrient demand and the time for mid-season nitrogen applications. Foliar potash (K) sprays are applied at this stage.' },
    // Tahir 7 Nov 2026 (CR-13 (3)): '900–1400+' written '900–1,400+' to match the caption's '1,400'.
    // L1 7 Nov 2026 (crops-b m1): 'anthesis' written out as 'flowering (anthesis)'.
    { stage: 'Grain Formation & Maturity', gdd: '900–1,400+', das: '132–167', oct20: '22 Feb–6 Apr', nov1: '12 Mar–16 Apr', nov20: '29 Mar–28 Apr', events: 'Boot stage, flowering (anthesis), grain fill, dough stage and maturity. Nitrogen applications after boot are kept to a minimum, and no new nutrient is applied once grain fill begins.' },
  ],
  // D-177, Tahir 26 Sep 2026: "Fix it from the site's own degree-day column." The days and dates below were
  // 0–10 / 10–25 / 25–50 / 50–120 (maturity by Feb 8 to Mar 10). Now worked from the degree days on Lahore
  // 1991-2020 normals. The days column is for a Nov 1 sowing. Revert: the v58 source zip.
  // L1 7 Nov 2026 (crops-b m21): first sentence reordered so the subject sits next to its verb; no figure changed.
  gddNote: 'Growing degree days measure the heat a crop receives: for each day, count the degrees by which the day’s average temperature is above 10 °C, then add up these daily figures over the season. A Punjab wheat season comes to about 1,400 growing degree days. The days and calendar dates are calculated from the degree days using Lahore’s temperature normals for 1991 to 2020, so they describe a normal season at Lahore, not your own district or the weather of any particular year. The days-after-sowing column is for a 1 November sowing. Each sowing date has its own column because a crop sown on a different date meets different temperatures, and so passes through the stages at a different pace. Counted from 0 °C instead of 10 °C, the same season would come to roughly 3,000 degree days.',
  deficiency: [
    { nutrient: 'Nitrogen (N)', early: 'Older, lower leaves turn evenly yellow (chlorosis). The yellowing moves up the plant as the deficiency becomes more severe.', timing: 'Symptoms are most visible from the Germination stage to the Early Growth stage (7 to 30 DAS) if the basal nitrogen dose was too low.', indicator: 'Affected plants are noticeably paler and shorter than neighbouring plants that receive adequate nitrogen.' },
    // Tahir 7 Nov 2026 (CR-6): '(7 to 14 DAS)' became '(0 to 13 DAS)', the Germination range in the stage table.
    { nutrient: 'Phosphorus (P)', early: 'Young leaves may turn purple (from a pigment called anthocyanin), especially at the leaf edges and at the base of the stem. The root system is stunted and fibrous.', timing: 'Wheat needs phosphorus most at the Germination stage (0 to 13 DAS), when its roots are forming. A late diagnosis limits how much can be corrected.', indicator: 'Plants are stunted and dark green, and their growth is delayed. Purple stems are a clear sign of phosphorus deficiency.' },
    { nutrient: 'Zinc (Zn)', early: 'Yellowing between the veins (interveinal chlorosis) first appears on new leaves and is most severe at boot stage. In Punjab’s alkaline soils, zinc is chemically fixed, so the crop cannot take it up even when total soil zinc is adequate.', timing: 'Symptoms often appear suddenly at the change from the Germination to the Early Growth stage, or at boot stage.', indicator: 'The yellowing between the veins is easy to see. Plants may partly recover if the deficiency is corrected early with a foliar zinc spray or zinc-enriched fertigation.' },
  ],
  notTell: ['This crop plan is a general plan, set per acre for a typical crop on a typical soil. It is not a prescription for your field, it does not replace a soil test, and it does not predict the yield your field will give.'],
}

// Circular economy (live home + circular page)
export const CIRCULAR = {
  h2: 'Recovering potassium from crop residue ash',
  lead: 'VAN recovers potassium from the ash of crop residue burned in boilers, and uses it in its own fertiliser in place of imported potash. Recovery of silicon from the same ash is still in research and development.',
  // L1 editor fix 7 Nov 2026 (company-a m8): Home speaks as 'we'.
  ash: 'We recover potassium from crop residue ash and use it in place of imported potash. Recovery of silicon from the same ash is still in research and development.',
}

// Standing rules that the demos must respect (from Start Here.md) — for reference in code comments
export const RULES_FOR_DEMO = [
  'No invented numbers, trials, licences, agronomic claims or coefficients.',
  'No performance claim without a trial we can point to.',
  'No client or partner names (Rafhan Maize Products and Descon Research Farm are the 2 cleared exceptions, D-316).',
  'Registration is PSQCA-only. Publish licence numbers, never expiry dates.',
  // Superseded 11 Sep 2026: the simulator is LIVE on wheat and potato, so "coming soon" is no longer
  // allowed for it either. The tools page roadmap is where unbuilt work is named, with what it waits on.
  'Nothing is described as coming soon. Unbuilt work is named on the tools page with what it is waiting on.',
  'kisan@van.com.pk appears on crop pages only. Never Home, footer or About.',
  'Never write "one site near Lahore".',
  'Fertigation, drip, pivot, drone and foliar are five distinct delivery methods, never synonyms.',
]
