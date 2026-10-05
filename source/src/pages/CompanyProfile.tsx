import { CONTACT, COUNTS, ABOUT, NATIONAL, LAB, PARTNER, LIBRARY, PIPELINE_STAGES, HOME_SLIDES, WA } from '@/data/site'
import { PRODUCTS, CROPS } from '@/data/catalogue'
import { SOIL_HEADLINE } from '@/data/soilLens'
import { LIVE_CALC_CROPS } from '@/data/costPlans'
import { PARTNER_MANUFACTURING } from '@/data/rebuilt'
import { SectionHead, WaButton, Stat, DrawnBag, FieldRows } from '@/components/bits'
import { AboutScene } from '@/components/about/AboutScene'
import { PartnerNav } from '@/components/PartnerNav'

/**
 * COMPANY PROFILE — D-147, 25 September 2026.
 *
 * The web version of the VAN company profile deck, and the page its PDF is downloaded from. Owner's
 * ruling 13 (24 Sep 2026, night) sets what it may carry: NO sales or capacity quantity (no bags sold,
 * no tonnes made a year, no line tonnage, no lot rate), NO price, NO R&D detail beyond "new coated
 * and phosphate-efficiency products in development", and the general line on supply agreement, toll
 * manufacture, licence or joint venture. The deck keeps the rest; this page does not.
 *
 * Every figure is read from the same constants the rest of the site reads (COUNTS, NATIONAL, LAB,
 * PARTNER, LIBRARY, SOIL_HEADLINE, the catalogue), so nothing on this page can drift from the page it
 * summarises. The copy is written for this page rather than lifted, so a reader who opens the page
 * behind a section gets the detail and not the same sentences again.
 */

export const PROFILE_PDF = '/downloads/VAN-Company-Profile-2026.pdf'

const SECTIONS: [string, string][] = [
  ['argument', 'The national argument'],
  ['what', 'What VAN is'],
  ['makes', 'What VAN makes'],
  ['quality', 'Quality'],
  ['evidence', 'Evidence'],
  ['tools', 'Tools'],
  ['doors', '4 ways in'],
  ['work', 'Work with VAN'],
  ['rnd', 'R&D'],
  ['contact', 'Contact'],
]

// Figures, read once from the site's data.
const perAcre = (k: string) => NATIONAL.usePerHa.rows.find(r => r[0] === k)?.[1] ?? 0
const PK_ACRE = Math.round(perAcre('Pakistan'))
const WORLD_ACRE = Math.round(perAcre('World average'))
const N_PER_K = NATIONAL.balance.pakistan.perTonneK.match(/^(\d+)/)?.[1] ?? ''
const FAMILY_ORDER = ['N', 'P', 'K', 'NPK', 'MICRO', 'SEC', 'BIO'] as const
const FAMILY_TONE: Record<string, string> = { N: 'var(--green)', P: 'var(--navy)', K: 'var(--gold)', NPK: 'var(--rust)', MICRO: 'var(--navy)', SEC: 'var(--green)', BIO: 'var(--soil)' }
const BRANDS = PRODUCTS.filter(p => !p.family)
const FAMILIES = FAMILY_ORDER.map(cat => ({ cat, label: BRANDS.find(p => p.cat === cat)?.catLabel ?? cat, items: BRANDS.filter(p => p.cat === cat) })).filter(f => f.items.length)
const LINES: string[] = (() => {
  const site = PARTNER_MANUFACTURING.sections.find(s => s.id === 'site')
  const table = site?.blocks.find(b => b.k === 'table')
  return table && table.k === 'table' ? table.t.rows.map(r => r[0]).filter(n => !n.startsWith('Repeat')) : []
})()
const stageCount = (s: string) => LIBRARY.filter(l => l.status === s).length
const READY = stageCount('Available')
const BIO = LIBRARY.filter(l => l.family === 'BIO' && l.status !== 'Available')
const NP_PLANNED = ABOUT.timeline.find(t => t.year === '2026')

function Download({ light = false }: { light?: boolean }) {
  return (
    <a className={`btn ${light ? 'btn-gold' : 'btn-navy'}`} href={PROFILE_PDF} download="VAN-Company-Profile-2026.pdf">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
      Download the company profile (PDF)
    </a>
  )
}

