// D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction
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
  | 'Rates and quantities' | 'Soil' | 'Water' | 'Timing' | 'Nutrients taken out in the harvested crop'
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

export const TOOL_STATE_LABEL: Record<ToolState, string> = { live: 'Finished', pilot: 'Pilot', building: 'Being built' }
export const TOOL_STATE_COLOUR: Record<ToolState, string> = { live: 'var(--green)', pilot: 'var(--gold-text)', building: 'var(--muted)' }
export const TOOL_STATE_NOTE: Record<ToolState, string> = {
  live: '',
  pilot: 'Works, but does not yet cover every crop.',
  building: 'Not built yet.',
}

// D-177: 'For the trade' and 'Reading this site' had no tools left after the honest list, so their chips are gone.
export const TOPICS: Topic[] = [
  'Rates and quantities', 'Soil', 'Timing', 'Water', 'Nutrients taken out in the harvested crop',
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
    one: 'Choose your crop, tick the stages and enter your acres to see the bags and packs to buy.',
    state: 'live', href: '#/crops', topics: ['Rates and quantities'],
    keywords: `${NUTRIENT_WORDS} ${PRODUCT_WORDS} buy quantity calculator cost price acres shopping list ${LIVE_CALC_NAMES.join(' ')}`,
    what: `The calculator turns any of the ${CROPS.length} published crop plans into bags and packs for your acres, by multiplying the published quantity per acre by your acres. On ${LIVE_CALC_CROPS.length} crops (${LIVE_CALC_NAMES.slice(0, -1).join(', ')} and ${LIVE_CALC_NAMES[LIVE_CALC_NAMES.length - 1]}) it uses the Nutrition creator for that crop and can price the VAN products in it. Acres are whole numbers from 1 to 50.`,
  },
  {
    // D-186, 26 Sep 2026: the Liebig barrel on the nutrients page.
    // Tahir 7 Nov 2026 (CR-1): last sentence deleted with the barrel's maunds estimate. Was "For wheat and potato, the tool also gives a model estimate of how much of the yield share that nutrition decides (about 1/4) your mix achieves."
    name: 'The nutrient barrel',
    one: 'Enter what you applied to 1 acre and see which nutrient limits your crop.',
    state: 'live', href: '#/knowledge/nutrients#barrel', topics: ['Rates and quantities', 'Soil'],
    keywords: `${NUTRIENT_WORDS} ${PRODUCT_WORDS} liebig law of the minimum barrel drum shortest stave balance urea dap`,
    what: `This tool applies Liebig’s Law of the Minimum. Choose your crop and type the bags and packs you applied per acre. Each nutrient is drawn as a stave, measured against what VAN’s published programme supplies. The shortest stave shows the nutrient that limits the crop.`,
  },
  {
    name: 'Unit and bag converter',
    one: 'Converts acres to kanal and maunds to kilograms, and shows the kilograms of each nutrient in any VAN pack.',
    state: 'live', href: '#tools-converter', topics: ['Units and packs'],
    keywords: `${NUTRIENT_WORDS} ${PRODUCT_WORDS} kg litre hectare kanal marla maund bag`,
    what: `The converter handles acres, kanal, marla and hectares; maunds, kilograms and tonnes; and the kilograms of each nutrient in a pack of any VAN product, read from its declared analysis.`,
  },
  {
    name: 'Soil adjustment',
    one: 'Enter your soil test reading, or choose your district if you have no test, and the tool adjusts the quantities in your crop plan.',
    state: 'pilot', href: '#/crops/wheat#creator', topics: ['Soil', 'Rates and quantities'],
    keywords: `${NUTRIENT_WORDS} soil test report district`,
    what: `This works inside the Nutrition creator. Choose the band that your soil report shows for each reading, or choose your Punjab district to use the survey median of its share of the ${SOIL_HEADLINE.samples} samples. Where the soil reading is low, the plan adds product; where phosphorus, potash or zinc reads Healthy, the plan reduces that product by 1/4. Nitrogen is never reduced. This is VAN’s starting model and has not yet been checked against field results.`,
    // D-317: was "...field results; it adds and never subtracts." The calculator also takes 1/4 off on a Healthy P, K or Zn reading (lib/soilAdjustment.ts, D-181).
  },
  {
    name: 'Nutrient balance',
    one: 'Compares the nutrients applied under your crop plan with the nutrients taken out in the harvested crop.',
    state: 'pilot', href: '#/crops/wheat#balance', topics: ['Nutrients taken out in the harvested crop'],
    what: 'Enter the yield you expect. The tool shows the kilograms of N, P₂O₅ and K₂O per acre applied under the plan, against the amount taken out in the harvested crop. The removal figures come from IPNI’s North American table, because no Pakistani removal table is published. 10 crops have removal figures.',
  },
  {
    name: 'Crop water needs',
    one: 'Shows how much water your crop needs over the season in your district, and how much rain normally falls there.',
    state: 'pilot', href: '#/crops/cotton#water', topics: ['Water'],
    what: 'Choose your Punjab district. The tool shows the crop’s water need for the season, the normal rainfall, and the water still needed from irrigation, in acre-inches and in waterings. It follows FAO Paper 56, using Pakistan Meteorological Department climate normals. It uses the temperature-only method and assumes that all normal rain stays in the field, so the irrigation figure is probably too low. The rice figure leaves out losses from puddling and percolation. It covers Punjab districts only.',
  },
  {
    name: 'Farm discipline simulator',
    one: 'Score how well you follow 10 farm practices for wheat or potato, and see which gaps in your practice lower your yield.',
    state: 'pilot', href: '#/simulator/wheat', topics: ['Timing'],
    what: 'Score 10 practices from your season, from sowing and seed to water, weeds and pests, as Bad, OK or Best. The simulator gives an estimated yield and shows the practices that cost you most. The weights are VAN’s starting model, not trial results. Wheat and potato have working simulators, each with its own 10 practices. Simulators for the other 26 crops are planned.',   // Tahir 7 Nov 2026 (CO-11)
  },
  {
    name: 'Where your crop is now',
    one: 'For wheat: enter your sowing date to see the crop’s growth stage and the applications in your crop plan that are due at that stage.',
    state: 'pilot', href: '#/crops/wheat#sown', topics: ['Timing'],
    what: 'Enter the date you sowed. For wheat, the growth stage is calculated in degree days from your sowing date, using Lahore’s normal temperatures, and the applications in the crop plan that are due at that stage are listed. The calculation assumes a normal season, not this year’s weather. For the other crops it gives the number of days since sowing only.',
  },

  // ── Coming. Each says what it is waiting on. ──
  {
    name: 'Batch check',
    one: 'Type the batch number on a VAN bag and open that batch’s lab report.',
    state: 'building', href: '#/verify', topics: ['Verify a bag'],
    what: 'Type the batch number printed on a VAN bag to open the approved lab report for that batch. If the online check does not respond, send the number on WhatsApp and the report is sent back the same day. For any other brand, book a test through Sample Reception.',
    needs: 'The connection to the plant’s released-batch records (O2S).',
  },
  {
    name: 'Cane yield assessment',
    one: 'Count the canes in a measured area and get an estimated yield per acre.',
    state: 'building', topics: ['Nutrients taken out in the harvested crop'],
    what: 'Count the canes standing in a measured area and read an estimated yield from the count. This measures the crop in the field, whereas the simulator estimates yield from how the season was farmed.',
    needs: 'A cane weight model from girth and length.',
  },
]

/** Pages that answer a question but are not tools: the reader does not put in a figure of his own. */
export const TOOL_PAGES: [string, string, string][] = [
  ['Soil Atlas', `Punjab’s soil, district by district, from ${SOIL_HEADLINE.samples} samples tested in about 2016 to 2018.`, '#/soil'],
  ['Compare products', 'Every VAN analysis, pack size and application method in 1 table.', '#/products#table'],
  ['Lab tests and prices', 'All 21 fertiliser tests, with the price and turnaround time of each.', '#/lab#prices'],
  ['Formulation library', '27 unbranded formulations you could launch under your own name.', '#/partner#library'],
  ['Where to buy', 'Every VAN dealer and Vital Agri Center, with the name of the person to contact.', '#/where-to-buy'],
]
