// Hand-transcribed from the live site (VAN Live Site, 31 Aug 2026 — van.com.pk).
// RULE: every number and claim below exists on the live site or in its cited sources.
// Nothing may be added here that is not already published by VAN. No performance claims.

export const CONTACT = {
  company: 'Vital Agri Nutrients (Pvt) Ltd',
  short: 'VAN',
  tagline: 'Crop nutrition engineered, manufactured, registered and tested in Pakistan.',
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
  verify: (batch: string) => wa(`Hello VAN. Please send me the certificate of analysis for the product ____ and batch number ${batch || '____'}`),
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
  licences: 22,
  standards: 8,
  lab: 'LAB 336',
  labStd: 'PNAC · ISO/IEC 17025:2017',
  patent: '144684',
  patentLabel: 'Pakistan Patent',
  // distributors: removed 9 Sep 2026 — unsourced. Restore only with a number Tahir supplies.
  // D-177: farmersDirect ('10,000+') deleted. Farmer numbers are not quoted on VAN pages (D-173) and nothing reads it now.
  // D-141 (owner, 24 Sep night): about 50,000 t is actual output, not capacity. Was '~50,000 t'. Revert: restore it.
  capacity: 'about 50,000 t made a year',
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
  ownBrandOpen: 23,
}

// Live home — hero slides (verbatim)
export const HOME_SLIDES = [
  { kicker: 'What this soil does', title: 'Made for Pakistani soil.', lead: 'Most of Punjab’s farmland is alkaline and calcareous: 69.1% of 770,160 samples are above pH 8. VAN builds a product against each loss.', cta: [['Find your crop’s plan', '#/crops'], ['See the 23 products', '#/products']] },
  { kicker: 'Since 2010', title: 'Tested on our own ground.', lead: 'The farm came first; the company was built around it. Every season since, VAN’s products have been tested on that ground before they are sold for yours.', cta: [['About VAN', '#/about'], ['All 28 crop plans', '#/crops']] },
  { kicker: 'Beta testing · wheat and potato live now', title: 'Nutrition decides about 1/4 of the yield. Sowing, seed, water, weeds and pests decide the rest.', lead: 'The simulator scores sowing date, irrigation and plant stand, and shows what each one costs the crop.', cta: [['Open the simulator', '#/simulator']] },
  { kicker: 'PNAC · ISO/IEC 17025:2017', title: 'Know what’s in the bag.', lead: 'Every batch VAN makes is tested before it ships, and the certificate for the batch you bought is yours for the asking.', cta: [['Verify a bag', '#/verify'], ['VAN Lab', '#/lab']] },
]

// The three losses — live home (verbatim)
export const LOSSES = [
  { n: 1, nutrient: 'Nitrogen', kicker: 'Nitrogen · loss 1 of 3', title: 'Up as ammonia, down as nitrate.', text: 'Above pH 8, surface urea leaves as ammonia before the crop can use it. What dissolves moves down with the irrigation water.', product: 'Vital Urea', slug: 'vital-urea', analysis: 'Sulfur Coated Urea · N 32% min · S 13% min', colour: '#2E7D4F' },
  { n: 2, nutrient: 'Phosphate', kicker: 'Phosphate · loss 2 of 3', title: 'Calcium closes in and locks it.', text: 'Calcareous soil binds phosphate with free calcium and takes most of it back before the root arrives.', product: 'Green Phosphate', slug: 'green-phosphate', analysis: 'P₂O₅ 32% · N 6%', colour: '#1B4A6B' },
  { n: 3, nutrient: 'Potash', kicker: 'Potash · loss 3 of 3', title: 'The root goes looking.', text: 'Pakistan applies 83 kg of nitrogen for every 1 kg of potash, so the crop draws potash from the soil’s own reserve.', product: 'Vital Potash', slug: 'vital-potash', analysis: 'N 11 · K₂O 44 · boron coated', colour: '#B97F1C' },
]

