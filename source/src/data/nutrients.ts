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

export const NUTRIENT_GROUPS: Record<NutrientGroup, { title: string; lead: string }> = {
  air: { title: 'From air and water', lead: 'The crop takes these 3 from the air and from the water it drinks. Nobody buys them, and they are more than 90% of the dry weight of the plant.' },
  major: { title: 'The 3 the crop eats most', lead: 'Nitrogen, phosphorus and potash. Most of what a grower spends goes here, and most of what goes wrong goes wrong here too: too much of 1, too little of the other 2.' },
  secondary: { title: 'The 3 it eats in the middle', lead: 'Calcium, magnesium and sulfur. A crop takes these in kilograms an acre, close to what it takes of phosphorus. They are the ones most often left out of a Pakistani programme.' },
  micro: { title: 'The 8 it eats in grams', lead: 'A pinch an acre, and the crop cannot finish without it. A field can be full of nitrogen and still stop at the zinc.' },
}

export const NUTRIENTS_17: NutrientEntry[] = [
  { key: 'C', symbol: 'C', name: 'Carbon', group: 'air', van: [], brief: 'From the air, through the leaf, as carbon dioxide. Every sugar, starch and fibre the crop makes is built on it.' },
  { key: 'H', symbol: 'H', name: 'Hydrogen', group: 'air', van: [], brief: 'From water, through the root. Carried in every sugar the leaf makes.' },
  { key: 'O', symbol: 'O', name: 'Oxygen', group: 'air', van: [], brief: 'From air and water. The root needs it to breathe, which is why a waterlogged field starves a crop that is standing in nutrients.' },

  {
    key: 'N', symbol: 'N', name: 'Nitrogen', urdu: 'نائٹروجن', group: 'major',
    job: 'Nitrogen builds protein and chlorophyll. It decides how much leaf the crop grows and how green the leaf is, and the leaf is the factory that makes the grain.',
    short: 'Older leaves turn pale yellow first, from the tip back, because the plant moves nitrogen out of old leaves into new ones. Plants stay small and thin. Grain has less protein.',
    partners: 'Nitrogen needs sulfur to become protein. A crop short of sulfur cannot use the nitrogen it is given, and the unused nitrogen leaves the field. Nitrogen also needs potash: nitrogen grows the leaf, potash moves the sugar out of it. Nitrogen without potash gives soft, tall growth that falls over.',
    pakistan: 'Nitrogen is the nutrient Pakistan applies most and keeps least. This site’s national pages set out where the applied nitrogen goes. Sulfur coated urea releases it over weeks, so more of it meets a root.',
    van: ['vital-urea', 'cala-mag-v', 'vl-npk'],
  },
  {
    key: 'P', symbol: 'P', name: 'Phosphorus', urdu: 'فاسفورس', group: 'major',
    job: 'Phosphorus carries energy inside the plant and builds the root. It decides how fast a seedling puts down roots, how many tillers wheat makes, and how well the crop sets and fills.',
    short: 'Slow, dark green seedlings, sometimes with a purple tint on the older leaves and stems. Fewer tillers, late flowering, small heads. Most of the damage is done in the first weeks and cannot be undone later.',
    partners: 'Phosphorus and zinc pull against each other. A heavy dose of phosphate on a soil already low in zinc makes the zinc shortage worse. Phosphorus needs calcium in the plant but is locked by calcium in the soil, which is the whole problem on Pakistani ground.',
    pakistan: '69.1% of 770,160 Punjab samples read above pH 8, and calcareous soil at that pH locks applied phosphate before the root reaches it. Read as elemental P, 35 of 36 districts land Critical or Weak. The Soil Atlas shows your district.',
    van: ['green-phosphate', 'v-phosphate', 'fusion-phosphate', 'v-germinator-pro'],
  },
  {
    key: 'K', symbol: 'K', name: 'Potash', urdu: 'پوٹاش', group: 'major',
    job: 'Potash runs the plant’s plumbing. It opens and closes the pores in the leaf, moves sugar from the leaf to the grain, tuber or fruit, and thickens the cell wall. It is the nutrient of quality, weight and stress: heat, drought and disease all hit a potash-short crop harder.',
    short: 'Older leaves scorch along the edge and the tip while the middle stays green. Stems are weak, the crop lodges, grain is light, fruit is small and stores badly.',
    partners: 'Potash works with nitrogen: nitrogen grows the leaf, potash fills the grain from it. Too much potash pushes out magnesium and calcium, so the 3 are dosed together, never 1 alone.',
    pakistan: 'The Crop Force bag prints the national figure: only 1% of all nutrient applied in Pakistan is potash. VAN’s wheat balance page shows what 60 maunds an acre takes off the field in potash when the bhusa is removed.',
    van: ['vital-potash', 'fusion-potash', 'v-potash-plus', 'sop', 'vl-potash-liquid'],
  },

  {
    key: 'Ca', symbol: 'Ca', name: 'Calcium', urdu: 'کیلشیم', group: 'secondary',
    job: 'Calcium is the cement of the cell wall and the tip of every growing point. It does not move inside the plant once it is placed, so the crop needs a steady supply while it grows, especially where fruit and tubers are forming.',
    short: 'The youngest tissue fails first: burnt tips on new leaves, blossom end rot on tomato, bitter pit on apple, hollow heart in potato. Old leaves look fine.',
    partners: 'Calcium and boron work together to build the wall, and boron is needed for calcium to move to the growing point. Too much potash or magnesium in the soil crowds calcium out at the root.',
    pakistan: 'Pakistani soil is full of calcium as lime. The plant can still run short, because calcium in lime and calcium the root can drink are 2 different things, and because a heavy potash dose blocks it.',
    van: ['cala-mag-v'],
  },
  {
    key: 'Mg', symbol: 'Mg', name: 'Magnesium', urdu: 'میگنیشیم', group: 'secondary',
    job: 'Magnesium sits at the centre of every chlorophyll molecule. No magnesium, no green, no sugar. It also helps the plant move phosphorus around.',
    short: 'Older leaves go yellow between the veins while the veins stay green, giving a striped or marbled look. Starts low on the plant and moves up.',
    partners: 'Magnesium is pushed out by too much potash and by too much calcium. A programme that raises potash without magnesium often shows magnesium shortage the same season.',
    van: ['v-mag-essential', 'cala-mag-v', 'v-potash-plus', 'fusion-potash'],
  },
  {
    key: 'S', symbol: 'S', name: 'Sulfur', urdu: 'سلفر', group: 'secondary',
    job: 'Sulfur is in 3 of the amino acids the plant builds protein from, and in the oils of canola, mustard and sesame. It is the nutrient that turns applied nitrogen into grain protein.',
    short: 'Young leaves go pale yellow all over, the opposite of nitrogen, which starts with the old leaves. Plants are thin and slow. Oilseeds give less oil.',
    partners: 'Sulfur and nitrogen work as a pair, and without the sulfur the extra nitrogen goes to waste. Elemental sulfur also acidifies the soil around a granule, which frees locked phosphate and zinc there.',
    pakistan: 'Sulfur is not a parameter on VAN’s soil report, so the Soil Atlas cannot show it. This site does not claim a national sulfur figure, because none exists on the public record.',
    van: ['green-sulfur', 'vital-urea', 'sop', 'fusion-potash'],
  },

  {
    key: 'Zn', symbol: 'Zn', name: 'Zinc', urdu: 'زنک', group: 'micro',
    job: 'Zinc makes the growth hormone that lengthens the stem and the enzymes that build protein. It decides plant height, leaf size and, in rice and wheat, grain set.',
    short: 'Young leaves come out small, narrow and yellow between the veins. Short internodes make the plant look bunched. In maize, a white band down the young leaf. In rice, brown spots on the older leaves in the nursery.',
    partners: 'Zinc and phosphorus pull against each other, so a soil low in zinc gets worse when phosphate is piled on. High pH locks zinc in the soil the same way it locks phosphate.',
    pakistan: 'The Soil Atlas fills zinc from the survey median district by district; several districts read Critical. Read yours before deciding.',
    van: ['v-transform', 'v-zinc', 'vl-micro-mix', 'v-phosphate'],
  },
  {
    key: 'B', symbol: 'B', name: 'Boron', urdu: 'بوران', group: 'micro',
    job: 'Boron builds the cell wall with calcium and carries sugar to the flower. It decides pollination, seed set and fruit set. A cotton boll, a sunflower head or a rice panicle that sets badly is often a boron story.',
    short: 'Growing points die, stems go hollow or cracked, flowers drop without setting, fruit is misshapen. Cauliflower gets a hollow brown stem; sugar beet a rotten heart.',
    partners: 'Boron and calcium work together at the growing point. The gap between enough boron and too much boron is narrow, which is why VAN puts it on the potash granule as a coating rather than as a loose dose.',
    pakistan: 'Boron reads low across much of the Punjab survey; the Soil Atlas shows the district figure and the band.',
    van: ['v-boron', 'vital-potash', 'fusion-potash', 'v-mag-essential', 'cala-mag-v'],
  },
  {
    key: 'Fe', symbol: 'Fe', name: 'Iron', urdu: 'آئرن', group: 'micro',
    job: 'Iron makes chlorophyll and runs the enzymes that move electrons. A leaf without iron cannot turn light into sugar.',
    short: 'The youngest leaves go yellow between the veins with the veins sharply green, then whole leaves go white. Old leaves stay green, which separates it from magnesium.',
    partners: 'Iron and manganese compete, and high pH locks both. Bicarbonate in irrigation water and lime in the soil are the usual cause on Pakistani ground, so the soil can be full of iron the root cannot drink.',
    pakistan: 'Iron is on VAN’s soil report and on the Soil Atlas. In 4 districts the survey figures are marked not comparable, and the Atlas says so rather than banding them.',
    van: ['vl-micro-mix', 'v-potash-plus', 'v-phosphate', 'v-germinator-pro'],
  },
  {
    key: 'Mn', symbol: 'Mn', name: 'Manganese', urdu: 'مینگنیز', group: 'micro',
    job: 'Manganese splits water inside the leaf so that photosynthesis can run, and it helps the plant use nitrogen. It also stiffens the plant against fungal disease.',
    short: 'Yellowing between the veins on young and middle leaves, with grey or brown speckles. In oats and wheat it shows as grey speck.',
    partners: 'Manganese is locked by high pH and by a dry, well aerated soil. Too much iron or a heavy lime dose makes it worse.',
    pakistan: 'Manganese is on VAN’s soil report and on the Soil Atlas.',
    van: ['vl-micro-mix'], // D-214: V. Ammonium Phosphate carries iron only
  },
  {
    key: 'Cu', symbol: 'Cu', name: 'Copper', urdu: 'تانبا', group: 'micro',
    job: 'Copper runs the enzymes that build lignin, the woody part of the stem, and it is needed for pollen to form. Cereals short of copper set empty heads.',
    short: 'Young leaves twist and wilt at the tip, heads emerge empty or half filled, stems are weak. Rare on most Pakistani soil.',
    partners: 'Copper is held tightly by organic matter, so peaty and heavily manured ground can run short while a mineral soil does not.',
    pakistan: 'Copper reads Healthy in every Punjab district where the survey figure is comparable (32 of 36; 4 are marked not comparable on the Soil Atlas). VAN checked its cutoff against the published literature and it holds. This site does not sell copper as a general shortage.',
    van: ['vl-micro-mix'], // D-214: V. Ammonium Phosphate carries iron only
  },
  { key: 'Cl', symbol: 'Cl', name: 'Chlorine', group: 'micro', van: [], brief: 'Needed in small amounts for the leaf pores and for water balance. Rain, irrigation water and muriate of potash supply it. VAN’s soil report does not test it and this site claims no shortage.' },
  { key: 'Mo', symbol: 'Mo', name: 'Molybdenum', group: 'micro', van: [], brief: 'Needed in the smallest amount of all, for the enzyme that turns nitrate into protein and for the bacteria that fix nitrogen in pulses. Unlike the other micronutrients it becomes more available as pH rises. VAN’s soil report does not test it and this site claims no shortage.' },
  { key: 'Ni', symbol: 'Ni', name: 'Nickel', group: 'micro', van: [], brief: 'The last nutrient added to the list, in 1987. A trace is needed for the enzyme that breaks down urea inside the plant. VAN’s soil report does not test it and this site claims no shortage.' },
]

