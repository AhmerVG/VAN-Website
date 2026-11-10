import { rateLabel } from '@/lib/season'
import { ALTERNATIVES } from '@/data/alternatives'
import { PRODUCTS, WHEAT_PLAN } from '@/data/catalogue'
import { wa, COUNTS } from '@/data/site'
import { MASTER_PRODUCTS } from '@/data/pricing'
import { PackShot, MethodIcon, WaButton, lmsUrl, productBySlug, planLabel } from '@/components/bits'
import { ProductSoilStrip } from '@/components/soil/SoilBits'
import { FamilyShot } from './Products'
import VitalUrea from './VitalUrea'
import { Pack3D } from '@/components/Pack3D'

// Datasheets and safety data sheets listed on the live knowledge hub — Crop Force has no datasheet listed there.
// H2, 24 Sep 2026: the same slug pin as LMS_FILE_BY_SLUG in bits.tsx. The display name "V. Ammonium
// Phosphate" derives VAN-TDS-V.-Ammonium-Phosphate.pdf, which 404s; the files on the server are
// VAN-TDS-V-Phosphate.pdf and VAN-SDS-V-Phosphate.pdf (both 200, checked by the link audit).
// Revert: delete DOC_STEM_BY_SLUG and put p.name back in place of docStem(p) below.
import { Flagship, FLAGSHIP_SLUGS } from '@/components/Flagship'
import { ApplicationMethods } from '@/components/ApplicationMethods'
const DOC_STEM_BY_SLUG: Record<string, string> = { 'v-phosphate': 'V-Phosphate' }
const docStem = (p: { name: string; slug: string }) => DOC_STEM_BY_SLUG[p.slug] ?? p.name.replace(/%/g, '').replace(/\s+/g, '-')
// D-188, 26 Sep 2026: Crop Force has 2 datasheets, 1 per grade, already on the server in spec-sheets/.
// They were committed but never linked. tdsUrls() returns 1 link for every other product and 2 here.
// D-323, 27 Oct 2026: 15:15:15 discontinued (Tahir); only the 12:12:18 datasheet is linked.
// Tahir 10 Nov 2026 (LM-N1): 15:15:15 is still sold; its datasheet is linked again (VAN-TDS-Crop-Force-15-15-15.pdf answers 200 on the live server, checked 10 Nov 2026).
const CROP_FORCE_TDS: [string, string][] = [['Technical data sheet 15:15:15', 'https://www.van.com.pk/spec-sheets/VAN-TDS-Crop-Force-15-15-15.pdf'], ['Technical data sheet 12:12:18', 'https://www.van.com.pk/spec-sheets/VAN-TDS-Crop-Force-12-12-18.pdf']]
const tdsUrls = (p: { name: string; slug: string }): [string, string][] => (p.slug === 'crop-force' ? CROP_FORCE_TDS : [['Technical data sheet', `https://www.van.com.pk/spec-sheets/VAN-TDS-${docStem(p)}.pdf`]])
const sdsUrl = (p: { name: string; slug: string }) => `https://www.van.com.pk/sds/VAN-SDS-${docStem(p)}.pdf`

/** B's layout with A's spec-sheet block and "Programmes that use it"; the soil strip sits above the order CTA. */
/**
 * The three brands that do NOT hold a PSQCA manufacturing licence, each with the reason VAN's own
 * regulatory page already publishes. Kept as verbatim status, not as a softened version of the
 * blanket claim: "under registration" and "no licence applies" are different facts and a reader
 * checking the regulatory page must find the same sentence on both.
 */
