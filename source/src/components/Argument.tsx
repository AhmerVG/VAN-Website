import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { useFitWidth } from '@/hooks/useFitWidth'
import { NATIONAL, LOSSES, HOME_COPY, ABOUT, LAB, PARTNER, VERIFY, COUNTS } from '@/data/site'
import { PACK_PNG } from '@/data/assets'
import { SOIL_HEADLINE } from '@/data/soilLens'
import { useInView, useReducedMotion, useSectionIndex } from '@/hooks/useInView'
import { scrollToId } from '@/lib/router'

/* ————— The act index: B's pill row, A's rail ————— */
/**
 * The rail names the sections that are actually on the home page. Balance, Productivity, Where it
 * goes and Soil were dropped from it on 10 Sep 2026 with the sections themselves: the argument they
 * belonged to is written once, on /knowledge/why-pakistan-must-shift. A pill pointing at an anchor
 * that is not on the page is a dead control, and the rail is a promise about what is below.
 */
export const ACTS: { id: string; label: string }[] = [
  { id: 'grow', label: 'Grow' }, { id: 'make', label: 'Your Brand' }, { id: 'picture', label: 'The picture' }, { id: 'builds', label: 'Built against it' },
  { id: 'method', label: 'Method' }, { id: 'verify', label: 'Verify' }, { id: 'walk', label: 'Your crop' },
]
export function ActIndex() {
  const { current, progress } = useSectionIndex(ACTS.map(a => a.id))
  useEffect(() => {
    // keep the lit pill in view on narrow screens — scroll the row only, never the page
    const row = document.querySelector<HTMLElement>('.act-index .row')
    const el = row?.querySelector<HTMLElement>(`.act-pill[data-id="${current}"]`)
    if (!row || !el || row.scrollWidth <= row.clientWidth) return
    row.scrollTo({ left: el.offsetLeft - row.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' })
  }, [current])
  return (
    <div className="act-index" aria-label="Act index">
      <div className="wrap row">
        <span className="lbl">On this page</span>
        {ACTS.map((a, i) => (
          <a key={a.id} data-id={a.id} href={`#${a.id}`} className={`act-pill ${current === a.id ? 'on' : ''}`} onClick={e => { e.preventDefault(); scrollToId(a.id) }}>
            <span className="n">{String(i).padStart(2, '0')}</span>{a.label}
          </a>
        ))}
      </div>
      <div className="act-progress"><i style={{ width: `${Math.round(progress * 100)}%` }} /></div>
    </div>
  )
}

/** Numbered kicker — A's, used for the argument only (it encodes a real sequence there). */
export function ActHead({ n, kicker, title, lead, tone = 'navy', right }: { n: string; kicker: string; title: ReactNode; lead?: ReactNode; tone?: 'green' | 'soil' | 'gold' | 'navy' | 'rust'; right?: ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-10 mb-7 lg:mb-9">
      <div className="flex-1 min-w-0">
        <span className={`eyebrow ${tone}`}><span className="k-num">{n}</span>{kicker}</span>
        <h2 className="max-w-[22ch]">{title}</h2>
        {lead && <p className="lead mt-3">{lead}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  )
}

/**
 * NATIONAL STRIP — 10 September 2026, written to end a duplication.
 *
 * The six act-sections below (Picture, Balance, Productivity, WhereItGoes, SoilAct, LossStrip) used
 * to render on the home page AND on /knowledge/why-pakistan-must-shift. Measured with
 * tools/duplication.mjs: 18 whole sentences appeared on both, because both pull the same strings
 * out of NATIONAL. Tahir's standing rule is that an argument is written once and cross-linked.
 *
 * So the argument now lives on the knowledge page only. The home page keeps the four figures the
 * argument turns on, stated as figures, in wording that appears nowhere else on the site. A reader
 * who wants the charts, the sources and the reasoning is one click away; a reader who came for a
 * rate is no longer scrolling past six sections of national statistics to reach it.
 *
 * Every number here is read from NATIONAL and soilLens. Nothing is retyped.
 */
export function NationalStrip() {
  const { ref, inView } = useInView({ threshold: 0.25 })
  const kgha = NATIONAL.usePerHa.rows.find(r => r[0] === 'Pakistan')?.[1] ?? 0
  const world = NATIONAL.usePerHa.rows.find(r => r[0] === 'World average')?.[1] ?? 0
  const wheat = NATIONAL.productivity.rows.find(r => r.crop === 'Wheat')
  const figures: { n: string; unit?: string; cap: string; tone: string }[] = [
    // D-143: was n String(kgha) with unit 'kg/ha' (156) and 'a hectare'. usePerHa now holds kg per acre. Revert: with usePerHa.
    { n: String(Math.round(kgha)), unit: 'kg/acre', tone: 'var(--navy)', cap: `Nutrient Pakistan puts on an acre of cropland in a year. The world average is ${Math.round(world)}. FAO publishes these as 156 and 117 kg a hectare.` },
    { n: '83', unit: ': 1', tone: 'var(--rust)', cap: 'Nitrogen against potash, by tonne. Crops are not fed on one nutrient.' },
    { n: wheat?.perKg ?? '', tone: 'var(--rust)', cap: 'What a kilogram of nutrient returns in wheat now, against the year 2000. Derived.' },
    { n: `≈${NATIONAL.nitrogen.pk}%`, tone: 'var(--soil)', cap: `The share of that nitrogen a crop actually takes up. In the United States it is about ${NATIONAL.nitrogen.us}%.` },
  ]
  return (
    <section className="sec" id="picture" style={{ background: 'var(--sand-2)' }}>
      <div className="wrap">
        <ActHead
          n="01" kicker="The national picture" tone="rust"
          title={<>{NATIONAL.h1a} <span style={{ color: 'var(--rust)' }}>{NATIONAL.h1b}</span></>}
          right={<a className="btn btn-navy" href="#/knowledge/why-pakistan-must-shift">The whole case, with every chart and source →</a>}
        />
        <div ref={ref} className={`ns-row ${inView ? 'on' : ''}`}>
          {figures.map(f => (
            <div key={f.cap} className="ns-fig">
              <div className="ns-n num" style={{ color: f.tone }}>{f.n}{f.unit && <span className="ns-u">{f.unit}</span>}</div>
              <p className="ns-c">{f.cap}</p>
            </div>
          ))}
        </div>
        {/* D-205, 27 Sep 2026: the soil paragraph and its 4 figures went (the Soil door on the home
            page and /soil carry them); the sources paragraph went with the charts it belongs to.
            The block is the 4 figures, the knowledge link and 1 line of sources. Revert: the v61 zip. */}
        <p className="src ns-src">
          4 figures, 4 published sources (Our World in Data / FAO, FAOSTAT, the Pakistan Economic Survey, Lassaletta et&nbsp;al. 2014), each charted and cited on the knowledge page. Derived figures are marked derived. The ground under them, {SOIL_HEADLINE.samples} Punjab samples across {SOIL_HEADLINE.districts} districts, is on <a href="#/soil">the soil page</a>.
        </p>
      </div>
    </section>
  )
}

/**
 * REMOVED 10 September 2026 — Picture, Balance, Productivity, WhereItGoes and SoilAct.
 *
 * These five rendered the national argument on the home page. /knowledge/why-pakistan-must-shift
 * renders the same argument from the same NATIONAL strings, so 18 whole sentences were on both
 * pages. The argument is written once now, on the knowledge page, and the home page carries
 * NationalStrip above: the four figures it turns on, plus the door.
 *
 * The charts themselves were never duplicated — UseChart, BalanceChart, IndexLinesChart,
 * ProductivityTable and UptakeSplit live in components/Charts.tsx and are rendered by
 * pages/Knowledge.tsx. Nothing was lost from the site; one copy of it was.
 */

/* ————— 06 · What VAN builds against it — three losses as one soil strip ————— */
const v = (tx: number, ty: number, delay: number): CSSProperties => ({ ['--tx' as string]: `${tx}px`, ['--ty' as string]: `${ty}px`, animationDelay: `${delay}s` } as CSSProperties)
function StripArt({ active }: { active: number }) {
  const cas = [[-42, -26], [42, -26], [-42, 26], [42, 26], [0, -40], [0, 40]]
  const zone = (i: number) => `loss-zone ${active === i ? '' : 'dim'}`
  return (
    <svg viewBox="0 0 900 210" width="100%" aria-hidden="true" style={{ display: 'block' }}>
      <defs><linearGradient id="soilg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7A5230" stopOpacity=".62" /><stop offset="1" stopColor="#5A3A20" stopOpacity=".75" /></linearGradient></defs>
      <rect x="0" y="0" width="900" height="82" fill="#E6EEE8" />
      <rect x="0" y="82" width="900" height="128" fill="url(#soilg)" />
      <rect x="0" y="78" width="900" height="6" fill="#A9C7A0" />
      {[300, 600].map(x => <line key={x} x1={x} x2={x} y1={0} y2={210} stroke="#fff" strokeDasharray="4 6" opacity=".7" />)}
      {/* zone 1. Nitrogen: up as ammonia, down as nitrate */}
      <g className={zone(0)}>
        {[60, 100, 140, 180, 220, 260].map(x => <circle key={x} cx={x} cy="76" r="4.5" fill="#14231A" />)}
        {[70, 130, 190, 250].map((x, i) => (
          <g key={x} className="a-rise" style={{ animationDelay: `${i * 0.6}s` }}>
            <text x={x} y="70" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2F6B3A" fontFamily="Public Sans, sans-serif">NH₃</text>
            <path d={`M${x - 9} 62 q4 -6 0 -12 q-4 -6 0 -12`} stroke="#2F6B3A" strokeWidth="2" fill="none" opacity=".6" />
          </g>
        ))}
        {[90, 160, 230].map((x, i) => <g key={x} className="a-drip" style={{ animationDelay: `${i * 0.5 + 0.3}s` }}><text x={x} y="104" textAnchor="middle" fontSize="12" fontWeight="700" fill="#E6EEE8" fontFamily="Public Sans, sans-serif">NO₃⁻</text></g>)}
        <text x="12" y="20" fontSize="12" fontWeight="700" fill="#14231A">1 · Nitrogen</text>
        <text x="12" y="36" fontSize="11" fill="#5B6A5E">surface urea · pH 8+ · hot</text>
        <text x="12" y="198" fontSize="11" fill="#fff">down with the irrigation water</text>
      </g>
      {/* zone 2. Phosphate: calcium closes in and locks it */}
      <g className={zone(1)}>
        <text x="312" y="20" fontSize="12" fontWeight="700" fill="#14231A">2 · Phosphate</text>
        <text x="312" y="36" fontSize="11" fill="#5B6A5E">calcareous soil · free calcium</text>
        <g transform="translate(450 140)">
          <circle r="20" fill="#1F4B28" /><text textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="700" fill="#fff" fontFamily="Public Sans, sans-serif">P</text>
          {cas.map(([tx, ty], i) => (
            <g key={i} transform={`translate(${tx * 1.6} ${ty * 1.2})`}>
              <g className="a-close" style={v(-tx * 0.8, -ty * 0.6, i * 0.12)}>
                <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#E8DFD2" stroke="#7A5230" strokeWidth="1.5" />
                <text textAnchor="middle" dominantBaseline="middle" fontSize="8.5" fontWeight="700" fill="#7A5230">Ca</text>
              </g>
            </g>
          ))}
          <g transform="translate(0 -34)"><g className="a-lock"><path d="M-7 0 v-7 a7 7 0 0 1 14 0 v7" fill="none" stroke="#14231A" strokeWidth="3" /><rect x="-10" y="0" width="20" height="13" rx="3" fill="#14231A" /></g></g>
        </g>
        <path d="M350 82 c0 24 -10 34 -6 60 M350 82 c0 -22 -6 -34 -14 -48 M350 82 c0 -26 8 -36 16 -44" stroke="#2F6B3A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M350 100 c20 10 40 18 62 34" className="a-draw-loop" stroke="#F0EEE5" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="120" strokeDashoffset="120" />
        <text x="312" y="198" fontSize="11" fill="#fff">before the root arrives</text>
      </g>
      {/* zone 3. Potash: the root goes looking */}
      <g className={zone(2)}>
        <text x="612" y="20" fontSize="12" fontWeight="700" fill="#14231A">3 · Potash</text>
        <text x="612" y="36" fontSize="11" fill="#5B6A5E">1 kg K for every 83 kg N</text>
        <path d="M700 82 v-30 M700 60 c-9 -4 -13 -11 -14 -18 M700 54 c9 -4 13 -11 14 -18" stroke="#2F6B3A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {['M700 82 c-4 20 -22 30 -44 44 c-10 8 -18 22 -22 40', 'M700 82 c4 22 24 30 44 46 c8 8 14 20 18 36', 'M700 82 c0 30 -6 50 -4 90', 'M700 82 c-10 14 -32 16 -54 18', 'M700 82 c10 16 34 20 62 24', 'M700 82 c30 20 70 30 120 60'].map((d, i) => (
          <path key={i} d={d} className="a-draw-loop" stroke="#F0EEE5" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="220" strokeDashoffset="220" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
        <g className="a-pulse"><circle cx="866" cy="176" r="11" fill="#B0841A" /><text x="866" y="180" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" fontFamily="Public Sans, sans-serif">K</text></g>
        <text x="612" y="198" fontSize="11" fill="#fff">the crop draws on the soil’s potash</text>
      </g>
    </svg>
  )
}
export function LossStrip() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const { ref, inView } = useInView({ threshold: 0.25, once: false })
  const rm = useReducedMotion()
  const run = playing && inView && !rm
  useEffect(() => {
    if (!run) return
    const t = window.setInterval(() => setActive(a => (a + 1) % LOSSES.length), 5200)
    return () => window.clearInterval(t)
  }, [run])
  const pngs = ['urea', 'gphos', 'vpot']
  return (
    <section className="sec" id="builds" style={{ background: 'var(--sand-2)' }}>
      <div className="wrap">
        <ActHead n="02" kicker="What VAN builds against it" title={HOME_COPY.lossesH2} lead={HOME_COPY.lossesLead} tone="soil" right={<a className="btn btn-ghost" href="#/soil#soil-built">All 7, against the soil data →</a>} />
        <div ref={ref} className={`panel overflow-hidden ${inView ? 'on' : ''} ${run ? '' : 'paused'}`}>
          <div className="flex flex-wrap items-center gap-3 px-4 pt-3 pb-2">
            <button className={`btn btn-sm ${run ? 'btn-navy' : 'btn-gold'}`} onClick={() => setPlaying(p => !p)} aria-pressed={playing}>{playing ? '❚❚ Pause' : '▶ Play'}</button>
            <span className="cap" style={{ color: 'var(--gold-text)' }}>▸ Tap a loss to hold it · one cross-section, 3 losses, left to right</span>
            <span className="cap ml-auto">line drawing · {run ? 'animating' : 'paused'}</span>
          </div>
          <div className="strip-scroll"><StripArt active={active} /></div>
          <div className="grid md:grid-cols-3 gap-3 p-4">
            {LOSSES.map((l, i) => (
              <button key={l.n} className={`loss-col ${active === i ? 'on' : ''}`} style={{ ['--zone' as string]: l.colour } as CSSProperties} onClick={() => { setActive(i); setPlaying(false) }} aria-pressed={active === i}>
                <div className="bag"><img src={PACK_PNG[pngs[i]]} alt={l.product} /></div>
                <div className="min-w-0">
                  <div className="cap uppercase tracking-[.1em] font-bold" style={{ color: (l.colour === '#B0841A' || l.colour === '#B97F1C') ? 'var(--gold-text)' : l.colour }}>{l.kicker}</div>
                  <div className="display text-[18px] leading-tight mt-1">{l.title}</div>
                  <p className="small muted mt-1">{l.text}</p>
                  <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--line)' }}>
                    <div className="cap uppercase tracking-[.08em] font-bold" style={{ color: 'var(--navy)' }}>Built against it</div>
                    <div className="font-bold">{l.product} <span className="cap font-normal">· {l.analysis}</span></div>
                    <a href={`#/products/${l.slug}`} className="small font-bold inline-block mt-1" style={{ color: 'var(--navy)' }} onClick={e => e.stopPropagation()}>Read the evidence →</a>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ————— 07 · The method — six stations, a travelling batch token ————— */
const lc = (t: string) => t.charAt(0).toLowerCase() + t.slice(1)
const NODES: { t: string; s: string; body: string[] }[] = [
  { t: 'Research farm', s: `since ${COUNTS.since}`, body: [ABOUT.timeline[1].text, `${ABOUT.stats[1][0]} ${lc(ABOUT.stats[1][1])}`] },
  { t: 'Formulation', s: '17 years of trial data', body: ['What a trial shows sets the formulation. The formulation is then made on VAN’s own plant.', PARTNER.capability[0][1]] },
  { t: 'Plant', s: COUNTS.capacity, body: [ABOUT.stats[2][1], PARTNER.capability[1][1]] },
  { t: 'Laboratory', s: `${COUNTS.lab} · ISO/IEC 17025`, body: [LAB.why1, PARTNER.capability[3][1]] },
  { t: 'PSQCA registration', s: `${COUNTS.licences} licences · ${COUNTS.standards} standards`, body: [`${ABOUT.stats[3][0]} ${lc(ABOUT.stats[3][1])}`, PARTNER.capability[2][1]] },
  { t: 'Certificate with the bag', s: 'on request, no charge', body: [VERIFY.lead, VERIFY.note] },
]
const STEP_MS = 5000
export function MethodJourney() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const { ref, inView } = useInView({ threshold: 0.3, once: false })
  const rm = useReducedMotion()
  const run = playing && inView && !rm
  useEffect(() => {
    if (!run) return
    const t = window.setInterval(() => setActive(a => (a + 1) % NODES.length), STEP_MS)
    return () => window.clearInterval(t)
  }, [run])
  const N = NODES[active]
  // D-151 (QA 5): on a phone the line is drawn at the box's own width (1 unit = 1 px) with numbered
  // stations only; the station's name and figure are the heading under the line. Was W = 960 always,
  // with a 760px minimum width, so its labels rendered at 4 to 9px.
  const fit = useFitWidth(960, 240), narrow = fit.W < 700
  const W = narrow ? fit.W : 960, H = narrow ? 96 : 150
  const sx = (i: number) => narrow ? 22 + i * (W - 44) / (NODES.length - 1) : 80 + i * 160, ly = 62
  return (
    <section className="sec" id="method">
      <div className="wrap">
        {/* ABOUT.chain was the lead here and on /about. The same paragraph on two pages. It belongs on
            /about, where the company describes itself. Here the lead says what the drawing below shows,
            which is what a lead is for. */}
        <ActHead n="03" kicker="The method" title={ABOUT.h1} tone="green"
          lead={<>6 stations. A bag of VAN product passes every one of them before it reaches a dealer, and the batch number printed on it is what ties the bag in your hand back to the day it was made and the analysis that released it. Tap a station to see what happens there.</>}
          right={<a className="btn btn-ghost" href="#/about">How VAN is built →</a>} />
        <div ref={ref} className={`panel p-4 lg:p-6 ${inView ? 'on' : ''} ${run ? '' : 'paused'}`}>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <button className={`btn btn-sm ${run ? 'btn-navy' : 'btn-gold'}`} onClick={() => setPlaying(p => !p)} aria-pressed={playing}>{playing ? '❚❚ Pause' : '▶ Play'}</button>
            <span className="cap" style={{ color: 'var(--gold-text)' }}>▸ Tap a station · the batch travels the line</span>
            <span className="cap ml-auto">Station {active + 1} of {NODES.length}</span>
          </div>
          <div className="journey" ref={fit.ref}>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={narrow ? { minWidth: 0 } : undefined} role="group" aria-label="The method: six stations from the research farm to the certificate">
              <line x1={sx(0)} x2={sx(NODES.length - 1)} y1={ly} y2={ly} stroke="var(--line-2)" strokeWidth="3" />
              <line x1={sx(0)} x2={sx(active)} y1={ly} y2={ly} stroke="var(--green)" strokeWidth="3" style={{ transition: rm ? 'none' : 'x2 1.3s cubic-bezier(.4,.05,.2,1)' }} />
              {NODES.map((n, i) => (
                <g key={n.t} className="station" onClick={() => { setActive(i); setPlaying(false) }} role="button" tabIndex={0} aria-pressed={i === active} aria-label={n.t} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(i); setPlaying(false) } }}>
                  <rect x={sx(i) - (narrow ? (W - 44) / 10 : 78)} y={0} width={narrow ? (W - 44) / 5 : 156} height={H} fill="transparent" />
                  <circle className="st-dot" cx={sx(i)} cy={ly} r={i === active ? 13 : 9} fill={i < active ? 'var(--green)' : i === active ? 'var(--gold)' : '#fff'} stroke={i <= active ? 'var(--navy)' : 'var(--line-2)'} strokeWidth="2.5" style={{ transition: 'r .3s, fill .4s' }} />
                  <text x={sx(i)} y={ly + (narrow ? 4.5 : 5)} textAnchor="middle" fontSize={narrow ? 12 : 11} fontWeight="700" fill={i === active ? 'var(--navy)' : i < active ? '#fff' : 'var(--muted)'} fontFamily="Public Sans, sans-serif">{i + 1}</text>
                  {!narrow && <text x={sx(i)} y={ly + 40} textAnchor="middle" fontSize="13.5" fontWeight="700" fill={i === active ? 'var(--navy)' : 'var(--muted)'}>{n.t}</text>}
                  {!narrow && <text x={sx(i)} y={ly + 58} textAnchor="middle" fontSize="11" fill="var(--muted)" className="num">{n.s}</text>}
                </g>
              ))}
              {/* the batch token. A small drawn bag that travels along the line */}
              <g className="token" aria-hidden="true" style={{ transform: `translate(${sx(active)}px, 0px)` }}>
                <g transform={`translate(0 ${ly - 44})`}>
                  <path d="M-11 -14 h22 l3 5 v22 a3 3 0 0 1 -3 3 h-22 a3 3 0 0 1 -3 -3 v-22z" fill="#fff" stroke="var(--navy)" strokeWidth="2" strokeLinejoin="round" />
                  <rect x="-8" y="-6" width="16" height="9" rx="1.5" fill="var(--navy)" />
                  <text x="0" y="1" textAnchor="middle" fontSize="6" fontWeight="700" fill="#fff" fontFamily="Public Sans, sans-serif">VAN</text>
                  <text x="0" y="11" textAnchor="middle" fontSize="5.5" fill="var(--muted)">batch</text>
                </g>
                <path d={`M0 ${ly - 30} l-4 -6 h8z`} fill="var(--navy)" />
              </g>
            </svg>
          </div>
          <div className="journey-bar mt-1"><i key={`${active}-${run}`} className={run ? 'run' : ''} style={{ ['--dur' as string]: `${STEP_MS}ms`, width: run ? undefined : `${((active + 1) / NODES.length) * 100}%` } as CSSProperties} /></div>
          <div key={active} className="grid lg:grid-cols-[220px_minmax(0,1fr)] gap-4 lg:gap-8 mt-5 items-start a-fade">
            <div><span className="eyebrow" style={{ marginBottom: 4 }}>Station {active + 1} of {NODES.length}</span><h3>{N.t}</h3><div className="cap num mt-1">{N.s}</div></div>
            <div>{N.body.map((p, i) => <p key={i} className={i === 0 ? 'lead' : 'mt-3 small'}>{p}</p>)}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
