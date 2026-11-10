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
// D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction

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
  // L2 fact check 9 Nov 2026 (W5): VAN does not manufacture SOP (PR-1). Was 'What VAN makes'.
  head: ['What the soil is short of', 'What that requires', 'What VAN supplies'],
  minWidth: 720,
  rows: [
    // L1 editor 7 Nov 2026 (B2, m15): recovered potassium moved here from the organic matter row; curly apostrophe.
    ['Potassium', 'Potash applied in the crop’s uptake window, in a form that can be delivered through fertigation rather than only at land preparation', 'Vital Potash · SOP · V-Potash Plus · potassium recovered from crop residue ash (Circular economy)'],
    ['Available phosphorus', 'Phosphate formulated to resist binding by calcium, rather than simply applied at a higher rate', 'VAN NP Range · Green Phosphate'],
    ['Zinc and boron', 'Micronutrients applied at the growth stage that needs them, through the irrigation water or on the leaf, because the soil would bind them if they were applied to it', 'V-Zinc · VL-Boron · VL-Micromix'],
    // L1 editor 7 Nov 2026 (B2): was 'Carbon returned to the soil, and potassium recovered from the ash of crop residue burned in boilers' /
    // 'V-Compost · Humi Grow · V-Transform · Circular Economy'. The circular pages say VAN does not return the residue's carbon to the soil;
    // V-Transform is Zinc 21% granular in the catalogue (a micronutrient, not an organic matter product).
    ['Organic matter', 'Carbon returned to the soil as compost and humate', 'V-Compost · Humi Grow'],
    ['Nitrogen', 'Coated, controlled-release nitrogen for soils where part of the nitrogen from uncoated urea is lost to the air as ammonia', 'Vital Urea'],
  ],
}

export const SOIL_SUSTAINABILITY: RebuiltPage = {
  slug: 'soil-and-sustainability',
  livePath: '/knowledge/soil-and-sustainability.html',
  eyebrow: 'Knowledge · the state of Pakistani soil',
  h1: 'We have been spending the soil’s',
  h1accent: 'capital, not its income.',
  lead: 'Published figures, and calculations based on them, show that for decades crops in Pakistan have removed more nutrient from the soil than has been put back. Every tonne of cane, wheat or cotton taken from a field removes nutrients with it. When less nutrient is put back than the harvest removes, the difference comes from the soil’s own reserves, and those reserves are finite even in soil that was once rich.',
  tone: 'soil',
  sections: [
    {
      id: 'overdraft', n: '01', kicker: 'Potassium removed and applied', title: 'Crops in Pakistan remove far more potassium than is applied.', tone: 'rust',
      blocks: [
        // D-143: per acre (kg/ha ÷ 2.471). Was '100–150 kg' / 'K₂O per hectare removed...', '1.48 kg' / 'K₂O per hectare, the
        // national average...' and 'At 100 to 150 kg of K₂O removed per hectare against 1.48 kg applied'. Revert: restore those.
        { k: 'stats', items: [['40 to 61 kg', 'K₂O removed per acre each year by cropping in Pakistan, as estimated in a 2017 review'], ['0.6 kg', 'K₂O applied per acre of cropland in 2023, national average']] },
        { k: 'p', text: 'Crops in Pakistan take most of their potassium from the soil’s own reserves, so those reserves fall every season. A 2017 review estimated that cropping in Pakistan removes 40 to 61 kg of potash (as K₂O) per acre each year, while the national average application in 2023 was 0.6 kg of K₂O per acre of cropland. Both figures measure potassium as potash (K₂O), and they come from different sources and years. Tahir Abbas’s potash balance model reaches the same conclusion for Punjab.' },
        { k: 'source', text: 'Removal: Wakeel, A. & Magen, H. (2017), Potash Use for Sustainable Crop Production in Pakistan: A Review, International Journal of Agriculture & Biology 19(3). Application: FAOSTAT Fertilizers by Nutrient via Our World in Data (2023), potash per hectare of cropland. Published per hectare: 100 to 150 kg removed, 1.48 kg applied; divided by 2.471 for per acre.' },
        // D-246: Punjab's own record, 1971-72 to 2023-24, beside the national figure.
        { k: 'lens', label: 'Punjab potash balance, 1971-72 to 2023-24', specs: [{ id: 'punjab' }] },
      ],
    },
    {
      id: 'where', n: '02', kicker: 'Published soil surveys', title: 'Published soil surveys report low organic matter and widespread shortages of phosphorus, boron, zinc and potassium.', bg: true,
      lead: 'Each of these surveys reports widespread deficiency. Their figures cannot be compared directly, because each covers its own region and year and uses its own sample count and critical level.',
      blocks: [
        { k: 'table', t: {
          head: ['Nutrient or property', 'What the survey found', 'Region, year, samples', 'Source'],
          minWidth: 860,
          rows: [
            ['Organic matter', 'over 95% deficient', 'Muzaffargarh district, Punjab · 3,325 composite samples · published 2014', 'Akram, Z., Hussain, S. & Mansoor, M. (2014), Universal Journal of Agricultural Research 2(7):242–249'],
            ['Organic matter', 'organic matter content usually below 1%', 'Punjab surface soils', 'Azam (1988); Rashid (1994), as cited in Minhas et al. (2024)'],
            ['Phosphorus', '99% deficient in available phosphorus', 'Hazro tehsil, Attock district', 'as cited in Alvi, S., Khalid, R. & Rashid, M. (2011), Pak. J. Sci. Ind. Res. 54(1):45–47'],
            ['Phosphorus', 'over 70% deficient', 'Punjab province', 'Malik (1984); Rashid (1994), as cited in Minhas et al. (2024)'],
            ['Boron', '70.8% of surface soils deficient', 'Multan citrus orchards · 24 orchards · critical level 0.5 mg/kg', 'Minhas, A., Ahmed, N. & Sajid, M. (2024), Journal of Plant and Environment 5(1):71–85'],
            ['Boron', '41% of samples deficient', 'Multan district', 'Rashid (1995, 1996)'],
            ['Zinc', 'over 60% deficient', 'Punjab province', 'Tariq et al. (2004), as cited in Alvi et al. (2011)'],
            ['Potassium', '40% of soils deficient', 'Pakistan, review of available data', 'Wakeel, A. & Magen, H. (2017), Int. J. Agric. Biol. 19(3)'],
          ],
          // L1 editor 7 Nov 2026 (m17): a finding, so shown as a table note, not under the 'Source' label. Was source: '...'.
          note: 'A national survey of 329 soil samples found zinc and boron deficiency most widespread, followed by iron deficiency: Zia et al. (2004), as cited in Alvi et al. (2011).',
        } },
        { k: 'note', text: 'For Punjab there are also district-level measurements: the 770,160 samples of the Punjab soil testing programme, tested in about 2016 to 2018 in 36 districts and shown for each district in the Soil Atlas.' },
        { k: 'cta', label: 'Soil Atlas →', href: '#/soil' },
      ],
    },
    {
      id: 'alkaline', n: '03', kicker: 'How alkaline soil causes deficiencies', title: 'Alkaline soil causes most of the deficiencies that the surveys report.', tone: 'rust',
      blocks: [
        { k: 'p', text: 'Most cultivated soil in Pakistan is calcareous and alkaline, with free calcium carbonate throughout the soil profile and a pH commonly above 8. Phosphorus applied to such soil combines with calcium into forms the root cannot take up. Zinc, iron and manganese become less soluble as pH rises. Micronutrient deficiencies are therefore most common in the soils with the most lime, which have the highest pH. They are also most common where organic matter is lowest. Alkaline soil also causes nitrogen loss: urea applied to the surface of these soils breaks down (hydrolyses), and part of its nitrogen is lost to the air as ammonia before the crop can take it up.' },
        { k: 'p', text: 'Low organic matter makes each of these problems worse. Organic matter holds nutrients against leaching, buffers pH, feeds soil organisms and improves soil structure and water retention. Where organic matter is below 1%, the soil gets very little of these benefits. Summer temperatures above 45 °C in Pakistan speed up decomposition, and crop residue is usually burned or fed to livestock rather than returned to the soil. Organic matter is therefore broken down faster than it is replaced. As with the mineral nutrients, too little is returned to the soil.' },
      ],
    },
    {
      id: 'gap', n: '04', kicker: 'What is missing', title: 'Pakistan has no national record of soil nutrient levels over time.', bg: true,
      blocks: [
        { k: 'lead', text: 'VAN has found no published national series of soil nutrient measurements (in ppm) for Pakistan running from the 1980s to the present.' },
        { k: 'p', text: 'Wakeel and Magen’s 2017 review of potash use in Pakistan notes that, because soil testing facilities are scarce, farmers in Pakistan usually do not have their soils analysed. Soil testing in Pakistan has been sparse and irregular, and it has been organised district by district rather than as a national survey repeated at the same sites. There is therefore no consistent baseline against which to measure change.' },
        { k: 'p', text: 'What does exist is published evidence on depletion: estimates of the potassium removed by crops and of the potassium applied, and separate surveys of the soil in particular places and years. The national trend in soil nutrient levels is therefore calculated, not measured.' },
        { k: 'note', text: 'A national soil health atlas, based on a survey repeated on a regular schedule with a consistent method, reported by district and open to the public, would allow the national trend in soil nutrient levels to be measured. Until Pakistan has one, every discussion of balanced nutrition in Pakistan, including VAN’s, relies on incomplete evidence.' },
      ],
    },
    {
      id: 'builds', n: '05', kicker: 'VAN products for each soil shortage', title: 'What each soil shortage requires, and the VAN products made for it', tone: 'green',
      blocks: [
        { k: 'table', t: SOIL_GAP_TABLE },
        { k: 'cta', label: 'The national picture: usage, balance and productivity →', href: '#/knowledge/why-pakistan-must-shift' },
      ],
    },
  ],
}

