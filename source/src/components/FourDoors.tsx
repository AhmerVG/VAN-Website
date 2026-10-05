import { CONTACT, COUNTS, PARTNER } from '@/data/site'
import { CROPS } from '@/data/catalogue'
import { UrOnly } from './Ur'
import { WHY_QUESTIONS } from '@/data/nutrients'

/**
 * THE FOUR DOORS — 26 September 2026, Tahir's ruling (D-184).
 *
 * Replaces the identity slider of 11 Sep (IdentitySlider.tsx, kept in the repo, no longer
 * rendered). His words: "4 doors on landing page, but very smart presented, I grow, I sell, made
 * under my name, (4th gate should be for innovators) ... one who wanna try tools and challenge the
 * conventional practice or the one who wanna innovate his portfolio."
 *
 * So: the identity line stays on top, static, with the 4 figures that prove it and the header's own
 * CTA pair (31 Aug ruling). A drawn land scene under it, in the site's own colours, no photograph.
 * Then 4 doors in one row, no carousel: nothing on this band moves, nothing is hidden behind a
 * dot. The 4th door carries 2 routes, as he chose on 26 Sep: the tools, for whoever wants to test
 * the practice; the formulation path, for a company that wants a product nobody sells yet.
 *
 * Every figure is read from the same data the rest of the site reads (COUNTS, CROPS, PARTNER), so the doors cannot drift from the pages they open. No performance claim, no
 * client name, no price. The static build renders all of it, so a crawler and a reader with
 * JavaScript off get the whole band.
 */

function LandScene() {
  // The scene is drawn in the site tokens so it follows the theme. Fields, a canal, 2 trees, 1 bag.
  return (
    <svg className="fd-scene" viewBox="0 0 1200 190" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 100 L1200 78 L1200 190 L0 190 Z" fill="var(--soil)" opacity=".85" />
      <path d="M0 110 L1200 88 L1200 190 L0 190 Z" fill="var(--green-2)" opacity=".8" />
      <path d="M0 130 L1200 110 L1200 190 L0 190 Z" fill="var(--gold)" opacity=".92" />
      <path d="M0 150 L1200 134 L1200 190 L0 190 Z" fill="var(--green)" opacity=".75" />
      <path d="M0 172 L1200 160 L1200 190 L0 190 Z" fill="var(--soil)" />
      <path d="M0 122 C 300 100, 600 140, 1200 100 L1200 108 C 600 148, 300 108, 0 130 Z" fill="var(--navy-2)" opacity=".9" />
      <g stroke="var(--sand)" strokeWidth="1" opacity=".35">
        <line x1="0" y1="140" x2="1200" y2="122" /><line x1="0" y1="146" x2="1200" y2="128" /><line x1="0" y1="160" x2="1200" y2="144" /><line x1="0" y1="166" x2="1200" y2="150" />
      </g>
      <g fill="var(--navy)" opacity=".85">
        <rect x="150" y="76" width="4" height="30" /><circle cx="152" cy="72" r="9" />
        <rect x="980" y="66" width="4" height="30" /><circle cx="982" cy="62" r="11" />
        <rect x="1010" y="78" width="3" height="20" /><circle cx="1011" cy="75" r="7" />
      </g>
      <g fill="var(--gold)"><rect x="560" y="90" width="26" height="16" /><rect x="566" y="82" width="14" height="8" /></g>
    </svg>
  )
}

const HERO_TIERS = [
  // D-239: foundation / pillar / layer replaced. Tahir asked whether the analogy held; it mixed a
  // building with a layer, and a farmer reads "layer" physically (the product goes into the soil, not
  // on top of the crop). He chose the cycle the lines already described, and lines that add to the
  // label instead of repeating it.
  { k: 'Soil', role: 'what it holds', a: 'Its pH, its organic matter, and the nutrients already gone.' },
  { k: 'Crop', role: 'what it takes', a: 'Every nutrient it carries out of the field at harvest.' },
  { k: 'Product', role: 'what we put back', a: 'Made for that crop, on that soil.' },
]

