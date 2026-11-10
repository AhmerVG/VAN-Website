import { NATIONAL, WA } from '@/data/site'
import { CROPS } from '@/data/catalogue'
import { SOIL_COPY, SOIL_SOURCE } from '@/data/soilLens'
import { LossLadder } from '@/components/LossLadder'
import { BalanceChart, IndexLinesChart, ProductivityTable, ProductivityChart, RiceChart, RICE_ROWS, Source } from '@/components/Charts'
import { WaButton, noStop } from '@/components/bits'
import { Lens } from '@/components/Lens'
import { HeadlineTiles } from '@/components/soil/SoilBits'

/* Demo A's full national case, restyled into B's panels. Every sentence is from content/knowledge_why-pakistan-must-shift.txt
   and content/circular-economy_index.txt; figures from NATIONAL and those two files. */
// D-151: Nitrogen loss item was 'Vital Urea. Sulfur-coated, patented, released across 7–18 days'; the P and Zn line was
// 'Local, temporary acidification at the root zone to release what alkaline soil has bound' (ruling 8 softening).
const BUILDS: [string, string, [string, string | null][]][] = [
  ['Balance', 'Potash, sulfur, magnesium, calcium and micronutrients included in the nutrition plan from the start, rather than added later', [['Vital Potash', 'vital-potash'], ['SOP', 'sop'], ['Green Sulfur', 'green-sulfur'], ['V-Mag Essential', 'v-mag-essential'], ['Cala-Mag V', 'cala-mag-v'], ['V-Zinc', 'v-zinc'], ['VL-Boron', 'v-boron'], ['VL-Micromix', 'vl-micro-mix']]],
  // D-316, 26 Oct 2026: no day figure for Vital Urea's release (no laboratory release curve exists, as its own page says). Was: "released over 3 to 18 days after the first irrigation, 7 to 8 typical".
  ['Nitrogen loss', 'Nitrogen kept in the soil long enough for the crop to take it up, on soil where plain urea loses nitrogen to the air as ammonia', [['Vital Urea: sulfur-coated and patented; once water reaches the granule, its nitrogen is released in steps over days', 'vital-urea']]],
  ['Phosphorus and zinc bound by alkaline soil', 'Local, temporary acidification around the roots, which may help the crop take up phosphorus and zinc that alkaline soil has bound', [['The sulfur coating on Vital Urea', 'vital-urea'], ['Green Sulfur', 'green-sulfur'], ['Humi Grow', 'humi-grow'], ['V-Transform', 'v-transform']]],
  ['Stage mismatch', 'A crop plan that sets what to apply, at which growth stage and at what rate, instead of a single bag for the whole season', [[`${CROPS.length} published crop plans, set out by growth stage`, null]]],
  ['Application method', 'Product forms that suit the way the nutrient is applied: fertigation, foliar spray, drone spraying, broadcasting or side-dressing', [['Water-soluble, liquid and foliar grades across the range', null]]],
]
const SOURCE_TABLE: [string, string, string][] = [
  ['Fertiliser use per hectare of cropland (shown per acre)', 'Our World in Data / FAO', '2023 data, 2025 release'],
  ['Nutrient use per hectare of arable land (shown per acre)', 'World Bank AG.CON.FERT.ZS (FAO source)', '1999-2000 and 2023-24'],
  ['N, P₂O₅, K₂O tonnages', 'FAOSTAT Fertilizers by Nutrient, via Our World in Data', '2023'],
  ['Crop yields', 'Pakistan Economic Survey Table 2.5 (2009-10 and 2024-25 editions)', '1999-2000 and 2023-24'],
  ['All-cereal yield and production', 'World Bank AG.YLD.CREL.KG · AG.PRD.CREL.MT (FAO)', '2000 to 2023'],
  ['Nitrogen use efficiency', 'FAOSTAT, Cropland Nutrient Balance, December 2025 release', '1961 to 2023'],
  ['Nitrogen surplus, partial factor productivity', 'Shahzad et al., Nature Sustainability', '2019'],
  ['India: nutrient subsidy design', 'Planning Commission of India, Twelfth Five Year Plan, Vol. II, para 12.37', '2013'],
  ['India: urea and potash consumption', 'Comptroller and Auditor General of India, Report No. 16 of 2015', '2015'],
  ['India: urea retail price', 'Department of Fertilizers, Government of India', '2018 onwards'],
  ['Punjab soil survey', SOIL_SOURCE.short, 'about 2016 to 2018'],
  ['Nitrogen applied to rice', 'IFA Fertilizer Use by Crop, via Ludemann, Gruère, Heffer & Dobermann (2022), Scientific Data 9', '2017-18'],
  ['Paddy yields', 'FAOSTAT, via Our World in Data', '2000 and 2023'],
  ['Average farm size', 'PBS 7th Agricultural Census (Pakistan); BBS Agricultural Census via FAO WCA-2020 (Bangladesh)', '2024; 2019'],
  ['China: nutrient utilisation rate', 'Ministry of Agriculture and Rural Affairs, China', 'January 2021 and January 2025'],
]
const K_INDEX: [string, string][] = [['k-usage', '01 Usage'], ['k-balance', '02 Nutrient balance'], ['k-productivity', '03 Productivity'], ['k-where', '04 Where nitrogen goes'], ['k-soil', '05 Punjab soil'], ['cases', '06 Other countries'], ['k-application', '07 Application'], ['k-builds', '08 What VAN makes'], ['k-evidence', '09 Evidence'], ['k-sources', '10 Sources']]

