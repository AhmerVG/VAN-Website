import { PARTNER, LIBRARY, WA, CONTACT, HOME_COPY } from '@/data/site'
import { SectionHead, WaButton } from '@/components/bits'
import { PartnerJourney } from '@/components/PartnerJourney'
import { PartnerNav } from '@/components/PartnerNav'
import { VanForm } from '@/components/VanForm'
import { PARTNER_FORM } from '@/data/formSpecs'
import { FormulationLibrary } from '@/components/FormulationLibrary'

const READY = LIBRARY.filter(l => l.status === 'Available').length

export default function Partner() {
  return (
    <div>
      {/* REBUILT 10 Sep 2026, second pass. The first version opened with a headline, two grey
          paragraphs and a small bordered number, and put the only interactive thing 800px below the
          fold. Tahir: "does the space on opening view is exciting and used in a manner which
          attracts someone? such a poor work." It was.
          The opening view now IS the journey: the headline, one line of who it is for, the number,
          and the two routes with their rail, all inside the first screen. */}
      <section style={{ background: 'linear-gradient(180deg, var(--green-soft), var(--sand))' }}>
        <div className="wrap pt-6 pb-4 lg:pt-7 lg:pb-4">
          <div className="grid lg:grid-cols-[1.35fr_1fr] gap-5 lg:gap-10 items-end">
            <div>
              <span className="eyebrow">Your Brand</span>
              <h1 className="max-w-[22ch]" style={{ fontSize: 'clamp(30px,4.2vw,52px)', lineHeight: 1.04 }}>{PARTNER.h1}</h1>
              <p className="lead mt-3 max-w-[140ch]">{PARTNER.kicker}.</p>
            </div>
            {/* The number sits in the hero as part of the composition rather than alone in a box
                under it, so the right side of a wide screen carries weight instead of air. */}
            <div className="grid gap-3 lg:justify-items-end">
              <div className="flex items-baseline gap-4 lg:justify-end">
                <span className="num" style={{ fontSize: 'clamp(52px,6vw,84px)', lineHeight: 0.9, color: 'var(--green)' }}>{PARTNER.proof.v}</span>
                <span className="small max-w-[22ch]" style={{ color: 'var(--navy)' }}>{PARTNER.proof.l}</span>
              </div>
              {/* 10 Sep 2026, Tahir: "the formulation library is buried in bottom and not really
                  attract attention... we should stitch it to the top somewhere, so one can move
                  straight to library if he want." A reader who already knows he wants something off
                  the shelf should not have to read a page about development first. */}
              <a className="btn btn-navy btn-sm" href="#library">
                Go straight to the library · {LIBRARY.length} formulations, {READY} ready to carry your name →
              </a>
              {/* 11 Sep 2026 · the hero's only door was the library. A procurement head who arrives
                  ready to talk had nothing to press until 13,000px down the page. */}
              <a className="btn btn-gold btn-sm" href="#talk">Talk to the commercial team →</a>
              {/* D-147: the company profile, for a partner who wants the whole company first. Revert: delete. */}
              <a className="btn btn-ghost btn-sm" href="#/company-profile">VAN’s company profile, and its PDF →</a>
              <a className="btn btn-ghost btn-sm" href="#/composition#library">Composition chart, every code with its analysis →</a>
            </div>
          </div>
          <p className="small mt-4 max-w-[140ch]">{PARTNER.lead}</p>
        </div>
      </section>

      <PartnerNav />

      {/* The routes and the rail start immediately, inside the first screen. */}
      <section id="journey" className="wrap pnav-target" style={{ paddingTop: 18, paddingBottom: 28 }}>
        <PartnerJourney />
      </section>

      {/* D-185, 26 Sep 2026: the 3 partnership models, who does what, and the range service.
          Tahir asked for the long term models to be stated plainly; licensing came off by his ruling. */}
      <section id="models" className="sec pnav-target"><div className="wrap">
        <SectionHead eyebrow="The long term" title={PARTNER.modelsH2} lead={PARTNER.modelsLead} />
        <div className="panel overflow-x-auto tbl-scroll"><table className="tbl" style={{ minWidth: 960 }}>
          <thead><tr>{PARTNER.modelsHead.map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {PARTNER.models.map(r => (
              <tr key={r[0]}>{r.map((c, i) => <td key={i} className={i === 0 ? 'font-bold' : ''} style={i === 0 ? { color: 'var(--navy)', whiteSpace: 'nowrap', fontFamily: "'Fraunces', Georgia, serif", fontSize: 17 } : undefined}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table></div>
        <p className="small muted mt-3 max-w-[120ch]">{PARTNER.modelsNote}</p>
      </div></section>

      <section id="range" className="sec pnav-target" style={{ background: 'var(--green-soft)' }}><div className="wrap">
        <SectionHead eyebrow="Building a portfolio" title={PARTNER.rangeH2} lead={PARTNER.rangeLead} />
        <ol className="rg-steps">
          {PARTNER.rangeSteps.map(([t, d, who], i) => (
            <li key={t} className="rg-step">
              <span className="rg-n num">{i + 1}</span>
              <div>
                <div className="rg-t">{t}</div>
                <p className="small muted mt-1">{d}</p>
                <span className={`rg-who rg-${who}`}>{who === 'you' ? 'You' : who === 'VAN' ? 'VAN' : 'Together'}</span>
              </div>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-3 mt-5"><a className="btn btn-navy" href="#talk">Send us your crops and regions →</a><a className="btn btn-ghost" href="#/products">The 23 brands</a></div>
      </div></section>

      {/* THE LIBRARY MOVED UP, 10 Sep 2026. It used to sit below the five sub-page links, which
          put twenty-five finished formulations underneath a list of links to pages about how
          formulations get made. Route 2 on the rail above ends in this section, so it now follows
          the rail directly. */}
      <section id="library" className="sec pnav-target" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SectionHead eyebrow="Ready to carry your name" title="The formulation library." lead="Formulations with no brand on them, each shown at its stage. They sit here under neutral codes, waiting for a name. The colour is the family, the chips are what it delivers, and the ladder shows how far along each one is." tone="navy" />
        {/* D-197: the full library lives on the Pipeline page; Your Brand keeps the ladder and the door (UX review, Tahir 27 Sep). */}
        <FormulationLibrary pathOnly />
      </div></section>

      {/**
        * THE PORTFOLIO — 11 September 2026.
        *
        * Tahir: "Make With Us names nothing real. Every other strong page does." His ruling was to
        * answer it as a portfolio, in numbers. The client-name firewall stays; this is the same
        * claim measured a way that needs no name on it. Every figure is published elsewhere on this
        * site. The three empty slots in PARTNER.portfolioPending render nothing until he fills them.
        */}
      <section id="portfolio" className="sec pnav-target" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SectionHead eyebrow="What is already made here" title={PARTNER.portfolioH2} lead={PARTNER.portfolioLead} tone="navy" />
        <div className="pf-grid">
          {PARTNER.portfolio.map(x => (
            <div key={x.l} className="pf-card">
              <div className="pf-n num">{x.v}</div>
              <div className="pf-l">{x.l}</div>
              <p className="cap mt-2">{x.note}</p>
            </div>
          ))}
          {PARTNER.portfolioPending.partners && (
            <div className="pf-card"><div className="pf-n num">{PARTNER.portfolioPending.partners}</div><div className="pf-l">companies, as against brands</div></div>
          )}
          {PARTNER.portfolioPending.oldest && (
            <div className="pf-card"><div className="pf-n num">{PARTNER.portfolioPending.oldest}</div><div className="pf-l">the year the longest-running partnership started</div></div>
          )}
          {PARTNER.portfolioPending.launchRange && (
            <div className="pf-card"><div className="pf-n num">{PARTNER.portfolioPending.launchRange}</div><div className="pf-l">fastest and slowest, brief to market</div></div>
          )}
        </div>
        <p className="src">Every figure on this block is published elsewhere on this site: the registration count and the largest partner on this page, the licences and standards on the regulatory page, the library in the section above, the tonnage made a year on the engineering page, the lines on the manufacturing page, and the order sizes and lead times among the questions at the foot of the dealer page. None of them is a client.</p>
      </div></section>

      <section id="detail" className="sec pnav-target"><div className="wrap">
        <div className="mb-7"><span className="eyebrow navy">In more detail</span><h2 className="max-w-[24ch]">5 pages, one for each part of the decision.</h2></div>
        <div className="grid md:grid-cols-2 gap-3">
          {[['From brief to bag', 'brief-to-bag', '7 steps from an idea to a registered product in a dealer\u2019s shop.'],
            ['VAN Engineering', 'engineering', 'The dials and their ranges: batch size, coating, chelation, solubility, pack.'],
            ['Manufacturing & quality', 'manufacturing', 'What is on site, how a lot is released, and the research farms behind it.'],
            ['Pipeline & formulation library', 'pipeline', `${LIBRARY.length} unbranded codes, the 6-stage path, and what is published before an agreement.`],
            ['Regulatory & registration', 'regulatory', 'The live PSQCA licences VAN holds, and the same team run for partners.']].map(([t, sl, d]) => (
            <a key={sl} className="panel p-4 no-underline hover:border-[var(--navy)]" href={`#/partner/${sl}`}>
              <div className="font-bold display text-[17px]">{t}</div>
              <p className="cap mt-1">{d}</p>
            </a>
          ))}
        </div>
      </div></section>


      {/* Naming the limits is how every other page on this site earns its reader. Tahir picked these
          three himself. The old commercial-terms block (non-exclusive by default, exclusivity earned
          by volume, and the "No surprises" promise) came off at his instruction. */}
      <section id="limits" className="wrap sec pnav-target">
        <SectionHead eyebrow="Before you ask" title={PARTNER.limitsH2} tone="rust" />
        <div className="grid md:grid-cols-3 gap-4">{PARTNER.limits.map(([h, t]) => <div key={h} className="panel p-5"><h4>{h}</h4><p className="small muted mt-2">{t}</p></div>)}</div>
        <p className="small mt-4 max-w-[140ch]"><b>Minimum order.</b> {PARTNER.minimum}</p>
        <div className="grid lg:grid-cols-2 gap-4 mt-8">
          <div className="panel-soil p-6"><span className="eyebrow soil">{PARTNER.whoH2}</span><p className="small mt-2">{PARTNER.who}</p><div className="flex flex-wrap gap-2 mt-3">{PARTNER.whoTypes.map(t => <span key={t} className="tag tag-soil">{t}</span>)}</div><p className="cap mt-3">{PARTNER.firewall}</p></div>
          <div className="panel-sky p-6"><span className="eyebrow navy">What the lines can do</span><div className="grid gap-3 mt-2">{PARTNER.capability.map(([h, t]) => <div key={h}><div className="font-bold">{h}</div><p className="small muted">{t}</p></div>)}</div></div>
        </div>
      </section>

      {/* 10 Sep 2026: this panel used to be a headline and a mailto link. A multinational's first
          approach to VAN was "here is an email address, write to us." It asks the four things that
          would be asked in the first meeting anyway, so the first reply can be useful rather than a
          request for more information. */}
      <section id="talk" className="wrap sec-tight pnav-target">
        <div className="panel-navy p-6 lg:p-8">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-6 lg:gap-9 items-start">
            <div>
              <span className="eyebrow" style={{ color: 'var(--gold)' }}>Start a conversation</span>
              <h2 className="text-[clamp(26px,2.6vw,36px)]">{HOME_COPY.makeH2}</h2>
              <p className="mt-3" style={{ color: 'rgba(255,255,255,.8)' }}>Tell us the crop, the market and the constraint you are trying to solve. If something in the catalogue or the library already answers it, we will say so rather than start a development project.</p>
              {/* 11 Sep 2026 · this opened WA.distributor, so a procurement head at a multinational
                  introduced himself as a distributor asking about range and territory. There is now
                  a partner line, and the person who answers is named here rather than three pages
                  away on the About page. */}
              {/* D-205, 27 Sep 2026: the "WhatsApp the commercial team" button came off; the dock's
                  Talk to VAN opens the identical message on this page. The email stays. */}
              <div className="grid gap-3 mt-5">
                <a className="btn" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }} href={`mailto:${CONTACT.partnerEmail}`}>{CONTACT.partnerEmail}</a>
              </div>
              <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,.2)' }}>
                <div className="font-bold">Muhammad Ali · Chief Commercial Officer</div>
                <p className="cap mt-1">Supply, pricing, own-brand manufacturing and distribution. He is the person who answers this form.</p>
                <a className="cap" style={{ color: 'var(--gold)' }} href="mailto:muhammad.ali@van.com.pk">muhammad.ali@van.com.pk</a>
              </div>
              <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,.2)' }}>
                <div className="font-bold">Or come and see the plant</div>
                <p className="cap mt-1">Plant visits are part of most partner conversations, and for a co-manufacturing decision they are usually the point at which it becomes a real one.</p>
                <WaButton href={WA.plantVisit}>Arrange a plant visit</WaButton>
              </div>
            </div>
            <div>
            {/* The one-working-day promise used to live only in the success message, which is a
                state nobody reaches while the endpoint is off. It belongs above the button, where
                it is doing work. */}
            <p className="small mb-3" style={{ color: 'rgba(255,255,255,.85)' }}>The commercial team answers within 1 working day. The first conversation is about whether VAN already has something that answers your problem, because that is a 3-month route rather than a 12-month one.</p>
            <VanForm
              form="partner"
              fields={PARTNER_FORM}
              intro="Hello VAN. We would like to talk about making a product with you."
              submitLabel="Send it to the commercial team"
              to={CONTACT.partnerEmail}
              subject="Partner enquiry from van.com.pk"
              success="It goes to the commercial team, who answer within 1 working day. The first conversation is about whether VAN already has something that answers your problem, because that is a 3-month route rather than a 12-month one."
            />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