/** The evidence door: a soil core and a short bar record, in the drawing style of the About scene. */
function SoilCore() {
  return (
    <svg viewBox="0 0 120 100" width="96" aria-hidden="true">
      <rect x="10" y="10" width="36" height="8" fill="#2F6B3A" stroke="#14231A" strokeWidth="1.5" />
      <rect x="10" y="18" width="36" height="24" fill="#7A5230" stroke="#14231A" strokeWidth="1.5" />
      <rect x="10" y="42" width="36" height="24" fill="#EFE6DA" stroke="#14231A" strokeWidth="1.5" />
      <rect x="10" y="66" width="36" height="24" fill="#F0EEE5" stroke="#14231A" strokeWidth="1.5" />
      {[[20, 52], [34, 60], [24, 76], [38, 82]].map(([x, y]) => <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="4" ry="2.4" fill="#fff" />)}
      <line x1="58" y1="90" x2="114" y2="90" stroke="#14231A" strokeWidth="2" />
      {[[62, 44, '#14231A'], [75, 28, '#2F6B3A'], [88, 56, '#D9A21B'], [101, 18, '#9C4E2A']].map(([x, h, c]) => <rect key={String(x)} x={Number(x)} y={90 - Number(h)} width="9" height={Number(h)} fill={String(c)} />)}
    </svg>
  )
}

/** The bench: 4 flasks and a dish, the R&D drawing, in VAN's colours. */
function Bench() {
  const by = 96
  const flask = (x: number, col: string, h: number) => (
    <g key={x}>
      <path d={`M${x - 5} ${by - h} h10 v${h * 0.3} l18 ${h * 0.7} h-46 l18 ${-h * 0.7}z`} fill="#fff" stroke="#14231A" strokeWidth="2" />
      <path d={`M${x - 14} ${by - h * 0.3} h28 l9 ${h * 0.3} h-46z`} fill={col} />
    </g>
  )
  return (
    <svg viewBox="0 0 300 130" className="w-full" style={{ maxWidth: 420 }} aria-hidden="true">
      <circle cx="262" cy="26" r="20" fill="#D9A21B" opacity=".2" /><circle cx="262" cy="26" r="11" fill="#D9A21B" />
      {flask(50, '#D9A21B', 62)}{flask(110, '#2F6B3A', 50)}{flask(190, '#14231A', 70)}{flask(248, '#9C4E2A', 46)}
      <ellipse cx="150" cy={by - 4} rx="20" ry="5" fill="#E6EEE8" stroke="#14231A" strokeWidth="2" />
      {[140, 148, 156].map(x => <circle key={x} cx={x} cy={by - 5} r="2" fill="#2F6B3A" />)}
      <rect x="14" y={by} width="272" height="8" fill="#14231A" />
      <rect x="26" y={by + 8} width="8" height="22" fill="#14231A" /><rect x="266" y={by + 8} width="8" height="22" fill="#14231A" />
    </svg>
  )
}

