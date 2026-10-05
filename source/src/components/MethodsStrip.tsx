import { useEffect, useState } from 'react'
import type { CSSProperties, ReactElement } from 'react'
import { METHODS, VITAL_UREA_RULE } from '@/data/site'
import { useInView, useReducedMotion } from '@/hooks/useInView'
import { SectionHead } from './bits'

const v = (tx: number, ty: number, delay: number): CSSProperties => ({ ['--tx' as string]: `${tx}px`, ['--ty' as string]: `${ty}px`, animationDelay: `${delay}s` } as CSSProperties)

function Ground() { return <><rect x="0" y="88" width="200" height="32" fill="#7A5230" opacity=".6" /><rect x="0" y="84" width="200" height="6" fill="#A9C7A0" /></> }

const ART: Record<string, () => ReactElement> = {
  Broadcasting: () => (
    <svg viewBox="0 0 200 120" width="100%" aria-hidden="true">
      <Ground />
      <g transform="translate(100 30)">
        <circle r="8" fill="#14231A" />
        {[[-70, 50], [-40, 54], [-10, 56], [20, 56], [50, 54], [80, 50], [-55, 52], [65, 52]].map(([tx, ty], i) => <circle key={i} r="4" fill="#D9A21B" className="a-scatter" style={v(tx, ty, i * 0.2)} />)}
      </g>
    </svg>
  ),
  Placement: () => (
    <svg viewBox="0 0 200 120" width="100%" aria-hidden="true">
      <Ground />
      <path d="M60 84 v18 h80 v-18" fill="#5A3A20" stroke="#5A3A20" />
      {[72, 88, 104, 120, 136].map((x, i) => <circle key={x} cx={x} cy="96" r="4" fill="#D9A21B" className="a-fade" style={{ animationDelay: `${i * 0.15}s` }} />)}
      {[80, 100, 120].map((x, i) => <g key={x} className="a-grow" style={{ animationDelay: `${0.8 + i * 0.2}s` }}><path d={`M${x} 84 v-26`} stroke="#2F6B3A" strokeWidth="3" strokeLinecap="round" /><path d={`M${x} 68 c-8 -4 -12 -10 -12 -16`} stroke="#2F6B3A" strokeWidth="3" fill="none" strokeLinecap="round" /></g>)}
    </svg>
  ),
  'Side dressing': () => (
    <svg viewBox="0 0 200 120" width="100%" aria-hidden="true">
      <Ground />
      {[50, 100, 150].map(x => <g key={x}><path d={`M${x} 84 v-40`} stroke="#2F6B3A" strokeWidth="3.5" strokeLinecap="round" /><path d={`M${x} 60 c-10 -5 -14 -12 -14 -20 M${x} 52 c10 -5 14 -12 14 -20`} stroke="#2F6B3A" strokeWidth="3" fill="none" strokeLinecap="round" /></g>)}
      {[64, 114, 164, 36].map((x, i) => <circle key={x} cx={x} cy="80" r="4" fill="#D9A21B" className="a-pulse" style={{ animationDelay: `${i * 0.3}s` }} />)}
      <path d="M0 78 q100 -8 200 0" stroke="#E6EEE8" strokeWidth="6" fill="none" strokeDasharray="10 10" className="a-flow" />
    </svg>
  ),
  Fertigation: () => (
    <svg viewBox="0 0 200 120" width="100%" aria-hidden="true">
      <Ground />
      <path d="M10 20 h150 a10 10 0 0 1 10 10 v50" fill="none" stroke="#14231A" strokeWidth="6" strokeLinecap="round" />
      <path d="M10 20 h150 a10 10 0 0 1 10 10 v50" fill="none" stroke="#E6EEE8" strokeWidth="3" strokeDasharray="8 10" className="a-flow" />
      {[40, 80, 120].map((x, i) => <g key={x} className="a-drip" style={{ animationDelay: `${i * 0.4}s` }}><path d={`M${x} 26 c0 6 -6 9 -6 14 a6 6 0 0 0 12 0 c0 -5 -6 -8 -6 -14z`} fill="#1F4B28" /></g>)}
      <rect x="20" y="8" width="26" height="14" rx="3" fill="#D9A21B" /><text x="33" y="19" textAnchor="middle" fontSize="9" fontWeight="700" fill="#14231A">TANK</text>
    </svg>
  ),
  Spray: () => (
    <svg viewBox="0 0 200 120" width="100%" aria-hidden="true">
      <Ground />
      {[40, 80, 120, 160].map(x => <g key={x}><path d={`M${x} 84 v-30`} stroke="#2F6B3A" strokeWidth="3.5" strokeLinecap="round" /><ellipse cx={x - 8} cy="62" rx="9" ry="5" fill="#4F8A3E" transform={`rotate(-30 ${x - 8} 62)`} /><ellipse cx={x + 8} cy="66" rx="9" ry="5" fill="#4F8A3E" transform={`rotate(30 ${x + 8} 66)`} /></g>)}
      <g transform="translate(100 14)">
        <rect x="-30" y="-6" width="60" height="8" rx="3" fill="#14231A" />
        {[[-40, 34], [-20, 40], [0, 44], [20, 40], [40, 34], [-30, 38], [30, 38]].map(([tx, ty], i) => <circle key={i} r="3" fill="#1F4B28" className="a-mist" style={v(tx, ty, i * 0.18)} />)}
      </g>
    </svg>
  ),
}

/** The 5 methods, drawn and moving. Tap one to read it. They are 5 different things. */
export function MethodsStrip({ compact = false }: { compact?: boolean }) {
  const { ref, inView } = useInView({ threshold: 0.2 })
  const rm = useReducedMotion()
  const [sel, setSel] = useState(0)
  const [auto, setAuto] = useState(true)
  useEffect(() => {
    if (!inView || !auto || rm) return
    const t = window.setInterval(() => setSel(s => (s + 1) % METHODS.length), 3200)
    return () => window.clearInterval(t)
  }, [inView, auto, rm])
  const [name, text] = METHODS[sel]
  return (
    <div ref={ref} className={inView ? 'on' : ''}>
      {!compact && <SectionHead eyebrow="How you apply it" title="5 ways the bag reaches the crop, and they are not interchangeable." lead="Broadcasting, placement, side dressing, fertigation and spray are 5 different methods. The plan names which one for every row." tone="navy" id="methods" />}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {METHODS.map(([n], i) => {
          const Art = ART[n]
          return (
            <button key={n} className={`panel text-left overflow-hidden ${sel === i ? 'ring-4 ring-[var(--gold)]' : ''}`} style={{ borderColor: sel === i ? 'var(--navy)' : undefined, cursor: 'pointer' }} onClick={() => { setSel(i); setAuto(false) }} aria-pressed={sel === i}>
              <div style={{ background: 'var(--sky)' }}><Art /></div>
              <div className="p-3 display text-[18px]">{n}</div>
            </button>
          )
        })}
      </div>
      <p className="cap mt-2" style={{ color: 'var(--gold-text)' }}>▸ Tap a method to read it{auto && !rm ? ', or watch them take turns' : ''}</p>
      <div className="panel p-5 mt-3 grid md:grid-cols-[180px_1fr] gap-4 items-start">
        <div className="display text-[26px]">{name}</div>
        <div>
          <p>{text}</p>
          <p className="small mt-3 p-3 rounded-lg" style={{ background: 'var(--gold-soft)' }}><b>1 product rule overrides the table.</b> {VITAL_UREA_RULE}</p>
        </div>
      </div>
    </div>
  )
}
