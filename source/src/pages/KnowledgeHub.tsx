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
    title: 'Soil Poverty: Punjab’s Potash. Where available soil potassium is low, crops can take up less of the nitrogen and phosphorus in urea and diammonium phosphate (DAP).',
    lead: 'Punjab’s 5 main crops are wheat, rice, sugarcane, maize and cotton. In the 2023-24 crop year, these 5 crops removed an estimated 940,000 tonnes of potash (as K₂O) from the soil. In the same year, about 36,000 tonnes of potash was put back into the soil in fertiliser (offtake records of the National Fertilizer Development Centre). If potash fertiliser use in Punjab does not rise, the report’s model projects that Punjab’s area-weighted average available soil potassium will fall below 100 parts per million (ppm). Available soil potassium is the potassium (K) extracted from soil with ammonium acetate, as Punjab soil laboratories report it, in milligrams per kilogram of soil (ppm). The 100 ppm level is a warning line chosen for the report. The report’s model made many separate calculations of the projection, called model runs. In each run, the model picked a value for every uncertain input from the range that the report gives for that input. In the model’s average case, the fall below 100 ppm comes around the crop year 2035-36. The average case is the median of the model runs. In any year, half of the model runs project a lower level of available soil potassium than the average case. In the worst case, the fall comes in 2026-27. In the best case, the fall comes in 2043-44. In any year, 1 in 10 model runs projects a lower level of available soil potassium than the worst case. Another 1 in 10 runs projects a higher level than the best case. These years are model projections. The report is by Tahir Abbas. The full report can be downloaded as a PDF.' },
  // D-325, 4 Nov 2026: The real price of nitrogen, a Vital Agri Nutrients report (Tahir's ruling: its own Knowledge piece, the 6th).
  { href: '#/knowledge/real-price-of-nitrogen', kicker: 'A Vital Agri Nutrients report', tone: 'rust',
    title: 'The cost of low nitrogen use efficiency in Pakistan',
    lead: 'Pakistan’s nitrogen use efficiency (NUE) was 29.1% in 2023, according to an estimate by the Food and Agriculture Organization of the United Nations (FAO). The 29.1% means that Pakistan’s harvested crops contained about 29 kg of nitrogen for every 100 kg of nitrogen added to cropland in 2023. The 100 kg counts nitrogen from all sources, including fertiliser and manure. The report calls the 29 kg the nitrogen taken out in the harvested crop. The report then values the nitrogen added at the urea price. In the Rabi winter crop season of 2024-25, the urea price was Rs 193 a kg of nitrogen. At that price, the nitrogen added for each kg of nitrogen taken out in the harvested crop is worth about Rs 660. The Rs 660 is a calculated value. The report shows where the 5.7 million tonnes of nitrogen added to Pakistan’s cropland in 2023 ended up. It also reports what China, the European Union and India did about the nitrogen that was not taken out in their harvested crops. It then sets out the 4 approaches to raising NUE that published trials examine. The full report can be downloaded as a PDF.' },
  // D-186, 26 Sep 2026: the 17 nutrients, first in the list because it is the one a grower asks for.
  { href: '#/knowledge/nutrients', kicker: 'The 17 nutrients', tone: 'green',
    title: 'The 17 nutrients a crop needs, and why the nutrient in shortest supply limits the harvest.',
    lead: 'The article explains what each of the 17 nutrients does in the plant, what a crop looks like when it is short of one, and which nutrients help or hinder each other. The article also has an interactive tool called the nutrient barrel, based on Liebig’s Law of the Minimum. In the tool, a grower enters the number of bags of each product applied to 1 acre. The tool then shows the nutrient with the largest shortfall against VAN’s crop plan for the grower’s crop. Each nutrient’s shortfall is measured as a share of the amount in the crop plan.' },
  { href: '#/knowledge/why-pakistan-must-shift', kicker: 'The national picture', tone: 'rust',
    title: 'Pakistan applies more fertiliser per acre of cropland than the world average. Only part of the nutrient applied reaches the crop.',
    lead: 'The article compares Pakistan with India, Bangladesh, China and the United States on fertiliser use, the balance between nutrients, crop yield per kg of fertiliser nutrient and what happens to the nitrogen applied. It names the source of every figure.' },
  { href: '#/knowledge/soil-and-sustainability', kicker: 'The state of the soil', tone: 'soil',
    title: 'The state of Pakistan’s soil and the nutrients that crops remove from it.',
    lead: 'Every harvest removes nutrients from the soil. The article compares the potash (as K₂O) removed by crops with the potash applied. It also summarises published soil surveys. It then explains how soil nutrient levels have been recorded in Pakistan.' },
  { href: '#/knowledge/application-systems', kicker: 'Application systems', tone: 'navy',
    title: 'How a nutrient is delivered and how much of it reaches the crop.',
    lead: 'The article explains what each application method and each irrigation system requires of a product. The application methods are broadcast, fertigation, foliar spray and drone spray. Fertigation means applying the nutrient through the irrigation water. The irrigation systems are centre pivot and drip. The article also lists the 3 maize trials of Vital Urea run from 2023 to 2025. In the 2023 and 2025 trials, a 25 kg bag of Vital Urea took the place of a 50 kg bag of urea at the first nitrogen application. The article then describes One Tank. VAN formulated the One Tank product family for the 20-litre tank of a spray drone.' },
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
          <p className="lead mt-3 max-w-[140ch]">The charts compare Pakistan with any country the reader chooses on fertiliser use per acre, the balance between nutrients, crop yield per kg of fertiliser nutrient and NUE. The charts also show the Soil Poverty report’s model projection of Punjab’s area-weighted average available soil potassium.</p></div>
        <a className="btn btn-navy" href="#/knowledge/data">Open the data →</a>
      </div></section>

      <section className="sec" style={{ background: 'var(--sand-2)', borderTop: '1px solid var(--line)' }}><div className="wrap">
        <div className="mb-7"><span className="eyebrow soil">Soil Atlas</span><h2 className="max-w-[24ch]">Soil Atlas: 770,160 soil samples from Punjab</h2>
          <p className="lead mt-3 max-w-[140ch]">The Soil Atlas shows the results of the Punjab soil testing programme for each of the {SOIL_HEADLINE.districts} districts that the programme covered. The programme’s samples were tested in about 2016 to 2018.</p></div>
        <p className="src"><b>Source ·</b> {SOIL_SOURCE.short}. <a href="#/soil#caveats">Read the Soil Atlas method and limitations before quoting its figures ›</a></p>
        <div className="flex flex-wrap gap-3 mt-4"><a className="btn btn-navy" href="#/soil">Open the Soil Atlas →</a><a className="btn btn-ghost" href="#/soil?rel=p-ph">Phosphorus and pH: why the results of the Punjab soil testing programme do not show the fall in available phosphorus at high pH that controlled studies found →</a></div>
      </div></section>

      <section className="sec"><div className="wrap">
        <div className="mb-7"><span className="eyebrow green">Circular economy</span><h2 className="max-w-[24ch]">{noStop(CIRCULAR.h2)}</h2><p className="lead mt-3 max-w-[140ch]">{CIRCULAR.lead}</p></div>
        <a className="btn btn-navy" href="#/circular-economy">The circular economy →</a>
      </div></section>

      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <div className="mb-7" id="decks"><span className="eyebrow navy">Product knowledge</span><h2 className="max-w-[24ch]">A deck for each of VAN’s {decks.length} registered brands</h2>
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
        <p className="cap mt-4">Besides its deck, each of VAN’s {decks.length} registered brands has a technical data sheet and a safety data sheet on the brand’s own page. VAN has also published {CROPS.length} crop plans. <a href="#/crops">See the crop plans →</a></p>
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
