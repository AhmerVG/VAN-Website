// D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction
/**
 * THE 17 NUTRIENTS, FOR A GROWER — 26 September 2026, D-186.
 *
 * Tahir: "create a rewrite and reimagine a page in the knowledge centre for growers, inviting them
 * to come and understand how important it is to learn about all nutrients and how a balance of
 * each nutrient can transform them ... do not copy paste anything but reimagine, rewrite, envision
 * and reproduce ... the Law of the Minimum, formulated by chemist Justus von Liebig, can be used to
 * explain the phenomenon."
 *
 * His rulings on scope (26 Sep): all 17 named; 11 in full (N, P, K, S, Ca, Mg, Zn, B, Fe, Mn, Cu);
 * C, H and O in 1 line; Cl, Mo and Ni named as the 3 VAN's soil table does not test, with no
 * shortage claimed. The VAN product for each nutrient is named as a link, with no price and no
 * claim beyond the registered analysis.
 *
 * WHAT IS AND IS NOT CLAIMED. The job of each nutrient and the sign of its shortage are textbook
 * plant nutrition, written in plain words, and carry no figure. The Pakistan notes are only what
 * this site already publishes: the Punjab soil survey (Soil Atlas), the Crop Force bag's printed
 * line on potash, and the alkaline-soil mechanism on the phosphate product pages. No deficiency
 * percentage, no yield response and no trial figure has been added. Where a nutrient has no VAN
 * product, the entry says so.
 *
 * Plain English rules apply (the pakistan-plain-english skill): short sentences, digits, no
 * slogans, no em dashes, no "X is not Y, it is Z".
 */

export type NutrientGroup = 'air' | 'major' | 'secondary' | 'micro'

export type NutrientEntry = {
  key: string
  symbol: string
  name: string
  /** Urdu, first pass, unreviewed, like the rest of the Urdu layer. Shown only when the Urdu labels are on. */
  urdu?: string
  group: NutrientGroup
  /** The job in the plant, in 1 or 2 sentences. Absent only on the 6 brief entries. */
  job?: string
  /** What the grower sees when it is short. Qualitative only. */
  short?: string
  /** Which other nutrients it works with, or against. */
  partners?: string
  /** Only what this site already publishes. */
  pakistan?: string
  /** VAN product slugs that carry it, in the order a grower meets them. Empty means VAN has no product for it and the page says so. */
  van: string[]
  /** For the 3 not tested and the 3 from air and water: the 1-line entry. */
  brief?: string
}

// L1 editor 7 Nov 2026: m10 (micro lead 'if any 1 of them is missing'), m22 (phosphorus: measure placed next to the median), m19 ('5-band soil-test scale'),
// m11 ('a wheat crop of 60 maunds per acre'), m2 (ppm written out at first use on the nutrients page, boron card).
export const NUTRIENT_GROUPS: Record<NutrientGroup, { title: string; lead: string }> = {
  air: { title: 'From air and water', lead: 'The crop takes carbon, hydrogen and oxygen from air and water. They are not bought as fertiliser, and together they make up more than 90% of the plant’s dry weight.' },
  major: { title: 'Major nutrients: the 3 needed in the largest amounts', lead: 'Most of a grower’s fertiliser spending goes on nitrogen, phosphorus and potassium. Most fertiliser mistakes also involve these 3. The usual mistake is too much of 1 and too little of the other 2.' },
  secondary: { title: 'Secondary nutrients: 3 needed in moderate amounts', lead: 'A crop takes up calcium, magnesium and sulfur in amounts measured in kilograms an acre, close to the amount of phosphorus it takes up. They are the nutrients most often left out of fertiliser programmes in Pakistan.' },
  micro: { title: 'Micronutrients: 8 needed in grams', lead: 'A crop needs each micronutrient only in grams an acre, but it cannot complete its growth if any 1 of them is missing. A crop given plenty of nitrogen can still grow poorly because of a shortage of zinc.' },
}

