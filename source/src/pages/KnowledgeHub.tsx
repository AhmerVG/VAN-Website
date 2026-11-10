import { PRODUCTS, CROPS } from '@/data/catalogue'
import { SOIL_HEADLINE, SOIL_SOURCE } from '@/data/soilLens'
import { WaButton, lmsUrl, PackShot, noStop } from '@/components/bits'
import { WA, CIRCULAR } from '@/data/site'

/**
 * The knowledge hub. Built 8 Sep 2026 when the live site's separate knowledge articles were given
 * their own routes again — previously all of this sat on one long page, which meant three distinct
 * pieces of writing shared a single URL and none of them could be linked to on its own.
 */
const ARTICLES: { href: string; kicker: string; title: string; lead: string; tone: string }[] = [
  // D-245, 1 Oct 2026: Soil Poverty Series No. 1, Tahir Abbas's own report (his ruling: its own page, linked from Knowledge and the Soil Atlas).
  // Tahir 7 Nov 2026: KN-15 (36,000 t is NFDC offtake), KN-7 with RP-PO-12 (the condition is named: potash fertiliser use does not rise), RP-PO-11 (area-weighted).
  // Was: '... and fertiliser put back about 36,000 tonnes. If present trends continue, the report’s model projects that Punjab’s average available soil potassium ...'
  { href: '#/knowledge/soil-poverty-punjab-potash', kicker: 'Soil Poverty Series · No. 1', tone: 'rust',
    title: 'Soil Poverty: Punjab’s Potash. As potash runs short, urea and DAP buy less yield.',
    lead: 'In 2023-24, Punjab’s 5 main crops (wheat, rice, sugarcane, maize and cotton) removed an estimated 940,000 tonnes of potash (as K₂O) from the soil, and fertiliser put back about 36,000 tonnes (NFDC offtake records). If potash fertiliser use in Punjab does not rise, the report’s model projects that Punjab’s area-weighted average available soil potassium will fall below 100 ppm (parts per million) around 2036 in the average case, the median of the model results. The worst case is 2027 and the best case 2044; there is a 1 in 10 chance that the year is earlier than the worst case, and a 1 in 10 chance that it is later than the best case. These are model projections, not soil-test measurements. The report is by Tahir Abbas. The full report can be downloaded as a PDF.' },
  // D-325, 4 Nov 2026: The real price of nitrogen, a Vital Agri Nutrients report (Tahir's ruling: its own Knowledge piece, the 6th).
  { href: '#/knowledge/real-price-of-nitrogen', kicker: 'A Vital Agri Nutrients report', tone: 'rust',
    title: 'The cost of low nitrogen use efficiency in Pakistan',
    lead: '29 of every 100 kg of nitrogen added to Pakistan’s cropland were taken out in the harvested crop in 2023. At the Rabi 2024-25 urea price of Rs 193 a kg, the nitrogen added for each kg taken out is worth about Rs 660. Where the 5.7 million tonnes went, what China, the European Union and India did, and the 4 approaches to raising efficiency. With the full PDF.' },
  // D-186, 26 Sep 2026: the 17 nutrients, first in the list because it is the one a grower asks for.
  { href: '#/knowledge/nutrients', kicker: 'The 17 nutrients', tone: 'green',
    title: 'The 17 nutrients a crop needs, and why the one in shortest supply limits the harvest.',
    lead: 'The article explains what each of the 17 nutrients does in the plant, what a crop looks like when it is short of one, and which nutrients help or hinder each other. An interactive barrel, based on Liebig’s Law of the Minimum, lets a grower enter the number of bags of each product applied to 1 acre. It then shows which nutrient is furthest below the amount in VAN’s crop plan for that crop, as a share of the plan amount.' },
  { href: '#/knowledge/why-pakistan-must-shift', kicker: 'The national picture', tone: 'rust',
    title: 'Pakistan is not short of fertilizer. It is short of nutrition that reaches the crop.',
    lead: 'The article compares Pakistan with India, Bangladesh, China and the United States on fertiliser use, the balance between nutrients, the crop harvested for each kg of fertiliser nutrient, and what happens to the nitrogen applied. It names the source of every figure.' },
  { href: '#/knowledge/soil-and-sustainability', kicker: 'The state of the soil', tone: 'soil',
    title: 'We have been spending the soil’s capital, not its income.',
    lead: 'Every harvest removes nutrients from the soil. The article compares the potassium removed by crops with the potassium applied, summarises published soil surveys, and explains why Pakistan has no national record of soil nutrient levels over time.' },
  { href: '#/knowledge/application-systems', kicker: 'Application systems', tone: 'navy',
    title: 'A bag is not a dose. How a nutrient is delivered is part of the product.',
    lead: 'The article explains what each application method (broadcast, fertigation, foliar spray and drone spray) and each irrigation system (pivot and drip) requires of a product. It lists the 3 maize trials of Vital Urea run from 2023 to 2025. It also describes One Tank, the VAN product family formulated for the 20-litre tank of a spray drone.' },
]

