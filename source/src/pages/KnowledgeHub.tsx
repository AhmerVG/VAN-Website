import { PRODUCTS, CROPS } from '@/data/catalogue'
import { SOIL_HEADLINE, SOIL_SOURCE } from '@/data/soilLens'
import { WaButton, lmsUrl, PackShot } from '@/components/bits'
import { WA, CIRCULAR } from '@/data/site'

/**
 * The knowledge hub. Built 8 Sep 2026 when the live site's separate knowledge articles were given
 * their own routes again — previously all of this sat on one long page, which meant three distinct
 * pieces of writing shared a single URL and none of them could be linked to on its own.
 */
const ARTICLES: { href: string; kicker: string; title: string; lead: string; tone: string }[] = [
  // D-245, 1 Oct 2026: Soil Poverty Series No. 1, Tahir Abbas's own report (his ruling: its own page, linked from Knowledge and the Soil Atlas).
  { href: '#/knowledge/soil-poverty-punjab-potash', kicker: 'Soil Poverty Series · No. 1', tone: 'rust',
    title: 'Soil Poverty: Punjab’s Potash. As potash runs short, urea and DAP buy less yield.',
    lead: 'Punjab’s crops take about 940,000 tonnes of potash out of the soil a year; fertilizer puts back 36,000. Most of 20,000 model runs put the Punjab average below 100 ppm between 2027 and 2044. A report by Tahir Abbas, with the full PDF.' },
  // D-186, 26 Sep 2026: the 17 nutrients, first in the list because it is the one a grower asks for.
  { href: '#/knowledge/nutrients', kicker: 'The 17 nutrients', tone: 'green',
    title: 'Every nutrient a crop eats, and why the shortest one decides the harvest.',
    lead: 'What each of the 17 does, what a crop looks like without it, which ones work as pairs, and a barrel you can put your own bags into. Liebig’s Law of the Minimum, for a Pakistani field.' },
  { href: '#/knowledge/why-pakistan-must-shift', kicker: 'The national picture', tone: 'rust',
    title: 'Pakistan is not short of fertilizer. It is short of nutrition that reaches the crop.',
    lead: 'Usage, balance, productivity, and where the nitrogen actually goes. Measured against India, Bangladesh, China and the United States, with every source named.' },
  { href: '#/knowledge/soil-and-sustainability', kicker: 'The state of the soil', tone: 'soil',
    title: 'We have been spending the soil’s capital, not its income.',
    lead: 'A harvest is an export. 6 published surveys on where the soil has ended up, and an honest account of the national dataset that does not exist.' },
  { href: '#/knowledge/application-systems', kicker: 'Application systems', tone: 'navy',
    title: 'A bag is not a dose. How nutrient is delivered is part of the product.',
    lead: 'Pivot, drip, drone, broadcast, fertigation and foliar. What each one demands of the product, the 2 field programmes VAN has run of its own, and One Tank, the family built around the 20 litres a drone can carry.' },
]