export const APPLICATION_SYSTEMS: RebuiltPage = {
  slug: 'application-systems',
  livePath: '/application-systems.html',
  eyebrow: 'Knowledge · Application systems',
  h1: 'A bag is not a dose.',
  h1accent: 'How a nutrient is delivered is part of the product.',
  lead: '2 fields can receive the same nutrient, in the same quantity and in the same season, and the crops can still respond differently. The form of the product, the timing and placement of the application, and the product’s physical fit with the application equipment decide how much of the nutrient reaches the crop. VAN therefore formulates each product for the application equipment as well as for the crop.',
  tone: 'navy',
  sections: [
    {
      id: 'three', n: '01', kicker: 'The 3 systems', title: 'Pivot, drip and drone: what each irrigation or spraying system requires of the product',
      lead: 'Each system places the nutrient differently. A centre pivot spreads it with the irrigation water over the whole circle, in many small doses. Drip irrigation delivers it to the wetted root zone. A drone delivers it to the leaf. By comparison, broadcasting spreads it over the whole soil surface, and the roots must reach it there.',
      blocks: [
        { k: 'table', t: {
          head: ['', 'Pivot', 'Drip', 'Drone'],
          minWidth: 760,
          rows: [
            ['Where the nutrient lands', 'Whole circle, with the water', 'Wetted root zone only', 'On the leaf'],
            ['Most demanding requirement', 'No precipitate in the carrier water', 'Near-zero insolubles, to protect emitters and filters', 'Concentration and suspension stability'],
            ['Form VAN supplies', 'Soluble crystal and liquid', 'Liquid and soluble crystal, acidic reaction where water is hard', 'Concentrated liquid and fine water-dispersible granules (WDG)'],
            ['What it gives the grower', 'Low-cost split application in many small doses', 'Precise placement, with nothing applied between the rows', 'Access and speed: it can spray crops that ground equipment cannot enter, and finish within a short spray window'],
            ['Crops it suits best', 'Field crops under pivot irrigation', 'Orchards, high-value vegetables, protected cropping', 'Sugarcane, maize, rice and cotton, after the canopy closes'],   // L1 editor 7 Nov 2026 (m12): was 'Sugarcane, maize, rice, cotton at canopy closure'
          ],
        } },
        // D-317: was "... and the two failure directions are opposite." The 2 directions are named from the site's own N-26L pH row (partner pipeline page).
        { k: 'p', text: 'In a centre pivot, the injected solution comes into contact with every part of a long galvanised span on each pass. It can damage the machine in 2 opposite ways: an acidic solution strips zinc from the galvanising, and an alkaline solution attacks aluminium. pH is therefore the main property to control in a pivot programme: the wrong pH makes the machine wear out sooner than normal. VAN sets the pH before the product is packed, rather than leaving it to the grower at the injection point.' },
        { k: 'note', text: 'The measured pH of each batch is on its lab report, which opens when the batch number is entered on the Verify a bag page. VAN has not run its own corrosion or equipment-life tests; the corrosion risks to a pivot are taken from standard corrosion engineering.' },
      ],
    },
    {
      id: 'four', n: '02', kicker: 'Between the bag and the crop', title: '4 decisions that affect how much nutrient reaches the crop', bg: true,
      blocks: [
        { k: 'h3', text: 'Form' },
        { k: 'p', text: 'The form of a product affects how much of its nutrient stays available to the crop. On soil above pH 8, uncoated urea applied to the surface breaks down (hydrolyses), and part of its nitrogen is lost to the air as ammonia. Urea inside a sulfur coating dissolves gradually instead of all at once. In alkaline soil, chelated micronutrients stay available to the crop, while the sulfate forms of the same micronutrients precipitate and become unavailable.' },
        { k: 'h3', text: 'Timing' },
        { k: 'p', text: 'A crop’s demand for nutrients peaks at defined growth stages, and much of the nutrient supplied outside those stages is wasted. VAN’s 28 crop plans are therefore written stage by stage rather than as a season total.' },
        { k: 'h3', text: 'Placement' },
        { k: 'p', text: 'A nutrient can be broadcast, drilled, side-dressed, banded, applied through irrigation water (fertigation) or sprayed on the leaf. The ways in which nutrient is lost, and the amounts lost, differ from one method to another. Because the method usually depends on the equipment the grower owns rather than on agronomy, VAN designs each product for the method by which it will be applied.' },
        { k: 'h3', text: 'Physical fit' },
        { k: 'p', text: 'A product that blocks an emitter, settles out of a spray tank or is too coarse for a drone boom cannot be used with that equipment, whatever its nutrient content. Solubility, particle size, pH and behaviour in a tank mix decide whether a product can be used with a given piece of equipment.' },
      ],
    },
    {
      id: 'systems', n: '03', kicker: 'Application methods', title: 'What each application method requires of the product', tone: 'green',
      blocks: [
        { k: 'table', t: {
          head: ['Method', 'What it requires of the product', 'Where it is most useful'],
          minWidth: 820,
          rows: [
            ['Broadcast and side-dressing', 'Granular integrity, controlled dissolution, resistance to volatilisation on hot alkaline surfaces', 'The bulk of field-crop nitrogen and base nutrition'],
            ['Fertigation', 'Full water solubility, no precipitate, no emitter blockage, compatible pH', 'Orchards, high-value vegetables, any drip or sprinkler system'],
            ['Foliar', 'Fine particle size, tank-mix stability, leaf-safe concentration, chelated micronutrients', 'Correcting a deficiency within days, without waiting for root uptake'],
            ['Drone or ultra-low volume', 'High concentration in very little water, no nozzle blockage, stable in suspension', 'Tall or dense standing crops that a tractor cannot enter, and speed when the spray window is short'],
            ['Seed and starter placement', 'Low salt index, safe in contact with germinating seed, phosphorus available to the young root straight away', 'Root establishment: a small amount placed close to the seed does more than a large amount spread widely'],
          ],
        } },
        { k: 'note', text: 'VAN produces powder, granular, pellet, crystalline and liquid grades. When VAN develops a product to a client company’s brief, the client’s application equipment is part of that brief. Pack sizes are on each brand’s own page.' },
      ],
    },
    {
      id: 'field', n: '04', kicker: 'Maize trials of Vital Urea', title: '3 maize trials of Vital Urea, 2023 to 2025', bg: true,   // D-320 (Tahir, 27 Oct 2026, multiple choice): was '2 programmes of our own.' with the lead 'Testing the 2 halves of the same idea: that form changes how much nitrogen survives, and that timing changes how much of it is used.'
      blocks: [
        // D-320: the 3 trials named as on the Vital Urea page, so the title's count is on the page.
        // L2 correction 9 Nov 2026 (KN-76): settled wording. Was 'In 2025, a trial was run independently on a partner farm that VAN does not name.'
        // Tahir 10 Nov 2026 (EN-6): a partner company's commercial trial, Sheikhupura, not named, no yield. Was 'In 2025, a partner farm ran a trial independently of VAN.'
        { k: 'p', text: 'Vital Urea has been used in 3 maize trials. In 2023, VAN and Rafhan Maize Products ran a trial jointly. In 2024, VAN and Descon ran a trial jointly at Descon Research Farm. In 2025, a partner company ran a commercial trial at Sheikhupura. In the 2023 and 2025 trials, 1 bag of Vital Urea (25 kg) took the place of 1 bag of urea (50 kg) at the first nitrogen application. Some crop plans use Vital Urea at more than 1 stage; follow your crop plan.' },   // Tahir 10 Nov 2026 (R3-3): was 'In VAN’s trials, 1 bag of Vital Urea (25 kg) replaced 1 bag of urea (50 kg) once, at the first or second application.'   // Tahir 9 Nov 2026 (PR-3): was '... is used in place of 1 bag of urea (50 kg), once in the crop cycle, at the first or second application.'
        { k: 'h3', text: 'With Rafhan Maize Products' },
        { k: 'p', text: 'The Rafhan trial covered 5 grower sites at Khaliqabad, from application in August 2023 to harvest in December 2023.' },   // Tahir 10 Nov 2026 (EN-3): was 'harvest in October 2023'
        // D-316, 26 Oct 2026 (Tahir: "The Khaliqabad, change it"). Was: 'Across the parameters assessed, shoot length, colour, leaf number and vigour, the single 25 kg bag produced comparable crop growth on roughly a third of the applied nitrogen, ... better disease tolerance. Cob size and length showed no difference.' and the line above ended 'assessed at 12 and 24 days. The comparison was deliberately uneven.'
        // Tahir 7 Nov 2026 (PR-13): "The Rafhan trial was observational: it was not replicated or randomised." (PR-3: first or second application, above.)
        // L1 editor 7 Nov 2026 (M8): 'these trials' made explicit; the site publishes no yield figure from any of the 3 (D-320 removed the 2024 one everywhere).
        { k: 'p', text: 'The Rafhan trial was observational: it was not replicated or randomised. VAN publishes no yield figure from any of the 3 trials. Trial summaries are available on request to partner@van.com.pk.' }, // L2 correction 9 Nov 2026 (KN-75): settled wording. Was '... from any of the 3 maize trials; trial summaries ...'
        // D-320, 27 Oct 2026 (Tahir: remove the replicated trial from the application systems page, then "Remove everywhere"): the published 2024 maize trial (Umair et al. 2025, Planta Animalia 4(3)), its heading, 2 lines and source are removed. Revert: the D-319 source.
        { k: 'cta', label: 'Vital Urea: evidence and trials →', href: '#/products/vital-urea' },
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
    // Tahir 7 Nov 2026 (KN-4): the lead and the 20-litre paragraph say 'dissolved or suspended' / 'or stay in suspension' (WDG and suspension grades are drone grades too).
    {
      id: 'one-tank', n: '05', kicker: 'One Tank · ایک ٹینک', title: 'One Tank: products formulated for the 20-litre tank of a spray drone', tone: 'gold',
      lead: 'A spray drone carries about 20 litres and then has to land. Everything applied to the crop from 1 tank load has to be dissolved or suspended in those 20 litres. The mix must reach the leaf without blocking a nozzle, and it must be safe on the leaf at a concentration that the labels of ordinary products do not cover. A product for a drone tank therefore needs a different specification from a product for a knapsack sprayer. VAN gives products made to this specification their own name: One Tank.',
      blocks: [
        { k: 'p', text: 'A drone sprays whatever mix is put in its tank and does not correct it. When a drone application fails, the cause lies in a product grade that was not formulated for the tank rather than in the aircraft.' },
        { k: 'h3', text: 'Why One Tank products have their own name' },
        // Tahir 9 Nov 2026: was 'a different formulation, with a different concentration, ...'; the analysis is the registered grade's (see the note below).
        { k: 'p', text: 'VAN does not add the word “drone” to an existing brand name. A drone version of a VAN product is a different formulation: it keeps the nutrient analysis of the registered grade but has a different particle specification, an added delivery package and a different dose per acre. If it carried the original product’s name, a grower might use one in place of the other. It is therefore given a name in a separate family, One Tank. The name refers to the 20 litres a drone tank holds.' },
        // L1 editor 7 Nov 2026 (M9, m2): the rule stated as a rule; SOP written out. Was: '... A product that carries an existing VAN brand name was not designed for the drone from the start, even if ... SOP is an example of such a product: ...'
        { k: 'p', text: 'VAN applies this naming rule without exception. Only a product designed from the start to be applied by drone is named in the One Tank family. A product with an existing VAN brand name stays outside the family, even if it has since been approved for drone use, and even if it dissolves well. SOP (sulfate of potash) is one such product: it is a soil and fertigation product, and VAN will not make a drone grade of it.' },
        { k: 'h3', text: 'The One Tank family' },
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
          note: 'There are 5 codes, and each code names the nutrient. Crop-specific variants are also One Tank products: the crop is named on the pack, and the One Tank name does not change.',
        } },
        { k: 'h3', text: 'How the 20-litre tank limits the formulation' },
        { k: 'p', text: 'A One Tank application uses no more than 20 litres of total spray mix in the tank. VAN sets this limit before formulation work starts, and decides everything else within it, including concentration, solubility and which products can be mixed in the same tank. A grade that needs more water than the drone can carry cannot be used as a drone grade, even if it works well in a boom sprayer.' },
        { k: 'p', text: 'The 20-litre limit has 3 direct consequences. First, the nutrient has to dissolve and stay dissolved, or stay in suspension, at several times the concentration used in a knapsack sprayer. Second, the solution has to keep passing through the nozzle screen for the whole length of a flight, which rules out anything that settles or forms clumps (flocculates) in the tank. Third, it has to be safe on the leaf at that concentration, because the same quantity of nutrient lands in far less water.' },
        { k: 'h3', text: 'VAN brands already applied by drone' },
        // Tahir 7 Nov 2026 (KN-3): the 6 brands are standard products approved for drone use, not separate drone grades. Was: '6 VAN brands are in commercial production as drone and ultra-low-volume (ULV) grades, sprayed in very little water, under their existing brand names: ...'
        // Tahir 10 Nov 2026 (LM-N34): "Dealers say fertigation, and drone use goes only through VAN." 2nd and 3rd sentences added.
        { k: 'p', text: '6 VAN brands are approved for drone and ultra-low-volume spraying in their standard form: VL-Micromix, VL-Boron, V-Zinc, Tornado, V-Germinator Pro and Cala-Mag V. Dealers sell V-Germinator Pro for fertigation. Drone spraying of V-Germinator Pro is done only through VAN.' },
        { k: 'tags', items: ['VL-Micromix', 'VL-Boron', 'V-Zinc', 'Tornado', 'V-Germinator Pro', 'Cala-Mag V'] },
        { k: 'h3', text: 'What VAN has decided so far for One Tank: the rate, the registration and the potash grade' },   // L1 editor 7 Nov 2026 (m13): was 'One Tank: rate, registration and potash grade decided so far'
        // D-318: "The potash grade is VL-Potash." restored. Tahir, 26 Oct: the 6 VAN brands already sold for drones keep their names; One Tank codes are for drone-first products.
        { k: 'p', text: 'The application rate for One Tank products is fixed at 1 litre of product per acre, mixed into a 20-litre tank of spray. VAN’s position on registration is also settled: a One Tank product is a formulation and grade variant of a VAN product that is already registered, so it is covered by that product’s registration and needs no separate licence. The potash grade is VL-Potash.' },
        { k: 'note', text: 'A One Tank product has the same nutrient analysis as the registered VAN grade it is built from. That analysis and the pack size are printed on the grade’s own page. A One Tank product adds a delivery package to that grade: ingredients that help it spray at ultra-low volume. It does not use a different nutrient raw material. VAN is still developing the delivery package through its own drone work. No figure for drift, coverage or spray efficiency exists yet.' },
        { k: 'cta', label: 'VAN products used with drones →', href: '#/products' },
      ],
    },
  ],
}