// L2 fact check 9 Nov 2026 (W8): products no VAN crop plan names (checked against every plan row).
const NO_PLAN_SLUGS = ['sop', 'v-germinator-pro']
// Tahir 10 Nov 2026 (R3-8, R3-9): the stage printed as a sentence on these product pages, in place of the stage tags.
// R3-8: VAN's guidance of 23 July 2026, worded as in the V-Germinator Pro deck. R3-9: the crop plan stage governs.
const STAGE_TEXT: Record<string, string> = {
  'v-germinator-pro': 'Stages by crop group: fruiting vegetables 1 week after planting, then before and after flowering; potato at tuber initiation; maize at 2 to 3 leaves; orchards about 40 days after the first phosphate application (VAN guidance, 23 July 2026).',
  'humi-grow-plus': 'At the stage each crop plan gives (germination or early growth).',
}
const LAB_LINE = 'Each batch is tested before dispatch in LAB 336, VAN’s own laboratory, which is accredited by PNAC (Pakistan National Accreditation Council) to ISO/IEC 17025:2017.'
const REGISTRATION_EXCEPTIONS: Record<string, string> = {
  // Tahir 7 Nov 2026 (PR-1): SOP is bought in from a supplier and is not offered under a partner's brand.
  'sop': `VAN does not manufacture SOP. It is a traded commodity, so VAN holds no product licence for it. Each batch of SOP is tested before dispatch in LAB 336, VAN’s own laboratory, which is accredited by PNAC (Pakistan National Accreditation Council) to ISO/IEC 17025:2017.`,
  'v-mag-essential': `V-Mag Essential does not hold a PSQCA licence. Instead, it carries a conformance report. ${LAB_LINE}`,
  'v-compost': `V-Compost is registered with the Soil Fertility Research Institute, not with PSQCA, because compost is registered under a different regime. ${LAB_LINE}`,
}
/** The first sentence under the h1 on the 2 flagship template pages: what the product is and what it is for, from facts already on each page. */
const PURPOSE: Record<string, string> = {
  'green-phosphate': 'Green Phosphate is a phosphate fertiliser with a declared analysis of 6:32:0: 6% nitrogen and 32% phosphate as P₂O₅. Its granules are acidic and coated with humic material, and it is made for alkaline soil. It is the 6:32 grade of the VAN NP Range.',
  'vital-potash': 'Vital Potash is a fully water-soluble potash fertiliser with 11% nitrogen and 44% potash as K₂O, and boron coated on each granule in 2 forms. It is applied through irrigation water at the stages each crop plan gives, most often grand growth and maturity.',   // Tahir 9 Nov 2026: was '... at grand growth and maturity, when the crop fills its grain, tubers or fruit.'
}

/** Tahir 7 Nov 2026 (PR-31): "bag" on granular products, "bottle or can" on liquids (sold by the litre). */
const packWord = (slug: string) => (MASTER_PRODUCTS.some(m => m.slug === slug && m.packUnit === 'L') ? 'bottle or can' : 'bag')

