import type { ReactNode } from 'react'
import { SP_FAN, SP_BALANCE, SP_PDF, SP_EMAIL } from '@/data/soilPoverty'
import { useFitWidth } from '@/hooks/useFitWidth'
import { useTip } from '@/hooks/useInView'
import { Source, Tip } from '@/components/Charts'
import { noStop } from '@/components/bits'   // Tahir 7 Nov 2026 (CR-23): no full stop at the end of a heading

/**
 * SOIL POVERTY SERIES No. 1, "Soil Poverty: Punjab's Potash" by Tahir Abbas. D-245, 1 Oct 2026.
 * Tahir's rulings: its own page, linked from both Knowledge and the Soil Atlas; the full report as a
 * web page plus the PDF; byline Tahir Abbas personally with his author line; model on request only,
 * by email; headline leads with the date range; the Engro field claim stays out; the soil record is
 * not cited as Government of Punjab data in this report. Text is the report's final version (Word
 * file of 1 Oct 2026, Newspaper Submission folder). Change wording only at Tahir's word.
 * D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction
 * (numbers as digits, 2 "we say so openly" clauses, 1 cut-off chart title). The PDF is unchanged.
 * Tahir 7 Nov 2026 (RP-PO-4): proceed with the draft review; his 5 Nov instruction to correct the whole site covers this page.
 * Applied that day: RP-PO-1, 2, 3, 6, 7, 10 (bands; shares per band still to come from the data), 11, 12, 13 ("net potassium removal"
 * replaces "net potassium deficit" and its short form "deficit"; the Pathak budget keeps its own word). The PDF is not changed here.
 * L1 editor round, 7 Nov 2026 (fixes-reports): language fixes only, outside the lead, title, headings and case labels (Tahir's):
 * M6 ("how strongly the release of potassium ... slows", Section 4 and Conclusion); m1 (DAP double brackets, K₂O, VAN, FAO written
 * out); m3 (digits for "double", "twice"); m5 (soil "potassium", not "potash", in the statements table; quotes kept); m8; m9 and
 * m10 (the 100 ppm paragraph); m11; m13 ("Covering"); m14; m15; m16. Tahir's RP-PO wordings are unchanged. The PDF is not changed.
 * L2 fact check corrections, 9 Nov 2026: W1 (case A is about 1.5% a year), W2 (methods table note), W4 (red line sources), W5 and W6
 * (qualifications restored), W7 ("about 2016 to 2018"); RP-PO-9 applied: the run count is not stated, the method says "many model runs
 * with every uncertain input varied" once and the rest say "the model runs". W3 (lead other-methods sentence) left for Tahir.
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
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>Projected average available soil potassium in Punjab if potash fertiliser use does not rise (modelled): in the average case it falls from 129.8 ppm in about 2016 to 2018 to about 81 ppm in 2049-50, passing below 100 ppm in {lab(cross[0])}</h4><span className="cap">ppm, modelled</span></div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 10 }} role="img" aria-label="Projected average available soil potassium in Punjab if potash fertiliser use does not rise (modelled): in the average case it falls from 129.8 ppm in about 2016 to 2018 to about 81 ppm in 2049-50, passing below 100 ppm in 2035-36">
        <rect x={L} y={y(100)} width={W - L - R} height={y(0) - y(100)} fill={RED} opacity={0.06} />
        {[0, 40, 80, 100, 120, 140].map(g => <g key={g}><line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke={RULE} strokeDasharray="2 3" /><text x={L - 8} y={y(g) + 4} textAnchor="end" fontSize={12} fill={MUTED}>{g}</text></g>)}
        {(fit.narrow ? [2020, 2030, 2040, 2050] : [2020, 2025, 2030, 2035, 2040, 2045, 2050]).map(t => <text key={t} x={x(t)} y={H - 10} textAnchor="middle" fontSize={12} fill={MUTED}>{t}</text>)}
        <path d={band(1, 5)} fill={NAVY} opacity={0.13} />
        <path d={band(2, 4)} fill={NAVY} opacity={0.25} />
        <line x1={L} x2={W - R} y1={y(100)} y2={y(100)} stroke={RED} strokeWidth={1.5} strokeDasharray="6 4" />
        <text x={W - R + 6} y={y(100) + 4} fontSize={13} fontWeight={700} fill={RED}>100 ppm</text>
        {SP_FAN.slice(1).map((r, i) => <line key={r[0]} x1={x(SP_FAN[i][0])} y1={y(SP_FAN[i][3])} x2={x(r[0])} y2={y(r[3])} stroke={r[3] >= 100 ? NAVY : RED} strokeWidth={3.5} strokeLinecap="round" />)}
        {SP_FAN.map(r => <circle key={r[0]} cx={x(r[0])} cy={y(r[3])} r={7} fill="transparent" onMouseMove={e => show(e, `<b>${lab(r[0])}</b><br/>Average case ${r[3]} ppm<br/>Worst case ${r[1]}, best case ${r[5]}`)} onMouseLeave={hide} />)}
        <circle cx={x(cross[0])} cy={y(cross[3])} r={6} fill="none" stroke={RED} strokeWidth={2} />
        <text x={x(cross[0]) + 10} y={y(cross[3]) - 10} fontSize={13} fontWeight={700} fill={RED}>{lab(cross[0])}</text>
        <text x={x(2018) + 4} y={y(SP_FAN[0][3]) - 8} fontSize={12} fill={NAVY}>{SP_FAN[0][3]}</text>
        <text x={W - R + 6} y={y(last[3]) + 4} fontSize={13} fontWeight={700} fill={RED}>{Math.round(last[3])}</text>
        <text x={L + 8} y={y(0) - 10} fontSize={13} fontWeight={700} fill={RED}>{fit.narrow ? 'Below 100 ppm' : 'Below the 100 ppm warning line'}</text>
      </svg></div>
      <Tip tip={tip} />
      <p className="small mt-2">Line: the average case, red where it is below 100 ppm. Light band: from the worst case to the best case. Dark band: the middle 50% of runs. The band edges are percentiles of the runs in each year, not single runs. The figure at the right end of the line is the average case for 2049-50. Starting point: the 2016 to 2018 average weighted by cultivated area, 129.8 ppm, from measured samples. Each crop year is plotted at the calendar year in which it ends: 2036 on the axis is the crop year 2035-36.</p>
      <Source>This report&rsquo;s model runs; the yearly fall is set from the fall SFRI measured in Punjab in 2003 to 2009.</Source>
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
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>Potassium taken out of Punjab&rsquo;s soils by 5 crops and put back, 1971-72 to 2023-24: in 2023-24 the crops took out an estimated {last[1].toLocaleString('en-US')},000 tonnes of K₂O, and {last[2]},000 tonnes were put back as potash fertiliser</h4><span className="cap">thousand tonnes of K₂O a year</span></div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 10 }} role="img" aria-label="Potassium (as K₂O) taken out by 5 crops and put back, Punjab, 1971-72 to 2023-24">
        {[0, 200, 400, 600, 800, 1000].map(g => <g key={g}><line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke={RULE} strokeDasharray="2 3" /><text x={L - 8} y={y(g) + 4} textAnchor="end" fontSize={12} fill={MUTED}>{g}</text></g>)}
        {(fit.narrow ? [1980, 2000, 2020] : [1980, 1990, 2000, 2010, 2020]).map(t => <text key={t} x={x(t)} y={H - 10} textAnchor="middle" fontSize={12} fill={MUTED}>{t}</text>)}
        <path d={line(3)} fill="none" stroke={MUTED} strokeWidth={1.6} strokeDasharray="5 4" />
        <path d={line(1)} fill="none" stroke={NAVY} strokeWidth={3} />
        <path d={line(2)} fill="none" stroke={RED} strokeWidth={3} />
        {SP_BALANCE.map(r => <rect key={r[0]} x={x(r[0]) - 4} y={T} width={8} height={H - T - B} fill="transparent" onMouseMove={e => show(e, `<b>${yrLab(r[0])}</b><br/>Taken out ${r[1]}<br/>Total put back ${r[3]}<br/>Potash fertiliser ${r[2]}`)} onMouseLeave={hide} />)}
        <text x={W - R + 6} y={y(last[1]) + 4} fontSize={13} fontWeight={700} fill={NAVY}>{fit.narrow ? last[1] : `Taken out ${last[1]}`}</text>
        <text x={W - R + 6} y={y(last[3]) + 4} fontSize={12} fill={MUTED}>{fit.narrow ? last[3] : `Total put back ${last[3]}`}</text>
        <text x={W - R + 6} y={y(last[2]) - 2} fontSize={13} fontWeight={700} fill={RED}>{fit.narrow ? last[2] : `Fertiliser ${last[2]}`}</text>
      </svg></div>
      <Tip tip={tip} />
      <p className="small mt-2">Navy line: potassium (as K₂O) taken out by wheat, rice, sugarcane, maize and cotton, estimated by the model. Dashed line: all potassium put back in potash fertiliser, manure and irrigation water, estimated by the model. Red line: potash fertiliser alone (Punjab Development Statistics to 2015-16, NFDC from 2016-17).</p>
      {/* L2 fact check 9 Nov 2026 (W4): the red line runs from 1971-72; NFDC figures are used from 2016-17 only (data notes). Was 'Red line: potash fertiliser alone, as reported by NFDC.' and '... and NFDC fertiliser data.' */}
      <Source>This report&rsquo;s balance model, using Bureau of Statistics Punjab crop data, and fertiliser data from Punjab Development Statistics (to 2015-16) and NFDC (from 2016-17).</Source>
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
      <div className="mb-6"><span className="eyebrow soil">{n && <span className="k-num">{n}</span>}{kicker}</span><h2 className="max-w-[26ch]">{noStop(title)}</h2></div>
      <div className="max-w-[118ch] sp-body">{children}</div>
    </div></section>
  )
}
const P = ({ children }: { children: ReactNode }) => <p className="mt-3">{children}</p>
const Lead = ({ b, children }: { b: string; children: ReactNode }) => <p className="mt-3"><b>{b}</b> {children}</p>