export const KNOWLEDGE_ARTICLES: RebuiltPage[] = [SOIL_SUSTAINABILITY, APPLICATION_SYSTEMS]

export const CIRCULAR_HUB: RebuiltPage = {
  slug: '', livePath: '/circular-economy/index.html',
  eyebrow: 'Circular economy',
  h1: 'Crop residue is burned as boiler fuel.',
  h1accent: 'VAN recovers potassium from its ash.',
  lead: 'Crop residue is taken from the field to fuel bio-power boilers. The potassium and silicon that the crop took up from the soil are carried away with the residue and end up concentrated in the boiler ash. VAN collects that ash, tests it, and recovers the potassium for use in its fertiliser. About 1 tonne of potash is recovered from every 10 tonnes of ash. Recovery of silicon from the same ash is still in research and development.',
  tone: 'green',
  sections: [
    {
      id: 'where', n: '01', kicker: 'Production status', title: 'Potassium recovery is in production; silicon recovery is still in research and development.', tone: 'green',
      blocks: [
        { k: 'stats', items: [
          // Tahir 7 Nov 2026: KN-12 (period 2026; month still to be given), KN-13 (period 2023 to 2026), KN-14 (the 2027 line is planned, not being built).
          ['About 20%', 'of the potash VAN used in 2026 to date came from crop residue ash'],
          ['3,000 t', 'of crop residue ash processed from 2023 to 2026'],
          ['500 t', 'of recovered potash a year from 5,000 t of ash: what the new line VAN plans for 2027 is designed to recover'],   // L1 editor 7 Nov 2026 (m7): was '... the target for the new line VAN plans for 2027'
          ['About 10 to 1', 'tonnes of ash processed for each tonne of potash recovered'],
        ] },
        { k: 'p', text: 'VAN uses recovered potassium as a regular raw material in its own manufacturing, in place of imported potash. Between 2023 and 2026 it replaced about 300 tonnes of imported potash in several forms and grades of VAN products. This matches the 3,000 tonnes of ash processed, at a recovery ratio of about 10 to 1.' },
        { k: 'p', text: 'VAN’s silicon recovery process is still in research and development. It has worked in VAN’s laboratory and is being prepared for the production line. The form of the silicon product is not fixed yet: soluble silicate and amorphous silica behave differently in alkaline soil, and the form will be chosen when the research is complete. VAN plans to scale up silicon recovery by the end of 2027.' },
        { k: 'tags', items: ['Potassium: in production · scaling up', 'Silicon: still in research and development', 'Feedstock: crop residue ash', 'Heavy metals screened by PCSIR'] },
      ],
    },
    {
      id: 'limits', n: '02', kicker: 'What VAN does not claim', title: 'VAN does not label any bag as containing recovered potassium, and makes no claim that its products return silicon or carbon to the soil.', bg: true,
      blocks: [
        { k: 'p', text: 'Recovered potassium is a raw material, used in the same way as imported potash. It goes into VAN’s potash grades generally rather than into a single grade.' },
        { k: 'p', text: 'Silicon recovery is still in research and development and is not in any product. VAN does not claim to return the residue’s carbon to the soil: burning releases it, and at present VAN recovers only potassium.' },
      ],
    },
  ],
  siblings: [
    { label: 'From crop residue ash to potassium', href: '#/circular-economy/ash', note: 'What happens to a tonne of ash after it reaches VAN, step by step.' },
    { label: 'The soil actions register', href: '#/circular-economy/soil', note: 'Each action VAN takes that affects soil, how it works and the evidence behind it.' },
  ],
}

