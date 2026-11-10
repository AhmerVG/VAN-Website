import { Flagship } from '@/components/Flagship'
import { rateLabel, rateUnits, packInfo } from '@/lib/season'
import { useFitWidth } from '@/hooks/useFitWidth'
import { PACK_PNG } from '@/data/assets'
import { WA, wa, COUNTS } from '@/data/site'
import { WHEAT_PLAN } from '@/data/catalogue'
import { useInView, useReducedMotion } from '@/hooks/useInView'
import { WaButton, MethodIcon, SectionHead, productBySlug, noStop, planLabel } from '@/components/bits'
import { ProductSoilStrip } from '@/components/soil/SoilBits'
import { Source } from '@/components/Charts'
import { ApplicationMethods } from '@/components/ApplicationMethods'

// Every sentence below is transcribed from content/brands_vital-urea.txt (the live page). Nothing is added.
/** B4, 24 Sep 2026: the bracket holds the DOSE (rate × pack size), as every FIELD_ROWS line does. It
 *  had printed the pack size, so "½ bag" read as "(25 kg)". Revert: put back
 *  `${rateLabel(r)} (${r.pack.replace('Bag - ', '')})` in the wheat row below. */
function doseLabel(r: { rate: string; pack: string; basis?: 'plant' | 'per200L' }) {
  const p = packInfo(r.pack)
  const amount = rateUnits(r.rate, r.pack) * p.size
  return amount > 0 && p.measure ? `${rateLabel(r)} (${Number(amount.toFixed(2))} ${p.measure})` : rateLabel(r)
}

// L1 7 Nov 2026 (m10): "Mungbean & Mash" as the crop is named, "Side-dressing" as on the product pages. Doses and stages unchanged.
const FIELD_ROWS: [string, string, string, string][] = [
  ['Garlic', 'Land preparation', '1 bag (25 kg)', 'Drill at sowing; broadcast if no drill'],
  // L2 fact check 9 Nov 2026 (W13): was 'Broadcast'; the garlic plan row reads "Side dressing/Broadcasting".
  ['Garlic', 'Germination', '1 bag (25 kg)', 'Side dressing or broadcasting'],
  // L1 7 Nov 2026 (crops-b m6, shared with the crop pages' copy of these rows): was "Side dressing / broadcasting".
  ['Sesame', 'Germination', '1 bag (25 kg)', 'Side dressing or broadcasting'],
  ['Sesame', 'Early growth', '½ bag (12.5 kg)', 'Side dressing or broadcasting'],
  ['Soybean', 'Land preparation', '½ bag (12.5 kg)', 'Drill at sowing; broadcast if no drill'],
  ['Lentil', 'Land preparation', '½ bag (12.5 kg)', 'Drill at sowing; broadcast if no drill'],
  ['Mungbean & Mash', 'Land preparation', '½ bag (12.5 kg)', 'Drill at sowing; broadcast if no drill'],
  ['Canola', 'Land preparation', '1 bag (25 kg)', 'Drill at sowing; broadcast if no drill'],
]
const SOURCES = [
  'Degryse, F., et al. (2016). Soil Science Society of America Journal 80(2), 294–305. doi:10.2136/sssaj2015.06.0237.',
  // Tahir 10 Nov 2026 (EN-9b): Bremer (2022) removed, no longer cited on the page. Was 'Bremer, E. (2022). Crops & Soils 56(1), 34–37. doi:10.1002/crso.20241.'
  'Janzen, H. H., & Bettany, J. R. (1987). Canadian Journal of Soil Science 67(3), 609–618. doi:10.4141/cjss87-057. Temperature response as summarised by Degryse et al. (2016).',
  'Grzebisz, W., Zielewicz, W., & Przygocka-Cyna, K. (2022). Agronomy 13(1), 66. doi:10.3390/agronomy13010066.',
  // D-151: 'Elbasyoni, I. S., et al. (2026). Life 16(5), 795. doi:10.3390/life16050795.' deleted (cited nowhere on the page, A22).
  'Khoshru, B., et al. (2023). Bacteria 2(2), 98–115. doi:10.3390/bacteria2020008.',
  'Mattiello, E. M., et al. (2017). Journal of Agricultural and Food Chemistry 65(6), 1108–1115. doi:10.1021/acs.jafc.6b04586.',
  // Tahir 10 Nov 2026 (EN-2b): the full reference. Was 'Zhao et al. (2015), as summarised by the International Plant Nutrition Institute (IPNI). Across 10 soils, elemental sulfur oxidised faster in alkaline soil than in acidic soil.'
  'Zhao, C., Degryse, F., Gupta, V., & McLaughlin, M. J. (2015). Elemental sulfur oxidation in Australian cropping soils. Soil Science Society of America Journal 79(1), 89–96. doi:10.2136/sssaj2014.08.0314. In 10 Australian cropping soils, the oxidation rate of elemental sulfur rose with soil pH.',
  // D-151 (A4): 2 entries deleted, their DOIs resolve to other papers: 'Zapałowska, A., et al. (2026). Molecules 31(1), 160. Doi:10.3390/molecules31010160. The N:S optima, summarising Sedlár et al.' and 'Wan, Y., Shewry, P. R., & Hawkesford, M. J. (2012). Journal of Cereal Science 56(1), 72–80. Doi:10.1016/j.jcs.2011.10.014. Critical grain S 1.2 mg/g and N:S 17:1.'
  'Antille, D. L., Sakrabani, R., & Tyrrel, S. (2013). Applied and Environmental Soil Science 2013, 694597. doi:10.1155/2013/694597. Reporting the segregation thresholds of Miserque and Pirard.',
  'FAOSTAT (2025). Cropland Nutrient Balance, December 2025 release. The national nitrogen shares, 2023.',
  // D-130, 24 Sep 2026: the sources below were added with the soil, product, release, N-S and
  // removal sections. Revert: delete from here to the end of the array.
  'Yu, Z., Juhasz, A., Islam, S., Diepeveen, D., et al. (2018). Scientific Reports 8:2499. doi:10.1038/s41598-018-20935-8. Sulfur in cysteine and methionine; free amino acids such as asparagine, arginine and glutamine build up when sulfur is short; grain protein N:S.',
  'Yu, Z., She, M., Zheng, T., Diepeveen, D., et al. (2021). Communications Biology 4, 945. doi:10.1038/s42003-021-02458-7. Sulfur added to sulfur-deficient soil raised wheat nitrogen use efficiency by more than 20%.',
  'Randall, P. J., Spencer, K., & Freney, J. R. (1981). Australian Journal of Agricultural Research 32(2), 203–212. doi:10.1071/AR9810203. Critical wheat grain S 0.12% and N:S 17:1.',
  'Arata, A. F., Lerner, S. E., Tranquilli, G. E., Arrigoni, A. C., et al. (2017). Crop & Pasture Science 68(3), 202–212. doi:10.1071/CP16330. Nitrogen recovery 0.15 against 0.32 with sulfur, poor-fertility site, Argentina.',
  'FAO (2006). Plant nutrition for food security. FAO Fertilizer and Plant Nutrition Bulletin 16. Sulfur: wheat 22 kg S/ha taken up by a 4.6 t/ha crop; maize 21 kg S/ha removed in grain and stover at 9.5 t/ha; cotton 10 kg S/ha taken up by 2.5 t/ha of seed cotton.',
  'IRRI (2003). Rice fact sheet, sulfur. About 2 kg S removed per tonne of rice grain.',
  'Shukla & Lal (2004). Indian Journal of Agronomy 49(1). Sugarcane sulfur removal 20 to 32 kg S/ha.',
  // Tahir 7 Nov 2026 (RP-PO-7): 'Shukla, A. K., ... et al. (2021). Scientific Reports 11:19760 ... Indian Punjab 50.2% and Rajasthan 78.2% ...' removed with the India panel.
  'Ahmad et al. (2003). Asian Journal of Plant Sciences 2(5). Sulfur adequate in most of 45 samples from the Punjab Kallar tract.',
  // L2 fact check 9 Nov 2026 (W3): was 'N:P use'; NFDC's ratio is nitrogen to phosphate as P₂O₅ (3,387 ÷ 919).
  'NFDC (2025). Fertilizer Review 2024-25. N to P₂O₅ use 3.68 to 1 against a recommended 2 to 1; sulfur not reported as a nutrient.',
]

