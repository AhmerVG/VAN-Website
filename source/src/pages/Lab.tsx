import { LAB, WA, CONTACT, VERIFY } from '@/data/site'
import { SectionHead, WaButton, Stat } from '@/components/bits'
import { VerifyPanel } from '@/components/VerifyPanel'
import { BatchVerify } from '@/components/lab/BatchVerify'
import { VanForm } from '@/components/VanForm'
import { LAB_TEST_FORM } from '@/data/formSpecs'
import { PartnerNav } from '@/components/PartnerNav'
import { Detail } from '@/components/Detail'
import {
  CHAIN, ROLES, ROLES_NOTE, CHAIN_WHY, PRICE_GROUPS, PRICE_LEAD, PRICE_NOTE,
  BOOK_STEPS, BOOK_INTRO, WHO, VOLUME_NOTE, SOIL_NOTE, DAYS_NOTE, PAYING, type ChainKey,
} from '@/data/lab'
import { LabScene } from '@/components/lab/LabScene'

export function Verify() {
  return (
    <div className="wrap py-8 lg:py-12">
      <VerifyPanel full />
      {/* 10 Sep 2026: the page had a field that opened a WhatsApp message. That is a way of asking a
          person to verify for you, and it took a working day. This is the check itself, built
          against O2S's own records. 5 Oct 2026: number in, lab report out. See src/lib/o2s.ts. */}
      <section className="mt-8"><BatchVerify /></section>
      <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 mt-8">
        <div className="panel p-6">
          <span className="eyebrow">What you get, and how</span>
          <ol className="list-none p-0 m-0 grid gap-4 mt-3">
            {VERIFY.steps.map((s, i) => <li key={s} className="flex gap-4"><span className="num flex items-center justify-center shrink-0" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--gold)', color: 'var(--navy)', fontSize: 20 }}>{i + 1}</span><span>{s}</span></li>)}
          </ol>
        </div>
        <div className="grid gap-4">
          <div className="panel-soft p-6"><p className="small">{VERIFY.note}</p></div>
          <div className="panel-green p-6"><p className="small">{VERIFY.blind}</p><a className="btn btn-navy btn-sm mt-3" href="#/lab">How a sample is handled →</a></div>
        </div>
      </section>
    </div>
  )
}

/**
 * VAN LAB — D-166, 25 Sep 2026. One page, told once, in the order a sender needs it:
 * which door is mine → why the number can be trusted → what it costs → how to send it → the trade.
 * The four old anchors that the 301s land on are kept: #blind-chain, #prices, #book, #trade.
 * #booking and #chain-drawn, used by older links, land on the same sections.
 * Data and the account of what moved where: src/data/lab.ts. Revert: the v54 source zip.
 */

const KCOL: Record<ChainKey, string> = { you: 'var(--gold)', name: 'var(--rust)', code: 'var(--navy)', split: 'var(--green)' }
// D-151 (QA 9): step numbers as text, >= 4.5:1. Carried from BlindChain.tsx.
const KTEXT: Record<ChainKey, string> = { you: 'var(--gold-text)', name: 'var(--rust-text)', code: 'var(--navy)', split: 'var(--green-text)' }

const NAV: [string, string][] = [
  ['start', 'Start here'],
  ['blind-chain', 'The blind chain'],
  ['prices', 'Tests and prices'],
  ['book', 'Book a test'],
  ['trade', 'Distributors, importers, labs'],
]

/** A vertical chain at every width: nothing to swipe, nothing cut off, 7 of 7 steps visible. */
function Chain() {
  return (
    <ol className="list-none p-0 m-0">
      {CHAIN.map((s, i) => (
        <li key={s.n} className="grid gap-x-4" style={{ gridTemplateColumns: '40px 1fr' }}>
          <div className="flex flex-col items-center">
            <span className="num flex items-center justify-center shrink-0" style={{ width: 40, height: 40, borderRadius: 999, border: `2.5px solid ${KCOL[s.k]}`, background: 'var(--paper)', color: KTEXT[s.k], fontSize: 14 }}>{s.n}</span>
            {i < CHAIN.length - 1 && <span aria-hidden="true" style={{ flex: 1, width: 3, minHeight: 16, background: CHAIN[i + 1].k === 'you' || s.k === 'you' || s.k === 'name' ? 'var(--gold)' : 'var(--navy)', opacity: .55 }} />}
          </div>
          <div className="pb-6">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-2">
              <h3 className="m-0" style={{ fontSize: 19 }}>{s.t}</h3>
              <span className="tag" style={{ border: `1.5px solid ${KCOL[s.k]}`, color: KTEXT[s.k], fontSize: 10.5 }}>{s.k === 'code' || s.k === 'split' ? 'a code only' : 'your name'}</span>
            </div>
            <p className="font-semibold mt-1" style={{ color: 'var(--navy)' }}>{s.s}</p>
            {s.detail && <Detail bare label={`How step ${s.n} works`}><p className="small muted mt-1">{s.detail}</p></Detail>}
          </div>
        </li>
      ))}
    </ol>
  )
}

/** The 6 roles. A real table with short headers, so it fits a 360px phone without scrolling. */
function Roles() {
  const cols = ['Knows who you are', 'Handles the sample', 'Sees the result']
  return (
    <div className="panel p-5">
      <h3 style={{ fontSize: 19 }}>6 roles, and what each one knows and handles.</h3>
      <p className="cap mt-1">The only people who know your name never touch your sample.</p>
      <table className="tbl mt-3" style={{ fontSize: 14 }}>
        <thead><tr><th style={{ paddingLeft: 0 }}>Role</th>{cols.map(c => <th key={c} className="text-center" style={{ fontSize: 10.5, letterSpacing: '.04em', lineHeight: 1.25, padding: '8px 4px', width: '19%' }}>{c}</th>)}</tr></thead>
        <tbody>
          {ROLES.map(([role, a, b, c]) => (
            <tr key={role}>
              <td className="font-semibold" style={{ paddingLeft: 0 }}>{role}</td>
              {[a, b, c].map((v, i) => (
                <td key={i} className="text-center" style={{ padding: '9px 4px' }}>
                  <span role="img" aria-label={`${cols[i]}: ${v ? 'yes' : 'no'}`} style={{
                    display: 'inline-block', width: 18, height: 18, borderRadius: 5, verticalAlign: 'middle',
                    background: v ? 'var(--navy)' : 'transparent',
                    border: v ? '2px solid var(--navy)' : '2px solid var(--line-2)',
                  }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="cap mt-3">{ROLES_NOTE}</p>
    </div>
  )
}

/** The price list: Test · PKR · Days, the Accredited mark beside the test name, 5 group headings. */
function Prices() {
  return (
    <div className="panel p-4 lg:p-6">
      <table className="tbl">
        <thead><tr><th style={{ paddingLeft: 0 }}>Test</th><th className="r">Price (PKR)</th><th className="r">Days in the laboratory</th></tr></thead>
        {PRICE_GROUPS.map(g => (
          <tbody key={g.h}>
            <tr><th colSpan={3} scope="colgroup" style={{ paddingLeft: 0, paddingTop: 18, color: 'var(--navy)' }}>{g.h}</th></tr>
            {g.rows.map(r => (
              <tr key={r.test}>
                <td style={{ paddingLeft: 0 }}>
                  <span className="font-semibold" style={{ color: 'var(--navy)' }}>{r.test}</span>
                  {r.acc && <span className="tag tag-green ml-2" style={{ fontSize: 10.5, padding: '2px 7px' }}>Accredited</span>}
                  {r.note && <span className="cap block">{r.note}</span>}
                </td>
                <td className="r num" style={{ fontWeight: 600 }}>{r.pkr}</td>
                <td className="r num" style={{ fontWeight: 600 }}>{r.days}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
      <p className="cap mt-4 max-w-[110ch]">{DAYS_NOTE} {PRICE_NOTE}</p>
      <p className="small mt-3 panel-gold p-3 max-w-[110ch]"><b style={{ color: 'var(--navy)' }}>Soil.</b> {SOIL_NOTE}</p>
    </div>
  )
}

export default function Lab() {
  return (
    <div>
      {/* 1 · Start here. The hero's own two buttons were the same two actions as the two cards under
          them, so the cards are the hero's actions now. */}
      <section id="start" className="pnav-target" style={{ background: 'linear-gradient(180deg, var(--sky), var(--sand))' }}>
        <div className="wrap py-8 lg:py-12">
          <span className="eyebrow navy">VAN Lab · batch testing and certificates</span>
          <h1>{LAB.h1}</h1>
          <p className="lead mt-4 max-w-[75ch]">{LAB.lead}</p>
          {/* D-167: the drawn scene (his 11 Sep ruling D-112, built 25 Sep). */}
          <div className="mt-6"><LabScene /></div>
          <div className="grid lg:grid-cols-2 gap-5 mt-6">
            <div className="panel p-6" style={{ borderColor: 'var(--green)', borderWidth: 2 }}>
              <span className="eyebrow">You bought VAN product</span>
              <h2 style={{ fontSize: 'clamp(22px, 2.2vw, 28px)' }}>Check the batch number.</h2>
              <p className="small muted mt-2">The number is printed on the bag. It opens the approved lab report for that batch. There is no charge and nothing to send back.</p>
              <a className="btn btn-green mt-4" href="#/verify">Verify a batch and take the report →</a>
            </div>
            <div className="panel p-6" style={{ borderColor: 'var(--navy)', borderWidth: 2 }}>
              <span className="eyebrow soil">You bought anything else</span>
              <h2 style={{ fontSize: 'clamp(22px, 2.2vw, 28px)' }}>Send us 500 g.</h2>
              <p className="small muted mt-2">Any fertilizer, any brand, any manufacturer. Send us 500 g and we will measure what is in it, against the published price list. The result is the same certificate we issue to importers and laboratories, with the 8 accredited tests marked.</p>
              <div className="flex flex-wrap gap-3 mt-4">
                <a className="btn btn-navy" href="#book">Book a test →</a>
                <WaButton href={WA.lab}>Ask on WhatsApp</WaButton>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">{LAB.stats.map(([v, l]) => <Stat key={l} v={v} l={l} tone="navy" compact />)}</div>
        </div>
      </section>

      <PartnerNav items={NAV} />

      {/* 2 · The blind chain, told once: the drawn chain with each step's full explanation inside it,
          and beside it the roles table and the one line on why it matters. */}
      <section id="blind-chain" className="wrap sec pnav-target">
        <span id="chain-drawn" className="pnav-target" aria-hidden="true" />
        <SectionHead eyebrow="The blind chain" tone="navy"
          title="Nobody who tested your sample knew it was yours."
          lead={<>{LAB.why1} {LAB.why2}</>} />
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-10 items-start">
          <div>
            <p className="eyebrow mb-1" style={{ color: 'var(--muted)' }}>One parcel, 7 steps</p>
            {/* D-169: carried back from the v54 lead (the independent review found it had been lost). */}
            <p className="cap mb-4">The separation is built into the buildings and the coding system rather than written down as a policy promise.</p>
            <Chain />
          </div>
          <div className="grid gap-4 lg:sticky" style={{ top: 'calc(var(--hdr-h) + 64px)' }}>
            <div className="panel-soft p-5" style={{ borderLeft: '4px solid var(--gold)' }}>
              <p><b style={{ color: 'var(--navy)' }}>Your name travels as far as step 02 and rejoins at step 07.</b> Everything in between happens to a code.</p>
            </div>
            <Roles />
            <Detail bare label="Why this matters to you"><p className="small muted">{CHAIN_WHY}</p></Detail>
          </div>
        </div>
      </section>

      {/* 3 · Tests and prices */}
      <section id="prices" className="sec pnav-target" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SectionHead eyebrow="Tests and prices" tone="green" title="Every fertilizer test, every price, published." lead={PRICE_LEAD} />
        <Prices />
      </div></section>

      {/* 4 · Book a test. Steps on the left, the form on the right. */}
      <section id="book" className="wrap sec pnav-target">
        <span id="booking" className="pnav-target" aria-hidden="true" />
        <SectionHead eyebrow="Book a test" tone="soil" title="Tell us what to expect, then send the sample." lead={BOOK_INTRO} />
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6 lg:gap-10 items-start">
          <ol className="list-none p-0 m-0 grid gap-3">
            {BOOK_STEPS.map(([h, t], i) => (
              <li key={h} className="panel-soft p-4 grid gap-x-3" style={{ gridTemplateColumns: '36px 1fr' }}>
                <span className="num" style={{ color: 'var(--green-text)', fontSize: 20 }}>0{i + 1}</span>
                <div><div className="font-bold" style={{ color: 'var(--navy)' }}>{h}</div><p className="small muted mt-1">{t}</p></div>
              </li>
            ))}
          </ol>
          <div className="lg:sticky" style={{ top: 'calc(var(--hdr-h) + 64px)' }}>
            <VanForm
              form="lab-test"
              fields={LAB_TEST_FORM}
              intro="Hello VAN Sample Reception. I would like to book a sample test."
              submitLabel="Book the test"
              to={CONTACT.cropEmail}
              subject="Test booking from van.com.pk"
              success="Sample Reception confirms what applies, what it costs and where to send the sample. Nothing is charged until you have agreed the price."
            />
            {/* D-168: the one public contact for a sample is Sample Reception. Never the laboratory. */}
            <div className="panel-soft p-5 mt-4">
              <span className="eyebrow soil">Sample Reception</span>
              <p className="font-semibold mt-1" style={{ color: 'var(--navy)' }}>{CONTACT.sampleReception}</p>
              <p className="small mt-2">
                Call <a href={`tel:${CONTACT.landlineTel}`}>{CONTACT.landline}</a> · WhatsApp <a href={WA.lab} target="_blank" rel="noopener">{CONTACT.whatsapp}</a> · <a href={`mailto:${CONTACT.cropEmail}`}>{CONTACT.cropEmail}</a>
              </p>
              <p className="cap mt-2">Every question about a sample goes to Sample Reception, never to the laboratory or an analyst.</p>
              <p className="cap mt-2">{PAYING}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 · Who sends samples: one card per sender, each with its own case. */}
      <section id="trade" className="sec pnav-target" style={{ background: 'var(--sky)' }}><div className="wrap">
        <SectionHead eyebrow="Who sends us samples" tone="navy" title="Farmers, distributors, importers, laboratories." />
        <div className="grid md:grid-cols-2 gap-4">
          {WHO.map(w => (
            <div key={w.h} className="panel p-5">
              <h3 style={{ fontSize: 19 }}>{w.h}</h3>
              <p className="font-semibold mt-1" style={{ color: 'var(--navy)' }}>{w.s}</p>
              {w.body && <Detail bare label={`More for ${w.h.toLowerCase()}`}><p className="small muted mt-2">{w.body}</p></Detail>}
              {w.h === 'Farmers' && <span className="flex flex-wrap gap-2 mt-4"><a className="btn btn-green btn-sm" href="#/verify">Verify a VAN bag →</a><a className="btn btn-ghost btn-sm" href="#/lab#book">Test any brand →</a></span>}
            </div>
          ))}
        </div>
        <p className="small mt-5 max-w-[110ch]">{VOLUME_NOTE}</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <a className="btn btn-navy" href="#book">Book a test →</a>
          {/* D-192: the 3rd "Ask on WhatsApp" on this page came off; the booking block above carries it. */}
        </div>
      </div></section>
    </div>
  )
}