export const HOME_COPY = {
  lossesH2: '3 ways the ground takes your fertilizer back.',
  lossesLead: 'Nitrogen leaves as ammonia, phosphate is bound by calcium, and too little potash goes on. VAN builds a product against each of the 3.',
  verifyH2: 'Send the batch number. Get the certificate for that batch.',
  verifyLead: 'Every VAN batch is tested before it leaves the plant. Send the number printed on the bag and we send back the measured values from the tests our laboratory ran on it. No charge, no sample to post, no form.',
  beyondH2: 'Where the nutrients go after harvest.',
  beyondLead: 'The loop that brings nutrients back instead of importing them again.',
  beyondCard: 'VAN recovers potassium from crop residue ash, instead of importing it. Silicon from the same ash is still in development.',
  makeH2: 'Tell us the problem and we will work on it with you.',
  makeLead: 'Or bring an idea and we shape it with you. Agronomy, chemistry, regulatory and quality sit on one site, so a problem does not get handed between four companies. Most of what leaves the plant carries a partner’s brand.',
  fourServices: [
    ['Agronomy', 'What the crop needs, at which stage, 28 published programmes'],
    ['Chemistry', 'Formulation to your brief: ratio, form, solubility, particle size'],
    ['Regulatory', 'PSQCA registration run by VAN, under your name'],
    ['Quality', 'Accredited laboratory, every lot released against a certificate'],
  ],
  orderH2: 'Order the product, or ask for the plan.',
  orderLead: 'Tell us the product, the quantity and your district. We reply with price, availability and delivery.',
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
  h1: 'VAN started with a research farm in 2009, a year before the company.',
  lead: 'Trials have run on that ground every season since. VAN formulates, manufactures, registers and tests what it sells on one plant site in Lahore, and nothing goes on this website that a trial, a laboratory result or a published source cannot carry.',
  stats: [
    ['2009', 'Research farm founded, a year before the company. Trials have run on that ground every season since.'],
    ['17 years', 'Of trial data behind every formulation. Read against Punjab’s own 770,160-sample soil survey.'],
    // D-175: "drop biological" (Tahir 26 Sep); the plant runs granular, coated, liquid, water-soluble and compounded lines.
    ['About 50,000\u00A0t', 'Made a year, on one plant site. Granular, coated, liquid, water-soluble and compounded, across shifts.'],
    // Audit, 9 Sep 2026: "22 PSQCA licences" read against "20 of the 23 brands hold a licence" on
    // the regulatory page and looked like a contradiction. It is not one — 22 licences are held
    // across 20 brands, because a brand can hold more than one. Said precisely so nobody has to
    // reconcile it themselves. No number changed.
    ['22 licences', 'Held across 20 of the 23 brands, against 8 Pakistan Standards. Every number published, product by product.'],
    ['LAB 336', 'PNAC-accredited since 2024. Every lot tested before it ships; every certificate on request.'],
    // D-173: VAN is B2B; the farmer reach belongs to Vital Green (Tahir 25 Sep).
    ['23 brands', 'Registered and made in Pakistan.'],
  ],
  // D-170: "same site" implied the farm and the plant share one address; Tahir 25 Sep: don't say where the farm is.
  chain: 'A formulation is tried on the research farm, made at the plant, and tested in the laboratory before it ships. Most of what VAN makes is sold under other companies’ brands, for 14 national and multinational companies.',
  originH2: 'Crop nutrition was sold by the bag, not by what the crop needs at each stage.',
  origin1: 'Before VAN existed, nutrition was sold as 1 bag of this, 3 bags of that. The same prescription for a cotton grower on light soil and a rice grower on a heavy alkaline field in the next district. VAN’s founder saw that in the fields, season after season.',
  origin2: 'In 2007, VAN’s founder produced humic acid in Pakistan from Pakistani leonardite, the oxidised lignite humic substances are drawn from, a material until then imported and, as far as VAN knows, not made here before. What followed built the rest: more chemistries were tried, then tested on ground VAN came to own. That research farm is what the company was built on.',
  // D-177, Tahir 26 Sep 2026, his own list: "2012 largest producer of humic acid in Pakistan, within 2 years;
  // launched boron coated nitropotash 2014 [on the coated line]; 2014 started soil analysis and baseline study;
  // 2015 adopted the framework for crop-specific and soil-specific nutrition; 2017 company-operated outlets
  // roll out; 2019 launched sulfur coated urea"; "land purchased 2010, building started 2011"; VGreen is 2019
  // (was 2018 here); "more than 150 people today" and no earlier team figures. No farmer numbers (D-173).
  // Revert: the v58 source zip.
  timeline: [
    { year: '2007', title: 'The founder’s humic acid', text: 'The founder made humic acid from Pakistani leonardite, an oxidised lignite that humic substances are drawn from. Until then the acid was imported.' },
    { year: '2009', title: 'The first research farm', text: 'VAN’s first research farm, a year before the company. Trials have run on VAN’s research farms every season since, and every formulation is checked against those 17 years of data.' },
    { year: '2010', title: 'The company and the land', text: 'Vital Agri Nutrients (Pvt) Ltd incorporated, and the land for the plant bought.' },
    { year: '2011', title: 'The plant building', text: 'Building work on the plant started, and VAN made its first blended fertilizer.' },
    { year: '2012', title: 'Largest humic acid producer', text: 'Within 2 years of incorporation, VAN was the largest producer of humic acid in Pakistan.' },
    { year: '2014', title: 'The coated line and the soil baseline', text: 'A coating line added to the plant, and its first product, boron-coated nitro potash. VAN also started its own soil analysis and a baseline study.' },
    { year: '2015', title: 'Crop-specific, soil-specific', text: 'VAN adopted crop-specific and soil-specific nutrition as the framework for its programmes.' },
    { year: '2017', title: 'VAN’s own shops', text: 'Company-operated outlets, the Vital Agri Centers, rolled out.' },
    { year: '2019', title: 'Vital Urea and Vital Green', text: 'Vital Urea, VAN’s sulfur-coated urea, launched. Vital Green founded to take VAN’s range direct to growers.' },
    { year: '2023', title: 'Potash from ash', text: 'The first commercial batch of potash recovered from crop residue ash.' },
    { year: '2024', title: 'The laboratory, accredited', text: 'PNAC accreditation, LAB 336, against ISO/IEC 17025:2017. Every lot is tested before it ships and every certificate is available on request.' },
    { year: '2026', title: 'Patent, biological laboratory, NP line', text: 'Pakistan Patent 144684 granted for Vital Urea, VAN\u2019s sulfur-coated urea. VAN\u2019s first biological laboratory. A new NP granulation line planned for the plant site, not yet started.' },
    { year: 'Today', title: 'Where VAN is now', text: 'More than 150 people · 23 registered brands · 22 PSQCA licences against 8 Pakistan Standards · about 50,000 t made a year · made for 14 companies.' },
  ],
  evidenceH2: 'More went on. Less came back.',
  evidenceLead: 'Between 1999-2000 and 2023-24 Pakistan raised the nutrient it applies per acre by 68%. Wheat yield rose by 31%. Every kilogram now returns less than it did at the turn of the century, which is an argument about balance and timing, not about applying more.',
  evidenceMethod: 'Yield per kilogram of nutrient is a yield index divided by a nutrient-per-acre index, 2000 = 100. It sets an all-crop nutrient denominator against a crop-specific yield, so it assumes the split of nutrient between crops has not shifted dramatically. It is a partial factor productivity indicator, not a nutrient balance. The direction is robust; the exact magnitude is not, and we would not defend it to the decimal.',
  // D-170: plain heading (Tahir 25 Sep: the old one and its helper line were "too poor"). Also used on Home.
  boardH2: 'Board of directors',
  board: [
    { key: 'imtiaz-anjum-chaudhary', name: 'Imtiaz Anjum Chaudhary', role: 'Chairman', line: 'With VAN since the beginning', brief: ['Imtiaz Sahib put in the seed capital when VAN was an experimental station and an argument. Before there was a product, a plant or a customer to point at.', '17 years later he is still here, and the company has stayed on that path.', 'A retired civil servant, professionally trained in tax and finance, with a career spent in tax administration, finance and administration.'] },
    { key: 'ahmed-umair', name: 'Ahmed Umair', role: 'Founder & Chief Executive Officer', line: 'Made VAN’s first product, humic acid, in 2007', brief: ['Founder and Chief Executive Officer of Vital Agri Nutrients, a co-founder of Vital Green, and the person who has led the company since it was incorporated.', 'He chose a hard part of the economy to build in, fragmented, unevenly regulated, chronically short of working capital, and built inside those constraints rather than waiting for them to ease.', 'Serves as Prime Minister’s Coordinator on Agriculture and as Chairman of the National Agri-trade and Food Safety Authority (NAFSA); also an Independent Director at the National Credit Guarantee Company Limited, a Director of PAMRA, and Adjunct Faculty at the Lahore University of Management Sciences.', 'Currently on sabbatical from the company while serving in federal government.'] },
    { key: 'faisal-dawood', name: 'Faisal Dawood', role: 'Director', line: 'Vice Chairman, Descon', brief: ['Vice Chairman of Descon, where he leads the Power and Chemicals businesses and manages the group’s diversification portfolio.', 'Sits on the boards of several Descon companies and of Descon Technical Institute, and on the Board of the National Management Foundation at LUMS.', 'BSc in Materials Science and Engineering, Cornell University; MBA, Columbia University.'] },
    { key: 'ahmed-shoaib', name: 'Dr Ahmed Shoaib', role: 'Director', line: 'Product vision & R&D philosophy', brief: ['A medical doctor, with fifteen years working in the United Kingdom.', 'His part here has been larger than a board seat: he shapes the product vision and the R&D philosophy, that soil, food and human health sit on one chain, which places crop nutrition further upstream than the fertilizer industry usually places itself.', 'That reading is why fortifying the crop through its nutrition, not only raising the tonnage it yields, shapes what VAN develops.'] },
    { key: 'ahmed-uzair', name: 'Barrister Ahmed Uzair', role: 'Director', line: 'Legal, compliance & contracting', brief: ['The legal, compliance and contracting side of VAN is his work. The agreements, boundaries and protections that let VAN manufacture under somebody else’s brand without either side being exposed, across counterparties from national buyers to multinationals.', 'Barrister of Lincoln’s Inn and a Partner at AUC | Law since 2012, where he heads the firm’s corporate practice in technology and investment law.', 'Appointed by the Government of Pakistan to advise development finance institutions on a private equity and venture capital fund; has advised the SECP on Companies Act 2017 reform, and the Government of Punjab on the Lahore Smart City project.'] },
  ],
  whoToTalk: [
    { area: 'Commercial', text: 'Supply, pricing, own-brand manufacturing and distribution.', name: 'Muhammad Ali', role: 'Chief Commercial Officer', email: 'muhammad.ali@van.com.pk' },
    { area: 'Research & development', text: 'Formulation work, trials, plant capability, and new formulations.', name: 'Fahim Asghar', role: 'Lead, Plant and Product', email: 'fahim@van.com.pk' },
    // D-170, Tahir 25 Sep 2026: "Bilal Ahmed Khan is Chief Regulatory Officer, he handles licensing and
    // registrations." Laboratory analysis is off his card: the public contacts Sample Reception (D-168).
    { area: 'Regulatory', text: 'Product registration and PSQCA licensing.', name: 'Bilal Ahmed Khan', role: 'Chief Regulatory Officer', email: 'bilal@van.com.pk' },
    // Tahir, 9 Sep 2026: added Irfan here at his instruction, then supplied the other three
    // addresses himself, so all four carry a direct email. His LinkedIn was removed on 11 Sep at
    // Tahir's instruction so the four cards read the same.
    { area: 'Sindh', text: 'Dealerships, supply and farmer support across Sindh. He is also the person to approach about a new dealership in the province.', name: 'Muhammad Irfan', role: 'Regional Business Head, Sindh', email: 'irfan@van.com.pk' },
  ],
  whoToTalkNote: 'Write to them directly, or ask for the person by name on +92 42 35762215, or on WhatsApp at +92 300 5003041.',
  // O-17, 9 Sep 2026: Tahir asked "WHO SAID THIS?" of the 6. Nothing he supplied says it, no
  // decision established it, and it contradicted the 7 dealers + 2 Vital Agri Centers he ruled the
  // same day. He ruled: PULL THE FIGURE. Replaced with the crop-plan count, which is countable on
  // this site. Revert: restore ['6', 'distributors carrying VAN brands'] as the first entry.
  closing: [['28', 'crop programmes published, stage by stage'], ['23', 'registered brands'], ['About 50,000 t', 'made a year, across shifts'], ['LAB 336', 'PNAC · ISO/IEC 17025:2017']],
}