function K({ id, n, kicker, title, lead, children, tone, bg }: { id: string; n: string; kicker: string; title: React.ReactNode; lead?: React.ReactNode; children: React.ReactNode; tone?: 'green' | 'soil' | 'gold' | 'navy' | 'rust'; bg?: string }) {
  return (
    <section className="sec" id={id} style={bg ? { background: bg } : undefined}>
      <div className="wrap">
        <div className="mb-7 lg:mb-9"><span className={`eyebrow ${tone ?? 'navy'}`}><span className="k-num">{n}</span>{kicker}</span><h2 className="max-w-[22ch]">{noStop(title)}</h2>{lead && <p className="lead mt-3">{lead}</p>}</div>
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
          <h1 className="max-w-[22ch]">The nutrition Pakistan pays for</h1>
          <p className="lead mt-4 max-w-[140ch]">{NATIONAL.h1a} {NATIONAL.h1b} {NATIONAL.lead}</p>
          <p className="mt-4 max-w-[140ch]"><b>Pakistan&rsquo;s nitrogen use efficiency was 29% in 2023:</b> of every 100 kg of nitrogen added to its cropland from all sources, 29 kg were taken out in the harvested crop. The world figure was 55%, and the United States figure about 71% (FAO estimates). In Pakistan, the remaining 71 kg of every 100 kg were not taken out in the harvested crop, and part of this came from fertiliser that farmers had bought and applied.</p>{/* L1 editor 7 Nov 2026 (whyshift m10): was 'Of the 71 kg in Pakistan that were not taken out ..., part came from ...' (71 used for 2 measures) */}
          <div className="flex flex-wrap gap-2 mt-6">{K_INDEX.map(([id, l]) => <a key={id} className="chip chip-xs" href={`#${id}`}>{l}</a>)}</div>
          {/* national → soil, saying WHY it is there. A link that says "learn more" does not get
              followed; one that names what is on the other side does. */}
          <div className="panel p-4 mt-6 max-w-[140ch]">
            {/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */}
            <span className="cap">Punjab soil test data</span>
            <p className="mt-1"><a href="#/soil"><b>Punjab's soil: 770,160 samples tested →</b></a><br />
            <span className="small muted">Most of Punjab's soil samples, tested in about 2016 to 2018, were alkaline. On alkaline soil, part of the nitrogen applied is lost to the air, and phosphorus and zinc are held in forms the crop cannot take up. The soil page gives the results for each of Punjab's 36 districts.</span></p>
          </div>
          <p className="cap mt-4"><a href="#/knowledge">← All knowledge</a> · <a href="#/knowledge/soil-and-sustainability">The state of the soil</a> · <a href="#/knowledge/application-systems">Application systems</a></p>
        </div>
      </section>

      <K id="k-usage" n="01" kicker="Usage" title="Pakistan is not under-fertilised." tone="rust">
        {/* D-246: the fixed Chart 1 (UseChart) is now the interactive lens, all 3 nutrients together by default. */}
        <Lens label="Fertiliser per acre, Pakistan against other countries" countries={['India', 'United Kingdom', 'World', 'United States']} specs={[
          { id: 'perha', opt: 'NPK' },
          { id: 'phosphate', opts: ['stand'], tab: 'Where Pakistan stands', topic: 'PAKISTAN COMPARED WITH OTHER FARMING COUNTRIES' },
        ]} />
        <div className="mt-6">
          <div className="panel-soft p-5"><p className="small">{NATIONAL.usePerHa.note} Yet yields per acre in both countries were higher than in Pakistan. The quantity of fertiliser applied is therefore not the main limit on Pakistan’s yields. Sections 3 to 5 show what happens to the nutrient after it is applied.</p><p className="cap mt-3">Of the countries shown when the chart opens, India applied the most fertiliser nutrient per acre of cropland in 2023 (73.7 kg). Section 2 explains why India is a warning for Pakistan.</p></div>
        </div>
      </K>

      <K id="k-balance" n="02" kicker="Nutrient balance" title="A nitrogen habit, not a nutrition plan." lead="Crops need several nutrients, but in 2023 nitrogen made up 78.5% of the fertiliser nutrient applied in Pakistan, phosphate 20.5% and potash 0.94%. The chart below compares Pakistan with India, its nearest large neighbour, which grows similar crops on similar soils. India is included as a warning for Pakistan; the note at the end of this section explains why." bg="var(--sand-2)">
        <BalanceChart />
        <p className="lead mt-6">{NATIONAL.balance.text} When a crop receives a lot of nitrogen and little potassium, and the soil cannot make up the difference, its growth is soft and easily damaged, and it cannot use all the nitrogen applied. The national ratio of 83 to 1 suggests that many crops in Pakistan are in this position.</p>
        {/* D-246: the same balance over time and against any country. */}
        <Lens label="Potash and phosphate against nitrogen, over time" countries={['India', 'Bangladesh', 'China', 'World']} specs={[
          { id: 'balance' },
          { id: 'phosphate', opts: ['np'], tab: 'Nitrogen against phosphate', topic: 'NITROGEN APPLIED PER 1 KG OF PHOSPHATE' },
        ]} />
        <details className="disc panel p-4 mt-5"><summary>Why India is a warning for Pakistan</summary>
          <div className="grid gap-3 small mt-2 max-w-[140ch]">
            {/* L1 editor 7 Nov 2026 (whyshift m6): muriate of potash explained. */}
            <p>India’s nutrient balance is not one for Pakistan to copy. Of the countries shown in section 1, India applied the most fertiliser nutrient per acre of cropland in 2023. India’s Twelfth Five Year Plan called the design of its nutrient subsidy “seriously flawed” because it distorted the balance between nutrients (Planning Commission of India, Twelfth Five Year Plan, Vol. II, para 12.37). The Comptroller and Auditor General of India found that, between 2010-11 and 2013-14, urea consumption rose slightly and consumption of muriate of potash (potassium chloride, the common potash fertiliser) fell sharply, over a period in which the potash price rose and the urea price did not (CAG of India, Report No. 16 of 2015). India has held the retail price of a 45 kg bag of urea at ₹242 since 1 March 2018 (Department of Fertilizers, Government of India).</p>
            <p>Pakistan should not follow India’s path of raising fertiliser use. In India, a fixed urea price, while the potash price rose, has led to higher fertiliser use and a worse balance between nutrients, but not to more crop for each kilogram of nutrient applied. Pakistan’s balance between nutrients is already worse than India’s: in 2023, potash was 0.94% of the fertiliser nutrient applied in Pakistan, against 6.13% in India.</p>
          </div>
        </details>
      </K>

      {/* Tahir 9 Nov 2026: section 3 heading; was "More went on, less came back." */}
      <K id="k-productivity" n="03" kicker="Productivity" title="More nutrient went on, and less crop came back for each kilogram." lead={`Between 1999-2000 and 2023-24, nutrient applied per acre of arable land in Pakistan rose by ${NATIONAL.productivity.nutrientChange.pct.replace(/^\+/, '')}, while wheat yield rose by ${NATIONAL.productivity.wheatChange.pct.replace(/^\+/, '')}.`} tone="green">
        {/* O-22: the before/after pair moved here from the About page. It is the plainest statement
            of the whole argument, so it goes first, and the index lines and the per-crop table follow
            for a reader who wants the working. */}
        {/* D-151 (QA 23): the pair without its own table; the table is the one beside the index lines. Was <ProductivityChart />. */}
        <ProductivityChart table={false} />
        {/* L1 editor 7 Nov 2026 (whyshift m14): cropland and arable land told apart where the arable figures appear. */}
        <p className="cap mt-3 max-w-[140ch]">The nutrient figures above are per acre of arable land. Arable land excludes land under permanent crops, so these figures differ from the cropland figures in section 1.</p>
        <div className="grid xl:grid-cols-[1fr_1fr] gap-6 items-start mt-5"><IndexLinesChart /><div><p className="cap mt-3 max-w-[140ch]">For wheat, rice and cotton, and for cereals as a whole, yield rose less than nutrient applied per acre, so the yield for each kilogram of nutrient fell.</p><ProductivityTable withSource={false} /></div></div>
        {/* D-246: the same question against the world, crop by crop and nutrient by nutrient. */}
        <Lens label="Crop output per kg of fertiliser, Pakistan against other countries" countries={['India', 'Bangladesh', 'China', 'World']} specs={[
          { id: 'return' },
          { id: 'scatter' },
          { id: 'yields' },
          { id: 'nitrogen', opts: ['pfp', 'yoy'], tab: 'Grain per kg of nitrogen', topic: 'NITROGEN USE AND CEREAL YIELD' },
          { id: 'phosphate', opts: ['pscat'] },
        ]} />
      </K>

      <K id="k-where" n="04" kicker="Where nitrogen goes" title="The loss nobody invoices for." tone="rust" bg="var(--sand-2)">
        {/* D-246: the fixed Chart 4 (UptakeSplit) is now the interactive lens. D-325, 4 Nov 2026: the lens moved from Lassaletta et al. (2014) to FAO's Cropland Nutrient Balance, 1961 to 2023. */}
        <Lens label="Nitrogen use efficiency, Pakistan against other countries" countries={['India', 'United States', 'Bangladesh', 'China']} specs={[
          { id: 'nitrogen', opts: ['nue'], year: 2023, tab: 'Nitrogen use efficiency', topic: 'NITROGEN USE EFFICIENCY' },
        ]} />
        {/* D-247, Tahir 2 Oct 2026: matches the lens above (Lassaletta et al. 2014, Pakistan 26.72% in 2014). Was ≈{NATIONAL.nitrogen.pk}% (25) with "of the nitrogen applied ... is taken up by the crop"; the rest of the sentence is NATIONAL.nitrogen.text unchanged. */}
        {/* D-325: FAO 2023 (29.1%). Was 'About 27% ... (2014)' on Lassaletta et al. 2014. */}
        <div className="panel p-5 mt-6 max-w-[140ch]">
          <h3>How nitrogen is lost from the soil, and how alkaline soil binds phosphorus and zinc</h3>
          <p className="small mt-3">Part of Pakistan’s nitrogen loss is caused by the chemistry of its soil, which farmers cannot control. In Punjab, 69.1% of the 770,160 soil samples tested in about 2016 to 2018 were above pH 8.0 (section 5). On such soil, urea left on the surface breaks down quickly to ammonia (hydrolysis), and part of its nitrogen is lost to the air before the crop can take it up. The nitrogen that remains is converted to nitrate, and part of that nitrate moves with the irrigation water and is lost to water. In waterlogged soil, part of the nitrate is converted to nitrogen gases and lost to the air (denitrification). In alkaline soil, phosphorus and zinc also form calcium and carbonate compounds that the root cannot take up. High soil pH therefore causes 2 problems: it increases the loss of applied nitrogen, and it makes phosphorus and zinc in the soil less available to the crop.</p>
        </div>
        {/* O-21: the ladder. The national page states the loss; this is what a reader can do about it,
            and it is the same component the crop pages carry so the two can never drift apart. */}
        <div className="mt-6"><LossLadder /></div>
        <p className="mt-4"><b>A separate VAN report sets out what this loss costs, where the 5.7 million tonnes of nitrogen added to Pakistan’s cropland from all sources in 2023 went (FAO estimate), how other countries raised their efficiency, and how Pakistan can raise its own:</b> <a href="#/knowledge/real-price-of-nitrogen">The cost of low nitrogen use efficiency in Pakistan →</a></p>
      </K>

      <K id="k-soil" n="05" kicker={SOIL_COPY.homeActKicker} title="The soil underneath these numbers." lead={`In Punjab, soil alkalinity has been measured directly. ${SOIL_COPY.homeActLead}`} tone="soil">
        <HeadlineTiles />
        <p className="src"><b>Source ·</b> {SOIL_SOURCE.short}. <a href="#/soil#caveats">Read the limits of this data before quoting it ›</a></p>
        <p className="small mt-3 max-w-[140ch]">In these samples, available phosphorus did not fall as pH rose. The soil page explains this pattern by past fertiliser use: the most alkaline districts are also the most heavily fertilised. The binding of phosphorus in alkaline soil is well established in controlled studies, but it is not visible in this survey.</p>
        <div className="flex flex-wrap gap-3 mt-5"><a className="btn btn-navy" href="#/soil">Punjab soil test results by district →</a><a className="btn btn-ghost" href="#/soil?rel=p-ph">Why soil phosphorus does not fall as pH rises in Punjab's data →</a></div>
      </K>

      {/* L1 editor 7 Nov 2026 (whyshift M1 in part, m9): paddy explained at first use; past tense for 2017-18 and 2023 data. The table row 'Rice (cleaned basis)' waits for Tahir (Q10). */}
      <K id="cases" n="06" kicker="Other countries" title="Other countries have raised how much of their nutrient reaches the crop." lead="Some countries produce more crop for each kilogram of nutrient than Pakistan, and some have raised that figure over time, by different methods and at different scales. In the rice comparison below, India produced less paddy (rice still in its husk) per kilogram of nitrogen than Pakistan." bg="var(--sand-2)">
        <h3 className="mb-2">Rice: paddy produced per kilogram of nitrogen in 6 Asian countries</h3>
        <p className="small max-w-[140ch] mb-5">This comparison uses 1 crop grown in 1 region and 1 measure: the paddy produced for each kilogram of nitrogen applied to rice.</p>
        <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          <RiceChart />
          <div className="panel overflow-x-auto tbl-scroll"><table className="tbl">
            <thead><tr><th>Country</th><th className="r">N applied to rice (survey estimate)</th><th className="r">Paddy yield</th><th className="r">Paddy per kg N</th><th className="r">Average farm size</th></tr></thead>
            <tbody>{RICE_ROWS.map(r => <tr key={r.c} style={{ background: r.c === 'Pakistan' ? 'var(--gold-soft)' : undefined }}><td className="font-bold">{r.c}</td><td className="r num">{r.n}</td><td className="r num">{r.y}</td><td className="r num font-bold">{r.per} kg</td><td className="r num">{r.farm}</td></tr>)}</tbody>
          </table></div>
        </div>
        <p className="display mt-6 max-w-[40ch]" style={{ fontSize: 'clamp(20px,2vw,27px)', lineHeight: 1.25 }}>{NATIONAL.bangladesh}</p>
        <p className="small mt-3 max-w-[140ch]">Bangladesh is a useful comparison for Pakistan. Its farms are smaller: 1.29 acres on average (2019 census) against 5.3 acres in Pakistan (2024 census). Its farmers also have less capital, and it has the same monsoon. Its paddy yield rose from 34.4 maunds per acre in 2000 to 52.7 maunds per acre in 2023 (3.40 to 5.21 t/ha, FAOSTAT). In 2017-18, it applied less nitrogen per acre to rice than Pakistan. VAN’s interpretation is that capital and farm size do not explain Bangladesh’s higher paddy output per kilogram of nitrogen, and that nutrient balance, rice varieties and the way nutrient is applied do.</p>
        <p className="cap mt-3 max-w-[140ch]"><b>Limits of this comparison.</b> The nitrogen rates are survey estimates for the 2017-18 season, and the paddy yields are for 2023. Recalculating both on a same-year 2018 basis changes the values but not the ranking: Bangladesh and Vietnam still produced more paddy per kilogram of nitrogen than Pakistan, and India still produced less. Myanmar is left out because it applies so little nitrogen to rice that its paddy per kilogram of nitrogen is very high even though its yields are low.</p>
        <h3 className="mt-10 mb-3">China and the United States: more cereal with little or no increase in nutrient use</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="panel p-5"><h4>China</h4><p className="small mt-2">On VAN’s calculation from FAO and World Bank data, China’s total nutrient use fell by 22.6% between 2014 and 2023, while its cereal yield rose by 8.9%. China issued a national programme in 2015 to stop the growth in fertiliser use. Its nutrient use had peaked in 2014, so the programme reinforced a fall that had already begun rather than causing it on its own. China’s Ministry of Agriculture and Rural Affairs reports a nutrient utilisation rate for rice, wheat and maize, which rose from 35.2% in 2015 to 42.6% in 2024. This is a different measure from the nitrogen use efficiency in section 4, and the 2 cannot be compared.</p></div>
          <div className="panel p-5"><h4>United States</h4><p className="small mt-2">On VAN’s calculation from World Bank and FAO data, the cereal production of the United States rose by 35% between 2000 and 2023, while its fertiliser use rose by about 1%. On VAN’s calculation, its cereal production per kg of fertiliser nutrient used rose from 20.8 kg in 2000 to 27.8 kg in 2023, 2.5 times Pakistan’s figure on the same measure. This measure divides total cereal production by total fertiliser nutrient used, so it differs from the 23 kg in section 3, which divides cereal yield per acre by fertiliser nutrient applied per acre of all cropland.</p></div>
        </div>
        <p className="small mt-6 max-w-[140ch]">The cases in this section point to 4 ways of getting more crop from each kilogram of nutrient:</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          {[['Balance', 'Applying all the nutrients a crop needs instead of mainly nitrogen, with crop-specific formulations based on soil tests rather than a single blend for every crop.'], ['Uptake', 'Getting more of the applied nutrient taken up by the crop, as China’s rising nutrient utilisation rate shows.'], ['Timing', 'Splitting applications and timing them to the crop’s demand, instead of applying most of the nutrient early in the season.'], ['Placement', 'Deep placement, banding and fertigation instead of surface broadcasting, so the nutrient is placed near the root rather than where it is easily lost.']].map(([t, d]) => <div key={t} className="panel-soft p-4"><div className="font-bold">{t}</div><p className="cap mt-1">{d}</p></div>)}
        </div>
        {/* Tahir 7 Nov 2026 (CO-23): World Bank 160 kg/ha is the 2023-24 value, as in section 3; was "in 2023". */}
        <p className="cap mt-4 max-w-[140ch]">China still applied about 2.5 times as much fertiliser nutrient per acre of arable land as Pakistan in 2023-24: 159 kg against 65 kg (World Bank, published as 394 and 160 kg/ha). The lesson from China is therefore about raising the crop produced for each kilogram of nutrient, while its total use per acre stays high.</p>
        <Source>World Bank AG.PRD.CREL.MT and AG.YLD.CREL.KG (FAO); FAOSTAT nutrient use via Our World in Data. Nutrient utilisation rate: Ministry of Agriculture and Rural Affairs, China, January 2021 and January 2025. The changes and the per-kg figures are VAN’s calculations.</Source>{/* L1 editor 7 Nov 2026 (whyshift m15): was 'The ratios are VAN’s calculations.' */}
      </K>

      <K id="k-application" n="07" kicker="Application" title="The half of the problem nobody buys.">
        <p className="lead">A bag is not a dose. The same quantity of a nutrient has different effects depending on its form, the time it is applied and the way it is placed. Urea broadcast on the surface of hot alkaline soil loses part of its nitrogen to the air as ammonia; the same nitrogen in a coated form is released over days, so less of it is exposed to loss at any one time. A micronutrient spray adds to yield only when it is applied at the growth stage at which the crop needs it. At the wrong stage it adds cost without adding yield.</p>
        <p className="small mt-4 max-w-[140ch]">In Pakistan, fertiliser is bought by the bag and by the nutrient percentage printed on it. Buying a bag does not decide when, how or in what form the nutrient is applied, and these choices affect how much of it is lost.</p>
        <a className="btn btn-ghost mt-4" href="#/crops/wheat#methods">The 5 application methods and what each one changes →</a>
      </K>

      {/* L1 editor 7 Nov 2026 (whyshift m11): PSQCA written out before its short form; 'master record' replaced. Was: 'In VAN’s PSQCA master record of July 2026, 20 of VAN’s 23 brands held a manufacturing licence from the Pakistan Standards and Quality Control Authority (PSQCA).' */}
      <K id="k-builds" n="08" kicker="What VAN makes for each problem" title="5 gaps, and what each one actually requires." lead="For each of the 5 problems described in sections 2 to 7, this section lists what is needed and the VAN brands that address it. Every batch of each brand listed is tested by VAN’s own laboratory before it is released; the laboratory is accredited by the Pakistan National Accreditation Council (PNAC). According to VAN’s record of its licences from the Pakistan Standards and Quality Control Authority (PSQCA), in July 2026, 20 of VAN’s 23 brands held a PSQCA manufacturing licence." tone="green" bg="var(--sand-2)">
        <div className="panel overflow-x-auto tbl-scroll"><table className="tbl" style={{ minWidth: 720 }}>
          <thead><tr><th>Problem</th><th>What is needed</th><th>VAN brands</th></tr></thead>
          <tbody>{BUILDS.map(([g, r, m]) => <tr key={g}><td className="font-bold whitespace-nowrap">{g}</td><td style={{ minWidth: 260 }}>{r}</td><td style={{ minWidth: 260 }}>{m.map(([n, s], i) => <span key={n}>{i > 0 && ' · '}{s ? <a href={`#/products/${s}`}>{n}</a> : g === 'Stage mismatch' ? <a href="#/crops">{n}</a> : n}</span>)}</td></tr>)}</tbody>
        </table></div>
        <a className="btn btn-navy mt-4" href="#/soil#soil-built">VAN brands for each soil condition →</a>
      </K>

      <K id="k-evidence" n="09" kicker="Evidence" title="How to read the evidence.">
        {/* D-320, 27 Oct 2026: the published 2024 maize trial line and its panel removed (Tahir: remove everywhere). */}
        <div className="grid gap-5 max-w-[100ch]">
          <div className="grid gap-3 small">
            <p>The figures in sections 1 to 6 come from public sources: national and international statistics, and the Punjab soil testing programme. Ratios and indices are VAN’s calculations from those figures.</p>
            <p>Peer-reviewed studies show that coated and controlled-release nitrogen reduces losses compared with uncoated urea and raises the share of fertiliser nitrogen taken up by the crop. They also show that elemental sulfur raises phosphorus availability in calcareous soil (soil rich in calcium carbonate). These findings are about the technologies in general. They are not measurements made on VAN’s brands.</p>
            <p>On request, VAN shares the results of any trial it holds on a specific VAN brand.</p>
          </div>
        </div>
      </K>

      <K id="k-sources" n="10" kicker="Sources" title="Every figure, its source, its year." bg="var(--sand-2)">
        <div className="panel overflow-x-auto tbl-scroll"><table className="tbl" style={{ minWidth: 640 }}>
          <thead><tr><th>Figure</th><th>Source</th><th>Year</th></tr></thead>
          <tbody>{SOURCE_TABLE.map(([f, s, y]) => <tr key={f}><td className="font-semibold">{f}</td><td>{s}</td><td className="num whitespace-nowrap">{y}</td></tr>)}</tbody>
        </table></div>
        <p className="cap mt-4 max-w-[140ch]">Derived figures are VAN&rsquo;s calculations from the published figures shown. Section 1 and the country charts in section 3 use cropland (arable land plus land under permanent crops). The index chart and table in section 3, and the China comparison in section 6, use arable land. In the country lists, &ldquo;Excluded territory&rdquo; stands for (A Territory Excluded per Passport Directive).</p>
      </K>

      <section className="wrap sec-tight">
        <div className="panel-navy p-6 lg:p-8 grid lg:grid-cols-[1fr_auto] gap-5 items-center">
          <div><h3>Questions the charts do not answer</h3><p className="mt-2" style={{ color: 'rgba(255,255,255,.8)' }}>VAN’s agronomy team answers such questions on VAN’s WhatsApp enquiry line.</p></div>
          <WaButton href={WA.farmer} lg>Ask on WhatsApp</WaButton>
        </div>
      </section>
    </div>
  )
}
