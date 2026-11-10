import { CROPS, PRODUCTS } from '@/data/catalogue'
import { SOIL_HEADLINE } from '@/data/soilLens'
import { WaButton } from '@/components/bits'
import { WA } from '@/data/site'
import { HorseMark } from '@/components/HorseMark'

/**
 * 404 — added 9 Sep 2026 (D-47).
 *
 * The static build shipped without one. Uploading on top of the live site meant the OLD site's 404
 * page would keep answering for the NEW site — old design, old navigation, and links into pages that
 * may no longer exist. This is the new build's own.
 *
 * Two things make this file different from every other page in the build:
 *  1. It is served by Apache at whatever URL the visitor actually asked for, which can be at any
 *     depth (/crops/does-not-exist). Every other page writes its assets and links RELATIVE to its
 *     own depth; this one must be ABSOLUTE or the stylesheet and the bundle 404 as well. The builder
 *     special-cases it (`absolute: true`).
 *  2. It carries robots noindex and is kept out of sitemap.xml — a 404 is not a page to index.
 *
 * The content is a real way back, not an apology: the two indexes a lost visitor most likely wanted
 * (products and crop plans), the tools, and the WhatsApp line the whole site ends in.
 */
const WAYS: { href: string; label: string; what: string; tone: string }[] = [
  { href: '#/crops', tone: 'green', label: 'Crop plans', what: `All ${CROPS.length} crop plans. For every crop stage, each plan gives the product to apply, the quantity per acre and the method of application.` },
  { href: '#/products', tone: 'navy', label: 'Products', what: `All ${PRODUCTS.filter(p => !p.family).length} VAN brands, each with its declared analysis, its pack sizes and the crop stage at which it is applied.` },
  { href: '#/soil', tone: 'soil', label: 'Soil Atlas', what: `Results of ${SOIL_HEADLINE.samples} soil samples from ${SOIL_HEADLINE.districts} districts of Punjab, tested in about 2016 to 2018, shown district by district.` },
  // D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction
  // L1 editor fix 7 Nov 2026 (company-a m21): the tool's name is 'Nutrition creator'. The simulator's name is left to the crops fixer.
  { href: '#/tools', tone: 'gold', label: 'Vitalytics', what: 'All our farm tools, including the Nutrition creator, the farm discipline simulator and the unit and bag converter, and the tools still being built.' },
  { href: '#/knowledge', tone: 'rust', label: 'Knowledge', what: 'Articles on Pakistan’s fertiliser use, the condition of its soil and how nutrients are applied, with a source and date for every figure.' },
  { href: '#/lab', tone: 'navy', label: 'VAN Lab', what: 'All 21 fertiliser tests, with their published prices and turnaround times, and how every sample is coded so that the analysts do not know whose it is.' },
]

export default function NotFound() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(180deg, var(--sand-2), var(--sand))' }}>
        <div className="wrap py-8 lg:py-12">
          {/* V3: the horse, so a lost visitor still knows whose site this is. */}
          <HorseMark className="nf-horse" size={96} />
          <span className="eyebrow rust">404 · page not found</span>
          {/* D-151 (QA 38): was "This page isn’t here. The field still is." */}
          <h1 className="max-w-[22ch]">We cannot find this page</h1>
          <p className="lead mt-4 max-w-[140ch]">Either the address has a typing error, or the page moved when we rebuilt the site and the old address no longer leads to it. The links below go to the main parts of the site.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a className="btn btn-navy" href="#/">Back to the home page</a>
            <a className="btn btn-ghost" href="#/crops">Find your crop →</a>
          </div>
        </div>
      </section>

      <section className="sec"><div className="wrap">
        <div className="mb-7 lg:mb-9">
          <span className="eyebrow navy"><span className="k-num">01</span>Main links</span>
          <h2 className="max-w-[24ch]">The 6 main parts of the site</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {WAYS.map(w => (
            <a key={w.href} href={w.href} className="panel p-5 no-underline hover:border-[var(--navy)]">
              <span className={`eyebrow ${w.tone}`}>{w.label}</span>
              <p className="small muted mt-2">{w.what}</p>
              <p className="cap mt-3">Open →</p>
            </a>
          ))}
        </div>
      </div></section>

      <section className="wrap sec-tight">
        <div className="panel-navy p-6 lg:p-8 grid lg:grid-cols-[1fr_auto] gap-5 items-center">
          <div><h3>Report a broken link</h3><p className="mt-2" style={{ color: 'rgba(255,255,255,.8)' }}>If a link brought you here, send us that link on WhatsApp and we will fix it. Our agronomy team reads the messages on our WhatsApp number and will pass your message on.</p></div>
          <WaButton href={WA.farmer} lg>Tell us on WhatsApp</WaButton>
        </div>
      </section>
    </div>
  )
}
