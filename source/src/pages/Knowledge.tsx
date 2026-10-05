import { NATIONAL, WA } from '@/data/site'
import { CROPS } from '@/data/catalogue'
import { SOIL_COPY, SOIL_HEADLINE, SOIL_SOURCE } from '@/data/soilLens'
import { LossLadder } from '@/components/LossLadder'
import { BalanceChart, IndexLinesChart, ProductivityTable, ProductivityChart, RiceChart, RICE_ROWS, Source } from '@/components/Charts'
import { WaButton } from '@/components/bits'
import { Lens } from '@/components/Lens'
import { HeadlineTiles } from '@/components/soil/SoilBits'

/* Demo A's full national case, restyled into B's panels. Every sentence is from content/knowledge_why-pakistan-must-shift.txt
   and content/circular-economy_index.txt; figures from NATIONAL and those two files. */
// D-151: Nitrogen loss item was 'Vital Urea. Sulfur-coated, patented, released across 7–18 days'; the P and Zn line was
// 'Local, temporary acidification at the root zone to release what alkaline soil has bound' (ruling 8 softening).
const BUILDS: [string, string, [string, string | null][]][] = [
  ['Balance', 'Potash, sulfur, magnesium, calcium and micronutrients treated as part of the plan rather than an afterthought', [['Vital Potash', 'vital-potash'], ['SOP', 'sop'], ['Green Sulfur', 'green-sulfur'], ['V-Mag Essential', 'v-mag-essential'], ['Cala-Mag V', 'cala-mag-v'], ['V-Zinc', 'v-zinc'], ['VL-Boron', 'v-boron'], ['VL-Micromix', 'vl-micro-mix']]],
  ['Nitrogen loss', 'Nitrogen held in the soil long enough for the crop to reach it, on ground where plain urea volatilises', [['Vital Urea. Sulfur-coated, patented, released over 3 to 18 days after the first irrigation, 7 to 8 typical', 'vital-urea']]],
  ['Locked phosphorus and zinc', 'Local, temporary acidification at the root zone, which may help phosphorus and zinc that alkaline soil has bound', [['The sulfur coating on Vital Urea', 'vital-urea'], ['Green Sulfur', 'green-sulfur'], ['Humi Grow', 'humi-grow'], ['V-Transform', 'v-transform']]],
  ['Stage mismatch', 'A programme that says what to apply, at which growth stage, at what rate, not a single bag for a whole season', [[`${CROPS.length} published crop nutrition plans, stage by stage`, null]]],
  ['Delivery', 'Forms that suit how the nutrient is actually going out. Fertigated, foliar, drone, broadcast, side-dressed', [['Water-soluble, liquid and foliar grades across the range', null]]],
]
const SOURCE_TABLE: [string, string, string][] = [
  ['Fertilizer use per hectare of cropland', 'Our World in Data / FAO', '2023 data, 2025 release'],
  ['Nutrient use per hectare of arable land', 'World Bank AG.CON.FERT.ZS (FAO source)', '1999-2000 and 2023-24'],
  ['N, P₂O₅, K₂O tonnages', 'FAOSTAT Fertilizers by Nutrient, via Our World in Data', '2023'],
  ['Crop yields', 'Pakistan Economic Survey Table 2.5 (2009-10 and 2024-25 editions)', '1999-2000 and 2023-24'],
  ['All-cereal yield and production', 'World Bank AG.YLD.CREL.KG · AG.PRD.CREL.MT (FAO)', '2000–2023'],
  ['Nitrogen use efficiency', 'Lassaletta et al., Environmental Research Letters 9:105011', '2014'],
  ['Nitrogen surplus, partial factor productivity', 'Shahzad et al., Nature Sustainability', '2019'],
  ['India. Nutrient subsidy design', 'Planning Commission of India, Twelfth Five Year Plan, Vol. II, para 12.37', '2013'],
  ['India. Urea vs potash consumption', 'Comptroller and Auditor General of India, Report No. 16 of 2015', '2015'],
  ['India. Urea retail price', 'Department of Fertilizers, Government of India', 'held since 2018'],
  ['Sulfur-coated urea field trial', 'Umair et al., Planta Animalia 4(3) 129–135', '2025'],
  ['Punjab soil survey', SOIL_SOURCE.short, 'c. 2016–2018'],
]
const K_INDEX: [string, string][] = [['k-usage', '01 Usage'], ['k-balance', '02 Balance'], ['k-productivity', '03 Productivity'], ['k-where', '04 Where it goes'], ['k-soil', '05 The soil'], ['cases', '06 Cases'], ['k-application', '07 Application'], ['k-builds', '08 What VAN builds'], ['k-evidence', '09 Evidence'], ['k-sources', '10 Sources']]

