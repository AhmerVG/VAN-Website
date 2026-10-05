import { useState } from 'react'
import { SIMULATOR, WA, CONTACT, COUNTS } from '@/data/site'
import { CROPS, shortCropName } from '@/data/catalogue'

/** L4, 24 Sep 2026: two crops shorten to the same name ("Banana" for year 1 and year 2), so a short
 *  name shared by more than one crop falls back to the full name ("Banana, 1st year"). */
const pickerName = (name: string) => CROPS.filter(x => shortCropName(x.name) === shortCropName(name)).length > 1 ? name : shortCropName(name)
import { Stand, familyFor } from '@/components/CropShapes'
import { useReducedMotion } from '@/hooks/useInView'
import { SectionHead, WaButton } from '@/components/bits'
import { DisciplineSimulator } from '@/components/DisciplineSimulator'

/**
 * Crops with a real, functional discipline model behind them (vs. the illustrative teaser below).
 * Potato joined on 9 Sep 2026 when Tahir supplied `Potato Lever Scorecard & Yield Prediction.xlsx` —
 * ten levers of its own, weights summing to 100, with the evidence column filled in. It is NOT
 * wheat's model relabelled: potato has no weed lever, gains hilling and micronutrient levers, and
 * weights seed at 20 and disease at 18 where wheat has 13 and 10.
 */
const LIVE_CROPS: Record<string, string> = { wheat: 'Wheat', potato: 'Potato' }

/** A needle that moves with the dials. No figure is printed anywhere — directions only. */
function Gauge({ slips, max }: { slips: number; max: number }) {
  const rm = useReducedMotion()
  const t = 1 - slips / max // 1 = on course (right), 0 = far off (left)
  const ang = -90 + t * 180 // -90 left … +90 right
  const r = 120, cx = 150, cy = 150
  const arc = (a0: number, a1: number, col: string) => {
    const p = (a: number) => [cx + r * Math.cos((a - 90) * Math.PI / 180), cy + r * Math.sin((a - 90) * Math.PI / 180)]
    const [x0, y0] = p(a0), [x1, y1] = p(a1)
    return <path d={`M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`} stroke={col} strokeWidth="22" fill="none" strokeLinecap="butt" />
  }
  return (
    <svg viewBox="0 0 300 175" width="100%" style={{ maxWidth: 420 }} role="img" aria-label="Discipline dial, directions only">
      {arc(-90, -30, '#9C4E2A')}{arc(-30, 30, 'var(--gold)')}{arc(30, 90, 'var(--green)')}
      <text x="28" y="168" fontSize="12" fontWeight="700" fill="#9C4E2A">OFF COURSE</text>
      <text x="272" y="168" textAnchor="end" fontSize="12" fontWeight="700" fill="var(--green)">ON COURSE</text>
      <g style={{ transform: `rotate(${ang}deg)`, transformOrigin: `${cx}px ${cy}px`, transition: rm ? 'none' : 'transform .8s cubic-bezier(.2,.8,.2,1)' }}>
        <path d={`M${cx} ${cy} L${cx - 7} ${cy} L${cx} ${cy - 108} L${cx + 7} ${cy} Z`} fill="var(--navy)" />
      </g>
      <circle cx={cx} cy={cy} r="14" fill="var(--navy)" stroke="#fff" strokeWidth="4" />
    </svg>
  )
}

/**
 * O-10, 9 Sep 2026. Tahir: "ALREADY BUILD THE CROP LIST THERE AND ONCE ONE PICK THE CROP THE
 * illustrative SIMULATOR CHANGE TO CROP SHAPE WHICH VISUALLY MATCH WITH CROP REAL SHAPE."
 *
 * The old drawing was one generic green stick, used for all twenty-eight programmes. A wheat plant
 * is a spike on a tiller, cotton is a boll that splits, cane is a jointed pole and a date palm is
 * nothing like any of them — showing the same stick for all of them is most of why the preview read
 * as a toy. Fourteen family drawings now cover all twenty-eight; see CropShapes.tsx.
 */

