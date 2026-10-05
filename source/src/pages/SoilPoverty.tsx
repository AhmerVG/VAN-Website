import type { ReactNode } from 'react'
import { SP_FAN, SP_BALANCE, SP_PDF, SP_EMAIL } from '@/data/soilPoverty'
import { useFitWidth } from '@/hooks/useFitWidth'
import { useTip } from '@/hooks/useInView'
import { Source, Tip } from '@/components/Charts'

/**
 * SOIL POVERTY SERIES No. 1, "Soil Poverty: Punjab's Potash" by Tahir Abbas. D-245, 1 Oct 2026.
 * Tahir's rulings: its own page, linked from both Knowledge and the Soil Atlas; the full report as a
 * web page plus the PDF; byline Tahir Abbas personally with his author line; model on request only,
 * by email; headline leads with the date range; the Engro field claim stays out; the soil record is
 * not cited as Government of Punjab data in this report. Text is the report's final version (Word
 * file of 1 Oct 2026, Newspaper Submission folder). Change wording only at Tahir's word.
 */

const NAVY = '#1F3A5F', RED = '#B42318', MUTED = '#5B6A5E', RULE = 'rgba(20,35,26,0.16)'

/* ————— the fan: Punjab average available potash, 20,000 runs, red below 100 ppm ————— */
function FanChart() {
  const fit = useFitWidth(760)
  const { tip, show, hide } = useTip()
  const W = fit.W, H = Math.round(W * (fit.narrow ? 0.95 : 0.56)), L = 40, R = fit.narrow ? 62 : 70, T = 16, B = 34
  const x = (yr: number) => L + (yr - 2018) / 32 * (W - L - R)
  const y = (v: number) => T + (1 - Math.max(0, v) / 140) * (H - T - B)
  const band = (lo: 1 | 2, hi: 4 | 5) =>
    SP_FAN.map((r, i) => `${i ? 'L' : 'M'}${x(r[0])} ${y(r[hi])}`).join(' ') + ' ' +
    SP_FAN.slice().reverse().map(r => `L${x(r[0])} ${y(r[lo])}`).join(' ') + ' Z'
  const cross = SP_FAN.find(r => r[3] < 100)!
  const last = SP_FAN[SP_FAN.length - 1]
  const lab = (yr: number) => `${yr - 1}-${String(yr).slice(2)}`
  return (
    <div className="chart panel p-5">
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>Most runs cross 100 ppm between 2027 and 2044; the middle run crosses in {lab(cross[0])}</h4><span className="cap">ppm, no action taken</span></div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 10 }} role="img" aria-label="Most runs cross 100 ppm between 2027 and 2044; the middle run crosses in 2035-36">
        <rect x={L} y={y(100)} width={W - L - R} height={y(0) - y(100)} fill={RED} opacity={0.06} />
        {[0, 40, 80, 100, 120, 140].map(g => <g key={g}><line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke={RULE} strokeDasharray="2 3" /><text x={L - 8} y={y(g) + 4} textAnchor="end" fontSize={12} fill={MUTED}>{g}</text></g>)}
        {(fit.narrow ? [2020, 2030, 2040, 2050] : [2020, 2025, 2030, 2035, 2040, 2045, 2050]).map(t => <text key={t} x={x(t)} y={H - 10} textAnchor="middle" fontSize={12} fill={MUTED}>{t}</text>)}
        <path d={band(1, 5)} fill={NAVY} opacity={0.13} />
        <path d={band(2, 4)} fill={NAVY} opacity={0.25} />
        <line x1={L} x2={W - R} y1={y(100)} y2={y(100)} stroke={RED} strokeWidth={1.5} strokeDasharray="6 4" />
        <text x={W - R + 6} y={y(100) + 4} fontSize={13} fontWeight={700} fill={RED}>100 ppm</text>
        {SP_FAN.slice(1).map((r, i) => <line key={r[0]} x1={x(SP_FAN[i][0])} y1={y(SP_FAN[i][3])} x2={x(r[0])} y2={y(r[3])} stroke={r[3] >= 100 ? NAVY : RED} strokeWidth={3.5} strokeLinecap="round" />)}
        {SP_FAN.map(r => <circle key={r[0]} cx={x(r[0])} cy={y(r[3])} r={7} fill="transparent" onMouseMove={e => show(e, `<b>${lab(r[0])}</b><br/>Middle run ${r[3]} ppm<br/>8 in 10 runs: ${r[1]} to ${r[5]}`)} onMouseLeave={hide} />)}
        <circle cx={x(cross[0])} cy={y(cross[3])} r={6} fill="none" stroke={RED} strokeWidth={2} />
        <text x={x(cross[0]) + 10} y={y(cross[3]) - 10} fontSize={13} fontWeight={700} fill={RED}>{lab(cross[0])}</text>
        <text x={x(2018) + 4} y={y(SP_FAN[0][3]) - 8} fontSize={12} fill={NAVY}>{SP_FAN[0][3]}</text>
        <text x={W - R + 6} y={y(last[3]) + 4} fontSize={13} fontWeight={700} fill={RED}>{Math.round(last[3])}</text>
        <text x={L + 8} y={y(0) - 10} fontSize={13} fontWeight={700} fill={RED}>{fit.narrow ? 'Below 100 ppm' : 'Below 100 ppm: urea and DAP buy less yield'}</text>
      </svg></div>
      <Tip tip={tip} />
      <p className="small mt-2">Line: the middle run, red below 100 ppm. Dark band: the middle half of runs. Light band: 8 in 10 runs. Band edges are not single runs. Start: the area-weighted 2016-18 average, 129.8 ppm.</p>
      <Source>Author&rsquo;s model, 20,000 runs with every uncertain input varied; loss rate set to SFRI Punjab 2003-09.</Source>
    </div>
  )
}