/** D-130: crop sulfur removal, per acre (kg/ha ÷ 2.471). The per-hectare source figure is kept for
 *  the source line only. Revert: delete this constant and the section that maps it. */
const S_REMOVAL: [string, string, string][] = [
  // D-151 (A8): FAO gives uptake for wheat and cotton and removal for maize, each at a stated yield.
  // Was: ['Wheat', '8.9 kg S per acre', '22 kg/ha · FAO Bulletin 16 (2006)'], maize '21 kg/ha · FAO
  // Bulletin 16 (2006)', cotton '10 kg/ha · FAO Bulletin 16 (2006)'.
  ['Wheat', '8.9 kg S per acre, taken up', '22 kg/ha taken up, grain and straw, by a 4.6 t/ha crop (about 46 maunds per acre) · FAO Bulletin 16 (2006)'],
  ['Maize', '8.5 kg S per acre, removed', '21 kg/ha removed in grain and stover at 9.5 t/ha (about 96 maunds per acre) · FAO Bulletin 16 (2006)'],
  ['Sugarcane', '8.1 to 13.0 kg S per acre, removed', '20 to 32 kg/ha removed · Shukla & Lal (2004)'],
  ['Cotton', '4.0 kg S per acre, taken up', '10 kg/ha taken up by 2.5 t/ha of seed cotton (about 25 maunds per acre) · FAO Bulletin 16 (2006)'],
  ['Rice', 'about 2 kg S removed per tonne of grain (not per acre)', 'IRRI fact sheet (2003)'],
]

/** D-130: the release timeline, drawn from VAN's own field observation of when release starts and
 *  ends. The curve shapes between those points are drawn for shape. Nothing here is a laboratory
 *  release curve, and the caption says so. Revert: delete ReleaseChart and its use below. */
export function ReleaseChart() {
  const { ref, inView } = useInView({ threshold: 0.15 })
  const rm = useReducedMotion()
  const on = inView || rm
  // D-151 (QA 5): W follows the box on a phone so the 11 to 12-unit labels render at 11 to 12px. Was W = 640.
  const fit = useFitWidth(640), narrow = fit.narrow
  const W = fit.W, H = 300, L = 48, R = 16, T = 30, B = 44
  const xw = W - L - R, yh = H - T - B
  const X = (d: number) => L + (d / 21) * xw
  const Y = (f: number) => T + (1 - f) * yh
  const curve = (t0: number, t99: number) => {
    const k = Math.log(100) / (t99 - t0)
    const pts: string[] = []
    for (let d = 0; d <= 21.001; d += 0.1) pts.push(`${X(d).toFixed(1)},${Y(d < t0 ? 0 : 1 - Math.exp(-k * (d - t0))).toFixed(1)}`)
    return pts.join(' ')
  }
  const lines: [string, number, number, string, number, string?][] = [
    ['Plain urea', 0, 1, '#8A968C', 2, '5 4'],
    ['Good irrigation, about 3 days', 0.5, 3, 'var(--navy)', 2],
    ['Typical, 7 to 8 days', 1, 7.5, 'var(--green)', 4],
    ['Dry or cold, up to 18 days', 1.5, 18, 'var(--soil)', 2],
  ]
  return (
    <div ref={ref} className="panel p-5">
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>When the nitrogen comes out, counted from the first irrigation</h4><span className="cap">share of the granule’s nitrogen released</span></div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 10 }} role="img" aria-label="Release timeline after the first irrigation: release starts 12 to 36 hours after water arrives and is complete in about 3 days with good irrigation, 7 to 8 days typically, and up to 18 days in dry or cold conditions.">
        <rect x={X(0.5)} y={T} width={X(1.5) - X(0.5)} height={yh} fill="var(--gold)" opacity=".18" />
        <text x={narrow ? X(0.5) : X(1)} y={T - 8} textAnchor={narrow ? 'start' : 'middle'} fontSize="12" fill="var(--soil)">release starts 12 to 36 hours</text>
        {[0, 0.5, 1].map(f => <g key={f}><line x1={L} x2={W - R} y1={Y(f)} y2={Y(f)} stroke="rgba(20,35,26,0.16)" strokeDasharray="2 3" /><text x={L - 6} y={Y(f) + 4} textAnchor="end" fontSize="12" fill="var(--muted)">{f * 100}%</text></g>)}
        {[0, 3, 7, 14, 18, 21].map(d => <text key={d} x={X(d)} y={H - B + 18} textAnchor="middle" fontSize="12" fill="var(--muted)">{d}</text>)}
        <text x={L + xw / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="var(--muted)">days after the first irrigation or rain</text>
        {lines.map(([n, t0, t99, c, w, dash]) => <polyline key={n} points={curve(t0, t99)} fill="none" stroke={c} strokeWidth={w} strokeDasharray={dash} style={{ opacity: on ? 1 : 0, transition: rm ? 'none' : 'opacity .8s ease' }} />)}
      </svg></div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 small mt-2">
        {lines.map(([n, , , c, , dash]) => <span key={n} className="flex items-center gap-2"><svg width="26" height="8" aria-hidden="true"><line x1="0" x2="26" y1="4" y2="4" stroke={c} strokeWidth="3" strokeDasharray={dash} /></svg>{n}</span>)}
      </div>
      <Source label="What this is">VAN’s own field observation of when release starts and ends, with the curves drawn for shape between those points. It is not a laboratory release curve, and no curve here is a measurement.</Source>
    </div>
  )
}

/** 2 bags, drawn to one scale of nitrogen — the label, and when it arrives. */
function TwoBags() {
  const { ref, inView } = useInView({ threshold: 0.15 })
  const rm = useReducedMotion()
  const on = inView || rm
  return (
    <div ref={ref} className={`grid md:grid-cols-2 gap-4 ${inView ? 'on' : ''}`}>
      <div className="panel p-5" style={{ background: '#F1F3EF', borderStyle: 'dashed' }}>
        <div className="flex items-end gap-4">
          <svg viewBox="0 0 90 120" width="90" aria-hidden="true"><path d="M14 14h62l6 10v84a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V24z" fill="#DDE2E6" stroke="#8A968C" strokeWidth="2.5" /><path d="M14 14l-6 10h74l-6-10" fill="none" stroke="#8A968C" strokeWidth="2.5" /><text x="45" y="66" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="13" fill="#5B6A5E">Urea</text><text x="45" y="84" textAnchor="middle" fontSize="10" fill="#5B6A5E">50 kg</text></svg>
          <div><div className="cap uppercase tracking-[.08em] font-bold" style={{ color: '#5B6A5E' }}>Plain urea</div><div className="display text-[24px]">50 kg, the standard bag on the market</div></div>
        </div>
        <div className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 mt-5 small">
          <div className="cap">on the label</div><div className="num text-[26px]" style={{ color: '#5B6A5E' }}>23 kg N</div>
          <div className="cap">how it is released</div><div>all at once, the day it dissolves<br /><span className="muted">from that moment, volatilisation, denitrification and leaching act on all of it</span></div>{/* Tahir 9 Nov 2026: denitrification, was nitrification */}
        </div>
        <svg viewBox="0 0 300 70" width="100%" className="mt-3" aria-hidden="true">
          <rect x="0" y="0" width="300" height="70" fill="#fff" rx="6" />
          <rect x="10" y="10" width={on ? 280 : 0} height="22" rx="4" fill="#BEC5BB" style={{ transition: rm ? 'none' : 'width 1s cubic-bezier(.2,.8,.2,1)' }} />
          <text x="12" y="52" fontSize="11" fill="#5B6A5E">all released the day it dissolves, then open to loss</text>
        </svg>
      </div>
      <div className="panel p-5" style={{ borderColor: 'var(--green)', borderWidth: 2 }}>
        <div className="flex items-end gap-4">
          <img src={PACK_PNG.urea} alt="Vital Urea 25 kg" style={{ height: 120, width: 'auto' }} />
          <div><div className="cap uppercase tracking-[.08em] font-bold" style={{ color: 'var(--green)' }}>Vital Urea</div><div className="display text-[24px]">25 kg, a smaller bag than plain urea</div></div>
        </div>
        <div className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 mt-5 small">
          <div className="cap">on the label</div><div><span className="num text-[26px]" style={{ color: 'var(--navy)' }}>8.0 kg N</span><br />+ at least 3.25 kg of sulfur in the same granules</div>
          <div className="cap">how it is released</div><div>over several days<br /><span className="muted">Release starts after the first irrigation, not all at once. Nitrogen still inside the coating cannot yet be lost.</span></div>{/* D-151: was "metered over 7–18 days" / "released while there is a root ready to take it. What is still inside the granule cannot be lost yet" */}
        </div>
        <svg viewBox="0 0 300 70" width="100%" className="mt-3" aria-hidden="true">
          <rect x="0" y="0" width="300" height="70" fill="#fff" rx="6" />
          {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={10 + i * 20} y="10" width="14" height="22" rx="3" fill="var(--green)" style={{ opacity: on ? 1 : 0, transition: rm ? 'none' : `opacity .3s ease ${0.2 + i * 0.09}s` }} />)}
          <text x="12" y="50" fontSize="11" fill="var(--muted)">released over several days,</text><text x="12" y="64" fontSize="11" fill="var(--muted)">depending on climate and application method</text>
        </svg>
      </div>
    </div>
  )
}

