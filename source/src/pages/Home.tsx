import { HOME_SLIDES, SIMULATOR, CIRCULAR, COUNTS, WA, ABOUT, PARTNER } from '@/data/site'
import { FourDoors } from '@/components/FourDoors'
import { Detail } from '@/components/Detail'
import { PRODUCTS, CROPS } from '@/data/catalogue'
import { BOARD_PHOTOS } from '@/data/assets'
import { SeasonRing, SowingNowNext } from '@/components/SeasonRing'
import { CropPicker } from '@/components/CropPicker'
import { VerifyPanel } from '@/components/VerifyPanel'
import { Doors } from '@/components/Doors'
import { StageWalk } from '@/components/StageWalk'
import { ProductRail } from '@/components/ProductRail'
import { SectionHead, FieldRows, Plots, PackShot } from '@/components/bits'
import { NationalStrip, LossStrip, MethodJourney } from '@/components/Argument'
import { useInView } from '@/hooks/useInView'

/* ————— Act one · "What do you grow?" — Demo B's hero, one size down ————— */
function Hero() {
  const brands = PRODUCTS.filter(p => !p.family).length
  const { ref, inView } = useInView({ threshold: 0.1 })
  return (
    <section id="grow" className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--sky) 0%, var(--sand) 62%)' }}>
      <div className="wrap pt-7 pb-8 lg:pt-10 lg:pb-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-start">
        <div ref={ref} className={inView ? 'on' : ''}>
          <span className="eyebrow">{CROPS.length} programmes · per acre · stage by stage · free</span>
          {/* D-184: the page's h1 is now the identity line in FourDoors; this keeps its size as an h2. */}
          <h2 className="text-[clamp(40px,4.9vw,64px)]" style={{ lineHeight: 1.05 }}>What do you grow?</h2>
          <p className="lead mt-4">{HOME_SLIDES[0].lead}</p>
          <div className="mt-5"><CropPicker /></div>
          <div className="flex flex-wrap gap-3 mt-5 items-center">
            {/* D-192: a quiet link, not a green button; nothing has been made to send yet (D-60). */}
            <a className="btn btn-ghost" href="#/products">See the {brands} products</a>
            <a className="small" href={WA.farmer} target="_blank" rel="noopener" style={{ color: 'var(--navy-2)' }}>or ask on WhatsApp</a>
          </div>
        </div>
        <div className="order-first lg:order-none lg:sticky lg:top-20">
          <div className="panel p-4 lg:p-5">
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <div className="display text-[20px]">The sowing year</div>
              <div className="cap">every crop's window, drawn</div>
            </div>
            <SeasonRing size={480} className="mx-auto" />
            <div className="mt-3"><SowingNowNext /></div>
          </div>
        </div>
      </div>
      <FieldRows n={14} height={64} className="opacity-70" />
    </section>
  )
}

/* ————— Act three · do something ————— */
export function Teaser() {
  return (
    <section className="sec" id="walk">
      <div className="wrap">
        <SectionHead eyebrow="Your crop, stage by stage" title="Wheat, walked one stage at a time." lead="Every programme is written the way the season runs: what to put on, at which stage, by which method, and the pack it comes in. Here are the first 2 stages of wheat." right={<a className="btn btn-gold" href="#/crops/wheat">The whole wheat programme →</a>} />
        <StageWalk limit={2} teaser />
      </div>
    </section>
  )
}

