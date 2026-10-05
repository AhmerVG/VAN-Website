/**
 * D-246, 2 Oct 2026: Knowledge > Data. A short index of every interactive lens on the site, each with
 * 1 finding and a link to the section it sits in (Tahir's ruling: lenses live in the existing pages,
 * this page only lists them). Every finding below is the lens's own answer at its default year,
 * worked from site-root/data/lenses.json with the same per-acre and maund conversion, and was checked
 * by the independent audit. If the data file is refreshed, re-run the audit and update these lines.
 */
const NAT = '#/knowledge/why-pakistan-must-shift'

const GROUPS: { kicker: string; tone: string; title: string; href: string; lenses: { name: string; finding: string }[] }[] = [
  { kicker: 'The national picture · 01 Usage', tone: 'rust', title: 'How much goes on', href: `${NAT}#k-usage`, lenses: [
    { name: 'Fertilizer per acre', finding: 'In 2023, Pakistan used 63.3 kg of fertilizer nutrient (N, P2O5 and K2O together) per acre of cropland, against a world average of 47.1 kg. Of that, potash was 0.6 kg.' },
    { name: 'Where Pakistan stands', finding: 'In 2023, Pakistan used more phosphate per acre than 88% of farming countries and more nitrogen than 93%, but more potash than only 24%.' },
  ] },
  { kicker: 'The national picture · 02 Balance', tone: 'navy', title: 'What it consists of', href: `${NAT}#k-balance`, lenses: [
    { name: 'Potash against nitrogen', finding: 'In 2023, Pakistan used 1.2 kg of potash for every 100 kg of nitrogen. The world used 34.1 kg.' },
    { name: 'Nitrogen against phosphate', finding: 'In 2023, Pakistan used 3.8 kg of nitrogen for every 1 kg of phosphate. The recommended balance is 2 to 1.' },
  ] },
  { kicker: 'The national picture · 03 Productivity', tone: 'green', title: 'What comes back', href: `${NAT}#k-productivity`, lenses: [
    { name: 'Grain per kg of fertilizer', finding: 'In 2023, Pakistan got about 23 kg of cereal grain for each kg of fertilizer nutrient. The world got 36 kg.' },
    { name: 'Fertilizer and yield', finding: 'In 2023, 54 countries harvested more cereal per acre than Pakistan while using less fertilizer per acre.' },
    { name: 'Crop yields', finding: 'Pakistan’s wheat yield in 2024 was 33.1 maunds per acre. Wheat, rice, maize and sugarcane, against any country, from 1961.' },
    { name: 'Grain per kg of nitrogen, and year to year', finding: 'In 2023, Pakistan’s cereal yield per acre was about 30 times the nitrogen used per acre of cropland. Year to year: from 1962 to 1990, years when nitrogen use rose more also tended to see cereal yield rise more; from 1991 to 2023 that link is weak.' },
    { name: 'Phosphate and yield', finding: 'Across 107 farming countries in 2023, more phosphate per acre went with more cereal per acre (rank correlation 0.60). Pakistan already uses more phosphate than most.' },
  ] },
  { kicker: 'The national picture · 04 Where it goes', tone: 'rust', title: 'Where the nitrogen goes', href: `${NAT}#k-where`, lenses: [
    { name: 'Nitrogen in the harvest', finding: 'In 2014, 26.7% of the nitrogen added to Pakistan’s cropland came out in the harvested crop. About 73 of every 100 kg was not removed in the harvest.' },
  ] },
  { kicker: 'The state of the soil · 01 The overdraft', tone: 'soil', title: 'Punjab’s own record', href: '#/knowledge/soil-and-sustainability#overdraft', lenses: [
    { name: 'Punjab potash balance', finding: 'In 2023-24, Punjab’s 5 main crops took about 940 thousand tonnes of potash out of the soil. Fertilizer put back 36 thousand tonnes. Model estimates, 1971-72 to 2023-24.' },
  ] },
  { kicker: 'Soil Atlas · Outlook', tone: 'soil', title: 'Where the soil is heading', href: '#/soil#soil-outlook', lenses: [
    { name: 'Punjab soil potash outlook', finding: 'If nothing changes, the average case puts Punjab’s soil potash below 100 ppm, from Average to Weak on VAN’s soil scale, around 2036. Worst case 2027, best case 2044. Projections, not measurements.' },
  ] },
]

export default function DataHub() {
  const count = GROUPS.reduce((n, g) => n + g.lenses.length, 0)
  return (
    <div>
      <section style={{ background: 'linear-gradient(180deg, var(--rust-soft), var(--sand))' }}>
        <div className="wrap py-8 lg:py-12">
          <span className="eyebrow rust">Knowledge · Data</span>
          <h1 className="max-w-[24ch]">Pakistan’s nutrient data, to explore yourself.</h1>
          <p className="lead mt-4 max-w-[140ch]">{count} interactive charts, each in the page where its argument is made. Pick countries, move the year and open the numbers. Fertilizer is shown per acre and yields in maunds per acre.</p>
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
        <p className="src mt-6"><b>Source ·</b> FAO, Land, Inputs and Sustainability, via Our World in Data (CC BY 4.0): fertilizer by nutrient, crop yields, cropland. Lassaletta, Billen, Grizzetti, Anglade and Garnier (2014), Environmental Research Letters 9:105011, for nitrogen in the harvest. Punjab balance and outlook: Tahir Abbas, Soil Poverty Series No. 1 (2026), model estimates. Converted from per hectare to per acre (1 acre = 0.4047 hectare; 1 maund = 40 kg).</p>
      </div></section>
    </div>
  )
}
