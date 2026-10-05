import { PRODUCTS } from '@/data/catalogue'
import { NUTRIENTS_17, NUTRIENTS_FULL, NUTRIENT_GROUPS, LIEBIG, type NutrientGroup } from '@/data/nutrients'
import { LiebigBarrel } from '@/components/LiebigBarrel'
import { PackShot } from '@/components/bits'
import { useUrduMode } from '@/lib/readingMode'

/**
 * THE 17 NUTRIENTS — 26 September 2026, D-186. See data/nutrients.ts for the brief, the rulings
 * and what is and is not claimed. This page is the grower's door into the chemistry: the 17
 * named, the 11 he decides in full, and the barrel he can put his own bags into.
 */

const GROUP_ORDER: NutrientGroup[] = ['air', 'major', 'secondary', 'micro']
const GROUP_COL: Record<NutrientGroup, string> = { air: 'var(--sky)', major: 'var(--green-soft)', secondary: 'var(--gold-soft)', micro: 'var(--soil-soft)' }

function Tile({ k, symbol, name, brief, urdu, urduOn, group }: { k: string; symbol: string; name: string; brief?: string; urdu?: string; urduOn: boolean; group: NutrientGroup }) {
  const href = brief ? '#trace' : `#${k}`
  return (
    <a href={href} className="nt-tile" onClick={e => { e.preventDefault(); document.getElementById(brief ? 'trace' : k)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>
      <span className="nt-sym">{symbol}</span>
      <span className="nt-name">{name}{urduOn && urdu ? <span dir="rtl" lang="ur" className="block urdu nt-ur">{urdu}</span> : null}</span>
      {brief && <span className="nt-brief">{group === 'air' ? 'from air and water' : 'not on the soil report'}</span>}
    </a>
  )
}

export default function Nutrients() {
  const [urduOn] = useUrduMode()
  const product = (slug: string) => PRODUCTS.find(p => p.slug === slug)
  return (
    <div className="nt">
      <section style={{ background: 'linear-gradient(180deg, #EDF2E7 0%, var(--sand) 100%)' }}>
        <div className="wrap py-8 lg:py-10">
          <span className="eyebrow">Knowledge · the 17 nutrients</span>
          <h1 className="max-w-[20ch]">Every nutrient a crop eats, and why the shortest one decides the harvest.</h1>
          <p className="lead mt-4">A crop needs 17 nutrients. It takes 3 from air and water and 14 from the soil, in amounts from bags an acre down to a pinch. Nobody has to ask VAN for this. It is chemistry, it is the same on every farm, and a grower who knows it buys differently. This page sets out what each nutrient does, what a crop looks like without it, which nutrients work as pairs, and the 1 law that explains why a field full of urea can still stop growing.</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <a className="btn btn-gold" href="#barrel" onClick={e => { e.preventDefault(); document.getElementById('barrel')?.scrollIntoView({ behavior: 'smooth' }) }}>Put your own bags in the barrel</a>
            <a className="btn btn-ghost" href="#/crops">The 28 crop programmes</a>
          </div>
        </div>
      </section>

      {/* The 17, as tiles by group */}
      <section className="sec"><div className="wrap">
        <div className="nt-groups">
          {GROUP_ORDER.map(g => (
            <div key={g} className="nt-group" style={{ background: GROUP_COL[g] }}>
              <div className="nt-group-h">
                <h2 className="text-[clamp(20px,1.8vw,24px)]">{NUTRIENT_GROUPS[g].title}</h2>
                <p className="small muted mt-1">{NUTRIENT_GROUPS[g].lead}</p>
              </div>
              <div className="nt-tiles">
                {NUTRIENTS_17.filter(n => n.group === g).map(n => <Tile key={n.key} k={n.key} symbol={n.symbol} name={n.name} brief={n.brief} urdu={n.urdu} urduOn={urduOn} group={n.group} />)}
              </div>
            </div>
          ))}
        </div>
      </div></section>

      {/* The law and the barrel */}
      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <span className="eyebrow soil">The Law of the Minimum · Justus von Liebig, 1840s</span>
        <h2 className="max-w-[26ch]">{LIEBIG.h2}</h2>
        <p className="lead mt-3">{LIEBIG.lead}</p>
        <div className="mt-6"><LiebigBarrel /></div>
      </div></section>

      {/* The 11 in full */}
      <section className="sec"><div className="wrap">
        <span className="eyebrow">The 11 you decide</span>
        <h2>What each one does, what its shortage looks like, and what it needs beside it.</h2>
        <div className="nt-list">
          {NUTRIENTS_FULL.map(n => (
            <article key={n.key} id={n.key} className="nt-entry">
              <div className="nt-entry-head">
                <span className="nt-entry-sym">{n.symbol}</span>
                <div>
                  <h3>{n.name}{urduOn && n.urdu ? <span dir="rtl" lang="ur" className="block urdu" style={{ fontSize: 17, fontWeight: 400 }}>{n.urdu}</span> : null}</h3>
                  <span className="cap">{NUTRIENT_GROUPS[n.group].title}</span>
                </div>
              </div>
              <div className="nt-entry-body">
                <p className="nt-job">{n.job}</p>
                <dl className="nt-dl">
                  {n.short && <><dt>When it is short</dt><dd>{n.short}</dd></>}
                  {n.partners && <><dt>Works with, and against</dt><dd>{n.partners}</dd></>}
                  {n.pakistan && <><dt>On Pakistani ground</dt><dd>{n.pakistan}</dd></>}
                </dl>
                <div className="nt-van">
                  <span className="cap">VAN carries it in</span>
                  <div className="nt-van-row">
                    {n.van.map(slug => { const p = product(slug); return p ? (
                      <a key={slug} href={`#/products/${slug}`} className="nt-prod">
                        <PackShot slug={slug} style={{ height: 44, width: 'auto' }} />
                        <span><b>{p.name}</b><span className="cap block">{p.analysis}</span></span>
                      </a>
                    ) : null })}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div></section>

      {/* The 6 in a line each */}
      <section className="sec" id="trace" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <span className="eyebrow soil">The other 6</span>
        <h2>3 from air and water, 3 that VAN’s soil report does not test.</h2>
        <div className="nt-brief-grid">
          {NUTRIENTS_17.filter(n => n.brief).map(n => (
            <div key={n.key} className="nt-brief-card">
              <span className="nt-sym">{n.symbol}</span>
              <div><b>{n.name}</b><p className="small muted mt-1">{n.brief}</p></div>
            </div>
          ))}
        </div>
        <p className="cap mt-4 max-w-[120ch]">What each nutrient does and how its shortage shows are textbook plant nutrition, written here in plain words and carrying no figure. Every number on this page is one this site already publishes with its source: the Punjab soil survey on the Soil Atlas, the Crop Force bag’s printed line on potash, the crop programmes and their balance blocks, and the registered analysis on each product page. No deficiency percentage, yield response or trial figure has been added.</p>
        <div className="flex flex-wrap gap-3 mt-5">
          <a className="btn btn-navy" href="#/soil">Read your district in the Soil Atlas</a>
          <a className="btn btn-ghost" href="#/crops">Pick your crop programme</a>
          <a className="btn btn-ghost" href="#/products">The 23 products</a>
        </div>
      </div></section>
    </div>
  )
}
