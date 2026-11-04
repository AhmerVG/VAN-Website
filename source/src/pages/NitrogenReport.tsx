import type { ReactNode } from 'react'
import { NR_PDF } from '@/data/nitrogenReport'
import { NueLines, RankBars, WhereItWent, InputsArea, RealPrice, ValueSlider, RatioBars, ChinaTurn, SurplusAcre, WheatPerKg, Revision, LossByPractice } from '@/components/NitrogenCharts'

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
      <div className="mb-6"><span className="eyebrow soil">{n && <span className="k-num">{n}</span>}{kicker}</span><h2 className="max-w-[26ch]">{title}</h2></div>
      <div className="max-w-[118ch] sp-body">{children}</div>
    </div></section>
  )
}
const P = ({ children }: { children: ReactNode }) => <p className="mt-3">{children}</p>
const Lead = ({ b, children }: { b: string; children: ReactNode }) => <p className="mt-3"><b>{b}</b> {children}</p>
const C = ({ children }: { children: ReactNode }) => <div className="my-5">{children}</div>

const INDEX: [string, string][] = [['nr-1', '1 What reaches the harvest'], ['nr-2', '2 Among the big users'], ['nr-3', '3 Where it went'], ['nr-4', '4 More in, less back'], ['nr-5', '5 The real price'], ['nr-6', '6 The national value'], ['nr-7', '7 Nitrogen and balance'], ['nr-8', '8 What other countries did'], ['nr-9', '9 Where the gain can come from'], ['nr-10', '10 What it means'], ['nr-11', '11 Where the evidence runs out'], ['nr-src', 'Sources']]

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
  ['Punjab soil testing record, 770,160 samples, 2016-18, validated and mapped by VAN: Soil Atlas', '/soil.html'],
  ['Soil Poverty Series No. 1, Punjab’s potash, on this site', '/knowledge/soil-poverty-punjab-potash.html'],
]

