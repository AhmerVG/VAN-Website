import { VERIFY, HOME_COPY, COUNTS } from '@/data/site'
import { useBatchCheck, BatchResult } from '@/components/lab/BatchVerify'
import { noStop } from '@/components/bits'   // Tahir 7 Nov 2026 (CR-23): no full stop at the end of a heading

/** A drawn VAN bag. When a batch number is typed the tick draws itself. */
function BagCheck({ batch }: { batch: string }) {
  const has = batch.trim().length > 0
  return (
    <svg viewBox="0 0 220 300" width="100%" style={{ maxWidth: 300, margin: '0 auto' }} className={has ? 'tick-on' : ''} aria-hidden="true">
      <g className="a-bag">
        <path d="M40 34h140l14 26v206a12 12 0 0 1-12 12H38a12 12 0 0 1-12-12V60z" fill="#fff" stroke="#14231A" strokeWidth="4" strokeLinejoin="round" />
        <path d="M40 34l-14 26h168l-14-26" fill="#E6EEE8" stroke="#14231A" strokeWidth="4" strokeLinejoin="round" />
        <rect x="38" y="84" width="144" height="86" rx="8" fill="#14231A" />
        <text x="110" y="122" textAnchor="middle" fontFamily="Public Sans, sans-serif" fontWeight="700" fontSize="30" fill="#fff">VAN</text>
        <text x="110" y="150" textAnchor="middle" fontFamily="Public Sans, sans-serif" fontSize="9" fill="#D9A21B" letterSpacing="0.8">TESTED BEFORE IT SHIPS</text>
        <rect x="46" y="186" width="128" height="34" rx="6" fill="#F0EEE5" stroke="#14231A" strokeWidth="2" strokeDasharray={has ? '0' : '6 4'} />
        <text x="54" y="199" fontFamily="Public Sans, sans-serif" fontSize="10" fill="#5B6A5E">BATCH No.</text>
        <text x="54" y="214" fontFamily="Public Sans, sans-serif" fontWeight="700" fontSize="14" fill="#14231A">{has ? batch.slice(0, 14) : '________'}</text>
        <text x="110" y="250" textAnchor="middle" fontFamily="Public Sans, sans-serif" fontSize="11" fill="#5B6A5E">{COUNTS.lab} · ISO/IEC 17025:2017</text>
      </g>
      <g className="a-pop" style={{ opacity: has ? undefined : 0 }}>
        <circle cx="176" cy="60" r="30" fill="#2F6B3A" stroke="#fff" strokeWidth="4" />
        <path d="M160 61l11 11 21-24" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset="60" className="a-tick" />
      </g>
    </svg>
  )
}

/** 7 Oct 2026: the box runs the live check (src/lib/o2s.ts) and the report opens under it. The
 *  "Send it on WhatsApp" and "or email" buttons came off; WhatsApp and email now appear only when
 *  the number is not found or the check cannot answer (BatchVerify.tsx). */
/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */
export function VerifyPanel({ full = false }: { full?: boolean }) {
  const { batch, setBatch, busy, res, asked, clean, submit } = useBatchCheck()
  return (
    <div>
    <div className="panel p-6 lg:p-10 grid lg:grid-cols-[1.25fr_0.75fr] gap-8 items-center" style={{ borderColor: 'var(--green)', borderWidth: 2 }}>
      <form onSubmit={submit}>
        <span className="eyebrow">Verify a bag</span>
        {full ? <h1 className="max-w-[20ch]">{noStop(VERIFY.h1)}</h1> : <h2 className="max-w-[20ch]">{noStop(HOME_COPY.verifyH2)}</h2>}
        <p className="lead mt-4">{full ? VERIFY.lead : HOME_COPY.verifyLead}</p>
        <div className="flex flex-wrap gap-2 mt-5">
          <span className="tag tag-green">PNAC accredited</span><span className="tag tag-green">{COUNTS.lab}</span><span className="tag tag-green">ISO/IEC 17025:2017</span>
        </div>
        <label className="block mt-7 font-bold" htmlFor={full ? 'batch-full' : 'batch-home'}>Batch number, printed on the bag</label>
        <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end mt-2">
          <input id={full ? 'batch-full' : 'batch-home'} className="input input-lg" placeholder="e.g. VU25186" value={batch} onChange={e => setBatch(e.target.value)} autoComplete="off" spellCheck={false} inputMode="text" />
          <button className="btn btn-navy btn-lg" type="submit" disabled={!clean || busy}>{busy ? 'Checking…' : 'Get the lab report'}</button>
        </div>
        <p className="cap mt-3">You do not need to sign in or give a phone number. You need only the bag. {!full && <a href="#/verify">How verification works ›</a>}</p>
        {/* The blind-test offer is written out on /verify, which is the page about verification.
            On the home page it is a line and a link, not the same paragraph a second time. */}
        {/* L1 editor fix 7 Nov 2026 (company-a B3): Sample Reception is in a separate building (as on the Lab page); "independently" dropped. */}
        {full ? null : (
          <p className="small muted mt-5">To have one of our products tested blind, send 500 g of it to Sample Reception, which works from a separate building from our laboratory, and book a normal paid test. The sample is given a code in place of the product name, so the analysts do not know that it is our product. <a href="#/verify">How that works ›</a></p>
        )}
      </form>
      <div className="order-first lg:order-none"><BagCheck batch={batch} /></div>
    </div>
    <BatchResult busy={busy} res={res} asked={asked} />
    </div>
  )
}
