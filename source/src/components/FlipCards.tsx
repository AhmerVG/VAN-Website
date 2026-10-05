import { useState } from 'react'
import { WHEAT } from '@/data/site'

const COL = ['#2F6B3A', '#1F4B28', '#B0841A']
// D-151: text shades of COL (>= 4.5:1 on white).
const COL_TEXT = ['#2A5E33', '#1F4B28', '#7A5A0E']
/** A leaf, drawn, with the symptom pattern for N (uniform paling), P (purpling), Zn (interveinal). */
function Leaf({ kind }: { kind: number }) {
  const base = kind === 0 ? '#C9D97A' : kind === 1 ? '#6B4C7A' : '#E0D96A'
  return (
    <svg viewBox="0 0 120 80" width="120" height="80" aria-hidden="true">
      <path d="M6 40 C30 6 90 6 114 40 C90 74 30 74 6 40z" fill={base} stroke="#2F6B3A" strokeWidth="2" />
      <path d="M6 40 H114" stroke="#2F6B3A" strokeWidth="2" />
      {[24, 42, 60, 78, 96].map(x => <path key={x} d={`M${x} 40 l-10 -18 M${x} 40 l-10 18`} stroke="#2F6B3A" strokeWidth="1.6" fill="none" />)}
      {kind === 2 && [33, 51, 69, 87].map(x => <path key={x} d={`M${x} 26 l0 28`} stroke="#4F8A3E" strokeWidth="5" opacity=".9" />)}
      {kind === 1 && <path d="M6 40 C30 60 60 70 96 62 C60 74 30 74 6 40z" fill="#7A5230" opacity=".55" />}
    </svg>
  )
}

export function FlipCards() {
  const [on, setOn] = useState<number | null>(null)
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {WHEAT.deficiency.map((d, i) => (
        <button key={d.nutrient} className={`flip text-left ${on === i ? 'on' : ''}`} onClick={() => setOn(on === i ? null : i)} aria-pressed={on === i} style={{ background: 'none', border: 0, padding: 0 }}>
          <div className="inner">
            <div className="face panel" style={{ borderTop: `6px solid ${COL[i]}` }}>
              <div className="flex items-start justify-between gap-2">
                <div><span className="eyebrow" style={{ color: COL_TEXT[i] }}>Deficiency</span><h3>{d.nutrient}</h3></div>
                <Leaf kind={i} />
              </div>
              <p className="small mt-3"><b>Early signs.</b> {d.early}</p>
              <p className="cap mt-4" style={{ color: 'var(--gold-text)' }}>▸ Tap to turn: when, and what to look for</p>
            </div>
            <div className="face back panel-navy p-6">
              <span className="eyebrow" style={{ color: 'var(--gold)' }}>{d.nutrient}</span>
              <p className="small mt-2"><b>Timing in Punjab wheat.</b> {d.timing}</p>
              <p className="small mt-3"><b>Field indicator.</b> {d.indicator}</p>
              <p className="cap mt-4">▸ Tap to turn back</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
