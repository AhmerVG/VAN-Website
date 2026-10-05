import { useState } from 'react'
import { usePhonePlainDefault } from '@/lib/phonePlain'
import { CROPS, PRODUCTS, CROP_PLANS, shortCropName } from '@/data/catalogue'
import { WA, CONTACT } from '@/data/site'
import { cropBySlug, cropSlug, cropPdf, cropLms, sowingLabel, GROUP_COLOUR, GROUP_TEXT, parseSowing, MONTHS_LONG } from '@/lib/season'
import { SeasonRing } from '@/components/SeasonRing'
import { MethodsStrip } from '@/components/MethodsStrip'
import { PlanMatrix } from '@/components/PlanMatrix'
import { NutritionCreator } from '@/components/NutritionCreator'
import { hasCalculator } from '@/data/costPlans'
import { planUpdateNote } from '@/data/planNotes'
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
  ['Sesame', 'Germination', '1 bag (25 kg)', 'Side dressing / broadcasting'],
  ['Sesame', 'Early growth', '½ bag (12.5 kg)', 'Side dressing / broadcasting'],
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

export default function CropPage({ slug }: { slug: string }) {
  const [askOpen, setAskOpen] = useState(false)
  usePhonePlainDefault()   // D-199
  if (slug === 'wheat') return <Wheat />
  const c = cropBySlug(slug)
  if (!c) {
    return (
      <div className="wrap py-16 text-center">
        <h1>No crop by that name.</h1>
        <p className="lead mx-auto mt-4">Pick one of the {CROPS.length} programmes.</p>
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
  const cropLower = shortCropName(c.name).toLowerCase()
  return (
    <div>
      <section style={{ background: `linear-gradient(180deg, ${col}22, var(--sand))` }}>
        <div className="wrap py-8 lg:py-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div>
            <p className="cap"><a href="#/crops">Crop Plans</a> / {c.groupLabel} / {c.name}</p>
            <span className="eyebrow mt-2" style={{ color: GROUP_TEXT[c.group] ?? col }}>Crop programme · per acre</span>
            <h1><Ur kind="crop" en={c.name} /></h1>
            <div className="flex flex-wrap gap-2 mt-4"><span className="tag tag-sky">{sowingLabel(c)} sowing</span><span className="tag tag-green">{c.programme}</span>{calc && <LiveCalcTag />}</div>
            {/* D-144: calculator crops say where their 2 sets of figures come from, as the wheat page does (M3). */}
            <p className="lead mt-4">{cp && calc ? `The full stage-by-stage programme is below and in the PDF: what to put on, at which stage, by which method, and the pack it comes in. The programme is VAN’s published plan. The nutrition calculator further down reads VAN’s own ${cropLower} calculator. Where the 2 differ, the page shows a range.` : cp && planUpdateNote(slug) ? `The full stage-by-stage programme is below and in the PDF: what to put on, at which stage, by which method, and the pack it comes in. Every other figure is VAN’s published plan, not a calculation. ${planUpdateNote(slug)}` : cp ? 'The full stage-by-stage programme is below and in the PDF: what to put on, at which stage, by which method, and the pack it comes in. Every figure is VAN’s published plan, not a calculation.' : 'The full stage-by-stage programme is in the PDF: what to put on, at which stage, by which method, and the pack it comes in. Every figure in it is VAN’s published plan, not a calculation.'}</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a className="btn btn-gold btn-lg" href={pdf} target="_blank" rel="noopener">Download the {shortCropName(c.name)} plan (PDF) ↓</a>
              {/* Was a second "ask for my plan" WhatsApp button carrying the identical message to
                  the one at the foot of this page. Replaced with the thing the reader actually came
                  for; the WhatsApp offer is made once, at the end, where it belongs. */}
              <a className="btn btn-ghost btn-lg" href="#list">What to buy for my acres →</a>
              {calc && <a className="btn btn-ghost btn-lg" href="#creator">Open the calculator ↓</a>}
            </div>
            {/* D-133: crop training deck, only where data/cropLms.ts has an entry for this crop. */}
            {lms && <div className="mt-3"><a className="btn btn-ghost btn-sm" href={lms.href} target="_blank" rel="noopener">⬇ {lms.label}</a></div>}
          </div>
          <div className="panel p-4">
            <div className="flex items-baseline justify-between gap-3 mb-1"><div className="display text-[20px]">Sowing window</div><div className="cap">{win.map(w => `${MONTHS_LONG[w.start]}${w.end !== w.start ? ' – ' + MONTHS_LONG[w.end] : ''}`).join(' / ')}</div></div>
            <SeasonRing size={380} selected={cropSlug(c)} className="mx-auto" />
          </div>
        </div>
      </section>

      {/* 01 + 02. One input, and what it makes true today. Both additive: with no date answered
          block 02 renders nothing and the page is the page it was before. */}
      <section className="wrap sec-tight">
        <SowingDate cropKey={slug} cropName={shortCropName(c.name).toLowerCase()} />
        <div className="mt-4"><CropNow cropKey={slug} cropName={shortCropName(c.name).toLowerCase()} /></div>
      </section>

      {/* O-3, 9 Sep 2026 (Tahir): "simple view and full view is same. we should make simple view bit
          compact and keep full view as standard." He then named exactly what folds: the full
          stage-by-stage table, and the water block. Both are here.
          The matrix is the right thing to fold. It is seven bands across five stages, the densest
          object on the page, and a farmer in simple view wants the shopping list below it, not the
          grid. It folds to one line and opens on a tap. Nothing is removed from either view. */}
      {cp && (
        <section className="wrap sec" id="programme">
          <SectionHead eyebrow="The whole programme at a glance" title="Every band, every stage." lead="The programme matrix. Every band across every stage, per acre, with commodity inputs greyed and every product shown as its real pack." />
          <Detail bare label={`The full ${cp.stages.length}-stage table. Every band, every stage`}>
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
              ? `Pick the age of your orchard, set your acres, and this is the ${shortCropName(c.name).toLowerCase()} programme turned into bags. A palm's requirement rises as it matures, so one age band applies at a time. The bands are not added together.`
              : `Tick the stages you are planning, set your acres, and this is the ${shortCropName(c.name).toLowerCase()} programme turned into bags and packs. Published rate multiplied by your acres, no estimate in between.${planUpdateNote(slug) ? ' ' + planUpdateNote(slug) : ''}`} />
          <ListBuilder stages={cp.stages} plan={cp.plan} cropName={shortCropName(c.name).toLowerCase()} pdfPath={c.pdf} mode={cp.mode} cropKey={slug} soil={!calc && hasSoilLayer(slug)} />
        </section>
      )}

      {calc && (
        <section className="wrap sec-tight" id="creator">
          <SectionHead eyebrow="Scale it to your field" title="The dynamic nutrition creator." lead={`Set your acres and every quantity below scales with it. Sourced straight from VAN's own ${cropLower} calculator, not estimated.`} tone="navy" />
          <p className="small mb-3 max-w-[140ch]"><b>Which list to use:</b> the acres figure is shared with the shopping list above. The shopping list is the published plan; this list is VAN’s calculator, and it is the one to use if you have a soil report. Where the 2 differ, the totals below show a range.</p>{/* D-151 (A12): was "This is the same programme from VAN’s calculator; use it if you have a soil report." */}
          <NutritionCreator crop={slug} cropName={cropLower} />
        </section>
      )}

      {/* The soil layer reached all 28 programmes on 9 Sep 2026. What each crop can answer still
          differs, and it differs for a reason a farmer can check: a parameter is offered only where
          this crop's own plan contains a product that carries that nutrient. So this panel says what
          THIS crop can do, and names what it cannot. */}
      {!calc && (
        <section className="wrap sec-tight">
          <div className="panel p-5 lg:p-6">
            <span className="eyebrow green">Live on this crop</span>
            <h3 className="mt-1">The list above reads your soil test, not just the crop.</h3>
            <p className="muted mt-2 max-w-[140ch]">
              Enter your soil report in the list builder, or pick your district and it fills from the
              Punjab survey&rsquo;s own median across 770,160 samples, and the quantities move with
              what your ground actually shows. On {shortCropName(c.name).toLowerCase()} it can answer{' '}
              <b>{soilParams.length} readings</b>: {soilParams.map(p => SOIL_PARAMETER_LABEL[p]).join(', ')}.
            </p>
            {unanswered.length > 0 && (
              <p className="cap mt-2 max-w-[140ch]">
                Not offered on this crop: {unanswered.map(p => soilParameterInline(p)).join(', ')}. The
                published {shortCropName(c.name).toLowerCase()} programme carries no product that supplies{' '}
                {unanswered.length > 1 ? 'them' : 'it'}, so the row is left out rather than offered and
                doing nothing. Adding one is a change to the programme itself, not to this tool.
              </p>
            )}
            <div className="flex flex-wrap gap-3 mt-4">
              <a className="btn btn-sm" href="#list">Open the list builder →</a>
              <a className="btn btn-sm btn-ghost" href="#/soil">Soil Atlas →</a>
            </div>
          </div>
        </section>
      )}

      {/* 05b. What the plan puts back against what the harvest takes. */}
      {cp && (
        <section className="wrap sec-tight">
          <NutrientBalance cropKey={slug} cropName={shortCropName(c.name).toLowerCase()} defaultYieldMaunds={DEFAULT_YIELD[slug]} />
        </section>
      )}

      {/* 05c. Water. A nutrition plan assumes the water arrived; in Pakistan that is the
          assumption that fails most often, so it sits with the plan rather than after it. */}
      <section className="wrap sec-tight">
        <Detail bare label="How much water this season needs">
          <WaterRequirement cropKey={slug} cropName={shortCropName(c.name).toLowerCase()} />
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
        {SIMULATOR_CROPS.includes(slug) ? (
          <div className="panel-navy p-6 lg:p-10 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <span className="eyebrow" style={{ color: 'var(--gold)' }}>Nutrition decides about 1/4 of the yield</span>
              <h2 className="text-[clamp(28px,2.8vw,38px)]">The farm discipline simulator.</h2>
              <p className="mt-3" style={{ color: 'rgba(255,255,255,.8)' }}>Everything above is the nutrition lever. Score how the season is actually being run, sowing time, seed, irrigation, disease, and see what is really holding yield back.</p>
            </div>
            <a className="btn btn-gold btn-lg" href={`#/simulator/${slug}`}>Open the simulator →</a>
          </div>
        ) : (
          <p className="small max-w-[140ch]">
            Nutrition decides about 1/4 of the yield. Sowing, seed, water, weeds and pests decide the
            rest. The farm discipline simulator scores a whole season across 10 levers, and it exists for wheat and potato, each with its own levers and its own
            weights. It is not offered on {shortCropName(c.name).toLowerCase()} because wheat&rsquo;s
            10 levers do not apply to {shortCropName(c.name).toLowerCase()}. Each crop needs its
            own. <a href="#/tools">What is being built, and what each needs →</a>
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
            <span className="eyebrow rust">What actually reaches your crop</span>
            <h3 className="mt-1 max-w-[34ch]">About a quarter of the nitrogen in the bag feeds the crop. The rest leaves as gas or drains past the root.</h3>
            <p className="small muted mt-2 max-w-[90ch]">Why it goes, what VAN builds against each loss, and the 17 nutrients and the barrel that show where your own season leaks. Written once, with its sources.</p>
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
              <span className="eyebrow">From the Vital Urea page · VAN’s published plans, 2025 set</span>
              <h3>Vital Urea in the {shortCropName(c.name)} programme</h3>
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
      <Detail label="What each application method actually means">
        <section className="wrap sec">
          <SectionHead eyebrow="How you apply it" title="The plan names a method for every row." lead="Broadcasting, placement, side dressing, fertigation and spray are 5 different things. Read what each one means before you open the PDF." tone="navy" />
          <MethodsStrip compact />
        </section>
      </Detail>

      {browse.length > 0 && (
        <Detail label={`Browse VAN’s ${c.programme.toLowerCase()} range`}>
        <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
          <SectionHead eyebrow="Browse the range" title={`VAN’s ${browse.map(p => p.catLabel).filter((v, i, a) => a.indexOf(v) === i).join(' and ').toLowerCase()} products.`} lead={`Programme focus: ${c.programme.replace(/ programme$/, '')}. The PDF names which products go on, at which stage. These are the VAN products in those nutrient groups.`} />
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
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>A plan for your own field</span>
            <h2 className="text-[clamp(28px,2.8vw,38px)]">These are per-acre programmes, not a prescription for your field.</h2>
            <p className="mt-3" style={{ color: 'rgba(255,255,255,.8)' }}>A nutrition plan is built on a typical crop and a typical soil. It is not a substitute for a soil test. VAN prepares farm-specific plans against a grower's own soil analysis, yield target and the other variables that decide a rate. Ask for one on WhatsApp or at {CONTACT.cropEmail}.</p>
          </div>
          <div className="grid gap-3">
            {/* 11 Sep 2026 · all 28 crop pages opened the same generic message, so the agronomy team's
                first reply was always "which crop?" and VAN could not tell which page earned the
                enquiry. The crop is in the message now. */}
            <WaButton href={WA.crop(shortCropName(c.name))} lg>Ask about my {shortCropName(c.name).toLowerCase()} on WhatsApp</WaButton>
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
              success="Somebody from the agronomy team calls you back. If you have a soil report, send a photograph of it on the WhatsApp number above and the plan is built against your own soil rather than a district average."
              compact
            />
          </div>
        )}
        {others.length > 0 && <div className="mt-8"><div className="cap font-bold uppercase tracking-[.08em] mb-2">Other {c.groupLabel.toLowerCase()}</div><div className="flex flex-wrap gap-2">{others.map(o => <a key={o.name} className="chip chip-sm" href={`#/crops/${cropSlug(o)}`}>{o.name}</a>)}</div></div>}
      </section>
    </div>
  )
}
