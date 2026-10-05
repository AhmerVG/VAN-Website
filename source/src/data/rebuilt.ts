/**
 * REBUILT PAGES — content carried across from van.com.pk, 8 Sep 2026.
 *
 * The live site had 84 indexed pages; the demo had no home for 22 of them. Rather than let those
 * URLs 404 when the demo replaces the live site, each was read in full and judged. 13 keep their own
 * page, 9 merge into a stronger page with their URL redirected, none was dropped.
 *
 * A 23rd page — /one-tank.html — was found afterwards by the pre-launch audit. It escaped the first
 * pass because it is live and in the live nav but NOT in the submitted sitemap, which was the working
 * list. Tahir's call (9 Sep) was to merge it into /knowledge/application-systems.html as its own
 * section, so the tally is now 13 own pages, 10 merged, 0 dropped. The copy below is
 * VAN's own published wording, carried across — not rewritten, and nothing added that was not
 * already published or given directly by Tahir.
 *
 * The one deliberate structural change: the soil-deficiency-to-product table appeared three times
 * across three live pages, each independently re-deriving the same argument. It is written once here
 * (SOIL_GAP_TABLE) and referenced from the pages that used to repeat it.
 */

export type TableSpec = { head: string[]; rows: string[][]; note?: string; source?: string; minWidth?: number }
export type Block =
  | { k: 'lead'; text: string }
  | { k: 'p'; text: string }
  | { k: 'h3'; text: string }
  | { k: 'table'; t: TableSpec }
  | { k: 'note'; text: string }
  | { k: 'source'; text: string }
  | { k: 'stats'; items: [string, string][] }
  | { k: 'tags'; items: string[] }
  | { k: 'cta'; label: string; href: string }
  /** Q&A. Rendered as real <details> so a crawler sees every answer and a reader sees one at a time. */
  | { k: 'faq'; items: [string, string][] }
  /** The distributor enquiry form. A component, not copy — see components/EnquiryForm.tsx. */
  | { k: 'enquiry' }
  /** D-197: the full formulation library, on the Pipeline page. */
  | { k: 'library' }
  /** D-246: an interactive Pakistan nutrient lens (src/components/Lens.tsx). */
  | { k: 'lens'; specs: { id: string; opts?: string[]; opt?: string; year?: number; tab?: string; topic?: string }[]; countries?: string[]; label?: string }

export type Section = { id: string; n: string; kicker: string; title: string; lead?: string; tone?: 'green' | 'soil' | 'gold' | 'navy' | 'rust'; bg?: boolean; blocks: Block[] }
/**
 * O-11, 9 Sep 2026 (Tahir): "THE SUB NAVIGATION ARE NOT WIRED CORRECTLY. THIS PAGE NEED FIX."
 * He was right, and the fault was structural. The circular hub's numbered chips were generated from
 * `sections`, so chip 03 pointed at an on-page anchor whose whole content was a link to a DIFFERENT
 * page, while the ash page — a real sibling — appeared in no chip at all. A reader clicking 03
 * landed on two sentences and a button; a reader looking for the ash process found nothing.
 * `siblings` separates the two kinds of destination: chips numbered from `sections` are places on
 * THIS page, and siblings are rendered apart, labelled as other pages.
 */
export type SiblingLink = { label: string; href: string; note: string }
export type RebuiltPage = { slug: string; livePath: string; eyebrow: string; h1: string; h1accent?: string; lead: string; tone: 'green' | 'soil' | 'gold' | 'navy' | 'rust'; sections: Section[]; siblings?: SiblingLink[] }

/**
 * The one canonical statement of "what the soil is short of, and what VAN makes against it".
 * Previously duplicated across /knowledge/soil-and-sustainability, /knowledge/why-pakistan-must-shift
 * and /circular-economy/soil, with overlapping product lists each time.
 */
export const SOIL_GAP_TABLE: TableSpec = {
  head: ['What the soil is short of', 'What that requires', 'What we make'],
  minWidth: 720,
  rows: [
    ['Potassium', "Potash applied in the crop's uptake window, in a form that can be delivered through fertigation rather than only at land preparation", 'Vital Potash · SOP · V-Potash Plus'],
    ['Available phosphorus', 'Phosphate engineered against calcium fixation rather than simply applied at a higher rate', 'VAN NP Range · Green Phosphate'],
    ['Zinc and boron', 'Micronutrients applied at the growth stage that needs them, through the water or on the leaf, where the soil would lock them', 'V-Zinc · VL-Boron · VL-Micromix'],
    ['Organic matter', 'Carbon returned to the soil, and nutrient recovered from residue streams instead of burned', 'V-Compost · Humi Grow · V-Transform · Circular Economy'],
    ['Nitrogen that stays put', 'Coated, controlled-release nitrogen on ground where plain urea volatilises', 'Vital Urea'],
  ],
}

export const SOIL_SUSTAINABILITY: RebuiltPage = {
  slug: 'soil-and-sustainability',
  livePath: '/knowledge/soil-and-sustainability.html',
  eyebrow: 'Knowledge · the state of Pakistani soil',
  h1: 'We have been spending the soil’s',
  h1accent: 'capital, not its income.',
  lead: 'A harvest is an export. Every tonne of cane, wheat or cotton that leaves a field takes nutrient with it. If less goes back than comes off, the difference is drawn from the soil’s own reserves, and reserves are finite even in ground that started rich. Pakistan has been running that overdraft for decades. This page sets out what is actually measured, what it means, and where the measurement stops.',
  tone: 'soil',
  sections: [
    {
      id: 'overdraft', n: '01', kicker: 'The overdraft', title: 'What the crop takes out, against what we put back.', tone: 'rust',
      lead: 'This is the whole mechanism. Everything else on the page follows from it.',
      blocks: [
        // D-143: per acre (kg/ha ÷ 2.471). Was '100–150 kg' / 'K₂O per hectare removed...', '1.48 kg' / 'K₂O per hectare, the
        // national average...' and 'At 100 to 150 kg of K₂O removed per hectare against 1.48 kg applied'. Revert: restore those.
        { k: 'stats', items: [['40 to 61 kg', 'K₂O per acre removed by Pakistani cropping every year'], ['0.6 kg', 'K₂O per acre, the national average application in 2023']] },
        { k: 'p', text: 'At 40 to 61 kg of K₂O removed per acre against 0.6 kg applied, the soil’s own potassium reserve is drawn down every season.' },
        { k: 'source', text: 'Removal: Wakeel, A. & Magen, H. (2017), Potash Use for Sustainable Crop Production in Pakistan: A Review, International Journal of Agriculture & Biology 19(3). Application: FAOSTAT Fertilizers by Nutrient via Our World in Data (2023), potash per hectare of cropland. Published per hectare: 100 to 150 kg removed, 1.48 kg applied; divided by 2.471 for per acre.' },
        // D-246: Punjab's own record, 1971-72 to 2023-24, beside the national figure.
        { k: 'lens', label: 'Punjab potash balance, 1971-72 to 2023-24', specs: [{ id: 'punjab' }] },
      ],
    },
    {
      id: 'where', n: '02', kicker: 'Where the soil already is', title: '6 surveys, shown separately on purpose.', bg: true,
      lead: 'Published soil surveys, each with its own region, year, sample count and critical level. The pattern across them is consistent even though the numbers are not comparable to each other.',
      blocks: [
        { k: 'table', t: {
          head: ['Nutrient / property', 'Share below critical level', 'Region, year, samples', 'Source'],
          minWidth: 860,
          rows: [
            ['Organic matter', 'over 95% deficient', 'Muzaffargarh district, Punjab · 3,325 composite samples · published 2014', 'Akram, Z., Hussain, S. & Mansoor, M. (2014), Universal Journal of Agricultural Research 2(7):242–249'],
            ['Organic matter', 'typically below 1%', 'Punjab surface soils', 'Azam (1988); Rashid (1994), as cited in Minhas et al. (2024)'],
            ['Phosphorus', '99% poor in available P', 'Hazro tehsil, Attock district', 'as cited in Alvi, S., Khalid, R. & Rashid, M. (2011), Pak. J. Sci. Ind. Res. 54(1):45–47'],
            ['Phosphorus', 'over 70% deficient', 'Punjab province', 'Malik (1984); Rashid (1994), as cited in Minhas et al. (2024)'],
            ['Boron', '70.8% of surface soils deficient', 'Multan citrus orchards · 24 orchards · critical level 0.5 mg/kg', 'Minhas, A., Ahmed, N. & Sajid, M. (2024), Journal of Plant and Environment 5(1):71–85'],
            ['Boron', '41% of samples deficient', 'Multan district', 'Rashid (1995, 1996)'],
            ['Zinc', 'over 60% deficient', 'Punjab province', 'Tariq et al. (2004), as cited in Alvi et al. (2011)'],
            ['Potassium', '40% of soils deficient', 'Pakistan, review of available data', 'Wakeel, A. & Magen, H. (2017), Int. J. Agric. Biol. 19(3)'],
          ],
          source: 'A national survey of 329 soil samples reported widespread deficiency of zinc and boron followed by iron. Zia et al. (2004), as cited in Alvi et al. (2011).',
        } },
        { k: 'note', text: 'Punjab now has a measured picture of its own on this site, 770,160 samples across 36 districts, read district by district.' },
        { k: 'cta', label: 'Soil Atlas →', href: '#/soil' },
      ],
    },
    {
      id: 'alkaline', n: '03', kicker: 'Why alkaline soil makes it worse', title: 'One property drives most of this page.', tone: 'rust',
      blocks: [
        { k: 'p', text: 'Most cultivated ground in Pakistan is calcareous and alkaline, with free calcium carbonate through the profile and pH commonly above 8. Phosphorus applied to such soil precipitates with calcium into forms the root cannot reach. Zinc, iron and manganese become progressively less soluble as pH rises, which is why the micronutrient deficiencies cluster in exactly the soils with the highest lime content and the lowest organic matter. And surface-applied urea hydrolyses and escapes as ammonia before the crop can take it up.' },
        { k: 'p', text: 'Low organic matter compounds every one of these. Organic matter holds nutrients against leaching, buffers pH, feeds soil biology and improves structure and water retention. At under 1% there is very little of that buffering left. Pakistani summers above 45 °C accelerate decomposition, and crop residue is generally burned or fed to livestock rather than returned, so the organic fraction is consumed faster than it is replaced, for the same reason the mineral fraction is.' },
      ],
    },
    {
      id: 'gap', n: '04', kicker: 'What is missing', title: 'The measurement gap, stated plainly.', bg: true,
      blocks: [
        { k: 'lead', text: 'There is no published national time series of Pakistani soil nutrient levels in ppm running from the 1980s to today. We looked for one, because it is the chart this page most wants. It does not appear to exist in the public literature.' },
        { k: 'p', text: 'The reason is given plainly in the standard review of Pakistani potash: “Due to least soil testing facilities, farmers usually don’t analyze their soils.” Soil testing in Pakistan has been sparse, irregular, and organised district by district rather than as a repeated national panel, so there is no consistent baseline to measure change against.' },
        { k: 'p', text: 'What exists instead is what is on this page: a well-established depletion mechanism with both of its figures published, and a set of separate surveys showing where the soil has ended up. The trend is inferred from the arithmetic, not read off a measured national curve. We say so, rather than draw a line that implies a dataset nobody has collected.' },
        { k: 'note', text: 'A National Soil Health Atlas, periodic, consistent, district-level, publicly available, is the single piece of infrastructure that would settle this. Pakistan does not have one. Until it does, every conversation about balanced nutrition in this country is conducted partly in the dark, and that includes ours.' },
      ],
    },
    {
      id: 'builds', n: '05', kicker: 'What VAN does about it', title: 'The gap, and what it requires.', tone: 'green',
      blocks: [
        { k: 'table', t: SOIL_GAP_TABLE },
        { k: 'cta', label: 'The national picture. Usage, balance, productivity →', href: '#/knowledge/why-pakistan-must-shift' },
      ],
    },
  ],
}