export default function Simulator({ slug }: { slug?: string | null } = {}) {
  const RESET = Object.fromEntries(SIMULATOR.dials.map(d => [d.key, 0]))
  const [sel, setSel] = useState<Record<string, number>>(RESET)
  const [crop, setCrop] = useState<string>('wheat')
  const max = SIMULATOR.dials.reduce((a, d) => a + d.options.length - 1, 0)
  const slips = Object.values(sel).reduce((a, b) => a + b, 0)
  const slipped = SIMULATOR.dials.filter(d => sel[d.key] > 0).map(d => `${d.label.toLowerCase()}, ${d.options[sel[d.key]].toLowerCase()}`)

  if (slug && LIVE_CROPS[slug]) {
    const cropName = LIVE_CROPS[slug]
    return (
      <div>
        <section style={{ background: 'linear-gradient(180deg, var(--gold-soft), var(--sand))' }}>
          <div className="wrap py-8 lg:py-12">
            <p className="cap"><a href="#/crops">Crop Plans</a> / {cropName} / Farm discipline simulator</p>
            <span className="tag tag-gold mt-2">Farm discipline simulator · pilot · {cropName}</span>
            {/* D-151 (ruling 3): was "Nutrition is 1 lever of 10." and the lead "Yield isn't only nutrition. It's whether 10 things were each done well and on time. Set a target, score your season, see what's holding it back." */}
            <h1 className="mt-3 max-w-[26ch]">Nutrition decides about 1/4 of the yield.</h1>
            <p className="lead mt-4">Sowing, seed, water, weeds and pests decide the rest. Set a target, score your season across 10 levers, and see what is holding the yield back.</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a className="btn btn-ghost" href={`#/crops/${slug}`}>← {cropName} crop page</a>
              <a className="btn btn-ghost" href={`#/crops/${slug}#creator`}>Open the {cropName.toLowerCase()} nutrition creator →</a>
            </div>
          </div>
        </section>
        <section className="wrap sec">
          <DisciplineSimulator crop={slug} />
        </section>
        <section className="wrap sec-tight">
          <div className="panel-navy p-6 lg:p-10 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <span className="eyebrow" style={{ color: 'var(--gold)' }}>A plan for your own field</span>
              <h2 className="text-[clamp(26px,2.6vw,34px)]">Want VAN's agronomy team to score your actual field?</h2>
              <p className="mt-3" style={{ color: 'rgba(255,255,255,.8)' }}>Send your soil analysis, your district and what you've done so far this season.</p>
            </div>
            <div className="grid gap-3">
              <WaButton href={WA.farmer} lg>Ask on WhatsApp</WaButton>
              <a className="btn btn-lg" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }} href={`mailto:${CONTACT.cropEmail}?subject=${encodeURIComponent(cropName + ' discipline scorecard')}`}>{CONTACT.cropEmail}</a>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <section style={{ background: 'linear-gradient(180deg, var(--gold-soft), var(--sand))' }}>
        <div className="wrap py-8 lg:py-12">
          <span className="tag tag-gold">{SIMULATOR.kicker}</span>
          {/* D-136: the ruling-3 sentence is 2 sentences long, so the h1 is set smaller and wider than the
              site default to stay at 4 to 5 lines on a phone. Revert: className "mt-3 max-w-[20ch]", no style. */}
          <h1 className="mt-3 max-w-[30ch]" style={{ fontSize: 'clamp(28px, 3.6vw, 48px)', lineHeight: 1.1 }}>{SIMULATOR.h1}</h1>
          <p className="lead mt-4">{SIMULATOR.lead}</p>
          {Object.keys(LIVE_CROPS).length > 0 && (
            <p className="mt-3 small"><b>Wheat and potato are live</b>. <a href="#/simulator/wheat">wheat →</a> · <a href="#/simulator/potato">potato →</a></p>
          )}
          {/* His ruling: say beta, say when, and ask for what is missing before the next upgrade. */}
          <p className="small mt-2 max-w-[140ch]">{SIMULATOR.betaNote}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <WaButton href={WA.farmer} lg>Tell us which crop you want next</WaButton>
            <a className="btn btn-ghost btn-lg" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('VAN Yield & Discipline Simulator')}`}>Write to {CONTACT.email}</a>
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <SectionHead eyebrow="Discipline dial · preview" title="Move the practices. Watch the needle and the row." lead={SIMULATOR.previewNote} tone="gold" />
        {/* O-10: the crop list Tahir asked for. Picking a crop redraws the stand as that crop, and
            says plainly whether that crop has a real simulator yet or only this preview, so nobody
            reads the preview as the product. */}
        <div className="panel p-4 lg:p-5 mb-3">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <span className="eyebrow navy">Pick your crop</span>
            <span className="cap">{Object.keys(LIVE_CROPS).length} live · {CROPS.length - Object.keys(LIVE_CROPS).length} in build</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2" role="radiogroup" aria-label="Crop">
            {CROPS.map(c => {
              const key = c.page.replace(/\.html$/, '')
              const on = crop === key
              return (
                <button key={key} role="radio" aria-checked={on} onClick={() => setCrop(key)}
                  className={`chip chip-xs ${on ? 'on' : ''}`}>
                  {pickerName(c.name)}{LIVE_CROPS[key] && <span aria-hidden="true"> ●</span>}
                </button>
              )
            })}
          </div>
          <p className="cap mt-2">
            {LIVE_CROPS[crop]
              ? <><b>{LIVE_CROPS[crop]} has a working simulator.</b> 10 levers, its own weights, your own season. <a href={`#/simulator/${crop}`}>Open it →</a></>
              : <>This crop does not have its own lever set yet, so what you see below is the preview. Its simulator is in build.</>}
          </p>
        </div>
        <div className="panel p-5 lg:p-8 grid lg:grid-cols-[1fr_1fr] gap-8 items-start" style={{ borderColor: 'var(--gold)', borderWidth: 2 }}>
          <div className="grid gap-4">
            {SIMULATOR.dials.map(d => (
              <div key={d.key}>
                <div className="font-bold mb-2">{d.label}</div>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={d.label}>
                  {d.options.map((o, i) => <button key={o} role="radio" aria-checked={sel[d.key] === i} className={`chip ${sel[d.key] === i ? (i === 0 ? 'green on' : 'on') : ''}`} onClick={() => setSel(s => ({ ...s, [d.key]: i }))}>{o}</button>)}
                </div>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm self-start" onClick={() => setSel(RESET)}>Reset. Every practice in its window</button>
          </div>
          <div>
            <div className="flex items-baseline justify-between"><span className="eyebrow">Attainable yield</span><span className="tag tag-gold">illustrative</span></div>
            <Gauge slips={slips} max={max} />
            <p className="cap text-center" style={{ marginTop: -4 }}>directions only · no figure is printed</p>
            {/* The stand thins with the seed-and-stand dial and pales when water or nitrogen slipped,
                so the drawing is driven by the reader's own answers rather than decorating them. */}
            <Stand
              family={familyFor(crop)}
              count={sel.seed >= 2 ? 3 : 6}
              stressed={sel.irrigation >= 2 || sel.topdress >= 2 || sel.basal >= 2}
              className="mt-2"
            />
            <div className="panel-soft p-4 mt-3">
              {slips === 0
                ? <p className="font-semibold" style={{ color: 'var(--green-text)' }}>{SIMULATOR.onCourse}</p>
                : <p className="small"><b>Direction only.</b> {slipped.length} practice{slipped.length > 1 ? 's' : ''} outside {slipped.length > 1 ? 'their windows' : 'its window'}: {slipped.join('; ')}. The needle moves down; the simulator will print what each one costs, and the way back, when it opens.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SectionHead eyebrow="How it works" title="8 things you tell it. 5 things it tells you." tone="navy" />
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="panel p-5"><h3>Your field, as it is</h3><ol className="grid gap-2 mt-3 pl-0 list-none">{SIMULATOR.inputs.map((t, i) => <li key={t} className="flex gap-3 small"><span className="num shrink-0 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--sky)', color: 'var(--navy)' }}>{i + 1}</span><span>{t}</span></li>)}</ol></div>
          <div className="panel p-5"><h3>Your yield, your score, your plan</h3><ol className="grid gap-2 mt-3 pl-0 list-none">{SIMULATOR.outputs.map((t, i) => <li key={t} className="flex gap-3 small"><span className="num shrink-0 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold)', color: 'var(--navy)' }}>{i + 1}</span><span>{t}</span></li>)}</ol></div>
        </div>
      </div></section>

      <section className="wrap sec">
        <SectionHead eyebrow="What it is built on" title="The figures come from ground VAN owns and samples VAN read." lead="Every figure it prints carries its source: VAN’s own trials first, published Pakistani research with its citation second." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[...SIMULATOR.builtOn, [`${CROPS.length} crop programmes`, 'already on this site, product by stage, with their PDF sheets'], [COUNTS.lab, 'the PNAC-accredited laboratory that tests the batches the plan names']].map(([v, l]) => <div key={v} className="panel p-5"><div className="num text-[30px]" style={{ color: 'var(--navy)' }}>{v}</div><p className="small muted mt-2">{l}</p></div>)}
        </div>
        <div className="panel-navy p-6 lg:p-8 mt-8 grid lg:grid-cols-[1fr_auto] gap-5 items-center">
          <div><span className="eyebrow" style={{ color: 'var(--gold)' }}>Your crop next</span><h3>Wheat and potato run today. Tell us which crop you want next.</h3><p className="mt-2" style={{ color: 'rgba(255,255,255,.8)' }}>Leave your crop and district on WhatsApp or by email and we tell you when your crop is added.</p></div>
          <div className="grid gap-3"><WaButton href={WA.farmer} lg>WhatsApp {CONTACT.whatsapp}</WaButton><a className="btn" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }} href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('VAN Yield & Discipline Simulator')}`}>{CONTACT.email}</a></div>
        </div>
      </section>
    </div>
  )
}
