import { PRODUCTS } from '@/data/catalogue'
import { NUTRIENTS_17, NUTRIENTS_FULL, NUTRIENT_GROUPS, LIEBIG, type NutrientGroup } from '@/data/nutrients'
import { LiebigBarrel } from '@/components/LiebigBarrel'
import { PackShot, noStop } from '@/components/bits'
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
      {brief && <span className="nt-brief">{group === 'air' ? 'from air and water' : 'not on VAN’s soil report'}</span>}
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
          <h1 className="max-w-[20ch]">The 17 nutrients a crop needs, and why the one in shortest supply limits the harvest</h1>
          <p className="lead mt-4">A crop needs 17 nutrients. It takes 3 of them from air and water and the other 14 from the soil, in amounts that range from tens of kilograms an acre down to grams an acre. Crops use these nutrients in the same way on every farm. A grower who understands how they work can make better fertiliser choices. Each nutrient has its own job in the plant, its own signs of shortage, and other nutrients it works with or against. Liebig’s Law of the Minimum explains why a crop given plenty of urea can still grow poorly: growth is limited by the nutrient in shortest supply.</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <a className="btn btn-gold" href="#barrel" onClick={e => { e.preventDefault(); document.getElementById('barrel')?.scrollIntoView({ behavior: 'smooth' }) }}>Try the nutrient barrel with your own bags</a>
            <a className="btn btn-ghost" href="#/crops">The 28 crop plans</a>
          </div>
        </div>
      </section>

      {/* The 17, as tiles by group */}
      <section className="sec"><div className="wrap">
        <div className="nt-groups">
          {GROUP_ORDER.map(g => (
            <div key={g} className="nt-group" style={{ background: GROUP_COL[g] }}>
              <div className="nt-group-h">
                <h2 className="text-[clamp(20px,1.8vw,24px)]">{noStop(NUTRIENT_GROUPS[g].title)}</h2>
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
        <h2 className="max-w-[26ch]">{noStop(LIEBIG.h2)}</h2>
        <p className="lead mt-3">{LIEBIG.lead}</p>
        <div className="mt-6"><LiebigBarrel /></div>
      </div></section>

      {/* The 11 in full */}
      <section className="sec"><div className="wrap">
        <span className="eyebrow">The 11 nutrients a grower manages</span>
        <h2>What each nutrient does, what a shortage looks like, and which nutrients it works with</h2>
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
                  {n.pakistan && <><dt>In Pakistan’s soils</dt><dd>{n.pakistan}</dd></>}
                </dl>
                <div className="nt-van">
                  <span className="cap">VAN products that contain it</span>
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
        <h2>The other 6 nutrients: carbon, hydrogen, oxygen, chlorine, molybdenum and nickel</h2>
        <div className="nt-brief-grid">
          {NUTRIENTS_17.filter(n => n.brief).map(n => (
            <div key={n.key} className="nt-brief-card">
              <span className="nt-sym">{n.symbol}</span>
              <div><b>{n.name}</b><p className="small muted mt-1">{n.brief}</p></div>
            </div>
          ))}
        </div>
        {/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction. A caption describing the page's own sourcing rules came off. */}
        <div className="flex flex-wrap gap-3 mt-5">
          <a className="btn btn-navy" href="#/soil">Read your district in the Soil Atlas</a>
          <a className="btn btn-ghost" href="#/crops">Pick your crop plan</a>
          <a className="btn btn-ghost" href="#/products">The 23 brands</a>
        </div>
      </div></section>
    </div>
  )
}