export const APPLICATION_SYSTEMS: RebuiltPage = {
  slug: 'application-systems',
  livePath: '/application-systems.html',
  eyebrow: 'Knowledge · application systems',
  h1: 'A bag is not a dose.',
  h1accent: 'How nutrient is delivered is part of the product.',
  lead: '2 fields can take the same nutrient, in the same quantity, in the same season, and get different results. Form, timing and placement decide how much of it the crop ever sees, so VAN formulates to the machine as well as to the crop.',
  tone: 'navy',
  sections: [
    {
      id: 'three', n: '01', kicker: '3 systems', title: 'Each system sets its own limits on the product.',
      lead: 'Broadcasting a bag spreads nutrient over the whole surface and leaves the root to find it. Pivot, drip and drone each place it somewhere specific.',
      blocks: [
        { k: 'table', t: {
          head: ['', 'Pivot', 'Drip', 'Drone'],
          minWidth: 760,
          rows: [
            ['Where the nutrient lands', 'Whole circle, with the water', 'Wetted root zone only', 'On the leaf'],
            ['Hardest product constraint', 'No precipitate in the carrier water', 'Near-zero insolubles. Emitters and filters', 'Concentration and suspension stability'],
            ['Form we supply', 'Soluble crystal and liquid', 'Liquid and soluble crystal, acidic reaction where water is hard', 'Concentrated liquid and fine WDG'],
            ['What it buys the grower', 'Cheap splitting, many small doses', 'Placement, nothing applied between the rows', 'Access and speed. Crops and windows the ground cannot reach'],
            ['Crops it fits first', 'Field crops under pivot irrigation', 'Orchards, high-value vegetables, protected cropping', 'Sugarcane, maize, rice, cotton at canopy closure'],
          ],
        } },
        { k: 'p', text: 'The injected solution touches every part of a long galvanised span on each pass, and the two failure directions are opposite. That is why pH is the controlled variable in a pivot programme. It decides whether the machine ages normally or early, and VAN sets it before the product is packed rather than leaving it to the grower at the injection point.' },
        { k: 'note', text: 'The band is a formulation specification. What these grades are built to. The measured pH comes off the certificate of analysis that ships with the batch; send the batch number and VAN sends it. No corrosion-rate or equipment-life numbers are published here. Those tests have not been run, and the mechanism above is standard corrosion engineering, not a VAN measurement.' },
      ],
    },
    {
      id: 'four', n: '02', kicker: 'Between the bag and the crop', title: '4 decisions, none of them printed on the bag.', bg: true,
      blocks: [
        { k: 'h3', text: 'Form' },
        { k: 'p', text: 'On ground above pH 8, surface-applied uncoated urea hydrolyses and escapes as ammonia; the same nitrogen behind a sulfur coating dissolves gradually instead. Chelated micronutrients stay available in alkaline soil where the sulfate equivalents precipitate out and do nothing.' },
        { k: 'h3', text: 'Timing' },
        { k: 'p', text: 'Crop demand peaks at defined growth stages, and nutrient supplied outside those windows is substantially wasted. It is why the 28 crop programmes are written stage by stage rather than as a season total.' },
        { k: 'h3', text: 'Placement' },
        { k: 'p', text: 'Broadcast, drilled, side-dressed, banded, fertigated or sprayed on the leaf. Each has a different loss profile, and placement is usually decided by the equipment available rather than by agronomy, which is exactly why it is worth designing for.' },
        { k: 'h3', text: 'Physical fit' },
        { k: 'p', text: 'A product that blocks an emitter, settles out of a spray tank or is too coarse for a drone boom is not a delivery option regardless of its analysis. Solubility, particle size, pH and tank-mix behaviour decide it.' },
      ],
    },
    {
      id: 'systems', n: '03', kicker: 'Every delivery system', title: 'What each one demands of the product.', tone: 'green',
      blocks: [
        { k: 'table', t: {
          head: ['System', 'What it demands of the product', 'Where it earns its place'],
          minWidth: 820,
          rows: [
            ['Broadcast & side-dressing', 'Granular integrity, controlled dissolution, resistance to volatilisation on hot alkaline surfaces', 'The bulk of field-crop nitrogen and base nutrition'],
            ['Fertigation', 'Full water solubility, no precipitate, no emitter blockage, compatible pH', 'Orchards, high-value vegetables, any drip or sprinkler system'],
            ['Foliar', 'Fine particle size, tank-mix stability, leaf-safe concentration, chelated micronutrients', 'Correcting a deficiency inside days rather than waiting on root uptake'],
            ['Drone / ultra-low volume', 'High concentration in very little water, no nozzle blockage, stable in suspension', 'Tall or dense standing crops a tractor cannot enter, and speed when the window is short'],
            ['Seed & starter placement', 'Low salt index, safe in contact with germinating seed, early-available phosphorus', 'Root establishment, where a small precise quantity outperforms a large imprecise one'],
          ],
        } },
        { k: 'note', text: 'VAN produces powder, granular, pellet, crystalline and liquid grades, and formulates to a customer’s delivery system as part of the brief. Pack sizes are registered per product and printed on each product’s own page. They are kept there only, so that one pack size is never published as 2 different figures.' },
      ],
    },
    {
      id: 'field', n: '04', kicker: 'What VAN has actually put in a field', title: '2 programmes of our own.', bg: true,
      lead: 'Testing the two halves of the same idea: that form changes how much nitrogen survives, and that timing changes how much of it is used.',
      blocks: [
        { k: 'h3', text: 'With Rafhan Maize Products' },
        { k: 'p', text: 'Across 5 grower sites at Khaliqabad, from application in August 2023 to harvest in October, assessed at 12 and 24 days. The comparison was deliberately uneven.' },
        { k: 'p', text: 'Across the parameters assessed, shoot length, colour, leaf number and vigour, the single 25 kg bag produced comparable crop growth on roughly a third of the applied nitrogen, with the sulfur included and at a comparable bag price. Observers also recorded better uniformity of plant height, improved grain formation, more milk-line development and better disease tolerance. Cob size and length showed no difference.' },
        { k: 'h3', text: 'The replicated trial' },
        { k: 'p', text: 'A replicated maize trial at VAN’s trial station: 2 stage-timed applications of sulfur-coated urea, at the 4–6 leaf stage and again 20 days later at 8–12 leaf, against a conventional programme of 5 applications of uncoated urea followed by calcium ammonium nitrate.' },
        { k: 'p', text: 'Coated nitrogen is released over days instead of all at once, so less of it is exposed to volatilisation at any one moment, and fewer, better-timed applications deliver more to the plant than more frequent applications of a form that does not stay put.' },
        { k: 'source', text: 'Umair, A., Manzoor, M., Saleem, M. S., Akram, S., Ali, M., Batool, A., Javaid, T., Javaid, A., Sharif, M. N. & Haider, M. S. (2025). Efficacy Evaluation of Different Doses of Nitrogenous Fertilizers on the Growth and Yield of Maize (Zea mays). Planta Animalia 4(3), 129–135. DOI 10.71454/PA.004.03.0126. Randomised complete block design, 3 replications, DK-6321 hybrid, spring season 2024.' },
        { k: 'cta', label: 'Vital Urea. The evidence in full →', href: '#/products/vital-urea' },
      ],
    },
    /**
     * ONE TANK — merged in from /one-tank.html (D-46, 9 Sep 2026). That page was live, sat in the
     * live nav under Application Systems, and had no home in the new build because it was never in
     * the submitted sitemap. Tahir's call was to merge it here rather than give it its own page, so
     * its URL 301s to this section anchor. The copy below is VAN's own published wording carried
     * across unchanged — no claim added, no figure invented, and the two things the live page
     * explicitly refuses to publish (the delivery package, and any drift/coverage/efficiency figure)
     * stay refused.
     */
    {
      id: 'one-tank', n: '05', kicker: 'One Tank · ایک ٹینک', title: '20 litres for the whole field.', tone: 'gold',
      lead: 'A drone carries about 20 litres and then has to land. Everything the crop is going to get that day has to be dissolved in those 20 litres, arrive on the leaf without blocking a nozzle, and be safe on the leaf at a concentration the original label was never written around. That needs a different specification from a knapsack spray, and at VAN it carries a different name: One Tank.',
      blocks: [
        { k: 'p', text: 'A drone will spray whatever is put in its tank. Choosing a grade that was not written for the tank is where the application fails, not in the aircraft.' },
        { k: 'h3', text: 'The name tells you what it was built under' },
        { k: 'p', text: 'VAN does not put the word “drone” on the end of an existing brand. A drone-ready version of a VAN product is a different formulation with a different concentration, a different particle specification and a different dose per acre, and giving it the parent’s name would invite a grower to swap one for the other. So it gets its own name in its own family: One Tank. The name refers to the 20 litres a drone tank holds.' },
        { k: 'p', text: 'The rule runs one way and has no exceptions. If a product is meant to be flown, it is named into the One Tank family. If it carries a VAN brand name, it was not built for the drone. Whatever it happens to dissolve like. SOP is the standing example: it is a soil and fertigation product, it is not a drone grade, and it will not become one.' },
        { k: 'h3', text: 'The family' },
        { k: 'table', t: {
          head: ['Code', 'Nutrient'],
          minWidth: 520,
          rows: [
            ['One Tank K', 'Potassium'],
            ['One Tank K+P', 'Potassium with phosphorus'],
            ['One Tank N', 'Nitrogen'],
            ['One Tank KN', 'Potassium with nitrogen'],
            ['One Tank Zn', 'Zinc'],
          ],
          note: '5 codes. The code is the nutrient identity, that is the whole point of naming it this way. Crop-specific variants sit inside the same family and follow the same rule: the crop is named on the pack, the family name does not change.',
        } },
        { k: 'h3', text: 'What the 20-litre tank decides' },
        { k: 'p', text: '20 litres is the maximum total tank mix for a One Tank application. It is set before the formulation work starts, and everything else, concentration, solubility, what can share a tank with what, is decided underneath it. A grade that needs more water than the drone can carry is not a drone grade, however well it performs on a boom.' },
        { k: 'p', text: '3 things follow from it directly. The nutrient load has to dissolve, and stay dissolved, at several times the concentration a knapsack would use. The solution has to pass a nozzle screen and keep passing it for the length of a flight, which rules out anything that settles or flocculates in the tank. And it has to be safe on the leaf at that concentration, because the same quantity of nutrient is landing in far less water.' },
        { k: 'h3', text: 'What VAN already flies' },
        { k: 'p', text: 'Drone and ultra-low-volume grades are in commercial production today under their existing VAN brand names: VL-Micromix · VL-Boron · V-Zinc · Tornado · V-Germinator Pro · Cala-Mag V. Those products keep their names. One Tank is the family for products designed around the drone from the start rather than qualified for it afterwards.' },
        { k: 'tags', items: ['VL-Micromix', 'VL-Boron', 'V-Zinc', 'Tornado', 'V-Germinator Pro', 'Cala-Mag V'] },
        { k: 'h3', text: 'What is not on this page' },
        { k: 'p', text: 'One Tank is published here as a naming convention and a design constraint, because those are settled. The ultra-low-volume rate is settled, 1 litre of product per 20-litre tank, per acre, and so is the registration position: a One Tank code is a formulation and grade variant of an already-registered VAN product, so it is covered by that product’s registration and carries no separate licence. The potash grade is VL-Potash.' },
        { k: 'note', text: 'The analysis of a One Tank code is the analysis of the registered VAN grade it is built from. It is printed on that grade’s own page, with its pack size, and is not restated here. What a code adds on top of that grade is its delivery package: additional ingredients for ultra-low-volume spraying, not a different raw material. That package is still being set against VAN’s own drone work, so it is not written down here and will not be until it is fixed. VAN publishes no drift, coverage or spray-efficiency figure for drone application, because the trials that would support one have not been run.' },
        { k: 'cta', label: 'The products that fly today →', href: '#/products' },
      ],
    },
  ],
}

