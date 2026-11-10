import { useState } from 'react'
import { usePhonePlainDefault } from '@/lib/phonePlain'
import { CROPS, PRODUCTS, CROP_PLANS, shortCropName } from '@/data/catalogue'
import { WA, CONTACT } from '@/data/site'
import { cropBySlug, cropSlug, cropPdf, cropLms, sowingLabel, GROUP_COLOUR, GROUP_TEXT, parseSowing, MONTHS_LONG, seasonWords } from '@/lib/season'
import { SeasonRing } from '@/components/SeasonRing'
import { MethodsStrip } from '@/components/MethodsStrip'
import { PlanMatrix } from '@/components/PlanMatrix'
import { NutritionCreator } from '@/components/NutritionCreator'
import { hasCalculator, calculatorSource } from '@/data/costPlans'   // Tahir 9 Nov 2026: calculatorSource added
import { planUpdateNote } from '@/data/planNotes'
import { rangeEndsSentence } from '@/lib/planRange'   // L1 10 Nov 2026 (crops 4)
import { ListBuilder } from '@/components/ListBuilder'
import { hasSoilLayer, mappedParametersForCrop } from '@/lib/cropSoilMap'
import { SOIL_PARAMETER_LABEL, soilParameterInline, type SoilParameter } from '@/data/soilThresholds'
import { SectionHead, WaButton, PackShot, LiveCalcTag } from '@/components/bits'
import { VanForm } from '@/components/VanForm'
import { FARMER_FORM } from '@/data/formSpecs'
import { SowingDate } from '@/components/SowingDate'
import { NutrientBalance } from '@/components/NutrientBalance'
import { WaterRequirement } from '@/components/WaterRequirement'
import { CropNow } from '@/components/CropNow'
// import { StandingCrop } from '@/components/StandingCrop'  // block 06, removed 11 Sep 2026 — see below
import { Detail } from '@/components/Detail'
import { Ur } from '@/components/Ur'
import Wheat from './Wheat'

const UREA_ROWS: [string, string, string, string][] = [
  ['Garlic', 'Land preparation', '1 bag (25 kg)', 'Drill at sowing; broadcast if no drill'],
  ['Garlic', 'Germination', '1 bag (25 kg)', 'Broadcast'],
  // L1 7 Nov 2026 (crops-b m6): "Side dressing / broadcasting" written "Side dressing or broadcasting", as on the Vital Urea page.
  ['Sesame', 'Germination', '1 bag (25 kg)', 'Side dressing or broadcasting'],
  ['Sesame', 'Early growth', '½ bag (12.5 kg)', 'Side dressing or broadcasting'],
  ['Soybean', 'Land preparation', '½ bag (12.5 kg)', 'Drill at sowing; broadcast if no drill'],
  ['Lentil', 'Land preparation', '½ bag (12.5 kg)', 'Drill at sowing; broadcast if no drill'],
  ['Mungbean & Mash', 'Land preparation', '½ bag (12.5 kg)', 'Drill at sowing; broadcast if no drill'],
  ['Canola', 'Land preparation', '1 bag (25 kg)', 'Drill at sowing; broadcast if no drill'],
]
/** The crops with their own lever set. Wheat and potato today — see Tools, "the other 26 crops". */
const SIMULATOR_CROPS = ['wheat', 'potato']
/**
 * A yield to open the balance on, where the site already carries one it can defend. Wheat's 60
 * maunds and potato's 300 are the discipline simulator's own ceilings, both confirmed by Tahir.
 * Every other crop opens blank rather than on a guess — the farmer's own expectation is the only
 * figure this page is entitled to use.
 */
// D-177: 686.25 was the slipped digit Tahir corrected to 300 on 10 Sep (leverScorecard.ts). This default was missed.
const DEFAULT_YIELD: Record<string, number> = { potato: 300 }
const NUTRIENT_CAT: Record<string, string[]> = { N: ['N'], P: ['P'], K: ['K'], S: ['SEC'], Multi: ['MICRO', 'SEC'] }

