import { CROPS, PRODUCTS } from '@/data/catalogue'

/** M8, 24 Sep 2026: search words a reader types that the tool text does not contain. The placeholder
 *  suggests "potash" and it found nothing. Every product name is added to the tools that answer in
 *  products, plus the nutrient words and oxide spellings a lab report uses. */
const NUTRIENT_WORDS = 'potash potassium K2O K phosphorus phosphate P2O5 nitrogen N urea sulfur sulphur zinc boron fertilizer fertiliser'
const PRODUCT_WORDS = PRODUCTS.map(p => p.name).join(' ')
import { SOIL_HEADLINE } from '@/data/soilLens'
import { LIVE_CALC_CROPS } from '@/data/costPlans'
import { shortCropName } from '@/data/catalogue'

/** D-144: the crops with a live calculator, by the short name a farmer knows them by. */
const LIVE_CALC_NAMES = LIVE_CALC_CROPS.map(sl => shortCropName(CROPS.find(c => c.page.replace(/\.html$/, '') === sl)?.name ?? sl))

/**
 * THE TOOL INDEX — rewritten 10/11 September 2026.
 *
 * Tahir: "tool page is not really well drafted, what is live is at the bottom and what is coming is
 * up, and also the page is too dense to find a tool. We should research how such pages are designed
 * by industry who run such tools."
 *
 * What the industry does, looked at rather than guessed. Nutrien's eKonomics is the closest
 * comparable — a fertilizer company running a suite of free public calculators. Its index gives
 * each tool an icon, a title and a description of ten to fifteen words, in cards, with tag-based
 * filtering alongside. Not one of its tiles carries a paragraph. The general directory-page
 * guidance says the same thing from the other end: filter chips above the results, a live count so
 * a reader can predict what a filter will do, and one control that clears everything.
 *
 * VAN's page was doing the opposite. Twenty-three tools, each with a paragraph of four to six
 * lines, in two halves — the finished ones first, then a long roadmap. Reading it end to end is
 * about 1,900 words. Finding the one tool you came for meant reading most of them.
 *
 * So the data is split in two: ONE LINE that says what the tool answers, which is what a tile
 * carries, and the paragraph, which is the honest detail and now opens on request. Nothing was
 * deleted. Every word of the old page is still on this one; what changed is what you have to read
 * before you can choose.
 *
 * State is a filter rather than a position on the page. "Not built yet" is no longer a second half
 * below the fold — it is a switch, off by default, so the page opens on what actually works.
 */
export type ToolState = 'live' | 'pilot' | 'building'

export type Topic =
  | 'Rates and quantities' | 'Soil' | 'Water' | 'Timing' | 'What the harvest takes'
  | 'Verify a bag' | 'For the trade' | 'Units and packs' | 'Reading this site'

export type Tool = {
  name: string
  /** The one line a tile carries. What question this answers, in a farmer's words. */
  one: string
  /** The honest detail: what it really does, where it stops, and why. Opens on request. */
  what: string
  /** For 'building' only: the single thing that is missing. */
  needs?: string
  state: ToolState
  topics: Topic[]
  href?: string
  /** Extra search words, not shown on the page. */
  keywords?: string
}

export const TOOL_STATE_LABEL: Record<ToolState, string> = { live: 'Ready now', pilot: 'Pilot', building: 'Not built yet' }
export const TOOL_STATE_COLOUR: Record<ToolState, string> = { live: 'var(--green)', pilot: 'var(--gold-text)', building: 'var(--muted)' }
export const TOOL_STATE_NOTE: Record<ToolState, string> = {
  live: 'Finished, on every crop it claims.',
  pilot: 'Works, and is honest about which crops it cannot answer yet.',
  building: 'Not built. Each one says what it is waiting on.',
}

// D-177: 'For the trade' and 'Reading this site' had no tools left after the honest list, so their chips are gone.
export const TOPICS: Topic[] = [
  'Rates and quantities', 'Soil', 'Timing', 'Water', 'What the harvest takes',
  'Units and packs', 'Verify a bag',
]

/**
 * D-177, 26 Sep 2026 · Tahir: "tools need an agronomical review ... are really all of them tools ... are we
 * not trying to say more and doing less?" He approved the honest list. The review (saved beside the preview
 * as "Vitalytics tools review 26 Sep 2026") found 26 entries, of which 5 took the reader's own input and
 * gave back an answer for it. The rest were pages (Soil Atlas, lab prices, product table, formulation
 * library), a view switch (Plain mode), duplicates, upgrades of existing tools, a translation job, and a
 * "dealer locator" that already exists as Where to buy. Pages now sit on the Tools page as links, not tiles.
 * Also fixed with it: the wheat stage model now runs on degree days (lib/sowing.ts), so "where your crop is
 * now" is back as a pilot. Revert: the v58 source zip, src/data/tools.ts.
 */
