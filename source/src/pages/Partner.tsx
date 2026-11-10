import { PARTNER, LIBRARY, WA, CONTACT, HOME_COPY, COUNTS } from '@/data/site'
import { SectionHead, WaButton, noStop } from '@/components/bits'
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
              <h1 className="max-w-[22ch]" style={{ fontSize: 'clamp(30px,4.2vw,52px)', lineHeight: 1.04 }}>{noStop(PARTNER.h1)}</h1>
              <p className="lead mt-3 max-w-[140ch]">{PARTNER.kicker}.</p>
              <p className="small mt-3 max-w-[140ch]">{PARTNER.lead}</p>
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
                Go straight to the library · {LIBRARY.length} formulations, {READY} ready to carry your name →
              </a>
              {/* 11 Sep 2026 · the hero's only door was the library. A procurement head who arrives
                  ready to talk had nothing to press until 13,000px down the page. */}
              <a className="btn btn-gold btn-sm" href="#talk">Talk to the commercial team →</a>
              {/* D-147: the company profile, for a partner who wants the whole company first. Revert: delete. */}
              <a className="btn btn-ghost btn-sm" href="#/company-profile">VAN’s company profile, and its PDF →</a>
              <a className="btn btn-ghost btn-sm" href="#/composition#library">Composition chart: every code with its analysis →</a>
            </div>
          </div>
          {/* D-257, Tahir 18 Oct 2026: the 12 licensed products, said first. Tahir 9 Nov 2026: the 10 library codes marked Available are among the 12 licensed products. */}
          <p className="pr-ready mt-4"><b className="num">{COUNTS.licencesPartnerReady}</b> products already hold a PSQCA (Pakistan Standards and Quality Control Authority) licence, including the <b className="num">{READY}</b> library codes marked Available. A partner can launch any of them under its own brand within <b>{COUNTS.partnerReadyDays} days</b>. <a href="#talk">Ask which ones →</a></p>
          {/* Tahir 10 Nov 2026 (CO-N8, CO-30): the counts dated once on the page. */}
          <p className="cap mt-2">Figures as of July 2026.</p>
        </div>
      </section>

      <PartnerNav />

      {/* T1, 18 Oct 2026 (D-254, reverses the Your Brand part of D-197). Tahir, audit of 18 Oct: "THE
          PARTNER PAGE IS A PAGE WHERE PARTNER NEED TO GO TOO DEEP TO FIND WHAT HE IS LOOKING FOR I.E.
          THE FORMULATION AVAILABLE." The library was the 6th block, about 41% down the page, and showed
          only the ladder; the list itself sat on the Pipeline page behind one more click. It now comes
          first, right under the hero, in full: the ladder, the 2 filters and every formulation with its
          "Ask about" button. The Pipeline page keeps its own copy. Revert: put back the old block below
          "range" with <FormulationLibrary pathOnly />, and the old ITEMS order in PartnerNav. */}
      {/* Tahir 7 Nov 2026 (CO-2): the names on some cards are working names. CO-27: brief-to-market times. */}
      <section id="library" className="sec pnav-target" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SectionHead eyebrow="The formulation library" title={`${LIBRARY.length} formulations in the library, ${READY} of them ready to carry your name.`} lead="None of them is sold under a brand yet. Some carry a working name, shown after the code. Each card shows the stage the formulation has reached. Filter by the nutrients it carries and the form it comes in, then open a card to ask about it." tone="navy" />
        <FormulationLibrary phoneShort />
      </div></section>

      {/* The routes and the rail come straight after the library (T1, 18 Oct 2026). */}
      <section id="journey" className="wrap pnav-target" style={{ paddingTop: 18, paddingBottom: 28 }}>
        <PartnerJourney />
      </section>

      {/* D-185, 26 Sep 2026: the 3 partnership models, who does what, and the range service.
          Tahir asked for the long term models to be stated plainly; licensing came off by his ruling. */}
      <section id="models" className="sec pnav-target"><div className="wrap">
        <SectionHead eyebrow="Long-term models" title={PARTNER.modelsH2} lead={PARTNER.modelsLead} />
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
        <div className="flex flex-wrap gap-3 mt-5"><a className="btn btn-navy" href="#talk">Send us your crops and regions →</a><a className="btn btn-ghost" href="#/products">Our 23 registered brands</a></div>
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
            <div className="pf-card"><div className="pf-n num">{PARTNER.portfolioPending.partners}</div><div className="pf-l">partner companies, as distinct from brands</div></div>
          )}
          {PARTNER.portfolioPending.oldest && (
            <div className="pf-card"><div className="pf-n num">{PARTNER.portfolioPending.oldest}</div><div className="pf-l">the year the longest-running partnership started</div></div>
          )}
          {PARTNER.portfolioPending.launchRange && (
            <div className="pf-card"><div className="pf-n num">{PARTNER.portfolioPending.launchRange}</div><div className="pf-l">fastest and slowest time from brief to market</div></div>
          )}
        </div>
        {/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction. The source line that described where each figure is published came off. */}
      </div></section>

      <section id="detail" className="sec pnav-target"><div className="wrap">
        <div className="mb-7"><span className="eyebrow navy">In more detail</span><h2 className="max-w-[24ch]">Detailed pages on development, engineering, manufacturing, the formulation library and registration</h2></div>
        <div className="grid md:grid-cols-2 gap-3">
          {[['From brief to bag', 'brief-to-bag', 'The 6 development stages of a product developed to your brief, from feasibility to registration.'],
            ['VAN Engineering', 'engineering', 'What we can vary in a formulation, and the range for each: batch size, coating, chelation, solubility and pack.'],
            ['Manufacturing & quality', 'manufacturing', 'What is on site, how a lot is released, and the research farms where formulations are tested.'],
            ['Pipeline & formulation library', 'pipeline', `${LIBRARY.length} unbranded codes, the 6 library stages, and what is published before an agreement.`],
            ['Regulatory & registration', 'regulatory', 'The live PSQCA licences we hold, and how the team that registered our own products registers products for partners.']].map(([t, sl, d]) => (
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
        <div className="grid md:grid-cols-3 gap-4">{PARTNER.limits.map(([h, t]) => <div key={h} className="panel p-5"><h4>{noStop(h)}</h4><p className="small muted mt-2">{t}</p></div>)}</div>
        <div className="grid lg:grid-cols-2 gap-4 mt-8">
          <div className="panel-soil p-6"><span className="eyebrow soil">{PARTNER.whoH2}</span><p className="small mt-2">{PARTNER.who}</p><div className="flex flex-wrap gap-2 mt-3">{PARTNER.whoTypes.map(t => <span key={t} className="tag tag-soil">{t}</span>)}</div><p className="cap mt-3">{PARTNER.firewall}</p></div>
          <div className="panel-sky p-6"><span className="eyebrow navy">Forms, packs, registration and quality control</span><div className="grid gap-3 mt-2">{PARTNER.capability.map(([h, t]) => <div key={h}><div className="font-bold">{h}</div><p className="small muted">{t}</p></div>)}</div></div>
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
              <h2 className="text-[clamp(26px,2.6vw,36px)]">{noStop(HOME_COPY.makeH2)}</h2>
              <p className="mt-3" style={{ color: 'rgba(255,255,255,.8)' }}>Tell us the crop, the market and the constraint the product must overcome. If something in our catalogue or the library already meets the need, we will tell you rather than start a development project.</p>
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
                <p className="cap mt-1">He is responsible for supply, pricing, manufacturing under a partner company’s brand, and distribution, and he replies to messages sent through this form.</p>
                <a className="cap" style={{ color: 'var(--gold)' }} href="mailto:muhammad.ali@van.com.pk">muhammad.ali@van.com.pk</a>
              </div>
              <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,.2)' }}>
                <div className="font-bold">Or come and see the plant</div>
                <p className="cap mt-1">Most partner discussions include a plant visit. For a company deciding whether to manufacture with us, the visit is usually the point at which the decision becomes a serious one.</p>{/* L2 fix 9 Nov 2026 (company W8): was "the decision is made" */}
                <WaButton href={WA.plantVisit}>Arrange a plant visit</WaButton>
              </div>
            </div>
            <div>
            {/* The one-working-day promise used to live only in the success message, which is a
                state nobody reaches while the endpoint is off. It belongs above the button, where
                it is doing work. */}
            <p className="small mb-3" style={{ color: 'rgba(255,255,255,.85)' }}>Our commercial team replies within 1 working day. The first conversation is about whether we already have something that solves your problem, because a formulation from our library takes about 3 months to its first commercial batch, while a product developed to your brief usually takes 7 to 12 months from brief to market.</p>
            <VanForm
              form="partner"
              fields={PARTNER_FORM}
              intro="Hello VAN. We would like to talk about making a product with you."
              submitLabel="Send it to the commercial team"
              to={CONTACT.partnerEmail}
              subject="Partner enquiry from van.com.pk"
              success="Your message goes to our commercial team, who reply within 1 working day. The first conversation is about whether we already have something that solves your problem."
            />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