type Door = { key: string; title: string; body: React.ReactNode; go: [string, string][] }

export function FourDoors() {
  const partners = PARTNER.portfolioPending.partners
  const doors: Door[] = [
    {
      key: 'grow', title: 'I grow',
      body: <><b>{CROPS.length}</b> crop programmes, per acre, stage by stage. Your soil, your sowing date, your plan.</>,
      go: [['Crop plans', '#/crops'], ['Soil Atlas', '#/soil']],
    },
    {
      key: 'sell', title: 'I sell',
      body: <>A dealership with the plant behind it. <b>{COUNTS.brands}</b> brands, every batch tested before it ships, a bag a farmer can verify by its number.</>,
      go: [['Become a dealer', '#/become-a-dealer'], ['Where to buy', '#/where-to-buy']],
    },
    {
      key: 'brand', title: 'Made under my name',
      body: <>{partners ? <><b>{partners}</b> partners and </> : null}<b>100+</b> brands already made on this site. You bring the market. VAN does everything from the formulation to the finished bag.</>,
      go: [['Your Brand', '#/partner'], ['How we build a range', '#/partner#range']],
    },
    {
      key: 'differently', title: 'I want to do it differently',
      body: <>For the grower who wants to test the practice against the numbers, and for the company that wants a product nobody sells yet.</>,
      go: [['Vitalytics, the tools', '#/tools'], ['The formulation path', '#/partner#library']],
    },
  ]
  return (
    <section className="fd" aria-label="Who VAN is, and who it is for">
      <div className="wrap fd-top">
        <span className="fd-kicker">{CONTACT.company} · Lahore · since {COUNTS.incorporated}</span>
        {/* D-235, 1 Oct 2026. Tahir: the old identity line ("Crop nutrition engineered, manufactured,
            registered and tested in Pakistan.") read average. Golden Circle, sell me the pen: the h1 is
            the order VAN works in, then what the soil holds, what the crop takes, what VAN puts
            back (D-239). No soil sample count here, at his word. The tagline itself (footer, menu, profile)
            is unchanged. */}
        <h1 className="fd-title fd-title-3"><span>Soil first.</span> <span>Then the crop.</span> <span>Then the bag.</span></h1>
        <ol className="fd-tiers">
          {HERO_TIERS.map(t => (
            <li key={t.k} className="fd-tier">
              <span className="fd-tier-k">{t.k}<span className="fd-tier-r"> · {t.role}</span></span>
              <span className="fd-tier-a">{t.a}</span>
            </li>
          ))}
        </ol>
        <p className="fd-body">1 plant site. <b>{COUNTS.brands}</b> registered brands, <b>{COUNTS.licences}</b> PSQCA licences, a PNAC-accredited laboratory, about <b>50,000 t</b> made a year.</p>
        {/* D-192: no button pair here. The header pill (D-181) and the 4 doors below carry it. */}
      </div>
      <LandScene />
      <div className="wrap">
        <div className="fd-doors">
          {doors.map(d => (
            <div key={d.key} className="fd-door">
              <h2 className="fd-door-t">{d.title}<UrOnly k={d.title} className="fd-door-ur" /></h2>
              <p className="fd-door-b">{d.body}</p>
              <div className="fd-door-go">
                {d.go.map(([label, href], n) => <a key={label} href={href} className={n === 0 ? 'fd-go' : 'fd-go quiet'}>{label} →</a>)}
              </div>
            </div>
          ))}
        </div>
        {/* D-187, 26 Sep 2026. Tahir: the top of the page "should be curious and answer why, not
            what". He chose a why strip under the doors over bringing the slider back. 4 questions a
            grower asks, each answered on a page of this site; the strip carries the question and the
            first line of the answer, nothing else. */}
        <div className="fd-why" aria-label="Questions growers ask">
          {WHY_QUESTIONS.map(w => (
            <a key={w.q} href={w.href} className="fd-why-q">
              <span className="fd-why-t">{w.q}</span>
              <span className="fd-why-a">{w.a}</span>
              <span className="fd-why-go">Read the answer →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