export default function VitalUrea() {
  const wheat = WHEAT_PLAN.filter(r => r.slug === 'vital-urea')
  const { ref, inView } = useInView({ threshold: 0.15 })
  const rm = useReducedMotion()
  const on = inView || rm
  return (
    <div>
      <section style={{ background: 'linear-gradient(180deg, var(--green-soft), var(--sand))' }}>
        <div className="wrap py-8 lg:py-12 grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
          <div>
            <p className="cap"><a href="#/products">VAN brands</a> / Nitrogen / Vital Urea</p>
            {/* D-135: was "Nitrogen · Hero product · VAN exclusive". Revert: restore that text. */}
            <span className="eyebrow mt-2">Nitrogen · Flagship product</span>
            <h1>Vital Urea</h1>
            <p className="display text-[clamp(22px,2.2vw,28px)] mt-2" style={{ color: 'var(--green)' }}>Sulfur coated urea. N 32% min · S 13% min</p>{/* L1 7 Nov 2026 (m10): was "Sulfur Coated Urea"; the site's form is "sulfur coated urea" */}
            {/* D-140: the last clause was "and the sulfur itself conditions the root zone, temporarily
                acidifying it to unlock fixed phosphorus and zinc." Revert: restore it. */}
            <p className="lead mt-4">Vital Urea is urea coated with sulfur. Its declared analysis is at least 32% nitrogen and 13% sulfur. In Pakistan’s hot, alkaline soils, a large share of the nitrogen in plain urea is lost before the crop can use it. The sulfur coating releases Vital Urea’s nitrogen over several days after the first irrigation, instead of all at once. As the sulfur oxidises, it lowers the pH around the granule, which may make nearby phosphorus and zinc more available to the crop.</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {/* D-130: was "Broadcast" and "Sowing / basal + top-dress". Revert: restore those 2 chips
                  with MethodIcon method="Broadcast" on the first.
                  D-139: "Drill at sowing or side-dress" became "Broadcast, drill or side-dress" (owner, 24 Sep
                  night: broadcasting is fine too). Revert: restore the D-130 text. */}
              <span className="chip chip-sm" style={{ cursor: 'default' }}><MethodIcon method="Drill" size={18} />Drill, side-dress or broadcast</span>
              <span className="chip chip-sm" style={{ cursor: 'default' }}>Apply at the earliest stage · never fertigate</span>
              <span className="chip chip-sm" style={{ cursor: 'default' }}>Patent No. 144684 · PS 217-2023</span>
            </div>
            <div className="mt-5"><ProductSoilStrip product={productBySlug('vital-urea')!} /></div>
            <div className="flex flex-wrap gap-3 mt-5">
              <WaButton href={wa('Hello VAN. I’d like to order Vital Urea (25 kg bags). Quantity and district:')} lg>Order on WhatsApp</WaButton>
              <a className="btn btn-ghost btn-lg" href="#/verify">Verify a bag</a>
            </div>
          </div>
          <div className="flex justify-center"><img src={PACK_PNG.urea} alt="Vital Urea, 25 kg bag" style={{ height: 'clamp(300px, 36vw, 440px)', width: 'auto', filter: 'drop-shadow(0 20px 30px rgba(20,35,26,.25))' }} /></div>
        </div>
      </section>

      <section className="wrap sec-tight grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[['32% N · 13% S', 'Declared analysis: at least 8.0 kg of nitrogen and 3.25 kg of sulfur in every 25 kg bag.'], ['Released over several days', 'The nitrogen is released over several days after the first irrigation, not all at once.'], ['No. 144684', 'Pakistan patent No. 144684 on the combination of the 2 coating materials.'], ['PS 217-2023', 'Made to a Pakistan Standards and Quality Control Authority (PSQCA) standard, under licence CM/L-4126/2025. Each batch is tested before dispatch in LAB 336, VAN’s own laboratory.']].map(([v, l]) => (
          <div key={v} className="panel p-5"><div className="num text-[clamp(26px,2.4vw,32px)]" style={{ color: 'var(--navy)' }}>{v}</div><p className="small muted mt-2">{l}</p></div>
        ))}
      </section>

      {/* D-196, 27 Sep 2026: the flagship block, a grower's question first. */}
      <section className="wrap sec-tight"><Flagship slug="vital-urea" /></section>
      {/* D-207, 27 Sep 2026 */}
      <section className="wrap sec-tight"><ApplicationMethods slug="vital-urea" compact /></section>

      <section className="wrap sec">
        {/* D-325, 4 Nov 2026: FAO 2023. Was "Only about 25% of applied nitrogen ends up in Pakistan’s crops." and bars 25/72 (Lassaletta et al. 2014). */}
        <SectionHead eyebrow="The problem" title="Pakistan’s nitrogen use efficiency was about 29% in 2023" tone="soil" />
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          <div className="grid gap-4">
            <p>Nitrogen use efficiency is the share of all nitrogen added to cropland that is taken out in the harvested crop. In 2023, about 29 kg of every 100 kg of nitrogen added to Pakistan’s cropland was taken out in the harvested crop, according to FAO estimates.</p>
            {/* Tahir 9 Nov 2026: denitrification, was nitrification */}
            <p>In Pakistan’s soils, nitrogen from urea is lost through volatilisation, denitrification and leaching. These processes act only on nitrogen that is dissolved in the soil water: volatilisation loses it to the air as ammonia, and leaching loses it to water. A granule of plain urea dissolves all at once, in ground that is hot and alkaline. Nitrogen still inside a coated granule has not yet dissolved, so it cannot yet be lost.</p>
            <p className="muted">The national case for moving away from plain urea, with its sources, is in <a href="#/knowledge">the national picture section of VAN’s Knowledge pages</a>.</p>
          </div>
          <div ref={ref} className="panel p-5">
            <div className="font-bold">Efficiency in 2023: about 29% in Pakistan, against about 71% in the United States</div>
            <p className="cap">Nitrogen taken out in the harvested crop as a share of all nitrogen added to cropland, 2023</p>
            {[['Pakistan', 29, 'var(--gold)'], ['United States', 71, 'var(--green)']].map(([n, v, c]) => (
              <div key={n as string} className="mt-4">
                <div className="flex justify-between small"><span className="font-semibold">{n}</span><span className="num">about {v}%</span></div>
                <div className="h-6 rounded-md mt-1" style={{ background: 'var(--sand-2)' }}><div className="h-6 rounded-md" style={{ width: on ? `${v}%` : 0, background: c as string, transition: rm ? 'none' : 'width 1.1s cubic-bezier(.2,.8,.2,1)' }} /></div>
              </div>
            ))}
            <p className="cap mt-4" style={{ borderTop: '1px solid var(--line)', paddingTop: 8 }}>Source: FAOSTAT, Cropland Nutrient Balance, December 2025 release (2023, FAO estimates).</p>
          </div>
        </div>
      </section>

      {/* D-130, 24 Sep 2026: the soil case. Figures are the site's own Punjab survey (soilLens.ts,
          districtSoil.ts: all 36 district means above pH 7.5 and below 0.86% organic matter, checked
          by script), the owner's brief, and the sources listed. Revert: delete this section. */}
      <section className="sec" style={{ background: 'var(--soil-soft)' }}><div className="wrap">
        <SectionHead eyebrow="Punjab soil, urea and sulfur" title="Punjab soil samples from about 2016 to 2018: most were alkaline and low in organic matter, and none was tested for sulfur" tone="soil" lead="The Punjab soil testing programme analysed 770,160 samples from 36 districts, collected in about 2016 to 2018. The first 3 figures below come from those samples. The 4th comes from the Fertilizer Review 2024-25 of the National Fertilizer Development Centre (NFDC)." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            ['96.1%', 'of samples were above pH 7.5', 'All 36 district averages were above pH 7.5, and 69.1% of samples were above pH 8.'],
            // Tahir 7 Nov 2026 (KN-9): was 'of samples were below 0.86% organic matter, Punjab’s working threshold for low organic matter'
            ['90.2%', 'of samples had less than 0.86% organic matter, the level below which Punjab’s soil laboratories rate organic matter as low', 'Average organic matter across all samples was 0.61%, and all 36 district averages were below 0.86%.'],
            ['0', 'of 770,160 samples were tested for sulfur', 'Each sample was tested for 13 properties, and sulfur was not one of them. Because sulfur was not measured, these soil reports could not show a sulfur shortage or support a recommendation to apply sulfur.'],
            // L2 fact check 9 Nov 2026 (W3): was 'nitrogen to phosphorus used in Pakistan ...'.
            ['3.68 to 1', 'nitrogen to phosphate (N to P₂O₅) used in Pakistan, against 2 to 1 recommended', 'Source: NFDC Fertilizer Review 2024-25. Pakistan’s fertiliser use is heavily weighted towards nitrogen. The review does not report sulfur as a nutrient, so it gives no figure for sulfur use.'],
          ].map(([v, k, t]) => (
            <div key={k} className="panel p-5"><div className="num text-[clamp(26px,2.4vw,32px)]" style={{ color: 'var(--soil)' }}>{v}</div><div className="font-bold small mt-1">{k}</div><p className="small muted mt-2">{t}</p></div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          {/* Tahir 7 Nov 2026 (RP-PO-7): the India sulfur-testing panel and its Shukla et al. (2021) source line removed (India is a warning, not a benchmark).
              Was: <p className="panel p-5 small"><b>Sulfur testing in India.</b> Soils in India are tested for sulfur, ... (Shukla et al., 2021). ...</p> */}
          {/* L1 7 Nov 2026 (B2): was "<b>Not all soils in Pakistani Punjab lack sulfur.</b> A 2003 study ...", which implied most do */}
          <p className="panel p-5 small" style={{ background: 'var(--gold-soft)' }}><b>Some Punjab soils have been found to have enough sulfur:</b> a 2003 study of 45 samples from Punjab’s Kallar tract found sulfur adequate in most of them (Ahmad et al., 2003).</p>
        </div>
        <p className="cap mt-4">Soil figures: Punjab soil testing programme, 770,160 samples from 36 districts, about 2016 to 2018. National fertiliser ratio: NFDC Fertilizer Review 2024-25.</p>
      </div></section>

      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        {/* D-316, 26 Oct 2026. Tahir: "The Khaliqabad, change it" (the growth outcome breaks the 28 Sep ruling: the trials
            show the product in use, no result is printed). Was: title "One 25 kg bag stood against a 50 kg bag of plain
            urea, and the growth was comparable."; lead ended "... assessments at 12 and 24 days. The comparison was
            deliberately uneven."; and the paragraph under the 2 bags began "What the 5 sites recorded: comparable crop
            growth, shoot length, colour, leaf number, vigour, from the 25 kg bag on roughly a third of the applied
            nitrogen, with better uniformity of plant height, grain formation and milk-line development also observed.
            Cob size and length showed no difference. And what this was not: ..." */}
        {/* Tahir 7 Nov 2026 (PR-13): 1 word, "trial"; contact lines merged; the 2-bag drawing moved to "What is in a bag of Vital Urea". What was observed is still to come from Tahir. */}
        {/* Tahir 10 Nov 2026 (EN-3): harvest in December 2023. Was "from application in August to harvest in October". */}
        <SectionHead eyebrow="Field use" title="Khaliqabad, 2023: an observational maize trial with Rafhan Maize Products" lead="The trial ran on 5 grower sites chosen by Rafhan’s agronomy team, from application in August to harvest in December 2023. It was observational: it was not replicated or randomised, and no independent yield measurement was recorded." />
        {/* 11 Sep 2026 · Tahir's ruling. This is the only client named anywhere on the site, against a
            partner page that promises names are not published. He chose to keep it and state the
            exception rather than take the name off, so the exception is stated in both places: here,
            and in PARTNER.firewall. Revert: remove this line and the sentence in site.ts. */}
        {/* D-200, Tahir 27 Sep 2026: the maize trial result, printed with the trials named. His words: "in corn
            we have proven the yield increase from 5% to 15% even when we are giving crop less nitrogen".
            Comparison as he ruled: 25 kg Vital Urea per application against 50 kg urea per application, the
            same number of applications. Rafhan 2022 joint; Descon Research Farm 2024 joint; the 2025 trial
            independent. Rafhan and Descon agreed to be named; the 2025 partner is not named (D-213, Tahir
            27 Sep 2026: "rest of 2 agreed"). Revert: delete this block and restore the sentence above. */}
        {/* D-316, 26 Oct 2026: brought back to Tahir's rulings of 27 and 28 Sep 2026 (memory: flagship claims).
            27 Sep: 25 kg Vital Urea in place of 50 kg urea ONCE in the crop cycle, at the first application,
            the rest of the nitrogen programme unchanged; VAN never says every urea bag is replaced. 28 Sep: the
            3 trials are evidence that the product exists and is used, not a yield claim; "5 to 15% more grain"
            dropped everywhere; trials named with their years only; Rafhan's year is 2023, not 2022.
            Was: eyebrow "3 maize trials, 2022 to 2025"; h3 "Half the weight at every application, and 5 to 15%
            more grain."; "applied in place of 50 kg of urea at each application, the same number of times
            through the season. Yield rose by 5 to 15%, with less nitrogen applied. ..."; Rafhan row 2022; caption
            "The 5 to 15% is the range across the 3 trials. ..." */}
        <div className="panel p-5 lg:p-6 mb-6" id="maize-trials">
          <span className="eyebrow">3 maize trials, 2023 to 2025</span>
          <h3 className="mt-1 max-w-[34ch]">Maize trials that used Vital Urea</h3>
          <p className="small mt-3 max-w-[110ch]">Vital Urea was used in the 3 maize trials below. Summaries are available on request from partner@van.com.pk. For a purchasing decision, ask VAN for replicated trial data; VAN will share any it holds.</p>
          <div className="panel overflow-x-auto tbl-scroll mt-3"><table className="tbl" style={{ minWidth: 520 }}>
            <thead><tr><th>Trial</th><th>Year</th><th>Run by</th></tr></thead>
            <tbody>
              <tr><td>Rafhan Maize Products, contract farms</td><td className="num">2023</td><td>Joint, VAN and Rafhan</td></tr>
              <tr><td>Descon Research Farm</td><td className="num">2024</td><td>Joint, VAN and Descon</td></tr>
              {/* Tahir 10 Nov 2026 (EN-6): a partner company's commercial trial, not named, no yield. Was: 'Independent partner farm, not named' · 2025 · 'Independent'. */}
              <tr><td>A partner company’s commercial trial, Sheikhupura</td><td className="num">2025</td><td>The partner company</td></tr>
            </tbody>
          </table></div>
          {/* L1 7 Nov 2026 (m20): the caption 'Trial summaries are available on request from partner@van.com.pk.' removed; the paragraph above says it */}
          <p className="cap mt-2" style={{ color: 'var(--rust-text)' }}>Rafhan Maize Products and Descon Research Farm, VAN’s research partners, are named with their agreement.</p>{/* Tahir 7 Nov 2026 (CO-12): research partners, and no line about withheld names. */}
        </div>
      </div></section>

      {/* D-130, 24 Sep 2026: new section, the product as the owner's brief states it. Revert: delete. */}
      <section className="wrap sec">
        <SectionHead eyebrow="The product" title="What is in a bag of Vital Urea" lead="Each bag contains urea granules coated with finely ground elemental sulfur, which is held on by a binder." />{/* Tahir 7 Nov 2026 (PR-16): the patent covers the combination of the 2 coating materials */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-4 items-start">
          <div className="panel p-5">
            <table className="tbl">
              <tbody>
                {[
                  ['Bag', '25 kg'],
                  ['Declared analysis', '32% nitrogen and 13% sulfur: at least 8.0 kg of nitrogen and 3.25 kg of sulfur in every bag'],
                  // Tahir 10 Nov 2026 (EN-9): the unit audit failed 'under 45 microns' (no 350 sieve in ASTM E11 or Tyler; passing a sieve does not bound every particle); Tahir chose to keep '350 mesh or finer' only.
                  ['Sulfur', 'Elemental sulfur ground to 350 mesh or finer'],
                  ['Coating material A', 'A carbohydrate (starch-based) binder that holds the sulfur on the granule'],
                  ['Coating material B', 'The release-control component'],
                  ['On the pack', 'Slow Release Fertilizer'],
                ].map(([k, v]) => <tr key={k}><td className="font-semibold">{k}</td><td>{v}</td></tr>)}
              </tbody>
            </table>
            <p className="small mt-3">The patent covers the combination of the 2 coating materials. VAN states that the process uses little energy and is safe to handle, and that the coating is biodegradable and leaves no residue that reacts harmfully with the soil, its minerals or the crop.</p>
            {/* Tahir 7 Nov 2026 (PR-17): the kilograms are not explained; the 80% purity and 16% coating sentences removed. */}
            <p className="small mt-3"><b>Sulfur content.</b> Under PS 217-2023, each 25 kg bag is registered to contain 13% sulfur. Each bag carries about 4 kg of fine-particle sulfur of market grade. The certificate of analysis for each batch reports the measured elemental sulfur: the most recent figure was 13.27%, on batch VU25186.</p>
          </div>
          <div className="panel p-5">
            <div className="font-bold">History of Vital Urea</div>
            <ol className="mt-3 grid gap-3 small">
              {[
                // D-138: was 'VAN starts work on coated products. More than 200 combinations are tested, including biological, nutrition-based and biostimulant coatings, before this one is chosen.' Revert: restore it.
                // D-181, Tahir 26 Sep 2026: "change them to your list". Were 2012 'VAN starts work on coated products...' and 2014 'The standard for VAN's sulfur coated urea is approved.'
                ['2012', 'VAN begins work on coated products.'],   // Tahir 10 Nov 2026 (EN-12): 2012 added; "many" kept, no count.
                // Tahir 10 Nov 2026 (PR-N15): ", now sold as Vital Potash" added. Was '... its first product is boron-coated nitro potash. VAN has tested ...'
                ['2014', 'VAN adds a coating line to the plant; its first product is boron-coated nitro potash, now sold as Vital Potash. Since then VAN has tested many coating combinations, including biological, nutrition-based and biostimulant coatings, and chose the Vital Urea coating from them.'],   // L1 editor 10 Nov 2026 (M2): 'this one' named as the Vital Urea coating. Was '... VAN has tested many coating combinations since, ... and chose this one from them.'
                ['2019', 'VAN launches Vital Urea.'],   // D-177, Tahir 26 Sep: 2019 is the launch. Was 'The product is registered, and has been ever since.'
                // Tahir 10 Nov 2026 (EN-4): the patent term added. Was 'Pakistan patent No. 144684 is granted, and VAN holds the patent.' (D-175: "granted", was "completed", Tahir 26 Sep)
                // L1 fix 10 Nov 2026 (Q4): 'VAN holds the patent' restored; the EN-4 ruling added the term only and did not rule this clause out (VAN holds patent 144684 by assignment).
                ['2026', 'Pakistan patent No. 144684 is granted, and VAN holds the patent. Its 20-year term runs from 9 December 2019 to 2039.'],
                // Tahir 10 Nov 2026 (EN-8): the bag count, on this page only (no partner named; the company profile keeps its rule against sales quantities).
                ['Now', 'Vital Urea is made under PSQCA standard PS 217-2023, licence CM/L-4126/2025. More than 500,000 bags of VAN’s sulfur coated urea have been sold since 2019, under VAN’s brand and partners’ brands.'],   // Lead 10 Nov 2026 (L3-2), from the Engro sources (the total includes partner sales; no partner named). Was 'More than 500,000 bags have been sold since 2019.'
              ].map(([y, t]) => <li key={y} className="grid grid-cols-[56px_1fr] gap-3"><span className="num font-bold" style={{ color: 'var(--green)' }}>{y}</span><span>{t}</span></li>)}
            </ol>
          </div>
        </div>
        {/* Tahir 7 Nov 2026 (PR-13): the 2-bag drawing moved here from the field-use section, with this title. */}
        <p className="font-bold mt-6 mb-3">Nitrogen declared on each bag: 23 kg in a 50 kg bag of plain urea, released at once; 8.0 kg in a 25 kg bag of Vital Urea, released over several days</p>
        <TwoBags />
      </section>

      {/* D-130, 24 Sep 2026: the release mechanism now follows the owner's own description of this
          coating (water breaks down the carbohydrate binder and the fine sulfur disperses). The old
          first panel described a molten-sulfur shell with pores and micro-cracks, which is a different
          product. Old caption about a "schematic" with a demand curve deleted: no such chart was on the
          page. Revert: restore the section from /root/van/v53-pristine-backup or the D-130 entry. */}
      <section className="wrap sec">
        <SectionHead eyebrow="The coating" title="How the coating releases nitrogen" lead="The coating does not react in a dry bag or on dry ground. Release starts at the first irrigation or rain." />
        <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-4 items-start">
          {/* D-201, Tahir 27 Sep 2026: the whole page is qualitative on release; the day chart came off. The
              flagship block above carries the picture with no day figures. Revert: put <ReleaseChart /> back. */}
          <div className="grid gap-4">
            {/* Tahir 28 Sep 2026, settled PR-5 (L2 fact check 9 Nov 2026, W7): no day figures; was 'release starts within 1 to 2 days after water reaches the granule'. */}
            {/* Tahir 10 Nov 2026 (EN-1, his 1 Oct 2026 correction): the sulfur stays where the granule was placed. Was: 'This releases the fine elemental sulfur, which spreads into the soil around the granule instead of staying on it, and the urea underneath starts to dissolve.' */}
            {/* L1 editor 10 Nov 2026 (m2): 'release' named as nitrogen release, also in Sources ('Nitrogen release timing'). Was 'In VAN’s field observation, release starts ...'. */}
            <p className="panel p-5 small">When water reaches the granule, the carbohydrate binder breaks down and the urea inside starts to dissolve. The nitrogen moves into the soil. The fine elemental sulfur stays where the granule was placed and oxidises there. In VAN’s field observation, nitrogen release starts soon after water reaches the granule and continues over the following days. It is faster under good irrigation and slower when the ground is dry or cold.</p>
            <p className="panel p-5 small">3 factors make the release faster or slower. Release cannot start until water reaches the granule. Release is faster in warm soil, because the reactions run faster. A granule crushed during spreading has lost its coating and behaves like plain urea.</p>
            <p className="panel p-5 small" style={{ background: 'var(--gold-soft)' }}><b>Limits of the coating.</b> A coating does not stop volatilisation. It reduces how much nitrogen is open to volatilisation at any one time. Once released into hot alkaline soil, the nitrogen from Vital Urea behaves like nitrogen from any other source. Placement and irrigation timing still matter, and no coating replaces either.</p>
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: 'var(--sky)' }}><div className="wrap">
        <SectionHead eyebrow="Why sulfur" title="Of 3 ways to reduce nitrogen loss from urea, only a sulfur coating also supplies a nutrient" tone="navy" />
        <div className="grid md:grid-cols-3 gap-4">
          {[['Polymer coating', 'accurate, inert', 'A polymer coating controls release accurately but adds no nutrient, and the polymer stays in the soil after the nitrogen has gone.', false], ['Chemical inhibitors', 'slow soil reactions after release', 'Chemical inhibitors do not slow the release of nitrogen. They slow the soil reactions that act on the nitrogen once it has dissolved. They are imported, they are sensitive to dose and temperature, and they add no nutrient of their own.', false], ['Sulfur coating', 'VAN’s choice', 'A sulfur coating controls release. Of the 3 methods, only the sulfur coating is made of a nutrient in its own right and reacts chemically in the soil.', true]].map(([t, k, x, chosen]) => (
            <div key={t as string} className="panel p-5" style={chosen ? { borderColor: 'var(--green)', borderWidth: 2 } : undefined}>
              <span className="eyebrow" style={{ color: chosen ? 'var(--green)' : 'var(--muted)' }}>{k as string}</span>
              <h3>{noStop(t as string)}</h3>
              <p className="small mt-3">{x as string}</p>
            </div>
          ))}
        </div>
              </div></section>

      <section className="wrap sec">
        {/* D-130: heading was "Why the result is not “nitrogen plus sulfur.”" (an X-is-not-Y line) and the lead
            was "2 pictures. The shell geometry is what makes the sulfur work, and the sulfur is what lets
            the nitrogen finish as yield." Revert: restore both. */}
        <SectionHead eyebrow="The chemistry" title="How the coating’s sulfur becomes available, and why the plant needs it" />
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="panel p-5">
            <h4>Elemental sulfur is oxidised to sulfate only at its surface, so finely ground sulfur, which has a larger surface area, oxidises faster</h4>
            <p className="cap mt-1">The same mass of elemental sulfur in 3 forms. Oxidation to sulfate happens where the soil touches the sulfur.</p>
            <svg viewBox="0 0 320 110" width="100%" className="mt-3" aria-hidden="true">
              <circle cx="55" cy="55" r="34" fill="#D9A21B" /><text x="55" y="102" textAnchor="middle" fontSize="11" fill="var(--muted)">1 lump</text>
              {[[140, 40], [170, 40], [155, 66], [125, 66], [185, 66]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="11" fill="#D9A21B" />)}<text x="155" y="102" textAnchor="middle" fontSize="11" fill="var(--muted)">granules</text>
              <circle cx="265" cy="55" r="30" fill="#fff" stroke="#D9A21B" strokeWidth="7" /><circle cx="265" cy="55" r="22" fill="#E6EEE8" /><text x="265" y="59" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--navy)">urea</text><text x="265" y="102" textAnchor="middle" fontSize="11" fill="var(--muted)">fine, on the granule</text>
            </svg>
            {/* Tahir 10 Nov 2026 (EN-1): was '... 350 mesh or finer, and water spreads it off the granule into the soil.' EN-9: 'under 45 microns' added, then removed after the unit audit failed it (Tahir 10 Nov 2026). UNIT AUDIT DONG (the 45 micron figure). Bremer line kept as ruled. EN-9b, 10 Nov 2026: Bremer line deleted; was 'Rapid oxidation needs particles that are finer than about 20 µm and well dispersed (Bremer, 2022), so a finer grind oxidises faster.' */}
            {/* L1 editor 10 Nov 2026 (m1): the sulfur, not the grind, oxidises. Was 'A finer grind oxidises faster.' */}
            <p className="small mt-3">Soil bacteria oxidise sulfur only at the surface of each particle. For the same kilogram of sulfur, halving the particle size doubles the surface area on which the bacteria act. VAN grinds its sulfur to 350 mesh or finer, and the fine sulfur stays where the granule was placed and oxidises there. Finer sulfur particles oxidise faster. The reaction is biological, and it runs 3 to 4 times faster for every 10 °C rise in soil temperature (Janzen & Bettany, 1987, as summarised by Degryse et al., 2016). Warm soil therefore speeds up sulfur oxidation, but it also speeds up ammonia loss from urea left on the soil surface, which is why placement below the surface matters. The reaction is 2 S⁰ + 3 O₂ + 2 H₂O → 2 SO₄²⁻ + 4 H⁺: every 2 atoms of sulfur release 4 protons.</p>
          </div>
          <div className="panel p-5">
            <h4>When sulfur is short, the plant turns less of the nitrogen it takes up into protein</h4>
            <p className="cap mt-1">Nitrogen and sulfur are built into protein together. When the plant cannot take up enough sulfur, the nitrogen it has absorbed builds up without becoming protein.</p>
            <p className="small mt-3">Cysteine and methionine, 2 of the amino acids that make up protein, contain sulfur. When sulfur runs short, protein formation slows and the nitrogen the plant has taken up accumulates unused, as free amino acids such as asparagine, arginine and glutamine (Yu et al., 2018). On sulfur-deficient soil, 1 study found that adding sulfur raised wheat’s nitrogen use efficiency, as defined in that study, by more than 20% (Yu et al., 2021). This is a different measure from the national efficiency figure of 29%. On a poor-fertility site in Argentina, wheat’s nitrogen recovery (the share of applied nitrogen taken up by the crop) was 0.15 without sulfur and 0.32 with sulfur (Arata et al., 2017).</p>
            {/* D-195, Tahir 27 Sep 2026: the "12 to 15 kg N per kg S" ratio came off the page (INTERNAL in the
                brand master, a derivation). Revert: the v60 zip. */}
            {/* Tahir 7 Nov 2026 (PR-18): stated as the expected effect, with a bridge to the 1 laboratory study; the limit sentence below is deleted. */}
            <p className="small mt-3">As the sulfur oxidises, it releases protons that lower the pH of the soil around the granule. This may make phosphorus and zinc near the granule more available to the crop. This is the expected effect; in 1 laboratory study it was seen in alkaline soil only with an inoculant (Mattiello et al., 2017). The effect is limited to a zone around each granule during the days it is releasing nitrogen.</p>
            {/* L2 fact check 9 Nov 2026 (W2): source added, the live page cited Mattiello et al. (2017) for 12% and 20.9%. */}
            {/* Tahir 10 Nov 2026 (EN-2): the IPNI finding replaces 'Alkaline soil slows sulfur oxidation. In a laboratory comparison, elemental sulfur oxidised less in a slightly alkaline soil than in an acidic one: 12% oxidised in the alkaline soil, against 20.9% in the acidic soil (Mattiello et al., 2017).' The Mattiello inoculant sentence above is unchanged. The last sentence (VAN is researching ...) is left for Tahir: it no longer fits. */}
            {/* Lead 10 Nov 2026 (L3-3), from Zhao et al. 2015 (the paper's own finding): was 'elemental sulfur oxidised faster in alkaline soil than in acidic soil'. */}
            <p className="small mt-3 p-3 rounded-lg" style={{ background: 'var(--gold-soft)' }}><b>Limits of the evidence.</b> The sulfur oxidation study used 10 Australian cropping soils, not soils from Pakistan; in those soils, elemental sulfur oxidised faster as soil pH rose (Zhao et al., 2015). The acidity that forms around the granule as the sulfur oxidises does not change a soil test result.</p>{/* L1 editor 10 Nov 2026 (M3): the limit stated (Australian soils, not Pakistani) and 'The effect' named as the acidity. Was 'Across 10 Australian cropping soils, ... (Zhao et al., 2015). The effect around the granule does not change a soil test result.' */}{/* Tahir 10 Nov 2026 (EN-2b): 'VAN is researching how to raise the oxidation rate of sulfur in alkaline soil.' removed; 'Across 10 soils' made 'Across 10 Australian cropping soils'; the IPNI summary replaced by the paper itself (full reference in the sources). */}
          </div>
        </div>
      </section>

      {/* D-130, 24 Sep 2026: crop sulfur removal per acre. Revert: delete this section. */}
      <section className="wrap sec">
        <SectionHead eyebrow="Sulfur removal by crops" title="1 bag of Vital Urea supplies 3.25 kg of sulfur per acre, less than the published values for the sulfur that wheat, maize, sugarcane and cotton take up or remove" lead="1 bag of Vital Urea per acre supplies 3.25 kg of sulfur. By a published reference value, a wheat crop of about 46 maunds per acre takes up about 8.9 kg of sulfur per acre in its grain and straw, so 1 bag does not cover the crop’s sulfur uptake for the season. The bag puts sulfur into the root zone beside the nitrogen, at the time the nitrogen is applied." />
        <div className="panel overflow-x-auto">
          <table className="tbl">
            <thead><tr><th>Crop</th><th>Sulfur taken up or removed by the crop</th><th>Source, as published</th></tr></thead>
            <tbody>
              {S_REMOVAL.map(([c, v, src]) => <tr key={c}><td className="font-semibold">{c}</td><td className="num">{v}</td><td className="small muted">{src}</td></tr>)}
              <tr style={{ background: 'var(--green-soft)' }}><td className="font-semibold">1 bag of Vital Urea</td><td className="num">3.25 kg S per acre, supplied</td><td className="small muted">13% of 25 kg, the registered analysis</td></tr>
            </tbody>
          </table>
        </div>
        <p className="cap mt-3">Per-acre figures are the published per-hectare figures divided by 2.471. Uptake is the sulfur the whole crop takes in; removal is the sulfur taken out in the harvested crop. Both vary with yield, variety and soil. These are published reference values at the yields stated, not measurements from Pakistani fields.</p>
      </section>

      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SectionHead eyebrow="Coated granule compared with a blend" title="Nitrogen and sulfur stay together because every granule is coated" lead="The lower pH around the granule and the sulfur supplied beside the nitrogen, described above, depend on the nitrogen and the sulfur being in the same place at the same time. A blend of separate granules cannot ensure that." />
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-4 items-start">
          <div className="panel p-5">
            <div className="font-bold">A blend can separate in the bag, but the nitrogen and sulfur in a coated granule cannot.</div>
            <p className="cap mt-1">Blends separate by granule size and density, and the separation is more severe when granule sizes vary more (Antille et al., 2013).</p>
            <svg viewBox="0 0 300 90" width="100%" className="mt-3" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, i) => <circle key={i} cx={20 + (i % 9) * 14} cy={i < 9 ? 30 : 60} r={i < 9 ? 7 : 4} fill={i < 9 ? '#BEC5BB' : '#D9A21B'} />)}
              <text x="75" y="84" textAnchor="middle" fontSize="11" fill="var(--muted)">a blend, settled by size</text>
              {Array.from({ length: 12 }).map((_, i) => <g key={i}><circle cx={180 + (i % 6) * 20} cy={i < 6 ? 30 : 58} r="8" fill="#D9A21B" /><circle cx={180 + (i % 6) * 20} cy={i < 6 ? 30 : 58} r="5" fill="#E6EEE8" /></g>)}
              <text x="230" y="84" textAnchor="middle" fontSize="11" fill="var(--muted)">every granule coated</text>
            </svg>
            <p className="small mt-3">The fine sulfur on each granule gives the large surface shown in the chemistry section above. If the same amount of sulfur were applied as 1 lump, it would still be in the soil the next season.</p>
          </div>
          {/* Tahir 10 Nov 2026 (PR-N14): uniformity of the coating. Was 'VAN records the uniformity of each batch.' */}
          <p className="panel p-5"><b>Batch records.</b> VAN records the uniformity of the coating in each batch. The declared analysis of 32% N and 13% S is registered under PS 217-2023. Coating weight is measured for each batch: send the batch number, and VAN sends the coating weight with the certificate of analysis.</p>
        </div>
      </div></section>

      <section className="wrap sec">
        {/* Tahir 10 Nov 2026 (EN-5): 2 published studies that used Vital Urea added, title and journal only, no yield figure (this reverses D-320 on this page only).
            The journal prints 'Nitrgenous' in the 2025 title; cited here with the correct spelling.
            Was title: "Published research on coated urea and elemental sulfur. None of these studies tested Vital Urea." */}
        <SectionHead eyebrow="The evidence" title="Published research: 2 studies that used Vital Urea, and 3 studies of other coated urea and elemental sulfur" />{/* L1 7 Nov 2026 (m23): heading covers the elemental sulfur study */}{/* D-320, 27 Oct 2026 (Tahir: remove the published 2024 maize trial everywhere): its lead line and panel removed. */}
        <div className="font-bold mt-3">Published studies that used Vital Urea</div>
        <div className="grid md:grid-cols-2 gap-4 mt-3">
          {/* Lead 10 Nov 2026 (L3-10), from the journal's own record: DOI added to Anjum et al. 2024. */}
          {[['Impact of Vital Urea (sulfur-coated urea) and plain urea with sulfur on growth and yield of wheat', 'Anjum, T., Umair, A., et al. (2024). Journal Plantarum 6(2), 79–87. doi:10.46662/plantarum.v6i2.113.'], ['Efficacy evaluation of different doses of nitrogenous fertilizers on the growth and yield of maize (Zea mays)', 'Umair, A., Manzoor, M., et al. (2025). Planta Animalia 4(3), 129–135. doi:10.71454/PA.004.03.0126.']].map(([h, t]) => (
            <div key={h} className="panel p-5"><div className="font-bold">{h}</div><p className="small muted mt-2">{t}</p></div>
          ))}
        </div>
        <div className="font-bold mt-6">Studies of other products. None of these 3 studies tested Vital Urea.</div>
        <div className="grid md:grid-cols-3 gap-4 mt-3">
          {[['In a rice study, sulfur coated urea raised nitrogen recovery compared with plain urea.', 'Zhao, Gao & Gao (2025), Agriculture 15(14):1554. This 2-year field study in rice reported higher nitrogen recovery efficiency, agronomic efficiency and grain yield with sulfur coated urea than with plain urea.'], ['In Pakistan, a wheat study found that coated urea improved growth and yield and reduced nitrogen losses.', 'Ghafoor et al. (2021), Environmental Science and Pollution Research. In wheat, in an arid environment in Pakistan, coated urea sources improved growth, yield and nitrogen use efficiency, as defined in that study, and reduced nitrogen losses.'], ['In 1 study, elemental sulfur with an inoculant raised phosphorus availability in calcareous soil.', 'Nadeem, Hanif & Khan (2022), Archives of Agronomy and Soil Science 69(9):1494–1502. Elemental sulfur with a sulfur-oxidising inoculant raised phosphorus availability and improved wheat growth and yield in calcareous soil.']].map(([h, t]) => (
            <div key={h} className="panel p-5"><div className="font-bold">{h}</div><p className="small muted mt-2">{t}</p></div>
          ))}
        </div>
        <details className="panel p-5 mt-4">
          <summary className="font-bold flex justify-between">Full list of sources <span aria-hidden="true">＋</span></summary>
          <ul className="small muted mt-3 pl-5 grid gap-1">{SOURCES.map(s => <li key={s}>{s}</li>)}</ul>
        </details>
      </section>

      <section className="sec" style={{ background: 'var(--green-soft)' }}><div className="wrap">
        <SectionHead eyebrow="In the field" title="Crop plans that use Vital Urea, with the dose per acre" lead="Vital Urea appears in 27 of VAN’s 28 published crop plans (2025 set). The table below shows a sample of them." right={<a className="btn btn-navy" href="#/crops">All 28 crop plans →</a>} />
        {/* D-130, 24 Sep 2026: how to apply, from the owner's brief. Revert: delete this block. */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {[
            // D-139: was ['Drill', 'Put it in the soil', 'Drill it at sowing, or side-dress or band it beside the row. The granule needs soil and water around it to release.']. Revert: restore it.
            // D-207, 27 Sep 2026: drill first. Revert: the D-139 line above.
            // L1 7 Nov 2026 (M6): opens with "Use the method your crop plan gives. Where the plan leaves the choice to you, ..." so the card and the dose table below agree.
            // Tahir 10 Nov 2026 (EN-7): at sowing it can be mixed with the phosphate and drilled with it. L1 editor 10 Nov 2026 (m3): 'it' named as Vital Urea; was '... it can be mixed with the phosphate fertiliser and drilled with it.'
            ['Drill', 'Drill it at sowing', 'Use the method your crop plan gives. Where the plan leaves the choice to you, drill it beside and below the seed, never touching it. At sowing, Vital Urea can be mixed with the phosphate fertiliser and the mixture drilled. If you cannot drill, side-dress it in a band beside the row. Broadcast it only as the last option. The granule needs soil and water around it to release its nitrogen.'],
            ['Side dressing', 'Use it early', 'Apply it at the earliest stage the crop plan allows: the first urea application, or the second. The earlier application is better.'],
            ['Placement', 'Apply it before water', 'Release starts after the first irrigation or rain. Plan the application so that water follows it.'],
            ['Fertigation', 'Never fertigate', 'Do not dissolve it and run it through drip or irrigation water. It is made to release slowly in the soil.'],
          ].map(([m, h, t], i) => (
            <div key={h} className="panel p-5" style={i === 3 ? { background: 'var(--rust-soft)' } : undefined}>
              <div className="flex items-center gap-2 font-bold" style={{ color: i === 3 ? 'var(--rust-text)' : 'var(--green-text)' }}><MethodIcon method={m} size={22} />{h}</div>
              <p className="small mt-2">{t}</p>
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-4 items-start">
          <div className="panel overflow-x-auto">
            <table className="tbl">
              <thead><tr><th>Crop</th><th>Stage</th><th>Dose per acre</th><th>Method</th></tr></thead>
              <tbody>
                {wheat.map((r, i) => <tr key={`w${i}`} style={{ background: 'var(--gold-soft)' }}><td className="font-semibold"><a href="#/crops/wheat">Wheat</a></td><td>{planLabel(r.stage)}</td><td className="num">{doseLabel(r)}</td><td>{planLabel(r.method)}</td></tr>)}
                {FIELD_ROWS.map(([c, s, d, m], i) => <tr key={i}><td className="font-semibold">{c}</td><td>{s}</td><td className="num">{d}</td><td>{m}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="panel p-5">
            <p className="small">The 28 crop plans give the full stage-by-stage nutrition for each crop, with application guidance.</p>
            <a className="btn btn-gold mt-4" href="#/crops">Find your crop’s plan →</a>
          </div>
        </div>
      </div></section>

      {/* L1 7 Nov 2026: m8 GHS written out; m10 "patent" lower case as in PR-16, "Product deck" as on the other product pages; m21 "VAN's research partners"; m22 subject of the sulfur-coating sentence; m26 the recovery measure named; m9 "about 29%" for "~29%" */}
      <section className="wrap sec">
        <SectionHead eyebrow="Registration and quality" title="Registration, pack, safety and quality" />
        {/* D-130: 2 cards added (sulfur grind, registered since 2019) and the grid set to 3 columns.
            Revert: delete the 2 new entries and set lg:grid-cols-4 again. */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[['Registration and standard', 'PSQCA PS 217-2023 · Licence CM/L-4126/2025 · Pakistan patent No. 144684 · launched in 2019'], ['Pack size', '25 kg bag, marked Slow Release Fertilizer'], ['Sulfur', /* Tahir 10 Nov 2026 (EN-9b): '350 mesh or finer' only; the unit audit failed 'under 45 microns' (removed here too, as in the product table and the chemistry paragraph). */ 'Elemental sulfur ground to 350 mesh or finer, held on by a carbohydrate binder with a release-control component'], ['Safety', 'Not classified as hazardous under the Globally Harmonized System of Classification and Labelling of Chemicals (GHS). Store bags sealed, off the floor, in a cool, dry place away from moisture and direct sun (safety data sheet SDS-VAN-001, Rev 3, July 2026).'], ['Quality', 'Every batch is tested before dispatch in LAB 336, VAN’s own laboratory, which is accredited by PNAC (Pakistan National Accreditation Council) to ISO/IEC 17025:2017.'], ['Certificate of analysis', 'On the Verify page, enter the batch number printed on the bag, or send the batch number to VAN, to get the certificate of analysis (the lab report) for that batch, with its measured elemental sulfur figure.']].map(([h, t]) => (
            <div key={h} className="panel p-5"><div className="cap uppercase tracking-[.08em] font-bold">{h}</div><p className="small mt-2">{t}</p></div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <a className="btn btn-ghost btn-sm" href="https://www.van.com.pk/spec-sheets/VAN-TDS-Vital-Urea.pdf" target="_blank" rel="noopener">⬇ Technical data sheet (PDF)</a>
          <a className="btn btn-ghost btn-sm" href="https://www.van.com.pk/sds/VAN-SDS-Vital-Urea.pdf" target="_blank" rel="noopener">⬇ Safety data sheet (PDF)</a>
          <a className="btn btn-ghost btn-sm" href="https://www.van.com.pk/lms/VAN-LMS-Vital-Urea.pdf" target="_blank" rel="noopener">⬇ Product deck (PDF)</a>
          <a className="btn btn-navy btn-sm" href="#/verify">Verify a bag →</a>
        </div>
      </section>

      <section className="wrap sec-tight">
        <div className="panel-navy p-6 lg:p-10 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            {/* D-135: eyebrow was "A VAN flagship. Exclusively ours" and h2 "Vital Urea stays a VAN brand."
                The owner ruled on 24 Sep that Vital Urea is open to own-brand manufacturing. Revert: restore
                both strings and remove the second button.
                Tahir 7 Nov 2026 (PR-1, PR-16): own-brand count is the 22 brands made in VAN's plant; the patent line names what it covers. */}
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>A VAN flagship</span>
            <h2 className="text-[clamp(28px,2.8vw,38px)]">Sell Vital Urea, or have it made under your brand</h2>
            <p className="mt-3" style={{ color: 'rgba(255,255,255,.8)' }}>Vital Urea is protected by Pakistan patent No. {COUNTS.patent} on the combination of the 2 coating materials. Distributors can join VAN’s distribution network and sell Vital Urea in their territory, on terms based on territory and volume. VAN can make any of the {COUNTS.ownBrandOpen} brands made in its plant, including Vital Urea, under a partner’s own brand name.</p>
          </div>
          <div className="flex flex-wrap gap-3"><WaButton href={WA.distributor} lg>Become a distributor →</WaButton><a className="btn btn-gold btn-lg" href="#/partner/brief-to-bag">Own-brand manufacturing →</a></div>
        </div>
        <p className="cap mt-6"><b>Sources.</b> Analysis, standard, licence and patent: the registered technical data sheet (TDS). Release mechanism and coating chemistry: the peer-reviewed studies of other products in the evidence section and the full list of sources. Each study applies to the technology and conditions it tested, and none of them tested Vital Urea. Published studies that used Vital Urea: Anjum et al. (2024) and Umair et al. (2025). Field trial: Khaliqabad 2023, with Rafhan Maize Products.{/* Tahir 10 Nov 2026 (EN-5): was 'the peer-reviewed studies listed in the evidence section. Each study applies to the technology and conditions it tested, and none tested Vital Urea.' */} Efficiency figures: FAOSTAT Cropland Nutrient Balance, December 2025 release, figures for 2023. Soil figures: the Punjab soil testing programme, 770,160 samples. Fertiliser ratio: NFDC Fertilizer Review 2024-25. Sulfur and protein: Yu et al. (2018, 2021), Randall et al. (1981), Arata et al. (2017). Crop sulfur removal: FAO Bulletin 16 (2006), IRRI (2003), Shukla & Lal (2004). Nitrogen release timing: VAN field observation. Storage and safety: safety data sheet SDS-VAN-001, Rev 3, July 2026. Doses: VAN’s published crop plans, 2025 set.</p>
      </section>
    </div>
  )
}