// Knowledge › Why Pakistan must shift (verbatim figures + sources)
export const NATIONAL = {
  h1a: 'Pakistan is not short of fertilizer.',
  h1b: 'It is short of nutrition that reaches the crop.',
  lead: 'Ask why yields are flat and the reflex answer is that farmers need to apply more. The published data says something harder. Pakistan already applies more nutrient per acre than the world average and more than the United States. What has fallen is how much crop each kilogram of that nutrient produces.',
  // D-143 (ruling 12): converted to per acre, kg/ha ÷ 2.471. Was title 'Fertilizer use per hectare of cropland, 2023',
  // unit 'kg of nutrient per hectare of cropland', rows 182 / 156 / 149 / 117 / 108 and the source without the
  // second sentence. Revert: restore those.
  usePerHa: { title: 'Fertilizer use per acre of cropland, 2023', unit: 'kg of nutrient per acre of cropland', rows: [['India', 73.7], ['Pakistan', 63.1], ['United Kingdom', 60.3], ['World average', 47.3], ['United States', 43.7]] as [string, number][], source: 'Our World in Data / FAO (2025), fertilizer use per hectare of cropland. Published in kg per hectare: India 182, Pakistan 156, United Kingdom 149, world average 117, United States 108. Divided by 2.471 for kg per acre.', note: 'Pakistan sits above the world average and above the United States, and within a few kilograms of the United Kingdom.' },
  balance: {
    title: 'What the nutrient actually consists of, 2023',
    pakistan: { N: 3808775, P: 994885, K: 45735, shareN: 78.5, shareP: 20.5, shareK: 0.94, perTonneK: '83 t N · 22 t P₂O₅' },
    india: { N: 20456400, P: 8306600, K: 1878600, shareN: 66.8, shareP: 27.1, shareK: 6.13, perTonneK: '11 t N · 4 t P₂O₅' },
    source: 'FAOSTAT, Fertilizers by Nutrient, via Our World in Data (2023). Ratios derived.',
    text: 'Potash builds cell walls, moves sugar, runs the plant’s water economy and is most of what stands between a crop and lodging, heat or drought. Pakistan applies 83 tonnes of nitrogen for every 1 tonne of potash. Sulfur, magnesium, zinc and boron sit outside this chart entirely, because at national level they barely register.',
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
    method: 'The per-kilogram column is derived: a yield index divided by a nutrient-per-acre index, 2000 = 100. It is a partial factor productivity indicator, not a nutrient balance. The direction holds. The exact magnitude does not, and we would not defend it to the decimal.',
    source: 'Nutrient per hectare: World Bank AG.CON.FERT.ZS (FAO), 95.4 and 160.3 kg/ha. Yields: Pakistan Economic Survey Table 2.5 (2009-10 and 2024-25 editions); all-cereal yield World Bank AG.YLD.CREL.KG. Yields as published in kg/ha: wheat 2,491 and 3,264, rice 2,050 and 2,714, cotton lint 641 and 717, all cereals 2,404 and 3,634. Converted at 1 hectare = 2.471 acres and 40 kg = 1 maund. Ratio derived.',
  },
  nitrogen: { pk: 25, us: 72, text: 'of the nitrogen applied to Pakistan’s cropland is taken up by the crop. The United States converts about 72% of its nitrogen. The rest of ours leaves as ammonia gas, drains past the root zone as nitrate, or is lost to denitrification. The farmer pays for that nitrogen at the depot and the crop never gets it.', source: 'Lassaletta, Billen, Grizzetti, Anglade & Garnier (2014), Environmental Research Letters 9:105011. Corroborated by Shahzad et al. (2019), Nature Sustainability.' },
  bangladesh: 'Bangladesh grows 68% more rice per kilogram of nitrogen than Pakistan, on farms averaging 1.29 acres against Pakistan’s 5.3. India sits below Pakistan.',
}