export const CIRCULAR_ASH: RebuiltPage = {
  slug: 'ash', livePath: '/circular-economy/ash.html',
  eyebrow: 'Circular economy · the process',
  h1: 'How VAN recovers potassium',
  h1accent: 'from crop residue ash.',
  lead: 'About 10 tonnes of crop residue ash yield 1 tonne of potash. Potassium recovery is in production and supplies VAN’s own plant. Silicon recovery from the same ash is still in research and development. The process is proprietary.',
  tone: 'green',
  sections: [
    {
      id: 'decade', n: '01', kicker: 'Development, 2014 to 2023', title: 'How VAN developed the process, from a question in 2014 to the first commercial batch in late 2023', tone: 'soil',
      lead: 'VAN developed the process in-house. Its work on the process began in 2014 with a question from a bio-fuel producer. The first commercial batch was produced in late 2023, and the process is still being improved in production.',
      blocks: [
        { k: 'table', t: {
          head: ['When', 'What VAN did', 'What it established'],
          minWidth: 820,
          rows: [
            ['2014', 'A bio-fuel producer asked VAN what happens to the ash its boilers leave behind. VAN’s work on the process began with that question.', 'The problem to be solved was defined. Nothing had been recovered yet.'],
            // Tahir 7 Nov 2026 (KN-1): dates instead of durations. The samples VAN worked on in 2014 to 2021 are still to be named by Tahir; 2021 for the first batch is read from his row labels.
            // Was: ['The next 7 years', 'VAN worked on the chemistry before the engineering. It analysed each type of feedstock, recorded the chemistry of each batch of ash, profiled the impurities, and worked out which grades of ash were worth processing.', 'After 7 years, VAN received its first batch of crop residue ash to work on.'], and '2 more years'.
            ['2014 to 2021', 'VAN worked on the chemistry before the engineering.', 'VAN established which grades of ash were worth processing. In 2021, it received its first batch of crop residue ash.'],
            ['2021 to late 2023', 'VAN built the extraction technology and set up the process so that potassium could be recovered reliably from every batch of ash of known composition.', 'The process could be repeated batch after batch.'],
            ['Late 2023', 'VAN produced the first commercial batch.', 'The process moved from development into production.'],
            ['Late 2023 onwards', 'VAN measures each production run and adjusts the process before the next. The amount of potash recovered per tonne of ash, the handling of impurities and the set-up of the line have all changed since the first batch in late 2023.', 'In production and still improving.'],
          ],
          note: 'These dates come from VAN’s own records of the development of the process and have not been checked by a third party.',
        } },
      ],
    },
    {
      id: 'steps', n: '02', kicker: 'Step by step', title: 'The 7 steps of the process and the status of each', bg: true,
      blocks: [
        { k: 'table', t: {
          head: ['#', 'What VAN does', 'Why VAN does it', 'Status'],
          minWidth: 900,
          rows: [
            ['01', 'VAN sources fly ash collected from boilers fired on crop residue. From 2023 to 2026, VAN processed 3,000 tonnes of ash; the line planned for 2027 is designed to take 5,000 tonnes a year.', 'Burning removes the carbon and the water, so the minerals, including potassium and silicon, are more concentrated in the ash than in the raw residue.', 'Ash suppliers: 1 under long-term contract · 4 in negotiation'],
            ['02', 'VAN tests each incoming batch for potassium and silicon before accepting it.', 'Ash composition varies with the feedstock and the boiler, so VAN does not apply a single acceptance range to all ash. For each batch, VAN identifies the crop residue that was burned and the burning cycle, and sets the composition expected from that fuel. VAN rejects any batch outside that expected composition and does not blend it with other batches to bring it into range.', 'Running'],
            ['03', 'VAN sends the ash to PCSIR for heavy-metal screening before it enters the process.', 'Ash is a waste material. A nutrient recovered from ash can be used only if the heavy metals in the ash are measured by a laboratory independent of VAN. PCSIR (Pakistan Council of Scientific and Industrial Research), a government laboratory, screens each batch against the applicable limits of PSQCA (Pakistan Standards and Quality Control Authority) and issues its report under the batch number.', 'PCSIR. External · PSQCA limits'],
            ['04', 'VAN extracts the plant-available potassium from the ash, recovering about 1 tonne of potash from every 10 tonnes of ash. Extraction of silicon is still in research and development.', 'VAN separates this potassium from the rest of the ash, which is inert, so that the potassium can be dosed accurately instead of being spread on fields as bulk ash.', 'K: in production · Si: in research and development · process proprietary'],
            ['05', 'VAN uses the recovered potassium in its own manufacturing, in place of imported potash.', 'A recovered nutrient still has to granulate, flow, store and dissolve like the bought-in material it replaces. VAN already meets these requirements for the raw materials in all its registered products.', 'In production · about 20% of the potash VAN used in 2026 to date'],   // L1 editor 7 Nov 2026 (m8): KN-12 wording 'the potash VAN used'; was 'VAN’s potash intake'
            ['06', 'VAN tests recovered potassium against a guaranteed analysis, in the same way as every raw material it buys.', 'The finished product’s declared N-P-K stays the same whether its potassium came from ash or from an imported shipment. Each lot of recovered potassium is tested, and the amount used is adjusted so that the finished product meets its declared N-P-K.', 'In production'],
            // Tahir 7 Nov 2026 (KN-14): planned, not under construction. Was: 'VAN is building a line with capacity beyond its own demand: 500 tonnes of recovered potash a year from 5,000 tonnes of ash, by 2027.' and status 'Target: 500 t a year by 2027'.
            ['07', 'VAN plans a new line for 2027, designed to recover 500 tonnes of potash a year from 5,000 tonnes of ash, beyond its own demand.', 'At present, recovery is sized to what VAN’s own plant uses. The 2027 line is designed to recover more than that, so recovered potash would also become a supply for other buyers, not only a replacement for VAN’s own imports.', 'Planned for 2027: 500 t a year'],
          ],
        } },
      ],
    },
    {
      // L1 editor 7 Nov 2026 (m2): PNAC and QC written out at first use on the page.
      id: 'scope', n: '03', kicker: 'Accreditation scope', title: 'VAN’s laboratory measures potassium within its accreditation by the Pakistan National Accreditation Council (PNAC, LAB 336), and silicon by an in-house method that the accreditation does not cover.',
      blocks: [
        { k: 'table', t: {
          head: ['Parameter', 'Where it is measured', 'Scope'],
          minWidth: 760,
          rows: [
            ['Potassium (as K₂O), every production batch', 'VAN Quality Control (QC) Laboratory', 'PNAC accredited · ISO/IEC 17025:2017 · LAB 336'],
            ['Silicon (Si)', 'VAN QC Laboratory, research and development method', 'In-house method, outside accredited scope'],
            ['Heavy metals, incoming ash', 'PCSIR, external government laboratory, not VAN', 'External screening · PSQCA limits'],
            ['pH · conductivity', 'VAN QC Laboratory', 'PNAC accredited (conductivity within the extended scope)'],
          ],
          note: 'VAN’s laboratory holds PNAC accreditation No. LAB 336 to ISO/IEC 17025:2017. VAN does not claim accreditation for any test outside that scope.',
        } },
        { k: 'cta', label: 'The VAN Lab →', href: '#/lab' },
      ],
    },
    {
      id: 'form', n: '04', kicker: 'Liquid or solid', title: 'Recovered potassium is made as a liquid or a solid, to suit VAN’s own manufacturing.', bg: true,
      blocks: [
        { k: 'p', text: 'The recovery process can produce potassium in liquid or solid form, and both forms go into VAN’s manufacturing as raw material. At present, the split between the 2 forms follows what VAN’s process needs. When production grows beyond VAN’s own demand, VAN will produce the form that customers ask for.' },
        { k: 'note', text: 'Recovered potassium is a raw material in either form. It carries no separate registration and no separate performance claim. The finished grades made with it carry their own registration and claims.' },
      ],
    },
  ],
}