export const NUTRIENTS_17: NutrientEntry[] = [
  { key: 'C', symbol: 'C', name: 'Carbon', group: 'air', van: [], brief: 'The crop takes carbon from the air, through the leaf, as carbon dioxide. Every sugar, starch and fibre the crop makes is built from carbon.' },
  { key: 'H', symbol: 'H', name: 'Hydrogen', group: 'air', van: [], brief: 'The crop takes hydrogen from water, through the root. It is part of every sugar the leaf makes.' },
  { key: 'O', symbol: 'O', name: 'Oxygen', group: 'air', van: [], brief: 'The crop takes oxygen from air and water. The root needs oxygen to breathe, which is why a crop in a waterlogged field can be short of nutrients even when the soil holds plenty of them.' },

  {
    key: 'N', symbol: 'N', name: 'Nitrogen', urdu: 'نائٹروجن', group: 'major',
    job: 'Nitrogen is part of every protein and of chlorophyll. It determines how much leaf the crop grows and how green the leaves are. The leaves make the sugars that fill the grain.',
    short: 'Older leaves turn pale yellow first, from the tip back, because the plant moves nitrogen out of old leaves into new ones. Plants stay small and thin. Grain has less protein.',
    partners: 'The plant needs sulfur to turn nitrogen into protein. A crop short of sulfur cannot use all the nitrogen it is given, and the nitrogen it does not use is lost from the field. A crop also needs potassium to make good use of nitrogen: nitrogen drives leaf growth, and potassium moves sugar out of the leaf. Nitrogen without enough potassium gives soft, tall growth that falls over.',
    pakistan: 'Pakistan applies more nitrogen than any other nutrient, and a larger share of the nitrogen is lost than of any other nutrient. Its nitrogen use efficiency was 29.1% in 2023 (FAOSTAT): about 71 of every 100 kg of nitrogen added to its cropland were not taken out in the harvested crop. Sulfur coated urea (SCU) releases its nitrogen gradually, over days rather than all at once, so more of it reaches the roots than from uncoated urea.',
    van: ['vital-urea', 'cala-mag-v', 'vl-npk'],
  },
  {
    key: 'P', symbol: 'P', name: 'Phosphorus', urdu: 'فاسفورس', group: 'major',
    job: 'Inside the plant, phosphorus is used to move energy, and the plant needs it to grow roots. It affects how fast a seedling puts down roots, how many tillers wheat makes, and how well the crop sets and fills its grain.',
    short: 'Seedlings grow slowly and are dark green, sometimes with a purple tint on the older leaves and stems. The crop makes fewer tillers, flowers late and forms small heads. Most of the damage is done in the first weeks and cannot be undone later.',
    partners: 'Phosphorus and zinc work against each other: a heavy dose of phosphate on a soil already low in zinc makes the zinc shortage worse. Inside the plant, phosphorus needs calcium. In the soil, calcium binds phosphate into forms the root cannot take up. This binding is the central phosphorus problem in Pakistan’s soils.',
    pakistan: 'In the Punjab soil survey (770,160 samples, tested in about 2016 to 2018), the median available phosphorus (measured as elemental phosphorus) was in the Critical or Weak band of VAN’s 5-band soil-test scale in 35 of the 36 districts. In the same survey, 69.1% of samples were above pH 8, and calcareous soil above pH 8 binds applied phosphate before the root reaches it. The Soil Atlas shows each district.',
    van: ['green-phosphate', 'v-phosphate', 'fusion-phosphate', 'v-germinator-pro'],
  },
  {
    key: 'K', symbol: 'K', name: 'Potassium', urdu: 'پوٹاش', group: 'major',
    job: 'Potassium controls the movement of water and sugar in the plant. It opens and closes the pores in the leaf, moves sugar from the leaf to the grain, tuber or fruit, and thickens the cell wall. It affects crop quality, grain weight and tolerance of stress: heat, drought and disease all do more damage to a crop that is short of potassium.',
    short: 'Older leaves scorch along the edge and the tip while the centre of the leaf stays green. Stems are weak and the crop falls over (lodges). Grain is light, and fruit is small and stores badly.',
    partners: 'Potassium works with nitrogen: nitrogen drives leaf growth, and potassium moves sugar from the leaf to fill the grain. Too much potassium reduces the plant’s uptake of magnesium and calcium. Potassium, magnesium and calcium should therefore be planned together, not each applied on its own.',
    // Tahir 7 Nov 2026 (PR-28): 1 year and 1 source (NFDC 2024-25).
    // Tahir 10 Nov 2026 (LM-N17): "applied", was "sold".
    pakistan: 'In 2024-25, potash was 1% of the fertiliser nutrients applied in Pakistan (NFDC). VAN prints this figure on its Crop Force bag. VAN’s wheat balance page shows how much potash a wheat crop of 60 maunds per acre removes from the field when the straw (bhoosa) is also taken away.',
    van: ['vital-potash', 'fusion-potash', 'v-potash-plus', 'sop', 'vl-potash-liquid'],
  },

  {
    key: 'Ca', symbol: 'Ca', name: 'Calcium', urdu: 'کیلشیم', group: 'secondary',
    job: 'Calcium holds the cell walls together and is needed at every growing point. Once calcium is placed in a tissue it does not move again, so the crop needs a steady supply while it grows, especially where fruit and tubers are forming.',
    short: 'The youngest tissue fails first: new leaves have burnt tips, tomatoes get blossom end rot, apples get bitter pit and potatoes get hollow heart. Old leaves look normal.',
    partners: 'Calcium and boron work together to build the cell wall, and boron is needed for calcium to move to the growing point. Too much potassium or magnesium in the soil reduces the calcium the root takes up.',
    pakistan: 'Pakistan’s soils hold a great deal of calcium in the form of lime. A crop can still be short of calcium, because the calcium in lime is not in a form the root can take up, and because a heavy dose of potash blocks its uptake.',
    van: ['cala-mag-v'],
  },
  {
    key: 'Mg', symbol: 'Mg', name: 'Magnesium', urdu: 'میگنیشیم', group: 'secondary',
    job: 'Magnesium sits at the centre of every chlorophyll molecule, so without it the leaf cannot stay green or make sugar. It also helps the plant move phosphorus.',
    short: 'Older leaves go yellow between the veins while the veins stay green, giving a striped or marbled look. The yellowing starts on the lower leaves and moves up the plant.',
    partners: 'Too much potassium or too much calcium reduces the magnesium a crop takes up. When a fertiliser programme raises the potash dose without adding magnesium, the crop often shows a magnesium shortage in the same season.',
    van: ['v-mag-essential', 'cala-mag-v', 'v-potash-plus', 'fusion-potash'],
  },
  {
    key: 'S', symbol: 'S', name: 'Sulfur', urdu: 'سلفر', group: 'secondary',
    job: 'Sulfur is part of 3 of the amino acids from which the plant builds protein, and of the oils in canola, mustard and sesame. The plant needs it to turn applied nitrogen into grain protein.',
    short: 'Young leaves go pale yellow all over. Nitrogen shortage shows the opposite pattern and starts on the old leaves. Plants are thin and grow slowly, and oilseeds give less oil.',
    partners: 'Sulfur and nitrogen work as a pair: without enough sulfur, extra nitrogen is wasted. Elemental sulfur also makes the soil around each sulfur granule more acidic, and this can release phosphate and zinc that the soil holds near the granule.',
    pakistan: 'The Punjab soil testing programme did not test for sulfur, so the Soil Atlas cannot show it. VAN’s soil report does not test for sulfur either. No national figure for soil sulfur has been published.',
    van: ['green-sulfur', 'vital-urea', 'sop', 'fusion-potash'],
  },

  {
    key: 'Zn', symbol: 'Zn', name: 'Zinc', urdu: 'زنک', group: 'micro',
    job: 'Zinc is needed to make the growth hormone that lengthens the stem and the enzymes that build protein. It affects plant height, leaf size and, in rice and wheat, grain set.',
    short: 'Young leaves come out small, narrow and yellow between the veins. The stem sections between the leaves (internodes) stay short, so the plant looks bunched. In maize, a white band appears down the young leaf. In rice nurseries, brown spots appear on the older leaves.',
    partners: 'Zinc and phosphorus work against each other, so a heavy phosphate dose makes a zinc shortage worse on a soil already low in zinc. At high pH, the soil binds zinc in the same way as it binds phosphate.',
    pakistan: 'The Soil Atlas shows the survey’s median zinc reading for each district; in several districts the median was in the Critical band. A grower can check the district there before deciding on a zinc dose.',
    van: ['v-transform', 'v-zinc', 'vl-micro-mix'], // L2 correction 9 Nov 2026 (KN-5): V. Ammonium Phosphate carries iron only, removed from zinc. Was [..., 'v-phosphate'].
  },
  {
    key: 'B', symbol: 'B', name: 'Boron', urdu: 'بوران', group: 'micro',
    job: 'Boron builds the cell wall together with calcium and carries sugar to the flower. It affects pollination, seed set and fruit set. When a cotton boll, a sunflower head or a rice panicle sets badly, boron shortage is often the cause.',
    short: 'Growing points die, stems go hollow or cracked, flowers drop without setting, and fruit is misshapen. Cauliflower gets a hollow brown stem, and sugar beet gets a rotten heart.',
    partners: 'Boron and calcium work together at the growing point. The difference between enough boron and too much boron is small, which is why VAN coats boron onto its potash granules rather than relying only on a separate loose dose.',
    pakistan: 'In the Punjab soil survey (tested in about 2016 to 2018), 51.7% of samples were below Punjab’s working threshold for boron of 0.5 ppm (parts per million). The Soil Atlas shows each district’s median and its band.',
    van: ['v-boron', 'vital-potash', 'fusion-potash', 'v-mag-essential', 'cala-mag-v'],
  },
  {
    key: 'Fe', symbol: 'Fe', name: 'Iron', urdu: 'آئرن', group: 'micro',
    job: 'Iron is needed to make chlorophyll and for the enzymes that carry electrons in the leaf. A leaf without iron cannot turn light into sugar.',
    short: 'The youngest leaves go yellow between the veins while the veins stay sharply green, and then whole leaves turn white. Old leaves stay green, which distinguishes iron shortage from magnesium shortage.',
    partners: 'Iron and manganese compete for uptake, and at high pH the soil binds both. In Pakistan, iron shortage is usually caused by bicarbonate in irrigation water and lime in the soil, so a soil can hold plenty of iron that the root cannot take up.',
    pakistan: 'Iron is tested on VAN’s soil report and shown on the Soil Atlas. In 4 districts, the survey’s iron figures cannot be compared with those of the other 32 districts; the Soil Atlas notes that they suggest a different laboratory method.',
    van: ['vl-micro-mix', 'v-potash-plus', 'v-phosphate', 'v-germinator-pro'],
  },
  {
    key: 'Mn', symbol: 'Mn', name: 'Manganese', urdu: 'مینگنیز', group: 'micro',
    job: 'Manganese splits water inside the leaf so that photosynthesis can run, and it helps the plant use nitrogen. It also strengthens the plant’s resistance to fungal disease.',
    short: 'Young and middle leaves go yellow between the veins and show grey or brown speckles. In oats and wheat the condition is called grey speck.',
    partners: 'High pH and dry, well-aerated soil both make manganese less available. Too much iron or a heavy dose of lime makes the shortage worse.',
    pakistan: 'Manganese is tested on VAN’s soil report and shown on the Soil Atlas.',
    van: ['vl-micro-mix'], // D-214: V. Ammonium Phosphate carries iron only
  },
  {
    key: 'Cu', symbol: 'Cu', name: 'Copper', urdu: 'کاپر', group: 'micro',
    job: 'Copper is needed by the enzymes that build lignin, the woody part of the stem, and for pollen to form. Cereals short of copper produce empty heads.',
    short: 'Young leaves twist and wilt at the tip, heads emerge empty or half filled, and stems are weak. Copper shortage is rare in Pakistan.',
    partners: 'Organic matter holds copper tightly, so peaty and heavily manured soils can be short of copper while mineral soils are not.',
    pakistan: 'The median copper reading was in the Healthy band in all 32 Punjab districts where the survey figure is comparable. The Soil Atlas marks the other 4 districts as not comparable.',
    van: ['vl-micro-mix'], // D-214: V. Ammonium Phosphate carries iron only
  },
  { key: 'Cl', symbol: 'Cl', name: 'Chlorine', group: 'micro', van: [], brief: 'Chlorine is needed in small amounts for the working of the leaf pores and for the plant’s water balance. Rain, irrigation water and muriate of potash (MOP) supply it. VAN’s soil report does not test for it.' },
  { key: 'Mo', symbol: 'Mo', name: 'Molybdenum', group: 'micro', van: [], brief: 'Molybdenum is needed in the smallest amount of all the nutrients, for the enzyme that turns nitrate into protein and for the bacteria that fix nitrogen in pulses. Unlike the other micronutrients, it becomes more available as pH rises. VAN’s soil report does not test for it.' },
  { key: 'Ni', symbol: 'Ni', name: 'Nickel', group: 'micro', van: [], brief: 'Nickel was the last nutrient to be recognised as essential for plants, in 1987. The plant needs a trace of it for the enzyme that breaks down urea in its tissues. VAN’s soil report does not test for it.' },
]