export default function ProductPage({ slug }: { slug: string }) {
  if (slug === 'vital-urea') return <VitalUrea />
  const p = productBySlug(slug)
  if (!p) {
    return (
      <div className="wrap py-16 text-center">
        <h1>No product by that name</h1>
        <p className="lead mx-auto mt-4">See the full list of {PRODUCTS.filter(x => !x.family).length} brands, each with its published analysis.</p>
        <a className="btn btn-gold mt-6" href="#/products">All brands →</a>
      </div>
    )
  }
  const wheatRows = WHEAT_PLAN.filter(r => r.slug === p.slug)
  const members = p.family ? PRODUCTS.filter(x => !x.family && x.cat === 'P' && /6[-:]32/.test(x.analysis)) : []
  const related = PRODUCTS.filter(x => x.cat === p.cat && x.slug !== p.slug)
  const orderHref = wa(`Hello VAN. I’d like to order ${p.name}. Quantity and district:`)
  // The pairing reads in both directions: on Green Phosphate's page the other one is Fusion
  // Phosphate, and on Fusion Phosphate's page it is Green Phosphate.
  const fwd = ALTERNATIVES.find(a => a.slug === p.slug)
  const back = ALTERNATIVES.find(a => a.altSlug === p.slug)
  const altPair = fwd
    ? { otherSlug: fwd.altSlug, otherName: fwd.altName, difference: fwd.difference }
    : back
      ? { otherSlug: back.slug, otherName: productBySlug(back.slug)?.name ?? back.slug, difference: back.difference }
      : null
  return (
    <div className="wrap py-8 lg:py-12">
      <p className="cap"><a href="#/products">VAN brands</a> / {p.catLabel} / {p.name}</p>
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-12 mt-4 items-start">
        <div className="lg:sticky lg:top-20">
          <div className="panel p-6 flex items-center justify-center" style={{ minHeight: 360, background: 'linear-gradient(180deg,#fff,var(--sand-2))' }}>
            {p.family ? <FamilyShot max={420} /> : <PackShot slug={p.slug} hi style={{ maxHeight: 400, width: 'auto' }} />}
          </div>
          {!p.family && <Pack3D slug={p.slug} name={p.name} />}
        </div>
        <div>
          <div className="flex flex-wrap gap-2"><span className="tag tag-navy">{p.catLabel}</span>{p.exclusive ? <span className="tag tag-gold">VAN exclusive</span> : <span className="tag tag-green">{p.badge}</span>}</div>
          <h1 className="mt-3">{p.name}</h1>
          {PURPOSE[p.slug] && <p className="lead mt-3">{PURPOSE[p.slug]}</p>}
          <p className="lead mt-3" style={{ color: 'var(--navy)' }}>{p.analysis}</p>
          {/* Tahir 7 Nov 2026 (PR-25): the soil strip sits under the opening, with a bridge sentence from the product to the soil figure. */}
          <div className="mt-5"><ProductSoilStrip product={p} /></div>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            <div className="panel p-4"><div className="cap uppercase tracking-[.08em] font-bold">How it is applied</div><div className="flex flex-wrap gap-2 mt-2">{p.methods.map(m => <span key={m} className="chip chip-sm" style={{ cursor: 'default' }}><MethodIcon method={m} size={18} />{m}</span>)}</div></div>
            <div className="panel p-4"><div className="cap uppercase tracking-[.08em] font-bold">Stage</div>{STAGE_TEXT[p.slug] ? <p className="small mt-2">{STAGE_TEXT[p.slug]}</p> : <div className="flex flex-wrap gap-2 mt-2">{p.stages.map(s => <span key={s} className="chip chip-sm gold on" style={{ cursor: 'default' }}>{s}</span>)}</div>}</div>
          </div>
          {p.family && (
            <div className="panel-soil p-4 mt-4">
              <p className="small">The VAN NP Range has 3 grades, 6:32, 5:40 and 8:38, designed to reduce the fixation of phosphate by calcium in the soil. The 6:32 grade is sold under its own brand name, Green Phosphate.</p>
              <div className="flex flex-wrap gap-2 mt-2">{members.map(m => <a key={m.slug} className="btn btn-white btn-sm" href={`#/products/${m.slug}`}>{m.name} →</a>)}</div>
            </div>
          )}
          {/* Tahir 9 Sep: the two phosphates are offered as a choice, both ways round. Neither page
              tells the reader the other is better. It states what differs and links across. */}
          {/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction. The bag-count line came off here because the difference line under it already says it. */}
          {altPair && (
            <div className="panel-soft p-4 mt-5">
              <span className="eyebrow navy">Your choice</span>
              <p className="small mt-1 max-w-[140ch]">
                In VAN’s crop plans, <b>{p.name}</b> and <a href={`#/products/${altPair.otherSlug}`}>{altPair.otherName}</a> are
                alternatives: where a plan names one of them for the phosphorus application, you can use the other instead.
              </p>
              <p className="cap mt-2 max-w-[140ch]">{altPair.difference}</p>
            </div>
          )}
          {/* 26 Sep 2026 · Tahir: circularity was hidden; link it "closer to potash products". Worded to the
              circular page's own limit: recovered potassium goes into every potash grade as a raw material,
              so no single bag is claimed to contain it. */}
          {/* Tahir 7 Nov 2026 (KN-12): period named (2026; month still to be given) and the block taken off SOP, which VAN buys in and does not make.
              Was: 'About 1 in 5 tonnes of the potash VAN uses is recovered from crop residue ash instead of being imported. ...' on all 5 potash pages. */}
          {p.cat === 'K' && p.slug !== 'sop' && (
            <a className="pp-loop mt-4" href="#/circular-economy">
              <span className="pp-loop-k">Potash recovered from crop residue ash</span>
              <span>In 2026 to date, about 1 tonne in every 5 tonnes of the potash that VAN used as a raw material was recovered from crop residue ash, so it did not have to be imported. VAN uses this recovered potash as a raw material across its potash grades.</span>
              <span className="pp-loop-a">How potash is recovered from crop residue ash →</span>
            </a>
          )}
          <div className="flex flex-wrap gap-3 mt-5">
            <WaButton href={orderHref} lg>Order on WhatsApp</WaButton>
            <a className="btn btn-ghost btn-lg" href="#/verify">Verify a {packWord(p.slug)}</a>
          </div>
          <p className="cap mt-3">Send the quantity you need and your district on WhatsApp. VAN replies with the price, whether the product is available, and how it can be delivered.</p>

          <h2 className="text-[clamp(24px,2.4vw,32px)] mt-10 mb-2">Specification</h2>
          <div className="spec">
            <div className="k">Product</div><div className="font-semibold">{p.name}{p.family ? ': 3 grades' : ''}</div>
            <div className="k">Analysis</div><div>{p.analysis}</div>
            <div className="k">Category</div><div>{p.catLabel}</div>
            <div className="k">Application</div><div>{p.methods.join(' · ')}</div>
            <div className="k">Stage</div><div>{STAGE_TEXT[p.slug] ?? p.stages.join(' · ')}</div>
            <div className="k">Availability</div><div><span className={`tag ${p.exclusive ? 'tag-gold' : 'tag-green'}`}>{p.badge}</span>{/* PR-1: own-brand caption only where the badge offers own-brand manufacturing (not on SOP) */}{!p.exclusive && p.badge.includes('Own-brand') && <span className="cap ml-3">VAN makes your product to the same specification as {p.family ? 'the ' : ''}{p.name}, on the same production line and with the same quality control. The product carries your label.</span>}</div>
            {/* O-16/audit item 2, 9 Sep 2026 (Tahir ruled: pull the claim, keep the product). Every
                product page carried the same blanket "Registered with PSQCA" line, including the three
                that do not hold a PSQCA licence, and VAN's OWN regulatory page says so plainly. On a
                site whose whole argument is that every claim traces to a document, a product page
                cannot contradict the regulatory page. Each of the three now states its real status,
                taken verbatim from the reason the regulatory page already gives.
                Revert: delete REGISTRATION_EXCEPTIONS and restore the single blanket sentence.
                Tahir 7 Nov 2026 (PR-7): the V. Ammonium Phosphate grade is 11:44:0, licence note included.
                Tahir 10 Nov 2026 (FU-1): the product is sold as V-Phosphate; the licence note no longer says "it is sold as V. Ammonium Phosphate". */}
            {/* Tahir 7 Nov 2026 (CO-46): on the 20 licensed brands the row names the PSQCA licence; the NP Range family row is left as it was (open question). */}
            {/* Tahir 10 Nov 2026 (PR-N7): all 3 NP Range grades hold a PSQCA licence. Was "The VAN NP Range is registered with PSQCA (...)". The NP Range is the only family product. */}
            <div className="k">Registration</div><div>{REGISTRATION_EXCEPTIONS[p.slug] ?? (p.family ? `The ${p.name} is registered with PSQCA (Pakistan Standards and Quality Control Authority). ${LAB_LINE}` : `VAN holds a PSQCA (Pakistan Standards and Quality Control Authority) licence for ${p.name}. ${LAB_LINE}`)}{' '}{!REGISTRATION_EXCEPTIONS[p.slug] && p.slug === 'v-phosphate' && <span className="cap block mt-1">The licence registers this product as <strong>V-Phosphate 11:44:0</strong>. The bag on sale still reads V. Ammonium Phosphate. Until July 2026 it was registered as V-Ammonium Phosphate 12:44:0. It is the same product under both registrations.</span>}</div>
            <div className="k">Lab report</div><div>Enter the batch number printed on the {packWord(p.slug)} to open the lab report (certificate of analysis) for that batch. <a href="#/verify">Verify a {packWord(p.slug)} →</a></div>{/* PR-31 */}
          </div>

          {/* D-196, 27 Sep 2026: the flagship treatment. Vital Urea has its own page (VitalUrea.tsx) and
              carries the same block there. */}
          {FLAGSHIP_SLUGS.includes(p.slug) && <div className="mt-10"><Flagship slug={p.slug} /></div>}
          {/* D-207, 27 Sep 2026: drill first, side-dress second, broadcast last, on every basal granule. */}
          <ApplicationMethods slug={p.slug} />

          <h2 className="text-[clamp(24px,2.4vw,32px)] mt-10 mb-2">{wheatRows.length > 0 ? `${p.name} in VAN’s wheat plan` : `Crop plans that use ${p.family ? 'the ' : ''}${p.name}`}</h2>
          {wheatRows.length > 0 ? (
            <>
              <p className="cap mb-3">Rates are per acre, from VAN’s published wheat plan. “1 bag” means 1 bag of the pack size shown in the Pack column. For other crops, see the {COUNTS.cropPlans} crop plans.</p>
              <div className="panel overflow-x-auto"><table className="tbl">
                <thead><tr><th>Crop</th><th>Stage</th><th>Nutrient</th><th className="r">Rate</th><th>Method</th><th>Pack</th></tr></thead>
                <tbody>{/* L1 7 Nov 2026 (m10): stage and method shown in 1 form; the plan rows are unchanged */}{wheatRows.map((r, i) => <tr key={i}><td className="font-semibold"><a href="#/crops/wheat">Wheat</a></td><td>{planLabel(r.stage)}</td><td>{r.band}</td><td className="r num font-semibold">{rateLabel(r)}</td><td><span className="inline-flex items-center gap-1"><MethodIcon method={r.method} size={16} />{planLabel(r.method)}</span></td><td>{r.pack.replace(' - ', ' · ')}</td></tr>)}</tbody>
              </table></div>
              <a className="btn btn-gold btn-sm mt-3" href="#/crops/wheat">Open the wheat plan →</a>
            </>
          ) : (
            // L1 editor round, 7 Nov 2026 (B1, M2): the NP Range's 6:32 grade is in the wheat plan as Green Phosphate,
            // and Fusion Phosphate is the alternative to the Green Phosphate row, so neither page says "does not use".
            // Was, on both: 'The wheat plan does not use {the} {name}.'
            // L2 fact check 9 Nov 2026 (W8): no row in the 28 plans names SOP or V-Germinator Pro (D-59), so those 2 pages say so
            // in place of 'The crop plans show which crops use {name} and at which stage. The wheat plan does not use {name}.'
            NO_PLAN_SLUGS.includes(p.slug) ? <p className="small max-w-[140ch]">No VAN crop plan uses {p.name} at present. <a href="#/crops">Open the crop plans →</a></p> :
            <p className="small max-w-[140ch]">The crop plans show which crops use {p.family ? 'the ' : ''}{p.name} and at which stage. {p.family && WHEAT_PLAN.some(r => r.slug === 'green-phosphate')
              ? `The wheat plan uses the 6:32 grade of the ${p.name}, sold as Green Phosphate.`
              : back && WHEAT_PLAN.some(r => r.slug === back.slug)
                ? `The wheat plan names ${productBySlug(back.slug)?.name ?? back.slug} for the phosphorus application. You can use ${p.name} in its place, as explained above.`
                : `The wheat plan does not use ${p.family ? 'the ' : ''}${p.name}.`} <a href="#/crops">Open the crop plans →</a></p>
          )}
          {p.slug === 'green-phosphate' && <p className="small mt-4 max-w-[140ch]"><a href="#/products/np-range">See the 3 grades of the VAN NP Range →</a></p>}
          {/* 11 Sep 2026 · Tahir's rulings on the agronomy decision sheet, items A3, A4 and B3. The
              product pages named one method each while the crop plans used another; he ruled that
              both are real and that the page should say so, rather than one side being corrected to
              match the other. Green Sulfur also carries the crop-driven rate range, which he
              confirmed is deliberate. Revert: delete these two lines. */}
          {/* L2 fact check 9 Nov 2026 (W9, option (a) of the open Green Sulfur question): no plan row broadcasts Green Sulfur at land
              preparation (8 rows drill at sowing, 2 side-dress or broadcast, 32 fertigate). Was 'Depending on the crop plan, Green Sulfur is
              either broadcast at land preparation or applied by fertigation. Broadcasting at land preparation puts the elemental sulfur in
              contact with the soil and gives soil microbes several weeks to oxidise it to sulfate, the form that roots take up.'
              W10: Fusion Potash likewise; was 'either broadcast at land preparation or applied by fertigation'. */}
          {p.slug === 'green-sulfur' && <h3 className="mt-8 mb-2">How Green Sulfur is used in VAN’s crop plans</h3>}
          {p.slug === 'green-sulfur' && <p className="small mt-2 max-w-[140ch]">Depending on the crop plan, the granules are drilled at sowing at land preparation (broadcast if there is no drill) or side-dressed at germination, or the powder is applied by fertigation. In the soil, microbes take several weeks to oxidise the elemental sulfur to sulfate, the form that roots take up. <b>The rate of Green Sulfur depends on the crop: about 2 kg per acre on wheat and the pulses, and about 10 kg per acre on cotton, maize, potato and garlic.</b> Your crop’s plan gives the method and the rate.</p>}
          {/* L2 fact check 10 Nov 2026 (decks batch C): 3 pack sizes in both grades, as Tahir ruled for the deck (LM-N14, 9 Nov). Was '2 pack sizes, 1 kg and 20 kg.' */}
          {p.slug === 'green-sulfur' && <p className="small mt-3 max-w-[140ch]" data-sulfur-packs><b>Green Sulfur is sold in 3 pack sizes, 1 kg, 5 kg and 20 kg, in both grades.</b> Where a plan’s rate is 5 kg or less at each application, the plan lists the 1 kg bag. Where the rate is larger, it lists the 20 kg bag. Each crop plan and the shopping list on its crop page give the rate in kg.</p>}
          {p.slug === 'fusion-potash' && <h3 className="mt-8 mb-2">How Fusion Potash is applied in VAN’s crop plans</h3>}
          {p.slug === 'fusion-potash' && <p className="small mt-2 max-w-[140ch]">Depending on the crop plan, Fusion Potash is drilled at sowing (broadcast if there is no drill), broadcast, or applied by fertigation. Your crop’s plan gives the method.</p>}
          {/* Tahir 10 Nov 2026 (LM-N34): "Dealers say fertigation, and drone use goes only through VAN." Same 2 sentences as the One Tank page. */}
          {p.slug === 'v-germinator-pro' && <p className="small mt-3 max-w-[140ch]">Dealers sell V-Germinator Pro for fertigation. Drone spraying of V-Germinator Pro is done only through VAN.</p>}
        </div>
      </div>

      <section className="grid lg:grid-cols-3 gap-4 mt-12">
        {!p.family && <div className="panel p-5"><div className="cap uppercase tracking-[.08em] font-bold">Documents</div><div className="display text-[19px] mt-1">Product deck, technical data sheet and safety data sheet</div><p className="small muted mt-1">These documents explain what the product is, how it works, when in the season it is used and the limits on its use.</p><div className="flex flex-wrap gap-2 mt-3"><a className="btn btn-ghost btn-sm" href={lmsUrl(p)} target="_blank" rel="noopener">⬇ Product deck (PDF)</a>{tdsUrls(p).map(([label, href]) => <a key={href} className="btn btn-ghost btn-sm" href={href} target="_blank" rel="noopener">{label}</a>)}<a className="btn btn-ghost btn-sm" href={sdsUrl(p)} target="_blank" rel="noopener">Safety data sheet</a></div></div>}
        <div className="panel-green p-5"><div className="cap uppercase tracking-[.08em] font-bold" style={{ color: 'var(--green-text)' }}>For distributors</div><div className="display text-[19px] mt-1">Sell {p.family ? 'the ' : ''}{p.name} in your territory</div><div className="mt-3"><a className="btn btn-navy btn-sm" href="#/become-a-dealer">Ask about range and territory →</a></div></div>
        <div className="panel-gold p-5"><div className="cap uppercase tracking-[.08em] font-bold" style={{ color: '#7A5A0E' }}>For farmers</div><div className="display text-[19px] mt-1">Find the crops and stages for {p.family ? 'the ' : ''}{p.name}</div><div className="mt-3 flex flex-wrap gap-2"><a className="btn btn-navy btn-sm" href="#/crops">The {COUNTS.cropPlans} crop plans</a></div></div>
      </section>
      {related.length > 0 && <div className="mt-8"><div className="cap font-bold uppercase tracking-[.08em] mb-2">Also in {p.catLabel}</div><div className="flex flex-wrap gap-2">{related.map(r => <a key={r.slug} className="chip chip-sm" href={`#/products/${r.slug}`}>{r.name}</a>)}</div></div>}
    </div>
  )
}
