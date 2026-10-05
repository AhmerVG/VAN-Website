import { useMemo, useState } from 'react'
import { PRODUCTS } from '@/data/catalogue'
import { CONTACT, WA, COUNTS } from '@/data/site'
import { WaButton } from '@/components/bits'
import { VanForm } from '@/components/VanForm'
import { REPORT_BAG_FORM } from '@/data/formSpecs'
import { O2S, EXAMPLE_RECORD, certificateUrl, lookupBatch, normaliseBatch, type BatchRecord, type LookupResult } from '@/lib/o2s'

/**
 * VERIFY A BATCH, AND TAKE THE QC REPORT — 10 September 2026.
 *
 * Tahir: "we need to link the batch verification as well the lab report of the batch to O2S. My web
 * team is working on API call integration but we should build the front end so a farmer could be
 * able to verify batch and download the QC report of the batch."
 *
 * WHAT WAS THERE. A field that took a batch number and opened a WhatsApp message with it. That is
 * not verification; it is a way of asking a person to verify for you, and it took a working day.
 *
 * HIS FOUR RULINGS, and each one is visible in the code below:
 *  · ON SCREEN: the release line — product, pack, made on, released on, passed. The measured values
 *    against the declared analysis go in the certificate, not on the page.
 *  · THE INPUT: the batch number AND which product. Two fields, because a number typed correctly off
 *    the wrong bag is a real mistake, and a number that resolves to a different product is what a
 *    re-labelled bag looks like. That case is answered differently from a miss.
 *  · NOT FOUND: say it plainly, tell him it is most often a typing slip, and give him a way to send
 *    a photo of the bag. No accusation on the page, and VAN finds out where the bag came from.
 *  · THE REPORT: open to anyone holding the number, and stamped by O2S with the batch and the date
 *    it was downloaded so it cannot be passed off as another batch's.
 *
 * NOTHING HERE EVER INVENTS AN ANSWER. While O2S.enabled is false every lookup returns `offline` and
 * the panel says the live check is not connected yet and hands the reader WhatsApp, exactly as
 * today. A verification screen that guesses is worse than none at all, because the one person it
 * would mislead is the one holding a counterfeit bag.
 *
 * THE EXAMPLE VIEW is a separate, labelled panel. It shows the web team and Tahir all four finished
 * outcomes today, and it cannot be mistaken for a live check because it says what it is in its own
 * heading and carries no batch the reader typed.
 */

const fmtDate = (iso: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || 'n/a'
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m - 1]} ${y}`
}
const today = () => fmtDate(new Date().toISOString().slice(0, 10))

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="bv-line">
      <span className="cap">{k}</span>
      <span className="num" style={{ color: 'var(--navy)', fontWeight: 600 }}>{v}</span>
    </div>
  )
}

/** The pass. Release line on screen; the numbers are in the file. */
function Passed({ r, example = false }: { r: BatchRecord; example?: boolean }) {
  const href = r.certificateUrl ?? certificateUrl(r.batch)
  return (
    <div className="panel p-5 lg:p-6" style={{ borderColor: 'var(--green)', borderWidth: 2 }}>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="bv-mark bv-pass" aria-hidden="true">✓</span>
        <div>
          <div className="display text-[20px]" style={{ color: 'var(--navy)' }}>{r.batch} is a VAN batch</div>
          <div className="cap">released by VAN QC before it left the plant</div>
        </div>
      </div>
      <div className="bv-lines mt-4">
        <Line k="Product" v={r.productName} />
        <Line k="Registered analysis" v={r.analysis} />
        <Line k="Pack" v={r.pack} />
        <Line k="Made" v={fmtDate(r.madeOn)} />
        <Line k="Released by QC" v={r.releasedOn ? fmtDate(r.releasedOn) : 'not released'} />
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {example
          ? <span className="btn btn-navy btn-lg" aria-disabled="true" style={{ opacity: .5, pointerEvents: 'none' }}>Download the QC report (PDF)</span>
          : <a className="btn btn-navy btn-lg" href={href} target="_blank" rel="noopener">Download the QC report (PDF)</a>}
        <a className="btn btn-ghost" href={`#/products/${r.productSlug}`}>What this product is →</a>
      </div>
      <p className="cap mt-3 max-w-[140ch]">
        The report carries the measured values against the registered analysis, the test methods and the QC
        Manager's release. Every copy is stamped with <b>{r.batch}</b> and the date it was downloaded ({today()}),
        so it cannot be passed off as another batch's. {COUNTS.labStd}.
      </p>
    </div>
  )
}

/** A real VAN batch, wrong product. The one outcome that is worth a warning. */
function Mismatch({ r, picked }: { r: BatchRecord; picked: string }) {
  return (
    <div className="panel p-5 lg:p-6" style={{ borderColor: 'var(--gold)', borderWidth: 2, background: 'var(--gold-soft)' }}>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="bv-mark bv-warn" aria-hidden="true">!</span>
        <div>
          <div className="display text-[20px]" style={{ color: 'var(--navy)' }}>That number belongs to a different product</div>
          <div className="cap">{r.batch} is a VAN batch, but of {r.productName}, not {picked}</div>
        </div>
      </div>
      <p className="small mt-3 max-w-[140ch]">
        Read the bag again. If the number really is printed on a {picked} bag, then the number and the bag do not
        belong together, and VAN would like to see it.
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        <WaButton href={WA.reportBag(r.batch)}>Send us a photo of the bag</WaButton>
        <a className="btn btn-ghost" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Batch ' + r.batch + ' on the wrong bag')}`}>or email</a>
      </div>
    </div>
  )
}