export default function NitrogenReport() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(180deg, var(--rust-soft), var(--sand))' }}>
        <div className="wrap py-8 lg:py-12">
          <span className="eyebrow rust">A Vital Agri Nutrients report</span>
          <h1 className="max-w-[22ch]">The real price of nitrogen</h1>
          <p className="lead mt-3">29 of every 100 kg of nitrogen added to Pakistan&rsquo;s cropland leave the field in the harvest. The next gain is in what each kg contributes, not in its price.</p>
          <p className="mt-4 max-w-[118ch]"><b>Urea&rsquo;s nitrogen costs Rs 193 a kg on the bag. What a farmer wants is nitrogen in his crop.</b> In 2023, FAO estimates, 29% of all the nitrogen added to Pakistan&rsquo;s cropland left the field in harvested crops. The world as a whole was at 55%. Valued at that price, each kg of nitrogen that leaves in the harvest stands for about Rs 660 of nitrogen added from all sources: an illustrative equivalent, not a price anyone pays. This report sets out the evidence, what other countries did, where the gain can come from, and where the evidence runs out.</p>
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
            <li>In 2023, 29 of every 100 kg of nitrogen added to Pakistan&rsquo;s cropland left the field in the harvest. In 1961 it was 54. Bangladesh was at 40%, Egypt at 45%, mainland China at 47% and the world at 55%.</li>
            <li>Pakistan adds more nitrogen to its cropland than any country except China, India, Brazil and the United States. Of the 29 countries that add 1 million tonnes or more, only Spain had a lower rate. Per acre, Pakistan adds less than Bangladesh, Egypt or China, but takes far less off in the harvest: the gap is in what comes back.</li>
            <li>Of the 5.7 million tonnes added in 2023, FAO estimates 1.7 left in the harvest, 1.5 went to the air and 0.6 to water.</li>
            <li>At the Rabi 2024-25 price of Rs 193 a kg of nitrogen from urea, each kg that leaves in the harvest stands for about Rs 660 of nitrogen added (an illustrative urea-price equivalent). In wheat at the market price, that was about 7.6 kg in 2023-24 and 12 kg in 2024-25, after the wheat price fell.</li>
            <li>As an illustrative nitrogen-equivalent value, not projected farmer savings: at Bangladesh&rsquo;s rate, the same harvest would need about 28% less nitrogen, about Rs 181 billion a year at 2024-25 sales and the Rabi urea price. Each 1% is worth about Rs 6.5 billion.</li>
            <li>For every 100 kg of nitrogen, Pakistan used 1.2 kg of potash in 2023; the world used 34. Long-term experiments across the Indo-Gangetic Plains and China name potash depletion as a general cause of stalled yields.</li>
            <li>Between 2014-16 and 2021-23 (3-year averages), mainland China used 20% less fertilizer nitrogen and harvested 10% more nitrogen in its crops. Pakistan used 16% more and harvested 9% more.</li>
          </ul>
          <p className="small muted mt-3">The national figures are FAO estimates for 2023, the latest year published. The rupee values are urea-price equivalents: our arithmetic on NFDC prices and sales, a measure of size, not a price anyone pays or a saving anyone is promised. Section 11 sets out what the evidence cannot tell.</p>
        </div>
      </div></section>

      <S id="nr-1" n="1" kicker="What reaches the harvest" title="29 of every 100 kg leave the field in the harvest; for the world it is 55">
        <P>Nitrogen reaches a field from 5 places: fertilizer, manure, rain and dust, legumes that fix it from the air, and the seed itself. Some of it leaves in the grain, lint, cane and other crops that are harvested. The rest stays in the soil for a while, leaves in straw and stalks, goes to the air or washes out with water.</P>
        <P>FAO&rsquo;s Cropland Nutrient Balance counts both sides for every country, every year since 1961 where it has data. Its nitrogen use efficiency is the simplest measure there is: nitrogen in the harvest divided by nitrogen added. It does not say what is best for any single field. It says how much of what a country puts into its cropland comes back out as crop.</P>
        <C><NueLines /></C>
        <P>In 1961, when Pakistan used about 52,000 tonnes of fertilizer nitrogen a year, 54% of all the nitrogen added came back in the harvest. It peaked at 61% in 1970. By 2000 it was 34%; it averaged about 28% over 2021-23 and stood at 29% in 2023. The world started at about the same level as Pakistan (55% in 1961), fell to 39% in 1988, and was back at 55% in 2023.</P>
        <P>The comparisons nearest to Pakistan are all higher. Bangladesh was at 40% in 2023 and Egypt at 45%. Mainland China was at 34% in 2010, about where Pakistan was in 2000, and at 47% in 2023.</P>
        <Lead b="A low rate is not a farmer failing.">Part of the loss is chemistry. About 69 in every 100 of Punjab&rsquo;s 770,160 soil samples read above pH 8. On hot, alkaline, calcareous ground, urea left on the surface turns to ammonia gas quickly. Low organic matter means the soil holds little nitrogen in reserve. Flood irrigation can carry nitrate below the roots. Part of the loss is practice: when, where and in what form nitrogen goes on. Section 9 sets out what the published trials show for each.</Lead>
      </S>

      <S id="nr-2" n="2" kicker="Among the big users" title="Of 29 countries that add 1 million tonnes or more, only Spain is lower" bg>
        <P>Rates matter most where tonnes are large. In 2023, 29 countries added 1 million tonnes or more of nitrogen to their cropland. Pakistan, at 5.7 million tonnes, was the 5th largest, after China, India, Brazil and the United States.</P>
        <P>Large tonnes do not mean heavy use per acre. In 2023 every acre of Pakistan&rsquo;s cropland received, on average, about 74 kg of nitrogen from all sources, against about 114 kg in Bangladesh, 117 kg in mainland China and 137 kg in Egypt. What differs most is what comes back: about 22 kg an acre left Pakistan&rsquo;s fields in the harvest, against 46 kg in Bangladesh, 55 kg in China and 62 kg in Egypt. Pakistan&rsquo;s gap is in what each kg returns.</P>
        <C><RankBars /></C>
        <P>Higher is not always better. The EU Nitrogen Expert Panel, which set out the indicator, set the desirable range at 50% to 90%. Below 50%, too much nitrogen is lost. Above 90%, there is a risk that the soil is being drawn down; above 100%, as in Ukraine (103%) in 2023, crops take out more nitrogen than goes in. The same panel put the desirable surplus below 80 kg a hectare, about 32 kg an acre. The panel counts everything taken off the field; counting straw and stalks too, Pakistan&rsquo;s rate is about 42%, still below 50.</P>
        <P>Pakistan is 21 points below the bottom of that range. Of the 29 big users, 14 are inside it, from Myanmar at 51% to Australia at 80%; 13 are below it and 2 above.</P>
        <Lead b="What 29% means in plain terms.">Of every 100 kg of nitrogen the country&rsquo;s fields receive, from fertilizer, manure and every other source, 29 kg leave in the crop. For the world as a whole it is 55 kg, an average that includes countries drawing down their soil.</Lead>
      </S>

      <S id="nr-3" n="3" kicker="Where it went" title="Of 5.7 million tonnes added in 2023, 1.7 left in the harvest">
        <C><WhereItWent /></C>
        <P>67% of the nitrogen added to Pakistan&rsquo;s cropland in 2023 came from fertilizer: 3.79 million tonnes. Manure added 1.16 million tonnes, 20%. Rain and dust, legumes and seed added the rest.</P>
        <P>Of the 5.68 million tonnes, 1.66 million left in the harvest. FAO estimates that 1.49 million tonnes went to the air and 0.61 million tonnes to water. It estimates separately that 0.72 million tonnes left the field in straw and stalks, as fodder, fuel or bedding; FAO does not count these in its efficiency figure. That leaves 1.20 million tonnes not accounted for by any of FAO&rsquo;s items. It is calculated, not measured: some of it stays in the soil, some is lost by routes FAO does not list, such as conversion back to nitrogen gas in wet ground.</P>
        <T head={['Where the nitrogen went, 2023', 'Million tonnes', 'Share of nitrogen added']} rows={[['Left in the harvest', '1.66', '29%'], ['To the air (FAO estimate)', '1.49', '26%'], ['To water (FAO estimate)', '0.61', '11%'], ['Straw and stalks taken off the field (FAO estimate)', '0.72', '13%'], ['Not accounted for (calculated)', '1.20', '21%'], ['Total added', '5.68', '100%']]} />
        <P>Air is the largest single loss in FAO&rsquo;s estimate. It covers ammonia from manure as well as from fertilizer, and for fertilizer it depends heavily on how and when urea is applied. FAO&rsquo;s air and water figures are modelled, not measured; Section 9 sets out the field trials on ammonia loss separately.</P>
        <Lead b="What this does not show.">FAO does not split the loss by crop, by province or by product, and it does not say how much of the loss is the soil&rsquo;s doing and how much is practice. Nobody has measured that split for Pakistan, VAN included.</Lead>
      </S>

      <S id="nr-4" n="4" kicker="More in, less back" title="Since 2000, nitrogen added rose 72% and nitrogen in the harvest rose 45%" bg>
        <C><InputsArea /></C>
        <P>From 1961 to 2023, fertilizer nitrogen applied to Pakistan&rsquo;s cropland rose 73 times, from about 52,000 to 3.79 million tonnes. Nitrogen in the harvest rose about 6 times, from 266,000 to 1.66 million tonnes.</P>
        <P>The last 23 years tell the same story at a slower pace. From 2000 to 2023:</P>
        <T head={['Pakistan, thousand tonnes of nitrogen', '2000', '2023', 'Change']} rows={[['Fertilizer', '2,265', '3,792', '+67%'], ['Manure', '449', '1,157', '+158%'], ['All sources added', '3,310', '5,685', '+72%'], ['In the harvest', '1,140', '1,656', '+45%'], ['Balance (added minus harvest)', '2,170', '4,028', '+86%']]} />
        <P>Per acre of cropland, the balance rose from about 28 kg of nitrogen in 2000 to about 53 kg in 2023. On average, every acre of Pakistan&rsquo;s cropland received about 74 kg of nitrogen in 2023 from all sources, and about 22 kg left in the harvest.</P>
        <P>This does not mean the extra nitrogen did nothing. Harvests grew, and seed, water, varieties and weather changed over the same years. It means each extra kg returned less than the one before it, and the gap between what goes on and what comes off has widened.</P>
      </S>

      <S id="nr-5" n="5" kicker="The real price" title="Rs 193 a kg on the bag; about Rs 660 of nitrogen added for each kg in the harvest">
        <P>The price a buyer sees is the price of nitrogen in the bag. In Rabi 2024-25 a 50 kg bag of urea averaged Rs 4,435 (NFDC). Urea is 46% nitrogen, so the bag holds 23 kg of nitrogen: Rs 193 a kg. In Kharif 2024-25 it was Rs 204 a kg.</P>
        <P>The crop does not see the bag. It sees the nitrogen that reaches it, and the harvest carries out only part of what was added. At a national rate of 29.1%, each kg of nitrogen that leaves in the harvest stands for about 3.4 kg added. Valued at Rs 193, that is a urea-price equivalent of about Rs 660 per kg of nitrogen in the harvest. It is an illustration: it values nitrogen from manure, rain and legumes at the urea price too. Counting the straw and stalks taken off the field for fodder, the rate is about 42% and the equivalent about Rs 460.</P>
        <C><RealPrice /></C>
        <P>At Bangladesh&rsquo;s rate the same arithmetic gives about Rs 480; at the world&rsquo;s, about Rs 350. The bag price is the same in every bar. Only the share that comes back changes.</P>
        <C><WheatPerKg /></C>
        <P>NFDC also measures the price of nitrogen in wheat. In 2024-25, at the market price after harvest, it took 3.48 kg of wheat to buy 1 kg of nitrogen from urea, up from 2.22 kg in 2023-24, because the urea price rose and the wheat price fell. Divided by the national rate, that is about 12 kg of wheat for every kg of nitrogen that leaves in the harvest. This is an illustration: FAO does not publish an efficiency for wheat alone.</P>
        <T head={['Price of nitrogen from urea, NFDC', 'Kharif', 'Rabi']} rows={[['2023-24', 'Rs 142 a kg', 'Rs 187 a kg'], ['2024-25', 'Rs 204 a kg', 'Rs 193 a kg']]} />
        <Lead b="Why this is the number to watch.">A lower bag price changes what a kg costs. A higher rate changes how many kg a harvest needs. Over the last 4 seasons the price of a kg of nitrogen moved between Rs 142 and Rs 204. If Pakistan&rsquo;s fields reached Bangladesh&rsquo;s rate, the equivalent per kg in the harvest would fall by about 28% at any bag price.</Lead>
      </S>

      <S id="nr-6" n="6" kicker="The national value" title="Each 1% less nitrogen for the same harvest is worth about Rs 6.5 billion a year" bg>
        <P>The same arithmetic can be put in national terms. Pakistan sold 3,387 thousand tonnes of nitrogen in 2024-25 (NFDC), down from 3,775 thousand in 2023-24. If its fields reached another country&rsquo;s rate, the same harvest would need less of it, or the same nitrogen would grow a larger harvest. The figures below use the first reading.</P>
        <C><ValueSlider /></C>
        <T head={['Illustrative N-equivalent value, not projected farmer savings', 'Less nitrogen for the same harvest', 'Thousand tonnes, at 2024-25 sales', 'Urea-price equivalent a year']} min={640} rows={[['At Uzbekistan’s 35%', '17%', '591', 'Rs 114 billion'], ['At Iran’s 38%', '23%', '769', 'Rs 149 billion'], ['At Bangladesh’s 40%', '28%', '936', 'Rs 181 billion'], ['At Egypt’s 45%', '35%', '1,199', 'Rs 231 billion'], ['At mainland China’s 47%', '38%', '1,301', 'Rs 251 billion'], ['At the world’s 55% (an average that includes countries drawing down their soil)', '47%', '1,603', 'Rs 309 billion'], ['Each 1% less nitrogen', '1%', '34', 'Rs 6.5 billion']]} />
        <P>How it is worked: at Bangladesh&rsquo;s rate of 40.27% the same harvest needs 29.14 &divide; 40.27 of today&rsquo;s nitrogen, about 72.4%, so about 27.6% less. 27.6% of 3,387 thousand tonnes is about 936 thousand tonnes. At Rs 193 a kg that is about Rs 181 billion.</P>
        <Lead b="What these figures are not.">They are not savings anyone is promised. They value all nitrogen at the Rabi urea price, although some nitrogen comes in DAP and other products at other prices. They assume every source of nitrogen falls in the same proportion and the harvest stays exactly the same; if fertilizer fell and manure did not, fertilizer would have to fall further. They use 2024-25 sales against a 2023 rate. The 2 published series disagree on Bangladesh (Section 11), which is why the drier irrigated countries of Uzbekistan and Iran are shown too. They do not count what it would cost to reach a higher rate: better products, equipment, advice and time. They are a measure of the size of the gap, nothing more.</Lead>
      </S>

      <S id="nr-7" n="7" kicker="Nitrogen and balance" title="For every 100 kg of nitrogen, Pakistan used 1.2 kg of potash; the world used 34">
        <P>A crop takes nitrogen up with the other nutrients, not instead of them. A wheat plant short of potash, phosphate, sulfur or zinc cannot turn the nitrogen it is given into grain, and the nitrogen it does not use is open to loss. This is Liebig&rsquo;s Law of the Minimum: the shortest nutrient sets the harvest.</P>
        <C><RatioBars /></C>
        <P>Pakistan&rsquo;s fertilizer is nearly all nitrogen. In 2024-25 nutrients sold were 78% nitrogen, 21% phosphate and 1% potash (NFDC): 3,387, 919 and 44.5 thousand tonnes. Bangladesh used 37 kg of potash and 69 kg of phosphate for every 100 kg of nitrogen in 2023; China 36 and 38; the world 34 and 38.</P>
        <Lead b="What the long-term experiments show.">Across 33 long-term rice-wheat experiments in the Indo-Gangetic Plains and China, yields stagnated in 72% (rice) and 85% (wheat) of them even at the recommended NPK, and &ldquo;depletion of soil K seems to be a general cause&rdquo;; in over 90% the potash given was not enough to keep the potash balance level (Ladha et al. 2003). Zinc and phosphorus were named too.</Lead>
        <Lead b="On farms in the same region.">On 56 wheat farms in Punjab, India, setting nitrogen, phosphate and potash to each field&rsquo;s need, with better timing, raised yield from 4.2 to 4.8 tonnes a hectare and the share of fertilizer nitrogen recovered by the crop from 17% to 27% (Khurana et al. 2008). Rate, balance and timing were changed together, so the share due to balance alone cannot be separated.</Lead>
        <Lead b="In Pakistan.">A wheat field study in Multan found that adding potash and zinc to nitrogen and phosphate raised nitrogen recovery 230% over nitrogen and phosphate alone (Nawaz et al. 2024). It is 1 site, run with a fertilizer company, and a relative change on a small base. We found no multi-site Pakistani trial that measures how much potash raises nitrogen use efficiency.</Lead>
        <P>The Soil Poverty report on this site (Tahir Abbas, 2026), a model estimate that has not been peer reviewed, puts it this way: Punjab&rsquo;s crops take about 940,000 tonnes of potash out of the soil a year while fertilizer puts back about 36,000. A field short of potash wastes part of its nitrogen. <a href="#/knowledge/soil-poverty-punjab-potash">Read Soil Poverty: Punjab&rsquo;s potash →</a></P>
      </S>

      <S id="nr-8" n="8" kicker="What other countries did" title="China and the European Union cut their surplus; India&rsquo;s rose under a large subsidy" bg>
        <P>Other countries have faced the same gap. What they did, and what happened, is on the record. FAO&rsquo;s figures and the OECD&rsquo;s are built in different ways (the OECD counts all agricultural land, FAO only cropland), so they are given separately here and should not be mixed.</P>
        <C><ChinaTurn /></C>
        <Lead b="China: a national target, and a field programme.">In 2015 China&rsquo;s Ministry of Agriculture issued an action plan for zero growth in chemical fertilizer use by 2020, with annual growth caps falling from 1% to 0.4%. National fertilizer use per hectare peaked in 2014 and has fallen since; growth went from +1.1% a year in 2013-15 to &minus;2.3% a year in 2016-18 (Yu, Li and Doluschitz 2020). On FAO&rsquo;s figures, comparing the 3-year averages of 2014-16 and 2021-23, mainland China&rsquo;s fertilizer nitrogen fell 20% while nitrogen in its harvest rose 10%, and its rate rose from 37% to 47%. Pakistan, over the same years, used 16% more fertilizer nitrogen and harvested 9% more; its rate went from 30% to 28%.</Lead>
        <P>Before the target, from 2005 to 2015, a national campaign worked with about 20.9 million farmers in 452 counties on 37.7 million hectares of maize, rice and wheat. Average yields rose 10.8% to 11.5% while nitrogen fertilizer use fell 14.7% to 18.1% (Cui et al. 2018). Price and market policies also changed over these years; the record shows these moving together, not which one moved the rate. What it does show is advice reaching millions of small farms, field by field.</P>
        <C><SurplusAcre /></C>
        <Lead b="The European Union: less surplus, more output per input.">From 2000 to 2024 the EU&rsquo;s nitrogen balance fell 43.5%, from 71.1 to 40.2 kg a hectare of agricultural land, while total factor productivity grew about 1% a year over 2014-23 (OECD 2026, Table 12.32). On FAO&rsquo;s cropland measure the EU&rsquo;s rate rose from 43% in 2000 to 54% in 2023.</Lead>
        <Lead b="The United States.">Its nitrogen balance fell from 34.4 kg a hectare in 2000 to 29.0 in 2024, which the OECD reads as &ldquo;better input management and reduced nutrient surpluses&rdquo; (OECD 2026, Table 30.3). On FAO&rsquo;s measure its rate was 71% in 2023.</Lead>
        <Lead b="India, the warning.">India keeps fertilizer cheap with a large subsidy: INR 1.9 trillion (USD 23 billion) in 2023/24, after INR 2.55 trillion the year before. It made neem coating of urea mandatory and gives Soil Health Card-based advice. On the OECD&rsquo;s measure its nitrogen balance rose 47% from 2000 to 2024, from 90.7 to 133.4 kg a hectare (OECD 2026, Table 14.3, our arithmetic on the change); mandatory coating and soil cards, alongside a subsidy that keeps the price low, have not reversed that rise.</Lead>
        <P>Pakistan&rsquo;s surplus per acre nearly doubled from 2000 to 2023. The countries whose rate improved measured the balance, set a direction, and took advice and better practice to the field.</P>
      </S>

      <S id="nr-9" n="9" kicker="Where the gain can come from" title="Technology, timing, placement and balance: what the published trials show">
        <P>There is no single cause, so there is no single fix. The published work points to 4 places where the same nitrogen can do more. They are set out below in no order of size. Most of the work was done outside Pakistan, and gains from different levers cannot simply be added.</P>
        <Lead b="How much is lost in Pakistani fields.">Pakistani measurements vary with site and method. On irrigated land at Faisalabad, a nitrogen-15 balance found 39 kg of 100 kg applied to maize lost in 60 days, and 33 kg of 100 applied to wheat over the season; the authors put most of it down to ammonia (Mahmood et al. 1998). At Peshawar, on alkaline soil with urea worked in and watered, 12.7% of applied nitrogen was measured lost as ammonia (Dawar et al. 2021). In a 2-season Pakistani wheat study on alkaline, calcareous soil, about 4% of the basal nitrogen was measured lost as ammonia (Farooq et al. 2024). Ammonia lost to the air and total nitrogen lost are different measures and should not be swapped.</Lead>
        <C><LossByPractice /></C>
        <h3 className="mt-6">1. Technology: the form nitrogen comes in</h3>
        <P>Urea left on the surface of hot, alkaline soil is open to ammonia loss; Pakistani field measurements range from about 4% to 13% of applied nitrogen, depending on how and when it is applied. Products that slow the conversion to ammonia, or slow the release, keep more nitrogen in the soil until the root can take it.</P>
        <T min={680} head={['Source', 'Where', 'What was measured']} rows={[
          ['Silva et al. 2017, meta-analysis', 'Global', 'Urease inhibitor (NBPT): ammonia loss 31.0% of applied nitrogen with urea, 14.8% with treated urea, 52% less; average yield +5.3%'],
          ['Abalos et al. 2014, meta-analysis', 'Global', 'Inhibitors: yield +7.5%, nitrogen use efficiency +12.9%; in alkaline soils (pH 8 or more) the urease inhibitor had the largest effect'],
          ['Zhang et al. 2019, meta-analysis of 120 studies', 'Global, maize', 'Controlled-release urea at the same rate: yield +5.3%, nitrogen use efficiency +24.1%, ammonia loss 39.4% less'],
          ['Zhu et al. 2020, meta-analysis', 'China, wheat, maize, rice', 'Controlled-release urea: yield +7.2%, nitrogen use efficiency +23.4%; largest on soils low in organic carbon'],
          ['Dawar et al. 2021, field', 'Peshawar, wheat, alkaline soil', 'Urease inhibitor with biochar cut ammonia loss from 12.7% to 3.7% of applied nitrogen; the urease inhibitor raised grain yield 22% over urea alone'],
          ['Mahmood et al. 2011, nitrogen-15, pot study', 'NIAB, alkaline calcareous soil', 'A nitrification inhibitor (DCD) increased nitrogen loss: cotton 44% to 54%, maize 51% to 66%. Not every technology suits these soils'],
        ]} />
        <h3 className="mt-6">2. Timing: when the crop takes it up</h3>
        <P>A crop does not take up its nitrogen evenly: wheat needs little in its first weeks and most of it as it tillers and grows. Nitrogen applied all at once at sowing waits in the soil, open to loss, until the crop needs it. Splitting the dose did not change ammonia loss in the global synthesis; where timing helps, it is by matching supply to uptake. The trials below are research results from India&rsquo;s Punjab; India&rsquo;s national balance still rose, which is the warning.</P>
        <T min={680} head={['Source', 'Where', 'What was measured']} rows={[
          ['Singh et al. 2002', 'Punjab, India, rice and wheat', 'Need-based nitrogen guided by a leaf colour chart or chlorophyll meter cut the nitrogen rice needed by 12.5% to 25% with no loss of yield'],
          ['Varinderpal-Singh et al. 2012, 6 field experiments', 'Punjab, India, irrigated wheat', 'A schedule tied to irrigation: 25 kg N a hectare at planting, 45 at the 1st irrigation, 30 or 45 at the 2nd by leaf colour, with high yields and better recovery'],
          ['Bijay-Singh et al. 2017, 7 field experiments', 'Northwest India, irrigated wheat', 'Sensor-guided nitrogen gave the same yield as a blanket 120 kg a hectare, with recovery 6.7% to 16.2% higher'],
          ['Khurana et al. 2007, 56 farms', 'Punjab, India, transplanted rice', 'Better timing and splitting raised nitrogen recovery from 20% to 30%; yield from 5.1 to 6.0 tonnes a hectare'],
        ]} />
        <h3 className="mt-6">3. Placement: where the root is</h3>
        <P>Urea broadcast on the surface is in the place where ammonia escapes most easily. Placed below the surface, drilled, or watered in soon after, it is held by the soil.</P>
        <T min={680} head={['Source', 'Where', 'What was measured']} rows={[
          ['Pan et al. 2016, 824 observations', 'Global', 'Deep placement cut ammonia loss 55%; irrigation after application 35%'],
          ['Miah et al. 2016, 115 farmers’ fields, 9 seasons', 'Southern Bangladesh, rice', 'Urea placed deep as briquettes against broadcast urea: yield +11% to +31% with 28% to 44% less urea'],
          ['Mahmood et al. 2011, nitrogen-15, pot study', 'NIAB, alkaline calcareous soil, wheat', 'Urea solution injected at points lost 16% of applied nitrogen against 34% to 37% with the usual method'],
        ]} />
        <p className="small muted">We found no peer-reviewed Pakistani field trial on deep placement of urea, or on urea applied before against after a flood irrigation. The Bangladesh result is on flooded rice and does not transfer directly to wheat or cotton.</p>
        <h3 className="mt-6">4. Balanced nutrition: phosphate, potash and the rest beside it</h3>
        <P>Section 7 sets out the evidence. Nitrogen given to a crop short of potash, phosphate, sulfur or zinc is nitrogen the crop cannot fully use. Of the 4 levers it is the one where Pakistan&rsquo;s own numbers are furthest from its neighbours&rsquo;: 1.2 kg of potash per 100 kg of nitrogen against 37 in Bangladesh.</P>
        <Lead b="Which comes first.">The published work does not rank the 4 levers for Pakistan, and they work together. A Pakistani review of the country&rsquo;s nitrogen record names balanced crop nutrition, irrigation management, legumes in rotation, precise in-season nitrogen management and enhanced efficiency fertilizers as the routes to higher efficiency (Shahzad et al. 2019).</Lead>
      </S>

      <S id="nr-10" n="10" kicker="What it means" title="The next market is in what each kg contributes" bg>
        <Lead b="For companies that make, sell or brand nutrition.">The bag price is one part of the cost. The share that reaches the crop is the other, and it is where product development, advice and balanced nutrition can add value: nitrogen in a form, at a time and in a place that suits Pakistan&rsquo;s hot, alkaline fields, sold with the potash, phosphate and micronutrients beside it.</Lead>
        <Lead b="For those who set policy.">The countries whose rate improved measured it first. We found no official Pakistani series of nitrogen use efficiency, by crop or by province. A yearly figure, published, with soil tests on fixed sites, would let every later policy be judged by whether the rate moves.</Lead>
        <Lead b="For agronomists and researchers.">The largest gaps in the evidence are Pakistani: multi-site field trials of placement, timing against irrigation, and balance on nitrogen recovery, on farmers&rsquo; fields, with nitrogen-15 or full balances, and results published openly.</Lead>
        <P>At VAN, we believe fertilizer development should begin with the soil, the crop and the conditions in which nutrients must perform. The formulation should follow the agronomy.</P>
        <P><b>Is Pakistan&rsquo;s next breakthrough in crop nutrition about applying more fertilizer, or getting more from what we already apply? Where is the greatest opportunity: technology, timing, placement or balanced nutrition?</b></P>
        <P>Make every kilogram of nitrogen count.</P>
        <div className="flex flex-wrap gap-3 mt-4">
          <a className="btn btn-navy" href="#/partner">Make with us →</a>
          <a className="btn btn-ghost" href="#/knowledge/why-pakistan-must-shift">The national picture →</a>
        </div>
      </S>

      <S id="nr-11" n="11" kicker="Where the evidence runs out" title="What these numbers cannot tell">
        <ul className="sp-list mt-3">
          <li><b>They are estimates, not measurements.</b> FAO marks every Pakistani nitrogen value in this release as an estimate, apart from the fertilizer figure for 2 years (1974 and 2000), which it marks official. We found no Pakistani agency that publishes its own national nitrogen balance.</li>
          <li><b>Air and water are modelled.</b> FAO&rsquo;s metadata for this release does not describe how the 2 losses are estimated. They should be read as FAO&rsquo;s estimates, not field measurements.</li>
          <li><b>21% is not accounted for.</b> 1.20 million tonnes is a remainder. Some of it may build up in the soil; some is lost by routes FAO does not list. We cannot say how it splits.</li>
          <li><b>Straw and stalks are left out of the rate.</b> FAO counts only the harvest in its efficiency figure and keeps straw and stalks taken off the field (0.72 million tonnes in 2023) as a separate item, for consistency with earlier releases. Counting them would raise Pakistan&rsquo;s rate to about 42%. The same rule applies to every country; countries that take more straw off for fodder, as Pakistan does, score lower under it.</li>
          <li><b>Different series give different answers.</b> An older series (Lassaletta et al. 2014) puts Pakistan at 27% and Bangladesh at 28% in 2014; FAO puts them at 31% and 39% for the same year. Both say Pakistan is low. They disagree on Bangladesh.</li>
          <li><b>Fodder may be missing.</b> FAO builds its harvest figure from its crop production statistics; we could not confirm whether fodder crops such as berseem are counted. If they are not, Pakistan&rsquo;s rate is understated.</li>
          <li><b>No efficiency by crop.</b> FAO gives 1 figure for all cropland. Wheat, rice, cotton, sugarcane and fodder will differ. The wheat figure in Section 5 is an illustration, not a wheat measurement.</li>
          <li><b>Association, not cause.</b> The charts show nitrogen, harvests and policies moving together. They do not prove that a particular cause moved the rate. Seed, water, varieties, weather, farm size and prices changed over the same years. Only field trials measure the effect of a practice.</li>
          <li><b>Not all the loss can be won back.</b> Above 90% there is a risk the soil is being drawn down, and above 100% it is. Part of Pakistan&rsquo;s loss is the soil and the climate, and will remain.</li>
          <li><b>The rupee figures are equivalents.</b> They value all nitrogen at the Rabi 2024-25 urea price. They are not savings, not forecasts, and they do not count the cost of reaching a higher rate.</li>
          <li><b>Most trial evidence is from elsewhere.</b> The 4 levers rest mainly on work in India, Bangladesh, China and global syntheses. Pakistani field evidence exists for losses and for a few products, but not at the scale needed to say how much each lever would move the national rate.</li>
        </ul>
        <C><Revision /></C>
        <Lead b="How the numbers were worked.">All FAO figures come from the bulk download of the Cropland Nutrient Balance, December 2025 release, nitrogen, read row by row. The rate is FAO&rsquo;s own. &ldquo;Not accounted for&rdquo; is FAO&rsquo;s nitrogen balance minus its air and water estimates and its straw and stalk estimate. The 29 big users are every country (not region) with 1 million tonnes or more of nitrogen added in 2023; China is mainland China. FAO publishes per hectare of cropland; we converted to per acre at 1 acre = 0.4047 hectare. The urea-price equivalent is Rs 193 divided by 29.14%. The national value is 2024-25 nitrogen sales (3,387 thousand tonnes) times (1 minus Pakistan&rsquo;s rate divided by the other rate) times Rs 193 a kg. Ratios of potash and phosphate to nitrogen are from FAO&rsquo;s fertilizer use per hectare of cropland, via Our World in Data.</Lead>
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
        <p className="cap mt-4">Vital Agri Nutrients · The real price of nitrogen · November 2026 · <a href="mailto:partner@van.com.pk">partner@van.com.pk</a></p>
      </div></section>
    </div>
  )
}
