import { useState } from 'react'
import { ABOUT, CONTACT, WA } from '@/data/site'
import { BOARD_PHOTOS } from '@/data/assets'
import { WaButton } from '@/components/bits'
import { GrowthStory } from '@/components/story/GrowthStory'
import { ABOUT_HERO, B2B, MADE_STEPS, HOLDS, ORIGIN, WHO_NOTE, WHO_LAB } from '@/data/about'

/**
 * ABOUT — D-173, 25 Sep 2026. Rethought after Tahir's review of D-170 (see src/data/about.ts for his
 * answers). Seven parts, each a different shape so the page does not read as rows of the same card:
 *   1 hero, split: words and 4 facts left, the drawing of the plant and laboratory right
 *   2 what VAN does: one statement on a navy band (VAN is B2B)
 *   3 how a product is made: 3 steps on one connecting line, not cards
 *   4 licences, accreditation and patent: 3 large figures
 *   5 why VAN started: 3 short paragraphs (the year-by-year story, told in 2 sentences) and the evidence line
 *   6 board: portraits, no card boxes; "Read more" opens the brief
 *   7 who to contact: one list, a row per person. Addresses and numbers are in the footer, not repeated here.
 * Removed: the year rail and scene section (his answer: drop the timeline), the "Today" tile, the farmer
 * figures (VAN is B2B), the Head office / Plant boxes that repeated the footer.
 * Revert: the v57 source zip.
 */