const INDEX: [string, string][] = [['sp-1', '1 Measured soil potassium in Punjab, about 2016 to 2018'], ['sp-2', '2 Potassium taken out by crops and put back'], ['sp-int', '3 Comparison with international estimates'], ['sp-3', '4 Projected soil potassium to 2050'], ['sp-4', '5 Effect of more potash fertiliser'], ['sp-5', '6 Effect on yield and fertiliser use'], ['sp-7', '7 Recommendations for farmers, government and industry'], ['sp-concl', '8 Conclusion'], ['sp-8', '9 Method, checks and limitations'], ['sp-src', 'Sources']]

const REFS: [string, string][] = [
  ['Punjab soil testing record, 770,160 samples, about 2016 to 2018, validated and mapped by VAN: Soil Atlas', '/soil.html'],
  ['Bureau of Statistics Punjab, Punjab Development Statistics for 50 Years, 1972-2021, Tables 1.4 and 1.18', 'https://opendata.com.pk/dataset/a58e7a47-1675-4c63-9b72-fc6377d36317/resource/1da797f5-ed34-4c24-ad9e-c7bf885138d1/download/50-years.pdf'],
  ['Bureau of Statistics Punjab, Punjab Agriculture Statistics 2024', 'https://bos.punjab.gov.pk/system/files/PAS%202024.pdf'],
  ['Bureau of Statistics Punjab, Punjab Agriculture Statistics 2023', 'https://bos.punjab.gov.pk/system/files/PAS%202023%20%28finsl%20pdf%29.pdf'],
  ['NFDC Fertilizer Review 2024-25, Table 4', 'https://mnfsr.gov.pk/SiteImage/Publication/AFR2024-25.pdf'],
  ['NFDC Fertilizer Review 2020-21, Table 4', 'https://mnfsr.gov.pk/SiteImage/Publication/FertilizerReview2020-21.pdf'],
  ['Ali, Ahmed, Channa and Davies 2016, IFPRI Discussion Paper 01516 (Figure 6.2, from SFRI 2013, Nutrient Depletion over Time)', 'https://hdl.handle.net/10568/148094'],
  ['SFRI Punjab, salient achievements', 'https://sfri.punjab.gov.pk/node/19'],
  ['Ranjha, Mehdi and Qureshi 1992, Potassium behaviour in some alluvial soil series of Pakistan, Journal of Agricultural Research 30(1)', 'https://agris.fao.org/search/en/records/6471fa382a40512c710f271a'],
  // Tahir 7 Nov 2026 (RP-PO-7): ICAR-IISS soil fertility ratings, TNAU Agritech soil test ratings and Das et al. 2022 removed; nothing on the page cites them now.
  ['Ohio State University, Corn Newsletter 2022, managing P and K', 'https://agcrops.osu.edu/newsletter/corn-newsletter/2022-03/considerations-managing-p-k-2022'],
  ['Akram et al. 2014, quoting Ahmad and Khan 2006', 'https://www.hrpub.org/download/20141001/UJAR3-10402730.pdf'],
  ['FAO 2006, Plant nutrition for food security (NFDC authors)', 'https://www.fao.org/4/ag120e/AG120E11.htm'],
  ['Imran et al. 2010, quoting Bajwa', 'https://asianpubs.org/index.php/ajchem/article/download/16830/16783'],
  ['Mehdi et al. 2001, quoting Bhatti 1978', 'https://scialert.net/fulltext/?doi=jbs.2001.429.431'],
  ['Purdue University 2008, P and K fertilizer', 'https://www.agry.purdue.edu/ext/corn/news/articles.08/pkfert-0915.html'],
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
          {/* Tahir 9 Nov 2026: case A and the US method named; was "When this report applies other published methods to its potassium balance for Punjab, they put the year ... between the early 2020s and 2036-37 (Section 4)." */}
          <p className="mt-4 max-w-[118ch]"><b>If potash fertiliser use in Punjab does not rise, this report&rsquo;s model projects that Punjab&rsquo;s area-weighted average available soil potassium will fall below 100 ppm between the crop years 2026-27 and 2043-44. In the average case, it falls below 100 ppm in 2035-36.</b> In this report&rsquo;s projections, Punjab&rsquo;s average means the average available soil potassium of the soils tested in about 2016 to 2018, weighted by each district&rsquo;s cultivated area (129.8 ppm at the start). The 3 fixed cases in Section 4 start instead from the unweighted average of 132.3 ppm. The average case is the median of the model runs. The worst case (2026-27) and the best case (2043-44) are the 10th and 90th percentiles of the runs: in any year, 1 in 10 runs projects a lower level than the worst case, and 1 in 10 projects a higher level than the best case. Available soil potassium is the potassium (K) extracted from soil with ammonium acetate, in milligrams per kilogram of soil (ppm), as Punjab soil laboratories report it. 100 ppm is a warning line chosen for this report. It is not an official grade (Section 1). The years above are model projections, not measurements. The most recent province-wide soil testing records used in this report are from about 2016 to 2018, when the tested samples averaged 132 ppm. Falling available soil potassium matters because, where it is low, a crop can take up less of the nitrogen and phosphorus in urea and diammonium phosphate (DAP), as Section 6 shows. Holding SFRI&rsquo;s measured yearly fall constant (case A) puts the year at 2036-37, and a published US method, which is set to reproduce the same measurement, puts it at about 2021 to 2024 (Section 4). Years written as 2023-24 are crop years. The model works by crop year, so a model result given as a single year, such as 2031, is the crop year that ends in that year (2030-31). Spans of several years are written in full, as in 2003 to 2009. 2003 to 2009 means the SFRI readings of 2003 and 2009 and, for the potassium balance, the average of the crop years 2003-04 to 2008-09.</p>
          <p className="cap mt-4"><b>Tahir Abbas</b> · October 2026. Tahir Abbas is the co-founder of Vital Green and serves as COO of Vital Agri Nutrients, a specialty crop nutrients research company.</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <a className="btn btn-navy" href={SP_PDF} target="_blank" rel="noopener">Download the full report (PDF)</a>
            <a className="btn btn-ghost" href={`mailto:${SP_EMAIL}?subject=Soil%20Poverty%20model%20request`}>Request the model: {SP_EMAIL}</a>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">{INDEX.map(([id, l]) => <a key={id} className="chip chip-xs" href={`#${id}`}>{l}</a>)}</div>
          <p className="cap mt-4"><a href="#/knowledge">← All knowledge</a> · <a href="#/soil">The Soil Atlas used in this report</a></p>
        </div>
      </section>

      <section className="sec-tight"><div className="wrap">
        <div className="panel p-5 lg:p-6 max-w-[118ch]">
          <span className="eyebrow navy">Key findings</span>
          <ul className="mt-2 sp-list">
            <li>In 2023-24, 5 crops in Punjab (wheat, rice, sugarcane, maize and cotton) took an estimated 940,000 tonnes of potassium, expressed as potassium oxide (K₂O), out of the soil. About 36,000 tonnes of K₂O were put back as potash fertiliser, as reported by the National Fertilizer Development Centre (NFDC). The 36,000 tonnes are less than 4% of the estimated amount taken out. With manure and irrigation water also counted, an estimated 324,000 tonnes of K₂O were put back in all.</li>
            <li>In 2023-24, the estimated net potassium removal from Punjab&rsquo;s soils was about 616,000 tonnes of K₂O. Net potassium removal is the potassium taken out by the 5 crops minus all the potassium put back in potash fertiliser, manure and irrigation water. The 2023-24 net removal was 1.88 times (nearly 2 times) the estimated average yearly net removal of about 328,000 tonnes of K₂O in 2003 to 2009. That period is used for comparison because it is the most recent period, among those this report found, in which the fall in Punjab&rsquo;s available soil potassium was measured province-wide.</li>{/* L2 fact check 9 Nov 2026 (W6): "among those this report found" restored. */}
            <li>In about 2016 to 2018, 18% of the soil samples tested in Punjab were below 100 ppm. For 2025-26, the model estimates that about 34% of the soils represented by those samples were below 100 ppm in the average case. The estimated share is 51% in the worst case and 28% in the best case.</li>
            <li>The model tested an assumed rise in Punjab&rsquo;s potash fertiliser use to 416,000 tonnes of K₂O a year by 2034-35, 12 times its 2024-25 level. Across the model runs, this rise delays the year in which average available soil potassium falls below 100 ppm by only about 2 years, compared with the projection in which potash fertiliser use does not rise. Potash fertiliser use of 416,000 tonnes a year would cover half of the net potassium removal projected for 2034-35; the other half would still be drawn from potassium in the soil.</li>
          </ul>
          <p className="small muted mt-3">The projections come from a potassium balance model built on Punjab and federal statistics. In this report, the yearly fall is the drop in available soil potassium in 1 year. It is given either in ppm a year or as a percentage a year of that year&rsquo;s available soil potassium. The model takes its yearly fall from a measurement made by the Soil Fertility Research Institute (SFRI), Punjab, on its monitoring sites from 2003 to 2009. This is the only province-wide measurement of the yearly fall in Punjab that this report found. Section 4 compares the model&rsquo;s results with other methods, and Section 9 sets out the model&rsquo;s limitations.</p>
        </div>
      </div></section>

      <S id="sp-1" n="1" kicker="Measured soil potassium in Punjab, about 2016 to 2018" title="Soil samples tested in Punjab in about 2016 to 2018 had an average available soil potassium of 132 ppm, and 18% were below 100 ppm">
        <P>Available soil potassium is given in milligrams of potassium (K) per kilogram of soil (ppm), extracted with ammonium acetate, as Punjab soil laboratories report it. The tested samples averaged 132.3 ppm, given as 132 ppm where rounded.</P>
        <P>The figures come from 770,160 soil samples tested in all 36 districts of Punjab in about 2016 to 2018. These records were validated, normalised and mapped by Vital Agri Nutrients (VAN) for the Soil Atlas. They are soil testing records, not a random survey designed to represent all of Punjab&rsquo;s farmland, and a field may have more than 1 sample. The averages in this report therefore describe the tested soils.</P>
        {/* Tahir 7 Nov 2026 (RP-PO-10): VAN's 5 bands replace the Punjab laboratory grades. Was: 'Punjab soil laboratories grade available soil potassium below 80 ppm as poor and from 80 to 180 ppm as satisfactory, and treat 180 ppm as the level at which available soil potassium is adequate. About 88% of the 2016 to 2018 samples were below this adequate level of 180 ppm. This report uses 100 ppm as a warning line within the satisfactory grade. It is not an official grade. Of the samples, 18% were below 100 ppm and 8% were below 80 ppm.' The share in each band is still to be supplied from the data. */}
        <P>This report grades available soil potassium on VAN&rsquo;s 5-band soil-test scale, the scale used in the Soil Atlas: Critical below 50 ppm, Weak 50 to 100 ppm, Average 100 to 150 ppm, Moderate 150 to 200 ppm and Healthy above 200 ppm. This report uses 100 ppm, the boundary between the Weak and Average bands, as a warning line. It is not an official grade. Of the 2016 to 2018 samples, 18% were below 100 ppm, in the Critical or Weak band. The Soil Atlas map divides Punjab into 4,911 squares of about 5 km by 5 km. In 656 of these squares, about 13%, the average available soil potassium of the 2016 to 2018 samples was below 100 ppm.</P>
        <Lead b="Why this report uses 100 ppm.">In a study of 8 alluvial soil series in Pakistan, wheat responded to added potash wherever clay was up to 20% and available soil potassium, measured by the same ammonium acetate test, was up to 120 ppm (Ranjha, Mehdi and Qureshi 1992). A warning line at 100 ppm is therefore more likely to miss some soils on which wheat would respond to potash than to include soils on which it would not. On VAN&rsquo;s 5-band scale, 100 ppm is also the boundary between the Average and Weak bands.</Lead>
        {/* Tahir 7 Nov 2026 (RP-PO-7 a): India's grades removed (India is a warning, not a benchmark). Was: '... India grades available potash below 110 to 120 kg per hectare as low and up to 280 kg per hectare as medium (ICAR-IISS; TNAU). Converted to ppm by this report, India’s “low” grade is below about 50 to 54 ppm ... at the lower end of that US range.' */}
        <Lead b="Grades differ between countries.">There is no single world standard: each country sets its own grades for the same soil test. The US Tri-State system sets the critical level at 100 to 120 ppm, depending on soil type (Ohio State University). This report&rsquo;s warning line of 100 ppm is at the lower end of that range.</Lead>
        <P>The 5 districts with the lowest median available soil potassium, and the district with the highest, about 2016 to 2018 (measured):</P>
        <T head={['District', 'Median available soil potassium, about 2016 to 2018 (ppm)', 'Number of samples']} rows={[['Mianwali', 81, '14,037'], ['Layyah', 84, '14,757'], ['Bhakkar', 90, '23,220'], ['Mandi Bahauddin', 92, '20,392'], ['Attock', 100, '12,002'], ['Sahiwal (highest)', 184, '25,164']]} />
        <P>Mianwali, Layyah and Bhakkar, 3 of the 5 districts with the lowest median, are in the sandy Thal. Mandi Bahauddin also had a low median but is not in the Thal, so low levels are not limited to the sandy Thal soils. Section 9 shows that much of the difference between districts comes from how each soil was formed, not only from cropping.</P>
        <Lead b="Earlier statements on potassium deficiency.">This report found no repeat survey of the same soils other than the SFRI monitoring sites and the Gujar Khan measurements (Section 9). For earlier years, the evidence consists of published statements by experts. Since 1978, these statements have changed from describing Pakistan&rsquo;s soils as having sufficient potassium to describing many of them as deficient. They are listed below, most recent first:</Lead>
        <T min={640} head={['Period', 'What was said', 'Source']} rows={[
          ['Undated', '30% of Punjab soils deficient in potassium; losing 3 ppm a year', 'SFRI Punjab website (undated)'],
          ['2006', '20% to 60% of soils short of potassium', 'Ahmad and Khan 2006, IFA, as quoted by Akram et al. 2014'],
          ['2005', 'Potash deficiency "up to 40 percent" of soils', 'NFDC authors in FAO 2006'],
          ['About 1990', '50% of soils short of potassium (date not certain)', 'Bajwa, as quoted by Imran et al. 2010'],
          ['1978', '"Most of the cultivated soils in Pakistan have sufficient supply of available potassium"', 'Bhatti 1978, ARC Islamabad, as quoted by Mehdi et al. 2001'],
        ]} />
        <p className="small muted">These statements use different methods and cannot be read as a measured trend. The older primary records, the annual reports of Punjab&rsquo;s soil laboratories from the 1980s, exist only in print. SFRI&rsquo;s figure of 30% does not state which cut-off level it uses, so it cannot be compared with the shares in this report.</p>
      </S>

      <S id="sp-2" n="2" kicker="Potassium taken out by crops and put back" title="Punjab’s estimated net potassium removal nearly doubled, from an average of about 328,000 tonnes of K₂O a year in 2003 to 2009 to about 616,000 tonnes in 2023-24" bg>
        <P>Net potassium removal counts potash fertiliser, manure and irrigation water as potassium put back. The period 2003 to 2009 is used for comparison because SFRI measured the yearly fall in available soil potassium on its monitoring sites in those years.</P>
        <P>Between 1971-72 and 2023-24, the potassium taken out of Punjab&rsquo;s fields by the 5 crops rose from about 203,000 to about 940,000 tonnes of K₂O a year, as estimated by this report&rsquo;s balance model. Wheat grain and straw (bhoosa) together account for half of this removal. Of the 5 crops, removal by maize has grown fastest over this period. On the figures this report uses (NFDC from 2016-17 onwards; see the data notes in Section 9), potash fertiliser use in Punjab did not exceed 53,000 tonnes of K₂O in any year from 1971-72 to 2023-24.</P>{/* L2 fact check 9 Nov 2026 (W5): qualification restored; Punjab Development Statistics prints 64,800 t for 2017-18. */}
        <div className="my-5"><BalanceLines /></div>
        <P>By this report&rsquo;s estimate, manure puts back about 85,000 tonnes of K₂O a year and irrigation water about 203,000 tonnes, both more than potash fertiliser in any year. The balance holds these 2 amounts constant for every year from 1971-72 (Section 9).</P>
      </S>

      <S id="sp-int" n="3" kicker="Comparison with international estimates" title="International estimates are consistent with this report’s balance: Pakistan’s potassium deficit grew in every decade from the 1970s to the 2010s, and Pakistan used little potash fertiliser in 2023">
        <P>The potassium balance in Section 2 is built from Pakistani government statistics. Its results are consistent with 3 international sources, each built independently of this report: a peer-reviewed potassium budget for Pakistan, data from the Food and Agriculture Organization of the United Nations (FAO) on potash fertiliser use, and World Bank data on total fertiliser use.</P>
        <Lead b="1. A peer-reviewed potassium budget for Pakistan, 1970s to 2010s.">Pathak, Fagodiya and Singh (2024, Scientific Reports 14:29136, Table 5) built this budget from FAOSTAT and national data. The table gives the paper&rsquo;s estimates as decade averages, in million tonnes of potassium (as K, not K₂O) a year. The paper&rsquo;s Balance column also counts potassium put back from sources other than fertiliser, so the Balance is not the amount taken out by crops minus the fertiliser figure:</Lead>
        <T head={['Decade', 'Taken out by crops', 'Fertiliser', 'Balance']} rows={[['1970s', '0.58', '0.00', '-0.37'], ['1980s', '0.77', '0.03', '-0.53'], ['1990s', '0.98', '0.02', '-0.72'], ['2000s', '1.19', '0.03', '-0.89'], ['2010s', '1.42', '0.03', '-1.09']]} />
        <P>In this budget, Pakistan&rsquo;s potassium deficit grew larger in every decade. The paper puts Pakistan&rsquo;s share of South Asia&rsquo;s potassium deficit at between 10% and 19%, the second largest share in South Asia.</P>
        <Lead b="2. FAO fertiliser data.">In 2023, Pakistan used 1.48 kg of potash fertiliser (as K₂O) per hectare of cropland. The world figure was 23.1 kg; Bangladesh used 63.0 kg and China 69.1 kg. In the same year Pakistan used 122.9 kg of nitrogen per hectare (FAOSTAT via Our World in Data). Calculated from these figures, Pakistan used about 83 kg of nitrogen for every 1 kg of potash fertiliser (as K₂O).</Lead>
        <Lead b="3. World Bank data.">Pakistan&rsquo;s total fertiliser use was 160 kg per hectare of arable land in 2023, above the world figure of 138 kg (World Development Indicators, AG.CON.FERT.ZS, via Our World in Data). In 2023, then, Pakistan used more fertiliser per hectare than the world as a whole (World Bank) but much less potash fertiliser (FAO). The 2 sources use different areas, arable land for the World Bank and cropland for FAO, so the 2 figures are not on exactly the same basis.</Lead>
        <Lead b="Comparison with this report’s Punjab model.">For the 2010s, this report&rsquo;s model estimates that the 5 crops in Punjab took out about 724,000 tonnes of K₂O a year and that net potassium removal was about 412,000 tonnes a year. For all of Pakistan in the 2010s, the peer-reviewed budget gives an average of 1.71 million tonnes of K₂O a year taken out and a deficit, the paper&rsquo;s counterpart of net potassium removal, of 1.31 million tonnes a year. This report converted these figures from the paper&rsquo;s figures in K. Most of the difference between the 2 estimates comes from their scope: the peer-reviewed budget covers every crop in all of Pakistan. It also counts about 23% of the potassium taken out by crops as put back, against about 43% in this report&rsquo;s model. Because Punjab grows most of Pakistan&rsquo;s crops, a Punjab estimate that covered every crop would be expected to account for most of the national deficit of 1.31 million tonnes a year. This report&rsquo;s Punjab figure of about 412,000 tonnes is much smaller. It is therefore more likely to understate net potassium removal than to overstate it, for 2 reasons: it covers only 5 crops, and it counts a larger share of potassium as put back in irrigation water and manure.</Lead>
      </S>

      <S id="sp-3" n="4" kicker="Projected soil potassium to 2050" title="The model projects that Punjab’s average available soil potassium will fall below 100 ppm between 2026-27 and 2043-44, with 2035-36 in the average case" bg>
        <div className="my-5"><FanChart /></div>
        <P>In the average case, the model estimates Punjab&rsquo;s average available soil potassium at about 116 ppm in 2025-26 and projects about 81 ppm in 2049-50.</P>
        <P>The share of soil samples below 100 ppm was 18% when they were measured in about 2016 to 2018. In the average case, the model estimates that about 34% of the soils represented by those samples were below 100 ppm in 2025-26, and projects 52% in 2034-35.</P>
        {/* Tahir 9 Nov 2026: the first assumption is named as case B's rule; was "Under the first, the yearly fall becomes smaller in step with the level of available soil potassium; ..." */}
        <Lead b="What decides the year in which average available soil potassium falls below 100 ppm.">The most important input is how strongly the release of potassium from mica, a soil mineral, slows the yearly fall as available soil potassium drops. This input changes the projected year more than all the other inputs together. No measurement in Punjab sets the value of this input, so the model uses 2 alternative assumptions about it, each in half the runs. Under the first, which is the rule of case B below, the yearly fall is a percentage of the soil level, so it becomes smaller in step with the level of available soil potassium; in the average case of these runs, average available soil potassium falls below 100 ppm in 2031. Under the second, the yearly fall becomes smaller as available soil potassium approaches a floor of 60 to 80 ppm, below which it does not fall; in the average case of these runs, it falls below 100 ppm in 2038. The year 2035-36 in the average case for all the runs rests on giving the 2 assumptions equal weight. The second most important input is the value used for the yearly fall measured by SFRI, which the runs vary by plus or minus 50%. Section 9 gives the projected year for a wider set of assumed strengths of this slowing.</Lead>
        <P>Under both assumptions used in the runs, Punjab&rsquo;s average available soil potassium eventually falls below 100 ppm. The model did not test any assumption under which it levels off above 100 ppm. In only about 2 of every 100 runs does it stay above 100 ppm until 2049-50.</P>
        {/* Tahir 9 Nov 2026: was "... with the years obtained by applying other published methods to the same Punjab potassium balance:" */}
        <Lead b="Comparison with other methods.">The table compares this report&rsquo;s projection with the year obtained by holding SFRI&rsquo;s measured yearly fall constant (case A) and the years obtained by applying a published US method, which is set to reproduce the same measurement, to the same Punjab potassium balance:</Lead>
        <T min={720} head={['Method', 'Year in which average available soil potassium falls below 100 ppm', 'Note']} rows={[
          ['US soil-test drawdown factor (a net removal of 5.6 to 9 kg K₂O per hectare lowers the soil test by 1 ppm)', 'Already, about 2021 to 2024', 'Gives the earliest year of all the methods and an upper limit on the speed of the fall. It is not independent: it is set to reproduce the 3.5 ppm a year that SFRI measured at the 2003 to 2009 net potassium removal, and it allows no slowing by soil minerals (Purdue University 2008)'],
          // L2 fact check 9 Nov 2026 (W2): with the Indian row gone the note 'In the middle of the range of methods' no longer held. RP-PO-9: 'the model runs', not '20,000 runs'.
          ['This report, the model runs', 'Average case 2035-36; worst case 2026-27, best case 2043-44', 'The average case is inside the range of the other 2 methods, near its later end; the best case is later than both'],
          ['Yearly fall measured by SFRI in 2003 to 2009, held constant (case A)', '2036-37', 'Does not allow for the larger net potassium removal since the 2003 to 2009 period'],
          /* Tahir 7 Nov 2026 (RP-PO-7 d): the row 'Indian long-term experiments on alluvial soils, no potash applied | About 2060 ... (Das et al. 2022)' and the paragraph after the table ('The Indian experiments are the strongest evidence ...') removed. */
        ]} />
        <Lead b="The 3 fixed cases.">Besides the model runs, there are 3 fixed cases, each with a single set of inputs. Cases A to C start from the unweighted 2016 to 2018 average of 132.3 ppm. Case C is used in Section 5. Projected average available soil potassium in Punjab under each case, in ppm (modelled):</Lead>
        <T min={680} head={['Case', 'Estimated average, 2025-26 (modelled)', 'Falls below 100 ppm', 'Projected average, 2049-50']} rows={[
          // L2 fact check 9 Nov 2026 (W1): case A holds the percentage fall constant; 118, 2036-37 and 83 ppm fit about 1.48% a year from 132.3 ppm, not 3.52 ppm. Was 'A. The yearly fall stays at about 3.5 ppm a year, as SFRI measured in 2003 to 2009, ...'.
          // Lead 9 Nov 2026: no rate figure, since the workbook (not on disk) is the only source for it; meaning as on the live page.
          ['A. The yearly fall stays at the pace SFRI measured in 2003 to 2009, whatever happens to crop output', '118 ppm', '2036-37', '83 ppm'],
          // Tahir 7 Nov 2026 (RP-PO-12, RP-PO-1): 1 name for the scenario; case C is case B plus the increase. Was 'B. No action, fast case: ...', 'C. Action: potash fertiliser use rises ...', 'Average case of the 20,000 runs, no action'.
          ['B. Fast case: crop output keeps growing, potash fertiliser use does not rise, and the yearly fall is a percentage of the soil level that is scaled to each year’s net potassium removal', '109 ppm', '2028-29', '41 ppm'],
          ['C. As case B, but potash fertiliser use rises to 416,000 tonnes of K₂O a year by 2034-35 (assumed)', '109 ppm', '2029-30', '63 ppm'],
          ['Average case of the model runs, potash fertiliser use does not rise', '116 ppm', '2035-36 (worst case 2026-27, best case 2043-44)', '81 ppm'],
        ]} />
        {/* Tahir 9 Nov 2026: case B's rule is the first slowing assumption. Removed 'Case B is the simplest of the 3 fixed cases' and 'The model runs add the 2 assumptions, described above, under which soil minerals slow the yearly fall.' */}
        <P>In case B, the yearly fall in available soil potassium is a percentage of the soil level. The percentage starts at the yearly fall SFRI measured in 2003 to 2009, about 1.5% a year, and is raised or lowered each year in proportion to that year&rsquo;s net potassium removal compared with the 2003 to 2009 net removal. Case B gives the earliest year of the 3 fixed cases. In case B, the modelled share of soils below 100 ppm is 46% in 2025-26, and the projected share is 82% in 2034-35. Half of the model runs use case B&rsquo;s rule, in which the yearly fall is a percentage of the soil level; the other half use a floor of 60 to 80 ppm. The year 2035-36 in the average case comes from these runs.</P>
      </S>

      <S id="sp-4" n="5" kicker="Effect of more potash fertiliser" title="In the model, raising Punjab’s potash fertiliser use to 12 times its 2024-25 level delays the fall below 100 ppm by only about 2 years">
        <P>In case C, the model assumes that Punjab&rsquo;s potash fertiliser use rises steadily from the 34,000 tonnes of K₂O used in 2024-25 to 416,000 tonnes a year by 2034-35, which is 12 times the 2024-25 amount. That amount, 416,000 tonnes, would cover half of the net potassium removal projected for 2034-35, about 830,000 tonnes of K₂O. Case C is built on case B, the fixed case that gives the earliest year, so its year is compared with case B (2028-29), not with the average case of the runs (2035-36).</P>
        <ul className="sp-list mt-3">
          <li>Across the model runs, the assumed increase delays the year in which Punjab&rsquo;s average available soil potassium falls below 100 ppm by about 2 years; in 8 of every 10 runs the delay is between 0 and 5 years. Between the fixed cases B and C, the delay is 1 year: in case C, with the increase, average available soil potassium falls below 100 ppm in 2029-30; in case B, in which potash fertiliser use does not rise, it falls below 100 ppm in 2028-29.</li>
          <li>In case C, Punjab&rsquo;s average available soil potassium keeps falling after 2029-30 and reaches about 63 ppm by 2049-50. In case B it reaches 41 ppm, so the extra potash leaves the average 22 ppm higher. Available soil potassium keeps falling in case C because the other half of the net potassium removal is still drawn from potassium in the soil.</li>
          {/* Tahir 7 Nov 2026 (RP-PO-2): 616,000 t is the extra amount. Was: '... would need about 616,000 tonnes of K₂O a year, about 17 times the 36,000 tonnes used in Punjab in 2023-24.' The 17 times goes to the fact checker. */}
          <li>Covering the whole of the estimated 2023-24 net potassium removal with potash fertiliser would need about 616,000 tonnes of K₂O a year more than in 2023-24. Supplying 616,000 tonnes of K₂O would take about 20.5 million 50 kg bags of muriate of potash (MOP, 60% K₂O), or about 24.6 million 50 kg bags of sulfate of potash (SOP, 50% K₂O).</li>
        </ul>
        <P>Punjab&rsquo;s alluvial soils are rich in the minerals mica and illite, which hold potassium between their layers. As crops take out potassium that is not replaced, these minerals release some of the potassium they hold. Because of this release, available soil potassium falls more slowly than the potassium balance alone would suggest, but the release uses up the potassium held in the minerals. Weathered illite and vermiculite clays can also lock up (fix) part of any potash fertiliser applied later, so that crops cannot use it for a time (Wakeel and Ishfaq 2022).</P>
      </S>

      <S id="sp-5" n="6" kicker="Effect on yield and fertiliser use" title="In a Mianwali wheat trial, potash fertiliser raised grain yield by 25%, and low available soil potassium can reduce how much nitrogen and phosphorus a crop takes up" bg>
        <P>In a 2-year wheat trial at the Adaptive Research Station, Mianwali, on sandy, low-potassium soil in the Thal, adding 93 kg of K₂O per hectare as potash fertiliser raised grain yield by 25%, from 3,625 to 4,533 kg per hectare (Abbas et al. 2013, Pakistan Journal of Botany).</P>
        <P>Potassium also affects how much of the nitrogen and phosphorus in urea and DAP the crop takes up. A study on soil severely deficient in potassium, quoted by the International Food Policy Research Institute (IFPRI), found that applying nitrogen, phosphorus and potassium together raised the share of each nutrient that the crop took up, compared with applying only 2 of them:</P>{/* Tahir 7 Nov 2026 (RP-PO-3): was '... found that adding potash raised the share of each applied nutrient that the crop took up:' */}
        <T head={['Nutrient', 'Share taken up by the crop with 2 nutrients applied', 'Share taken up with N, P and K together']} rows={[['Nitrogen', '16%', '76%'], ['Phosphorus', '1%', '13%'], ['Potassium', '22%', '61%']]} />
        <p className="small muted">With 2 nutrients applied means nitrogen and phosphorus only for the nitrogen and phosphorus rows, and nitrogen and potassium only for the potassium row. Source: Haerdter and Fairhurst (2003), as quoted in Ali et al. 2016, IFPRI Discussion Paper 01516. This is a single study, most likely on rice outside Pakistan, and the original has not been found. Its figures show what happens on soil severely deficient in potassium; they are an illustration, not a Punjab average.</p>
        <P>National figures for Pakistan show more fertiliser used for each 100 kg of wheat produced, and less potash applied for each kg of nitrogen. These trends are consistent with the study above, although low soil potassium is probably only part of their cause:</P>
        <ul className="sp-list mt-3">
          <li>Producing 100 kg of wheat in Pakistan took 4 kg of fertiliser nutrients in 1980-81 and 7.9 kg in 2014 (IFPRI 2016).</li>
          <li>For every kg of nitrogen applied as fertiliser, Pakistan applied 0.036 kg of potash in 1985-86 and 0.007 kg in 2013-14 (IFPRI 2016).</li>
        </ul>
        <P>Where a farmer&rsquo;s soil is low in available potassium, the crop cannot fully use the nitrogen and phosphorus in the urea and DAP that the farmer has paid for.</P>
      </S>

      <S id="sp-7" n="7" kicker="Recommendations for farmers, government and industry" title="Potassium should be given the same priority as nitrogen and phosphorus in soil testing, fertiliser policy and fertiliser supply">
        <Lead b="For farmers.">Farmers should have their soil tested before the next sowing. Where the test shows available soil potassium below 100 ppm, especially on sandy land, part of the money spent on urea and DAP may be wasted until potash is added. On VAN&rsquo;s 5-band scale, a result below 100 ppm is in the Weak or Critical band. A farmer can apply potash to a strip of the field and compare the crop on that strip with the rest of the field.</Lead>
        <Lead b="For the government.">The most recent province-wide measurement of the yearly fall in Punjab&rsquo;s available soil potassium that this report found was made on SFRI&rsquo;s monitoring sites in 2003 to 2009. The government should restore fixed monitoring sites, re-test them every 2 to 3 years and publish the results. Fertiliser policy should give potassium the same priority as nitrogen and phosphorus.</Lead>
        {/* Tahir 7 Nov 2026 (RP-PO-10 farmer sentence above, was 'Punjab soil laboratories grade 80 to 180 ppm as satisfactory, so a result graded satisfactory can still be below this warning line.'; RP-PO-2 here, was 'Closing ... net potassium deficit would take about 17 times the potash fertiliser used in Punjab that year.') */}
        <Lead b="For the fertiliser industry.">Covering Punjab&rsquo;s estimated 2023-24 net potassium removal would take about 616,000 tonnes of K₂O a year more than the potash fertiliser used in Punjab that year. Pakistan has no commercial potash mine, so supplying potassium on that scale would need imported potash, potash recovered within Pakistan and products that farmers can afford.</Lead>
      </S>

      <S id="sp-concl" n="8" kicker="Conclusion" title="Potassium is being taken out of Punjab’s soils faster than it is put back, and more potash fertiliser alone only slows the fall" bg>
        <P>Punjab&rsquo;s soils still hold potassium, but the available part that crops can use is being taken out faster than it is replaced. The estimated net potassium removal nearly doubled, from an average of about 328,000 tonnes of K₂O a year in 2003 to 2009 to about 616,000 tonnes in 2023-24. The sandy Thal districts of Mianwali, Layyah and Bhakkar already had median levels below 100 ppm in about 2016 to 2018. If potash fertiliser use does not rise, the model projects that Punjab&rsquo;s average available soil potassium will fall below the 100 ppm warning line in 2035-36 in the average case.</P>
        <P>In the model, raising potash fertiliser use to 12 times its 2024-25 level delays the year in which Punjab&rsquo;s average available soil potassium falls below 100 ppm by only about 2 years, because half of the projected net removal would still be drawn from potassium in the soil. Falling available soil potassium matters for farmers because, where it is low, a crop can take up less of the nitrogen and phosphorus in urea and DAP. The main uncertainty is how strongly the release of potassium from soil minerals slows the yearly fall. No measurement in Punjab has settled this.</P>
      </S>

      <S id="sp-8" n="9" kicker="Method, checks and limitations" title="How the model works, how it was checked, and its limitations">
        <p className="mt-3"><b>The model in 4 steps.</b></p>
        <ol className="sp-list sp-ol mt-2">
          <li>Crop output: Punjab production of wheat, rice, sugarcane, maize and cotton, every year from 1971-72 to 2023-24.</li>
          <li>Potassium taken out: published studies give a range for the potassium in each tonne harvested. The fixed cases use figures at the low end of these ranges, and the model runs draw from wider ranges (wheat straw, or bhoosa, 10 to 25 kg of K₂O per tonne of grain; rice straw 15 to 25 kg per tonne of paddy, with 10% to 50% of the straw removed). Bhoosa and maize stover are counted as removed from the field, because they are fed to animals. Rice straw and sugarcane trash are mostly burnt in the field, so their potassium stays there. Half of the cotton sticks are counted as removed for firewood.</li>
          <li>Potassium put back: potash fertiliser (for each year), farmyard manure (of which 1/4 reaches fields, according to FAO) and canal and tube-well water.</li>
          {/* Tahir 9 Nov 2026: was 'The model runs also add the 2 assumptions under which soil minerals slow the yearly fall (Section 4).' */}
          <li>Yearly fall: 3.52 ppm a year, measured on SFRI&rsquo;s monitoring sites in 2003 to 2009 (about 1.5% a year of the monitoring sites&rsquo; average available soil potassium). Except in case A, the model raises or lowers this yearly fall each year in step with that year&rsquo;s net potassium removal. Half of the model runs use case B&rsquo;s rule, in which the yearly fall is a percentage of the soil level, and the other half use a floor of 60 to 80 ppm (Section 4).</li>
        </ol>
        <Lead b="Starting values.">Weighted by each district&rsquo;s cultivated area, the 2016 to 2018 average is 129.8 ppm rather than 132.3 ppm, because some districts with low available soil potassium have large cultivated areas. Cases A to C start from 132.3 ppm, and the model runs start from the area-weighted average of 129.8 ppm.</Lead>
        <Lead b="How the model runs vary the inputs.">The projections come from many model runs with every uncertain input varied. Each run drew every uncertain input from the range below.</Lead>
        <T min={640} head={['Input', 'Range used in the runs', 'Note']} rows={[
          ['Potassium in canal water', '1.3 to 5 mg per litre, most likely 3', 'The most likely value is set above the world river median of 1.3 mg per litre, because Pakistani river data are above it'],
          ['Potassium in tube-well water', '2 to 8 mg per litre, most likely 5', ''],
          ['Share of canal-water potassium that stays in the root zone', '25% to 75%', ''],
          ['Share of tube-well-water potassium that stays in the root zone', '10% to 50%', 'Much of it is the fields’ own potassium, leached and pumped back up'],
          ['Fodder and other removals not otherwise counted', '0 to 600,000 tonnes of K₂O a year, rising 1% to 3% a year', ''],
          ['Groundwater pumping', 'Rising 1% to 4% a year', ''],
          ['Potassium in wheat straw (bhoosa) and other straw', 'Ranges in step 2 above', ''],
          ['Yearly fall measured by SFRI', 'Plus or minus 50%', ''],
          ['How strongly soil minerals slow the yearly fall', '2 assumptions (Section 4)', ''],
          ['Crop growth', 'Varied in each run', ''],
        ]} />
        <Lead b="Strength of slowing by soil minerals.">The table gives the year in which Punjab&rsquo;s average available soil potassium falls below 100 ppm for different assumed strengths of slowing by soil minerals (average case, modelled). The more strongly soil minerals slow the yearly fall, the later the year. The last row is the floor assumption used in half the runs.</Lead>
        <T head={['Strength of slowing by soil minerals', 'Year below 100 ppm (average case)']} rows={[
          ['Not at all: the same fall in ppm, or more, each year (unlikely on mica-rich soils)', 'about 2024'], ['Weakly', 'about 2026'], ['Moderately, up to the percentage fall of case B', 'about 2028'],
          ['Fairly strongly', 'about 2032'], ['Strongly', 'about 2037'], ['Very strongly', 'about 2045'], ['Towards a floor of 60 to 80 ppm', 'about 2038'],
        ]} />
        <P>In the model runs, potassium in irrigation water, fodder removal and crop growth change the average-case year very little, because every run is scaled so that its own 2003 to 2009 net potassium removal reproduces the yearly fall SFRI measured.</P>
        <div id="sp-6">
          <Lead b="Comparisons with measurements.">The model&rsquo;s results were compared with measured data in 2 ways. Only the first is a test of the model, and it is a weak one. The first looks at land measured 2 times. Because the model is set to SFRI&rsquo;s 2003 to 2009 yearly fall, only the Gujar Khan measurement is a separate test. The second compares districts. It cannot detect a fall over time, so it cannot test the model, but it shows why districts differ.</Lead>
          <Lead b="Comparison 1: repeated measurements of the same land.">Where the same land was measured 2 times, available soil potassium fell by about 1.5% a year on SFRI&rsquo;s monitoring sites and about 2.3% a year in Gujar Khan:</Lead>
          <T min={600} head={['Place', 'First measurement', 'Second measurement', 'Yearly fall']} rows={[['SFRI monitoring sites, Punjab', '251 ppm (2003)', '230 ppm (2009)', '3.5 ppm, about 1.5%'], ['Gujar Khan tehsil, Rawalpindi', 'about 144 ppm, estimated (about 2000)', '103 ppm (2012 to 2017)', 'about 2.8 ppm, about 2.3%']]} />
          <P>At the 2003 to 2009 net potassium removal, the balance model gives a yearly fall in available soil potassium of about 1.5% a year; at the larger 2023-24 net removal, about 2.8% a year. The fall measured in Gujar Khan, about 2.3% a year, lies between these 2 figures. The Gujar Khan result is a weak test for 2 reasons: Gujar Khan is rainfed, and its first value is not a direct measurement but this report&rsquo;s estimate from the share of samples in each grade reported by Qureshi et al. (2001).</P>
          <Lead b="Comparison 2: differences between districts.">The 769,578 cleaned samples (of the 770,160) were compared district by district, after allowing for soil texture, organic matter and pH. If cropping alone were reducing available soil potassium, the districts where crops take out the most potassium per hectare would have the lowest levels, but they do not. Districts where crops take out more potassium per hectare have slightly higher available soil potassium: about 0.18 ppm more for each additional kg per hectare taken out. This relationship is weak and not statistically reliable. In the tests of about 2016 to 2018, Sahiwal, Multan and Rahim Yar Khan had high levels of available soil potassium; Mianwali, Bhakkar and Mandi Bahauddin had low levels.</Lead>
          <P>Much of the difference between districts comes from how each soil was formed. Parent material, river silt and groundwater set each district&rsquo;s starting level of available soil potassium, and soil tests from a single period cannot separate that starting level from the effect of 50 years of cropping. For this reason, the yearly fall used in this report comes only from places measured more than once, not from differences between districts. The districts whose median was below 100 ppm in about 2016 to 2018 are therefore low partly because of how their soils were formed.</P>
        </div>
        <p className="mt-3"><b>The model workbook is available from the author on request:</b> <a href={`mailto:${SP_EMAIL}?subject=Soil%20Poverty%20model%20request`}>{SP_EMAIL}</a>. Every input is on 1 sheet with its source, and the inputs that depend on judgement are marked and can be changed.</p>
        <p className="mt-4"><b>Limitations of the model.</b></p>
        <ul className="sp-list mt-2">
          <li>Only 1 province-wide measurement of the yearly fall in Punjab was found, from 2003 to 2009. The US drawdown method gives the same yearly fall only because it is set to reproduce it (Section 4). Scaling this yearly fall to the larger net potassium removal of recent years assumes that the yearly fall grows in proportion to the net removal; the model runs test this assumption. Because mica releases potassium as available soil potassium falls, the projections that allow the least slowing by soil minerals may overstate the fall.</li>
          <li>The SFRI monitoring sites averaged about 240 ppm, nearly 2 times the 2016 to 2018 Punjab average of 132 ppm. How far their yearly fall applies to soils with lower available soil potassium is assumed, not measured. The SFRI figures are taken from IFPRI 2016.</li>
          {/* Tahir 9 Nov 2026: the first assumption named as case B's rule. */}
          <li>How strongly soil minerals slow the yearly fall is an assumed range, not a measured one. Half the runs use case B&rsquo;s rule, in which the yearly fall is a percentage of the soil level and so becomes smaller in step with the level of available soil potassium, and half use the assumption with a floor of 60 to 80 ppm. Weighting the 2 assumptions differently moves the average-case year anywhere between 2031 and 2038.</li>
          <li>Irrigation water is the largest and least certain source of potassium put back. No measured figure for potassium in Punjab&rsquo;s canal water exists. The fixed cases use the world river median (1.3 mg per litre) and count half the potassium in tube-well water; the model runs vary these amounts (see the table above). Much of the potassium in tube-well water is the fields&rsquo; own potassium, leached and pumped back up, so only part of it is a real addition of potassium to the field. In case B, a potassium content in irrigation water above the world river median used in the fixed cases moves the year in which average available soil potassium falls below 100 ppm earlier rather than later, to between 2025 and 2028. This happens because the amount put back in irrigation water is held constant in every year. More potassium in water therefore lowers the 2003 to 2009 net removal and the recent net removal by the same amount, so the recent net removal becomes larger relative to the 2003 to 2009 net removal, and the yearly fall, which is scaled by that comparison, becomes faster.</li>
          <li>The model does not count potassium washed out (leached) of sandy Thal soils or lost by erosion on rainfed land. The fixed cases also do not count fodder crops (berseem, sorghum, maize fodder), potato, pulses, oilseeds or vegetables; the model runs add an uncertain allowance of 0 to 600,000 tonnes of K₂O a year for fodder and other removals. The real net potassium removal is therefore larger than in the fixed cases. Potato and vegetables receive much of the potash fertiliser applied: this potash is included in the fertiliser figure, but the potassium these crops take out is not.</li>
          <li>Potassium put back from manure and irrigation water is held constant at recent levels for every year back to 1971-72, so net potassium removal in early years is understated.</li>
          <li>The projected share of samples below 100 ppm is estimated by lowering every 2016 to 2018 sample in step with the projected average available soil potassium for Punjab. It is not a new measurement.</li>
          <li>Soil potassium figures after 2016 to 2018 are modelled. Crop production and fertiliser figures up to 2023-24 are recorded statistics, and the potassium taken out and put back is estimated from them. Except in case C, which assumes a rise in potash fertiliser use, every figure after 2023-24 shows what would happen if potash fertiliser use did not rise, and should not be read as a prediction.</li>
        </ul>
        <Lead b="Data notes.">Punjab Development Statistics for 50 Years gives wheat production in 2017-18 as 16,210 thousand tonnes; Punjab Agriculture Statistics 2024 gives 19,179 thousand tonnes, which is the figure used. For potash fertiliser use in 2017-18, Punjab Development Statistics for 50 Years gives 64,800 tonnes and NFDC gives 37,000 tonnes; NFDC figures are used from 2016-17 onwards. In the Sheikhupura soil workbook, the values were shifted 1 column against the headings and were corrected.</Lead>
      </S>

      <section className="sec" id="sp-src" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <div className="mb-5"><span className="eyebrow soil">Sources</span><h2 className="max-w-[26ch]">Sources for every figure</h2></div>
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
