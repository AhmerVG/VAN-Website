import type { ReactNode } from 'react'
import { NR_PDF } from '@/data/nitrogenReport'
import { NueLines, RankBars, WhereItWent, InputsArea, RealPrice, ValueSlider, RatioBars, ChinaTurn, SurplusAcre, WheatPerKg, Revision, LossByPractice } from '@/components/NitrogenCharts'
import { noStop } from '@/components/bits'   // Tahir 7 Nov 2026 (CR-23): no full stop at the end of a heading

/**
 * THE REAL PRICE OF NITROGEN. A Vital Agri Nutrients report. D-325, 4 Nov 2026.
 * Tahir's rulings of 4 Nov 2026: a new Knowledge piece of its own (the 6th), with section 04 of the national
 * page moved to the same FAO data; byline Vital Agri Nutrients; web page and PDF; about 6,000 words; 4 lenses
 * (the week 1 core, what other countries did, the 4 levers, nitrogen and balance) and an honest section on
 * where the evidence runs out. Title "The real price of nitrogen", the same as the week 1 LinkedIn post, which
 * is held until this page is live. Standing rules applied: numbers as digits, per acre in body copy, India only
 * as a warning, no competitor or company names, no claim for any VAN product, every scenario labelled
 * illustrative. Change wording only at Tahir's word; every figure passed an independent audit.
 */

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
const C = ({ children }: { children: ReactNode }) => <div className="my-5">{children}</div>

const INDEX: [string, string][] = [['nr-1', '1 The share of nitrogen added that is taken out in the harvested crop'], ['nr-2', '2 Efficiency among the largest users of nitrogen'], ['nr-3', '3 Where the nitrogen added in 2023 ended up'], ['nr-4', '4 Since 2000, nitrogen added has risen faster than nitrogen taken out'], ['nr-5', '5 What the nitrogen added is worth at the urea price'], ['nr-6', '6 Nitrogen that would not be needed at higher efficiency, valued at the urea price'], ['nr-7', '7 Nitrogen and the other nutrients'], ['nr-8', '8 What other countries did'], ['nr-9', '9 Approaches to raising efficiency'], ['nr-10', '10 What it means for companies, policy makers and researchers'], ['nr-11', '11 Limits of the evidence'], ['nr-src', 'Sources']]

const REFS: [string, string][] = [
  ['FAOSTAT, Cropland Nutrient Balance, December 2025 release, nitrogen, 1961 to 2023 (bulk download and metadata)', 'https://www.fao.org/faostat/en/#data/ESB'],
  ['FAOSTAT, Fertilizers by Nutrient, via Our World in Data, nitrogen, phosphate and potash use per hectare of cropland, 2023', 'https://ourworldindata.org/grapher/nitrogen-fertilizer-application-per-hectare-of-cropland'],
  ['NFDC, Annual Fertilizer Review 2024-25, Ministry of National Food Security and Research, Tables 3, 38 and 39', 'https://mnfsr.gov.pk/SiteImage/Publication/AFR2024-25.pdf'],
  ['OECD 2026, Agricultural Policy Monitoring and Evaluation 2026: chapter 12 European Union (Table 12.32, page 312), chapter 14 India (Table 14.3, page 355; subsidy, page 357; neem coating and Soil Health Cards, page 346), chapter 30 United States (Table 30.3, page 669)', 'https://www.oecd.org/en/publications/agricultural-policy-monitoring-and-evaluation_22217371.html'],
  ['Lassaletta, Billen, Grizzetti, Anglade and Garnier 2014, Environmental Research Letters 9:105011, via Our World in Data', 'https://doi.org/10.1088/1748-9326/9/10/105011'],
  ['Shahzad, Qureshi, Wakeel and Misselbrook 2019, Crop production in Pakistan and low nitrogen use efficiencies, Nature Sustainability 2:1106-1114', 'https://doi.org/10.1038/s41893-019-0429-5'],
  ['EU Nitrogen Expert Panel 2015, Nitrogen Use Efficiency (NUE): an indicator for the utilization of nitrogen in agriculture and food systems (range read via Pecio 2017, Studia i Raporty IUNG-PIB 53(7):39-53)', 'https://www.fertilizerseurope.com/?p=1195'],
  ['Cui, Zhang, Chen et al. 2018, Pursuing sustainable productivity with millions of smallholder farmers, Nature 555:363-366', 'https://doi.org/10.1038/nature25785'],
  ['Yu, Li and Doluschitz 2020, Towards sustainable management of mineral fertilizers in China, Sustainability 12(17):7028', 'https://doi.org/10.3390/su12177028'],
  ['Pan, Lam, Mosier, Luo and Chen 2016, Ammonia volatilization from synthetic fertilizers and its mitigation strategies: a global synthesis, Agriculture, Ecosystems and Environment 232:283-289', 'https://doi.org/10.1016/j.agee.2016.08.019'],
  ['Mahmood, Malik, Shamsi and Sajjad 1998, Denitrification and total N losses from an irrigated sandy-clay loam under maize-wheat cropping system, Plant and Soil 199:239-250', 'https://doi.org/10.1023/A:1004335132617'],
  ['Dawar, Fahad, Jahangir et al. 2021, Biochar and urease inhibitor mitigate NH3 and N2O emissions and improve wheat yield in a urea fertilized alkaline soil, Scientific Reports 11:17413', 'https://doi.org/10.1038/s41598-021-96771-0'],
  ['Farooq, Mahmood, Hameed et al. 2024, Optimizing nitrogen sources in top dressing for wheat, Scientifica 2024:8882675', 'https://doi.org/10.1155/2024/8882675'],
  ['Silva, Sequeira, Sermarini and Otto 2017, Urease inhibitor NBPT on ammonia volatilization and crop productivity: a meta-analysis, Agronomy Journal 109(1):1-13', 'https://doi.org/10.2134/agronj2016.04.0200'],
  ['Abalos, Jeffery, Sanz-Cobena, Guardia and Vallejo 2014, Meta-analysis of the effect of urease and nitrification inhibitors on crop productivity and nitrogen use efficiency, Agriculture, Ecosystems and Environment 189:136-144', 'https://doi.org/10.1016/j.agee.2014.03.036'],
  ['Zhang, Liang, He et al. 2019, The effects of controlled release urea on maize productivity and reactive nitrogen losses: a meta-analysis, Environmental Pollution 246:559-565', 'https://doi.org/10.1016/j.envpol.2018.12.059'],
  ['Zhu, Liu, Xu, Yang and Shi 2020, Application of controlled release urea improved grain yield and nitrogen use efficiency: a meta-analysis, PLoS ONE 15:e0241481', 'https://doi.org/10.1371/journal.pone.0241481'],
  ['Mahmood, Ali, Latif and Ishaque 2011, Dicyandiamide increases the fertilizer N loss from an alkaline calcareous soil treated with 15N-labelled urea, Biology and Fertility of Soils 47:619-631', 'https://doi.org/10.1007/s00374-011-0559-z'],
  ['Singh, Singh, Ladha et al. 2002, Chlorophyll meter and leaf color chart based nitrogen management for rice and wheat in northwestern India, Agronomy Journal 94:821-829', 'https://doi.org/10.2134/agronj2002.8210'],
  ['Varinderpal-Singh, Bijay-Singh, Yadvinder-Singh et al. 2012, Threshold leaf colour greenness for need-based fertilizer nitrogen management in irrigated wheat, Field Crops Research 130:109-119', 'https://doi.org/10.1016/j.fcr.2012.02.005'],
  ['Bijay-Singh, Varinderpal-Singh, Yadvinder-Singh et al. 2017, Site-specific fertilizer nitrogen management using optical sensor in irrigated wheat, Agricultural Research 6:159-168', 'https://doi.org/10.1007/s40003-017-0251-0'],
  ['Khurana, Phillips, Bijay-Singh et al. 2007, Performance of site-specific nutrient management for irrigated, transplanted rice in Northwest India, Agronomy Journal 99:1436-1447', 'https://doi.org/10.2134/agronj2006.0283'],
  ['Khurana, Phillips, Bijay-Singh et al. 2008, Agronomic and economic evaluation of site-specific nutrient management for irrigated wheat in northwest India, Nutrient Cycling in Agroecosystems 82:15-31', 'https://doi.org/10.1007/s10705-008-9166-2'],
  ['Miah, Gaihre, Hunter, Singh and Hossain 2016, Fertilizer deep placement increases rice production: evidence from farmers’ fields in southern Bangladesh, Agronomy Journal 108:805-812', 'https://doi.org/10.2134/agronj2015.0170'],
  ['Ladha, Dawe, Pathak et al. 2003, How extensive are yield declines in long-term rice-wheat experiments in Asia?, Field Crops Research 81:159-180', 'https://doi.org/10.1016/S0378-4290(02)00219-8'],
  ['Ladha, Pathak, Krupnik, Six and van Kessel 2005, Efficiency of fertilizer nitrogen in cereal production: retrospects and prospects, Advances in Agronomy 87:85-156', 'https://doi.org/10.1016/S0065-2113(05)87003-8'],
  ['Nawaz, Bashir, Ahmed et al. 2024, Potassium and zinc improves physiological performance, nutrient use efficiency, and productivity of wheat, Frontiers in Plant Science 15:1363248', 'https://doi.org/10.3389/fpls.2024.1363248'],
  ['Punjab soil testing record, 770,160 samples, about 2016 to 2018, validated and mapped by VAN: Soil Atlas', '/soil.html'],
  ['Soil Poverty Series No. 1, Punjab’s potash, on this site', '/knowledge/soil-poverty-punjab-potash.html'],
]