export const NUTRIENTS_FULL = NUTRIENTS_17.filter(n => !n.brief)

/**
 * THE LAW OF THE MINIMUM, in the site's words. Justus von Liebig, a German chemist, set it out in the
 * 1840s: growth is limited by the scarcest nutrient, not by the total. The picture everyone
 * remembers came later and is usually credited to Carl Sprengel’s work and to Liebig’s followers:
 * a barrel made of staves of different heights holds water only up to the shortest stave.
 */
export const LIEBIG = {
  h2: 'Liebig’s barrel: how the nutrient in shortest supply limits the crop',
  lead: 'In the 1840s the German chemist Justus von Liebig set out the Law of the Minimum: a crop’s growth is limited by the nutrient in shortest supply compared with what the crop needs, and adding more of any other nutrient does not raise that limit. The law is usually shown as a wooden barrel in which each stave stands for 1 nutrient. The barrel holds water only up to the top of its shortest stave. If nitrogen is not the shortest stave, another bag of urea makes the nitrogen stave taller, but the water level stays at the top of the shortest stave.',
  how: 'Each stave shows the amount of 1 nutrient you applied as a share of the amount in VAN’s published crop plan for that crop, per acre. The shortest stave is the nutrient with the smallest share.',
}

/** The why strip on the home page (D-187): 4 questions a grower asks, each answered on a page of this site. */
export const WHY_QUESTIONS: { q: string; a: string; href: string }[] = [
  { q: 'Why can a crop stop growing even when plenty of urea has been applied?', a: 'Crop growth is limited by the nutrient in shortest supply. Urea supplies nitrogen, and adding more nitrogen does not make up for a shortage of another nutrient.', href: '#/knowledge/nutrients#barrel' },
  { q: 'Why does so little of the phosphate I apply reach the root?', a: 'In calcareous soil with a pH above 8, calcium binds most of the applied phosphate before the root can take it up. In the Punjab soil survey (770,160 samples, tested in about 2016 to 2018), 69.1% of samples had a pH above 8.', href: '#/soil' },
  { q: 'Why does the way I apply fertiliser matter?', a: 'The form of a nutrient, when it is applied and where it is placed decide how much of it the crop takes up.', href: '#/knowledge/application-systems' },
  { q: 'Why does the plan change with my sowing date?', a: 'The date on which each crop stage begins depends on the sowing date, so the plan moves the date of each application to match. The amount of each product per acre stays the same.', href: '#/crops/wheat' },
]
