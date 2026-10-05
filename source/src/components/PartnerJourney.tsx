import { useEffect, useRef, useState } from 'react'
import { PARTNER } from '@/data/site'
import { useReducedMotion } from '@/hooks/useInView'

/** D-151: the deeper shade of a VAN hue for TEXT on a tinted panel (>= 4.5:1). */
const textShade = (c: string) => c === 'var(--rust)' ? 'var(--rust-text)' : c === 'var(--green)' ? 'var(--green-text)' : c

/**
 * THE TWO ROUTES, AS AN INSTRUMENT — rebuilt 10 September 2026.
 *
 * The first version of this page failed, and Tahir named the failure exactly: "do you think its an
 * interactive, journey, walkthrough wired page? does the space on opening view is exciting and used
 * in a manner which attracts someone? such a poor work."
 *
 * He was right. What the opening screen carried was a headline, two paragraphs of grey text and one
 * small bordered number. Everything that moved was 800px below the fold. On a wide screen the right
 * half of the first view was empty. It read as a document, not as an instrument, and every other
 * strong page on this site (the soil map, the simulator, the lab chain) opens with a live object.
 *
 * WHAT CHANGED. The journey IS the opening view now. The rail runs left to right across the full
 * width, so a reader sees a route before he reads a sentence. Picking a route redraws the rail;
 * picking a stage opens it underneath. Nothing is hidden that was visible before; what changed is
 * that the reader now drives the page instead of scrolling past it.
 *
 * WHY A HORIZONTAL RAIL rather than the numbered list it replaced: a vertical list of seven items
 * is a list. The same seven on a line, connected, with a start and an end, is a journey. That is
 * the difference between telling somebody there is a process and showing him its shape.
 *
 * The stage labels on the rail are deliberately short (`s`), with the full title (`t`) in the panel.
 * "Product deck and technical data" cannot be a label on a node and stay readable.
 */

const OWNER: Record<string, { label: string; bg: string }> = {
  you: { label: 'Yours', bg: 'var(--gold)' },
  both: { label: 'Together', bg: 'var(--sky)' },
}