export const KNOWLEDGE_ARTICLES: RebuiltPage[] = [SOIL_SUSTAINABILITY, APPLICATION_SYSTEMS]

export const CIRCULAR_HUB: RebuiltPage = {
  slug: '', livePath: '/circular-economy/index.html',
  eyebrow: 'Beyond the bag · circular economy',
  h1: 'The residue leaves the field.',
  h1accent: 'We bring the minerals back.',
  lead: 'Crop residue leaves the field to fuel a bio-power boiler. The potassium and the silicon that the crop pulled out of that soil leave with it, and end up concentrated in the crop residue ash. We collect that ash, measure what is in it, recover the potassium and the silicon, and formulate them back into fertilizer. That is the loop.',
  tone: 'green',
  sections: [
    {
      id: 'where', n: '01', kicker: 'Where it stands', title: 'Potassium is in production. Silicon is not.', tone: 'green',
      lead: 'We do not average the two into one status. A reader deserves to know which is which before reading the process.',
      blocks: [
        { k: 'stats', items: [
          ['~20%', 'of VAN’s potash intake now comes from recovered material, not import'],
          ['3,000 t', 'fly ash processed to date'],
          ['500 t', 'recovered potash a year, from 5,000 t of ash. The line we are building for 2027'],
          ['~10 : 1', 'tonnes of ash in, per tonne of potash out'],
        ] },
        { k: 'p', text: 'We recover potassium today and consume it inside our own manufacturing, in place of imported potash. It is a working raw material, not a trial. About 300 tonnes of imported potash has been replaced between 2023 and 2026, across several forms and grades, which is what 3,000 tonnes of ash yields at the recovery ratio above.' },
        { k: 'p', text: 'We have taken the silicon route to the final stage of R&D. It is proven in our laboratory and is being readied to join the production line. The target form is not fixed yet. Soluble silicate and amorphous silica behave differently in an alkaline soil, and we will name the form when the R&D settles it, not before. Scale-up is planned for the end of 2027.' },
        { k: 'tags', items: ['Potassium: in production · scaling up', 'Silicon: R&D. Final stage', 'Feedstock: crop residue ash', 'Heavy metals screened by PCSIR'] },
      ],
    },
    {
      id: 'limits', n: '02', kicker: 'What we do not claim', title: 'Recovered potassium is used across VAN’s potash grades, so no single bag is marked with it.', bg: true,
      blocks: [
        { k: 'p', text: 'Recovered potassium enters VAN products as a raw material, the same way bought-in potash does. It is not kept for one grade. It is used across VAN’s potash grades, and VAN does not publish which, so no VAN product carries a “made with recovered potassium” mark. We publish the intake share and stop there.' },
        { k: 'p', text: 'Silicon recovery is still finishing R&D and is not in any product. We do not claim to close the carbon loop: combustion takes the carbon, we recover the minerals.' },
      ],
    },
  ],
  siblings: [
    { label: 'Fly ash to nutrient', href: '#/circular-economy/ash', note: 'What physically happens to a tonne of ash after it reaches VAN, step by step.' },
    { label: 'The soil actions register', href: '#/circular-economy/soil', note: 'Every intervention VAN makes to soil, the mechanism it works through, and the evidence behind it. The ones we leave off are named too.' },
  ],
}