// Tahir 7 Nov 2026 (CR-21): the crop tag "Main nutrients: phosphorus and potassium" read as a sentence for the
// brands lead: "phosphorus (P) and potassium (K)".
const NUTRIENT_SYMBOL: Record<string, string> = { nitrogen: 'N', phosphorus: 'P', potassium: 'K', sulfur: 'S', zinc: 'Zn', boron: 'B', magnesium: 'Mg', calcium: 'Ca', iron: 'Fe' }
function emphasis(tag: string) {
  return tag.replace(/^Main nutrients:\s*/, '').replace(/\b(nitrogen|phosphorus|potassium|sulfur|zinc|boron|magnesium|calcium|iron)\b/g, w => `${w} (${NUTRIENT_SYMBOL[w]})`)
}
/** L1 7 Nov 2026 (crops-a 8): the product group each emphasised nutrient's brands sit in (catalogue `cat`). Where none
 *  of the plan's main nutrients is in the group the brands section shows (chili, mungbean and mash), the lead no longer
 *  links the 2 sentences as if the section showed the brands for those nutrients. */
const NUTRIENT_GROUP: Record<string, string> = { nitrogen: 'N', phosphorus: 'P', potassium: 'K', sulfur: 'SEC', magnesium: 'SEC', calcium: 'SEC', zinc: 'MICRO', boron: 'MICRO', iron: 'MICRO' }
function emphasisInGroups(tag: string, cats: string[]) {
  const words = tag.match(/\b(nitrogen|phosphorus|potassium|sulfur|zinc|boron|magnesium|calcium|iron)\b/g) ?? []
  return words.length === 0 || words.some(w => cats.includes(NUTRIENT_GROUP[w]))
}