export function PartnerJourney() {
  const [routeKey, setRouteKey] = useState(PARTNER.routes[0].key)
  const [step, setStep] = useState(0)
  const rm = useReducedMotion()
  const route = PARTNER.routes.find(r => r.key === routeKey) ?? PARTNER.routes[0]
  const stage = route.stages[Math.min(step, route.stages.length - 1)]
  const n = route.stages.length
  const isDev = route.key === 'develop'
  const accent = isDev ? 'var(--rust)' : 'var(--green)'

  const scroller = useRef<HTMLDivElement | null>(null)
  const nodes = useRef<(HTMLButtonElement | null)[]>([])
  const first = useRef(true)

  useEffect(() => {
    // Never on first paint: scrolling the rail on mount would move a page the reader has not
    // touched, and on a desktop the whole rail is visible anyway so there is nothing to bring in.
    if (first.current) { first.current = false; return }
    const box = scroller.current, node = nodes.current[step]
    if (!box || !node || box.scrollWidth <= box.clientWidth) return
    // offsetLeft is measured from the <li>, which is positioned, so it is a few pixels and useless
    // here. Measure the node against the scroller itself.
    const nb = node.getBoundingClientRect(), bb = box.getBoundingClientRect()
    const left = box.scrollLeft + (nb.left - bb.left) - box.clientWidth / 2 + nb.width / 2
    box.scrollTo({ left: Math.max(0, left), behavior: rm ? 'auto' : 'smooth' })
  }, [step, routeKey, rm])

  const pick = (k: string) => { setRouteKey(k); setStep(0) }

  return (
    <div>
      {/* ── the two routes, side by side and full width ─────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-3">
        {PARTNER.routes.map(r => {
          const on = r.key === routeKey
          const col = r.key === 'develop' ? 'var(--rust)' : 'var(--green)'
          return (
            <button key={r.key} onClick={() => pick(r.key)} aria-pressed={on}
              className="panel p-5 text-left grid gap-1"
              style={{
                borderColor: on ? col : undefined, borderWidth: on ? 2 : undefined,
                background: on ? 'var(--sand-2)' : undefined,
                transition: rm ? 'none' : 'border-color .2s, background-color .2s',
              }}>
              <span className="cap" style={{ color: textShade(col), fontWeight: 700 }}>{r.tag}</span>
              <span className="display text-[clamp(19px,1.7vw,24px)]" style={{ color: 'var(--navy)' }}>{r.title}</span>
              <span className="num" style={{ fontSize: 'clamp(24px,2.4vw,34px)', lineHeight: 1.1, color: col }}>{r.time}</span>
              <span className="small muted">{r.timeNote}</span>
            </button>
          )
        })}
      </div>

      {/* ── the rail ────────────────────────────────────────────────────────────────────────── */}
      <div className="panel p-4 lg:p-5 mt-3" style={{ borderColor: accent, borderWidth: 2 }}>
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
          <span className="eyebrow" style={{ color: accent }}>{route.title}</span>
          {/* The coloured dots under a node had no key, so a reader saw a mark and learned nothing. */}
          <span className="cap flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <i style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--gold)', display: 'inline-block' }} />yours
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--sky)', display: 'inline-block', border: '1px solid var(--line-2)' }} />together
            </span>
            <span>everything else is ours</span>
            <span className="hidden sm:inline">tap any stage</span>
          </span>
        </div>

        {/* The rail is wider than a phone, so on a phone it scrolls. Two things follow from that and
            both were missing: the reader has to be able to SEE that it scrolls (the fade on the
            right edge), and pressing Next has to bring the stage he just moved to into view rather
            than leaving him looking at a node he did not choose. */}
        <div ref={scroller} className="overflow-x-auto pb-1 pj-rail">
          <ol className="list-none p-0 m-0 grid gap-0 relative" style={{ gridTemplateColumns: `repeat(${n}, minmax(84px, 1fr))`, minWidth: n * 84 }}>
            {/* the line the stages sit on */}
            <span aria-hidden="true" style={{
              position: 'absolute', left: `${50 / n}%`, right: `${50 / n}%`, top: 17, height: 3,
              background: 'var(--line-2)', borderRadius: 2,
            }} />
            <span aria-hidden="true" style={{
              position: 'absolute', left: `${50 / n}%`, top: 17, height: 3, background: accent, borderRadius: 2,
              width: `calc(${(step / (n - 1)) * (100 - 100 / n)}%)`,
              transition: rm ? 'none' : 'width .35s cubic-bezier(.2,.8,.2,1)',
            }} />
            {route.stages.map((st, i) => {
              const on = i === step
              const done = i < step
              return (
                <li key={st.s} className="relative flex flex-col items-center text-center px-1">
                  <button ref={el => { nodes.current[i] = el }} onClick={() => setStep(i)} aria-current={on ? 'step' : undefined}
                    aria-label={`Stage ${i + 1}: ${st.t}`}
                    className="num flex items-center justify-center rounded-full"
                    style={{
                      width: on ? 38 : 30, height: on ? 38 : 30, marginTop: on ? -2 : 2,
                      background: on ? accent : done ? 'var(--navy)' : '#fff',
                      color: on || done ? '#fff' : 'var(--navy)',
                      border: `3px solid ${on || done ? (on ? accent : 'var(--navy)') : 'var(--line-2)'}`,
                      fontSize: on ? 16 : 14, cursor: 'pointer',
                      transition: rm ? 'none' : 'all .25s cubic-bezier(.2,.8,.2,1)',
                    }}>
                    {i + 1}
                  </button>
                  <span className="cap mt-2 leading-tight" style={{ color: on ? 'var(--navy)' : undefined, fontWeight: on ? 700 : 600 }}>{st.s}</span>
                  {st.own && OWNER[st.own] && (
                    <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 4, background: OWNER[st.own].bg, marginTop: 4 }} />
                  )}
                </li>
              )
            })}
          </ol>
        </div>

        {/* ── the stage that is open ────────────────────────────────────────────────────────── */}
        <div className="panel-soft p-4 lg:p-5 mt-4 grid lg:grid-cols-[1fr_auto] gap-4 items-start" style={{ minHeight: 118 }}>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="num" style={{ color: textShade(accent), fontWeight: 700 }}>{step + 1} of {n}</span>
              <span className="display text-[19px]" style={{ color: 'var(--navy)' }}>{stage.t}</span>
              {stage.own && OWNER[stage.own] && (
                <span className="cap px-2 py-0.5 rounded" style={{ background: OWNER[stage.own].bg, color: 'var(--navy)', fontWeight: 700 }}>{OWNER[stage.own].label}</span>
              )}
            </div>
            <p className="mt-2 max-w-[140ch]">{stage.d}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="btn btn-ghost btn-sm" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} aria-label="Previous stage">←</button>
            <button className="btn btn-navy btn-sm" onClick={() => setStep(s => Math.min(n - 1, s + 1))} disabled={step === n - 1} aria-label="Next stage">
              {step === n - 1 ? 'Done' : 'Next →'}
            </button>
          </div>
        </div>

        {/* The regulatory layer is a band UNDER the rail, not a node on it: it is not a step you
            pass through, it runs the whole way. */}
        <div className="grid md:grid-cols-3 gap-3 mt-3">
          {PARTNER.reg.map(([h, t]) => (
            <div key={h} className="p-3 rounded-lg" style={{ background: 'var(--sky)' }}>
              <b className="small" style={{ color: 'var(--navy)' }}>{h}</b>
              <span className="cap block mt-1">{t}</span>
            </div>
          ))}
        </div>
        <p className="cap mt-2">Registration and label review run alongside every stage above, in your name.</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {route.key === 'library'
            ? <a className="btn btn-navy btn-sm" href="#library">See what is in the library →</a>
            : <a className="btn btn-navy btn-sm" href="#/partner/brief-to-bag">How a brief becomes a bag →</a>}
          <a className="btn btn-ghost btn-sm" href="#/partner/manufacturing">What the plant can make →</a>
          <a className="btn btn-ghost btn-sm" href="#/partner/regulatory">The regulatory service →</a>
        </div>
      </div>
    </div>
  )
}