export const NUTRIENTS_FULL = NUTRIENTS_17.filter(n => !n.brief)

/**
 * THE LAW OF THE MINIMUM, in the site's words. Justus von Liebig, a German chemist, set it out in the
 * 1840s: growth is limited by the scarcest nutrient, not by the total. The picture everyone
 * remembers came later and is usually credited to Carl Sprengel’s work and to Liebig’s followers:
 * a barrel made of staves of different heights holds water only up to the shortest stave.
 */
export const LIEBIG = {
  h2: 'The barrel, and why a field full of urea can still stop at the zinc.',
  lead: 'In the 1840s the German chemist Justus von Liebig set out the Law of the Minimum: a crop grows to the limit of the nutrient it has least of, measured against what it needs, and adding more of anything else does nothing. The picture that explains it is a wooden barrel. Each stave is 1 nutrient. Water fills the barrel only to the shortest stave, and pours out over it. A grower who adds another bag of urea is making a tall stave taller. The water still leaves at the short one.',
  how: 'Pick your crop and enter what you put on an acre this season. Each stave is drawn against what VAN’s published programme for that crop delivers per acre. The shortest stave is where your season leaks.',
}

/** The why strip on the home page (D-187): 4 questions a grower asks, each answered on a page of this site. */
export const WHY_QUESTIONS: { q: string; a: string; href: string }[] = [
  { q: 'Why does a field full of urea still stop growing?', a: 'Because the crop grows to its shortest nutrient, not its tallest. Fill the barrel.', href: '#/knowledge/nutrients#barrel' },
  { q: 'Why does the phosphate I apply never reach the root?', a: 'Because calcareous soil above pH 8 locks it first. 69.1% of Punjab samples read above pH 8.', href: '#/soil' },
  { q: 'Why is a bag not a dose?', a: 'Because how a nutrient is delivered decides how much of it the crop gets.', href: '#/knowledge/application-systems' },
  { q: 'Why does the plan change with my sowing date?', a: 'Because every stage moves with it, and the crop page reorders itself around your field.', href: '#/crops/wheat' },
]