/* ————— the balance: what 5 crops take out, what goes back ————— */
function BalanceLines() {
  const fit = useFitWidth(760)
  const { tip, show, hide } = useTip()
  const W = fit.W, H = Math.round(W * (fit.narrow ? 0.9 : 0.5)), L = 44, R = fit.narrow ? 48 : 150, T = 16, B = 34
  const x = (yr: number) => L + (yr - 1972) / 52 * (W - L - R)
  const y = (v: number) => T + (1 - v / 1000) * (H - T - B)
  const line = (k: 1 | 2 | 3) => SP_BALANCE.map((r, i) => `${i ? 'L' : 'M'}${x(r[0])} ${y(r[k])}`).join(' ')
  const last = SP_BALANCE[SP_BALANCE.length - 1]
  const yrLab = (yr: number) => `${yr - 1}-${String(yr).slice(2)}`
  return (
    <div className="chart panel p-5">
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>Crops took {last[1].toLocaleString('en-US')} thousand tonnes in 2023-24; fertilizer put back {last[2]}</h4><span className="cap">thousand tonnes of K₂O a year</span></div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 10 }} role="img" aria-label="Potash taken out by 5 crops and put back, Punjab, 1971-72 to 2023-24">
        {[0, 200, 400, 600, 800, 1000].map(g => <g key={g}><line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke={RULE} strokeDasharray="2 3" /><text x={L - 8} y={y(g) + 4} textAnchor="end" fontSize={12} fill={MUTED}>{g}</text></g>)}
        {(fit.narrow ? [1980, 2000, 2020] : [1980, 1990, 2000, 2010, 2020]).map(t => <text key={t} x={x(t)} y={H - 10} textAnchor="middle" fontSize={12} fill={MUTED}>{t}</text>)}
        <path d={line(3)} fill="none" stroke={MUTED} strokeWidth={1.6} strokeDasharray="5 4" />
        <path d={line(1)} fill="none" stroke={NAVY} strokeWidth={3} />
        <path d={line(2)} fill="none" stroke={RED} strokeWidth={3} />
        {SP_BALANCE.map(r => <rect key={r[0]} x={x(r[0]) - 4} y={T} width={8} height={H - T - B} fill="transparent" onMouseMove={e => show(e, `<b>${yrLab(r[0])}</b><br/>Taken out ${r[1]}<br/>Put back, all ${r[3]}<br/>Fertilizer ${r[2]}`)} onMouseLeave={hide} />)}
        <text x={W - R + 6} y={y(last[1]) + 4} fontSize={13} fontWeight={700} fill={NAVY}>{fit.narrow ? last[1] : `Taken out ${last[1]}`}</text>
        <text x={W - R + 6} y={y(last[3]) + 4} fontSize={12} fill={MUTED}>{fit.narrow ? last[3] : `Put back, all ${last[3]}`}</text>
        <text x={W - R + 6} y={y(last[2]) - 2} fontSize={13} fontWeight={700} fill={RED}>{fit.narrow ? last[2] : `Fertilizer ${last[2]}`}</text>
      </svg></div>
      <Tip tip={tip} />
      <p className="small mt-2">Navy: potash taken out by wheat, rice, sugarcane, maize and cotton. Dashed: all potash put back (fertilizer, manure and irrigation water). Red: fertilizer alone.</p>
      <Source>Author&rsquo;s balance model on Bureau of Statistics Punjab crop data and NFDC fertilizer data.</Source>
    </div>
  )
}

