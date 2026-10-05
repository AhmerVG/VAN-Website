import { useState } from 'react'
import { PRODUCTS } from '@/data/catalogue'
import { PackShot, SectionHead, MethodIcon } from './bits'

const METHODS = ['Broadcast', 'Fertigation', 'Foliar'] as const

/** The 23 products by how you apply them — toggle a method, the rail refilters. */
export function ProductRail() {
  const [m, setM] = useState<string>('Broadcast')
  const brands = PRODUCTS.filter(p => !p.family)
  const list = brands.filter(p => p.methods.includes(m))
  return (
    <section className="sec" id="rail">
      <div className="wrap">
        <SectionHead eyebrow={`The ${brands.length} products`} title="By how you apply them." lead="Pick the way you put fertilizer on. These are the VAN products made for that method." right={<a className="btn btn-ghost" href="#/products">All {brands.length} products →</a>} />
        <div className="flex flex-wrap gap-2 mb-3" role="tablist" aria-label="Application method">
          {METHODS.map(x => <button key={x} role="tab" aria-selected={m === x} className={`chip ${m === x ? 'on' : ''}`} onClick={() => setM(x)}><MethodIcon method={x} size={20} />{x} <span className="cap" style={{ color: m === x ? 'rgba(255,255,255,.7)' : undefined }}>{brands.filter(p => p.methods.includes(x)).length}</span></button>)}
        </div>
        <div className="hrail">
          {list.map(p => (
            <a key={p.slug} href={`#/products/${p.slug}`} className="panel tile" style={{ width: 210 }}>
              <div className="shot"><PackShot slug={p.slug} /></div>
              <div className="p-3">
                <div className="tag tag-navy">{p.catLabel}</div>
                <div className="display text-[19px] mt-2 leading-tight">{p.name}</div>
                <div className="cap mt-1" style={{ minHeight: 38 }}>{p.analysis}</div>
                <div className="flex flex-wrap gap-1 mt-2">{p.stages.map(s => <span key={s} className="tag tag-green">{s}</span>)}</div>
              </div>
            </a>
          ))}
        </div>
        <p className="cap">▸ Swipe the rail · tap a pack to open it</p>
      </div>
    </section>
  )
}