export const CIRCULAR_ASH: RebuiltPage = {
  slug: 'ash', livePath: '/circular-economy/ash.html',
  eyebrow: 'Circular economy · the process',
  h1: 'Fly ash in.',
  h1accent: 'Potassium and silicon out.',
  lead: 'What physically happens to a tonne of crop residue ash after it reaches VAN. 10 tonnes of ash yield roughly 1 tonne of potash. The potassium route is running and feeding our own plant; the silicon route is finishing R&D. The process route itself stays proprietary, and the figures we do not yet hold are tagged rather than guessed.',
  tone: 'green',
  sections: [
    {
      id: 'decade', n: '01', kicker: '10 years', title: 'From a question to a commercial batch.', tone: 'soil',
      lead: 'VAN developed this route in-house, over 10 years. It started with a question from a bio-fuel producer and took a decade to reach a saleable batch. We publish the 2 dates we can date, and the intervals between them as intervals. We have not converted the gaps into stamped years.',
      blocks: [
        { k: 'table', t: {
          head: ['When', 'What we did', 'What it settled'],
          minWidth: 820,
          rows: [
            ['2014', 'Answered a question from a bio-fuel producer. What happens to the ash their boilers leave behind. The route began with that question, in 2014.', 'The problem was named. Nothing was recovered yet.'],
            ['The next 7 years', 'Ran the chemistry before the engineering. Characterised feedstock types and their analyses, mapped ash chemistry batch by batch, profiled the impurities, and worked out which grades of ash were worth touching at all.', '7 years before the first batch of crop residue ash landed with us as a working input.'],
            ['2 more years', 'Built the extraction technology and its configurations. Turning a characterised feedstock into a route that recovers potassium repeatably rather than once.', 'A process, not a laboratory result.'],
            ['Late 2023', 'Produced the first commercial batch.', 'The point the route stopped being development and started being production.'],
            ['Late 2023 → today', 'Produce, measure, adjust, produce again. The line has been on a learning curve since the first batch. Yields, impurity handling and configuration have all moved since late 2023.', 'In production and still improving.'],
          ],
          note: 'The ash-recovery site is not published. The dates above are VAN’s own record of the route’s development; they are not third-party verified.',
        } },
      ],
    },
    {
      id: 'steps', n: '02', kicker: 'Step by step', title: '7 steps, each with its own status.', bg: true,
      blocks: [
        { k: 'table', t: {
          head: ['#', 'What we do', 'Why it works', 'Status'],
          minWidth: 900,
          rows: [
            ['01', 'We source captured fly ash from boilers fired on agricultural residue. 3,000 tonnes processed to date; the 2027 line takes 5,000 tonnes a year.', 'Combustion removes the carbon and the water, so the mineral fraction, including K and Si, arrives concentrated relative to the raw residue.', '1 under long-term contract · 4 in negotiation'],
            ['02', 'We assay each incoming batch for potassium and silicon before accepting it.', 'Ash composition swings with the feedstock and the boiler, so there is no single fixed window worth quoting. We trace the crop residue and the burn cycle behind each batch and judge the ash against what that fuel should produce. Batches outside it are rejected rather than averaged out.', 'Running'],
            ['03', 'We send the ash to PCSIR for heavy-metal screening before it enters the process.', 'Ash is a waste stream. A recovered nutrient is only usable if what rides along with it is measured, and measured by someone other than us. PCSIR is a government laboratory outside VAN. The screening is against the applicable PSQCA limits, and the report goes out against a batch number like any other certificate.', 'PCSIR. External · PSQCA limits'],
            ['04', 'We extract the plant-available potassium and silicon from the ash body. About 1 tonne of potash per 10 tonnes of ash.', 'The recoverable fraction is separated from the inert residue so the nutrient can be dosed accurately rather than spread as bulk ash.', 'K: in production · Si: final R&D · route proprietary'],
            ['05', 'We charge the recovered potassium into our own manufacturing, in place of imported potash.', 'A recovered nutrient still has to granulate, flow, store and dissolve like the bought-in material it replaces. That is a manufacturing problem, and it is the one VAN already solves across its registered products.', 'In production. ~20% of intake · grade allocation not published'],
            ['06', 'We hold it to the same guaranteed analysis as any other raw material we buy.', 'The finished product’s declared N-P-K does not move because its potassium arrived from ash instead of a ship. The incoming material is assayed and dosed to hit the same number.', 'In production'],
            ['07', 'We are building the line beyond our own demand, 500 tonnes of recovered potash from 5,000 tonnes of ash, by 2027.', 'Recovery currently sizes to what VAN’s plant consumes. Scaling past that is what turns an internal substitution into a supply.', 'Target: 500 t/yr by 2027'],
          ],
        } },
      ],
    },
    {
      id: 'scope', n: '03', kicker: 'Under whose scope', title: 'Potassium is measured under LAB 336 accreditation; silicon is measured by an in-house method outside it.',
      lead: 'We separate what our accreditation covers from what it does not, and print which.',
      blocks: [
        { k: 'table', t: {
          head: ['Parameter', 'Where it is measured', 'Scope'],
          minWidth: 760,
          rows: [
            ['Potassium (as K₂O). Every production batch', 'VAN QC Laboratory', 'PNAC accredited · ISO/IEC 17025:2017 · LAB 336'],
            ['Silicon (Si)', 'VAN QC Laboratory, R&D method, final stage', 'In-house method, outside accredited scope'],
            ['Heavy metals, incoming ash', 'PCSIR, external government laboratory, not VAN', 'External screening · PSQCA limits'],
            ['pH · conductivity', 'VAN QC Laboratory', 'PNAC accredited (conductivity within the extended scope)'],
          ],
          note: 'VAN’s laboratory holds PNAC accreditation No. LAB 336 to ISO/IEC 17025:2017. We do not extend that accreditation to parameters it does not cover.',
        } },
        { k: 'cta', label: 'The VAN Lab →', href: '#/lab' },
      ],
    },
    {
      id: 'form', n: '04', kicker: 'What form it takes', title: 'Liquid or solid is a manufacturing decision.', bg: true,
      blocks: [
        { k: 'p', text: 'The recovery route yields recovered potassium in either form, and both go into VAN’s own manufacturing as raw material. Today the split follows what our internal process needs. As we scale past our own demand, we will produce the form the market and the customer ask for. We are not going to pin a ratio to it in advance.' },
        { k: 'note', text: 'Recovered potassium is a raw material either way. It carries no separate registration and no separate performance claim. The finished grades it feeds carry theirs.' },
      ],
    },
  ],
}

export const CIRCULAR_SOIL: RebuiltPage = {
  slug: 'soil', livePath: '/circular-economy/soil.html',
  eyebrow: 'Circular economy · the register',
  h1: 'VAN does not publish general writing on soil health.',
  h1accent: 'This page lists what VAN does to soil.',
  lead: 'This is the register. Every row is an intervention VAN actually makes, the mechanism it works through, and the evidence behind it. A row without a mechanism and an evidence status does not go on the page.',
  tone: 'soil',
  sections: [
    {
      id: 'why', n: '01', kicker: 'Why this page exists', title: 'Potassium and micronutrients leave with the harvest while nitrogen keeps going on.', tone: 'rust',
      blocks: [
        { k: 'p', text: 'Pakistan is not under-fertilised. What that nutrient consists of is the problem: overwhelmingly nitrogen, with potash under 1% of it. Potassium and the micronutrients leave with every harvest and are not put back; nitrogen goes on season after season into ground that cannot hold it. Across much of the cropped area organic carbon sits under 1%, so there is little left to hold a cation or a molecule of water. Yield per kilogram of nutrient has fallen while the kilograms have not.' },
        { k: 'p', text: 'More of the same bag does not answer that, and nor does a statement about caring for the soil. What follows is what VAN does instead.' },
        { k: 'cta', label: 'Sources for every figure. Why Pakistan must shift →', href: '#/knowledge/why-pakistan-must-shift' },
      ],
    },
    {
      id: 'register', n: '02', kicker: 'The register', title: 'What we do, how it works, and what backs it.', bg: true,
      blocks: [
        { k: 'table', t: {
          head: ['What we do', 'How it works on the soil', 'Where it shows up', 'Evidence'],
          minWidth: 980,
          rows: [
            ['We coat urea granules with sulfur.', 'The coating slows nitrogen release from days to weeks. Where soil sulfur-oxidising bacteria are active, oxidising that sulfur releases acid into the few centimetres around each granule, and phosphorus and zinc held by alkalinity can come back into solution there. A microsite effect, not a field one.', 'Vital Urea (SCU)', 'Patent 144684'],
            ['We granulate phosphate inside an acidic microenvironment and seal it with humic.', 'Pakistani soils run above pH 8 with free lime, and phosphate dissolving out of a granule meets calcium within a few centimetres. The granule carries its own acidic zone, which slows that reaction for the weeks a root needs; the humic seal is a soil and root benefit, not a calcium shield. A microsite effect, not a soil-test change.' /* D-194: the 70 to 80% line and the humic-shield mechanism came off (VAN's 31 Jul 2026 stoichiometry memo; Tahir 27 Sep) */, 'Green Phosphate', 'COA'],
            ['We supply potassium humate as pellets and as liquid.', 'Humate raises the soil’s cation exchange capacity and chelates cations, so applied nutrients are held on the exchange sites instead of leaching or precipitating.', 'Humi Grow · Humi Grow Plus', 'COA'],
            ['We manufacture compost from plant residue.', 'Plant residue only, screened free of contamination and pathogens before it goes in. Returns organic matter to soils that sit under 1% organic carbon. The input side of the deficit, applied as a measured product rather than as raw manure.', 'V-Compost', 'COA'],
            ['We recover potassium from crop residue ash and run it through our own plant.', 'Puts back the mineral fraction that left the field when the residue was cut for fuel, instead of importing mined potash for the same acre. Roughly 1 tonne of potash comes out of 10 tonnes of ash.', '~20% of VAN’s potash intake · 3,000 t ash processed · 500 t/yr line for 2027', 'In production'],
            ['We are completing the route that recovers silicon from the same ash.', 'Husk and straw carry heavy silicon loads that leave with the residue. Recovering it returns the element to the soil rather than sending it to an ash dump. Target form not fixed yet. Soluble silicate and amorphous silica behave differently in an alkaline soil, so we do not name one.', 'Not in any product', 'Final R&D'],
            ['We publish a dose and a growth stage for 28 crops.', 'An application rate tied to the crop’s uptake stage is the mechanism by which over-application stops.', '28 crop nutrition plans', 'Published'],
            ['We design against soil data, not against a national average.', '770,160 soil records across Punjab, roughly 18,000 across Sindh and 600 in Gilgit-Baltistan sit behind VAN’s formulation decisions. VAN did not collect that data and does not claim it. It comes from the provincial soil survey work and from VAN’s own sampling, and VAN reads it. A grade chosen against a district’s measured deficiency is a different product from a grade chosen against a national mean.', 'Every VAN grade and coating decision', 'Provincial soil survey + VAN sampling'],
            ['We coat the same granule differently depending on where it is going.', 'The phosphate granule sent to Kamalia carries an iron coat. The same granule going to Lodhran carries boron. 1 base material, one coating line, and the micronutrient chosen against the soil the bag will actually be opened on.', 'Coated phosphate grades', 'In production'],
            ['We set micronutrient need from the crop and the climate, not from the price list.', 'What a crop is short of depends on what its soil holds, what that crop removes and the season it grows in. Deciding the micronutrient from those three is the mechanism that stops one being applied where it was never missing, which is both a cost to the grower and a load on the soil.', 'Formulation and recommendation', 'In use'],
            ['We put a soil tool in the grower’s hands.', 'It reads what his soil holds, sets that against what his crop removes, and returns what to supply, by which route, at which stage. A rate given without the growth stage it belongs to cannot be applied correctly. The tool puts the plan in the hands of the person who applies it.', 'The nutrition creator on each crop page', 'In use'],
            ['We measure N, P₂O₅ and K₂O in our own accredited laboratory.', 'A guaranteed analysis a grower can rely on is what makes a rate recommendation meaningful. Unverified analysis makes every downstream soil calculation wrong.', 'All registered products', 'PNAC LAB 336'],
          ],
          note: 'Read together, the soil-data, coating, micronutrient and tool rows are one discipline: the right material, at the right rate, at the right stage, on the right field. VAN does not badge that. It is what a plan looks like when the soil decides the product rather than the other way round. Rows are added when the action exists and the evidence exists, not when the intention exists.',
        } },
      ],
    },
    {
      id: 'rule', n: '03', kicker: 'The rule behind this page', title: '3 tests every soil sentence on this site must pass.',
      blocks: [
        { k: 'p', text: '1 · Is there a verb we own? “We coat”, “we granulate”, “we recover”, “we measure”, not “we are committed to”, “we believe in”, “we strive for”.' },
        { k: 'p', text: '2 · Is there a mechanism? The sentence must say how the action changes the soil, in terms a soil scientist could argue with.' },
        { k: 'p', text: '3 · Is there an evidence status? Lab result, COA, patent, published plan, or the stage it is at. “pilot”, “to verify”.' },
      ],
    },
    {
      id: 'left-off', n: '04', kicker: 'Rows we have deliberately left off', title: 'What is missing, and why.', bg: true, tone: 'rust',
      blocks: [
        { k: 'table', t: {
          head: ['Not on the register', 'Why not'],
          minWidth: 700,
          rows: [
            ['Carbon / emissions reduction', 'A live R&D theme at VAN, but we hold no measured figure, so there is no mechanism and no evidence to publish.'],
            ['Biofertilizers (phosphorus-solubilising bacteria)', 'The mechanism is real; awaiting a VAN trial or COA reference before it earns a row.'],
            ['Water use', 'No VAN measurement exists. Nothing to say.'],
            ['Any yield percentage', 'Held back until each figure is tied to a named trial.'],
            ['An absolute displaced-import tonnage', 'We publish the share of our potash intake that recovery covers, the ash we have processed and the capacity we are building. We have not converted those into a tonnes-of-import-avoided headline, and we will not until it is a measured figure rather than a derived one.'],
            ['Heavy-metal limits', 'PCSIR screens the incoming ash; the thresholds are not printed here until we can print them exactly.'],
          ],
        } },
      ],
    },
  ],
}