function T({ head, rows, min }: { head: string[]; rows: (string | number)[][]; min?: number }) {
  return (
    <div className="panel overflow-x-auto tbl-scroll my-4"><table className="tbl" style={min ? { minWidth: min } : undefined}>
      <thead><tr>{head.map(h => <th key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
    </table></div>
  )
}
function S({ id, n, kicker, title, children, bg }: { id: string; n?: string; kicker: string; title: string; children: ReactNode; bg?: boolean }) {
  return (
    <section className="sec" id={id} style={bg ? { background: 'var(--sand-2)' } : undefined}><div className="wrap">
      <div className="mb-6"><span className="eyebrow soil">{n && <span className="k-num">{n}</span>}{kicker}</span><h2 className="max-w-[26ch]">{title}</h2></div>
      <div className="max-w-[118ch] sp-body">{children}</div>
    </div></section>
  )
}
const P = ({ children }: { children: ReactNode }) => <p className="mt-3">{children}</p>
const Lead = ({ b, children }: { b: string; children: ReactNode }) => <p className="mt-3"><b>{b}</b> {children}</p>

const INDEX: [string, string][] = [['sp-1', '1 Where Punjab stands'], ['sp-2', '2 Taken out, put back'], ['sp-3', '3 The projection'], ['sp-4', '4 How hard to undo'], ['sp-5', '5 Why it matters'], ['sp-6', '6 Two checks'], ['sp-int', 'International cross-check'], ['sp-7', '7 The message'], ['sp-8', '8 Method and limits'], ['sp-src', 'Sources']]

const REFS: [string, string][] = [
  ['Punjab soil testing record, 770,160 samples, 2016-18, validated and mapped by VAN: Soil Atlas', '/soil.html'],
  ['Bureau of Statistics Punjab, Punjab Development Statistics for 50 Years, 1972-2021, Tables 1.4 and 1.18', 'https://opendata.com.pk/dataset/a58e7a47-1675-4c63-9b72-fc6377d36317/resource/1da797f5-ed34-4c24-ad9e-c7bf885138d1/download/50-years.pdf'],
  ['Bureau of Statistics Punjab, Punjab Agriculture Statistics 2024', 'https://bos.punjab.gov.pk/system/files/PAS%202024.pdf'],
  ['Bureau of Statistics Punjab, Punjab Agriculture Statistics 2023', 'https://bos.punjab.gov.pk/system/files/PAS%202023%20%28finsl%20pdf%29.pdf'],
  ['NFDC Fertilizer Review 2024-25, Table 4', 'https://mnfsr.gov.pk/SiteImage/Publication/AFR2024-25.pdf'],
  ['NFDC Fertilizer Review 2020-21, Table 4', 'https://mnfsr.gov.pk/SiteImage/Publication/FertilizerReview2020-21.pdf'],
  ['Ali, Ahmed, Channa and Davies 2016, IFPRI Discussion Paper 01516 (Figure 6.2, from SFRI 2013, Nutrient Depletion over Time)', 'https://hdl.handle.net/10568/148094'],
  ['SFRI Punjab, salient achievements', 'https://sfri.punjab.gov.pk/node/19'],
  ['Ranjha, Mehdi and Qureshi 1992, Potassium behaviour in some alluvial soil series of Pakistan, Journal of Agricultural Research 30(1)', 'https://agris.fao.org/search/en/records/6471fa382a40512c710f271a'],
  ['ICAR-IISS, soil fertility ratings', 'https://iiss.icar.gov.in/eMagazine/v4i1/12.pdf'],
  ['TNAU Agritech, soil test ratings', 'https://agritech.tnau.ac.in/agriculture/agri_soil_rating.html'],
  ['Ohio State University, Corn Newsletter 2022, managing P and K', 'https://agcrops.osu.edu/newsletter/corn-newsletter/2022-03/considerations-managing-p-k-2022'],
  ['Akram et al. 2014, quoting Ahmad and Khan 2006', 'https://www.hrpub.org/download/20141001/UJAR3-10402730.pdf'],
  ['FAO 2006, Plant nutrition for food security (NFDC authors)', 'https://www.fao.org/4/ag120e/AG120E11.htm'],
  ['Imran et al. 2010, quoting Bajwa', 'https://asianpubs.org/index.php/ajchem/article/download/16830/16783'],
  ['Mehdi et al. 2001, quoting Bhatti 1978', 'https://scialert.net/fulltext/?doi=jbs.2001.429.431'],
  ['Purdue University 2008, P and K fertilizer', 'https://www.agry.purdue.edu/ext/corn/news/articles.08/pkfert-0915.html'],
  ['Das et al. 2022, Agronomy for Sustainable Development', 'https://link.springer.com/article/10.1007/s13593-021-00728-6'],
  ['Wakeel and Ishfaq 2022, Potash Research in Pakistan', 'https://www.researchgate.net/publication/356689684_Potash_Research_in_Pakistan'],
  ['Abbas et al. 2013, Pakistan Journal of Botany 45(3)', 'https://www.pakbs.org/pjbot/PDFs/45(3)/32.pdf'],
  ['Pathak, Fagodiya and Singh 2024, Scientific Reports 14:29136', 'https://www.nature.com/articles/s41598-024-77134-x'],
  ['FAOSTAT via Our World in Data, potash use per hectare of cropland', 'https://ourworldindata.org/grapher/potash-fertilizer-application-per-hectare-of-cropland'],
  ['World Bank WDI AG.CON.FERT.ZS via Our World in Data', 'https://ourworldindata.org/grapher/fertilizer-use-in-kg-per-hectare-of-arable-land'],
  ['FAO, Fertilizer use by crop in Pakistan, chapter 5', 'https://www.fao.org/4/y5460e/y5460e09.htm'],
  ['FAO Fertilizer and Plant Nutrition Bulletin 16', 'https://www.fao.org/4/a0443e/a0443e04.pdf'],
  ['Mississippi State University P3968, crop nutrient removal', 'https://extension.msstate.edu/sites/default/files/publications/P3968_web.pdf'],
  ['PARC 2022, straw management in Pakistan', 'https://un-csam.org/sites/default/files/2022-10/Pakistan_Presentation%20on%2015%20Sep.%202022%20Final_REV2.pdf'],
  ['Ahmed et al. 2019, residue burning in Punjab', 'https://www.aerc.edu.pk/wp-content/uploads/2019/12/Paper-845-TANVIR-AHMED-V-1.pdf'],
  ['Obaid ur Rehman et al. 2021, Gujar Khan', 'https://v3.pjsir.org/index.php/physical-sciences/article/download/417/274'],
  ['Qureshi et al. 2001, Gujar Khan', 'https://agris.fao.org/search/en/records/647239f753aa8c896302e04c'],
  ['Fayyaz et al. 2025, Scientific Reports', 'https://www.nature.com/articles/s41598-025-88088-z'],
  ['Iqbal et al. 2021, Khanewal groundwater, Water 13(24)', 'https://www.mdpi.com/2073-4441/13/24/3589'],
  ['Zakir-Hassan et al. 2026, Vehari groundwater, Geosciences 16(1)', 'https://www.mdpi.com/2076-3263/16/1/43'],
]

export default function SoilPoverty() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(180deg, var(--rust-soft), var(--sand))' }}>
        <div className="wrap py-8 lg:py-12">
          <span className="eyebrow rust">Soil Poverty Series · No. 1</span>
          <h1 className="max-w-[22ch]">Soil Poverty: Punjab&rsquo;s Potash</h1>
          <p className="lead mt-3">As potash runs short, urea and DAP buy less yield.</p>
          <p className="mt-4 max-w-[118ch]"><b>If nothing changes, most of our model runs put Punjab&rsquo;s average soil potash below 100 ppm between 2027 and 2044, with the middle around 2036.</b> The date depends mainly on how strongly the soil&rsquo;s mineral reserve slows the loss; other published methods give dates from the early 2020s to about 2060. In 2016-18 it stood at 132 ppm.</p>
          <p className="cap mt-4"><b>Tahir Abbas</b> · October 2026. Tahir Abbas is the co-founder of Vital Green and serves as COO of Vital Agri Nutrients, a specialty crop nutrients research company.</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <a className="btn btn-navy" href={SP_PDF} target="_blank" rel="noopener">Download the full report (PDF)</a>
            <a className="btn btn-ghost" href={`mailto:${SP_EMAIL}?subject=Soil%20Poverty%20model%20request`}>Request the model: {SP_EMAIL}</a>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">{INDEX.map(([id, l]) => <a key={id} className="chip chip-xs" href={`#${id}`}>{l}</a>)}</div>
          <p className="cap mt-4"><a href="#/knowledge">← All knowledge</a> · <a href="#/soil">The Soil Atlas this report reads</a></p>
        </div>
      </section>

      <section className="sec-tight"><div className="wrap">
        <div className="panel p-5 lg:p-6 max-w-[118ch]">
          <span className="eyebrow navy">Key findings</span>
          <ul className="mt-2 sp-list">
            <li>Punjab crops now take about 940,000 tonnes of potash (K₂O) out of the soil every year. Farmers put back about 36,000 tonnes as fertilizer (2023-24), under 4%.</li>
            <li>After manure and irrigation water are counted, the soil is still short about 616,000 tonnes a year. That is 1.88 times the shortfall of 2003-09, the last years for which we found a published measured rate of potash loss in Punjab.</li>
            <li>On the middle of our runs, about a third of Punjab&rsquo;s soil samples (34%; 28% to 51% across 8 in 10 runs) may now be below 100 ppm, against 18% measured in 2016-18. No test since 2016-18 confirms it.</li>
            <li>Raising potash use 12 times by 2034-35 delays the crossing by only about 2 years, because the soil still pays for the other half of the shortfall.</li>
          </ul>
          <p className="small muted mt-3">These numbers come from a potash balance model built on Punjab and federal statistics. It is set to the only province-wide measured rate of potash loss in Punjab we found, and checked against 3 other methods (Section 3). It is a projection, not a measurement. Section 8 sets out what the model can and cannot tell.</p>
        </div>
      </div></section>

      <S id="sp-1" n="1" kicker="Where Punjab stands" title="132 ppm in 2016-18, and 9 in 10 samples below the 180 ppm mark">
        <P>Punjab tested 770,160 soil samples in 2016-18, in all 36 districts. VAN validated, normalised and mapped them. They are soil testing records, not a designed random survey, and one field may have more than one sample.</P>
        <P>The average available potash was 132 ppm. Here ppm means mg of potassium (K) per kg of soil, extracted with ammonium acetate, as Punjab soil labs report it.</P>
        <P>About 88% of samples were below 180 ppm, the level Punjab labs treat as adequate. Labs grade below 80 ppm as poor and 80 to 180 ppm as satisfactory. This report uses 100 ppm as a warning line inside the satisfactory band, not as an official class, and gives the share below 80 ppm too. 18% of samples were already below 100 ppm, and 8% below 80 ppm. 656 of 4,911 grid squares (about 5 km by 5 km each) averaged below 100 ppm.</P>
        <T head={['District', 'Median potash, 2016-18 (ppm)', 'Samples']} rows={[['Mianwali', 81, '14,037'], ['Layyah', 84, '14,757'], ['Bhakkar', 90, '23,220'], ['Mandi Bahauddin', 92, '20,392'], ['Attock', 100, '12,002'], ['Sahiwal (highest)', 184, '25,164']]} />
        <P>The low districts are mostly in the sandy Thal (Mianwali, Layyah, Bhakkar). Mandi Bahauddin is not in the Thal. Section 6 shows that much of the difference between districts comes from how the soil was formed, not only from cropping.</P>
        <P>Weighted by each district&rsquo;s cultivated area, the 2016-18 average is 129.8 ppm instead of 132.3, because some low-potash districts are large. The fixed cases A to C start from 132.3 ppm; the 20,000 model runs start from 129.8 ppm.</P>
        <Lead b="Why 100 ppm.">In a study of 8 alluvial soil series of Pakistan, wheat responded to added potash wherever clay was up to 20% and the same test read up to 120 mg per kg (Ranjha, Mehdi and Qureshi 1992). A 100 ppm line is therefore a cautious warning line, set below the level where wheat still responded. On VAN&rsquo;s soil scale, 100 ppm is where soil moves from Average to Weak.</Lead>
        <Lead b="There is no single world standard.">Each country sets its own grades for the same test. India grades available potash below 110 to 120 kg per hectare as low and up to 280 as medium (ICAR-IISS; TNAU). Converted at about 2.24 kg per hectare per ppm for a 15 cm soil layer, that puts India&rsquo;s &ldquo;low&rdquo; at about 50 to 54 ppm and &ldquo;medium&rdquo; up to about 125 ppm. The US Tri-State system puts the critical level at 100 to 120 ppm, by soil type (Ohio State University).</Lead>
        <Lead b="What experts said, decade by decade.">No repeat survey exists, but the statements move one way:</Lead>
        <T min={640} head={['Period', 'What was said', 'Source']} rows={[
          ['Today', '30% of Punjab soils deficient in potash; losing 3 ppm a year', 'SFRI Punjab website (undated)'],
          ['2006', '20 to 60% of soils short of potash', 'Ahmad and Khan 2006, IFA, as quoted by Akram et al. 2014'],
          ['2005', 'Potash deficiency "up to 40 percent" of soils', 'NFDC authors in FAO 2006'],
          ['About 1990', '50% of soils short of potash (date not certain)', 'Bajwa, as quoted by Imran et al. 2010'],
          ['1978', '"Most of the cultivated soils in Pakistan have sufficient supply of available potassium"', 'Bhatti 1978, ARC Islamabad, as quoted by Mehdi et al. 2001'],
        ]} />
        <p className="small muted">These statements use different methods and cannot be read as a measured trend. The older primary records (Punjab soil lab annual reports of the 1980s) exist only in print. SFRI&rsquo;s 30% does not state which cutoff it uses, so it cannot be set against our shares.</p>
      </S>

      <S id="sp-2" n="2" kicker="What crops take out and what goes back" title="The shortfall is 1.88 times its 2003-09 level" bg>
        <P>Between 1971-72 and 2023-24, the potash carried off Punjab&rsquo;s fields by 5 crops rose from about 203,000 to 940,000 tonnes a year. Wheat with its bhoosa is half of it; maize has risen fastest. On the NFDC figures we used, fertilizer has not put back more than 53,000 tonnes in any year.</P>
        <div className="my-5"><BalanceLines /></div>
        <P>Manure and irrigation water return more than fertilizer does: about 85,000 and 203,000 tonnes a year by our estimate (Section 8). Even with them counted, the soil was short about 328,000 tonnes a year in 2003-09, when SFRI measured the loss, and about 616,000 tonnes in 2023-24.</P>
      </S>

      <S id="sp-3" n="3" kicker="The projection to 2050" title="Most runs cross 100 ppm between 2027 and 2044; the middle is about 2036">
        <div className="my-5"><FanChart /></div>
        <T min={680} head={['Scenario', 'Punjab average now (2025-26)', 'Crosses 100 ppm', '2049-50']} rows={[
          ['Middle of 20,000 runs: no action', '116 ppm', '2035-36 (8 in 10 runs: 2026-27 to 2043-44)', '81 ppm'],
          ['B. No action, fast case: crops keep growing, potash use stays where it is, loss keeps a steady percentage pace', '109 ppm', '2028-29', '41 ppm'],
          ['C. Action: potash use rises to 416,000 tonnes by 2034-35', '109 ppm', '2029-30', '63 ppm'],
          ['A. Loss stays at the 2003-09 pace, whatever crops do', '118 ppm', '2036-37', '83 ppm'],
        ]} />
        <P>Share of soil samples below 100 ppm, by our estimate (18% measured in 2016-18): on the middle of the 20,000 runs about 34% now and 52% in 2034-35; in the fast case B, 46% now and 82% in 2034-35. These are projections, not new tests.</P>
        <P>Case B keeps the loss at the same percentage pace SFRI measured in 2003-09, scaled to today&rsquo;s shortfall. It is the simplest case and one of the faster ones. Across the 3 fixed cases the crossing falls between 2028-29 and 2036-37. The 20,000 runs also let the soil&rsquo;s reserve slow the loss as potash falls, and they give the middle estimate in the headline.</P>
        <Lead b="How sure is the date?">We ran the model 20,000 times, each time drawing every uncertain input from its range: potash in canal water (1.3 to 5 mg per litre, most likely 3, since Pakistani river data sit above the world median) and in tube-well water (2 to 8, most likely 5); how much of that water potash stays in the root zone (canal 25% to 75%; tube-well 10% to 50%, because much of it is the fields&rsquo; own potash, leached and pumped back); fodder and other removals not counted (0 to 600,000 tonnes a year, rising 1% to 3% a year); groundwater pumping (rising 1% to 4% a year); bhoosa and straw potash; the SFRI rate (plus or minus 50%); how strongly the soil reserve slows the loss; and crop growth.</Lead>
        <Lead b="What the date depends on.">One input moves the date more than all the others together: how strongly the soil&rsquo;s mica reserve slows the loss as available potash falls. No Punjab measurement pins it down, so half the runs let the loss shrink in step with the level (middle 2031) and half let it shrink toward a floor of 60 to 80 ppm that the soil holds on to (middle 2038). The middle year of 2036 rests on giving the 2 forms equal weight. Next comes the exact SFRI rate. Water potash, fodder and crop growth hardly move the date, because each run is scaled to its own 2003-09 shortfall.</Lead>
        <T head={['How strongly the reserve slows the loss', 'Punjab average crosses 100 ppm (middle run)']} rows={[
          ['Not at all: the same ppm or more lost each year (unlikely on mica-rich soils)', 'about 2024'], ['Weakly', 'about 2026'], ['Moderately, up to the steady percentage pace of case B', 'about 2028'],
          ['Fairly strongly', 'about 2032'], ['Strongly', 'about 2037'], ['Very strongly', 'about 2045'], ['Toward a floor of 60 to 80 ppm', 'about 2038'],
        ]} />
        <P>The stronger the reserve, the later the date. Neither form we tested lets the soil settle above 100 ppm, and we did not test one that does. In only about 2 of every 100 runs does the Punjab average stay above 100 ppm to 2050.</P>
        <Lead b="Other methods.">Other published methods, applied to the same Punjab balance, give earlier and later dates:</Lead>
        <T min={720} head={['Method', 'Punjab average crosses 100 ppm', 'Note']} rows={[
          ['US soil-test drawdown factor (5.6 to 9 kg K₂O per hectare removes 1 ppm)', 'Already, about 2021 to 2024', 'Fastest, and an upper bound: it is set to reproduce SFRI’s measured 3.5 ppm a year at the 2003-09 shortfall, so it is not independent, and it lets no reserve slow the loss (Purdue University 2008)'],
          ['This report, 20,000 runs', 'Middle 2036; 8 in 10 runs between 2027 and 2044', 'Middle of the range'],
          ['SFRI 2003-09 rate held flat (case A)', '2036-37', 'Ignores today’s larger shortfall'],
          ['Indian long-term experiments on alluvial soils, no potash', 'About 2060, if their 0.61% a year applied from 129.8 ppm', 'Slowest. Applied as a flat rate: we did not have those plots’ potash balance, so we could not scale it to Punjab’s shortfall (Das et al. 2022)'],
        ]} />
        <P>The Indian result is the strongest reason the date could be later, and we show it openly. It also shows the loss continues: the soil runs down more slowly there, but it still runs down.</P>
      </S>

      <S id="sp-4" n="4" kicker="How hard it is to undo" title="Raising potash use 12 times delays the crossing by only about 2 years" bg>
        <P>In the action case, Punjab&rsquo;s potash use rises steadily from 34,000 tonnes (2024-25) to 416,000 tonnes a year by 2034-35, enough to cover half of that year&rsquo;s expected shortfall (about 830,000 tonnes). That is 12 times 2024-25 use.</P>
        <ul className="sp-list mt-3">
          <li>Even then, in case C the Punjab average still crosses 100 ppm in 2029-30, only 1 year later than with no action. Across the 20,000 runs the delay is about 2 years (0 to 5 years in 8 of 10 runs).</li>
          <li>In case C it keeps falling after that, to about 63 ppm by 2049-50 (22 ppm above case B&rsquo;s 41 ppm), because the other half of the shortfall is still taken from the soil.</li>
          <li>Covering the whole shortfall would need about 616,000 tonnes of potash a year, about 17 times Punjab&rsquo;s use in 2023-24 (36,000 tonnes): about 20.5 million 50 kg bags of MOP (60% K₂O), or 24.6 million of SOP (50% K₂O).</li>
        </ul>
        <P>Punjab&rsquo;s alluvial soils are rich in mica and illite, which hold potash between their layers. Cropping without putting potash back draws this reserve down; this is why the soil test falls more slowly than the balance alone would suggest. The same weathered illite and vermiculite clays can also lock up part of any potash later put on, for a time (Wakeel and Ishfaq 2022).</P>
      </S>

      <S id="sp-5" n="5" kicker="Why it matters" title="On a sandy, low-potash field in Mianwali, potash added 25% to wheat yield">
        <P>Potash does not work alone, and neither do urea and DAP. In a 2-year wheat trial at the Adaptive Research Station, Mianwali, in the sandy, low-potash Thal, 93 kg of K₂O per hectare raised grain yield 25%, from 3,625 to 4,533 kg per hectare (Abbas et al. 2013, Pakistan Journal of Botany). One study on soil badly short of potash, quoted by IFPRI, shows why: adding potash raised the share of applied fertilizer the crop took up.</P>
        <T head={['Nutrient', 'Taken up by the crop with N and P only (or N and K for potash)', 'Taken up with N, P and K together']} rows={[['Nitrogen', '16%', '76%'], ['Phosphorus', '1%', '13%'], ['Potash', '22%', '61%']]} />
        <p className="small muted">Source: Haerdter and Fairhurst (2003), as quoted in Ali et al. 2016, IFPRI Discussion Paper 01516. It is a single study, most likely on rice outside Pakistan, and we have not found the original. Its figures show what happens on soil badly short of potash; they are an illustration, not a Punjab average.</p>
        <P>Pakistan&rsquo;s own numbers point the same way, though potash is likely one of several causes:</P>
        <ul className="sp-list mt-3">
          <li>Producing 100 kg of wheat took 4 kg of fertilizer nutrient in 1980-81 and 7.9 kg by 2014 (IFPRI 2016).</li>
          <li>For every kg of nitrogen, Pakistan used 0.036 kg of potash in 1985-86 and 0.007 kg in 2013-14 (IFPRI 2016).</li>
        </ul>
        <P>A farmer short of potash pays for urea and DAP that his crop cannot fully use.</P>
      </S>

      <S id="sp-6" n="6" kicker="Two statistical checks" title="Where land was measured twice, potash fell 1.5% to 2.3% a year" bg>
        <P>We also tried 2 statistical approaches. One is consistent with the model; the other cannot test it.</P>
        <Lead b="Check 1. The same ground, measured twice.">This is consistent with the model.</Lead>
        <T min={600} head={['Place', 'First reading', 'Second reading', 'Fall a year']} rows={[['SFRI monitoring sites, Punjab', '251 ppm (2003)', '230 ppm (2009)', '3.5 ppm, about 1.5%'], ['Gujar Khan tehsil, Rawalpindi', 'about 144 ppm (about 2000)', '103 ppm (2012-17)', 'about 2.8 ppm, about 2.3%']]} />
        <P>The balance model gives about 1.5% a year at the 2003-09 shortfall and about 2.8% at today&rsquo;s. Gujar Khan is rainfed, and its first reading is our estimate from the class shares reported in the paper, so it is a weak check.</P>
        <Lead b="Check 2. Comparing districts is not a check.">It cannot detect depletion, and we say so openly. We compared the 769,578 cleaned samples district by district, after allowing for soil texture, organic matter and pH. If cropping alone drained potash, the most heavily cropped districts would hold the least. They do not: districts that take more potash out per hectare hold slightly more (about +0.18 ppm for each extra kg per hectare; not statistically firm). Sahiwal, Multan and Rahim Yar Khan are high; Mianwali, Bhakkar and Mandi Bahauddin are low.</Lead>
        <P>The reason is how each soil was formed: parent material, river silt and groundwater set each district&rsquo;s starting level. A single snapshot cannot separate that from 50 years of cropping. So the rate of loss in this report comes only from places measured over time, not from district differences. It also means the districts already below 100 ppm are low partly by nature.</P>
      </S>

      <S id="sp-int" kicker="International cross-check" title="FAO, the World Bank and a peer-reviewed budget show the same deficit">
        <P>The numbers above come from Pakistani government statistics. Three international sources, built separately, point the same way.</P>
        <Lead b="1. A peer-reviewed potash budget for Pakistan, 1970s to 2010s.">Pathak, Fagodiya and Singh 2024, Scientific Reports 14:29136, Table 5, built from FAOSTAT and national data. Million tonnes of potassium (K) a year, average for each decade:</Lead>
        <T head={['Decade', 'Taken out by crops', 'Fertilizer', 'Balance']} rows={[['1970s', '0.58', '0.00', '-0.37'], ['1980s', '0.77', '0.03', '-0.53'], ['1990s', '0.98', '0.02', '-0.72'], ['2000s', '1.19', '0.03', '-0.89'], ['2010s', '1.42', '0.03', '-1.09']]} />
        <P>Pakistan&rsquo;s deficit has deepened every decade. The paper puts Pakistan at 10% to 19% of South Asia&rsquo;s potash deficit, second after India.</P>
        <Lead b="2. FAO fertilizer data.">In 2023 Pakistan used 1.48 kg of potash (K₂O) per hectare of cropland, against 23.1 kg for the world, 11.2 for India, 63.0 for Bangladesh and 69.1 for China. It used 122.9 kg of nitrogen per hectare, 83 times its potash (FAOSTAT via Our World in Data).</Lead>
        <Lead b="3. World Bank.">Pakistan&rsquo;s total fertilizer use was 160 kg per hectare of arable land in 2023, above the world&rsquo;s 138 (World Development Indicators, AG.CON.FERT.ZS, via Our World in Data). Pakistan does not use too little fertilizer; it uses too little potash.</Lead>
        <Lead b="How our Punjab model compares.">In the 2010s our model puts Punjab&rsquo;s 5-crop potash removal at about 724,000 tonnes of K₂O a year and its net shortfall at about 412,000 tonnes. The peer-reviewed budget puts all of Pakistan at 1.71 million and 1.31 million tonnes of K₂O. Punjab grows most of Pakistan&rsquo;s crops, so our Punjab figure is the more cautious of the two: it counts only 5 crops and gives more credit to water and manure. The gap is mostly scope: the peer-reviewed budget covers every crop in all of Pakistan, and it has about 23% of crop removal coming back, against about 43% in ours.</Lead>
      </S>

      <S id="sp-7" n="7" kicker="The message" title="Count potash, or keep paying for urea and DAP the crop cannot use" bg>
        <Lead b="To the farmer.">Get your soil tested before the next sowing. If your soil test shows potash below 100 ppm, especially on sandy land, part of your urea and DAP money may be wasted until potash is added. Put potash on a strip of the field and compare.</Lead>
        <Lead b="To the government.">The last published measurement of Punjab&rsquo;s soil potash over time that we could find is from 2003-09. Bring back fixed monitoring sites, re-test them every 2 to 3 years, and publish the results. Fertilizer policy should count potash next to nitrogen and phosphate, not after them.</Lead>
        <Lead b="To the industry.">Closing Punjab&rsquo;s potash shortfall would take about 17 times what it bought in 2023-24. Pakistan has no commercial potash mine, so a gap that size needs import supply, potash recovered at home and products farmers can afford to use.</Lead>
        <P>Punjab&rsquo;s soil still holds potash. But the part crops can use is being spent faster than it is being repaid. On present trends the Punjab average is likely to reach the 100 ppm warning line between 2027 and 2044, middle about 2036, while the sandy districts are below it already.</P>
      </S>

      <S id="sp-8" n="8" kicker="Method, limits and sources" title="How the model works and what it cannot tell">
        <p className="mt-3"><b>The model in 4 steps.</b></p>
        <ol className="sp-list sp-ol mt-2">
          <li>Crop output: Punjab production of wheat, rice, sugarcane, maize and cotton, every year from 1971-72 to 2023-24.</li>
          <li>Potash taken out: each tonne harvested carries a known amount of potash; we used figures at the low end of published ranges, and the 20,000 runs widen them (bhoosa 10 to 25 kg K₂O per tonne of grain; rice straw 15 to 25 per tonne of paddy, 10% to 50% of it removed). Bhoosa and maize stover are counted as leaving the field (fed to animals); rice straw and cane trash are mostly burnt in the field, so their potash stays; half of cotton sticks leave as firewood.</li>
          <li>Potash put back: fertilizer (by year), farmyard manure (FAO: a quarter of it reaches fields) and canal and tube-well water.</li>
          <li>Speed of loss: the only province-wide measured Punjab rate we found, 3.52 ppm a year on SFRI sites in 2003-09 (about 1.5% of the level a year), raised or lowered each year in step with that year&rsquo;s shortfall. Cases A to C start from the 2016-18 average of 132.3 ppm; the 20,000 runs start from the area-weighted 129.8 ppm and add 2 forms of soil buffering (Section 3).</li>
        </ol>
        <p className="mt-3"><b>The model workbook is available from the author on request:</b> <a href={`mailto:${SP_EMAIL}?subject=Soil%20Poverty%20model%20request`}>{SP_EMAIL}</a>. Every input sits on one sheet with its source; the judgement calls are marked and can be changed.</p>
        <p className="mt-4"><b>What the model cannot tell.</b></p>
        <ul className="sp-list mt-2">
          <li>We found only 1 province-wide measured rate of loss for Punjab, from 2003-09. The US drawdown method reproduces it, but Indian long-term experiments show a much slower loss. Scaling it to today&rsquo;s larger shortfall assumes the soil responds in step; the 20,000 runs test this. Mica releases potash as soils get poorer, so the fastest case may overstate the fall.</li>
          <li>The SFRI monitoring sites averaged about 240 ppm, nearly twice the Punjab average. How far their rate applies to poorer soils is assumed, not measured. We took the SFRI figures from IFPRI 2016.</li>
          <li>How strongly the soil reserve slows the loss is an assumed range, not a measured one. Half the runs use a form in which the loss shrinks with the level, half a form with a floor of 60 to 80 ppm. Weighting the 2 forms differently moves the middle year between 2031 and 2038.</li>
          <li>Irrigation water is the largest and least certain return. No measured potash figure exists for Punjab canals; the fixed cases use the world river median (1.3 mg per litre) and half the potash in tube-well water; the 20,000 runs use 1.3 to 5 mg per litre for canals and 2 to 8 for tube-wells. Much tube-well potash is the fields&rsquo; own potash, leached and pumped back up, so only part of it is a true return; the runs count 10% to 50% of it. Higher water potash moves case B&rsquo;s crossing earlier, to 2025-2028, not later: the model is set to the 2003-09 rate, so more water potash makes today&rsquo;s shortfall larger compared with 2003-09.</li>
          <li>Fodder (berseem, sorghum, maize fodder), potato, pulses, oilseeds and vegetables are not counted, and neither are leaching from sandy Thal soils or erosion on rainfed land. The real shortfall is larger. Potato and vegetables receive much of the potash applied, which sits in the fertilizer figure while their removal does not.</li>
          <li>Manure and water returns are held at today&rsquo;s levels through history, so the shortfall in early years is understated.</li>
          <li>The share of samples below 100 ppm is estimated by lowering every 2016-18 sample in step with the Punjab average. It is not a new measurement.</li>
          <li>Every year after 2023-24 is a projection of present trends, not a forecast of what will happen.</li>
        </ul>
        <Lead b="Data notes.">The Punjab 50-year statistics book prints wheat for 2017-18 as 16,210 thousand tonnes; Punjab Agriculture Statistics 2024 prints 19,179, which we used. For potash use in 2017-18 the book prints 64,800 tonnes and NFDC 37,000; we used NFDC from 2016-17. The Sheikhupura soil workbook has its values shifted 1 column against its headings; we corrected it.</Lead>
      </S>

      <section className="sec" id="sp-src" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <div className="mb-5"><span className="eyebrow soil">Sources</span><h2 className="max-w-[26ch]">Every figure, where it came from</h2></div>
        <ol className="sp-refs small">
          {REFS.map(([l, u]) => <li key={l}>{l}. <a href={u} target={u.startsWith('http') ? '_blank' : undefined} rel="noopener">{u.startsWith('http') ? u.replace(/^https?:\/\//, '').split('/')[0] : 'van.com.pk/soil'}</a></li>)}
        </ol>
        <div className="flex flex-wrap gap-3 mt-6">
          <a className="btn btn-navy" href={SP_PDF} target="_blank" rel="noopener">Download the full report (PDF)</a>
          <a className="btn btn-ghost" href="#/soil">Open the Soil Atlas →</a>
        </div>
        <p className="cap mt-4">Tahir Abbas · Soil Poverty Series No. 1 · Model available on request: <a href={`mailto:${SP_EMAIL}`}>{SP_EMAIL}</a></p>
      </div></section>
    </div>
  )
}
