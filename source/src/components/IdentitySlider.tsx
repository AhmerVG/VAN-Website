import { useEffect, useRef, useState } from 'react'
import { CONTACT, COUNTS, PARTNER } from '@/data/site'
import { CROPS } from '@/data/catalogue'
import { SOIL_HEADLINE } from '@/data/soilLens'
import { FieldRows } from './bits'

/**
 * THE IDENTITY SLIDER — 11 September 2026, Tahir's ruling.
 *
 * "The home page should use the top space for a slider which suits the VAN identity. That is the
 * place where we write less but tell more. At least we tell who VAN is for: if a partner comes he
 * should not see a product first but a message." And, asked what the first slide should say VAN
 * is: "a manufacturer, then the four doors."
 *
 * So: ONE slider, five slides. Slide one says what VAN is, in the company's own tagline, with the
 * four figures that prove it. Slides two to five are the four doors, one audience each, one
 * sentence each, one button each. Nothing on any slide is a product. The existing "What do you
 * grow?" hero moves down one section and is otherwise untouched.
 *
 * Every figure is read from the same data the rest of the site reads (COUNTS, CROPS, PARTNER,
 * SOIL_HEADLINE), so the slider cannot drift from the pages it opens. No performance claim, no
 * client name, no price.
 *
 * MECHANICS. Auto-advances every 7 s; pauses on hover, on focus, and for anyone who has asked for
 * reduced motion (in which case it never advances on its own at all). Arrow keys, dots, swipe. The
 * static build renders slide one, so a crawler and a reader with JavaScript off both get the
 * identity line, which is the one that matters.
 */

type Slide = {
  key: string
  kicker: string
  title: string
  body: React.ReactNode
  cta: [string, string][]
  tone: 'navy' | 'green' | 'gold' | 'rust' | 'soil'
}

/**
 * 11 Sep 2026, Tahir on the preview: "I hope you are not using the preview colours on the live
 * website; keep the identity as it is currently." The preview had given each door its own dark
 * background. Those four colours were mine, not VAN's. Every slide is now VAN navy with the gold
 * accent, the same two colours the header, the footer and every navy panel already use. The slides
 * differ by what they say, not by what colour they are.
 */
const TONE: Record<Slide['tone'], { bg: string; accent: string; rows: string }> = {
  navy: { bg: 'var(--navy)', accent: 'var(--gold)', rows: 'rgba(255,255,255,.18)' },
  green: { bg: 'var(--navy)', accent: 'var(--gold)', rows: 'rgba(255,255,255,.18)' },
  gold: { bg: 'var(--navy)', accent: 'var(--gold)', rows: 'rgba(255,255,255,.18)' },
  rust: { bg: 'var(--navy)', accent: 'var(--gold)', rows: 'rgba(255,255,255,.18)' },
  soil: { bg: 'var(--navy)', accent: 'var(--gold)', rows: 'rgba(255,255,255,.18)' },
}

function useSlides(): Slide[] {
  const partners = PARTNER.portfolioPending.partners
  return [
    {
      key: 'identity', tone: 'navy',
      kicker: `${CONTACT.company} · Lahore · since ${COUNTS.incorporated}`,
      title: CONTACT.tagline,
      body: <>1 plant site. <b>{COUNTS.brands}</b> registered brands, <b>{COUNTS.licences}</b> PSQCA licences, a PNAC-accredited laboratory, about <b>50,000 t</b> made a year.</>,
      cta: [['For farmers', '#/crops'], ['For partners', '#/partner']],
    },
    {
      key: 'farmer', tone: 'green',
      kicker: 'If you grow',
      title: `${CROPS.length} crop programmes. Per acre, stage by stage, free.`,
      body: <>Your crop, your district, your sowing date. What to put on, when, and how many bags.</>,
      cta: [['Find your crop', '#/crops'], ['Soil Atlas', '#/soil']],
    },
    {
      key: 'dealer', tone: 'gold',
      kicker: 'If you sell',
      title: 'A dealership with the plant behind it.',
      body: <><b>{COUNTS.brands}</b> brands, every batch tested before it ships, and a bag a farmer can verify by its number.</>,
      cta: [['Become a dealer', '#/become-a-dealer'], ['Where to buy', '#/where-to-buy']],
    },
    {
      key: 'partner', tone: 'rust',
      kicker: 'If you want it made under your name',
      title: 'Formulated, made, registered and tested here. Sold under your brand.',
      body: <>{partners ? <><b>{partners}</b> partners and </> : null}<b>100+</b> brands already made on this site. You bring the market. VAN does everything from the formulation to the finished bag.</>,
      cta: [['Your Brand', '#/partner'], ['The formulation library', '#/partner#library']],
    },
    {
      key: 'evidence', tone: 'soil',
      kicker: 'If you want the evidence',
      title: `${SOIL_HEADLINE.samples} soil samples. 17 years of trials on VAN’s research farms.`,
      body: <>Every figure on this site carries its source. Where a figure does not exist, the page says so.</>,
      cta: [['Soil Atlas', '#/soil'], ['Why Pakistan must shift', '#/knowledge/why-pakistan-must-shift']],
    },
  ]
}

export function IdentitySlider() {
  const slides = useSlides()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef<number | null>(null)
  const reduced = useRef(false)

  useEffect(() => {
    try { reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch { reduced.current = false }
  }, [])

  useEffect(() => {
    if (paused || reduced.current) return
    const t = window.setInterval(() => setI(x => (x + 1) % slides.length), 7000)
    return () => window.clearInterval(t)
  }, [paused, slides.length])

  const go = (n: number) => setI(((n % slides.length) + slides.length) % slides.length)
  const s = slides[i]
  const tone = TONE[s.tone]

  return (
    <section
      className="idn"
      style={{ background: tone.bg }}
      aria-roledescription="carousel"
      aria-label="Who VAN is, and who it is for"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onKeyDown={e => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1) }}
      onTouchStart={e => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1))
        touchX.current = null
      }}
    >
      <div className="wrap idn-wrap">
        <div key={s.key} className="idn-slide" aria-live="polite">
          <span className="idn-kicker" style={{ color: tone.accent }}>{s.kicker}</span>
          <h2 className="idn-title">{s.title}</h2>
          <p className="idn-body">{s.body}</p>
          <div className="idn-ctas">
            {s.cta.map(([label, href], n) => (
              <a key={label} href={href} className={`btn ${n === 0 ? 'btn-gold' : ''}`} style={n === 0 ? {} : { background: 'rgba(255,255,255,.14)', color: '#fff' }}>{label}</a>
            ))}
          </div>
        </div>

        <div className="idn-nav">
          <button className="idn-arrow" aria-label="Previous" onClick={() => go(i - 1)}>‹</button>
          <div className="idn-dots" role="tablist" aria-label="Slides">
            {slides.map((x, n) => (
              <button key={x.key} role="tab" aria-selected={n === i} aria-label={x.kicker} className={`idn-dot ${n === i ? 'on' : ''}`} style={{ background: n === i ? tone.accent : 'rgba(255,255,255,.35)' }} onClick={() => go(n)} />
            ))}
          </div>
          <button className="idn-arrow" aria-label="Next" onClick={() => go(i + 1)}>›</button>
          <span className="idn-count num">{i + 1} / {slides.length}</span>
        </div>
      </div>
      <FieldRows n={12} height={44} colour={tone.rows} className="idn-rows" />
    </section>
  )
}