export const CIRCULAR_SOIL: RebuiltPage = {
  slug: 'soil', livePath: '/circular-economy/soil.html',
  eyebrow: 'Circular economy · the register',
  h1: 'What VAN does',
  h1accent: 'that affects the soil.',
  lead: 'Each row of the register is an action VAN takes that affects the soil, with how it works and the evidence behind it.',
  tone: 'soil',
  sections: [
    {
      id: 'why', n: '01', kicker: 'The soil problem', title: 'Most of the nutrient applied in Pakistan is nitrogen, very little is potash, and wheat yield per kg of nutrient has fallen.', tone: 'rust',
      blocks: [
        // Tahir 7 Nov 2026 (PR-28): 1 year and 1 source for the potash share (NFDC 2024-25).
        // Tahir 10 Nov 2026 (LM-N17): "applied" everywhere for the NFDC potash share; was "... nutrients sold in Pakistan (NFDC)".
        // Tahir 7 Nov 2026 (KN-17): organic matter, not organic carbon (Punjab survey figure). Was: 'Across much of the cropped area organic carbon is below 1%, so the soil ...'. Survey years written as CO-24 rules; CO-23 fiscal year.
        { k: 'p', text: 'Pakistan applies enough fertiliser in total, but the mix is unbalanced: most of the nutrient applied is nitrogen. In 2024-25, potash was 1% of the fertiliser nutrients applied in Pakistan (NFDC). Nitrogen is applied every season, and the soil retains little of it. In the Punjab soil survey of about 2016 to 2018, 90.2% of samples had less than 0.86% organic matter, so the soil has little capacity to hold nutrients or water. From fiscal year 1999-2000 to 2023-24, nutrient applied per acre of arable land in Pakistan rose by 68%, while wheat yield rose by 31%. Wheat yield per kg of nutrient applied therefore fell by 22%.' },
        // L1 editor 7 Nov 2026 (M7): was 'For this reason, applying more ...' ("this reason" pointed back to a paragraph of 5 facts).
        { k: 'p', text: 'Because Pakistan already applies enough fertiliser in total and the problem is the mix, applying more of the same fertiliser will not correct the imbalance.' },
        { k: 'cta', label: 'Sources for every figure: the national figures page →', href: '#/knowledge/why-pakistan-must-shift' },
      ],
    },
    {
      id: 'register', n: '02', kicker: 'The register', title: 'What VAN does, how it works, and the evidence for it', bg: true,
      blocks: [
        { k: 'table', t: {
          head: ['What VAN does', 'How it works on the soil', 'Product or service', 'Evidence or status'],
          minWidth: 980,
          rows: [
            ['VAN coats urea granules with sulfur.', 'The sulfur coating slows the release of nitrogen, so the nitrogen is released over days rather than all at once. Where sulfur-oxidising bacteria are active in the soil, they turn the sulfur into acid in the few centimetres around each granule. In that zone, phosphorus and zinc that the alkaline soil has bound in insoluble forms can become soluble. The effect is limited to the soil around each granule; it does not change the whole field.', 'Vital Urea (sulfur coated urea, SCU)', 'Patent 144684'],   // L1 editor 7 Nov 2026 (m2): SCU written out
            ['VAN makes phosphate granules that create an acidic zone around each granule, and seals each granule with humic substances.', 'Pakistan’s soils are commonly above pH 8 and contain free lime, so phosphate dissolving out of a granule meets calcium within a few centimetres. The granule’s acidic zone slows the binding of phosphate by calcium for the weeks in which the root needs it. The humic seal benefits the soil and the root; it does not shield the phosphate from calcium. The effect is limited to the soil around each granule and does not change a soil test result.' /* D-194: the 70 to 80% line and the humic-shield mechanism came off (VAN's 31 Jul 2026 stoichiometry memo; Tahir 27 Sep) */, 'Green Phosphate', 'Certificate of analysis (COA)'],
            ['VAN supplies potassium humate as pellets and as a liquid.', 'Humate increases the soil’s ability to hold nutrients on its particles (its cation exchange capacity) and binds some nutrients in soluble forms (chelation), so less of the applied nutrient is leached below the roots or turned into insoluble forms.', 'Humi Grow · Humi Grow Plus', 'COA'],   // L1 editor 7 Nov 2026 (m9): was 'washed down'
            // Tahir 7 Nov 2026 (KN-17): was 'The compost adds organic matter to soils with less than 1% organic carbon. Unlike raw manure, its content is measured.'
            ['VAN manufactures compost from plant residue.', 'Only plant residue is used, and it is screened for contamination and pathogens before processing. The compost adds organic matter to soils that have little of it. Unlike raw manure, the compost has a measured nutrient content.', 'V-Compost', 'COA'],
            ['VAN recovers potassium from crop residue ash and uses it in its own plant.', 'The recovered potassium replaces imported mined potash in VAN’s fertiliser, and returns to farmland some of the potassium removed when crop residue is taken for fuel. About 1 tonne of potash is recovered from 10 tonnes of ash.', 'VAN’s potash grades', 'In production: about 20% of the potash VAN used in 2026 to date; 3,000 t of ash processed from 2023 to 2026; a line of 500 t a year planned for 2027'], // Tahir 7 Nov 2026: KN-12, KN-13. L1 editor 7 Nov 2026 (m8): 'the potash VAN used', was 'VAN’s potash intake'
            // Tahir 7 Nov 2026 (KN-2): conditional wording. Was: 'Husk and straw contain large amounts of silicon ... When the process is complete, recovering the silicon will return it to farmland instead of leaving it in ash sent to a dump.'
            ['VAN is developing a process to recover silicon from the same ash.', 'Husk and straw contain silicon, which is removed from the field with the residue. If the process reaches production, recovered silicon could be returned to farmland instead of remaining in ash that is dumped. The target form is not fixed yet, because soluble silicate and amorphous silica behave differently in alkaline soil.', 'Not in any product', 'Still in research and development'],
            ['VAN publishes a crop plan for each of 28 crops, with the dose for each growth stage.', 'Linking each dose to the growth stage at which the crop takes up the nutrient prevents over-application.', '28 crop plans', 'Published'],
            // D-317: was "VAN did not collect that data and does not claim it. It comes from the provincial soil survey work and from VAN’s own sampling, and VAN reads it." (the 2 halves contradicted each other)
            ['VAN designs its products from soil test data rather than from a national average.', 'VAN’s formulation decisions draw on 770,160 soil samples from the Punjab survey (tested in about 2016 to 2018), about 18,000 from Sindh and 600 from Gilgit-Baltistan. They come from provincial soil survey work and from VAN’s own sampling.', 'Every VAN grade and coating decision', 'Provincial soil survey and VAN sampling'],
            ['VAN coats the same granule differently depending on where it will be used.', 'The phosphate granule sent to Kamalia carries an iron coating, and the same granule sent to Lodhran carries boron. The base material and the coating line are the same; the micronutrient is chosen for the soil on which the bag will be used.', 'Coated phosphate grades', 'In production'],
            ['VAN chooses which micronutrients to supply according to the soil, the crop and the season.', 'What a crop is short of depends on what its soil holds, what that crop removes and the season it grows in. Choosing the micronutrient from those 3 factors avoids applying it where the soil already has enough, which would cost the grower money and add an unneeded load to the soil.', 'Formulation and recommendation', 'In use'],
            ['VAN provides the Nutrition creator, a soil tool for growers.', 'The grower enters what the soil holds. The tool compares it with what the crop removes and shows what to apply, by which method and at which growth stage. A rate given without its growth stage cannot be applied correctly.', 'The Nutrition creator on each crop page', 'In use'],
            ['VAN measures N, P₂O₅ and K₂O in its own accredited laboratory.', 'A recommended rate is reliable only if the product contains the nutrients its label declares (its guaranteed analysis). VAN’s accredited laboratory checks this for all registered products.', 'All registered products', 'PNAC (Pakistan National Accreditation Council) LAB 336'],   // L1 editor 7 Nov 2026 (m2): PNAC written out
          ],
          note: 'The soil data, coating, micronutrient and soil tool rows share 1 principle: VAN chooses the material, the rate and the timing to suit the soil of each field.',
        } },
      ],
    },
    // D-317: the section "The rule behind this page · 3 tests every soil sentence on this site must pass" came off (editorial rules, not visitor content); the next section renumbered 04 to 03.
    {
      id: 'left-off', n: '03', kicker: 'Not yet on the register', title: 'What is not yet on the register, and why', bg: true, tone: 'rust',
      blocks: [
        { k: 'table', t: {
          head: ['Not on the register', 'Why not'],
          minWidth: 700,
          rows: [
            // D-317, owner ruling 3 (26 Oct 2026): the row "An absolute displaced-import tonnage" came off; the circular hub keeps "about 300 t of imported potash replaced, 2023 to 2026".
            ['Carbon or emissions reduction', 'An active research theme at VAN, but no figure has been measured yet.'],
            ['Biofertilisers (phosphorus-solubilising bacteria)', 'The mechanism is established, but VAN does not yet have a trial or COA reference for it.'],
            ['Water use', 'VAN has not measured it yet.'],
            ['Any yield percentage', 'Not published until each figure can be tied to a named trial.'],
            // D-317: was "PCSIR screens the incoming ash; the thresholds are not printed here until we can print them exactly." PSQCA limits is the ash page's own step 03 wording.
            ['Heavy-metal limits', 'PCSIR screens the incoming ash against PSQCA limits. VAN has not yet published the limit figures used.'],
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
  h1: 'How a partner product is developed and registered.',
  // D-318, Tahir 26 Oct: "Use the 6 stages everywhere" (was 7 steps: Brief, Ground, Bench, Pilot, Field, Registration, Launch).
  // L1 editor fix 7 Nov 2026 (company-b M4 in part; company-a m8): the 6 development stages run from feasibility, not from an idea (the idea stage belongs to the library list); 'we' voice.
  lead: 'A new product developed to your brief goes through 6 development stages, from feasibility to PSQCA registration, and we run all 6.',
  tone: 'navy',
  sections: [
    {
      id: 'steps', n: '01', kicker: 'The sequence', title: 'The 6 development stages, in order.',
      blocks: [
        // The live page carried these as labelled steps; the labels were graphics and did not survive
        // extraction, so the published sentences are shown in their published order rather than
        // given invented headings.
        { k: 'table', t: {
          head: ['', 'What happens'],
          minWidth: 640,
          rows: [
            ['Feasibility', 'Starting from your brief, we confirm the market, the crop, the crop stage, the target price, the pack format and the constraint the product must overcome. We also study the soil, crop and water of the territory the product is aimed at, so that the formulation suits those conditions rather than average conditions.'],
            ['Bench', 'Bench work in our laboratory on ratio, form, coating, chelation, solubility, pH and compatibility.'],
            ['Pilot', 'The pilot batch is made on the same equipment that will make the commercial lot, so a formulation that works in the pilot also works at full scale.'],
            ['Trials', 'Trials on our research farms and, if you want them, on your own demonstration plots.'],
            ['Dossier', 'We select the PSQCA standard and prepare the dossier.'],
            ['Registration', 'We handle the PSQCA registration, and PSQCA issues 1 manufacturing licence for the product, valid across Pakistan.'],
          ],
        } },
        // 11 Sep 2026 · the page was headed "Seven steps" and listed eight. Tahir ruled that repeat
        // ordering is the relationship after launch, not a step on the way to it, so it comes out of
        // the numbered list and is said here instead. Restore it as a row to go back.
        { k: 'note', text: 'After registration, we start commercial production and provide a certificate of analysis for each production batch, technical documentation and training material for your field team. Repeat batches are made to the frozen specification, and any change to that specification is documented and never made without telling you.' },
      ],
    },
    {
      id: 'receive', n: '02', kicker: 'What you receive', title: 'You receive the same set of documents we keep for our own brands.', bg: true,
      lead: 'We already keep this set of documents for each of our own products, so yours follow a format that is already in use.',
      blocks: [
        { k: 'table', t: {
          head: ['Document', 'What it contains', 'When'],
          minWidth: 820,
          rows: [
            ['Technical data sheet', 'Guaranteed analysis, directions and dosage, physical properties, packaging and storage. 1 page.', 'At specification freeze'],
            ['Safety data sheet', '16-section GHS (Globally Harmonized System) format, per-product hazard classification, both VAN addresses, revision history.', 'At specification freeze'],
            ['Certificate of analysis', 'Physical status, moisture, particle size, pH and the chemical assays, each with specification, result and method.', 'Per production batch'],   // Tahir 7 Nov 2026 (CO-22): every production batch is tested
            ['Registration file', 'The Pakistan Standard applied and the PSQCA manufacturing licence number.', 'On licence issue'],
            ['Label content', 'The declared analysis and the regulatory text required on the label. The artwork is produced to your brand guidelines.', 'Before first print'],
          ],
        } },
      ],
    },
    {
      id: 'registration', n: '03', kicker: 'Where registration sits', title: 'We run registration as part of product development.', tone: 'rust',
      blocks: [
        { k: 'lead', text: 'A product can miss its selling season even when the formulation is finished and the pilot has succeeded, because the licence takes time to obtain: we complete our 2 registration steps within 3 weeks, and the regulator’s 2 steps typically take a further 1 to 3 months. We therefore treat registration as part of development, not as a task left to you afterwards. The team that took our own products through PSQCA registration handles yours. We hold 34 PSQCA licences: 22 on our own brands, under 8 Pakistan Standards, and 12 on products ready for partners.' },
        { k: 'note', text: 'Figures as of July 2026.' },   // Tahir 10 Nov 2026 (CO-N8, CO-30): the counts dated once on the page
        { k: 'cta', label: 'Regulatory and registration services →', href: '#/partner/regulatory' },
      ],
    },
  ],
}

export const PARTNER_ENGINEERING: RebuiltPage = {
  slug: 'engineering', livePath: '/partner/engineering.html',
  eyebrow: 'Your Brand · engineering',
  h1: 'What VAN can change in a formulation.',
  lead: 'We can change the form, coating, chelation, solubility, pH, application grade, batch size and pack of a formulation, each within a defined range.',
  tone: 'navy',
  sections: [
    {
      id: 'axes', n: '01', kicker: 'The 6 factors that shape a formulation', title: 'The 6 factors we consider first.',
      lead: 'A blend that suits cotton on a canal-irrigated sandy loam is wrong for cotton on saline land irrigated with tube-well water. We therefore start from these 6 factors.',
      blocks: [
        { k: 'table', t: {
          head: ['Factor', 'What it covers'],
          minWidth: 640,
          rows: [
            ['Crop', 'The nutrient ratio and form, matched to the crop species and to the variety’s nutrient demand through the season.'],
            ['Soil', 'The soil’s pH, calcareousness, organic matter and texture, and the nutrient fixation they cause.'],
            ['Growth stage', 'Germination, early growth, grand growth, the reproductive stage or maturity: each stage needs a different product.'], // Tahir 7 Nov 2026 (PR-22): crop plan stage name
            ['Coating', 'Release control and deficiency correction applied as a coating on the granule, rather than blended in as separate granules.'],
            ['Stress', 'The level of stress the crop is expected to face, from moderate to severe. Heat during grain fill, for example, has to be allowed for in the formulation.'],  // D-318: "and cold nights in storage" removed (Tahir, 26 Oct)
            ['Water and delivery', 'Canal, tube well or both, and increasingly drip, centre pivot and drone. The delivery method determines the solubility and salt index the product needs.'],
          ],
        } },
      ],
    },
    {
      id: 'bandwidth', n: '02', kicker: 'What we can formulate', title: 'What we can vary, and within what range.', bg: true,
      lead: 'The ranges below are what we already do commercially. A request outside them is treated as a development project rather than an order.',
      blocks: [
        { k: 'table', t: {
          head: ['Parameter', 'Range we work in', 'Notes'],
          minWidth: 900,
          rows: [
            ['Physical form', 'Powder · granular · pellet · crystalline · liquid', 'Solid grades can be produced in more than 1 form from the same chemistry.'],
            ['Compound (complex) NPK', 'Granules in which every granule carries the full declared analysis', 'Used when the customer needs uniform granules that cannot segregate in the bag or in the spreader.'],
            ['Bulk blending', 'Physical blending of single-nutrient and speciality granules to a target ratio', 'The more flexible route: the ratio can be changed between batches without changing the chemistry.'],
            ['Coating', 'Sulfur · humic · boron · iron coating, all at commercial scale. Dual-layer and biological coating in development.', 'Boron and iron coating are our speciality. The micronutrient is coated onto the granule rather than blended in separately, so it cannot segregate in the bag and is applied wherever the granule is applied.'],
            ['Chelation', 'Chelated zinc and chelated iron manufacturing; micronutrient compatibility work', 'Chelate type is stated per formulation.'],
            ['Solubility', 'Fully water-soluble grades for fertigation and foliar', 'Solubility figures are declared per formulation from certificate of analysis (COA) data.'],
            ['pH / acid activation', 'Acidic microenvironment granulation; pH-corrected solubles', 'Our main method of reducing phosphate fixation in calcareous soil.'],
            ['Application grade', 'Broadcast · basal · fertigation · foliar · drone ultra-low-volume (ULV) · centre pivot', '6 of our products are approved for drone and ultra-low-volume spraying in their standard form, and extending this to the rest of the range is under review.' /* Tahir 7 Nov 2026 (KN-3): was 'already in commercial production in drone and ultra-low-volume grades, and extending these grades ...' */],
            // D-317, owner ruling 2 (26 Oct 2026): was '1 tonne minimum · 50 tonnes maximum in a single lot'. No minimum order; a production batch is 1 tonne.
            // Tahir 7 Nov 2026: CO-16 (a 1 tonne batch is made and a small order packed from it); CO-19 (annual capacity).
            // Tahir 10 Nov 2026 (CO-N12): minimum order reordered, per line. Was 'No minimum order. ... Up to 50 tonnes in a single lot.'
            ['Batch size', 'There is no minimum order. We produce in batches of 1 tonne. For an order smaller than 1 tonne, we make a 1 tonne batch and pack your order from it. A larger order is made in lots of up to 50 tonnes, each made of 1 tonne batches. The line for each product can make up to 4 lots a week, so an order is not limited to 50 tonnes.', 'Larger orders run as repeat lots to the same frozen specification. Our annual capacity is about 50,000 tonnes.'],   // L1 fix 10 Nov 2026 (m1): the long sentence split; 'the line for that product' -> 'The line for each product'.
            ['Pack formats', '1 L · 1 kg · 10 kg · 20 to 50 kg bags · 200 L drum · 1,000 L IBC (intermediate bulk container) · bulk bag', 'Pack formats are offered for each formulation separately, not as a fixed set.'],
          ],
        } },
      ],
    },
    {
      id: 'platforms', n: '03', kicker: 'The 7 technology platforms', title: 'We answer a brief by combining these 7 platforms.', tone: 'green',
      lead: 'We already use 6 of these platforms in commercial production. The biologicals platform is at test production, apart from V-Compost.',   // Tahir 7 Nov 2026 (CO-6)
      blocks: [
        { k: 'table', t: {
          head: ['Platform', 'What it is', 'Where it is already used'],
          minWidth: 880,
          rows: [
            ['Controlled release', 'Sulfur coating of urea at commercial scale; dual-layer variants in development.', 'Vital Urea (sulfur coated urea)'],
            ['Acid activation & humic coating', 'Granulation that creates an acidic zone around the granule, with a humic coating, to slow phosphate fixation.', 'Green Phosphate 6:32:0'],
            ['Micronutrients', 'Zinc, boron, iron and multi-micronutrient formulation, granular and liquid; tank-mix compatibility work.', 'V-Transform · V-Zinc · VL-Micromix'],
            ['Humic delivery', 'Potassium humate in crystal, powder, pellet and liquid at several concentrations.', 'Humi Grow · Humi Grow Plus'],
            ['Biologicals', 'A dedicated biological laboratory in operation, with test production alongside it. The platform covers phosphorus-solubilising bacteria and compost and organic-carbon carriers. Strains are isolated locally and selected for Pakistani soil pH, climate and weather.', 'PSB · V-Compost'],
            ['Micronutrient coating', 'Boron and iron coated directly onto the granule. Biological coating is in development.', 'Coated NPK grades and micronutrient-fortified phosphates'],
            ['Solubles & precision grades', 'Fully soluble NPK and potash lines; low-salt, pH-corrected, drone-grade concentrates.', 'Vital Potash · VL-Potash Liquid · V-Germinator Pro'],
          ],
        } },
      ],
    },
    {
      id: 'wont', n: '04', kicker: 'What we will not do', title: '2 rules we do not change.', bg: true, tone: 'rust',
      blocks: [
        { k: 'p', text: 'A formulation developed for a client never reappears as a VAN brand or as a library code.' },
        { k: 'p', text: 'If a declared analysis will not hold for 12 months in storage in a Pakistani warehouse, we do not put it on the label. Instead, we tell you the analysis that will hold.' },
        { k: 'note', text: 'Start by telling us the problem: the crop, the stage, the soil and the price the market will pay. We work out the chemistry.' },
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
  lead: 'VAN’s plant runs 5 production lines: granular, coated, liquid, water-soluble and compounded. Quality control is done in the analytical laboratory on the same site, and our research farms test every formulation in the field.',
  tone: 'navy',
  sections: [
    {
      id: 'site', n: '01', kicker: 'What is on site', title: '5 production lines, 2 laboratories.',
      blocks: [
        { k: 'table', t: {
          head: ['Line', 'What it does'],
          minWidth: 700,
          rows: [
            ['Granular', 'Physical blending of single-nutrient and speciality granules to a target ratio, with compatibility checked before the batch rather than after it.'],
            ['Coated', 'Sulfur coating at commercial scale; this is the line that makes Vital Urea. It also coats boron and iron directly onto the granule, so the micronutrient cannot separate in the bag and is applied wherever the granule is applied. The coated line was added in 2014.'],
            ['Liquid', 'Our full liquid range (the VL- products), from foliar concentrates to fertigation grades.'],
            ['Water-soluble', 'Fully soluble grades for fertigation and foliar feeding.'],
            ['Compounded', 'Compound granulation, in which every granule carries the complete declared analysis, so nothing separates between the bag and the field.'],
          ],
          note: 'Orders larger than a single lot are made as repeat lots to the same frozen specification. Pack formats range from 1 L to bulk, and finished goods are stored on site.',
        } },
        { k: 'table', t: {
          head: ['Laboratory', 'What it does'],
          minWidth: 700,
          rows: [
            ['Analytical laboratory', 'Accredited by PNAC (Pakistan National Accreditation Council) to ISO/IEC 17025:2017 (LAB 336) for 8 of its 21 fertiliser tests. Every batch is tested here, and a lot ships only when all its batches have passed.'],   // Tahir 7 Nov 2026 (CO-22)
            ['Biological laboratory', 'Opened in 2026. Its product based on phosphorus-solubilising bacteria is in field trials, and a liquid inoculant and a mycorrhizal product are in development, all based on locally isolated strains.'],
          ],
        } },
      ],
    },
    {
      id: 'qc', n: '02', kicker: 'Quality control', title: 'Every certificate of analysis names the method behind each result.', bg: true, tone: 'green',
      blocks: [
        { k: 'p', text: 'Every production batch is tested and released against a certificate of analysis from our own laboratory. The format is consistent across the catalogue: physical status, moisture, particle size and pH, followed by the chemical assays, each carrying its specification, its result and the method used to obtain it.' },
        { k: 'table', t: {
          head: ['Rule', 'What it means'],
          minWidth: 620,
          rows: [
            ['No lot ships without a COA', 'Every batch is released against the frozen specification, and every lot ships with the certificates of analysis (COA) of its batches.'],   // Tahir 7 Nov 2026 (CO-22)
            ['Every assay names its method', 'This allows a third-party result to be compared like for like.'],
            ['A specification change is documented', 'The partner is told before the change takes effect, so nothing is substituted without notice.'],
          ],
        } },
        { k: 'cta', label: 'How VAN Lab tests a sample: the blind chain →', href: '#/lab#blind-chain' },
      ],
    },
    {
      id: 'farm', n: '03', kicker: 'The research farms', title: 'Every formulation is tested on calcareous field soil, not only on the bench.',
      blocks: [
        { k: 'p', text: 'Our first agricultural experimental station was established in 2009, and we run our own research farms, staffed by agricultural scientists, for product trials. Farm trials show where a formulation fails before a client relies on it for a season.' },
      ],
    },
    {
      id: 'licences', n: '04', kicker: 'Licences and certification', title: 'PSQCA licences and ISO 9001 certification.', bg: true,
      blocks: [
        { k: 'p', text: 'The plant holds 34 manufacturing licences from PSQCA (Pakistan Standards and Quality Control Authority). 22 of them are on our own brands, under 8 Pakistan Standards. The regulatory page lists the licence number of each of our 20 licensed brands. The other 12 are on products ready for partners.' },   // L2 fix 9 Nov 2026 (company W2, CO-8): was "and each is listed by brand with its licence number on the regulatory page"
        { k: 'p', text: 'ISO 9001 quality management certification is in progress with System Certification Centre (SCC) and is expected during 2027. We will not claim it until the certificate is issued.' },
        { k: 'note', text: 'Figures as of July 2026.' },   // Tahir 10 Nov 2026 (CO-N8, CO-30): the counts dated once on the page
      ],
    },
    {
      id: 'visit', n: '05', kicker: 'Plant visits', title: 'Visiting the plant before you decide.',
      blocks: [
        { k: 'p', text: 'Most partner discussions include a plant visit. For a company deciding whether to manufacture with us, the visit is usually the point at which the decision becomes a serious one.' },   // L2 fix 9 Nov 2026 (company W8): back to the live meaning; was "the decision is made"
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
  // D-317, owner ruling 2 (26 Oct 2026): was "A batch starts at 1 tonne. ... There is no minimum on the order itself. VAN is a manufacturer with its own plant, so the plant schedules a batch to the size of your order, and a first order ..."
  ['What is the minimum order, and the maximum?',
   // Tahir 10 Nov 2026 (CO-N12): reordered, per line. Was 'There is no minimum order, and an order is not limited to 50 tonnes. ... Larger orders are produced in lots of up to 50 tonnes each, and the line can produce up to 4 lots a week.'
   'There is no minimum order. We produce in batches of 1 tonne. For an order smaller than 1 tonne, we make a 1 tonne batch and pack your order from it. A larger order is made in lots of up to 50 tonnes, each made of 1 tonne batches. The line for each product can make up to 4 lots a week, so an order is not limited to 50 tonnes. Because we are a manufacturer with our own plant, your first order does not have to be a full container load. Each VAN brand is sold only in the pack sizes named on its registration.'],   // L2 fix 9 Nov 2026 (company W3): "rather than importing them" removed (SOP is bought in, PR-1)   // L1 fix 10 Nov 2026 (m1): the long sentence split; 'the line for that product' -> 'The line for each product'.
  // Tahir 7 Nov 2026: CO-51 working days (also the 15 days to the first consignment); CO-16 batch wording; CO-18 no date.
  ['How long from order to shipment?',
   'An order of 1 to 10 tonnes ships in 3 to 5 working days, and an order of 11 to 100 tonnes ships in 7 to 18 working days, counted from the day the order is confirmed. We make each order after it is confirmed, rather than selling from stock. An order above 100 tonnes needs a production plan, and we agree its schedule with you.'],
  ['Do you give credit?',
   'No. You pay for your stock from your own working capital. Because we do not give credit, our prices do not include a charge for credit. We explain this at the first meeting, so that the payment terms on your first invoice are not a surprise.'],
  ['Can I book ahead?',
   'Yes. If you book in advance and pay in advance, you receive a cash discount. Advance bookings also let the plant schedule production for your season.'],
  ['How long from opening an account to the first delivery?',
   'Your account is opened once the dealership formalities are complete, and your first consignment is delivered within 15 working days of that day.'], // L1 editor fix 7 Nov 2026 (company-a m20): 1 start event.
  ['What margin do I make?',
   'There is no single figure. Your margin depends on the products you carry and the volume you sell. We agree it with you when we discuss commercial terms, after going through the product range together.'],
  ['Can I see the products working before I commit?',
   'Yes. Before the products go on sale in your territory, we run demonstration plots there, on the soil and crops of your territory.'],   // L2 fix 9 Nov 2026 (company W7): was "on your customers’ fields and crops"
  ['Who holds the product registration?',
   'We hold the registration of every brand you would sell. Our regulatory page lists the PSQCA licence of each brand that holds one, with its licence number. 3 of our 23 brands need no licence or have a conformance report instead.'], // L1 editor fix 7 Nov 2026 (company-a B2): qualified to the brands that hold a licence; CO-18 ending kept.
]

export const PARTNER_DISTRIBUTOR: RebuiltPage = {
  // 10 Sep 2026: rehomed to /become-a-dealer.html. livePath still names the OLD url because that is
  // what this field means: where the page lived on the site being replaced, which is what the
  // .htaccess redirect map is generated against.
  slug: 'distributor', livePath: '/partner/distributor.html',
  eyebrow: 'Work with us · become a dealer',
  h1: 'Sell VAN brands',
  h1accent: 'in your territory',
  lead: 'As a VAN dealer, you sell VAN brands to your own customers in your territory. Of all the ways to work with VAN, a dealership asks the least of you: you do not need your own product registrations, because we hold them. Our agronomy team trains your team and runs demonstration plots in your territory.',
  tone: 'gold',
  sections: [
    {
      id: 'behind', n: '01', kicker: 'What we give you', title: 'We give you 4 things: supply of all 23 VAN brands, 28 crop plans, brand material, and training with demonstration plots',
      blocks: [
        { k: 'table', t: {
          head: ['', 'What it is'],
          minWidth: 660,
          rows: [
            ['Supply of all 23 brands', 'All 23 VAN brands, in their registered pack sizes, shipped within the times set out in the questions below.'],   // Tahir 7 Nov 2026 (CO-17): fixed times, as in the FAQ
            ['28 crop plans', 'For every stage of the crop, each crop plan gives the product to apply, the quantity per acre and the method of application. A customer who follows a plan needs a product at each later stage of the crop, so he comes back to your shop at each stage instead of buying a single bag once.'],
            ['Brand material', 'Artwork, leaflets and point-of-sale material with VAN branding, so that customers in your territory recognise VAN products and know that VAN makes them.'],
            ['Training and demonstration plots', 'Before you start selling VAN products, we train your team on them and run demonstration plots in your territory, so that your team sees how the crop responds to the products.'],
          ],
        } },
      ],
    },
    // D-210, 27 Sep 2026: the territory section (non-exclusive by default, exclusive against a committed
    // volume) came off on Tahir's word, as it came off Your Brand (D-204). Sections renumbered. Revert: the v61.2 zip.
    {
      id: 'range', n: '02', kicker: 'The range', title: 'The product range you would sell',
      blocks: [
        { k: 'table', t: {
          head: ['Category', 'What it covers'],
          minWidth: 640,
          rows: [
            ['Nitrogen', 'Sulfur coated urea, which reduces the nitrogen lost to the air as ammonia on alkaline soil.'],
            ['Phosphorus', 'Humic-coated and acidic phosphate grades, made to reduce the binding of phosphate by calcium in the soil.'],
            ['Potash', 'Solid and liquid potash for the flowering and fruiting stages.'],
            ['NPK', 'Balanced and stage-specific NPK grades. One of them, Crop Force, is a compound fertiliser: every granule contains nitrogen, phosphorus and potassium in the ratio printed on the label.'],
            ['Micronutrients', 'Zinc, boron and iron, and a mix of zinc, iron, manganese and copper, in granular and liquid forms. They are made for alkaline soil, where these nutrients are held in forms the crop cannot take up.'],
            ['Secondary nutrients', 'Sulfur, magnesium and calcium grades.'],
            ['Soil health and biologicals', 'Humates, compost and bio-fertiliser.'],
          ],
        } },
        // Tahir 7 Nov 2026 (PR-1): SOP is bought in, so own-brand manufacturing covers the 22 brands made in VAN's plant.
        { k: 'note', text: 'If you would rather sell under your own brand, we can make for you the product sold under any of the 22 brands made in our plant, including Vital Urea, our sulfur coated urea. We make it to the same specification and on the same production line as the VAN-branded product, and pack it under your brand.' },
        { k: 'cta', label: 'Own-brand manufacturing →', href: '#/partner/brief-to-bag' },
      ],
    },
    {
      id: 'faq', n: '03', kicker: 'Questions dealers ask first', title: 'Answers to the questions dealers ask first', bg: true,
      // 10 Sep 2026: this line said "six questions" and that the minimum volume, the credit terms
      // and the lead time were deliberately absent. Tahir answered all three that evening, plus
      // advance booking, first delivery and margin, so the page now answers nine and the sentence
      // describing what it will not tell you had to go with them.
      lead: 'These 8 questions come up in almost every first conversation.',
      blocks: [{ k: 'faq', items: DISTRIBUTOR_FAQ }],
    },
    {
      id: 'enquiry', n: '04', kicker: 'Start the conversation', title: 'Tell us how much you expect to sell in a season and how to reach you',
      blocks: [{ k: 'enquiry' }],
    },
  ],
}

export const PARTNER_PIPELINE: RebuiltPage = {
  slug: 'pipeline', livePath: '/partner/pipeline.html',
  eyebrow: 'Your Brand · the library',
  h1: '27 unbranded formulations',   // D-183
  h1accent: 'each shown at its stage of development.',
  lead: 'VAN holds these formulations under neutral codes rather than brand names, so that a client can judge the technology without another brand name attached to it. Each code shows which of the 6 library stages it has reached. We do not sell a code at field-trial stage as if it were finished.',
  tone: 'gold',
  sections: [
    {
      id: 'library', n: '01', kicker: 'The library', title: 'The library, organised by nutrient family.',
      lead: 'Each code starts with letters for the main nutrients or the product type (for example NP for nitrogen and phosphorus, MX for micronutrients and secondary nutrients, and BIO for biologicals), usually followed by a number taken from the analysis. Each family has its own colour on the cards, the stage chart and the filter on this page.',
      blocks: [
        { k: 'library' },   // D-197: the full library moved here from Your Brand
        { k: 'cta', label: 'Composition chart: every code and every brand with its analysis →', href: '#/composition#library' },   // D-202
      ],
    },
    {
      id: 'codes', n: '02', kicker: 'The 3 codes in detail', title: 'Published detail on 3 codes: N-26L with its N-24L grade, P-44L and PK-82.', bg: true,
      blocks: [
        { k: 'h3', text: 'N-26L and N-24L: liquid nitrogen for centre-pivot injection and foliar spray' },
        { k: 'p', text: 'N-26L and N-24L carry their nitrogen in 3 forms: nitrate, ammoniacal and urea. The 3 forms become available at different times, so a single injection supplies nitrogen over a period instead of all at once. This changes when the nitrogen becomes available, not how much is supplied. A fertiliser with a single form of nitrogen makes all of it available at once, which does not suit application under a centre pivot. Both grades carry boron in solution, and N-26L also carries zinc, so these micronutrients need no separate application.' },
        { k: 'table', t: {
          head: ['Nitrogen fraction', 'N-26L', 'N-24L', 'What the fraction does'],
          minWidth: 820,
          rows: [
            ['Total nitrogen', '26.00%', '24.00%', 'The declared total: the sum of the 3 forms below.'],
            ['Nitrate nitrogen', '5.75%', '2.00%', 'Taken up immediately. It moves with the water, so it suits injection.'],
            ['Ammoniacal nitrogen', '6.50%', '3.00%', 'Held on the soil exchange sites rather than moving straight down with the wetting front.'],
            ['Urea nitrogen', '13.75%', '19.00%', 'The reserve fraction. It must be converted before the crop can use it, so it becomes available after the other 2 forms.'],
            ['Zinc (Zn)', '0.6%', 'n/a', 'Already in solution, so it does not have to be tank-mixed at the pump.'],
            ['Boron (B)', '0.02%', '1.00%', 'N-24L is the high-boron grade; N-26L carries a maintenance level.'],
            ['Solution pH', '6.6', '6.6', 'Near-neutral. An acidic solution strips zinc from galvanised steel and an alkaline solution corrodes aluminium; pH 6.6 avoids both.'],
            ['Density', '1.21 kg/L', '1.21 kg/L', 'Needed to convert an injection rate in litres into kilograms of nitrogen.'],
            ['Shelf life', '3 years', '3 years', 'From date of manufacture, in the sealed pack.'],
            ['Registration', 'PS 5469-2020', 'PS 5469-2020', 'Application under process; not yet licensed.'],
          ],
          note: 'Calculated from the declared analysis and the density of 1.21 kg/L: 1 litre of N-26L carries 315 g of nitrogen and 1 litre of N-24L carries 290 g. Packs are 20 L, 200 L and 1,000 L IBC (intermediate bulk container). The dose rate depends on the crop, region and application method, and is set for each programme.',
        } },
        { k: 'h3', text: 'P-44L: liquid foliar phosphorus, P₂O₅ 44% w/v (weight by volume)' },
        { k: 'p', text: 'In Pakistan, the main obstacle for phosphorus fertiliser is alkaline, calcareous soil, at roughly pH 7.9 to 8.4. In this soil, most of the phosphorus applied is fixed as calcium phosphates and never reaches the plant. Phosphorus applied to the leaf does not enter the soil, so the fixation reaction never starts.' },
        { k: 'table', t: {
          head: ['Nutrient', 'Content', 'g / L'],
          minWidth: 520,
          rows: [['P₂O₅', '44.0% w/v', '440'], ['K₂O', '7.5% w/v', '75'], ['MgO', '4.0% w/v', '40'], ['Zn', '1.0% w/v', '10'], ['B', '0.5% w/v', '5'], ['Fulvic acid', 'included · absorption aid', 'n/a'], ['Plant-derived organic carrier', 'proprietary', 'n/a']],
          note: 'Phosphorus is the main nutrient, and zinc and boron are supporting micronutrients. The product is formulated for Pakistani soil, water and spray programmes, and we can change the specification for a client.',
        } },
        { k: 'h3', text: 'Our phosphate range: 6 products on 4 routes (soil, fertigation, foliar, and PK at the reproductive stage)' },   // Tahir 7 Nov 2026 (CO-14)
        { k: 'table', t: {
          head: ['Route', 'Product', 'Analysis', 'Stage of the crop'],
          minWidth: 820,
          rows: [
            ['Soil · basal', 'Green Phosphate', '6:32:0, humic-coated acidic', 'Sowing / land prep'],
            ['Soil · basal', 'Fusion Phosphate (triple superphosphate, TSP)', 'P₂O₅ 46 total / 43 water-soluble', 'Sowing'],
            ['Fertigation · solid', 'V-Phosphate', '11:44:0 + Fe', 'Grand growth'], // Tahir 7 Nov 2026 (PR-7 grade, PR-22 stage name). Tahir 10 Nov 2026 (FU-1): was 'V. Ammonium Phosphate (V-Phosphate)'
            ['Fertigation · liquid', 'V-Germinator Pro (phosphate booster)', 'P₂O₅ 27% w/v + N 4.5% · K₂O 2% · Mg · S · Fe', 'By crop group (VAN guidance, 23 July 2026)'],   // Tahir 7 Nov 2026 (CO-21): oxide basis. L2 fact check 10 Nov 2026 (round 3 W1): stage follows R3-8, the 23 July guidance the product page prints. Was 'Germination'.
            ['Foliar · liquid', 'P-44L', 'P₂O₅ 44% w/v + K · Mg · Zn · B', 'Rapid growth / stress window'],
            ['Reproductive PK', 'PK-82', 'P₂O₅ 42 · K₂O 40', 'Flowering to grain fill'],
          ],
        } },
        { k: 'h3', text: 'PK-82: high P and K complex for the reproductive stage' },
        { k: 'p', text: 'Nutrition programmes in Pakistan are front-loaded: most of the nutrients are applied early in the season. Nitrogen and basal phosphorus are applied, and then the crop reaches the stage at which its potassium demand peaks: grain fill in wheat, boll development in cotton, tuber bulking in potato, and fruit set in mango and citrus. By that stage the programme supplies no further nutrients. Potassium is the nutrient most heavily depleted from Pakistan’s soils, and phosphorus is the most heavily fixed. At the reproductive stage, the crop’s supply of both nutrients therefore falls short at the same time.' },
        { k: 'p', text: 'PK-82 contains P₂O₅ 42% and K₂O 40%, a total of 82 nutrient units, which gives the code its number. It contains no nitrogen, so it can be applied at a stage when extra nitrogen would push vegetative growth at the wrong time. It is produced as a powder, a crystalline soluble and a liquid concentrate.' },
        { k: 'note', text: 'There is no trial figure for PK-82 yet. Its dose rate depends on the crop, region and application method, and is set for each programme.' },
      ],
    },
    {
      id: 'np', n: '03', kicker: 'The 2 NP grades', title: '2 NP grades that reduce phosphate fixation in different ways.',
      lead: 'Both grades address the same problem: most of the phosphorus applied to Pakistani soil is fixed as calcium phosphate before the crop can take it up. The first grade changes the timing of the phosphate supply; the second resists the fixation reaction.',
      blocks: [
        { k: 'h3', text: 'NP-540 (NP 5:40): phosphate released at 2 rates' },
        { k: 'p', text: 'The phosphate is in 2 fractions that release at different rates. The first is available immediately, for the seedling root, which has to find phosphorus in its first weeks. The second releases slowly afterwards and is still supplying phosphorus when the crop’s demand peaks. A conventional basal phosphate releases its whole amount early, when fixation is fastest and the crop is smallest. This grade spreads the supply across the season from a single application. Its nitrogen content is low by design, because it is designed as a phosphorus product, not as a grade that balances nitrogen and phosphorus.' },
        { k: 'h3', text: 'NP-838S (NP 8:38 with sulfur): phosphate formulated to resist fixation' },
        { k: 'p', text: 'Instead of changing the timing of the phosphate supply, this grade is formulated to resist the fixation reaction itself. Sulfur acidifies the soil immediately around the granule, where alkalinity would otherwise cause the phosphate to precipitate. The grade also contains our own agents that keep soil calcium away from the phosphate, so that the phosphate stays available to the plant for longer. Release is slow throughout, rather than split into 2 fractions. The sulfur is an active part of the formulation, and the crop also needs it as a nutrient.' },
        { k: 'note', text: 'There is no trial figure for either grade yet. The analyses shown are recorded in our internal product records, and the analysis report and specification sheet are available under an NDA. Both grades are made in granular, powder and crystalline form, in 50 kg and 1,000 kg packs.' },
      ],
    },
    {
      // D-185, Tahir 26 Sep 2026: licensing is not offered. The 3-row licence table (non-exclusive,
      // exclusive, graduation to a VAN brand) came off here. The published-versus-NDA table stays,
      // because it is about confidentiality, not licensing. Revert: restore the rows from the v60 zip.
      id: 'terms', n: '04', kicker: 'Before an agreement', title: 'What we publish, and what we share only under a non-disclosure agreement (NDA).', bg: true, tone: 'green',
      blocks: [
        { k: 'table', t: {
          head: ['', 'What it covers'],
          minWidth: 640,
          rows: [
            ['Public', 'Code, family, purpose, available grades and forms, target crops and application methods, pipeline stage, and 1 headline trial figure once it has been verified.'],
            // Tahir 7 Nov 2026 (CO-5): the codes published in detail on this page are the exceptions.
            ['Under an NDA', 'Full guaranteed analysis (except for the codes published in detail on this page), manufacturing specification, trial protocols and raw data, pricing, tank-mix and compatibility charts, and detailed regulatory status.'],
          ],
          note: 'We share none of the information covered by an NDA until the agreement is signed. This rule also applies to existing clients who work with us on other products. Tell us which code interests you and what you would do with it. We send the information covered by the NDA on that code, usually within 2 weeks of signing.'   // D-189: 2 weeks, the August ruling, restored over "same week",
        } },
      ],
    },
  ],
}

export const PARTNER_REGULATORY: RebuiltPage = {
  slug: 'regulatory', livePath: '/partner/regulatory.html',
  eyebrow: 'Your Brand · regulatory',
  h1: 'Fertiliser registration with PSQCA:',
  h1accent: 'our licences and our service for partners.',
  lead: 'A fertiliser that is not registered cannot be sold. If registration is late and a product misses its selling season, the product has to wait for the next season. VAN registers its own brands with PSQCA (Pakistan Standards and Quality Control Authority) itself, and 20 of our 23 brands hold a live PSQCA licence. 12 more products are already licensed and ready for a partner to launch within 60 days. We also offer this registration work to partners as a separate service.',
  tone: 'navy',
  sections: [
    {
      id: 'holds', n: '01', kicker: 'What we already hold', title: 'Our licences and registrations, by product.',
      blocks: [
        { k: 'table', t: {
          head: ['Product', 'Standard or registering body', 'Manufacturing licence'],
          minWidth: 700,
          rows: [
            ['Vital Urea (sulfur coated urea)', 'PS 217-2023', 'CM/L-4126/2025'],
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
          // Tahir 7 Nov 2026 (PR-7): the grade is 11:44:0, licence included.
          // Tahir 10 Nov 2026 (FU-1): the product is now sold as V-Phosphate, so the "sold as V. Ammonium Phosphate" example is gone. Was '..., and a registered name is not always the name the product is sold under: V-Phosphate, for example, is registered as V-Phosphate 11:44:0 and sold as V. Ammonium Phosphate.'
          // Lead 10 Nov 2026 (L3-1), from VP-1 and the V-Phosphate product page: the bag on sale still reads V. Ammonium Phosphate.
          note: 'Source: our trademark and PSQCA master record, July 2026. Some names in this table are short forms of the registered names: V-Phosphate, for example, is registered as V-Phosphate 11:44:0. The bag on sale still reads V. Ammonium Phosphate. 20 of our 23 brands hold a live PSQCA manufacturing licence. The other 3 do not, for these reasons: V-Mag Essential carries a conformance report, V-Compost is registered with the Soil Fertility Research Institute, and SOP (sulfate of potash) is a traded commodity to which no VAN licence applies.',
        } },
      ],
    },
    // Tahir 7 Nov 2026 (CO-8): section 02 'Backup registrations' removed completely; 'How registration works' renumbered 03 -> 02.
    {
      id: 'runs', n: '02', kicker: 'How registration works', title: 'Registration takes 4 steps, and we control the first 2.',
      blocks: [
        { k: 'table', t: {
          head: ['Step', 'What happens'],
          minWidth: 660,
          rows: [
            ['Standard selection', 'We establish which Pakistan Standard (PS) the product falls under and whether the intended analysis fits within it. A mistake at this step is the most expensive one in the process.'],
            ['Testing', 'Analysis against the standard, with our own laboratory data and certificates supporting the file.'],
            ['Dossier and filing', 'Preparation and filing with PSQCA, including the manufacturing evidence that an importer or a trader cannot supply.'],
            ['Licence', 'PSQCA issues the manufacturing licence, and the product can then be sold legally anywhere in Pakistan.'],
          ],
          note: 'We complete the first 2 steps within 3 weeks. The last 2 depend on the regulator and typically take 1 to 3 months.',
        } },
        { k: 'note', text: 'Every VAN product has a complete technical file, and a partner product is given the same file from the start: a 1-page technical data sheet, a 16-section GHS (Globally Harmonized System) safety data sheet with a hazard classification for that product rather than a general template, and a certificate of analysis for each production batch from our analytical laboratory, giving the specification, result and method for every assay.' },
        { k: 'cta', label: 'From brief to bag: where registration fits →', href: '#/partner/brief-to-bag' },
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
