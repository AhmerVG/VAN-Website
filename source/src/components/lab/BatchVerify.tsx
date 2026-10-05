import { useEffect, useState } from 'react'
import { CONTACT, WA } from '@/data/site'
import { WaButton } from '@/components/bits'
import { VanForm } from '@/components/VanForm'
import { REPORT_BAG_FORM } from '@/data/formSpecs'
import { lookupBatch, normaliseBatch, type BatchReport, type LookupResult } from '@/lib/o2s'

/**
 * VERIFY A BATCH: NUMBER IN, LAB REPORT OUT. 5 Oct 2026, on the rulings of 3 Oct 2026.
 *
 * A farmer types the batch number printed on his bag and gets that batch's approved laboratory
 * report (PDF), nothing else. No product name, pack size, client, dates, status or deviation on
 * the page. He does not pick a product. The endpoint is in src/lib/o2s.ts.
 *
 * The 4 answers:
 *  · FOUND (200): "Lab report for batch {batch}, approved on {date}" and a button that opens the
 *    report. On a wide screen the report is also shown inside the page; on a phone the button is
 *    enough, and the file is not loaded until he asks for it.
 *  · NOT FOUND (404): not in VAN's records, or the report is not approved yet. No accusation, and
 *    the report-a-bag form and WhatsApp route stay (10 Sep 2026 ruling on the counterfeit case).
 *  · TOO MANY (429): try again in 10 minutes.
 *  · NO ANSWER or a server error: "the live check is not connected", and WhatsApp. Never a fail.
 *
 * Replaced: the product picker, the product comparison screens and the 3 worked examples
 * (10 Sep 2026), which showed the old screens.
 */

const fmtDate = (iso: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso
  const [y, m, d] = iso.split('-').map(Number)
  if (m < 1 || m > 12 || d < 1 || d > 31) return iso
  return `${d} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m - 1]} ${y}`
}

/** True on a screen wide enough to show a PDF inside the page. */
function useWide() {
  const q = '(min-width: 768px)'
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setWide(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return wide
}

function Found({ r }: { r: BatchReport }) {
  const wide = useWide()
  const approved = r.approvedOn ? `, approved on ${fmtDate(r.approvedOn)}` : ''
  return (
    <div className="panel p-5 lg:p-6" style={{ borderColor: 'var(--green)', borderWidth: 2 }}>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="bv-mark bv-pass" aria-hidden="true">✓</span>
        <div className="display text-[20px]" style={{ color: 'var(--navy)' }}>Lab report for batch {r.batch}{approved}</div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <a className="btn btn-navy btn-lg" href={r.reportUrl} target="_blank" rel="noopener noreferrer">Open the report</a>
      </div>
      {wide && (
        <iframe
          src={r.reportUrl}
          title={`Lab report for batch ${r.batch}`}
          className="mt-4"
          style={{ width: '100%', height: '75vh', minHeight: 480, border: '1px solid var(--line, #d6d3c8)', borderRadius: 8, background: '#fff' }}
        />
      )}
    </div>
  )
}

/** 404. His ruling: plainly, no accusation, and a route to send the bag. */
function NotFound({ batch }: { batch: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="panel p-5 lg:p-6" style={{ borderColor: 'var(--rust)', borderWidth: 2 }}>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="bv-mark bv-fail" aria-hidden="true">✕</span>
        <div className="display text-[20px] max-w-[60ch]" style={{ color: 'var(--navy)' }}>
          This batch number is not in VAN's records, or its lab report is not approved yet.
        </div>
      </div>
      <p className="small mt-3 max-w-[140ch]"><b>Check the number on the bag.</b></p>
      <p className="small mt-2 max-w-[140ch]">
        If the number is right, we would like to see the bag, and above all <b>where you bought it</b>.
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        <button className="btn btn-navy" onClick={() => setOpen(o => !o)} aria-expanded={open}>
          {open ? 'Close the form' : 'Report this bag to VAN'}
        </button>
        <WaButton href={WA.reportBag(batch)}>Send a photo on WhatsApp</WaButton>
      </div>
      {open && (
        <div className="mt-3">
          <VanForm
            form="report-bag"
            fields={REPORT_BAG_FORM}
            initial={{ batch }}
            intro="Hello VAN. I checked a batch number on van.com.pk and it is not in your records."
            submitLabel="Send the report"
            to={CONTACT.email}
            subject={`Batch number not in records: ${batch}`}
            success="It goes to the quality team, who trace it back to the district and the shop. If you have a photograph of the bag, send it on the WhatsApp number above and quote the batch number, since this form cannot carry a picture."
            compact
          />
        </div>
      )}
    </div>
  )
}

/** 429. */
function TooMany() {
  return (
    <div className="panel p-5 lg:p-6" style={{ borderColor: 'var(--gold)', borderWidth: 2 }}>
      <div className="display text-[19px]" style={{ color: 'var(--navy)' }}>Too many checks. Please try again in 10 minutes.</div>
    </div>
  )
}

/** No answer, or a server error. Says so, and does what the site did before. Never a fail. */
function Offline({ batch }: { batch: string }) {
  return (
    <div className="panel p-5 lg:p-6" style={{ borderColor: 'var(--gold)', borderWidth: 2 }}>
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div className="display text-[19px]" style={{ color: 'var(--navy)' }}>The live check is not connected yet</div>
        <span className="tag tag-gold">coming</span>
      </div>
      <p className="small mt-2 max-w-[140ch]">
        We are not going to show you a pass or a fail we have not read from the plant's own records. Send the number
        and someone will look it up and answer you today.
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        <WaButton href={WA.verify(batch)} lg>Send {batch || 'the number'} on WhatsApp</WaButton>
        <a className="btn btn-ghost btn-lg" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Lab report for VAN batch number ' + (batch || '____'))}`}>or email</a>
      </div>
    </div>
  )
}

export function BatchVerify() {
  const [batch, setBatch] = useState('')
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<LookupResult | null>(null)
  const [asked, setAsked] = useState('')
  const clean = normaliseBatch(batch)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clean || busy) return
    setBusy(true); setRes(null); setAsked(clean)
    setRes(await lookupBatch(clean))
    setBusy(false)
  }

  return (
    <div>
      <form onSubmit={submit} className="panel p-5 lg:p-6" style={{ borderColor: 'var(--navy)', borderWidth: 2 }}>
        <span className="eyebrow navy">Verify a bag</span>
        <h3 className="mt-1">Type the batch number, and open its lab report.</h3>
        <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end mt-4">
          <div>
            <label className="block font-bold small" htmlFor="bv-batch">Batch number, printed on the bag</label>
            <input id="bv-batch" className="input input-lg mt-1" value={batch} onChange={e => setBatch(e.target.value)}
              placeholder="e.g. VU25186" autoComplete="off" spellCheck={false} />
          </div>
          <button className="btn btn-navy btn-lg" type="submit" disabled={!clean || busy}>{busy ? 'Checking…' : 'Check it'}</button>
        </div>
        <p className="cap mt-3">No sign-in and no phone number. The batch number is printed on the bag, so only somebody holding the bag can enter it.</p>
      </form>

      <div aria-live="polite" className="grid gap-3 mt-3">
        {busy && <p className="small muted">Checking {asked}…</p>}
        {res?.ok && <Found r={res.report} />}
        {res && !res.ok && res.reason === 'not-found' && <NotFound batch={asked} />}
        {res && !res.ok && res.reason === 'too-many' && <TooMany />}
        {res && !res.ok && res.reason === 'offline' && <Offline batch={asked} />}
      </div>
    </div>
  )
}