function K({ id, n, kicker, title, lead, children, tone, bg }: { id: string; n: string; kicker: string; title: React.ReactNode; lead?: React.ReactNode; children: React.ReactNode; tone?: 'green' | 'soil' | 'gold' | 'navy' | 'rust'; bg?: string }) {
  return (
    <section className="sec" id={id} style={bg ? { background: bg } : undefined}>
      <div className="wrap">
        <div className="mb-7 lg:mb-9"><span className={`eyebrow ${tone ?? 'navy'}`}><span className="k-num">{n}</span>{kicker}</span><h2 className="max-w-[22ch]">{title}</h2>{lead && <p className="lead mt-3">{lead}</p>}</div>
        {children}
      </div>
    </section>
  )
}

export default function Knowledge() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(180deg, var(--rust-soft), var(--sand))' }}>
        <div className="wrap py-8 lg:py-12">
          {/* O-22, 9 Sep 2026. Tahir ruled the national case gets its own page, two-way linked with
              soil, and named it "The nutrition Pakistan pays for". He also chose PROMOTING this page
              over writing a new one, so the same figures do not end up living in four places that
              have to be kept in step.
              THE URL DOES NOT CHANGE. /knowledge/why-pakistan-must-shift.html is in the live sitemap
              and indexed; renaming it would break an indexed URL to gain nothing a title cannot. What
              changes is what it is called, where it sits, and what it carries. */}
          <span className="eyebrow rust">The national case</span>
          <h1 className="max-w-[22ch]">The nutrition Pakistan pays for.</h1>
          <p className="lead mt-4 max-w-[140ch]">{NATIONAL.h1a} {NATIONAL.h1b} {NATIONAL.lead}</p>
          <p className="mt-4 max-w-[140ch]"><b>Roughly 1 kg of nitrogen in 4 is taken up by the crop.</b> The country buys the other 3, carries them to the field, and loses them there. Every figure below names its source and its year.</p>
          <div className="flex flex-wrap gap-2 mt-6">{K_INDEX.map(([id, l]) => <a key={id} className="chip chip-xs" href={`#${id}`}>{l}</a>)}</div>
          {/* national → soil, saying WHY it is there. A link that says "learn more" does not get
              followed; one that names what is on the other side does. */}
          <div className="panel p-4 mt-6 max-w-[140ch]">
            <span className="cap">The ground underneath this argument</span>
            <p className="mt-1"><a href="#/soil"><b>Punjab's soil, measured 770,160 times →</b></a><br />
            <span className="small muted">This page says alkalinity is why the nutrient does not arrive. That is not an opinion here: it is measured across 36 districts, and you can read your own.</span></p>
          </div>
          <p className="cap mt-4"><a href="#/knowledge">← All knowledge</a> · <a href="#/knowledge/soil-and-sustainability">The state of the soil</a> · <a href="#/knowledge/application-systems">Application systems</a></p>
        </div>
      </section>

      <K id="k-usage" n="01" kicker="Usage" title="Pakistan is not under-fertilised." lead="The first thing to establish, because almost every other conclusion depends on it." tone="rust">
        {/* D-246: the fixed Chart 1 (UseChart) is now the interactive lens, all 3 nutrients together by default. */}
        <Lens label="Fertilizer per acre, Pakistan against other countries" countries={['India', 'United Kingdom', 'World', 'United States']} specs={[
          { id: 'perha', opt: 'NPK' },
          { id: 'phosphate', opts: ['stand'], tab: 'Where Pakistan stands', topic: 'WHERE PAKISTAN STANDS' },
        ]} />
        <div className="mt-6">
          <div className="panel-soft p-5"><p className="small">{NATIONAL.usePerHa.note} If low application were the binding constraint, the countries below Pakistan on this chart would be the ones with a yield problem. They are not. So the question is what happens to the nutrient after it goes on the field.</p><p className="cap mt-3">Note where India sits. It is the heaviest applier in this comparison, and it is not the target, for reasons set out in the next section.</p></div>
        </div>
      </K>

      <K id="k-balance" n="02" kicker="Balance" title="A nitrogen habit, not a nutrition plan." lead="Crops do not eat one nutrient. Pakistan very nearly feeds them one. Share of total nutrient applied, Pakistan against India. The nearest large neighbour growing comparable crops on comparable soils." bg="var(--sand-2)">
        <BalanceChart />
        <p className="lead mt-6">{NATIONAL.balance.text} A crop given that ratio grows fast, soft and vulnerable, and then cannot convert the nitrogen it was given.</p>
        {/* D-246: the same balance over time and against any country. */}
        <Lens label="Potash and phosphate against nitrogen, over time" countries={['India', 'Bangladesh', 'China', 'World']} specs={[
          { id: 'balance' },
          { id: 'phosphate', opts: ['np'], tab: 'Nitrogen against phosphate', topic: 'NITROGEN AGAINST PHOSPHATE' },
        ]} />
        <details className="disc panel p-4 mt-5"><summary>India is on this page as a warning, not as a model</summary>
          <div className="grid gap-3 small mt-2 max-w-[140ch]">
            <p>India appears here because it is the nearest large neighbour farming comparable crops on comparable soils, not because its position is one to aim at. India is the heaviest applier per acre in section 1, and its own nutrient ratio has been repeatedly judged a policy failure at home. India’s Twelfth Five Year Plan called the design of its nutrient subsidy “seriously flawed” for distorting the balance between nutrients (Planning Commission of India, Twelfth Five Year Plan, Vol. II, para 12.37). The Comptroller and Auditor General found that between 2010-11 and 2013-14 urea consumption rose slightly while muriate of potash consumption fell sharply, as potash prices rose and urea’s did not (CAG of India, Report No. 16 of 2015). The retail price of a 45 kg bag of urea in India has been held at ₹242 since 1 March 2018 (Department of Fertilizers, Government of India).</p>
            <p>The lesson is not to apply more like India. A distorted price signal buys volume and imbalance rather than conversion, and Pakistan is closer to that position than to escaping it.</p>
          </div>
        </details>
      </K>

      <K id="k-productivity" n="03" kicker="Productivity" title="More went on, less came back." lead="The 2 lines that matter, and they point in opposite directions." tone="green">
        {/* O-22: the before/after pair moved here from the About page. It is the plainest statement
            of the whole argument, so it goes first, and the index lines and the per-crop table follow
            for a reader who wants the working. */}
        {/* D-151 (QA 23): the pair without its own table; the table is the one beside the index lines. Was <ProductivityChart />. */}
        <ProductivityChart table={false} />
        <div className="grid xl:grid-cols-[1fr_1fr] gap-6 items-start mt-5"><IndexLinesChart /><div><ProductivityTable withSource={false} /><p className="cap mt-3 max-w-[140ch]">Yields rose. Nutrient use rose faster. Every major crop now returns less for each kilogram applied than it did at the turn of the century.</p><Source>{NATIONAL.productivity.source}</Source></div></div>
        {/* D-246: the same question against the world, crop by crop and nutrient by nutrient. */}
        <Lens label="What fertilizer gives back, Pakistan against other countries" countries={['India', 'Bangladesh', 'China', 'World']} specs={[
          { id: 'return' },
          { id: 'scatter' },
          { id: 'yields' },
          { id: 'nitrogen', opts: ['pfp', 'yoy'], tab: 'Grain per kg of nitrogen', topic: 'GRAIN PER KG OF NITROGEN' },
          { id: 'phosphate', opts: ['pscat'] },
        ]} />
      </K>

      <K id="k-where" n="04" kicker="Where it goes" title="The loss nobody invoices for." tone="rust" bg="var(--sand-2)">
        {/* D-246: the fixed Chart 4 (UptakeSplit) is now the interactive lens on the same source, Lassaletta et al. (2014). */}
        <Lens label="Nitrogen in the harvest, Pakistan against other countries" countries={['India', 'United States', 'Bangladesh', 'China']} specs={[
          { id: 'nitrogen', opts: ['nue'], year: 2014, tab: 'Nitrogen in the harvest', topic: 'NITROGEN IN THE HARVEST' },
        ]} />
        {/* D-247, Tahir 2 Oct 2026: matches the lens above (Lassaletta et al. 2014, Pakistan 26.72% in 2014). Was ≈{NATIONAL.nitrogen.pk}% (25) with "of the nitrogen applied ... is taken up by the crop"; the rest of the sentence is NATIONAL.nitrogen.text unchanged. */}
        <p className="lead mt-6"><b style={{ color: 'var(--navy)' }}>About 27%</b> of the nitrogen added to Pakistan’s cropland came out in the harvest (2014). {NATIONAL.nitrogen.text.slice(NATIONAL.nitrogen.text.indexOf('. ') + 2)}</p>
        <Source>{NATIONAL.nitrogen.source}, which places Pakistan at the lowest partial factor productivity and the highest nitrogen surplus in its comparison set.</Source>
        {/* O-21: the ladder. The national page states the loss; this is what a reader can do about it,
            and it is the same component the crop pages carry so the two can never drift apart. */}
        <div className="mt-6"><LossLadder /></div>
        <div className="panel p-5 mt-6 max-w-[140ch]">
          <h3>Why Pakistani conditions make it worse</h3>
          <p className="small mt-3">This is soil chemistry, not farmer error. Urea applied to a surface above pH 8, which is most cultivated ground in this country, hydrolyses rapidly and escapes as ammonia before it can be taken up. What survives nitrifies to nitrate, which is mobile and leaves with the irrigation water. In waterlogged ground the remainder denitrifies to gas. Meanwhile the same alkalinity locks up phosphorus and zinc as calcium and carbonate compounds the root cannot reach. High pH is therefore doing 2 kinds of damage at once: it wastes the nitrogen that is applied, and it withholds the nutrients that already are.</p>
        </div>
      </K>

      <K id="k-soil" n="05" kicker={SOIL_COPY.homeActKicker} title="The soil underneath these numbers." lead={`In Punjab, that sentence is measured rather than assumed. ${SOIL_COPY.homeActLead}`} tone="soil">
        <HeadlineTiles />
        <p className="src"><b>Source ·</b> {SOIL_SOURCE.short}. {SOIL_HEADLINE.samples} samples across {SOIL_HEADLINE.districts} districts; conditions, not mechanism. <a href="#/soil#caveats">Read this before quoting ›</a></p>
        <div className="flex flex-wrap gap-3 mt-5"><a className="btn btn-navy" href="#/soil">The soil underneath these numbers →</a><a className="btn btn-ghost" href="#/soil?rel=p-ph">The relationship that does not hold →</a></div>
      </K>

      <K id="cases" n="06" kicker="The cases worth studying" title="Other countries have raised how much of their nutrient reaches the crop." lead="Several countries have moved it, in different ways, at different scales. India is not among them." bg="var(--sand-2)">
        <h3 className="mb-2">6.1 · Rice, and the neighbour that should worry us</h3>
        <p className="small max-w-[140ch] mb-5">One crop, grown across the same region, measured one way: how much rice each kilogram of nitrogen produces.</p>
        <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          <RiceChart />
          <div className="panel overflow-x-auto tbl-scroll"><table className="tbl">
            <thead><tr><th>Country</th><th className="r">N applied to rice</th><th className="r">Paddy yield</th><th className="r">Paddy per kg N</th><th className="r">Avg farm size</th></tr></thead>
            <tbody>{RICE_ROWS.map(r => <tr key={r.c} style={{ background: r.c === 'Pakistan' ? 'var(--gold-soft)' : undefined }}><td className="font-bold">{r.c}</td><td className="r num">{r.n}</td><td className="r num">{r.y}</td><td className="r num font-bold">{r.per} kg</td><td className="r num">{r.farm}</td></tr>)}</tbody>
          </table></div>
        </div>
        <p className="display mt-6 max-w-[40ch]" style={{ fontSize: 'clamp(20px,2vw,27px)', lineHeight: 1.25 }}>{NATIONAL.bangladesh}</p>
        <p className="cap mt-3 max-w-[140ch]"><b>What this comparison can and cannot carry.</b> Nitrogen rates are survey estimates for the 2017/18 season; paddy yields are 2023. Recalculating both on a same-year 2018 basis changes the values but not the ranking. Bangladesh and Vietnam still convert nitrogen into rice better than Pakistan, and India still sits below us. Myanmar is excluded: it applies almost no nitrogen at all, which produces a flattering ratio and a poor harvest, and it is not a model for anything.</p>
        <p className="small mt-3 max-w-[140ch]">Bangladesh is the uncomfortable case, and the useful one. Smaller farms, less capital, the same monsoon, and its paddy yield rose from 34.4 to 52.7 maunds an acre since 2000 (3.40 to 5.21 t/ha, FAOSTAT) while using less nitrogen per acre than Pakistan. Nothing about that is explained by money or land. It is explained by balance, variety and how nutrient is delivered.</p>
        <h3 className="mt-10 mb-3">6.2 · Decoupling at national scale</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="panel p-5"><h4>China</h4><p className="small mt-2">Cut total nutrient use 22.6% between 2014 and 2023 and still raised cereal yield 8.9%. Its national programme to halt growth in fertilizer use took effect in 2015. The year the 2 lines separate. China’s own measured nutrient utilisation rate on rice, wheat and maize rose from 35.2% in 2015 to 42.6% in 2024.</p></div>
          <div className="panel p-5"><h4>United States</h4><p className="small mt-2">Raised cereal production 35% between 2000 and 2023 on a fertilizer use that rose about 1%. Nutrient productivity 20.8 → 27.8 kg of cereal per kg of nutrient. 2.5 times Pakistan’s.</p></div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {[['Balance', 'Feeding the whole nutrient basket instead of pushing nitrogen. Soil-test-based, crop-specific formulations rather than one blend for everything.'], ['Use efficiency', 'The same nutrient, more of it reaching the plant. China’s own measured utilisation rate, 35.2% (2015) to 42.6% (2024).'], ['Right stage', 'Splitting and timing applications to the crop’s demand curve instead of front-loading the season.'], ['Right method', 'Deep placement, banding and fertigation in place of surface broadcast. Putting nutrient where the root is rather than where the loss is.']].map(([t, d]) => <div key={t} className="panel-soft p-4"><div className="font-bold">{t}</div><p className="cap mt-1">{d}</p></div>)}
        </div>
        <p className="cap mt-4 max-w-[140ch]"><b>The part we will not overstate.</b> China still applies roughly 2.5 times as much nutrient per acre as Pakistan, 159 against 65 kg an acre of arable land in 2023 (World Bank, published as 394 and 160 kg/ha). This is an argument about conversion, not volume. China’s own use peaked in 2014, the year before its programme was issued, so the policy consolidated a turn already under way rather than causing it single-handedly.</p>
        <Source>World Bank AG.PRD.CREL.MT and AG.YLD.CREL.KG (FAO); FAOSTAT nutrient use via Our World in Data. Nutrient utilisation rate: Ministry of Agriculture and Rural Affairs, China, January 2021 and January 2025. Ratios derived.</Source>
      </K>

      <K id="k-application" n="07" kicker="Application" title="The half of the problem nobody buys.">
        <p className="lead">A bag is not a dose. The same nutrient, in the same quantity, does different things depending on the form it is in, the moment it is given, and the way it is placed. Surface-broadcast urea on hot alkaline ground volatilises; the identical nitrogen in a coated form is released over days, so less of it is exposed at any one moment. A micronutrient sprayed at the wrong growth stage is an expense; the same spray at the right stage is a yield.</p>
        <p className="small mt-4 max-w-[140ch]">Pakistan buys fertilizer by the bag and by the nutrient percentage printed on it. Almost nothing in that purchase describes when, how or in what form it will be delivered, which is where most of the loss happens.</p>
        <a className="btn btn-ghost mt-4" href="#/crops/wheat#methods">How application changes the answer. The 5 methods →</a>
      </K>

      <K id="k-builds" n="08" kicker="What VAN builds against each of these" title="5 gaps, and what each one actually requires." lead="Every product below is released through VAN’s own PNAC-accredited laboratory. 20 of the 23 brands also hold a live PSQCA manufacturing licence; the other 3 say on their own pages why they do not." tone="green" bg="var(--sand-2)">
        <div className="panel overflow-x-auto tbl-scroll"><table className="tbl" style={{ minWidth: 720 }}>
          <thead><tr><th>The gap</th><th>What it requires</th><th>What we make</th></tr></thead>
          <tbody>{BUILDS.map(([g, r, m]) => <tr key={g}><td className="font-bold whitespace-nowrap">{g}</td><td style={{ minWidth: 260 }}>{r}</td><td style={{ minWidth: 260 }}>{m.map(([n, s], i) => <span key={n}>{i > 0 && ' · '}{s ? <a href={`#/products/${s}`}>{n}</a> : g === 'Stage mismatch' ? <a href="#/crops">{n}</a> : n}</span>)}</td></tr>)}</tbody>
        </table></div>
        <a className="btn btn-navy mt-4" href="#/soil#soil-built">What VAN makes against each soil condition →</a>
      </K>

      <K id="k-evidence" n="09" kicker="The evidence behind this page" title="How to read the evidence on this page.">
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-3 small">
            <p>Everything in sections 1 to 6 is national data from public sources. It establishes the problem. The evidence for VAN’s own answer is set out separately.</p>
            <p><b>What is independently established:</b> that coated and controlled-release nitrogen reduces losses and improves nitrogen recovery against uncoated urea, and that elemental sulfur raises phosphorus availability in calcareous soil. Both are peer-reviewed findings about the technology, not measurements of our product.</p>
            <p><b>What we have of our own:</b> a replicated field trial at VAN’s trial station, spring 2024, published in 2025, in which 2 stage-timed applications of sulfur-coated urea outperformed a 5-application conventional urea and CAN programme on maize. We cite that finding as the paper states it.</p>
            <p><b>Where the trials stand:</b> each product page prints the trial it has, and only that. If you need trial data for a specific product before you buy it, ask. Where a trial exists, you will get it.</p>
          </div>
          <div className="panel p-5" style={{ borderColor: 'var(--navy)', borderWidth: 2 }}>
            <span className="eyebrow navy">The trial</span>
            <p className="small">Umair, A., Manzoor, M., Saleem, M. S., Akram, S., Ali, M., Batool, A., Javaid, T., Javaid, A., Sharif, M. N. &amp; Haider, M. S. (2025). Efficacy Evaluation of Different Doses of Nitrogenous Fertilizers on the Growth and Yield of Maize (Zea mays). Planta Animalia 4(3), 129–135. <a href="https://doi.org/10.71454/PA.004.03.0126" target="_blank" rel="noopener">DOI 10.71454/PA.004.03.0126</a>.</p>
            <p className="cap mt-3">Randomised complete block design, 3 replications, DK-6321 hybrid, VAN’s trial station, spring 2024.</p>
            <a className="btn btn-gold btn-sm mt-4" href="#/products/vital-urea">Vital Urea. The evidence in full →</a>
          </div>
        </div>
      </K>

      <K id="k-sources" n="10" kicker="Sources" title="Every figure, its source, its year." bg="var(--sand-2)">
        <div className="panel overflow-x-auto tbl-scroll"><table className="tbl" style={{ minWidth: 640 }}>
          <thead><tr><th>Figure</th><th>Source</th><th>Year</th></tr></thead>
          <tbody>{SOURCE_TABLE.map(([f, s, y]) => <tr key={f}><td className="font-semibold">{f}</td><td>{s}</td><td className="num whitespace-nowrap">{y}</td></tr>)}</tbody>
        </table></div>
        <p className="cap mt-4 max-w-[140ch]">Figures marked derived are our arithmetic on the published inputs shown, not published figures in themselves. Where 2 series use different denominators, cropland in section 1, arable land in sections 3 and 6, we say so rather than presenting them as the same measure.</p>
      </K>

      <section className="wrap sec-tight">
        <div className="panel-navy p-6 lg:p-8 grid lg:grid-cols-[1fr_auto] gap-5 items-center">
          <div><h3>Have a question the charts don’t answer?</h3><p className="mt-2" style={{ color: 'rgba(255,255,255,.8)' }}>The agronomy team answers on the same WhatsApp line as everything else.</p></div>
          <WaButton href={WA.farmer} lg>Ask on WhatsApp</WaButton>
        </div>
      </section>
    </div>
  )
}