export default function KnowledgeHub() {
  const decks = PRODUCTS.filter(p => !p.family)
  return (
    <div>
      <section style={{ background: 'linear-gradient(180deg, var(--rust-soft), var(--sand))' }}>
        <div className="wrap py-8 lg:py-12">
          <span className="eyebrow rust">Knowledge</span>
          <h1 className="max-w-[24ch]">The evidence, and where it runs out.</h1>
          <p className="lead mt-4 max-w-[140ch]">{ARTICLES.length} pieces of writing, every figure sourced and dated. Where a number is our own arithmetic on published inputs we say so, and where the data does not exist we say that too.</p>
        </div>
      </section>

      <section className="sec"><div className="wrap">
        <div className="grid gap-4">
          {ARTICLES.map(a => (
            <a key={a.href} href={a.href} className="panel p-5 lg:p-6 no-underline grid lg:grid-cols-[1fr_auto] gap-4 items-center hover:border-[var(--navy)]">
              <div>
                <span className={`eyebrow ${a.tone}`}>{a.kicker}</span>
                <h3 className="max-w-[34ch]">{a.title}</h3>
                <p className="small muted mt-2 max-w-[140ch]">{a.lead}</p>
              </div>
              <span className="btn btn-ghost shrink-0">Read →</span>
            </a>
          ))}
        </div>
      </div></section>

      {/* D-246, 2 Oct 2026: the data page, a card here and not in ARTICLES (it is an index of charts, not writing). */}
      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <div className="mb-7"><span className="eyebrow rust">Data</span><h2 className="max-w-[24ch]">Pakistan’s nutrient data, to explore yourself.</h2>
          <p className="lead mt-3 max-w-[140ch]">Interactive charts: fertilizer per acre against any country, the balance between nutrients, what comes back in the harvest, and where Punjab’s soil potash is heading.</p></div>
        <a className="btn btn-navy" href="#/knowledge/data">Open the data →</a>
      </div></section>

      <section className="sec" style={{ background: 'var(--sand-2)', borderTop: '1px solid var(--line)' }}><div className="wrap">
        <div className="mb-7"><span className="eyebrow soil">Measured, not assumed</span><h2 className="max-w-[24ch]">Soil Atlas. 770,160 samples, one province.</h2>
          <p className="lead mt-3 max-w-[140ch]">{SOIL_HEADLINE.samples} samples across {SOIL_HEADLINE.districts} districts, read district by district. Conditions, not mechanism.</p></div>
        <p className="src"><b>Source ·</b> {SOIL_SOURCE.short}. <a href="#/soil#caveats">Read this before quoting ›</a></p>
        <div className="flex flex-wrap gap-3 mt-4"><a className="btn btn-navy" href="#/soil">Open the soil lens →</a><a className="btn btn-ghost" href="#/soil?rel=p-ph">The relationship that does not hold →</a></div>
      </div></section>

      <section className="sec"><div className="wrap">
        <div className="mb-7"><span className="eyebrow green">Beyond the bag</span><h2 className="max-w-[24ch]">{CIRCULAR.h2}</h2><p className="lead mt-3 max-w-[140ch]">{CIRCULAR.lead}</p></div>
        <a className="btn btn-navy" href="#/circular-economy">The circular economy →</a>
      </div></section>

      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <div className="mb-7" id="decks"><span className="eyebrow navy">Product knowledge</span><h2 className="max-w-[24ch]">{decks.length} decks, one per product.</h2>
          <p className="lead mt-3 max-w-[140ch]">A full deck per product. What it is, what it does in the soil, where it fits in the season and what VAN will not claim for it.</p></div>
        {/* D-151 (QA 16): 1 column under 400px, names wrap instead of truncating. Was grid-cols-2 and `truncate`. */}
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {decks.map(p => (
            <a key={p.slug} href={lmsUrl(p)} target="_blank" rel="noopener" className="panel p-3 no-underline flex items-center gap-3 hover:border-[var(--navy)]">
              <div style={{ width: 44, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><PackShot slug={p.slug} style={{ maxHeight: 54, width: 'auto' }} /></div>
              <div className="min-w-0"><div className="font-bold leading-tight" style={{ overflowWrap: 'anywhere' }}>{p.name}</div><div className="cap">PDF deck ↓</div></div>
            </a>
          ))}
        </div>
        <p className="cap mt-4">The hub indexes what VAN has already published: {CROPS.length} crop programmes, {decks.length} products, {CROPS.length} nutrition plans, {decks.length + 1} technical datasheets (Crop Force has 1 per grade) and {decks.length} safety data sheets. Datasheet and safety-data links sit on each product page. <a href="#/crops">The crop plans →</a></p>
      </div></section>

      <section className="wrap sec-tight">
        <div className="panel-navy p-6 lg:p-8 grid lg:grid-cols-[1fr_auto] gap-5 items-center">
          <div><h3>Have a question the charts don’t answer?</h3><p className="mt-2" style={{ color: 'rgba(255,255,255,.8)' }}>The agronomy team answers on the same WhatsApp line as everything else.</p></div>
          <WaButton href={WA.farmer} lg>Ask on WhatsApp</WaButton>
        </div>
      </section>
    </div>
  )
}
