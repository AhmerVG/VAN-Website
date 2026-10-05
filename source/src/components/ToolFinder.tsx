import { useMemo, useState } from 'react'
import { TOOLS, TOPICS, TOOL_STATE_LABEL, TOOL_STATE_COLOUR, TOOL_STATE_NOTE, type Tool, type ToolState, type Topic } from '@/data/tools'

/**
 * THE TOOL FINDER — 10/11 September 2026.
 *
 * Tahir: "the page is too dense to find a tool."
 *
 * So this is a finder, not a list. Three controls, all above the results: a search box that reads
 * the name, the one-line answer and the detail; a row of topic chips; and a switch for the tools
 * that are not built yet, which is off when the page opens. Each control shows the count it would
 * produce before you press it, which is the one thing that stops a filter being a guess. One
 * "Clear" resets all three.
 *
 * A tile carries a name, one line and a state. The paragraph — what it really does and where it
 * stops — is behind "What it does", because the honesty was never the problem; being made to read
 * all twenty-three paragraphs to find one tool was.
 */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ')

function match(t: Tool, q: string, topic: Topic | null, building: boolean) {
  if (!building && t.state === 'building') return false
  if (topic && !t.topics.includes(topic)) return false
  if (!q) return true
  const hay = norm(`${t.name} ${t.one} ${t.what} ${t.needs ?? ''} ${t.topics.join(' ')} ${t.keywords ?? ''}`)
  return norm(q).trim().split(/\s+/).every(w => hay.includes(w))
}

function Tile({ t }: { t: Tool }) {
  const [open, setOpen] = useState(false)
  const body = (
    <>
      <div className="tf-top">
        <span className="tf-name">{t.name}</span>
        <span className="tf-state" style={{ color: TOOL_STATE_COLOUR[t.state], borderColor: TOOL_STATE_COLOUR[t.state] }}>{TOOL_STATE_LABEL[t.state]}</span>
      </div>
      <p className="tf-one">{t.one}</p>
    </>
  )
  return (
    <div className={`tf-tile ${t.state === 'building' ? 'is-building' : ''}`}>
      {t.href ? <a className="tf-hit" href={t.href}>{body}<span className="tf-open">Open →</span></a> : <div className="tf-hit">{body}</div>}
      <button className="tf-more" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        {open ? 'Hide the detail' : t.state === 'building' ? 'What it needs' : 'What it does'} <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="tf-detail">
          <p>{t.what}</p>
          {t.needs && <p className="cap mt-2"><b>Waiting on ·</b> {t.needs}</p>}
        </div>
      )}
    </div>
  )
}

export function ToolFinder() {
  const [q, setQ] = useState('')
  const [topic, setTopic] = useState<Topic | null>(null)
  const [building, setBuilding] = useState(false)

  const shown = useMemo(() => TOOLS.filter(t => match(t, q, topic, building)), [q, topic, building])
  /** The count each chip WOULD give, worked out against the other two controls as they stand. */
  const countFor = (tp: Topic | null) => TOOLS.filter(t => match(t, q, tp, building)).length
  const buildingCount = TOOLS.filter(t => t.state === 'building' && match(t, q, topic, true)).length
  const dirty = q !== '' || topic !== null || building

  const byState = (s: ToolState) => shown.filter(t => t.state === s)
  const order: ToolState[] = ['live', 'pilot', 'building']

  return (
    <div className="tf">
      <div className="tf-bar">
        <div className="tf-search">
          <label className="sr-only" htmlFor="tool-search">Search the tools</label>
          <input id="tool-search" className="input" type="search" value={q} placeholder="Search: water, potash, batch, sowing date…"
            onChange={e => setQ(e.target.value)} autoComplete="off" />
        </div>
        <div className="tf-chips" role="group" aria-label="Filter by what the tool answers">
          <button className={`tf-chip ${topic === null ? 'on' : ''}`} onClick={() => setTopic(null)}>Everything <i>{countFor(null)}</i></button>
          {TOPICS.map(tp => {
            const n = countFor(tp)
            return <button key={tp} className={`tf-chip ${topic === tp ? 'on' : ''}`} disabled={n === 0 && topic !== tp} onClick={() => setTopic(topic === tp ? null : tp)}>{tp} <i>{n}</i></button>
          })}
        </div>
        <div className="tf-switches">
          <label className="tf-switch">
            <input type="checkbox" checked={building} onChange={e => setBuilding(e.target.checked)} />
            <span>Include the {buildingCount} we have not built yet</span>
          </label>
          {dirty && <button className="tf-clear" onClick={() => { setQ(''); setTopic(null); setBuilding(false) }}>Clear</button>}
        </div>
      </div>

      <p className="tf-count" role="status">
        {shown.length === 0
          ? 'Nothing matches that. Clear the filters, or tell us what you were looking for, that is how the build order gets decided.'
          : <>Showing <b>{shown.length}</b> of {TOOLS.length} tools{topic ? <> in <b>{topic}</b></> : null}{q ? <> matching “{q}”</> : null}.</>}
      </p>

      {order.map(s => byState(s).length > 0 && (
        <section key={s} className="tf-group">
          <div className="tf-grouphead">
            <span className="tf-state" style={{ color: TOOL_STATE_COLOUR[s], borderColor: TOOL_STATE_COLOUR[s] }}>{TOOL_STATE_LABEL[s]}</span>
            <span className="cap">{TOOL_STATE_NOTE[s]}</span>
          </div>
          <div className="tf-grid">{byState(s).map(t => <Tile key={t.name} t={t} />)}</div>
        </section>
      ))}
    </div>
  )
}