// Lab (verbatim)
export const LAB = {
  h1: 'Know what is in the bag.',
  lead: 'Every batch VAN makes is tested here before it ships, and the certificate for the batch you bought is yours for the asking. Send us the batch number off the bag. If you have fertilizer from anywhere else, send us 500 g and we will measure it.',
  whyH2: 'Why VAN built a laboratory',
  why1: 'VAN Lab is built to return the same answer twice on the same sample. Written methods, calibrated instruments, reference standards run alongside every batch, 2 analysts on every sample, a manager who reviews the work and signs his name to it.',
  why2: 'All of that exists so that the number does not depend on who ran the test, on which day they ran it, or on what anybody hoped it would say.',
  stats: [['21', 'fertilizer tests, priced publicly, 8 of them accredited'], ['3 to 5', 'working days from confirmed booking to your report'], ['2', 'independent analysts on every single sample'], ['17025', 'PNAC ISO/IEC 17025:2017, LAB 336']],
  scopeNote: '8 of the 21 tests VAN Lab performs are covered by PNAC ISO/IEC 17025:2017 accreditation, LAB 336. The other 13 are tests the laboratory runs which sit outside that granted scope. They are listed separately throughout this site so you always know which is which.',
  report: [['The measured value', 'For every parameter you asked for, as found in the sample you sent.'], ['The method used to measure it', 'Named on the report. A measured value only means something alongside the method that produced it. Particularly for humic acid, where the extraction protocol defines what gets counted.'], ['A signature', 'Reviewed by the Assistant QC Manager and signed by the QC Manager, against a sample code.']],
  who: [['Farmers', 'Counterfeit and quality verification on fertilizer you have already purchased.'], ['Distributors', 'Incoming-goods verification on anything you stock, not only VAN product.'], ['Importers', 'Consignment testing with a published turnaround and an accredited certificate.'], ['Laboratories', 'Reference and umpire analysis, under the same blind protocol as everything else.']],
  cost: [['PKR 500 – 4,000', 'Per test, depending on the parameter. Every price for every test is on the price list. Nothing is “on request”.'], ['3 working days', 'For most tests, counted from confirmed booking. Humic acid is 4 days, because the determination itself runs 36 hours.'], ['500 g', 'The sample we need, by weight, whether solid or liquid. Enough for two analyses and a retained portion.']],
  pricesEffective: 'Prices effective 15 August 2026, in PKR.',
}

/**
 * 10 Sep 2026: the three steps used to describe a WhatsApp round trip, because that is all the page
 * could do. They now describe the check itself and keep WhatsApp as the fallback while the plant's
 * endpoint is being wired, which is what the page actually does today.
 */