export default function CropPage({ slug, district = null, card = null }: { slug: string; district?: string | null; card?: string | null }) {
  const [askOpen, setAskOpen] = useState(false)
  usePhonePlainDefault()   // D-199
  if (slug === 'wheat') return <Wheat district={district} card={card} />
  const c = cropBySlug(slug)
  if (!c) {
    return (
      <div className="wrap py-16 text-center">
        <h1>No crop by that name</h1>
        <p className="lead mx-auto mt-4">Pick one of the {CROPS.length} crop plans.</p>
        <a className="btn btn-gold mt-6" href="#/crops">All crop plans →</a>
      </div>
    )
  }
  const pdf = cropPdf(c)
  const lms = cropLms(c)
  const col = GROUP_COLOUR[c.group]
  const urea = UREA_ROWS.filter(r => r[0].toLowerCase() === c.name.toLowerCase())
  const cats = NUTRIENT_CAT[c.nutrient] ?? []
  const browse = PRODUCTS.filter(p => !p.family && cats.includes(p.cat))
  const win = parseSowing(c.sowing)
  const others = CROPS.filter(x => x.group === c.group && x.name !== c.name)
  const cp = CROP_PLANS[cropSlug(c)]
  const soilParams = mappedParametersForCrop(slug)
  const ALL_SOIL: SoilParameter[] = ['P2O', 'K2O', 'Zn', 'B', 'Fe', 'Cu', 'Mn', 'OM', 'pH', 'EC']
  const unanswered = ALL_SOIL.filter(p => !soilParams.includes(p))
  // D-144: a crop with a live calculator (potato and the team's crops) gets the creator, with the
  // soil panel inside it, the way potato always had. Revert: `slug === 'potato'` in the 4 places below.
  const calc = hasCalculator(slug)
  // Copy point, 6 Nov 2026: "&" is written "and" in running sentences ("the mungbean and mash plan"); names and titles keep it.
  const cropLower = shortCropName(c.name).toLowerCase().replace(/ & /g, ' and ')
  const sw = seasonWords(slug)
  // 6 Nov 2026: orchard plans that name no sowing and no drilling (citrus, mango, guava, date palm) get method texts without them.
  const orchardMethods = sw.kind !== 'sow' && !!cp && !cp.plan.some(r => /drill|sowing/i.test(r.method))
  const perPlant = !!cp && cp.plan.some(r => r.basis === 'plant')
  return (
    <div>
      <section style={{ background: `linear-gradient(180deg, ${col}22, var(--sand))` }}>
        <div className="wrap py-8 lg:py-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div>
            <p className="cap"><a href="#/crops">Crop Plans</a> / {c.groupLabel} / {c.name}</p>
            <span className="eyebrow mt-2" style={{ color: GROUP_TEXT[c.group] ?? col }}>{perPlant ? 'Crop plan · per plant and per acre' : 'Crop plan · per acre'}</span>
            <h1><Ur kind="crop" en={c.name} /></h1>
            <div className="flex flex-wrap gap-2 mt-4"><span className="tag tag-sky">{`${sowingLabel(c)} ${sw.tag}`}</span><span className="tag tag-green">{c.programme}</span>{calc && <LiveCalcTag />}</div>
            {/* D-144: calculator crops say where their 2 sets of figures come from, as the wheat page does (M3). */}
            {/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */}
            <p className="lead mt-4">{cp && calc ? `The full plan is below and in the PDF. For each product, the plan gives the rate, the crop stage at which the product is applied, the application method and the pack size. Further down the page, a calculator called the Nutrition creator adjusts the quantities to your acres and your soil test.` : cp && planUpdateNote(slug) ? `The full plan is below and in the PDF. For each product, the plan gives the rate, the crop stage at which the product is applied, the application method and the pack size. ${planUpdateNote(slug)}` : cp ? 'The full plan is below and in the PDF. For each product, the plan gives the rate, the crop stage at which the product is applied, the application method and the pack size.' : 'The full plan is in the PDF. For each product, the plan gives the rate, the crop stage at which the product is applied, the application method and the pack size.'}</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a className="btn btn-gold btn-lg" href={pdf} target="_blank" rel="noopener">Download the PDF plan for {c.name} ↓</a>
              {/* Was a second "ask for my plan" WhatsApp button carrying the identical message to
                  the one at the foot of this page. Replaced with the thing the reader actually came
                  for; the WhatsApp offer is made once, at the end, where it belongs. */}
              <a className="btn btn-ghost btn-lg" href="#list">What to buy for my acres →</a>
              {calc && <a className="btn btn-ghost btn-lg" href="#creator">Open the Nutrition creator ↓</a>}
            </div>
            {/* D-133: crop training deck, only where data/cropLms.ts has an entry for this crop. */}
            {lms && <div className="mt-3"><a className="btn btn-ghost btn-sm" href={lms.href} target="_blank" rel="noopener">⬇ {lms.label}</a></div>}
          </div>
          <div className="panel p-4">
            <div className="flex items-baseline justify-between gap-3 mb-1"><div className="display text-[20px]">{sw.windowTitle}</div><div className="cap">{/* L1 7 Nov 2026 (crops-a 20): "October to November", was "October – November" */}{win.map(w => `${MONTHS_LONG[w.start]}${w.end !== w.start ? ' to ' + MONTHS_LONG[w.end] : ''}`).join(' / ')}</div></div>
            <SeasonRing size={380} selected={cropSlug(c)} className="mx-auto" />
          </div>
        </div>
      </section>

      {/* 01 + 02. One input, and what it makes true today. Both additive: with no date answered
          block 02 renders nothing and the page is the page it was before. */}
      <section className="wrap sec-tight">
        <SowingDate cropKey={slug} cropName={cropLower} />
        <div className="mt-4"><CropNow cropKey={slug} cropName={cropLower} /></div>
      </section>

      {/* O-3, 9 Sep 2026 (Tahir): "simple view and full view is same. we should make simple view bit
          compact and keep full view as standard." He then named exactly what folds: the full
          stage-by-stage table, and the water block. Both are here.
          The matrix is the right thing to fold. It is seven bands across five stages, the densest
          object on the page, and a farmer in simple view wants the shopping list below it, not the
          grid. It folds to one line and opens on a tap. Nothing is removed from either view. */}
      {cp && (
        <section className="wrap sec" id="programme">
          {/* Lead 10 Nov 2026 (plan PDF editor note): "per plant" is named only on a plan that has a per-plant row. Was named on every crop. */}
          {/* L2 fact check 9 Nov 2026 (crops-a W9): on a plan with rows per 200 L of spray water (citrus), the lead names them too. Was "Rates are per acre unless a row says “per plant”." on every crop. */}
          <SectionHead eyebrow="The whole plan at a glance" title={`The ${cropLower} plan by nutrient group and crop stage.`} lead={`Rates are per acre${(() => { const w = [cp.plan.some(r => r.basis === 'plant') && '“per plant”', cp.plan.some(r => r.basis === 'per200L') && '“per 200 L water”'].filter(Boolean); return w.length ? ` unless a row says ${w.join(' or ')}` : '' })()}. Each rate names the size of its bag or pack, in kg or litres: “½ of a 25 kg bag” is 12.5 kg. Products named in grey are commodity inputs that VAN does not make.`} />{/* L1 10 Nov 2026 (crops 2): the rows print the rate and the pack size as 1 phrase. Was "The figure after each rate is the size of 1 full bag or pack, in kg or litres: “½ bag · 25 kg” means ½ of a 25 kg bag." */}
          <Detail bare label={`The full table: every nutrient group at each of the ${cp.stages.length} stages`}>
            <PlanMatrix stages={cp.stages} plan={cp.plan} />
          </Detail>
        </section>
      )}

      {cp && (
        <section className="wrap sec" id="list">
          <SectionHead
            eyebrow="Your shopping list"
            title={`What to buy for your acres.`}
            tone="navy"
            lead={cp.mode === 'age'
              ? `Choose your orchard’s age band and enter the number of acres. The list below then shows how many bags you need for that age band and those acres. The plan gives a separate rate for each age band, because a palm needs more nutrients as it matures. Choose only the band your orchard is in; the bands are not added together.`
              : `Tick the crop stages at which you plan to apply fertiliser and enter the number of acres. The list below then shows how many bags and packs you need to follow the ${cropLower} plan on those acres.${planUpdateNote(slug) ? ' ' + planUpdateNote(slug) : ''}`} />
          <ListBuilder stages={cp.stages} plan={cp.plan} cropName={cropLower} pdfPath={c.pdf} mode={cp.mode} cropKey={slug} soil={!calc && hasSoilLayer(slug)} published={calc} />
        </section>
      )}

      {calc && (
        <section className="wrap sec-tight" id="creator">
          <SectionHead eyebrow="Nutrition creator" title="Adjust the plan to your acres and your soil test." lead="The Nutrition creator scales the plan to the number of acres you set and adjusts it to your soil test readings. If you have no soil test, choose your district: the readings are then filled in with that district’s median values from the Punjab soil survey, taken about 2016 to 2018. These are typical values for the district, not readings from your own field." tone="navy" />
          <p className="small mb-3 max-w-[140ch]"><b>This page has 2 lists.</b> The shopping list above follows VAN’s published plan. The list below comes from the Nutrition creator, which adjusts the quantities to your soil report or, if you have none, to your district’s median readings. Both lists use the same number of acres; changing it in either list changes both. {calculatorSource(slug) === 'team' ? 'Before you enter soil readings, the 2 lists are the same. The Nutrition creator list changes when you enter your soil readings or choose your district.' : `The 2 lists do not contain exactly the same products. ${rangeEndsSentence(slug) || 'Where a total below is a range, the 2 figures are the totals of the 2 lists.'} If you have no soil report, follow the published crop plan. The Nutrition creator list is meant for a field with a soil report; without one, it uses your district’s median readings.`}</p>{/* L1 10 Nov 2026 (crops 4): each end of a range is named, from the same figures the ranges are printed from (planRange.ts); was "Where a total below is a range, the 2 figures are the totals of the 2 lists." (crops 11): 1 name for the soil report; was "Without a soil test, follow the published crop plan; the creator list is for a field with a soil report." No fact changed. */}{/* Tahir 10 Nov 2026 (CR-N11): last sentence added (potato; the only crop on this branch). */}{/* Tahir 9 Nov 2026 (L2 crops-a W2, his answer (b) to Q1): on the 22 team-calculator crops the 2 lists carry the same products, packs and rates (__teamcalccheck), so the CR-20 sentences are replaced there; wheat and potato, where the lists differ, keep them. */}{/* Tahir 7 Nov 2026 (CR-20): was "The 2 lists do not contain exactly the same products, so where their nutrient totals differ, the totals below are shown as a range." The reason the lists differ is still to come from Tahir. */}{/* D-151 (A12): was "This is the same programme from VAN’s calculator; use it if you have a soil report." */}
          <NutritionCreator crop={slug} cropName={cropLower} initialDistrict={district} />
        </section>
      )}

      {/* The soil layer reached all 28 programmes on 9 Sep 2026. What each crop can answer still
          differs, and it differs for a reason a farmer can check: a parameter is offered only where
          this crop's own plan contains a product that carries that nutrient. So this panel says what
          THIS crop can do, and names what it cannot. */}
      {!calc && (
        <section className="wrap sec-tight">
          <div className="panel p-5 lg:p-6">
            <span className="eyebrow green">Soil adjustment on this crop</span>
            <h3 className="mt-1">The list above can be adjusted to your soil test</h3>
            {/* L1 7 Nov 2026 (crops-a 30): "filled in with that district’s median values", as in the shared lead. Was "filled with that district’s median". */}
            <p className="muted mt-2 max-w-[140ch]">
              Enter your soil test readings in the soil panel of the list above. If you have no soil
              test, choose your district: the readings are then filled in with that district’s median values from
              the Punjab soil survey of 770,160 samples, taken about 2016 to 2018. The quantities then
              change to match those readings. On {cropLower}, the list uses{' '}
              <b>{soilParams.length} readings</b>: {soilParams.map(p => SOIL_PARAMETER_LABEL[p]).join(', ')}.
            </p>
            {unanswered.length > 0 && (
              <p className="cap mt-2 max-w-[140ch]">
                Not used on this crop: {unanswered.map(p => soilParameterInline(p)).join(', ')}. The
                soil adjustment for {cropLower} does not change the list for{' '}
                {unanswered.length > 1 ? 'these readings' : 'this reading'}.
              </p>
            )}
            <div className="flex flex-wrap gap-3 mt-4">
              <a className="btn btn-sm" href="#list">Open the list →</a>
              <a className="btn btn-sm btn-ghost" href="#/soil">Soil Atlas →</a>
            </div>
          </div>
        </section>
      )}

      {/* 05b. What the plan puts back against what the harvest takes. */}
      {cp && (
        <section className="wrap sec-tight">
          <NutrientBalance cropKey={slug} cropName={cropLower} defaultYieldMaunds={DEFAULT_YIELD[slug]} />
        </section>
      )}

      {/* 05c. Water. A nutrition plan assumes the water arrived; in Pakistan that is the
          assumption that fails most often, so it sits with the plan rather than after it. */}
      <section className="wrap sec-tight">
        <Detail bare label="Water use and irrigation for this crop">
          <WaterRequirement cropKey={slug} cropName={cropLower} />
        </Detail>
      </section>

      {/* 06. REMOVED from the crop pages by Tahir's ruling, 11 Sep 2026 (D-xx). The yield assessment
          is still coming and is still blocked on the cane weight model, but that belongs on the
          tools roadmap, not eleven times over on a farmer's crop page. StandingCrop.tsx is kept
          intact: restoring the block is uncommenting these three lines and the import above. */}

      {/* 07. Reflective rather than urgent, so it sits below what a farmer acts on today. The
          simulator exists for wheat and potato only: each crop's ten levers and their weights are
          that crop's agronomy, not machinery to be relabelled. Where it does not exist the page
          says so and points at the list of what is being built. */}
      <section className="wrap sec-tight">
        {/* Tahir 7 Nov 2026 (CR-1): the '1/4 of the yield' sentence is replaced by the timing text in both branches below. */}
        {/* L1 7 Nov 2026 (crops-a 7, crops-b M1): 1 name for the tool. Was "The VAN simulator shows ... The farm discipline simulator scores ...". */}
        {SIMULATOR_CROPS.includes(slug) ? (
          <div className="panel-navy p-6 lg:p-10 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <span className="eyebrow" style={{ color: 'var(--gold)' }}>Farm discipline simulator</span>
              <h2 className="text-[clamp(28px,2.8vw,38px)]">Check which farm practices are lowering your yield</h2>
              <p className="mt-3" style={{ color: 'rgba(255,255,255,.8)' }}>The sections above cover nutrition and water. Yield depends on doing every task on time: sowing date, seed and plant population, fertiliser at the right stage, irrigation on schedule, and control of weeds, pests and disease. Crop nutrition is 1 of these tasks. A task missed at its time can cost yield that extra work later may not recover. VAN’s farm discipline simulator shows how each task, and its timing, changes the yield. It scores how the whole season is managed, including sowing time, seed, irrigation and disease, and shows which practices are lowering the yield.</p>
            </div>
            <a className="btn btn-gold btn-lg" href={`#/simulator/${slug}`}>Open the simulator →</a>
          </div>
        ) : (
          <p className="small max-w-[140ch]">
            {/* Tahir 7 Nov 2026 (CR-1): was "In VAN’s model estimate for wheat, nutrition accounts for about 1/4 of the yield, and sowing, seed, water, weeds and pests account for the rest." */}
            Yield depends on doing every task on time: sowing date, seed and plant population,
            fertiliser at the right stage, irrigation on schedule, and control of weeds, pests and
            disease. Crop nutrition is 1 of these tasks. A task missed at its time can cost yield that
            extra work later may not recover. VAN’s farm discipline simulator shows how each task, and
            its timing, changes the yield. It
            scores 10 farm practices for a whole season, each with its own weight in the score. At
            present it covers only wheat and potato, so it does not yet cover {cropLower}.{' '}
            <a href="#/tools">Tools still being built →</a>
          </p>
        )}
      </section>

      {/* O-21/O-25: what reaches the crop, why, and what to do, on the page where the farmer already
          is, rather than four clicks away on the national argument. The placement figure inside it
          appears on field crops only; the component decides that from the slug. */}
      {/* D-193, 27 Sep 2026: the full loss ladder (778 words) was printed on all 28 crop pages and again
          on the knowledge page, against the 8 Sep ruling that the argument is written once and
          cross-linked. It is now the 1 figure and the door. Revert: put <LossLadder slug={slug} compact /> back. */}
      <section className="wrap sec-tight">
        <div className="panel p-5 lg:p-6 grid lg:grid-cols-[1fr_auto] gap-4 items-center" id="what-reaches">
          <div>
            <span className="eyebrow rust">Nitrogen use efficiency in Pakistan</span>
            {/* D-325, 4 Nov 2026: FAO 2023. Was "About 1/4 of the nitrogen in the bag feeds the crop. The rest leaves as gas or drains past the root." */}
            <h3 className="mt-1 max-w-[34ch]">Pakistan&rsquo;s nitrogen use efficiency was about 29% in 2023 (FAO estimate): of every 100 kg of nitrogen added to its cropland, 29 kg were taken out in the harvested crop. Much of the rest was lost to the air or lost to water</h3>
            <p className="small muted mt-2 max-w-[90ch]">This figure is for all of Pakistan’s cropland, not for {cropLower} alone. The linked pages explain why nitrogen is lost and what VAN makes to reduce each loss. They also list the 17 nutrients a crop needs, with a barrel tool: you enter the fertiliser bags you use, and it shows which nutrient your crop is getting too little of.</p>
          </div>
          <div className="grid gap-2">
            <a className="btn btn-navy" href="#/knowledge/why-pakistan-must-shift#what-reaches">Where the nitrogen goes →</a>
            <a className="btn btn-ghost" href="#/knowledge/nutrients#barrel">Put your bags in the barrel</a>
          </div>
        </div>
      </section>

      {urea.length > 0 && (
        <section className="wrap sec-tight">
          <div className="panel p-5 grid md:grid-cols-[auto_1fr] gap-5 items-center">
            <PackShot slug="vital-urea" hi style={{ height: 150, width: 'auto' }} />
            <div>
              <span className="eyebrow">From the Vital Urea page: VAN’s published plans, 2025 edition</span>
              <h3>Vital Urea in the {cropLower} plan</h3>
              <table className="tbl mt-3" style={{ fontSize: 15 }}>
                <thead><tr><th>Stage</th><th>Dose per acre</th><th>Method</th></tr></thead>
                <tbody>{urea.map((r, i) => <tr key={i}><td>{r[1]}</td><td className="num">{r[2]}</td><td>{r[3]}</td></tr>)}</tbody>
              </table>
              <a className="btn btn-ghost btn-sm mt-3" href="#/products/vital-urea">Read the Vital Urea page →</a>
            </div>
          </div>
        </section>
      )}

      {/* Explanatory, not instructional. The method is already printed on every row of the plan
          above, so folding this in Plain mode removes an explanation, never an instruction. */}
      <Detail label="What each application method means">
        <section className="wrap sec">
          <SectionHead eyebrow="How you apply it" title="The application methods named in the plan." lead={orchardMethods ? `VAN’s crop plans use 5 application methods: broadcasting, placement, side dressing, fertigation and spray. Each row of the ${cropLower} plan names the method for that product, and some rows give a second choice to use if the first is not possible. Read what each method means before you apply the plan.` : 'VAN’s crop plans use 5 application methods: broadcasting, placement (drilling at sowing), side dressing, fertigation and spray. Each row of the plan names the method for that product, and some rows give a second choice to use if the first is not possible. Read what each method means before you apply the plan.'} tone="navy" />
          <MethodsStrip compact orchard={orchardMethods} />
        </section>
      </Detail>

      {/* Tahir 7 Nov 2026 (CR-21): was "Nutrient emphasis printed on the plan: P-K. Below are all of VAN’s phosphorus brands, not only those in the potato plan. The PDF names the brands used at each stage." */}
      {browse.length > 0 && (
        <Detail label={`Browse VAN’s ${browse.map(p => p.catLabel).filter((v, i, a) => a.indexOf(v) === i).join(' and ').toLowerCase().replace(/nutrients\b/g, 'nutrient')} brands`}>
        <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
          <SectionHead eyebrow="VAN’s brands" title={`VAN’s ${browse.map(p => p.catLabel).filter((v, i, a) => a.indexOf(v) === i).join(' and ').toLowerCase().replace(/nutrients\b/g, 'nutrient')} brands.`} lead={emphasisInGroups(c.programme, cats)
            ? `VAN’s ${cropLower} plan emphasises ${emphasis(c.programme)}. This section shows all of VAN’s ${browse.map(p => p.catLabel).filter((v, i, a) => a.indexOf(v) === i).join(' and ').toLowerCase().replace(/nutrients\b/g, 'nutrient')} brands, including those not used in the ${cropLower} plan. ${cp ? 'The plan table above shows which brand is used at each stage.' : 'The PDF names the brands used at each stage.'}`
            : `VAN’s ${cropLower} plan emphasises ${emphasis(c.programme)}. ${cp ? 'The plan table above shows which brands supply these nutrients at each stage.' : 'The PDF names the brands used at each stage.'} This section shows all of VAN’s ${browse.map(p => p.catLabel).filter((v, i, a) => a.indexOf(v) === i).join(' and ').toLowerCase().replace(/nutrients\b/g, 'nutrient')} brands, including those not used in the ${cropLower} plan.`} />
          <div className="hrail">{browse.map(p => (
            <a key={p.slug} href={`#/products/${p.slug}`} className="panel tile" style={{ width: 200 }}>
              <div className="shot" style={{ height: 170 }}><PackShot slug={p.slug} style={{ maxHeight: 150 }} /></div>
              <div className="p-3"><div className="display text-[18px] leading-tight">{p.name}</div><div className="cap mt-1">{p.analysis}</div></div>
            </a>
          ))}</div>
        </div></section>
        </Detail>
      )}

      <section className="wrap sec">
        <div className="panel-navy p-6 lg:p-10 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>Farm-specific plans</span>
            <h2 className="text-[clamp(28px,2.8vw,38px)]">Ask VAN for a plan for your own field</h2>
            <p className="mt-3" style={{ color: 'rgba(255,255,255,.8)' }}>The crop plans on this site are general guides for a typical crop on a typical soil, and they do not replace a soil test. VAN can prepare a plan for your own farm from your soil analysis, your yield target and the other conditions of your field that affect how much fertiliser to apply. Ask for one on WhatsApp or at {CONTACT.cropEmail}.</p>
          </div>
          <div className="grid gap-3">
            {/* 11 Sep 2026 · all 28 crop pages opened the same generic message, so the agronomy team's
                first reply was always "which crop?" and VAN could not tell which page earned the
                enquiry. The crop is in the message now. */}
            <WaButton href={WA.crop(shortCropName(c.name))} lg>Ask VAN about my {cropLower} crop on WhatsApp</WaButton>
            <a className="btn btn-lg" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }} href={`mailto:${CONTACT.cropEmail}?subject=${encodeURIComponent(c.name + ' plan for my field')}`}>{CONTACT.cropEmail}</a>
            <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }} onClick={() => setAskOpen(o => !o)} aria-expanded={askOpen}>
              {askOpen ? 'Close the form' : 'Or leave your details here'}
            </button>
          </div>
        </div>
        {/* 10 Sep 2026. I argued against putting a form in front of a farmer and he ruled to build it
            anyway, so it is built to be finishable one-handed and WhatsApp still comes first on the
            panel above it. Four fields plus a note nobody has to write. */}
        {askOpen && (
          <div className="mt-3">
            <VanForm
              form="farmer-plan"
              fields={FARMER_FORM}
              initial={{ crop: c.name.split(/,| \(/)[0].trim() }}
              intro="Hello VAN. I would like a nutrition plan for my field."
              submitLabel="Send my details"
              to={CONTACT.cropEmail}
              subject={`${c.name} plan for my field`}
              success="A member of VAN’s agronomy team will call you back. If you have a soil report, send a photograph of it to the WhatsApp number above, and the plan will be built on your own soil rather than on a district average."
              compact
            />
          </div>
        )}
        {others.length > 0 && <div className="mt-8"><div className="cap font-bold uppercase tracking-[.08em] mb-2">Other {c.groupLabel.toLowerCase()}</div><div className="flex flex-wrap gap-2">{others.map(o => <a key={o.name} className="chip chip-sm" href={`#/crops/${cropSlug(o)}`}>{o.name}</a>)}</div></div>}
      </section>
    </div>
  )
}
