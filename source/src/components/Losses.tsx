import type { CSSProperties } from 'react'
import { LOSSES, HOME_COPY } from '@/data/site'
import { PACK_PNG } from '@/data/assets'
import { useInView } from '@/hooks/useInView'
import { SectionHead } from './bits'

/** Loss 1: ammonia rising off the surface, nitrate sinking with the water. */
function AmmoniaSvg() {
  return (
    <svg viewBox="0 0 220 130" width="100%" aria-hidden="true">
      <rect x="0" y="92" width="220" height="38" fill="#7A5230" opacity=".7" />
      <rect x="0" y="86" width="220" height="8" fill="#A9C7A0" />
      {[40, 70, 100, 130, 160, 190].map(x => <circle key={x} cx={x} cy="84" r="4" fill="#14231A" opacity=".85" />)}
      {[46, 92, 138, 184].map((x, i) => (
        <g key={x} className="a-rise" style={{ animationDelay: `${i * 0.6}s` }}>
          <text x={x} y="78" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2F6B3A" fontFamily="Public Sans, sans-serif">NH₃</text>
          <path d={`M${x - 8} 70 q4 -6 0 -12 q-4 -6 0 -12`} stroke="#2F6B3A" strokeWidth="2" fill="none" opacity=".6" />
        </g>
      ))}
      {[60, 120, 180].map((x, i) => (
        <g key={x} className="a-drip" style={{ animationDelay: `${i * 0.5 + 0.3}s` }}>
          <text x={x} y="104" textAnchor="middle" fontSize="11" fontWeight="700" fill="#E6EEE8" fontFamily="Public Sans, sans-serif">NO₃⁻</text>
        </g>
      ))}
      <text x="8" y="16" fontSize="11" fill="#5B6A5E">air · pH 8+ soil</text>
    </svg>
  )
}
/** Loss 2: calcium closes in around the phosphate and locks it. */
function CalciumSvg() {
  const cas = [[-60, -30], [60, -30], [-60, 30], [60, 30], [0, -50], [0, 50]]
  return (
    <svg viewBox="0 0 220 130" width="100%" aria-hidden="true">
      <rect x="0" y="0" width="220" height="130" fill="#EFE6DA" />
      <g transform="translate(110 65)">
        <circle r="22" fill="#1F4B28" />
        <text textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="700" fill="#fff" fontFamily="Public Sans, sans-serif">P</text>
        {cas.map(([tx, ty], i) => (
          <g key={i} transform={`translate(${tx} ${ty})`}>
            <g className="a-close" style={{ ['--tx' as string]: `${-tx * 0.5}px`, ['--ty' as string]: `${-ty * 0.5}px`, animationDelay: `${i * 0.12}s` } as CSSProperties}>
              <polygon points="0,-13 11,-6 11,6 0,13 -11,6 -11,-6" fill="#C9C0B3" stroke="#7A5230" strokeWidth="1.5" />
              <text textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="700" fill="#7A5230">Ca</text>
            </g>
          </g>
        ))}
        <g transform="translate(0 -36)"><g className="a-lock">
          <path d="M-8 0 v-8 a8 8 0 0 1 16 0 v8" fill="none" stroke="#14231A" strokeWidth="3" />
          <rect x="-11" y="0" width="22" height="14" rx="3" fill="#14231A" />
        </g></g>
      </g>
      <text x="8" y="120" fontSize="11" fill="#5B6A5E">calcareous soil</text>
    </svg>
  )
}
/** Loss 3: the root goes looking for potash that was never put on. */
function RootSvg() {
  return (
    <svg viewBox="0 0 220 130" width="100%" aria-hidden="true">
      <rect x="0" y="0" width="220" height="30" fill="#E6EEE8" />
      <rect x="0" y="30" width="220" height="100" fill="#7A5230" opacity=".55" />
      <path d="M110 30 v-14 M110 22 c-8 -4 -12 -10 -13 -16 M110 18 c8 -4 12 -10 13 -16" stroke="#2F6B3A" strokeWidth="3" fill="none" strokeLinecap="round" />
      {['M110 30 c-4 20 -20 30 -40 44 c-10 8 -18 22 -22 40', 'M110 30 c4 22 22 30 40 46 c8 8 14 20 18 36', 'M110 30 c0 30 -6 50 -4 90', 'M110 30 c-10 14 -30 16 -50 18', 'M110 30 c10 16 30 20 55 24'].map((d, i) => (
        <path key={i} d={d} className="a-draw-loop" stroke="#F0EEE5" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="200" strokeDashoffset="200" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
      <g className="a-pulse"><circle cx="196" cy="112" r="10" fill="#B0841A" /><text x="196" y="116" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="Public Sans, sans-serif">K</text></g>
      <text x="8" y="122" fontSize="11" fill="#fff">1 kg K for every 83 kg N</text>
    </svg>
  )
}

export function Losses() {
  const { ref, inView } = useInView({ threshold: 0.15 })
  const art = [AmmoniaSvg, CalciumSvg, RootSvg]
  const pngs = ['urea', 'gphos', 'vpot']
  return (
    <section className="sec" id="losses">
      <div className="wrap">
        <SectionHead eyebrow="What this soil does" title={HOME_COPY.lossesH2} lead={HOME_COPY.lossesLead} tone="soil" right={<a className="btn btn-ghost" href="#/knowledge">Why Pakistan must shift →</a>} />
        <div ref={ref} className={`grid md:grid-cols-3 gap-4 lg:gap-5 ${inView ? 'on' : ''}`}>
          {LOSSES.map((l, i) => {
            const Art = art[i]
            return (
              <article key={l.n} className="panel overflow-hidden flex flex-col" style={{ borderTop: `6px solid ${l.colour}` }}>
                <div className="p-5 pb-3">
                  {/* 28 Sep 2026: the amber loss colour (#B97F1C) fails WCAG AA at this text size; the gold-text token is the passing equivalent already used elsewhere for the same hue. */}
                  <span className="eyebrow" style={{ color: l.colour === '#B97F1C' ? 'var(--gold-text)' : l.colour }}>{l.kicker}</span>
                  <h3>{l.title}</h3>
                  <p className="mt-3 muted">{l.text}</p>
                </div>
                <div className="mx-5 rounded-lg overflow-hidden" style={{ background: 'var(--sand-2)' }}><Art /></div>
                <a href={`#/products/${l.slug}`} className="no-underline grid grid-cols-[92px_1fr] gap-4 items-center p-5 mt-auto hover:bg-[var(--sand-2)]">
                  <img src={PACK_PNG[pngs[i]]} alt={l.product} style={{ height: 150, width: 'auto', margin: '0 auto' }} />
                  <div>
                    <div className="cap uppercase tracking-[.1em] font-bold" style={{ color: l.colour === '#B97F1C' ? 'var(--gold-text)' : l.colour }}>Built against it</div>
                    <div className="display text-[24px] leading-tight mt-1">{l.product}</div>
                    <div className="small muted mt-1">{l.analysis}</div>
                    <div className="mt-3 font-bold" style={{ color: 'var(--navy)' }}>Read the evidence →</div>
                  </div>
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