export const VERIFY = {
  h1: 'Every VAN batch is tested before it leaves the plant. The certificate is yours to see.',
  lead: 'Type the batch number printed on the bag and the page answers 4 questions: what the product is, when it was made, when QC released it, and where the certificate of analysis for that batch is. The check reads the plant\u2019s own production records, and until that connection is switched on the page says so on screen and sends the number to VAN. No charge, no sample to post, no sign-in.',
  steps: [
    'Find the batch number printed on the bag, and note which product it is.',
    'Type both above. The number is checked against the batch the plant recorded, and the product against what that batch actually was.',
    'Take the QC report: physical status, moisture, particle size, pH and the chemical assays, each with its specification, its result and the method used. Every copy carries its batch number and the date it was downloaded.',
    'While the live check is being connected, the same number sent on WhatsApp +92 300 5003041 or to info@van.com.pk gets the same certificate back the same day.',
  ],
  blind: 'If you would rather not take our own certificate for it, send 500 g of the product to Sample Reception as a normal priced test. It goes to the same desk, gets the same code, and is run by 2 analysts who will not know it is ours.',
  note: 'The laboratory is PNAC-accredited to ISO/IEC 17025:2017, Accreditation No. LAB 336. It is a quality-control function. It rejects any batch that fails its specification.',
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
  kicker: 'For companies launching a crop nutrition brand, making an imported product locally, or manufacturing under their own name',
  h1: 'Launch it under your name.',   // D-181, Tahir 26 Sep: "Launch it under your name. only"
  lead: 'VAN formulates, manufactures, registers and tests crop nutrition products that carry somebody else\u2019s brand name. You bring the market and do the selling. VAN does everything from the formulation to the finished bag.',

  /**
   * THE PROOF LINE, and it is the strongest thing VAN can say to this reader.
   *
   * Tahir explained the mechanism and confirmed it back: every product sold under a partner\u2019s brand
   * must be registered with VAN named as the manufacturer. So each partner brand is its own
   * registration file held against VAN\u2019s plant. One client has 8 products registered this way,
   * another has 7, and across all partners the plant holds more than 100.
   */
  proof: { v: '100+', l: 'partner brands registered with VAN named as the manufacturer' },

  routesH2: 'Two routes in.',
  routesLead: 'Which one you take depends on one thing: whether the product you need already exists here.',
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
      time: '7 to 12 months',
      timeNote: 'About 1 crop cycle. The trial has to run through a season and that is the part nobody can compress. Most briefs take 7 to 12 months; across all 14 partners the range has been 2 to 17 months.',
      text: 'You bring the market, the crop, the price point and the constraint. VAN brings the chemistry, the plant, the trial and the registration.',
      stages: [
        { s: 'Your brief', t: 'Your brief', d: 'What the product has to do, for which crop, at what price.', own: 'you' },
        { s: 'Feasibility', t: 'Feasibility', d: 'Whether it can be made here, at that cost, to that specification.' },
        { s: 'Formulation', t: 'Formulation', d: 'Bench work: ratio, form, coating, chelation, solubility, pH, compatibility.' },
        { s: 'Field trial', t: 'Field trial', d: 'On your crop, in the districts you sell into. This is the season you cannot compress.' },
        { s: 'Registration', t: 'Registration', d: 'Filed under your brand, with VAN named as the manufacturer.' },
        { s: 'Test market', t: 'Test market', d: 'A limited launch in your own territory.', own: 'you' },
        { s: 'Launch', t: 'Commercial launch', d: 'Full volumes, repeat production, agreed lead times.' },
      ],
    },
    {
      key: 'library',
      tag: 'You take something we have already developed',
      title: 'Ready to carry your name',
      time: 'About 3 months',
      timeNote: 'To your first commercial batch, registration included. No trial, because the formulation has already been trialled and validated.',
      text: 'Formulations that are finished but carry no brand. They sit in the library under neutral codes, waiting for a name.',
      stages: [
        { s: 'Pick a code', t: 'Pick a formulation', d: 'From the library. Non-exclusive, or exclusive against a committed volume.', own: 'you' },
        { s: 'Deck and data', t: 'Product deck and technical data', d: 'Full analysis, specification, method, crop fit, shelf life, compatibility.' },
        { s: 'Terms', t: 'Terms agreed', d: 'Which code, exclusivity, volume, price, lead time. Settled before anything is filed.', own: 'both' },
        { s: 'Your brand', t: 'Your brand and your label', d: 'Your name, your artwork, your pack. This is where it becomes your product.', own: 'you' },
        { s: 'Registration', t: 'Registration', d: 'Filed under your brand, with VAN named as the manufacturer.' },
        { s: 'Team trained', t: 'Your team trained', d: 'VAN agronomists brief your sales and field staff before the first bags move, not after.' },
        { s: 'Launch', t: 'Test launch, then full commercial', d: 'A limited launch, then full volumes.', own: 'you' },
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
  modelsH2: '3 ways to work with VAN for the long term.',
  modelsLead: 'Every relationship on this page runs one of these 3 ways, and a partner often runs 2 of them at once. Commercial terms are agreed per project and are not published.',
  modelsHead: ['Model', 'What VAN provides', 'What you provide', 'Who holds the registration', 'Time to first bag'],
  models: [
    ['White labelling', 'A formulation VAN has already developed, trialled and registered, made, tested and packed under your brand. Label and claim review before print. Repeat lots to a frozen specification.', 'Your brand, your artwork, your market and the selling.', 'VAN files it under your brand, with VAN named as the manufacturer.', 'About 3 months to the first commercial batch, registration included.'],
    ['Joint product development', 'The 6 stage path from your brief: feasibility, bench formulation in the VAN lab, pilot on the commercial line, trials on VAN\u2019s research farms and on your plots where wanted, the dossier and the registration.', 'The brief: market, crop, target price and the constraint you are trying to beat. Your own demonstration plots where you want them.', 'VAN files it under your brand, with VAN named as the manufacturer.', 'Most briefs take 7 to 12 months. Across all 14 partners the range has been 2 to 17 months.'],
    ['Toll manufacturing', 'Your own formulation, made on VAN\u2019s 5 lines to your specification, every lot tested in LAB 336 and released against a certificate of analysis.', 'The formulation, the specification, the brand and the market.', 'Agreed per project. VAN can file it either way.', 'Depends on the formulation and its registration. Agreed before the first lot.'],
  ] as string[][],
  modelsNote: 'Licensing of a VAN formulation for manufacture at another plant is not offered. The recipe and the process stay with VAN under every model above.',

  /** "Building portfolios": his ruling of 26 Sep was that VAN designs the range, stated as a service. */
  rangeH2: 'A range, not a product.',
  rangeLead: 'A brand that comes with no range of its own does not have to pick from a list. VAN designs the range around the crops, the regions and the channel you sell into, from what is already made here, and then keeps adding to it.',
  rangeSteps: [
    ['Your crops, regions and channel', 'Which crops your customers grow, which districts, and whether you sell through dealers, to estates or to corporate farms. That is the whole brief for a first range.', 'you'],
    ['A launch range from the 23 brands', 'VAN proposes the products a first season needs, each with the stage it goes on at and the pack it comes in, built from the same programmes published on this site.', 'VAN'],
    ['A roadmap from the library', 'What to add in the second and third season, from the 27 codes in the formulation library, and which of them would need a trial first.', 'VAN'],
    ['Each product on its own route', 'A library formulation reaches you in about 3 months. A product developed to your brief takes a season. The range grows on that clock, not all at once.', 'both'],
  ] as [string, string, string][],

  /** Runs alongside both routes rather than sitting as one box near the end. */
  regH2: 'The regulatory layer, run by us.',
  reg: [
    ['Registration under your brand', 'VAN files it rather than handing you a specification and leaving you to it. The licence route is already worked.'],
    ['Label and claim review before print', 'What the label says has to survive a regulator and a competitor. This is where a partner most often gets caught.'],
    ['Why the number is what it is', 'Any product sold under a partner\u2019s brand has to be registered with VAN named as the manufacturer. Every partner brand is therefore its own file. VAN\u2019s plant holds more than 100 of them.'],
  ],

  /** Naming the limits is how every other page on this site earns its reader. This one too. */
  limitsH2: 'What VAN does not do.',
  limits: [
    ['VAN does not sell it for you', 'No sales force, no dealers, no farmer demand. You own the market and the selling.'],
    ['VAN does not hand over the formulation', 'You sell it under your name. The recipe and the process stay with VAN.'],
    ['VAN will not put a claim on your label that a trial does not support', 'This holds even when your marketing department wants the claim.'],
  ],
  minimum: 'A batch runs from 1 tonne. A single lot goes up to 50 tonnes, and the line runs up to 4 lots a week to the same frozen specification, so 50 tonnes is the size of a lot and not the size of a relationship. There is no minimum on the order itself.',

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
  portfolioH2: 'The portfolio, without the names.',
  portfolioLead: 'VAN does not publish who its partners are, and will not. So here is the same thing measured a way that does not need a name on it.',
  portfolio: [
    { v: '100+', l: 'partner brands registered with VAN named as the manufacturer', note: '14 companies hold them between them. One partner usually runs several brands off the same plant, and the largest holds 8. Every product sold under a partner\u2019s brand carries its own registration file against this plant.' },
    { v: '8', l: 'products held by the largest single partner', note: 'The next largest holds 7. One relationship, 8 registration files.' },
    { v: '27', l: 'unbranded formulations in the library, 11 ready to carry your name', note: 'A code you can put your own name on, with the terms written down.' },
    { v: '22', l: 'PSQCA licences against 8 Pakistan Standards', note: 'Each one listed by brand with its licence number on the regulatory page.' },
    { v: '5', l: 'production lines', note: 'Granular, coated, liquid, water-soluble and compounded. The analytical laboratory is on the same site; the biological laboratory opened in 2026.' },   // D-177, Tahir 26 Sep: 5 lines, lab and farm separate. Was 8 lines under one roof.
    { v: 'About 50,000\u00A0t', l: 'made a year', note: 'A batch runs from 1 tonne; a single lot goes up to 50 tonnes and the line runs up to 4 lots a week. 3 to 5 days under 10 t, 7 to 18 days from 11 to 100 t.' },
  ] as { v: string; l: string; note: string }[],
  /** Filled by Tahir. Each renders only when it carries a value. */
  portfolioPending: { partners: '14', oldest: '2011', /* D-177: first blend 2011; was 2010 */ launchRange: '2 to 17 months' },

  whoH2: 'Who already works this way',
  who: 'VAN does not publish client names. It already manufactures for 14 national and multinational clients, and a partner under NDA can be given specifics in a meeting.',
  whoTypes: ['Multinational crop-protection companies', 'National agri-input companies', 'Sugar mills and corporate farms', 'Importers replacing a bought-in product'],
  firewall: 'Client names, formulations built to client briefs, and any data belonging to a client are not shown on this site and are never used to sell to anyone else. The named exceptions on the whole site are published because each agreed to it: the Khaliqabad field programme with Rafhan Maize Products on the Vital Urea page and the application systems page, and the 3 maize trials on the Vital Urea page (Rafhan Maize Products 2022, Descon Research Farm 2024; the 2025 trial partner is not named). Nothing else is named, and nothing is named without the client\u2019s word.',
  capability: [
    ['Physical forms', 'Granular \u00b7 powder \u00b7 crystalline soluble \u00b7 liquid \u00b7 pellet \u00b7 water-dispersible granule \u00b7 coated prill. The same composition is made in more than one form rather than the form dictating the composition.'],
    ['Pack range', 'From a 1 L bottle to a 1000 kg bulk bag and a 1000 L IBC. Trade packs, estate packs and contract-farming volumes are packed on the same line as the retail unit.'],
    ['Registration, run by us', 'VAN runs the PSQCA registration under your brand rather than handing you a specification and leaving you to it. The licence route is already worked.'],
    ['Quality control', 'A PNAC-accredited laboratory, ISO/IEC 17025:2017, Accreditation No. LAB 336. Every batch is tested. Batches outside the working window are rejected, not averaged into the ones that pass.'],
  ],
}

// Pipeline & Formulation Library — 25 codes (verbatim names/analyses/status from the live page)
// D-183, 26 Sep 2026: 'Feasibility' added for the dual release phosphate; every other status unchanged.
export type FormulationStatus = 'Feasibility' | 'Concept' | 'In development' | 'Field trials' | 'Validated' | 'Available'
export const PIPELINE_STAGES: [FormulationStatus, string, number][] = [['Feasibility', 'technically and commercially viable? literature, rough cost', 1], ['Concept', 'defined, not yet at the bench', 1], ['In development', 'bench formulation work', 3], ['Field trials', 'research farm and partner plots', 3], ['Validated', 'specification and data locked', 8], ['Available', 'ready to carry your name', 11]]
export const FAMILIES: Record<string, string> = { N: 'Nitrogen efficiency', P: 'Phosphorus', K: 'Potash', PK: 'P+K synergy', MX: 'Micros & secondaries', BIO: 'Biologicals' }
export const LIBRARY: { code: string; family: keyof typeof FAMILIES; title: string; text: string; status: FormulationStatus }[] = [
  { code: 'N-22S', family: 'N', title: 'Nitro Sulfur. N 22 · elemental S 18', text: 'Nitrogen carried with elemental sulfur rather than sulfate, so it releases over weeks instead of all at once.', status: 'Validated' },
  { code: 'N-26L', family: 'N', title: 'Liquid nitrogen 26% with zinc and boron · 2 grades', text: 'Liquid nitrogen built for pivot injection and foliar spray, carrying its nitrogen in 3 forms at once.', status: 'Available' },
  { code: 'N-17L', family: 'N', title: 'VAN Liquid CAN. N 17 · Ca 7.2', text: 'Liquid calcium ammonium nitrate: nitrogen delivered with calcium rather than beside it, for fertigated horticulture.', status: 'Available' },
  { code: 'N-15C', family: 'N', title: 'Calcium nitrate. N 15.5 · Ca 18.4', text: 'Nitrate nitrogen carried with a high calcium load, chloride-free: the class high-value horticulture buys imported.', status: 'Validated' },
  { code: 'P-44L', family: 'P', title: 'Liquid foliar phosphorus 44%', text: 'High-analysis foliar phosphorus with a Pakistan micronutrient pack. Bypasses soil fixation entirely by going through the leaf.', status: 'Available' },
  { code: 'NP-540', family: 'P', title: 'NP 5-40. Dual-release phosphate', text: 'A phosphate that releases on 2 timescales from one placement.', status: 'Validated' },
  { code: 'NP-838S', family: 'P', title: 'NP 8-38 + sulfur. Slow-release, fixation-resistant', text: 'Sulfur acidifies the granule’s immediate soil environment; built against calcium phosphate fixation rather than around it.', status: 'Validated' },
  { code: 'UP-44', family: 'P', title: 'Urea phosphate · 17-44-0 and 12-44-0', text: 'Nitrogen and phosphorus in one fully soluble salt, acidic in solution.', status: 'Validated' },
  { code: 'KN-44', family: 'K', title: 'Potassium nitrate · 3 grades', text: 'Chloride-free potassium with nitrate nitrogen, for high-value horticulture and salt-sensitive crops.', status: 'Validated' },
  { code: 'K-45L', family: 'K', title: 'High-purity liquid foliar potash · K₂O 45%', text: 'Chloride-free potassium in a low-salt-index, neutral-pH liquid, built for foliar and drone application.', status: 'Validated' },
  { code: 'PK-82', family: 'PK', title: 'High P+K reproductive complex', text: 'P 42 · K 40, 82 nutrient units, for the window that sets yield and quality.', status: 'Available' },
  { code: 'NPK-128M', family: 'PK', title: 'NPK 12-12-18 + micronutrients', text: 'Balanced mid-to-late-stage NPK weighted to potash.', status: 'Available' },
  { code: 'NPK-19', family: 'PK', title: 'NPK 19-19-19 · 3 grades', text: 'The fully soluble balanced grade: foliar, fertigation and drone / ULV specifications.', status: 'Validated' },
  { code: 'NPK-10', family: 'PK', title: 'NPK 10-10-10, iron-coated · the corrective grade', text: 'For a programme that has already slipped: a corrective dose without loading the soil.', status: 'Available' },
  { code: 'V-Crop series', family: 'PK', title: 'Crop-specific NPK grades · 4 in development', text: 'V-Potato 10-5-35 · V-Citrus 16-6-28 · V-Rice 12-10-25 · V-Wheat 21-7-19 with zinc 1.5%.', status: 'In development' },
  { code: 'V-Stage series', family: 'PK', title: 'Stage-specific grades · 3 in trial', text: 'Vegetative 14-21-16 · Flowering Booster 8-34-14 · Fruiting Booster 12-8-32.', status: 'Field trials' },
  { code: 'MX-Z05', family: 'MX', title: 'Chelated zinc 5%', text: 'Chelated zinc that stays available at pH 8, where sulfate zinc largely precipitates.', status: 'Available' },
  { code: 'MX-ZB3', family: 'MX', title: 'Zinc 12% + boron 3%', text: 'The two deficiencies that most often cap yield where NPK is already adequate, in a single foliar pass.', status: 'Available' },
  { code: 'MX-F05', family: 'MX', title: 'Chelated iron', text: 'For the lime-induced chlorosis that shows up in orchards on calcareous ground.', status: 'Available' },
  { code: 'BIO-H50F', family: 'BIO', title: 'K-humate 50 + fulvic 10 + potash 10', text: 'Concentrated humate for soils under 1% organic matter.', status: 'Available' },
  { code: 'BIO-H40', family: 'BIO', title: 'K-humate 40 + fulvic 10 + potash 10', text: 'The established humate concentration in the library.', status: 'Available' },
  { code: 'BIO-P01', family: 'BIO', title: 'PSB bio-fertilizer', text: 'Phosphorus-solubilizing bacteria, strains isolated locally against Pakistani soil pH and climate.', status: 'Field trials' },
  { code: 'BIO-P01L', family: 'BIO', title: 'Liquid PSB inoculant', text: 'The same solubilizer carried in a liquid, for fertigation lines and spray tanks.', status: 'In development' },
  { code: 'BIO-M01', family: 'BIO', title: 'Mycorrhizal inoculant', text: 'Extends the root system that has to go and reach the phosphorus the bacteria free up.', status: 'In development' },
  { code: 'BIO-S01', family: 'BIO', title: 'Bio Dividend. Seed treatment', text: 'The cheapest point in the season at which nutrition can be placed exactly where the root will be.', status: 'Field trials' },
  // D-183, Tahir 26 Sep 2026: "We have to add 2 products more, one at concept stage and one at
  // feasibility and scoping stage." Codes proposed by Claude, awaiting his approval. No figure beyond
  // the 50% potash he gave. Mechanism text is his own description, tidied; no outcome is claimed.
  { code: 'K-50DC', family: 'K', title: 'Dual coated potash · K₂O 50', text: 'Potash granule carrying 2 coatings, boron and silicon, so the micronutrient and the silicon land where the potash lands.', status: 'Concept' },
  { code: 'P-DRC', family: 'P', title: 'Dual release phosphate with a calcium-binding shell', text: 'An outer layer that breaks down first and binds the free calcium around the granule, before that calcium can lock the phosphate. Then a fast-release phosphate fraction for the seedling, then a slow-release fraction for the rest of the season.', status: 'Feasibility' },
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
  h1: 'VAN Yield & Discipline Simulator. Nutrition decides about 1/4 of the yield. Sowing, seed, water, weeds and pests decide the rest.',
  lead: 'The world talks about nutrition and uptake, and it matters. This tool adds what the field actually does: when it was sown, how it was watered, how thick it stands, and what that does to the yield the nutrition was planned for.',
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
    { key: 'basal', label: 'Basal fertilizer', options: ['Placed at sowing', 'Broadcast at sowing', 'Broadcast after sowing', 'Skipped'] },
    { key: 'irrigation', label: 'Irrigation', options: ['Every one on time', 'One delayed', 'One missed', 'Two missed', 'Two missed and one late'] },
    { key: 'topdress', label: 'Top-dressing nitrogen', options: ['Split, each on time', 'Split, one late', 'All at once, early', 'All at once, late'] },
    { key: 'weeds', label: 'Weeds', options: ['Cleared in the window', 'Cleared late', 'Left in the crop'] },
    { key: 'micro', label: 'Zinc and boron', options: ['Applied at the right stage', 'Applied, wrong stage', 'Not applied'] },
    { key: 'harvest', label: 'Harvest', options: ['At maturity', 'A week late', 'Two weeks or more late'] },
  ],
  onCourse: 'On course. Every practice in its window: the nutrition plan can deliver the target it was set for.',
  previewNote: 'Directions only, and deliberately so. No figure is printed here. Wheat and potato have working simulators with their own 10 levers; the rest of the 26 follow as each crop’s lever set is built.',
  betaNote: '26 more crops follow, each as its lever set is built and reviewed. If something is missing from this list that costs you yield on your own field, tell us before the next upgrade and it goes in.',
  inputs: ['Crop and variety, from Pakistan’s list, not a generic one.', 'District and soil, the Punjab survey’s 770,160 samples and VAN’s own set the soil prior; a laboratory report overrides it.', 'Target yield, in maunds per acre, against what the district can carry.', 'Sowing date, the day, not the month.', 'Irrigation, canal, tube well or both, and the schedule you can keep.', 'Plant population, seed rate and stand.', 'Cropping pattern, what the field carried before: rice–wheat, cotton–wheat, cane and ratoon.', 'Practices. Weed window, top-dressing, harvest window.'],
  outputs: ['Your attainable yield, with the discipline you described, on your field.', 'Your discipline score, which practices carry the target, and which one is costing you most.', 'The nutrients in kilograms. N, P₂O₅, K₂O, the secondaries and the micros, stage by stage, after the soil’s own contribution.', 'The VAN products that deliver them. Product, stage, method and pack, from the crop programmes already on this site.', 'What each slip costs, and the way back.'],
  builtOn: [['17 years', 'of trial data from VAN’s research farms, counted from 2009'], ['770,160', 'Punjab soil samples, the provincial survey read with VAN’s own']],
}

