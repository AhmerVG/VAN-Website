import { rateLabel } from '@/lib/season'
import { ALTERNATIVES } from '@/data/alternatives'
import { PRODUCTS, WHEAT_PLAN } from '@/data/catalogue'
import { wa, COUNTS } from '@/data/site'
import { PackShot, MethodIcon, WaButton, lmsUrl, productBySlug } from '@/components/bits'
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
const CROP_FORCE_TDS: [string, string][] = [['Datasheet 15-15-15', 'https://www.van.com.pk/spec-sheets/VAN-TDS-Crop-Force-15-15-15.pdf'], ['Datasheet 12-12-18', 'https://www.van.com.pk/spec-sheets/VAN-TDS-Crop-Force-12-12-18.pdf']]
const tdsUrls = (p: { name: string; slug: string }): [string, string][] => (p.slug === 'crop-force' ? CROP_FORCE_TDS : [['Datasheet', `https://www.van.com.pk/spec-sheets/VAN-TDS-${docStem(p)}.pdf`]])
const sdsUrl = (p: { name: string; slug: string }) => `https://www.van.com.pk/sds/VAN-SDS-${docStem(p)}.pdf`

/** B's layout with A's spec-sheet block and "Programmes that use it"; the soil strip sits above the order CTA. */
/**
 * The three brands that do NOT hold a PSQCA manufacturing licence, each with the reason VAN's own
 * regulatory page already publishes. Kept as verbatim status, not as a softened version of the
 * blanket claim: "under registration" and "no licence applies" are different facts and a reader
 * checking the regulatory page must find the same sentence on both.
 */
const REGISTRATION_EXCEPTIONS: Record<string, string> = {
  'sop': 'No VAN licence applies. SOP is a traded commodity, not a VAN manufacture. It is released through VAN’s own PNAC-accredited laboratory, ISO/IEC 17025:2017, LAB 336, like everything else that leaves here.',
  'v-mag-essential': 'No PSQCA licence. It carries a conformance report instead. Released through VAN’s own PNAC-accredited laboratory, ISO/IEC 17025:2017, LAB 336.',
  'v-compost': 'Registered with the Soil Fertility Research Institute, not with PSQCA. Compost is registered under a different regime. Released through VAN’s own PNAC-accredited laboratory, ISO/IEC 17025:2017, LAB 336.',
}

