import { useEffect, useMemo, useRef, useState } from 'react'
import { LIBRARY, FAMILIES, CONTACT, type FormulationStatus } from '@/data/site'
import { LIB_META, NUTRIENT_COL, NUTRIENT_LABEL, FAMILY_COL, FORM_LABEL, APPLY_LABEL, type Nut, type Form } from '@/data/libraryMeta'

/**
 * THE FORMULATION LIBRARY, AS AN INSTRUMENT — 10 September 2026.
 *
 * Tahir: "The formulation library is buried in bottom and not really attract attention. Two things:
 * one, we should redesign the panel and make it more interactive and add a style which match to
 * product type, nutritions; and second, we should stitch it to the top somewhere, so one can move
 * straight to library if he want."
 *
 * WHAT IT WAS. Two rows of grey chips over a grid of twenty-five text boxes. Every card looked the
 * same, so nothing on the page told a reader that N-22S and BIO-M01 are different KINDS of thing.
 * A partner scanning for something he can sell into a fertigation market had to read all
 * twenty-five to find out that four of them are liquids.
 *
 * THE PICTURE FIRST. The pipeline is now drawn rather than counted: twenty-five dots, one per
 * formulation, sitting on the five rungs of the ladder, each dot coloured by its family. A reader
 * sees in one look that the library is weighted to the finished end (eleven available, eight
 * validated, nothing sitting at concept), and that the biological family is the one still moving.
 * Clicking a rung filters to it. Clicking a dot goes to that formulation.
 *
 * THE CARD CARRIES ITS CHEMISTRY. Each card leads with the nutrients it delivers, as coloured chips
 * with the figure where VAN has published one, then the form where the library fixes it, then where
 * it goes on. That is what makes a zinc chelate look different from an NPK on sight.
 *
 * WHAT IS DELIBERATELY MISSING. Fourteen of the twenty-five carry no form chip. VAN's own
 * capability statement further down this page says the same composition is made in more than one
 * form, so form is a decision rather than a property, and inventing one for a page read by Syngenta
 * and Bayer is not a design choice, it is a specification claim. Those fourteen are listed in the
 * observations log for Tahir to rule on.
 */

/**
 * THE SIX-STAGE PATH — 11 September 2026, Tahir's ruling.
 *
 * His feedback of 9 Sep: "the formulation library should show a development PATH, not a catalogue",
 * six stages, bracketed as the "New / Tier II partner" route: idea and hypothesis; feasibility and
 * scoping (technically and commercially viable? what does the literature say? rough cost? what
 * problem does it address?); concept; development; trial; registration and licensing.
 *
 * The 25 codes already carry a status each, so the path is drawn by MAPPING those statuses onto
 * his stages, not by inventing a stage for any code. Concept, In development and Field trials map
 * one to one. Validated (specification and data locked) and Available (ready to license) both sit
 * on the last stage, and each card still shows which of the two it is. The first two stages carry
 * no code, and say so: nothing at idea or feasibility is published, because at that point it is a
 * partner's own brief. That sentence is true, and it is also the invitation.
 */
type PathKey = 'idea' | 'feasibility' | 'concept' | 'development' | 'trial' | 'registration'
const PATH: { key: PathKey; label: string; ask: string; statuses: FormulationStatus[]; col: string }[] = [
  { key: 'idea', label: 'Idea and hypothesis', ask: 'What problem does it address, on which crop, against which product a farmer buys today?', statuses: [], col: '#8A968C' },
  { key: 'feasibility', label: 'Feasibility and scoping', ask: 'Technically and commercially viable? What does the literature say? Rough cost per bag?', statuses: ['Feasibility'], col: '#8A968C' },
  { key: 'concept', label: 'Concept', ask: 'Defined on paper. Ratio, form and target price fixed, not yet at the bench.', statuses: ['Concept'], col: '#8A968C' },
  { key: 'development', label: 'Development', ask: 'Bench formulation in the VAN lab. Coating, chelation, solubility, pH, compatibility.', statuses: ['In development'], col: '#7A5230' },
  { key: 'trial', label: 'Trial', ask: 'On VAN’s research farms, and on a partner\u2019s own plots where wanted.', statuses: ['Field trials'], col: '#B0841A' },
  // D-185: licensing is not a model VAN offers (Tahir, 26 Sep 2026), so the stage is Registration and the wording is "carry your name".
  { key: 'registration', label: 'Registration', ask: 'Specification and data locked. Registered under your brand by VAN, with VAN named as the manufacturer.', statuses: ['Validated', 'Available'], col: '#2F6B3A' },
]

