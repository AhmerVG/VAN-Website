import { OUTLETS, SINDH_FOCAL, type Outlet } from '@/data/dealers'
import { CONTACT, WA } from '@/data/site'
import { SectionHead, WaButton } from '@/components/bits'

/**
 * WHERE TO BUY — O-9. See src/data/dealers.ts for where every row came from and what is left off.
 *
 * The page is built around the thing most dealer locators hide: with nine outlets, most readers will
 * not have one nearby. So the gap is stated in the second sentence rather than discovered after a
 * search returns nothing, and the page gives that reader a real next step instead of an empty map.
 */

const tel = (p: string) => 'tel:' + p.replace(/[^0-9+]/g, '').replace(/^0/, '+92')

function Row({ o }: { o: Outlet }) {
  const centre = o.kind === 'centre'
  return (
    <div className="panel p-5 grid gap-2" style={centre ? { borderColor: 'var(--gold)', borderWidth: 2 } : undefined}>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="display text-[18px]" style={{ color: 'var(--navy)' }}>{o.name}</span>
        {centre && <span className="tag tag-gold">Our own shop</span>}
      </div>
      <p className="small muted">{o.city}, {o.province}</p>
      <p className="small"><b>{o.contact}</b>{o.role && <span className="muted"> · {o.role}</span>}</p>
      {o.phone
        ? <a className="btn btn-ghost btn-sm justify-self-start" href={tel(o.phone)}>{o.phone}</a>
        : <p className="cap">{o.note}</p>}
    </div>
  )
}

export default function Dealers() {
  const centres = OUTLETS.filter(o => o.kind === 'centre')
  const dealers = OUTLETS.filter(o => o.kind === 'dealer')
  const punjab = dealers.filter(d => d.province === 'Punjab')
  const sindh = dealers.filter(d => d.province === 'Sindh')
  return (
    <div>
      <section style={{ background: 'linear-gradient(180deg, var(--gold-soft), var(--sand))' }}>
        <div className="wrap py-8 lg:py-12">
          <span className="eyebrow navy">Where to buy</span>
          <h1 className="max-w-[24ch]">9 places to buy VAN products, and what to do if none is near you</h1>
          <p className="lead mt-4 max-w-[140ch]">
            You can buy our products at {dealers.length + centres.length} places: {dealers.length} independent dealers and {centres.length} shops that we own, the Vital Agri Centers. Together they are in {new Set(OUTLETS.map(o => o.city)).size} towns.{' '}
            {/* Tahir 7 Nov 2026 (CO-29): 1 name for the team, "agronomy team". */}
            We also sell through distributors and through our agronomy team, which works with farmers directly. <b>If none of these places is near you, tell us where you are.</b>{' '}{/* L1 editor fix 7 Nov 2026 (company-b m20): the 2 spaces JSX dropped at the line breaks. */}
            We will either deliver to you or tell you that we cannot yet deliver to your area.
          </p>
          {/* 11 Sep 2026 · the buying page had no way to act above the fold. In this trade the
              enquiry happens on the phone, so the phone is the button. */}
          <div className="flex flex-wrap gap-3 mt-5">
            {/* D-192: the district box below is where the reader makes something to send; the hero keeps a
                plain link to it rather than a 2nd green button with the same message. */}
            <a className="btn btn-navy btn-lg" href="#outlets" onClick={e => { e.preventDefault(); document.getElementById('outlets')?.scrollIntoView({ behavior: 'smooth' }) }}>See the 9 places ↓</a>
            <a className="btn btn-ghost btn-lg" href="#/become-a-dealer">I want to become a dealer →</a>
          </div>
        </div>
      </section>

      <section className="wrap sec" id="outlets">
        <SectionHead eyebrow="Our own shops" title="2 Vital Agri Centers, both in Sindh" tone="gold" lead="We own and staff these shops. The person named under each shop answers its phone." />
        <div className="grid sm:grid-cols-2 gap-3">{centres.map(o => <Row key={o.code} o={o} />)}</div>
      </section>

      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SectionHead eyebrow="Dealers" title={`${dealers.length} dealers: ${punjab.length} in Punjab and ${sindh.length} in Sindh`} tone="navy" lead="These independent shops sell our brands. Each phone number is published with the dealer's agreement." />
        <h3 className="mt-2 mb-3">Punjab</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{punjab.map(o => <Row key={o.code} o={o} />)}</div>
        <h3 className="mt-7 mb-3">Sindh</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{sindh.map(o => <Row key={o.code} o={o} />)}</div>
      </div></section>

      {/* The gap, stated. This is the part a locator normally leaves the reader to find out for
          himself after a search returns nothing. */}
      <section className="wrap sec">
        <div className="panel p-5 lg:p-6 max-w-[140ch]">
          <span className="eyebrow rust">If there is no VAN outlet near you</span>
          {/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */}
          <h2 className="max-w-[26ch] mt-1">Most districts of Pakistan do not yet have a VAN outlet</h2>
          <p className="mt-3">For example, there is no VAN outlet in Faisalabad, Sargodha, Multan, Bahawalpur, Rahim Yar Khan or Dera Ghazi Khan. Tell us your district and what you grow, and we will tell you whether we can deliver to you.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <WaButton href={WA.dealer}>Tell us your district</WaButton>
            <a className="btn btn-ghost" href={`mailto:${CONTACT.cropEmail}?subject=${encodeURIComponent('Where can I buy VAN products')}`}>{CONTACT.cropEmail}</a>
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: 'var(--sky)' }}><div className="wrap">
        <SectionHead eyebrow="Becoming a dealer" title="In Sindh, contact Muhammad Irfan; in Punjab and elsewhere, contact the trade desk" tone="navy" />
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="panel p-5 grid gap-2">
            <span className="eyebrow">Sindh</span>
            <p><b>{SINDH_FOCAL.name}</b> <span className="muted">· {SINDH_FOCAL.role}</span></p>
            <p className="small muted">He heads our business in Sindh and deals with dealership enquiries across the province. In Sindh, contact him directly rather than writing to our general inbox.</p>
            <div className="flex flex-wrap gap-2 mt-1">
              <a className="btn btn-ghost btn-sm" href={tel(SINDH_FOCAL.phone)}>{SINDH_FOCAL.phone}</a>
              <a className="btn btn-ghost btn-sm" href={`mailto:${SINDH_FOCAL.email}`}>{SINDH_FOCAL.email}</a>
            </div>
          </div>
          <div className="panel p-5 grid gap-2">
            <span className="eyebrow">Punjab and everywhere else</span>
            <p><b>The trade desk</b></p>
            <p className="small muted">The trade desk handles dealer enquiries from Punjab and the rest of Pakistan. Write to {CONTACT.partnerEmail}. Our dealer page explains what we offer a dealer, how ordering works and how to start.</p>
            <div className="flex flex-wrap gap-2 mt-1">
              <a className="btn btn-navy btn-sm" href="#/become-a-dealer">What a dealership involves →</a>
              <a className="btn btn-ghost btn-sm" href={`mailto:${CONTACT.partnerEmail}`}>{CONTACT.partnerEmail}</a>
            </div>
          </div>
        </div>
      </div></section>
    </div>
  )
}