export const CIRCULAR_PAGES: RebuiltPage[] = [CIRCULAR_ASH, CIRCULAR_SOIL]

/* ── PARTNER ───────────────────────────────────────────────────────────────────────────────────
 * Six sub-pages, carried across from the live site. The three formulation-code pages
 * (N-26L/N-24L, P-44L, PK-82) had a URL each on the live site; nobody searches a code, so their
 * content is merged into the pipeline page below and their URLs 301 there. /partner/dossier.html
 * merges into the partner hub's closing CTA for the same reason — it described what happens after
 * interest is expressed, and answered no question a reader arrives with.
 */

export const PARTNER_BRIEF_TO_BAG: RebuiltPage = {
  slug: 'brief-to-bag', livePath: '/partner/brief-to-bag.html',
  eyebrow: 'Your Brand · the process',
  h1: 'From brief to bag.',
  lead: '7 steps from an idea to a registered product in a dealer’s shop. VAN runs all 7, including PSQCA registration.',
  tone: 'navy',
  sections: [
    {
      id: 'steps', n: '01', kicker: 'The sequence', title: 'What happens, in order.',
      blocks: [
        // The live page carried these as labelled steps; the labels were graphics and did not survive
        // extraction, so the published sentences are shown in their published order rather than
        // given invented headings.
        { k: 'table', t: {
          head: ['', 'What happens'],
          minWidth: 640,
          rows: [
            ['Brief', 'Market, crop, stage, target price, pack format, and the constraint you are actually trying to beat.'],
            ['Ground', 'Soil, crop and water context for the territory the product is aimed at, so the formulation answers that ground rather than an average one.'],
            ['Bench', 'Bench work in the VAN lab: ratio, form, coating, chelation, solubility, pH and compatibility.'],
            ['Pilot', 'Produced on the same equipment that will run the commercial lot, so what works in the pilot still works at scale.'],
            ['Field', 'Trials on VAN’s research farms and, where you want them, on your own demonstration plots.'],
            ['Registration', 'PSQCA standard selection, dossier and licensing. Handled by VAN. 1 certificate, valid nationwide.'],
            ['Launch', 'Commercial production, certificate of analysis per lot, technical documentation and training material for your field team.'],
          ],
        } },
        // 11 Sep 2026 · the page was headed "Seven steps" and listed eight. Tahir ruled that repeat
        // ordering is the relationship after launch, not a step on the way to it, so it comes out of
        // the numbered list and is said here instead. Restore it as a row to go back.
        { k: 'note', text: 'After launch, repeat batches run to the frozen specification. Any change to that specification is a documented change, not a quiet one. That is the relationship rather than a step in it, which is why it is not numbered above.' },
      ],
    },
    {
      id: 'receive', n: '02', kicker: 'What you receive', title: 'The same documentation set VAN maintains for its own brands.', bg: true,
      lead: 'Which is why it already exists rather than being assembled for you.',
      blocks: [
        { k: 'table', t: {
          head: ['Document', 'What it contains', 'When'],
          minWidth: 820,
          rows: [
            ['Technical data sheet', 'Guaranteed analysis, directions and dosage, physical properties, packaging and storage. 1 page.', 'At specification freeze'],
            ['Safety data sheet', '16-section GHS format, per-product hazard classification, both VAN addresses, revision history.', 'At specification freeze'],
            ['Certificate of analysis', 'Physical status, moisture, particle size, pH and the chemical assays, each with specification, result and method.', 'Per production lot'],
            ['Registration file', 'PS standard applied and the PSQCA manufacturing licence number.', 'On licence issue'],
            ['Label artwork route', 'Declaration content and regulatory text; artwork execution to your brand guidelines.', 'Before first print'],
          ],
        } },
      ],
    },
    {
      id: 'registration', n: '03', kicker: 'Where registration sits', title: 'Registration is built in, not handed back to you.', tone: 'rust',
      blocks: [
        { k: 'lead', text: 'A formulation can be finished and a pilot can be good, and the product still misses its season because the licence takes one to obtain. VAN treats registration as part of the build rather than as your problem afterwards. The same team that has taken VAN’s own products through PSQCA takes yours, and VAN holds 22 licences against 8 Pakistan Standards to show it has done it.' },
        { k: 'cta', label: 'Regulatory and registration services →', href: '#/partner/regulatory' },
      ],
    },
  ],
}

export const PARTNER_ENGINEERING: RebuiltPage = {
  slug: 'engineering', livePath: '/partner/engineering.html',
  eyebrow: 'Your Brand · engineering',
  h1: 'VAN Engineering.',
  lead: 'This page lists what VAN can change in a formulation, and how far each one can be changed.',
  tone: 'navy',
  sections: [
    {
      id: 'axes', n: '01', kicker: '6 axes of customization', title: 'The questions we will ask you first.',
      lead: 'A blend that is right for cotton on a canal-irrigated sandy loam is wrong for the same crop on a saline block under tube-well water.',
      blocks: [
        { k: 'table', t: {
          head: ['Axis', 'What it decides'],
          minWidth: 640,
          rows: [
            ['Crop', 'Nutrient ratio and form matched to the species and the variety’s demand curve.'],
            ['Soil', 'pH, calcareousness, organic matter, texture and the fixation behaviour they cause.'],
            ['Growth stage', 'Germination, early growth, mid-life, reproductive, maturity, each takes a different product.'],
            ['Coating', 'Release control and deficiency correction built onto the granule rather than blended beside it.'],
            ['Stress', 'Moderate through severe. Heat at grain fill and cold nights in storage are both formulation problems.'],
            ['Water and delivery', 'Canal, tube well or hybrid; and increasingly drip, pivot and drone, which dictate solubility and salt index.'],
          ],
        } },
      ],
    },
    {
      id: 'bandwidth', n: '02', kicker: 'What VAN can formulate', title: 'What can actually be varied, and how far.', bg: true,
      lead: 'Ranges below describe VAN’s commercially practised capability; anything outside them becomes a development question rather than an order.',
      blocks: [
        { k: 'table', t: {
          head: ['Parameter', 'Range VAN works in', 'Notes'],
          minWidth: 900,
          rows: [
            ['Physical form', 'Powder · granular · pellet · crystalline · liquid', 'Solid grades can be produced in more than one form from the same chemistry.'],
            ['Compound (complex) NPK', 'Granules in which every granule carries the full declared analysis', 'The route when the customer needs a uniform granule that cannot segregate in the bag or in the spreader.'],
            ['Bulk blending', 'Physical blending of single-nutrient and specialty granules to a target ratio', 'The flexible route: a ratio can be changed between batches without changing the chemistry.'],
            ['Coating', 'Sulfur · humic · boron · iron coating, all at commercial scale. Dual-layer and biological coating in development.', 'Boron and iron coating are the house speciality: the micronutrient is built onto the granule rather than blended beside it, so it cannot segregate in the bag and it lands where the granule lands.'],
            ['Chelation', 'Chelated zinc and chelated iron manufacturing; micronutrient compatibility work', 'Chelate type is stated per formulation.'],
            ['Solubility', 'Fully water-soluble grades for fertigation and foliar', 'Solubility figures are declared per formulation from COA data, not estimated.'],
            ['pH / acid activation', 'Acidic microenvironment granulation; pH-corrected solubles', 'The core answer to phosphate fixation in calcareous soil.'],
            ['Application grade', 'Broadcast · basal · fertigation · foliar · drone ULV · centre pivot', '6 VAN products are already in commercial production in drone and ultra-low-volume grades; extension to the rest of the range is under review.'],
            ['Batch size', '1 tonne minimum · 50 tonnes maximum in a single lot', 'Larger orders run as repeat lots to the same frozen specification. About 50,000 tonnes are made a year.'],
            ['Pack formats', '1 L · 1 kg · 10 kg · 20–50 kg bags · 200 L drum · 1000 L IBC · jumbo bag', 'Formats offered per formulation, not as a fixed set.'],
          ],
        } },
      ],
    },
    {
      id: 'platforms', n: '03', kicker: '7 technology platforms', title: 'A brief is answered by combining platforms.', tone: 'green',
      lead: 'Each one is a capability VAN practises commercially today, not a research ambition.',
      blocks: [
        { k: 'table', t: {
          head: ['Platform', 'What it is', 'Where it already runs'],
          minWidth: 880,
          rows: [
            ['Controlled release', 'Sulfur coating of urea at commercial scale; dual-layer variants in development.', 'Vital Urea (sulfur-coated urea)'],
            ['Acid activation & humic coating', 'Acidic-microenvironment granulation with a humic seal, to slow phosphate fixation.', 'Green Phosphate 6-32-0'],
            ['Micronutrients', 'Zinc, boron, iron and multi-micronutrient formulation, granular and liquid; compatibility work for the tank.', 'V-Transform · V-Zinc · VL-Micromix'],
            ['Humic delivery', 'Potassium humate in crystal, powder, pellet and liquid at several concentrations.', 'Humi Grow · Humi Grow Plus'],
            ['Biologicals', 'A dedicated biological laboratory, established and running, with test production alongside it; phosphorus-solubilizing bacteria; compost and organic-carbon carriers. Strains are isolated locally and selected against Pakistani soil pH, climate and weather.', 'PSB · V-Compost'],
            ['Micronutrient coating', 'Boron and iron coated directly onto the granule. The house speciality. Biological coating is a current development track.', 'Coated NPK grades and micronutrient-fortified phosphates'],
            ['Solubles & precision grades', 'Fully soluble NPK and potash lines; low-salt, pH-corrected, drone-grade concentrates.', 'Vital Potash · VL-Potash Liquid · V-Germinator Pro'],
          ],
        } },
      ],
    },
    {
      id: 'wont', n: '04', kicker: 'What VAN will not do', title: '2 rules that do not move.', bg: true, tone: 'rust',
      blocks: [
        { k: 'p', text: 'A formulation developed for a client does not reappear as a VAN brand or as a library code. Ever.' },
        { k: 'p', text: 'If an analysis will not survive 12 months on a Pakistani warehouse floor, it does not go on the label. We will tell you the fallback instead.' },
        { k: 'note', text: 'Start by telling us the problem: the crop, the stage, the soil and the price the market will carry. VAN works out the chemistry.' },
      ],
    },
  ],
}