const STATUS_COL: Record<FormulationStatus, string> = {
  Feasibility: '#8A968C', Concept: '#8A968C', 'In development': '#7A5230', 'Field trials': '#7A5A0E', Validated: '#14231A', Available: '#2A5E33',
}

const NUT_ORDER: Nut[] = ['N', 'P', 'K', 'S', 'Ca', 'Zn', 'B', 'Fe', 'Org']
const FORM_ORDER: Form[] = ['liquid', 'soluble', 'granular', 'biological']

const meta = (code: string) => LIB_META[code] ?? { n: [] as [Nut, string?][] }

/** D-197, 27 Sep 2026: pathOnly draws the ladder and a door to the full library on the Pipeline page. */
export function FormulationLibrary({ pathOnly = false }: { pathOnly?: boolean } = {}) {
  const [stage, setStage] = useState<PathKey | null>(null)
  const [nut, setNut] = useState<Nut | null>(null)
  const [form, setForm] = useState<Form | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const cards = useRef<Record<string, HTMLDivElement | null>>({})
  const firstPaint = useRef(true)

  const list = useMemo(() => LIBRARY.filter(l => {
    const m = meta(l.code)
    if (stage && !PATH.find(p => p.key === stage)!.statuses.includes(l.status)) return false
    if (nut && !m.n.some(([k]) => k === nut)) return false
    if (form && m.form !== form) return false
    return true
  }), [stage, nut, form])

  // Counts are computed, never typed in. The old page had "25 codes" written into the copy in one
  // place and the real number in another, which is exactly how a page starts lying about itself.
  const nutCount = (k: Nut) => LIBRARY.filter(l => meta(l.code).n.some(([x]) => x === k)).length
  const formCount = (f: Form) => LIBRARY.filter(l => meta(l.code).form === f).length
  const filtered = stage || nut || form

  useEffect(() => {
    if (firstPaint.current) { firstPaint.current = false; return }
    if (!open) return
    cards.current[open]?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [open])

  const clear = () => { setStage(null); setNut(null); setForm(null) }

  return (
    <div>
      {/* ── the ladder, drawn ─────────────────────────────────────────────────────────────────── */}
      <div className="panel p-4 lg:p-5">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
          <span className="eyebrow navy">The path, from an idea to a registered product. Where the {LIBRARY.length} sit on it today</span>
          <span className="cap">one dot is one formulation · colour is its family · a ring means registered and available · tap a stage to filter</span>
        </div>
        {/* On a phone the five rungs side by side put the two that matter, eight validated and
            eleven available, off the right-hand edge, so a reader on a phone met a library that
            looked like it held three things. Below 700px the ladder stacks into five rows and the
            whole pipeline is on screen at once. */}
        <div>
          <div className="lib-ladder">
            {PATH.map(p => {
              const codes = LIBRARY.filter(l => p.statuses.includes(l.status))
              const on = stage === p.key
              return (
                <button key={p.key} onClick={() => setStage(on ? null : p.key)} aria-pressed={on} title={p.ask}
                  className="lib-rung"
                  style={{
                    background: on ? 'var(--sand-2)' : 'transparent',
                    border: `1px solid ${on ? p.col : 'var(--line)'}`,
                    borderBottom: `3px solid ${p.col}`,
                  }}>
                  <span className="lib-dots flex flex-wrap gap-1 items-end">
                    {codes.length === 0
                      ? <span className="cap" style={{ color: 'var(--muted)' }}>nothing published at this stage</span>
                      : codes.map(c => (
                        <i key={c.code} title={`${c.code}, ${FAMILIES[c.family]} · ${c.status}`}
                          style={{ width: 11, height: 11, borderRadius: 6, background: FAMILY_COL[c.family], display: 'inline-block', outline: c.status === 'Available' ? `2px solid ${STATUS_COL.Available}` : 'none', outlineOffset: 1 }} />
                      ))}
                  </span>
                  <span className="lib-count num" style={{ color: p.col }}>{codes.length}</span>
                  <span className="lib-label leading-tight" style={{ color: 'var(--navy)', fontWeight: on ? 700 : 600 }}>
                    <span className="cap block">{p.label}</span>
                    <span className="cap block" style={{ fontWeight: 400, color: 'var(--muted)' }}>{p.ask}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          {Object.entries(FAMILIES).map(([k, l]) => (
            <span key={k} className="cap inline-flex items-center gap-1.5">
              <i style={{ width: 9, height: 9, borderRadius: 5, background: FAMILY_COL[k], display: 'inline-block' }} />{l}
            </span>
          ))}
        </div>
      </div>

      {pathOnly && (
        <div className="mt-3"><a className="btn btn-navy" href="#/partner/pipeline#library">Browse all {LIBRARY.length} formulations, by family and stage →</a></div>
      )}
      {!pathOnly && <>
      {/* ── the two filters he asked for: what it carries, and what form it is in ─────────────── */}
      <div className="panel-soft p-4 mt-3 grid gap-3">
        <div className="grid sm:grid-cols-[92px_1fr] gap-x-3 gap-y-2 items-baseline">
          <span className="cap" style={{ fontWeight: 700, color: 'var(--navy)' }}>Carries</span>
          <span className="flex flex-wrap gap-1.5">
            {NUT_ORDER.map(k => {
              const c = nutCount(k), on = nut === k
              if (!c) return null
              return (
                <button key={k} onClick={() => setNut(on ? null : k)} aria-pressed={on} title={NUTRIENT_LABEL[k]}
                  className="chip chip-sm" style={{
                    borderColor: NUTRIENT_COL[k], color: on ? '#fff' : NUTRIENT_COL[k],
                    background: on ? NUTRIENT_COL[k] : undefined, fontWeight: 700,
                  }}>
                  {k === 'Org' ? 'Humic' : k} <span className="cap" style={{ color: on ? 'rgba(255,255,255,.8)' : undefined }}>{c}</span>
                </button>
              )
            })}
          </span>
        </div>
        <div className="grid sm:grid-cols-[92px_1fr] gap-x-3 gap-y-2 items-baseline">
          <span className="cap" style={{ fontWeight: 700, color: 'var(--navy)' }}>Form</span>
          <span className="flex flex-wrap gap-1.5 items-center">
            {FORM_ORDER.map(f => {
              const c = formCount(f), on = form === f
              return (
                <button key={f} onClick={() => setForm(on ? null : f)} aria-pressed={on}
                  className={`chip chip-sm ${on ? 'on' : ''}`}>{FORM_LABEL[f]} <span className="cap">{c}</span></button>
              )
            })}
            {/* Said out loud rather than hidden: the filter does not cover every code, and the
                reason is VAN's own position on form, three sections down this same page. */}
            <span className="cap" style={{ color: 'var(--muted)' }}>
              The same composition is made in more than one form, so a form chip here means the library has fixed that form for this code.
            </span>
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <span className="cap"><b style={{ color: 'var(--navy)' }}>{list.length}</b> of {LIBRARY.length} formulations</span>
          {filtered && <button className="btn btn-ghost btn-sm" onClick={clear}>Clear filters ✕</button>}
        </div>
      </div>

      {/* ── the grid ─────────────────────────────────────────────────────────────────────────── */}
      {/* items-start, not the default stretch. Two reasons, and the second is the one that showed up
          on screen: a card whose text is short was padding itself out to match the tallest card in
          its row, which put a void between the sentence and the family line; and opening a card
          grew every card beside it by the height of the panel that only one of them was showing. */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 items-start">
        {list.map(l => {
          const m = meta(l.code)
          const col = FAMILY_COL[l.family]
          const on = open === l.code
          return (
            <div key={l.code} ref={el => { cards.current[l.code] = el }}
              className="panel flex flex-col overflow-hidden"
              style={{ borderColor: on ? col : undefined, borderWidth: on ? 2 : undefined, borderLeft: `5px solid ${col}` }}>
              <button onClick={() => setOpen(on ? null : l.code)} aria-expanded={on}
                className="text-left p-4 flex flex-col gap-2" style={{ cursor: 'pointer', background: 'transparent' }}>
                <span className="flex items-center justify-between gap-2">
                  <span className="num text-[20px]" style={{ color: 'var(--navy)' }}>{l.code}</span>
                  <span className="tag" style={{ background: `${STATUS_COL[l.status]}22`, color: STATUS_COL[l.status] }}>{l.status}</span>
                </span>

                {/* The chemistry, before the sentence. This is the line that makes a chelate look
                    different from an NPK without anybody having to read. */}
                {m.n.length > 0 && (
                  <span className="flex flex-wrap gap-1">
                    {m.n.map(([k, v]) => (
                      <span key={k} className="inline-flex items-baseline gap-1 rounded px-1.5 py-0.5"
                        title={NUTRIENT_LABEL[k]}
                        style={{ background: `${NUTRIENT_COL[k]}18`, color: NUTRIENT_COL[k], fontSize: 12, fontWeight: 700 }}>
                        {k === 'Org' ? 'Humic' : k}{v && <b className="num" style={{ fontSize: 13 }}>{v}</b>}
                      </span>
                    ))}
                  </span>
                )}

                <span className="font-bold leading-snug" style={{ color: 'var(--navy)' }}>{l.title}</span>
                <span className="small muted">{l.text}</span>

                <span className="cap flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
                  <i style={{ width: 8, height: 8, borderRadius: 4, background: col, display: 'inline-block' }} />
                  {FAMILIES[l.family]}
                  {m.form && <><span aria-hidden="true">·</span>{FORM_LABEL[m.form]}</>}
                  {m.apply?.map(a => <span key={a}>· {APPLY_LABEL[a]}</span>)}
                </span>
              </button>

              {on && (
                <div className="p-4 pt-0">
                  <div className="rounded-lg p-3" style={{ background: 'var(--sky)' }}>
                    <p className="cap" style={{ color: 'var(--navy)' }}>
                      {l.status === 'Available'
                        ? 'Ready to carry your name. Registration under your brand, with VAN named as the manufacturer, is the first step.'
                        : l.status === 'Validated'
                          ? 'Specification and data are locked. Nobody carries it under their name yet.'
                          : 'Still moving. Ask where it is before you plan a launch around it.'}
                    </p>
                    <a className="btn btn-navy btn-sm mt-3"
                      href={`mailto:${CONTACT.partnerEmail}?subject=${encodeURIComponent(`Formulation ${l.code}`)}&body=${encodeURIComponent(`We are interested in ${l.code} (${l.title}). Our market is:`)}`}>
                      Ask about {l.code} →
                    </a>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {!list.length && (
        <div className="panel p-8 text-center mt-3">
          <p className="muted">Nothing in the library matches all three filters at once.</p>
          <button className="btn btn-navy btn-sm mt-3" onClick={clear}>Clear filters</button>
        </div>
      )}
    </>}
    </div>
  )
}
