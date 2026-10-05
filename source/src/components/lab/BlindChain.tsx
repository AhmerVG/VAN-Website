import { useState } from 'react'
import { O2S, SAMPLE_STAGE_LABEL, lookupSample, normaliseBatch, type SampleResult } from '@/lib/o2s'

/**
 * THE BLIND CHAIN, DRAWN — O-15, 9 September 2026.
 *
 * Tahir: "VAN Lab · batch testing and certificates — THERE IS NO [diagram] ON THIS PAGE, SO CHAIN OF
 * SAMPLES, NO AUDIT TRAIL. ITS JUST TEXT. VERY POOR."
 *
 * He is right, and it is the sharpest observation of the day. The blind chain is the one claim on
 * this website that a competitor cannot copy by writing a better sentence, because it is a physical
 * arrangement rather than a promise: a separate reception address, a machine-generated code, one
 * sample split 3 ways, two analysts who never see each other's number, a manager who signs
 * against a code and does not know whose bag he is approving, and a retained portion held untouched
 * in case the result is ever disputed.
 *
 * All of that was delivered as a seven-row table of paragraphs and a second table of who-knows-what.
 * The reader had to build the picture in his head, and most will not. The strongest proof VAN owns
 * was the weakest thing on the page to look at.
 *
 * Nothing here is new copy. Every label is a fact the tables already stated; what changes is that a
 * reader can see the shape of it at a glance — your name travels along the first arrow, stops at
 * reception, and rejoins only at release.
 */

const STEPS = [
  { n: '01', t: 'Your parcel', s: 'You send it, with your name on it', k: 'you' },
  { n: '02', t: 'Sample Reception', s: 'Separate address. Knows who you are. Never sees your result', k: 'name' },
  { n: '03', t: 'A code is issued', s: 'By the system, not a person. It encodes nothing about you', k: 'code' },
  { n: '04', t: 'Split 3 ways', s: '2 portions forward, 1 retained untouched', k: 'split' },
  { n: '05', t: '2 analysts', s: 'Working independently. Neither sees the other’s number', k: 'code' },
  { n: '06', t: 'Compared, then signed', s: 'Against a documented criterion. The QC Manager signs a code', k: 'code' },
  { n: '07', t: 'The report finds you', s: 'The system reconnects the code to you at release, and logs it', k: 'you' },
]

const ROLES: [string, boolean, boolean, boolean][] = [
  ['Sample Reception (separate address)', true, false, false],
  ['Analyst A', false, true, false],
  ['Analyst B', false, true, false],
  ['Assistant QC Manager', false, true, true],
  ['QC Manager (signs)', false, false, true],
  ['Coordination / invoicing', true, false, false],
]

const KCOL: Record<string, string> = { you: 'var(--gold)', name: 'var(--rust)', code: 'var(--navy)', split: 'var(--green)' }
// D-151 (QA 9): step numbers as text, >= 4.5:1.
const KTEXT: Record<string, string> = { you: 'var(--gold-text)', name: 'var(--rust-text)', code: 'var(--navy)', split: 'var(--green-text)' }

