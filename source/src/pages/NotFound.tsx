import { CROPS, PRODUCTS } from '@/data/catalogue'
import { SOIL_HEADLINE } from '@/data/soilLens'
import { WaButton } from '@/components/bits'
import { WA } from '@/data/site'

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
  { href: '#/crops', tone: 'green', label: 'Crop nutrition plans', what: `All ${CROPS.length} programmes. Stage by stage, with product, rate and application method for each.` },
  { href: '#/products', tone: 'navy', label: 'Products', what: `Every VAN brand, ${PRODUCTS.filter(p => !p.family).length} of them, with its registered analysis, pack sizes and where it fits in the season.` },
  { href: '#/soil', tone: 'soil', label: 'Soil Atlas', what: `${SOIL_HEADLINE.samples} soil samples across ${SOIL_HEADLINE.districts} districts, read district by district.` },
  { href: '#/tools', tone: 'gold', label: 'Vitalytics', what: 'The nutrition creator, the discipline simulator, the unit and bag converter, and an honest list of what is not built yet.' },
  { href: '#/knowledge', tone: 'rust', label: 'Knowledge', what: 'The national picture, the state of the soil, and how a nutrient is delivered. Every figure sourced and dated.' },
  { href: '#/lab', tone: 'navy', label: 'VAN Lab', what: 'All 21 tests with every price and turnaround published, and the blind chain behind them.' },
]

export default function NotFound() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(180deg, var(--sand-2), var(--sand))' }}>
        <div className="wrap py-8 lg:py-12">
          <span className="eyebrow rust">404 · page not found</span>
          {/* D-151 (QA 38): was "This page isn’t here. The field still is." */}
          <h1 className="max-w-[22ch]">This page is not here. <span style={{ color: 'var(--rust-text)' }}>The links below go to the main parts of the site.</span></h1>
          <p className="lead mt-4 max-w-[140ch]">Either the address has a typo in it, or we moved the page when the site was rebuilt and did not leave a forwarding note. Both are ours to fix. If you followed a link to get here, send it to us on WhatsApp and we will.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a className="btn btn-navy" href="#/">Back to the home page</a>
            <a className="btn btn-ghost" href="#/crops">Find your crop →</a>
          </div>
        </div>
      </section>

      <section className="sec"><div className="wrap">
        <div className="mb-7 lg:mb-9">
          <span className="eyebrow navy"><span className="k-num">01</span>Where you were probably going</span>
          <h2 className="max-w-[24ch]">6 places, and what is in each.</h2>
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
          <div><h3>Followed a link and landed here?</h3><p className="mt-2" style={{ color: 'rgba(255,255,255,.8)' }}>Send us the address you clicked. A broken link on our own site is a fault we want reported, and the agronomy team answers on the same line as everything else.</p></div>
          <WaButton href={WA.farmer} lg>Tell us on WhatsApp</WaButton>
        </div>
      </section>
    </div>
  )
}
