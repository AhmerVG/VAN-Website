import { useMemo, useState } from 'react'
import { CROPS, CROP_PLANS, shortCropName } from '@/data/catalogue'
import { REGIONAL_PROFILES } from '@/data/regionalSoil'
import { SOIL_BAND_LABEL } from '@/data/soilThresholds'
import { removalFor, KG_PER_MAUND } from '@/data/removal'
import { cropSlug, tidyUnits } from '@/lib/season'
import { noStop, planLabel } from '@/components/bits'   // Tahir 7 Nov 2026 (CR-23): no full stop at the end of a heading

/**
 * THE 3 FLAGSHIPS — 27 September 2026, D-196.
 *
 * Tahir: "Sulfur coated urea, Vital Potash and Green Phosphate are 3 flagship products, their pages
 * should get a very fine interactive dynamic treatment. Flagship does not mean more text but a very
 * interactive and special space and an easy to understand case, and answer why. Think like a farmer:
 * why will he pick the product. Do not use the typical pitch as fertilizer companies do in Pakistan,
 * 'this is my product, this is better'."
 *
 * So each flagship opens with the grower's own question, answers it with the mechanism in plain
 * words, gives him 1 thing to do with his own numbers, and ends with what VAN will not claim. Every
 * figure is one the site already publishes: the declared analysis, the published crop programmes,
 * IPNI removal per tonne, the Punjab survey medians. No yield percentage, no release curve with
 * numbers on it, no "better than".
 *
 * His rulings of 27 Sep on what may be printed:
 *   Green Phosphate: the acidic granule microsite is the mechanism; humic is a soil benefit (the
 *     published meta-analysis), not a calcium shield; "70 to 80% fixed" comes off the site.
 *   Vital Urea: the "12 to 15 kg N per kg S" ratio comes off; the release calendar is qualitative,
 *     no day figures, labelled how it works and not a measurement.
 *   Vital Potash: boron is named, and the 2 forms, never a percentage.
 *
 * D-324 (30 Oct 2026): Green Phosphate shows 1 named wheat trial with its yields, by Tahir's ruling,
 * explained by its chemistry and agronomy; still no "better than".
 */

const fmt = (n: number) => n >= 100 ? Math.round(n).toLocaleString('en-PK') : n >= 10 ? n.toFixed(0) : n.toFixed(1)

