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
    { name: 'Fertiliser nutrient per acre of cropland', finding: 'In 2023, Pakistan used 63.3 kg of fertiliser nutrient per acre of cropland, against a world average of 47.1 kg. Fertiliser nutrient means nitrogen (as N), phosphate (as P₂O₅) and potash (as K₂O), counted together. Of Pakistan’s 63.3 kg, 0.6 kg was potash.' },
    { name: 'Where Pakistan stands', finding: 'In 2023, Pakistan used more nitrogen per acre than 93% of farming countries and more phosphate per acre than 88% of them. By contrast, Pakistan used more potash per acre than only 24% of farming countries. Farming countries are countries with at least 1 million hectares of cropland, or about 2.5 million acres. About 111 farming countries had data for 2023.' },
  ] },
  { kicker: 'The national picture · 02 Nutrient balance', tone: 'navy', title: 'The balance between nutrients', href: `${NAT}#k-balance`, lenses: [
    { name: 'Potash or phosphate per 100 kg of nitrogen', finding: 'In 2023, Pakistan used 1.2 kg of potash for every 100 kg of nitrogen. The world average was 34.1 kg of potash for every 100 kg of nitrogen.' },
    { name: 'Nitrogen per 1 kg of phosphate', finding: 'In 2023, Pakistan used 3.8 kg of nitrogen for every 1 kg of phosphate (P₂O₅). The balance that the National Fertilizer Development Centre (NFDC) recommends is 2 kg of nitrogen for every 1 kg of phosphate (NFDC Fertilizer Review 2024-25).' },
  ] },
  { kicker: 'The national picture · 03 Productivity', tone: 'green', title: 'Crop yield per kg of fertiliser nutrient', href: `${NAT}#k-productivity`, lenses: [
    { name: 'Cereal grain per kg of fertiliser nutrient', finding: 'By a rough indicator, Pakistan got about 23 kg of cereal grain for each kg of fertiliser nutrient in 2023. The indicator is cereal yield per acre divided by the fertiliser nutrient used per acre of all cropland. On the same indicator, the world figure was 36 kg.' }, // L2 fact check 9 Nov 2026 (W4): an index, not grain harvested. Was 'Pakistan harvested about 23 kg ... The world average was 36 kg ...'
    // L1 editor 7 Nov 2026: m2 (FAO written out at first use on this page); M10 ('The figure' was the chart or the 30 kg: the 30 kg is defined as the chart's own note defines it).
    { name: 'Fertiliser and yield', finding: 'In the 2023 data of the Food and Agriculture Organization of the United Nations (FAO), 54 countries harvested more cereal per acre than Pakistan while using less fertiliser nutrient per acre.' },
    { name: 'Crop yields', finding: 'Pakistan’s wheat yield in 2024 was 33.1 maunds per acre. The chart compares Pakistan’s wheat, rice, maize and sugarcane yields with those of any other country, for each year from 1961.' },
    { name: 'Grain per kg of nitrogen', finding: 'By a rough indicator, Pakistan’s grain per kg of nitrogen was about 30 kg in 2023. The 30 kg is Pakistan’s cereal yield per acre divided by the nitrogen used per acre of all cropland, with both figures in kg per acre. The chart also compares yearly changes in nitrogen use with yearly changes in cereal yield. From 1962 to 1990, years with a larger rise in nitrogen use also tended to have a larger rise in cereal yield. From 1991 to 2023, the link between yearly changes in nitrogen use and yearly changes in cereal yield was weak.' }, // L2 fact check 9 Nov 2026 (W3, W6): was 'Pakistan harvested about 30 kg of cereal grain for each kg of nitrogen used. The 30 kg is ...' and '... the years in which nitrogen use rose most were, as a rule, also the years in which cereal yield rose most.'
    { name: 'Phosphate and yield', finding: 'Across 107 farming countries in 2023, countries that used more phosphate per acre tended to harvest more cereal per acre. In VAN’s calculation from FAO data, the rank correlation between phosphate use per acre and cereal yield per acre was 0.60. On the rank correlation scale, 0 means no link and 1 means a perfect link. Pakistan used more phosphate per acre than most of the 107 farming countries.' },
  ] },
  { kicker: 'The national picture · 04 Where nitrogen goes', tone: 'rust', title: 'Nitrogen use efficiency (NUE)', href: `${NAT}#k-where`, lenses: [
    { name: 'NUE', finding: 'Pakistan’s NUE was 29.1% in 2023 (an FAO estimate). The 29.1% means that Pakistan’s harvested crops contained about 29 kg of nitrogen for every 100 kg of nitrogen added to cropland in 2023. The 100 kg counts nitrogen from all sources, including fertiliser and manure. The other 71 kg or so of every 100 kg added ended up outside the harvested crops. World NUE was 55.3% in 2023.' },
  ] },
  { kicker: 'The state of the soil · 01 Potash removed and applied', tone: 'soil', title: 'Punjab’s potash balance, 1971-72 to 2023-24', href: '#/knowledge/soil-and-sustainability#overdraft', lenses: [
    // Tahir 7 Nov 2026 (KN-15): was '... and fertiliser put back about 36,000 tonnes.'
    { name: 'Punjab potash balance', finding: 'Punjab’s 5 main crops are wheat, rice, sugarcane, maize and cotton. In the 2023-24 crop year, these 5 crops removed an estimated 940,000 tonnes of potash (as K₂O) from the soil. In the same year, about 36,000 tonnes of potash was put back into the soil in fertiliser (NFDC offtake records). The chart shows model estimates for each year from 1971-72 to 2023-24.' },
  ] },
  { kicker: 'Soil Poverty Series · Projection', tone: 'soil', title: 'Projected soil potassium in Punjab', href: '#/soil#soil-outlook', lenses: [
    // Tahir 7 Nov 2026 (KN-7 with RP-PO-12, RP-PO-11): was 'If present trends continue, the model projects that Punjab’s average available soil potassium ...'
    // Tahir 7 Nov 2026 (CR-18): was 'the boundary between the bands named Average and Weak'.
    // L1 editor 7 Nov 2026: m2 (ppm written out), m19 ('5-band soil-test scale'). The ruled parts (KN-7 condition, CR-18 band pattern) are unchanged.
    { name: 'Punjab soil potassium outlook', finding: 'If potash fertiliser use in Punjab does not rise, the Soil Poverty report’s model projects that Punjab’s area-weighted average available soil potassium will fall below 100 parts per million (ppm). Available soil potassium is the potassium (K) extracted from soil with ammonium acetate, as Punjab soil laboratories report it, in milligrams per kilogram of soil (ppm). The report’s model made many separate calculations of the projection, called model runs. In each run, the model picked a value for every uncertain input from the range that the report gives for that input. In the model’s average case, the fall below 100 ppm comes around the crop year 2035-36. The average case is the median of the model runs. In any year, half of the model runs project a lower level of available soil potassium than the average case. In the worst case, the fall comes in 2026-27. In the best case, the fall comes in 2043-44. In any year, 1 in 10 model runs projects a lower level of available soil potassium than the worst case. Another 1 in 10 runs projects a higher level than the best case. These years are model projections. On VAN’s 5-band soil-test scale, 100 ppm is the boundary between VAN band 3 of 5 (Average) and VAN band 2 of 5 (Weak).' },
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
          <p className="lead mt-4 max-w-[140ch]">The {count} interactive charts on this page cover fertiliser use, the balance between nutrients, crop yield per kg of fertiliser nutrient, nitrogen use efficiency (NUE) and soil potassium. In the national charts, you can choose the countries to compare with Pakistan. In every chart, you can change the year and open the numbers behind it. The charts give fertiliser use per acre and crop yields in maunds per acre.</p>
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
        <p className="src mt-6"><b>Source ·</b> FAO, Land, Inputs and Sustainability, via Our World in Data (CC BY 4.0): Fertilizers by Nutrient, crop yields and cropland. FAOSTAT, Cropland Nutrient Balance, December 2025 release, for NUE. In the charts, &ldquo;China&rdquo; means mainland China. Punjab balance and projection: Tahir Abbas, Soil Poverty: Punjab’s Potash, Soil Poverty Series No. 1 (2026), model estimates. VAN converted the FAO figures from kg per hectare to kg per acre (1 acre = 0.4047 hectare) and yields from kg to maunds (1 maund = 40 kg). In the country lists, &ldquo;Excluded territory&rdquo; means (A Territory Excluded per Passport Directive).</p>
      </div></section>
    </div>
  )
}