// Application methods (crop pages, verbatim)
export const METHODS = [
  ['Broadcasting', 'Spread evenly over the soil surface, before or at sowing, and worked in by tillage or by the first irrigation. For a basal granule it is the last choice: drill it if you can (D-207).'],
  ['Placement', 'Drilled or laid in the furrow or band at sowing, about 5 cm beside and below the seed, so the nutrient sits where the young root will reach it rather than across the whole field. For every basal granule VAN makes, this comes first; side dressing second; broadcasting last.'],
  ['Side dressing', 'Applied along the row of a standing crop after establishment, then irrigated in.'],
  ['Fertigation', 'Dissolved and delivered through the irrigation water, so the dose arrives with the water at the stage it is needed.'],
  ['Spray', 'Dissolved and sprayed onto the leaf, for nutrients the crop can take up through the foliage.'],
]
export const VITAL_UREA_RULE = 'Vital Urea is a coated slow-release urea and is applied by drilling at sowing (beside and below the seed, never touching it), by side dressing, or by broadcasting, never by fertigation. The fertigation rows in the nitrogen band are commodity urea, which is a different material.'

// Wheat crop page (verbatim)
export const WHEAT = {
  h1: 'Wheat. Per acre, stage by stage.',
  lead: 'VAN’s published wheat programme runs across 5 stages, from land preparation to grain formation. It uses 7 nutrient bands and mixes VAN products with commodity urea. Everything below is transcribed from the published plan.',
  meta: ['5 stages', 'Per acre', 'Reissued Aug 2026'],
  pdf: 'plans/Wheat-Nutrition-Plan.pdf',
  tableNote: 'Rates are per acre. “1 bag” means 1 bag of the size printed under the rate. Greyed names are commodity inputs VAN does not manufacture.',
  gdd: [
    { stage: 'Land Preparation', gdd: 'n/a', das: 'Before sowing', oct20: 'Before Oct 20', nov1: 'Before Nov 1', nov20: 'Before Nov 20', events: 'Soil preparation, incorporation of P, K, organic matter, basal N (Vital Urea). This is not a crop growth stage but a management stage.' },
    { stage: 'Germination', gdd: '0–150', das: '0–13', oct20: 'Oct 20–Oct 30', nov1: 'Nov 1–Nov 13', nov20: 'Nov 20–Dec 8', events: 'Seed imbibition, radicle emergence, coleoptile emergence. Apply first N top-dress (commodity urea) at 8-10 DAS if soil moisture is adequate; otherwise wait for first irrigation.' },
    { stage: 'Early Growth', gdd: '150–450', das: '13–55', oct20: 'Oct 30–Nov 27', nov1: 'Nov 13–Dec 25', nov20: 'Dec 8–Feb 13', events: 'Emergence of first true leaf; beginning of tiller formation. Critical period for zinc deficiency symptoms (especially in alkaline soils).' },
    { stage: 'Grand Growth', gdd: '450–900', das: '55–132', oct20: 'Nov 27–Feb 22', nov1: 'Dec 25–Mar 12', nov20: 'Feb 13–Mar 29', events: 'Maximum tiller formation and leaf expansion. The period of highest nutrient demand and the window for mid-season N applications. Foliar K and micronutrient sprays are applied here.' },
    { stage: 'Grain Formation & Maturity', gdd: '900–1400+', das: '132–167', oct20: 'Feb 22–Apr 6', nov1: 'Mar 12–Apr 16', nov20: 'Mar 29–Apr 28', events: 'Boot stage, anthesis, grain fill, dough stage and maturity. Minimal N applications after boot; no new nutrient applications after grain fill begins.' },
  ],
  // D-177, Tahir 26 Sep 2026: "Fix it from the site's own degree-day column." The days and dates below were
  // 0–10 / 10–25 / 25–50 / 50–120 (maturity by Feb 8 to Mar 10). Now worked from the degree days on Lahore
  // 1991-2020 normals. The days column is for a Nov 1 sowing. Revert: the v58 source zip.
  gddNote: 'Growing degree days are counted on a base of 10 °C: only the heat above 10 °C is added up, which is why a whole Punjab wheat season comes to about 1,400 and not the roughly 3,000 a base of 0 °C would give. The days and calendar dates are worked from the degree days, on Lahore’s 1991 to 2020 temperature normals, so they describe a normal season, not this year’s weather. The days-after-sowing column is for a November 1 sowing. A late sowing moves through the stages faster in days, which is why each sowing date has its own column.',
  deficiency: [
    { nutrient: 'Nitrogen (N)', early: 'Older leaves (lower canopy) show uniform chlorosis. Chlorosis advances upward through the canopy as deficiency deepens.', timing: 'Most visible at Germination to Early Growth stages (7-30 DAS) if basal N was inadequate.', indicator: 'Affected plants are noticeably paler and shorter than neighbors receiving adequate N.' },
    { nutrient: 'Phosphorus (P)', early: 'Young leaves may show purpling (anthocyanin accumulation), especially on leaf margins and stem bases. Root system stunted and fibrous.', timing: 'Most critical at Germination stage (7-14 DAS) when root demand for P is high; late diagnosis limits correction.', indicator: 'Stunted, dark-green plants with delayed growth. Purple discoloration of stems is diagnostic.' },
    { nutrient: 'Zinc (Zn)', early: 'Interveinal chlorosis first appears on new leaves and is most severe at boot stage. In Punjab’s alkaline soils zinc is chemically fixed, making it unavailable even when total soil Zn is adequate.', timing: 'Symptoms often appear abruptly at the move from Germination to Early Growth, or at boot stage.', indicator: 'Distinct interveinal chlorosis; plants may recover partially if corrected early with foliar Zn spray or Zn-enriched fertigation.' },
  ],
  notTell: ['These are per-acre programmes, not a prescription for your field. A nutrition plan is built on a typical crop and a typical soil. It is not a substitute for a soil test.', 'VAN publishes no yield claim for this programme. We publish what to apply, at which stage, by which method.'],
}

// Circular economy (live home + circular page)
export const CIRCULAR = {
  h2: 'Where the nutrients go after harvest.',
  lead: 'The loop that brings nutrients back instead of importing them again.',
  ash: 'VAN recovers potassium from crop residue ash, instead of importing it. Silicon from the same ash is still in development.',
}

// Standing rules that the demos must respect (from Start Here.md) — for reference in code comments
export const RULES_FOR_DEMO = [
  'No invented numbers, trials, licences, agronomic claims or coefficients.',
  'No performance claim without a trial we can point to.',
  'No client or partner names (Rafhan Maize on Vital Urea page is the single cleared exception).',
  'Registration is PSQCA-only. Publish licence numbers, never expiry dates.',
  // Superseded 11 Sep 2026: the simulator is LIVE on wheat and potato, so "coming soon" is no longer
  // allowed for it either. The tools page roadmap is where unbuilt work is named, with what it waits on.
  'Nothing is described as coming soon. Unbuilt work is named on the tools page with what it is waiting on.',
  'kisan@van.com.pk appears on crop pages only. Never Home, footer or About.',
  'Never write "one site near Lahore".',
  'Fertigation, drip, pivot, drone and foliar are five distinct delivery methods, never synonyms.',
]
