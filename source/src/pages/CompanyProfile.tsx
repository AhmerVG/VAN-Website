import { CONTACT, COUNTS, ABOUT, NATIONAL, LAB, PARTNER, LIBRARY, PIPELINE_STAGES, HOME_SLIDES, WA } from '@/data/site'
import { PRODUCTS, CROPS } from '@/data/catalogue'
import { SOIL_HEADLINE } from '@/data/soilLens'
import { LIVE_CALC_CROPS } from '@/data/costPlans'
import { PARTNER_MANUFACTURING } from '@/data/rebuilt'
import { SectionHead, WaButton, Stat, DrawnBag, FieldRows, noStop } from '@/components/bits'
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
  ['argument', 'National figures'],
  ['what', 'What VAN is'],
  ['makes', 'What VAN makes'],
  ['quality', 'Quality'],
  ['evidence', 'Evidence'],
  ['tools', 'Tools'],
  ['doors', 'Who we work for'],
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
              <h1 className="max-w-[26ch]" style={{ fontSize: 'clamp(28px,3.2vw,42px)', lineHeight: 1.08 }}>{noStop(CONTACT.tagline)}</h1>
              {/* L1 editor fix 7 Nov 2026 (company-a B1): SOP is bought in (PR-1), so 'all our products' carries the exception. */}
              <p className="lead mt-4">Vital Agri Nutrients (VAN) began with a research farm in {COUNTS.since} and was incorporated in {COUNTS.incorporated}. We make all our products at 1 plant site in Lahore, apart from SOP (sulfate of potash), which we buy from a supplier. They are sold under our own {COUNTS.brands} registered brands and under more than 100 brands owned by {partners} national and multinational companies. This profile is also available as a PDF.</p>
              <div className="flex flex-wrap gap-3 mt-5">
                <Download />
                <a className="btn btn-ghost" href="#contact">Talk to VAN</a>
              </div>
              {/* PF-7 and PF-19 (profile group, 7 Nov 2026): slide count and month removed. */}
              <p className="cap mt-2">PDF, 2026.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Stat v={String(COUNTS.brands)} l="registered brands, made in Pakistan" tone="green" compact />
              <Stat v={String(COUNTS.licences)} l={`licences from the Pakistan Standards and Quality Control Authority (PSQCA): ${COUNTS.licencesOwn} on our brands, ${COUNTS.licencesPartnerReady} on products ready for partners`} tone="green" compact />
              <Stat v={COUNTS.lab} l="laboratory accredited by the Pakistan National Accreditation Council (PNAC), ISO/IEC 17025:2017" tone="navy" compact />
              <Stat v={String(CROPS.length)} l="crop plans, per acre, stage by stage" tone="navy" compact />
              <Stat v={PARTNER.proof.v} l="partner brands registered with VAN as the manufacturer" tone="soil" compact />
              <Stat v="14" l="companies we make products for" tone="soil" compact />
              {/* Tahir 10 Nov 2026 (CO-N8, CO-30): the counts dated once on the page. */}
              <p className="cap col-span-2">Figures as of July 2026.</p>
            </div>
          </div>
        </div>
      </section>

      <PartnerNav items={SECTIONS} />

      {/* 01 · The national argument. Figures read from NATIONAL; the charts live on the knowledge page. */}
      <section id="argument" className="sec pnav-target" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SectionHead eyebrow="National figures" tone="rust"
          title="In 2023, Pakistan applied more fertiliser nutrient per acre than the world average, and its nitrogen use efficiency was lower than the world’s"
          /* L2 fix 9 Nov 2026 (company W4): the phosphorus and organic matter figures are from the Punjab soil survey. */
          lead="These figures show the problems our products and crop plans are designed to address: more fertiliser nutrient applied per acre than the world average, low nitrogen use efficiency, very little potash applied in Pakistan, and, in the Punjab soil survey, soils low in phosphorus and organic matter. The full analysis, with every chart and source, is on the knowledge page." />
        <div className="ns-row on">
          <div className="ns-fig"><div className="ns-n num" style={{ color: 'var(--navy)' }}>{PK_ACRE}<span className="ns-u">kg per acre</span></div><p className="ns-c">of fertiliser nutrients (nitrogen, phosphate as P₂O₅ and potash as K₂O, added together) applied to each acre of Pakistan’s cropland in 2023 (calendar year), against a world average of {WORLD_ACRE} kg per acre. We converted FAO’s figures from per hectare to per acre.</p></div>
          <div className="ns-fig"><div className="ns-n num" style={{ color: 'var(--rust)' }}>{NATIONAL.productivity.nutrientChange.pct}</div><p className="ns-c">rise in the fertiliser nutrient applied per acre of arable land in Pakistan between fiscal years 1999-2000 and 2023-24 (July to June). Over the same years, wheat yield per acre rose by {String(NATIONAL.productivity.wheatChange.pct).replace(/^\+/, '')}, less than half as much. We calculated both changes from published figures.</p></div>
          <div className="ns-fig"><div className="ns-n num" style={{ color: 'var(--rust)' }}>{N_PER_K}<span className="ns-u">:1</span></div><p className="ns-c">tonnes of nitrogen (N) applied in Pakistan in 2023 for every tonne of potash (K₂O).</p></div>
          <div className="ns-fig"><div className="ns-n num" style={{ color: 'var(--soil)' }}>{NATIONAL.nitrogen.pk}%</div><p className="ns-c">nitrogen use efficiency in 2023: the share of the nitrogen added to Pakistan&rsquo;s cropland that was taken out in the harvested crop (FAO estimate). The world figure was 55%, and the United States figure about {NATIONAL.nitrogen.us}%.</p></div>
        </div>
        <div className="ns-soil">
          <div className="ns-soil-figs">
            {[[SOIL_HEADLINE.meanPh, 'mean pH of the Punjab soil survey samples'], [SOIL_HEADLINE.pBelowAdequate, 'of samples had less than 15 ppm of available phosphorus, the level Punjab soil laboratories treat as adequate' /* Tahir 10 Nov 2026 (CO-N21): was 'of samples had less phosphorus than the adequate level' */], [SOIL_HEADLINE.omUnderOne, 'of samples had under 1% organic matter'], [SOIL_HEADLINE.sulfurTested, 'samples in the survey were tested for sulfur, so the survey has no sulfur results']].map(([n, l]) => (
              <div key={l}><span className="ns-sn num">{n}</span><span className="ns-sl">{l}</span></div>
            ))}
          </div>
          <div className="ns-soil-say">
            <p>The Punjab soil survey holds {SOIL_HEADLINE.samples} samples from {SOIL_HEADLINE.districts} districts, tested in about 2016 to 2018. We use its results when we design the nutrient content of our products.</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <a className="btn btn-navy btn-sm" href="#/knowledge/why-pakistan-must-shift">The national case →</a>
              <a className="btn btn-ghost btn-sm" href="#/soil">Soil Atlas →</a>
            </div>
          </div>
        </div>
        <p className="src">Sources: Our World in Data / FAO (2025), which publishes fertiliser use per hectare (Pakistan 156 kg, world 117 kg); we divided these figures by 2.471 to give kg per acre; World Bank indicator AG.CON.FERT.ZS, Fertilizer consumption (kilograms per hectare of arable land), and the Pakistan Economic Survey, for the 2 changes since 1999-2000; FAOSTAT (2023) for nitrogen against potash; FAOSTAT Cropland Nutrient Balance, December 2025 release (2023 data), for nitrogen use efficiency; the Punjab soil testing programme, 36 district workbooks. Each is charted and cited on the knowledge page.</p>
      </div></section>

      {/* 02 · What VAN is, with the site's own drawing and timeline. 'Today' is left out of the rail
          here because that card carries the tonnage made a year (ruling 13). */}
      <section id="what" className="sec pnav-target"><div className="wrap">
        <SectionHead eyebrow="What VAN is" tone="green"
          title="We run research farms, a plant and a laboratory"
          lead={`We develop each formulation through trials on our research farms, and the plant makes it. The laboratory tests every batch before it ships. Before a product is sold, it is registered, and where a Pakistan Standard applies, it is licensed by PSQCA against that standard.`} />
        {/* D-318, Tahir 26 Oct: the profile's rail starts at 2009 (the research farm); the founder's 2007 humic acid stays on the About page only. */}
        <AboutScene exclude={['Today', '2007']} initial="" />
        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <div className="panel p-5"><h4>Most of what we make is sold under partners&rsquo; brands</h4><p className="small muted mt-1">We are mainly a business-to-business manufacturer. We make and register products for {partners} national and multinational companies.</p></div>
          <div className="panel p-5"><h4>Vital Green</h4><p className="small muted mt-1">Vital Green, founded in 2019, sells our own range direct to growers.</p></div>
        </div>
        <a className="btn btn-ghost btn-sm mt-4" href="#/about">About VAN and its board →</a>
      </div></section>

      {/* 03 · What VAN makes. The brands are read from the catalogue, grouped by family. */}
      <section id="makes" className="sec pnav-target" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SectionHead eyebrow="What VAN makes" tone="navy"
          title={`${BRANDS.length} registered brands in ${FAMILIES.length} product groups, made in the forms a partner needs`}
          lead={`Each brand’s page gives its PSQCA licence number and its Pakistan Standard, where the brand has a licence. We can make the product sold under any of the ${COUNTS.ownBrandOpen} brands made in our plant, including Vital Urea, for a partner company to sell under its own brand.`} />{/* Tahir 7 Nov 2026 (PR-1): 22 brands made in VAN's plant; 1 name for the offer, "Own-brand manufacturing" */}
        {/* Columns, not a grid: 1 brand in Nitrogen against 5 in Potash left a grid row mostly empty. */}
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-3">
          {FAMILIES.map(f => (
            <div key={f.cat} className="panel p-4 mb-3 break-inside-avoid" style={{ borderTop: `4px solid ${FAMILY_TONE[f.cat]}` }}>
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="text-[17px]">{noStop(f.label)}</h4>
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
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>Own-brand manufacturing</span>
            <p className="small mt-1" style={{ color: 'rgba(255,255,255,.85)' }}>We can make the product sold under any of the {COUNTS.ownBrandOpen} brands made in our plant and pack it under your brand, or develop a new product to your brief.</p>
            <a className="btn btn-gold btn-sm mt-3" href="#/partner">Your Brand →</a>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-3 mt-1">
          <div className="panel p-5">
            <h4>{LINES.length} production lines</h4>
            <p className="small muted mt-1">The lines are on the same site as our analytical laboratory.</p>
            <div className="flex flex-wrap gap-1.5 mt-3">{LINES.map(l => <span key={l} className="tag tag-sky" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 13 }}>{l}</span>)}</div>
          </div>
          <div className="panel p-5">
            <h4>7 physical forms</h4>
            <p className="small muted mt-1">Granular, powder, crystalline soluble, liquid, pellet, water-dispersible granule and coated prill. The same composition can be made in several forms.</p>
          </div>
          <div className="panel p-5">
            <h4>Pack sizes</h4>
            <p className="small muted mt-1">Packs range from a 1 L bottle to a 1,000 kg bulk bag and a 1,000 L intermediate bulk container (IBC). Packs for estates and contract farming are filled on the same line as retail packs.</p>
            {/* D-317: was "A batch starts at 1 tonne. There is no minimum on the order itself." (Tahir's ruling 2, 26 Oct 2026) */}
            {/* Tahir 7 Nov 2026 (CO-16): a 1 tonne batch is made and the small order packed from it. */}
            {/* Tahir 10 Nov 2026 (CO-N12): the full minimum-order wording, reordered, per line. */}
            {/* L1 fix 10 Nov 2026 (m1): the long sentence split; "the line for that product" -> "The line for each product". */}
            <p className="small mt-3">There is <b>no minimum order</b>. We produce in batches of 1 tonne. For an order smaller than 1 tonne, we make a 1 tonne batch and pack your order from it. A larger order is made in lots of up to 50 tonnes, each made of 1 tonne batches. The line for each product can make up to 4 lots a week, so an order is not limited to 50 tonnes.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <a className="btn btn-navy btn-sm" href="#/products">All {BRANDS.length} brands →</a>
          <a className="btn btn-ghost btn-sm" href="#/partner/manufacturing">How a product is made here →</a>
        </div>
      </div></section>

      {/* 04 · Quality and registration */}
      <section id="quality" className="sec pnav-target"><div className="wrap">
        <SectionHead eyebrow="Quality and registration" tone="navy"
          title="We test every batch before it ships and publish every licence number" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat v={COUNTS.lab} l={`PNAC accredited, ISO/IEC 17025:2017, since 2024`} tone="navy" />
          <Stat v={`${COUNTS.labAccreditedTests} of ${COUNTS.labTests}`} l="of the 21 fertiliser tests our laboratory offers are within the scope of our accreditation. The prices of all 21 are published." tone="green" />
          <Stat v={String(COUNTS.licences)} l={`PSQCA licences: ${COUNTS.licencesOwn} on our brands, ${COUNTS.licencesPartnerReady} on products ready for partners`} tone="gold" />
          <Stat v={COUNTS.patent} l="Pakistan Patent, for our sulfur coated urea" tone="soil" />
        </div>
        <div className="grid lg:grid-cols-3 gap-3 mt-4">
          <div className="panel p-5"><h4>How samples are tested</h4><p className="small muted mt-1">Every sample is tested by 2 analysts. We use written methods, calibrated instruments and reference standards, so a result does not depend on who ran the test. Results of a test booked through Sample Reception are ready {LAB.stats[1][0]} working days after Sample Reception confirms your booking.</p></div>
          {/* L1 editor fix 7 Nov 2026 (company-a m16, m11): 'after your booking is confirmed' (as on the Lab page); 'On our website' moved to the front. */}
          {/* L2 fix 9 Nov 2026 (settled CO-85): now 'after Sample Reception confirms your booking'. */}
          <div className="panel p-5"><h4>The lab report for your bag</h4><p className="small muted mt-1">On our website, type the batch number printed on a VAN bag to open the lab report for that batch, free of charge.</p></div>
          <div className="panel p-5"><h4>ISO 9001 in progress</h4><p className="small muted mt-1">We expect System Certification Centre (SCC) to certify us to ISO 9001 during 2027. We will not claim ISO 9001 until the certificate is issued.</p></div>
        </div>
        {/* D-316: CropLife Pakistan membership (Tahir, 26 Oct 2026). */}
        <p className="small muted mt-4">Industry membership: we have been a full member of CropLife Pakistan, an industry association, since 2024.</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <a className="btn btn-navy btn-sm" href="#/verify">Verify a bag →</a>
          <a className="btn btn-ghost btn-sm" href="#/lab">VAN Lab →</a>
          <a className="btn btn-ghost btn-sm" href="#/partner/regulatory">Licences and standards →</a>
        </div>
      </div></section>

      {/* 05 · The evidence approach: the site's standing rules, said once for a reader deciding. */}
      {/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */}
      <section id="evidence" className="sec pnav-target" style={{ background: 'var(--sky)' }}><div className="wrap">
        <SectionHead eyebrow="The evidence approach" tone="navy"
          title="How we support the figures we publish"
          lead={`Our published figures come from ${COUNTS.yearsData} of trials on our research farms, the Punjab soil survey of ${SOIL_HEADLINE.samples} samples (tested in about 2016 to 2018), our accredited laboratory, and the national and international statistics we cite.`} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            ['Sources and our own calculations', 'Every figure we publish names its source. Where we have calculated a figure ourselves from published data, we say so.'],
            ['A yield figure needs a named trial', 'We publish no performance figure for a product unless a named trial supports it.'],
            // Tahir 7 Nov 2026 (CO-12): Rafhan Maize Products and Descon Research Farm are research partners, not clients; no line about withheld names.
            ['Our research partners', 'Rafhan Maize Products and Descon Research Farm are our research partners in the Vital Urea trials. They are named, with their agreement, on the pages that describe those trials.'],  // D-316: was "VAN names 1 client on this website ... with that client’s agreement." 
            ['The soil survey data come from the Punjab programme', 'The soil data come from the Punjab soil testing programme. We use them together with the results of our own soil sampling, and we credit them to the programme.'],
          ].map(([h, t]) => <div key={h} className="panel p-5"><h4>{noStop(h)}</h4><p className="small muted mt-2">{t}</p></div>)}
        </div>
        <a className="btn btn-navy btn-sm mt-4" href="#/knowledge">The knowledge hub →</a>
      </div></section>

      {/* 06 · Vitalytics and the Soil Atlas */}
      <section id="tools" className="sec pnav-target"><div className="wrap">
        <SectionHead eyebrow="Vitalytics and the Soil Atlas" tone="green"
          title="Our tools are free, and you do not need to sign in" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            [`${CROPS.length} crop plans`, 'Each crop plan tells you what to apply per acre, at which crop stage, by which method, and in which pack.', '#/crops', 'panel-green'],
            // L1 editor fix 7 Nov 2026 (company-a M5): the fallback names the Punjab soil survey and what the median is of (the district list is Punjab only).
            ['Nutrition creator', `The Nutrition creator is on ${LIVE_CALC_CROPS.length} crop pages. Enter your area in acres and it scales the plan to that area. Add a soil report, and it adjusts the amounts to your soil. If you have no report, choose your Punjab district, and it uses the median soil test values for that district from the Punjab soil survey.`, '#/crops#live', 'panel-green'],
            // L1 7 Nov 2026 (crops-a 7, crops-b M1): 1 name for the simulator across the site. Was 'Yield and Discipline Simulator · beta'.
            ['Farm discipline simulator · beta', `${HOME_SLIDES[2].title} The simulator scores farm practices for wheat and potato.`, '#/simulator', 'panel-soil'],
            ['Soil Atlas', `The Soil Atlas shows the results of ${SOIL_HEADLINE.samples} Punjab soil samples from ${SOIL_HEADLINE.districts} districts, tested in about 2016 to 2018, and compares them with the nutrients taken out in the harvested crop, crop by crop.`, '#/soil', 'panel-gold'],
          ].map(([h, t, href, cls]) => (
            <a key={h} className={`${cls} p-5 no-underline flex flex-col`} href={href} style={{ color: 'var(--ink)' }}>
              <h4>{noStop(h)}</h4>
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
          <h2 className="max-w-[30ch]" style={{ color: '#fff' }}>Who we work for, and where to find our evidence</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            {[
              ['If you grow', `Our ${CROPS.length} crop plans are free. Choose your crop, then enter your district and sowing date.`, 'Find your crop', '#/crops', <FieldRows key="g" n={7} height={70} />],
              // L1 editor fix 7 Nov 2026 (company-a m11): 'On our website' no longer attaches to the bag.
              ['If you sell', `As a dealer, you can sell all ${COUNTS.brands} of our brands. We test every batch before it ships. On our website, a farmer can type the batch number printed on any bag and open the lab report for that batch.`, 'Become a dealer', '#/become-a-dealer', <div key="s" className="flex gap-2 items-end" style={{ height: 76 }}><DrawnBag label="VAN" width={46} /><DrawnBag label="VAN" width={54} /><DrawnBag label="VAN" width={46} /></div>],
              ['If you want it made under your name', 'We formulate, make, register and test the product, and you sell it under your brand; under toll manufacturing, you supply the formulation.', 'Your Brand', '#/partner', <div key="m" style={{ height: 76 }}><DrawnBag label="Your brand" width={54} /></div>],
              ['If you want the evidence', `Our evidence comes from ${SOIL_HEADLINE.samples} Punjab soil samples and ${COUNTS.yearsData.replace(' years', '')} years of trials on our research farms, and every figure we publish names its source.`, 'The national figures and sources', '#/knowledge/why-pakistan-must-shift', <div key="e" style={{ height: 70 }}><SoilCore /></div>],
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
        <SectionHead eyebrow="Work with VAN" tone="rust" title="We offer white labelling, joint product development and toll manufacturing"
          lead="White labelling means we make a formulation we have already developed, and you sell it under your brand. Joint product development means we develop a new product with you, starting from your brief. Toll manufacturing means we make your own formulation to your specification. If you want a product under your own brand, there are 2 routes: a new product developed to your brief (joint development) or a finished formulation from our library (white labelling)." />
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
          <div className="pf-card"><div className="pf-n num">{PARTNER.proof.v}</div><div className="pf-l">partner brands registered with VAN as the manufacturer</div></div>
          <div className="pf-card"><div className="pf-n num">{partners}</div><div className="pf-l">companies hold these brands; our oldest partnership began in {PARTNER.portfolioPending.oldest}</div></div>
          <div className="pf-card"><div className="pf-n num">{COUNTS.formulations}</div><div className="pf-l">unbranded formulations in our library. {READY} of them are finished and can be made under your brand. {COUNTS.licencesPartnerReady} products already hold a PSQCA licence, including the {READY} library codes marked Available, and are ready for a partner company to launch.</div></div>{/* Tahir 9 Nov 2026: the {READY} Available codes are among the 12 licensed products; was 'Separately, 12 products ...' */}
        </div>
        {/* Tahir 7 Nov 2026 (CO-4): a toll client's formulation is his own, so "the formulation" became "our own formulations". */}
        <p className="small mt-4 max-w-[140ch]">There are 3 things we do not do. We do not sell the product for you, we do not hand over our own formulations, and we will not put a claim on your label that a trial does not support.</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <a className="btn btn-navy btn-sm" href="#/partner">Your Brand →</a>
          <a className="btn btn-ghost btn-sm" href="#/partner#library">The formulation library →</a>
          <a className="btn btn-ghost btn-sm" href="#/become-a-dealer">Become a dealer →</a>
        </div>
      </div></section>

      {/* 09 · R&D, in general terms only (ruling 13). The named items are already on the site. */}
      <section id="rnd" className="sec pnav-target" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SectionHead eyebrow="Research and development" tone="green" title="What we are developing" />
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5 items-start">
          <ul className="list-none p-0 m-0 grid gap-3">
            {/* L1 editor fix 7 Nov 2026 (company-a m13): 'efficiency' is kept for nitrogen use efficiency. */}
            <li className="panel p-4"><h4>Coated and phosphate products</h4><p className="small muted mt-1">We are developing new coated products and new products that let the crop take up more of the phosphate applied.</p></li>
            {/* Tahir 7 Nov 2026 (CO-13): mycorrhizae added with a large European biological company (not named); nitrogen dropped from the heading. */}
            <li className="panel p-4"><h4>Biologicals: mycorrhizae and phosphate-solubilising bacteria</h4>
              {/* Tahir 10 Nov 2026 (CO-N18): only the mycorrhizal-based phosphorus product is coated; reordered to say so. Was '... and, with a large European biological company, a stand-alone mycorrhizal product and a mycorrhizal-based phosphorus product to be coated and made in Pakistan.' Both made in Pakistan, per his CO-13 note. */}
              {/* L1 fix 10 Nov 2026 (m3, m4): "biological company" reworded; the bacteria sentence now says it is 1 of the products in development (BIO-P01 is in field trials, site.ts PIPELINE). */}
              <p className="small muted mt-1">We are developing biological products for Pakistani soil and climate. One is a phosphate-solubilising bacteria product made from strains isolated in Pakistan. With a large European company that makes biological products, we are developing 2 mycorrhizal products to be made in Pakistan: a stand-alone mycorrhizal product, and a mycorrhizal-based phosphorus product that will be coated.</p>
              <div className="flex flex-wrap gap-2 mt-2">{BIO.map(b => <span key={b.code} className={`tag ${b.status === 'Field trials' ? 'tag-green' : 'tag-gold'}`}>{b.title.includes('. ') ? b.title.split('. ')[1] : b.title} · {b.status.toLowerCase()}</span>)}</div>
            </li>
            {/* Tahir 7 Nov 2026 (KN-11): was 'Potash from crop residue ash, and research on silicon' */}
            <li className="panel p-4"><h4>Potassium from crop residue ash, and research on silicon</h4><p className="small muted mt-1">We already use potassium recovered from crop residue ash in our own manufacturing, in place of imported potash. Silicon recovery from the same ash is still in research and development.</p><a className="cap" href="#/circular-economy" style={{ fontWeight: 700 }}>The circular economy →</a></li>
            {NP_PLANNED && <li className="panel p-4"><h4>New NP granulation line</h4><p className="small muted mt-1">A new granulation line for NP (nitrogen and phosphorus) fertilisers is planned for the plant site. Work has not started, and no date has been set.</p></li>}
          </ul>
          <div>
            <Bench />
            <div className="panel p-5 mt-3">
              <h4>The formulation library</h4>
              <p className="small muted mt-1">{COUNTS.formulations} unbranded formulations, by development stage:</p>
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
        <SectionHead eyebrow="Contact" tone="navy" title="Contact us" lead={`Write to ${CONTACT.email}, call ${CONTACT.landline}, or ask for any of these 4 people by name.`} />
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
            <p className="small mb-3" style={{ color: 'rgba(255,255,255,.85)' }}>Download this profile as a PDF to keep or share.</p>
            <Download light />
          </div>
        </div>
      </div></section>
    </div>
  )
}
