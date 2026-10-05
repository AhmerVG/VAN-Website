import { useMemo, useState } from 'react'
import { CROPS, CROP_PLANS, shortCropName } from '@/data/catalogue'
import { REGIONAL_PROFILES } from '@/data/regionalSoil'
import { SOIL_BAND_LABEL } from '@/data/soilThresholds'
import { removalFor, KG_PER_MAUND } from '@/data/removal'
import { cropSlug } from '@/lib/season'

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
 */

const fmt = (n: number) => n >= 100 ? Math.round(n).toLocaleString('en-PK') : n >= 10 ? n.toFixed(0) : n.toFixed(1)

/* ─────────────────────────── shared frame ─────────────────────────── */
function Frame({ question, answers, children, wontClaim, tool }: {
  question: string
  answers: { h: string; p: string }[]
  children: React.ReactNode
  tool: string
  wontClaim: string[]
}) {
  return (
    <section className="fs" aria-label="Why a grower picks it">
      <div className="fs-q">
        <span className="eyebrow gold">Flagship · a grower’s question</span>
        <h2 className="fs-qh">{question}</h2>
      </div>
      <div className="fs-answers">
        {answers.map((a, i) => (
          <div key={a.h} className="fs-a">
            <span className="fs-n num">{i + 1}</span>
            <h3 className="fs-ah">{a.h}</h3>
            <p className="small mt-2">{a.p}</p>
          </div>
        ))}
      </div>
      <div className="fs-tool">
        <span className="eyebrow">{tool}</span>
        {children}
      </div>
      <div className="fs-wont">
        <span className="cap" style={{ fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>What VAN will not claim for it</span>
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
        <label className="fs-lab" htmlFor="fs-vu-bags">Bags of Vital Urea on 1 acre (25 kg)</label>
        <div className="fs-row">
          <input id="fs-vu-bags" type="number" min="0" max="20" step="0.5" inputMode="decimal" className="input input-sm" style={{ width: 110 }} value={bags} onChange={e => setBags(Math.min(20, Math.max(0, Number(e.target.value) || 0)))} />
          <span className="small">= <b className="num">{fmt(n)} kg</b> nitrogen and <b className="num">{fmt(s)} kg</b> sulfur, from the declared analysis</span>
        </div>
        <div className="fs-row mt-4">
          <button type="button" className={`btn btn-sm ${watered ? 'btn-navy' : 'btn-gold'}`} onClick={() => setWatered(w => !w)}>{watered ? 'Before the first water' : 'Give the first water'}</button>
          <span className="cap">{watered ? 'After the first irrigation or rain' : 'Nothing happens to a coated granule until water reaches it'}</span>
        </div>
        <p className="cap mt-3">How it works, not a measurement. No day figures are drawn because VAN has no laboratory release curve, and says so on this page.</p>
      </div>
      <svg viewBox="0 0 520 200" className="fs-svg" role="img" aria-label="Plain urea dissolves in the first water at once; coated urea releases in steps over weeks">
        <rect width="520" height="200" fill="var(--paper)" />
        <text x="16" y="24" fontSize="12" fontWeight="700" fill="var(--navy)" fontFamily="Public Sans, sans-serif">Plain urea</text>
        <text x="16" y="112" fontSize="12" fontWeight="700" fill="var(--navy)" fontFamily="Public Sans, sans-serif">Vital Urea, sulfur coated</text>
        {/* time axis */}
        <line x1="16" y1="186" x2="504" y2="186" stroke="var(--line-2)" />
        <text x="16" y="198" fontSize="10" fill="var(--muted)" fontFamily="Public Sans, sans-serif">first water</text>
        <text x="504" y="198" fontSize="10" fill="var(--muted)" textAnchor="end" fontFamily="Public Sans, sans-serif">weeks later</text>
        {/* plain urea: one tall bar at the first water, then nothing */}
        <g opacity={watered ? 1 : 0.2}>
          <rect x="16" y="34" width="40" height="56" fill="var(--rust)" />
          <text x="62" y="60" fontSize="11" fill="var(--muted)" fontFamily="Public Sans, sans-serif">everything is exposed at once: to the crop, the air and the water</text>
        </g>
        {!watered && <text x="62" y="60" fontSize="11" fill="var(--muted)" fontFamily="Public Sans, sans-serif">dry granules, nothing exposed yet</text>}
        {/* coated: steps of falling height across the axis, no numbers */}
        <g opacity={watered ? 1 : 0.2}>
          {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x={16 + i * 80} y={122 + i * 8} width="40" height={56 - i * 8} fill="var(--green)" />)}
          <text x="62" y="176" fontSize="11" fill="var(--muted)" fontFamily="Public Sans, sans-serif" />
        </g>
        {watered && <text x="330" y="140" fontSize="11" fill="var(--muted)" fontFamily="Public Sans, sans-serif">released in steps, as the coating breaks down</text>}
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
        <p className="small mt-3">The published {name.toLowerCase()} programme puts Vital Potash on at <b>{stages.join(' and ') || 'no stage'}</b>{rows[0] ? <>, by {rows[0].method.toLowerCase()}, {rows.map(r => r.rate).join(' and ')}</> : null}. That is the fill window: the stage where the crop stops growing leaf and starts filling grain, tuber or fruit.</p>
        <div className="fs-row mt-4">
          <label htmlFor="fs-vp-bags" className="small">Bags (20 kg) on 1 acre</label>
          <input id="fs-vp-bags" type="number" min="0" max="20" step="0.5" inputMode="decimal" className="input input-sm" style={{ width: 90 }} value={bags} onChange={e => setBags(Math.max(0, Number(e.target.value) || 0))} />
          <label htmlFor="fs-vp-maunds" className="small">Yield you expect, maunds an acre</label>
          <input id="fs-vp-maunds" type="number" min="0" max="2000" step="5" inputMode="decimal" className="input input-sm" style={{ width: 90 }} value={maunds} onChange={e => setMaunds(Math.max(0, Number(e.target.value) || 0))} />
        </div>
      </div>
      <div className="fs-bars">
        <div className="fs-bar"><span>You put on, K₂O</span><i style={{ width: `${Math.min(100, k / Math.max(k, grainK ?? 1, (grainK ?? 0) + (strawK ?? 0)) * 100)}%`, background: 'var(--green)' }} /><b className="num">{fmt(k)} kg</b></div>
        {grainK !== null ? (
          <>
            <div className="fs-bar"><span>{fmt(tonnes)} t of {name.toLowerCase()} grain takes off</span><i style={{ width: `${Math.min(100, grainK / Math.max(k, grainK, grainK + (strawK ?? 0)) * 100)}%`, background: 'var(--gold)' }} /><b className="num">{fmt(grainK)} kg</b></div>
            {strawK !== null && <div className="fs-bar"><span>with the {rem?.residue?.label.toLowerCase()} taken off too</span><i style={{ width: `${Math.min(100, (grainK + strawK) / Math.max(k, grainK + strawK) * 100)}%`, background: 'var(--soil)' }} /><b className="num">{fmt(grainK + strawK)} kg</b></div>}
            <p className="cap mt-2">Removal per tonne from IPNI’s tables, the same source as the crop page’s balance block; no Pakistani removal table exists on the public record. Your bags also carry {fmt(n)} kg of nitrogen. 1% of all nutrient applied in Pakistan is potash, as the Crop Force bag prints.</p>
          </>
        ) : (
          <p className="cap mt-2">No published removal figure for {name.toLowerCase()} on this site, so only your own bags are shown. Your bags also carry {fmt(n)} kg of nitrogen. 1% of all nutrient applied in Pakistan is potash, as the Crop Force bag prints.</p>
        )}
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
            The survey’s typical {d.name} field reads <b>pH {ph?.toFixed(2)}</b>{pBand ? <> and phosphorus <b>{SOIL_BAND_LABEL[pBand]}</b></> : null}, from {d.n.toLocaleString('en-PK')} samples.
            {ph !== undefined && ph >= 7.5 ? ' Above pH 7.5 with free lime, phosphate that dissolves out of a granule meets calcium within a few centimetres and drops out of solution before a root reaches it. That is where a bag of DAP goes.' : ' At this pH calcium fixation is slower; the acidic microsite still matters on limed ground.'}
            {' '}<a href="#/soil">Read the whole district on the Soil Atlas.</a>
          </p>
        ) : <p className="small mt-3 muted">Pick your district and the page reads the Punjab survey’s median for it. A district median is not your field.</p>}
      </div>
      <div>
        <div className="fs-row">
          <span className="small">Bag</span>
          {[50, 35].map(b => <button key={b} type="button" className={`btn btn-sm ${bag === b ? 'btn-navy' : 'btn-ghost'}`} onClick={() => setBag(b as 50 | 35)}>{b} kg</button>)}
        </div>
        <p className="small mt-3">1 bag of {bag} kg carries <b className="num">{fmt(p2o5)} kg P₂O₅</b> and <b className="num">{fmt(nKg)} kg N</b>, from the declared 6-32-0. The same 50 kg of TSP carries 23 kg P₂O₅ and no nitrogen, and no coating. On the crop page you can switch between them; the plan’s bag count does not change on a switch, on purpose.</p>
        <svg viewBox="0 0 320 120" className="fs-svg" role="img" aria-label="One granule with an acidic zone around it in alkaline soil">
          <rect width="320" height="120" fill="#EFE6DA" />
          <text x="10" y="18" fontSize="11" fill="var(--soil)" fontFamily="Public Sans, sans-serif">calcareous soil{ph ? `, pH ${ph.toFixed(1)}` : ', above pH 8'}</text>
          <circle cx="160" cy="66" r="42" fill="var(--gold-soft)" opacity=".9" />
          <circle cx="160" cy="66" r="14" fill="var(--soil)" />
          <circle cx="160" cy="66" r="18" fill="none" stroke="var(--green)" strokeWidth="3" />
          <text x="160" y="118" fontSize="10.5" fill="var(--muted)" textAnchor="middle" fontFamily="Public Sans, sans-serif">acidic zone around the granule, a few centimetres, not the field</text>
        </svg>
      </div>
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
      question="I put 2 bags of urea on and the field goes yellow again in 3 weeks. Where did it go?"
      answers={[
        { h: 'A bag of urea has 3 claimants', p: 'The crop, the air and the water. Plain urea dissolves in the first irrigation and everything is exposed at once. Above pH 8 a share leaves as ammonia gas; what dissolves moves down with the water past the root. The farmer paid for all of it.' },
        { h: 'The coating limits how much is exposed at once', p: 'Plain urea inside, fine elemental sulfur outside, held by a binder. Nothing happens until water reaches the granule. Then the coating breaks down in steps and the nitrogen is released over weeks, so the crop meets it while it is still there.' },
        { h: 'Half the weight, and more grain, in 3 maize trials', p: 'In maize trials at Rafhan Maize Products (2022, joint), Descon Research Farm (2024, joint) and an independent partner farm (2025, not named), 25 kg of Vital Urea in place of 50 kg of urea at each application gave 5 to 15% more grain with less nitrogen applied. Do not compare kilograms. Compare what reaches the crop in the weeks it can use it.' },
      ]}
      tool="Count from the water"
      wontClaim={['A yield figure beyond the 3 maize trials on this page. Other crops carry no figure until their own trials are named.', 'A laboratory release curve with days on it. VAN has none, so the picture above has no numbers.', 'That the coating stops volatilisation. It limits what is exposed at once; it does not change the soil.', 'A soil pH or soil test change. The acid effect is a zone around each granule for the weeks it is releasing.']}
    ><VitalUreaTool /></Frame>
  )
  if (slug === 'vital-potash') return (
    <Frame
      question="I fed the crop well and it still filled light. The bolls dropped, the grain stayed thin. Why?"
      answers={[
        { h: 'The crop grows on nitrogen and fills on potash', p: 'Potash moves the sugar the leaf makes into the grain, the tuber or the fruit, and thickens the cell wall against heat, drought and disease. Pakistan applies about 1 kg of potash for every 83 kg of nitrogen.' },
        { h: 'Made for the fill window', p: 'N 11, K₂O 44, fully water soluble. It goes on at grand growth and maturity, through the fertigation or flood water, when the crop has stopped building leaf and started filling. The small nitrogen share keeps the plant working through fill without pushing new leaf.' },
        { h: 'Boron rides on the granule, in 2 forms', p: 'Boron carries sugar to the flower and sets the seed and the fruit. Since 2014 VAN has coated it onto the potash granule on its own line, developed and built locally, in 2 forms on 1 granule: sodium borate for fast action and calcium borate for slow release. It lands where the potash lands and cannot separate in the bag. Named, never numbered, because no figure is on the bag.' },
      ]}
      tool="Your potash account"
      wontClaim={['A boron percentage. None is printed on the pack.', 'A yield figure, a disease or immunity effect, or a fruit-setting claim.', 'A foliar rate. Foliar is a method the plan names; the rate is the plan’s.', 'That 2 applications are the season’s whole potash. Fusion Potash is the basal line; this is the fill line.']}
    ><VitalPotashTool /></Frame>
  )
  if (slug === 'green-phosphate') return (
    <Frame
      question="A bag of DAP every year and the soil test still says phosphorus is low. Where does it go?"
      answers={[
        { h: 'Calcareous soil takes the phosphate back', p: 'In soil above pH 8 with free lime, phosphate dissolving out of a granule meets calcium within a few centimetres and drops out of solution. The first calcium phosphates are still fairly available; the loss is their slow ageing into rock-like forms the root cannot use. 35 of 36 Punjab districts read Critical or Weak on phosphorus.' },
        { h: 'The granule carries its own acidic zone', p: 'Green Phosphate is granulated in an acidic mix and sealed with humic, with a fraction of fulvic. The zone around each granule starts acidic, the opposite of a DAP granule, which slows the calcium reaction for the weeks a root needs to reach it. A microsite effect, a few centimetres wide. It will not move a soil test.' },
        { h: 'Do not compare kilograms; compare what reaches the crop', p: 'A 50 kg bag of DAP carries more phosphate than a 50 kg bag of Green Phosphate. What the crop eats is what stays available, and on calcareous ground that is the smaller number by far. The humic seal, with a fraction of fulvic, feeds the soil and the root: across 81 published studies humic raised shoot and root growth, and Pakistani calcareous-soil trials found the consistent gain came from organic matter applied with the phosphate (Rose et al. 2014, Advances in Agronomy 124; Ahmad et al. 2022; Mussarat et al. 2021; Mehdi et al. 2003). VAN makes phosphate to be available, and that is the comparison that matters.' },
      ]}
      tool="Your district, and your bag"
      wontClaim={['That 70 to 80% of applied phosphate is fixed. That was a recovery statistic misread as soil chemistry, and it is off the site.', 'That it beats DAP or TSP by source alone. The Pakistani field trials do not support that for any source.', 'A field-scale pH change, a soil-test change, or a percentage of phosphate saved.', 'A replicated independent field trial. None exists yet.']}
    ><GreenPhosphateTool /></Frame>
  )
  return null
}

export const FLAGSHIP_SLUGS = ['vital-urea', 'vital-potash', 'green-phosphate']