export default function About() {
  const [open, setOpen] = useState<string | null>(null)
  const openB = ABOUT.board.find(x => x.key === open)
  return (
    <div>
      {/* 0 · D-178, 26 Sep 2026. Tahir: "show building from a farm to factory ... from few people to 150 people,
          something more powerful that shows transformation", top of the About page. The story carries the
          page's h1. The small drawing that sat in the hero (AboutScene compact) is gone: the story draws the
          same plant and laboratory, so showing both repeated it. Revert: the v58 source zip. */}
      <section className="ab-story">
        <div className="wrap">
          <span className="eyebrow">{ABOUT_HERO.eyebrow}</span>
          <h1 className="ab-story-h1">From a batch of humic acid in 2007 to about 50,000 t a year.</h1>
          <div className="mt-6"><GrowthStory /></div>
        </div>
      </section>

      {/* 1 · The statement and the 4 facts (was the split hero; the drawing moved into the story above) */}
      <section className="ab-hero">
        <div className="wrap ab-hero-grid">
          <div>
            {/* D-181, Tahir 26 Sep: "trim the hero". The heading (VAN started with a research farm in 2009...) and
                "Trials have run on that ground every season since" repeated the story's 2009 card; both gone. */}
            <p className="ab-lead ab-lead-lg">VAN formulates, manufactures, registers and tests what it sells on one plant site in Lahore.</p>
            <a className="btn btn-navy btn-sm mt-7" href="#/company-profile">Company profile and PDF →</a>
          </div>
          <div>
            <dl className="ab-facts">
              {ABOUT_HERO.facts.map(([v, l]) => (
                <div key={l}><dt className="num">{v}</dt><dd>{l}</dd></div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 2 · What VAN does */}
      <section className="ab-b2b">
        <div className="wrap">
          <span className="eyebrow" style={{ color: 'var(--gold)' }}>{B2B.eyebrow}</span>
          <h2>{B2B.h2}</h2>
          <p>{B2B.p}</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <a className="btn btn-gold" href="#/partner">Your Brand →</a>
            <a className="btn ab-btn-line" href="#/products">VAN’s own brands →</a>
          </div>
        </div>
      </section>

      {/* 3 · How a product is made, on one line */}
      <section className="sec ab-sec"><div className="wrap">
        <span className="eyebrow navy">How it is made</span>
        <h2 className="ab-h2">How a VAN product is made</h2>
        <ol className="ab-line">
          {MADE_STEPS.map(s => (
            <li key={s.n}>
              <span className="ab-dot num" aria-hidden="true">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              {s.href && <a href={s.href}>{s.link} →</a>}
            </li>
          ))}
        </ol>
      </div></section>

      {/* 4 · Licences, accreditation and patent */}
      <section className="sec ab-sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <span className="eyebrow navy">Licences, accreditation and patent</span>
        <h2 className="ab-h2">What VAN holds</h2>
        <div className="ab-holds">
          {HOLDS.map(h => (
            <div key={h.t}>
              <div className="num ab-holds-v">{h.v}</div>
              <div className="ab-holds-t">{h.t}</div>
              <p>{h.d}</p>
            </div>
          ))}
        </div>
        <a className="ab-textlink" href="#/partner/regulatory">Every licence, product by product →</a>
      </div></section>

      {/* 5 · Why VAN started */}
      <section className="sec ab-sec"><div className="wrap">
        <span className="eyebrow soil">Origin</span>
        <h2 className="ab-h2">{ORIGIN.h2}</h2>
        <div className="ab-cols ab-cols-2">
          <p>{ORIGIN.p1}</p>
          <p>{ORIGIN.p2}</p>
        </div>
        <div className="ab-evidence">
          <span className="eyebrow" style={{ marginBottom: 4 }}>{ORIGIN.evidenceH}</span>
          <p>{ORIGIN.evidence}</p>
          <a href="#/knowledge/why-pakistan-must-shift">{ORIGIN.evidenceLink} →</a>
        </div>
      </div></section>

      {/* 6 · Board */}
      <section className="sec ab-sec" id="board" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <span className="eyebrow navy">The board</span>
        <h2 className="ab-h2">{ABOUT.boardH2}</h2>
        <div className="ab-board">
          {ABOUT.board.map(b => (
            <button key={b.key} className={`ab-person ${open === b.key ? 'on' : ''}`} aria-expanded={open === b.key}
              aria-controls="board-brief" onClick={() => {
                const next = open === b.key ? null : b.key
                setOpen(next)
                // On a phone the brief opens below all 5 portraits, out of sight; bring it into view.
                if (next) setTimeout(() => document.getElementById('board-brief')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 50)
              }}>
              <img src={BOARD_PHOTOS[b.key]} alt="" loading="lazy" />
              <span className="n">{b.name}</span>
              <span className="r">{b.role}</span>
              <span className="more">{open === b.key ? 'Close' : 'Read more'}</span>
            </button>
          ))}
        </div>
        {openB && (
          <div id="board-brief" className="ab-brief">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <div>
                <h3>{openB.name}</h3>
                <div className="ab-brief-r">{openB.role} · {openB.line}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setOpen(null)}>Close</button>
            </div>
            <div className="ab-cols ab-cols-2 mt-3">{openB.brief.map(p => <p key={p}>{p}</p>)}</div>
          </div>
        )}
      </div></section>

      {/* 7 · Who to contact: one list */}
      <section className="sec ab-sec"><div className="wrap">
        <span className="eyebrow navy">Contact</span>
        <h2 className="ab-h2">Who to contact</h2>
        <ul className="ab-people">
          {ABOUT.whoToTalk.map(w => (
            <li key={w.area}>
              <span className="ab-people-a">{w.area}</span>
              <span><b>{w.name}</b><span className="ab-people-r">{w.role}</span></span>
              <span className="ab-people-t">{w.text}</span>
              {w.email && <a href={`mailto:${w.email}`}>{w.email}</a>}
            </li>
          ))}
        </ul>
        <p className="ab-note">{WHO_NOTE} <a href="#/lab#book">{WHO_LAB}</a></p>
        <div className="flex flex-wrap gap-3 mt-4">
          <a className="btn btn-navy" href={`tel:${CONTACT.landlineTel}`}>Call {CONTACT.landline}</a>
          <WaButton href={WA.products}>WhatsApp {CONTACT.whatsapp}</WaButton>
        </div>
      </div></section>
    </div>
  )
}