function KnowledgeCards() {
  const decks = PRODUCTS.filter(p => !p.family)
  return (
    <section className="sec" style={{ background: 'var(--sand-2)' }}>
      <div className="wrap">
        <SectionHead eyebrow="Knowledge" title="Read further. Every figure here has its source under it." tone="navy" right={<a className="btn btn-ghost" href="#/knowledge">The knowledge hub →</a>} />
        <div className="grid lg:grid-cols-3 gap-4">
          <a href="#/simulator" className="panel-navy p-5 lg:p-6 no-underline flex flex-col relative overflow-hidden">
            <Plots cols={12} rows={3} seed={5} className="absolute inset-x-0 bottom-0 opacity-20" />
            {/* 11 Sep 2026 · this read "Coming soon · illustrative" while the wheat and potato
                simulators had been live since 9 September. The site's rule is not to advertise what is
                not built; understating what IS built is the same fault pointing the other way, and it
                sent a farmer to WhatsApp for a tool he could have run on the page. */}
            <span className="tag tag-gold self-start">Wheat and potato live now</span>
            {/* D-136: was "Nutrition is 1 of 10 things that decide yield." (D-116). Revert: restore it. */}
            <h3 className="mt-3">Nutrition decides about 1/4 of the yield. Sowing, seed, water, weeds and pests decide the rest.</h3>
            <p className="small mt-2 flex-1" style={{ color: 'rgba(255,255,255,.8)' }}>{HOME_SLIDES[2].lead}</p>
            <p className="cap mt-2">{SIMULATOR.previewNote}</p>
            <span className="btn btn-gold btn-sm self-start mt-4">Open the simulator →</span>
          </a>
          <a href="#/knowledge#decks" className="panel p-5 lg:p-6 no-underline flex flex-col">
            <span className="eyebrow">Product knowledge</span>
            <h3>{decks.length} decks, one per product.</h3>
            <p className="small muted mt-2 flex-1">1 deck per registered brand, written for a dealer who has to explain the bag to a grower standing in front of him. Composition, where it goes in the season, and the limits of what it will do.</p>
            <div className="flex items-end gap-2 mt-4 overflow-hidden" style={{ height: 70 }}>{decks.slice(0, 5).map(p => <PackShot key={p.slug} slug={p.slug} style={{ maxHeight: 66, width: 'auto' }} />)}<span className="cap self-center ml-1 nowrap">+{decks.length - 5} more</span></div>
            <span className="font-bold mt-3" style={{ color: 'var(--navy)' }}>The deck list →</span>
          </a>
          <a href="#/circular-economy" className="panel-green p-5 lg:p-6 no-underline flex flex-col">
            <span className="eyebrow">Beyond the bag</span>
            <h3>{CIRCULAR.h2}</h3>
            <p className="small muted mt-2">Crop residue ash carries the potassium the crop took from the soil. How VAN turns it back into a nutrient a crop can use is set out in full.</p>
            <p className="small mt-2 flex-1">{CIRCULAR.ash}</p>
            <span className="font-bold mt-3" style={{ color: 'var(--navy)' }}>The circular loop →</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export function BoardStrip() {
  return (
    <section className="sec">
      <div className="wrap">
        <SectionHead eyebrow="The board" title={ABOUT.boardH2} right={<a className="btn btn-ghost" href="#/about#board">Read the briefs →</a>} />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {ABOUT.board.map(b => (
            <a key={b.key} href="#/about#board" className="panel overflow-hidden no-underline">
              <img src={BOARD_PHOTOS[b.key]} alt={b.name} style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }} />
              <div className="p-3"><div className="font-bold leading-tight" style={{ fontSize: 14.5 }}>{b.name}</div><div className="cap">{b.role}</div></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}


/**
 * WHAT VAN DOES FOR OTHER COMPANIES — added 11 September 2026.
 *
 * The independent audit's single largest finding: this page ran seventeen mobile screens and never
 * once said VAN makes products for other companies, which is by VAN's own account on /about most of
 * what leaves the plant. The words "Make with us" appeared exactly twice on the whole page, both
 * times as a navigation label, and on a phone the nav is behind a hamburger. So a procurement head
 * at a multinational landed on a crop picker asking "What do you grow?", saw three farmer buttons
 * floating over it, and had to take two taps and a scroll inside a menu before the word
 * "manufacture" appeared anywhere.
 *
 * This band is the fix. It sits directly under the crop hero, above the national picture, and it
 * carries the partner page's own hero: what VAN does, the number that proves it, the two routes with
 * their real timelines, and two doors. Every figure is read from PARTNER, so it cannot drift.
 */
function MakeBand() {
  return (
    <section className="sec" id="make" style={{ background: 'var(--green-soft)' }}>
      <div className="wrap">
        <div className="mk-band">
          <div className="mk-say">
            <span className="eyebrow">For companies, not for fields</span>
            <h2 className="max-w-[24ch]" style={{ textWrap: 'balance' }}>{PARTNER.h1}</h2>
            <p className="lead mt-3">{PARTNER.lead}</p>
            <div className="flex flex-wrap gap-3 mt-5">
              <a className="btn btn-navy" href="#/partner#models">White label, joint development, toll manufacturing →</a>
              <a className="btn btn-ghost" href="#/partner#library">The formulation library</a>
            </div>
          </div>
          <div className="mk-proof">
            <div className="mk-n num">{PARTNER.proof.v}</div>
            <p className="small" style={{ color: 'var(--navy)' }}>{PARTNER.proof.l}</p>
            <div className="mk-routes">
              {PARTNER.routes.map(r => (
                <div key={r.key} className="mk-route">
                  <div className="mk-t num">{r.time}</div>
                  <div className="cap">{r.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      {/* D-184, 26 Sep 2026: the identity line and the 4 doors, static, replace the 11 Sep slider
          (IdentitySlider.tsx stays in the repo unrendered). The crop picker hero below is unchanged. */}
      <FourDoors />
      <Hero />
      {/* D-198, Tahir 27 Sep 2026: the sticky "On this page" index, the wheat teaser and the board strip
          came off the home page (UX review). Revert: put <ActIndex />, <Teaser /> and the board Detail back. */}
      {/* The national case used to run here in full: Picture, Balance, Productivity, WhereItGoes,
          SoilAct. All five render the same NATIONAL strings that /knowledge/why-pakistan-must-shift
          renders, so 18 whole sentences were on both pages (measured, tools/duplication.mjs).
          The argument is now written once, on the knowledge page. What stays here is the four
          figures it turns on and the door to it. LossStrip stays because it is what VAN builds
          against those figures, which is a claim about VAN and belongs on VAN's front page. */}
      <MakeBand />
      {/* D-198: in Simple view the argument folds; the doors, the crop picker and the make band stay. */}
      <Detail label="The national picture, the 3 losses and the method"><NationalStrip /><LossStrip /><MethodJourney /></Detail>
      <section className="sec" id="verify" style={{ background: 'var(--sand-2)' }}><div className="wrap"><VerifyPanel /></div></section>
      <Doors />
      <ProductRail />
      <KnowledgeCards />
      <section className="sec-tight"><div className="wrap flex flex-wrap gap-x-8 gap-y-2 cap justify-center">
        <span>{PRODUCTS.filter(p => !p.family).length} registered brands</span><span>{CROPS.length} crop plans, per acre</span><span>{COUNTS.licences} PSQCA licences · {COUNTS.standards} standards</span><span>{COUNTS.lab} · {COUNTS.labStd}</span><span>{COUNTS.patentLabel} {COUNTS.patent}</span>
      </div></section>
    </>
  )
}