export const PARTNER_MANUFACTURING: RebuiltPage = {
  slug: 'manufacturing', livePath: '/partner/manufacturing.html',
  eyebrow: 'Your Brand · the plant',
  h1: 'Manufacturing & quality.',
  // D-177, Tahir 26 Sep 2026: "5 lines; lab and farm separate". Was "The whole chain sits under one roof ...
  // and a research farm" and "8 lines, one roof" with the biological laboratory counted as a line.
  // Lines as he ruled (D-175): granular, coated, liquid, water-soluble, compounded. Which old row maps to
  // "granular" (bulk blending) is Claude's reading and is on his open list. Revert: the v58 source zip.
  lead: 'The plant runs 5 production lines: granular, coated, liquid, water-soluble and compounded. Quality control sits beside them in the analytical laboratory, and every formulation is tried first on VAN’s research farms.',
  tone: 'navy',
  sections: [
    {
      id: 'site', n: '01', kicker: 'What is on site', title: '5 production lines, 2 laboratories.',
      blocks: [
        { k: 'table', t: {
          head: ['Line', 'What it does'],
          minWidth: 700,
          rows: [
            ['Granular', 'Physical blending of single-nutrient and specialty granules to a target ratio, with compatibility checked before the batch rather than after it.'],
            ['Coated', 'Sulfur coating at commercial scale, the line behind Vital Urea, and micronutrient coating: boron and iron coated directly onto the granule, so the micronutrient cannot separate in the bag and lands wherever the granule lands. Added in 2014.'],
            ['Liquid', 'The full VL liquid range, from foliar concentrates to fertigation grades.'],
            ['Water-soluble', 'Fully soluble grades for fertigation and foliar feeding.'],
            ['Compounded', 'Compound granulation, in which every granule carries the complete declared analysis, so nothing separates between the bag and the field.'],
            ['Repeat lots · how the lines are scheduled, not a line', 'Orders above a single lot run as repeat batches to the same frozen specification. Pack formats run from 1 litre to bulk, with finished-goods storage on site.'],
          ],
        } },
        { k: 'table', t: {
          head: ['Laboratory', 'What it does'],
          minWidth: 700,
          rows: [
            ['Analytical laboratory', 'PNAC-accredited, LAB 336, ISO/IEC 17025:2017. Every lot is tested here before it ships.'],
            ['Biological laboratory', 'Opened in 2026. Phosphorus-solubilizing bacteria in field trials; a liquid inoculant and a mycorrhizal product in development, all on locally isolated strains.'],
          ],
        } },
      ],
    },
    {
      id: 'qc', n: '02', kicker: 'Quality control', title: 'The method column is the one that matters in an audit.', bg: true, tone: 'green',
      blocks: [
        { k: 'p', text: 'Every production lot is released against a certificate of analysis from VAN’s own laboratory. The format is consistent across the catalogue: physical status, moisture, particle size and pH, followed by the chemical assays, each carrying its specification, its result and the method used to obtain it. That is why COA data, not marketing copy, is the source for every physical property published on this site.' },
        { k: 'table', t: {
          head: ['Rule', 'What it means'],
          minWidth: 620,
          rows: [
            ['No lot ships without a COA', 'Released against the frozen specification, every time.'],
            ['Every assay names its method', 'So a third-party result can be compared like for like.'],
            ['A specification change is documented', 'The partner is told before it takes effect. VAN does not substitute silently.'],
          ],
        } },
        { k: 'cta', label: 'How VAN Lab tests. The blind chain →', href: '#/lab#blind-chain' },
      ],
    },
    {
      id: 'farm', n: '03', kicker: 'The research farms', title: 'Every formulation is tested on calcareous field soil, not only on the bench.',
      blocks: [
        { k: 'p', text: 'VAN’s first agricultural experimental station was established in 2009 and the company runs its own research farms, staffed by agricultural scientists, for product trials. The farm is where a failure gets found out before a client’s season depends on it.' },
        { k: 'note', text: 'Standards the plant works to, with their numbers: 22 PSQCA manufacturing licences against 8 Pakistan Standards, each listed by brand with its licence number on the regulatory page, and a PNAC-accredited laboratory, ISO/IEC 17025:2017, Accreditation No. LAB 336. An ISO 9001 quality management certification is in progress with System Certification Centre (SCC), expected during 2027, and is not claimed here until the certificate is issued. Plant visits are part of most partner conversations, and for a co-manufacturing decision they are usually the point at which it becomes a real one.' },
      ],
    },
  ],
}

/**
 * FAQ AND ENQUIRY — Tahir's handwritten note, 9 Sep 2026 ("FAQs, particularly in Distributor tab —
 * OK, let's do"; "enquiry form → Distributor tab → re-check").
 *
 * The first six answers were already stated elsewhere on this page. Three more came from Tahir
 * directly on 10 September 2026 and are new public commitments, so they are written in his own
 * terms and nothing has been rounded off or softened:
 *
 *   VOLUME — "VAN is agile and our system can handle an order from 1 ton to 1000 tons. Pack size is
 *            standard as approved label."
 *   CREDIT — "Working capital is yours, we are in the business of manufacturing."
 *   LEAD TIME — "We make to ship, so an order between 1-10 tons takes 3-5 days and 11-100 tons takes
 *            7-18 days."
 *
 * Three more followed in the same conversation, and complete the set that had been left absent:
 *
 *   FIRST DELIVERY — "15 days after account opening and dealership formalities completed."
 *   MARGIN — "It's a portfolio and volume driven, discussed at commercial stage."
 *   ADVANCE BOOKING — "Yes, we do advance booking against cash discounts."
 *
 * Note that he has stated lead times only up to 100 tonnes while stating a capacity to 1,000, so
 * that answer gives the bands it was given and sends anything larger to a conversation rather than
 * extrapolating a delivery promise nobody made. The margin answer says plainly that there is no
 * single number, which is more use to a distributor than a range VAN would then have to defend.
 */
// D-205, 27 Sep 2026: 4 answers cut (territory, products, own brand, what do I get) because each
// repeated a block above it word for word; 12 became 8. Revert: the v61 zip.
const DISTRIBUTOR_FAQ: [string, string][] = [
  ['What is the minimum order, and the maximum?',
   'A batch starts at 1 tonne. A single lot is up to 50 tonnes, and the line runs up to 4 lots a week. There is no minimum on the order itself. VAN is a manufacturer with its own plant, so the plant schedules a batch to the size of your order, and a first order does not have to be a container. Pack sizes are the standard ones on the approved label; a distributor carrying VAN brands takes the pack the registration names.'],
  ['How long from order to shipment?',
   'VAN makes to ship rather than selling from stock, so the clock starts when the order is confirmed. 1 to 10 tonnes: 3 to 5 days. 11 to 100 tonnes: 7 to 18 days. Above 100 tonnes it is scheduled with you rather than quoted from a table, because that is a production plan, not a despatch.'],
  ['Do you give credit?',
   'No. Working capital is the distributor’s side of this. VAN is in the business of manufacturing, and the price reflects that rather than carrying finance inside it. VAN says this at the first meeting so that it is not a surprise on the first invoice.'],
  ['Can I book ahead?',
   'Yes. VAN takes advance bookings against a cash discount, which is the other side of not giving credit: you pay earlier and get a lower price instead of getting credit terms. It also lets the plant schedule production for your season in advance.'],
  ['How long from signing to the first delivery?',
   '15 days from account opening, once the dealership formalities are complete. That is the first consignment, not the first sample: the account, the paperwork and the production slot inside 15 days.'],
  ['What margin do I make?',
   'There is no single number, and a page that printed one would be quoting a figure VAN would then have to defend on every product and every volume. It is driven by the portfolio you carry and the volume you move, and it is settled at the commercial stage with the range in front of both of us.'],
  ['Can I see the products working before I commit?',
   'That is what the demonstration plots are for. They run in your own territory, before launch, on your own soil and your own crops. A distributor who has watched the crop respond sells differently from one who has read a leaflet.'],
  ['Who holds the product registration?',
   'VAN. The brands you would be carrying are registered by VAN and the licences are published. The regulatory page lists them, with numbers and dates, rather than asking you to take it on trust.'],
]