export function ChainDiagram() {
  return (
    <div className="panel p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h4>Where your name goes, and where it stops</h4>
        <span className="cap">one parcel, 7 steps</span>
      </div>

      <div className="overflow-x-auto mt-3">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${STEPS.length}, minmax(132px, 1fr))`, minWidth: 940 }}>
          {STEPS.map((s, i) => (
            <div key={s.n} className="grid gap-1">
              <div className="flex items-center gap-1">
                <span className="num text-[13px] font-bold" style={{ color: KTEXT[s.k] }}>{s.n}</span>
                {i < STEPS.length - 1 && <span aria-hidden="true" style={{ flex: 1, height: 2, background: 'var(--line-2)' }} />}
              </div>
              <div className="panel-soft p-3 h-full" style={{ borderTop: `3px solid ${KCOL[s.k]}` }}>
                <b className="text-[14px]" style={{ color: 'var(--navy)' }}>{s.t}</b>
                <span className="cap block mt-1">{s.s}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-[auto_1fr] gap-3 items-center mt-4 panel-soft p-4">
        <div className="flex gap-2">
          <span className="tag" style={{ borderColor: 'var(--gold)', color: 'var(--gold-text)' }}>your name</span>
          <span className="tag" style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}>a code only</span>
        </div>
        <p className="small">
          <b>Your name travels as far as step 02 and rejoins at step 07.</b> Everything in between happens to a code.
          Nobody who tested your sample knew it was yours, which is why they cannot have gone easy on a VAN bag.
        </p>
      </div>
    </div>
  )
}

export function KnowsMatrix() {
  const cols = ['Knows who you are', 'Handles the sample', 'Sees the result']
  return (
    <div className="panel p-5">
      <h4>6 roles, and what each one knows and handles.</h4>
      <p className="cap mt-1">The only people who know your name never touch your sample.</p>
      <div className="overflow-x-auto mt-3">
        <table className="tbl" style={{ minWidth: 620 }}>
          <thead><tr><th>Role</th>{cols.map(c => <th key={c} className="r">{c}</th>)}</tr></thead>
          <tbody>
            {ROLES.map(([role, a, b, c]) => (
              <tr key={role}>
                <td className="font-semibold">{role}</td>
                {[a, b, c].map((v, i) => (
                  <td key={i} className="r">
                    <span aria-label={v ? 'yes' : 'no'} style={{
                      display: 'inline-block', width: 18, height: 18, borderRadius: 5,
                      background: v ? 'var(--navy)' : 'transparent',
                      border: v ? '2px solid var(--navy)' : '2px solid var(--line-2)',
                    }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="cap mt-3 max-w-[140ch]">Sample Reception is a separate location with its own address, independent of the laboratory. Segregation of duties is enforced by documented procedure, and reconnecting your code to your report at release is done by the system and logged, not performed by a person.</p>
    </div>
  )
}

/**
 * FOUR PLAIN STEPS — 11 September 2026. Tahir: replace "Where is my sample?" with plain booking
 * steps and no mention of a tracker. This says what a person does and what comes back, in the
 * order it happens, and links down to the full booking section for the detail. It advertises
 * nothing that does not exist. The tracker below it is kept in code for when O2S is connected.
 */
export function SampleSteps() {
  const steps: [string, string][] = [
    ['Send 500 g', 'Solid or liquid, by weight, in a sealed pack. Bring it to the laboratory, hand it to your VAN dealer, or courier it to Sample Reception, which is a separate address from the lab.'],
    ['Get a reference', 'Sample Reception logs it against your name and hands the lab a numbered parcel. From here on nobody who tests it knows whose it is.'],
    ['3 working days', 'For every test on the list except humic acid, which is 4, because that determination alone runs 36 hours. The clock starts when your booking is confirmed.'],
    ['The result, with its method', 'The measured value for each parameter you asked for, and the method that produced it, because a value only means something beside its method. Ask for the analyst by name on the landline if anything needs explaining.'],
  ]
  return (
    <div className="panel p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h4>Sending a sample, in 4 steps.</h4>
        <a className="cap" href="#/lab#booking">What to know before booking ›</a>
      </div>
      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 pl-0 list-none">
        {steps.map(([h, t], i) => (
          <li key={h} className="panel-soft p-4">
            <span className="num" style={{ color: 'var(--green)', fontWeight: 700 }}>0{i + 1}</span>
            <div className="font-bold mt-1" style={{ color: 'var(--navy)' }}>{h}</div>
            <p className="small muted mt-1">{t}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

/**
 * THE TRACKER — built 9 September, moved onto the real adapter 10 September.
 *
 * The page had been promising "you can check where your sample is at any time" with nothing on it
 * that lets anyone do that. Tahir confirmed the data exists: "O2S hold the sample status, o2s hold
 * the batch number, we can wire both. so build it. dont wire." It is now wired to the same adapter
 * as the batch check (src/lib/o2s.ts), so the web team implements one integration and this comes on
 * with the other. Until O2S.enabled is true every lookup answers `offline` and the panel says so
 * rather than inventing a stage.
 */
export function SampleTracker() {
  const [ref, setRef] = useState('')
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<SampleResult | null>(null)
  const clean = normaliseBatch(ref)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clean) return
    setBusy(true); setRes(await lookupSample(clean)); setBusy(false)
  }
  return (
    <div className="panel p-5" style={{ borderColor: 'var(--gold)', borderWidth: 2 }}>
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h4>Where is my sample?</h4>
        {!O2S.enabled && <span className="tag tag-gold">not connected yet</span>}
      </div>
      <p className="small muted mt-1 max-w-[140ch]">Anyone with a reference number can ask, without an account. The stages are the same seven the diagram shows.</p>
      <form className="flex flex-wrap gap-2 mt-3" onSubmit={submit}>
        <input className="input" style={{ maxWidth: 260 }} value={ref} onChange={e => setRef(e.target.value)} placeholder="Reference or batch number" aria-label="Reference or batch number" />
        <button className="btn btn-navy btn-sm" type="submit" disabled={!clean || busy}>{busy ? 'Checking…' : 'Check'}</button>
      </form>
      <div aria-live="polite">
        {res?.ok && (
          <div className="panel-soft p-4 mt-3">
            <div className="num" style={{ color: 'var(--navy)', fontWeight: 700 }}>{res.record.ref}</div>
            <p className="small mt-1"><b>{SAMPLE_STAGE_LABEL[res.record.stage]}</b>{res.record.updatedAt ? ` · updated ${res.record.updatedAt}` : ''}</p>
            {res.record.tests.length > 0 && <p className="cap mt-1">{res.record.tests.join(' · ')}</p>}
          </div>
        )}
        {res && !res.ok && (
          <div className="panel-soft p-4 mt-3">
            <p className="small">
              {res.reason === 'not-found'
                ? <><b>No sample with that reference.</b> Check the number on the receipt and try again.</>
                : <><b>This is not connected to the laboratory system yet, so we are not going to show you a status we have not read.</b>{' '}Send <b>{clean || 'your reference number'}</b> on WhatsApp and someone will look it up and tell you today.</>}
            </p>
            <a className="btn btn-wa btn-sm mt-3" href="https://wa.me/923005003041" target="_blank" rel="noopener">Ask on WhatsApp</a>
          </div>
        )}
      </div>
    </div>
  )
}