/** Not in O2S at all. His ruling: plainly, no accusation, and a route to send the bag. */
function NotFound({ batch }: { batch: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="panel p-5 lg:p-6" style={{ borderColor: 'var(--rust)', borderWidth: 2 }}>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="bv-mark bv-fail" aria-hidden="true">✕</span>
        <div>
          <div className="display text-[20px]" style={{ color: 'var(--navy)' }}>{batch} is not in VAN's records</div>
          <div className="cap">no batch of that number was made and released here</div>
        </div>
      </div>
      <p className="small mt-3 max-w-[140ch]">
        <b>Check the number on the bag and try again first.</b> A digit typed wrongly looks exactly like a number
        that was never ours, and most of the time that is all it is.
      </p>
      <p className="small mt-2 max-w-[140ch]">
        If the number is right, we would like to see the bag, and above all <b>where you bought it</b>. A number
        nobody made matters far less than the shop it came out of.
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        <button className="btn btn-navy" onClick={() => setOpen(o => !o)} aria-expanded={open}>
          {open ? 'Close the report' : 'Report this bag to VAN'}
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

/** The endpoint is not wired yet. Says so, and does what the site did before. */
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
        <a className="btn btn-ghost btn-lg" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Certificate for VAN batch number ' + (batch || '____'))}`}>or email</a>
      </div>
    </div>
  )
}

export function BatchVerify({ compact = false }: { compact?: boolean }) {
  const [batch, setBatch] = useState('')
  const [slug, setSlug] = useState('')
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<LookupResult | null>(null)
  const [example, setExample] = useState<null | 'pass' | 'mismatch' | 'notfound'>(null)

  const products = useMemo(() => [...PRODUCTS].sort((a, b) => a.name.localeCompare(b.name)), [])
  const pickedName = products.find(p => p.slug === slug)?.name ?? ''
  const clean = normaliseBatch(batch)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clean) return
    setBusy(true); setExample(null)
    setRes(await lookupBatch(clean, slug || null))
    setBusy(false)
  }

  return (
    <div>
      <form onSubmit={submit} className="panel p-5 lg:p-6" style={{ borderColor: 'var(--navy)', borderWidth: 2 }}>
        <span className="eyebrow navy">Verify a bag</span>
        <h3 className="mt-1">Check the batch number, and take the QC report.</h3>
        <p className="small muted mt-1 max-w-[140ch]">
          The number is printed on the bag. Telling us which product it is stops a number read off the wrong bag from
          passing, so both are asked for.
        </p>
        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end mt-4">
          <div>
            <label className="block font-bold small" htmlFor="bv-batch">Batch number</label>
            <input id="bv-batch" className="input input-lg mt-1" value={batch} onChange={e => setBatch(e.target.value)}
              placeholder="e.g. VU25186" autoComplete="off" spellCheck={false} />
          </div>
          <div>
            <label className="block font-bold small" htmlFor="bv-product">Which product</label>
            <select id="bv-product" className="input input-lg mt-1" value={slug} onChange={e => setSlug(e.target.value)}>
              <option value="">Not sure / skip</option>
              {products.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}
            </select>
          </div>
          <button className="btn btn-navy btn-lg" type="submit" disabled={!clean || busy}>{busy ? 'Checking…' : 'Check it'}</button>
        </div>
        <p className="cap mt-3">No sign-in and no phone number. The batch number is printed on the bag, so only somebody holding the bag can enter it.</p>
      </form>

      <div aria-live="polite" className="grid gap-3 mt-3">
        {res?.ok && <Passed r={res.record} />}
        {res && !res.ok && res.reason === 'product-mismatch' && <Mismatch r={res.record} picked={pickedName} />}
        {res && !res.ok && res.reason === 'not-found' && <NotFound batch={clean} />}
        {res && !res.ok && res.reason === 'offline' && <Offline batch={clean} />}
      </div>

      {!compact && (
        <div className="panel-soft p-4 mt-3">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <span className="cap" style={{ fontWeight: 700, color: 'var(--navy)' }}>
              What the answer will look like · examples, not a live check
            </span>
            <span className="flex flex-wrap gap-2">
              <button className={`chip chip-xs ${example === 'pass' ? 'on' : ''}`} onClick={() => { setExample(example === 'pass' ? null : 'pass'); setRes(null) }}>A batch that passes</button>
              <button className={`chip chip-xs ${example === 'mismatch' ? 'on' : ''}`} onClick={() => { setExample(example === 'mismatch' ? null : 'mismatch'); setRes(null) }}>The wrong product</button>
              <button className={`chip chip-xs ${example === 'notfound' ? 'on' : ''}`} onClick={() => { setExample(example === 'notfound' ? null : 'notfound'); setRes(null) }}>Not in our records</button>
            </span>
          </div>
          {example && (
            <div className="mt-3">
              {example === 'pass' && <Passed r={EXAMPLE_RECORD} example />}
              {example === 'mismatch' && <Mismatch r={EXAMPLE_RECORD} picked="Green Sulfur" />}
              {example === 'notfound' && <NotFound batch="VU00000" />}
              <p className="cap mt-2">
                An example, drawn with an invented batch number so nobody can mistake it for a live result.
                {!O2S.enabled && ' The live check goes on the moment the plant’s own endpoint answers.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
