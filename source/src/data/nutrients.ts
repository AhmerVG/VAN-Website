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
  air: { title: 'Nutrients from air and water', lead: 'The crop takes carbon, hydrogen and oxygen from air and water. Together these 3 nutrients make up more than 90% of the plant’s dry weight. A grower does not buy them as fertiliser.' },
  major: { title: 'Major nutrients: the 3 needed in the largest amounts', lead: 'Most of a grower’s fertiliser spending goes on nitrogen, phosphorus and potassium. Most fertiliser mistakes also involve these 3 nutrients. The usual mistake is too much of 1 and too little of the other 2.' },
  secondary: { title: 'Secondary nutrients: 3 needed in moderate amounts', lead: 'A crop takes up calcium, magnesium and sulfur in amounts measured in kilograms per acre, close to the amount of phosphorus it takes up. In Pakistan, these 3 nutrients are the ones most often left out of fertiliser programmes.' },
  micro: { title: 'Micronutrients: 8 needed in grams', lead: 'A crop needs each micronutrient only in grams per acre. Even so, the crop cannot complete its growth if any 1 of them is missing. For example, a crop given plenty of nitrogen can still grow poorly because of a shortage of zinc.' },
}

export const NUTRIENTS_17: NutrientEntry[] = [
  { key: 'C', symbol: 'C', name: 'Carbon', group: 'air', van: [], brief: 'The crop takes carbon from the air, through the leaf, as carbon dioxide. Every sugar, starch and fibre the crop makes is built from carbon.' },
  { key: 'H', symbol: 'H', name: 'Hydrogen', group: 'air', van: [], brief: 'The crop takes hydrogen from water, through the root. Hydrogen is part of every sugar the leaf makes.' },
  { key: 'O', symbol: 'O', name: 'Oxygen', group: 'air', van: [], brief: 'The crop takes oxygen from air and water. The root needs oxygen to breathe and to take up nutrients. Waterlogged soil holds little oxygen. A crop in a waterlogged field can therefore be short of nutrients even when the soil holds plenty of them.' },

  {
    key: 'N', symbol: 'N', name: 'Nitrogen', urdu: 'نائٹروجن', group: 'major',
    job: 'Nitrogen is part of every protein and of chlorophyll. It determines how much leaf the crop grows and how green the leaves are. The leaves make the sugars that fill the grain.',
    short: 'Older leaves turn pale yellow first, from the tip back, because the plant moves nitrogen out of old leaves into new ones. Plants stay small and thin. Grain has less protein.',
    partners: 'The plant needs sulfur to turn nitrogen into protein. A crop short of sulfur cannot use all the nitrogen it is given. The nitrogen that the crop does not use is lost to the air or to water. A crop also needs potassium to make good use of nitrogen. Nitrogen drives leaf growth. Potassium then moves sugar out of the leaf. When a crop gets nitrogen without enough potassium, it makes soft, tall growth that falls over.',
    pakistan: 'Pakistan applies more nitrogen than any other nutrient. Pakistan loses a larger share of its applied nitrogen than of any other applied nutrient. The share of the nitrogen added to cropland that ends up in the harvested crop is called nitrogen use efficiency (NUE). Pakistan’s NUE was 29.1% in 2023 (FAOSTAT estimate). This NUE means that Pakistan’s harvested crops contained about 29 kg of nitrogen for every 100 kg of nitrogen added to cropland in 2023. The FAOSTAT estimate counts nitrogen added from all sources. About 71 kg of every 100 kg added was not taken out in the harvested crop. The form of urea is 1 factor in how much nitrogen is taken out in the harvested crop, because the form affects how much of the urea’s nitrogen reaches the roots. Sulfur coated urea (SCU) releases its nitrogen gradually over a period of days. With this gradual release, more of the nitrogen reaches the roots than with uncoated urea.',
    van: ['vital-urea', 'cala-mag-v', 'vl-npk'],
  },
  {
    key: 'P', symbol: 'P', name: 'Phosphorus', urdu: 'فاسفورس', group: 'major',
    job: 'Inside the plant, phosphorus is used to move energy. The plant also needs phosphorus to grow roots. Phosphorus affects how fast a seedling puts down roots, how many tillers wheat makes, and how well the crop sets and fills its grain.',
    short: 'Seedlings grow slowly and stay dark green. Some seedlings show a purple tint on the older leaves and stems. The crop makes fewer tillers, flowers late and forms small heads. Most of the damage is done in the first weeks. This early damage cannot be undone later.',
    partners: 'Phosphorus and zinc work against each other. A heavy dose of phosphate on a soil already low in zinc makes the zinc shortage worse. Inside the plant, phosphorus needs calcium. In the soil, however, calcium binds phosphate into forms the root cannot take up. This binding is the central phosphorus problem in Pakistan’s soils.',
    pakistan: 'The Punjab soil testing programme tested 770,160 soil samples in about 2016 to 2018. In 35 of the 36 Punjab districts, the median available phosphorus in the programme’s samples was in the Critical or Weak band of VAN’s 5-band soil-test scale. In the same programme, 69.1% of samples had a pH above 8. Calcareous soil with a pH above 8 binds applied phosphate before the root reaches it. The Soil Atlas shows these readings for each district.',
    van: ['green-phosphate', 'v-phosphate', 'fusion-phosphate', 'v-germinator-pro'],
  },
  {
    key: 'K', symbol: 'K', name: 'Potassium', urdu: 'پوٹاش', group: 'major',
    job: 'Potassium controls the movement of water and sugar in the plant. It opens and closes the pores in the leaf. It also moves sugar from the leaf to the grain, tuber or fruit. Potassium thickens the cell wall as well. Potassium affects crop quality, grain weight and the crop’s tolerance of stress. Heat, drought and disease all do more damage to a crop that is short of potassium.',
    short: 'Older leaves scorch along the edge and the tip while the centre of the leaf stays green. Weak stems cause the crop to fall over. This falling over is called lodging. Grain is light. Fruit is small and stores badly.',
    partners: 'Potassium works with nitrogen. Nitrogen drives leaf growth. Potassium then moves sugar from the leaf to fill the grain. Too much potassium reduces the plant’s uptake of magnesium and calcium. Potassium, magnesium and calcium should therefore be planned together.',
    // Tahir 7 Nov 2026 (PR-28): 1 year and 1 source (NFDC 2024-25).
    // Tahir 10 Nov 2026 (LM-N17): "applied", was "sold".
    pakistan: 'In the fiscal year 2024-25, potash (K₂O) was 1% of the fertiliser nutrients applied in Pakistan (NFDC). VAN prints this figure on its Crop Force bag. VAN’s wheat balance page also shows how much potash a wheat crop of 60 maunds per acre removes from the field when the straw, known as bhoosa, is also taken away.',
    van: ['vital-potash', 'fusion-potash', 'v-potash-plus', 'sop', 'vl-potash-liquid'],
  },

  {
    key: 'Ca', symbol: 'Ca', name: 'Calcium', urdu: 'کیلشیم', group: 'secondary',
    job: 'Calcium holds the cell walls together. The plant needs calcium at every growing point. Once calcium is placed in a tissue, it does not move again. The crop therefore needs a steady supply of calcium while it grows, especially where fruit and tubers are forming.',
    short: 'The youngest tissue fails first. New leaves have burnt tips. Old leaves look normal. In fruit and tubers, calcium shortage causes blossom end rot in tomatoes, bitter pit in apples and hollow heart in potatoes.',
    partners: 'Calcium and boron work together to build the cell wall. Boron is also needed for calcium to move to the growing point. Too much potassium or magnesium in the soil reduces the calcium the root takes up.',
    pakistan: 'Pakistan’s soils hold a great deal of calcium in the form of lime. A crop can still be short of calcium on these soils. 1 reason is that the calcium in lime is not in a form the root can take up. A heavy dose of potash also blocks the uptake of calcium.',
    van: ['cala-mag-v'],
  },
  {
    key: 'Mg', symbol: 'Mg', name: 'Magnesium', urdu: 'میگنیشیم', group: 'secondary',
    job: 'Magnesium sits at the centre of every chlorophyll molecule. Without magnesium, the leaf cannot stay green or make sugar. Magnesium also helps the plant move phosphorus.',
    short: 'Older leaves go yellow between the veins while the veins stay green. The leaves then have a striped or marbled look. The yellowing starts on the lower leaves and moves up the plant.',
    partners: 'Too much potassium or too much calcium reduces the magnesium a crop takes up. When a fertiliser programme raises the potash dose without adding magnesium, the crop often shows a magnesium shortage in the same season.',
    van: ['v-mag-essential', 'cala-mag-v', 'v-potash-plus', 'fusion-potash'],
  },
  {
    key: 'S', symbol: 'S', name: 'Sulfur', urdu: 'سلفر', group: 'secondary',
    job: 'Sulfur is part of 3 of the amino acids from which the plant builds protein, and of the oils in canola, mustard and sesame. The plant needs it to turn applied nitrogen into grain protein.',
    short: 'Young leaves go pale yellow all over. Nitrogen shortage shows the opposite pattern and starts on the old leaves. Plants are thin and grow slowly. Oilseed crops give less oil.',
    partners: 'Sulfur and nitrogen work as a pair. Without enough sulfur, extra nitrogen is wasted. Elemental sulfur also makes the soil around each sulfur granule more acidic. This acidity can release phosphate and zinc that the soil holds near the granule.',
    van: ['green-sulfur', 'vital-urea', 'sop', 'fusion-potash'],
  },

  {
    key: 'Zn', symbol: 'Zn', name: 'Zinc', urdu: 'زنک', group: 'micro',
    job: 'Zinc is needed to make the growth hormone that lengthens the stem and the enzymes that build protein. It affects plant height, leaf size and, in rice and wheat, grain set.',
    short: 'Young leaves come out small, narrow and yellow between the veins. The stem sections between the leaves, called internodes, stay short. The plant therefore looks bunched. In maize, a white band appears down the young leaf. In rice nurseries, brown spots appear on the older leaves.',
    partners: 'Zinc and phosphorus work against each other. A heavy phosphate dose therefore makes a zinc shortage worse on a soil already low in zinc. At high pH, the soil binds zinc in the same way as it binds phosphate.',
    pakistan: 'The Soil Atlas shows the Punjab soil testing programme’s median zinc reading for each district. In several districts, the median zinc reading was in the Critical band. Before deciding on a zinc dose, a grower can check the Soil Atlas for the zinc reading of the district where the farm is.',
    van: ['v-transform', 'v-zinc', 'vl-micro-mix'], // L2 correction 9 Nov 2026 (KN-5): V. Ammonium Phosphate carries iron only, removed from zinc. Was [..., 'v-phosphate'].
  },
  {
    key: 'B', symbol: 'B', name: 'Boron', urdu: 'بوران', group: 'micro',
    job: 'Boron builds the cell wall together with calcium. It also carries sugar to the flower. Boron affects pollination, seed set and fruit set. When a cotton boll, a sunflower head or a rice panicle sets badly, boron shortage is often the cause.',
    short: 'The signs are dying growing points, hollow or cracked stems, flowers that drop without setting, and misshapen fruit. Boron shortage also causes a hollow brown stem in cauliflower and a rotten heart in sugar beet.',
    partners: 'Boron and calcium work together at the growing point. The difference between enough boron and too much boron is small. A grower therefore has to measure the boron dose carefully. For this reason, VAN coats boron onto its potash granules instead of relying only on a separate loose dose. Boron coated on a potash granule cannot separate from the potash in the bag. Every application of the potash therefore carries its boron with it.',
    pakistan: 'In the Punjab soil testing programme of about 2016 to 2018, 51.7% of samples were below Punjab’s working threshold for boron of 0.5 parts per million (ppm). The Soil Atlas shows the median boron reading and its band for each district.',
    van: ['v-boron', 'vital-potash', 'fusion-potash', 'v-mag-essential', 'cala-mag-v'],
  },
  {
    key: 'Fe', symbol: 'Fe', name: 'Iron', urdu: 'آئرن', group: 'micro',
    job: 'Iron is needed to make chlorophyll and for the enzymes that carry electrons in the leaf. A leaf without iron cannot turn light into sugar.',
    short: 'The youngest leaves go yellow between the veins while the veins stay sharply green. Later, whole leaves turn white. Old leaves stay green. Green old leaves distinguish iron shortage from magnesium shortage.',
    partners: 'Iron and manganese compete for uptake. At high pH, the soil binds both of them. In Pakistan, iron shortage is usually caused by bicarbonate in irrigation water and lime in the soil. A soil can therefore hold plenty of iron that the root cannot take up.',
    pakistan: 'Iron is tested on VAN’s soil report and shown on the Soil Atlas. In 4 districts, the Punjab soil testing programme’s iron figures cannot be compared with those of the other 32 districts. The Soil Atlas notes that the figures from these 4 districts suggest a different laboratory method.',
    van: ['vl-micro-mix', 'v-potash-plus', 'v-phosphate', 'v-germinator-pro'],
  },
  {
    key: 'Mn', symbol: 'Mn', name: 'Manganese', urdu: 'مینگنیز', group: 'micro',
    job: 'Manganese splits water inside the leaf so that photosynthesis can run. It also helps the plant use nitrogen. Manganese strengthens the plant’s resistance to fungal disease as well.',
    short: 'Young and middle leaves go yellow between the veins and show grey or brown speckles. In oats and wheat, the condition is called grey speck.',
    partners: 'High pH and dry, well-aerated soil both make manganese less available. Too much iron or a heavy dose of lime makes manganese shortage worse.',
    pakistan: 'Manganese is tested on VAN’s soil report and shown on the Soil Atlas.',
    van: ['vl-micro-mix'], // D-214: V. Ammonium Phosphate carries iron only
  },
  {
    key: 'Cu', symbol: 'Cu', name: 'Copper', urdu: 'کاپر', group: 'micro',
    job: 'Copper is needed by the enzymes that build lignin, the woody part of the stem. Copper is also needed for pollen to form. Cereals short of copper produce empty heads.',
    short: 'The signs are young leaves that twist and wilt at the tip, heads that emerge empty or half filled, and weak stems. Copper shortage is rare in Pakistan.',
    partners: 'Organic matter holds copper tightly. Soils rich in organic matter, such as peaty and heavily manured soils, can therefore be short of copper while mineral soils are not.',
    pakistan: 'In the Punjab soil testing programme, the median copper reading was in the Healthy band in all 32 districts where the programme’s figure is comparable. The Soil Atlas marks the other 4 districts as not comparable.',
    van: ['vl-micro-mix'], // D-214: V. Ammonium Phosphate carries iron only
  },
  { key: 'Cl', symbol: 'Cl', name: 'Chlorine', group: 'micro', van: [], brief: 'Chlorine is needed in small amounts for the working of the leaf pores and for the plant’s water balance. Rain, irrigation water and muriate of potash (MOP) supply it. VAN’s soil report does not test for it.' },
  { key: 'Mo', symbol: 'Mo', name: 'Molybdenum', group: 'micro', van: [], brief: 'Molybdenum is needed in the smallest amount of all the nutrients. The plant needs it for the enzyme that turns nitrate into protein and for the bacteria that fix nitrogen in pulses. Unlike the other micronutrients, it becomes more available as pH rises. VAN’s soil report does not test for it.' },
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
  lead: 'In the 1840s, the German chemist Justus von Liebig set out the Law of the Minimum. The law says that a crop’s growth is limited by the nutrient in shortest supply compared with what the crop needs. Adding more of any other nutrient does not raise growth above the limit set by that nutrient. The law is usually shown as a wooden barrel. The barrel is made of upright wooden planks called staves. Each stave stands for 1 nutrient. The water in the barrel stands for the crop’s growth. The barrel holds water only up to the top of its shortest stave. When nitrogen is not the shortest stave, another bag of urea makes the nitrogen stave taller. The water level still stays at the top of the shortest stave.',
  how: 'Each stave shows the amount of 1 nutrient you applied as a share of the amount in VAN’s published crop plan for that crop, per acre. The shortest stave belongs to the nutrient with the smallest share.',
}

/** The why strip on the home page (D-187): 4 questions a grower asks, each answered on a page of this site. */
export const WHY_QUESTIONS: { q: string; a: string; href: string }[] = [
  { q: 'Why can a crop stop growing even when plenty of urea has been applied?', a: 'Crop growth is limited by the nutrient in shortest supply. Urea supplies nitrogen. Adding more nitrogen does not make up for a shortage of another nutrient.', href: '#/knowledge/nutrients#barrel' },
  { q: 'Why does so little of the phosphate I apply reach the root?', a: 'In calcareous soil with a pH above 8, calcium binds most of the applied phosphate before the root can take it up. In the Punjab soil testing programme, 69.1% of the 770,160 samples tested in about 2016 to 2018 had a pH above 8.', href: '#/soil' },
  { q: 'Why does the way I apply fertiliser matter?', a: 'The form of a nutrient, when it is applied and where it is placed decide how much of it the crop takes up.', href: '#/knowledge/application-systems' },
  { q: 'Why does the plan change with my sowing date?', a: 'The date on which each crop stage begins depends on the sowing date. The plan therefore moves the date of each application to match the new stage dates. The amount of each product per acre stays the same.', href: '#/crops/wheat' },
]