export const TOOLS: Tool[] = [
  {
    name: 'Crop plan calculator',
    one: 'Pick your crop, tick the stages, set your acres: the bags and packs to buy.',
    state: 'live', href: '#/crops', topics: ['Rates and quantities'],
    keywords: `${NUTRIENT_WORDS} ${PRODUCT_WORDS} buy quantity calculator cost price acres shopping list ${LIVE_CALC_NAMES.join(' ')}`,
    what: `Any of the ${CROPS.length} published crop plans turns into bags and packs for your acres: the published rate multiplied by your acres, nothing estimated in between. On ${LIVE_CALC_CROPS.length} crops (${LIVE_CALC_NAMES.slice(0, -1).join(', ')} and ${LIVE_CALC_NAMES[LIVE_CALC_NAMES.length - 1]}) it reads VAN's own calculator sheet for that crop and can price the VAN products in it. Acres are whole numbers from 1 to 50.`,
  },
  {
    // D-186, 26 Sep 2026: the Liebig barrel on the nutrients page.
    name: 'The nutrient barrel',
    one: 'Enter what you put on 1 acre and see which nutrient your season stops at.',
    state: 'live', href: '#/knowledge/nutrients#barrel', topics: ['Rates and quantities', 'Soil'],
    keywords: `${NUTRIENT_WORDS} ${PRODUCT_WORDS} liebig law of the minimum barrel drum shortest stave balance urea dap`,
    what: `Liebig’s Law of the Minimum as a tool. Pick your crop, type the bags and packs you applied per acre, and each nutrient is drawn as a stave against what VAN’s published programme delivers. The shortest stave is where the season leaks. For wheat and potato it also says how much of the quarter of yield that nutrition decides your mix reaches, as a model estimate.`,
  },
  {
    name: 'Unit and bag converter',
    one: 'Acres to kanal, maunds to kilograms, and the nutrient inside any VAN pack.',
    state: 'live', href: '#tools-converter', topics: ['Units and packs'],
    keywords: `${NUTRIENT_WORDS} ${PRODUCT_WORDS} kg litre hectare kanal marla maund bag`,
    what: `Acres, kanal, marla and hectares; maunds, kilograms and tonnes; and the kilograms of each nutrient inside a pack of any VAN product, read from its registered analysis.`,
  },
  {
    name: 'Soil adjustment',
    one: 'Your soil reading or your district moves the plan’s quantities.',
    state: 'pilot', href: '#/crops/wheat#creator', topics: ['Soil', 'Rates and quantities'],
    keywords: `${NUTRIENT_WORDS} soil test report district`,
    what: `Inside the crop plan calculator. Choose the band your soil report shows for each reading, or pick your Punjab district and it fills from the survey median across ${SOIL_HEADLINE.samples} samples. Where the soil reads short, the plan adds product. This is VAN’s starting model and has not yet been checked against field results; it adds and never subtracts.`,
  },
  {
    name: 'Nutrient balance',
    one: 'What the plan puts on, against what your harvest takes off.',
    state: 'pilot', href: '#/crops/wheat#balance', topics: ['What the harvest takes'],
    what: 'Enter the yield you expect. You see the kilograms of N, P₂O₅ and K₂O per acre the plan puts on, against what that harvest takes off. The removal side uses IPNI’s North American table, named on the page, because no Pakistani removal table is published. 10 crops have a removal figure; the others say why they do not.',
  },
  {
    name: 'Crop water need',
    one: 'How much water the season needs in your district, and how much rain normally comes.',
    state: 'pilot', href: '#/crops/cotton#water', topics: ['Water'],
    what: 'Choose your Punjab district. You see the season’s crop water need, normal rainfall and the gap in acre-inches and waterings, by FAO Paper 56 on Pakistan Meteorological Department normals. It uses the temperature-only method and assumes all normal rain stays in the field, so the answer is probably low. The rice figure leaves out puddling and percolation losses. Punjab districts only.',
  },
  {
    name: 'Farm discipline simulator',
    one: 'Rate 10 farm practices and see where the yield is going. Wheat and potato.',
    state: 'pilot', href: '#/simulator/wheat', topics: ['Timing'],
    what: 'Rate how your season was farmed on 10 practices, from sowing and seed to water, weeds and pests, as Bad, OK or Best. You see an estimated yield and the practices costing you most. The weights are VAN’s starting model, not trial results. Wheat and potato each have their own 10 practices.',
  },
  {
    name: 'Where your crop is now',
    one: 'Give your sowing date; see your wheat’s stage and what is due at it.',
    state: 'pilot', href: '#/crops/wheat#sown', topics: ['Timing'],
    what: 'Enter the date you sowed. For wheat, the stage is worked out in degree days from your own sowing date, on Lahore’s normal temperatures, and the rows of the published plan due at that stage are listed. A normal season, not this year’s weather. On the other crops it gives the day count only.',
  },

  // ── Coming. Each says what it is waiting on. ──
  {
    name: 'Batch check',
    one: 'Type the batch number on a VAN bag and see that batch’s test results.',
    state: 'building', href: '#/verify', topics: ['Verify a bag'],
    what: 'Type the batch number printed on a VAN bag and see the test results recorded for that batch. Until the live check is connected, send the number on WhatsApp and the certificate comes back the same day. For any other brand, book a test through Sample Reception.',
    needs: 'The connection to the plant’s released-batch records (O2S).',
  },
  {
    name: 'Cane yield assessment',
    one: 'Count the canes in a measured area and get an estimated yield per acre.',
    state: 'building', topics: ['What the harvest takes'],
    what: 'Count what is standing in a measured area and read the yield off the count: a measurement of the crop that exists, against the simulator’s estimate of how the season was farmed.',
    needs: 'A cane weight model from girth and length. VAN’s own sheets apply a flat weight to every cane, and the two sheets disagree on it by a third.',
  },
]

/** Pages that answer a question but are not tools: the reader does not put in a figure of his own. */
export const TOOL_PAGES: [string, string, string][] = [
  ['Soil Atlas', `Punjab’s soil, district by district, from ${SOIL_HEADLINE.samples} samples.`, '#/soil'],
  ['Compare products', 'Every VAN analysis, pack and method in one table.', '#/products#table'],
  ['Lab tests and prices', 'All 21 fertilizer tests, what each costs and how long it takes.', '#/lab#prices'],
  ['Formulation library', '27 unbranded formulations you could launch under your own name.', '#/partner#library'],
  ['Where to buy', 'Every VAN dealer and Vital Agri Center, with the person who answers.', '#/where-to-buy'],
]