/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */
/* ─────────────────────────── shared frame ─────────────────────────── */
function Frame({ question, answers, children, wontClaim, tool, evidence }: {
  question: string
  answers: { h: string; p: string }[]
  children: React.ReactNode
  evidence?: React.ReactNode
  tool: string
  wontClaim: string[]
}) {
  return (
    <section className="fs" aria-label="Why a grower picks it">
      <div className="fs-q">
        <span className="eyebrow gold">A grower’s question</span>
        <h2 className="fs-qh">{noStop(question)}</h2>
      </div>
      <div className="fs-answers">
        {answers.map((a, i) => (
          <div key={a.h} className="fs-a">
            <span className="fs-n num">{i + 1}</span>
            <h3 className="fs-ah">{noStop(a.h)}</h3>
            {/* L1 7 Nov 2026 (M4): a blank line in an answer starts a new paragraph */}
            {a.p.split('\n\n').map((para, j) => <p key={j} className="small mt-2">{para}</p>)}
          </div>
        ))}
      </div>
      {evidence}
      <div className="fs-tool">
        <span className="eyebrow">{tool}</span>
        {children}
      </div>
      <div className="fs-wont">
        <span className="cap" style={{ fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>What VAN does not claim for this product</span>
        <ul className="fs-wont-list">{wontClaim.map(w => <li key={w}>{w}</li>)}</ul>
      </div>
    </section>
  )
}

/* ─────────────────────────── Vital Urea ─────────────────────────── */
function VitalUreaTool() {
  const [bags, setBags] = useState(2)
  const [watered, setWatered] = useState(false)
  const n = bags * 25 * 0.32, s = bags * 25 * 0.13
  return (
    <div className="fs-grid">
      <div>
        <label className="fs-lab" htmlFor="fs-vu-bags">Bags of Vital Urea (25 kg) per acre</label>
        <div className="fs-row">
          <input id="fs-vu-bags" type="number" min="0" max="20" step="0.5" inputMode="decimal" className="input input-sm" style={{ width: 110 }} value={bags} onChange={e => setBags(Math.min(20, Math.max(0, Number(e.target.value) || 0)))} />
          <span className="small">By the declared analysis, these bags supply <b className="num">{fmt(n)} kg</b> of nitrogen and <b className="num">{fmt(s)} kg</b> of sulfur per acre.</span>
        </div>
        <div className="fs-row mt-4">
          <button type="button" className={`btn btn-sm ${watered ? 'btn-navy' : 'btn-gold'}`} onClick={() => setWatered(w => !w)}>{watered ? 'Before the first irrigation' : 'Apply the first irrigation'}</button>
          <span className="cap">{watered ? 'After the first irrigation or rain' : 'A coated granule does not start to release nitrogen until water reaches it'}</span>
        </div>
        {/* D-316, 26 Oct 2026. Tahir: "you are pasting the conversational text on the website?" Removed the caption "How it works, not a measurement. No day figures are drawn because VAN has no laboratory release curve, and says so on this page." */}
      </div>
      <svg viewBox="0 0 520 200" className="fs-svg" role="img" aria-label="Plain urea dissolves in the first water at once; coated urea releases in steps over days">
        <rect width="520" height="200" fill="var(--paper)" />
        <text x="16" y="24" fontSize="12" fontWeight="700" fill="var(--navy)" fontFamily="Public Sans, sans-serif">Plain urea</text>
        <text x="16" y="112" fontSize="12" fontWeight="700" fill="var(--navy)" fontFamily="Public Sans, sans-serif">Vital Urea, sulfur coated</text>
        {/* time axis */}
        <line x1="16" y1="186" x2="504" y2="186" stroke="var(--line-2)" />
        <text x="16" y="198" fontSize="10" fill="var(--muted)" fontFamily="Public Sans, sans-serif">first irrigation</text>
        <text x="504" y="198" fontSize="10" fill="var(--muted)" textAnchor="end" fontFamily="Public Sans, sans-serif">days later</text>
        {/* plain urea: one tall bar at the first water, then nothing */}
        <g opacity={watered ? 1 : 0.2}>
          <rect x="16" y="34" width="40" height="56" fill="var(--rust)" />
          <text x="62" y="60" fontSize="11" fill="var(--muted)" fontFamily="Public Sans, sans-serif">all the nitrogen dissolves at once and can go to the crop, the air or the water</text>
        </g>
        {!watered && <text x="62" y="60" fontSize="11" fill="var(--muted)" fontFamily="Public Sans, sans-serif">dry granules, no nitrogen released yet</text>}
        {/* coated: steps of falling height across the axis, no numbers */}
        <g opacity={watered ? 1 : 0.2}>
          {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x={16 + i * 80} y={122 + i * 8} width="40" height={56 - i * 8} fill="var(--green)" />)}
          <text x="62" y="176" fontSize="11" fill="var(--muted)" fontFamily="Public Sans, sans-serif" />
        </g>
        {watered && <text x="330" y="140" fontSize="11" fill="var(--muted)" fontFamily="Public Sans, sans-serif">released over several days, as the coating breaks down</text>}
      </svg>
    </div>
  )
}

/* ─────────────────────────── Vital Potash ─────────────────────────── */
function VitalPotashTool() {
  const crops = useMemo(() => CROPS.filter(c => (CROP_PLANS[cropSlug(c)]?.plan ?? []).some(r => r.product === 'Vital Potash')), [])
  const [crop, setCrop] = useState(() => crops.find(c => cropSlug(c) === 'wheat') ? 'wheat' : cropSlug(crops[0]))
  const [bags, setBags] = useState(2)
  const [maunds, setMaunds] = useState(40)
  const plan = CROP_PLANS[crop]
  const rows = (plan?.plan ?? []).filter(r => r.product === 'Vital Potash')
  const stages = [...new Set(rows.map(r => r.stage))]
  const k = bags * 20 * 0.44, n = bags * 20 * 0.11
  const rem = removalFor(crop)
  const tonnes = maunds * KG_PER_MAUND / 1000
  const grainK = rem ? rem.K * tonnes : null
  const strawK = rem?.residue ? rem.residue.K * tonnes : null
  const name = shortCropName(CROPS.find(c => cropSlug(c) === crop)?.name ?? crop)
  return (
    <div className="fs-grid">
      <div>
        <label className="fs-lab" htmlFor="fs-vp-crop">Your crop</label>
        <select id="fs-vp-crop" className="input input-sm" value={crop} onChange={e => setCrop(e.target.value)}>
          {crops.map(c => <option key={cropSlug(c)} value={cropSlug(c)}>{c.name}</option>)}
        </select>
        {/* L1 7 Nov 2026 (M7, first part): "at the stage the plan calls ..."; the "filling stage" definition is open with Tahir (Q16). Was: "is applied at <b>Grand Growth</b>". Tahir 9 Nov 2026: the sentence "This is the filling stage, when the crop stops growing new leaves ..." deleted. */}
        <p className="small mt-3">In VAN’s published {name.toLowerCase()} plan, Vital Potash is applied at {stages.length > 1 ? 'the stages the plan calls' : 'the stage the plan calls'} <b>{stages.map(planLabel).join(' and ') || 'no stage'}</b>{rows[0] ? <>, by {rows[0].method.toLowerCase()}, at {rows.map(r => tidyUnits(r.rate)).join(' and ')} per acre</> : null}.</p>
        <div className="fs-row mt-4">
          <label htmlFor="fs-vp-bags" className="small">Bags (20 kg) per acre</label>
          <input id="fs-vp-bags" type="number" min="0" max="20" step="0.5" inputMode="decimal" className="input input-sm" style={{ width: 90 }} value={bags} onChange={e => setBags(Math.max(0, Number(e.target.value) || 0))} />
          <label htmlFor="fs-vp-maunds" className="small">Expected yield, maunds per acre</label>
          <input id="fs-vp-maunds" type="number" min="0" max="2000" step="5" inputMode="decimal" className="input input-sm" style={{ width: 90 }} value={maunds} onChange={e => setMaunds(Math.max(0, Number(e.target.value) || 0))} />
        </div>
      </div>
      {/* Tahir 7 Nov 2026 (PR-28): the potash share and the 1 to 83 ratio in their own paragraph. Tahir 9 Nov 2026: the ratio is FAO 2023 (FAOSTAT); the 1% share stays NFDC 2024-25, and the bag line now names the 1% share, which is what the Crop Force bag prints (see nutrients.ts). */}
      <div className="fs-bars">
        <div className="fs-bar"><span>K₂O in the bags you apply</span><i style={{ width: `${Math.min(100, k / Math.max(k, grainK ?? 1, (grainK ?? 0) + (strawK ?? 0)) * 100)}%`, background: 'var(--green)' }} /><b className="num">{fmt(k)} kg</b></div>
        {grainK !== null ? (
          <>
            <div className="fs-bar"><span>Estimated K₂O taken out in the harvested {name.toLowerCase()}, at {fmt(maunds)} maunds per acre</span><i style={{ width: `${Math.min(100, grainK / Math.max(k, grainK, grainK + (strawK ?? 0)) * 100)}%`, background: 'var(--gold)' }} /><b className="num">{fmt(grainK)} kg</b></div>
            {strawK !== null && <div className="fs-bar"><span>Estimated K₂O taken out if the {rem?.residue?.label.toLowerCase()} is also removed</span><i style={{ width: `${Math.min(100, (grainK + strawK) / Math.max(k, grainK + strawK) * 100)}%`, background: 'var(--soil)' }} /><b className="num">{fmt(grainK + strawK)} kg</b></div>}
            <p className="cap mt-2">Removal is estimated from published values per tonne of harvest from the International Plant Nutrition Institute (IPNI). These are reference values, not measurements from Pakistani fields. Your bags also carry {fmt(n)} kg of nitrogen.</p>
          </>
        ) : (
          <p className="cap mt-2">There is no published removal figure for {name.toLowerCase()}, so only the potash in your bags is shown. Your bags also carry {fmt(n)} kg of nitrogen.</p>
        )}
        <p className="cap mt-2">In 2023, Pakistan applied 83 kg of nitrogen for every 1 kg of potash (K₂O) (FAOSTAT). In 2024-25, potash was 1% of the fertiliser nutrients applied (NFDC Fertilizer Review 2024-25). Both figures are printed on VAN’s Crop Force bag.</p>{/* Tahir 10 Nov 2026 (PR-N10): both figures are on the bag; was "The 1% share is printed on VAN’s Crop Force bag." */}{/* L1 editor 10 Nov 2026 (m4): denominator named as on the 17 nutrients page; was 'about 1% of all nutrients applied'. '1%' against 'about 1%' is left for Tahir. */}{/* Lead 10 Nov 2026 (L3-5), from NFDC 2024-25 (44.5 of 4,350.5 thousand tonnes = 1.02%) and the site ruling of 7 Nov: '1%' on every page; was 'about 1%'. */}
      </div>
    </div>
  )
}

/* ─────────────────────────── Green Phosphate ─────────────────────────── */
function GreenPhosphateTool() {
  const [district, setDistrict] = useState('')
  const [bag, setBag] = useState<50 | 35>(50)
  const d = REGIONAL_PROFILES.find(p => p.key === district)
  const ph = d?.values.pH, pBand = d?.bands.P2O
  const p2o5 = bag * 0.32, nKg = bag * 0.06
  return (
    <div className="fs-grid">
      <div>
        <label className="fs-lab" htmlFor="fs-gp-district">Your district, Punjab</label>
        <select id="fs-gp-district" className="input input-sm" value={district} onChange={e => setDistrict(e.target.value)}>
          <option value="">Pick a district</option>
          {REGIONAL_PROFILES.map(p => <option key={p.key} value={p.key}>{p.name}</option>)}
        </select>
        {d ? (
          <p className="small mt-3">
            In {d.name}, the median soil pH in the Punjab soil testing programme was <b>{ph?.toFixed(2)}</b>{pBand ? <>, and available phosphorus was rated <b>{SOIL_BAND_LABEL[pBand]}</b></> : null}, from {d.n.toLocaleString('en-PK')} samples.
            {ph !== undefined && ph >= 7.5 ? ' Above pH 7.5, in soil with free lime, phosphate dissolving from a granule meets calcium within a few centimetres and drops out of solution before a root reaches it. This is where the phosphate from a bag of DAP goes.' : ' At this pH, calcium fixation is slower, but the acidic zone around the granule still matters on soil that contains lime.'}
            {' '}<a href="#/soil">See the full district figures in the Soil Atlas.</a>
          </p>
        ) : <p className="small mt-3 muted">Choose your district to see its median soil pH and phosphorus rating from the Punjab soil testing programme. A district median does not describe any single field.</p>}
      </div>
      <div>
        <div className="fs-row">
          <span className="small">Bag</span>
          {[50, 35].map(b => <button key={b} type="button" className={`btn btn-sm ${bag === b ? 'btn-navy' : 'btn-ghost'}`} onClick={() => setBag(b as 50 | 35)}>{b} kg</button>)}
        </div>
        <p className="small mt-3">By its declared analysis (6:32:0), a {bag} kg bag of Green Phosphate carries <b className="num">{fmt(p2o5)} kg of P₂O₅</b> and <b className="num">{fmt(nKg)} kg of nitrogen</b>. A 50 kg bag of Fusion Phosphate (TSP) carries 23 kg of P₂O₅, no nitrogen and no coating. On each crop’s plan page you can switch between Green Phosphate and Fusion Phosphate.</p>{/* L1 7 Nov 2026 (m16): was "On the crop page" */}
        <svg viewBox="0 0 320 120" className="fs-svg" role="img" aria-label="1 granule with an acidic zone around it in alkaline soil">
          <rect width="320" height="120" fill="#EFE6DA" />
          <text x="10" y="18" fontSize="11" fill="var(--soil)" fontFamily="Public Sans, sans-serif">calcareous soil{ph ? `, pH ${ph.toFixed(1)}` : ', above pH 8'}</text>
          <circle cx="160" cy="66" r="42" fill="var(--gold-soft)" opacity=".9" />
          <circle cx="160" cy="66" r="14" fill="var(--soil)" />
          <circle cx="160" cy="66" r="18" fill="none" stroke="var(--green)" strokeWidth="3" />
          <text x="160" y="118" fontSize="10.5" fill="var(--muted)" textAnchor="middle" fontFamily="Public Sans, sans-serif">acidic zone, only a few centimetres around the granule</text>
        </svg>
      </div>
    </div>
  )
}

/* ─────────────────────────── Green Phosphate: the wheat trial ─────────────────────────── */
/* D-324, 30 Oct 2026, Tahir: publish the Green Phosphate wheat trial on this page. Show the result and
   explain why it is chemically and agronomically plausible; never "beats DAP". Trial facts as he gave them:
   independent partner company, its own research farm (not named), Sheikhupura, Rabi 2024-25, 2 replications,
   yields averaged, rates per acre, only the phosphate product changed, plot soil pH 8.43 and available P 7 ppm,
   no significance test reported. Copy revised after the independent review: no diminishing-returns sentence
   (the 35 kg plot did not meet the crop's P removal), no humic causal claim, no implied significant difference. P2O5 and N carried are from the declared analyses: DAP 18:46:0, Green Phosphate 6:32:0. */
const GP_TRIAL: { label: string; p2o5: string; yieldMd: string }[] = [
  { label: 'DAP, 50 kg', p2o5: '23 kg', yieldMd: '54.17' },
  { label: 'Green Phosphate, 50 kg', p2o5: '16 kg', yieldMd: '57.19' },
  { label: 'Green Phosphate, 35 kg', p2o5: '11.2 kg', yieldMd: '56.97' },
]

function GreenPhosphateTrial() {
  return (
    <div className="fs-ev">
      <span className="eyebrow">A wheat trial</span>
      <h3 className="fs-ah mt-2">Green Phosphate and DAP on wheat: Sheikhupura, Rabi 2024-25</h3>
      <p className="small mt-2">Average wheat yields were 54.17 maunds per acre with 50 kg of DAP, 57.19 with 50 kg of Green Phosphate and 56.97 with 35 kg of Green Phosphate. An independent partner company, which is not named, ran the trial on its own research farm. Each treatment had 2 replications, and the yields shown are their average. No significance test was reported. Only the phosphate product and its rate differed between treatments. Urea, potash, seed, sowing date and water were the same on every plot, but the 3 phosphate treatments supplied different amounts of nitrogen (see below).</p>{/* Tahir 7 Nov 2026 (PR-11) */}
      <div className="fs-ev-tbl mt-3">
        <table className="tbl">
          <thead><tr><th>Phosphate product and amount per acre</th><th className="r">P₂O₅ per acre</th><th className="r">Wheat yield, maunds per acre</th></tr></thead>
          <tbody>{GP_TRIAL.map(r => <tr key={r.label}><td>{r.label}</td><td className="r num">{r.p2o5}</td><td className="r num">{r.yieldMd}</td></tr>)}</tbody>
        </table>
      </div>
      {/* Tahir 7 Nov 2026 (PR-12): soil facts plus a limit. Was "Why the soil conditions can explain the result." with the calcium and acidic-zone explanation. */}
      <p className="small mt-3"><b>Soil conditions on the trial field.</b> The soil of the trial field tested at pH 8.43 with 7 ppm available phosphorus, below the 15 ppm counted as adequate. At this level, the soil cannot supply the crop with enough phosphorus. These conditions may help to explain the higher average yields with Green Phosphate. The trial was too small to show that the difference was caused by the product.</p>
      <p className="small mt-2">The DAP bag also supplied more nitrogen: 9 kg per acre, against 3.0 kg and 2.1 kg per acre for the 2 Green Phosphate treatments. Because the Green Phosphate plots received less nitrogen, extra nitrogen cannot explain their yields.</p>
    </div>
  )
}

/* ─────────────────────────── the 3, wired by slug ─────────────────────────── */
export function Flagship({ slug }: { slug: string }) {
  /* 28 Sep 2026: the "5 to 15% more grain at half the weight per application" clause that used to
     sit inside the wontClaim list below was the claim's 3rd close-together restatement on this page
     (after the answers card above and the maize-trials panel further down), so it was trimmed there;
     the boundary this item states — no yield figure beyond these 3 trials — is kept. */
  if (slug === 'vital-urea') return (
    <Frame
      question="I put 2 bags of urea on my field, and 3 weeks later the crop turned yellow again. Where did the nitrogen go?"
      answers={[
        { h: 'Nitrogen from urea goes to the crop, the air and the water', p: 'Plain urea dissolves in the first irrigation, so all of its nitrogen is open to loss at the same time. In soil above pH 8, part of this nitrogen is lost to the air as ammonia gas. Another part is carried down below the roots by the irrigation water and is lost to water. The farmer has paid for all of the nitrogen in the bag, including the part that is lost.' },
        { h: 'The coating limits how much nitrogen is open to loss at one time', p: 'Each Vital Urea granule is plain urea inside a coat of fine elemental sulfur, held on by a binder. The coating does not start to release nitrogen until water reaches the granule. It then breaks down gradually and releases the nitrogen over several days, so the crop can take up the nitrogen while it is still in the soil.' },
        // D-316, 26 Oct 2026, to Tahir's 27/28 Sep rulings: once, at the first application; trials named by year only, no yield.
        // Tahir 7 Nov 2026 (PR-3): once in the crop cycle, at the first or second application.
        // L1 7 Nov 2026 (m19): the list of the 3 maize trials moved out of this answer; the trials table on the page carries them.
        // Was: '... stay as they are. Vital Urea has been used in maize trials at Rafhan Maize Products (2023, joint), Descon Research Farm (2024, joint) and an independent partner farm (2025, not named). When comparing ...'
        // Was: 'Half the weight, and more grain, in 3 maize trials' ... 'Rafhan Maize Products (2022, joint) ... at each application gave 5 to 15% more grain with less nitrogen applied.'
        // Tahir 9 Nov 2026 (PR-3): the once-per-crop-cycle rule withdrawn. Was: h '1 bag of Vital Urea replaces 1 bag of urea once, at the first or second application'; p '1 bag of Vital Urea (25 kg) takes the place of 1 bag of urea (50 kg) once in the crop cycle, at the first or second application. ... and the rest of the nitrogen applications in the crop plan stay as they are.'
        // Tahir 10 Nov 2026 (R3-3): Rafhan 2023 and the 2025 Sheikhupura trial, first N application (Descon 2024 did not test this swap). Was h 'In VAN’s trials, 1 bag of Vital Urea replaced 1 bag of urea at the first or second application'; p 'In VAN’s trials, 1 bag of Vital Urea (25 kg) replaced 1 bag of urea (50 kg) once, at the first or second application.'
        { h: 'In the 2023 and 2025 trials, 1 bag of Vital Urea took the place of 1 bag of urea at the first nitrogen application', p: 'In the 2023 and 2025 trials, 1 bag of Vital Urea (25 kg) took the place of 1 bag of urea (50 kg) at the first nitrogen application. Some crop plans use Vital Urea at more than 1 stage; follow your crop plan. The first application is when the crop needs the least nitrogen. When comparing the 2 products, look at how much of the nitrogen reaches the crop during the weeks when the crop can use it, not only at the kilograms of nitrogen in each bag.' },
      ]}
      tool="Release starts with the first irrigation"
      wontClaim={['A yield figure.', 'Any laboratory figure for how much nitrogen is released on each day.',  /* D-316: the explaining second sentences removed (Tahir, 26 Oct: no conversational text on the site) */ 'That the coating stops volatilisation.', 'A change in the pH of the field soil as a whole, or in a soil test result. The acidic effect is limited to a zone around each granule during the days it is releasing nitrogen.']}
    ><VitalUreaTool /></Frame>
  )
  if (slug === 'vital-potash') return (
    <Frame
      question="I applied enough fertiliser, but my crops still filled poorly: the cotton dropped its bolls and the grain stayed thin. Why?"
      answers={[
        // Tahir 7 Nov 2026 (PR-19): roles stated as general roles in plants; PR-20: no spray rate, follow the plan.
        { h: 'Potash is needed to fill grain, tubers and fruit', p: 'The crop needs potassium to move the sugar made in its leaves into the grain, tubers or fruit. In plants in general, potassium also strengthens cell walls, which helps them withstand heat, drought and disease.' },
        // Tahir 9 Nov 2026: was "applied at the filling stage ... once the crop has stopped producing new leaves and has started to fill"; the stages are the crop plan's, most often grand growth and maturity.
        { h: 'Vital Potash is applied at the stages each crop plan gives', p: 'Vital Potash contains 11% N and 44% K₂O and is fully water soluble. It is applied in irrigation water, by fertigation or in flood irrigation, at the stages each crop plan gives, most often grand growth and maturity. Its 11% nitrogen gives the plant some nitrogen at these stages, too little to start a new burst of leaf growth.' },
        { h: 'Boron is coated on the granule in 2 forms', p: 'In plants, boron is needed to move sugar to the flowers and to set seed and fruit. This is the role of boron in plants in general. VAN has coated boron onto this potash granule since 2014, on its own coating line, which was developed and built in Pakistan. Each granule carries boron in 2 forms: sodium borate, which releases boron quickly, and calcium borate, which releases it slowly. Because the boron is coated on each potash granule, the boron and the potash cannot separate in the bag, and every application carries both.' },
      ]}
      tool="Potash you apply and potash the crop takes out"
      wontClaim={['A boron percentage. Boron is named, but its amount is not declared.', 'A yield figure, an effect on disease, or an improvement in fruit set.', 'A rate for spraying Vital Potash on the leaves (a foliar rate). Apply it only as your crop plan states.', /* D-317: was "A foliar rate. Foliar is a method the plan names; the rate is the plan’s." */ 'That 2 applications supply all the potash a crop needs in a season. Fusion Potash is the basal potash product, and Vital Potash is applied at the stages each crop plan gives, most often grand growth and maturity.' /* Tahir 9 Nov 2026: was 'applied at the filling stage' */]}
    ><VitalPotashTool /></Frame>
  )
  if (slug === 'green-phosphate') return (
    <Frame
      question="I apply a bag of DAP every year, and the soil test still says phosphorus is low. Where does the phosphate go?"
      answers={[
        // L2 fact check 9 Nov 2026 (W12): the programme did not rate districts; the bands are VAN's scale on district medians. Was '35 of the 36 districts were rated Critical or Weak for available phosphorus.'
        { h: 'In calcareous soil, phosphate reacts with calcium and slowly becomes unavailable to the crop', p: 'In soil above pH 8 that contains free lime, phosphate dissolving from a granule meets calcium within a few centimetres and drops out of solution. The first calcium phosphates that form are still fairly available to the crop. The phosphate becomes unavailable as these compounds slowly change into rock-like forms that the root cannot use. In the Punjab soil testing programme of about 2016 to 2018, the median available phosphorus of 35 of the 36 districts fell in the Critical or Weak band of VAN’s soil-test scale.' },
        { h: 'The soil around each Green Phosphate granule is acidic at first', p: 'Green Phosphate is granulated in an acidic mix and coated with humic material, which contains a small amount of fulvic material. The soil around each Green Phosphate granule is acidic at first, while the soil around a DAP granule stays alkaline. The acidic zone slows the reaction with calcium during the weeks a root needs to reach the granule. The effect is limited to a zone a few centimetres wide around each granule, and it does not change a soil test result.' },
        // L1 7 Nov 2026 (M4): the point of the comparison stated; the humic studies in their own paragraph. "The consistent gain" is left for Tahir (Q4).
        // Tahir 10 Nov 2026 (PR-N13): was "... found that the consistent gain came from organic matter applied with the phosphate (...)".
        // Was: '... carries 16 kg. The crop can use only the phosphate that stays available in the soil, and on calcareous soil that is only part of the phosphate in the bag. On the humic coating, a review ...'
        // L1 editor 10 Nov 2026 (m5): label 'Research on humic material' now 'Research on humic substances'; the humates sentence (PR-N13) is Tahir's wording, left for him (M5).
        // Tahir 10 Nov 2026 (R3-1): the sentence on trials on calcareous soils in Pakistan (Ahmad et al., 2022; Mussarat et al., 2021; Mehdi et al., 2003) dropped; only the Rose et al. 2014 evidence stays.
        { h: 'Phosphate in the bag compared with phosphate available to the crop', p: 'A 50 kg bag of DAP carries 23 kg of P₂O₅, and a 50 kg bag of Green Phosphate carries 16 kg. On calcareous soil the crop can use only the part of this phosphate that stays available in the soil, so the amount in the bag does not show how much each product makes available to the crop.\n\nResearch on humic substances: a review of 81 published studies found that humic substances increased shoot and root growth (Rose et al., 2014, Advances in Agronomy 124).' },
      ]}
      tool="Your district and your bag"
      evidence={<GreenPhosphateTrial />}
      wontClaim={[/* D-324: was 'That it beats DAP or TSP by source alone. The Pakistani field trials do not support that for any source.' and 'A replicated independent field trial. None exists yet.' */ /* Tahir 27 Sep 2026, settled PR-6 (L2 check 9 Nov 2026): was 'That 70 to 80% of applied phosphate is fixed.' */ 'Any figure for the share of applied phosphate that becomes unavailable in the soil.', 'A yield gain over DAP or TSP. The trial above covers 1 season on 1 farm, and TSP was not in it.', 'A field-scale pH change, a soil-test change, or a percentage of phosphate saved.']}
    ><GreenPhosphateTool /></Frame>
  )
  return null
}

export const FLAGSHIP_SLUGS = ['vital-urea', 'vital-potash', 'green-phosphate']