export default function NitrogenReport() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(180deg, var(--rust-soft), var(--sand))' }}>
        <div className="wrap py-8 lg:py-12">
          <span className="eyebrow rust">A Vital Agri Nutrients report</span>
          <h1 className="max-w-[22ch]">The cost of low nitrogen use efficiency in Pakistan</h1>
          <p className="lead mt-3">Pakistan’s nitrogen use efficiency was 29% in 2023 (an FAO estimate). Nitrogen use efficiency is the share of the nitrogen added to cropland that is taken out in the harvested crop: of every 100 kg of nitrogen added to Pakistan’s cropland, 29 kg were taken out. The next gain is in raising the share of nitrogen that is taken out in the harvested crop, not in lowering the price of the bag.</p>
          <p className="mt-4 max-w-[118ch]"><b>In Rabi 2024-25 (the winter crop season), the nitrogen in urea cost Rs 193 a kg of nitrogen (the urea price). Only part of the nitrogen added from all sources is taken out in the harvested crop.</b> In 2023 the world’s efficiency was 55%, against Pakistan’s 29%. For each 1 kg of nitrogen taken out in the harvested crop, Pakistan adds about 3.4 kg from all sources. Valued at Rs 193 a kg, the nitrogen added for each kg taken out in the harvested crop comes to about Rs 660. This is a calculated value. It values the nitrogen from every source at the urea price, and nobody pays it. This report sets out the evidence, what other countries did, where efficiency can be raised, and the limits of the evidence.</p>
          <p className="cap mt-4"><b>Vital Agri Nutrients</b> · November 2026. Every figure is sourced and dated.</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <a className="btn btn-navy" href={NR_PDF} target="_blank" rel="noopener">Download the full report (PDF)</a>
            <a className="btn btn-ghost" href="#/partner">Make with us →</a>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">{INDEX.map(([id, l]) => <a key={id} className="chip chip-xs" href={`#${id}`}>{l}</a>)}</div>
          <p className="cap mt-4"><a href="#/knowledge">← All knowledge</a> · <a href="#/knowledge/why-pakistan-must-shift">The national picture</a> · <a href="#/knowledge/soil-poverty-punjab-potash">Soil Poverty: Punjab&rsquo;s potash</a></p>
        </div>
      </section>

      <section className="sec-tight"><div className="wrap">
        <div className="panel p-5 lg:p-6 max-w-[118ch]">
          <span className="eyebrow navy">Key findings</span>
          <ul className="mt-2 sp-list">
            <li>In 2023, Pakistan’s efficiency was 29% (an FAO estimate): of every 100 kg of nitrogen added to its cropland, 29 kg were taken out in the harvested crop. In 1961 Pakistan’s efficiency was 54%. In 2023 efficiency was 40% in Bangladesh, 45% in Egypt, 47% in mainland China and 55% in the world.</li>
            <li>Pakistan adds more nitrogen to its cropland than any country except China, India, Brazil and the United States. Of the 29 countries that add 1 million tonnes or more, only Spain had a lower efficiency. Per acre, Pakistan adds less nitrogen than Bangladesh, Egypt or mainland China, and a smaller share of it is taken out in the harvested crop. Per acre in 2023, Pakistan added an average of 74 kg of nitrogen from all sources. Bangladesh added 114 kg, Egypt 137 kg and mainland China 117 kg. In Pakistan, 22 kg an acre were taken out in the harvested crop, against 46 kg in Bangladesh, 62 kg in Egypt and 55 kg in mainland China.</li>
            <li>Of the 5.7 million tonnes added in 2023, FAO estimates that 1.7 million tonnes were taken out in the harvested crop, 1.5 million tonnes were lost to the air and 0.6 million tonnes were lost to water. Section 3 shows the rest: straw and stalks taken off the field, and a remainder that none of FAO’s items accounts for.</li>
            <li>Valued at the Rabi 2024-25 urea price of Rs 193 a kg of nitrogen, the nitrogen added for each kg taken out in the harvested crop was about Rs 660. At the market price of wheat, the nitrogen added for each kg taken out in the harvested crop was worth about 7.6 kg of wheat in 2023-24 and about 12 kg in 2024-25, using Pakistan’s efficiency for all crops. The urea price rose and the wheat price fell. The Rs 660 and the wheat quantities are calculated from observed prices and FAO’s estimated efficiency. They are illustrations of scale, not costs paid.</li>
            <li>If Pakistan’s efficiency reached Bangladesh’s, the same harvest would need about 28% less nitrogen. The 2 published series disagree on Bangladesh (Section 11). Applied to 2024-25 nitrogen sales and valued at the Rabi urea price, the nitrogen that would not be needed is worth about Rs 181 billion a year. Each 1% reduction in nitrogen is worth about Rs 6.5 billion a year at that price. These are calculated values, not projected farmer savings.</li>
            <li>In 2023 Pakistan used 1.2 kg of potash (K2O) for every 100 kg of nitrogen; the world used 34 kg. In 33 long-term rice-wheat experiments in the Indo-Gangetic Plains and China, yields stagnated in most of them, and the authors wrote that depletion of soil potassium “seems to be a general cause” (Section 7).</li>
            <li>Between 2014-16 and 2021-23 (3-year averages), mainland China used 20% less fertiliser nitrogen, while the nitrogen taken out in its harvested crops rose 10%. Pakistan used 16% more fertiliser nitrogen, and the nitrogen taken out in its harvested crops rose 9%.</li>
          </ul>
          <p className="small muted mt-3">The national nitrogen figures are FAO estimates; 2023 is the latest year published. The rupee values are urea-price equivalents that VAN calculated from NFDC prices and sales. They are a measure of size, not a price anyone pays or a saving anyone is promised. Section 11 sets out the limits of the evidence.</p>
        </div>
      </div></section>

      <S id="nr-1" n="1" kicker="The share of nitrogen added that is taken out in the harvested crop" title="In 2023, 29 kg of every 100 kg of nitrogen added to Pakistan’s cropland were taken out in the harvested crop; the world figure was 55 kg">
        <P>Nitrogen enters a field from 5 sources: fertiliser, manure, rain and dust, legumes that fix it from the air, and the seed itself. Some of this nitrogen is taken out in the grain, lint, cane and other crops that are harvested. The rest stays in the soil for a while, is taken off the field in straw and stalks, is lost to the air or is lost to water.</P>
        <P>FAO’s Cropland Nutrient Balance records the nitrogen added to cropland and the nitrogen taken out, for each country and each year since 1961 where data exist. Efficiency is the nitrogen taken out in the harvested crop divided by the nitrogen added. It describes a country as a whole and does not identify the best practice for any single field.</P>
        <C><NueLines /></C>
        <P>Pakistan’s efficiency was 54% in 1961, peaked at 61% in 1970, was 34% in 2000, averaged about 28% over 2021-23 and was 29% in 2023. In 1961 Pakistan used about 52,000 tonnes of fertiliser nitrogen a year. The world’s efficiency was 55% in 1961, fell to 39% in 1988 and was 55% again in 2023.</P>
        <P>In 2023 Bangladesh (40%) and Egypt (45%) had a higher efficiency than Pakistan. Mainland China had 34% in 2010, about Pakistan’s level in 2000, and 47% in 2023.</P>
        <Lead b="A low efficiency does not mean that farmers are at fault.">Part of the nitrogen not taken out in the harvested crop is lost because of soil chemistry. In Punjab, about 69 in every 100 of the 770,160 soil samples tested had a pH above 8 (record of about 2016 to 2018). On hot, alkaline, calcareous soil (soil that contains free lime), urea left on the surface converts quickly to ammonia gas and escapes to the air. Soil with low organic matter holds little nitrogen. Flood irrigation can carry nitrate, a form of nitrogen, below the roots. Another part of the nitrogen is lost because of practice: when, where and in what form nitrogen is applied. Section 9 sets out what the published trials show for practice.</Lead>
      </S>

      <S id="nr-2" n="2" kicker="Efficiency among the largest users of nitrogen" title="Of the 29 countries that added 1 million tonnes or more of nitrogen to cropland in 2023, only Spain had a lower efficiency than Pakistan" bg>
        <P>Efficiency matters most where the tonnes of nitrogen added are large. In 2023, 29 countries added 1 million tonnes or more of nitrogen to their cropland. Pakistan, at 5.7 million tonnes, was the 5th largest, after China, India, Brazil and the United States.</P>
        <P>Per acre, Pakistan adds less nitrogen than Bangladesh, Egypt or mainland China, and a smaller share of it is taken out in the harvested crop. In 2023 Pakistan’s cropland received, on average, about 74 kg of nitrogen per acre from all sources, against about 114 kg in Bangladesh, 137 kg in Egypt and 117 kg in mainland China. About 22 kg an acre were taken out in the harvested crop in Pakistan, against 46 kg in Bangladesh, 62 kg in Egypt and 55 kg in mainland China.</P>
        <C><RankBars /></C>
        <P>A higher efficiency is not always better. The EU Nitrogen Expert Panel, which set out the indicator, set the desirable range at 50% to 90%. The panel treats efficiency below 50% as a sign that too much nitrogen is lost. Above 90%, there is a risk that the soil is being depleted; above 100%, as in Ukraine (103%) in 2023, crops take out more nitrogen than is added. The same panel put the desirable surplus (nitrogen added minus nitrogen taken out) below 80 kg a hectare, about 32 kg an acre. The panel’s measure counts all nitrogen taken off the field, while FAO’s efficiency counts only the harvested crop. If straw and stalks taken off the field are counted as well, Pakistan’s figure is about 42%, which is still below 50%. This report calls that figure ‘efficiency including straw and stalks’.</P>
        <P>Pakistan’s efficiency of 29% is 21 percentage points below the bottom of the panel’s desirable range of 50%. Of the 29 countries that add 1 million tonnes or more, 14 are inside the range, from Myanmar at 51% to Australia at 80%; 13 are below it and 2 are above it.</P>
        <P>The world figure of 55 kg per 100 kg of nitrogen is an average that includes countries whose soil is being depleted.</P>
      </S>

      <S id="nr-3" n="3" kicker="Where the nitrogen added in 2023 ended up" title="Of the 5.7 million tonnes of nitrogen added to Pakistan’s cropland in 2023, 1.7 million tonnes were taken out in the harvested crop">
        <C><WhereItWent /></C>
        <P>In 2023, 67% of the nitrogen added to Pakistan’s cropland came from fertiliser: 3.79 million tonnes. Manure supplied 1.16 million tonnes, 20%. Rain and dust, legumes and seed supplied the rest.</P>
        <P>Of the 5.68 million tonnes added, 1.66 million tonnes were taken out in the harvested crop, and FAO estimates that 1.49 million tonnes were lost to the air and 0.61 million tonnes to water. Straw and stalks taken off the field account for 0.72 million tonnes (as fodder, fuel or bedding); FAO does not count them in its efficiency figure. VAN calculated the remaining 1.20 million tonnes by subtraction; it is not a measurement. Some of it may stay in the soil, and some may be lost by routes FAO does not list, such as conversion back to nitrogen gas in wet ground.</P>
        <T head={['Where the nitrogen went, 2023', 'Million tonnes', 'Share of nitrogen added']} rows={[['Taken out in the harvested crop', '1.66', '29%'], ['To the air (FAO estimate)', '1.49', '26%'], ['To water (FAO estimate)', '0.61', '11%'], ['Straw and stalks taken off the field (FAO estimate)', '0.72', '13%'], ['Not accounted for (calculated)', '1.20', '21%'], ['Total added', '5.68', '100%']]} />
        <P>Loss to the air is the largest single loss in FAO’s estimate. This loss includes ammonia from manure as well as from fertiliser, and the ammonia lost from fertiliser depends heavily on how and when urea is applied (Section 9). FAO’s figures for loss to the air and to water are estimates, not field measurements.</P>
        <P>FAO does not split the loss by crop, by province or by product, and it does not say how much of the loss comes from soil and climate and how much from practice. We found no published measurement of that split for Pakistan, and VAN has not measured it.</P>
      </S>

      <S id="nr-4" n="4" kicker="Since 2000, nitrogen added has risen faster than nitrogen taken out" title="From 2000 to 2023, nitrogen added rose 72% and nitrogen taken out in the harvested crop rose 45%" bg>
        <C><InputsArea /></C>
        <P>From 1961 to 2023, fertiliser nitrogen applied to Pakistan’s cropland rose to 73 times its 1961 level, from about 52,000 tonnes to 3.79 million tonnes. Nitrogen taken out in the harvested crop rose to about 6 times its 1961 level, from 266,000 tonnes to 1.66 million tonnes.</P>
        <P>Between 2000 and 2023, nitrogen added again rose faster than nitrogen taken out, but both rose more slowly than before 2000. The table gives the change from 2000 to 2023.</P>
        <T head={['Pakistan, thousand tonnes of nitrogen (FAO estimates)', '2000', '2023', 'Change']} rows={[['Fertiliser', '2,265', '3,792', '+67%'], ['Manure', '449', '1,157', '+158%'], ['All sources (nitrogen added)', '3,310', '5,685', '+72%'], ['Taken out in the harvested crop', '1,140', '1,656', '+45%'], ['Surplus (added minus taken out in the harvested crop)', '2,170', '4,028', '+86%']]} />
        <P>Per acre of cropland, the nitrogen surplus rose from about 28 kg in 2000 to about 53 kg in 2023.</P>
        <P>The widening surplus does not show that the extra nitrogen had no effect: harvests grew. Seed, water, varieties and weather also changed over the same years, so these figures cannot show how much of the growth in harvests came from nitrogen. Between 2000 and 2023 the nitrogen taken out in the harvested crop rose by a smaller percentage than the nitrogen added (45% against 72%).</P>
      </S>

      <S id="nr-5" n="5" kicker="What the nitrogen added is worth at the urea price" title="At the Rabi 2024-25 urea price, the nitrogen added for each kg taken out in the harvested crop is worth about Rs 660 (a calculation)">
        <P>A buyer pays for the nitrogen in the bag. In Rabi 2024-25 a 50 kg bag of urea averaged Rs 4,435 (NFDC). Urea is 46% nitrogen, so the bag holds 23 kg of nitrogen, which makes the price Rs 193 for each kg of nitrogen. In Kharif 2024-25 (the summer crop season) the price was Rs 204 for each kg of nitrogen.</P>
        <P>The urea price does not show how much of the nitrogen added is taken out in the harvested crop. At Pakistan’s efficiency of 29.1%, about 3.4 kg of nitrogen was added for each kg taken out in the harvested crop. Valued at the urea price of Rs 193 a kg of nitrogen, that is a urea-price equivalent of about Rs 660. The urea-price equivalent is the value of the nitrogen added when all of it is priced at the urea price. This is an illustration because it also values the nitrogen from manure, rain and legumes at that price. If the nitrogen in straw and stalks taken off the field for fodder is counted as taken out, efficiency including straw and stalks is about 42% and the urea-price equivalent is about Rs 460.</P>
        <C><RealPrice /></C>
        <P>If Pakistan’s efficiency were Bangladesh’s, the nitrogen added for each kg taken out would be worth about Rs 480; at the world’s efficiency, about Rs 350. Only efficiency changes between the bars; the urea price is Rs 193 a kg in every bar.</P>
        <C><WheatPerKg /></C>
        <P>NFDC also reports how many kg of wheat, at the market price after harvest, are needed to buy 1 kg of nitrogen from urea. This was 3.48 kg in 2024-25, up from 2.22 kg in 2023-24, because the urea price rose and the wheat price fell. Dividing 3.48 kg by Pakistan’s efficiency of 29.1% gives about 12 kg of wheat for each kg of nitrogen taken out in the harvested crop. This is an illustration because FAO publishes no efficiency for wheat alone.</P>
        <T head={['Price of nitrogen from urea, NFDC', 'Kharif', 'Rabi']} rows={[['2023-24', 'Rs 142 a kg', 'Rs 187 a kg'], ['2024-25', 'Rs 204 a kg', 'Rs 193 a kg']]} />
        <P>Two things determine the urea-price equivalent of each kg of nitrogen taken out in the harvested crop: the urea price and efficiency. Over the 4 seasons from Kharif 2023-24 to Rabi 2024-25, the urea price moved between Rs 142 and Rs 204 a kg of nitrogen. If Pakistan’s efficiency reached Bangladesh’s, the urea-price equivalent for each kg taken out in the harvested crop would fall by about 28% at any urea price.</P>
      </S>

      <S id="nr-6" n="6" kicker="Nitrogen that would not be needed at higher efficiency, valued at the urea price" title="At the Rabi 2024-25 urea price, each 1% less nitrogen for the same harvest is worth about Rs 6.5 billion a year (an illustration)" bg>
        <P>The same arithmetic can be applied to Pakistan’s national nitrogen sales. Pakistan sold 3,387 thousand tonnes of nitrogen in 2024-25 (NFDC), down from 3,775 thousand tonnes in 2023-24. If its fields reached another country’s efficiency, either the same harvest would need less nitrogen, or the same nitrogen would grow a larger harvest. The figures below assume that Pakistan grows the same harvest with less nitrogen.</P>
        <C><ValueSlider /></C>
        <T head={['Urea-price equivalent, not projected farmer savings', 'Less nitrogen for the same harvest', 'Thousand tonnes, at 2024-25 sales', 'Urea-price equivalent a year']} min={640} rows={[['At Uzbekistan’s efficiency of 35%', '17%', '592', 'Rs 114 billion'], ['At Iran’s efficiency of 38%', '23%', '771', 'Rs 149 billion'], ['At Bangladesh’s efficiency of 40%', '28%', '936', 'Rs 181 billion'], ['At Egypt’s efficiency of 45%', '35%', '1,199', 'Rs 231 billion'], ['At mainland China’s efficiency of 47%', '38%', '1,301', 'Rs 251 billion'], ['At the world’s efficiency of 55% (an average that includes countries whose soil is being depleted)', '47%', '1,603', 'Rs 309 billion'], ['Each 1% less nitrogen', '1%', '34', 'Rs 6.5 billion']]} />
        <P>How the figure is calculated: at Bangladesh’s efficiency of 40.27% the same harvest needs 29.14 ÷ 40.27 of the nitrogen it needs at Pakistan’s efficiency of 29.14%, which is about 72.4%, so about 27.6% less. 27.6% of 3,387 thousand tonnes is about 936 thousand tonnes. At Rs 193 a kg that amount is about Rs 181 billion.</P>
        <Lead b="What these figures are not.">They are not savings anyone is promised. They value all nitrogen at the Rabi urea price, although some nitrogen is sold in DAP (diammonium phosphate) and other products at other prices. The calculation assumes that every source of nitrogen falls in the same proportion and that the harvest stays exactly the same; if fertiliser fell and manure did not, fertiliser would have to fall further. It combines 2024-25 sales with a 2023 efficiency. Because the 2 published series disagree on Bangladesh (Section 11), the drier irrigated countries of Uzbekistan and Iran are shown too. The calculation does not count what it would cost to reach a higher efficiency: better products, equipment, advice and time. They are a measure of the size of the gap, nothing more.</Lead>
      </S>

      <S id="nr-7" n="7" kicker="Nitrogen and the other nutrients" title="In 2023 Pakistan used 1.2 kg of potash (K2O) for every 100 kg of nitrogen; the world used 34 kg">
        <P>A crop takes up nitrogen together with the other nutrients. If the soil is short of potash, phosphate, sulfur or zinc, wheat cannot make full use of the nitrogen applied, and the unused nitrogen can be lost. Liebig’s Law of the Minimum states that the nutrient in shortest supply limits the harvest.</P>
        <C><RatioBars /></C>
        <P>Pakistan’s fertiliser is nearly all nitrogen. In 2024-25 nutrients sold were 78% nitrogen, 21% phosphate and 1% potash (NFDC): 3,387, 919 and 44.5 thousand tonnes. Bangladesh used 37 kg of potash and 69 kg of phosphate for every 100 kg of nitrogen in 2023; China 36 and 38; the world 34 and 38.</P>
        <P>Across 33 long-term rice-wheat experiments in the Indo-Gangetic Plains and China, yields stagnated in 72% (rice) and 85% (wheat) of them even at the recommended nitrogen, phosphate and potash (NPK). The authors wrote that “depletion of soil K seems to be a general cause” (K is potassium). In over 90% of the experiments, the potash applied was less than the potash taken out (Ladha et al. 2003). Zinc and phosphorus were also named as causes.</P>
        <Lead b="Evidence from farms in India’s Punjab.">On 56 wheat farms in Punjab, India, nitrogen, phosphate and potash were set to each field’s need and applied with better timing. Yield rose from 4.2 to 4.8 tonnes a hectare, and the share of fertiliser nitrogen recovered by the crop rose from 17% to 27% (Khurana et al. 2008). Amount, balance and timing were changed together, so the effect of balance alone cannot be separated.</Lead>
        <P>A wheat field study in Multan found that adding potash and zinc to nitrogen and phosphate raised nitrogen recovery by 230% compared with nitrogen and phosphate alone (Nawaz et al. 2024). The study was done at 1 site and was run with a fertiliser company, and the 230% is a relative change from a small starting value. We found no multi-site Pakistani trial that measures how much potash raises efficiency.</P>
        <P>The Soil Poverty report on this site (Tahir Abbas, 2026) is based on a model and has not been peer reviewed. It estimates that crops in Pakistan’s Punjab take about 940,000 tonnes of potash out of the soil a year, while fertiliser supplies about 36,000 tonnes. Where the soil is short of potash, part of the nitrogen applied is not used by the crop. <a href="#/knowledge/soil-poverty-punjab-potash">Read Soil Poverty: Punjab&rsquo;s potash →</a></P>
      </S>

      <S id="nr-8" n="8" kicker="What other countries did" title="China and the European Union reduced their nitrogen surplus; India’s surplus rose while a large fertiliser subsidy continued" bg>
        <P>Other countries have also added nitrogen that the harvested crop does not take out. This section reports what China, the European Union, the United States and India did, and what the data show. FAO’s figures and the OECD’s figures are built in different ways (the OECD counts all agricultural land, FAO only cropland), so they are given separately here and should not be mixed.</P>
        <C><ChinaTurn /></C>
        <Lead b="China set a national target after running a field programme.">In 2015 China’s Ministry of Agriculture issued an action plan for zero growth in chemical fertiliser use by 2020, with annual growth caps falling from 1% to 0.4%. National fertiliser use per hectare peaked in 2014 and has fallen since; its annual growth went from +1.1% a year in 2013-15 to −2.3% a year in 2016-18 (Yu, Li and Doluschitz 2020). On FAO’s figures, comparing the 3-year averages of 2014-16 and 2021-23, mainland China’s fertiliser nitrogen fell 20% while the nitrogen taken out in its harvested crops rose 10%, and its efficiency rose from 37% to 47%. Over the same years, Pakistan used 16% more fertiliser nitrogen and the nitrogen taken out in its harvested crops rose 9%; its efficiency went from 30% to 28%.</Lead>
        <P>Before the target, from 2005 to 2015, a national campaign worked with about 20.9 million farmers in 452 counties on a cumulative 37.7 million hectares of maize, rice and wheat. Average yields rose 10.8% to 11.5% while nitrogen fertiliser use fell 14.7% to 18.1% (Cui et al. 2018). Price and market policies also changed over these years; the record shows these changes happening together, but not which of them changed efficiency. The campaign did reach millions of small farms with advice for each field.</P>
        <C><SurplusAcre /></C>
        <P>In the European Union the nitrogen surplus fell 43.5% between 2000 and 2024, from 71.1 to 40.2 kg a hectare of agricultural land (OECD 2026, Table 12.32). Over 2014-23, total factor productivity (output relative to all inputs combined) grew about 1% a year (OECD 2026, Table 12.32). On FAO’s cropland measure the EU’s efficiency rose from 43% in 2000 to 54% in 2023.</P>
        <P>In the United States, the nitrogen surplus fell from 34.4 kg a hectare in 2000 to 29.0 kg a hectare in 2024. The OECD describes this as “better input management and reduced nutrient surpluses” (OECD 2026, Table 30.3). On FAO’s measure its efficiency was 71% in 2023.</P>
        <Lead b="India is shown as a warning.">It keeps fertiliser cheap with a large subsidy: INR 1.9 trillion (USD 23 billion) in 2023-24, after INR 2.55 trillion the year before. It made neem coating of urea mandatory and gives Soil Health Card-based advice. On the OECD’s measure its nitrogen surplus rose 47% from 2000 to 2024, from 90.7 to 133.4 kg a hectare (OECD 2026, Table 14.3, the percentage is VAN’s calculation); mandatory coating and soil cards, alongside a subsidy that keeps the price low, have not reversed that rise.</Lead>
        <P>Pakistan’s nitrogen surplus per acre nearly doubled from 2000 to 2023. In the countries whose efficiency improved, the nitrogen surplus was measured, a direction was set, and advice and better practice were taken to farmers’ fields.</P>
      </S>

      <S id="nr-9" n="9" kicker="Approaches to raising efficiency" title="The published trials examine 4 approaches: technology (the form of nitrogen), timing, placement and balanced nutrition">
        <P>Pakistan’s low efficiency has no single cause, so there is no single fix. The published work examines 4 approaches to raising efficiency. They are set out below in no particular order. Most of the work was done outside Pakistan, and the gains from different approaches cannot simply be added.</P>
        <Lead b="Pakistani field measurements of loss vary with site and method.">Nitrogen-15 is a labelled form of nitrogen that allows applied nitrogen to be traced. At Faisalabad, on irrigated land, a nitrogen-15 balance found that 39 kg of every 100 kg applied to maize were lost in 60 days, and 33 kg of every 100 kg applied to wheat over the season; the authors attributed most of the loss to ammonia (Mahmood et al. 1998). At Peshawar, on alkaline soil with urea worked in and watered, the measured loss as ammonia was 12.7% of applied nitrogen (Dawar et al. 2021). In a 2-season Pakistani wheat study on alkaline, calcareous soil, the measured loss as ammonia was about 4% of the basal nitrogen, the dose applied at sowing (Farooq et al. 2024). Total nitrogen lost (Faisalabad) and ammonia lost to the air (Peshawar and the 2-season study) are different measures and should not be swapped.</Lead>
        <C><LossByPractice /></C>
        <h3 className="mt-6">1. Technology: the form nitrogen comes in</h3>
        <P>Urea left on the surface of hot, alkaline soil is open to ammonia loss; Pakistani field measurements range from about 4% to 13% of applied nitrogen, depending on the site and the method. Products that slow the conversion to ammonia, or slow the release, keep more nitrogen in the soil until the root can take it.</P>
        <T min={680} head={['Source', 'Where', 'What was measured']} rows={[
          ['Silva et al. 2017, meta-analysis', 'Global', 'Urease inhibitor (NBPT): ammonia loss 31.0% of applied nitrogen with urea, 14.8% with treated urea, 52% less; average yield +5.3%'],
          ['Abalos et al. 2014, meta-analysis', 'Global', 'Inhibitors: yield +7.5%, nitrogen use efficiency +12.9%; in alkaline soils (pH 8 or more) the urease inhibitor had the largest effect'],
          ['Zhang et al. 2019, meta-analysis of 120 studies', 'Global, maize', 'Controlled-release urea at the same rate: yield +5.3%, nitrogen use efficiency +24.1%, ammonia loss 39.4% less'],
          ['Zhu et al. 2020, meta-analysis', 'China, wheat, maize, rice', 'Controlled-release urea: yield +7.2%, nitrogen use efficiency +23.4%; largest on soils low in organic carbon'],
          ['Dawar et al. 2021, field', 'Peshawar, wheat, alkaline soil', 'Urease inhibitor with biochar cut ammonia loss from 12.7% to 3.7% of applied nitrogen; the urease inhibitor raised grain yield 22% over urea alone'],
          ['Mahmood et al. 2011, nitrogen-15, pot study', 'NIAB, alkaline calcareous soil', 'A nitrification inhibitor (DCD) increased nitrogen loss: cotton 44% to 54%, maize 51% to 66%. Not every technology suits these soils'],
        ]} />
        <h3 className="mt-6">2. Timing: when the crop takes it up</h3>
        <P>A crop does not take up nitrogen evenly: wheat needs little in its first weeks and most of it as it tillers (grows side shoots) and grows. Nitrogen applied all at once at sowing stays in the soil until the crop needs it, and some of it can be lost in the meantime. Splitting the dose did not change ammonia loss in the global synthesis; where timing helps, it does so by matching the supply of nitrogen to the crop’s uptake. The trials below were done in India’s Punjab and northwest India. India’s national nitrogen surplus still rose (Section 8).</P>
        <T min={680} head={['Source', 'Where', 'What was measured']} rows={[
          ['Singh et al. 2002', 'Punjab, India, rice and wheat', 'Need-based nitrogen guided by a leaf colour chart or chlorophyll meter cut the nitrogen rice needed by 12.5% to 25% with no loss of yield'],
          ['Varinderpal-Singh et al. 2012, 6 field experiments', 'Punjab, India, irrigated wheat', 'A schedule tied to irrigation: 25 kg N a hectare at planting, 45 at the 1st irrigation, 30 or 45 at the 2nd by leaf colour, with high yields and better recovery'],
          ['Bijay-Singh et al. 2017, 7 field experiments', 'Northwest India, irrigated wheat', 'Sensor-guided nitrogen gave the same yield as a blanket 120 kg a hectare, with recovery 6.7% to 16.2% higher'],
          ['Khurana et al. 2007, 56 farms', 'Punjab, India, transplanted rice', 'Better timing and splitting raised nitrogen recovery from 20% to 30%; yield from 5.1 to 6.0 tonnes a hectare'],
        ]} />
        <h3 className="mt-6">3. Placement: where the nitrogen is put in relation to the root</h3>
        <P>Ammonia escapes most easily from urea broadcast on the surface. Urea placed below the surface, drilled, or watered in soon after is held by the soil.</P>
        <T min={680} head={['Source', 'Where', 'What was measured']} rows={[
          ['Pan et al. 2016, 824 observations', 'Global', 'Deep placement cut ammonia loss 55%; irrigation after application 35%'],
          ['Miah et al. 2016, 115 farmers’ fields, 9 seasons', 'Southern Bangladesh, rice', 'Urea placed deep as briquettes against broadcast urea: yield +11% to +31% with 28% to 44% less urea'],
          ['Mahmood et al. 2011, nitrogen-15, pot study', 'NIAB, alkaline calcareous soil, wheat', 'Urea solution injected at points lost 16% of applied nitrogen against 34% to 37% with the usual method'],
        ]} />
        <p className="small muted">We found no peer-reviewed Pakistani field trial on deep placement of urea, or on urea applied before compared with after a flood irrigation. The Bangladesh result is on flooded rice and does not transfer directly to wheat or cotton.</p>
        <h3 className="mt-6">4. Balanced nutrition: phosphate, potash and the other nutrients</h3>
        <P>Section 7 sets out the evidence. Nitrogen applied to a crop growing in soil short of potash, phosphate, sulfur or zinc is nitrogen the crop cannot fully use. Of the 4 approaches, this is the one for which the report compares Pakistan’s use of a nutrient with other countries: 1.2 kg of potash per 100 kg of nitrogen in Pakistan, against 37 kg in Bangladesh.</P>
        <Lead b="Ranking of the approaches.">The published work does not rank the 4 approaches for Pakistan, and they work together. A Pakistani review of the country’s nitrogen record names balanced crop nutrition, irrigation management, legumes in rotation, precise in-season nitrogen management and enhanced efficiency fertilisers as the routes to higher efficiency (Shahzad et al. 2019).</Lead>
      </S>

      <S id="nr-10" n="10" kicker="What it means for companies, policy makers and researchers" title="The next gain is in raising the share of nitrogen taken out in the harvested crop" bg>
        <Lead b="For companies that make, sell or brand crop nutrition products.">The urea price is one part of what nitrogen costs a farmer. The share of nitrogen taken out in the harvested crop is the other, and it is where product development, advice and balanced nutrition can add value: nitrogen in a form, at a time and in a place that suit Pakistan’s hot, alkaline fields, supplied with the potash, phosphate and micronutrients that the crop also needs. Most of the evidence for this comes from outside Pakistan (Section 11).</Lead>
        <Lead b="For those who set policy.">In the countries whose efficiency improved, the nitrogen surplus was measured (Section 8). We found no official Pakistani series of efficiency, by crop or by province. A published yearly figure, with soil tests on fixed sites, would allow every later policy to be judged by whether efficiency changes. A change in efficiency would not show that a policy caused it (Section 11).</Lead>
        <Lead b="For agronomists and researchers.">The largest gaps in the evidence concern Pakistan. Multi-site field trials on farmers’ fields are missing on 3 questions: placement, timing relative to irrigation, and the effect of balanced nutrition on nitrogen recovery. These trials should use nitrogen-15 or full nitrogen balances, and their results should be published openly.</Lead>
        <P>At VAN, we believe fertiliser development should begin with the soil, the crop and the conditions in which the nutrients will be used. The formulation should follow from the agronomy.</P>
        <P><b>Is Pakistan’s next breakthrough in crop nutrition about applying more fertiliser, or getting more from what we already apply? Where is the greatest opportunity: technology, timing, placement or balanced nutrition?</b></P>
        <P>Make every kilogram of nitrogen count.</P>
        <div className="flex flex-wrap gap-3 mt-4">
          <a className="btn btn-navy" href="#/partner">Make with us →</a>
          <a className="btn btn-ghost" href="#/knowledge/why-pakistan-must-shift">The national picture →</a>
        </div>
      </S>

      <S id="nr-11" n="11" kicker="Limits of the evidence" title="What the figures in this report do not show">
        <ul className="sp-list mt-3">
          <li><b>The national figures are estimates, not measurements.</b> FAO marks every Pakistani nitrogen value in this release as an estimate, apart from the fertiliser figure for 2 years (1974 and 2000), which it marks official. We found no Pakistani agency that publishes its own national nitrogen balance.</li>
          <li><b>Losses to the air and to water are FAO estimates.</b> FAO’s metadata for this release does not describe how these 2 losses are estimated. The 2 figures should be read as estimates, not field measurements.</li>
          <li><b>21% of the nitrogen added is not accounted for.</b> The 1.20 million tonnes is a calculated remainder. Some of it may build up in the soil, and some is lost by routes FAO does not list. We cannot say how the remainder divides between these 2.</li>
          <li><b>Straw and stalks are left out of efficiency.</b> FAO counts only the harvested crop in its efficiency figure and keeps straw and stalks taken off the field (0.72 million tonnes in 2023) as a separate item, for consistency with earlier releases. Counting them would raise Pakistan’s figure to about 42% (efficiency including straw and stalks). The same rule applies to every country; countries that take more straw off for fodder, as Pakistan does, have a lower efficiency under it.</li>
          <li><b>The 2 published series disagree on Bangladesh.</b> An older series (Lassaletta et al. 2014) gives Pakistan’s efficiency as 27% and Bangladesh’s as 28% in 2014; FAO gives 31% and 39% for the same year. Both series show Pakistan as low. The comparisons with Bangladesh throughout this report use FAO’s series.</li>
          <li><b>Fodder crops may be missing from FAO’s harvest figure.</b> FAO builds its harvest figure from its crop production statistics; we could not confirm whether fodder crops such as berseem are counted. If they are not, Pakistan’s efficiency is understated.</li>
          <li><b>FAO gives no efficiency by crop.</b> It gives 1 figure for all cropland. Efficiency will differ between wheat, rice, cotton, sugarcane and fodder. The wheat figure in Section 5 is an illustration, not a measurement for wheat.</li>
          <li><b>The charts show association, not cause.</b> They show nitrogen, harvests and policies changing together. They do not prove that any single cause changed efficiency. Seed, water, varieties, weather, farm size and prices changed over the same years. Only field trials measure the effect of a practice.</li>
          <li><b>Not all of the nitrogen loss can be avoided.</b> Part of Pakistan’s loss comes from its soil and climate and will remain. Separately, an efficiency above 90% carries a risk that the soil is being depleted, and above 100% the soil is being depleted.</li>
          <li><b>The rupee figures are equivalents.</b> They value all nitrogen at the Rabi 2024-25 urea price. They are not savings, not forecasts, and they do not count the cost of reaching a higher efficiency.</li>
          <li><b>Most trial evidence is from elsewhere.</b> The 4 approaches rest mainly on work in India, Bangladesh, China and global syntheses. Pakistani field evidence exists for losses and for a few products, but not at the scale needed to say how much each approach would change Pakistan’s national efficiency.</li>
        </ul>
        <C><Revision /></C>
        <Lead b="How the numbers were calculated.">All FAO figures come from the bulk download of the Cropland Nutrient Balance, December 2025 release, nitrogen. The efficiency figure is FAO’s own. “Not accounted for” is FAO’s nitrogen surplus minus its air and water estimates and its straw and stalk estimate. The 29 big users are every country (not region) with 1 million tonnes or more of nitrogen added in 2023; China is mainland China. FAO publishes per hectare of cropland; we converted to per acre at 1 acre = 0.4047 hectare. The urea-price equivalent is Rs 193 divided by 29.14%. The national value is 2024-25 nitrogen sales (3,387 thousand tonnes) times (1 minus Pakistan’s efficiency divided by the other country’s efficiency) times Rs 193 a kg. Ratios of potash and phosphate to nitrogen are from FAO’s fertiliser use per hectare of cropland, via Our World in Data.</Lead>
      </S>

      <section className="sec" id="nr-src" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <div className="mb-5"><span className="eyebrow soil">Sources</span><h2 className="max-w-[26ch]">Every figure, where it came from</h2></div>
        <ol className="sp-refs small">
          {REFS.map(([l, u]) => <li key={l}>{l}. <a href={u} target={u.startsWith('http') ? '_blank' : undefined} rel="noopener">{u.startsWith('http') ? u.replace(/^https?:\/\//, '').split('/')[0] : 'van.com.pk' + u}</a></li>)}
        </ol>
        <div className="flex flex-wrap gap-3 mt-6">
          <a className="btn btn-navy" href={NR_PDF} target="_blank" rel="noopener">Download the full report (PDF)</a>
          <a className="btn btn-ghost" href="#/partner">Make with us →</a>
        </div>
        <p className="cap mt-4">Vital Agri Nutrients · The cost of low nitrogen use efficiency in Pakistan · November 2026 · <a href="mailto:partner@van.com.pk">partner@van.com.pk</a></p>
      </div></section>
    </div>
  )
}