export default function CompanyProfile() {
  const partners = PARTNER.portfolioPending.partners
  return (
    <div>
      {/* The hero, in the same composition as About and Make With Us: the statement on the left, the
          figures and the download on the right. No quantity made, sold or installed (ruling 13). */}
      <section style={{ background: 'linear-gradient(180deg, var(--green-soft), var(--sand))' }}>
        <div className="wrap pt-7 pb-6 lg:pt-9 lg:pb-7">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-10 items-start">
            <div>
              <span className="eyebrow">Company profile · {CONTACT.company} · since {COUNTS.incorporated}</span>
              <h1 className="max-w-[26ch]" style={{ fontSize: 'clamp(28px,3.2vw,42px)', lineHeight: 1.08 }}>{CONTACT.tagline}</h1>
              <p className="lead mt-4">VAN began with a research farm in {COUNTS.since} and was incorporated in {COUNTS.incorporated}. On 1 plant site in Lahore it makes {COUNTS.brands} registered brands of its own, and more than 100 brands for {partners} national and multinational companies. This page is the company profile, and the same profile is a PDF to download.</p>
              <div className="flex flex-wrap gap-3 mt-5">
                <Download />
                <a className="btn btn-ghost" href="#contact">Talk to VAN</a>
              </div>
              <p className="cap mt-2">PDF, 25 slides, September 2026.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Stat v={String(COUNTS.brands)} l="registered brands, made in Pakistan" tone="green" compact />
              <Stat v={String(COUNTS.licences)} l={`PSQCA licences, against ${COUNTS.standards} Pakistan Standards`} tone="green" compact />
              <Stat v={COUNTS.lab} l="PNAC-accredited laboratory, ISO/IEC 17025:2017" tone="navy" compact />
              <Stat v={String(CROPS.length)} l="crop programmes, per acre, stage by stage" tone="navy" compact />
              <Stat v={PARTNER.proof.v} l="partner brands registered with VAN as the manufacturer" tone="soil" compact />
              <Stat v="14" l="companies VAN makes for" tone="soil" compact />
            </div>
          </div>
        </div>
      </section>

      <PartnerNav items={SECTIONS} />

      {/* 01 · The national argument. Figures read from NATIONAL; the charts live on the knowledge page. */}
      <section id="argument" className="sec pnav-target" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SectionHead eyebrow="The national argument" tone="rust"
          title="Pakistan puts more nutrient on an acre than the world average, and less of it reaches the crop."
          lead="VAN was built on this reading of the national data. The full case, with every chart and every source, is on the knowledge page." />
        <div className="ns-row on">
          <div className="ns-fig"><div className="ns-n num" style={{ color: 'var(--navy)' }}>{PK_ACRE}<span className="ns-u">kg/acre</span></div><p className="ns-c">of nutrient on an acre of cropland in Pakistan in 2023. The world average is {WORLD_ACRE} kg.</p></div>
          <div className="ns-fig"><div className="ns-n num" style={{ color: 'var(--rust)' }}>{NATIONAL.productivity.nutrientChange.pct}</div><p className="ns-c">nutrient on an acre, 1999-2000 to 2023-24. Wheat yield rose by {String(NATIONAL.productivity.wheatChange.pct).replace(/^\+/, '')} over the same years.</p></div>
          <div className="ns-fig"><div className="ns-n num" style={{ color: 'var(--rust)' }}>{N_PER_K}<span className="ns-u">: 1</span></div><p className="ns-c">tonnes of nitrogen for every tonne of potash that Pakistan applied in 2023.</p></div>
          <div className="ns-fig"><div className="ns-n num" style={{ color: 'var(--soil)' }}>{NATIONAL.nitrogen.pk}%</div><p className="ns-c">of the nitrogen put on the country&rsquo;s cropland is taken up by the crop. In the United States it is about {NATIONAL.nitrogen.us}%.</p></div>
        </div>
        <div className="ns-soil">
          <div className="ns-soil-figs">
            {[[SOIL_HEADLINE.meanPh, 'mean soil pH in Punjab'], [SOIL_HEADLINE.pBelowAdequate, 'of samples below adequate in phosphorus'], [SOIL_HEADLINE.omUnderOne, 'of samples under 1% organic matter'], [SOIL_HEADLINE.sulfurTested, 'samples tested for sulfur']].map(([n, l]) => (
              <div key={l}><span className="ns-sn num">{n}</span><span className="ns-sl">{l}</span></div>
            ))}
          </div>
          <div className="ns-soil-say">
            <p>The ground adds its own figures. The Punjab soil survey holds {SOIL_HEADLINE.samples} samples from {SOIL_HEADLINE.districts} districts, and VAN designs its grades against it.</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <a className="btn btn-navy btn-sm" href="#/knowledge/why-pakistan-must-shift">The national case →</a>
              <a className="btn btn-ghost btn-sm" href="#/soil">Soil Atlas →</a>
            </div>
          </div>
        </div>
        <p className="src">Sources: Our World in Data / FAO (2025), published per hectare (Pakistan 156 kg, world 117 kg) and divided by 2.471 for kg an acre; World Bank AG.CON.FERT.ZS and the Pakistan Economic Survey for the change since 1999-2000; FAOSTAT (2023) for nitrogen against potash; Lassaletta et al. (2014) for nitrogen taken up; the Punjab soil testing programme, 36 district workbooks. Each is charted and cited on the knowledge page.</p>
      </div></section>

      {/* 02 · What VAN is, with the site's own drawing and timeline. 'Today' is left out of the rail
          here because that card carries the tonnage made a year (ruling 13). */}
      <section id="what" className="sec pnav-target"><div className="wrap">
        <SectionHead eyebrow="What VAN is" tone="green"
          title="VAN runs research farms, a plant and a laboratory."
          lead={`The farm came first, in ${COUNTS.since}, and the company was incorporated in ${COUNTS.incorporated}. A trial on the farm sets a formulation, the plant makes it, the laboratory tests every batch before it ships, and each product is registered against a Pakistan Standard before it is sold.`} />
        <AboutScene exclude={['Today']} initial="" />
        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <div className="panel p-5"><h4>Most of what VAN makes carries a partner&rsquo;s brand</h4><p className="small muted mt-1">VAN is mainly a business-to-business manufacturer. It makes and registers products for {partners} national and multinational companies, and does not publish their names.</p></div>
          <div className="panel p-5"><h4>Vital Green carries the rest to the farm</h4><p className="small muted mt-1">Vital Green, founded in 2019, takes VAN&rsquo;s range direct to growers.</p></div>
        </div>
        <a className="btn btn-ghost btn-sm mt-4" href="#/about">About VAN and its board →</a>
      </div></section>

      {/* 03 · What VAN makes. The brands are read from the catalogue, grouped by family. */}
      <section id="makes" className="sec pnav-target" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SectionHead eyebrow="What VAN makes" tone="navy"
          title={`${BRANDS.length} registered brands in ${FAMILIES.length} families, made in any form a partner needs.`}
          lead={`Every brand carries its licence number and its Pakistan Standard on its own page. All ${COUNTS.ownBrandOpen} are open to own-brand manufacturing, Vital Urea included.`} />
        {/* Columns, not a grid: 1 brand in Nitrogen against 5 in Potash left a grid row mostly empty. */}
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-3">
          {FAMILIES.map(f => (
            <div key={f.cat} className="panel p-4 mb-3 break-inside-avoid" style={{ borderTop: `4px solid ${FAMILY_TONE[f.cat]}` }}>
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="text-[17px]">{f.label}</h4>
                <span className="num cap" style={{ color: FAMILY_TONE[f.cat] }}>{f.items.length}</span>
              </div>
              <ul className="list-none p-0 m-0 mt-2 grid gap-1.5">
                {f.items.map(p => (
                  <li key={p.slug} className="small leading-snug">
                    <a href={`#/products/${p.slug}`} className="font-semibold">{p.name}</a>
                    <span className="cap block">{p.analysis}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="panel-navy p-4 mb-3 break-inside-avoid">
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>Open to your brand</span>
            <p className="small mt-1" style={{ color: 'rgba(255,255,255,.85)' }}>Any of the {COUNTS.ownBrandOpen} can be made under your name, or developed further to your brief.</p>
            <a className="btn btn-gold btn-sm mt-3" href="#/partner">Your Brand →</a>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-3 mt-1">
          <div className="panel p-5">
            <h4>{LINES.length} production lines</h4>
            <p className="small muted mt-1">On the same site as the analytical laboratory.</p>
            <div className="flex flex-wrap gap-1.5 mt-3">{LINES.map(l => <span key={l} className="tag tag-sky" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 13 }}>{l}</span>)}</div>
          </div>
          <div className="panel p-5">
            <h4>7 physical forms</h4>
            <p className="small muted mt-1">Granular, powder, crystalline soluble, liquid, pellet, water-dispersible granule and coated prill. 1 composition can be made in more than 1 of them.</p>
          </div>
          <div className="panel p-5">
            <h4>Packs from 1 L to 1,000 kg</h4>
            <p className="small muted mt-1">From a 1 L bottle to a 1,000 kg bulk bag and a 1,000 L IBC. Estate and contract-farming packs run on the same line as the retail pack.</p>
            <p className="small mt-3"><b>Order size.</b> A batch starts at 1 tonne. There is no minimum on the order itself.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <a className="btn btn-navy btn-sm" href="#/products">All {BRANDS.length} products →</a>
          <a className="btn btn-ghost btn-sm" href="#/partner/manufacturing">How a product is made here →</a>
        </div>
      </div></section>

      {/* 04 · Quality and registration */}
      <section id="quality" className="sec pnav-target"><div className="wrap">
        <SectionHead eyebrow="Quality and registration" tone="navy"
          title="Every batch is tested before it ships, and every licence number is published." />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat v={COUNTS.lab} l={`PNAC accredited, ISO/IEC 17025:2017, since 2024`} tone="navy" />
          <Stat v={`${COUNTS.labAccreditedTests} of ${COUNTS.labTests}`} l="laboratory tests accredited, and all of them priced publicly" tone="green" />
          <Stat v={String(COUNTS.licences)} l={`PSQCA licences, against ${COUNTS.standards} Pakistan Standards`} tone="gold" />
          <Stat v={COUNTS.patent} l="Pakistan Patent, for VAN’s sulfur coated urea" tone="soil" />
        </div>
        <div className="grid lg:grid-cols-3 gap-3 mt-4">
          <div className="panel p-5"><h4>2 analysts on every sample</h4><p className="small muted mt-1">Written methods, calibrated instruments and reference standards, so a result does not depend on who ran the test. Results take {LAB.stats[1][0]} working days from booking.</p></div>
          <div className="panel p-5"><h4>The certificate for your bag</h4><p className="small muted mt-1">Send the batch number printed on a VAN bag and VAN sends the certificate of analysis for that batch, with no charge.</p></div>
          <div className="panel p-5"><h4>ISO 9001 in progress</h4><p className="small muted mt-1">Certification with System Certification Centre (SCC) is expected during 2027. VAN does not claim it until the certificate is issued.</p></div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <a className="btn btn-navy btn-sm" href="#/verify">Verify a bag →</a>
          <a className="btn btn-ghost btn-sm" href="#/lab">VAN Lab →</a>
          <a className="btn btn-ghost btn-sm" href="#/partner/regulatory">Licences and standards →</a>
        </div>
      </div></section>

      {/* 05 · The evidence approach: the site's standing rules, said once for a reader deciding. */}
      <section id="evidence" className="sec pnav-target" style={{ background: 'var(--sky)' }}><div className="wrap">
        <SectionHead eyebrow="The evidence approach" tone="navy"
          title="The rules VAN follows before it prints a figure."
          lead={`${COUNTS.yearsData} of trials on VAN's own research farms, a Punjab soil survey of ${SOIL_HEADLINE.samples} samples, and an accredited laboratory sit behind what VAN says.`} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            ['Every figure names its source', 'Where VAN has done its own arithmetic on published data, the figure is marked as derived.'],
            ['A yield figure needs a named trial', 'VAN prints no performance figure for a product unless a named trial supports it. Where a figure does not exist, the page says so.'],
            ['Client names stay private', 'VAN names 1 client on this website, on the Vital Urea page and the application systems page, with that client’s agreement. It names no other.'],
            ['The province collected the soil survey', 'The data is the Punjab soil testing programme’s. VAN reads it alongside its own sampling and does not claim it as its own.'],
          ].map(([h, t]) => <div key={h} className="panel p-5"><h4>{h}</h4><p className="small muted mt-2">{t}</p></div>)}
        </div>
        <a className="btn btn-navy btn-sm mt-4" href="#/knowledge">The knowledge hub →</a>
      </div></section>

      {/* 06 · Vitalytics and the Soil Atlas */}
      <section id="tools" className="sec pnav-target"><div className="wrap">
        <SectionHead eyebrow="Vitalytics and the Soil Atlas" tone="green"
          title="VAN’s tools are free, with no login." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            [`${CROPS.length} crop programmes`, 'What to apply on an acre, at which stage, by which method, and the pack it comes in.', '#/crops', 'panel-green'],
            ['Nutrition calculator', `Live on ${LIVE_CALC_CROPS.length} crops. Set the acres and the plan scales; add a soil report or pick a district and it adjusts.`, '#/crops#live', 'panel-green'],
            ['Yield and Discipline Simulator · beta', `${HOME_SLIDES[2].title} The simulator scores them on wheat and potato.`, '#/simulator', 'panel-soil'],
            ['Soil Atlas', `${SOIL_HEADLINE.samples} Punjab soil samples in ${SOIL_HEADLINE.districts} districts, read against what each crop takes out of the ground.`, '#/soil', 'panel-gold'],
          ].map(([h, t, href, cls]) => (
            <a key={h} className={`${cls} p-5 no-underline flex flex-col`} href={href} style={{ color: 'var(--ink)' }}>
              <h4>{h}</h4>
              <p className="small mt-2">{t}</p>
              <span className="cap mt-auto pt-3" style={{ color: 'var(--green-text)', fontWeight: 700 }}>Open it →</span>
            </a>
          ))}
        </div>
        <a className="btn btn-ghost btn-sm mt-4" href="#/tools">All of Vitalytics →</a>
      </div></section>

      {/* 07 · The 4 doors, as on the home page identity slider, in its navy and gold. */}
      <section id="doors" className="pnav-target relative overflow-hidden" style={{ background: 'var(--navy)', color: '#fff' }}>
        <div className="wrap sec" style={{ paddingBottom: 72 }}>
          <span className="eyebrow" style={{ color: 'var(--gold)' }}>Who VAN works for</span>
          <h2 className="max-w-[30ch]" style={{ color: '#fff' }}>VAN works for growers, dealers and brand owners, and publishes its evidence.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            {[
              ['If you grow', `${CROPS.length} crop programmes, free, for your crop, district and sowing date.`, 'Find your crop', '#/crops', <FieldRows key="g" n={7} height={70} />],
              ['If you sell', `${COUNTS.brands} brands, every batch tested before it ships, and a bag a farmer can check by its number.`, 'Become a dealer', '#/become-a-dealer', <div key="s" className="flex gap-2 items-end" style={{ height: 76 }}><DrawnBag label="VAN" width={46} /><DrawnBag label="VAN" width={54} /><DrawnBag label="VAN" width={46} /></div>],
              ['If you want it made under your name', 'Formulated, made, registered and tested here, and sold under your brand.', 'Your Brand', '#/partner', <div key="m" style={{ height: 76 }}><DrawnBag label="Your brand" width={54} /></div>],
              ['If you want the evidence', `${SOIL_HEADLINE.samples} soil samples and ${COUNTS.yearsData.replace(' years', '')} years of trials on VAN's research farms, each figure with its source.`, 'Why Pakistan must shift', '#/knowledge/why-pakistan-must-shift', <div key="e" style={{ height: 70 }}><SoilCore /></div>],
            ].map(([k, t, cta, href, art]) => (
              <div key={String(k)} className="p-5 flex flex-col" style={{ background: 'var(--sand)', color: 'var(--ink)', borderRadius: 'var(--radius)' }}>
                <div className="flex items-end" style={{ minHeight: 76 }}>{art}</div>
                <span className="eyebrow mt-3" style={{ color: 'var(--navy)' }}>{k}</span>
                <p className="small">{t}</p>
                <div className="mt-auto pt-4"><a className="btn btn-navy btn-sm" href={String(href)}>{cta} →</a></div>
              </div>
            ))}
          </div>
        </div>
        <FieldRows n={12} height={44} colour="rgba(255,255,255,.18)" className="idn-rows" />
      </section>

      {/* 08 · Ways to work with VAN. The general line is the owner's (ruling 13); the rest is PARTNER. */}
      <section id="work" className="sec pnav-target"><div className="wrap">
        <SectionHead eyebrow="Work with VAN" tone="rust" title="VAN is open to white labelling, joint product development and toll manufacturing."
          lead="For a company that wants a product under its own name, there are 2 routes. Which one fits depends on whether the product already exists at VAN." />
        <div className="grid lg:grid-cols-2 gap-3">
          {PARTNER.routes.map((r, i) => (
            <div key={r.key} className="panel p-5" style={{ borderTop: `4px solid ${i ? 'var(--green)' : 'var(--navy)'}` }}>
              <span className="eyebrow" style={{ color: i ? 'var(--green)' : 'var(--navy)' }}>Route {i + 1} · {r.title}</span>
              <div className="num text-[28px]" style={{ color: 'var(--navy)' }}>{r.time}</div>
              <p className="small mt-2">{r.text}</p>
              <p className="cap mt-2">{r.stages.map(s => s.s).join(' · ')}</p>
            </div>
          ))}
        </div>
        <div className="pf-grid mt-4">
          <div className="pf-card"><div className="pf-n num">{PARTNER.proof.v}</div><div className="pf-l">partner brands registered with VAN named as the manufacturer</div></div>
          <div className="pf-card"><div className="pf-n num">{partners}</div><div className="pf-l">companies hold them, the oldest partnership since {PARTNER.portfolioPending.oldest}</div></div>
          <div className="pf-card"><div className="pf-n num">{COUNTS.formulations}</div><div className="pf-l">unbranded formulations in the library, {READY} ready to carry your name</div></div>
        </div>
        <p className="small mt-4 max-w-[140ch]"><b>What VAN does not do.</b> VAN does not sell the product for you, does not hand over the formulation, and will not put a claim on your label that a trial does not support.</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <a className="btn btn-navy btn-sm" href="#/partner">Your Brand →</a>
          <a className="btn btn-ghost btn-sm" href="#/partner#library">The formulation library →</a>
          <a className="btn btn-ghost btn-sm" href="#/become-a-dealer">Become a dealer →</a>
        </div>
      </div></section>

      {/* 09 · R&D, in general terms only (ruling 13). The named items are already on the site. */}
      <section id="rnd" className="sec pnav-target" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SectionHead eyebrow="Research and development" tone="green" title="What VAN is developing." />
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5 items-start">
          <ul className="list-none p-0 m-0 grid gap-3">
            <li className="panel p-4"><h4>New coated and phosphate-efficiency products</h4><p className="small muted mt-1">In development.</p></li>
            <li className="panel p-4"><h4>Biologicals for nitrogen and phosphorus</h4>
              <p className="small muted mt-1">On strains isolated locally, for Pakistani soil and climate.</p>
              <div className="flex flex-wrap gap-2 mt-2">{BIO.map(b => <span key={b.code} className={`tag ${b.status === 'Field trials' ? 'tag-green' : 'tag-gold'}`}>{b.title.includes('. ') ? b.title.split('. ')[1] : b.title} · {b.status.toLowerCase()}</span>)}</div>
            </li>
            <li className="panel p-4"><h4>Potash and silicon from crop-residue ash</h4><p className="small muted mt-1">Potassium recovered from crop residue ash is already used in VAN&rsquo;s own manufacturing, in place of imported potash. The silicon route is in its final R&amp;D stage.</p><a className="cap" href="#/circular-economy" style={{ fontWeight: 700 }}>The circular economy →</a></li>
            {NP_PLANNED && <li className="panel p-4"><h4>New NP granulation line</h4><p className="small muted mt-1">A new NP granulation line is planned for the plant site. Work has not started, and no date has been set.</p></li>}
          </ul>
          <div>
            <Bench />
            <div className="panel p-5 mt-3">
              <h4>The formulation library</h4>
              <p className="small muted mt-1">{COUNTS.formulations} formulations with no brand on them, each at its stage:</p>
              <ul className="list-none p-0 m-0 mt-2 grid gap-1">
                {[...PIPELINE_STAGES].reverse().filter(([, , c]) => c > 0).map(([s, d, c]) => (
                  <li key={s} className="small flex items-baseline gap-3"><span className="num text-[20px] min-w-[2ch]" style={{ color: 'var(--green)' }}>{c}</span><span><b>{s}</b> · {d}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div></section>

      {/* 10 · Contact. info@ only, as on About; partner@ stays in Make With Us and kisan@ on the crop pages. */}
      <section id="contact" className="sec pnav-target"><div className="wrap">
        <SectionHead eyebrow="Contact" tone="navy" title="Talk to VAN." lead={`Write to ${CONTACT.email}, call ${CONTACT.landline}, or ask for any of these 4 people by name.`} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ABOUT.whoToTalk.map(w => (
            <div key={w.area} className="panel p-5 flex flex-col">
              <span className="eyebrow">{w.area}</span>
              <h4>{w.name}</h4>
              <div className="small font-semibold" style={{ color: 'var(--green)' }}>{w.role}</div>
              <div className="mt-auto pt-3 small" style={{ borderTop: '1px solid var(--line)', marginTop: 12 }}><a href={`mailto:${w.email}`}>{w.email}</a></div>
            </div>
          ))}
        </div>
        <div className="panel-navy p-6 lg:p-7 mt-5 grid lg:grid-cols-[1.2fr_1fr] gap-5 items-center">
          <div>
            <h3>{CONTACT.company}</h3>
            <p className="small mt-2" style={{ color: 'rgba(255,255,255,.85)' }}><b style={{ color: '#fff' }}>Head office</b> · {CONTACT.headOffice}<br /><b style={{ color: '#fff' }}>Plant</b> · {CONTACT.plant}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <a className="btn btn-sm" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }} href={`tel:${CONTACT.landlineTel}`}>Call {CONTACT.landline}</a>
              <a className="btn btn-sm" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }} href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              <WaButton href={WA.products}>WhatsApp {CONTACT.whatsapp}</WaButton>
            </div>
          </div>
          <div className="lg:justify-self-end">
            <p className="small mb-3" style={{ color: 'rgba(255,255,255,.85)' }}>The profile as a PDF, to keep or to pass on.</p>
            <Download light />
          </div>
        </div>
      </div></section>
    </div>
  )
}