export const PARTNER_DISTRIBUTOR: RebuiltPage = {
  // 10 Sep 2026: rehomed to /become-a-dealer.html. livePath still names the OLD url because that is
  // what this field means: where the page lived on the site being replaced, which is what the
  // .htaccess redirect map is generated against.
  slug: 'distributor', livePath: '/partner/distributor.html',
  eyebrow: 'Work with us · distribution',
  h1: 'Carry VAN brands',
  h1accent: 'in your territory.',
  lead: 'The distributor route is the simplest way to work with VAN: our brands, our registrations, our agronomy behind you. Sold under your relationships, in your market. This page sets out what you get and what we ask.',
  tone: 'gold',
  sections: [
    {
      id: 'behind', n: '01', kicker: 'What VAN puts behind you', title: '4 things: the catalogue, 28 crop programmes, brand material, and training with demonstration plots.',
      blocks: [
        { k: 'table', t: {
          head: ['', 'What it is'],
          minWidth: 660,
          rows: [
            ['The catalogue', 'The range in the pack sizes the trade actually moves, on agreed lead times. What is available to you is the open catalogue. All 23 brands, Vital Urea included.'],
            ['28 crop programmes', 'Stage by stage, with product, rate and method for each stage. Your customer buys a full programme rather than a single bag, which gives you a reason to sell him the next one.'],
            ['Brand material', 'Artwork, literature and point-of-sale material carrying VAN branding, so your territory looks like a supported brand and not a stack of plain sacks.'],
            ['Training and demonstration plots', 'We train your team on the products before you sell them, and run demonstration plots in your territory before launch. A distributor who has seen the crop respond sells differently from one who has read a leaflet.'],
          ],
        } },
      ],
    },
    // D-210, 27 Sep 2026: the territory section (non-exclusive by default, exclusive against a committed
    // volume) came off on Tahir's word, as it came off Your Brand (D-204). Sections renumbered. Revert: the v61.2 zip.
    {
      id: 'range', n: '02', kicker: 'The range', title: 'What you would be carrying.',
      blocks: [
        { k: 'table', t: {
          head: ['Category', 'What it covers'],
          minWidth: 640,
          rows: [
            ['Nitrogen', 'Sulfur-coated urea. The coated-nitrogen answer to volatilisation on alkaline ground'],
            ['Phosphorus', 'Humic-coated and acidic phosphate grades built against calcium fixation'],
            ['Potash', 'Solid and liquid potash for the reproductive window'],
            ['NPK', 'Balanced and stage-specific grades; Crop Force is a compound, every granule carrying the full ratio'],
            ['Micronutrients', 'Zinc, boron, iron and a 4-metal mix, granular and liquid, placed where alkaline soil would lock them'],
            ['Secondary nutrients', 'Sulfur, magnesium and calcium grades'],
            ['Soil health & biologicals', 'Humates, compost and bio-fertilizer'],
          ],
        } },
        { k: 'note', text: 'Would rather sell it under your own name? All 23 brands are open for own-brand manufacturing, Vital Urea included. Same specification, same line, your brand on the pack.' },
        { k: 'cta', label: 'Own-brand manufacturing →', href: '#/partner/brief-to-bag' },
      ],
    },
    {
      id: 'faq', n: '03', kicker: 'Questions we are asked first', title: 'The answers, before you have to ask for them.', bg: true,
      // 10 Sep 2026: this line said "six questions" and that the minimum volume, the credit terms
      // and the lead time were deliberately absent. Tahir answered all three that evening, plus
      // advance booking, first delivery and margin, so the page now answers nine and the sentence
      // describing what it will not tell you had to go with them.
      lead: '8 questions that come up in every first conversation, answered here rather than saved for a meeting. The volume, the lead times and the credit position are all on this page, in the terms VAN actually works to.',
      blocks: [{ k: 'faq', items: DISTRIBUTOR_FAQ }],
    },
    {
      id: 'enquiry', n: '04', kicker: 'Start the conversation', title: 'Tell us the volume and how to reach you.',
      blocks: [{ k: 'enquiry' }],
    },
  ],
}

export const PARTNER_PIPELINE: RebuiltPage = {
  slug: 'pipeline', livePath: '/partner/pipeline.html',
  eyebrow: 'Your Brand · the library',
  h1: '27 unbranded formulations',   // D-183
  h1accent: 'each shown at its stage.',
  lead: 'They are carried under neutral codes so that the first thing a client sees is the technology, not a competing name. Where a formulation sits on the 6-stage path is stated plainly. A code at field-trial stage is not sold as if it were finished.',
  tone: 'gold',
  sections: [
    {
      id: 'library', n: '01', kicker: 'The library', title: 'Organised by code family.',
      lead: 'The letter gives the nutrient family, the number gives the analysis, and the same colour is carried through to the pack.',
      blocks: [
        { k: 'library' },   // D-197: the full library moved here from Your Brand
        { k: 'cta', label: 'Composition chart: every code and every brand with its analysis →', href: '#/composition#library' },   // D-202
      ],
    },
    {
      id: 'codes', n: '02', kicker: '3 codes in detail', title: 'What a dossier conversation starts from.', bg: true,
      blocks: [
        { k: 'h3', text: 'N-26L · N-24L. Liquid nitrogen, formulated for the pivot and the leaf' },
        { k: 'p', text: 'Nitrogen carried in 3 forms at once, with zinc and boron already in solution, so one injection feeds across a window instead of spiking, and the micronutrient does not need a second pass. A single-form nitrogen delivers everything at once; under a pivot that is the wrong shape. Splitting the nitrogen across nitrate, ammoniacal and urea fractions changes the shape of the supply rather than the amount.' },
        { k: 'table', t: {
          head: ['Nitrogen fraction', 'N-26L', 'N-24L', 'What the fraction does'],
          minWidth: 820,
          rows: [
            ['Total nitrogen', '26.00%', '24.00%', 'The declared total. The 3 rows below sum to it exactly.'],
            ['Nitrate nitrogen', '5.75%', '2.00%', 'Taken up as it lands. Moves with the water, so it suits injection.'],
            ['Ammoniacal nitrogen', '6.50%', '3.00%', 'Held on the soil exchange sites rather than moving straight down with the wetting front.'],
            ['Urea nitrogen', '13.75%', '19.00%', 'The reserve fraction. Converts before it becomes available, so it arrives after the first two.'],
            ['Zinc (Zn)', '0.6%', 'n/a', 'In solution, not tank-mixed at the pump.'],
            ['Boron (B)', '0.02%', '1.00%', 'N-24L is the boron-loaded grade; N-26L carries a maintenance level.'],
            ['Solution pH', '6.6', '6.6', 'Near-neutral. Acidic solution strips zinc from galvanising, alkaline solution attacks aluminium, and 6.6 sits between the two.'],
            ['Density', '1.21 kg/L', '1.21 kg/L', 'Needed to convert an injection rate in litres into kilograms of nitrogen.'],
            ['Shelf life', '3 years', '3 years', 'From date of manufacture, in the sealed pack.'],
            ['Registration', 'PS 5469-2020', 'PS 5469-2020', 'Application in process, not yet licensed.'],
          ],
          note: 'Derived, not measured: at 1.21 kg/L, 1 litre of N-26L carries 315 g of nitrogen and 1 litre of N-24L carries 290 g. Arithmetic on the declared analysis and the density, not a separate measurement. Packs: 20 L, 200 L, 1000 L IBC. No dose rate is published. It varies by crop, region and application method, and is set per programme.',
        } },
        { k: 'h3', text: 'P-44L. Liquid foliar phosphorus, 44% w/v' },
        { k: 'p', text: 'In Pakistan the problem is alkaline calcareous soil at roughly pH 7.9 to 8.4, where a large majority of applied phosphorus is fixed as calcium phosphates and never reaches the plant at all. A foliar phosphorus applied here bypasses the fixation reaction by never letting it start.' },
        { k: 'table', t: {
          head: ['Nutrient', 'Content', 'g / L'],
          minWidth: 520,
          rows: [['P₂O₅', '44.0% w/v', '440'], ['K₂O', '7.5% w/v', '75'], ['MgO', '4.0% w/v', '40'], ['Zn', '1.0% w/v', '10'], ['B', '0.5% w/v', '5'], ['Fulvic acid', 'included · absorption aid', 'n/a'], ['Plant-derived organic carrier', 'proprietary', 'n/a']],
          note: 'Zinc and boron are supporting micronutrients, not the headline. VAN does not claim to out-load an imported product on any single element. The argument is formulation built for Pakistani soil, Pakistani water and a Pakistani spray programme, and the ability to change the specification for a client.',
        } },
        { k: 'h3', text: 'The VAN phosphate system. 4 routes past soil fixation' },
        { k: 'table', t: {
          head: ['Route', 'Product', 'Analysis', 'Stage of the crop'],
          minWidth: 820,
          rows: [
            ['Soil · basal', 'Green Phosphate', '6-32-0, humic-coated acidic', 'Sowing / land prep'],
            ['Soil · basal', 'Fusion Phosphate (TSP)', 'P₂O₅ 46 total / 43 water-soluble', 'Sowing'],
            ['Fertigation · solid', 'V. Ammonium Phosphate (V-Phosphate)', '10-44-0 + Fe', 'Mid-life'],
            ['Fertigation · liquid', 'V-Germinator Pro', 'P₂O₅ 27% w/v + N · K · Mg · S · Fe', 'Germination / phosphate booster'],
            ['Foliar · liquid', 'P-44L', 'P₂O₅ 44% w/v + K · Mg · Zn · B', 'Rapid growth / stress window'],
            ['Reproductive PK', 'PK-82', 'P₂O₅ 42 · K₂O 40', 'Flowering to grain fill'],
          ],
        } },
        { k: 'h3', text: 'PK-82. High P+K reproductive complex' },
        { k: 'p', text: 'Pakistani nutrition programmes are front-loaded. Nitrogen and basal phosphorus get applied, and then the crop reaches the stage where potassium demand peaks. Grain fill in wheat, boll development in cotton, tuber bulking in potato, fruit set in mango and citrus, and the programme has nothing left in it. Potassium is the most heavily mined nutrient in the country’s soils and phosphorus is the most heavily fixed, so the reproductive window is where both shortfalls arrive at once.' },
        { k: 'p', text: 'PK-82 is P₂O₅ 42% and K₂O 40%, 82 nutrient units, and the two figures sum to the code. It is deliberately nitrogen-free so that it can be applied at a stage where more nitrogen would push vegetative growth at exactly the wrong moment. Produced in powder, crystalline soluble and liquid concentrate.' },
        { k: 'note', text: 'No trial figure is published for PK-82. None has been signed off. No dose rate is published for this code. It varies by crop, region and application method, and is set per programme.' },
      ],
    },
    {
      id: 'np', n: '03', kicker: 'The 2 NP grades', title: 'They attack the same problem from opposite ends.',
      lead: 'Both are aimed at the fact that a large share of the phosphorus applied to Pakistani soil is fixed as calcium phosphate before the crop reaches it. Which is why they are 2 grades and not 1.',
      blocks: [
        { k: 'h3', text: 'N 5 · P 40. A timing answer' },
        { k: 'p', text: 'The phosphate is carried in 2 fractions with different release behaviour: one available immediately, for the seedling root that has to find phosphorus in its first weeks; one releasing slowly afterwards, still supplying when demand peaks. A conventional basal phosphate delivers its whole load into the window where fixation is fastest and the crop is smallest. This splits that load across the season from a single placement. Low nitrogen by design: a phosphorus product with enough nitrogen to work with, not an NP blend balanced for both.' },
        { k: 'h3', text: 'N 8 · P 38. A chemistry answer' },
        { k: 'p', text: 'Rather than timing the phosphate around fixation, this grade is formulated to resist the reaction itself. Sulfur acidifies the granule’s immediate soil environment, where alkalinity drives the precipitation; alongside it, VAN’s calcium-resistant agents are formulated to hold soil calcium off the phosphate so it stays plant-available for longer. The release is slow throughout rather than split in two. The sulfur is a functioning part of the formulation, not a filler, and it is a nutrient the crop needs in its own right.' },
        { k: 'note', text: 'Both descriptions are of mechanism, not measured outcome. No trial figure is published against either grade, because none has been signed off. The same rule that applies to every other code in this library. The analyses shown are recorded on VAN’s own register; the analysis report and specification sheet are available on request. The sulfur loading on the 8-38 grade is deliberately not published. Both grades are made in granular, powder and crystalline form, in 50 kg and 1000 kg packs.' },
      ],
    },
    {
      // D-185, Tahir 26 Sep 2026: licensing is not offered. The 3-row licence table (non-exclusive,
      // exclusive, graduation to a VAN brand) came off here. The published-versus-NDA table stays,
      // because it is about confidentiality, not licensing. Revert: restore the rows from the v60 zip.
      id: 'terms', n: '04', kicker: 'Before an agreement', title: 'What crosses the line, and what does not.', bg: true, tone: 'green',
      blocks: [
        { k: 'table', t: {
          head: ['', 'What is published, and what is not'],
          minWidth: 640,
          rows: [
            ['Public', 'Code, family, purpose, available grades and forms, target crops and application methods, pipeline stage, and one headline trial figure once it has been verified.'],
            ['Behind an NDA', 'Full guaranteed analysis, manufacturing specification, trial protocols and raw data, pricing, tank-mix and compatibility charts, and detailed regulatory status.'],
          ],
          note: 'Nothing crosses that line without a signed agreement, including for existing clients on other products. Tell us which code you are interested in and what you would do with it. The dossier follows the agreement, usually within 2 weeks.'   // D-189: 2 weeks, the August ruling, restored over "same week",
        } },
      ],
    },
  ],
}

