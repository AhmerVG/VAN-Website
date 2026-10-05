import { Flagship } from '@/components/Flagship'
import { rateLabel, rateUnits, packInfo } from '@/lib/season'
import { useFitWidth } from '@/hooks/useFitWidth'
import { PACK_PNG } from '@/data/assets'
import { WA, wa, COUNTS } from '@/data/site'
import { WHEAT_PLAN } from '@/data/catalogue'
import { useInView, useReducedMotion } from '@/hooks/useInView'
import { WaButton, MethodIcon, SectionHead, productBySlug } from '@/components/bits'
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

const FIELD_ROWS: [string, string, string, string][] = [
  ['Garlic', 'Land preparation', '1 bag (25 kg)', 'Drill at sowing; broadcast if no drill'],
  ['Garlic', 'Germination', '1 bag (25 kg)', 'Broadcast'],
  ['Sesame', 'Germination', '1 bag (25 kg)', 'Side dressing / broadcasting'],
  ['Sesame', 'Early growth', '½ bag (12.5 kg)', 'Side dressing / broadcasting'],
  ['Soybean', 'Land preparation', '½ bag (12.5 kg)', 'Drill at sowing; broadcast if no drill'],
  ['Lentil', 'Land preparation', '½ bag (12.5 kg)', 'Drill at sowing; broadcast if no drill'],
  ['Mungbean & mash', 'Land preparation', '½ bag (12.5 kg)', 'Drill at sowing; broadcast if no drill'],
  ['Canola', 'Land preparation', '1 bag (25 kg)', 'Drill at sowing; broadcast if no drill'],
]
const SOURCES = [
  'Degryse, F., et al. (2016). Soil Science Society of America Journal 80(2), 294–305. doi:10.2136/sssaj2015.06.0237.',
  'Bremer, E. (2022). Crops & Soils 56(1), 34–37. doi:10.1002/crso.20241.',
  'Janzen, H. H., & Bettany, J. R. (1987). Canadian Journal of Soil Science 67(3), 609–618. Doi:10.4141/cjss87-057. Temperature response as summarised by Degryse et al. (2016).',
  'Grzebisz, W., Zielewicz, W., & Przygocka-Cyna, K. (2022). Agronomy 13(1), 66. doi:10.3390/agronomy13010066.',
  // D-151: 'Elbasyoni, I. S., et al. (2026). Life 16(5), 795. doi:10.3390/life16050795.' deleted (cited nowhere on the page, A22).
  'Khoshru, B., et al. (2023). Bacteria 2(2), 98–115. doi:10.3390/bacteria2020008.',
  'Mattiello, E. M., et al. (2017). Journal of Agricultural and Food Chemistry 65(6), 1108–1115. doi:10.1021/acs.jafc.6b04586.',
  // D-151 (A4): 2 entries deleted, their DOIs resolve to other papers: 'Zapałowska, A., et al. (2026). Molecules 31(1), 160. Doi:10.3390/molecules31010160. The N:S optima, summarising Sedlár et al.' and 'Wan, Y., Shewry, P. R., & Hawkesford, M. J. (2012). Journal of Cereal Science 56(1), 72–80. Doi:10.1016/j.jcs.2011.10.014. Critical grain S 1.2 mg/g and N:S 17:1.'
  'Antille, D. L., Sakrabani, R., & Tyrrel, S. (2013). Applied and Environmental Soil Science 2013, 694597. Doi:10.1155/2013/694597. Reporting the segregation thresholds of Miserque and Pirard.',
  'Lassaletta, L., et al. (2014). Environmental Research Letters 9:105011. The national nitrogen uptake shares.',
  // D-130, 24 Sep 2026: the sources below were added with the soil, product, release, N-S and
  // removal sections. Revert: delete from here to the end of the array.
  'Yu, Z., Juhasz, A., Islam, S., Diepeveen, D., et al. (2018). Scientific Reports 8:2499. doi:10.1038/s41598-018-20935-8. Sulfur in cysteine and methionine; free amino acids such as asparagine, arginine and glutamine build up when sulfur is short; grain protein N:S.',
  'Yu, Z., She, M., Zheng, T., Diepeveen, D., et al. (2021). Communications Biology 4, 945. doi:10.1038/s42003-021-02458-7. Sulfur added to sulfur-deficient soil raised wheat nitrogen use efficiency by more than 20%.',
  'Randall, P. J., Spencer, K., & Freney, J. R. (1981). Australian Journal of Agricultural Research 32(2), 203–212. doi:10.1071/AR9810203. Critical wheat grain S 0.12% and N:S 17:1.',
  'Arata, A. F., Lerner, S. E., Tranquilli, G. E., Arrigoni, A. C., et al. (2017). Crop & Pasture Science 68(3), 202–212. doi:10.1071/CP16330. Nitrogen recovery 0.15 against 0.32 with sulfur, poor-fertility site, Argentina.',
  'FAO (2006). Plant nutrition for food security. FAO Fertilizer and Plant Nutrition Bulletin 16. Sulfur: wheat 22 kg S/ha taken up by a 4.6 t/ha crop; maize 21 kg S/ha removed in grain and stover at 9.5 t/ha; cotton 10 kg S/ha taken up by 2.5 t/ha of seed cotton.',
  'IRRI (2003). Rice fact sheet, sulfur. About 2 kg S removed per tonne of rice grain.',
  'Shukla & Lal (2004). Indian Journal of Agronomy 49(1). Sugarcane sulfur removal 20 to 32 kg S/ha.',
  'Shukla, A. K., Behera, S. K., Prakash, C., Tripathi, A., et al. (2021). Scientific Reports 11:19760. doi:10.1038/s41598-021-99040-2. Indian Punjab 50.2% and Rajasthan 78.2% of soils sulfur-deficient, counting latent deficiency.',
  'Ahmad et al. (2003). Asian Journal of Plant Sciences 2(5). Sulfur adequate in most of 45 samples from the Punjab Kallar tract.',
  'NFDC (2025). Fertilizer Review 2024-25. N:P use 3.68 to 1 against a recommended 2 to 1; sulfur not reported as a nutrient.',
]