export default function ProductPage({ slug }: { slug: string }) {
  if (slug === 'vital-urea') return <VitalUrea />
  const p = productBySlug(slug)
  if (!p) {
    return (
      <div className="wrap py-16 text-center">
        <h1>No product by that name.</h1>
        <p className="lead mx-auto mt-4">Try the full list. {PRODUCTS.filter(x => !x.family).length} brands, every analysis published.</p>
        <a className="btn btn-gold mt-6" href="#/products">All products →</a>
      </div>
    )
  }
  const wheatRows = WHEAT_PLAN.filter(r => r.slug === p.slug)
  const members = p.family ? PRODUCTS.filter(x => !x.family && x.cat === 'P' && /6-32/.test(x.analysis)) : []
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
      <p className="cap"><a href="#/products">Our brands</a> / {p.catLabel} / {p.name}</p>
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-12 mt-4 items-start">
        <div className="lg:sticky lg:top-20">
          <div className="panel p-6 flex items-center justify-center" style={{ minHeight: 360, background: 'linear-gradient(180deg,#fff,var(--sand-2))' }}>
            {p.family ? <FamilyShot /> : <PackShot slug={p.slug} hi style={{ maxHeight: 400, width: 'auto' }} />}
          </div>
          {!p.family && <Pack3D slug={p.slug} name={p.name} />}
        </div>
        <div>
          <div className="flex flex-wrap gap-2"><span className="tag tag-navy">{p.catLabel}</span>{p.exclusive ? <span className="tag tag-gold">VAN exclusive</span> : <span className="tag tag-green">{p.badge}</span>}</div>
          <h1 className="mt-3">{p.name}</h1>
          <p className="lead mt-3" style={{ color: 'var(--navy)' }}>{p.analysis}</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            <div className="panel p-4"><div className="cap uppercase tracking-[.08em] font-bold">How it is applied</div><div className="flex flex-wrap gap-2 mt-2">{p.methods.map(m => <span key={m} className="chip chip-sm" style={{ cursor: 'default' }}><MethodIcon method={m} size={18} />{m}</span>)}</div></div>
            <div className="panel p-4"><div className="cap uppercase tracking-[.08em] font-bold">Stage</div><div className="flex flex-wrap gap-2 mt-2">{p.stages.map(s => <span key={s} className="chip chip-sm gold on" style={{ cursor: 'default' }}>{s}</span>)}</div></div>
          </div>
          {p.family && (
            <div className="panel-soil p-4 mt-4">
              <p className="small">3 grades, engineered against calcium fixation: 6-32 (Green Phosphate) · 5-40 · 8-38. The 6-32 grade is sold as a brand:</p>
              <div className="flex flex-wrap gap-2 mt-2">{members.map(m => <a key={m.slug} className="btn btn-white btn-sm" href={`#/products/${m.slug}`}>{m.name} →</a>)}</div>
            </div>
          )}
          {/* Tahir 9 Sep: the two phosphates are offered as a choice, both ways round. Neither page
              tells the reader the other is better. It states what differs and links across. */}
          {altPair && (
            <div className="panel-soft p-4 mt-5">
              <span className="eyebrow navy">Your choice</span>
              <p className="small mt-1 max-w-[140ch]">
                <b>{p.name}</b> and <a href={`#/products/${altPair.otherSlug}`}>{altPair.otherName}</a> are both
                offered against the phosphorus line in every programme that names one of them. The plan's
                number of bags is the same either way; what goes on the field is not.
              </p>
              <p className="cap mt-2 max-w-[140ch]">{altPair.difference}</p>
            </div>
          )}
          <div className="mt-5"><ProductSoilStrip product={p} /></div>
          {/* 26 Sep 2026 · Tahir: circularity was hidden; link it "closer to potash products". Worded to the
              circular page's own limit: recovered potassium goes into every potash grade as a raw material,
              so no single bag is claimed to contain it. */}
          {p.cat === 'K' && (
            <a className="pp-loop mt-4" href="#/circular-economy">
              <span className="pp-loop-k">Where VAN’s potash comes from</span>
              <span>About 1 in 5 tonnes of the potash VAN uses is recovered from crop residue ash, not imported. It is used as a raw material across VAN’s potash grades, and VAN does not publish which, so no bag is marked with it.</span>
              <span className="pp-loop-a">See how →</span>
            </a>
          )}
          <div className="flex flex-wrap gap-3 mt-5">
            <WaButton href={orderHref} lg>Order on WhatsApp</WaButton>
            <a className="btn btn-ghost btn-lg" href="#/verify">Verify a bag</a>
          </div>
          <p className="cap mt-3">Tell us the quantity and your district. We reply with price, availability and delivery. Every batch is tested in {COUNTS.lab}, {COUNTS.labStd}.</p>

          <h2 className="text-[clamp(24px,2.4vw,32px)] mt-10 mb-2">Specification</h2>
          <div className="spec">
            <div className="k">Product</div><div className="font-semibold">{p.name}{p.family ? '. A family of 3 grades' : ''}</div>
            <div className="k">Analysis</div><div>{p.analysis}</div>
            <div className="k">Category</div><div>{p.catLabel}</div>
            <div className="k">Application</div><div>{p.methods.join(' · ')}</div>
            <div className="k">Stage</div><div>{p.stages.join(' · ')}</div>
            <div className="k">Availability</div><div><span className={`tag ${p.exclusive ? 'tag-gold' : 'tag-green'}`}>{p.badge}</span>{!p.exclusive && <span className="cap ml-3">Same specification, your brand name. Same line, same QC, your label.</span>}</div>
            {/* O-16/audit item 2, 9 Sep 2026 (Tahir ruled: pull the claim, keep the product). Every
                product page carried the same blanket "Registered with PSQCA" line, including the three
                that do not hold a PSQCA licence, and VAN's OWN regulatory page says so plainly. On a
                site whose whole argument is that every claim traces to a document, a product page
                cannot contradict the regulatory page. Each of the three now states its real status,
                taken verbatim from the reason the regulatory page already gives.
                Revert: delete REGISTRATION_EXCEPTIONS and restore the single blanket sentence. */}
            <div className="k">Registration</div><div>{REGISTRATION_EXCEPTIONS[p.slug] ?? `Registered with PSQCA and released through VAN’s own PNAC-accredited laboratory, ISO/IEC 17025:2017, ${COUNTS.lab}.`}{!REGISTRATION_EXCEPTIONS[p.slug] && p.slug === 'v-phosphate' && <span className="cap block mt-1">Held on that licence as <strong>V-Phosphate 10-44-0</strong>, the name printed on the registration. Registered as V-Ammonium Phosphate 12-44-0 until July 2026. Same product.</span>}</div>
            <div className="k">Certificate</div><div>Send the batch number off the bag and VAN sends the certificate of analysis for that batch. <a href="#/verify">Verify a bag →</a></div>
          </div>

          {/* D-196, 27 Sep 2026: the flagship treatment. Vital Urea has its own page (VitalUrea.tsx) and
              carries the same block there. */}
          {FLAGSHIP_SLUGS.includes(p.slug) && <div className="mt-10"><Flagship slug={p.slug} /></div>}
          {/* D-207, 27 Sep 2026: drill first, side-dress second, broadcast last, on every basal granule. */}
          <ApplicationMethods slug={p.slug} />

          <h2 className="text-[clamp(24px,2.4vw,32px)] mt-10 mb-2">Programmes that use it</h2>
          {wheatRows.length > 0 ? (
            <>
              <p className="cap mb-3">From the published wheat programme. Per acre. “1 bag” means 1 bag of the size printed under the rate.</p>
              <div className="panel overflow-x-auto"><table className="tbl">
                <thead><tr><th>Crop</th><th>Stage</th><th>Band</th><th className="r">Rate</th><th>Method</th><th>Pack</th></tr></thead>
                <tbody>{wheatRows.map((r, i) => <tr key={i}><td className="font-semibold"><a href="#/crops/wheat">Wheat</a></td><td>{r.stage}</td><td>{r.band}</td><td className="r num font-semibold">{rateLabel(r)}</td><td><span className="inline-flex items-center gap-1"><MethodIcon method={r.method} size={16} />{r.method}</span></td><td>{r.pack.replace(' - ', ' · ')}</td></tr>)}</tbody>
              </table></div>
              <a className="btn btn-gold btn-sm mt-3" href="#/crops/wheat">Open the wheat programme →</a>
            </>
          ) : (
            <p className="small max-w-[140ch]">{p.name} does not appear in the wheat programme. The crop plans show which programmes use it. <a href="#/crops">The crop plans →</a></p>
          )}
          {p.slug === 'green-phosphate' && <p className="small mt-4 max-w-[140ch]">Green Phosphate is the NP Range 6-32 grade. Humic-coated and acidic, engineered against calcium fixation. <a href="#/products/np-range">The VAN NP Range →</a></p>}
          {/* 11 Sep 2026 · Tahir's rulings on the agronomy decision sheet, items A3, A4 and B3. The
              product pages named one method each while the crop plans used another; he ruled that
              both are real and that the page should say so, rather than one side being corrected to
              match the other. Green Sulfur also carries the crop-driven rate range, which he
              confirmed is deliberate. Revert: delete these two lines. */}
          {p.slug === 'green-sulfur' && <p className="small mt-4 max-w-[140ch]">Green Sulfur goes on both ways. It is broadcast at land preparation in some programmes and fertigated in others. Broadcasting gives elemental sulfur soil contact, and weeks for soil microbes to oxidise it into the sulfate a root can take up. <b>The rate is crop-driven and ranges from about 2 kg an acre on wheat and the pulses to about 10 kg on cotton, maize, potato and garlic.</b> That spread is deliberate. Your crop’s programme shows the method and the rate.</p>}
          {p.slug === 'fusion-potash' && <p className="small mt-4 max-w-[140ch]">Fusion Potash goes on both ways. It is broadcast at land preparation in some programmes and fertigated in others. Your crop’s programme shows the method.</p>}
        </div>
      </div>

      <section className="grid lg:grid-cols-3 gap-4 mt-12">
        {!p.family && <div className="panel p-5"><div className="cap uppercase tracking-[.08em] font-bold">Documents</div><div className="display text-[19px] mt-1">Deck, datasheet, safety data</div><p className="small muted mt-1">What it is, what it does in the soil, where it fits in the season and what VAN will not claim for it.</p><div className="flex flex-wrap gap-2 mt-3"><a className="btn btn-ghost btn-sm" href={lmsUrl(p)} target="_blank" rel="noopener">⬇ Deck (PDF)</a>{tdsUrls(p).map(([label, href]) => <a key={href} className="btn btn-ghost btn-sm" href={href} target="_blank" rel="noopener">{label}</a>)}<a className="btn btn-ghost btn-sm" href={sdsUrl(p)} target="_blank" rel="noopener">Safety data</a></div></div>}
        <div className="panel-green p-5"><div className="cap uppercase tracking-[.08em] font-bold" style={{ color: 'var(--green-text)' }}>For distributors</div><div className="display text-[19px] mt-1">Carry it in your territory</div><div className="mt-3"><a className="btn btn-navy btn-sm" href="#/become-a-dealer">Range and territory →</a></div></div>
        <div className="panel-gold p-5"><div className="cap uppercase tracking-[.08em] font-bold" style={{ color: '#7A5A0E' }}>For farmers</div><div className="display text-[19px] mt-1">Which crop, which stage?</div><div className="mt-3 flex flex-wrap gap-2"><a className="btn btn-navy btn-sm" href="#/crops">The {COUNTS.cropPlans} crop plans</a></div></div>
      </section>
      {related.length > 0 && <div className="mt-8"><div className="cap font-bold uppercase tracking-[.08em] mb-2">Also in {p.catLabel}</div><div className="flex flex-wrap gap-2">{related.map(r => <a key={r.slug} className="chip chip-sm" href={`#/products/${r.slug}`}>{r.name}</a>)}</div></div>}
    </div>
  )
}