export const PARTNER_REGULATORY: RebuiltPage = {
  slug: 'regulatory', livePath: '/partner/regulatory.html',
  eyebrow: 'Your Brand · regulatory',
  h1: 'A fertilizer that is not registered',
  h1accent: 'cannot be sold.',
  lead: 'If the selling season is missed, the product cannot be sold until the next one. VAN runs Pakistani registration for its own catalogue, 20 of 23 brands hold a live PSQCA licence, and now runs that work for partners as a service in its own right.',
  tone: 'navy',
  sections: [
    {
      id: 'holds', n: '01', kicker: 'What VAN already holds', title: 'VAN already holds the licences listed below.',
      blocks: [
        { k: 'table', t: {
          head: ['Product', 'Standard', 'Manufacturing licence'],
          minWidth: 700,
          rows: [
            ['Vital Urea (sulfur-coated urea)', 'PS 217-2023', 'CM/L-4126/2025'],
            ['Vital Potash', 'PS 933-2026', 'CM/L-4124/2025'],
            ['V-Phosphate', 'PS 933-2026', 'CM/L-4297/2026'],
            ['Green Phosphate', 'PS 933-2026', 'CM/L-2719/2023'],
            ['Fusion Phosphate', 'PS 216-2009 (TSP)', 'CM/L-2942/2023'],
            ['Fusion Potash', 'PS 933-2026', 'CM/L-2674/2026'],
            ['Crop Force', 'PS 933-2026', 'CM/L-4298/2026'],
            ['V-Potash Plus', 'PS 933-2026', 'CM/L-2944/2023'],
            ['Green Sulfur', 'PS 5449-2020', 'CM/L-2962/2023'],
            ['Humi Grow', 'PS 5610-2023', 'CM/L-3281/2024'],
            ['Humi Grow Plus', 'PS 5610-2023', 'CM/L-3274/2024'],
            ['Tornado', 'PS 5606-2023', 'CM/L-4125/2025'],
            ['V-Transform', 'PS 1539-1982 (Zinc Sulphate)', 'CM/L-3132/2024'],
            ['V-Zinc 10%', 'PS 5469-2020', 'CM/L-3130/2024'],
            ['VL-NPK', 'PS 5469-2020', 'CM/L-3131/2024'],
            ['VL-Micromix', 'PS 5469-2020', 'CM/L-3129/2024'],
            ['VL-Boron', 'PS 5469-2020', 'CM/L-3159/2024'],
            ['VL-Potash Liquid', 'PS 5469-2020', 'CM/L-2943/2023'],
            ['Cala-Mag V', 'PS 5469-2020', 'CM/L-4299/2026'],
            ['V-Germinator Pro', 'PS 5469-2020', 'CM/L-4300/2026'],
            ['V-Mag Essential', 'n/a', 'Conformance report'],   // D-177, Tahir 26 Sep: carries a conformance report
            ['V-Compost', 'Soil Fertility Research Institute', 'SFRI-2025-07'],
          ],
          note: 'From VAN’s trademark and PSQCA master record, July 2026. Product names in this table are the names held on the licences themselves, which is not in every case the name the product is sold under. V-Phosphate is registered as V-Phosphate 10-44-0 and marketed as V. Ammonium Phosphate. 20 of the 23 brands hold a live PSQCA manufacturing licence. The other 3 each have a reason: V-Mag Essential carries a conformance report, V-Compost is registered with the Soil Fertility Research Institute, and SOP is a traded commodity to which no VAN licence applies.',
        } },
      ],
    },
    {
      id: 'backup', n: '02', kicker: 'Backup registrations', title: 'Why VAN holds 2 sets.', bg: true, tone: 'rust',
      blocks: [
        { k: 'p', text: 'When the licences for the Vital line were running late, VAN filed a second set under the earlier V- names rather than wait and lose a season. VAN holds both sets. V-Urea carries CM/L-2564/2022 and V-Potash carries CM/L-2565/2022 alongside the 2025 Vital licences the products trade under today.' },
        { k: 'p', text: 'VAN files the fallback before it is needed, so that a delay at the authority does not stop the product being sold. Partner registrations are handled the same way.' },
      ],
    },
    {
      id: 'runs', n: '03', kicker: 'How the work runs', title: '4 steps. VAN controls the first 2.',
      blocks: [
        { k: 'table', t: {
          head: ['Step', 'What happens'],
          minWidth: 660,
          rows: [
            ['Standard selection', 'Which PS standard the product falls under, and whether the intended analysis fits inside it. Getting this wrong is the most expensive mistake in the process.'],
            ['Testing', 'Analysis against the standard, with VAN’s own laboratory data and certificates supporting the file.'],
            ['Dossier and filing', 'Preparation and filing with PSQCA, including the manufacturing evidence that an importer or a trader cannot supply.'],
            ['Licence', 'The certificate lands and the product can legally be sold anywhere in Pakistan.'],
          ],
          note: 'VAN controls the first 2 steps and completes them inside 3 weeks. The last 2 sit with the regulator; 1 to 3 months is typical, and no manufacturer can promise more precisely than that.',
        } },
        { k: 'note', text: 'Every VAN product carries a complete technical file, and a partner product is built to the same standard from the start: a 1-page technical data sheet, a 16-section GHS safety data sheet with a per-product hazard classification rather than a blanket template, and a certificate of analysis issued per production lot from VAN’s own QC laboratory with specification, result and method for every assay.' },
        { k: 'cta', label: 'From brief to bag. Where registration sits →', href: '#/partner/brief-to-bag' },
      ],
    },
  ],
}

export const PARTNER_PAGES: RebuiltPage[] = [PARTNER_BRIEF_TO_BAG, PARTNER_ENGINEERING, PARTNER_MANUFACTURING, PARTNER_DISTRIBUTOR, PARTNER_PIPELINE, PARTNER_REGULATORY]

/* ── VAN LAB ───────────────────────────────────────────────────────────────────────────────────
 * The live site had five lab pages. Four of them restated the Blind Chain protocol near-verbatim,
 * so they are merged into one /lab page with deep-linkable anchors, and their URLs 301 to those
 * anchors. /lab/verify.html goes to the site's existing standalone /verify route instead — that one
 * answers a distinct question ("is this bag real") and earns its own page.
 */
// D-166, 25 Sep 2026: LAB_SECTIONS moved into src/data/lab.ts and merged with the /lab page, so
// the blind chain, booking and the audiences are each told once. Revert: v54 source zip.
