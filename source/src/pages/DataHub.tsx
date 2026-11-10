/**
 * D-246, 2 Oct 2026: Knowledge > Data. A short index of every interactive lens on the site, each with
 * 1 finding and a link to the section it sits in (Tahir's ruling: lenses live in the existing pages,
 * this page only lists them). Every finding below is the lens's own answer at its default year,
 * worked from site-root/data/lenses.json with the same per-acre and maund conversion, and was checked
 * by the independent audit. If the data file is refreshed, re-run the audit and update these lines.
 */
const NAT = '#/knowledge/why-pakistan-must-shift'

const GROUPS: { kicker: string; tone: string; title: string; href: string; lenses: { name: string; finding: string }[] }[] = [
  { kicker: 'The national picture · 01 Usage', tone: 'rust', title: 'How much fertiliser Pakistan uses', href: `${NAT}#k-usage`, lenses: [
    { name: 'Fertiliser per acre', finding: 'In 2023, Pakistan used 63.3 kg of fertiliser nutrient (N, P₂O₅ and K₂O together) per acre of cropland, against a world average of 47.1 kg. Of Pakistan’s 63.3 kg, 0.6 kg was potash (as K₂O).' },
    { name: 'Pakistan’s rank in fertiliser use', finding: 'In 2023, Pakistan used more phosphate per acre than 88% of farming countries and more nitrogen per acre than 93%, but more potash per acre than only 24% of them. Farming countries are those with at least 1 million hectares (about 2.5 million acres) of cropland; about 111 had data for 2023.' },
  ] },
  { kicker: 'The national picture · 02 Balance', tone: 'navy', title: 'The balance between nutrients', href: `${NAT}#k-balance`, lenses: [
    { name: 'Potash against nitrogen', finding: 'In 2023, Pakistan used 1.2 kg of potash for every 100 kg of nitrogen. The world average was 34.1 kg of potash for every 100 kg of nitrogen.' },
    { name: 'Nitrogen against phosphate', finding: 'In 2023, Pakistan used 3.8 kg of nitrogen for every 1 kg of phosphate (P₂O₅). The balance that the National Fertilizer Development Centre (NFDC) recommends is 2 kg of nitrogen for every 1 kg of phosphate (NFDC Fertilizer Review 2024-25).' },
  ] },
  { kicker: 'The national picture · 03 Productivity', tone: 'green', title: 'Crop yield per kg of fertiliser nutrient', href: `${NAT}#k-productivity`, lenses: [
    { name: 'Grain per kg of fertiliser', finding: 'In 2023, by a rough indicator (cereal yield per acre divided by fertiliser nutrient used per acre of all cropland), Pakistan got about 23 kg of cereal grain for each kg of fertiliser nutrient. The world figure was 36 kg.' }, // L2 fact check 9 Nov 2026 (W4): an index, not grain harvested. Was 'Pakistan harvested about 23 kg ... The world average was 36 kg ...'
    // L1 editor 7 Nov 2026: m2 (FAO written out at first use on this page); M10 ('The figure' was the chart or the 30 kg: the 30 kg is defined as the chart's own note defines it).
    { name: 'Fertiliser and yield', finding: 'In 2023, 54 of the countries in the data of the Food and Agriculture Organization of the United Nations (FAO) harvested more cereal per acre than Pakistan while using less fertiliser per acre.' },
    { name: 'Crop yields', finding: 'Pakistan’s wheat yield in 2024 was 33.1 maunds per acre. The chart compares Pakistan’s wheat, rice, maize and sugarcane yields with those of any other country, for each year from 1961.' },
    { name: 'Grain per kg of nitrogen, and yearly changes in nitrogen use and yield', finding: 'In 2023, Pakistan’s cereal yield per acre, in kg, was about 30 times the nitrogen used per acre of cropland. The 30 is cereal yield per acre (in kg) divided by nitrogen used per acre of all cropland. From 1962 to 1990, in years when nitrogen use rose more, cereal yield also tended to rise more. From 1991 to 2023, the link between yearly changes in nitrogen use and yearly changes in cereal yield was weak.' }, // L2 fact check 9 Nov 2026 (W3, W6): was 'Pakistan harvested about 30 kg of cereal grain for each kg of nitrogen used. The 30 kg is ...' and '... the years in which nitrogen use rose most were, as a rule, also the years in which cereal yield rose most.'
    { name: 'Phosphate and yield', finding: 'Across 107 farming countries in 2023, countries that used more phosphate per acre tended to harvest more cereal per acre. In VAN’s calculation from FAO data, the rank correlation was 0.60, on a scale where 0 means no link and 1 means a perfect link. Pakistan used more phosphate per acre than most of these countries.' },
  ] },
  { kicker: 'The national picture · 04 Where it goes', tone: 'rust', title: 'Nitrogen use efficiency: how much nitrogen is taken out in the harvested crop', href: `${NAT}#k-where`, lenses: [
    { name: 'Nitrogen use efficiency', finding: 'Pakistan’s nitrogen use efficiency was 29.1% in 2023: of every 100 kg of nitrogen added to its cropland, about 29 kg were taken out in the harvested crop and about 71 kg were not. The world figure was 55.3%.' },
  ] },
  { kicker: 'The state of the soil · 01 Potassium removed and applied', tone: 'soil', title: 'Punjab’s potash balance, 1971-72 to 2023-24', href: '#/knowledge/soil-and-sustainability#overdraft', lenses: [
    // Tahir 7 Nov 2026 (KN-15): was '... and fertiliser put back about 36,000 tonnes.'
    { name: 'Punjab potash balance', finding: 'In 2023-24, Punjab’s 5 main crops (wheat, rice, sugarcane, maize and cotton) removed an estimated 940,000 tonnes of potash (as K₂O) from the soil, and fertiliser put back about 36,000 tonnes (NFDC offtake records). The chart shows model estimates for each year from 1971-72 to 2023-24.' },
  ] },
  { kicker: 'Soil Poverty Series · Projection', tone: 'soil', title: 'Projected soil potassium in Punjab', href: '#/soil#soil-outlook', lenses: [
    // Tahir 7 Nov 2026 (KN-7 with RP-PO-12, RP-PO-11): was 'If present trends continue, the model projects that Punjab’s average available soil potassium ...'
    // Tahir 7 Nov 2026 (CR-18): was 'the boundary between the bands named Average and Weak'.
    // L1 editor 7 Nov 2026: m2 (ppm written out), m19 ('5-band soil-test scale'). The ruled parts (KN-7 condition, CR-18 band pattern) are unchanged.
    { name: 'Projected available soil potassium in Punjab', finding: 'If potash fertiliser use in Punjab does not rise, the model projects that Punjab’s area-weighted average available soil potassium will fall below 100 ppm (parts per million) around 2036 in the average case, the median of the model results. In the worst case it falls below 100 ppm in 2027, and in the best case in 2044; there is a 1 in 10 chance that the year is earlier than the worst case, and a 1 in 10 chance that it is later than the best case. On VAN’s 5-band soil-test scale, 100 ppm is the boundary between VAN band 3 of 5 (Average) and VAN band 2 of 5 (Weak). These are model projections, not measurements.' },
  ] },
]