/** D-130: crop sulfur removal, per acre (kg/ha ÷ 2.471). The per-hectare source figure is kept for
 *  the source line only. Revert: delete this constant and the section that maps it. */
const S_REMOVAL: [string, string, string][] = [
  // D-151 (A8): FAO gives uptake for wheat and cotton and removal for maize, each at a stated yield.
  // Was: ['Wheat', '8.9 kg S per acre', '22 kg/ha · FAO Bulletin 16 (2006)'], maize '21 kg/ha · FAO
  // Bulletin 16 (2006)', cotton '10 kg/ha · FAO Bulletin 16 (2006)'.
  ['Wheat', '8.9 kg S per acre', '22 kg/ha taken up, grain and straw, by a 4.6 t/ha crop (about 46 maunds an acre) · FAO Bulletin 16 (2006)'],
  ['Maize', '8.5 kg S per acre', '21 kg/ha removed in grain and stover at 9.5 t/ha (about 96 maunds an acre) · FAO Bulletin 16 (2006)'],
  ['Sugarcane', '8.1 to 13.0 kg S per acre', '20 to 32 kg/ha · Shukla & Lal (2004)'],
  ['Cotton', '4.0 kg S per acre', '10 kg/ha taken up by 2.5 t/ha of seed cotton (about 25 maunds an acre) · FAO Bulletin 16 (2006)'],
  ['Rice', 'about 2 kg S per tonne of grain', 'IRRI fact sheet (2003)'],
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
          <div><div className="cap uppercase tracking-[.08em] font-bold" style={{ color: '#5B6A5E' }}>Plain urea</div><div className="display text-[24px]">50 kg. The default the market buys</div></div>
        </div>
        <div className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 mt-5 small">
          <div className="cap">on the label</div><div className="num text-[26px]" style={{ color: '#5B6A5E' }}>23 kg N</div>
          <div className="cap">how it arrives</div><div>all at once, the day it dissolves<br /><span className="muted">from that moment, volatilisation, nitrification and leaching act on all of it</span></div>
        </div>
        <svg viewBox="0 0 300 70" width="100%" className="mt-3" aria-hidden="true">
          <rect x="0" y="0" width="300" height="70" fill="#fff" rx="6" />
          <rect x="10" y="10" width={on ? 280 : 0} height="22" rx="4" fill="#BEC5BB" style={{ transition: rm ? 'none' : 'width 1s cubic-bezier(.2,.8,.2,1)' }} />
          <text x="12" y="52" fontSize="11" fill="#5B6A5E">all released the day it dissolves, then exposed</text>
        </svg>
      </div>
      <div className="panel p-5" style={{ borderColor: 'var(--green)', borderWidth: 2 }}>
        <div className="flex items-end gap-4">
          <img src={PACK_PNG.urea} alt="Vital Urea 25 kg" style={{ height: 120, width: 'auto' }} />
          <div><div className="cap uppercase tracking-[.08em] font-bold" style={{ color: 'var(--green)' }}>Vital Urea</div><div className="display text-[24px]">25 kg. Openly a smaller bag</div></div>
        </div>
        <div className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 mt-5 small">
          <div className="cap">on the label</div><div><span className="num text-[26px]" style={{ color: 'var(--navy)' }}>8 kg N</span><br />+ at least 3.25 kg of sulfur in the same granules</div>
          <div className="cap">how it arrives</div><div>metered over weeks in this programme<br /><span className="muted">released over days after the first irrigation, not all at once. Nitrogen still inside a granule is not yet in the soil solution, so it cannot yet be lost</span></div>{/* D-151: was "metered over 7–18 days" / "released while there is a root ready to take it. What is still inside the granule cannot be lost yet" */}
        </div>
        <svg viewBox="0 0 300 70" width="100%" className="mt-3" aria-hidden="true">
          <rect x="0" y="0" width="300" height="70" fill="#fff" rx="6" />
          {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={10 + i * 20} y="10" width="14" height="22" rx="3" fill="var(--green)" style={{ opacity: on ? 1 : 0, transition: rm ? 'none' : `opacity .3s ease ${0.2 + i * 0.09}s` }} />)}
          <text x="12" y="50" fontSize="11" fill="var(--muted)">metered over weeks in this programme,</text><text x="12" y="64" fontSize="11" fill="var(--muted)">depending on climate and application method</text>
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
            <p className="cap"><a href="#/products">Our brands</a> / Nitrogen / Vital Urea</p>
            {/* D-135: was "Nitrogen · Hero product · VAN exclusive". Revert: restore that text. */}
            <span className="eyebrow mt-2">Nitrogen · Hero product</span>
            <h1>Vital Urea</h1>
            <p className="display text-[clamp(22px,2.2vw,28px)] mt-2" style={{ color: 'var(--green)' }}>Sulfur Coated Urea. N 32% min · S 13% min</p>
            {/* D-140: the last clause was "and the sulfur itself conditions the root zone, temporarily
                acidifying it to unlock fixed phosphorus and zinc." Revert: restore it. */}
            <p className="lead mt-4">Vital Urea: nitrogen with a sulfur coating, 32% N and 13% S. In Pakistan’s alkaline, hot soils a large share of plain urea’s nitrogen is lost before the plant can use it. Vital Urea’s sulfur coating releases its nitrogen in steps over the weeks after the first irrigation, not all at once. As the sulfur oxidises it lowers the pH around the granule, which may help nearby phosphorus and zinc.</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {/* D-130: was "Broadcast" and "Sowing / basal + top-dress". Revert: restore those 2 chips
                  with MethodIcon method="Broadcast" on the first.
                  D-139: "Drill at sowing or side-dress" became "Broadcast, drill or side-dress" (owner, 24 Sep
                  night: broadcasting is fine too). Revert: restore the D-130 text. */}
              <span className="chip chip-sm" style={{ cursor: 'default' }}><MethodIcon method="Drill" size={18} />Broadcast, drill or side-dress</span>
              <span className="chip chip-sm" style={{ cursor: 'default' }}>Earliest stage · never fertigate</span>
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
        {[['32% N · 13% S', 'guaranteed analysis, at least 8.0 kg of nitrogen and 3.25 kg of sulfur in every 25 kg bag'], ['Over weeks', 'released in steps after the first irrigation, not at once. VAN field observation, not a laboratory curve; no day figure is claimed'], ['No. 144684', 'Pakistan Patent on the sulfur-coating technology. Government of Pakistan Patent Office'], ['PS 217-2023', 'PSQCA standard · licence CM/L-4126/2025 · released through VAN’s PNAC-accredited laboratory, LAB 336']].map(([v, l]) => (
          <div key={v} className="panel p-5"><div className="num text-[clamp(26px,2.4vw,32px)]" style={{ color: 'var(--navy)' }}>{v}</div><p className="small muted mt-2">{l}</p></div>
        ))}
      </section>

      {/* D-196, 27 Sep 2026: the flagship block, a grower's question first. */}
      <section className="wrap sec-tight"><Flagship slug="vital-urea" /></section>
      {/* D-207, 27 Sep 2026 */}
      <section className="wrap sec-tight"><ApplicationMethods slug="vital-urea" compact /></section>

      <section className="wrap sec">
        <SectionHead eyebrow="The problem" title="Only about a quarter of applied nitrogen ends up in Pakistan’s crops." tone="soil" />
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          <div className="grid gap-4">
            <p>Nitrogen loss in Pakistani soil is caused by soil chemistry. Volatilisation, nitrification and leaching all act on nitrogen that is dissolved in the soil solution, and a granule of plain urea dissolves all at once, on ground that is hot and alkaline. Nitrogen still inside a granule is not yet in the soil solution, so it cannot yet be lost. The rest of this page follows from that.</p>
            <p className="muted">The full case for moving off plain urea, with its sources, is on <a href="#/knowledge">the national picture page</a>. This page is about the coating: what it does, what it cannot do, and why it is made of sulfur.</p>
          </div>
          <div ref={ref} className="panel p-5">
            <div className="font-bold">Roughly a quarter reaches the crop here. Against about 72% in the United States</div>
            <p className="cap">Share of applied nitrogen taken up by the crop, national cropland estimate</p>
            {[['Pakistan', 25, 'var(--gold)'], ['United States', 72, 'var(--green)']].map(([n, v, c]) => (
              <div key={n as string} className="mt-4">
                <div className="flex justify-between small"><span className="font-semibold">{n}</span><span className="num">~{v}%</span></div>
                <div className="h-6 rounded-md mt-1" style={{ background: 'var(--sand-2)' }}><div className="h-6 rounded-md" style={{ width: on ? `${v}%` : 0, background: c as string, transition: rm ? 'none' : 'width 1.1s cubic-bezier(.2,.8,.2,1)' }} /></div>
              </div>
            ))}
            <p className="cap mt-4" style={{ borderTop: '1px solid var(--line)', paddingTop: 8 }}>Source: Lassaletta et al. (2014), Environmental Research Letters 9:105011.</p>
          </div>
        </div>
      </section>

      {/* D-130, 24 Sep 2026: the soil case. Figures are the site's own Punjab survey (soilLens.ts,
          districtSoil.ts: all 36 district means above pH 7.5 and below 0.86% organic matter, checked
          by script), the owner's brief, and the sources listed. Revert: delete this section. */}
      <section className="sec" style={{ background: 'var(--soil-soft)' }}><div className="wrap">
        <SectionHead eyebrow="Why Pakistani soil needs it" title="Punjab’s soil is alkaline, low in organic matter, and has never been tested for sulfur." tone="soil" lead="The Punjab soil testing programme has read 770,160 samples from 36 districts. These 4 facts come from those samples and from the national fertilizer record." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            ['96.1%', 'of samples are above pH 7.5', 'All 36 district averages are above pH 7.5, and 69.1% of samples are above pH 8. Above pH 8, part of the urea left on the surface turns to ammonia gas and is lost to the air.'],
            ['90.2%', 'of samples are below 0.86% organic matter', 'The average is 0.61%, and all 36 district averages are below 0.86%.'],
            ['0', 'of 770,160 samples were tested for sulfur', 'Every sample was tested for 13 properties. Sulfur is not one of them. Because it is never measured, a soil report never shows sulfur as short and never recommends it.'],
            ['3.68 to 1', 'nitrogen to phosphorus, against 2 to 1 recommended', 'NFDC Fertilizer Review 2024-25. Pakistan’s fertilizer use leans heavily on nitrogen, and the review does not report sulfur as a nutrient at all.'],
          ].map(([v, k, t]) => (
            <div key={k} className="panel p-5"><div className="num text-[clamp(26px,2.4vw,32px)]" style={{ color: 'var(--soil)' }}>{v}</div><div className="font-bold small mt-1">{k}</div><p className="small muted mt-2">{t}</p></div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          <p className="panel p-5 small"><b>What the nearest tests show.</b> Across the border, on the same kind of soil, India does test for sulfur. 50.2% of soils in Indian Punjab and 78.2% in Rajasthan were deficient in sulfur, counting latent deficiency as the paper does (Shukla et al., 2021). This is indirect evidence about a neighbouring area and says nothing certain about any field in Pakistan.</p>
          <p className="panel p-5 small" style={{ background: 'var(--gold-soft)' }}><b>What VAN does not claim.</b> A 2003 study of 45 samples from Punjab’s Kallar tract found sulfur adequate in most of them (Ahmad et al., 2003). So VAN says sulfur in Punjab has not been measured at scale. VAN does not say every Punjab field is short of sulfur.</p>
        </div>
        <p className="cap mt-4">Soil figures: Punjab soil testing programme, 36 district workbooks, 770,160 samples, c. 2016 to 2018, as used across this site. National fertilizer ratio: NFDC Fertilizer Review 2024-25.</p>
      </div></section>

      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SectionHead eyebrow="What a bag buys" title="One 25 kg bag stood against a 50 kg bag of plain urea, and the growth was comparable." lead="Khaliqabad field programme with Rafhan Maize Products, 2023. 5 grower sites picked by their agronomy team, application in August through harvest in October, assessments at 12 and 24 days. The comparison was deliberately uneven." />
        <p className="font-bold mb-1">2 bags, drawn to one scale of nitrogen. What the label says, and when it arrives</p>
        <p className="cap mb-4">Kilograms of N are registered label contents. Release behaviour is the mechanism each product is built on.</p>
        {/* 11 Sep 2026 · Tahir's ruling. This is the only client named anywhere on the site, against a
            partner page that promises names are not published. He chose to keep it and state the
            exception rather than take the name off, so the exception is stated in both places: here,
            and in PARTNER.firewall. Revert: remove this line and the sentence in site.ts. */}
        <p className="cap mb-4" style={{ color: 'var(--rust-text)' }}>Rafhan Maize Products and Descon are the only clients and partners VAN names anywhere on this site, and each is named with their agreement. Every other partner and client, including the 2025 trial partner, is unnamed.</p>
        {/* D-200, Tahir 27 Sep 2026: the maize trial result, printed with the trials named. His words: "in corn
            we have proven the yield increase from 5% to 15% even when we are giving crop less nitrogen".
            Comparison as he ruled: 25 kg Vital Urea per application against 50 kg urea per application, the
            same number of applications. Rafhan 2022 joint; Descon Research Farm 2024 joint; the 2025 trial
            independent. Rafhan and Descon agreed to be named; the 2025 partner is not named (D-213, Tahir
            27 Sep 2026: "rest of 2 agreed"). Revert: delete this block and restore the sentence above. */}
        <div className="panel p-5 lg:p-6 mb-6" id="maize-trials">
          <span className="eyebrow">3 maize trials, 2022 to 2025</span>
          <h3 className="mt-1 max-w-[34ch]">Half the weight at every application, and 5 to 15% more grain.</h3>
          <p className="small mt-3 max-w-[110ch]">In 3 maize trials, 25 kg of Vital Urea was applied in place of 50 kg of urea at each application, the same number of times through the season. Yield rose by 5 to 15%, with less nitrogen applied. The crop was given less, and got more, because what it was given arrived in the weeks it could use it.</p>
          <div className="panel overflow-x-auto tbl-scroll mt-3"><table className="tbl" style={{ minWidth: 520 }}>
            <thead><tr><th>Trial</th><th>Year</th><th>Run by</th></tr></thead>
            <tbody>
              <tr><td>Rafhan Maize Products, contract farms</td><td className="num">2022</td><td>Joint, VAN and Rafhan</td></tr>
              <tr><td>Descon Research Farm</td><td className="num">2024</td><td>Joint, VAN and Descon</td></tr>
              <tr><td>Independent partner farm, not named</td><td className="num">2025</td><td>Independent</td></tr>
            </tbody>
          </table></div>
          <p className="cap mt-3">The 5 to 15% is the range across the 3 trials. The result on your field depends on your crop, your soil and the rest of your practice; the discipline simulator scores that part. Trial summaries are available on request to partner@van.com.pk.</p>
        </div>
        <TwoBags />
        <p className="mt-6 max-w-[140ch]">What the 5 sites recorded: comparable crop growth, shoot length, colour, leaf number, vigour, from the 25 kg bag on roughly a third of the applied nitrogen, with better uniformity of plant height, grain formation and milk-line development also observed. Cob size and length showed no difference. And what this was not: an observational field programme, not a replicated randomised trial, no independent yield measurement was recorded, and VAN reports it as exactly that. If you need replicated trial data for a purchasing decision, ask. Where it exists, you will get it.</p>
      </div></section>

      {/* D-130, 24 Sep 2026: new section, the product as the owner's brief states it. Revert: delete. */}
      <section className="wrap sec">
        <SectionHead eyebrow="The product" title="What is in a bag of Vital Urea." lead="Urea granules coated with finely ground elemental sulfur, held on by a binder VAN developed and patented." />
        <div className="grid lg:grid-cols-[1fr_1fr] gap-4 items-start">
          <div className="panel p-5">
            <table className="tbl">
              <tbody>
                {[
                  ['Bag', '25 kg'],
                  ['Declared analysis', '32% nitrogen, 13% sulfur. That is at least 8.0 kg of nitrogen and 3.25 kg of sulfur in every bag'],
                  ['Sulfur', 'Elemental sulfur ground to 350 mesh or finer'],
                  ['Coating material A', 'A carbohydrate (starch-based) binder that holds the sulfur on the granule'],
                  ['Coating material B', 'The release-control component'],
                  ['On the pack', 'Slow Release Fertilizer'],
                ].map(([k, v]) => <tr key={k}><td className="font-semibold">{k}</td><td>{v}</td></tr>)}
              </tbody>
            </table>
            <p className="small mt-3">The patent covers the combination of the 2 coating materials. VAN describes the process as low in energy use and safe to handle, and the coating as biodegradable, leaving no residue that reacts badly with the soil, its minerals or the crop.</p>
          </div>
          <div className="panel p-5">
            <div className="font-bold">How it got here</div>
            <ol className="mt-3 grid gap-3 small">
              {[
                // D-138: was 'VAN starts work on coated products. More than 200 combinations are tested, including biological, nutrition-based and biostimulant coatings, before this one is chosen.' Revert: restore it.
                // D-181, Tahir 26 Sep 2026: "change them to your list". Were 2012 'VAN starts work on coated products...' and 2014 'The standard for VAN's sulfur coated urea is approved.'
                ['2014', 'VAN adds a coating line to the plant; its first product is boron-coated nitro potash. VAN has tested many coating combinations since, including biological, nutrition-based and biostimulant coatings, and chose this one from them.'],
                ['2019', 'Vital Urea launched.'],   // D-177, Tahir 26 Sep: 2019 is the launch. Was 'The product is registered, and has been ever since.'
                ['2026', 'Pakistan Patent No. 144684 is granted. VAN holds the patent.'],   // D-175: "granted", was "completed" (Tahir 26 Sep)
                ['Now', 'Made under PSQCA standard PS 217-2023, licence CM/L-4126/2025, and released batch by batch through VAN’s PNAC-accredited laboratory, LAB 336.'],
              ].map(([y, t]) => <li key={y} className="grid grid-cols-[56px_1fr] gap-3"><span className="num font-bold" style={{ color: 'var(--green)' }}>{y}</span><span>{t}</span></li>)}
            </ol>
          </div>
        </div>
      </section>

      {/* D-130, 24 Sep 2026: the release mechanism now follows the owner's own description of this
          coating (water breaks down the carbohydrate binder and the fine sulfur disperses). The old
          first panel described a molten-sulfur shell with pores and micro-cracks, which is a different
          product. Old caption about a "schematic" with a demand curve deleted: no such chart was on the
          page. Revert: restore the section from /root/van/v53-pristine-backup or the D-130 entry. */}
      <section className="wrap sec">
        <SectionHead eyebrow="The coating" title="How the coating releases nitrogen" lead="Nothing happens in a dry bag or on dry ground. The clock starts at the first irrigation or rain." />
        <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-4 items-start">
          {/* D-201, Tahir 27 Sep 2026: the whole page is qualitative on release; the day chart came off. The
              flagship block above carries the picture with no day figures. Revert: put <ReleaseChart /> back. */}
          <div className="grid gap-4">
            <p className="panel p-5 small">When water reaches the granule, the carbohydrate binder breaks down. That lets go of the fine elemental sulfur, which spreads into the soil around the granule instead of staying on it, and the urea underneath starts to dissolve. In VAN’s field observation the release starts within the first day or two after water and runs over the following weeks, faster under good irrigation and slower when the ground is dry or cold. No day figure is claimed, because no laboratory release curve exists.</p>
            <p className="panel p-5 small">3 things move it inside that range: water, because nothing starts until water arrives; soil temperature, because the reactions run faster when it is warm; and handling, because a granule crushed at spreading has lost its coating and behaves like plain urea.</p>
            <p className="panel p-5 small" style={{ background: 'var(--gold-soft)' }}><b>What it does not do.</b> A coating does not stop volatilisation. It reduces how much nitrogen is exposed to it at any one moment. Nitrogen released into hot alkaline soil behaves like any other nitrogen released into hot alkaline soil. Placement and irrigation timing still matter, and no coating substitutes for either.</p>
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: 'var(--sky)' }}><div className="wrap">
        <SectionHead eyebrow="Why sulfur" title="3 ways to slow urea down. Only one of them is also plant food." tone="navy" />
        <div className="grid md:grid-cols-3 gap-4">
          {[['Polymer coating', 'accurate, inert', 'Controls release accurately and delivers nothing else. Adds no nutrient, and the polymer stays in the soil after the nitrogen has gone.', false], ['Chemical inhibitors', 'slow the reactions, not the release', 'Imported, dose-sensitive, temperature-sensitive, and they add no nutrient of their own.', false], ['Sulfur coating', 'the one VAN chose', 'Controls release and is the only one of the 3 that is itself a nutrient and itself chemically active in the soil. The next section is what that buys.', true]].map(([t, k, x, chosen]) => (
            <div key={t as string} className="panel p-5" style={chosen ? { borderColor: 'var(--green)', borderWidth: 2 } : undefined}>
              <span className="eyebrow" style={{ color: chosen ? 'var(--green)' : 'var(--muted)' }}>{k as string}</span>
              <h3>{t as string}</h3>
              <p className="small mt-3">{x as string}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-[140ch]">About a sixth of the bag is coating. 3.25 kg is the registered sulfur nutrient, 13% of 25 kg under PS 217-2023. The sulfur VAN charges to the coater is 80% pure, so delivering it means about 4.06 kg of sulfur material in the bag. Arithmetic, not a batch assay. What a certificate carries is the measured elemental sulfur, most recently 13.27% on batch VU25186.</p>
      </div></section>

      <section className="wrap sec">
        {/* D-130: heading was "Why the result is not “nitrogen plus sulfur.”" (an X-is-not-Y line) and the lead
            was "2 pictures. The shell geometry is what makes the sulfur work, and the sulfur is what lets
            the nitrogen finish as yield." Revert: restore both. */}
        <SectionHead eyebrow="The chemistry" title="The plant needs sulfur to turn nitrogen into protein." lead="The left panel shows why the sulfur is ground fine. The right panel shows what sulfur does for the nitrogen inside the plant." />
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="panel p-5">
            <h4>Sulfur only becomes plant food at its surface, and fine sulfur has far more surface</h4>
            <p className="cap mt-1">The same mass of elemental sulfur in 3 geometries; oxidation to sulfate happens where soil touches sulfur</p>
            <svg viewBox="0 0 320 110" width="100%" className="mt-3" aria-hidden="true">
              <circle cx="55" cy="55" r="34" fill="#D9A21B" /><text x="55" y="102" textAnchor="middle" fontSize="11" fill="var(--muted)">one lump</text>
              {[[140, 40], [170, 40], [155, 66], [125, 66], [185, 66]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="11" fill="#D9A21B" />)}<text x="155" y="102" textAnchor="middle" fontSize="11" fill="var(--muted)">granules</text>
              <circle cx="265" cy="55" r="30" fill="#fff" stroke="#D9A21B" strokeWidth="7" /><circle cx="265" cy="55" r="22" fill="#E6EEE8" /><text x="265" y="59" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--navy)">urea</text><text x="265" y="102" textAnchor="middle" fontSize="11" fill="var(--muted)">fine, on the granule</text>
            </svg>
            <p className="small mt-3">Soil bacteria can only work on the outside of a sulfur particle. For the same kilogram of sulfur, halving the particle size doubles the surface they can reach. VAN grinds its sulfur to 350 mesh or finer, and water spreads it off the granule into the soil. Rapid oxidation calls for particles finer than about 20 µm, well dispersed (Bremer, 2022), so the finer the grind, the better. The reaction is biological and runs 3 to 4 times faster for every 10 °C of soil warming (Janzen & Bettany, 1987). Warm soil speeds up this reaction, and it also speeds up ammonia loss from surface urea. 2 S⁰ + 3 O₂ + 2 H₂O → 2 SO₄²⁻ + 4 H⁺. 4 protons per 2 atoms of sulfur.</p>
          </div>
          <div className="panel p-5">
            <h4>Without sulfur, the nitrogen a plant takes up cannot become protein</h4>
            <p className="cap mt-1">Both elements are built into protein together; where sulfur is short, absorbed nitrogen accumulates unfinished</p>
            <p className="small mt-3">2 of the amino acids that make up protein, cysteine and methionine, contain sulfur. When sulfur runs short, protein building slows and the nitrogen the plant has taken up builds up unused, as free amino acids such as asparagine, arginine and glutamine (Yu et al., 2018). On sulfur-deficient soil, adding sulfur raised wheat’s nitrogen use efficiency by more than 20% (Yu et al., 2021). On a poor-fertility site in Argentina, sulfur lifted wheat’s nitrogen recovery from 0.15 to 0.32 (Arata et al., 2017).</p>
            {/* D-195, Tahir 27 Sep 2026: the "12 to 15 kg N per kg S" ratio came off the page (INTERNAL in the
                brand master, a derivation). Revert: the v60 zip. */}
            <p className="small mt-3">Nitrogen needs sulfur to become protein. The protons from the sulfur’s oxidation lower the pH around the granule, where the nitrogen is, which may help nearby phosphorus and zinc. A microsite effect, a zone around each granule for the weeks it is releasing.</p>
            <p className="small mt-3 p-3 rounded-lg" style={{ background: 'var(--gold-soft)' }}><b>Where this stops being certain.</b> Alkaline soil slows sulfur oxidation. In a laboratory comparison, elemental sulfur oxidised less in a slightly alkaline soil than in an acidic one, 12% against 20.9%, and it lowered the alkaline soil’s pH only where a sulfur-oxidising inoculant was added with it (Mattiello et al., 2017). Either way it is a microsite effect. A zone around each granule, for the weeks it is releasing. It will not move a soil test, and VAN does not claim it does. Raising that oxidation rate deliberately is a live VAN research track, not a product claim.</p>
          </div>
        </div>
      </section>

      {/* D-130, 24 Sep 2026: crop sulfur removal per acre. Revert: delete this section. */}
      <section className="wrap sec">
        <SectionHead eyebrow="What a harvest takes away" title="Each crop takes sulfur from the soil every season." lead="1 bag of Vital Urea an acre puts 3.25 kg of sulfur on the field. A wheat crop of about 46 maunds an acre takes up about 8.9 kg of sulfur an acre, grain and straw together. One bag does not replace a season’s removal. It puts sulfur into the root zone beside the nitrogen, at the time the nitrogen goes on." />
        <div className="panel overflow-x-auto">
          <table className="tbl">
            <thead><tr><th>Crop</th><th>Sulfur taken up or removed by the crop</th><th>Source (per hectare, as published)</th></tr></thead>
            <tbody>
              {S_REMOVAL.map(([c, v, src]) => <tr key={c}><td className="font-semibold">{c}</td><td className="num">{v}</td><td className="small muted">{src}</td></tr>)}
              <tr style={{ background: 'var(--green-soft)' }}><td className="font-semibold">1 bag of Vital Urea</td><td className="num">3.25 kg S per acre</td><td className="small muted">13% of 25 kg, the registered analysis</td></tr>
            </tbody>
          </table>
        </div>
        <p className="cap mt-3">Per-acre figures are the published per-hectare figures divided by 2.471. Uptake is what the whole crop takes in; removal is what leaves the field in the harvest. Both vary with yield, variety and soil; these are published reference values at the yields stated, not measurements from Pakistani fields.</p>
      </section>

      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SectionHead eyebrow="One granule, not a blend" title="Every granule is coated." lead="Everything above needs the nitrogen and the sulfur in the same place at the same moment. A mixture cannot promise that." />
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-4 items-start">
          <div className="panel p-5">
            <div className="font-bold">A blend can separate in the bag. A coated granule cannot.</div>
            <p className="cap mt-1">Blends segregate by size and density, and the wider the size spread, the more severe it gets (Antille et al., 2013)</p>
            <svg viewBox="0 0 300 90" width="100%" className="mt-3" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, i) => <circle key={i} cx={20 + (i % 9) * 14} cy={i < 9 ? 30 : 60} r={i < 9 ? 7 : 4} fill={i < 9 ? '#BEC5BB' : '#D9A21B'} />)}
              <text x="75" y="84" textAnchor="middle" fontSize="11" fill="var(--muted)">a blend, settled by size</text>
              {Array.from({ length: 12 }).map((_, i) => <g key={i}><circle cx={180 + (i % 6) * 20} cy={i < 6 ? 30 : 58} r="8" fill="#D9A21B" /><circle cx={180 + (i % 6) * 20} cy={i < 6 ? 30 : 58} r="5" fill="#E6EEE8" /></g>)}
              <text x="230" y="84" textAnchor="middle" fontSize="11" fill="var(--muted)">every granule coated</text>
            </svg>
            <p className="small mt-3">The fine sulfur on the granule is what creates the surface in the first figure. The same sulfur as a lump would still be in the soil next season.</p>
          </div>
          <p className="panel p-5"><b>What is claimed here and what is not.</b> Uniformity is recorded batch by batch. What VAN publishes is the declared analysis, 32% N and 13% S, registered against PS 217-2023 and released through VAN’s PNAC-accredited laboratory. Coating weight is measured per batch; VAN does not publish the figure, and will provide it against a batch number on the same terms as the certificate. VAN does not publish a granule-to-granule figure.</p>
        </div>
      </div></section>

      <section className="wrap sec">
        <SectionHead eyebrow="The evidence" title="What has been tested, and how it was tested." lead="The field programme above is 1 of the 2 records VAN reports. The second is a published, replicated trial." />
        <div className="panel p-6" style={{ borderColor: 'var(--navy)', borderWidth: 2 }}>
          {/* D-130: was "Published trial. Maize, VAN’s trial station, 2024". The owner's brief allows this trial
              only as a fertilizer company's trial on its own research farm, peer-reviewed and published.
              Revert: restore the old h3. */}
          <h3>Published trial. Maize, 2024, a trial by a fertilizer company on its own research farm, peer-reviewed and published</h3>
          <p className="mt-3">A randomised complete block design with 3 replications on DK-6321 maize compared nitrogen strategies. 2 stage-timed applications of sulfur-coated urea, at the 4–6 leaf stage and again 20 days later at the 8–12 leaf stage. Outperformed a 5-application programme of conventional urea followed by calcium ammonium nitrate across the growth and yield parameters measured.</p>
          <p className="mt-3 small p-3 rounded-lg" style={{ background: 'var(--gold-soft)' }}><b>Why we cite it for the finding and not a headline number:</b> the paper reports its own yield inconsistently between its results table and its discussion. We would rather tell you that here than have you find it.</p>
          <p className="cap mt-3">Umair, A., Manzoor, M., Saleem, M. S., et al. (2025). Planta Animalia 4(3), 129–135. <a href="https://doi.org/10.71454/PA.004.03.0126" target="_blank" rel="noopener">DOI 10.71454/PA.004.03.0126</a>.</p>
        </div>
        <h4 className="mt-8">What the published research establishes about coated urea, not measurements of Vital Urea</h4>
        <div className="grid md:grid-cols-3 gap-4 mt-3">
          {[['Coated urea raises nitrogen recovery against uncoated urea.', 'Zhao, Gao & Gao (2025), Agriculture 15(14):1554. A 2-year field study reporting higher nitrogen recovery efficiency, agronomic efficiency and grain yield for sulfur-coated urea than for conventional urea in rice.'], ['The effect holds in Pakistani conditions.', 'Ghafoor, Rahman & Ali et al. (2021), Environmental Science and Pollution Research. Coated urea sources improved growth, yield and nitrogen use efficiency and reduced nitrogen losses in wheat under an arid Pakistani environment.'], ['In one study, elemental sulfur with an inoculant raised phosphorus availability in calcareous soil.', 'Nadeem, Hanif & Khan (2022), Archives of Agronomy and Soil Science 69(9):1494–1502. Elemental sulfur with a sulfur-oxidising inoculant raised phosphorus availability and improved wheat growth and yield in calcareous soil.']].map(([h, t]) => (
            <div key={h} className="panel p-5"><div className="font-bold">{h}</div><p className="small muted mt-2">{t}</p></div>
          ))}
        </div>
        <details className="panel p-5 mt-4">
          <summary className="font-bold flex justify-between">Sources for the chemistry sections <span aria-hidden="true">＋</span></summary>
          <ul className="small muted mt-3 pl-5 grid gap-1">{SOURCES.map(s => <li key={s}>{s}</li>)}</ul>
        </details>
      </section>

      <section className="sec" style={{ background: 'var(--green-soft)' }}><div className="wrap">
        <SectionHead eyebrow="In the field" title="Where it goes, and how much." lead="From VAN’s published crop nutrition plans, 2025 set. This table is a sample. Vital Urea appears in 27 of the 28 published programmes." right={<a className="btn btn-navy" href="#/crops">All 28 crop plans →</a>} />
        {/* D-130, 24 Sep 2026: how to apply, from the owner's brief. Revert: delete this block. */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {[
            // D-139: was ['Drill', 'Put it in the soil', 'Drill it at sowing, or side-dress or band it beside the row. The granule needs soil and water around it to release.']. Revert: restore it.
            // D-207, 27 Sep 2026: drill first. Revert: the D-139 line above.
            ['Drill', 'Drill it at sowing', 'Drill it beside and below the seed, never touching it. Side-dress or band it beside the row if you cannot drill. Broadcast last. The granule needs soil and water around it to release.'],
            ['Side dressing', 'Use it early', 'Apply it at the earliest stage the crop plan allows. It can be the first or the second urea application. Earlier is better.'],
            ['Placement', 'Count from the water', 'Release starts after the first irrigation or rain. Plan the application so that water follows it.'],
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
                {wheat.map((r, i) => <tr key={`w${i}`} style={{ background: 'var(--gold-soft)' }}><td className="font-semibold"><a href="#/crops/wheat">Wheat</a></td><td>{r.stage}</td><td className="num">{doseLabel(r)}</td><td>{r.method}</td></tr>)}
                {FIELD_ROWS.map(([c, s, d, m], i) => <tr key={i}><td className="font-semibold">{c}</td><td>{s}</td><td className="num">{d}</td><td>{m}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="panel p-5">
            <p className="small">Growing a different crop? The full stage-by-stage programme for 28 crops is in the crop nutrition plans, and how the bag is applied changes the answer, so the application guidance sits beside them.</p>
            <a className="btn btn-gold mt-4" href="#/crops">Find your crop’s plan →</a>
          </div>
        </div>
      </div></section>

      <section className="wrap sec">
        <SectionHead eyebrow="Behind the bag" title="What is behind the bag." />
        {/* D-130: 2 cards added (sulfur grind, registered since 2019) and the grid set to 3 columns.
            Revert: delete the 2 new entries and set lg:grid-cols-4 again. */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[['Registration & standard', 'PSQCA PS 217-2023 · Licence CM/L-4126/2025 · Pakistan Patent No. 144684 · launched in 2019'], ['Pack size', '25 kg bag, marked Slow Release Fertilizer'], ['Sulfur', 'Elemental sulfur ground to 350 mesh or finer, held on by a carbohydrate binder with a release-control component'], ['Safety', 'Not classified as hazardous under GHS. Store bags sealed, off the floor, in a cool, dry place away from moisture and direct sun (VAN SDS, Rev 3, July 2026)'], ['Quality', 'Every batch released through VAN’s own PNAC-accredited laboratory. ISO/IEC 17025:2017, LAB 336'], ['Certificate on request', 'Send the batch number off the bag and VAN sends the certificate of analysis for that batch. The elemental-sulfur figure on it is measured, most recently 13.27% on batch VU25186.']].map(([h, t]) => (
            <div key={h} className="panel p-5"><div className="cap uppercase tracking-[.08em] font-bold">{h}</div><p className="small mt-2">{t}</p></div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <a className="btn btn-ghost btn-sm" href="https://www.van.com.pk/spec-sheets/VAN-TDS-Vital-Urea.pdf" target="_blank" rel="noopener">⬇ Specification sheet (PDF)</a>
          <a className="btn btn-ghost btn-sm" href="https://www.van.com.pk/sds/VAN-SDS-Vital-Urea.pdf" target="_blank" rel="noopener">⬇ MSDS (PDF)</a>
          <a className="btn btn-ghost btn-sm" href="https://www.van.com.pk/lms/VAN-LMS-Vital-Urea.pdf" target="_blank" rel="noopener">⬇ Product knowledge deck (PDF)</a>
          <a className="btn btn-navy btn-sm" href="#/verify">Verify a bag →</a>
        </div>
      </section>

      <section className="wrap sec-tight">
        <div className="panel-navy p-6 lg:p-10 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            {/* D-135: eyebrow was "A VAN flagship. Exclusively ours" and h2 "Vital Urea stays a VAN brand."
                The owner ruled on 24 Sep that Vital Urea is open to own-brand manufacturing. Revert: restore
                both strings and remove the second button. */}
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>A VAN flagship</span>
            <h2 className="text-[clamp(28px,2.8vw,38px)]">Sell Vital Urea, or have it made under your brand.</h2>
            <p className="mt-3" style={{ color: 'rgba(255,255,255,.8)' }}>The sulfur-coating technology is protected by Pakistan Patent No. {COUNTS.patent}. Carry it through the distribution network, with territory and volume terms. All 23 VAN brands are open for own-brand manufacturing, Vital Urea included.</p>
          </div>
          <div className="flex flex-wrap gap-3"><WaButton href={WA.distributor} lg>Become a distributor →</WaButton><a className="btn btn-gold btn-lg" href="#/partner/brief-to-bag">Own-brand manufacturing →</a></div>
        </div>
        <p className="cap mt-6"><b>Sources for this page.</b> Analysis, standard, licence and patent. The registered TDS and van.com.pk. Release mechanism and coating chemistry. The peer-reviewed sources listed in the evidence section, cited for the technologies they studied, under the conditions each study describes; none is a measurement of Vital Urea. Field programme, Khaliqabad 2023, with Rafhan Maize Products. Replicated trial, Umair et al. (2025), Planta Animalia 4(3). National nitrogen uptake, Lassaletta et al. (2014). Soil figures, the Punjab soil testing programme, 770,160 samples. Fertilizer ratio, NFDC Fertilizer Review 2024-25. Sulfur and protein, Yu et al. (2018, 2021), Randall et al. (1981), Arata et al. (2017). Crop sulfur removal, FAO Bulletin 16 (2006), IRRI (2003), Shukla & Lal (2004). Release timeline, VAN field observation, not a laboratory curve. Storage and safety, VAN SDS-VAN-001 Rev 3. Doses, VAN’s published crop nutrition plans, 2025 set. No performance percentage is claimed for Vital Urea anywhere on this page; the 2 records are reported with their limits stated.</p>
      </section>
    </div>
  )
}