export default function KnowledgeHub() {
  const decks = PRODUCTS.filter(p => !p.family)
  return (
    <div>
      <section style={{ background: 'linear-gradient(180deg, var(--rust-soft), var(--sand))' }}>
        <div className="wrap py-8 lg:py-12">
          <span className="eyebrow rust">Knowledge</span>
          <h1 className="max-w-[24ch]">Articles, reports and data on crop nutrition and soil in Pakistan</h1>
          {/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */}
          <p className="lead mt-4 max-w-[140ch]">VAN’s knowledge pages explain Pakistan’s soil and crop nutrition. Every figure in the {ARTICLES.length} articles and reports below is given with its source and its date.</p>
        </div>
      </section>

      <section className="sec"><div className="wrap">
        <div className="grid gap-4">
          {ARTICLES.map(a => (
            <a key={a.href} href={a.href} className="panel p-5 lg:p-6 no-underline grid lg:grid-cols-[1fr_auto] gap-4 items-center hover:border-[var(--navy)]">
              <div>
                <span className={`eyebrow ${a.tone}`}>{a.kicker}</span>
                <h3 className="max-w-[34ch]">{noStop(a.title)}</h3>
                <p className="small muted mt-2 max-w-[140ch]">{a.lead}</p>
              </div>
              <span className="btn btn-ghost shrink-0">Read →</span>
            </a>
          ))}
        </div>
      </div></section>

      {/* D-246, 2 Oct 2026: the data page, a card here and not in ARTICLES (it is an index of charts, not writing). */}
      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <div className="mb-7"><span className="eyebrow rust">Data</span><h2 className="max-w-[24ch]">Interactive charts of Pakistan’s nutrient data</h2>
          <p className="lead mt-3 max-w-[140ch]">The charts compare Pakistan with any country the reader chooses: on fertiliser use per acre, on the balance between nutrients, on crop yield per kg of fertiliser nutrient and on nitrogen use efficiency. They also show the model projection of available soil potassium in Punjab from the Soil Poverty report.</p></div>
        <a className="btn btn-navy" href="#/knowledge/data">Open the data →</a>
      </div></section>

      <section className="sec" style={{ background: 'var(--sand-2)', borderTop: '1px solid var(--line)' }}><div className="wrap">
        <div className="mb-7"><span className="eyebrow soil">Soil Atlas</span><h2 className="max-w-[24ch]">Soil Atlas: 770,160 soil samples from Punjab</h2>
          <p className="lead mt-3 max-w-[140ch]">The Soil Atlas shows the results of the Punjab soil testing programme for each of the {SOIL_HEADLINE.districts} districts. The samples were tested in about 2016 to 2018.</p></div>
        <p className="src"><b>Source ·</b> {SOIL_SOURCE.short}. <a href="#/soil#caveats">Read the method and limitations before quoting these figures ›</a></p>
        <div className="flex flex-wrap gap-3 mt-4"><a className="btn btn-navy" href="#/soil">Open the Soil Atlas →</a><a className="btn btn-ghost" href="#/soil?rel=p-ph">Phosphorus and pH: why the Punjab soil survey does not show the fall in available phosphorus at high pH found in controlled studies →</a></div>
      </div></section>

      <section className="sec"><div className="wrap">
        <div className="mb-7"><span className="eyebrow green">Circular economy</span><h2 className="max-w-[24ch]">{noStop(CIRCULAR.h2)}</h2><p className="lead mt-3 max-w-[140ch]">{CIRCULAR.lead}</p></div>
        <a className="btn btn-navy" href="#/circular-economy">The circular economy →</a>
      </div></section>

      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <div className="mb-7" id="decks"><span className="eyebrow navy">Product knowledge</span><h2 className="max-w-[24ch]">A deck for each of VAN’s {decks.length} brands</h2>
          <p className="lead mt-3 max-w-[140ch]">Each deck explains what the product is, what it does for the crop, where it fits in the season and what its limits are.</p></div>
        {/* D-151 (QA 16): 1 column under 400px, names wrap instead of truncating. Was grid-cols-2 and `truncate`. */}
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {decks.map(p => (
            <a key={p.slug} href={lmsUrl(p)} target="_blank" rel="noopener" className="panel p-3 no-underline flex items-center gap-3 hover:border-[var(--navy)]">
              <div style={{ width: 44, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><PackShot slug={p.slug} style={{ maxHeight: 54, width: 'auto' }} /></div>
              <div className="min-w-0"><div className="font-bold leading-tight" style={{ overflowWrap: 'anywhere' }}>{p.name}</div><div className="cap">PDF deck ↓</div></div>
            </a>
          ))}
        </div>
        <p className="cap mt-4">VAN has published {CROPS.length} crop plans. Each of its {decks.length} brands also has a technical data sheet and a safety data sheet, on the brand’s own page. <a href="#/crops">See the crop plans →</a></p>
      </div></section>

      <section className="wrap sec-tight">
        <div className="panel-navy p-6 lg:p-8 grid lg:grid-cols-[1fr_auto] gap-5 items-center">
          <div><h3>Ask VAN’s agronomy team</h3><p className="mt-2" style={{ color: 'rgba(255,255,255,.8)' }}>VAN’s agronomy team answers questions on VAN’s main WhatsApp number.</p></div>
          <WaButton href={WA.farmer} lg>Ask on WhatsApp</WaButton>
        </div>
      </section>
    </div>
  )
}