export default function DataHub() {
  const count = GROUPS.reduce((n, g) => n + g.lenses.length, 0)
  return (
    <div>
      <section style={{ background: 'linear-gradient(180deg, var(--rust-soft), var(--sand))' }}>
        <div className="wrap py-8 lg:py-12">
          <span className="eyebrow rust">Knowledge · Data</span>
          <h1 className="max-w-[24ch]">Interactive charts of Pakistan’s nutrient data</h1>
          {/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */}
          <p className="lead mt-4 max-w-[140ch]">This page lists {count} interactive charts on fertiliser use, the balance between nutrients, crop yield per kg of fertiliser nutrient, and soil potassium. In the national charts you can choose countries. In every chart you can change the year and open the numbers behind it. Fertiliser use is shown per acre and yields in maunds per acre.</p>
          <p className="cap mt-3"><a href="#/knowledge">← All knowledge</a></p>
        </div>
      </section>

      <section className="sec"><div className="wrap">
        <div className="grid gap-4">
          {GROUPS.map(g => (
            <div key={g.href} className="panel p-5 lg:p-6">
              <span className={`eyebrow ${g.tone}`}>{g.kicker}</span>
              <h3 className="max-w-[34ch]">{g.title}</h3>
              <ul className="grid gap-3 mt-3">
                {g.lenses.map(l => (
                  <li key={l.name} className="small max-w-[140ch]"><b style={{ color: 'var(--navy)' }}>{l.name}.</b> {l.finding}</li>
                ))}
              </ul>
              <a className="btn btn-ghost mt-4" href={g.href}>Open the charts →</a>
            </div>
          ))}
        </div>
        <p className="src mt-6"><b>Source ·</b> FAO, Land, Inputs and Sustainability, via Our World in Data (CC BY 4.0): Fertilizers by Nutrient, crop yields and cropland. FAOSTAT, Cropland Nutrient Balance, December 2025 release, for nitrogen use efficiency. In the charts, &ldquo;China&rdquo; means mainland China. Punjab balance and projection: Tahir Abbas, Soil Poverty Series No. 1 (2026), model estimates. VAN converted the FAO figures from kg per hectare to kg per acre (1 acre = 0.4047 hectare) and yields from kg to maunds (1 maund = 40 kg). In the country lists, &ldquo;Excluded territory&rdquo; means (A Territory Excluded per Passport Directive).</p>
      </div></section>
    </div>
  )
}
