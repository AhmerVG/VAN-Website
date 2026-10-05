import { useState } from 'react'
import { Ur } from '@/components/Ur'
import { CROPS, type Crop } from '@/data/catalogue'
import { WA } from '@/data/site'
import { SeasonRing, SowingNowNext } from '@/components/SeasonRing'
import { CropPicker } from '@/components/CropPicker'
import { cropSlug, cropPdf, groupedCrops, GROUP_COLOUR, sowingLabel, parseSowing, inWindow, MONTHS, MONTHS_LONG, currentMonth } from '@/lib/season'
import { LiveCalcTag } from '@/components/bits'
import { LIVE_CALC_CROPS, hasCalculator } from '@/data/costPlans'

/** A's sowing-calendar matrix: 28 rows × 12 months, windows parsed from the published sowing text; this month marked. */
function Calendar({ filter }: { filter: string }) {
  const now = currentMonth()
  const groups = groupedCrops().filter(g => filter === 'ALL' || g.group === filter)
  const open = (c: Crop) => { window.location.hash = `#/crops/${cropSlug(c)}` }
  return (
    <div className="overflow-x-auto pb-2">
      <div className="cal panel" style={{ overflow: 'hidden' }}>
        <div className="c hd">Crop</div><div className="c hd">Programme</div>
        {MONTHS.map((m, i) => <div key={m} className={`c hd m ${i === now ? 'now' : ''}`}>{m}</div>)}
        <div className="c hd">PDF</div>
        {groups.map(g => (
          <div key={g.group} style={{ display: 'contents' }}>
            <div className="c grp" style={{ gridColumn: '1 / -1' }}><i style={{ width: 12, height: 12, borderRadius: 3, background: GROUP_COLOUR[g.group], display: 'inline-block', marginRight: 8 }} />{g.label} <span className="cap ml-2 num font-normal">{g.crops.length}</span></div>
            {g.crops.map(c => {
              const wins = parseSowing(c.sowing)
              return (
                <div key={c.name} className="cal-row" role="link" tabIndex={0} onClick={() => open(c)} onKeyDown={e => { if (e.key === 'Enter') open(c) }} title={`${c.name}, ${c.sowing}`}>
                  <div className="c font-bold" style={{ color: 'var(--navy)' }}>{c.name}</div>
                  <div className="c cap">{c.programme}</div>
                  {MONTHS.map((m, i) => {
                    const on = wins.some(w => inWindow(w, i))
                    const st = on && !wins.some(w => inWindow(w, (i + 11) % 12)), en = on && !wins.some(w => inWindow(w, (i + 1) % 12))
                    return <div key={m} className={`c m ${i === now ? 'now' : ''}`}>{on && <span className={`win ${st ? 's' : ''} ${en ? 'e' : ''}`} style={{ background: GROUP_COLOUR[g.group] }} />}</div>
                  })}
                  <div className="c"><a className="font-bold" style={{ color: 'var(--navy)' }} href={cropPdf(c)} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}>PDF ↓</a></div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Crops() {
  const [sel, setSel] = useState<Crop | null>(null)
  const [view, setView] = useState<'ring' | 'calendar'>('ring')
  const [filter, setFilter] = useState<string>('ALL')
  const groups = groupedCrops()
  const now = currentMonth()
  // D-144, owner's ruling 1: the crops with a live calculator come first, in their own section, each
  // tagged; every other crop keeps its place in its group after them. The sowing calendar above is a
  // calendar and keeps the crop-group order. Revert: map `groups` over CROPS again and delete `live`.
  const live = LIVE_CALC_CROPS.map(sl => CROPS.find(c => cropSlug(c) === sl)).filter(Boolean) as Crop[]
  const rest = groupedCrops(CROPS.filter(c => !hasCalculator(cropSlug(c))))
  const card = (c: Crop, colour: string) => {
    const slug = cropSlug(c)
    return (
      <article key={c.name} className="panel p-5 flex flex-col" style={{ borderTop: `6px solid ${colour}` }}>
        <h3 className="text-[22px]"><Ur kind="crop" en={c.name} /></h3>
        <div className="flex flex-wrap gap-2 mt-3"><span className="tag tag-sky">{sowingLabel(c)} sowing</span><span className="tag tag-green">{c.programme}</span>{hasCalculator(slug) && <LiveCalcTag />}</div>
        <div className="flex flex-wrap gap-2 mt-auto pt-5">
          <a className="btn btn-navy btn-sm" href={`#/crops/${slug}`}>Open the programme →</a>
          <a className="btn btn-ghost btn-sm" href={cropPdf(c)} target="_blank" rel="noopener">PDF ↓</a>
        </div>
      </article>
    )
  }
  return (
    <div className="wrap py-8 lg:py-12">
      <span className="eyebrow">Crop plans</span>
      <h1>{CROPS.length} programmes. Per acre, stage by stage. Free.</h1>
      <p className="lead mt-4">Sowing windows, nutrient needs, and stage-by-stage programmes for {CROPS.length} crops. Every one transcribed from VAN’s published plan, with the PDF a tap away. On sugarcane (February planting), the land preparation row follows VAN’s updated calculator and the published PDF is being reissued.</p>

      <div className="flex flex-wrap items-center gap-2 mt-7">
        <div className="flex gap-1 p-1 rounded" style={{ background: 'var(--sand-2)' }} role="tablist" aria-label="View">
          <button role="tab" aria-selected={view === 'ring'} className={`chip chip-sm ${view === 'ring' ? 'on' : ''}`} style={{ borderColor: 'transparent' }} onClick={() => setView('ring')}>Season ring</button>
          <button role="tab" aria-selected={view === 'calendar'} className={`chip chip-sm ${view === 'calendar' ? 'on' : ''}`} style={{ borderColor: 'transparent' }} onClick={() => setView('calendar')}>Sowing calendar</button>
        </div>
        {view === 'calendar' && (
          <div className="flex flex-wrap gap-2 items-center ml-0 lg:ml-3" role="group" aria-label="Group">
            <button className={`chip chip-xs ${filter === 'ALL' ? 'on' : ''}`} onClick={() => setFilter('ALL')}>All</button>
            {groups.map(g => <button key={g.group} className={`chip chip-xs ${filter === g.group ? 'on' : ''}`} onClick={() => setFilter(filter === g.group ? 'ALL' : g.group)} aria-pressed={filter === g.group}><i style={{ width: 10, height: 10, borderRadius: 3, background: GROUP_COLOUR[g.group] }} />{g.label} <span className="cap">{g.crops.length}</span></button>)}
            <span className="cap ml-auto flex items-center gap-2"><i style={{ width: 22, height: 10, background: 'var(--green)', display: 'inline-block', borderRadius: 5 }} /> sowing window, in the group’s colour <i className="ml-2" style={{ width: 2, height: 14, background: 'var(--navy)', opacity: .5, display: 'inline-block' }} /> this month · {MONTHS_LONG[now]}</span>
          </div>
        )}
      </div>

      {view === 'ring' ? (
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6 mt-5 items-start">
          <div className="panel p-4 lg:p-6 lg:sticky lg:top-20">
            <div className="flex items-baseline justify-between gap-3 mb-2"><div className="display text-[20px]">The sowing year</div><div className="cap">▸ tap a month or an arc</div></div>
            <SeasonRing size={540} className="mx-auto" onSelect={setSel} />
            {sel && <div className="panel-gold p-4 mt-2 flex items-center gap-3"><i style={{ width: 12, height: 12, borderRadius: 3, background: GROUP_COLOUR[sel.group] }} /><span className="font-bold flex-1">{sel.name} · {sowingLabel(sel)} · {sel.programme}</span><a className="btn btn-navy btn-sm" href={`#/crops/${cropSlug(sel)}`}>Open →</a></div>}
          </div>
          <div className="grid gap-6">
            <div className="panel p-5"><SowingNowNext /></div>
            <div className="panel p-5"><div className="font-bold mb-3">Find your crop</div><CropPicker big={false} /></div>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <p className="cap mb-2" style={{ color: 'var(--gold-text)' }}>▸ Tap a row to open the programme · a window such as Dec–Feb wraps the year</p>
          <Calendar filter={filter} />
          <p className="src"><b>Note ·</b> Sowing windows are read from each programme’s published sowing line (for example “Mar–Apr / Aug–Sep sowing”) and drawn as bars. Programme tags are the nutrient emphasis printed on the plan. Rates, methods and pack sizes are in the PDFs and, for wheat, transcribed on <a href="#/crops/wheat">the wheat page</a>.</p>
        </div>
      )}

      <section className="mt-12" id="live">
        <div className="flex flex-wrap items-center gap-3 mb-2"><h2 className="text-[clamp(24px,2.4vw,31px)]">With a live calculator</h2><span className="cap">{live.length}</span></div>
        <p className="small muted mb-4 max-w-[140ch]">Set your acres and the plan scales, adjusts to your soil report, and prices itself when you ask. The programme and its PDF are on each page as well.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {live.map(c => card(c, GROUP_COLOUR[c.group]))}
        </div>
      </section>

      {rest.map(g => (
        <section key={g.group} className="mt-12">
          <div className="flex items-center gap-3 mb-4"><i style={{ width: 16, height: 16, borderRadius: 4, background: GROUP_COLOUR[g.group] }} /><h2 className="text-[clamp(24px,2.4vw,31px)]">{g.label}</h2><span className="cap">{g.crops.length}</span></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {g.crops.map(c => card(c, GROUP_COLOUR[g.group]))}
          </div>
        </section>
      ))}

      <div className="panel-green p-6 lg:p-8 mt-12 grid lg:grid-cols-[1fr_auto] gap-5 items-center">
        <div>
          <h3>These programmes are transcribed from VAN’s published crop nutrition plans.</h3>
          <p className="muted mt-2">They are per-acre guidelines. Adjust to your own soil test and local conditions. A PDF of each plan downloads from its card. For a plan against your own field, ask on WhatsApp.</p>
        </div>
        {/* D-192: quiet link (D-60). */}
        <a className="btn btn-ghost" href={WA.farmer} target="_blank" rel="noopener">Ask on WhatsApp</a>
      </div>
    </div>
  )
}
